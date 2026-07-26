import type { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/product/category-page-template";
import { categoryRoutes } from "@/lib/category-routes";

export const metadata: Metadata = {
  title: "AirPods",
  description: categoryRoutes.airpods.description
};

export default function AirPodsPage() {
  return <CategoryPageTemplate route={categoryRoutes.airpods} />;
}
