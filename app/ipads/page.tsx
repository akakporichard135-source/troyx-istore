import type { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/product/category-page-template";
import { categoryRoutes } from "@/lib/category-routes";

export const metadata: Metadata = {
  title: "iPad Range",
  description: categoryRoutes.ipads.description
};

export default function IPadsPage() {
  return <CategoryPageTemplate route={categoryRoutes.ipads} />;
}
