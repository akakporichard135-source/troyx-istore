import type { Metadata } from "next";
import { WishlistClient } from "@/components/commerce/wishlist-client";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = { title: "Wishlist", description: "Saved TroyX iStore products." };

export default function WishlistPage() {
  return (
    <>
      <PageHeader eyebrow="Wishlist" title="Saved products for later." description="Save products, remove items, compare, or move them to cart when ready." />
      <Section><WishlistClient /></Section>
    </>
  );
}
