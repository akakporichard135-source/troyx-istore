/**
 * Image Service - Centralized Apple & Gaming product image management
 * Uses high-definition, verified photography URLs for all catalog items
 */

export const productCategoryFallbacks: Record<string, string> = {
  iPhone: "/assets/product-device-blue.svg",
  MacBook: "/assets/product-laptop-dark.svg",
  iPad: "/assets/product-tablet-dark.svg",
  "Apple Watch": "/assets/product-watch-dark.svg",
  AirPods: "/assets/product-audio.svg",
  "Apple TV": "/assets/product-accessory-blue.svg",
  HomePod: "/assets/product-audio.svg",
  Accessories: "/assets/product-accessory-blue.svg",
  Cases: "/assets/product-accessory.svg",
  Chargers: "/assets/product-accessory-blue.svg",
  Gaming: "/assets/product-device-dark.svg",
  PlayStation: "/assets/product-device-dark.svg",
  Xbox: "/assets/product-device-dark.svg",
  Nintendo: "/assets/product-device-blue.svg"
};

// Curated high-res Apple & Gaming product photography
export const productImages: Record<string, string[]> = {
  // iPhone Series
  "iphone-16-pro-max": [
    "https://images.unsplash.com/photo-1592286927505-1fed6c6d6b97?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=1000&auto=format&fit=crop&q=80"
  ],
  "iphone-16-pro": [
    "https://images.unsplash.com/photo-1592286927505-1fed6c6d6b97?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=1000&auto=format&fit=crop&q=80"
  ],
  "iphone-16-plus": [
    "https://images.unsplash.com/photo-1592286927505-1fed6c6d6b97?w=1000&auto=format&fit=crop&q=80"
  ],
  "iphone-16": [
    "https://images.unsplash.com/photo-1592286927505-1fed6c6d6b97?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=1000&auto=format&fit=crop&q=80"
  ],
  "iphone-15-pro-max": [
    "https://images.unsplash.com/photo-1592286927505-1fed6c6d6b97?w=1000&auto=format&fit=crop&q=80"
  ],
  "iphone-15-pro": [
    "https://images.unsplash.com/photo-1592286927505-1fed6c6d6b97?w=1000&auto=format&fit=crop&q=80"
  ],
  "iphone-15-plus": [
    "https://images.unsplash.com/photo-1592286927505-1fed6c6d6b97?w=1000&auto=format&fit=crop&q=80"
  ],
  "iphone-15": [
    "https://images.unsplash.com/photo-1592286927505-1fed6c6d6b97?w=1000&auto=format&fit=crop&q=80"
  ],
  "iphone-14-plus": [
    "https://images.unsplash.com/photo-1592286927505-1fed6c6d6b97?w=1000&auto=format&fit=crop&q=80"
  ],
  "iphone-14": [
    "https://images.unsplash.com/photo-1592286927505-1fed6c6d6b97?w=1000&auto=format&fit=crop&q=80"
  ],
  "iphone-13": [
    "https://images.unsplash.com/photo-1592286927505-1fed6c6d6b97?w=1000&auto=format&fit=crop&q=80"
  ],
  "iphone-se": [
    "https://images.unsplash.com/photo-1592286927505-1fed6c6d6b97?w=1000&auto=format&fit=crop&q=80"
  ],

  // Mac Series
  "macbook-air-13": [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1000&auto=format&fit=crop&q=80"
  ],
  "macbook-air-15": [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80"
  ],
  "macbook-pro-14": [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80"
  ],
  "macbook-pro-16": [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80"
  ],
  "imac-24": [
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1000&auto=format&fit=crop&q=80"
  ],
  "mac-mini": [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80"
  ],
  "mac-studio": [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80"
  ],
  "studio-display": [
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1000&auto=format&fit=crop&q=80"
  ],

  // iPad Series
  "ipad-pro-13-m4": [
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1000&auto=format&fit=crop&q=80"
  ],
  "ipad-pro-11-m4": [
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1000&auto=format&fit=crop&q=80"
  ],
  "ipad-air-11": [
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1000&auto=format&fit=crop&q=80"
  ],
  "ipad-11th-gen": [
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1000&auto=format&fit=crop&q=80"
  ],
  "ipad-mini": [
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1000&auto=format&fit=crop&q=80"
  ],

  // Apple Watch Series
  "apple-watch-ultra-2": [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80"
  ],
  "apple-watch-series-10": [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80"
  ],
  "apple-watch-se": [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80"
  ],

  // AirPods & Audio
  "airpods-4": [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80"
  ],
  "airpods-4-anc": [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80"
  ],
  "airpods-pro-2": [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80"
  ],
  "airpods-max": [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80"
  ],

  // Accessories
  "apple-pencil-pro": [
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1000&auto=format&fit=crop&q=80"
  ],
  "apple-pencil-usbc": [
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1000&auto=format&fit=crop&q=80"
  ],
  "magic-keyboard": [
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1000&auto=format&fit=crop&q=80"
  ],
  "magic-mouse": [
    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=1000&auto=format&fit=crop&q=80"
  ],
  "magsafe-charger": [
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1000&auto=format&fit=crop&q=80"
  ],
  "usbc-charger-35w": [
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1000&auto=format&fit=crop&q=80"
  ],
  "usbc-cable-2m": [
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1000&auto=format&fit=crop&q=80"
  ],
  "airtag-4pack": [
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1000&auto=format&fit=crop&q=80"
  ],
  "magsafe-power-bank": [
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1000&auto=format&fit=crop&q=80"
  ],
  "finewoven-case": [
    "https://images.unsplash.com/photo-1592286927505-1fed6c6d6b97?w=1000&auto=format&fit=crop&q=80"
  ],

  // Gaming
  "ps5-pro": [
    "https://images.unsplash.com/photo-1605296240971-a5a60fc8eff0?w=1000&auto=format&fit=crop&q=80"
  ],
  "ps5-slim": [
    "https://images.unsplash.com/photo-1605296240971-a5a60fc8eff0?w=1000&auto=format&fit=crop&q=80"
  ],
  "ps5": [
    "https://images.unsplash.com/photo-1605296240971-a5a60fc8eff0?w=1000&auto=format&fit=crop&q=80"
  ],
  "xbox-series-x": [
    "https://images.unsplash.com/photo-1602491453631-e2a5ad90e131?w=1000&auto=format&fit=crop&q=80"
  ],
  "xbox-series-s": [
    "https://images.unsplash.com/photo-1602491453631-e2a5ad90e131?w=1000&auto=format&fit=crop&q=80"
  ],
  "nintendo-switch-oled": [
    "https://images.unsplash.com/photo-1578496479863-826925d2f627?w=1000&auto=format&fit=crop&q=80"
  ],
  "nintendo-switch-lite": [
    "https://images.unsplash.com/photo-1578496479863-826925d2f627?w=1000&auto=format&fit=crop&q=80"
  ],
  "dualsense-edge-controller": [
    "https://images.unsplash.com/photo-1608889584312-59ef5e27b9c8?w=1000&auto=format&fit=crop&q=80"
  ],
  "pulse-elite-headset": [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80"
  ]
};

/**
 * Get product images with guaranteed fallback
 */
export function getProductImages(productId: string, category?: string): string[] {
  const images = productImages[productId as keyof typeof productImages];
  const categoryFallback = category ? productCategoryFallbacks[category] : "/assets/product-device-blue.svg";

  if (images && images.length > 0) {
    return [...images, categoryFallback];
  }

  return ["/assets/product-device-blue.svg", "/assets/product-laptop-dark.svg"];
}

/**
 * Get featured product images for homepage
 */
export function getFeaturedImage(productId: string, category?: string): string {
  const images = getProductImages(productId, category);
  return images[0];
}

/**
 * Banner images for sections
 */
export const bannerImages = {
  iphones: "/assets/product-device-blue.svg",
  macbooks: "/assets/product-laptop-dark.svg",
  ipads: "/assets/product-tablet-dark.svg",
  watches: "/assets/product-watch-dark.svg",
  airpods: "/assets/product-audio.svg",
  gaming: "/assets/product-device-dark.svg",
  accessories: "/assets/product-accessory-blue.svg"
};
