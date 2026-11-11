import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";
import { getDashboardStats } from "@/lib/storage/db";
import { formatGHS } from "@/lib/pricing";
import {
  Layers,
  Smartphone,
  ShoppingBag,
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
} from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const stats = await getDashboardStats();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            TroyX Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">
            Store Overview & Control Hub
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real metrics for TroyX iStore, Bawaleshie, East Legon, Accra.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages/page-home"
            className="apple-btn-primary text-xs flex items-center gap-2"
          >
            <span>Edit Homepage Showcase</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Real Statistics Metric Cards (Zero fake numbers!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Homepage Showcase Sections */}
        <div className="p-5 rounded-2xl bg-[#161617] border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-medium">Homepage Drafts</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {stats.homepageDraftSections} Drafts
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              {stats.publishedHomepageSections > 0
                ? `${stats.publishedHomepageSections} section(s) currently live`
                : "Initial State: 0 live showcases (Clean empty main state)"}
            </div>
          </div>
          <Link
            href="/admin/pages/page-home"
            className="text-[11px] text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 pt-1"
          >
            <span>Manage 6 Homepage Drafts</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Metric 2: Catalog Products */}
        <div className="p-5 rounded-2xl bg-[#161617] border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-medium">Catalog Inventory</span>
            <Smartphone className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {stats.totalProducts} Devices
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              {stats.publishedProducts > 0
                ? `${stats.publishedProducts} published in store`
                : "0 fabricated products (Add verified inventory)"}
            </div>
          </div>
          <Link
            href="/admin/products"
            className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 pt-1"
          >
            <span>Open Catalog Manager</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Metric 3: Orders Received */}
        <div className="p-5 rounded-2xl bg-[#161617] border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-medium">Customer Orders</span>
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {stats.totalOrders} Orders
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              {stats.pendingOrders > 0
                ? `${stats.pendingOrders} pending fulfillment`
                : "Awaiting customer purchase requests"}
            </div>
          </div>
          <Link
            href="/admin/orders"
            className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 pt-1"
          >
            <span>View Order Requests</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Metric 4: Real Revenue */}
        <div className="p-5 rounded-2xl bg-[#161617] border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-medium">Verified Revenue</span>
            <span className="text-[10px] font-bold text-zinc-500">GH₵</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {formatGHS(stats.totalRevenue)}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              Calculated from confirmed non-cancelled orders
            </div>
          </div>
          <span className="text-[11px] text-zinc-500 flex items-center gap-1 pt-1">
            <ShieldCheck className="w-3 h-3 text-zinc-400" />
            <span>Strict Server Validation</span>
          </span>
        </div>
      </div>

      {/* Quick Launchpad & Next Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Homepage Setup Status */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">
              Homepage Structure & Draft Status
            </h2>
            <Link
              href="/admin/pages/page-home"
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              Open Page Editor →
            </Link>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            The homepage is architected around six unpublished CMS draft slots in exact sequence:
            iPhone 18 Pro (dark), iPhone Duo (white), MacBook Pro (dark), Apple Watch Series 12
            (white), iPad A16 (white), and AirPods Pro 3 (dark). In the initial live-facing state, all
            remain unpublished, rendering an intentionally clean, empty homepage main section.
          </p>

          <div className="pt-2">
            <Link
              href="/admin/pages/page-home"
              className="inline-flex items-center gap-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
            >
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Click to view the 6 draft slots, upload media, and publish when ready</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto text-zinc-500" />
            </Link>
          </div>
        </div>

        {/* Right Column: Store Quick Actions */}
        <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
          <h2 className="text-base font-semibold text-white">Quick Tasks</h2>
          <div className="space-y-2 text-xs">
            <Link
              href="/admin/media"
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4 text-blue-400" />
                <span>Upload Images / Videos</span>
              </div>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </Link>

            <Link
              href="/admin/products/new"
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Add Product to Catalog</span>
              </div>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </Link>

            <Link
              href="/admin/navigation"
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-yellow-400" />
                <span>Configure Navigation Links</span>
              </div>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Store Details & Supabase API</span>
              </div>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
