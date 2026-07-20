import type { Metadata } from "next";
import { CheckoutForm } from "@/components/commerce/checkout-form";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = { title: "Checkout", description: "Secure TroyX iStore checkout." };

export default function CheckoutPage() {
  return (
    <>
      <PageHeader eyebrow="Checkout" title="Secure checkout built for global and local payments." description="Guest checkout, registered checkout, delivery, pickup, billing, shipping, and payment provider architecture are ready." />
      <Section><CheckoutForm /></Section>
    </>
  );
}
