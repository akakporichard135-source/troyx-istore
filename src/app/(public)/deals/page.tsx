import React from "react";
import { getPromotions, getProducts } from "@/lib/storage/db";
import EmptyState from "@/components/public/EmptyState";
import { Tag } from "lucide-react";

export const revalidate = 0;

export default async function DealsPage() {
  const [promos, products] = await Promise.all([getPromotions(), getProducts({ isPublished: true })]);
  const activePromos = promos.filter((p) => p.isActive);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-zinc-900 bg-zinc-950 py-16 px-4 sm:px-6 text-center space-y-3">
        <p className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
          Exclusive Offers
        </p>
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
          Deals & Promotions
        </h1>
        <p className="text-sm text-zinc-400 max-w-lg mx-auto">
          Limited-time offers on certified original Apple devices at TroyX iStore in East Legon.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {activePromos.length === 0 ? (
          <EmptyState
            title="No Active Promotions"
            description="Our seasonal promotions and trade-in campaigns are announced regularly on our TikTok (@troyx_istore) and in-store at East Legon."
            actionText="Visit Store Catalog"
            actionHref="/store"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activePromos.map((promo) => (
              <div
                key={promo.id}
                className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-3"
              >
                <div className="flex items-center gap-2 text-xs text-blue-400">
                  <Tag className="w-4 h-4" />
                  <span className="font-semibold uppercase tracking-wider">{promo.code}</span>
                </div>
                <h3 className="text-2xl font-semibold text-white">{promo.title}</h3>
                <p className="text-sm text-zinc-400">{promo.bannerText}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
