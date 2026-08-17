import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailActions } from "@/components/product/product-detail-actions";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGrid } from "@/components/product/product-grid";
import { Section } from "@/components/ui/section";
import { getProductBySlug, products } from "@/database/products";
import {
  getConditionSummary,
  isUsedCondition,
  normalizeConditionLabel
} from "@/lib/condition-guide";
import { formatCurrency } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images
    }
  };
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailsPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const conditionLabels = product.condition.map(normalizeConditionLabel);
  const primaryCondition = conditionLabels[0] || "To Confirm";
  const usedListing = product.condition.some(isUsedCondition);

  const related = products
    .filter(
      (item) => item.category === product.category && item.id !== product.id
    )
    .slice(0, 4);
  const frequentlyBought = products
    .filter(
      (item) => item.category === "Accessories" || item.category === "Chargers"
    )
    .slice(0, 3);
  const offerAvailability =
    product.availability === "Out of Stock"
      ? "https://schema.org/OutOfStock"
      : product.availability === "Pre-order"
        ? "https://schema.org/PreOrder"
        : "https://schema.org/LimitedAvailability";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: "Apple" },
    offers:
      product.price > 0
        ? {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "USD",
            availability: offerAvailability,
            seller: { "@type": "Organization", name: "TroyX iStore" }
          }
        : {
            "@type": "Offer",
            priceCurrency: "USD",
            availability: offerAvailability,
            seller: { "@type": "Organization", name: "TroyX iStore" }
          }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
        <ProductGallery product={product} />
        <div className="lg:py-8">
          <p className="text-sm font-semibold uppercase text-brand-blue">
            {product.category}
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-brand-ink dark:text-white sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            {product.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <p className="text-3xl font-semibold text-brand-ink dark:text-white">
              {formatCurrency(product.price)}
            </p>
            {product.compareAtPrice && product.compareAtPrice > 0 && (
              <p className="text-lg text-zinc-500 line-through">
                {formatCurrency(product.compareAtPrice)}
              </p>
            )}
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
              {product.availability}
            </span>
            {conditionLabels.map((condition) => (
              <span
                key={condition}
                className="rounded-full bg-brand-blue/10 px-3 py-1 text-sm font-semibold text-brand-blue dark:bg-brand-blue/20 dark:text-blue-200"
              >
                {condition}
              </span>
            ))}
          </div>
          <div className="mt-8">
            <ProductDetailActions product={product} />
          </div>
          <div className="mt-8 grid gap-3 text-sm text-zinc-600 sm:grid-cols-2 dark:text-zinc-300">
            <p className="rounded-2xl bg-brand-mist p-4 dark:bg-white/5">
              Warranty: {product.warranty}
            </p>
            <p className="rounded-2xl bg-brand-mist p-4 dark:bg-white/5">
              Delivery: {product.deliveryEstimate}
            </p>
            {product.batteryHealth && (
              <p className="rounded-2xl bg-brand-mist p-4 dark:bg-white/5">
                Battery health: {product.batteryHealth}
              </p>
            )}
            <p className="rounded-2xl bg-brand-mist p-4 dark:bg-white/5">
              Status: {product.availability}
            </p>
            <p className="rounded-2xl bg-brand-mist p-4 dark:bg-white/5">
              Trade-In: Available for eligible upgrades
            </p>
          </div>
        </div>
      </section>

      <Section
        className="bg-white dark:bg-zinc-950"
        eyebrow="Buying Confidence"
        title="Condition, photos, and support"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <InfoPanel
            title={`${primaryCondition} guidance`}
            description={getConditionSummary(product.condition[0])}
          />
          <InfoPanel
            title={usedListing ? "Real photos expected" : "Catalogue imagery"}
            description={
              usedListing
                ? "UK Used, Excellent, and Very Good units should include real device photos before final confirmation. Ask TroyX on WhatsApp if photos are pending."
                : "Brand New and To Confirm catalogue listings may use clean product imagery while TroyX confirms exact stock and configuration."
            }
          />
          <InfoPanel
            title="Warranty and trade-in"
            description={`Warranty: ${product.warranty}. Trade-in support is available for eligible upgrades, with final value confirmed after inspection.`}
          />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <InfoPanel
            title="Storage and colour"
            description={`Available options shown here: ${product.storage.join(", ")}. Colour choices: ${product.colors.join(", ")}.`}
          />
          <InfoPanel
            title="Battery health"
            description={
              product.batteryHealth
                ? `Battery health guidance: ${product.batteryHealth}.`
                : usedListing
                  ? "Battery health should be confirmed for every used iPhone before purchase."
                  : "Battery health is mainly relevant for used-device listings."
            }
          />
        </div>
      </Section>

      <Section
        className="bg-brand-mist dark:bg-white/5"
        eyebrow="Specifications"
        title="Technical details"
      >
        <div className="grid gap-3 md:grid-cols-2">
          {Object.entries(product.specs).map(([key, value]) => (
            <div key={key} className="rounded-2xl bg-white p-5 dark:bg-white/5">
              <p className="text-sm font-semibold text-zinc-500">{key}</p>
              <p className="mt-1 font-semibold text-brand-ink dark:text-white">
                {value}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Frequently Bought Together" title="Complete the setup">
        <ProductGrid products={frequentlyBought} compact />
      </Section>

      <Section
        className="bg-brand-mist dark:bg-white/5"
        eyebrow="Related Products"
        title="More options to compare"
      >
        <ProductGrid
          products={related.length ? related : products.slice(0, 4)}
          compact
        />
      </Section>
    </>
  );
}

function InfoPanel({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-3xl border border-black/5 bg-brand-mist p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <h3 className="text-base font-bold text-brand-ink dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
        {description}
      </p>
    </article>
  );
}
