"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { formatGHS } from "@/lib/pricing";
import { CartItem } from "@/lib/types";
import {
  ShieldCheck,
  Truck,
  Store,
  MessageCircle,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Lock,
  ShoppingBag,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMethod = searchParams.get("method") === "delivery" ? "delivery" : "pickup";
  const productId = searchParams.get("productId");

  const { items: cartItems, isLoaded, clearCart } = useCart();
  const [directProductItem, setDirectProductItem] = useState<CartItem | null>(null);
  const [loadingDirectProduct, setLoadingDirectProduct] = useState(Boolean(productId));

  // If a direct productId was provided in query string
  useEffect(() => {
    if (productId) {
      fetch(`/api/public/products?id=${productId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.product) {
            const p = data.product;
            setDirectProductItem({
              productId: p.id,
              productName: p.name,
              sku: p.sku,
              unitPrice: p.discountPrice ?? p.basePrice,
              quantity: 1,
              imageUrl: p.images?.[0],
              category: p.category,
            });
          }
        })
        .catch(console.error)
        .finally(() => setLoadingDirectProduct(false));
    }
  }, [productId]);

  // Determine items to checkout: cart items take priority, fallback to direct product
  const checkoutItems: CartItem[] = cartItems.length > 0
    ? cartItems
    : directProductItem
    ? [directProductItem]
    : [];

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">(initialMethod);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Accra");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("paid_on_delivery");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Totals
  const subtotal = checkoutItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const deliveryFee = deliveryMethod === "delivery" ? 50 : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please provide your full name.");
      return;
    }

    if (!phone.trim()) {
      setError("Please provide a valid contact phone number.");
      return;
    }

    if (deliveryMethod === "delivery" && !address.trim()) {
      setError("Please provide your delivery address or landmark in Accra.");
      return;
    }

    if (checkoutItems.length === 0) {
      setError("Your bag is empty. Please add items before checking out.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/public/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          customerEmail: email.trim() || `${phone.replace(/\D/g, "") || "customer"}@troyxistore.com`,
          customerPhone: phone.trim(),
          deliveryMethod,
          deliveryAddress: deliveryMethod === "delivery" ? address.trim() : "TroyX Showroom, Bawaleshie, East Legon",
          deliveryCity: city,
          deliveryNotes: notes.trim(),
          paymentStatus: paymentMethod,
          items: checkoutItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName,
            variantTitle: item.variantTitle,
            sku: item.sku,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            category: item.category,
            color: item.color,
            storage: item.storage,
          })),
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Order validation failed.");
      }

      // Order created successfully! Clear the cart and redirect
      clearCart();
      router.push(`/order-confirmation/${result.order.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to process order. Please try again.");
      setSubmitting(false);
    }
  };

  if (!isLoaded || loadingDirectProduct) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xs text-zinc-500 animate-pulse">Initializing Checkout...</div>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6">
        <div className="max-w-md mx-auto p-8 rounded-2xl bg-[#161617] border border-zinc-800 text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto" />
          <h1 className="text-xl font-semibold text-white">No items to check out</h1>
          <p className="text-xs text-zinc-400">
            Please add an original Apple device to your bag before proceeding to checkout.
          </p>
          <div className="pt-2">
            <Link href="/store" className="apple-btn-primary text-xs inline-block">
              Browse Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back Link & Header */}
        <div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Bag</span>
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Checkout</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Certified Apple hardware. Inspect before payment upon pickup or delivery.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Customer & Fulfillment Form (Left Column) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Contact Information */}
            <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
                <span>1. Contact Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-zinc-300 font-medium">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kwame Mensah"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-medium">Phone Number (Ghana) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0207137437 or 0548974717"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-medium">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Fulfillment Selection */}
            <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
                <span>2. Fulfillment Option</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("pickup")}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    deliveryMethod === "pickup"
                      ? "bg-zinc-900 border-white ring-1 ring-white"
                      : "bg-black border-zinc-800 hover:border-zinc-700 text-zinc-400"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <Store className="w-4 h-4" />
                    <span>In-Store Pickup (Free)</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                    TroyX iStore showroom at Bawaleshie, East Legon, Accra.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod("delivery")}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    deliveryMethod === "delivery"
                      ? "bg-zinc-900 border-white ring-1 ring-white"
                      : "bg-black border-zinc-800 hover:border-zinc-700 text-zinc-400"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <Truck className="w-4 h-4" />
                    <span>Accra Delivery (+GH₵ 50)</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                    Prompt dispatch directly to your home or office address in Accra.
                  </p>
                </button>
              </div>

              {deliveryMethod === "delivery" && (
                <div className="space-y-4 pt-2 border-t border-zinc-800 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-zinc-300 font-medium">Delivery Address / Landmark *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Near American House, East Legon or Osu Oxford St."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-zinc-300 font-medium">City / Area</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-white transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-300 font-medium">Special Delivery Notes</label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Call before arrival"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
                <span>3. Payment Terms</span>
              </h2>

              <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-white font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pay upon Inspection (Showroom or Delivery)</span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  To ensure complete customer satisfaction and confidence in original Apple hardware,
                  inspect your device first. Payment is accepted via Cash, Ghana Mobile Money (MTN / Telecel / AT), or Bank Transfer.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary & Submit (Right Column) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-6">
              <h2 className="text-sm font-semibold text-white border-b border-zinc-800 pb-3">
                Items in Order ({checkoutItems.length})
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {checkoutItems.map((item, index) => (
                  <div key={index} className="flex gap-3 items-center text-xs">
                    <div className="w-12 h-12 rounded-lg bg-black border border-zinc-800 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-zinc-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white truncate">{item.productName}</div>
                      <div className="text-[11px] text-zinc-400">
                        Qty: {item.quantity}
                        {item.storage && ` • ${item.storage}`}
                        {item.color && ` • ${item.color}`}
                      </div>
                    </div>
                    <div className="font-semibold text-white whitespace-nowrap">
                      {formatGHS(item.unitPrice * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="border-t border-zinc-800 pt-4 space-y-2 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">{formatGHS(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fulfillment Fee</span>
                  <span className="text-white font-medium">
                    {deliveryMethod === "pickup" ? "Free" : formatGHS(deliveryFee)}
                  </span>
                </div>
                <div className="border-t border-zinc-800 pt-3 flex justify-between text-base font-semibold text-white">
                  <span>Total Amount</span>
                  <span className="tracking-tight">{formatGHS(total)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full apple-btn-primary py-3.5 text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{submitting ? "Placing Order..." : "Place Order & Reserve"}</span>
              </button>

              <div className="text-[11px] text-zinc-500 text-center leading-relaxed">
                TroyX iStore • Bawaleshie, East Legon, Accra. Hotline: 0207137437 / 0548974717.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
