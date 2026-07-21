"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Mail, MapPin, Phone, Send, Twitter, ArrowUp, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { siteConfig, legalDisclaimer } from "@/lib/site";
import { Button } from "@/components/ui/button";

const footerGroups = [
  {
    title: "Quick Links",
    links: [
      ["Shop Catalog", "/shop"],
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
      ["Trade-In Program", "/trade-in"]
    ]
  },
  {
    title: "Company & Legal",
    links: [
      ["About Us", "/about"],
      ["Privacy Policy", "/privacy-policy"],
      ["Terms of Service", "/terms"],
      ["Admin Portal", "/admin"]
    ]
  }
];

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/vendor")) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            
            <div className="mt-6 space-y-2.5 text-xs text-zinc-300">
              <p className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-brand-blue" aria-hidden="true" /> {siteConfig.address}
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-brand-blue" aria-hidden="true" /> {siteConfig.phone}
              </p>
              <p className="flex items-center gap-2.5">
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

        {/* Unified Single Newsletter Subscription Block */}
        <div className="mt-12 grid gap-5 rounded-[2.5rem] bg-white/8 p-6 md:grid-cols-[1fr_auto] md:items-center border border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">Join the TroyX Insider Newsletter</h2>
            <p className="mt-1 text-xs text-zinc-300">Get restock alerts, exclusive merchant discounts, and Apple buying guides across Ghana.</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email address"
              aria-label="Email address"
              className="focus-ring h-11 min-w-0 flex-1 rounded-full border border-white/10 bg-white px-4 text-xs text-brand-ink placeholder-zinc-500"
            />
            <Button type="submit" className="h-11 px-5 bg-brand-blue text-white font-bold hover:bg-brand-blue/90" aria-label="Subscribe">
              <Send className="h-4 w-4 mr-1.5" />
              Subscribe
            </Button>
          </form>
        </div>

        {/* Trust, Payment Methods & Delivery Partners Row */}
        <div className="mt-10 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Accepted Payment Methods</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">MTN MoMo, Telecel Cash, Visa, Mastercard, Paystack</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-brand-blue shrink-0" />
            <div>
              <p className="font-bold text-white">Nationwide Ghana Delivery</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Same-day Accra pickup or 1-3 days nationwide dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-purple-400 shrink-0" />
            <div>
              <p className="font-bold text-white">100% Genuine Guarantee</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Official 12-Month TroyX Ghana Warranty included</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom bar & Back to Top */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} TroyX iStore Ghana. All Rights Reserved.</p>

          <div className="flex items-center gap-4">
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

            <button
              onClick={scrollToTop}
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-white/20 transition"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
