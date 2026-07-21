"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Store,
  Search,
  ShieldCheck,
  Star,
  MapPin,
  Package,
  ArrowRight,
  Sparkles,
  Building2
} from "lucide-react";
import { useVendorStore } from "@/context/vendor-store";
import { Button } from "@/components/ui/button";

export default function StoreDirectoryPage() {
  const vendors = useVendorStore((state) => state.vendors);

  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("All");

  const approvedVendors = vendors.filter((v) => v.status === "Approved");

  const cities = ["All", ...Array.from(new Set(approvedVendors.map((v) => v.city)))];

  const filtered = approvedVendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase());
    const matchesCity = filterCity === "All" || v.city === filterCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen bg-brand-mist dark:bg-zinc-950 text-brand-ink dark:text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 dark:border-white/10 bg-white/80 dark:bg-white/5 px-4 py-1.5 text-xs font-semibold text-brand-blue backdrop-blur-md">
            <Store className="h-3.5 w-3.5" />
            <span>TroyX Verified Store Directory</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Browse Electronics Merchants Across Ghana
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Shop directly from official Apple flagship stores and verified merchant partners in Accra, Kumasi, Tema, and Takoradi.
          </p>
        </div>

        {/* Search & City Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-zinc-900/60 p-4 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm backdrop-blur-xl">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search stores by name, electronics category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 pl-10 pr-4 text-xs font-medium text-brand-ink dark:text-white placeholder-zinc-400 focus:border-brand-blue focus:outline-none"
            />
          </div>

          {/* City Pill Filter */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-xs font-semibold text-zinc-500 mr-2">Region:</span>
            {cities.map((c) => (
              <button
                key={c}
                type="button"
                className={`rounded-xl px-3 py-1.5 font-bold transition ${
                  filterCity === c
                    ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-brand-ink dark:hover:text-white"
                }`}
                onClick={() => setFilterCity(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Stores Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <div
              key={v.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900/80 shadow-sm transition hover:border-brand-blue/40 hover:shadow-xl dark:hover:shadow-brand-blue/5"
            >
              {/* Store Banner & Badges */}
              <div className="relative h-36 w-full bg-zinc-800 overflow-hidden">
                <img
                  src={v.bannerUrl}
                  alt={v.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Flagship / Verified Badge Overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  {v.isFlagship ? (
                    <span className="flex items-center gap-1 rounded-full bg-brand-blue px-3 py-1 text-[10px] font-extrabold text-white shadow-md uppercase tracking-wider">
                      <Sparkles className="h-3 w-3" /> Flagship Store
                    </span>
                  ) : v.isVerified ? (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-extrabold text-white shadow-md">
                      <ShieldCheck className="h-3 w-3" /> Verified Merchant
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Store Logo & Details */}
              <div className="p-6 pt-0 relative flex-1 flex flex-col justify-between">
                <div>
                  {/* Logo overlay */}
                  <div className="-mt-10 mb-4 flex items-end justify-between">
                    <img
                      src={v.logoUrl}
                      alt={v.name}
                      className="h-16 w-16 rounded-2xl border-4 border-white dark:border-zinc-900 object-cover bg-white shadow-md shrink-0"
                    />
                    <div className="flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-bold text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      <span>{v.rating}</span>
                      <span className="text-[10px] text-zinc-400 font-normal">({v.reviewCount})</span>
                    </div>
                  </div>

                  <h2 className="text-lg font-extrabold text-brand-ink dark:text-white group-hover:text-brand-blue transition">
                    {v.name}
                  </h2>
                  <p className="text-xs font-semibold text-brand-blue mt-0.5">{v.category}</p>

                  <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {v.description}
                  </p>

                  {/* Metadata Row */}
                  <div className="mt-4 flex items-center gap-4 text-[11px] text-zinc-500 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-brand-blue" />
                      {v.city}, {v.country}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="h-3.5 w-3.5 text-purple-400" />
                      {v.productCount} Products
                    </span>
                  </div>
                </div>

                {/* Visit Store Button */}
                <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5">
                  <Link href={`/store/${v.slug}`}>
                    <Button className="w-full h-11 text-xs font-bold bg-brand-ink dark:bg-white text-white dark:text-brand-ink hover:opacity-90 rounded-2xl">
                      Visit Storefront
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-xs text-zinc-500 rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900">
            No storefronts found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
