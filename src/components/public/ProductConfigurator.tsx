"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatGHS } from "@/lib/pricing";
import { ProductRecord, ProductVariant } from "@/lib/types";
import { useCart } from "@/lib/cart/cart-context";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
  CheckCircle2,
  Cpu,
  Battery,
  Smartphone,
  ShoppingBag,
  Check,
  ChevronRight,
  Info,
} from "lucide-react";

interface ProductConfiguratorProps {
  product: ProductRecord;
}

// Fallback color mapping for common Apple finishes
const COLOR_HEX_MAP: Record<string, string> = {
  "Space Black": "#1f2022",
  "Silver": "#e2e4e5",
  "Natural Titanium": "#9f9891",
  "Desert Titanium": "#bfa588",
  "Black Titanium": "#232324",
  "White Titanium": "#ebebeb",
  "Space Gray": "#4e4f51",
  "Midnight": "#181e28",
  "Starlight": "#f0ece1",
  "Deep Purple": "#4b3c5a",
  "Alpine Green": "#3a4b41",
  "Sierra Blue": "#718ca1",
  "Product Red": "#c91524",
  "Gold": "#fae7cf",
  "Graphite": "#42403d",
};

export default function ProductConfigurator({ product }: ProductConfiguratorProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const variants = product.variants || [];

  // Extract unique colors and storages
  const availableColors = useMemo(() => {
    if (variants.length === 0) return [];
    const set = new Set<string>();
    variants.forEach((v) => {
      if (v.color) set.add(v.color);
    });
    return Array.from(set);
  }, [variants]);

  const availableStorages = useMemo(() => {
    if (variants.length === 0) return [];
    const set = new Set<string>();
    variants.forEach((v) => {
      if (v.storage) set.add(v.storage);
    });
    return Array.from(set);
  }, [variants]);

  // Selected State
  const [selectedColor, setSelectedColor] = useState<string>(
    availableColors[0] || "Default"
  );
  const [selectedStorage, setSelectedStorage] = useState<string>(
    availableStorages[0] || ""
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Match the active variant if variants exist
  const activeVariant: ProductVariant | undefined = useMemo(() => {
    if (variants.length === 0) return undefined;
    const match = variants.find(
      (v) =>
        (!selectedColor || v.color === selectedColor) &&
        (!selectedStorage || v.storage === selectedStorage)
    );
    return match || variants[0];
  }, [variants, selectedColor, selectedStorage]);

  // Determine effective pricing & stock
  const effectivePrice = activeVariant
    ? activeVariant.discountPrice ?? activeVariant.price
    : product.discountPrice ?? product.basePrice;

  const originalPrice = activeVariant
    ? activeVariant.price
    : product.basePrice;

  const hasDiscount = activeVariant
    ? activeVariant.discountPrice !== null && activeVariant.discountPrice !== undefined
    : product.discountPrice !== null && product.discountPrice !== undefined;

  const currentStock = activeVariant
    ? activeVariant.stockQuantity
    : product.stockQuantity;

  const isAvailable = activeVariant ? activeVariant.isAvailable && currentStock > 0 : currentStock > 0;

  // Active Images: variant image takes priority, then product images
  const allImages = useMemo(() => {
    const list: string[] = [];
    if (activeVariant?.imageUrl) {
      list.push(activeVariant.imageUrl);
    }
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        if (!list.includes(img)) list.push(img);
      });
    }
    return list;
  }, [activeVariant, product.images]);

  const currentImage = allImages[activeImageIndex] || allImages[0];

  // Add to Bag handler
  const handleAddToBag = () => {
    addItem({
      productId: product.id,
      variantId: activeVariant?.id,
      productName: product.name,
      variantTitle: activeVariant ? activeVariant.title : undefined,
      sku: activeVariant ? activeVariant.sku : product.sku,
      unitPrice: effectivePrice,
      quantity: 1,
      imageUrl: currentImage,
      category: product.category,
      color: activeVariant?.color || (selectedColor !== "Default" ? selectedColor : undefined),
      storage: activeVariant?.storage || (selectedStorage || undefined),
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2500);
  };

  // Instant Buy handler
  const handleBuyNow = () => {
    addItem({
      productId: product.id,
      variantId: activeVariant?.id,
      productName: product.name,
      variantTitle: activeVariant ? activeVariant.title : undefined,
      sku: activeVariant ? activeVariant.sku : product.sku,
      unitPrice: effectivePrice,
      quantity: 1,
      imageUrl: currentImage,
      category: product.category,
      color: activeVariant?.color || (selectedColor !== "Default" ? selectedColor : undefined),
      storage: activeVariant?.storage || (selectedStorage || undefined),
    });

    router.push("/checkout");
  };

  // WhatsApp Order message
  const whatsappMessage = useMemo(() => {
    const variantSpec = [
      activeVariant?.color || (selectedColor !== "Default" ? selectedColor : ""),
      activeVariant?.storage || selectedStorage,
      product.condition,
    ]
      .filter(Boolean)
      .join(" - ");

    let text = `Hello TroyX iStore, I want to order the original Apple device:\n\n`;
    text += `*${product.name}*\n`;
    if (variantSpec) text += `*Configuration:* ${variantSpec}\n`;
    text += `*Price:* ${formatGHS(effectivePrice)}\n`;
    text += `*Availability:* In-Store Pickup in Bawaleshie, East Legon / Accra Delivery\n\n`;
    text += `Please confirm stock and reservation. Thank you!`;
    return encodeURIComponent(text);
  }, [product, activeVariant, selectedColor, selectedStorage, effectivePrice]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sub-header / Breadcrumbs & Specs link */}
      <div className="border-b border-zinc-900 bg-zinc-950/80 sticky top-12 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <Link href="/store" className="hover:text-white transition-colors">
              Store
            </Link>
            <span>/</span>
            <Link
              href={`/${product.category}`}
              className="hover:text-white capitalize transition-colors"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-zinc-200 font-medium truncate max-w-[150px] sm:max-w-xs">
              {product.name}
            </span>
          </div>

          {product.learnMorePageId && (
            <Link
              href={`/learn-more/${product.slug}`}
              className="text-blue-500 hover:text-blue-400 font-medium flex items-center gap-1 transition-colors"
            >
              <span>Explore Features & Specs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column: Media Gallery */}
          <div className="space-y-4 lg:sticky lg:top-28">
            <div className="aspect-square w-full rounded-2xl bg-[#161617] border border-zinc-800/80 flex items-center justify-center p-8 overflow-hidden relative group">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="text-center text-zinc-600">
                  <Smartphone className="w-16 h-16 mx-auto mb-2 opacity-40" />
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    Original Apple Hardware
                  </p>
                </div>
              )}

              {/* Stock Badge */}
              <div className="absolute top-4 left-4">
                <span
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${
                    isAvailable
                      ? "bg-emerald-950/70 border-emerald-800 text-emerald-400"
                      : "bg-red-950/70 border-red-800 text-red-400"
                  }`}
                >
                  {isAvailable ? `In Stock (${currentStock} units)` : "Sold Out"}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-20 h-20 rounded-xl bg-[#161617] p-2 shrink-0 border transition-all ${
                      activeImageIndex === i
                        ? "border-white ring-2 ring-white/20"
                        : "border-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Apple-inspired Configurator */}
          <div className="space-y-8">
            {/* Header & Condition */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {product.condition}
                </span>
                <span className="text-xs text-zinc-500 font-mono">SKU: {activeVariant ? activeVariant.sku : product.sku}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                {product.name}
              </h1>
              {product.description && (
                <p className="text-sm text-zinc-400 leading-relaxed pt-1">
                  {product.description}
                </p>
              )}
            </div>

            {/* Price Banner */}
            <div className="p-5 rounded-2xl bg-[#161617] border border-zinc-800/80 flex items-baseline justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">
                  TroyX Price (GH₵)
                </div>
                <div className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mt-0.5">
                  {formatGHS(effectivePrice)}
                </div>
              </div>
              {hasDiscount && (
                <div className="text-right">
                  <div className="text-xs text-zinc-500">Regular</div>
                  <div className="text-sm line-through text-zinc-500">
                    {formatGHS(originalPrice)}
                  </div>
                </div>
              )}
            </div>

            {/* Finish / Color Selection */}
            {availableColors.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-300">
                    Finish. <span className="font-normal text-zinc-400">Pick your favorite.</span>
                  </span>
                  <span className="text-zinc-400 font-medium">{selectedColor}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {availableColors.map((col) => {
                    const isSelected = selectedColor === col;
                    const hex = COLOR_HEX_MAP[col] || "#333333";
                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                          isSelected
                            ? "bg-zinc-900 border-white ring-1 ring-white"
                            : "bg-[#161617] border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-white/20 shrink-0 shadow-sm"
                          style={{ backgroundColor: hex }}
                        />
                        <span className="text-xs font-medium text-white truncate">{col}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Storage Selection */}
            {availableStorages.length > 0 && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-zinc-300">
                  Storage. <span className="font-normal text-zinc-400">How much space do you need?</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {availableStorages.map((storage) => {
                    const isSelected = selectedStorage === storage;
                    const matchingVariant = variants.find(
                      (v) =>
                        (!selectedColor || v.color === selectedColor) &&
                        v.storage === storage
                    );
                    const varPrice = matchingVariant
                      ? matchingVariant.discountPrice ?? matchingVariant.price
                      : null;

                    return (
                      <button
                        key={storage}
                        type="button"
                        onClick={() => setSelectedStorage(storage)}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          isSelected
                            ? "bg-zinc-900 border-white ring-1 ring-white"
                            : "bg-[#161617] border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <div className="text-sm font-semibold text-white">{storage}</div>
                        {varPrice && (
                          <div className="text-[10px] text-zinc-400 mt-1">
                            {formatGHS(varPrice)}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Device Specifications Highlights */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#161617] border border-zinc-800 flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-zinc-400 shrink-0" />
                <div>
                  <div className="text-zinc-500 text-[10px]">SIM Support</div>
                  <div className="text-white font-medium">{product.simConfig}</div>
                </div>
              </div>

              {product.batteryHealth && (
                <div className="p-3.5 rounded-xl bg-[#161617] border border-zinc-800 flex items-center gap-3">
                  <Battery className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-zinc-500 text-[10px]">Battery Health</div>
                    <div className="text-white font-medium">{product.batteryHealth}% Maximum</div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons: Add to Bag, Buy Now, WhatsApp */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Add to Bag Button */}
                <button
                  type="button"
                  onClick={handleAddToBag}
                  disabled={!isAvailable}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-medium text-sm transition-all ${
                    addedAnimation
                      ? "bg-emerald-600 text-white"
                      : isAvailable
                      ? "bg-white text-black hover:bg-zinc-200"
                      : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isAvailable ? "Add to Bag" : "Currently Unavailable"}</span>
                    </>
                  )}
                </button>

                {/* Instant Buy Now Button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!isAvailable}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-medium text-sm bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Buy Now</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Direct WhatsApp Order Button */}
              <a
                href={`https://wa.me/233207137437?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600/90 hover:bg-emerald-600 text-white font-medium py-3 rounded-full transition-colors text-xs sm:text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order via WhatsApp (0207137437)</span>
              </a>
            </div>

            {/* Authenticity & Store Guarantees */}
            <div className="border-t border-zinc-800/80 pt-6 space-y-3.5 text-xs text-zinc-400">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                <span>100% Genuine Original Apple Hardware — Authenticity guaranteed</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-white shrink-0" />
                <span>Same-day pickup in Bawaleshie, East Legon & prompt dispatch across Accra</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-4 h-4 text-white shrink-0" />
                <span>Direct showroom warranty and dedicated technical assistance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
