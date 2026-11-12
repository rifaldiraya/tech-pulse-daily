"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";
import { cn } from "@/lib/format";
import type { Heading } from "@/types/article";

interface TableOfContentsProps {
  headings: Heading[];
  className?: string;
}

export function TableOfContents({ headings, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = 160;
      let current = elements[0].id;

      for (const element of elements) {
        if (element.getBoundingClientRect().top <= offset) {
          current = element.id;
        } else {
          break;
        }
      }

      const nearBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 8;
      if (nearBottom) current = elements[elements.length - 1].id;

      setActiveId((previous) => (previous === current ? previous : current));
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [headings]);

  if (headings.length < 2) return null;

  const list = (
    <ol className="space-y-1.5 border-l border-hairline">
      {headings.map((heading) => {
        const isActive = heading.id === activeId;
        return (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={isActive ? "location" : undefined}
              onClick={() => setActiveId(heading.id)}
              className={cn(
                "-ml-px block border-l-2 py-1 text-[0.8125rem] leading-snug transition-colors",
                heading.level === 3 ? "pl-6" : "pl-4",
                isActive
                  ? "border-brand font-semibold text-brand"
                  : "border-transparent text-muted hover:border-muted/40 hover:text-ink",
              )}
            >
              {heading.text}
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <div className={className}>
      <details className="group rounded-xl border border-hairline bg-subtle px-4 py-3 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold text-ink">
          <span className="inline-flex items-center gap-2">
            <List className="size-4 text-brand" aria-hidden="true" />
            On this page
          </span>
          <span className="text-xs text-muted group-open:hidden">Show</span>
          <span className="hidden text-xs text-muted group-open:inline">Hide</span>
        </summary>
        <div className="mt-3">{list}</div>
      </details>

      <aside className="hidden lg:block" aria-label="Table of contents">
        <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-muted">
          On this page
        </p>
        {list}
      </aside>
    </div>
  );
}
