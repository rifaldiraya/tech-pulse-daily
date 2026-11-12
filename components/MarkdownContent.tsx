import { cn } from "@/lib/format";

interface MarkdownContentProps {
  html: string;
  className?: string;
}

/**
 * Renders Markdown that was converted to HTML at build time from trusted files
 * in `content/articles`. Raw HTML in Markdown is disabled in the pipeline.
 */
export function MarkdownContent({ html, className }: MarkdownContentProps) {
  if (!html) {
    return (
      <p className="rounded-xl border border-dashed border-hairline bg-subtle p-6 text-sm text-muted">
        This article does not have any content yet.
      </p>
    );
  }

  return (
    <div
      className={cn("article-prose", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
