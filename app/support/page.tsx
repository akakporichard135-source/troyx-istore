import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  HelpCircle,
  MessageCircle,
  RefreshCw,
  Wrench
} from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get TroyX iStore support for buying guidance, trade-ins, repairs, and catalogue questions."
};

const whatsappHref =
  "https://wa.me/233207137437?text=Hello%20TroyX%20iStore%2C%20I%20need%20support.";

const supportLinks = [
  {
    title: "Buying Guidance",
    description: "Get help choosing the right device, storage, and condition.",
    href: "/contact",
    icon: HelpCircle
  },
  {
    title: "Trade-In",
    description: "Estimate your current device before upgrading.",
    href: "/trade-in",
    icon: RefreshCw
  },
  {
    title: "Repair Booking",
    description: "Book a diagnostic review for device issues.",
    href: "/repair-booking",
    icon: Wrench
  }
];

export default function SupportPage() {
  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="Personal help before and after you buy."
        description="Chat with TroyX iStore for device comparisons, trade-in guidance, repair booking, delivery questions, and catalogue support."
      />
      <Section>
        <div className="grid gap-5 md:grid-cols-3">
          {supportLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="focus-ring group rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-blue/40 hover:shadow-premium dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue transition group-hover:bg-brand-blue group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-brand-ink dark:text-white">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {item.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-blue">
                  Open <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
        <div className="mt-8 rounded-[2rem] border border-black/5 bg-brand-ink p-7 text-white dark:border-white/10 sm:p-9">
          <p className="text-sm font-semibold text-blue-200">
            {siteConfig.address} - {siteConfig.phone}
          </p>
          <h2 className="mt-3 text-2xl font-bold">
            Need a quick recommendation?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
            Share your budget, preferred model, storage needs, and whether you
            want pickup, delivery, trade-in, or repair help.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappHref}
              className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-blue px-5 text-sm font-bold text-white transition hover:bg-brand-blue/90"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            <LinkButton
              href="/faq"
              variant="secondary"
              className="!border-white/10 !bg-white/[0.06] !text-white hover:!border-brand-blue"
            >
              Browse FAQ
            </LinkButton>
          </div>
        </div>
      </Section>
    </>
  );
}
