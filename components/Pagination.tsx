import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/format";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  /** Canonical path for page 1 when it lives outside the paginated route. */
  firstPagePath?: string;
  /** "query" builds ?page=n; "path" builds /basePath/n. */
  mode?: "query" | "path";
  /** Extra query parameters to preserve across page links. */
  query?: Record<string, string | undefined>;
  hash?: string;
  className?: string;
  label?: string;
}

function pageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((page) => pages.add(page));
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((page) => pages.add(page));

  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];

  sorted.forEach((page, index) => {
    const previous = sorted[index - 1];
    if (previous && page - previous > 1) result.push("ellipsis");
    result.push(page);
  });

  return result;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  firstPagePath,
  mode = "query",
  query = {},
  hash,
  className,
  label = "Pagination",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    if (page === 1 && firstPagePath) {
      return `${firstPagePath}${hash ? `#${hash}` : ""}`;
    }
    if (mode === "path") {
      return `${basePath}/${page}${hash ? `#${hash}` : ""}`;
    }
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    if (page > 1) params.set("page", String(page));
    const search = params.toString();
    return `${basePath}${search ? `?${search}` : ""}${hash ? `#${hash}` : ""}`;
  };

  const linkBase =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors";

  return (
    <nav aria-label={label} className={cn("flex flex-wrap items-center justify-center gap-2", className)}>
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          rel="prev"
          aria-label="Previous page"
          className={cn(linkBase, "border-hairline text-ink hover:border-brand hover:text-brand")}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={cn(linkBase, "cursor-not-allowed border-hairline text-muted opacity-50")}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </span>
      )}

      {pageNumbers(currentPage, totalPages).map((page, index) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-1 text-sm text-muted" aria-hidden="true">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              linkBase,
              page === currentPage
                ? "border-brand bg-brand text-white"
                : "border-hairline text-ink hover:border-brand hover:text-brand",
            )}
          >
            {page}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          rel="next"
          aria-label="Next page"
          className={cn(linkBase, "border-hairline text-ink hover:border-brand hover:text-brand")}
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={cn(linkBase, "cursor-not-allowed border-hairline text-muted opacity-50")}
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </span>
      )}
    </nav>
  );
}
