import type { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/product/category-page-template";
import { categoryRoutes } from "@/lib/category-routes";

export const metadata: Metadata = {
  title: "Gaming Accessories",
  description: categoryRoutes["gaming-accessories"].description
};

export default function GamingAccessoriesPage() {
  return <CategoryPageTemplate route={categoryRoutes["gaming-accessories"]} />;
}
