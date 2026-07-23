import Image from "next/image";
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck, Sparkles, Truck, Wrench, Trophy, Zap, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { Button, LinkButton } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { featuredGroups, products } from "@/database/products";
import { bannerImages } from "@/lib/images";
import { formatCurrency } from "@/lib/utils";

const reviews = [
  {
    name: "Ama K.",
    text: "My iPhone was sealed, verified, and delivered the same day. The team explained warranty and setup clearly.",
    rating: "5.0"
  },
  {
    name: "David O.",
    text: "Premium service without the pressure. I compared MacBooks and got honest advice for my budget.",
    rating: "4.9"
  },
  {
    name: "Nadia S.",
    text: "Trade-in estimate was fair, and the final value was confirmed after inspection exactly as promised.",
    rating: "5.0"
  },
  {
    name: "Kweku M.",
    text: "First time buying gaming console online and I felt completely supported. Excellent customer service!",
    rating: "5.0"
  }
];

const trustCards: Array<[LucideIcon, string, string]> = [
  [ShieldCheck, "100% Authentic", "Verified and documented inventory with authenticity guarantees."],
  [Truck, "Fast Fulfillment", "Same-day pickup and 1-3 day delivery options available."],
  [Wrench, "Expert Support", "Book diagnostics, repairs, and get personalized buying guidance."],
  [Trophy, "Best Value", "Competitive pricing with trade-in options and flexible payment plans."]
];

const sections = [
  { id: "iphones", title: "Latest iPhones", description: "From iPhone 16 Pro to budget-friendly options", image: bannerImages.iphones },
  { id: "macbooks", title: "MacBook Collection", description: "Air, Pro, and all variants with premium performance", image: bannerImages.macbooks },
  { id: "ipads", title: "iPad Range", description: "Pro, Air, and standard models for every need", image: bannerImages.ipads },
  { id: "gaming", title: "Gaming Consoles", description: "PS5, Xbox, Nintendo Switch, and accessories", image: bannerImages.gaming }
];

const heroImage = "/images/home/hero-iphone-17-pro-max.webp";

