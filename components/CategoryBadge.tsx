import Link from "next/link";
import { cn } from "@/lib/format";

interface CategoryBadgeProps {
  name: string;
  slug: string;
  className?: string;
  size?: "sm" | "md";
}

export function CategoryBadge({ name, slug, className, size = "sm" }: CategoryBadgeProps) {
  return (
    <Link
      href={`/category/${slug}`}
      className={cn(
        "inline-flex items-center rounded-full font-bold uppercase tracking-[0.12em] text-brand transition-colors hover:text-brand-strong",
        size === "sm" ? "text-[0.6875rem]" : "text-xs",
        className,
      )}
    >
      {name}
    </Link>
  );
}
