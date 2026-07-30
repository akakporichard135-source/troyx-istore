import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Gamepad2,
  Headphones,
  Laptop,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Smartphone,
  Tablet,
  Truck,
  Watch,
  Wrench,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { Product } from "@/types";
import { LinkButton } from "@/components/ui/button";
import { products } from "@/database/products";
import { siteConfig } from "@/lib/site";
import { cn, formatCurrency } from "@/lib/utils";

type CategoryCard = {
  id: string;
  title: string;
  description: string;
  image?: string;
  href: string;
  icon: LucideIcon;
  focal?: string;
};

const categorySections: CategoryCard[] = [
  {
    id: "iphones",
    title: "iPhones",
    description:
      "Recent iPhone generations, Pro editions, and budget-friendly options.",
    image: "/images/categories/iphones.webp",
    href: "/iphones",
    icon: Smartphone,
    focal: "object-center"
  },
  {
    id: "macbooks",
    title: "MacBooks",
    description:
      "MacBook Air and MacBook Pro options for study, work, and creative tasks.",
    image: "/images/categories/macbooks.webp",
    href: "/macbooks",
    icon: Laptop,
    focal: "object-center"
  },
  {
    id: "ipads",
    title: "iPads",
    description:
      "iPad Pro, iPad Air, iPad mini, and everyday iPad models.",
    image: "/images/categories/ipads.webp",
    href: "/ipads",
    icon: Tablet,
    focal: "object-center"
  },
  {
    id: "watch",
    title: "Apple Watch",
    description:
      "Everyday health, fitness, notifications, and stylish watch options.",
    href: "/apple-watch",
    icon: Watch
  },
  {
    id: "airpods",
    title: "AirPods",
    description:
      "Wireless audio for calls, workouts, travel, and immersive listening.",
    href: "/airpods",
    icon: Headphones
  },
  {
    id: "gaming",
    title: "Gaming Consoles",
    description:
      "PlayStation, Xbox, Nintendo Switch, controllers, and gaming accessories.",
    image: "/images/categories/gaming.webp",
    href: "/gaming-consoles",
    icon: Gamepad2,
    focal: "object-center"
  }
];

const heroTrust: Array<[LucideIcon, string, string]> = [
  [ShieldCheck, "Carefully inspected", "Condition reviewed before sale"],
  [Truck, "Local pickup", "Available when stock allows"],
  [BadgeCheck, "Clear condition info", "No hidden configuration guessing"],
  [MessageCircle, "Before and after support", "Guidance from first chat onward"]
];

const benefits: Array<[LucideIcon, string, string]> = [
  [
    ShieldCheck,
    "Condition clarity",
    "Product cards keep the essentials visible: model, storage, color, condition, and stock status."
  ],
  [
    PackageCheck,
    "Curated selection",
    "The homepage stays focused, while each category page holds the complete catalogue."
  ],
  [
    Wrench,
    "Repair support",
    "Book diagnostics for Apple devices and accessories before committing to next steps."
  ],
  [
    Zap,
    "Trade-in guidance",
    "Start with an estimate, then confirm final value after physical inspection."
  ]
];

const heroImage = "/images/home/hero-iphone-dark-cutout.webp";
const featuredDealImage = "/images/home/featured-iphone-16-pro-max-cutout.webp";

const homeProductImages: Record<string, string> = {
  "iphone-16-pro-max": "/images/home/featured-iphone-16-pro-max-cutout.webp",
  "iphone-16-pro": "/images/home/iphone-gold-cutout.webp",
  "iphone-16-plus": "/images/home/iphone-teal-cutout.webp",
  "iphone-16": "/images/home/hero-iphone-dark-cutout.webp",
  "iphone-15-pro-max": "/images/home/iphone-15-pro-cutout.webp",
  "iphone-15-pro": "/images/home/iphone-15-pro-cutout.webp",
  "iphone-15-plus": "/images/home/iphone-15-plus-cutout.webp",
  "iphone-15": "/images/home/iphone-15-cutout.webp",
  "iphone-14-pro-max": "/images/home/iphone-14-pro-max-cutout.webp",
  "iphone-14-pro": "/images/home/iphone-14-pro-cutout.webp",
  "iphone-14-plus": "/images/home/iphone-14-plus-cutout.webp",
  "iphone-14": "/images/home/iphone-14-cutout.webp"
};

