"use client";

import { useState } from "react";
import { GitCompare, Heart, Share2, Zap } from "lucide-react";
import { AddToCartButton } from "@/components/product/add-to-cart";
import { Button, LinkButton } from "@/components/ui/button";
import { useCommerceStore } from "@/context/store";
import type { Product, ProductCondition } from "@/types";
import { cn } from "@/lib/utils";

export function ProductDetailActions({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0]);
  const [storage, setStorage] = useState(product.storage[0]);
  const [condition, setCondition] = useState<ProductCondition>(product.condition[0]);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);
  const toggleCompare = useCommerceStore((state) => state.toggleCompare);

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
        <LinkButton href="/checkout" variant="dark" className="h-12">
          <Zap className="h-4 w-4" /> Buy Now
        </LinkButton>
      </div>

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
            {swatches && <span className="h-4 w-4 rounded-full border border-black/10 bg-gradient-to-br from-zinc-100 via-blue-100 to-zinc-700" />}
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
