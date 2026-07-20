"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle, 
  Activity, 
  Clock, 
  ExternalLink 
} from "lucide-react";
import { useAdminStore } from "@/context/admin-store";
import { formatCurrency } from "@/lib/utils";

export default function AdminPage() {
  const { products, orders, auditLogs, currentRole } = useAdminStore();

  // Compute metrics dynamically from local store
  const metrics = useMemo(() => {
    const totalRevenue = orders
      .filter(o => o.paymentStatus === "Paid")
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = orders.filter(o => o.status === "Processing" || o.status === "Confirmed").length;
    const completedOrders = orders.filter(o => o.status === "Delivered").length;
    const cancelledOrders = orders.filter(o => o.status === "Cancelled").length;

    const lowStock = products.filter(p => p.availability === "Low Stock").length;
    const outOfStock = products.filter(p => p.availability === "Out of Stock").length;

    return {
      dailyRevenue: totalRevenue * 0.08, // Simulated daily proportion
      weeklyRevenue: totalRevenue * 0.4,  // Simulated weekly proportion
      monthlyRevenue: totalRevenue,
      annualRevenue: totalRevenue * 12,
      todayOrders: Math.round(orders.length * 0.6),
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalCustomers: 1248,
      newCustomers: 142,
      returningCustomers: 1106,
      totalProducts: products.length,
      lowStock,
      outOfStock
    };
  }, [products, orders]);

  const recentOrders = useMemo(() => {
    return orders.slice(0, 5);
  }, [orders]);

  const topProducts = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  const recentLogs = useMemo(() => {
    return auditLogs.slice(0, 5);
  }, [auditLogs]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 md:p-8 bg-gradient-to-r from-brand-ink to-zinc-800 dark:from-zinc-900 dark:to-zinc-850 rounded-[2rem] text-white shadow-premium">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-brand-blue uppercase">Enterprise Operations</span>
          <h1 className="text-3xl font-extrabold mt-1">Hello, {currentRole}</h1>
          <p className="text-zinc-300 text-sm mt-1">Here is a storewide performance summary for TroyX iStore.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products/new" className="px-4 py-2.5 bg-brand-blue hover:bg-blue-600 rounded-full text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-500/20">
            + Add New Product
          </Link>
          <Link href="/admin/analytics" className="px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-full text-xs font-bold transition flex items-center gap-2">
            View Reports
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
        {/* Revenue KPI */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <span className="p-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-2xl">
              <DollarSign className="h-5 w-5 text-brand-blue" />
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              +18% <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Monthly Revenue</p>
            <p className="text-2xl font-bold mt-1 text-brand-ink dark:text-white">₵{metrics.monthlyRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <p className="text-[10px] text-zinc-400 mt-1">Annual Projected: ₵{metrics.annualRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Orders KPI */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl">
              <ShoppingCart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              +9% <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Today's Orders</p>
            <p className="text-2xl font-bold mt-1 text-brand-ink dark:text-white">{metrics.todayOrders}</p>
            <p className="text-[10px] text-zinc-400 mt-1">Pending: {metrics.pendingOrders} | Completed: {metrics.completedOrders}</p>
          </div>
        </div>

        {/* Customers KPI */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <span className="p-2.5 bg-purple-50 dark:bg-purple-950/30 rounded-2xl">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              +14% <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Total Customers</p>
            <p className="text-2xl font-bold mt-1 text-brand-ink dark:text-white">{metrics.totalCustomers.toLocaleString()}</p>
            <p className="text-[10px] text-zinc-400 mt-1">New: {metrics.newCustomers} | Returning: {metrics.returningCustomers}</p>
          </div>
        </div>

        {/* Inventory KPI */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <span className="p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-2xl">
              <Package className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </span>
            {metrics.outOfStock > 0 ? (
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <AlertCircle className="h-3 w-3" /> {metrics.outOfStock} Alerts
              </span>
            ) : (
              <span className="text-[10px] font-bold text-zinc-500 bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                Normal Stock
              </span>
            )}
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Active Inventory</p>
            <p className="text-2xl font-bold mt-1 text-brand-ink dark:text-white">{metrics.totalProducts} SKUs</p>
            <p className="text-[10px] text-zinc-400 mt-1">Low: {metrics.lowStock} | Out of Stock: {metrics.outOfStock}</p>
          </div>
        </div>
      </div>

      {/* Main Charts & Visualizations */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Sales Performance Chart Card */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm flex flex-col justify-between min-h-[350px]">
          <div className="flex justify-between items-center pb-4 border-b border-black/5 dark:border-white/5">
            <div>
              <h3 className="font-bold text-brand-ink dark:text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-brand-blue" /> Sales Trend (Accra Regional)
              </h3>
              <p className="text-xs text-zinc-400">Comparing iPhone launches vs accessory volume</p>
            </div>
            <select className="text-xs font-semibold bg-zinc-50 dark:bg-zinc-800 rounded-full px-3 py-1.5 border border-black/5 dark:border-white/5">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>

          {/* Custom SVG Line Chart */}
          <div className="flex-1 w-full h-48 py-4 relative">
            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0071E3" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0071E3" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="600" y2="20" stroke="rgba(128,128,128,0.08)" strokeDasharray="4 4" />
              <line x1="0" y1="70" x2="600" y2="70" stroke="rgba(128,128,128,0.08)" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(128,128,128,0.08)" strokeDasharray="4 4" />
              <line x1="0" y1="170" x2="600" y2="170" stroke="rgba(128,128,128,0.15)" />

              {/* Area */}
              <path
                d="M 10 170 Q 110 90 200 130 T 400 50 T 590 30 L 590 170 Z"
                fill="url(#chartGradient)"
              />

              {/* Line */}
              <path
                d="M 10 170 Q 110 90 200 130 T 400 50 T 590 30"
                fill="none"
                stroke="#0071E3"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Dots */}
              <circle cx="200" cy="130" r="5" fill="#0071E3" stroke="#fff" strokeWidth="2" />
              <circle cx="400" cy="50" r="5" fill="#0071E3" stroke="#fff" strokeWidth="2" />
              <circle cx="590" cy="30" r="5" fill="#0071E3" stroke="#fff" strokeWidth="2" />
            </svg>
            {/* Chart Labels */}
            <div className="flex justify-between text-[10px] font-mono text-zinc-400 mt-2 px-1">
              <span>FEB</span>
              <span>MAR</span>
              <span>APR</span>
              <span>MAY</span>
              <span>JUN</span>
              <span>JUL</span>
            </div>
          </div>
        </div>

        {/* Category Share Chart Card */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm flex flex-col justify-between">
          <div className="pb-4 border-b border-black/5 dark:border-white/5">
            <h3 className="font-bold text-brand-ink dark:text-white">Category Share</h3>
            <p className="text-xs text-zinc-400">Total volume share breakdown</p>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-4 py-4">
            {[
              { label: "iPhone", pct: 54, color: "bg-brand-blue" },
              { label: "MacBook", pct: 22, color: "bg-purple-500" },
              { label: "Gaming", pct: 14, color: "bg-emerald-500" },
              { label: "Accessories", pct: 10, color: "bg-zinc-400" },
            ].map((cat) => (
              <div key={cat.label} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-600 dark:text-zinc-300">{cat.label}</span>
                  <span className="text-brand-ink dark:text-white">{cat.pct}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid containing Tables: Recent Orders & Top Selling Products */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Recent Orders */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm flex flex-col">
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-black/5 dark:border-white/5">
            <div>
              <h3 className="font-bold text-brand-ink dark:text-white">Latest Orders</h3>
              <p className="text-xs text-zinc-400">Orders placed by customers locally</p>
            </div>
            <Link href="/admin/orders" className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1">
              View All <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-black/5 dark:border-white/5 text-zinc-400 font-semibold uppercase">
                  <th className="py-2.5">ID</th>
                  <th className="py-2.5">Customer</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5 font-medium">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                    <td className="py-3 text-brand-blue font-mono font-bold">{order.id}</td>
                    <td className="py-3">
                      <p className="text-brand-ink dark:text-white font-semibold">{order.customerName}</p>
                      <p className="text-[10px] text-zinc-400">{order.email}</p>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === "Delivered" 
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                          : order.status === "Processing"
                          ? "bg-blue-50 text-brand-blue dark:bg-blue-500/10 dark:text-blue-300"
                          : order.status === "Cancelled"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-brand-ink dark:text-white font-bold">{formatCurrency(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Trail / Recent Activity */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm flex flex-col">
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-black/5 dark:border-white/5">
            <div>
              <h3 className="font-bold text-brand-ink dark:text-white">Security Audit Trail</h3>
              <p className="text-xs text-zinc-400">Activity and admin modification logs</p>
            </div>
            <Link href="/admin/logs" className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1">
              Audit Logs <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex-1 space-y-4">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex gap-3 text-xs leading-relaxed">
                <span className="p-2 h-8 w-8 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center flex-shrink-0">
                  {log.action.includes("Create") || log.action.includes("Upload") ? (
                    <PlusIcon className="h-3.5 w-3.5 text-emerald-500" />
                  ) : log.action.includes("Delete") ? (
                    <TrashIcon className="h-3.5 w-3.5 text-rose-500" />
                  ) : (
                    <Activity className="h-3.5 w-3.5 text-zinc-500" />
                  )}
                </span>
                <div className="flex-1">
                  <p className="text-brand-ink dark:text-white font-semibold flex items-center justify-between">
                    <span>{log.action}</span>
                    <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1 font-normal">
                      <Clock className="h-3 w-3" /> {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </p>
                  <p className="text-zinc-500 mt-0.5">{log.details}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Actor: {log.actor} ({log.role})</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}
