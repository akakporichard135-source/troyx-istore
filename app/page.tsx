import Image from "next/image";
import Link from "next/link";
import { existsSync } from "node:fs";
import { join } from "node:path";
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
import { HeroVideo } from "@/components/home/hero-video";
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
    image: "/images/categories/apple-watch.webp",
    href: "/apple-watch",
    icon: Watch,
    focal: "object-center"
  },
  {
    id: "airpods",
    title: "AirPods",
    description:
      "Wireless audio for calls, workouts, travel, and immersive listening.",
    image: "/images/categories/airpods.webp",
    href: "/airpods",
    icon: Headphones,
    focal: "object-center"
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
    "Clear model, storage, condition, and availability guidance before you enquire."
  ],
  [
    PackageCheck,
    "Curated selection",
    "A focused shortlist on the homepage with the full catalogue in every category."
  ],
  [
    Wrench,
    "Repair support",
    "Book diagnostics for Apple devices and accessories when you need support."
  ],
  [
    Zap,
    "Trade-in guidance",
    "Get a guided estimate before choosing your next upgrade."
  ]
];

const featuredDealImage = "/images/home/featured-iphone-16-pro-max-cutout.webp";
const heroImage = "/images/hero/iphone-cinematic-poster.webp";
const heroVideoWebm = "/videos/hero/iphone-cinematic-loop.webm";
const heroVideoMp4 = "/videos/hero/iphone-cinematic-loop.mp4";
const heroVideoPoster = "/images/hero/iphone-cinematic-poster.webp";

const homeProductImages: Record<string, string> = {
  "iphone-17-pro-max": "/images/home/products/iphone-17-pro-max.webp",
  "iphone-17-pro": "/images/home/products/iphone-17-pro.webp",
  "iphone-17-air": "/images/home/products/iphone-17-air.webp",
  "iphone-17": "/images/home/products/iphone-17.webp",
  "iphone-16-pro-max": "/images/home/products/iphone-16-pro-max.webp",
  "iphone-16-pro": "/images/home/products/iphone-16-pro.webp",
  "iphone-16-plus": "/images/home/products/iphone-16-plus.webp",
  "iphone-16": "/images/home/products/iphone-16.webp",
  "iphone-15-pro-max": "/images/home/products/iphone-15-pro-max.webp",
  "iphone-15-plus": "/images/home/products/iphone-15-plus.webp",
  "iphone-14-pro": "/images/home/products/iphone-14-pro.webp",
  "iphone-14": "/images/home/products/iphone-14.webp"
};

const featuredIphoneSlugs = [
  "iphone-16-pro-max",
  "iphone-16-pro",
  "iphone-16-plus",
  "iphone-16"
];

const bestSellerSlugs = [
  "iphone-15-pro-max",
  "iphone-15-plus",
  "iphone-14-pro",
  "iphone-14"
];

const newArrivalSlugs = [
  "iphone-17-pro-max",
  "iphone-17-pro",
  "iphone-17-air",
  "iphone-17"
];

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

