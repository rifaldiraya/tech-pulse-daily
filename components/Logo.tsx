import Link from "next/link";
import { Activity } from "lucide-react";
import { cn } from "@/lib/format";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="TechPulse home"
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-md focus-visible:outline-offset-4",
        className,
      )}
    >
      <span className="grid size-9 place-items-center rounded-lg bg-brand text-white shadow-sm transition-transform duration-300 group-hover:-rotate-6">
        <Activity className="size-5" strokeWidth={2.6} aria-hidden="true" />
      </span>
      <span className="text-[1.3rem] font-extrabold leading-none tracking-[-0.035em] text-ink">
        Tech<span className="text-brand">Pulse</span>
      </span>
    </Link>
  );
}
