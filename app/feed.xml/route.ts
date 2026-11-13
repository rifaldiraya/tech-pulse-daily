import { getAllArticles } from "@/lib/articles";
import { SITE, absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Static RSS 2.0 feed so readers and aggregators can follow new reporting. */
export function GET() {
  const articles = getAllArticles();
  const lastBuildDate = articles[0]
    ? new Date(articles[0].updatedAt || articles[0].publishedAt).toUTCString()
    : new Date(0).toUTCString();

  const items = articles
    .map((article) => {
      const url = absoluteUrl(`/articles/${article.slug}`);
      return [
        "    <item>",
        `      <title>${escapeXml(article.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <description>${escapeXml(article.description)}</description>`,
        `      <category>${escapeXml(article.category)}</category>`,
        `      <dc:creator>${escapeXml(article.author)}</dc:creator>`,
        `      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.title)}</title>
    <link>${escapeXml(absoluteUrl("/"))}</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(absoluteUrl("/feed.xml"))}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
