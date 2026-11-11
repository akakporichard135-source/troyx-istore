import React from "react";
import { getProducts, getPublishedSections } from "@/lib/storage/db";
import CategoryPage from "@/components/public/CategoryPage";

export const revalidate = 0;

export default async function WatchPage() {
  const [products, sections] = await Promise.all([
    getProducts({ category: "watch" }),
    getPublishedSections("page-watch"),
  ]);

  return (
    <CategoryPage
      categoryTitle="Apple Watch"
      categorySlug="watch"
      tagline="To wear it is to love it"
      description="Original Apple Watch Series, SE, and Ultra with health and fitness tracking at TroyX iStore."
      products={products}
      sections={sections}
    />
  );
}
