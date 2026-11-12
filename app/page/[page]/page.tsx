import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeArchive, LATEST_PER_PAGE } from "@/components/HomeArchive";
import { getLatestArticles } from "@/lib/articles";
import { SITE } from "@/lib/site";
import { parsePageParam } from "@/lib/utils";

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ page: string }>;
}

function totalPages(): number {
  return Math.max(1, Math.ceil(getLatestArticles().length / LATEST_PER_PAGE));
}

export function generateStaticParams() {
  const pages = totalPages();
  return Array.from({ length: Math.max(0, pages - 1) }, (_, index) => ({
    page: String(index + 2),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const requested = parsePageParam((await params).page);
  const pages = totalPages();

  if (requested < 2 || requested > pages) {
    return {
      title: "Page not found",
      robots: { index: false, follow: false },
    };
  }

  const path = `/page/${requested}`;
  const title = `Latest technology news — page ${requested}`;
  const description = `Page ${requested} of ${pages} in the TechPulse latest news archive.`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: `${title} — ${SITE.name}`,
      description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.name }],
    },
  };
}

export default async function LatestArchivePage({ params }: PageProps) {
  const page = parsePageParam((await params).page);
  if (page < 2 || page > totalPages()) notFound();

  return <HomeArchive page={page} />;
}
