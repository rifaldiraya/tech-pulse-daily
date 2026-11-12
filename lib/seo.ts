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
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: [image],
    datePublished: new Date(article.publishedAt).toISOString(),
    dateModified: new Date(article.updatedAt || article.publishedAt).toISOString(),
    author: {
      "@type": "Person",
      name: article.author,
    },
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
