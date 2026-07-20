"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useCommerceStore } from "@/context/store";
import { products } from "@/database/products";
import { formatCurrency } from "@/lib/utils";

export function CartManager() {
  const cart = useCommerceStore((state) => state.cart);
  const updateQuantity = useCommerceStore((state) => state.updateQuantity);
  const removeFromCart = useCommerceStore((state) => state.removeFromCart);

  const enriched = cart
    .map((item) => ({ ...item, product: products.find((product) => product.id === item.productId) }))
    .filter((item) => item.product);
  const subtotal = enriched.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal + shipping;

  if (!enriched.length) {
    return <EmptyState title="Your cart is empty" description="Add a device or accessory to start checkout." />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        {enriched.map((item) => (
          <div key={`${item.productId}-${item.color}-${item.storage}`} className="grid gap-4 rounded-[2rem] border border-black/5 bg-white p-4 shadow-sm sm:grid-cols-[120px_1fr_auto] dark:border-white/10 dark:bg-white/5">
            <Link href={`/product/${item.product?.slug}`} className="relative aspect-square overflow-hidden rounded-3xl bg-brand-mist dark:bg-white/5">
              {item.product && <Image src={item.product.images[0]} alt={item.product.name} fill sizes="120px" className="object-contain p-4" />}
            </Link>
            <div>
              <h2 className="text-lg font-semibold text-brand-ink dark:text-white">{item.product?.name}</h2>
              <p className="mt-1 text-sm text-zinc-500">
                {item.color} / {item.storage} / {item.condition}
              </p>
              <p className="mt-3 font-semibold text-brand-ink dark:text-white">{formatCurrency(item.product?.price || 0)}</p>
            </div>
            <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:justify-between">
              <div className="flex items-center rounded-full border border-black/10 bg-white dark:border-white/10 dark:bg-white/10">
                <button type="button" aria-label="Decrease quantity" className="h-10 w-10" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                  <Minus className="mx-auto h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                <button type="button" aria-label="Increase quantity" className="h-10 w-10" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                  <Plus className="mx-auto h-4 w-4" />
                </button>
              </div>
              <button type="button" className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-400/10" aria-label="Remove item" onClick={() => removeFromCart(item.productId)}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <aside className="h-fit rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <h2 className="text-xl font-semibold text-brand-ink dark:text-white">Order summary</h2>
        <div className="mt-5 space-y-3 text-sm">
          <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
          <SummaryRow label="Estimated shipping" value={shipping === 0 ? "Free" : formatCurrency(shipping)} />
          <SummaryRow label="Coupon" value="Apply at checkout" />
          <div className="border-t border-black/10 pt-3 dark:border-white/10">
            <SummaryRow label="Total" value={formatCurrency(total)} strong />
          </div>
        </div>
        <input className="focus-ring mt-6 h-11 w-full rounded-full border border-black/10 px-4 text-sm dark:border-white/10 dark:bg-white/10" placeholder="Coupon code" />
        <LinkButton href="/checkout" className="mt-4 w-full">Checkout</LinkButton>
        <LinkButton href="/shop" variant="secondary" className="mt-3 w-full">Continue shopping</LinkButton>
      </aside>
    </div>
  );
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={strong ? "flex justify-between text-lg font-semibold text-brand-ink dark:text-white" : "flex justify-between text-zinc-600 dark:text-zinc-300"}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
