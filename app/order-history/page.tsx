import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = { title: "Order History", description: "View TroyX iStore order history." };

const orders = [
  ["TX-2026-1001", "iPhone 16 Pro Max", "$1,299", "Delivered"],
  ["TX-2026-1002", "AirPods Pro", "$249", "Processing"],
  ["TX-2026-1003", "Protective Clear Case", "$29", "Confirmed"]
];

export default function OrderHistoryPage() {
  return (
    <>
      <PageHeader eyebrow="Orders" title="Order history and invoices." description="Authenticated customers can view past orders, delivery statuses, and downloadable invoices." />
      <Section>
        <div className="overflow-x-auto rounded-[2rem] border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead><tr className="border-b border-black/5 dark:border-white/10"><th className="p-5">Order</th><th className="p-5">Product</th><th className="p-5">Total</th><th className="p-5">Status</th></tr></thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order[0]} className="border-b border-black/5 last:border-0 dark:border-white/10">
                  {order.map((cell) => <td key={cell} className="p-5">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
