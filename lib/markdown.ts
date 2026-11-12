import GithubSlugger from "github-slugger";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import type { Element, Root as HastRoot } from "hast";
import type { Heading as MdastHeading, Root as MdastRoot } from "mdast";
import type { Heading } from "@/types/article";

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

function extractYouTubeId(input: string): string | null {
  const value = input.trim();
  if (YOUTUBE_ID.test(value)) return value;

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0];
      return YOUTUBE_ID.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      const id =
        url.searchParams.get("v") ??
        url.pathname.match(/\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{11})/)?.[1];
      return id && YOUTUBE_ID.test(id) ? id : null;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Turns a fenced code block with the `youtube` language into a privacy-friendly
 * embed. Markdown is rendered without raw HTML, so embeds can only be created
 * through this controlled path.
 *
 * ```youtube
 * https://www.youtube.com/watch?v=VIDEO_ID
 * ```
 */
function rehypeYouTube() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (!parent || index === undefined || node.tagName !== "pre") return;

      const code = node.children.find(
        (child): child is Element => child.type === "element" && child.tagName === "code",
      );
      if (!code) return;

      const className = code.properties?.className;
      const classes = Array.isArray(className) ? className.map(String) : [];
      if (!classes.includes("language-youtube")) return;

      const source = code.children
        .map((child) => (child.type === "text" ? child.value : ""))
        .join("")
        .trim();
      const id = extractYouTubeId(source);
      if (!id) return;

      const wrapper: Element = {
        type: "element",
        tagName: "div",
        properties: { className: ["youtube-embed"] },
        children: [
          {
            type: "element",
            tagName: "iframe",
            properties: {
              src: `https://www.youtube-nocookie.com/embed/${id}`,
              title: "Embedded YouTube video",
              loading: "lazy",
              allowFullScreen: true,
              allow:
                "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
              referrerPolicy: "strict-origin-when-cross-origin",
            },
            children: [],
          },
        ],
      };

      parent.children[index] = wrapper;
    });
  };
}

/** Adds lazy loading to inline images and safe rel attributes to outbound links. */
function rehypeContentAttributes() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "img") {
        node.properties = {
          ...node.properties,
          loading: "lazy",
          decoding: "async",
        };
      }

      if (node.tagName === "a") {
        const href = String(node.properties?.href ?? "");
        if (/^https?:\/\//i.test(href)) {
          node.properties = {
            ...node.properties,
            target: "_blank",
            rel: ["noopener", "noreferrer"],
          };
        }
      }
    });
  };
}

function mdastText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const record = node as { value?: unknown; children?: unknown[] };
  if (typeof record.value === "string") return record.value;
  if (Array.isArray(record.children)) {
    return record.children.map((child) => mdastText(child)).join("");
  }
  return "";
}

/**
 * Extracts an H2/H3 table of contents while running every heading through the
 * same slugger used by rehype-slug, so anchor links always match rendered IDs.
 */
export function extractHeadings(markdown: string): Heading[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown) as MdastRoot;
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];

  visit(tree, "heading", (node: MdastHeading) => {
    const text = mdastText(node).replace(/\s+/g, " ").trim();
    const id = slugger.slug(text);

    if (text && (node.depth === 2 || node.depth === 3)) {
      headings.push({ id, text, level: node.depth });
    }
  });

  return headings;
}

const baseProcessor = () =>
  unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeYouTube)
    .use(rehypeSlug);

const highlightProcessor = baseProcessor()
  .use(rehypePrettyCode, {
    theme: "github-dark-default",
    keepBackground: false,
    defaultLang: "text",
  })
  .use(rehypeContentAttributes)
  .use(rehypeStringify);

const plainProcessor = baseProcessor()
  .use(rehypeContentAttributes)
  .use(rehypeStringify);

/** Renders trusted local Markdown to an HTML string at build time. */
export async function renderMarkdown(markdown: string): Promise<string> {
  try {
    return String(await highlightProcessor.process(markdown));
  } catch (error) {
    console.warn("[markdown] Syntax highlighting failed, using plain rendering:", error);
    return String(await plainProcessor.process(markdown));
  }
}
