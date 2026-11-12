"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/format";

const PRIMARY_NAV = [
  { label: "Home", href: "/" },
  { label: "AI & ML", href: "/category/artificial-intelligence" },
  { label: "Software", href: "/category/nextjs-development" },
  { label: "Security", href: "/category/cybersecurity" },
  { label: "Hardware", href: "/category/hardware" },
];

const SECONDARY_NAV = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
];

export function Header() {
  const pathname = usePathname();
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSectionsOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!sectionsOpen) return;

    function onPointerDown(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setSectionsOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSectionsOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [sectionsOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-[var(--header)] backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-7">
          <Logo />
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-[0.8125rem] font-semibold transition-colors",
                  isActive(item.href)
                    ? "text-brand"
                    : "text-ink/80 hover:bg-subtle hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            ))}

            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setSectionsOpen((open) => !open)}
                aria-expanded={sectionsOpen}
                aria-haspopup="true"
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-3 py-2 text-[0.8125rem] font-semibold transition-colors",
                  sectionsOpen ? "bg-subtle text-ink" : "text-ink/80 hover:bg-subtle hover:text-ink",
                )}
              >
                Sections
                <ChevronDown
                  className={cn("size-3.5 transition-transform", sectionsOpen && "rotate-180")}
                  aria-hidden="true"
                />
              </button>

              {sectionsOpen ? (
                <div className="absolute left-0 top-full z-50 mt-2 w-[36rem] overflow-hidden rounded-xl border border-hairline bg-card p-2 shadow-xl shadow-navy/10">
                  <div className="grid grid-cols-2 gap-1">
                    {CATEGORIES.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/category/${category.slug}`}
                        className="group rounded-lg px-3 py-2.5 transition-colors hover:bg-subtle"
                      >
                        <span className="block text-[0.8125rem] font-semibold text-ink group-hover:text-brand">
                          {category.name}
                        </span>
                        <span className="mt-0.5 block line-clamp-1 text-[0.6875rem] text-muted">
                          {category.tagline}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-0.5">
          <Link
            href="/search"
            aria-label="Search articles"
            className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-ink"
          >
            <Search className="size-[1.15rem]" aria-hidden="true" />
          </Link>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="ml-0.5 grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-subtle lg:hidden"
          >
            {mobileOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-navigation"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-hairline bg-canvas lg:hidden"
        >
          <nav aria-label="Mobile" className="container-page py-5">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.16em] text-muted">
              Sections
            </p>
            <div className="mt-2 grid grid-cols-2 gap-1">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-subtle hover:text-brand"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            <div className="mt-5 border-t border-hairline pt-4">
              <div className="grid grid-cols-2 gap-1">
                {SECONDARY_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-subtle hover:text-ink"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/search"
              className="mt-4 flex h-11 items-center justify-center gap-2 rounded-lg bg-brand text-sm font-semibold text-white"
            >
              <Search className="size-4" aria-hidden="true" />
              Search TechPulse
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
