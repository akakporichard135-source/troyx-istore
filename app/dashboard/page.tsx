import type { Metadata } from "next";
import { Bell, CreditCard, FileDown, MapPinned, Package, Settings, User, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = { title: "Customer Dashboard", description: "Manage your TroyX iStore account." };

const dashboardItems: Array<[LucideIcon, string, string]> = [
  [User, "Profile", "Manage name, email, and phone details."],
  [MapPinned, "Addresses", "Save shipping and billing addresses."],
  [Package, "Order history", "View orders and delivery progress."],
  [FileDown, "Invoices", "Download invoices and receipts."],
  [Heart, "Wishlist", "Move saved products to cart."],
  [CreditCard, "Payment methods", "Tokenized provider support placeholder."],
  [Bell, "Notifications", "Restocks, order updates, and offers."],
  [Settings, "Settings", "Account preferences and security."]
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader eyebrow="Dashboard" title="Everything after purchase, organized." description="A protected customer area for profile, addresses, order history, tracking, invoices, wishlist, payment methods, notifications, and settings." />
      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardItems.map(([Icon, title, description]) => (
            <div key={String(title)} className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
              <Icon className="h-8 w-8 text-brand-blue" />
              <h2 className="mt-5 text-lg font-semibold text-brand-ink dark:text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{description}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
