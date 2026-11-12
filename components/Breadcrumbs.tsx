import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/format";

export interface Breadcrumb {
  name: string;
  href: string;
}

export function Breadcrumbs({
  items,
  className,
}: {
  items: Breadcrumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-xs text-muted", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {index > 0 ? <ChevronRight className="size-3 text-muted/70" aria-hidden="true" /> : null}
              {isLast ? (
                <span aria-current="page" className="font-medium text-ink">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="transition-colors hover:text-brand">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
