"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AD_UNITS,
  ADSTERRA_BANNER_HOST,
  type BannerUnit,
  type BannerUnitName,
} from "@/lib/ads";
import { cn } from "@/lib/format";

/**
 * Adsterra banners call `document.write`, which would destroy the React tree if
 * they ran in the page document. Rendering each banner inside its own iframe
 * keeps `atOptions` isolated per slot and blocks the ad script from touching
 * the app DOM.
 */
function buildBannerDocument(unit: BannerUnit): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style>
  </head>
  <body>
    <script type="text/javascript">
      atOptions = {
        key: "${unit.key}",
        format: "iframe",
        height: ${unit.height},
        width: ${unit.width},
        params: {}
      };
    <\/script>
    <script type="text/javascript" src="${ADSTERRA_BANNER_HOST}/${unit.key}"><\/script>
  </body>
</html>`;
}

function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);

  return matches;
}

function AdFrame({ unit, label }: { unit: BannerUnit; label: string }) {
  const document = useMemo(() => buildBannerDocument(unit), [unit]);

  return (
    <iframe
      title={label}
      srcDoc={document}
      width={unit.width}
      height={unit.height}
      scrolling="no"
      style={{
        width: unit.width,
        height: unit.height,
        border: 0,
        display: "block",
      }}
    />
  );
}

interface AdSlotProps {
  unit: BannerUnitName;
  label?: string;
  className?: string;
}

/** Fixed-size banner (300x250, or an explicit size when needed). */
export function AdSlot({ unit, label = "Advertisement", className }: AdSlotProps) {
  const config = AD_UNITS[unit];
  if (!config.key) return null;

  return (
    <aside
      aria-label={label}
      className={cn("flex w-full justify-center overflow-hidden", className)}
    >
      <AdFrame unit={config} label={label} />
    </aside>
  );
}

/**
 * 728x90 on desktop, 320x50 on mobile. Only one of the two is mounted, so the
 * hidden size never counts as a served impression.
 */
export function LeaderboardAd({
  label = "Advertisement",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const config = isDesktop ? AD_UNITS.banner728x90 : AD_UNITS.banner320x50;

  if (!config.key) return null;

  return (
    <aside
      aria-label={label}
      className={cn("flex w-full justify-center overflow-hidden", className)}
    >
      {isDesktop === null ? (
        <div className="min-h-[50px] w-full md:min-h-[90px]" aria-hidden="true" />
      ) : (
        <AdFrame unit={config} label={label} />
      )}
    </aside>
  );
}
