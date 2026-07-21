"use client";

import { Sparkles, Check, ArrowRight, ShieldCheck } from "lucide-react";
import { useVendorStore } from "@/context/vendor-store";
import { useAdminStore } from "@/context/admin-store";
import { Button } from "@/components/ui/button";

export default function VendorSubscriptionPage() {
  const activeVendorId = useVendorStore((state) => state.activeVendorId);
  const vendors = useVendorStore((state) => state.vendors);
  const plans = useVendorStore((state) => state.plans);
  const updateVendorProfile = useVendorStore((state) => state.updateVendorProfile);
  const products = useAdminStore((state) => state.products);

  const vendor = vendors.find((v) => v.id === activeVendorId) || vendors[0];
  const currentPlan = plans.find((p) => p.id === vendor?.planId) || plans[1];

  const vendorProducts = products.filter(
    (p) => p.vendorId === vendor?.id || (vendor?.isFlagship && (!p.vendorId || p.vendorId === "v-troyx-flagship"))
  );

  const handleUpgrade = (planId: any) => {
    updateVendorProfile(vendor.id, { planId });
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-2xl font-extrabold text-white">Subscription Plan & Limits</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Active Plan for <strong className="text-white">{vendor?.name}</strong>: <span className="text-brand-blue font-bold">{currentPlan.name} Tier</span>
        </p>
      </div>

      {/* Active Plan Usage Card */}
      <div className="rounded-3xl border border-brand-blue/30 bg-gradient-to-r from-brand-blue/15 via-zinc-900 to-zinc-900 p-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-brand-blue uppercase tracking-wider">Current Active Plan</span>
            <h2 className="text-2xl font-extrabold text-white mt-1">{currentPlan.name} Plan</h2>
            <p className="text-xs text-zinc-300 mt-1">
              Monthly Subscription: <strong>GH₵ {currentPlan.priceMonthly} / mo</strong> &bull; Marketplace Commission: <strong className="text-emerald-400">{currentPlan.commissionRate}%</strong>
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-zinc-400">Product Quota Usage:</span>
            <p className="text-xl font-extrabold text-white">
              {vendorProducts.length} / {currentPlan.maxProducts === -1 ? "Unlimited" : currentPlan.maxProducts}
            </p>
          </div>
        </div>
      </div>

      {/* All Available Plans Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Available Marketplace Plans</h2>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((p) => {
            const isCurrent = p.id === vendor?.planId;

            return (
              <div
                key={p.id}
                className={`rounded-3xl border p-6 flex flex-col justify-between transition ${
                  isCurrent
                    ? "border-brand-blue bg-zinc-900 shadow-xl shadow-brand-blue/10"
                    : "border-white/10 bg-zinc-900/60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{p.name}</h3>
                    {isCurrent && (
                      <span className="rounded-full bg-brand-blue/20 px-2.5 py-0.5 text-[10px] font-bold text-brand-blue border border-brand-blue/30">
                        Active
                      </span>
                    )}
                  </div>

                  <p className="mt-4 text-3xl font-extrabold text-white">
                    GH₵ {p.priceMonthly} <span className="text-xs text-zinc-400 font-normal">/ month</span>
                  </p>

                  <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-xs text-zinc-300">
                    <div className="flex justify-between">
                      <span>Max Products:</span>
                      <span className="font-bold text-white">{p.maxProducts === -1 ? "Unlimited" : p.maxProducts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Commission:</span>
                      <span className="font-bold text-emerald-400">{p.commissionRate}%</span>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2 text-xs text-zinc-300">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <Button
                    onClick={() => handleUpgrade(p.id)}
                    disabled={isCurrent}
                    className={`w-full h-10 text-xs font-bold ${
                      isCurrent
                        ? "bg-zinc-800 text-zinc-500 cursor-default"
                        : "bg-brand-blue hover:bg-brand-blue/90 text-white"
                    }`}
                  >
                    {isCurrent ? "Current Plan Active" : `Switch to ${p.name}`}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
