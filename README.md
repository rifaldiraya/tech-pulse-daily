# TechPulse

A production-ready, statically generated IT and technology magazine built with Next.js App Router, TypeScript, Tailwind CSS, and local Markdown files. There is no backend, database, CMS, external search service, or paid API. Markdown files in `content/articles/` are the single source of truth.

## Highlights

- Editorial homepage with breaking-news ticker, featured stories, latest news, editor-curated popular stories, and six section desks.
- Article pages with table of contents, reading progress, share/copy controls, author details, previous/next navigation, and related reading.
- Category archives with featured stories and pagination (`/category/[slug]` and `/category/[slug]/page/[n]`).
- Fully client-side search over titles, excerpts, categories, tags, authors, and article text (`/search`).
- Light and dark themes with a persistent preference.
- Static generation for every public page; only the search index and small interactions ship JavaScript.
- SEO metadata, Open Graph and Twitter cards, Article/Breadcrumb JSON-LD, `sitemap.xml`, and `robots.txt`.
- Custom 404, loading skeleton, and route error boundary.
- Markdown support for GFM tables, task lists, blockquotes, images, links, inline code, and syntax-highlighted fenced code blocks.
- A draft article is included as a live fixture to demonstrate that `draft: true` content is excluded from every public surface.

## Requirements

- Node.js 20.9 or newer (Node 22 recommended)
- npm 10 or newer

## Installation

```bash
npm install
cp .env.example .env.local
```

Set the canonical URL for your deployment in `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

In production this should be the full public origin, for example `https://techpulse.example.com`. On Vercel, `VERCEL_PROJECT_PRODUCTION_URL` is used as a fallback when the variable is absent.

## Newsletter

