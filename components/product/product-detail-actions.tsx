"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GitCompare, Heart, MessageCircle, Share2, Zap } from "lucide-react";
import { AddToCartButton } from "@/components/product/add-to-cart";
import { Button } from "@/components/ui/button";
import { useCommerceStore } from "@/context/store";
import { siteConfig } from "@/lib/site";
import type { Product, ProductCondition } from "@/types";
import { cn } from "@/lib/utils";

export function ProductDetailActions({ product }: { product: Product }) {
  const router = useRouter();
  const [color, setColor] = useState(product.colors[0]);
  const [storage, setStorage] = useState(product.storage[0]);
  const [condition, setCondition] = useState<ProductCondition>(product.condition[0]);
  const addToCart = useCommerceStore((state) => state.addToCart);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);
  const toggleCompare = useCommerceStore((state) => state.toggleCompare);
  const whatsappHref = `https://wa.me/${siteConfig.phone.replace(
    /[^0-9]/g,
    ""
  )}?text=${encodeURIComponent(
    `Hello TroyX iStore, I am interested in ${product.name} (${storage}, ${color}, ${condition}). Please confirm availability and price.`
  )}`;

  function handleBuyNow() {
    addToCart({
      productId: product.id,
      quantity: 1,
      color,
      storage,
      condition
    });
    router.push("/checkout");
  }

  return (
    <div className="space-y-6">
      <OptionGroup label="Color" options={product.colors} selected={color} onSelect={setColor} swatches />
      <OptionGroup label="Storage / Size" options={product.storage} selected={storage} onSelect={setStorage} />
      <OptionGroup
        label="Condition"
        options={product.condition}
        selected={condition}
        onSelect={(value) => setCondition(value as ProductCondition)}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <AddToCartButton product={product} color={color} storage={storage} condition={condition} className="h-12" />
        <Button type="button" variant="dark" className="h-12" onClick={handleBuyNow}>
          <Zap className="h-4 w-4" /> Buy Now
        </Button>
      </div>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="focus-ring inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-500 hover:text-white dark:text-emerald-300"
      >
        <MessageCircle className="h-4 w-4" />
        Ask on WhatsApp about {product.name}
      </a>

      <div className="grid gap-3 sm:grid-cols-3">
        <Button type="button" variant="secondary" onClick={() => toggleWishlist(product.id)}>
          <Heart className="h-4 w-4" /> Wishlist
        </Button>
        <Button type="button" variant="secondary" onClick={() => toggleCompare(product.id)}>
          <GitCompare className="h-4 w-4" /> Compare
        </Button>
        <Button type="button" variant="secondary" onClick={() => navigator.share?.({ title: product.name, url: location.href })}>
          <Share2 className="h-4 w-4" /> Share
        </Button>
      </div>
    </div>
  );
}

function OptionGroup({
  label,
  options,
  selected,
  onSelect,
  swatches = false
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  swatches?: boolean;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-brand-ink dark:text-white">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={cn(
              "focus-ring inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
              selected === option
                ? "border-brand-blue bg-brand-blue text-white"
                : "border-black/10 bg-white text-brand-ink hover:border-brand-blue dark:border-white/10 dark:bg-white/10 dark:text-white"
            )}
            onClick={() => onSelect(option)}
          >
            {swatches && (
              <span
                className="h-4 w-4 rounded-full border border-black/10"
                style={{ backgroundColor: colorToSwatch(option) }}
              />
            )}
            {option}
          </button>
        ))}
      </div>
    </fieldset>
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
    desert: "#d9a16f",
    midnight: "#111827",
    starlight: "#f5f1e8",
    ultramarine: "#365fd8",
    teal: "#2dd4bf"
  };
  return (
    Object.entries(palette).find(([name]) => normalized.includes(name))?.[1] ||
    "#d4d4d8"
  );
}
