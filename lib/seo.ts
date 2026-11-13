import { SITE, absoluteUrl, getSiteUrl } from "@/lib/site";
import type { Article, ArticleSummary } from "@/types/article";

interface BreadcrumbItem {
  name: string;
  path: string;
}

export type JsonLd = Record<string, unknown>;

function publisher() {
  const url = getSiteUrl();
  return {
    "@type": "Organization",
    name: SITE.name,
    url,
    logo: {
      "@type": "ImageObject",
      url: `${url}/icon.svg`,
      width: 512,
      height: 512,
    },
  };
}

/**
 * The house byline is the editorial desk, which search engines should read as an
 * Organization tied to the real "about" page; outside contributors stay Persons
 * that name the publication they write for.
 */
function authorEntity(authorName: string): JsonLd {
  const siteUrl = getSiteUrl();
  const sameAs = SITE.social
    .map((item) => item.href)
    .filter((href) => /^https?:\/\//i.test(href));

  if (authorName.trim().toLowerCase() === SITE.author.toLowerCase()) {
    return {
      "@type": "Organization",
      name: authorName,
      url: absoluteUrl("/about"),
      sameAs,
    };
  }

  return {
    "@type": "Person",
    name: authorName,
    worksFor: { "@type": "Organization", name: SITE.name, url: siteUrl },
  };
}

export function buildWebsiteJsonLd(): JsonLd {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    alternateName: SITE.title,
    url,
    description: SITE.description,
    inLanguage: "en-US",
    publisher: publisher(),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildArticleJsonLd(article: Article | ArticleSummary): JsonLd {
  const url = absoluteUrl(`/articles/${article.slug}`);
  const image = absoluteUrl(article.coverImage);

  return {
    "@context": "https://schema.org",
    "@type": article.schemaType === "NewsArticle" ? "NewsArticle" : "Article",
    headline: article.title,
    description: article.description,
    image: [
      {
        "@type": "ImageObject",
        url: image,
        width: 1200,
        height: 750,
        caption: article.coverImageAlt,
      },
    ],
    datePublished: new Date(article.publishedAt).toISOString(),
    dateModified: new Date(article.updatedAt || article.publishedAt).toISOString(),
    author: authorEntity(article.author),
    publisher: publisher(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    articleSection: article.category,
    keywords: article.tags.join(", "),
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildCollectionJsonLd(
  name: string,
  description: string,
  path: string,
  articles: ArticleSummary[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: SITE.name,
      url: getSiteUrl(),
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/articles/${article.slug}`),
        name: article.title,
      })),
    },
  };
}

/** Serializes JSON-LD safely for inline script tags. */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
