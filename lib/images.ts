/**
 * Image Service - Centralized Apple & Gaming product image management
 * Maps local image paths for the storefront.
 */

export const productCategoryFallbacks: Record<string, string> = {
  iPhone: "/images/iphone/iphone-17-pro-max.webp",
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
  // Audited Wikimedia Commons imports for the TroyX iPhone catalog.
  // Source and license details are stored in /public/images/iphone/sources.json.
  "iphone-11": ["/images/iphone/iphone-11.webp"],
  "iphone-11-pro": ["/images/iphone/iphone-11-pro.webp"],
  "iphone-11-pro-max": ["/images/iphone/iphone-11-pro-max.webp"],
  "iphone-12": ["/images/iphone/iphone-12.webp"],
  "iphone-12-mini": ["/images/iphone/iphone-12-mini.webp"],
  "iphone-12-pro": ["/images/iphone/iphone-12-pro.webp"],
  "iphone-12-pro-max": ["/images/iphone/iphone-12-pro-max.webp"],
  "iphone-13": ["/images/iphone/iphone-13.webp"],
  "iphone-13-mini": ["/images/iphone/iphone-13-mini.webp"],
  "iphone-13-pro": ["/images/iphone/iphone-13-pro.webp"],
  "iphone-13-pro-max": ["/images/iphone/iphone-13-pro-max.webp"],
  "iphone-14": ["/images/iphone/iphone-14.webp"],
  "iphone-14-plus": ["/images/iphone/iphone-14-plus.webp"],
  "iphone-14-pro": ["/images/iphone/iphone-14-pro.webp"],
  "iphone-14-pro-max": ["/images/iphone/iphone-14-pro-max.webp"],
  "iphone-15": ["/images/iphone/iphone-15.webp"],
  "iphone-15-plus": ["/images/iphone/iphone-15-plus.webp"],
  "iphone-15-pro": ["/images/iphone/iphone-15-pro.webp"],
  "iphone-15-pro-max": ["/images/iphone/iphone-15-pro-max.webp"],
  "iphone-16": ["/images/iphone/iphone-16.webp"],
  "iphone-16-plus": ["/images/iphone/iphone-16-plus.webp"],
  "iphone-16-pro": ["/images/iphone/iphone-16-pro.webp"],
  "iphone-16-pro-max": ["/images/iphone/iphone-16-pro-max.webp"],
  "iphone-17": ["/images/iphone/iphone-17.webp"],
  "iphone-17-air": ["/images/iphone/iphone-17-air.webp"],
  "iphone-17-pro": ["/images/iphone/iphone-17-pro.webp"],
  "iphone-17-pro-max": ["/images/iphone/iphone-17-pro-max.webp"],

  // Mac Series
  "macbook-air-13": [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80"
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
  "apple-watch-ultra-2": [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80"
  ],
  "apple-watch-series-10": [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80"
  ],
  "apple-watch-se": [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80"
  ],
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
  "apple-pencil-pro": [
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1000&auto=format&fit=crop&q=80"
  ],
  "magic-keyboard": [
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1000&auto=format&fit=crop&q=80"
  ],
  "magsafe-charger": [
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1000&auto=format&fit=crop&q=80"
  ],
  "airtag-4pack": [
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1000&auto=format&fit=crop&q=80"
  ],
  "ps5-pro": [
    "https://images.unsplash.com/photo-1605296240971-a5a60fc8eff0?w=1000&auto=format&fit=crop&q=80"
  ],
  "ps5-slim": [
    "https://images.unsplash.com/photo-1605296240971-a5a60fc8eff0?w=1000&auto=format&fit=crop&q=80"
  ],
  "xbox-series-x": [
    "https://images.unsplash.com/photo-1602491453631-e2a5ad90e131?w=1000&auto=format&fit=crop&q=80"
  ],
  "nintendo-switch-oled": [
    "https://images.unsplash.com/photo-1578496479863-826925d2f627?w=1000&auto=format&fit=crop&q=80"
  ],
  "dualsense-edge-controller": [
    "https://images.unsplash.com/photo-1608889584312-59ef5e27b9c8?w=1000&auto=format&fit=crop&q=80"
  ]
};

/**
 * Get product images with guaranteed fallback
 */
export function getProductImages(productId: string, category?: string): string[] {
  const placeholder = "/assets/image-coming-soon.svg";

  if (category === "iPhone" || productId.startsWith("iphone")) {
    const images = productImages[productId as keyof typeof productImages];
    if (images && images.length > 0) {
      return images;
    }

    return [`/images/iphone/${productId}/${productId}.png`];
  }

  const images = productImages[productId as keyof typeof productImages];
  if (images && images.length > 0) {
    return images;
  }

  return [placeholder];
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
  iphones: "/images/iphone/iphone-17-pro-max.webp",
  macbooks: "/assets/product-laptop-dark.svg",
  ipads: "/assets/product-tablet-dark.svg",
  watches: "/assets/product-watch-dark.svg",
  airpods: "/assets/product-audio.svg",
  gaming: "/assets/product-device-dark.svg",
  accessories: "/assets/product-accessory-blue.svg"
};
