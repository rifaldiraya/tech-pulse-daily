import type { MetadataRoute } from "next";
import { getAllArticles, getAllCategories } from "@/lib/articles";
import { CATEGORIES } from "@/lib/categories";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const articles = getAllArticles();
  const populatedCategories = getAllCategories();
  const publishedCategorySlugs = new Set(
    articles.map((article) => article.categorySlug),
  );

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.4 },
    {
      url: `${siteUrl}/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.filter(
    (category) =>
      publishedCategorySlugs.has(category.slug) ||
      populatedCategories.some((item) => item.slug === category.slug),
  ).map((category) => ({
    url: `${siteUrl}/category/${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/articles/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.publishedAt),
    changeFrequency: article.schemaType === "NewsArticle" ? "daily" : "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
