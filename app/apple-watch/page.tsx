import type { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/product/category-page-template";
import { categoryRoutes } from "@/lib/category-routes";

export const metadata: Metadata = {
  title: "Apple Watch",
  description: categoryRoutes["apple-watch"].description
};

export default function AppleWatchPage() {
  return <CategoryPageTemplate route={categoryRoutes["apple-watch"]} />;
}
