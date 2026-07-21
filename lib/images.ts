/**
 * Image Service - Centralized Apple & Gaming product image management
 * Maps local image paths for the storefront using the real uploaded iPhone photographs.
 */

export const productCategoryFallbacks: Record<string, string> = {
  iPhone: "/images/iphone/iphone-gold.png",
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

// Map each of the 51 iPhone models to one of the 5 uploaded real photos based on color/generation.
const iphoneImageMap: Record<string, string> = {
  // Orange/Bronze (17 series, 17 Pro/Max)
  "iphone-17-pro-max": "/images/iphone/iphone-orange.png",
  "iphone-17-pro": "/images/iphone/iphone-orange.png",
  "iphone-17-air": "/images/iphone/iphone-teal.png",
  "iphone-17": "/images/iphone/iphone-teal.png",
  "iphone-16e": "/images/iphone/iphone-pink.png",

  // Gold/Natural/Bronze (16 Pro, 15 Pro, XS, 8, 7, 6, 5s)
  "iphone-16-pro-max": "/images/iphone/iphone-gold.png",
  "iphone-16-pro": "/images/iphone/iphone-gold.png",
  "iphone-15-pro-max": "/images/iphone/iphone-black.png",
  "iphone-15-pro": "/images/iphone/iphone-black.png",
  "iphone-xs-max": "/images/iphone/iphone-gold.png",
  "iphone-xs": "/images/iphone/iphone-gold.png",
  "iphone-8-plus": "/images/iphone/iphone-gold.png",
  "iphone-8": "/images/iphone/iphone-gold.png",
  "iphone-6s-plus": "/images/iphone/iphone-gold.png",
  "iphone-6s": "/images/iphone/iphone-gold.png",
  "iphone-6-plus": "/images/iphone/iphone-silver.png",
  "iphone-6": "/images/iphone/iphone-silver.png",
  "iphone-5s": "/images/iphone/iphone-gold.png",

  // Silver/White/Starlight (SE, 12, 11, X, 5, 4, 3, 1st Gen)
  "iphone-se-3": "/images/iphone/iphone-silver.png",
  "iphone-se-2": "/images/iphone/iphone-silver.png",
  "iphone-12": "/images/iphone/iphone-silver.png",
  "iphone-12-mini": "/images/iphone/iphone-silver.png",
  "iphone-11": "/images/iphone/iphone-yellow.png",
  "iphone-x": "/images/iphone/iphone-silver.png",
  "iphone-5": "/images/iphone/iphone-silver.png",
  "iphone-4s": "/images/iphone/iphone-black.png",
  "iphone-4": "/images/iphone/iphone-black.png",
  "iphone-3gs": "/images/iphone/iphone-silver.png",
  "iphone-3g": "/images/iphone/iphone-silver.png",
  "iphone-1st-gen": "/images/iphone/iphone-silver.png",

  // Teal/Pink/Blue/Purple/Yellow
  "iphone-16-plus": "/images/iphone/iphone-teal.png",
  "iphone-16": "/images/iphone/iphone-teal.png",
  "iphone-15-plus": "/images/iphone/iphone-pink.png",
  "iphone-15": "/images/iphone/iphone-pink.png",
  "iphone-14-pro-max": "/images/iphone/iphone-purple.png",
  "iphone-14-pro": "/images/iphone/iphone-purple.png",
  "iphone-14-plus": "/images/iphone/iphone-blue.png",
  "iphone-14": "/images/iphone/iphone-blue.png",
  "iphone-13-pro-max": "/images/iphone/iphone-blue.png",
  "iphone-13-pro": "/images/iphone/iphone-blue.png",
  "iphone-13": "/images/iphone/iphone-pink.png",
  "iphone-13-mini": "/images/iphone/iphone-pink.png",
  "iphone-12-pro-max": "/images/iphone/iphone-blue.png",
  "iphone-12-pro": "/images/iphone/iphone-blue.png",
  "iphone-11-pro-max": "/images/iphone/iphone-black.png",
  "iphone-11-pro": "/images/iphone/iphone-black.png",
  "iphone-xr": "/images/iphone/iphone-yellow.png",
  "iphone-7-plus": "/images/iphone/iphone-purple.png",
  "iphone-7": "/images/iphone/iphone-purple.png",
  "iphone-se": "/images/iphone/iphone-purple.png",
  "iphone-5c": "/images/iphone/iphone-yellow.png"
};

/**
 * Get product images with guaranteed fallback
 */
export function getProductImages(productId: string, category?: string): string[] {
  const categoryFallback = "/images/iphone/iphone-gold.png";

  if (category === "iPhone" || productId.startsWith("iphone")) {
    const mapped = iphoneImageMap[productId.toLowerCase()];
    return [mapped || categoryFallback, categoryFallback];
  }

  const images = productImages[productId as keyof typeof productImages];
  if (images && images.length > 0) {
    return [...images, categoryFallback];
  }

  return [categoryFallback];
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
  iphones: "/images/iphone/iphone-gold.png",
  macbooks: "/assets/product-laptop-dark.svg",
  ipads: "/assets/product-tablet-dark.svg",
  watches: "/assets/product-watch-dark.svg",
  airpods: "/assets/product-audio.svg",
  gaming: "/assets/product-device-dark.svg",
  accessories: "/assets/product-accessory-blue.svg"
};