function publicFileExists(publicPath: string) {
  return existsSync(join(process.cwd(), "public", publicPath.replace(/^\//, "")));
}

function getProductsBySlugs(slugs: string[]) {
  return slugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));
}

function priceLabel(product: Product) {
  return product.price > 0 ? formatCurrency(product.price) : "Contact for price";
}

function storageOptions(product: Product) {
  return product.storage.slice(0, 3);
}

function productImageAlt(product: Product) {
  const defaultColor = product.colors[0];
  return defaultColor
    ? `${product.name} in ${defaultColor}, product image`
    : `${product.name}, product image`;
}

function productWhatsAppHref(product: Product) {
  return `https://wa.me/233207137437?text=${encodeURIComponent(
    `Hello TroyX iStore, I am interested in ${product.name}. Please confirm availability, price, storage, and condition options.`
  )}`;
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
    <section className="home-reveal scroll-mt-20 bg-[#07090F] px-4 py-10 text-white sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-5 md:mb-9 md:flex-row md:items-end md:justify-between">
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
  const conditionLabel = product.condition[0] || product.availability;
  const hasStagedImage = image.startsWith("/images/home/products/");

  return (
    <article className="home-card-shadow group flex h-full min-h-[500px] flex-col overflow-hidden rounded-[1.35rem] border border-white/10 home-premium-surface transition duration-500 hover:-translate-y-1 hover:border-[#1687F8]/45 md:min-h-[430px]">
      <Link
        href={`/product/${product.slug}`}
        className="focus-ring relative m-2.5 flex h-[220px] items-center justify-center overflow-hidden rounded-[1.05rem] border border-white/10 bg-[radial-gradient(circle_at_50%_8%,rgba(101,180,255,0.22),transparent_42%),radial-gradient(circle_at_50%_86%,rgba(8,15,29,0.96),transparent_58%),#121A28] p-4 sm:h-[230px]"
        aria-label={`View ${product.name}`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))]" />
        <div className="absolute inset-x-8 bottom-6 h-10 rounded-full bg-black/40 blur-2xl transition duration-700 group-hover:bg-[#1687F8]/22" />
        <Image
          src={image}
          alt={productImageAlt(product)}
          fill
          sizes="(min-width: 1024px) 18vw, (min-width: 640px) 42vw, 88vw"
          className={cn(
            "relative z-10 drop-shadow-[0_26px_52px_rgba(0,0,0,0.42)] transition duration-700 group-hover:scale-[1.035]",
            hasStagedImage ? "object-cover p-0" : "object-contain p-5 sm:p-6"
          )}
          loading="lazy"
        />
      </Link>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#65B4FF]">
          {product.series}
        </p>
        <h3 className="mt-2 min-h-[2.7rem] text-lg font-bold leading-snug text-white">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-xs font-semibold leading-5 text-[#A8B0BF]">
          {product.description}
        </p>
        <div className="mt-3 flex min-h-[2rem] flex-wrap gap-1.5" aria-label="Storage options">
          {storageOptions(product).map((storage) => (
            <span
              key={`${product.id}-${storage}`}
              className="inline-flex h-7 items-center rounded-full border border-[#65B4FF]/20 bg-[#1687F8]/10 px-2.5 text-[11px] font-bold text-[#DDEEFF]"
            >
              {storage}
            </span>
          ))}
        </div>
        <span className="mt-3 inline-flex h-7 w-fit items-center rounded-full border border-white/10 px-2.5 text-[11px] font-semibold text-[#A8B0BF]">
          {conditionLabel}
        </span>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <p className="text-base font-bold text-white">{priceLabel(product)}</p>
          <Link
            href={`/product/${product.slug}`}
            className="focus-ring inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-white transition duration-300 hover:border-[#1687F8] hover:bg-[#1687F8] hover:text-white"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

function HomeProductRail({
  products,
  ariaLabel,
  desktopGridClass = "md:grid-cols-2 lg:grid-cols-4"
}: {
  products: Product[];
  ariaLabel: string;
  desktopGridClass?: string;
}) {
  return (
    <>
      <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#65B4FF]/85 md:hidden">
        Swipe to explore <ArrowRight className="h-3.5 w-3.5" />
      </p>
      <div
        role="list"
        tabIndex={0}
        aria-label={ariaLabel}
        className={cn(
          "home-product-rail focus-ring -mx-4 px-4 pb-2 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 md:pb-0",
          desktopGridClass
        )}
      >
        {products.map((product) => (
          <div
            key={product.id}
            role="listitem"
            className="home-product-rail-item"
          >
            <HomeProductCard product={product} />
          </div>
        ))}
      </div>
    </>
  );
}

function CategoryTile({ section }: { section: CategoryCard }) {
  const Icon = section.icon;

  return (
    <Link
      href={section.href}
      className="focus-ring home-card-shadow group relative flex min-h-[220px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#111722] transition duration-500 hover:-translate-y-1.5 hover:border-[#1687F8]/50 sm:min-h-[255px]"
      aria-label={`Browse ${section.title}`}
    >
      {section.image ? (
        <Image
          src={section.image}
          alt={`${section.title} category`}
          fill
          sizes="(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
          className={cn(
            "object-cover opacity-80 transition duration-700 group-hover:scale-110 group-hover:opacity-95",
            section.focal
          )}
          loading="lazy"
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(22,135,248,0.24),transparent_34%),radial-gradient(circle_at_20%_74%,rgba(101,180,255,0.12),transparent_36%),linear-gradient(135deg,#151D2B,#0D111B)]" />
          <div className="absolute right-5 top-5 flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#65B4FF]/70 shadow-[0_20px_80px_rgba(22,135,248,0.16)] transition duration-700 group-hover:scale-110 group-hover:text-[#65B4FF]">
            <Icon className="h-11 w-11" />
          </div>
        </>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.94),rgba(0,0,0,0.76)_48%,rgba(0,0,0,0.34)),linear-gradient(0deg,rgba(0,0,0,0.90),transparent_64%)]" />
      <div className="relative mt-auto w-full max-w-[86%] p-5 sm:max-w-none sm:p-6">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 shadow-[0_12px_42px_rgba(0,0,0,0.22)] backdrop-blur">
          <Icon className="h-5 w-5 text-[#65B4FF]" />
        </div>
        <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          {section.title}
        </h3>
        <p className="mt-2 line-clamp-2 max-w-lg text-sm leading-6 text-[#DDE6F3]">
          {section.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#65B4FF]">
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
  const hasHeroWebm = publicFileExists(heroVideoWebm);
  const hasHeroMp4 = publicFileExists(heroVideoMp4);
  const hasHeroPoster = publicFileExists(heroVideoPoster);
  const heroPosterSrc = hasHeroPoster ? heroVideoPoster : heroImage;
  const featuredDealSpecs = [
    featuredDeal.specs.Display,
    featuredDeal.specs.Chip,
    featuredDeal.specs.Camera,
    `${featuredDeal.storage[0]} starting storage`
  ].filter(Boolean);

  return (
    <main className="overflow-x-hidden bg-[#07090F] text-white">
      <section className="relative isolate scroll-mt-20 overflow-hidden bg-[#07090F] px-4 pb-10 pt-8 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_77%_20%,rgba(22,135,248,0.30),transparent_35%),radial-gradient(circle_at_10%_18%,rgba(101,180,255,0.15),transparent_28%),linear-gradient(180deg,#07090F_0%,#090C14_54%,#07090F_100%)]" />
        <div className="absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#1687F8]/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:min-h-[700px] lg:grid-cols-[0.94fr_1.06fr] lg:gap-12">
          <div className="home-reveal max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#65B4FF] shadow-[0_12px_40px_rgba(0,0,0,0.2)] backdrop-blur">
              <SparkleDot />
              Original Apple Products
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.04] text-white sm:mt-8 sm:text-6xl lg:text-7xl xl:text-[5.35rem]">
              Upgrade to Something Better.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#A8B0BF] sm:mt-7 sm:text-xl sm:leading-8">
              Shop iPhones, MacBooks, iPads, Apple Watch, AirPods, gaming
              consoles, and accessories with clear product information,
              trade-in help, and personal buying support from TroyX iStore.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap">
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

            <div className="mt-7 grid grid-cols-2 gap-2.5 sm:mt-12 sm:gap-3">
              {heroTrust.map(([Icon, title, description]) => (
                <div
                  key={title}
                  className="flex min-h-[86px] items-start gap-2.5 rounded-2xl border border-white/10 bg-white/[0.055] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur transition duration-300 hover:border-[#1687F8]/35 hover:bg-white/[0.075] sm:min-h-[96px] sm:gap-3 sm:p-4"
                >
                  <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#65B4FF]" />
                  <div>
                    <p className="text-xs font-semibold leading-4 text-white sm:text-base sm:leading-normal">{title}</p>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[#A8B0BF] sm:text-sm sm:leading-5">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <HeroVideo
            alt="iPhone Pro Max in Natural Titanium, rear view"
            fallbackImageSrc={heroImage}
            hasVideo={hasHeroWebm || hasHeroMp4}
            mp4Src={hasHeroMp4 ? heroVideoMp4 : undefined}
            posterSrc={heroPosterSrc}
            webmSrc={hasHeroWebm ? heroVideoWebm : undefined}
          />
        </div>
      </section>

      <HomeSection
        eyebrow="Shop by Category"
        title="Start with the right product family."
        description="Browse the Apple devices and gaming products that fit your needs."
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
        <div className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-3">
          {categorySections.map((section) => (
            <CategoryTile key={section.id} section={section} />
          ))}
        </div>
      </HomeSection>

      <HomeSection
        eyebrow="Featured iPhone Lineup"
        title="Recent iPhones without the clutter."
        description="Compare a carefully selected range of recent iPhone models."
        action={
          <LinkButton href="/iphones" className="w-full md:w-auto">
            View All iPhones <ArrowRight className="h-4 w-4" />
          </LinkButton>
        }
      >
        <HomeProductRail
          products={iphoneLineup}
          ariaLabel="Featured iPhone product preview"
        />
        <div className="mt-8 flex justify-center">
          <LinkButton
            href="/shop"
            className="w-full shadow-[0_18px_50px_rgba(22,135,248,0.24)] sm:w-auto"
          >
            View All Products <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </HomeSection>

      <section className="home-reveal bg-[#07090F] px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(135deg,#111722,#10162A_46%,#0D111B)] shadow-[0_34px_120px_rgba(0,0,0,0.38)]">
          <div className="home-glow-breathe absolute right-0 top-0 h-80 w-80 rounded-full bg-[#1687F8]/18 blur-[86px]" />
          <div className="relative grid items-center gap-8 p-5 sm:p-7 md:grid-cols-[1fr_0.95fr] lg:p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#65B4FF]">
                Featured Deal
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                {featuredDeal.name}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#DDE6F3]">
                Flagship iPhone performance with a larger display, pro camera
                capability, and TroyX support before you choose a configuration.
              </p>
              <div className="mt-5 grid gap-3 text-sm text-[#A8B0BF] sm:grid-cols-2">
                {featuredDealSpecs.slice(0, 3).map(
                  (item) => (
                    <p key={item} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#65B4FF]" />
                      {item}
                    </p>
                  )
                )}
              </div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
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
                  href={productWhatsAppHref(featuredDeal)}
                  className="focus-ring inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/10 px-5 text-sm font-bold text-white transition hover:border-[#1687F8] hover:text-[#65B4FF] sm:w-auto"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact on WhatsApp
                </a>
              </div>
            </div>
            <div className="relative flex min-h-[320px] items-center justify-center rounded-[1.6rem] border border-white/10 bg-[radial-gradient(circle_at_50%_18%,rgba(101,180,255,0.18),transparent_44%),#07090F] p-5 sm:min-h-[390px] md:min-h-[430px]">
              <div className="absolute h-[70%] w-[62%] rounded-full bg-[#1687F8]/18 blur-[70px]" />
              <div className="absolute inset-x-[22%] bottom-7 h-8 rounded-full bg-black/50 blur-2xl" />
              <Image
                src={featuredDealImage}
                alt="iPhone 16 Pro Max in Natural Titanium, rear view"
                width={736}
                height={952}
                sizes="(min-width: 768px) 36vw, 82vw"
                className="home-device-float relative z-10 max-h-[350px] w-auto max-w-[94%] object-contain drop-shadow-[0_38px_82px_rgba(0,0,0,0.44)] sm:max-h-[410px] md:max-h-[450px]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <HomeSection
        eyebrow="Best Sellers"
        title="Popular picks across the store."
        description="Popular choices customers continue to ask for."
        action={
          <LinkButton
            href="/shop?filter=bestseller"
            variant="secondary"
            className="w-full !border-white/10 !bg-[#151D2B] !text-white hover:!border-[#1687F8] md:w-auto"
          >
            View Best Sellers <ArrowRight className="h-4 w-4" />
          </LinkButton>
        }
      >
        <HomeProductRail
          products={bestSellers}
          ariaLabel="Best seller product preview"
        />
      </HomeSection>

      <HomeSection
        eyebrow="New Arrivals"
        title="Fresh additions, kept short."
        description="Explore recently added devices and accessories."
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
        <HomeProductRail
          products={newArrivals}
          ariaLabel="New arrival product preview"
        />
      </HomeSection>

      <HomeSection
        eyebrow="Why Choose TroyX"
        title="Built for confident comparison."
        description="Clear support, practical guidance, and focused buying help."
      >
        <div className="home-compact-rail -mx-4 px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 sm:pb-0 lg:grid-cols-4">
          {benefits.map(([Icon, title, description]) => (
            <div
              key={title}
              className="home-compact-rail-item group rounded-[1.35rem] border border-white/10 bg-[#111722] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.20)] transition duration-500 hover:-translate-y-1 hover:border-[#1687F8]/40 hover:bg-[#151D2B] sm:w-auto"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[#65B4FF] transition duration-500 group-hover:border-[#1687F8]/40 group-hover:bg-[#1687F8] group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#A8B0BF]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </HomeSection>

      <section className="home-reveal bg-[#0D111B] px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#65B4FF]">
              Trade-In & Repairs
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              Upgrade, trade in, or book support.
            </h2>
            <p className="mt-5 text-base leading-7 text-[#A8B0BF] sm:text-lg">
              Estimate your current device value or book repair support before
              choosing your next Apple device.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
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
          <div className="home-compact-rail -mx-4 px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 sm:pb-0">
            {tradeInSteps.map(([Icon, title, description], index) => (
              <div
                key={title}
                className="home-compact-rail-item group rounded-[1.25rem] border border-white/10 bg-[#111722] p-4 shadow-[0_18px_70px_rgba(0,0,0,0.22)] transition duration-500 hover:-translate-y-1 hover:border-[#1687F8]/40 sm:w-auto sm:p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1687F8]/15 text-[#65B4FF] transition duration-500 group-hover:bg-[#1687F8] group-hover:text-white sm:h-11 sm:w-11">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#65B4FF]">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-white sm:mt-5 sm:text-lg">{title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#DDE6F3] sm:mt-3">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
