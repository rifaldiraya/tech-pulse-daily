import Link from "next/link";
import { Rss } from "lucide-react";
import { Logo } from "@/components/Logo";
import { CATEGORIES } from "@/lib/categories";
import { SITE } from "@/lib/site";

function SocialIcon({ label }: { label: string }) {
  if (label === "X") {
    return (
      <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }

  if (label === "GitHub") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
      </svg>
    );
  }

  if (label === "LinkedIn") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.554V9h3.565v11.452z" />
      </svg>
    );
  }

  return <Rss className="size-4" aria-hidden="true" />;
}

export function Footer() {
  const sections = CATEGORIES.slice(0, 6);

  return (
    <footer className="mt-4 border-t border-hairline bg-subtle">
      <div className="container-page py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {SITE.tagline} Independent technology journalism and practical
              engineering guides — built as a fully static publication.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {SITE.social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={item.label}
                  title={item.label}
                  className="grid size-9 place-items-center rounded-full border border-hairline bg-canvas text-muted transition-colors hover:border-brand hover:text-brand"
                >
                  <SocialIcon label={item.label} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink">
              Sections
            </h2>
            <ul className="mt-3 space-y-2">
              {sections.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm text-muted transition-colors hover:text-brand"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/search" className="text-sm text-muted transition-colors hover:text-brand">
                  All topics
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink">
              Publication
            </h2>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted transition-colors hover:text-brand">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted transition-colors hover:text-brand">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm text-muted transition-colors hover:text-brand">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted transition-colors hover:text-brand">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink">
              More desks
            </h2>
            <ul className="mt-3 space-y-2">
              {CATEGORIES.slice(6).map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm text-muted transition-colors hover:text-brand"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-hairline pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="max-w-xl sm:text-right">
            Demo publication. Editorial content is sample material and does not
            represent real breaking news.
          </p>
        </div>
      </div>
    </footer>
  );
}
