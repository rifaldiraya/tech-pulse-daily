import GithubSlugger from "github-slugger";

export {
  cn,
  formatDate,
  formatDateISO,
  getInitials,
  getReadingTime,
  pluralise,
  stripMarkdown,
  toISODate,
  truncate,
} from "@/lib/format";

export function slugify(value: string): string {
  return new GithubSlugger().slug(value.trim().toLowerCase());
}

/** Safe page-number parser for pagination query params. */
export function parsePageParam(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    currentPage,
    totalPages,
    totalItems: items.length,
    hasPrevious: currentPage > 1,
    hasNext: currentPage < totalPages,
  };
}
