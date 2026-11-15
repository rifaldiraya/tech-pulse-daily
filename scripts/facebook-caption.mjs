#!/usr/bin/env node
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ARTICLES_DIR = join(ROOT, "content", "articles");

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};

const count = Number(flag("count", 2));
const slug = flag("slug");
const out = flag("out");
const domain = (flag("domain") || process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(
  /\/+$/,
  "",
);

// Captions get copied into a post, so a dead placeholder link is worse than a loud warning.
if (/example\.(com|org|net)$|\/\/localhost/.test(domain)) {
  console.error(
    `[captions] Warning: "${domain}" is a placeholder. Pass --domain or set NEXT_PUBLIC_SITE_URL before posting.`,
  );
}

const MAX_HASHTAGS = 6;

function hashtag(value) {
  const cleaned = String(value)
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, "");

  return cleaned ? `#${cleaned}` : "";
}

function loadArticles() {
  return readdirSync(ARTICLES_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const raw = readFileSync(join(ARTICLES_DIR, file), "utf8");
      const { data } = matter(raw);

      return data.draft ? null : { ...data, file };
    })
    .filter(Boolean)
    .sort((a, b) => Date.parse(b.publishedAt ?? b.date) - Date.parse(a.publishedAt ?? a.date));
}

function tagsFor(article, limit = MAX_HASHTAGS) {
  const tags = [...(article.tags ?? []), "TechPulseDaily"].map(hashtag).filter(Boolean);

  return [...new Set(tags)].slice(0, limit).join(" ");
}

function link(article) {
  return `${domain}/articles/${article.slug}`;
}

function longCaption(article) {
  const reading = article.readingTime ? `${article.readingTime} min read` : "read";

  return [
    article.title,
    "",
    article.description,
    "",
    `Full breakdown (${reading}):`,
    `👉 ${link(article)}`,
    "",
    tagsFor(article),
  ].join("\n");
}

function shortCaption(article) {
  return [
    article.title,
    "",
    article.description,
    "",
    `👉 ${link(article)}`,
    "",
    tagsFor(article, 3),
  ].join("\n");
}

const articles = loadArticles();
const selected = slug
  ? articles.filter((article) => article.slug === slug).slice(0, 1)
  : articles.slice(0, count);

if (selected.length === 0) {
  console.error(`No published article found${slug ? ` for slug "${slug}"` : ""}.`);
  process.exit(1);
}

const blocks = selected.map((article) =>
  [
    `<!-- ${article.file} · ${article.publishedAt ?? article.date} -->`,
    "## Long caption",
    "```text",
    longCaption(article),
    "```",
    "",
    "## Short caption",
    "```text",
    shortCaption(article),
    "```",
  ].join("\n"),
);

const output = `# Facebook captions\n\n${blocks.join("\n\n---\n\n")}\n`;

if (out) {
  const target = resolve(ROOT, out);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, output, "utf8");
  console.error(`Wrote ${out} (${selected.length} caption set(s)).`);
} else {
  process.stdout.write(output);
}
