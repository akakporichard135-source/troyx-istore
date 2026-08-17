"use client";

import Image from "next/image";
import Link from "next/link";
import { GitCompare, Heart, Eye, X } from "lucide-react";
import { useState } from "react";
import { AddToCartButton } from "@/components/product/add-to-cart";
import { useCommerceStore } from "@/context/store";
import {
  isUsedCondition,
  normalizeConditionLabel
} from "@/lib/condition-guide";
import { cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({
  product,
  compact = false
}: {
  product: Product;
  compact?: boolean;
}) {
  const wishlist = useCommerceStore((state) => state.wishlist);
  const compare = useCommerceStore((state) => state.compare);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);
  const toggleCompare = useCommerceStore((state) => state.toggleCompare);
  const saved = wishlist.includes(product.id);
  const compared = compare.includes(product.id);

  const categoryFallback = "/images/categories/accessories.webp";

  // Quick view modal state
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(
    product.images[0] || categoryFallback
  );
  const imageAlt =
    imageSrc === categoryFallback
      ? `${product.category} product image for ${product.name}`
      : product.name;
  const tradeInEligible = ["iPhone", "iPad", "MacBook", "Apple Watch"].includes(
    product.category
  );
  const batteryHealthAvailable =
    Boolean(product.batteryHealth) ||
    (product.category === "iPhone" && product.condition.some(isUsedCondition));
  const cardIndicators = [
    tradeInEligible && "Trade-In Available",
    batteryHealthAvailable && "Battery Health Available"
  ].filter(Boolean) as string[];

  return (
    <>
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-premium dark:border-white/10 dark:bg-zinc-900/75",
          compact ? "min-h-[390px]" : "min-h-[455px]"
        )}
      >
        {/* Wishlist and Compare float buttons */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button
            type="button"
            aria-label="Save to wishlist"
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur text-brand-ink transition hover:text-brand-blue hover:scale-105 shadow-sm dark:text-white"
            onClick={() => toggleWishlist(product.id)}
          >
            <Heart
              className={
                saved ? "h-4 w-4 fill-brand-blue text-brand-blue" : "h-4 w-4"
              }
            />
          </button>

          <button
            type="button"
            aria-label="Compare product"
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur text-brand-ink transition hover:text-brand-blue hover:scale-105 shadow-sm dark:text-white"
            onClick={() => toggleCompare(product.id)}
          >
            <GitCompare
              className={compared ? "h-4 w-4 text-brand-blue" : "h-4 w-4"}
            />
          </button>
        </div>

        {/* Media visual box */}
        <div
          className={cn(
            "relative flex items-center justify-center overflow-hidden bg-brand-mist dark:bg-zinc-950/40",
            compact ? "aspect-[4/3]" : "aspect-[5/4]"
          )}
        >
          <Link
            href={`/product/${product.slug}`}
            className="block w-full h-full relative"
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              onError={() => setImageSrc(categoryFallback)}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              loading="lazy"
              className={cn(
                "object-contain transition-transform duration-500 group-hover:scale-105",
                compact ? "p-5" : "p-6"
              )}
            />
          </Link>

          {/* Badge */}
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-blue shadow-sm backdrop-blur dark:bg-zinc-800/90">
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
        <div
          className={cn(
            "flex flex-1 flex-col justify-between",
            compact ? "p-4" : "p-5"
          )}
        >
          <div>
            <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">
              {product.category}
            </p>
            <Link
              href={`/product/${product.slug}`}
              className={cn(
                "mt-1 block text-base font-extrabold leading-6 text-brand-ink transition hover:text-brand-blue dark:text-white",
                compact ? "min-h-[42px]" : "min-h-[48px]"
              )}
            >
              {product.name}
            </Link>

            <p
              className={cn(
                "mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400",
                compact ? "min-h-[36px]" : "min-h-[40px]"
              )}
            >
                {product.description}
            </p>

            <div className="mt-3 flex items-center gap-1.5">
              {product.colors.slice(0, 5).map((color) => (
                <span
                  key={color}
                  className="h-4 w-4 rounded-full border border-black/10 shadow-sm dark:border-white/20"
                  style={{ backgroundColor: colorToSwatch(color) }}
                  title={color}
                  aria-label={color}
                />
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center rounded-full bg-brand-blue/10 px-2.5 py-1 text-[10px] font-bold text-brand-blue dark:bg-brand-blue/20">
                {normalizeConditionLabel(product.condition[0])}
              </span>
              {product.storage.slice(0, compact ? 1 : 2).map((opt) => (
                <span
                  key={opt}
                  className="inline-block rounded-full bg-black/[0.04] px-2.5 py-1 text-[10px] font-bold text-zinc-600 dark:bg-white/10 dark:text-zinc-300"
                >
                  {opt}
                </span>
              ))}
            </div>

            {cardIndicators.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {cardIndicators.slice(0, 2).map((indicator) => (
                  <span
                    key={indicator}
                    className="rounded-full border border-emerald-500/15 bg-emerald-500/10 px-2.5 py-1 text-[9px] font-bold text-emerald-700 dark:text-emerald-300"
                  >
                    {indicator}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 space-y-3 border-t border-black/5 pt-4 dark:border-white/5">
            <div className="flex justify-between items-center text-xs">
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  product.availability === "In Stock"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                    : product.availability === "Out of Stock"
                      ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                      : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                }`}
              >
                {product.availability}
              </span>
            </div>

            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-lg font-black text-brand-ink dark:text-white leading-none">
                  {formatCurrency(product.price)}
                </p>
                {product.compareAtPrice && product.compareAtPrice > 0 && (
                  <p className="text-[10px] text-zinc-400 line-through mt-0.5">
                    {formatCurrency(product.compareAtPrice)}
                  </p>
                )}
              </div>
              <Link
                href={`/product/${product.slug}`}
                className="text-xs font-bold text-brand-blue transition hover:text-blue-500"
              >
                View Details
              </Link>
            </div>

            <div>
              <AddToCartButton
                product={product}
                className="h-10 w-full px-4 text-xs"
                label={product.price > 0 ? "Add to Cart" : "Contact for Price"}
              />
            </div>
          </div>
        </div>
      </article>

      {/* Quick View Modal Overlay */}
      {quickViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/40 backdrop-blur-sm animate-fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setQuickViewOpen(false)}
          />

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
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-contain p-6"
              />
            </div>

            {/* Product description content */}
            <div className="flex flex-col justify-between py-2">
              <div>
                <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">
                  {product.category}
                </span>
                <h2 className="text-xl font-black text-brand-ink dark:text-white mt-1">
                  {product.name}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4 leading-relaxed line-clamp-4">
                  {product.description}
                </p>

                {/* Specs overview list */}
                <div className="mt-4 grid gap-2 text-[11px] text-zinc-500">
                  <p>
                    Warranty:{" "}
                    <strong className="text-brand-ink dark:text-white">
                      {product.warranty}
                    </strong>
                  </p>
                  <p>
                    Delivery:{" "}
                    <strong className="text-brand-ink dark:text-white">
                      {product.deliveryEstimate}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-brand-blue">
                    {formatCurrency(product.price)}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > 0 && (
                    <span className="text-xs text-zinc-400 line-through">
                      {formatCurrency(product.compareAtPrice)}
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/product/${product.slug}`}
                    className="flex-1 rounded-full bg-zinc-100 py-2.5 text-center text-xs font-bold text-zinc-800 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                  >
                    View Details
                  </Link>
                  <AddToCartButton
                    product={product}
                    className="flex-1 h-10 text-xs font-bold"
                    label={product.price > 0 ? "Add to Cart" : "Contact for Price"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function colorToSwatch(color: string) {
  const normalized = color.toLowerCase();
  const palette: Record<string, string> = {
    black: "#111827",
    white: "#f8fafc",
    silver: "#d4d4d8",
    graphite: "#4b5563",
    gray: "#71717a",
    grey: "#71717a",
    blue: "#3b82f6",
    pink: "#f9a8d4",
    red: "#ef4444",
    green: "#86efac",
    yellow: "#fde68a",
    purple: "#a78bfa",
    gold: "#d6b16f",
    natural: "#d6c6b5",
    titanium: "#c9c0b8",
    orange: "#f97316",
    midnight: "#111827",
    starlight: "#f5f1e8"
  };
  return (
    Object.entries(palette).find(([name]) => normalized.includes(name))?.[1] ||
    "#d4d4d8"
  );
}
