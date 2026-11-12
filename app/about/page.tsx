import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info, Layers, PenLine, ShieldCheck } from "lucide-react";
import { Newsletter } from "@/components/Newsletter";
import { PageHeader } from "@/components/PageHeader";
import { HOME_SECTIONS } from "@/lib/categories";

export const metadata: Metadata = {
  title: "About",
  description:
    "TechPulse is a demonstration technology magazine built with Next.js and Markdown. Learn about its editorial approach, coverage, and how the site works.",
  alternates: { canonical: "/about" },
};

const STANDARDS = [
  {
    icon: PenLine,
    title: "Explanation over amplification",
    body: "We prefer clear, practical explanations to hype. Articles are written to help a working technologist understand a topic, not to chase a headline.",
  },
  {
    icon: ShieldCheck,
    title: "Honest labelling",
    body: "Educational analysis is kept separate from time-sensitive news. This demo also labels its limitations rather than simulating features that do not exist.",
  },
  {
    icon: Layers,
    title: "Built in the open",
    body: "The publication is a static Next.js application. Every article lives as a Markdown file in the repository, so the content model is transparent and portable.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Technology, decoded."
        description="TechPulse is an independent technology magazine concept: clear reporting, practical engineering guides, and analysis for people who build and run software."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />

      <div className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="article-prose">
            <p className="text-xl leading-relaxed text-ink">
              Technology coverage is often either breathless or impenetrable.
              TechPulse exists to be neither. We explain what changed, why it
              matters, and what a thoughtful practitioner should do about it.
            </p>
            <h2>What we cover</h2>
            <p>
              Our desks span the systems that modern software depends on — from
              model evaluation and retrieval systems to rendering architecture,
              identity, cloud cost, Linux performance, and mobile budgets. Each
              section has a dedicated archive and a consistent editorial point
              of view: practical, specific, and free of vendor deference.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HOME_SECTIONS.map((section) => (
              <Link
                key={section.title}
                href={section.href}
                className="group flex flex-col rounded-xl border border-hairline bg-canvas p-5 transition-colors hover:border-brand"
              >
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-brand">
                  Desk
                </span>
                <span className="mt-2 text-base font-bold text-ink transition-colors group-hover:text-brand">
                  {section.title}
                </span>
                <span className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {section.description}
                </span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-ink">
                  Visit section
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>

          <section aria-labelledby="standards-heading" className="mt-14">
            <p className="eyebrow">Editorial standards</p>
            <h2
              id="standards-heading"
              className="mt-1.5 text-2xl font-extrabold tracking-[-0.03em] text-ink sm:text-3xl"
            >
              How we work
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {STANDARDS.map((standard) => (
                <div
                  key={standard.title}
                  className="rounded-xl border border-hairline bg-subtle p-5"
                >
                  <standard.icon
                    className="size-5 text-brand"
                    aria-hidden="true"
                  />
                  <h3 className="mt-3 text-sm font-bold text-ink">
                    {standard.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {standard.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <aside className="mt-12 rounded-2xl border border-brand/25 bg-brand/5 p-6 sm:p-7">
            <h2 className="inline-flex items-center gap-2 text-base font-bold text-ink">
              <Info className="size-4 text-brand" aria-hidden="true" />
              A demonstration publication
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              This site is a portfolio and engineering demonstration, not a live
              news organisation. The bylines are sample personas, the articles
              are educational content written for this project, and no story
              should be read as a real announcement or a report of current
              events. Newsletter delivery is not connected.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              The code is designed to be deployed as a fully static Next.js
              site on Vercel, with Markdown files as the single source of
              truth for all article content.
            </p>
          </aside>

          <div className="article-prose mt-12">
            <h2>How the site is built</h2>
            <p>
              The application uses the Next.js App Router with React Server
              Components, TypeScript, and Tailwind CSS. Articles are Markdown
              files with validated frontmatter, read at build time with
              <code>gray-matter</code> and rendered through a remark/rehype
              pipeline. There is no database, no CMS, no authentication, and no
              external content API. The result is a small, fast, cacheable site
              that can be hosted anywhere serving static files.
            </p>
            <p>
              Search, reading progress, the table of contents, and theme
              preference are the only meaningful pieces of client-side
              JavaScript. Everything else — including the full article archive,
              category pages, and structured data — is rendered ahead of time.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
            >
              Browse the archive
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
            >
              Contact the desk
            </Link>
          </div>
        </div>

        <Newsletter />
      </div>
    </>
  );
}
