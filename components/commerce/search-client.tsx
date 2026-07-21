"use client";

import { Search, Store, ShieldCheck, Star, MapPin, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductGrid } from "@/components/product/product-grid";
import { Input } from "@/components/ui/input";
import { useAdminStore } from "@/context/admin-store";
import { useVendorStore } from "@/context/vendor-store";

export function SearchClient() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | "products" | "stores">("all");

  const products = useAdminStore((state) => state.products);
  const vendors = useVendorStore((state) => state.vendors);

  const matchedProducts = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return products.slice(0, 8);
    return products.filter((p) =>
      [p.name, p.category, p.series, ...(p.colors || []), ...(p.storage || []), p.description, p.vendorName || ""]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [query, products]);

  const matchedVendors = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return vendors.slice(0, 4);
    return vendors.filter((v) =>
      [v.name, v.category, v.city, v.country, v.description, v.ownerName]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [query, vendors]);

  return (
    <div className="space-y-8">
      {/* Search Input Bar */}
      <label className="relative block">
        <span className="sr-only">Search Marketplace</span>
        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-14 rounded-full pl-14 text-base"
          placeholder="Search iPhones, MacBooks, stores, Accra vendors, chargers..."
        />
      </label>

      {/* Suggestion Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 dark:border-white/10 pb-4">
        <div className="flex flex-wrap gap-2 text-xs">
          {["iPhone 16", "MacBook Pro", "iTech Ghana", "256GB", "Chargers", "Gaming"].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="rounded-full bg-brand-mist px-4 py-2 font-semibold text-zinc-700 hover:bg-black/10 dark:bg-white/10 dark:text-zinc-200 dark:hover:bg-white/20 transition"
              onClick={() => setQuery(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Search Entity Filter Tabs */}
        <div className="flex items-center gap-1 rounded-2xl bg-zinc-100 dark:bg-zinc-900 p-1 text-xs">
          <button
            type="button"
            className={`rounded-xl px-3.5 py-1.5 font-bold transition ${
              tab === "all" ? "bg-brand-blue text-white" : "text-zinc-500 hover:text-white"
            }`}
            onClick={() => setTab("all")}
          >
            All Results
          </button>
          <button
            type="button"
            className={`rounded-xl px-3.5 py-1.5 font-bold transition ${
              tab === "products" ? "bg-brand-blue text-white" : "text-zinc-500 hover:text-white"
            }`}
            onClick={() => setTab("products")}
          >
            Products ({matchedProducts.length})
          </button>
          <button
            type="button"
            className={`rounded-xl px-3.5 py-1.5 font-bold transition ${
              tab === "stores" ? "bg-brand-blue text-white" : "text-zinc-500 hover:text-white"
            }`}
            onClick={() => setTab("stores")}
          >
            Stores ({matchedVendors.length})
          </button>
        </div>
      </div>

      {/* Stores Search Results */}
      {(tab === "all" || tab === "stores") && matchedVendors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-brand-ink dark:text-white flex items-center gap-2">
              <Store className="h-5 w-5 text-brand-blue" />
              Matching Merchants & Stores
            </h2>
            <Link href="/stores" className="text-xs font-semibold text-brand-blue hover:underline">
              View Directory &rarr;
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matchedVendors.map((v) => (
              <Link
                key={v.id}
                href={`/store/${v.slug}`}
                className="flex items-center gap-4 rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-4 shadow-sm hover:border-brand-blue/40 transition group"
              >
                <img
                  src={v.logoUrl}
                  alt={v.name}
                  className="h-14 w-14 rounded-2xl border border-black/10 dark:border-white/10 object-cover bg-zinc-100 dark:bg-zinc-800 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="truncate font-bold text-sm text-brand-ink dark:text-white group-hover:text-brand-blue transition">
                      {v.name}
                    </p>
                    {v.isVerified && <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-zinc-500 truncate">{v.category}</p>
                  <p className="text-[10px] text-zinc-400 mt-1 font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-brand-blue" /> {v.city} &bull; <Star className="h-3 w-3 fill-amber-400 text-amber-400 inline" /> {v.rating}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products Search Results */}
      {(tab === "all" || tab === "products") && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-brand-ink dark:text-white">
            Matching Products ({matchedProducts.length})
          </h2>
          <ProductGrid products={matchedProducts} />
        </div>
      )}
    </div>
  );
}
