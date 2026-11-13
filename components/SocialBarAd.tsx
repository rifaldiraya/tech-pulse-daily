import Script from "next/script";
import { SOCIAL_BAR_AD } from "@/lib/ads";

/**
 * Adsterra Social Bar is a page-level overlay, so it belongs once in the root
 * layout rather than inside an ad container.
 */
export function SocialBarAd() {
  if (!SOCIAL_BAR_AD.enabled || !SOCIAL_BAR_AD.scriptSrc) return null;

  return (
    <Script
      src={SOCIAL_BAR_AD.scriptSrc}
      strategy="afterInteractive"
      data-cfasync="false"
    />
  );
}
