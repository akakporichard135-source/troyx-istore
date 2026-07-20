import type { Metadata } from "next";
import { CompareClient } from "@/components/commerce/compare-client";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = { title: "Compare Products", description: "Compare Apple devices at TroyX iStore." };

export default function ComparePage() {
  return (
    <>
      <PageHeader eyebrow="Compare" title="Compare devices side by side." description="Review price, storage, colors, condition, warranty, delivery estimates, and technical differences." />
      <Section><CompareClient /></Section>
    </>
  );
}
