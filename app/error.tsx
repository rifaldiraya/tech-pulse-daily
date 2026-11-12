"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[techpulse] Unhandled route error:", error);
  }, [error]);

  return (
    <div className="container-page py-20 sm:py-28">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-brand">
          Something went wrong
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-ink sm:text-4xl">
          This page hit an unexpected error.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          The rest of the site should still work. Try loading this page again. If
          the problem persists, the article data may need to be rebuilt.
        </p>
        {error.digest ? (
          <p className="mt-3 font-mono text-xs text-muted">
            Reference: {error.digest}
          </p>
        ) : null}
        <button
          type="button"
          onClick={reset}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Try again
        </button>
      </div>
    </div>
  );
}
