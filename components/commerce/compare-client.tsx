"use client";

import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { useCommerceStore } from "@/context/store";
import { products } from "@/database/products";
import { formatCurrency } from "@/lib/utils";

export function CompareClient() {
  const compare = useCommerceStore((state) => state.compare);
  const selected = products.filter((product) => compare.includes(product.id));

  if (selected.length < 2) {
    return <EmptyState title="Choose at least two products" description="Use Compare on product cards to build a professional comparison table." actionHref="/shop" actionLabel="Compare products" />;
  }

  const rows = ["category", "price", "storage", "colors", "condition", "warranty", "deliveryEstimate"] as const;

  return (
    <div className="overflow-x-auto rounded-[2rem] border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-black/5 dark:border-white/10">
            <th className="p-5">Feature</th>
            {selected.map((product) => (
              <th key={product.id} className="p-5">
                <Link href={`/product/${product.slug}`} className="text-lg font-semibold text-brand-ink hover:text-brand-blue dark:text-white">
                  {product.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row} className="border-b border-black/5 last:border-0 dark:border-white/10">
              <td className="p-5 font-semibold capitalize text-zinc-500">{row.replace(/([A-Z])/g, " $1")}</td>
              {selected.map((product) => (
                <td key={`${product.id}-${row}`} className="p-5 text-zinc-700 dark:text-zinc-200">
                  {row === "price" ? formatCurrency(product.price) : Array.isArray(product[row]) ? product[row].join(", ") : product[row]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