export default function HomePage() {
  const featuredIPhone = products.find(p => p.bestSeller && p.category === "iPhone") || products[0];
  const bestSellerProducts = featuredGroups.bestSellers.slice(0, 4);
  const newArrivalProducts = featuredGroups.newArrivals.slice(0, 4);
  const gamingProducts = featuredGroups.gaming;

  return (
    <>
      {/* Hero Section - Full Screen Premium */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-white dark:from-zinc-950 dark:via-blue-950/30 dark:to-zinc-950 pt-10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl dark:bg-blue-500/10" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl dark:bg-blue-500/10" />
        </div>

        <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:px-8 relative z-10">
          {/* Hero Content */}
          <div>
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 mb-6 dark:border-blue-800 dark:bg-blue-500/10">
              <Sparkles className="h-4 w-4 text-brand-blue mr-2" />
              <span className="text-sm font-semibold text-brand-blue">Premium Apple Retailer</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-brand-ink dark:text-white leading-tight">
              TroyX iStore
            </h1>
            
            <p className="mt-4 text-2xl md:text-3xl font-semibold text-blue-600 dark:text-blue-400">
              Home of Original Apple Products
            </p>
            
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              Discover authentic Apple devices, premium gaming consoles, and expert support in Accra. Verified inventory, transparent pricing, and same-day pickup available.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <LinkButton href="/shop" className="gap-2">
                Shop Now <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href="/trade-in" variant="secondary">
                Estimate Trade-In
              </LinkButton>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 grid grid-cols-2 gap-4 max-w-md">
              {[
                ["12-Month", "Warranty"],
                ["Same-Day", "Pickup"],
                ["100%", "Verified"],
                ["Expert", "Support"]
              ].map(([value, label]) => (
                <div key={value} className="flex items-center gap-2 rounded-lg bg-white/50 backdrop-blur p-3 dark:bg-white/5">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-brand-ink dark:text-white">{value}</p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative flex h-[420px] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-blue-100/50 via-white/60 to-blue-50/40 p-6 backdrop-blur-sm dark:from-violet-950/50 dark:via-blue-950/30 dark:to-zinc-950/40 sm:h-[500px] sm:p-8 lg:h-[560px] lg:p-10">
            <Image
              src={heroImage}
              alt="iPhone 17 Pro Max"
              width={666}
              height={1184}
              priority
              sizes="(min-width: 1024px) 38vw, (min-width: 640px) 52vw, 80vw"
              className="relative z-10 h-full w-auto max-w-full rounded-2xl object-contain shadow-2xl transition-shadow duration-300 hover:shadow-3xl"
            />
          </div>
        </div>
      </section>

      {/* Featured Product Banner */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-ink to-blue-900 p-8 md:p-12 shadow-premium">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml+%22')] bg-opacity-5" />
          </div>
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-blue-300 text-sm font-semibold uppercase tracking-wide">Featured Deal</p>
              <h2 className="mt-2 text-4xl md:text-5xl font-bold text-white">{featuredIPhone.name}</h2>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">{featuredIPhone.description}</p>
              <div className="mt-6 flex items-center gap-4">
                <div>
                  <p className="text-3xl font-bold text-white">{formatCurrency(featuredIPhone.price)}</p>
                  {featuredIPhone.compareAtPrice && (
                    <p className="text-sm text-blue-200 line-through">{formatCurrency(featuredIPhone.compareAtPrice)}</p>
                  )}
                </div>
                <LinkButton href={`/product/${featuredIPhone.slug}`} className="!bg-white !text-brand-ink hover:!bg-blue-50">
                  View Details
                </LinkButton>
              </div>
            </div>
            <div className="relative h-64 md:h-80">
              <Image
                src={featuredIPhone.images[0]}
                alt={featuredIPhone.name}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Banners */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <LinkButton
              key={section.id}
              href={section.id === "gaming" ? "/categories?type=gaming" : `/categories?type=${section.id}`}
              className="!h-auto !p-0 relative group overflow-hidden rounded-2xl"
            >
              <div className="relative h-48 md:h-64 w-full">
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-white">{section.title}</h3>
                  <p className="text-blue-100 text-sm mt-2">{section.description}</p>
                </div>
              </div>
            </LinkButton>
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <Section
        eyebrow="Bestsellers"
        title="Customer Favorites"
        description="Explore the products loved by thousands of customers across Accra and beyond."
      >
        <ProductGrid products={bestSellerProducts} />
        <div className="mt-8 text-center">
          <LinkButton href="/shop?filter=bestseller">
            View All Bestsellers <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </Section>

      {/* New Arrivals Section */}
      <Section
        eyebrow="New Arrivals"
        title="Latest Releases"
        description="Fresh inventory of the newest iPhones, MacBooks, gaming consoles, and accessories."
      >
        <ProductGrid products={newArrivalProducts} />
        <div className="mt-8 text-center">
          <LinkButton href="/shop?filter=new">
            Explore All New <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </Section>

      {/* Gaming Section */}
      {gamingProducts.length > 0 && (
        <Section
          eyebrow="Gaming"
          title="Next-Gen Gaming"
          description="PlayStation 5, Xbox Series X|S, Nintendo Switch, and premium gaming accessories."
        >
          <ProductGrid products={gamingProducts} />
          <div className="mt-8 text-center">
            <LinkButton href="/categories?type=gaming">
              Explore Gaming <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </Section>
      )}

      {/* Trust Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Why Choose TroyX</p>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-brand-ink dark:text-white">Built on Trust & Quality</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustCards.map(([Icon, title, description]) => (
            <div key={title} className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm hover:shadow-md transition-shadow dark:border-white/10 dark:bg-white/5">
              <Icon className="h-8 w-8 text-brand-blue mb-4" />
              <h3 className="font-semibold text-brand-ink dark:text-white">{title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Customer Reviews</p>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-brand-ink dark:text-white">Trusted by Thousands</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 ml-2">{review.rating}</span>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">{review.text}</p>
              <p className="mt-4 font-semibold text-brand-ink dark:text-white text-sm">{review.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Store Info Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-white dark:from-white/5 dark:to-white/2.5 border border-black/5 dark:border-white/10 p-12 md:p-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Visit Us</p>
              <h2 className="mt-3 text-4xl font-bold text-brand-ink dark:text-white">Bawaleshie, East Legon</h2>
              <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Experience our premium showroom. See and test authentic Apple products and gaming consoles before you buy.
              </p>
              <div className="mt-8 space-y-4">
                <p className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                  <MapPin className="h-5 w-5 text-brand-blue flex-shrink-0" />
                  Bawaleshie, East Legon, Ghana
                </p>
                <p className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                  <Truck className="h-5 w-5 text-brand-blue flex-shrink-0" />
                  +233 207 137 437
                </p>
                <p className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                  <Package className="h-5 w-5 text-brand-blue flex-shrink-0" />
                  +233 548 974 717
                </p>
              </div>
              <div className="mt-8">
                <LinkButton href="/contact">Contact Us</LinkButton>
              </div>
            </div>
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={bannerImages.accessories}
                alt="TroyX Store"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-ink via-blue-900 to-blue-800 p-12 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Stay Updated</h2>
          <p className="mt-4 text-lg text-blue-100">Get exclusive deals, new arrivals, and expert tips delivered to your inbox.</p>
          <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full border border-white/20 bg-white/10 backdrop-blur px-6 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
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
