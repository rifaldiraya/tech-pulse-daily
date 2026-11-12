import type { Metadata } from "next";
import { CategoryArchive } from "@/components/CategoryArchive";
import { getAllCategories } from "@/lib/articles";
import { getCategoryBySlug } from "@/lib/categories";

export const dynamicParams = false;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category not found",
      robots: { index: false, follow: false },
    };
  }

  const path = `/category/${category.slug}`;
  return {
    title: `${category.name} news and analysis`,
    description: category.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: `${category.name} — TechPulse`,
      description: category.description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: category.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} — TechPulse`,
      description: category.description,
      images: ["/og.png"],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  return <CategoryArchive slug={slug} page={1} />;
}
