"use client";

import { ProductGrid } from "@/components/product/product-grid";
import { LinkButton } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { products } from "@/database/products";
import { categoryRoutes, getProductsForCategory } from "@/lib/category-routes";
import { ArrowRight } from "lucide-react";

export default function GamingPage() {
  const consoles = getProductsForCategory(
    categoryRoutes["gaming-consoles"],
    products
  ).slice(0, 4);
  const accessories = getProductsForCategory(
    categoryRoutes["gaming-accessories"],
    products
  ).slice(0, 4);

  return (
    <>
      <PageHeader
        eyebrow="Gaming"
        title="Next-Gen Gaming Consoles & Accessories"
        description="PlayStation, Xbox, Nintendo, controllers, headsets, storage, and charging accessories with quote-based availability."
      />

      {/* Console Showcase */}
      <Section
        eyebrow="Gaming Consoles"
        title="Latest Consoles"
        description="A curated console selection with final pricing and availability confirmed before purchase."
      >
        <ProductGrid products={consoles} />
        <div className="mt-8 text-center">
          <LinkButton href="/gaming-consoles">
            View All Consoles <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </Section>

      {/* Gaming Accessories */}
      {accessories.length > 0 && (
        <Section
          eyebrow="Gaming Gear"
          title="Controllers, Headsets & Add-ons"
          description="Browse accessories prepared for PlayStation, Xbox, Nintendo, and storage expansion setups."
        >
          <ProductGrid products={accessories} />
          <div className="mt-8 text-center">
            <LinkButton href="/gaming-accessories">
              View Gaming Accessories <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </Section>
      )}

      {/* Gaming Comparison */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            Choose Your Platform
          </p>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-brand-ink dark:text-white">
            Gaming Platforms Comparison
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "PlayStation 5",
              features: [
                "4K Gaming",
                "Exclusive Titles",
                "DualSense Controller",
                "825GB SSD",
                "Backward Compatible"
              ],
              button: "Explore PlayStation"
            },
            {
              title: "Xbox Series X",
              features: [
                "4K Gaming",
                "Game Pass",
                "Backwards Compatible",
                "1TB SSD",
                "Quick Resume"
              ],
              button: "Explore Xbox"
            },
            {
              title: "Nintendo Switch",
              features: [
                "Handheld & Docked",
                "Portable Gaming",
                "Family Friendly",
                "Great Library",
                "Online Multiplayer"
              ],
              button: "Explore Nintendo"
            }
          ].map((platform) => (
            <div
              key={platform.title}
              className="rounded-2xl border border-black/5 bg-white p-8 hover:shadow-lg transition dark:border-white/10 dark:bg-white/5"
            >
              <h3 className="text-2xl font-bold text-brand-ink dark:text-white">
                {platform.title}
              </h3>
              <p className="mt-2 text-sm font-bold uppercase tracking-wide text-brand-blue">
                Contact for price
              </p>
              <ul className="mt-6 space-y-3">
                {platform.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                    {feature}
                  </li>
                ))}
              </ul>
              <LinkButton href="/gaming-consoles" className="w-full mt-8">
                {platform.button}
              </LinkButton>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-brand-ink dark:text-white">
          Can&apos;t Decide?
        </h2>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">
          Our gaming experts can help you choose the perfect console for your
          needs. Visit our showroom in Bawaleshie or call us today.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <LinkButton href="/contact">Contact Us</LinkButton>
          <LinkButton href="/shop" variant="secondary">
            Browse All Gaming <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </section>
    </>
  );
}
