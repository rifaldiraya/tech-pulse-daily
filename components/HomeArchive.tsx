import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { LeaderboardAd } from "@/components/AdSlot";
import { ArticleGrid } from "@/components/ArticleGrid";
import { NativeAd } from "@/components/NativeAd";
import { CategorySection } from "@/components/CategorySection";
import { FeaturedArticle } from "@/components/FeaturedArticle";
import { JsonLd } from "@/components/JsonLd";
import { Newsletter } from "@/components/Newsletter";
import { Pagination } from "@/components/Pagination";
import { HOME_SECTIONS } from "@/lib/categories";
import {
  getArticleCount,
  getArticlesByCategories,
  getFeaturedArticles,
  getLatestArticles,
  getPopularArticles,
  toSummary,
} from "@/lib/articles";
import { formatDate, pluralise } from "@/lib/format";
import { buildWebsiteJsonLd } from "@/lib/seo";
import { paginate } from "@/lib/utils";

export const LATEST_PER_PAGE = 9;

export function HomeArchive({ page }: { page: number }) {
  const latest = getLatestArticles();
  const featured = getFeaturedArticles(3);
  const popular = getPopularArticles(4);
  const paginated = paginate(latest, page, LATEST_PER_PAGE);
  const headlines = latest.slice(0, 5);
  const editionDate = latest[0]?.publishedAt;

  const [hero, ...secondary] = featured;

  return (
    <>
      <JsonLd data={buildWebsiteJsonLd()} />

      <h1 className="sr-only">
        TechPulse — independent IT and technology news, explained
      </h1>

      <section
        aria-labelledby="latest-headlines-heading"
        className="border-b border-hairline bg-subtle"
      >
        <div className="container-page flex items-center gap-3 py-2.5 sm:gap-5">
          <h2
            id="latest-headlines-heading"
            className="flex shrink-0 items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink"
          >
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-brand" />
            </span>
            Latest headlines
          </h2>
          <div className="ticker-viewport relative min-w-0 flex-1 overflow-hidden">
            <div className="ticker-track items-center">
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  className="flex shrink-0 items-center"
                  aria-hidden={copy === 1 ? true : undefined}
                >
                  {headlines.map((article) => (
                    <Link
                      key={`${copy}-${article.slug}`}
                      href={`/articles/${article.slug}`}
                      tabIndex={copy === 1 ? -1 : undefined}
                      className="flex shrink-0 items-center gap-3 whitespace-nowrap px-4 text-xs font-medium text-muted transition-colors hover:text-brand sm:text-sm"
                    >
                      <span className="text-brand" aria-hidden="true">
                        /
                      </span>
                      {article.title}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <Link
            href="/#latest"
            className="hidden shrink-0 text-xs font-semibold text-brand transition-colors hover:text-brand-strong sm:inline-flex"
          >
            All stories
          </Link>
        </div>
      </section>

      <div className="container-page">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline py-4">
          <p className="text-xs text-muted">
            {editionDate ? (
              <>
                Latest edition{" "}
                <time dateTime={editionDate} className="font-semibold text-ink">
                  {formatDate(editionDate, "long")}
                </time>
              </>
            ) : (
              "Independent technology journalism"
            )}
          </p>
          <p className="text-xs text-muted">
            {pluralise(getArticleCount(), "story", "stories")} ·{" "}
            <span className="text-ink">Reader-supported, no paywall</span>
          </p>
        </div>

        {hero ? (
          <section aria-labelledby="featured-heading" className="pt-8 sm:pt-10">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">The front page</p>
                <h2
                  id="featured-heading"
                  className="mt-1 text-2xl font-extrabold tracking-[-0.03em] text-ink sm:text-3xl"
                >
                  Featured reporting
                </h2>
              </div>
              <p className="hidden max-w-sm text-right text-xs leading-relaxed text-muted lg:block">
                Analysis and practical guides, selected by the editorial desk.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
              <FeaturedArticle
                article={toSummary(hero)}
                variant="hero"
                priority
              />
              <div className="flex flex-col divide-y divide-hairline">
                {secondary.map((article, index) => (
                  <div
                    key={article.slug}
                    className={index === 0 ? "pb-5" : "pt-5"}
                  >
                    <FeaturedArticle
                      article={toSummary(article)}
                      variant="secondary"
                      priority
                    />
                  </div>
                ))}
                <div className="pt-5">
                  <Link
                    href="/search"
                    className="group flex items-center justify-between rounded-xl border border-hairline bg-subtle px-4 py-3 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
                  >
                    Browse the full archive
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <LeaderboardAd className="mt-10" />

        <section
          id="latest"
          aria-labelledby="latest-heading"
          className="scroll-mt-24 border-t border-hairline py-12 sm:py-14"
        >
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Recently published</p>
              <h2
                id="latest-heading"
                className="mt-1.5 text-2xl font-extrabold tracking-[-0.03em] text-ink sm:text-3xl"
              >
                Latest news
                {paginated.currentPage > 1 ? (
                  <span className="ml-2 text-base font-semibold text-muted">
                    Page {paginated.currentPage}
                  </span>
                ) : null}
              </h2>
            </div>
            <p className="text-xs text-muted">
              Page {paginated.currentPage} of {paginated.totalPages}
            </p>
          </div>

          <ArticleGrid
            articles={paginated.items.map(toSummary)}
            priorityCount={paginated.currentPage === 1 ? 3 : 0}
          />

          <NativeAd className="mt-10" />

          <Pagination
            className="mt-10"
            currentPage={paginated.currentPage}
            totalPages={paginated.totalPages}
            basePath="/page"
            firstPagePath="/"
            mode="path"
            hash="latest"
            label="Latest articles pagination"
          />
        </section>

        {popular.length > 0 ? (
          <section
            aria-labelledby="popular-heading"
            className="border-y border-hairline py-12"
          >
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow inline-flex items-center gap-1.5">
                  <Flame className="size-3.5" aria-hidden="true" />
                  Editor-curated
                </p>
                <h2
                  id="popular-heading"
                  className="mt-1.5 text-2xl font-extrabold tracking-[-0.03em] text-ink sm:text-3xl"
                >
                  Popular this week
                </h2>
              </div>
              <p className="max-w-md text-right text-xs leading-relaxed text-muted">
                Ranked by editorial signal — not inflated page views.
              </p>
            </div>

            <ol className="grid gap-x-8 gap-y-2 md:grid-cols-2">
              {popular.map((article, index) => (
                <li key={article.slug}>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="group flex items-start gap-4 border-t border-hairline py-4 transition-colors hover:border-brand/40"
                  >
                    <span
                      className="mt-0.5 w-8 shrink-0 font-mono text-xl font-bold text-brand/60 tabular-nums transition-colors group-hover:text-brand"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="eyebrow text-[0.625rem]">
                        {article.category}
                      </span>
                      <span className="mt-1 block text-base font-semibold leading-snug tracking-[-0.015em] text-ink transition-colors group-hover:text-brand sm:text-lg">
                        {article.title}
                      </span>
                      <span className="mt-1.5 block text-xs text-muted">
                        <time dateTime={article.publishedAt}>
                          {formatDate(article.publishedAt, "short")}
                        </time>{" "}
                        · {article.readingTime} min read
                      </span>
                    </span>
                    <ArrowRight
                      className="mt-2 size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {HOME_SECTIONS.map((section) => {
          const articles = getArticlesByCategories(section.categorySlugs).slice(0, 4);
          if (articles.length === 0) return null;

          return (
            <CategorySection
              key={section.title}
              category={{
                slug: section.categorySlugs[0],
                name: section.title,
                description: section.description,
                count: articles.length,
              }}
              articles={articles.map(toSummary)}
              href={section.href}
            />
          );
        })}

        <Newsletter />
      </div>
    </>
  );
}
