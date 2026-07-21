"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(product.images[0]);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ transform: "scale(1)" });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transform: "scale(1.5)",
      transformOrigin: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transform: "scale(1)" });
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[96px_1fr]">
      {/* Side thumbnails */}
      <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible scrollbar-none">
        {product.images.map((image, idx) => (
          <button
            key={idx}
            type="button"
            className={cn(
              "focus-ring relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border bg-brand-mist dark:bg-zinc-800/40",
              active === image ? "border-brand-blue ring-2 ring-brand-blue/20" : "border-black/5 dark:border-white/5"
            )}
            onClick={() => setActive(image)}
          >
            <Image src={image} alt="" fill sizes="80px" className="object-contain p-2" />
          </button>
        ))}
      </div>

      {/* Main Image with Hover Zoom Magnifier */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="order-1 overflow-hidden rounded-[2.5rem] bg-brand-mist dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 lg:order-2 cursor-zoom-in relative aspect-square"
      >
        <Image 
          src={active} 
          alt={product.name} 
          fill 
          priority 
          onError={() => setActive("/assets/product-device-blue.svg")}
          sizes="(min-width: 1024px) 50vw, 100vw" 
          className="object-contain p-10 transition-transform duration-100 ease-out" 
          style={zoomStyle}
        />
        <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider print:hidden">
          Hover to Zoom
        </span>
      </div>
    </div>
  );
}
