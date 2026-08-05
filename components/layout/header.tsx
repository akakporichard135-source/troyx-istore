"use client";

import Link from "next/link";
import {
  ChevronDown,
  Heart,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  User,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useCommerceStore } from "@/context/store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/shop", label: "Store" },
  { href: "/macbooks", label: "Mac" },
  { href: "/ipads", label: "iPad" },
  { href: "/iphones", label: "iPhone" },
  { href: "/apple-watch", label: "Watch" },
  { href: "/vision", label: "Vision" },
  { href: "/airpods", label: "AirPods" },
  { href: "/apple-accessories", label: "Accessories" },
  { href: "/gaming", label: "Entertainment" },
  { href: "/support", label: "Support" }
];

const compactDesktopLinks = links.slice(0, 6);
const moreDesktopLinks = links.slice(6);

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const cartCount = useCommerceStore((state) =>
    state.cart.reduce((sum, item) => sum + item.quantity, 0)
  );
  const wishlistCount = useCommerceStore((state) => state.wishlist.length);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 shadow-sm shadow-black/[0.02] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/95">
      <nav
        className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8"
        aria-label="Main"
      >
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-full">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-ink text-base font-bold text-white dark:bg-white dark:text-brand-ink">
            TX
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-semibold text-brand-ink dark:text-white">
              TroyX iStore
            </span>
            <span className="block text-xs text-zinc-500 dark:text-zinc-400">
              Home of Original Apple Products
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {compactDesktopLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "focus-ring rounded-full px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-black/5 hover:text-brand-ink dark:text-zinc-200 dark:hover:bg-white/10 dark:hover:text-white",
                pathname === link.href &&
                  "bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/15 dark:text-blue-300"
              )}
            >
              {link.label}
            </Link>
          ))}
          <details className="group relative">
            <summary className="focus-ring flex cursor-pointer list-none items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-black/5 hover:text-brand-ink dark:text-zinc-200 dark:hover:bg-white/10 dark:hover:text-white [&::-webkit-details-marker]:hidden">
              More
              <ChevronDown className="h-3.5 w-3.5 transition group-open:rotate-180" />
            </summary>
            <div className="absolute right-0 top-11 z-50 min-w-56 rounded-2xl border border-black/10 bg-white p-2 shadow-2xl dark:border-white/10 dark:bg-zinc-950">
              {moreDesktopLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "block rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-black/5 hover:text-brand-ink dark:text-zinc-200 dark:hover:bg-white/10 dark:hover:text-white",
                    pathname === link.href &&
                      "bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/15 dark:text-blue-300"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </details>
        </div>

        <div className="flex items-center gap-2">
          <IconLink href="/search" label="Search">
            <Search className="h-4 w-4" />
          </IconLink>
          <IconLink
            href="/wishlist"
            label="Wishlist"
            count={wishlistCount}
            mounted={mounted}
            className="hidden sm:inline-flex"
          >
            <Heart className="h-4 w-4" />
          </IconLink>
          <IconLink href="/cart" label="Cart" count={cartCount} mounted={mounted}>
            <ShoppingBag className="h-4 w-4" />
          </IconLink>
          <IconLink href="/dashboard" label="Account" className="hidden sm:inline-flex">
            <User className="h-4 w-4" />
          </IconLink>
          <span className="hidden sm:inline-flex">
            <ThemeToggle />
          </span>
          <button
            type="button"
            aria-label="Open menu"
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white lg:hidden dark:border-white/10 dark:bg-white/10"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>
      <div
        className={cn(
          "grid border-t border-black/5 transition-all lg:hidden dark:border-white/10",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden bg-white/95 backdrop-blur dark:bg-zinc-950/95">
          <div className="mx-auto grid max-w-7xl gap-2 px-4 py-4 sm:grid-cols-2 sm:px-6">
            <Link
              href="/wishlist"
              className="rounded-2xl px-4 py-3 text-sm font-semibold text-zinc-700 hover:bg-black/5 dark:text-zinc-200 dark:hover:bg-white/10 sm:hidden"
              onClick={() => setOpen(false)}
            >
              Wishlist {mounted && wishlistCount ? `(${wishlistCount})` : ""}
            </Link>
            <Link
              href="/dashboard"
              className="rounded-2xl px-4 py-3 text-sm font-semibold text-zinc-700 hover:bg-black/5 dark:text-zinc-200 dark:hover:bg-white/10 sm:hidden"
              onClick={() => setOpen(false)}
            >
              Account
            </Link>
            <button
              type="button"
              className="flex items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-zinc-700 hover:bg-black/5 dark:text-zinc-200 dark:hover:bg-white/10 sm:hidden"
              onClick={() => {
                setTheme(resolvedTheme === "dark" ? "light" : "dark");
                setOpen(false);
              }}
            >
              <Moon className="h-4 w-4" />
              Toggle Theme
            </button>
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm font-semibold text-zinc-700 hover:bg-black/5 dark:text-zinc-200 dark:hover:bg-white/10",
                  pathname === link.href &&
                    "bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/15 dark:text-blue-300"
                )}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function IconLink({
  href,
  label,
  count,
  children,
  className,
  mounted = true
}: {
  href: string;
  label: string;
  count?: number;
  children: ReactNode;
  className?: string;
  mounted?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={cn(
        "focus-ring relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-brand-ink transition hover:text-brand-blue dark:border-white/10 dark:bg-white/10 dark:text-white",
        className
      )}
    >
      {children}
      {mounted && Boolean(count) && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-blue px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
