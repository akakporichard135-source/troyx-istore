import type { Metadata } from "next";
import { PackageCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Order Tracking", description: "Track TroyX iStore orders." };

export default function OrderTrackingPage() {
  return (
    <>
      <PageHeader eyebrow="Tracking" title="Track your order." description="Enter an order reference to view delivery progress." />
      <Section>
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <PackageCheck className="h-8 w-8 text-brand-blue" />
            <h2 className="text-xl font-semibold text-brand-ink dark:text-white">Order reference</h2>
          </div>
          <div className="mt-5 flex gap-3">
            <Input placeholder="TX-2026-1001" />
            <Button type="button">Track</Button>
          </div>
          <div className="mt-6 grid gap-3 text-sm">
            {["Confirmed", "Processing", "Packed", "Out for Delivery", "Delivered"].map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-2xl bg-brand-mist p-3 dark:bg-white/5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-blue text-xs font-bold text-white">{index + 1}</span>
                {step}
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
