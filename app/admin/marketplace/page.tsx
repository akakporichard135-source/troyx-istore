"use client";

import Link from "next/link";
import {
  Store,
  Users,
  DollarSign,
  FileText,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { useVendorStore } from "@/context/vendor-store";
import { Button } from "@/components/ui/button";

export default function AdminMarketplaceOverviewPage() {
  const vendors = useVendorStore((state) => state.vendors);
  const applications = useVendorStore((state) => state.applications);
  const payouts = useVendorStore((state) => state.payouts);
  const plans = useVendorStore((state) => state.plans);

  const pendingAppsCount = applications.filter((a) => a.status === "Pending").length;
  const pendingPayoutsCount = payouts.filter((p) => p.status === "Pending").length;
  const activeVendorsCount = vendors.filter((v) => v.status === "Approved").length;

  const totalGMV = vendors.reduce((sum, v) => sum + v.totalRevenue, 0);
  const estimatedSubscriptionRevenue = vendors.reduce((sum, v) => {
    const plan = plans.find((p) => p.id === v.planId);
    return sum + (plan?.priceMonthly || 0);
  }, 0);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-ink dark:text-white">Marketplace Administration</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Global control center for TroyX iStore seller network, subscriptions, payouts, and compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/marketplace/applications">
            <Button className="h-10 px-4 text-xs font-bold bg-brand-blue text-white hover:bg-brand-blue/90">
              <FileText className="h-4 w-4 mr-1.5" />
              Pending Applications ({pendingAppsCount})
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-5 shadow-sm">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Total Marketplace GMV</span>
          <p className="mt-2 text-2xl font-extrabold text-brand-ink dark:text-white">GH₵ {totalGMV.toLocaleString()}</p>
          <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500">
            <TrendingUp className="h-3 w-3" /> All verified sellers
          </span>
        </div>

        <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-5 shadow-sm">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Active Approved Merchants</span>
          <p className="mt-2 text-2xl font-extrabold text-brand-ink dark:text-white">{activeVendorsCount} Stores</p>
          <span className="mt-2 text-[11px] text-zinc-500">Across Ghana (Accra, Kumasi, Takoradi)</span>
        </div>

        <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-5 shadow-sm">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Monthly Subscription MRR</span>
          <p className="mt-2 text-2xl font-extrabold text-brand-blue">GH₵ {estimatedSubscriptionRevenue.toLocaleString()}</p>
          <span className="mt-2 text-[11px] text-emerald-500 font-bold">+15% recurring MRR</span>
        </div>

        <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-5 shadow-sm">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Pending Payout Requests</span>
          <p className="mt-2 text-2xl font-extrabold text-amber-500">{pendingPayoutsCount} Requests</p>
          <Link href="/admin/marketplace/payouts" className="mt-2 block text-[11px] font-bold text-brand-blue hover:underline">
            Review Payout Ledger &rarr;
          </Link>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/marketplace/vendors"
          className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:border-brand-blue/40 transition group"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue group-hover:scale-105 transition">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-brand-ink dark:text-white">Store Vendors</h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Manage merchant statuses, suspensions, and homepage featuring.</p>
        </Link>

        <Link
          href="/admin/marketplace/applications"
          className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:border-brand-blue/40 transition group"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500 group-hover:scale-105 transition">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-brand-ink dark:text-white">Seller Applications</h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Review submitted Ghana Card / TIN docs and approve new sellers.</p>
        </Link>

        <Link
          href="/admin/marketplace/plans"
          className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:border-brand-blue/40 transition group"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 group-hover:scale-105 transition">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-brand-ink dark:text-white">Subscription Plans</h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Edit plan pricing, product limits, commission rates, and perks.</p>
        </Link>

        <Link
          href="/admin/marketplace/payouts"
          className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:border-brand-blue/40 transition group"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:scale-105 transition">
            <CreditCard className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-brand-ink dark:text-white">Vendor Payouts</h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Approve Mobile Money & bank withdrawals for verified merchants.</p>
        </Link>
      </div>
    </div>
  );
}
