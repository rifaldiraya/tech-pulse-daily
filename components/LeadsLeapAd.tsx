"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  LEADSLEAP,
  LEADSLEAP_PALETTES,
  buildLeadsLeapDocument,
  isLeadsLeapConfigured,
  leadsLeapInitialHeight,
  type LeadsLeapAdCount,
} from "@/lib/leadsleap";
import { cn } from "@/lib/format";

/** Below this width the widget stacks its ads, so fewer of them read better. */
const NARROW_QUERY = "(max-width: 479px)";

interface WidgetEnvironment {
  /** `null` until the first client render resolves the theme. */
  isDark: boolean | null;
  narrow: boolean;
}

function useWidgetEnvironment(): WidgetEnvironment {
  const [environment, setEnvironment] = useState<WidgetEnvironment>({
    isDark: null,
    narrow: false,
  });

  useEffect(() => {
    const root = document.documentElement;
    const query = window.matchMedia(NARROW_QUERY);
    const sync = () =>
      setEnvironment({
        isDark: root.classList.contains("dark"),
        narrow: query.matches,
      });

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return environment;
}

interface LeadsLeapAdProps {
  ads?: LeadsLeapAdCount;
  className?: string;
  label?: string;
}

/**
 * LeadsLeap PPC Ad Widget.
 *
 * The loader calls `document.write`, so it runs inside a sandboxed iframe with
 * an opaque origin: the third-party script owns its own document but cannot
 * reach this app's DOM, cookies, or storage. The frame reports its rendered
 * height back through `postMessage` so the slot never shows a scrollbar.
 */
export function LeadsLeapAd({
  ads = LEADSLEAP.ads,
  className,
  label = "Sponsored links",
}: LeadsLeapAdProps) {
  const { isDark, narrow } = useWidgetEnvironment();
  const frameRef = useRef<HTMLIFrameElement>(null);
  const adCount: LeadsLeapAdCount = narrow && ads > 2 ? 2 : ads;
  const [height, setHeight] = useState(() => leadsLeapInitialHeight(adCount));

  const srcDoc = useMemo(
    () =>
      buildLeadsLeapDocument({
        ads: adCount,
        palette: isDark ? LEADSLEAP_PALETTES.dark : LEADSLEAP_PALETTES.light,
      }),
    [adCount, isDark],
  );

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const frame = frameRef.current;
      if (!frame || event.source !== frame.contentWindow) return;

      const data = event.data as { type?: string; height?: number } | null;
      if (!data || data.type !== "leadsleap-height") return;

      const next = Math.ceil(Number(data.height));
      if (Number.isFinite(next) && next > 0) {
        setHeight((previous) => (previous === next ? previous : next));
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // The document is rebuilt on theme changes; start from the estimate again.
  useEffect(() => {
    setHeight(leadsLeapInitialHeight(adCount));
  }, [adCount, srcDoc]);

  if (!isLeadsLeapConfigured()) return null;

  const reserved = leadsLeapInitialHeight(adCount);

  return (
    <aside
      aria-label={label}
      className={cn("w-full overflow-hidden rounded-xl", className)}
      style={isDark === null ? { minHeight: reserved } : undefined}
    >
      {isDark === null ? null : (
        <iframe
          ref={frameRef}
          title={label}
          srcDoc={srcDoc}
          scrolling="no"
          loading="lazy"
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
          className="block w-full border-0"
          style={{ height }}
        />
      )}
    </aside>
  );
}
