import type { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/product/category-page-template";
import { categoryRoutes } from "@/lib/category-routes";

export const metadata: Metadata = {
  title: "Apple Accessories",
  description: categoryRoutes["apple-accessories"].description
};

export default function AppleAccessoriesPage() {
  return <CategoryPageTemplate route={categoryRoutes["apple-accessories"]} />;
}
