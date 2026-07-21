"use client";

import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  ArrowUpRight,
  Plus,
  CreditCard,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Store,
  ChevronRight
} from "lucide-react";
import { useVendorStore } from "@/context/vendor-store";
import { useAdminStore } from "@/context/admin-store";
import { Button } from "@/components/ui/button";

export default function VendorOverviewPage() {
  const activeVendorId = useVendorStore((state) => state.activeVendorId);
  const vendors = useVendorStore((state) => state.vendors);
  const plans = useVendorStore((state) => state.plans);
  const products = useAdminStore((state) => state.products);
  const orders = useAdminStore((state) => state.orders);

  const vendor = vendors.find((v) => v.id === activeVendorId) || vendors[0];
  const plan = plans.find((p) => p.id === vendor?.planId) || plans[1];

  // Filter vendor's specific products
  const vendorProducts = products.filter(
    (p) => p.vendorId === vendor?.id || (vendor?.isFlagship && (!p.vendorId || p.vendorId === "v-troyx-flagship"))
  );

  const maxProducts = plan.maxProducts;
  const isLimitReached = maxProducts !== -1 && vendorProducts.length >= maxProducts;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{vendor?.name}</h1>
            {vendor?.isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Merchant
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Store ID: {vendor?.id} &bull; {vendor?.city}, {vendor?.country} &bull; Subscription: <span className="text-brand-blue font-bold">{vendor?.planId}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/vendor/products">
            <Button className="h-10 px-4 text-xs font-bold bg-brand-blue hover:bg-brand-blue/90 text-white">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Product
            </Button>
          </Link>
          <Link href="/vendor/payouts">
            <Button variant="outline" className="h-10 px-4 text-xs font-semibold border-white/10 bg-white/5 text-white hover:bg-white/10">
              <CreditCard className="h-4 w-4 mr-1.5 text-emerald-400" />
              Request Payout
            </Button>
          </Link>
        </div>
      </div>

      {/* Plan Limit Warning */}
      {isLimitReached && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-300">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-400" />
            <span>
              You have reached your product limit of <strong className="text-white">{maxProducts} products</strong> on the {plan.name} plan. Upgrade to list more!
            </span>
          </div>
          <Link href="/vendor/subscription">
            <Button className="h-8 px-3 text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400">
              Upgrade Plan
            </Button>
          </Link>
        </div>
      )}

      {/* Key Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total Revenue */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total Revenue</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-white">GH₵ {vendor?.totalRevenue?.toLocaleString() || 0}</p>
          <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
            <TrendingUp className="h-3 w-3" /> +18.4% this month
          </span>
        </div>

        {/* Metric 2: Wallet Balance */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Available Balance</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-white">GH₵ {vendor?.walletBalance?.toLocaleString() || 0}</p>
          <span className="mt-2 text-[11px] text-zinc-400">Ready for instant withdrawal</span>
        </div>

        {/* Metric 3: Total Sales/Orders */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total Completed Orders</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-white">{vendor?.salesCount || 0} Orders</p>
          <span className="mt-2 text-[11px] text-zinc-400">Rating: {vendor?.rating || 5.0} &bull; ({vendor?.reviewCount || 0} reviews)</span>
        </div>

        {/* Metric 4: Active Products */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Active Products</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-white">{vendorProducts.length} <span className="text-xs font-normal text-zinc-400">/ {maxProducts === -1 ? "Unlimited" : maxProducts}</span></p>
          <div className="mt-2.5 h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-brand-blue rounded-full transition-all"
              style={{
                width: maxProducts === -1 ? "30%" : `${Math.min(100, (vendorProducts.length / maxProducts) * 100)}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Products & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Vendor Products Table Preview */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Listed Store Products</h2>
              <p className="text-xs text-zinc-400">Live products in TroyX catalog</p>
            </div>
            <Link href="/vendor/products">
              <Button variant="ghost" className="text-xs font-semibold text-brand-blue hover:text-white">
                View All ({vendorProducts.length}) &rarr;
              </Button>
            </Link>
          </div>

          <div className="divide-y divide-white/5 overflow-x-auto">
            {vendorProducts.slice(0, 5).map((prod) => (
              <div key={prod.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={prod.images[0]} alt={prod.name} className="h-10 w-10 rounded-xl border border-white/10 object-cover bg-zinc-800 shrink-0" />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-white">{prod.name}</p>
                    <p className="text-[11px] text-zinc-400">{prod.category} &bull; {prod.availability}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-emerald-400">GH₵ {prod.price.toLocaleString()}</p>
                  <span className="text-[10px] text-zinc-400">Rating: {prod.rating}</span>
                </div>
              </div>
            ))}

            {vendorProducts.length === 0 && (
              <div className="py-8 text-center text-xs text-zinc-500">
                No products added yet. Click "Add Product" above to list your first item!
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Action Cards */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl">
            <h2 className="text-base font-bold text-white mb-4">Quick Management</h2>
            <div className="space-y-2.5">
              <Link
                href="/vendor/products"
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-zinc-950/60 p-3.5 text-xs font-semibold text-zinc-200 hover:border-brand-blue/40 hover:text-white transition"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="h-4 w-4 text-brand-blue" />
                  <span>Manage Product Stock</span>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-500" />
              </Link>

              <Link
                href="/vendor/payouts"
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-zinc-950/60 p-3.5 text-xs font-semibold text-zinc-200 hover:border-brand-blue/40 hover:text-white transition"
              >
                <div className="flex items-center gap-2.5">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  <span>Request Earnings Withdrawal</span>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-500" />
              </Link>

              <Link
                href="/vendor/subscription"
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-zinc-950/60 p-3.5 text-xs font-semibold text-zinc-200 hover:border-brand-blue/40 hover:text-white transition"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>Upgrade Subscription Plan</span>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-500" />
              </Link>

              <Link
                href="/vendor/settings"
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-zinc-950/60 p-3.5 text-xs font-semibold text-zinc-200 hover:border-brand-blue/40 hover:text-white transition"
              >
                <div className="flex items-center gap-2.5">
                  <Store className="h-4 w-4 text-purple-400" />
                  <span>Edit Banner & Storefront</span>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
