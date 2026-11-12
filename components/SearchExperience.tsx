"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { SearchX, Sparkles } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { SearchBar } from "@/components/SearchBar";
import { rankSearchDocuments, type SearchDocument } from "@/lib/search";
import type { ArticleSummary } from "@/types/article";

const SUGGESTIONS = ["AI", "security", "Next.js", "cloud", "Linux", "React"];

interface SearchExperienceProps {
  documents: SearchDocument[];
  popular: ArticleSummary[];
}

export function SearchExperience({ documents, popular }: SearchExperienceProps) {
  const [query, setQuery] = useState("");
  const [ready, setReady] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const trimmed = deferredQuery.trim();

  const results = useMemo(
    () => (trimmed ? rankSearchDocuments(documents, trimmed) : []),
    [documents, trimmed],
  );

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search)
      .get("q")
      ?.slice(0, 120);
    if (initial) setQuery(initial);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams(window.location.search);
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    const next = `${window.location.pathname}${params.size ? `?${params.toString()}` : ""}`;
    window.history.replaceState(null, "", next);
  }, [query, ready]);

  return (
    <div>
      <SearchBar
        value={query}
        onChange={setQuery}
        autoFocus
        placeholder="Search by title, category, tag, or phrase…"
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted">Try:</span>
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setQuery(suggestion)}
            className="rounded-full border border-hairline bg-canvas px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-brand hover:text-brand"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className="mt-8" aria-live="polite" aria-atomic="true">
        {trimmed ? (
          <div className="border-b border-hairline pb-4">
            <p className="text-sm text-muted">
              {results.length === 0
                ? "No articles matched"
                : `${results.length} ${results.length === 1 ? "article" : "articles"} matched`}{" "}
              <span className="font-semibold text-ink">“{trimmed}”</span>
            </p>
          </div>
        ) : null}
      </div>

      {trimmed ? (
        results.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {results.map(({ article }) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-hairline bg-subtle px-6 py-14 text-center">
            <SearchX className="mx-auto size-8 text-muted" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-bold text-ink">No results found</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              Try a shorter phrase, a category such as “cybersecurity”, or a tag
              like “typescript”. Search runs entirely in your browser against
              local article metadata.
            </p>
          </div>
        )
      ) : (
        <section className="mt-10" aria-labelledby="popular-searches">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-brand" aria-hidden="true" />
            <h2
              id="popular-searches"
              className="text-sm font-bold uppercase tracking-[0.12em] text-ink"
            >
              Popular starting points
            </h2>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
