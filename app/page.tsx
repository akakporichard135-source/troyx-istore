import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  MapPin,
  Package,
  Sparkles,
  Truck,
  Wrench,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { Button, LinkButton } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { featuredGroups, products } from "@/database/products";
import { bannerImages } from "@/lib/images";
import { formatCurrency } from "@/lib/utils";

const categorySections = [
  {
    id: "iphones",
    title: "Latest iPhones",
    description:
      "Explore recent iPhone models, Pro editions, and upgrade-ready options.",
    image: "/images/categories/iphones.webp",
    href: "/iphones"
  },
  {
    id: "macbooks",
    title: "MacBook Collection",
    description:
      "Shop MacBook Air and MacBook Pro models for work, school, and creativity.",
    image: "/images/categories/macbooks.webp",
    href: "/macbooks"
  },
  {
    id: "ipads",
    title: "iPad Range",
    description:
      "Discover iPad Pro, iPad Air, iPad mini, and standard iPad models.",
    image: "/images/categories/ipads.webp",
    href: "/ipads"
  },
  {
    id: "gaming",
    title: "Gaming Consoles",
    description:
      "Shop PlayStation, Xbox, Nintendo Switch, and gaming accessories.",
    image: "/images/categories/gaming.webp",
    href: "/gaming-consoles"
  }
];

const heroTrust: Array<[string, string]> = [
  ["Clear condition", "Listed per item"],
  ["Local pickup", "When available"],
  ["Contact pricing", "Before purchase"],
  ["Support desk", "Buying guidance"]
];

const benefitCards: Array<[LucideIcon, string, string]> = [
  [
    BadgeCheck,
    "Condition-first shopping",
    "Every product card highlights condition, availability, and configuration before checkout."
  ],
  [
    Truck,
    "Flexible fulfillment",
    "Pickup and delivery options can be confirmed per order after inventory is checked."
  ],
  [
    Wrench,
    "Repair and trade-in support",
    "Customers can request diagnostics, book repair intake, or start a trade-in estimate."
  ],
  [
    Package,
    "Curated catalogue",
    "Homepage sections stay focused while full product families remain on category pages."
  ]
];

const heroImage = "/images/home/hero-iphone-17-pro-max.webp";
const featuredDealImage = "/images/home/featured-iphone-16-pro-max.webp";

