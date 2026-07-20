import type { Metadata } from "next";
import { TradeInForm } from "@/components/forms/trade-in-form";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = { title: "Trade-In", description: "Estimate your device trade-in value." };

export default function TradeInPage() {
  return (
    <>
      <PageHeader eyebrow="Trade-In" title="Estimate your device value." description="Enter device, storage, battery health, and condition. Final trade-in value is confirmed only after physical inspection." />
      <Section><TradeInForm /></Section>
    </>
  );
}
