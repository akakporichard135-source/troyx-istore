import React from "react";
import Link from "next/link";
import { FooterColumn } from "@/lib/types";

interface FooterProps {
  columns?: FooterColumn[];
}

export default function Footer({
  columns = [
    {
      id: "shop",
      columnTitle: "Shop & Learn",
      links: [
        { label: "Store", href: "/store" },
        { label: "Mac", href: "/mac" },
        { label: "iPad", href: "/ipad" },
        { label: "iPhone", href: "/iphone" },
        { label: "Apple Watch", href: "/watch" },
        { label: "AirPods", href: "/airpods" },
        { label: "Accessories", href: "/accessories" },
        { label: "Compare Models", href: "/compare" },
      ],
    },
    {
      id: "troyx",
      columnTitle: "TroyX iStore",
      links: [
        { label: "About TroyX", href: "/about" },
        { label: "Location & Directions", href: "/contact" },
        { label: "Delivery Information", href: "/delivery" },
        { label: "Warranty Information", href: "/warranty" },
        { label: "Deals & Promotions", href: "/deals" },
      ],
    },
    {
      id: "support",
      columnTitle: "Customer Care",
      links: [
        { label: "Call: 0207137437", href: "tel:0207137437" },
        { label: "Call: 0548974717", href: "tel:0548974717" },
        { label: "WhatsApp Assistance", href: "https://wa.me/233207137437" },
        { label: "TikTok: @troyx_istore", href: "https://tiktok.com/@troyx_istore" },
        { label: "Contact Form", href: "/contact" },
      ],
    },
    {
      id: "legal",
      columnTitle: "Legal & Guidelines",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Showroom Hours", href: "/contact" },
      ],
    },
  ],
}: FooterProps) {
  return (
    <footer className="bg-[#f5f5f7] dark:bg-[#161617] text-[#6e6e73] dark:text-[#86868b] text-[11px] leading-relaxed border-t border-[#d2d2d7] dark:border-[#333336]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Footnote Disclaimers */}
        <div className="border-b border-[#d2d2d7] dark:border-[#333336] pb-6 space-y-2 text-[11px]">
          <p>
            * TroyX iStore is an independent electronics retailer located in Bawaleshie, East Legon,
            Accra, Ghana, specializing in original Apple products. We do not claim Apple-authorized
            reseller status. Apple, iPhone, Mac, iPad, Apple Watch, and AirPods are registered
            trademarks of Apple Inc.
          </p>
          <p>
            All catalog prices are quoted in Ghana cedi (GH₵). Showroom pickup is available at our East
            Legon location. Inquiries and reservations can be confirmed via phone or WhatsApp.
          </p>
        </div>

        {/* Multi-Column Directory */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
          {columns.map((col) => (
            <div key={col.id} className="space-y-3">
              <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] text-[12px]">
                {col.columnTitle}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="hover:text-[#1d1d1f] dark:hover:text-[#ffffff] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Store Info & Copyright */}
        <div className="border-t border-[#d2d2d7] dark:border-[#333336] pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
              TroyX iStore — Home of Original Apple Products
            </div>
            <div className="text-[10px] mt-0.5 text-zinc-500">
              Bawaleshie, East Legon, Accra, Ghana • Tel: 0207137437 / 0548974717
            </div>
          </div>
          <div className="text-[10px] flex flex-wrap gap-4 items-center">
            <span>© {new Date().getFullYear()} TroyX iStore. All rights reserved.</span>
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
