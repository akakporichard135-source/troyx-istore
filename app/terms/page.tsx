import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = { title: "Terms", description: "TroyX iStore terms and conditions." };

export default function TermsPage() {
  const items = [
    "TroyX iStore is an independent retailer and does not suggest official affiliation with Apple Inc.",
    "Product availability, condition, warranty details, and delivery estimates are displayed on product pages.",
    "Used and refurbished devices may vary by cosmetic condition, battery health, and included accessories.",
    "Trade-in estimates are provisional until physical inspection confirms final value.",
    "Customers are responsible for accurate shipping, billing, and contact information."
  ];

  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms and Conditions" description="Terms for shopping, accounts, warranties, trade-ins, repairs, and service usage." />
      <Section><div className="grid gap-4">{items.map((item) => <p key={item} className="rounded-2xl bg-white p-5 text-sm leading-6 text-zinc-600 shadow-sm dark:bg-white/5 dark:text-zinc-300">{item}</p>)}</div></Section>
    </>
  );
}
