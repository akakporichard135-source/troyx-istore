import React from "react";
import { getProducts, getPublishedSections } from "@/lib/storage/db";
import CategoryPage from "@/components/public/CategoryPage";

export const revalidate = 0;

export default async function AccessoriesPage() {
  const [products, sections] = await Promise.all([
    getProducts({ category: "accessories" }),
    getPublishedSections("page-accessories"),
  ]);

  return (
    <CategoryPage
      categoryTitle="Accessories"
      categorySlug="accessories"
      tagline="Essential companions for your Apple gear"
      description="Original MagSafe chargers, high-wattage power bricks, cases, and cables at TroyX iStore."
      products={products}
      sections={sections}
    />
  );
}
