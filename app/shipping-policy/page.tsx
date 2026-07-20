import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = { title: "Shipping Policy", description: "TroyX iStore shipping and pickup policy." };

export default function ShippingPolicyPage() {
  const items = [
    "Checkout supports delivery and pickup options with clear estimated timelines.",
    "Same-day pickup can be offered for eligible in-stock products after order confirmation.",
    "Delivery estimates are shown on product pages and may vary by location and payment confirmation time.",
    "Customers receive order tracking updates through the dashboard and order tracking page.",
    "Shipping settings are managed from the admin dashboard for future carrier integrations."
  ];

  return (
    <>
      <PageHeader eyebrow="Policy" title="Shipping Policy" description="Delivery, pickup, tracking, and fulfillment expectations for TroyX iStore." />
      <Section><div className="grid gap-4">{items.map((item) => <p key={item} className="rounded-2xl bg-white p-5 text-sm leading-6 text-zinc-600 shadow-sm dark:bg-white/5 dark:text-zinc-300">{item}</p>)}</div></Section>
    </>
  );
}
