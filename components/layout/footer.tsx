"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Mail, MapPin, Phone, Send, Twitter } from "lucide-react";
import { siteConfig, legalDisclaimer } from "@/lib/site";
import { Button } from "@/components/ui/button";

const footerGroups = [
  {
    title: "Quick Links",
    links: [
      ["Shop", "/shop"],
      ["Browse Stores", "/stores"],
      ["Best Sellers", "/shop?sort=best"],
      ["New Arrivals", "/shop?sort=new"]
    ]
  },
  {
    title: "Sell on TroyX",
    links: [
      ["Open a Store", "/sell"],
      ["Vendor Portal", "/vendor"],
      ["Marketplace Pricing", "/sell#pricing"],
      ["Seller Terms", "/terms#seller"]
    ]
  },
  {
    title: "Support & Repair",
    links: [
      ["Contact Us", "/contact"],
      ["FAQ", "/faq"],
      ["Order Tracking", "/order-tracking"],
      ["Repair Booking", "/repair-booking"],
      ["Trade-In", "/trade-in"]
    ]
  },
  {
    title: "Company & Legal",
    links: [
      ["About Us", "/about"],
      ["Privacy Policy", "/privacy-policy"],
      ["Terms", "/terms"],
      ["Admin Portal", "/admin"]
    ]
  }
];

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/vendor")) {
    return null;
  }

  return (
    <footer className="border-t border-black/5 bg-brand-ink text-white dark:border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-base font-bold text-brand-ink">
                TX
              </span>
              <div>
                <p className="font-semibold">{siteConfig.name}</p>
                <p className="text-sm text-zinc-300">{siteConfig.tagline}</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-6 text-zinc-300">{siteConfig.description}</p>
            <p className="mt-4 max-w-md text-xs leading-5 text-zinc-400">{legalDisclaimer}</p>
            <div className="mt-6 space-y-3 text-sm text-zinc-300">
              <p className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-brand-blue" aria-hidden="true" /> {siteConfig.address}
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-brand-blue" aria-hidden="true" /> {siteConfig.phone}
              </p>
              {siteConfig.phoneAlt && (
                <p className="flex items-center gap-3 pl-7">
                  {siteConfig.phoneAlt}
                </p>
              )}
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-brand-blue" aria-hidden="true" /> {siteConfig.email}
              </p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-semibold">{group.title}</h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map(([label, href]) => (
                    <li key={href}>
                      <Link href={href} className="text-sm text-zinc-300 transition hover:text-white">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-5 rounded-[2rem] bg-white/8 p-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-lg font-semibold">Newsletter</h2>
            <p className="mt-1 text-sm text-zinc-300">Get restock alerts, offers, and expert buying guides.</p>
          </div>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              aria-label="Email address"
              className="focus-ring h-11 min-w-0 flex-1 rounded-full border border-white/10 bg-white px-4 text-sm text-brand-ink"
            />
            <Button type="submit" className="h-11 px-4" aria-label="Subscribe">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 TroyX iStore. All Rights Reserved.</p>
          <div className="flex items-center gap-3">
            <Link href={siteConfig.socials.instagram} aria-label="Instagram" className="hover:text-white">
              <Instagram className="h-4 w-4" />
            </Link>
            <Link href={siteConfig.socials.facebook} aria-label="Facebook" className="hover:text-white">
              <Facebook className="h-4 w-4" />
            </Link>
            <Link href={siteConfig.socials.x} aria-label="X" className="hover:text-white">
              <Twitter className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
