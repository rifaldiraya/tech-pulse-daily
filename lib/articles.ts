import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { CATEGORIES, getCategoryBySlug } from "@/lib/categories";
import { getReadingTime, slugify, stripMarkdown, toISODate } from "@/lib/utils";
import type {
  Article,
  ArticleFrontmatter,
  ArticleSummary,
  CategoryWithCount,
} from "@/types/article";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const FALLBACK_COVER = "/images/articles/placeholder.png";
const WORDS_PER_MINUTE = 200;

export type SearchDocument = ArticleSummary & { searchText: string };

interface LoadResult {
  articles: Article[];
  errors: string[];
}

let cache: LoadResult | null = null;

function readFrontmatter(data: Record<string, unknown>, filename: string): ArticleFrontmatter | null {
  const warnings: string[] = [];
  const asString = (key: string, fallback = ""): string => {
    const value = data[key];
    if (typeof value === "string") return value.trim();
    if (typeof value === "number") return String(value);
    return fallback;
  };

  const title = asString("title");
  const description = asString("description") || asString("excerpt");
  const category = asString("category");
  const author = asString("author");
  const publishedAt = asString("publishedAt") || asString("date");

  if (!title) warnings.push("missing title");
  if (!description) warnings.push("missing description");
  if (!category) warnings.push("missing category");
  if (!author) warnings.push("missing author");
  if (!publishedAt || Number.isNaN(Date.parse(publishedAt))) {
    warnings.push("missing or invalid publishedAt");
  }

  if (warnings.length > 0) {
    console.warn(`[articles] Skipping ${filename}: ${warnings.join(", ")}`);
    return null;
  }

  const rawTags = data.tags;
  const tags = Array.isArray(rawTags)
    ? rawTags.map(String).map((tag) => tag.trim()).filter(Boolean)
    : typeof rawTags === "string"
      ? rawTags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [];

  const readingTime = Number(data.readingTime);
  const popularRank = Number(data.popularRank);

  return {
    title,
    slug: asString("slug") || undefined,
    description,
    category,
    tags,
    author,
    publishedAt: toISODate(publishedAt),
    updatedAt: asString("updatedAt") ? toISODate(asString("updatedAt")) : undefined,
    featured: data.featured === true || data.featured === "true",
    popular: data.popular === true || data.popular === "true",
    popularRank: Number.isFinite(popularRank) ? popularRank : 0,
    coverImage: asString("coverImage") || undefined,
    coverImageAlt: asString("coverImageAlt") || undefined,
    readingTime: Number.isFinite(readingTime) && readingTime > 0 ? Math.round(readingTime) : undefined,
    draft: data.draft === true || data.draft === "true",
  };
}

function resolveCategory(name: string) {
  const match = CATEGORIES.find(
    (category) => category.name.toLowerCase() === name.trim().toLowerCase(),
  );
  if (match) return { name: match.name, slug: match.slug };
  return { name: name.trim(), slug: slugify(name) };
}