const featuredIphoneSlugs = [
  "iphone-16-pro-max",
  "iphone-16-pro",
  "iphone-16-plus",
  "iphone-16",
  "iphone-15-pro-max",
  "iphone-15"
];

const bestSellerSlugs = [
  "iphone-15-pro",
  "iphone-15-plus",
  "iphone-14-pro-max",
  "iphone-14-plus"
];

const newArrivalSlugs = ["iphone-14-pro", "iphone-14"];

const tradeInSteps: Array<[LucideIcon, string, string]> = [
  [
    Smartphone,
    "Device details",
    "Tell us your current device model and condition."
  ],
  [
    BadgeCheck,
    "Condition review",
    "Share storage, battery health, and any visible faults."
  ],
  [
    MessageCircle,
    "Estimate",
    "Receive a guided trade-in assessment from the team."
  ],
  [
    CheckCircle2,
    "Inspection",
    "Confirm final value after physical inspection."
  ]
];

const whatsappHref =
  "https://wa.me/233207137437?text=Hello%20TroyX%20iStore%2C%20I%20need%20help%20choosing%20an%20Apple%20device.";

function getProductsBySlugs(slugs: string[]) {
  return slugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));
}

function priceLabel(product: Product) {
  return product.price > 0 ? formatCurrency(product.price) : "Contact for price";
}

function colorDots(product: Product) {
  return product.colors.slice(0, 4);
}

function storageOptions(product: Product) {
  return product.storage.slice(0, 3);
}

