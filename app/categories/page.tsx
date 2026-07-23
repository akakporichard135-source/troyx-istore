import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { products } from "@/database/products";
import type { ProductCategory } from "@/types";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse TroyX iStore product categories."
};

type CategoryRoute = {
  title: string;
  description: string;
  categories: ProductCategory[];
};

const categoryRoutes: Record<string, CategoryRoute> = {
  iphones: {
    title: "Latest iPhones",
    description: "Explore the latest iPhone models, Pro editions, and affordable options.",
    categories: ["iPhone"]
  },
  macbooks: {
    title: "MacBook Collection",
    description: "Shop MacBook Air and MacBook Pro models for work, school, and creativity.",
    categories: ["MacBook"]
  },
  ipads: {
    title: "iPad Range",
    description: "Discover iPad Pro, iPad Air, iPad mini, and standard iPad models.",
    categories: ["iPad"]
  },
  gaming: {
    title: "Gaming Consoles",
    description: "Shop PlayStation, Xbox, Nintendo Switch, and gaming accessories.",
    categories: ["Gaming", "PlayStation", "Xbox", "Nintendo", "Controllers", "Gaming Headsets"]
  }
};

type CategoriesPageProps = {
  searchParams?: Promise<{
    type?: string | string[];
  }>;
};

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const params = await searchParams;
  const type = typeof params?.type === "string" ? params.type : undefined;
  const activeRoute = type ? categoryRoutes[type] : undefined;
  const isInvalidType = Boolean(type && !activeRoute);
  const visibleProducts = activeRoute
    ? products.filter((product) => activeRoute.categories.includes(product.category))
    : products;

  return (
    <>
      <PageHeader
        eyebrow={activeRoute ? "Category" : "Categories"}
        title={activeRoute?.title || (isInvalidType ? "Category not found" : "Browse all products")}
        description={
          activeRoute?.description ||
          (isInvalidType
            ? "That category link is not available. Choose a category below or browse the full catalog."
            : "Browse all TroyX iStore products, or choose a focused category.")
        }
      />

      <Section>
        <div className="mb-8 flex flex-wrap gap-3">
          {Object.entries(categoryRoutes).map(([key, route]) => (
            <Link
              key={key}
              href={`/categories?type=${key}`}
              className={`focus-ring inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                key === type
                  ? "border-brand-blue bg-brand-blue text-white"
                  : "border-black/10 bg-white text-brand-ink hover:border-brand-blue hover:text-brand-blue dark:border-white/10 dark:bg-white/10 dark:text-white"
              }`}
            >
              {route.title}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ))}
        </div>

        {visibleProducts.length > 0 ? (
          <ProductGrid products={visibleProducts} />
        ) : (
          <div className="rounded-2xl border border-black/5 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
            <p className="text-lg font-semibold text-brand-ink dark:text-white">No products found.</p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Try another category or browse the full catalog.</p>
          </div>
        )}
      </Section>
    </>
  );
}
