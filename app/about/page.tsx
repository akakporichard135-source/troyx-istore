import type { Metadata } from "next";
import { ShieldCheck, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { legalDisclaimer } from "@/lib/site";

export const metadata: Metadata = { title: "About", description: "About TroyX iStore." };

const values: Array<[LucideIcon, string, string]> = [
  [ShieldCheck, "Authenticity first", "We focus on transparent condition details, warranty support, and verified inventory."],
  [Users, "Human guidance", "Customers can compare products and get advice before choosing a device."],
  [Sparkles, "Premium care", "From storefront to service, every touchpoint is designed to feel calm and polished."]
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title="Independent. Premium. Built on trust." description="TroyX iStore helps customers buy genuine Apple devices and accessories with clarity, support, and competitive pricing." />
      <Section>
        <div className="grid gap-5 md:grid-cols-3">
          {values.map(([Icon, title, text]) => (
            <div key={String(title)} className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
              <Icon className="h-8 w-8 text-brand-blue" />
              <h2 className="mt-5 text-xl font-semibold text-brand-ink dark:text-white">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 rounded-[2rem] bg-brand-mist p-5 text-sm leading-6 text-zinc-600 dark:bg-white/5 dark:text-zinc-300">{legalDisclaimer}</p>
      </Section>
    </>
  );
}
