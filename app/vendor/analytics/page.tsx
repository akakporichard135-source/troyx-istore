"use client";

import { BarChart3, TrendingUp, Users, Eye, ShoppingBag, DollarSign } from "lucide-react";
import { useVendorStore } from "@/context/vendor-store";

export default function VendorAnalyticsPage() {
  const activeVendorId = useVendorStore((state) => state.activeVendorId);
  const vendors = useVendorStore((state) => state.vendors);
  const vendor = vendors.find((v) => v.id === activeVendorId) || vendors[0];

  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-2xl font-extrabold text-white">Store Sales Analytics</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Performance metrics & visitor insights for <strong className="text-white">{vendor?.name}</strong>.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-xl">
          <span className="text-xs font-medium text-zinc-400">Total Store Views</span>
          <p className="mt-2 text-2xl font-extrabold text-white">14,280</p>
          <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
            <TrendingUp className="h-3 w-3" /> +24% vs last month
          </span>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-xl">
          <span className="text-xs font-medium text-zinc-400">Conversion Rate</span>
          <p className="mt-2 text-2xl font-extrabold text-white">3.82%</p>
          <span className="mt-2 text-[11px] text-zinc-400">Industry Avg: 2.5%</span>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-xl">
          <span className="text-xs font-medium text-zinc-400">Average Order Value</span>
          <p className="mt-2 text-2xl font-extrabold text-white">GH₵ 1,840</p>
          <span className="mt-2 text-[11px] text-emerald-400 font-semibold">+GH₵ 120 this month</span>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-xl">
          <span className="text-xs font-medium text-zinc-400">Store Rating</span>
          <p className="mt-2 text-2xl font-extrabold text-white">{vendor?.rating || 5.0} / 5.0</p>
          <span className="mt-2 text-[11px] text-zinc-400">{vendor?.reviewCount || 0} customer reviews</span>
        </div>
      </div>

      {/* Analytics Chart Simulation */}
      <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl space-y-4">
        <h2 className="text-base font-bold text-white">Monthly Sales Breakdown (GH₵)</h2>
        <div className="h-48 flex items-end gap-3 pt-6 pb-2 border-b border-white/10">
          {[45, 62, 58, 75, 80, 95, 110, 105, 128, 140, 155, 185].map((height, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-gradient-to-t from-brand-blue/40 to-brand-blue rounded-t-xl transition-all hover:brightness-125"
                style={{ height: `${height}px` }}
              />
              <span className="text-[10px] text-zinc-400">{["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][idx]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
