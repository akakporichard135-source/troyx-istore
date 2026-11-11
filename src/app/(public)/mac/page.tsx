import React from "react";
import { getProducts } from "@/lib/storage/db";
import CategoryPage from "@/components/public/CategoryPage";

export const revalidate = 0;

export default async function MacPage() {
  const products = await getProducts({ category: "mac" });
  return (
    <CategoryPage
      categoryTitle="Mac"
      categorySlug="mac"
      tagline="Power meets precision"
      description="MacBook Pro, MacBook Air, and iMac desktops powered by Apple Silicon at TroyX iStore Accra."
      products={products}
    />
  );
}
