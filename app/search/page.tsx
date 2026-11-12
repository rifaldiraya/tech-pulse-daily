import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SearchExperience } from "@/components/SearchExperience";
import { getPopularArticles, getSearchIndex, toSummary } from "@/lib/articles";
import { buildBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search TechPulse articles by title, category, tag, or phrase. Search runs entirely in your browser against the local article archive.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  const documents = getSearchIndex();
  const popular = getPopularArticles(4).map(toSummary);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Search", path: "/search" },
        ])}
      />

      <header className="border-b border-hairline bg-subtle">
        <div className="container-page py-10 sm:py-12">
          <p className="eyebrow">The archive</p>
          <h1 className="mt-2 text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-ink sm:text-5xl">
            Search TechPulse
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            Find reporting and guides across AI, software engineering, security,
            cloud, hardware, and more. Everything is searched locally in your
            browser — no external search service and no query tracking.
          </p>
        </div>
      </header>

      <div className="container-page py-10 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <SearchExperience documents={documents} popular={popular} />
          <p className="mt-10 border-t border-hairline pt-5 text-xs leading-relaxed text-muted">
            Searching {documents.length} published articles. Draft articles are
            never included in the search index. Results update as you type and
            match titles, excerpts, categories, tags, authors, and article text.
          </p>
        </div>
      </div>
    </>
  );
}
