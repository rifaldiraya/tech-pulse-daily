"use client";

import { useEffect, useRef } from "react";
import { NATIVE_AD } from "@/lib/ads";
import { cn } from "@/lib/format";

/**
 * Adsterra Native Banner: the invoke script injects an iframe into the
 * `#container-<hash>` element, so both have to live in the page document for
 * the unit to size itself to its content.
 */
export function NativeAd({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const enabled = Boolean(NATIVE_AD.scriptSrc && NATIVE_AD.containerId);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !enabled) return;

    if (!host.querySelector("script[data-adsterra-native]")) {
      const script = document.createElement("script");
      script.src = NATIVE_AD.scriptSrc;
      script.async = true;
      script.dataset.adsterraNative = "true";
      host.appendChild(script);
    }

    if (!host.querySelector(`#${CSS.escape(NATIVE_AD.containerId)}`)) {
      const container = document.createElement("div");
      container.id = NATIVE_AD.containerId;
      host.appendChild(container);
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <aside ref={hostRef} aria-label="Sponsored" className={cn("my-8", className)} />
  );
}
