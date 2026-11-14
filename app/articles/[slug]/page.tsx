import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { AdSlot, LeaderboardAd } from "@/components/AdSlot";
import { ArticleGrid } from "@/components/ArticleGrid";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { LeadsLeapAd } from "@/components/LeadsLeapAd";
import { MarkdownContent } from "@/components/MarkdownContent";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShareButtons } from "@/components/ShareButtons";
import { TableOfContents } from "@/components/TableOfContents";
import {
  getAllArticleSlugs,
  getAdjacentArticles,
  getArticleBySlug,
  getRelatedArticles,
  toSummary,
} from "@/lib/articles";
import { formatDate, getInitials } from "@/lib/format";
import { extractHeadings, renderMarkdown } from "@/lib/markdown";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article not found",
      robots: { index: false, follow: false },
    };
  }

  const canonical = `/articles/${article.slug}`;
  const publishedTime = new Date(article.publishedAt).toISOString();
  const modifiedTime = new Date(
    article.updatedAt || article.publishedAt,
  ).toISOString();

  return {
    title: article.title,
    description: article.description,
    keywords: [...article.tags, article.category],
    authors: [{ name: article.author }],
    alternates: {
      canonical,
      types: {
        "application/rss+xml": "/feed.xml",
      },
    },
    openGraph: {
      type: "article",
      url: canonical,
      title: article.title,
      description: article.description,
      siteName: SITE.name,
      locale: SITE.locale,
      publishedTime,
      modifiedTime,
      authors: [article.author],
      section: article.category,
      tags: article.tags,
      images: [
        {
          url: article.coverImage,
          width: 1200,
          height: 750,
          alt: article.coverImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@techpulse",
      creator: "@techpulse",
      title: article.title,
      description: article.description,
      images: [article.coverImage],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const [html, headings, related, adjacent] = await Promise.all([
    renderMarkdown(article.content),
    Promise.resolve(extractHeadings(article.content)),
    Promise.resolve(getRelatedArticles(article.slug, 3)),
    Promise.resolve(getAdjacentArticles(article.slug)),
  ]);

  const shareUrl = absoluteUrl(`/articles/${article.slug}`);
  const isUpdated = article.updatedAt !== article.publishedAt;
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: article.category, href: `/category/${article.categorySlug}` },
    { name: article.title, href: `/articles/${article.slug}` },
  ];

  return (
    <>
      <ReadingProgress />
      <JsonLd
        data={[
          buildArticleJsonLd(article),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            {
              name: article.category,
              path: `/category/${article.categorySlug}`,
            },
            { name: article.title, path: `/articles/${article.slug}` },
          ]),
        ]}
      />

      <article>
        <header className="container-page pt-8 sm:pt-10">
          <Breadcrumbs items={breadcrumbs} />

          <div className="mx-auto mt-6 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/category/${article.categorySlug}`}
                className="rounded-full bg-brand/10 px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-brand transition-colors hover:bg-brand/15"
              >
                {article.category}
              </Link>
              <span className="text-xs text-muted">
                {article.readingTime} min read
              </span>
            </div>

            <h1 className="mt-4 text-[2.1rem] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink sm:text-5xl lg:text-[3.4rem]">
              {article.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted sm:text-xl">
              {article.description}
            </p>

            <div className="mt-7 flex flex-col gap-4 border-y border-hairline py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-navy text-xs font-bold text-white"
                  aria-hidden="true"
                >
                  {getInitials(article.author)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {article.author}
                  </p>
                  <p className="text-xs text-muted">Editorial desk</p>
                </div>
              </div>

              <dl className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted">
                <div>
                  <dt className="sr-only">Published</dt>
                  <dd>
                    <time dateTime={article.publishedAt}>
                      {formatDate(article.publishedAt, "long")}
                    </time>
                  </dd>
                </div>
                {isUpdated ? (
                  <div>
                    <dt className="sr-only">Updated</dt>
                    <dd>
                      Updated{" "}
                      <time dateTime={article.updatedAt}>
                        {formatDate(article.updatedAt, "long")}
                      </time>
                    </dd>
                  </div>
                ) : null}
                <div className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" aria-hidden="true" />
                  <dt className="sr-only">Reading time</dt>
                  <dd>{article.readingTime} min read</dd>
                </div>
              </dl>
            </div>
          </div>
        </header>

        <figure className="container-page mt-7">
          <div className="relative mx-auto aspect-[16/9] w-full max-w-5xl overflow-hidden rounded-2xl bg-subtle">
            <Image
              src={article.coverImage}
              alt={article.coverImageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
          <figcaption className="mx-auto mt-2 max-w-5xl text-xs leading-relaxed text-muted">
            {article.coverImageAlt}
          </figcaption>
        </figure>

        <div className="container-page mt-9">
          <LeaderboardAd />
        </div>

        <div className="container-page mt-9">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start">
            <div className="min-w-0">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-5">
                <ShareButtons url={shareUrl} title={article.title} compact />
                <Link
                  href={`/category/${article.categorySlug}`}
                  className="text-xs font-semibold text-muted transition-colors hover:text-brand"
                >
                  More in {article.category}
                </Link>
              </div>

              <TableOfContents headings={headings} className="mb-8 lg:hidden" />

              <MarkdownContent html={html} className="max-w-[44rem]" />

              <AdSlot unit="banner300x250" className="mt-10" />

              {article.tags.length > 0 ? (
                <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-hairline pt-6">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-muted">
                    Filed under
                  </span>
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="rounded-full border border-hairline px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-brand hover:text-brand"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              ) : null}

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-hairline bg-subtle p-5">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    Written by {article.author}
                  </p>
                  <p className="mt-1 max-w-md text-xs leading-relaxed text-muted">
                    Reporting and analysis for TechPulse. This article is sample
                    editorial content included with the demonstration site.
                  </p>
                </div>
                <ShareButtons url={shareUrl} title={article.title} compact />
              </div>

              <nav
                aria-label="Article navigation"
                className="mt-10 grid gap-3 sm:grid-cols-2"
              >
                {adjacent.previous ? (
                  <Link
                    href={`/articles/${adjacent.previous.slug}`}
                    rel="prev"
                    className="group rounded-xl border border-hairline p-4 transition-colors hover:border-brand"
                  >
                    <span className="inline-flex items-center gap-1.5 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-muted">
                      <ArrowLeft className="size-3" aria-hidden="true" />
                      Previous story
                    </span>
                    <span className="mt-2 block text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-brand">
                      {adjacent.previous.title}
                    </span>
                  </Link>
                ) : (
                  <span aria-hidden="true" />
                )}
                {adjacent.next ? (
                  <Link
                    href={`/articles/${adjacent.next.slug}`}
                    rel="next"
                    className="group rounded-xl border border-hairline p-4 text-right transition-colors hover:border-brand sm:col-start-2"
                  >
                    <span className="inline-flex items-center gap-1.5 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-muted">
                      Next story
                      <ArrowRight className="size-3" aria-hidden="true" />
                    </span>
                    <span className="mt-2 block text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-brand">
                      {adjacent.next.title}
                    </span>
                  </Link>
                ) : null}
              </nav>
            </div>

            <TableOfContents
              headings={headings}
              className="sticky top-24 hidden lg:block"
            />
          </div>
        </div>

        {related.length > 0 ? (
          <section
            aria-labelledby="related-heading"
            className="container-page mt-14 border-t border-hairline py-12"
          >
            <div className="mx-auto max-w-5xl">
              <p className="eyebrow">Keep reading</p>
              <h2
                id="related-heading"
                className="mt-1.5 text-2xl font-extrabold tracking-[-0.03em] text-ink sm:text-3xl"
              >
                Related articles
              </h2>
              <ArticleGrid articles={related.map(toSummary)} className="mt-7" />
              <LeadsLeapAd ads={4} className="mt-10" />
            </div>
          </section>
        ) : null}
      </article>
    </>
  );
}
