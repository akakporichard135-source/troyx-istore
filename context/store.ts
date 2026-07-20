"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { CartItem } from "@/types";

type StoreState = {
  cart: CartItem[];
  wishlist: string[];
  compare: string[];
  recentlyViewed: string[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  toggleCompare: (productId: string) => void;
  addRecentlyViewed: (productId: string) => void;
};

type StoreData = Pick<StoreState, "cart" | "wishlist" | "compare" | "recentlyViewed">;

const storageKey = "troyx-commerce";
const listeners = new Set<() => void>();
let data: StoreData = {
  cart: [],
  wishlist: [],
  compare: [],
  recentlyViewed: []
};

function loadData() {
  if (typeof window === "undefined") return;
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) data = { ...data, ...JSON.parse(stored) };
  } catch {
    data = { cart: [], wishlist: [], compare: [], recentlyViewed: [] };
  }
}

function writeData(next: StoreData) {
  data = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey, JSON.stringify(data));
  }
  listeners.forEach((listener) => listener());
}

function updateData(updater: (state: StoreData) => StoreData) {
  writeData(updater(data));
}

const actions = {
  addToCart: (item: CartItem) =>
    updateData((state) => {
      const existing = state.cart.find(
        (cartItem) =>
          cartItem.productId === item.productId &&
          cartItem.color === item.color &&
          cartItem.storage === item.storage &&
          cartItem.condition === item.condition
      );
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((cartItem) =>
            cartItem === existing ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem
          )
        };
      }
      return { ...state, cart: [...state.cart, item] };
    }),
  updateQuantity: (productId: string, quantity: number) =>
    updateData((state) => ({
      ...state,
      cart: state.cart.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    })),
  removeFromCart: (productId: string) =>
    updateData((state) => ({ ...state, cart: state.cart.filter((item) => item.productId !== productId) })),
  clearCart: () => updateData((state) => ({ ...state, cart: [] })),
  toggleWishlist: (productId: string) =>
    updateData((state) => ({
      ...state,
      wishlist: state.wishlist.includes(productId)
        ? state.wishlist.filter((id) => id !== productId)
        : [...state.wishlist, productId]
    })),
  toggleCompare: (productId: string) =>
    updateData((state) => ({
      ...state,
      compare: state.compare.includes(productId)
        ? state.compare.filter((id) => id !== productId)
        : [...state.compare.slice(-2), productId]
    })),
  addRecentlyViewed: (productId: string) =>
    updateData((state) => ({
      ...state,
      recentlyViewed: [productId, ...state.recentlyViewed.filter((id) => id !== productId)].slice(0, 8)
    }))
};

function getSnapshot(): StoreState {
  return { ...data, ...actions };
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCommerceStore<T>(selector: (state: StoreState) => T): T {
  useEffect(() => {
    loadData();
    listeners.forEach((listener) => listener());
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => selector(getSnapshot()),
    () => selector(getSnapshot())
  );
}

export function useCartTotals() {
  const cart = useCommerceStore((state) => state.cart);
  const subtotal = cart.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);
  return { itemCount: subtotal };
}
