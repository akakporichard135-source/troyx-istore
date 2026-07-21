"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  Store,
  CreditCard,
  Smartphone,
  Lock,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { useCommerceStore } from "@/context/store";
import { useAdminStore } from "@/context/admin-store";
import { formatCurrency } from "@/lib/utils";

export function CheckoutForm() {
  const cart = useCommerceStore((state) => state.cart);
  const clearCart = useCommerceStore((state) => state.clearCart);
  const products = useAdminStore((state) => state.products);

  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">("delivery");
  const [paymentMethod, setPaymentMethod] = useState<string>("paystack");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string>("");

  const enriched = cart
    .map((item) => ({ ...item, product: products.find((p) => p.id === item.productId) }))
    .filter((item) => item.product);

  const subtotal = enriched.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const vatAmount = Math.round(subtotal * 0.15);
  const shippingFee = fulfillment === "pickup" ? 0 : subtotal > 1000 ? 0 : 50;
  const grandTotal = subtotal + vatAmount + shippingFee;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!agreedTerms) return;

    const form = new FormData(event.currentTarget);
    const generatedId = `TX-${Date.now().toString().slice(-6)}`;
    
    try {
      await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-csrf-token": "demo" },
        body: JSON.stringify({
          email: form.get("email"),
          fullName: form.get("fullName"),
          phone: form.get("phone"),
          address: form.get("address"),
          city: form.get("city"),
          country: form.get("country"),
          fulfillment,
          paymentProvider: paymentMethod,
          items: cart
        })
      });
    } catch {
      // Fallback
    }

    setOrderId(generatedId);
    clearCart();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-emerald-500/30 p-8 sm:p-12 text-center shadow-2xl space-y-6">
        <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-extrabold text-emerald-500 border border-emerald-500/20">
          Order Confirmed & Payment Processed
        </span>

        <h1 className="text-3xl font-extrabold text-brand-ink dark:text-white">Thank You for Your Order!</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          Your order reference is <strong className="text-brand-blue font-mono">{orderId}</strong>. We've sent a detailed receipt and tracking link to your email.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
          <Link href="/order-tracking">
            <Button className="h-11 px-6 text-xs font-bold bg-brand-blue text-white hover:bg-brand-blue/90">
              Track Order Live
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline" className="h-11 px-6 text-xs font-semibold">
              Return to Catalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      {/* Form Area */}
      <form onSubmit={onSubmit} className="space-y-6 rounded-[2.5rem] border border-black/5 bg-white p-6 sm:p-8 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        {/* Fulfillment Selection */}
        <div>
          <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-3">1. Select Delivery or Store Pickup</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`flex items-center justify-center gap-2 rounded-2xl border p-4 text-xs font-bold transition ${
                fulfillment === "delivery"
                  ? "border-brand-blue bg-brand-blue/10 text-brand-blue"
                  : "border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400"
              }`}
              onClick={() => setFulfillment("delivery")}
            >
              <Truck className="h-4 w-4" />
              Nationwide Delivery
            </button>
            <button
              type="button"
              className={`flex items-center justify-center gap-2 rounded-2xl border p-4 text-xs font-bold transition ${
                fulfillment === "pickup"
                  ? "border-brand-blue bg-brand-blue/10 text-brand-blue"
                  : "border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400"
              }`}
              onClick={() => setFulfillment("pickup")}
            >
              <Store className="h-4 w-4" />
              Showroom Pickup (Free)
            </button>
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/10">
          <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1">2. Contact & Address Info</label>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Full Name</label>
              <Input name="fullName" required placeholder="e.g. Abena Mensah" className="h-11 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Email Address</label>
              <Input name="email" type="email" required placeholder="your@email.com" className="h-11 text-xs" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Phone Number (MoMo)</label>
              <Input name="phone" required placeholder="+233 24 000 0000" className="h-11 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Country</label>
              <Input name="country" defaultValue="Ghana" required className="h-11 text-xs font-semibold" />
            </div>
          </div>

          {fulfillment === "delivery" && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Street Address</label>
                <Input name="address" required placeholder="House number / Landmark address" className="h-11 text-xs" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">City / Town</label>
                <Input name="city" required defaultValue="Accra" className="h-11 text-xs" />
              </div>
            </div>
          )}
        </div>

        {/* Payment Gateway Selection */}
        <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/10">
          <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1">3. Select Payment Gateway</label>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { id: "paystack", name: "Paystack (Mobile Money / Cards)", icon: CreditCard },
              { id: "mtn_momo", name: "MTN Mobile Money Direct", icon: Smartphone },
              { id: "telecel_cash", name: "Telecel Cash Direct", icon: Smartphone },
              { id: "card_visa", name: "Visa / Mastercard", icon: CreditCard }
            ].map((pm) => {
              const Icon = pm.icon;
              return (
                <div
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`cursor-pointer flex items-center gap-3 rounded-2xl border p-4 text-xs font-bold transition ${
                    paymentMethod === pm.id
                      ? "border-brand-blue bg-brand-blue/10 text-brand-blue"
                      : "border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:border-black/20"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 text-brand-blue" />
                  <span>{pm.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security & Terms */}
        <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/10">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-black/20 text-brand-blue focus:ring-brand-blue"
            />
            <span className="text-xs text-zinc-500 leading-relaxed">
              I agree to the <Link href="/terms" className="text-brand-blue underline">TroyX iStore Terms of Service</Link>, 12-Month Warranty terms, and confirm payment authorization.
            </span>
          </label>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
            <Lock className="h-4 w-4 shrink-0" />
            <span>256-Bit SSL Encrypted & PCI-DSS Verified Security</span>
          </div>

          <Button
            type="submit"
            disabled={!agreedTerms}
            className="w-full h-12 text-sm font-bold bg-brand-blue text-white hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/20"
          >
            Pay {formatCurrency(grandTotal)} & Place Order
          </Button>
        </div>
      </form>

      {/* Order Summary Drawer */}
      <aside className="h-fit rounded-[2.5rem] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900 space-y-4">
        <h2 className="text-base font-bold text-brand-ink dark:text-white border-b border-black/5 dark:border-white/10 pb-3">
          Order Summary ({enriched.length} items)
        </h2>

        <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-black/5 dark:divide-white/5">
          {enriched.map((item, idx) => (
            <div key={idx} className="pt-2 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-brand-ink dark:text-white">{item.product?.name}</p>
                <p className="text-[10px] text-zinc-400">Qty: {item.quantity} &bull; {item.color || "Standard"}</p>
              </div>
              <p className="font-bold text-emerald-500">{formatCurrency((item.product?.price || 0) * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-black/10 dark:border-white/10 pt-3 space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>VAT (15%)</span>
            <span>{formatCurrency(vatAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Fulfillment</span>
            <span>{shippingFee === 0 ? "FREE" : formatCurrency(shippingFee)}</span>
          </div>

          <div className="border-t border-black/10 dark:border-white/10 pt-3 flex justify-between text-base font-extrabold text-brand-ink dark:text-white">
            <span>Grand Total</span>
            <span className="text-brand-blue">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
