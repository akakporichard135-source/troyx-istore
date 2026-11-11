import React from "react";
import { getProducts } from "@/lib/storage/db";
import CategoryPage from "@/components/public/CategoryPage";

export const revalidate = 0;

export default async function IPhonePage() {
  const products = await getProducts({ category: "iphone" });
  return (
    <CategoryPage
      categoryTitle="iPhone"
      categorySlug="iphone"
      tagline="Designed to be loved"
      description="Original iPhone models with genuine battery health and warranty at TroyX iStore, Bawaleshie, East Legon."
      products={products}
    />
  );
}
