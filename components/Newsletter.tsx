import { Mail, ShieldCheck } from "lucide-react";
import { NEWSLETTER } from "@/lib/newsletter";

export function Newsletter() {
  return (
    <section aria-labelledby="newsletter-heading" className="py-12 sm:py-16">
      <div className="relative overflow-hidden rounded-2xl bg-navy px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-brand/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-sky-400/10 blur-3xl"
        />
        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.625rem] font-bold uppercase tracking-[0.16em] text-slate-200">
              <Mail className="size-3.5" aria-hidden="true" />
              The TechPulse Brief
            </span>
            <h2
              id="newsletter-heading"
              className="mt-4 max-w-xl text-3xl font-extrabold leading-[1.15] tracking-[-0.03em] sm:text-4xl"
            >
              One thoughtful tech briefing, every weekday.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
              A concise edit of the engineering stories that matter — written by
              practitioners, not press releases.
            </p>
          </div>
          <div>
            <form
              className="flex flex-col gap-2.5 sm:flex-row"
              aria-describedby="newsletter-status"
              {...(NEWSLETTER.enabled
                ? { action: NEWSLETTER.action, method: "post" }
                : {})}
            >
              {NEWSLETTER.enabled ? (
                <>
                  <input type="hidden" name="embed" value="1" />
                  <input type="hidden" name="tag" value="website" />
                </>
              ) : null}
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="h-12 w-full rounded-lg border border-white/15 bg-white/10 px-4 text-sm text-white placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
              <button
                type="submit"
                disabled={!NEWSLETTER.enabled}
                aria-disabled={!NEWSLETTER.enabled}
                className={`h-12 shrink-0 rounded-lg bg-brand px-6 text-sm font-semibold text-white transition ${
                  NEWSLETTER.enabled
                    ? "hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:ring-offset-2 focus:ring-offset-navy"
                    : "cursor-not-allowed opacity-70"
                }`}
                title={
                  NEWSLETTER.enabled
                    ? undefined
                    : "Newsletter delivery is not connected in this demo"
                }
              >
                Subscribe
              </button>
            </form>
            <p
              id="newsletter-status"
              className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-slate-400"
            >
              <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                {NEWSLETTER.enabled ? (
                  <>
                    You&apos;ll receive a confirmation email from Buttondown.
                    Unsubscribe at any time, and we never sell your address.
                  </>
                ) : (
                  <>
                    <strong className="font-semibold text-slate-200">
                      Demo notice:
                    </strong>{" "}
                    newsletter delivery is not connected yet. This form does not
                    send or store your email address.
                  </>
                )}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
