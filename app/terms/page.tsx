import type { Metadata } from "next";
import Link from "next/link";
import { Info } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for the TechPulse demonstration site, including content status, acceptable use, and disclaimers.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Terms"
        title="Terms of Service"
        description="The ground rules for using this demonstration technology publication."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Terms of Service", href: "/terms" },
        ]}
        meta="Demo template · Last updated November 2026"
      />

      <div className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <aside className="mb-10 rounded-xl border border-brand/25 bg-brand/5 p-5">
            <p className="flex items-start gap-2 text-sm leading-relaxed text-muted">
              <Info className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
              <span>
                <strong className="font-semibold text-ink">
                  Template terms, not legal advice.
                </strong>{" "}
                These terms are written for a demonstration project. If you
                operate this site commercially, replace them with terms reviewed
                by a qualified lawyer in your jurisdiction.
              </span>
            </p>
          </aside>

          <div className="article-prose">
            <h2>1. Acceptance</h2>
            <p>
              By accessing this website you agree to these terms. If you do not
              agree, please do not use the site. &ldquo;TechPulse&rdquo; refers to
              this demonstration publication and its maintainers.
            </p>

            <h2>2. What this site is</h2>
            <p>
              TechPulse is a static technology magazine built with Next.js and
              Markdown. It is a portfolio and engineering demonstration. Its
              articles are sample educational content. They are not a live news
              service, do not report real current events, and must not be cited
              as factual reporting about any company, product, or person. Any
              bylines are sample personas.
            </p>

            <h2>3. Content and intellectual property</h2>
            <p>
              The site&apos;s text, design, and code are provided for
              demonstration and evaluation. No licence is granted to republish,
              resell, or redistribute substantial portions of the content except
              as permitted by applicable law. You may link to articles, quote
              short excerpts with attribution, and use the project for personal
              learning.
            </p>
            <p>
              Product names, logos, and trademarks mentioned on the site belong
              to their respective owners. Their appearance does not imply
              endorsement or affiliation.
            </p>

            <h2>4. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>
                Use the site in a way that violates applicable law or the rights
                of others.
              </li>
              <li>
                Attempt to gain unauthorised access to the site, its hosting, or
                any related systems.
              </li>
              <li>
                Interfere with availability through automated scraping,
                denial-of-service activity, or excessive requests.
              </li>
              <li>
                Misrepresent the sample content as real reporting or attribute
                fictional statements to real organisations.
              </li>
              <li>
                Remove attribution or present the content as your own
                editorial work.
              </li>
            </ul>

            <h2>5. No professional advice</h2>
            <p>
              Content is provided for general information and education. It is
              not legal, financial, medical, security, or other professional
              advice. Engineering guidance may not fit your environment. Verify
              recommendations, test changes, and consult a qualified
              professional before making decisions with significant impact.
            </p>

            <h2>6. Accuracy and availability</h2>
            <p>
              The site is provided on an &ldquo;as is&rdquo; and &ldquo;as
              available&rdquo; basis. No warranty is made that content is
              accurate, complete, current, or error-free, or that the site will
              be uninterrupted or secure. Features may change or be removed
              without notice.
            </p>

            <h2>7. External links</h2>
            <p>
              The site may link to third-party websites and services. Those
              destinations are not controlled by TechPulse, and their terms and
              privacy practices apply. Links do not imply endorsement.
            </p>

            <h2>8. Newsletter and interactive features</h2>
            <p>
              The newsletter form is disabled and not connected to any mailing
              service. No subscription is created and no submission is stored.
              Search and theme preference operate locally in your browser. Social
              sharing links open third-party sites only when you choose them.
            </p>

            <h2>9. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, TechPulse and its
              contributors are not liable for indirect, incidental, special,
              consequential, or punitive damages, or for any loss of data,
              profits, or business opportunity arising from your use of the site
              or reliance on its content. Nothing in these terms excludes
              liability that cannot legally be excluded.
            </p>

            <h2>10. Changes to these terms</h2>
            <p>
              These terms may be updated as the project changes. The revised
              version becomes effective when published on this page. Continued
              use of the site after changes constitutes acceptance of the revised
              terms.
            </p>

            <h2>11. Contact</h2>
            <p>
              This demonstration has no monitored inbox. See the{" "}
              <Link href="/contact">contact page</Link> for illustrative
              editorial addresses and guidance on adapting the project.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 border-t border-hairline pt-8">
            <Link
              href="/privacy-policy"
              className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
            >
              Privacy Policy
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
            >
              About TechPulse
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
