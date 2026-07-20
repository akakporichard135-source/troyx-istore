"use client";

import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { useCommerceStore } from "@/context/store";

export function CheckoutForm() {
  const cart = useCommerceStore((state) => state.cart);
  const clearCart = useCommerceStore((state) => state.clearCart);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
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
        fulfillment: form.get("fulfillment"),
        paymentProvider: form.get("paymentProvider"),
        items: cart
      })
    });
    clearCart();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-[2rem] bg-emerald-50 p-8 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200">
        <CheckCircle2 className="h-10 w-10" />
        <h2 className="mt-4 text-2xl font-semibold">Order request received</h2>
        <p className="mt-2 text-sm leading-6">A payment adapter can now confirm payment and create the final order record.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Email"><Input name="email" type="email" required /></Field>
        <Field label="Full name"><Input name="fullName" required /></Field>
        <Field label="Phone"><Input name="phone" required /></Field>
        <Field label="Country"><Input name="country" defaultValue="Ghana" required /></Field>
      </div>
      <Field label="Shipping address"><Input name="address" required /></Field>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="City"><Input name="city" required /></Field>
        <Field label="Fulfillment"><Select name="fulfillment" defaultValue="delivery"><option value="delivery">Delivery</option><option value="pickup">Pickup</option></Select></Field>
        <Field label="Payment"><Select name="paymentProvider" defaultValue="card"><option value="card">Card</option><option value="mobile_money">Mobile money</option><option value="bank_transfer">Bank transfer</option><option value="cash_on_pickup">Cash on pickup</option></Select></Field>
      </div>
      <div className="rounded-2xl bg-brand-mist p-4 text-sm text-zinc-600 dark:bg-white/5 dark:text-zinc-300">
        Guest and registered checkout are supported. Payment is abstracted so Stripe, Paystack, Flutterwave, mobile money, bank transfer, and other gateways can be added cleanly.
      </div>
      <Button type="submit" className="h-12">Place order</Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-brand-ink dark:text-white">
      {label}
      {children}
    </label>
  );
}
