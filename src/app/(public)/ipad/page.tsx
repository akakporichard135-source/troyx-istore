import React from "react";
import { getProducts, getPublishedSections } from "@/lib/storage/db";
import CategoryPage from "@/components/public/CategoryPage";

export const revalidate = 0;

export default async function IPadPage() {
  const [products, sections] = await Promise.all([
    getProducts({ category: "ipad" }),
    getPublishedSections("page-ipad"),
  ]);

  return (
    <CategoryPage
      categoryTitle="iPad"
      categorySlug="ipad"
      tagline="Touch, draw, and type on one magical device"
      description="Genuine iPad Pro, iPad Air, and iPad mini tablets available at TroyX iStore in East Legon."
      products={products}
      sections={sections}
    />
  );
}
