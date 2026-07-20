"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCommerceStore } from "@/context/store";
import type { Product, ProductCondition } from "@/types";

export function AddToCartButton({
  product,
  color,
  storage,
  condition,
  className,
  label = "Add to Cart"
}: {
  product: Product;
  color?: string;
  storage?: string;
  condition?: ProductCondition;
  className?: string;
  label?: string;
}) {
  const addToCart = useCommerceStore((state) => state.addToCart);

  return (
    <Button
      type="button"
      className={className}
      onClick={() =>
        addToCart({
          productId: product.id,
          quantity: 1,
          color: color || product.colors[0],
          storage: storage || product.storage[0],
          condition: condition || product.condition[0]
        })
      }
    >
      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
      {label}
    </Button>
  );
}
