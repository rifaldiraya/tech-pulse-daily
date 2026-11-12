"use client";

import { useState } from "react";
import { Check, Link2, Mail, Share2 } from "lucide-react";
import { cn } from "@/lib/format";

interface ShareButtonsProps {
  url: string;
  title: string;
  className?: string;
  compact?: boolean;
}

const buttonClass =
  "inline-flex size-9 items-center justify-center rounded-full border border-hairline bg-canvas text-muted transition-colors hover:border-brand hover:text-brand";

export function ShareButtons({ url, title, className, compact = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const xUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const mailUrl = `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`I thought you might find this useful: ${url}`)}`;

  async function copyLink() {
    setFailed(false);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setFailed(true);
    }
  }

  async function nativeShare() {
    if (!navigator.share) {
      await copyLink();
      return;
    }

    try {
      await navigator.share({ title, url });
    } catch {
      // The visitor dismissed the share sheet — nothing to do.
    }
  }

  const linkProps = (href: string) => ({
    href,
    target: "_blank",
    rel: "noopener noreferrer",
    className: buttonClass,
  });

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {!compact ? (
        <span className="mr-1 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-muted">
          Share
        </span>
      ) : null}

      <a {...linkProps(xUrl)} aria-label="Share on X" title="Share on X">
        <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <a {...linkProps(linkedInUrl)} aria-label="Share on LinkedIn" title="Share on LinkedIn">
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.554V9h3.565v11.452z" />
        </svg>
      </a>
      <a {...linkProps(mailUrl)} aria-label="Share by email" title="Share by email">
        <Mail className="size-4" aria-hidden="true" />
      </a>
      <button
        type="button"
        onClick={nativeShare}
        className={buttonClass}
        aria-label="Share via device"
        title="Share"
      >
        <Share2 className="size-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={copyLink}
        className={cn(buttonClass, "w-auto gap-1.5 px-3")}
        aria-label="Copy article URL"
        title="Copy link"
      >
        {copied ? (
          <Check className="size-3.5 text-emerald-500" aria-hidden="true" />
        ) : (
          <Link2 className="size-3.5" aria-hidden="true" />
        )}
        <span className="text-xs font-medium">
          {copied ? "Copied" : failed ? "Press ⌘C" : "Copy link"}
        </span>
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Article URL copied to clipboard" : ""}
      </span>
    </div>
  );
}
