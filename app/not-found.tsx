import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Home, Search } from "lucide-react";
import { getAllCategories } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you requested could not be found on TechPulse.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const categories = getAllCategories().slice(0, 6);

  return (
    <div className="container-page py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-brand">
          Error 404
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.04em] text-ink sm:text-6xl">
          Off the record.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          This page does not exist, may have been moved, or the article is still
          a draft. Try the archive instead.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
          >
            <Home className="size-4" aria-hidden="true" />
            Back to homepage
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
          >
            <Search className="size-4" aria-hidden="true" />
            Search the archive
          </Link>
        </div>

        {categories.length > 0 ? (
          <div className="mt-12 border-t border-hairline pt-8">
            <h2 className="inline-flex items-center gap-2 text-sm font-bold text-ink">
              <Compass className="size-4 text-brand" aria-hidden="true" />
              Browse a section
            </h2>
            <ul className="mt-4 flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-hairline bg-canvas px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-brand hover:text-brand"
                  >
                    {category.name}
                    <ArrowRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
