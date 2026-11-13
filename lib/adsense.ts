/**
 * Google AdSense configuration.
 *
 * `client` is the publisher ID from the AdSense verification snippet
 * (Ads → By site → verify ownership). The same script enables Auto ads once
 * the site is approved. Set `enabled` to false to remove it everywhere.
 */
export const ADSENSE = {
  enabled: true,
  client: "ca-pub-6883215428156712",
} as const;

export const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE.client}`;

/** Must match the publisher ID in `public/ads.txt`. */
export const ADSENSE_PUBLISHER_ID = ADSENSE.client.replace(/^ca-/, "");
