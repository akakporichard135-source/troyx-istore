"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/product/product-grid";
import { Input } from "@/components/ui/input";
import { useAdminStore } from "@/context/admin-store";

export function SearchClient() {
  const [query, setQuery] = useState("");
  const products = useAdminStore((state) => state.products);

  const matchedProducts = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return products.slice(0, 12);

    return products.filter((product) =>
      [product.name, product.category, product.series, ...(product.colors || []), ...(product.storage || []), product.description]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [query, products]);

  return (
    <div className="space-y-8">
      <label className="relative block">
        <span className="sr-only">Search products</span>
        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-14 rounded-full pl-14 text-base"
          placeholder="Search iPhones, MacBooks, iPads, storage, colours, chargers..."
        />
      </label>

      <div className="flex flex-wrap gap-2 border-b border-black/5 pb-4 text-xs dark:border-white/10">
        {["iPhone 16", "MacBook Pro", "iPad Pro", "256GB", "AirPods", "Gaming"].map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="rounded-full bg-brand-mist px-4 py-2 font-semibold text-zinc-700 transition hover:bg-black/10 dark:bg-white/10 dark:text-zinc-200 dark:hover:bg-white/20"
            onClick={() => setQuery(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-brand-ink dark:text-white">Matching Products ({matchedProducts.length})</h2>
        <ProductGrid products={matchedProducts} />
      </div>
    </div>
  );
}
