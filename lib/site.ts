export const SITE = {
  name: "TechPulse",
  title: "TechPulse — IT & Technology News, Explained",
  description:
    "Independent technology journalism and practical engineering guides covering AI, software development, cybersecurity, cloud, hardware, Linux, and more.",
  tagline: "Technology, decoded.",
  locale: "en_US",
  author: "TechPulse Admin",
  email: "editorial@techpulse.example",
  social: [
    { label: "X", href: "https://x.com/techpulse", handle: "@techpulse" },
    { label: "GitHub", href: "https://github.com/techpulse" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/techpulse" },
    { label: "RSS", href: "/feed.xml" },
  ],
} as const;

export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "") ||
    "http://localhost:3000";

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, "");
}

export function absoluteUrl(pathname = "/"): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${getSiteUrl()}${path === "/" ? "" : path}`;
}
