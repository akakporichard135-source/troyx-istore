"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/product/product-grid";
import { Input } from "@/components/ui/input";
import { products } from "@/database/products";

export function SearchClient() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.toLowerCase();
    if (!normalized) return products.slice(0, 8);
    return products.filter((product) =>
      [product.name, product.category, product.series, ...product.colors, ...product.storage, product.description]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [query]);

  return (
    <div className="space-y-8">
      <label className="relative block">
        <span className="sr-only">Search</span>
        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-14 rounded-full pl-14 text-base" placeholder="Try iPhone 16, blue, 256GB, charger..." />
      </label>
      <div className="flex flex-wrap gap-2 text-sm">
        {["iPhone", "MacBook", "256GB", "Blue", "Chargers"].map((suggestion) => (
          <button key={suggestion} type="button" className="rounded-full bg-brand-mist px-4 py-2 font-semibold text-zinc-700 dark:bg-white/10 dark:text-zinc-200" onClick={() => setQuery(suggestion)}>
            {suggestion}
          </button>
        ))}
      </div>
      <ProductGrid products={results} />
    </div>
  );
}
