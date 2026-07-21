"use client";

import { useState } from "react";
import { Sparkles, Edit, Save, Check, Plus } from "lucide-react";
import { useVendorStore } from "@/context/vendor-store";
import { Button } from "@/components/ui/button";
import type { SubscriptionTier, VendorPlan } from "@/types";

export default function AdminPlansPage() {
  const plans = useVendorStore((state) => state.plans);
  const updatePlan = useVendorStore((state) => state.updatePlan);

  const [editingPlanId, setEditingPlanId] = useState<SubscriptionTier | null>(null);
  const [editPrice, setEditPrice] = useState<number>(199);
  const [editMaxProducts, setEditMaxProducts] = useState<number>(50);
  const [editCommission, setEditCommission] = useState<number>(8);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const startEdit = (plan: VendorPlan) => {
    setEditingPlanId(plan.id);
    setEditPrice(plan.priceMonthly);
    setEditMaxProducts(plan.maxProducts);
    setEditCommission(plan.commissionRate);
  };

  const handleSavePlan = (planId: SubscriptionTier) => {
    updatePlan(planId, {
      priceMonthly: editPrice,
      priceYearly: editPrice * 10,
      maxProducts: editMaxProducts,
      commissionRate: editCommission
    });

    setEditingPlanId(null);
    setSavedMsg(`Plan pricing for ${planId} Tier updated successfully!`);
    setTimeout(() => setSavedMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-black/5 dark:border-white/10 pb-6">
        <h1 className="text-2xl font-extrabold text-brand-ink dark:text-white">Subscription Plans & Monetization</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Configure monthly plan fees, max product quotas, and marketplace commission percentages.
        </p>
      </div>

      {savedMsg && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-500">
          {savedMsg}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const isEditing = editingPlanId === plan.id;

          return (
            <div
              key={plan.id}
              className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
                  <h2 className="text-lg font-bold text-brand-ink dark:text-white">{plan.name} Plan</h2>
                  <Button
                    variant="outline"
                    onClick={() => (isEditing ? handleSavePlan(plan.id) : startEdit(plan))}
                    className="h-8 text-xs font-bold border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                  >
                    {isEditing ? <Save className="h-3.5 w-3.5 mr-1" /> : <Edit className="h-3.5 w-3.5 mr-1" />}
                    {isEditing ? "Save" : "Edit Plan"}
                  </Button>
                </div>

                {isEditing ? (
                  <div className="mt-4 space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-zinc-500 mb-1">Monthly Price (GH₵)</label>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-full h-9 rounded-xl border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 px-3 font-bold text-brand-ink dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-zinc-500 mb-1">Max Product Quota (-1 = Unlimited)</label>
                      <input
                        type="number"
                        value={editMaxProducts}
                        onChange={(e) => setEditMaxProducts(Number(e.target.value))}
                        className="w-full h-9 rounded-xl border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 px-3 font-bold text-brand-ink dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-zinc-500 mb-1">Commission Percentage (%)</label>
                      <input
                        type="number"
                        value={editCommission}
                        onChange={(e) => setEditCommission(Number(e.target.value))}
                        className="w-full h-9 rounded-xl border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 px-3 font-bold text-brand-ink dark:text-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    <p className="text-3xl font-extrabold text-brand-ink dark:text-white">
                      GH₵ {plan.priceMonthly} <span className="text-xs font-normal text-zinc-500">/ mo</span>
                    </p>

                    <div className="space-y-1.5 border-t border-black/5 dark:border-white/10 pt-3 text-xs text-zinc-600 dark:text-zinc-300">
                      <div className="flex justify-between">
                        <span>Product Limit:</span>
                        <span className="font-bold text-brand-ink dark:text-white">{plan.maxProducts === -1 ? "Unlimited" : plan.maxProducts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Commission:</span>
                        <span className="font-bold text-emerald-500">{plan.commissionRate}% per sale</span>
                      </div>
                    </div>

                    <ul className="mt-4 space-y-2 text-xs text-zinc-500">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
