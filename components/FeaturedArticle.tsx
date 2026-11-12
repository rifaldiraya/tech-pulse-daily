import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleMeta } from "@/components/ArticleMeta";
import { cn } from "@/lib/format";
import type { ArticleSummary } from "@/types/article";

interface FeaturedArticleProps {
  article: ArticleSummary;
  variant?: "hero" | "secondary";
  className?: string;
  priority?: boolean;
}

export function FeaturedArticle({
  article,
  variant = "hero",
  className,
  priority = false,
}: FeaturedArticleProps) {
  const href = `/articles/${article.slug}`;

  if (variant === "secondary") {
    return (
      <article
        className={cn(
          "group grid grid-cols-[7.5rem_1fr] gap-4 border-hairline sm:grid-cols-[10rem_1fr] sm:gap-5",
          className,
        )}
      >
        <Link
          href={href}
          aria-hidden="true"
          tabIndex={-1}
          className="relative aspect-square overflow-hidden rounded-xl bg-subtle sm:aspect-[4/3]"
        >
          <Image
            src={article.coverImage}
            alt={article.coverImageAlt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 120px, 160px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </Link>
        <div className="flex min-w-0 flex-col justify-center">
          <span className="eyebrow text-[0.625rem]">{article.category}</span>
          <h3 className="mt-1.5 text-lg font-bold leading-snug tracking-[-0.02em] text-ink sm:text-xl">
            <Link href={href} className="transition-colors group-hover:text-brand">
              {article.title}
            </Link>
          </h3>
          <p className="mt-2 hidden line-clamp-2 text-sm leading-relaxed text-muted sm:block">
            {article.description}
          </p>
          <ArticleMeta article={article} className="mt-2.5" />
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-hairline bg-navy",
        className,
      )}
    >
      <Link
        href={href}
        aria-hidden="true"
        tabIndex={-1}
        className="relative block grow aspect-[16/10] overflow-hidden sm:aspect-[16/9] lg:aspect-[16/10]"
      >
        <Image
          src={article.coverImage}
          alt={article.coverImageAlt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-[#050b18] via-[#050b18]/55 to-transparent" />
        <span className="absolute inset-x-0 bottom-0 block p-5 sm:p-7 lg:p-8">
          <span className="inline-flex rounded-full bg-brand px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-white">
            {article.category}
          </span>
          <span className="mt-3 block text-2xl font-extrabold leading-[1.15] tracking-[-0.03em] text-white sm:text-3xl lg:text-[2.4rem]">
            {article.title}
          </span>
          <span className="mt-3 hidden max-w-2xl text-sm leading-relaxed text-slate-200 sm:block lg:text-base">
            {article.description}
          </span>
        </span>
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 pb-5 pt-4 sm:px-7 lg:px-8">
        <ArticleMeta article={article} className="text-slate-300" showAuthor />
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white transition-colors hover:text-brand"
        >
          Read story
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
