---
title: "How Retrieval-Augmented Generation Actually Works"
slug: "retrieval-augmented-generation-explained"
description: "A grounded tour of RAG pipelines, from chunking and embeddings to evaluation and the failure modes that quietly break production systems."
category: "Artificial Intelligence"
tags:
  - RAG
  - LLM
  - Embeddings
  - Search
author: "TechPulse Admin"
publishedAt: "2026-11-10"
updatedAt: "2026-11-11"
featured: true
popular: true
popularRank: 1
coverImage: "/images/articles/retrieval-augmented-generation-explained.png"
coverImageAlt: "Abstract illustration of documents flowing into a neural network"
readingTime: 9
draft: false
---

# How Retrieval-Augmented Generation Actually Works

Retrieval-augmented generation, or RAG, is often described as giving a language model "access to your documents." That description is technically true and practically misleading. A RAG system is a search engine, a prompt assembler, and a language model working together under a latency budget. When it disappoints, the cause is usually retrieval, not generation.

This guide walks through the architecture as engineers actually build it, with the trade-offs that matter in production.

## The pipeline, without the marketing

A typical RAG request has five stages:

1. **Normalise the question.** Rewrite follow-ups into a standalone query and expand obvious synonyms.
2. **Retrieve candidates.** Run lexical and vector search, then merge the result sets.
3. **Rerank.** Score a shortlist with a cross-encoder or a smaller domain model.
4. **Assemble context.** Select passages, deduplicate them, and attach source metadata.
5. **Generate with citations.** Ask the model to answer only from the supplied context and to name its sources.

Each stage has a measurable failure rate. If you only evaluate the final answer, you cannot tell whether the model ignored a good passage or never received one.

> A RAG system is only as good as the context you hand it. Generation quality is downstream of retrieval quality.

## Chunking is a product decision

Chunk size controls what a retrieved passage can explain. Small chunks improve precision but strip away the surrounding definitions. Large chunks preserve context but dilute the embedding and waste tokens.

| Strategy | Strength | Weakness |
| --- | --- | --- |
| Fixed 300-token windows | Simple, predictable cost | Splits tables and code |
| Heading-aware sections | Keeps semantic units intact | Uneven lengths |
| Sentence windows with overlap | Good recall on prose | Duplicate context |
| Parent-child chunks | Precise retrieval, rich context | More index complexity |

For documentation, heading-aware chunks usually outperform fixed windows. For support tickets and chat logs, smaller windows with overlap tend to work better because the useful answer is local.

```python
def chunk_by_heading(markdown: str, max_tokens: int = 400) -> list[dict]:
    sections, current = [], {"heading": "intro", "body": []}

    for line in markdown.splitlines():
        if line.startswith("## ") and current["body"]:
            sections.append(current)
            current = {"heading": line[3:], "body": []}
        current["body"].append(line)

    sections.append(current)
    return [
        {
            "heading": section["heading"],
            "text": "\n".join(section["body"]).strip()[: max_tokens * 4],
        }
        for section in sections
        if section["body"]
    ]
```

Character slicing is a rough proxy for tokens. In production, measure tokens with the same tokenizer the model uses.

## Hybrid retrieval earns its complexity

Dense embeddings are good at paraphrase. Keyword search is good at exact identifiers: error codes, product names, function signatures. Most real corpora need both.

A practical default is reciprocal rank fusion (RRF), which combines ranked lists without needing calibrated scores:

```text
score(d) = Σ 1 / (k + rank_i(d))
```

Use `k = 60` as a starting point, retrieve 50 candidates from each retriever, and rerank the top 20. This is cheap, robust, and easy to explain to the rest of the team.

## Evaluate retrieval before you tune prompts

Build a small evaluation set from real questions. For each question, label the documents that contain the answer. Then measure:

- **Recall@k** — did the correct passage appear in the top *k* results?
- **Mean reciprocal rank** — how high did the first correct passage rank?
- **Answer groundedness** — does every claim map to a retrieved source?
- **Abstention rate** — how often does the system correctly say it does not know?

A prompt change that improves eloquence while lowering recall is not an improvement. Track the stages separately.

## The failure modes that matter

**Context dilution.** Ten mediocre passages can bury the one that matters. Reranking and a hard context budget fix more systems than a larger model.

**Stale indexes.** Documents change and deletions are missed. Treat ingestion as a pipeline with observability, not a one-off script.

**Citation theatre.** A citation that does not support the sentence is worse than no citation. Validate that quoted spans actually appear in the source.

**Unanswerable questions.** If the corpus lacks the answer, the correct behaviour is abstention. Add an explicit instruction and test it.

## A pragmatic starting point

Ship the simplest version that can be evaluated: heading-aware chunks, hybrid retrieval, RRF, a reranker, and five to ten source passages. Instrument every stage. Only then consider query rewriting, graph retrieval, or fine-tuning.

RAG is not a feature you bolt onto a model. It is a retrieval product with a generation interface. Teams that treat it that way get answers they can defend — and users notice the difference.
