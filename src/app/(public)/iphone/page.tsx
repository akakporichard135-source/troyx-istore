import React from "react";
import { getProducts, getPublishedSections } from "@/lib/storage/db";
import CategoryPage from "@/components/public/CategoryPage";

export const revalidate = 0;

export default async function IPhonePage() {
  const [products, sections] = await Promise.all([
    getProducts({ category: "iphone" }),
    getPublishedSections("page-iphone"),
  ]);

  return (
    <CategoryPage
      categoryTitle="iPhone"
      categorySlug="iphone"
      tagline="Designed to be loved"
      description="Original iPhone models with genuine battery health and warranty at TroyX iStore, Bawaleshie, East Legon."
      products={products}
      sections={sections}
    />
  );
}
