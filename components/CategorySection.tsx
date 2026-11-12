import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import type { CategoryWithCount } from "@/types/article";
import type { ArticleSummary } from "@/types/article";

interface CategorySectionProps {
  category: CategoryWithCount;
  articles: ArticleSummary[];
  href?: string;
}

export function CategorySection({ category, articles, href }: CategorySectionProps) {
  if (articles.length === 0) return null;
  const viewAllHref = href ?? `/category/${category.slug}`;

  return (
    <section aria-labelledby={`section-${category.slug}`} className="border-t border-hairline py-12">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Section</p>
          <h2
            id={`section-${category.slug}`}
            className="mt-1.5 text-2xl font-extrabold tracking-[-0.03em] text-ink sm:text-3xl"
          >
            {category.name}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {category.description}
          </p>
        </div>
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-4 py-2 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
        >
          View all
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-x-7 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((article) => (
          <ArticleCard
            key={article.slug}
            article={article}
            showExcerpt={false}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ))}
      </div>
    </section>
  );
}
