import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = { title: "Privacy Policy", description: "TroyX iStore privacy policy." };

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" description="How TroyX iStore handles customer data, order records, account information, and communication preferences." />
      <PolicySection items={["Collect only information needed for orders, support, authentication, and fraud prevention.", "Use Supabase or Firebase authentication and database controls for secure account data.", "Keep payment card handling inside certified payment providers; do not store raw card numbers.", "Allow customers to request account updates, exports, or deletion subject to legal retention requirements."]} />
    </>
  );
}

function PolicySection({ items }: { items: string[] }) {
  return <Section><div className="grid gap-4">{items.map((item) => <p key={item} className="rounded-2xl bg-white p-5 text-sm leading-6 text-zinc-600 shadow-sm dark:bg-white/5 dark:text-zinc-300">{item}</p>)}</div></Section>;
}
