import React from "react";
import { getProducts } from "@/lib/storage/db";
import CategoryPage from "@/components/public/CategoryPage";

export const revalidate = 0;

export default async function WatchPage() {
  const products = await getProducts({ category: "watch" });
  return (
    <CategoryPage
      categoryTitle="Apple Watch"
      categorySlug="watch"
      tagline="To wear it is to love it"
      description="Original Apple Watch Series, SE, and Ultra with health and fitness tracking at TroyX iStore."
      products={products}
    />
  );
}
