import React from "react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { getNavigation, getFooterColumns, getSiteSettings } from "@/lib/storage/db";
import { CartProvider } from "@/lib/cart/cart-context";

export const revalidate = 0; // Dynamic server rendering for instantaneous CMS updates

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [nav, footerColumns, settings] = await Promise.all([
    getNavigation(),
    getFooterColumns(),
    getSiteSettings(),
  ]);

  return (
    <CartProvider>
      <div className="flex-1 flex flex-col min-h-screen bg-black text-white">
        {/* Announcement bar if enabled by admin */}
        {settings.isAnnouncementActive && settings.announcementText && (
          <div className="bg-[#1d1d1f] border-b border-zinc-800 text-center py-2 px-4 text-xs font-normal text-zinc-300">
            <span>{settings.announcementText}</span>
          </div>
        )}

        {/* Global TroyX Apple-inspired Header */}
        <Header navItems={nav.items} />

        {/* Main Public Content Area */}
        <main className="flex-1">{children}</main>

        {/* Global TroyX Multi-Column Footer */}
        <Footer columns={footerColumns} />
      </div>
    </CartProvider>
  );
}
