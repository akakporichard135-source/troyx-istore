import type { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/product/category-page-template";
import { categoryRoutes } from "@/lib/category-routes";

export const metadata: Metadata = {
  title: "Gaming Consoles",
  description: categoryRoutes["gaming-consoles"].description
};

export default function GamingConsolesPage() {
  return <CategoryPageTemplate route={categoryRoutes["gaming-consoles"]} />;
}
