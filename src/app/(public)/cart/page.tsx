"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { formatGHS } from "@/lib/pricing";
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  Plus,
  Minus,
  Truck,
  Store,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { items, cartCount, subtotal, isLoaded, updateQuantity, removeItem, clearCart } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");

  const deliveryFee = deliveryMethod === "delivery" ? 50 : 0;
  const total = subtotal + deliveryFee;

  // WhatsApp order for entire bag
  const generateWhatsAppBagMessage = () => {
    let msg = `*ORDER FROM TROYX ISTORE WEBSITE (BAG)*\n\n`;
    items.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.productName}*\n`;
      if (item.storage || item.color) {
        msg += `   Config: ${[item.storage, item.color].filter(Boolean).join(" / ")}\n`;
      }
      msg += `   Qty: ${item.quantity} × ${formatGHS(item.unitPrice)} = ${formatGHS(item.unitPrice * item.quantity)}\n\n`;
    });
    msg += `*Subtotal:* ${formatGHS(subtotal)}\n`;
    msg += `*Method:* ${deliveryMethod === "pickup" ? "Showroom Pickup (East Legon)" : "Accra Delivery (+GH₵ 50)"}\n`;
    msg += `*Estimated Total:* ${formatGHS(total)}\n\n`;
    msg += `Please confirm availability for immediate processing.`;
    return encodeURIComponent(msg);
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Review your Bag.
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Free showroom pickup in Bawaleshie, East Legon or fast delivery across Accra.
          </p>
        </div>

        {!isLoaded ? (
          <div className="p-16 rounded-2xl bg-[#161617] border border-zinc-800 text-center text-xs text-zinc-500 animate-pulse">
            Loading your Bag...
          </div>
        ) : items.length === 0 ? (
          /* Clean Empty Bag State */
          <div className="p-10 sm:p-16 rounded-2xl bg-[#161617] border border-zinc-800 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-medium text-white">Your Bag is empty.</h2>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Original Apple products added to your bag will be saved here ready for checkout.
            </p>
            <div className="pt-2">
              <Link
                href="/store"
                className="inline-flex items-center gap-2 apple-btn-primary text-xs"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Items List (Left Column) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs text-zinc-400">
                <span>{cartCount} {cartCount === 1 ? "Item" : "Items"}</span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-zinc-500 hover:text-red-400 text-[11px] transition-colors"
                >
                  Clear Bag
                </button>
              </div>

              <div className="divide-y divide-zinc-800/80">
                {items.map((item, index) => (
                  <div key={`${item.productId}-${item.variantId || index}`} className="py-5 flex gap-4 sm:gap-6 items-start">
                    {/* Item Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#161617] border border-zinc-800 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain" />
                      ) : (
                        <ShoppingBag className="w-8 h-8 text-zinc-600" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-start">
                        <h2 className="text-sm sm:text-base font-semibold text-white truncate pr-2">
                          {item.productName}
                        </h2>
                        <span className="text-sm sm:text-base font-semibold text-white whitespace-nowrap">
                          {formatGHS(item.unitPrice * item.quantity)}
                        </span>
                      </div>

                      {/* Variant Specs */}
                      <div className="text-xs text-zinc-400 flex flex-wrap gap-2">
                        {item.storage && <span>{item.storage}</span>}
                        {item.color && <span>• {item.color}</span>}
                        {item.sku && <span className="font-mono text-zinc-500">• SKU: {item.sku}</span>}
                      </div>

                      <div className="text-[11px] text-zinc-500">
                        {formatGHS(item.unitPrice)} each
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="pt-3 flex items-center gap-4">
                        <div className="flex items-center border border-zinc-800 rounded-lg bg-zinc-900/60 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                            className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                            className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="text-xs text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Guarantees */}
              <div className="p-4 rounded-xl bg-[#161617] border border-zinc-800/80 space-y-2 text-xs text-zinc-400 mt-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                  <span>Certified genuine Apple devices inspected before dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-white shrink-0" />
                  <span>Showroom pickup at Bawaleshie, East Legon, Accra</span>
                </div>
              </div>
            </div>

            {/* Order Summary (Right Column) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-6">
                <h2 className="text-base font-semibold text-white border-b border-zinc-800 pb-3">
                  Order Summary
                </h2>

                {/* Fulfillment Selector */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-zinc-300">Fulfillment Method</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("pickup")}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        deliveryMethod === "pickup"
                          ? "bg-zinc-900 border-white ring-1 ring-white"
                          : "bg-black border-zinc-800 hover:border-zinc-700 text-zinc-400"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-semibold text-white">
                        <Store className="w-3.5 h-3.5" />
                        <span>Pickup</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 mt-1">East Legon (Free)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("delivery")}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        deliveryMethod === "delivery"
                          ? "bg-zinc-900 border-white ring-1 ring-white"
                          : "bg-black border-zinc-800 hover:border-zinc-700 text-zinc-400"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-semibold text-white">
                        <Truck className="w-3.5 h-3.5" />
                        <span>Delivery</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 mt-1">Accra (+GH₵ 50)</span>
                    </button>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 text-xs border-t border-zinc-800 pt-4">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">{formatGHS(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Fulfillment</span>
                    <span className="text-white font-medium">
                      {deliveryMethod === "pickup" ? "Free" : formatGHS(deliveryFee)}
                    </span>
                  </div>
                  <div className="border-t border-zinc-800 pt-3 flex justify-between text-base font-semibold text-white">
                    <span>Total</span>
                    <span className="tracking-tight">{formatGHS(total)}</span>
                  </div>
                </div>

                {/* Checkout Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => router.push(`/checkout?method=${deliveryMethod}`)}
                    className="w-full flex items-center justify-center gap-2 apple-btn-primary py-3.5 text-xs font-semibold"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={`https://wa.me/233207137437?text=${generateWhatsAppBagMessage()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600/90 hover:bg-emerald-600 text-white font-medium py-3 rounded-full text-xs transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Order Bag via WhatsApp</span>
                  </a>
                </div>

                <div className="text-[11px] text-zinc-500 text-center leading-relaxed">
                  Prices in Ghana Cedi (GH₵). Payment accepted upon pickup/delivery via Cash, Mobile Money, or Bank Transfer.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
