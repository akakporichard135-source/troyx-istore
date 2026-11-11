// TroyX iStore - Pricing Engine & Ghana Cedi (GH₵) Utilities
// Server-validated pricing, currency formatting, and safe bulk pricing tools

import { CartItem, ProductRecord, PromotionRecord } from "./types";

export const CURRENCY_SYMBOL = "GH₵";

/**
 * Formats a number to Ghana Cedi currency string (e.g. "GH₵ 12,499.00" or "GH₵ 12,499")
 */
export function formatGHS(amount: number, showDecimals = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${CURRENCY_SYMBOL} 0`;
  }
  const formatted = new Intl.NumberFormat("en-GH", {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${CURRENCY_SYMBOL} ${formatted}`;
}

/**
 * Server-side Order Calculation & Validation
 * Verifies each item's price against actual database products/variants
 * Prevents client-side cart tampering
 */
export interface ValidatedOrderCalculation {
  isValid: boolean;
  errors: string[];
  validatedItems: CartItem[];
  subtotal: number;
  discountTotal: number;
  deliveryFee: number;
  totalAmount: number;
  appliedPromotion?: PromotionRecord | null;
}

export function calculateAndValidateOrder(
  submittedItems: CartItem[],
  dbProducts: ProductRecord[],
  promotion?: PromotionRecord | null,
  deliveryMethod: "pickup" | "delivery" = "pickup",
  deliveryCity?: string
): ValidatedOrderCalculation {
  const errors: string[] = [];
  const validatedItems: CartItem[] = [];
  let subtotal = 0;

  if (!submittedItems || submittedItems.length === 0) {
    return {
      isValid: false,
      errors: ["Cart is empty"],
      validatedItems: [],
      subtotal: 0,
      discountTotal: 0,
      deliveryFee: 0,
      totalAmount: 0,
    };
  }

  for (const item of submittedItems) {
    const product = dbProducts.find((p) => p.id === item.productId);
    if (!product) {
      errors.push(`Product '${item.productName || item.productId}' is no longer available.`);
      continue;
    }

    if (!product.isPublished) {
      errors.push(`Product '${product.name}' is currently unpublished.`);
      continue;
    }

    // Determine correct unit price from DB
    let authoritativeUnitPrice = product.basePrice;
    let authoritativeTitle = product.name;
    let authoritativeSku = product.sku;

    // Check variant if specified
    if (item.variantId && product.variants && product.variants.length > 0) {
      const variant = product.variants.find((v) => v.id === item.variantId);
      if (variant) {
        authoritativeUnitPrice = variant.discountPrice ?? variant.price;
        authoritativeTitle = `${product.name} - ${variant.title}`;
        authoritativeSku = variant.sku;
      }
    } else if (product.discountPrice && product.discountPrice > 0) {
      authoritativeUnitPrice = product.discountPrice;
    }

    // Check stock
    const qty = Math.max(1, Math.floor(item.quantity));
    if (product.stockQuantity < qty) {
      errors.push(`Insufficient stock for '${product.name}' (available: ${product.stockQuantity}).`);
    }

    const itemTotal = authoritativeUnitPrice * qty;
    subtotal += itemTotal;

    validatedItems.push({
      productId: product.id,
      variantId: item.variantId,
      productName: authoritativeTitle,
      variantTitle: item.variantTitle,
      sku: authoritativeSku,
      unitPrice: authoritativeUnitPrice,
      quantity: qty,
      imageUrl: item.imageUrl || (product.images.length > 0 ? product.images[0] : undefined),
      category: product.category,
      color: item.color,
      storage: item.storage,
    });
  }

  // Calculate promotion discount if valid
  let discountTotal = 0;
  if (promotion && promotion.isActive) {
    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);

    if (now >= start && now <= end) {
      if (promotion.discountType === "percentage") {
        discountTotal = Math.round((subtotal * promotion.discountValue) / 100);
      } else {
        discountTotal = Math.min(subtotal, promotion.discountValue);
      }
    }
  }

  // Delivery fee calculation
  let deliveryFee = 0;
  if (deliveryMethod === "delivery") {
    // Standard Accra delivery: GH₵ 50, Regional/Outside Accra: GH₵ 100
    if (deliveryCity && deliveryCity.toLowerCase().includes("accra")) {
      deliveryFee = 50;
    } else {
      deliveryFee = 80;
    }
  }

  const totalAmount = Math.max(0, subtotal - discountTotal + deliveryFee);

  return {
    isValid: errors.length === 0,
    errors,
    validatedItems,
    subtotal,
    discountTotal,
    deliveryFee,
    totalAmount,
    appliedPromotion: discountTotal > 0 ? promotion : null,
  };
}

/**
 * Format order details for instant WhatsApp order transmission to TroyX
 */
export function generateWhatsAppOrderMessage(
  orderNumber: string,
  customerName: string,
  items: CartItem[],
  totalAmount: number,
  deliveryMethod: string,
  deliveryAddress?: string
): string {
  const storeLocation = "TroyX iStore, Bawaleshie, East Legon, Accra";
  let msg = `*NEW ORDER PURCHASE REQUEST — TroyX iStore*\n`;
  msg += `*Order #:* ${orderNumber}\n`;
  msg += `*Customer:* ${customerName}\n`;
  msg += `*Method:* ${deliveryMethod === "pickup" ? `In-Store Pickup (${storeLocation})` : `Delivery to: ${deliveryAddress || "Accra"}`}\n\n`;
  msg += `*Items Ordered:*\n`;

  items.forEach((item, index) => {
    msg += `${index + 1}. *${item.productName}* x ${item.quantity} — ${formatGHS(item.unitPrice * item.quantity)}\n`;
    if (item.storage || item.color) {
      msg += `   (${[item.storage, item.color].filter(Boolean).join(" / ")})\n`;
    }
  });

  msg += `\n*TOTAL AMOUNT: ${formatGHS(totalAmount)}*\n\n`;
  msg += `Please confirm availability and pickup/dispatch timing. Thank you!`;

  return encodeURIComponent(msg);
}
