import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { categories, getProductsByCategory } from "@/database/products";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse TroyX iStore product categories."
};

export default function CategoriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Categories"
        title="Browse Apple devices and accessories by category."
        description="Phones, laptops, tablets, watches, audio, power, protection, cables, adapters, speakers, and smart accessories."
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/shop?category=${encodeURIComponent(category)}`}
              className="group rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-premium dark:border-white/10 dark:bg-white/5"
            >
              <p className="text-xl font-semibold text-brand-ink dark:text-white">{category}</p>
              <p className="mt-2 text-sm text-zinc-500">{getProductsByCategory(category).length || "More"} products</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue">
                Browse <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
