import React from "react";
import { getProducts, getPublishedSections } from "@/lib/storage/db";
import CategoryPage from "@/components/public/CategoryPage";

export const revalidate = 0;

export default async function AirPodsPage() {
  const [products, sections] = await Promise.all([
    getProducts({ category: "airpods" }),
    getPublishedSections("page-airpods"),
  ]);

  return (
    <CategoryPage
      categoryTitle="AirPods"
      categorySlug="airpods"
      tagline="Magic runs in the family"
      description="Original Apple AirPods with Active Noise Cancellation and Spatial Audio at TroyX iStore."
      products={products}
      sections={sections}
    />
  );
}
