"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Image as ImageIcon,
  Smartphone,
  Tag,
  ShoppingBag,
  Sliders,
  Compass,
  Search,
  ShieldAlert,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Pages & Sections", href: "/admin/pages", icon: Layers },
  { label: "Cinematic Media", href: "/admin/media", icon: ImageIcon },
  { label: "Product Catalog", href: "/admin/products", icon: Smartphone },
  { label: "Pricing & Inventory", href: "/admin/pricing", icon: Tag },
  { label: "Orders & Requests", href: "/admin/orders", icon: ShoppingBag },
  { label: "Navigation & Footer", href: "/admin/navigation", icon: Compass },
  { label: "Promotions & Deals", href: "/admin/promotions", icon: Sliders },
  { label: "SEO & Sitemaps", href: "/admin/seo", icon: Search },
  { label: "Audit & Security", href: "/admin/audit", icon: ShieldAlert },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-800 bg-[#161617] flex flex-col justify-between shrink-0 min-h-[calc(100vh-3.5rem)]">
      <div className="p-4 space-y-1">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-3 py-2">
          TroyX Control Modules
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                isActive
                  ? "bg-zinc-800 text-white font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-zinc-500"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-zinc-800/80 text-[11px] text-zinc-500 space-y-1">
        <div className="font-medium text-zinc-400">TroyX iStore • Accra</div>
        <div>Bawaleshie, East Legon</div>
        <div className="text-[10px] text-zinc-600">Secure Session Active</div>
      </div>
    </aside>
  );
}
