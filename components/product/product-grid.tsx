"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types";

export function ProductGrid({ products, compact = false }: { products: Product[]; compact?: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: "previous" | "next") => {
    const element = scrollRef.current;
    if (!element) return;
    const card = element.querySelector("article");
    const distance = card instanceof HTMLElement ? card.offsetWidth + 16 : 320;
    element.scrollBy({
      left: direction === "previous" ? -distance : distance,
      behavior: "smooth"
    });
  };

  return (
    <div className="relative">
      <div className="mb-4 flex justify-end gap-2 md:hidden">
        <button
          type="button"
          aria-label="Previous products"
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white text-brand-ink shadow-sm dark:bg-white/10 dark:text-white"
          onClick={() => scrollByCard("previous")}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Next products"
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white text-brand-ink shadow-sm dark:bg-white/10 dark:text-white"
          onClick={() => scrollByCard("next")}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3 xl:grid-cols-4"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[78vw] min-w-[78vw] max-w-[320px] snap-start md:w-auto md:min-w-0 md:max-w-none"
          >
            <ProductCard product={product} compact={compact} />
          </div>
        ))}
      </div>
    </div>
  );
}
