import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ArticleGrid } from "@/components/ArticleGrid";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FeaturedArticle } from "@/components/FeaturedArticle";
import { JsonLd } from "@/components/JsonLd";
import { Newsletter } from "@/components/Newsletter";
import { Pagination } from "@/components/Pagination";
import {
  getAllCategories,
  getArticlesByCategory,
  toSummary,
} from "@/lib/articles";
import { getCategoryBySlug } from "@/lib/categories";
import { pluralise } from "@/lib/format";
import { buildBreadcrumbJsonLd, buildCollectionJsonLd } from "@/lib/seo";
import { paginate } from "@/lib/utils";

export const CATEGORY_PER_PAGE = 9;

export function CategoryArchive({
  slug,
  page,
}: {
  slug: string;
  page: number;
}) {
  const articles = getArticlesByCategory(slug);

  const category =
    getCategoryBySlug(slug) ??
    (articles[0]
      ? {
          slug,
          name: articles[0].category,
          description: `Articles filed under ${articles[0].category}.`,
        }
      : undefined);

  if (!category || articles.length === 0) notFound();

  const paginated = paginate(articles, page, CATEGORY_PER_PAGE);
  const showFeatured = paginated.currentPage === 1;
  const [featured, ...gridArticles] = paginated.items;
  const allCategories = getAllCategories().filter(
    (item) => item.slug !== category.slug,
  );

  return (
    <>
      <JsonLd
        data={[
          buildCollectionJsonLd(
            category.name,
            category.description,
            `/category/${category.slug}`,
            articles.map(toSummary),
          ),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: category.name, path: `/category/${category.slug}` },
          ]),
        ]}
      />

      <header className="border-b border-hairline bg-subtle">
        <div className="container-page py-8 sm:py-10">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: category.name, href: `/category/${category.slug}` },
            ]}
          />
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <div>
              <p className="eyebrow">Section</p>
              <h1 className="mt-2 text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-ink sm:text-5xl">
                {category.name}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                {category.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-6 border-t border-hairline pt-5 lg:justify-end lg:border-t-0 lg:pt-0">
              <div>
                <p className="font-mono text-2xl font-bold text-ink">
                  {articles.length}
                </p>
                <p className="text-xs uppercase tracking-[0.12em] text-muted">
                  {articles.length === 1 ? "Story" : "Stories"}
                </p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-ink">
                  {formatLatestYear(articles[0]?.publishedAt)}
                </p>
                <p className="text-xs uppercase tracking-[0.12em] text-muted">
                  Latest year
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container-page">
        {paginated.currentPage === 1 && featured ? (
          <section aria-labelledby="category-featured" className="py-10">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2
                id="category-featured"
                className="text-sm font-bold uppercase tracking-[0.14em] text-ink"
              >
                Top story
              </h2>
              <span className="text-xs text-muted">
                {pluralise(articles.length, "published article")}
              </span>
            </div>
            <FeaturedArticle article={toSummary(featured)} priority />
          </section>
        ) : null}

        <section
          aria-labelledby="category-grid-heading"
          className="border-t border-hairline py-10"
        >
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <h2
              id="category-grid-heading"
              className="text-2xl font-extrabold tracking-[-0.03em] text-ink sm:text-3xl"
            >
              {paginated.currentPage === 1 ? "More in this section" : "Stories"}
            </h2>
            <p className="text-xs text-muted">
              Page {paginated.currentPage} of {paginated.totalPages}
            </p>
          </div>

          <ArticleGrid
            articles={(showFeatured ? gridArticles : paginated.items).map(
              toSummary,
            )}
          />

          <Pagination
            className="mt-10"
            currentPage={paginated.currentPage}
            totalPages={paginated.totalPages}
            basePath={`/category/${category.slug}/page`}
            firstPagePath={`/category/${category.slug}`}
            mode="path"
            label={`${category.name} pagination`}
          />
        </section>

        {allCategories.length > 0 ? (
          <section
            aria-labelledby="other-sections"
            className="border-t border-hairline py-10"
          >
            <h2
              id="other-sections"
              className="text-sm font-bold uppercase tracking-[0.14em] text-ink"
            >
              Explore other sections
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {allCategories.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/category/${item.slug}`}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-hairline bg-canvas px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-brand hover:text-brand"
                  >
                    {item.name}
                    <span className="font-mono text-[0.625rem] text-muted/70">
                      {item.count}
                    </span>
                    <ArrowRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <Newsletter />
      </div>
    </>
  );
}

function formatLatestYear(date: string | undefined): string {
  if (!date) return "—";
  const year = new Date(date).getFullYear();
  return Number.isNaN(year) ? "—" : String(year);
}
