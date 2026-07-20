"use client";

import { Grid2X2, List, Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { ProductCard } from "@/components/product/product-card";
import { Input, Select } from "@/components/ui/input";
import { categories, products } from "@/database/products";
import { cn } from "@/lib/utils";

export function ShopBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");

  // Advanced Filters
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [stockStatus, setStockStatus] = useState<string[]>([]);

  // Simulation loading state for skeleton loading
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Trigger loading spinner / skeletons briefly when criteria changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [category, query, sort, selectedConditions, priceRange, stockStatus]);

  const handleConditionToggle = (cond: string) => {
    setSelectedConditions(prev => 
      prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]
    );
    setCurrentPage(1);
  };

  const handleStockToggle = (status: string) => {
    setStockStatus(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    
    return products
      .filter((product) => category === "All" || product.category === category)
      .filter((product) => [product.name, product.category, product.series, product.description].join(" ").toLowerCase().includes(normalized))
      // Condition filter
      .filter((product) => {
        if (selectedConditions.length === 0) return true;
        return product.condition.some(c => selectedConditions.includes(c));
      })
      // Stock availability filter
      .filter((product) => {
        if (stockStatus.length === 0) return true;
        return stockStatus.includes(product.availability);
      })
      // Price range filter
      .filter((product) => {
        if (priceRange === "all") return true;
        if (priceRange === "under-200") return product.price < 200;
        if (priceRange === "200-1000") return product.price >= 200 && product.price <= 1000;
        if (priceRange === "above-1000") return product.price > 1000;
        return true;
      })
      // Sorting
      .sort((a, b) => {
        if (sort === "price-low") return a.price - b.price;
        if (sort === "price-high") return b.price - a.price;
        if (sort === "rating") return b.rating - a.rating;
        if (sort === "new") return Number(Boolean(b.newArrival)) - Number(Boolean(a.newArrival));
        return Number(Boolean(b.bestSeller)) - Number(Boolean(a.bestSeller));
      });
  }, [category, query, sort, selectedConditions, priceRange, stockStatus]);

  // Paginated list
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;

  const handleResetFilters = () => {
    setQuery("");
    setCategory("All");
    setSort("featured");
    setSelectedConditions([]);
    setPriceRange("all");
    setStockStatus([]);
    setCurrentPage(1);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr] items-start">
      {/* Sidebar Filters */}
      <aside className="space-y-6 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 p-6 rounded-[2rem] shadow-sm">
        <div className="flex justify-between items-center pb-3 border-b border-black/5 dark:border-white/5">
          <h3 className="font-extrabold text-sm text-brand-ink dark:text-white flex items-center gap-1.5">
            <SlidersHorizontal className="h-4 w-4 text-brand-blue" /> Filters
          </h3>
          <button 
            onClick={handleResetFilters}
            className="text-[10px] font-bold text-zinc-400 hover:text-brand-blue transition"
          >
            Reset All
          </button>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Department</p>
          <div className="flex flex-col gap-1 text-xs font-semibold">
            {["All", ...categories.slice(0, 7)].map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setCurrentPage(1); }}
                className={cn(
                  "text-left py-2 px-3 rounded-xl transition",
                  category === cat 
                    ? "bg-brand-blue/10 text-brand-blue font-bold dark:bg-brand-blue/20" 
                    : "text-zinc-600 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/5"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Condition Filter */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Device Condition</p>
          <div className="space-y-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            {["New", "Used", "Refurbished"].map((cond) => {
              const checked = selectedConditions.includes(cond);
              return (
                <label key={cond} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleConditionToggle(cond)}
                    className="rounded border-zinc-300 text-brand-blue focus:ring-brand-blue h-3.5 w-3.5"
                  />
                  <span>{cond}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Price Bracket Selector */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Price Bracket</p>
          <div className="space-y-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            {[
              { label: "All Prices", val: "all" },
              { label: "Under ₵200", val: "under-200" },
              { label: "₵200 - ₵1,000", val: "200-1000" },
              { label: "Above ₵1,000", val: "above-1000" }
            ].map((bracket) => (
              <label key={bracket.val} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="priceBracket"
                  checked={priceRange === bracket.val}
                  onChange={() => setPriceRange(bracket.val)}
                  className="border-zinc-300 text-brand-blue focus:ring-brand-blue h-3.5 w-3.5"
                />
                <span>{bracket.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Stock Status */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Availability</p>
          <div className="space-y-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            {["In Stock", "Low Stock", "Preorder", "Out of Stock"].map((status) => {
              const checked = stockStatus.includes(status);
              return (
                <label key={status} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleStockToggle(status)}
                    className="rounded border-zinc-300 text-brand-blue focus:ring-brand-blue h-3.5 w-3.5"
                  />
                  <span>{status}</span>
                </label>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Products Display Area */}
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="grid gap-3 rounded-[2rem] border border-black/5 bg-white p-4 shadow-sm md:grid-cols-[2fr_1.2fr_auto] dark:border-white/10 dark:bg-zinc-900">
          <label className="relative">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input 
              value={query} 
              onChange={(event) => { setQuery(event.target.value); setCurrentPage(1); }} 
              placeholder="Search catalog models, features, descriptors..." 
              className="pl-11 h-11" 
            />
          </label>
          
          <Select 
            value={sort} 
            onChange={(event) => { setSort(event.target.value); setCurrentPage(1); }}
            className="h-11"
          >
            <option value="featured">Featured / Best Seller</option>
            <option value="new">Newest Arrivals</option>
            <option value="rating">Top Rated Devices</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </Select>

          <div className="flex rounded-full bg-black/5 p-1 dark:bg-white/10 self-center">
            <button
              type="button"
              aria-label="Grid view"
              className={cn("focus-ring h-9 w-9 rounded-full transition", view === "grid" && "bg-white text-brand-blue shadow-sm dark:bg-zinc-800")}
              onClick={() => setView("grid")}
            >
              <Grid2X2 className="mx-auto h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="List view"
              className={cn("focus-ring h-9 w-9 rounded-full transition", view === "list" && "bg-white text-brand-blue shadow-sm dark:bg-zinc-800")}
              onClick={() => setView("list")}
            >
              <List className="mx-auto h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold px-2">
          <p>{filtered.length} products found</p>
          <p>Page {currentPage} of {totalPages}</p>
        </div>

        {/* Products Grid or Skeleton Loaders */}
        {isLoading ? (
          <div className={view === "grid" ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid gap-5 lg:grid-cols-2"}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-80 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[2rem] p-6 space-y-4 animate-pulse-fast flex flex-col justify-between">
                <div className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-2xl w-full" />
                <div className="space-y-2">
                  <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-md w-3/4" />
                  <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-md w-1/2" />
                </div>
                <div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full w-full" />
              </div>
            ))}
          </div>
        ) : paginatedList.length > 0 ? (
          <div className={view === "grid" ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid gap-5 lg:grid-cols-2 animate-fade-in"}>
            {paginatedList.map((product) => (
              <ProductCard key={product.id} product={product} compact={view === "list"} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-zinc-400 border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm font-semibold max-w-md mx-auto space-y-3">
            <AlertCircle className="h-8 w-8 text-zinc-350 mx-auto" />
            <p>No products match your filter parameters.</p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-brand-blue text-white rounded-full text-xs font-bold transition flex items-center gap-1.5 mx-auto"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Clear Filters
            </button>
          </div>
        )}

        {/* Real Pagination Controls */}
        {totalPages > 1 && !isLoading && (
          <div className="flex justify-center items-center gap-4 pt-6 text-xs font-bold text-zinc-600 dark:text-zinc-400">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2.5 border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <span>{currentPage} / {totalPages}</span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2.5 border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
