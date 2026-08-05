import type { Metadata } from "next";
import { CheckoutForm } from "@/components/commerce/checkout-form";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure TroyX iStore checkout for delivery, pickup, and quote requests."
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Checkout"
        title="Secure checkout for delivery, pickup, and quotes."
        description="Review your details, choose fulfillment, and submit your order or quote request for final confirmation."
      />
      <Section>
        <CheckoutForm />
      </Section>
    </>
  );
}
