import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info, Mail, PenLine, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "How to reach the TechPulse editorial desk. This demonstration site has no connected inbox or contact form.",
  alternates: { canonical: "/contact" },
};

const CHANNELS = [
  {
    icon: PenLine,
    title: "Editorial",
    address: "editorial@techpulse.example",
    body: "Story ideas, corrections, and questions about our coverage and methodology.",
  },
  {
    icon: ShieldCheck,
    title: "Security disclosures",
    address: "security@techpulse.example",
    body: "Responsible disclosure for issues in this site or its dependencies. Please do not open a public issue for an unpatched vulnerability.",
  },
  {
    icon: Mail,
    title: "Partnerships",
    address: "partners@techpulse.example",
    body: "Licensing, syndication, and editorial collaboration enquiries.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to the desk."
        description="Questions, corrections, and story ideas are welcome. This demonstration build does not include a connected inbox, so the addresses below are illustrative."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />

      <div className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <aside className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
            <h2 className="inline-flex items-center gap-2 text-base font-bold text-ink">
              <Info className="size-4 text-amber-600" aria-hidden="true" />
              No contact form is connected
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              TechPulse is a static demonstration site with no backend, no
              database, and no email service. Messages sent to the addresses
              below will not be received or stored. The addresses use the
              reserved <code className="font-mono text-xs">.example</code>{" "}
              domain to make that explicit.
            </p>
          </aside>

          <section aria-labelledby="channels-heading" className="mt-10">
            <h2
              id="channels-heading"
              className="text-sm font-bold uppercase tracking-[0.14em] text-ink"
            >
              Editorial contacts
            </h2>
            <div className="mt-4 divide-y divide-hairline rounded-xl border border-hairline">
              {CHANNELS.map((channel) => (
                <div
                  key={channel.title}
                  className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:gap-5"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                    <channel.icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-ink">
                      {channel.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {channel.body}
                    </p>
                    <p className="mt-2 font-mono text-xs text-ink">
                      {channel.address}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-hairline px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-muted">
                    Not monitored
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="article-prose mt-12">
            <h2>For a production deployment</h2>
            <p>
              A real publication would connect these contact points to a
              monitored inbox or a form handler with spam protection, an
              acknowledgement email, and a documented response window. Because
              this project deliberately avoids backends and paid services, none
              of that is simulated here. A fake success message would be worse
              than an honest placeholder.
            </p>
            <p>
              If you are adapting this repository, replace the addresses in
              <code>app/contact/page.tsx</code> and
              <code>lib/site.ts</code>, then add your preferred email routing or
              form provider. Keep the privacy policy in sync with whatever data
              that provider processes.
            </p>
            <h2>Corrections policy</h2>
            <p>
              For factual errors, include the article URL, the specific
              sentence, and a source that supports the correction. Substantive
              corrections are noted with an updated timestamp and a short note
              in the article. Typographical fixes are made silently.
            </p>
            <h2>Security reports</h2>
            <p>
              Include a description of the issue, reproduction steps, and any
              relevant logs. Please avoid including personal data or live
              credentials. This demo has no bug bounty programme.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 border-t border-hairline pt-8">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
            >
              About TechPulse
            </Link>
            <Link
              href="/privacy-policy"
              className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
            >
              Privacy policy
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