function HomeSection({
  eyebrow,
  title,
  description,
  children,
  action
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="home-reveal bg-[#07090F] px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#65B4FF]">
              {eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#A8B0BF]">
              {description}
            </p>
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}

function HomeProductCard({ product }: { product: Product }) {
  const image = homeProductImages[product.slug] || product.images[0];

  return (
    <article className="home-card-shadow group flex h-full min-h-[520px] flex-col overflow-hidden rounded-[1.65rem] border border-white/10 home-premium-surface transition duration-500 hover:-translate-y-1.5 hover:border-[#1687F8]/45">
      <Link
        href={`/product/${product.slug}`}
        className="focus-ring relative m-3 flex aspect-[5/4] items-center justify-center overflow-hidden rounded-[1.25rem] border border-white/10 bg-[radial-gradient(circle_at_50%_12%,rgba(101,180,255,0.20),transparent_45%),#151D2B] p-4"
        aria-label={`View ${product.name}`}
      >
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
          className="object-contain p-1 transition duration-700 group-hover:scale-[1.07] sm:p-2"
          loading="lazy"
        />
      </Link>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#65B4FF]">
          {product.series}
        </p>
        <h3 className="mt-2 min-h-[3.25rem] text-xl font-bold leading-snug text-white">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 min-h-[3rem] text-sm leading-6 text-[#A8B0BF]">
          {product.description}
        </p>
        <div className="mt-4 flex min-h-[2rem] flex-wrap gap-2" aria-label="Storage options">
          {storageOptions(product).map((storage) => (
            <span
              key={`${product.id}-${storage}`}
              className="rounded-full border border-[#65B4FF]/20 bg-[#1687F8]/10 px-3 py-1 text-[11px] font-bold text-[#DDEEFF]"
            >
              {storage}
            </span>
          ))}
        </div>
        <div className="mt-3 flex min-h-[2rem] flex-wrap gap-2" aria-label="Available colors">
          {colorDots(product).map((color) => (
            <span
              key={`${product.id}-${color}`}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-[#DDE6F3]"
            >
              {color}
            </span>
          ))}
        </div>
        <div className="mt-3 flex min-h-[1.75rem] flex-wrap gap-2" aria-label="Condition">
          {product.condition.map((condition) => (
            <span
              key={`${product.id}-${condition}`}
              className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-[#A8B0BF]"
            >
              {condition}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-5">
          <p className="text-base font-bold text-white">{priceLabel(product)}</p>
          <Link
            href={`/product/${product.slug}`}
            className="focus-ring inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-white transition duration-300 hover:border-[#1687F8] hover:bg-[#1687F8] hover:text-white"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

function CategoryTile({ section }: { section: CategoryCard }) {
  const Icon = section.icon;

  return (
    <Link
      href={section.href}
      className="focus-ring home-card-shadow group relative flex min-h-[300px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111722] transition duration-500 hover:-translate-y-1.5 hover:border-[#1687F8]/50"
      aria-label={`Browse ${section.title}`}
    >
      {section.image ? (
        <Image
          src={section.image}
          alt={`${section.title} category`}
          fill
          sizes="(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
          className={cn(
            "object-cover transition duration-700 group-hover:scale-110",
            section.focal
          )}
          loading="lazy"
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(22,135,248,0.24),transparent_34%),radial-gradient(circle_at_20%_74%,rgba(101,180,255,0.12),transparent_36%),linear-gradient(135deg,#151D2B,#0D111B)]" />
          <div className="absolute right-6 top-6 flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#65B4FF]/70 shadow-[0_20px_80px_rgba(22,135,248,0.16)] transition duration-700 group-hover:scale-110 group-hover:text-[#65B4FF]">
            <Icon className="h-14 w-14" />
          </div>
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/58 to-black/14" />
      <div className="relative mt-auto w-full p-6 sm:p-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 shadow-[0_12px_42px_rgba(0,0,0,0.22)] backdrop-blur">
          <Icon className="h-5 w-5 text-[#65B4FF]" />
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-white">
          {section.title}
        </h3>
        <p className="mt-3 min-h-[3rem] max-w-lg text-sm leading-6 text-[#DDE6F3]">
          {section.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#65B4FF]">
          Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const featuredDeal =
    products.find((product) => product.slug === "iphone-16-pro-max") ||
    products[0];
  const iphoneLineup = getProductsBySlugs(featuredIphoneSlugs);
  const bestSellers = getProductsBySlugs(bestSellerSlugs);
  const newArrivals = getProductsBySlugs(newArrivalSlugs);

  return (
    <main className="overflow-x-hidden bg-[#07090F] text-white">
      <section className="relative isolate overflow-hidden bg-[#07090F] px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_77%_20%,rgba(22,135,248,0.30),transparent_35%),radial-gradient(circle_at_10%_18%,rgba(101,180,255,0.15),transparent_28%),linear-gradient(180deg,#07090F_0%,#090C14_54%,#07090F_100%)]" />
        <div className="absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#1687F8]/10 blur-3xl" />
        <div className="mx-auto grid min-h-[700px] max-w-7xl items-center gap-12 lg:grid-cols-[0.94fr_1.06fr]">
          <div className="home-reveal max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#65B4FF] shadow-[0_12px_40px_rgba(0,0,0,0.2)] backdrop-blur">
              <SparkleDot />
              Original Apple Products
            </div>
            <h1 className="mt-8 max-w-3xl text-5xl font-bold leading-[1.01] text-white sm:text-6xl lg:text-7xl xl:text-[5.35rem]">
              Upgrade to Something Better.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#A8B0BF] sm:text-xl">
              Shop iPhones, MacBooks, iPads, Apple Watch, AirPods, gaming
              consoles, and accessories with clear product information,
              trade-in help, and personal buying support from TroyX iStore.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <LinkButton href="/iphones" className="w-full shadow-[0_18px_50px_rgba(22,135,248,0.28)] sm:w-auto">
                Shop iPhones <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton
                href="/trade-in"
                variant="secondary"
                className="w-full !border-white/10 !bg-[#151D2B] !text-white hover:!border-[#1687F8] sm:w-auto"
              >
                Estimate Trade-In
              </LinkButton>
              <a
                href={whatsappHref}
                className="focus-ring inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-transparent px-5 text-sm font-bold text-white transition hover:border-[#1687F8] hover:text-[#65B4FF] sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-2">
              {heroTrust.map(([Icon, title, description]) => (
                <div
                  key={title}
                  className="flex min-h-[96px] items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur transition duration-300 hover:border-[#1687F8]/35 hover:bg-white/[0.075]"
                >
                  <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#65B4FF]" />
                  <div>
                    <p className="font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm leading-5 text-[#A8B0BF]">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="home-reveal relative flex min-h-[470px] items-center justify-center rounded-[2.25rem] border border-white/10 bg-[#0D111B]/86 p-7 shadow-[0_44px_130px_rgba(0,0,0,0.42)] sm:min-h-[590px] sm:p-10 lg:min-h-[650px]">
            <div className="home-glow-breathe absolute h-[68%] w-[68%] rounded-full bg-[#1687F8]/25 blur-[76px]" />
            <div className="absolute inset-4 rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_50%_20%,rgba(101,180,255,0.19),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.015))]" />
            <Image
              src={heroImage}
              alt="Premium iPhone model displayed by TroyX iStore"
              width={736}
              height={952}
              priority
              sizes="(min-width: 1024px) 34vw, (min-width: 640px) 58vw, 78vw"
              className="home-device-float relative z-10 max-h-[420px] w-auto max-w-[88%] rounded-[1.35rem] object-contain drop-shadow-[0_42px_80px_rgba(0,0,0,0.52)] sm:max-h-[540px] lg:max-h-[600px]"
            />
          </div>
        </div>
      </section>

      <HomeSection
        eyebrow="Shop by Category"
        title="Start with the right product family."
        description="Each category has its own route and a focused catalogue, so the homepage stays calm and easy to scan."
        action={
          <LinkButton
            href="/categories"
            variant="secondary"
            className="w-full !border-white/10 !bg-[#151D2B] !text-white hover:!border-[#1687F8] md:w-auto"
          >
            View All Categories <ArrowRight className="h-4 w-4" />
          </LinkButton>
        }
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categorySections.map((section) => (
            <CategoryTile key={section.id} section={section} />
          ))}
        </div>
      </HomeSection>

      <HomeSection
        eyebrow="Featured iPhone Lineup"
        title="Recent iPhones without the clutter."
        description="A short, curated set of iPhone options for quick comparison. Full generation lists live inside the iPhone catalogue."
        action={
          <LinkButton href="/iphones" className="w-full md:w-auto">
            View All iPhones <ArrowRight className="h-4 w-4" />
          </LinkButton>
        }
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {iphoneLineup.map((product) => (
            <HomeProductCard key={product.id} product={product} />
          ))}
        </div>
      </HomeSection>

      <section className="home-reveal bg-[#07090F] px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(135deg,#111722,#10162A_46%,#0D111B)] shadow-[0_34px_120px_rgba(0,0,0,0.38)]">
          <div className="home-glow-breathe absolute right-0 top-0 h-80 w-80 rounded-full bg-[#1687F8]/18 blur-[86px]" />
          <div className="relative grid items-center gap-10 p-6 sm:p-9 md:grid-cols-[1fr_0.95fr] lg:p-14">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#65B4FF]">
                Featured Deal
              </p>
              <h2 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                {featuredDeal.name}
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[#DDE6F3] sm:text-lg">
                Flagship iPhone performance with a larger display, pro camera
                capability, and TroyX support before you choose a configuration.
              </p>
              <div className="mt-7 grid gap-3 text-sm text-[#A8B0BF] sm:grid-cols-2">
                {["New or refurbished options", "USB-C charging", "Storage confirmed before sale", "Final price on request"].map(
                  (item) => (
                    <p key={item} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#65B4FF]" />
                      {item}
                    </p>
                  )
                )}
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <p className="text-2xl font-bold text-white">
                  {priceLabel(featuredDeal)}
                </p>
                <LinkButton
                  href={`/product/${featuredDeal.slug}`}
                  className="w-full shadow-[0_18px_48px_rgba(22,135,248,0.24)] sm:w-auto"
                >
                  View Details
                </LinkButton>
                <a
                  href={whatsappHref}
                  className="focus-ring inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/10 px-5 text-sm font-bold text-white transition hover:border-[#1687F8] hover:text-[#65B4FF] sm:w-auto"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact on WhatsApp
                </a>
              </div>
            </div>
            <div className="relative flex min-h-[400px] items-center justify-center rounded-[1.85rem] border border-white/10 bg-[radial-gradient(circle_at_50%_18%,rgba(101,180,255,0.16),transparent_44%),#07090F] p-7 sm:min-h-[500px]">
              <div className="absolute h-[70%] w-[62%] rounded-full bg-[#1687F8]/18 blur-[70px]" />
              <Image
                src={featuredDealImage}
                alt={featuredDeal.name}
                width={736}
                height={952}
                sizes="(min-width: 768px) 36vw, 82vw"
                className="home-device-float relative z-10 max-h-[390px] w-auto max-w-[88%] rounded-[1.25rem] object-contain drop-shadow-[0_38px_82px_rgba(0,0,0,0.44)] sm:max-h-[470px]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <HomeSection
        eyebrow="Best Sellers"
        title="Four focused customer favourites."
        description="A concise row of popular iPhone models, without repeating the entire catalogue on the homepage."
        action={
          <LinkButton
            href="/shop?filter=bestseller"
            variant="secondary"
            className="w-full !border-white/10 !bg-[#151D2B] !text-white hover:!border-[#1687F8] md:w-auto"
          >
            View All Best Sellers <ArrowRight className="h-4 w-4" />
          </LinkButton>
        }
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((product) => (
            <HomeProductCard key={product.id} product={product} />
          ))}
        </div>
      </HomeSection>

      <HomeSection
        eyebrow="New Arrivals"
        title="Recently added, kept intentionally short."
        description="A small update row for fresh catalogue additions, using different products from the best-seller set."
        action={
          <LinkButton
            href="/shop?filter=new"
            variant="secondary"
            className="w-full !border-white/10 !bg-[#151D2B] !text-white hover:!border-[#1687F8] md:w-auto"
          >
            View New Arrivals <ArrowRight className="h-4 w-4" />
          </LinkButton>
        }
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {newArrivals.map((product) => (
            <HomeProductCard key={product.id} product={product} />
          ))}
        </div>
      </HomeSection>

      <section className="home-reveal bg-[#0D111B] px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#65B4FF]">
              Trade-In and Repair
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              Upgrade Without Starting From Zero.
            </h2>
            <p className="mt-6 text-base leading-7 text-[#A8B0BF] sm:text-lg">
              Tell us about your current device and receive an estimated
              trade-in assessment. Final value is confirmed after physical
              inspection.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/trade-in" className="w-full sm:w-auto">
                Estimate Trade-In
              </LinkButton>
              <LinkButton
                href="/repair-booking"
                variant="secondary"
                className="w-full !border-white/10 !bg-[#151D2B] !text-white hover:!border-[#1687F8] sm:w-auto"
              >
                Book Repair
              </LinkButton>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {tradeInSteps.map(([Icon, title, description], index) => (
              <div
                key={title}
                className="group rounded-[1.5rem] border border-white/10 bg-[#111722] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.22)] transition duration-500 hover:-translate-y-1 hover:border-[#1687F8]/40"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1687F8]/15 text-[#65B4FF] transition duration-500 group-hover:bg-[#1687F8] group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#65B4FF]">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#DDE6F3]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeSection
        eyebrow="Why Shop With Us"
        title="Built for confident comparison."
        description="The site is structured for practical shopping decisions, not noisy marketplace browsing."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(([Icon, title, description]) => (
            <div
              key={title}
              className="group rounded-[1.5rem] border border-white/10 bg-[#111722] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.20)] transition duration-500 hover:-translate-y-1 hover:border-[#1687F8]/40 hover:bg-[#151D2B]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[#65B4FF] transition duration-500 group-hover:border-[#1687F8]/40 group-hover:bg-[#1687F8] group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#A8B0BF]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </HomeSection>

      <section className="home-reveal bg-[#07090F] px-4 pb-16 pt-8 text-white sm:px-6 sm:pb-24 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] border border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(22,135,248,0.22),transparent_40%),linear-gradient(135deg,#151D2B,#0D111B)] p-7 text-center shadow-[0_34px_110px_rgba(0,0,0,0.34)] sm:p-10 lg:p-16">
          <div className="home-glow-breathe absolute left-1/2 top-0 h-52 w-80 -translate-x-1/2 rounded-full bg-[#1687F8]/18 blur-[70px]" />
          <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#65B4FF]">
            Personal Support
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
            Need Help Choosing the Right Device?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#A8B0BF]">
            Share your budget, preferred model, storage needs, and trade-in
            details. TroyX iStore will help you narrow the options before you
            visit or order.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={whatsappHref}
              className="focus-ring inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#1687F8] px-5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-600 sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            <LinkButton
              href="/iphones"
              variant="secondary"
              className="w-full !border-white/10 !bg-[#151D2B] !text-white hover:!border-[#1687F8] sm:w-auto"
            >
              Browse iPhones
            </LinkButton>
            <LinkButton
              href="/contact"
              variant="secondary"
              className="w-full !border-white/10 !bg-[#151D2B] !text-white hover:!border-[#1687F8] sm:w-auto"
            >
              Contact Support
            </LinkButton>
          </div>
          <p className="mt-7 text-sm text-[#A8B0BF]">
            {siteConfig.address} - {siteConfig.phone}
          </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function SparkleDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#65B4FF] opacity-60" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#65B4FF]" />
    </span>
  );
}
