import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { products } from "@/database/products";
import {
  featuredCategoryRoutes,
  getCategoryRoute,
  getProductsForCategory
} from "@/lib/category-routes";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse TroyX iStore product categories."
};

type CategoriesPageProps = {
  searchParams?: Promise<{
    type?: string | string[];
  }>;
};

export default async function CategoriesPage({
  searchParams
}: CategoriesPageProps) {
  const params = await searchParams;
  const type = typeof params?.type === "string" ? params.type : undefined;
  const normalizedType = type === "gaming" ? "gaming-consoles" : type;
  const activeRoute = getCategoryRoute(normalizedType);
  const isInvalidType = Boolean(type && !activeRoute);
  const visibleProducts = activeRoute
    ? getProductsForCategory(activeRoute, products)
    : products;

  return (
    <>
      <PageHeader
        eyebrow={activeRoute ? "Category" : "Categories"}
        title={
          activeRoute?.title ||
          (isInvalidType ? "Category not found" : "Browse all products")
        }
        description={
          activeRoute?.description ||
          (isInvalidType
            ? "That category link is not available. Choose a category below or browse the full catalog."
            : "Browse all TroyX iStore products, or choose a focused category page.")
        }
      />

      <Section>
        <div className="mb-8 flex flex-wrap gap-3">
          {featuredCategoryRoutes.map((route) => (
            <Link
              key={route.key}
              href={route.path}
              className={`focus-ring inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                route.key === normalizedType
                  ? "border-brand-blue bg-brand-blue text-white"
                  : "border-black/10 bg-white text-brand-ink hover:border-brand-blue hover:text-brand-blue dark:border-white/10 dark:bg-white/10 dark:text-white"
              }`}
            >
              {route.shortTitle}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ))}
        </div>

        {visibleProducts.length > 0 ? (
          <ProductGrid products={visibleProducts} />
        ) : (
          <div className="rounded-2xl border border-black/5 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
            <p className="text-lg font-semibold text-brand-ink dark:text-white">
              No products found.
            </p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Try another category or browse the full catalog.
            </p>
          </div>
        )}
      </Section>
    </>
  );
}
