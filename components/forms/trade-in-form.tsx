"use client";

import { Calculator } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

export function TradeInForm() {
  const [estimate, setEstimate] = useState<number | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const device = String(form.get("device") || "");
    const batteryHealth = Number(form.get("batteryHealth") || 90);
    const physicalCondition = String(form.get("physicalCondition") || "good") as "excellent" | "good" | "fair" | "poor";
    const base = device.toLowerCase().includes("pro") ? 650 : device.toLowerCase().includes("iphone") ? 420 : 300;
    const battery = batteryHealth / 100;
    const condition = { excellent: 1, good: 0.85, fair: 0.65, poor: 0.4 }[physicalCondition];
    setEstimate(Math.round(base * battery * condition));
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">Device<Input name="device" placeholder="iPhone 15 Pro" required /></label>
        <label className="grid gap-2 text-sm font-semibold">Storage<Select name="storage" defaultValue="256GB"><option>128GB</option><option>256GB</option><option>512GB</option><option>1TB</option></Select></label>
        <label className="grid gap-2 text-sm font-semibold">Battery health<Input name="batteryHealth" type="number" min="50" max="100" defaultValue="90" required /></label>
        <label className="grid gap-2 text-sm font-semibold">Physical condition<Select name="physicalCondition" defaultValue="good"><option value="excellent">Excellent</option><option value="good">Good</option><option value="fair">Fair</option><option value="poor">Poor</option></Select></label>
      </div>
      <Button type="submit"><Calculator className="h-4 w-4" /> Estimate value</Button>
      {estimate !== null && (
        <div className="rounded-2xl bg-blue-50 p-5 text-brand-ink dark:bg-blue-500/10 dark:text-white">
          <p className="text-sm font-semibold text-brand-blue">Estimated trade-in value</p>
          <p className="mt-1 text-3xl font-semibold">{formatCurrency(estimate)}</p>
          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            This is an estimate only. Final trade-in value is confirmed after physical inspection by TroyX iStore.
          </p>
        </div>
      )}
    </form>
  );
}
