import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  MessageCircle,
  RefreshCw,
  ShieldCheck
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type CinematicSection = {
  eyebrow: string;
  headline: string;
  description: string;
  image: string;
  imageAlt: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  tone: "air" | "ipad" | "pro";
  reverse?: boolean;
  pending?: boolean;
};

const verifiedIphoneImage =
  "/images/home/featured-iphone-16-pro-max-cutout.webp";
const pendingProductImage = "/images/products/verified-image-pending.webp";

const whatsappHref =
  "https://wa.me/233207137437?text=Hello%20TroyX%20iStore%2C%20I%20need%20help%20choosing%20the%20right%20device.";

const heroPhones = [
  {
    name: "iPhone 16 Pro",
    image: pendingProductImage,
    alt: "Verified product image pending for iPhone 16 Pro",
    placement:
      "left-0 top-10 z-10 hidden h-[68%] max-h-[390px] opacity-80 blur-[0.1px] md:flex"
  },
  {
    name: "iPhone 16 Pro Max",
    image: verifiedIphoneImage,
    alt: "iPhone 16 Pro Max in Natural Titanium, rear view",
    placement:
      "left-1/2 top-0 z-20 h-[84%] max-h-[560px] -translate-x-1/2 md:h-[92%]"
  },
  {
    name: "iPhone 16",
    image: pendingProductImage,
    alt: "Verified product image pending for iPhone 16",
    placement:
      "right-0 top-14 z-10 hidden h-[64%] max-h-[370px] opacity-80 blur-[0.1px] md:flex"
  }
];

const cinematicSections: CinematicSection[] = [
  {
    eyebrow: "MacBook Air",
    headline: "Light. Powerful. Ready for More.",
    description:
      "Explore thin, capable MacBook Air options for school, work, travel, and everyday creative tasks with TroyX guidance before you buy.",
    image: pendingProductImage,
    imageAlt: "Verified product image pending for MacBook Air",
    primaryLabel: "Explore MacBook Air",
    primaryHref: "/shop?category=MacBook&q=MacBook%20Air",
    secondaryLabel: "View All Macs",
    secondaryHref: "/macbooks",
    tone: "air",
    pending: true
  },
  {
    eyebrow: "iPad Air",
    headline: "Powerful Creativity in Your Hands.",
    description:
      "Find iPad Air and the broader iPad range for note-taking, design, entertainment, study, and flexible everyday productivity.",
    image: pendingProductImage,
    imageAlt: "Verified product image pending for iPad Air",
    primaryLabel: "Explore iPad Air",
    primaryHref: "/shop?category=iPad&q=iPad%20Air",
    secondaryLabel: "View All iPads",
    secondaryHref: "/ipads",
    tone: "ipad",
    reverse: true,
    pending: true
  },
  {
    eyebrow: "MacBook Pro",
    headline: "Built for Serious Performance.",
    description:
      "Compare MacBook Pro options for demanding work, creative production, development, and high-performance daily use.",
    image: pendingProductImage,
    imageAlt: "Verified product image pending for MacBook Pro",
    primaryLabel: "Explore MacBook Pro",
    primaryHref: "/shop?category=MacBook&q=MacBook%20Pro",
    secondaryLabel: "Compare Macs",
    secondaryHref: "/compare",
    tone: "pro",
    pending: true
  }
];

const trustPoints: Array<[LucideIcon, string]> = [
  [ShieldCheck, "Verified catalogue guidance"],
  [BadgeCheck, "Clear condition notes"],
  [RefreshCw, "Trade-in support"],
  [MessageCircle, "Personal buying help"]
];

function SparkleDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#65B4FF] opacity-60" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#65B4FF]" />
    </span>
  );
}

