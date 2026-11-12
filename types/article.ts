/**
 * Core content model for TechPulse.
 *
 * Articles are authored as Markdown files in `content/articles`. The shapes below
 * describe both the validated frontmatter and the derived, serialisable objects
 * that pages and components consume.
 */

export interface ArticleFrontmatter {
  title: string;
  slug?: string;
  description: string;
  category: string;
  tags?: string[];
  author: string;
  publishedAt: string;
  updatedAt?: string;
  featured?: boolean;
  popular?: boolean;
  popularRank?: number;
  coverImage?: string;
  coverImageAlt?: string;
  readingTime?: number;
  draft?: boolean;
}

export interface Article {
  /** URL-safe identifier, derived from frontmatter.slug or the filename. */
  slug: string;
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  featured: boolean;
  popular: boolean;
  popularRank: number;
  coverImage: string;
  coverImageAlt: string;
  readingTime: number;
  draft: boolean;
  /** Raw Markdown body (without frontmatter). */
  content: string;
  /** Plain text used by client-side search. */
  searchText: string;
}

/** Article without its Markdown body — safe to send to client components. */
export type ArticleSummary = Omit<Article, "content" | "searchText">;

export interface CategoryDefinition {
  slug: string;
  name: string;
  description: string;
  /** Optional broader grouping used by the homepage category sections. */
  tagline?: string;
}

export interface CategoryWithCount extends CategoryDefinition {
  count: number;
}

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface TocEntry extends Heading {
  children: Heading[];
}
