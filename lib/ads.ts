/**
 * Adsterra ad units.
 *
 * Paste the values from each unit's "GET CODE" dialog in the Adsterra
 * dashboard. For iframe banners the key is the hash that appears both in
 * `atOptions.key` and in the script URL (`…/<key>` or `…/<key>/invoke.js`).
 * Leave a key empty to disable that slot — the component renders nothing
 * instead of an empty box.
 *
 * Dashboard unit IDs, for reference:
 *   32232681 popunder · 32232682 native · 32232683 social bar ·
 *   32232685 300x250 · 32232688 320x50 · 32232689 728x90
 */
export interface BannerUnit {
  key: string;
  width: number;
  height: number;
}

export const AD_UNITS = {
  banner728x90: {
    key: "22ff2e9804e6971832ea781c40dce696",
    width: 728,
    height: 90,
  },
  banner320x50: {
    key: "7728d8725629cb1e3e9d4512d945212b",
    width: 320,
    height: 50,
  },
  banner300x250: {
    key: "be2c9ed2d4e18ec1abba1eb40f72e33f",
    width: 300,
    height: 250,
  },
} satisfies Record<string, BannerUnit>;

export type BannerUnitName = keyof typeof AD_UNITS;

/**
 * Native Banner fills the `#container-<hash>` element with its own iframe, so
 * both values have to come from the unit's snippet. Empty values disable it.
 */
export const NATIVE_AD = {
  scriptSrc: "",
  containerId: "",
};

/**
 * Social Bar: full script URL from the unit's code snippet.
 *
 * Kept disabled while Google AdSense Auto ads is running. The social bar is a
 * fixed page-level overlay, so it competes with AdSense anchor ads for the same
 * screen edge and makes the page look like it is stacking ad overlays.
 * Set `enabled` back to true (and re-mount `<SocialBarAd />` in the root
 * layout) to restore it.
 */
export const SOCIAL_BAR_AD = {
  enabled: false,
  scriptSrc: "https://bauval.org/14/4c48b2d0da340522261686ddd24fdaee",
};

/**
 * Popunder opens a background tab on the visitor's first click anywhere on the
 * site. Flip `enabled` to false to drop it without touching the layout.
 *
 * Disabled because AdSense forbids pages that trigger pop-ups/pop-unders: it
 * is a site-behavior violation that can suspend the account, independent of
 * the Adsterra unit remaining in this file.
 */
export const POPUNDER_AD = {
  enabled: false,
  scriptSrc: "https://abscloud.org/1/8f66b862f8ba4aeb67c414de8a403e20",
};

/** Base URL from the banner snippets; the unit key is appended to it. */
export const ADSTERRA_BANNER_HOST = "https://bauval.org/22";
