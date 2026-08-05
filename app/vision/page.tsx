import type { Metadata } from "next";
import { ArrowRight, Eye, MessageCircle } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Vision",
  description:
    "Vision products are not currently listed in the TroyX iStore catalogue."
};

const whatsappHref =
  "https://wa.me/233207137437?text=Hello%20TroyX%20iStore%2C%20I%20want%20to%20ask%20about%20Vision%20product%20availability.";

export default function VisionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Vision"
        title="Vision availability is being prepared."
        description="TroyX iStore does not currently list verified Vision products. This page is ready for the catalogue once stock and product imagery are confirmed."
      />
      <Section>
        <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
            <Eye className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-brand-ink dark:text-white">
            Coming soon to the catalogue.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            We will add Vision products only when product records, pricing,
            condition notes, and verified product imagery are ready.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/shop">
              Browse Store <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <a
              href={whatsappHref}
              className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black/10 px-5 text-sm font-bold text-brand-ink transition hover:border-brand-blue hover:text-brand-blue dark:border-white/10 dark:text-white"
            >
              <MessageCircle className="h-4 w-4" />
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
