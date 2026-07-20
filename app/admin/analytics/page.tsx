"use client";

import React, { useMemo, useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Percent, 
  DollarSign, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles
} from "lucide-react";
import { useAdminStore } from "@/context/admin-store";
import { formatCurrency } from "@/lib/utils";

export default function AnalyticsPage() {
  const { orders, products } = useAdminStore();
  const [timeRange, setTimeRange] = useState("6m");

  const totalRevenue = useMemo(() => {
    return orders
      .filter(o => o.paymentStatus === "Paid")
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const avgOrderValue = useMemo(() => {
    if (orders.length === 0) return 0;
    return totalRevenue / orders.length;
  }, [orders, totalRevenue]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-ink dark:text-white">Store Analytics</h1>
          <p className="text-zinc-500 text-sm">Deep-dive customer conversion, revenue performance, and category metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-xs font-semibold bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-full px-4 py-2"
          >
            <option value="30d">Last 30 Days</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
          </select>
          <button className="px-4 py-2 bg-brand-blue hover:bg-blue-600 rounded-full text-xs font-bold text-white transition flex items-center gap-2 shadow-lg shadow-blue-500/20">
            <Download className="h-3.5 w-3.5" /> Export Report
          </button>
        </div>
      </div>

      {/* Analytics KPI grid */}
      <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-2">
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Conversion Rate</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-brand-ink dark:text-white">3.42%</p>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full flex items-center">
              +0.8% <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <p className="text-[10px] text-zinc-400">Industry Avg: 2.1%</p>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-2">
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Avg Order Value</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-brand-ink dark:text-white">₵{avgOrderValue.toLocaleString(undefined, {maximumFractionDigits:2})}</p>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full flex items-center">
              +3.5% <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <p className="text-[10px] text-zinc-400">Accra-Metro deliveries focus</p>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-2">
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Store Visitors</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-brand-ink dark:text-white">18.4k</p>
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-full flex items-center">
              -1.2% <ArrowDownRight className="h-3 w-3" />
            </span>
          </div>
          <p className="text-[10px] text-zinc-400">Unique devices (30d)</p>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-2">
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Total Sales Vol</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-brand-ink dark:text-white">{orders.length} orders</p>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full flex items-center">
              +12.4% <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <p className="text-[10px] text-zinc-400">92% fulfillment success rate</p>
        </div>
      </div>

      {/* Custom Analytics Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Performance */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm">
          <div className="pb-4 mb-4 border-b border-black/5 dark:border-white/5">
            <h3 className="font-bold text-brand-ink dark:text-white">Revenue Performance (₵)</h3>
            <p className="text-xs text-zinc-400">Tracking daily intake vs targets</p>
          </div>
          <div className="h-64 py-4">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(128,128,128,0.08)" strokeDasharray="4" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(128,128,128,0.08)" strokeDasharray="4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(128,128,128,0.08)" strokeDasharray="4" />
              <line x1="0" y1="190" x2="500" y2="190" stroke="rgba(128,128,128,0.15)" />

              <path d="M 0 190 Q 120 70 250 110 T 500 25 L 500 190 Z" fill="url(#purpleGrad)" />
              <path d="M 0 190 Q 120 70 250 110 T 500 25" fill="none" stroke="#a855f7" strokeWidth="3" />
            </svg>
            <div className="flex justify-between text-[10px] font-mono text-zinc-400 mt-2 px-1">
              <span>W1</span>
              <span>W2</span>
              <span>W3</span>
              <span>W4</span>
            </div>
          </div>
        </div>

        {/* Visitor Traffic Sources */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm">
          <div className="pb-4 mb-4 border-b border-black/5 dark:border-white/5">
            <h3 className="font-bold text-brand-ink dark:text-white">Visitor Traffic Sources</h3>
            <p className="text-xs text-zinc-400">Where traffic finds TroyX store</p>
          </div>
          <div className="h-64 py-4 flex flex-col justify-center gap-4">
            {[
              { source: "Google Organic Search", percentage: 48, visitors: "8.8k", color: "bg-brand-blue" },
              { source: "Social Media (Instagram/X)", percentage: 29, visitors: "5.3k", color: "bg-purple-500" },
              { source: "Direct Visits", percentage: 15, visitors: "2.7k", color: "bg-emerald-500" },
              { source: "Referrals", percentage: 8, visitors: "1.4k", color: "bg-zinc-400" }
            ].map((item) => (
              <div key={item.source} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{item.source}</span>
                  <span className="text-zinc-500 font-semibold">{item.visitors} ({item.percentage}%)</span>
                </div>
                <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best Performing Products list */}
      <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm">
        <div className="pb-4 mb-4 border-b border-black/5 dark:border-white/5">
          <h3 className="font-bold text-brand-ink dark:text-white">Top Performing Products</h3>
          <p className="text-xs text-zinc-400">Products with the highest revenue conversion rates this month</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 text-zinc-400 font-semibold uppercase">
                <th className="py-3">Product Name</th>
                <th className="py-3">Category</th>
                <th className="py-3">Stock Status</th>
                <th className="py-3 text-right">Rating</th>
                <th className="py-3 text-right">Conversion Rate</th>
                <th className="py-3 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5 font-semibold text-brand-ink dark:text-white">
              {products.slice(0, 5).map((product, index) => (
                <tr key={product.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition">
                  <td className="py-4 font-bold flex items-center gap-3">
                    <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-500 font-mono">
                      0{index + 1}
                    </span>
                    {product.name}
                  </td>
                  <td className="py-4 text-zinc-500">{product.category}</td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      product.availability === "In Stock" 
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                    }`}>
                      {product.availability}
                    </span>
                  </td>
                  <td className="py-4 text-right font-bold">⭐ {product.rating}</td>
                  <td className="py-4 text-right text-emerald-600 dark:text-emerald-400">{(4.8 - index * 0.4).toFixed(2)}%</td>
                  <td className="py-4 text-right text-brand-blue font-bold">₵{(product.price * (32 - index * 5)).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
