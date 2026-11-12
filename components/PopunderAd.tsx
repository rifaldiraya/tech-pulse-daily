import Script from "next/script";
import { POPUNDER_AD } from "@/lib/ads";

/**
 * Adsterra Popunder attaches a click listener to the whole page, so it runs
 * once from the root layout instead of inside an ad container.
 */
export function PopunderAd() {
  if (!POPUNDER_AD.enabled || !POPUNDER_AD.scriptSrc) return null;

  return (
    <Script
      src={POPUNDER_AD.scriptSrc}
      strategy="afterInteractive"
      data-cfasync="false"
    />
  );
}
