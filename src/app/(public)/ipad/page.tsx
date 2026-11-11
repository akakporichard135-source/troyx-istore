import React from "react";
import { getProducts } from "@/lib/storage/db";
import CategoryPage from "@/components/public/CategoryPage";

export const revalidate = 0;

export default async function IPadPage() {
  const products = await getProducts({ category: "ipad" });
  return (
    <CategoryPage
      categoryTitle="iPad"
      categorySlug="ipad"
      tagline="Touch, draw, and type on one magical device"
      description="Genuine iPad Pro, iPad Air, and iPad mini tablets available at TroyX iStore in East Legon."
      products={products}
    />
  );
}