export default function HomePage() {
  const featuredDeal =
    products.find((product) => product.slug === "iphone-16-pro-max") ||
    products.find((product) => product.bestSeller && product.category === "iPhone") ||
    products[0];
  const iphoneLineup = products
    .filter((product) => product.category === "iPhone")
    .slice(0, 8);
  const bestSellerProducts = featuredGroups.bestSellers.slice(0, 4);
  const newArrivalProducts = featuredGroups.newArrivals.slice(0, 4);
  const macProducts = products
    .filter((product) => product.category === "MacBook")
    .slice(0, 4);
  const ipadWatchProducts = products
    .filter((product) => product.category === "iPad" || product.category === "Apple Watch")
    .slice(0, 4);
  const gamingProducts = featuredGroups.gaming.slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-white pt-10 dark:from-zinc-950 dark:via-blue-950/30 dark:to-zinc-950">
        <div className="relative z-10 mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 pb-14 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="mb-6 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-800 dark:bg-blue-500/10">
              <Sparkles className="mr-2 h-4 w-4 text-brand-blue" />
              <span className="text-sm font-semibold text-brand-blue">
                Premium Apple and Gaming Catalogue
              </span>
            </div>

            <h1 className="text-6xl font-bold leading-tight tracking-tight text-brand-ink dark:text-white md:text-7xl">
              TroyX iStore
            </h1>

            <p className="mt-4 text-2xl font-semibold text-blue-600 dark:text-blue-400 md:text-3xl">
              Home of Original Apple Products
            </p>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              Browse a curated Apple and gaming catalogue built around clear
              product images, transparent condition labels, and guided support
              before you buy.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <LinkButton href="/shop" className="gap-2">
                Shop Now <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href="/trade-in" variant="secondary">
                Estimate Trade-In
              </LinkButton>
            </div>

            <div className="mt-12 grid max-w-md grid-cols-2 gap-4">
              {heroTrust.map(([value, label]) => (
                <div
                  key={value}
                  className="flex items-center gap-2 rounded-lg bg-white/50 p-3 backdrop-blur dark:bg-white/5"
                >
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-brand-blue" />
                  <div>
                    <p className="text-sm font-semibold text-brand-ink dark:text-white">
                      {value}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex h-[420px] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-blue-100/50 via-white/60 to-blue-50/40 p-6 backdrop-blur-sm dark:from-violet-950/50 dark:via-blue-950/30 dark:to-zinc-950/40 sm:h-[500px] sm:p-8 lg:h-[560px] lg:p-10">
            <Image
              src={heroImage}
              alt="iPhone 17 Pro Max"
              width={666}
              height={1184}
              priority
              sizes="(min-width: 1024px) 38vw, (min-width: 640px) 52vw, 80vw"
              className="relative z-10 h-full w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue">
              Shop by Category
            </p>
            <h2 className="mt-2 text-3xl font-bold text-brand-ink dark:text-white md:text-5xl">
              Start with the right family.
            </h2>
          </div>
          <LinkButton href="/categories" variant="secondary">
            View All Categories <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {categorySections.map((section) => (
            <Link
              key={section.id}
              href={section.href}
              className="focus-ring group relative block h-64 overflow-hidden rounded-2xl border border-black/5 bg-zinc-950 shadow-sm transition hover:-translate-y-1 hover:shadow-premium dark:border-white/10 md:h-72"
              aria-label={`Browse ${section.title}`}
            >
              <Image
                src={section.image}
                alt={`${section.title} category`}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <h3 className="text-2xl font-bold text-white md:text-3xl">
                  {section.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-blue-50 sm:text-base">
                  {section.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Section
        eyebrow="Explore the iPhone Lineup"
        title="Recent generations, clearly organised"
        description="Swipe through curated iPhone options, then open the full iPhone catalogue for every available model."
      >
        <ProductGrid products={iphoneLineup} compact />
        <div className="mt-8 text-center">
          <LinkButton href="/iphones">
            View All iPhones <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </Section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-ink to-blue-900 p-8 shadow-premium md:p-12">
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
                Featured Deal
              </p>
              <h2 className="mt-2 text-4xl font-bold text-white md:text-5xl">
                {featuredDeal.name}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-blue-100">
                {featuredDeal.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <p className="text-3xl font-bold text-white">
                  {formatCurrency(featuredDeal.price)}
                </p>
                <LinkButton
                  href={`/product/${featuredDeal.slug}`}
                  className="!bg-white !text-brand-ink hover:!bg-blue-50"
                >
                  View Details
                </LinkButton>
              </div>
            </div>
            <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-inner sm:h-96 sm:p-7 md:h-[420px]">
              <Image
                src={featuredDealImage}
                alt={featuredDeal.name}
                fill
                sizes="(min-width: 768px) 42vw, 86vw"
                className="object-contain p-5 sm:p-7"
              />
            </div>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Best Sellers"
        title="Curated customer favourites"
        description="A compact view of standout products. Use the shop page for the complete catalogue and filters."
      >
        <ProductGrid products={bestSellerProducts} compact />
        <div className="mt-8 text-center">
          <LinkButton href="/shop?filter=bestseller">
            View Best Sellers <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </Section>

      <Section
        eyebrow="New Arrivals"
        title="Fresh catalogue additions"
        description="Recently added Apple devices, consoles, and accessories prepared for comparison."
      >
        <ProductGrid products={newArrivalProducts} compact />
        <div className="mt-8 text-center">
          <LinkButton href="/shop?filter=new">
            Explore New Arrivals <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </Section>

      <Section
        eyebrow="Mac Collection"
        title="MacBook options for work and study"
        description="Compare portable Mac options without flooding the homepage with the full Mac catalogue."
      >
        <ProductGrid products={macProducts} compact />
        <div className="mt-8 text-center">
          <LinkButton href="/macbooks">
            View Mac Collection <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </Section>

      <Section
        eyebrow="iPad and Apple Watch Highlights"
        title="Portable screens and wearables"
        description="A short lineup for tablets and watches, with full lists available on category pages."
      >
        <ProductGrid products={ipadWatchProducts} compact />
      </Section>

      {gamingProducts.length > 0 && (
        <Section
          eyebrow="Gaming Highlights"
          title="Console and accessory picks"
          description="A concise gaming lineup covering consoles and accessories without replacing the full gaming catalogue."
        >
          <ProductGrid products={gamingProducts} compact />
          <div className="mt-8 text-center">
            <LinkButton href="/gaming-consoles">
              Explore Gaming <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </Section>
      )}

      <Section
        className="bg-brand-mist dark:bg-white/5"
        eyebrow="Trade-In and Repair"
        title="Support beyond checkout"
        description="Trade-in estimates and repair booking stay available as guided service flows."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Trade in your current device",
              description:
                "Start a device estimate and confirm final value after inspection.",
              href: "/trade-in",
              label: "Start Trade-In",
              icon: Zap
            },
            {
              title: "Book diagnostics and repairs",
              description:
                "Request a repair intake for iPhone, iPad, Mac, AirPods, and accessories.",
              href: "/repair-booking",
              label: "Book Repair",
              icon: Wrench
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-3xl border border-black/5 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-premium dark:border-white/10 dark:bg-zinc-900"
              >
                <Icon className="h-7 w-7 text-brand-blue" />
                <h3 className="mt-5 text-2xl font-bold text-brand-ink dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {item.description}
                </p>
                <LinkButton href={item.href} variant="secondary" className="mt-6">
                  {item.label} <ArrowRight className="h-4 w-4" />
                </LinkButton>
              </div>
            );
          })}
        </div>
      </Section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Customer Benefits
          </p>
          <h2 className="mt-2 text-4xl font-bold text-brand-ink dark:text-white md:text-5xl">
            Built for confident comparison.
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {benefitCards.map(([Icon, title, description]) => (
            <div
              key={title}
              className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-white/5"
            >
              <Icon className="mb-4 h-8 w-8 text-brand-blue" />
              <h3 className="font-semibold text-brand-ink dark:text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-black/5 bg-gradient-to-br from-blue-50 to-white p-12 dark:border-white/10 dark:from-white/5 dark:to-white/[0.03] md:p-16">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Visit Us
              </p>
              <h2 className="mt-3 text-4xl font-bold text-brand-ink dark:text-white">
                Bawaleshie, East Legon
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
                Visit the showroom to inspect available products, compare
                configurations, and ask the team for buying guidance.
              </p>
              <div className="mt-8 space-y-4">
                <p className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                  <MapPin className="h-5 w-5 flex-shrink-0 text-brand-blue" />
                  Bawaleshie, East Legon, Ghana
                </p>
                <p className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                  <Truck className="h-5 w-5 flex-shrink-0 text-brand-blue" />
                  +233 207 137 437
                </p>
              </div>
              <div className="mt-8">
                <LinkButton href="/contact">Contact Us</LinkButton>
              </div>
            </div>
            <div className="relative h-64 overflow-hidden rounded-2xl shadow-lg md:h-80">
              <Image
                src={bannerImages.accessories}
                alt="TroyX iStore accessories display"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-ink via-blue-900 to-blue-800 p-12 text-center md:p-16">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Stay Updated
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Get restock notes, service updates, and buying guidance delivered to
            your inbox.
          </p>
          <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email address"
              className="flex-1 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-white placeholder-white/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            <Button type="submit" className="!rounded-full px-8">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