The newsletter form posts directly to [Buttondown](https://buttondown.com) using
its public embed endpoint, so delivery works without an API route, a secret key,
or any server code — the site stays fully static.

1. Create a Buttondown account and note your username from
   `https://buttondown.com/<username>`.
2. Add it to `.env.local` and `.env.example`:

```bash
NEXT_PUBLIC_BUTTONDOWN_USERNAME=your-username
```

3. Rebuild. `lib/newsletter.ts` derives the form `action` from the username and
   `components/Newsletter.tsx` switches from its disabled demo state to a live
   form. Leave the variable empty to keep the demo notice.

Submitting navigates to Buttondown's confirmation page, which sends the
double opt-in email. Subscriber data lives in Buttondown, not in this
repository. The privacy policy and terms pages read the same config and describe
whichever mode is active, so they never contradict the form.

## Development

```bash
npm run dev
```

Open <http://localhost:3000>.

Available scripts:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build and verify types |
| `npm run start` | Serve the production build |
| `npm run typecheck` | Run `tsc --noEmit` |

## Project structure

```text
app/
  articles/[slug]/          Article detail route (static params)
  category/[slug]/          Category page 1
  category/[slug]/page/[n]  Paginated category archive
  page/[n]                  Paginated latest-news archive
  search/                   Client-side search shell
  about|contact|privacy-policy|terms/
  layout.tsx  page.tsx  not-found.tsx  loading.tsx  error.tsx
  sitemap.ts  robots.ts  globals.css
components/                 Header, Footer, cards, grid, TOC, pagination, search UI, etc.
content/articles/           Markdown articles (source of truth)
lib/
  articles.ts               Content API: load, validate, filter, sort, relate, search
  categories.ts             Category registry and homepage desks
  markdown.ts               unified/remark/rehype pipeline and heading extraction
  search.ts                 Browser-safe search ranking
  seo.ts                    JSON-LD builders
  site.ts                   Site metadata and canonical URL helpers
  ads.ts  adsense.ts        Adsterra and Google AdSense configuration
  leadsleap.ts              LeadsLeap PPC widget configuration and palette
  format.ts  utils.ts       Formatting, pagination, slugs
public/
  images/articles/          Cover images and placeholder
  og.png  icon.svg
types/article.ts            Article and heading types
```

## Create a Markdown article

Add a `.md` file to `content/articles/`. The filename and the `slug` field should match; the slug field wins if they differ.

```markdown
---
title: "A Practical Introduction to Edge Caching"
slug: "practical-introduction-edge-caching"
description: "How edge caching works and where it helps a small team."
category: "Cloud Computing"
tags:
  - Cloud
  - Performance
  - Caching
author: "TechPulse Admin"
publishedAt: "2027-01-12"
updatedAt: "2027-01-14"
featured: false
popular: false
coverImage: "/images/articles/practical-introduction-edge-caching.png"
readingTime: 7
draft: false
---

# A Practical Introduction to Edge Caching

Opening paragraphs go here. The generated table of contents is built from H2 and H3 headings.

## Where caching helps

Body content with **bold**, *italic*, lists, tables, and links.

## Conclusion

Wrap up the argument.
```

### Frontmatter rules

| Field | Required | Notes |
| --- | --- | --- |
| `title` | Yes | Displayed as the article H1 and in metadata |
| `slug` | Yes | Lowercase URL segment; unique across the archive |
| `description` | Yes | Excerpt, card summary, and meta description |
| `category` | Yes | Must match a category `name` in `lib/categories.ts` |
| `tags` | Yes | Array of strings; used by search and tag links |
| `author` | Yes | Byline shown on the article page |
| `publishedAt` | Yes | `YYYY-MM-DD`; controls sort order |
| `updatedAt` | No | `YYYY-MM-DD`; shown when present |
| `featured` | No | Prioritises the article on the homepage and category page |
| `popular` | No | Editor-curated "Popular" placement; no fake view counts |
| `coverImage` | No | Falls back to `/images/articles/placeholder.png` |
| `readingTime` | No | Calculated from the content when omitted |
| `draft` | No | `true` hides the article from all public pages, search, and the sitemap |

Invalid or incomplete frontmatter is rejected by the loader rather than producing a broken page. A missing cover image falls back gracefully.

Article headings generate stable anchor IDs, so the table of contents and deep links stay consistent. Code fences are highlighted at build time with Shiki through `rehype-pretty-code`; no highlighter JavaScript is shipped to the browser.

## Add article images

1. Put the image in `public/images/articles/`.
2. Reference it from the article frontmatter with an absolute public path, for example `/images/articles/my-article.png`.
3. Prefer a 1200×750 (16:10) image under ~300 KB. The site renders covers through `next/image` with responsive sizes and lazy loading.
4. Add descriptive `alt` text in the Markdown for inline images. Cover images use the article title as their accessible description.

Never use remote image URLs unless you also configure `images.remotePatterns` in `next.config.ts`.

## Add or change categories

Categories live in [`lib/categories.ts`](lib/categories.ts). Each entry has a slug, display name, description, short label, and count. To add one:

1. Add the category to the `CATEGORIES` array with a unique `slug` and matching `name`.
2. Optionally expose it in the header or a homepage desk by updating `HOME_SECTIONS`.
3. Use the exact category `name` in article frontmatter.
4. Category routes, navigation, search facets, and the sitemap pick it up automatically.

A category page is generated only when at least one published article uses it.

## Publish a new article

1. Create the Markdown file and cover image.
2. Set `draft: false` (or omit the field).
3. Run `npm run typecheck` and `npm run build`.
4. Commit the content and image together.
5. Deploy. Static routes for the new article are generated during the build from `generateStaticParams()`.

To unpublish, set `draft: true`. The article disappears from the homepage, category pages, related reading, search, and the sitemap on the next build.

## Search

Search runs entirely in the browser. `getSearchIndex()` serialises published article summaries and searchable text into the search route; `rankSearchDocuments()` scores matches across titles, tags, categories, excerpts, authors, and body text. Query state is reflected in `?q=`, and draft articles are never added to the index. No query leaves the browser.

## Advertising

Third-party ad units are configured in `lib/adsense.ts`, `lib/ads.ts`, and
`lib/leadsleap.ts`; each one can be disabled by clearing its ID or flipping its
`enabled` flag.

- `lib/adsense.ts` — Google AdSense publisher ID. `components/AdSenseScript.tsx`
  renders the loader in the root layout `<head>` of every page, which also
  enables Auto ads after approval. `public/ads.txt` authorises the same
  publisher ID and is served at `/ads.txt`.
- `lib/ads.ts` — Adsterra banner, native, social bar, and popunder units.
  Banner components live in `components/AdSlot.tsx` and are placed on the
  homepage and article pages.
- `lib/leadsleap.ts` — LeadsLeap PPC Ad Widget. Set `username` to the value of
  `ll_r` in the code LeadsLeap generates (Member Area → PPC Ad Widget → Get
  Code); while it is empty every `components/LeadsLeapAd.tsx` slot renders
  nothing. The widget is mounted after the latest-articles grid on the
  homepage and at the end of each article. It renders in a sandboxed iframe
  because its loader uses `document.write`, and it reports its own height back
  over `postMessage` so the slot never scrolls or leaves a gap. Colours come
  from `LEADSLEAP_PALETTES` and follow the site theme; below 480px the widget
  drops to 2 ads. Recommended dashboard settings: **Responsive** widget, **4**
  ads (2 on narrow screens), colours matching the palettes, **Bold** checked,
  **Hide Header** unchecked (keeps the third-party disclosure). The slot
  replaces the Adsterra `NativeAd` position; re-add `<NativeAd />` next to it
  if both networks should run.

  Two LeadsLeap quirks are worth knowing. `ll_nm` ("Hide Your Affiliate Link")
  does not remove the "Add your links FREE" promo — LeadsLeap keeps it in the
  header and moves it to the footer when the header is hidden. And `ll_np`
  ("Hide Pro Badge") has no effect for a free account; the badge lives inside
  the "1234 visits" row, so set `hideInfoLine: true` to drop the whole line.
- The Adsterra social bar and popunder are **disabled** (`enabled: false`) and
  their mounts in `app/layout.tsx` are commented out. Both are page-level
  overlays: the popunder violates AdSense navigation policy, and the social bar
  competes with AdSense anchor ads. The units and script URLs stay in the repo
  so they can be switched back on by flipping the flags and uncommenting the
  two components.

Ad networks load third-party scripts and may set cookies. Review the privacy
policy and any consent requirements for your jurisdiction before launch.

## Honest limitations

- **Newsletter:** the form is disabled and labelled as not connected until `NEXT_PUBLIC_BUTTONDOWN_USERNAME` is set. Once configured it posts straight to Buttondown and shows no fake success state — the browser leaves the site for Buttondown's confirmation page.
- **Contact form:** there is no form handler or inbox. The contact page lists illustrative `.example` addresses and explains what to configure in a real deployment.
- **Sample content:** all articles are educational/editorial demonstrations, not real reporting. Bylines are sample personas. Do not present them as current news.
- **View counts:** "Popular" is editor metadata, not analytics. The site does not collect reader behaviour.

## Rendering notes

Every route is prerendered at build time, so navigation never waits on a server render. There is deliberately **no route-level `loading.tsx`**: adding a Suspense boundary makes Next.js stream a fallback shell first and inject the real page afterwards, which would push the article body out of the initial HTML. With the boundary removed, `/articles/<slug>` ships its full Markdown output, headings, and JSON-LD in the first response for crawlers and no-JS readers.

Loading feedback still exists where it is meaningful:

- Search results update instantly through `useDeferredValue`, with an `aria-live` result count.
- `app/error.tsx` handles render failures and `app/not-found.tsx` renders the branded 404.
- Images below the fold lazy-load through `next/image` with responsive `sizes`.

## Deploy to Vercel

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected framework preset (**Next.js**) and the default build command (`npm run build`).
4. Add an environment variable for Production and Preview:
   - `NEXT_PUBLIC_SITE_URL=https://your-domain.com`
5. Deploy. No database, server, API key, or paid service is required.

After the first deploy, add your custom domain in Vercel and update `NEXT_PUBLIC_SITE_URL` to match it so canonical URLs, Open Graph URLs, JSON-LD, and the sitemap all use the public origin.

## Verification

```bash
npm run typecheck
npm run build
npm run start
```

Then check:

- `/` and `/page/2` render the latest archive.
- `/articles/<slug>` renders Markdown, TOC anchors, JSON-LD, and related stories.
- `/category/<slug>` and paginated category paths return 404 only when no further page exists.
- `/search?q=security` filters results in the browser.
- `/articles/edge-rendering-in-practice` returns 404 because it is a draft.
- `/sitemap.xml` and `/robots.txt` resolve.
