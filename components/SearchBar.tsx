"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/format";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  id?: string;
  className?: string;
  size?: "md" | "lg";
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search articles, topics, and tags…",
  autoFocus = false,
  id = "search-input",
  className,
  size = "lg",
}: SearchBarProps) {
  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
      className={cn("relative", className)}
    >
      <label htmlFor={id} className="sr-only">
        Search articles
      </label>
      <Search
        className={cn(
          "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted",
          size === "lg" ? "size-5" : "size-4",
        )}
        aria-hidden="true"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        enterKeyHint="search"
        className={cn(
          "w-full rounded-xl border border-hairline bg-canvas pl-12 pr-12 font-medium text-ink shadow-sm outline-none transition-colors placeholder:font-normal placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/20",
          size === "lg" ? "h-14 text-base" : "h-11 text-sm",
        )}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-ink"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </form>
  );
}
