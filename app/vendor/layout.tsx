"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  DollarSign,
  BarChart3,
  MessageSquare,
  Sparkles,
  Settings,
  Store,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Bell,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { useVendorStore } from "@/context/vendor-store";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/vendor", label: "Overview", icon: LayoutDashboard },
  { href: "/vendor/products", label: "Products", icon: Package },
  { href: "/vendor/orders", label: "Orders", icon: ShoppingBag },
  { href: "/vendor/inventory", label: "Inventory", icon: Boxes },
  { href: "/vendor/payouts", label: "Payouts", icon: DollarSign },
  { href: "/vendor/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/vendor/messages", label: "Messages", icon: MessageSquare },
  { href: "/vendor/subscription", label: "Subscription", icon: Sparkles },
  { href: "/vendor/settings", label: "Store Settings", icon: Settings }
];

export default function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const activeVendorId = useVendorStore((state) => state.activeVendorId);
  const setActiveVendorId = useVendorStore((state) => state.setActiveVendorId);
  const vendors = useVendorStore((state) => state.vendors);
  
  const activeVendor = vendors.find((v) => v.id === activeVendorId) || vendors[1] || vendors[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col lg:flex-row selection:bg-brand-blue selection:text-white">
      {/* Mobile Top Navbar */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 bg-zinc-900/80 px-4 lg:hidden backdrop-blur-xl">
        <Link href="/vendor" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-blue text-xs font-bold text-white">
            TX
          </div>
          <span className="text-sm font-bold text-white">Vendor Portal</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-xl border border-white/10 p-2 text-zinc-300 hover:bg-white/5"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-zinc-900/90 p-4 backdrop-blur-2xl transition-transform lg:static lg:translate-x-0 flex flex-col justify-between",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div>
          {/* Logo & Platform Badge */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue text-xs font-bold text-white shadow-lg shadow-brand-blue/30">
                TX
              </span>
              <div>
                <p className="text-sm font-extrabold text-white leading-none">TroyX iStore</p>
                <p className="text-[10px] font-semibold text-brand-blue mt-0.5">Merchant Portal</p>
              </div>
            </Link>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
              Live
            </span>
          </div>

          {/* Store Switcher */}
          <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-950/80 p-3">
            <div className="flex items-center gap-2.5">
              <img
                src={activeVendor?.logoUrl || "/assets/product-device-blue.svg"}
                alt={activeVendor?.name}
                className="h-9 w-9 rounded-xl border border-white/10 object-cover bg-zinc-800"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-white">{activeVendor?.name}</p>
                <p className="text-[10px] text-emerald-400 font-semibold">{activeVendor?.planId} Merchant</p>
              </div>
            </div>
            
            {/* Quick Vendor Switcher dropdown */}
            <select
              value={activeVendorId}
              onChange={(e) => setActiveVendorId(e.target.value)}
              className="mt-2.5 w-full rounded-xl border border-white/10 bg-zinc-900 px-2.5 py-1.5 text-[11px] font-medium text-zinc-300 focus:border-brand-blue focus:outline-none"
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.planId})
                </option>
              ))}
            </select>
          </div>

          {/* Nav Links */}
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-semibold transition",
                    isActive
                      ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="border-t border-white/10 pt-4 space-y-2">
          {activeVendor && (
            <Link
              href={`/store/${activeVendor.slug}`}
              target="_blank"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5"
            >
              <Store className="h-3.5 w-3.5 text-brand-blue" />
              <span>View Public Storefront</span>
            </Link>
          )}

          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Return to Marketplace</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
