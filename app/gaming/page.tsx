"use client";

import { ProductGrid } from "@/components/product/product-grid";
import { LinkButton } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { featuredGroups } from "@/database/products";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function GamingPage() {
  const consoles = featuredGroups.gaming.filter(p => ["PlayStation", "Xbox", "Nintendo"].includes(p.category));
  const accessories = featuredGroups.gaming.filter(p => ["Controllers", "Gaming Headsets"].includes(p.category));

  return (
    <>
      <PageHeader
        eyebrow="Gaming"
        title="Next-Gen Gaming Consoles & Accessories"
        description="PlayStation 5, Xbox Series X|S, Nintendo Switch, and premium gaming accessories - all verified and in stock."
      />

      {/* Console Showcase */}
      <Section eyebrow="Gaming Consoles" title="Latest Consoles" description="Next-generation gaming experiences with exclusive titles and premium performance.">
        <ProductGrid products={consoles} />
      </Section>

      {/* Gaming Accessories */}
      {accessories.length > 0 && (
        <Section eyebrow="Gaming Gear" title="Controllers & Headsets" description="Level up your gaming with premium accessories and peripherals.">
          <ProductGrid products={accessories} />
        </Section>
      )}

      {/* Gaming Comparison */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Choose Your Platform</p>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-brand-ink dark:text-white">Gaming Platforms Comparison</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "PlayStation 5",
              price: "GHS 3,299",
              features: ["4K Gaming", "Exclusive Titles", "DualSense Controller", "825GB SSD", "Backward Compatible"],
              button: "Shop PS5"
            },
            {
              title: "Xbox Series X",
              price: "GHS 3,299",
              features: ["4K Gaming", "Game Pass", "Backwards Compatible", "1TB SSD", "Quick Resume"],
              button: "Shop Xbox"
            },
            {
              title: "Nintendo Switch",
              price: "GHS 1,900",
              features: ["Handheld & Docked", "Portable Gaming", "Family Friendly", "Great Library", "Online Multiplayer"],
              button: "Shop Switch"
            }
          ].map((platform) => (
            <div
              key={platform.title}
              className="rounded-2xl border border-black/5 bg-white p-8 hover:shadow-lg transition dark:border-white/10 dark:bg-white/5"
            >
              <h3 className="text-2xl font-bold text-brand-ink dark:text-white">{platform.title}</h3>
              <p className="mt-2 text-3xl font-bold text-brand-blue">{platform.price}</p>
              <ul className="mt-6 space-y-3">
                {platform.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                    {feature}
                  </li>
                ))}
              </ul>
              <LinkButton href="/shop" className="w-full mt-8">
                {platform.button}
              </LinkButton>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-brand-ink dark:text-white">Can't Decide?</h2>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">
          Our gaming experts can help you choose the perfect console for your needs. Visit our showroom in Bawaleshie or call us today.
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
