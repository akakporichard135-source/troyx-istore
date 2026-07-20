import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = { title: "FAQ", description: "TroyX iStore frequently asked questions." };

const faqs = [
  ["Are products genuine?", "TroyX iStore is designed around genuine product inventory, clear sourcing, and condition transparency."],
  ["Do used devices show battery health?", "Yes. Used inventory supports battery health display and inspection notes."],
  ["Can I pick up my order?", "Yes. Checkout supports pickup and delivery options."],
  ["Who can leave reviews?", "The review model is designed for verified purchase reviews only."],
  ["Is the trade-in estimate final?", "No. Final value is confirmed only after physical inspection."]
];

export default function FAQPage() {
  return (
    <>
      <PageHeader eyebrow="FAQ" title="Answers before you buy." description="Clear policies for products, delivery, warranty, trade-in, repair, and reviews." />
      <Section>
        <div className="grid gap-4">
          {faqs.map(([question, answer]) => (
            <details key={question} className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
              <summary className="cursor-pointer text-lg font-semibold text-brand-ink dark:text-white">{question}</summary>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{answer}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
