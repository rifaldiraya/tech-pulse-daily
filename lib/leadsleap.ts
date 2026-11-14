/**
 * LeadsLeap PPC Ad Widget.
 *
 * Fill `username` with the LeadsLeap username that appears as `ll_r` in the
 * code LeadsLeap generates (Member Area → PPC Ad Widget → Get Code). While it
 * is empty every slot renders nothing, so the site never shows an empty box.
 *
 * Recommended settings in the LeadsLeap dashboard (the values below mirror
 * them, so the widget matches the site in both themes):
 *
 *   Widget type .............. Responsive
 *   Number of ads ............ 4 (2 for narrow columns)
 *   Background color ......... #ffffff (light) / #111a2b (dark)
 *   Title color .............. #111827 (light) / #e8edf6 (dark)
 *   Text color ............... #475569 (light) / #cbd5e1 (dark)
 *   Info color ............... #64748b (light) / #94a3b8 (dark)
 *   Header color ............. #64748b (light) / #94a3b8 (dark)
 *   Bold ..................... checked
 *   Hide Header .............. unchecked (keeps the third-party disclosure)
 *   Hide Category ............ checked
 *   Hide Pro Badge ........... checked
 *
 * The widget loader uses `document.write`, so it cannot run in the page
 * document without destroying the React tree. Each slot renders the snippet in
 * a sandboxed iframe instead and receives the measured height over
 * `postMessage`.
 */

export type LeadsLeapAdCount = 2 | 4 | 6;

export interface LeadsLeapPalette {
  background: string;
  title: string;
  text: string;
  info: string;
  header: string;
}

export const LEADSLEAP = {
  /** Your LeadsLeap username (`ll_r`). Leave empty to disable every slot. */
  username: "lirikqu",
  /** Default number of ads; wide slots look best with 4, sidebars with 2. */
  ads: 4 as LeadsLeapAdCount,
  /** Responsive = full width of its container. */
  responsive: true,
  /** `ll_nh` — hide the widget's own "Links You May Like" header. */
  hideHeader: false,
  /** `ll_nc` — hide the category label under each link. */
  hideCategory: true,
  /**
   * `ll_np` — hide the Pro badge. LeadsLeap served the badge either way for a
   * free account; `hideInfoLine` is the flag that actually removes it.
   */
  hideProBadge: true,
  /** `ll_nt` — hide the "1234 visits" counter. */
  hideVisitInfo: false,
  /**
   * `ll_pa` — drops the whole "1234 visits · Pro" line. Verified: with `ll_pa=1`
   * the info row disappears from the served HTML, which also removes the badge.
   */
  hideInfoLine: false,
  /**
   * `ll_nm` — hide the "Add your links FREE" promo. LeadsLeap still puts that
   * link in the header (and moves it to the footer when the header is hidden),
   * so this only matters if they start honouring it again.
   */
  hideAffiliateLink: false,
} as const;

export const LEADSLEAP_PALETTES = {
  light: {
    background: "#ffffff",
    title: "#111827",
    text: "#475569",
    info: "#64748b",
    header: "#64748b",
  },
  dark: {
    background: "#111a2b",
    title: "#e8edf6",
    text: "#cbd5e1",
    info: "#94a3b8",
    header: "#94a3b8",
  },
} satisfies Record<"light" | "dark", LeadsLeapPalette>;

const SAFE_USERNAME = /^[A-Za-z0-9._-]+$/;

export function isLeadsLeapConfigured(): boolean {
  return SAFE_USERNAME.test(LEADSLEAP.username.trim());
}

/**
 * Height used before the first measurement. It must be greater than zero:
 * LeadsLeap's loader only boots the ad iframe once its wrapper has a visible
 * box, so a collapsed slot would never load.
 */
export function leadsLeapInitialHeight(ads: LeadsLeapAdCount): number {
  if (ads === 2) return 240;
  if (ads === 6) return 420;
  return 320;
}

/**
 * The relay forwards the rendered height to the host page. LeadsLeap tells its
 * own parent (`["setHeight", height, id]`) whenever it resizes, which is the
 * exact moment the wrapper grows, so that message schedules a measurement.
 * The wrapper starts at 50px until the widget renders, so anything shorter is
 * treated as "not ready yet" and left at the estimated height.
 */
const HEIGHT_RELAY = `
(function () {
  var last = 0;
  var MIN_RENDERED = 80;

  function measure() {
    var wrapper = null;
    var nodes = document.body ? document.body.children : [];
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].tagName === "DIV" && nodes[i].querySelector("iframe")) {
        wrapper = nodes[i];
        break;
      }
    }
    if (!wrapper) return;

    var frame = wrapper.querySelector("iframe");
    if (!frame || frame.getBoundingClientRect().height < MIN_RENDERED) return;

    var rect = wrapper.getBoundingClientRect();
    var height = Math.round(rect.top + rect.height + window.scrollY);
    if (height > 0 && height !== last) {
      last = height;
      window.parent.postMessage({ type: "leadsleap-height", height: height }, "*");
    }
  }

  function schedule() {
    window.setTimeout(measure, 80);
  }

  window.addEventListener("message", function (event) {
    var data = event.data;
    if (Object.prototype.toString.call(data) === "[object Array]" && data[0] === "setHeight") {
      schedule();
    }
  });
  window.addEventListener("load", schedule);
  window.addEventListener("resize", schedule);
  if (typeof ResizeObserver === "function") {
    try {
      new ResizeObserver(schedule).observe(document.body);
    } catch (error) {}
  }
  [600, 1500, 3000, 6000].forEach(function (ms) {
    window.setTimeout(measure, ms);
  });
})();
`;

export function buildLeadsLeapDocument({
  ads,
  palette,
}: {
  ads: LeadsLeapAdCount;
  palette: LeadsLeapPalette;
}): string {
  const username = SAFE_USERNAME.test(LEADSLEAP.username.trim())
    ? LEADSLEAP.username.trim()
    : "";

  const config: Record<string, string> = {
    ll_r: username,
    ll_bc: palette.background,
    ll_hc: palette.title,
    ll_tc: palette.text,
    ll_cc: palette.info,
    ll_dc: palette.header,
    ll_h: "250",
    ll_fw: LEADSLEAP.responsive ? "1" : "0",
    ll_nh: LEADSLEAP.hideHeader ? "1" : "0",
    ll_nm: LEADSLEAP.hideAffiliateLink ? "1" : "0",
    ll_nc: LEADSLEAP.hideCategory ? "1" : "0",
    ll_np: LEADSLEAP.hideProBadge ? "1" : "0",
    ll_nt: LEADSLEAP.hideVisitInfo ? "1" : "0",
    ll_pa: LEADSLEAP.hideInfoLine ? "1" : "0",
    ll_wt: "1",
    ll_n: String(ads),
  };

  const assignments = Object.entries(config)
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join(";");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  html, body { margin: 0; padding: 0; background: transparent; overflow: hidden; }
  body > div { min-height: 0; }
</style>
</head>
<body>
<script data-cfasync="false">${assignments};</script>
<script data-cfasync="false" src="https://w.leadsleap.com/js.js"></script>
<script>${HEIGHT_RELAY}</script>
</body>
</html>`;
}
