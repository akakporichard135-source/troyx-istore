import type { Metadata } from "next";
import { CartManager } from "@/components/commerce/cart-manager";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = { title: "Cart", description: "Review your TroyX iStore cart." };

export default function CartPage() {
  return (
    <>
      <PageHeader eyebrow="Cart" title="Review your bag before checkout." description="Update quantities, remove products, estimate shipping, apply coupons, and continue to checkout." />
      <Section><CartManager /></Section>
    </>
  );
}
