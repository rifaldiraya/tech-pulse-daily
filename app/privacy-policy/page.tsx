import type { Metadata } from "next";
import Link from "next/link";
import { Info } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for the TechPulse demonstration site: no accounts, no analytics, no newsletter backend, and no sale of personal data.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="Privacy Policy"
        description="A short, plain-language account of what this static demonstration site does — and does not — do with data."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Privacy Policy", href: "/privacy-policy" },
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
                  This is a template, not legal advice.
                </strong>{" "}
                TechPulse is a demonstration project. Before operating a real
                publication, adapt this policy to your jurisdiction, hosting
                provider, and any services you add, and have it reviewed by a
                qualified professional.
              </span>
            </p>
          </aside>

          <div className="article-prose">
            <h2>Summary</h2>
            <p>
              TechPulse is a static website. It does not have user accounts,
              comments, a database, or a connected newsletter service. It does
              not run analytics or build reader profiles. Advertising is served
              by third-party networks described under Advertising below. The
              only persistent preference the application stores in your browser
              is your light or dark theme choice.
            </p>

            <h2>Information we do not collect</h2>
            <ul>
              <li>No names, postal addresses, or phone numbers.</li>
              <li>No account credentials, because there are no accounts.</li>
              <li>
                No newsletter subscriptions, because the newsletter form is
                disabled and not connected to any service.
              </li>
              <li>
                No analytics identifiers, and no cross-site tracking operated by
                the site. Third-party ad networks may set their own advertising
                identifiers; see the Advertising section below.
              </li>
              <li>
                No search history stored on a server. Search runs in your
                browser against content already delivered with the site.
              </li>
            </ul>

            <h2>Local browser storage</h2>
            <p>
              When you switch between light and dark mode, the site stores a
              single key, <code>techpulse-theme</code>, in your browser&apos;s
              local storage. It contains only the value <code>light</code> or
              <code>dark</code>. It is never transmitted to a server and can be
              removed by clearing site data in your browser.
            </p>

            <h2>Search queries</h2>
            <p>
              The search page keeps your current query in the page URL so the
              result can be shared or reloaded. This happens locally in your
              browser using the History API. If you share the URL, the query
              becomes visible to whoever receives it. No search query is sent to
              an external search service.
            </p>

            <h2>Hosting and server logs</h2>
            <p>
              Like any website, the hosting provider may process standard
              technical request data such as IP address, user agent, requested
              URL, and timestamp for security, reliability, and abuse prevention.
              This deployment is designed for static hosting; the application
              itself does not create logs containing personal data. Refer to your
              hosting provider&apos;s privacy documentation for its retention
              practices.
            </p>

            <h2>Newsletter</h2>
            <p>
              The newsletter section is a visual placeholder. Its submit button
              is disabled and the page states that subscription functionality is
              not connected. No email address entered into that field is
              transmitted, stored, or processed by this application.
            </p>

            <h2>Advertising</h2>
            <p>
              Pages may include advertising served by third parties. TechPulse
              currently uses Google AdSense and Adsterra. These networks may use
              cookies, web beacons, and similar technologies to serve, measure,
              and personalise ads based on your visits to this and other
              websites.
            </p>
            <ul>
              <li>
                Google, as a third-party vendor, uses cookies to serve ads on
                this site. Google&apos;s use of advertising cookies enables it
                and its partners to serve ads based on your visit to this site
                and/or other sites on the internet.
              </li>
              <li>
                You can opt out of personalised advertising in{" "}
                <a href="https://adssettings.google.com">
                  Google Ads Settings
                </a>
                , or opt out of third-party vendor cookies for personalised ads
                at{" "}
                <a href="https://www.aboutads.info/choices/">
                  aboutads.info
                </a>
                .
              </li>
              <li>
                Adsterra may process technical data such as IP address and
                browser information to deliver and measure ads, subject to its
                own privacy policy.
              </li>
            </ul>
            <p>
              Ad blockers, browser settings, and regional consent controls may
              prevent or limit these scripts. The site operator does not receive
              the personal data that ad networks process.
            </p>

            <h2>Cookies</h2>
            <p>
              The application itself sets no cookies. Advertising partners such
              as Google and Adsterra may set cookies or similar identifiers in
              your browser when ads load; see Advertising above for opt-out
              links. Hosting or content-delivery infrastructure may use strictly
              necessary cookies or similar technology for security and
              performance; check your provider&apos;s disclosures.
            </p>

            <h2>External links and social sharing</h2>
            <p>
              Articles may link to external websites. Share buttons open X,
              LinkedIn, or your email client only after you choose them. Once you
              leave TechPulse, the destination site&apos;s privacy policy applies.
              The share buttons do not load third-party tracking scripts before
              you click.
            </p>
            <p>
              The Markdown pipeline supports privacy-enhanced YouTube embeds
              using <code>youtube-nocookie.com</code>. If an article includes such
              an embed, YouTube may process technical data when you play the
              video, subject to Google&apos;s policies.
            </p>

            <h2>Children&apos;s privacy</h2>
            <p>
              The site is a general-audience technology publication and does not
              knowingly collect personal information from children. Because no
              personal information is collected from any visitor, no special
              verifiable parental consent mechanism is provided.
            </p>

            <h2>Your rights</h2>
            <p>
              Privacy laws in some regions provide rights to access, correct,
              delete, or restrict processing of personal data. This application
              holds no personal data about you beyond the local theme preference
              in your own browser. For data held by a hosting provider, contact
              that provider or the site operator.
            </p>

            <h2>Changes to this policy</h2>
            <p>
              If the project adds features that process personal data — such as a
              working newsletter, comments, or analytics — this policy must be
              updated before those features are enabled.
            </p>

            <h2>Contact</h2>
            <p>
              This demonstration has no monitored inbox. See the{" "}
              <Link href="/contact">contact page</Link> for the illustrative
              editorial addresses and an explanation of what a production setup
              would require.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 border-t border-hairline pt-8">
            <Link
              href="/terms"
              className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