function resolveCoverImage(value: string | undefined): string {
  if (!value) return FALLBACK_COVER;
  if (/^https?:\/\//i.test(value)) return value;
  const normalised = value.startsWith("/") ? value : `/${value}`;
  const onDisk = path.join(PUBLIC_DIR, normalised.replace(/^\/+/, ""));
  return fs.existsSync(onDisk) ? normalised : FALLBACK_COVER;
}

function loadArticles(): LoadResult {
  if (cache && process.env.NODE_ENV === "production") return cache;

  const errors: string[] = [];
  let filenames: string[] = [];

  try {
    filenames = fs
      .readdirSync(ARTICLES_DIR)
      .filter((file) => /\.mdx?$/.test(file) && !file.startsWith("."));
  } catch {
    errors.push(`Article directory not found: ${ARTICLES_DIR}`);
    cache = { articles: [], errors };
    return cache;
  }

  const articles: Article[] = [];

  for (const filename of filenames) {
    try {
      const filePath = path.join(ARTICLES_DIR, filename);
      const file = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(file);
      const frontmatter = readFrontmatter(data as Record<string, unknown>, filename);
      if (!frontmatter) continue;

      const fileSlug = filename.replace(/\.mdx?$/, "");
      const slug = slugify(frontmatter.slug || fileSlug);
      const category = resolveCategory(frontmatter.category);

      if (articles.some((article) => article.slug === slug)) {
        console.warn(`[articles] Skipping ${filename}: duplicate slug "${slug}"`);
        continue;
      }

      const plainContent = stripMarkdown(content);

      articles.push({
        slug,
        title: frontmatter.title,
        description: frontmatter.description,
        category: category.name,
        categorySlug: category.slug,
        tags: frontmatter.tags ?? [],
        author: frontmatter.author,
        publishedAt: frontmatter.publishedAt,
        updatedAt: frontmatter.updatedAt ?? frontmatter.publishedAt,
        featured: frontmatter.featured ?? false,
        popular: frontmatter.popular ?? false,
        popularRank: frontmatter.popularRank ?? 0,
        coverImage: resolveCoverImage(frontmatter.coverImage),
        coverImageAlt:
          frontmatter.coverImageAlt || `${frontmatter.title} — article cover image`,
        readingTime:
          frontmatter.readingTime ?? getReadingTime(content) ?? WORDS_PER_MINUTE,
        draft: frontmatter.draft ?? false,
        content,
        searchText: plainContent.slice(0, 8000),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${filename}: ${message}`);
      console.warn(`[articles] Failed to read ${filename}: ${message}`);
    }
  }

  articles.sort((a, b) => {
    const diff = Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
    return diff !== 0 ? diff : a.title.localeCompare(b.title);
  });

  cache = { articles, errors };
  return cache;
}

/** All published articles, newest first. Drafts are always excluded. */
export function getAllArticles(): Article[] {
  return loadArticles().articles.filter((article) => !article.draft);
}

export function getArticleBySlug(slug: string): Article | null {
  const article = loadArticles().articles.find((item) => item.slug === slug);
  if (!article || article.draft) return null;
  return article;
}

export function getFeaturedArticles(limit = 3): Article[] {
  return getAllArticles()
    .filter((article) => article.featured)
    .slice(0, limit);
}

export function getPopularArticles(limit = 4): Article[] {
  return getAllArticles()
    .filter((article) => article.popular)
    .sort((a, b) => {
      if (b.popularRank !== a.popularRank) return b.popularRank - a.popularRank;
      return Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
    })
    .slice(0, limit);
}

export function getLatestArticles(limit?: number): Article[] {
  const articles = getAllArticles();
  return typeof limit === "number" ? articles.slice(0, limit) : articles;
}

export function getArticlesByCategory(category: string): Article[] {
  const normalised = category.trim().toLowerCase();
  return getAllArticles().filter(
    (article) =>
      article.categorySlug === normalised || article.category.toLowerCase() === normalised,
  );
}

export function getArticlesByCategories(slugs: string[]): Article[] {
  const allowed = new Set(slugs);
  return getAllArticles().filter((article) => allowed.has(article.categorySlug));
}

export function getRelatedArticles(slug: string, limit = 3): Article[] {
  const source = getArticleBySlug(slug);
  if (!source) return [];

  const scored = getAllArticles()
    .filter((article) => article.slug !== slug)
    .map((article) => {
      let score = 0;
      if (article.categorySlug === source.categorySlug) score += 6;
      const sharedTags = article.tags.filter((tag) =>
        source.tags.some((sourceTag) => sourceTag.toLowerCase() === tag.toLowerCase()),
      );
      score += sharedTags.length * 3;
      return { article, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return Date.parse(b.article.publishedAt) - Date.parse(a.article.publishedAt);
    });

  const related = scored.slice(0, limit).map((entry) => entry.article);
  if (related.length < limit) {
    for (const article of getAllArticles()) {
      if (related.length >= limit) break;
      if (article.slug === slug || related.some((item) => item.slug === article.slug)) continue;
      related.push(article);
    }
  }
  return related;
}

export function searchArticles(query: string): Article[] {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);

  if (terms.length === 0) return [];

  return getAllArticles()
    .map((article) => {
      const title = article.title.toLowerCase();
      const description = article.description.toLowerCase();
      const category = article.category.toLowerCase();
      const tags = article.tags.join(" ").toLowerCase();
      const content = article.searchText.toLowerCase();

      let score = 0;
      for (const term of terms) {
        let termScore = 0;
        if (title.includes(term)) termScore += 12;
        if (tags.includes(term)) termScore += 7;
        if (category.includes(term)) termScore += 5;
        if (description.includes(term)) termScore += 4;
        if (content.includes(term)) termScore += 1;
        if (termScore === 0) return { article, score: 0 };
        score += termScore;
      }
      return { article, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return Date.parse(b.article.publishedAt) - Date.parse(a.article.publishedAt);
    })
    .map((entry) => entry.article);
}

/** Categories that actually have at least one published article. */
export function getAllCategories(): CategoryWithCount[] {
  const articles = getAllArticles();
  const counts = new Map<string, number>();
  const extras = new Map<string, CategoryWithCount>();

  for (const article of articles) {
    counts.set(article.categorySlug, (counts.get(article.categorySlug) ?? 0) + 1);
    if (!getCategoryBySlug(article.categorySlug) && !extras.has(article.categorySlug)) {
      extras.set(article.categorySlug, {
        slug: article.categorySlug,
        name: article.category,
        description: `Articles filed under ${article.category}.`,
        count: 0,
      });
    }
  }

  const known: CategoryWithCount[] = CATEGORIES.map((category) => ({
    ...category,
    count: counts.get(category.slug) ?? 0,
  })).filter((category) => category.count > 0);

  const unknown = [...extras.values()].map((category) => ({
    ...category,
    count: counts.get(category.slug) ?? 0,
  }));

  return [...known, ...unknown];
}

export function toSummary(article: Article): ArticleSummary {
  const { content: _content, searchText: _searchText, ...summary } = article;
  return summary;
}

export function getArticleSummaries(): ArticleSummary[] {
  return getAllArticles().map(toSummary);
}

/** Compact index used by the client-side search page. */
export function getSearchIndex(): SearchDocument[] {
  return getAllArticles().map((article) => ({
    ...toSummary(article),
    searchText: article.searchText,
  }));
}

export function getAdjacentArticles(slug: string): {
  previous: ArticleSummary | null;
  next: ArticleSummary | null;
} {
  const articles = getAllArticles();
  const index = articles.findIndex((article) => article.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: articles[index - 1] ? toSummary(articles[index - 1]) : null,
    next: articles[index + 1] ? toSummary(articles[index + 1]) : null,
  };
}

export function getAllArticleSlugs(): string[] {
  return getAllArticles().map((article) => article.slug);
}

export function getArticleCount(): number {
  return getAllArticles().length;
}

export { getReadingTime };
