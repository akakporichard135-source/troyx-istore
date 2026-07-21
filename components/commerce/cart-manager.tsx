"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Heart, Tag, ShieldCheck, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button, LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useCommerceStore } from "@/context/store";
import { useAdminStore } from "@/context/admin-store";
import { formatCurrency } from "@/lib/utils";
import { ProductGrid } from "@/components/product/product-grid";

export function CartManager() {
  const cart = useCommerceStore((state) => state.cart);
  const updateQuantity = useCommerceStore((state) => state.updateQuantity);
  const removeFromCart = useCommerceStore((state) => state.removeFromCart);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);

  const products = useAdminStore((state) => state.products);
  const coupons = useAdminStore((state) => state.coupons);

  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);

  const enriched = cart
    .map((item) => ({ ...item, product: products.find((product) => product.id === item.productId) }))
    .filter((item) => item.product);

  const subtotal = enriched.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const vatAmount = Math.round(subtotal * 0.15);
  const shippingFee = subtotal > 1000 ? 0 : 50;
  const grandTotal = Math.max(0, subtotal + vatAmount + shippingFee - appliedDiscount);

  const handleApplyCoupon = () => {
    setCouponMsg(null);
    const found = coupons.find((c) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.active);

    if (found) {
      const discountVal = found.discountType === "percentage" ? (subtotal * found.value) / 100 : found.value;
      setAppliedDiscount(discountVal);
      setCouponMsg(`Coupon ${found.code} applied! Discount: GH₵ ${discountVal.toFixed(0)}`);
    } else if (couponCode.trim().toUpperCase() === "TROYX10") {
      const discountVal = (subtotal * 10) / 100;
      setAppliedDiscount(discountVal);
      setCouponMsg("Promo Code TROYX10 applied! (10% Off)");
    } else {
      setCouponMsg("Invalid or expired promo code.");
    }
  };

  if (!enriched.length) {
    return <EmptyState title="Your cart is empty" description="Add a device or accessory to start checkout." />;
  }

  return (
    <div className="space-y-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Cart Items List */}
        <div className="space-y-4">
          {enriched.map((item) => (
            <div
              key={`${item.productId}-${item.color}-${item.storage}`}
              className="grid gap-4 rounded-[2rem] border border-black/5 bg-white p-5 shadow-sm sm:grid-cols-[120px_1fr_auto] dark:border-white/10 dark:bg-zinc-900"
            >
              <Link href={`/product/${item.product?.slug}`} className="relative aspect-square overflow-hidden rounded-2xl bg-brand-mist dark:bg-zinc-950">
                {item.product && <Image src={item.product.images[0]} alt={item.product.name} fill sizes="120px" className="object-contain p-4" />}
              </Link>
              
              <div className="space-y-1">
                <h2 className="text-base font-bold text-brand-ink dark:text-white">{item.product?.name}</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {item.color || "Standard"} &bull; {item.storage || "N/A"} &bull; {item.condition || "New"}
                </p>
                <p className="text-xs font-semibold text-emerald-500">
                  Sold by: {item.product?.vendorName || "TroyX Flagship"}
                </p>
                <p className="text-base font-extrabold text-brand-ink dark:text-white pt-2">
                  {formatCurrency(item.product?.price || 0)}
                </p>
              </div>

              <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:justify-between">
                {/* Quantity Controls */}
                <div className="flex items-center rounded-full border border-black/10 bg-zinc-50 dark:border-white/10 dark:bg-zinc-800">
                  <button type="button" aria-label="Decrease quantity" className="h-9 w-9 flex items-center justify-center text-zinc-600 dark:text-zinc-300" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-brand-ink dark:text-white">{item.quantity}</span>
                  <button type="button" aria-label="Increase quantity" className="h-9 w-9 flex items-center justify-center text-zinc-600 dark:text-zinc-300" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    title="Save to Wishlist"
                    onClick={() => toggleWishlist(item.productId)}
                    className="p-2 rounded-full border border-black/10 dark:border-white/10 text-zinc-400 hover:text-brand-blue"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Remove item"
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 rounded-full border border-red-500/20 text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <aside className="h-fit rounded-[2.5rem] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900 space-y-5">
          <h2 className="text-lg font-bold text-brand-ink dark:text-white">Order Summary</h2>

          <div className="space-y-2.5 text-xs">
            <SummaryRow label="Items Subtotal" value={formatCurrency(subtotal)} />
            <SummaryRow label="Estimated VAT (15%)" value={formatCurrency(vatAmount)} />
            <SummaryRow label="Nationwide Shipping" value={shippingFee === 0 ? "FREE" : formatCurrency(shippingFee)} />
            
            {appliedDiscount > 0 && (
              <SummaryRow label="Promo Discount" value={`- ${formatCurrency(appliedDiscount)}`} green />
            )}

            <div className="border-t border-black/10 dark:border-white/10 pt-3 mt-3">
              <SummaryRow label="Estimated Total" value={formatCurrency(grandTotal)} strong />
            </div>
          </div>

          {/* Coupon Code Input */}
          <div className="space-y-2 pt-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Coupon / Promo Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="h-10 flex-1 rounded-xl border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 px-3 text-xs uppercase font-bold text-brand-ink dark:text-white focus:border-brand-blue focus:outline-none"
              />
              <Button type="button" onClick={handleApplyCoupon} className="h-10 px-4 text-xs font-bold bg-brand-blue text-white">
                Apply
              </Button>
            </div>

            {couponMsg && (
              <p className={`text-[11px] font-semibold ${appliedDiscount > 0 ? "text-emerald-500" : "text-red-400"}`}>
                {couponMsg}
              </p>
            )}
          </div>

          <LinkButton href="/checkout" className="w-full h-11 text-xs font-bold bg-brand-blue hover:bg-brand-blue/90 text-white">
            Proceed to Checkout
            <ArrowRight className="ml-2 h-4 w-4" />
          </LinkButton>
          
          <LinkButton href="/shop" variant="secondary" className="w-full h-11 text-xs font-semibold">
            Continue Shopping
          </LinkButton>
        </aside>
      </div>

      {/* Recommended Products */}
      <div className="space-y-4 pt-8 border-t border-black/5 dark:border-white/10">
        <h2 className="text-xl font-bold text-brand-ink dark:text-white">Recommended Add-Ons</h2>
        <ProductGrid products={products.slice(0, 4)} />
      </div>
    </div>
  );
}

function SummaryRow({ label, value, strong = false, green = false }: { label: string; value: string; strong?: boolean; green?: boolean }) {
  return (
    <div className={`flex justify-between ${
      strong 
        ? "text-base font-extrabold text-brand-ink dark:text-white" 
        : green 
        ? "font-bold text-emerald-500" 
        : "text-zinc-600 dark:text-zinc-300 font-medium"
    }`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
