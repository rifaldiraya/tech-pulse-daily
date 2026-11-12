import { Clock, User } from "lucide-react";
import { cn, formatDate } from "@/lib/format";
import type { ArticleSummary } from "@/types/article";

interface ArticleMetaProps {
  article: Pick<ArticleSummary, "author" | "publishedAt" | "readingTime">;
  className?: string;
  showAuthor?: boolean;
  showReadingTime?: boolean;
}

export function ArticleMeta({
  article,
  className,
  showAuthor = false,
  showReadingTime = true,
}: ArticleMetaProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted",
        className,
      )}
    >
      {showAuthor ? (
        <span className="inline-flex items-center gap-1.5">
          <User className="size-3.5" aria-hidden="true" />
          {article.author}
        </span>
      ) : null}
      <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, "short")}</time>
      {showReadingTime ? (
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden="true" />
          {article.readingTime} min read
        </span>
      ) : null}
    </div>
  );
}
