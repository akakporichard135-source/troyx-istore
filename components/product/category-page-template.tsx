import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { products } from "@/database/products";
import {
  featuredCategoryRoutes,
  getProductsForCategory,
  type CategoryRoute
} from "@/lib/category-routes";

export function CategoryPageTemplate({ route }: { route: CategoryRoute }) {
  const visibleProducts = getProductsForCategory(route, products);

  return (
    <>
      <PageHeader
        eyebrow={route.eyebrow}
        title={route.title}
        description={route.description}
      >
        <div className="flex flex-wrap gap-3">
          {featuredCategoryRoutes.map((item) => (
            <Link
              key={item.key}
              href={item.path}
              className={`focus-ring inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
                item.key === route.key
                  ? "border-brand-blue bg-brand-blue text-white shadow-lg shadow-blue-500/20"
                  : "border-black/10 bg-white text-brand-ink hover:border-brand-blue hover:text-brand-blue dark:border-white/10 dark:bg-white/10 dark:text-white"
              }`}
            >
              {item.shortTitle}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ))}
        </div>
      </PageHeader>

      <Section className="bg-white dark:bg-zinc-950">
        <div className="mb-8 grid gap-4 rounded-3xl border border-black/5 bg-brand-mist p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:grid-cols-3">
          {[
            ["Products", `${visibleProducts.length} catalogue items`],
            ["Pricing", "Contact for price until final inventory is confirmed"],
            [
              "Images",
              "Verified local assets are used where available; items awaiting approved media are clearly marked"
            ]
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-start gap-3 rounded-2xl bg-white p-4 dark:bg-zinc-950/60"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">
                  {label}
                </p>
                <p className="mt-1 text-sm font-semibold leading-6 text-brand-ink dark:text-white">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {visibleProducts.length ? (
          <ProductGrid products={visibleProducts} />
        ) : (
          <div className="rounded-3xl border border-black/5 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
            <p className="text-lg font-semibold text-brand-ink dark:text-white">
              No products are available in this category yet.
            </p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Check back after inventory is updated from the admin catalogue.
            </p>
          </div>
        )}
      </Section>
    </>
  );
}
