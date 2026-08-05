"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

const segmentLabels: Record<string, string> = {
  "apple-accessories": "Apple Accessories",
  "apple-watch": "Apple Watch",
  cart: "Cart",
  categories: "Categories",
  checkout: "Checkout",
  compare: "Compare",
  contact: "Contact",
  dashboard: "Account",
  faq: "FAQ",
  "forgot-password": "Forgot Password",
  gaming: "Gaming",
  "gaming-accessories": "Gaming Accessories",
  "gaming-consoles": "Gaming Consoles",
  ipads: "iPads",
  iphones: "iPhones",
  login: "Login",
  macbooks: "MacBooks",
  "order-history": "Order History",
  "order-tracking": "Order Tracking",
  "privacy-policy": "Privacy Policy",
  product: "Product",
  register: "Register",
  "repair-booking": "Repair Booking",
  search: "Search",
  "shipping-policy": "Shipping Policy",
  shop: "Shop",
  terms: "Terms",
  "trade-in": "Trade-In",
  wishlist: "Wishlist"
};

function humanizeSegment(segment: string) {
  return (
    segmentLabels[segment] ||
    segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

export function BreadcrumbTrail() {
  const pathname = usePathname();

  if (!pathname || pathname === "/" || pathname.startsWith("/admin")) {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const isLast = index === segments.length - 1;
    return { href, isLast, label: humanizeSegment(segment) };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-black/5 bg-white/75 py-3 backdrop-blur dark:border-white/10 dark:bg-zinc-950/70"
    >
      <ol className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 text-xs font-semibold text-zinc-500 sm:px-6 lg:px-8">
        <li>
          <Link
            href="/"
            className="focus-ring rounded-full px-2 py-1 text-zinc-600 transition hover:text-brand-blue dark:text-zinc-300"
          >
            Home
          </Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.href} className="flex shrink-0 items-center gap-2">
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
            {crumb.isLast ? (
              <span
                aria-current="page"
                className="rounded-full bg-brand-blue/10 px-2 py-1 text-brand-blue"
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="focus-ring rounded-full px-2 py-1 text-zinc-600 transition hover:text-brand-blue dark:text-zinc-300"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
