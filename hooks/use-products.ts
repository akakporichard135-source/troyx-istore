"use client";

import { products } from "@/database/products";

export function useProducts() {
  return {
    products,
    searchProducts: (query: string) => {
      const normalized = query.toLowerCase();
      return products.filter((product) =>
        [product.name, product.category, product.series, ...product.colors, ...product.storage]
          .join(" ")
          .toLowerCase()
          .includes(normalized)
      );
    }
  };
}
