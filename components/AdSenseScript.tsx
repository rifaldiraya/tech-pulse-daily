import { ADSENSE, ADSENSE_SCRIPT_SRC } from "@/lib/adsense";

/**
 * AdSense loader. Rendered in the root layout's <head> so the tag appears in
 * the initial HTML of every page, as Google's site-verification check expects.
 */
export function AdSenseScript() {
  if (!ADSENSE.enabled || !ADSENSE.client) return null;

  return <script async src={ADSENSE_SCRIPT_SRC} crossOrigin="anonymous" />;
}
