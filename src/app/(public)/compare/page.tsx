import React from "react";
import { getProducts } from "@/lib/storage/db";
import EmptyState from "@/components/public/EmptyState";
import { formatGHS } from "@/lib/pricing";

export const revalidate = 0;

export default async function ComparePage() {
  const products = await getProducts({ isPublished: true });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-zinc-900 bg-zinc-950 py-16 px-4 sm:px-6 text-center space-y-3">
        <p className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
          Compare Models
        </p>
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
          Which Apple device is right for you?
        </h1>
        <p className="text-sm text-zinc-400 max-w-lg mx-auto">
          Compare specs, display technology, battery life, and pricing in Ghana cedi.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {products.length < 2 ? (
          <EmptyState
            title="Comparison Tool Ready"
            description="As new verified products are published to our catalog, you can select and compare multiple models side by side."
            actionText="Browse Categories"
            actionHref="/store"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.slice(0, 3).map((prod) => (
              <div key={prod.id} className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
                <h3 className="text-xl font-semibold text-white">{prod.name}</h3>
                <div className="text-base font-medium text-zinc-300">
                  {formatGHS(prod.discountPrice ?? prod.basePrice)}
                </div>
                <div className="border-t border-zinc-800 pt-3 text-xs text-zinc-400 space-y-2">
                  <div>Condition: {prod.condition}</div>
                  <div>SIM: {prod.simConfig}</div>
                  {prod.batteryHealth && <div>Battery Health: {prod.batteryHealth}%</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
