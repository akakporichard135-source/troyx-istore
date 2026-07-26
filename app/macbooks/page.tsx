import type { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/product/category-page-template";
import { categoryRoutes } from "@/lib/category-routes";

export const metadata: Metadata = {
  title: "MacBook Collection",
  description: categoryRoutes.macbooks.description
};

export default function MacBooksPage() {
  return <CategoryPageTemplate route={categoryRoutes.macbooks} />;
}
