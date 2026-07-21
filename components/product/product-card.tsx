"use client";

import Image from "next/image";
import Link from "next/link";
import { GitCompare, Heart, Star, Eye, X, Check } from "lucide-react";
import { useState } from "react";
import { AddToCartButton } from "@/components/product/add-to-cart";
import { useCommerceStore } from "@/context/store";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const wishlist = useCommerceStore((state) => state.wishlist);
  const compare = useCommerceStore((state) => state.compare);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);
  const toggleCompare = useCommerceStore((state) => state.toggleCompare);
  const saved = wishlist.includes(product.id);
  const compared = compare.includes(product.id);

  // Quick view modal state
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  return (
    <>
      <article className="group overflow-hidden rounded-[2.5rem] border border-black/5 bg-white shadow-sm hover:shadow-premium transition-all duration-300 dark:border-white/10 dark:bg-zinc-900/60 flex flex-col justify-between h-full relative">
        
        {/* Wishlist and Compare float buttons */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button
            type="button"
            aria-label="Save to wishlist"
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur text-brand-ink transition hover:text-brand-blue hover:scale-105 shadow-sm dark:text-white"
            onClick={() => toggleWishlist(product.id)}
          >
            <Heart className={saved ? "h-4 w-4 fill-brand-blue text-brand-blue" : "h-4 w-4"} />
          </button>
          
          <button
            type="button"
            aria-label="Compare product"
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur text-brand-ink transition hover:text-brand-blue hover:scale-105 shadow-sm dark:text-white"
            onClick={() => toggleCompare(product.id)}
          >
            <GitCompare className={compared ? "h-4 w-4 text-brand-blue" : "h-4 w-4"} />
          </button>
        </div>

        {/* Media visual box */}
        <div className="bg-brand-mist dark:bg-zinc-950/20 relative aspect-square overflow-hidden flex items-center justify-center">
          <Link href={`/product/${product.slug}`} className="block w-full h-full relative">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Badge */}
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-white/92 backdrop-blur px-3 py-1 text-[10px] font-bold text-brand-blue shadow-sm dark:bg-zinc-800/90">
              {product.badge}
            </span>
          )}

          {/* Quick View Hover overlay */}
          <div className="absolute inset-0 bg-brand-ink/15 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
            <button
              onClick={() => setQuickViewOpen(true)}
              className="px-4 py-2 bg-white/90 dark:bg-zinc-900/90 text-brand-ink dark:text-white rounded-full text-xs font-bold shadow flex items-center gap-1.5 hover:scale-105 transition"
            >
              <Eye className="h-3.5 w-3.5" /> Quick View
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">{product.category}</p>
            <Link href={`/product/${product.slug}`} className="mt-1 block text-base font-extrabold text-brand-ink hover:text-brand-blue dark:text-white transition">
              {product.name}
            </Link>
            
            {!compact && (
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                {product.description}
              </p>
            )}

            {/* Spec pills preview & Seller Badge */}
            {!compact && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {/* Seller Badge */}
                <Link
                  href={`/store/${product.vendorSlug || (product.isVerifiedVendor ? "troyx-official" : "troyx-official")}`}
                  className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Sold by {product.vendorName || "TroyX Flagship"}
                </Link>

                {product.storage.slice(0, 2).map((opt) => (
                  <span key={opt} className="inline-block rounded-md bg-blue-50/50 px-2 py-0.5 text-[9px] font-bold text-brand-blue dark:bg-blue-900/20">
                    {opt}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 space-y-3">
            {/* Rating & Availability */}
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1 font-bold text-brand-ink dark:text-white">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {product.rating} <span className="text-[10px] text-zinc-400 font-normal">({product.reviewCount})</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                product.availability === "In Stock" 
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
              }`}>
                {product.availability}
              </span>
            </div>

            {/* Pricing and Add to cart */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-black text-brand-ink dark:text-white leading-none">{formatCurrency(product.price)}</p>
                {product.compareAtPrice && (
                  <p className="text-[10px] text-zinc-400 line-through mt-0.5">{formatCurrency(product.compareAtPrice)}</p>
                )}
              </div>
              <AddToCartButton product={product} className="h-9 px-4 text-xs" label="Add" />
            </div>
          </div>
        </div>
      </article>

      {/* Quick View Modal Overlay */}
      {quickViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/40 backdrop-blur-sm animate-fade-in">
          <div className="fixed inset-0" onClick={() => setQuickViewOpen(false)} />
          
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-2xl p-6 md:p-8 grid md:grid-cols-2 gap-8 z-10 animate-scale-up">
            
            <button 
              onClick={() => setQuickViewOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full border border-black/10 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300 transition"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Product image gallery */}
            <div className="bg-brand-mist dark:bg-zinc-950/20 rounded-2xl p-4 flex items-center justify-center aspect-square relative">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-contain p-6"
              />
            </div>

            {/* Product description content */}
            <div className="flex flex-col justify-between py-2">
              <div>
                <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">{product.category}</span>
                <h2 className="text-xl font-black text-brand-ink dark:text-white mt-1">{product.name}</h2>
                <div className="flex items-center gap-2 text-xs font-semibold mt-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating} ({product.reviewCount} reviews)</span>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4 leading-relaxed line-clamp-4">
                  {product.description}
                </p>

                {/* Specs overview list */}
                <div className="mt-4 grid gap-2 text-[11px] text-zinc-500">
                  <p>Warranty: <strong className="text-brand-ink dark:text-white">{product.warranty}</strong></p>
                  <p>Delivery: <strong className="text-brand-ink dark:text-white">{product.deliveryEstimate}</strong></p>
                </div>
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-brand-blue">{formatCurrency(product.price)}</span>
                  {product.compareAtPrice && (
                    <span className="text-xs text-zinc-400 line-through">{formatCurrency(product.compareAtPrice)}</span>
                  )}
                </div>

                <div className="flex gap-3">
                  <Link 
                    href={`/product/${product.slug}`}
                    className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 rounded-full text-xs font-bold text-center text-zinc-800 dark:text-white transition"
                  >
                    View Details
                  </Link>
                  <AddToCartButton product={product} className="flex-1 h-10 text-xs font-bold" label="Add to Cart" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
