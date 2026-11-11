"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CartItem } from "@/lib/types";

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  isLoaded: boolean;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
}

const CART_STORAGE_KEY = "troyx_cart_items";
const CART_EVENT_NAME = "troyx_cart_sync";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Listen for sync events across tabs or components
  useEffect(() => {
    const handleSync = (e: Event) => {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          setItems(JSON.parse(stored));
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("Cart sync error", err);
      }
    };

    window.addEventListener(CART_EVENT_NAME, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(CART_EVENT_NAME, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  // Save to localStorage helper
  const persistItems = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      window.dispatchEvent(new Event(CART_EVENT_NAME));
    } catch (e) {
      console.error("Failed to persist cart to localStorage", e);
    }
  }, []);

  // Add Item
  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const qtyToAdd = item.quantity && item.quantity > 0 ? item.quantity : 1;
      setItems((prev) => {
        const existingIndex = prev.findIndex(
          (i) => i.productId === item.productId && (i.variantId || "") === (item.variantId || "")
        );

        let updated: CartItem[];
        if (existingIndex > -1) {
          updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + qtyToAdd,
          };
        } else {
          updated = [
            ...prev,
            {
              productId: item.productId,
              variantId: item.variantId,
              productName: item.productName,
              variantTitle: item.variantTitle,
              sku: item.sku,
              unitPrice: item.unitPrice,
              quantity: qtyToAdd,
              imageUrl: item.imageUrl,
              category: item.category,
              color: item.color,
              storage: item.storage,
            },
          ];
        }

        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
          window.dispatchEvent(new Event(CART_EVENT_NAME));
        } catch (e) {
          console.error("Failed to persist cart", e);
        }
        return updated;
      });
    },
    []
  );

  // Remove Item
  const removeItem = useCallback(
    (productId: string, variantId?: string) => {
      setItems((prev) => {
        const updated = prev.filter(
          (i) => !(i.productId === productId && (i.variantId || "") === (variantId || ""))
        );
        persistItems(updated);
        return updated;
      });
    },
    [persistItems]
  );

  // Update Quantity
  const updateQuantity = useCallback(
    (productId: string, quantity: number, variantId?: string) => {
      if (quantity <= 0) {
        removeItem(productId, variantId);
        return;
      }

      setItems((prev) => {
        const updated = prev.map((i) => {
          if (i.productId === productId && (i.variantId || "") === (variantId || "")) {
            return { ...i, quantity: Math.floor(quantity) };
          }
          return i;
        });
        persistItems(updated);
        return updated;
      });
    },
    [removeItem, persistItems]
  );

  // Clear Cart
  const clearCart = useCallback(() => {
    persistItems([]);
  }, [persistItems]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        isLoaded,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
