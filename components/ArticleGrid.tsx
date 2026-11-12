import { ArticleCard } from "@/components/ArticleCard";
import { cn } from "@/lib/format";
import type { ArticleSummary } from "@/types/article";

interface ArticleGridProps {
  articles: ArticleSummary[];
  className?: string;
  columns?: 2 | 3 | 4;
  priorityCount?: number;
}

const COLUMNS: Record<NonNullable<ArticleGridProps["columns"]>, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function ArticleGrid({
  articles,
  className,
  columns = 3,
  priorityCount = 0,
}: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-hairline bg-subtle px-6 py-10 text-center text-sm text-muted">
        No articles have been published in this section yet.
      </p>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 gap-x-7 gap-y-10", COLUMNS[columns], className)}>
      {articles.map((article, index) => (
        <ArticleCard
          key={article.slug}
          article={article}
          priority={index < priorityCount}
          sizes={
            columns === 4
              ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              : columns === 2
                ? "(max-width: 640px) 100vw, 50vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          }
        />
      ))}
    </div>
  );
}
