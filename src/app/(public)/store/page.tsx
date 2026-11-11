import React from "react";
import { getProducts } from "@/lib/storage/db";
import CategoryPage from "@/components/public/CategoryPage";

export const revalidate = 0;

export default async function StorePage() {
  const products = await getProducts();
  return (
    <CategoryPage
      categoryTitle="Apple Store"
      categorySlug="all"
      tagline="Home of Original Apple Products"
      description="The official collection of authentic Apple hardware at TroyX iStore in East Legon, Accra."
      products={products}
    />
  );
}
