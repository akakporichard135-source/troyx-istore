"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { ProductGrid } from "@/components/product/product-grid";
import { useCommerceStore } from "@/context/store";
import { products } from "@/database/products";

export function WishlistClient() {
  const wishlist = useCommerceStore((state) => state.wishlist);
  const saved = products.filter((product) => wishlist.includes(product.id));
  if (!saved.length) {
    return <EmptyState title="No saved products yet" description="Save products you want to revisit or move to cart later." />;
  }
  return <ProductGrid products={saved} />;
}
