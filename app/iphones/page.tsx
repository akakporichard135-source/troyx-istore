import type { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/product/category-page-template";
import { categoryRoutes } from "@/lib/category-routes";

export const metadata: Metadata = {
  title: "Latest iPhones",
  description: categoryRoutes.iphones.description
};

export default function IPhonesPage() {
  return <CategoryPageTemplate route={categoryRoutes.iphones} />;
}
