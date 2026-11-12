import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ArticleMeta } from "@/components/ArticleMeta";
import { CategoryBadge } from "@/components/CategoryBadge";
import { cn } from "@/lib/format";
import type { ArticleSummary } from "@/types/article";

interface ArticleCardProps {
  article: ArticleSummary;
  className?: string;
  variant?: "default" | "compact" | "horizontal";
  priority?: boolean;
  showExcerpt?: boolean;
  sizes?: string;
}

export function ArticleCard({
  article,
  className,
  variant = "default",
  priority = false,
  showExcerpt = true,
  sizes,
}: ArticleCardProps) {
  const href = `/articles/${article.slug}`;

  if (variant === "horizontal") {
    return (
      <article className={cn("group", className)}>
        <div className="flex gap-4">
          <Link
            href={href}
            className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-lg bg-subtle sm:w-32"
            aria-hidden="true"
            tabIndex={-1}
          >
            <Image
              src={article.coverImage}
              alt={article.coverImageAlt}
              fill
              sizes="(max-width: 640px) 112px, 128px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </Link>
          <div className="min-w-0 py-0.5">
            <CategoryBadge name={article.category} slug={article.categorySlug} />
            <h3 className="mt-1.5 text-[0.9375rem] font-semibold leading-snug tracking-[-0.01em] text-ink">
              <Link href={href} className="transition-colors group-hover:text-brand">
                {article.title}
              </Link>
            </h3>
            <ArticleMeta
              article={article}
              className="mt-2"
              showReadingTime={false}
            />
          </div>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className={cn("group", className)}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CategoryBadge name={article.category} slug={article.categorySlug} />
            <h3 className="mt-1.5 text-base font-semibold leading-snug tracking-[-0.015em] text-ink">
              <Link href={href} className="transition-colors group-hover:text-brand">
                {article.title}
              </Link>
            </h3>
          </div>
          <span className="mt-1 shrink-0 text-brand opacity-0 transition-opacity group-hover:opacity-100">
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        </div>
        {showExcerpt ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
            {article.description}
          </p>
        ) : null}
        <ArticleMeta article={article} className="mt-2.5" />
      </article>
    );
  }

  return (
    <article className={cn("group flex h-full flex-col", className)}>
      <Link href={href} className="relative block overflow-hidden rounded-xl bg-subtle">
        <div className="relative aspect-[16/10]">
          <Image
            src={article.coverImage}
            alt={article.coverImageAlt}
            fill
            priority={priority}
            sizes={
              sizes ?? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col pt-4">
        <CategoryBadge name={article.category} slug={article.categorySlug} />
        <h3 className="mt-2 text-xl font-bold leading-snug tracking-[-0.02em] text-ink">
          <Link href={href} className="transition-colors group-hover:text-brand">
            {article.title}
          </Link>
        </h3>
        {showExcerpt ? (
          <p className="mt-2.5 line-clamp-3 text-[0.9375rem] leading-relaxed text-muted">
            {article.description}
          </p>
        ) : null}
        <ArticleMeta article={article} className="mt-auto pt-4" />
      </div>
    </article>
  );
}