function HeroIphoneShowcase() {
  return (
    <div className="home-reveal relative min-h-[420px] overflow-visible sm:min-h-[520px] lg:min-h-[650px]">
      <div className="home-glow-breathe absolute left-1/2 top-6 h-[70%] w-[74%] -translate-x-1/2 rounded-full bg-[#1687F8]/25 blur-[90px]" />
      <div className="absolute inset-x-[10%] bottom-[12%] h-16 rounded-full bg-[#1687F8]/14 blur-[26px]" />
      <div className="absolute inset-x-[14%] bottom-[9%] h-8 rounded-full bg-black/70 blur-2xl" />
      <div className="absolute bottom-[7%] left-1/2 h-px w-[76%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#65B4FF]/30 to-transparent" />

      {heroPhones.map((phone, index) => (
        <div
          key={phone.name}
          className={cn(
            "home-device-float absolute items-center justify-center",
            phone.placement
          )}
          style={{ animationDelay: `${index * 0.65}s` }}
        >
          <Image
            src={phone.image}
            alt={phone.alt}
            width={520}
            height={720}
            priority={index === 1}
            sizes={
              index === 1
                ? "(min-width: 1024px) 35vw, 78vw"
                : "(min-width: 1024px) 20vw, 34vw"
            }
            className={cn(
              "h-full w-auto object-contain drop-shadow-[0_42px_90px_rgba(0,0,0,0.58)]",
              phone.image === pendingProductImage ? "max-w-[240px]" : ""
            )}
          />
        </div>
      ))}

      <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[11px] font-semibold text-[#A8B0BF] backdrop-blur">
        <SparkleDot />
        Verified imagery pending for supporting models
      </div>
    </div>
  );
}

function CinematicProductSection({
  section
}: {
  section: CinematicSection;
}) {
  const toneClass = {
    air: "from-[#101928] via-[#0D1420] to-[#07090F]",
    ipad: "from-[#0D1824] via-[#12192A] to-[#07090F]",
    pro: "from-[#080A0F] via-[#0D111B] to-[#05070B]"
  }[section.tone];

  return (
    <section className="home-reveal bg-[#07090F] px-4 py-10 text-white sm:px-6 sm:py-14 lg:px-8 lg:py-18">
      <div
        className={cn(
          "mx-auto grid max-w-7xl items-center gap-8 overflow-hidden rounded-[2.35rem] border border-white/10 bg-gradient-to-br p-5 shadow-[0_34px_120px_rgba(0,0,0,0.36)] sm:p-8 lg:grid-cols-2 lg:p-11",
          toneClass,
          section.reverse && "lg:[&>*:first-child]:order-2"
        )}
      >
        <div className="relative z-10">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[#65B4FF]">
            <SparkleDot />
            {section.eyebrow}
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            {section.headline}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#A8B0BF] sm:text-lg sm:leading-8">
            {section.description}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <LinkButton href={section.primaryHref} className="w-full sm:w-auto">
              {section.primaryLabel} <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton
              href={section.secondaryHref}
              variant="secondary"
              className="w-full !border-white/10 !bg-white/[0.055] !text-white hover:!border-[#1687F8] sm:w-auto"
            >
              {section.secondaryLabel}
            </LinkButton>
          </div>
          {section.pending && (
            <p className="mt-4 max-w-lg text-xs font-semibold leading-5 text-[#6F7B8E]">
              Product-ready verified imagery is pending for this exact model;
              the catalogue route is active and ready for the final asset.
            </p>
          )}
        </div>

        <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_50%_18%,rgba(101,180,255,0.20),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.01))] p-6 sm:min-h-[420px]">
          <div className="home-glow-breathe absolute h-[60%] w-[62%] rounded-full bg-[#1687F8]/18 blur-[76px]" />
          <div className="absolute inset-x-[22%] bottom-10 h-8 rounded-full bg-black/60 blur-2xl" />
          <Image
            src={section.image}
            alt={section.imageAlt}
            width={900}
            height={720}
            sizes="(min-width: 1024px) 42vw, 88vw"
            className={cn(
              "home-device-float relative z-10 max-h-[330px] w-auto max-w-[92%] object-contain drop-shadow-[0_38px_82px_rgba(0,0,0,0.44)] sm:max-h-[390px]",
              section.pending && "max-w-[320px]"
            )}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

function CompactCta({
  eyebrow,
  headline,
  description,
  icon: Icon,
  primary,
  secondary
}: {
  eyebrow: string;
  headline: string;
  description: string;
  icon: LucideIcon;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}) {
  return (
    <section className="home-reveal bg-[#07090F] px-4 py-8 text-white sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_85%_15%,rgba(22,135,248,0.22),transparent_34%),linear-gradient(135deg,#111722,#0D111B)] p-6 shadow-[0_28px_100px_rgba(0,0,0,0.32)] sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/[0.06] text-[#65B4FF] shadow-[0_22px_80px_rgba(22,135,248,0.18)]">
          <Icon className="h-9 w-9" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#65B4FF]">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
            {headline}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#A8B0BF]">
            {description}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <LinkButton href={primary.href} className="w-full sm:w-auto">
              {primary.label} <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton
              href={secondary.href}
              variant="secondary"
              className="w-full !border-white/10 !bg-white/[0.055] !text-white hover:!border-[#1687F8] sm:w-auto"
            >
              {secondary.label}
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="overflow-x-hidden bg-[#07090F] text-white">
      <section className="relative isolate overflow-hidden bg-[#07090F] px-4 py-10 text-white sm:px-6 sm:py-16 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_18%,rgba(22,135,248,0.34),transparent_36%),radial-gradient(circle_at_12%_24%,rgba(101,180,255,0.14),transparent_30%),linear-gradient(180deg,#07090F_0%,#090C14_58%,#07090F_100%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:min-h-[680px] lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div className="home-reveal max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[#65B4FF] shadow-[0_12px_40px_rgba(0,0,0,0.2)] backdrop-blur">
              <SparkleDot />
              Latest iPhone Lineup
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.04] text-white sm:mt-8 sm:text-6xl lg:text-7xl">
              Meet the Latest iPhone Lineup.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#A8B0BF] sm:mt-7 sm:text-xl sm:leading-8">
              Compare recent iPhone models with clear condition guidance,
              storage options, trade-in support, and personal buying help from
              TroyX iStore.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap">
              <LinkButton href="/iphones" className="w-full shadow-[0_18px_50px_rgba(22,135,248,0.28)] sm:w-auto">
                Explore iPhone <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton
                href="/compare"
                variant="secondary"
                className="w-full !border-white/10 !bg-[#151D2B] !text-white hover:!border-[#1687F8] sm:w-auto"
              >
                Compare Models
              </LinkButton>
              <a
                href={whatsappHref}
                className="focus-ring inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-transparent px-5 text-sm font-bold text-white transition hover:border-[#1687F8] hover:text-[#65B4FF] sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-2.5 sm:mt-10 sm:gap-3">
              {trustPoints.map(([Icon, label]) => (
                <div
                  key={label}
                  className="flex min-h-[70px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur transition duration-300 hover:border-[#1687F8]/35 hover:bg-white/[0.075] sm:p-4"
                >
                  <Icon className="h-5 w-5 flex-shrink-0 text-[#65B4FF]" />
                  <p className="text-xs font-semibold leading-5 text-white sm:text-sm">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <HeroIphoneShowcase />
        </div>
      </section>

      {cinematicSections.map((section) => (
        <CinematicProductSection key={section.eyebrow} section={section} />
      ))}

      <CompactCta
        eyebrow="Trade-In"
        headline="Upgrade Without Starting From Zero."
        description="Trade in your current device and receive a guided assessment before moving to your next iPhone, iPad, Mac, or accessory."
        icon={RefreshCw}
        primary={{ label: "Estimate Trade-In", href: "/trade-in" }}
        secondary={{ label: "Learn How It Works", href: "/trade-in" }}
      />

      <section className="home-reveal bg-[#07090F] px-4 pb-14 pt-8 text-white sm:px-6 sm:pb-20 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] border border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(22,135,248,0.22),transparent_40%),linear-gradient(135deg,#151D2B,#0D111B)] p-7 text-center shadow-[0_34px_110px_rgba(0,0,0,0.34)] sm:p-10 lg:p-14">
          <div className="home-glow-breathe absolute left-1/2 top-0 h-52 w-80 -translate-x-1/2 rounded-full bg-[#1687F8]/18 blur-[70px]" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#65B4FF]">
              Support
            </p>
            <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
              Need Help Choosing the Right Device?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#A8B0BF]">
              Share your budget, preferred model, storage needs, trade-in
              details, or repair questions. TroyX iStore will help you narrow
              the right option before you order.
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
                href="/contact"
                variant="secondary"
                className="w-full !border-white/10 !bg-[#151D2B] !text-white hover:!border-[#1687F8] sm:w-auto"
              >
                Contact Support
              </LinkButton>
              <LinkButton
                href="/support"
                variant="secondary"
                className="w-full !border-white/10 !bg-[#151D2B] !text-white hover:!border-[#1687F8] sm:w-auto"
              >
                Browse Support
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
