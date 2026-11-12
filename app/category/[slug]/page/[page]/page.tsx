import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CATEGORY_PER_PAGE,
  CategoryArchive,
} from "@/components/CategoryArchive";
import { getAllCategories, getArticlesByCategory } from "@/lib/articles";
import { getCategoryBySlug } from "@/lib/categories";
import { parsePageParam } from "@/lib/utils";

export const dynamicParams = false;

interface CategoryPageProps {
  params: Promise<{ slug: string; page: string }>;
}

function pageCount(slug: string): number {
  return Math.max(
    1,
    Math.ceil(getArticlesByCategory(slug).length / CATEGORY_PER_PAGE),
  );
}

export function generateStaticParams() {
  return getAllCategories().flatMap((category) => {
    const pages = pageCount(category.slug);
    return Array.from({ length: Math.max(0, pages - 1) }, (_, index) => ({
      slug: category.slug,
      page: String(index + 2),
    }));
  });
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug, page: rawPage } = await params;
  const category = getCategoryBySlug(slug);
  const page = parsePageParam(rawPage);

  if (!category || page < 2 || page > pageCount(slug)) {
    return {
      title: "Page not found",
      robots: { index: false, follow: false },
    };
  }

  const path = `/category/${category.slug}/page/${page}`;
  const title = `${category.name} — page ${page}`;

  return {
    title,
    description: `Page ${page} of ${pageCount(slug)} in the ${category.name} section. ${category.description}`,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: `${title} — TechPulse`,
      description: category.description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: category.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — TechPulse`,
      description: category.description,
      images: ["/og.png"],
    },
  };
}

export default async function CategoryArchivePage({
  params,
}: CategoryPageProps) {
  const { slug, page: rawPage } = await params;
  const page = parsePageParam(rawPage);

  if (!getCategoryBySlug(slug) || page < 2 || page > pageCount(slug)) {
    notFound();
  }

  return <CategoryArchive slug={slug} page={page} />;
}
