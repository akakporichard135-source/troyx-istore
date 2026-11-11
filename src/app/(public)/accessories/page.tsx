import React from "react";
import { getProducts } from "@/lib/storage/db";
import CategoryPage from "@/components/public/CategoryPage";

export const revalidate = 0;

export default async function AccessoriesPage() {
  const products = await getProducts({ category: "accessories" });
  return (
    <CategoryPage
      categoryTitle="Accessories"
      categorySlug="accessories"
      tagline="Essential companions for your Apple gear"
      description="Original MagSafe chargers, high-wattage power bricks, cases, and cables at TroyX iStore."
      products={products}
    />
  );
}
