import type { ArticleSummary } from "@/types/article";

/** An article summary plus its indexable body text. */
export interface SearchDocument extends ArticleSummary {
  searchText: string;
}

export interface RankedSearchDocument {
  article: SearchDocument;
  score: number;
}

/**
 * Scores a single article against pre-split search terms. Shared by the server
 * utilities and the client-side search experience so both rank consistently.
 */
export function scoreSearchDocument(
  document: SearchDocument,
  terms: string[],
): number {
  if (terms.length === 0) return 0;

  const title = document.title.toLowerCase();
  const description = document.description.toLowerCase();
  const category = document.category.toLowerCase();
  const tags = document.tags.join(" ").toLowerCase();
  const author = document.author.toLowerCase();
  const content = document.searchText.toLowerCase();

  let score = 0;

  for (const term of terms) {
    let termScore = 0;
    if (title.includes(term)) termScore += 14;
    if (title.startsWith(term)) termScore += 6;
    if (tags.includes(term)) termScore += 8;
    if (category.includes(term)) termScore += 6;
    if (description.includes(term)) termScore += 4;
    if (author.includes(term)) termScore += 2;
    if (content.includes(term)) termScore += 1;

    // Every term must match somewhere (implicit AND).
    if (termScore === 0) return 0;
    score += termScore;
  }

  return score;
}

export function splitSearchTerms(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);
}

export function rankSearchDocuments(
  documents: SearchDocument[],
  query: string,
): RankedSearchDocument[] {
  const terms = splitSearchTerms(query);
  if (terms.length === 0) return [];

  return documents
    .map((article) => ({ article, score: scoreSearchDocument(article, terms) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return Date.parse(b.article.publishedAt) - Date.parse(a.article.publishedAt);
    });
}
