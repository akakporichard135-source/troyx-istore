/**
 * Image Service - Centralized Apple & Gaming product image management
 * Maps local image paths for the storefront.
 */

export const productCategoryFallbacks: Record<string, string> = {
  iPhone: "/images/iphone/studio/iphone-16-pro-max.webp",
  MacBook: "/images/home/macbook-air/macbook-air-open-midnight.webp",
  iPad: "/images/home/ipad-air/ipad-air-front-side-blue.webp",
  "Apple Watch": "/images/categories/apple-watch.webp",
  AirPods: "/images/categories/airpods.webp",
  "Apple TV": "/images/categories/accessories.webp",
  HomePod: "/images/categories/accessories.webp",
  Accessories: "/images/categories/accessories.webp",
  Cases: "/images/categories/accessories.webp",
  Chargers: "/images/categories/accessories.webp",
  "Power Banks": "/images/categories/accessories.webp",
  "Screen Protectors": "/images/categories/accessories.webp",
  Adapters: "/images/categories/accessories.webp",
  Cables: "/images/categories/accessories.webp",
  Speakers: "/images/categories/accessories.webp",
  "Smart Accessories": "/images/categories/accessories.webp",
  Gaming: "/images/categories/gaming.webp",
  PlayStation: "/images/categories/gaming.webp",
  Xbox: "/images/categories/gaming.webp",
  Nintendo: "/images/categories/gaming.webp",
  Controllers: "/images/categories/gaming.webp",
  "Gaming Headsets": "/images/categories/gaming.webp"
};

// Curated clean studio product renders for the storefront.
export const productImages: Record<string, string[]> = {
  "iphone-11": ["/images/iphone/studio/iphone-11.webp"],
  "iphone-11-pro": ["/images/iphone/studio/iphone-11-pro.webp"],
  "iphone-11-pro-max": ["/images/iphone/studio/iphone-11-pro-max.webp"],
  "iphone-12": ["/images/iphone/studio/iphone-12.webp"],
  "iphone-12-mini": ["/images/iphone/studio/iphone-12-mini.webp"],
  "iphone-12-pro": ["/images/iphone/studio/iphone-12-pro.webp"],
  "iphone-12-pro-max": ["/images/iphone/studio/iphone-12-pro-max.webp"],
  "iphone-13": ["/images/iphone/studio/iphone-13.webp"],
  "iphone-13-mini": ["/images/iphone/studio/iphone-13-mini.webp"],
  "iphone-13-pro": ["/images/iphone/studio/iphone-13-pro.webp"],
  "iphone-13-pro-max": ["/images/iphone/studio/iphone-13-pro-max.webp"],
  "iphone-14": ["/images/iphone/studio/iphone-14.webp"],
  "iphone-14-plus": ["/images/iphone/studio/iphone-14-plus.webp"],
  "iphone-14-pro": ["/images/iphone/studio/iphone-14-pro.webp"],
  "iphone-14-pro-max": ["/images/iphone/studio/iphone-14-pro-max.webp"],
  "iphone-15": ["/images/iphone/studio/iphone-15.webp"],
  "iphone-15-plus": ["/images/iphone/studio/iphone-15-plus.webp"],
  "iphone-15-pro": ["/images/iphone/studio/iphone-15-pro.webp"],
  "iphone-15-pro-max": ["/images/iphone/studio/iphone-15-pro-max.webp"],
  "iphone-16": ["/images/iphone/studio/iphone-16.webp"],
  "iphone-16-plus": ["/images/iphone/studio/iphone-16-plus.webp"],
  "iphone-16-pro": ["/images/iphone/studio/iphone-16-pro.webp"],
  "iphone-16-pro-max": ["/images/iphone/studio/iphone-16-pro-max.webp"],
  "iphone-17": ["/images/iphone/studio/iphone-17.webp"],
  "iphone-17-air": ["/images/iphone/studio/iphone-17-air.webp"],
  "iphone-17-pro": ["/images/iphone/studio/iphone-17-pro.webp"],
  "iphone-17-pro-max": ["/images/iphone/studio/iphone-17-pro-max.webp"],
  "macbook-air-13": ["/images/home/macbook-air/macbook-air-open-midnight.webp"],
  "macbook-air-15": ["/images/home/macbook-air/macbook-air-open-midnight.webp"],
  "macbook-pro-14": ["/images/home/macbook-pro/macbook-pro-open-space-black.webp"],
  "macbook-pro-16": ["/images/home/macbook-pro/macbook-pro-open-space-black.webp"],
  "ipad-pro-13-m4": ["/images/categories/ipads.webp"],
  "ipad-pro-11-m4": ["/images/categories/ipads.webp"],
  "ipad-air-11": ["/images/home/ipad-air/ipad-air-front-side-blue.webp"],
  "ipad-11th-gen": ["/images/categories/ipads.webp"],
  "ipad-mini": ["/images/categories/ipads.webp"],
  "apple-watch-ultra-2": ["/images/categories/apple-watch.webp"],
  "apple-watch-series-10": ["/images/categories/apple-watch.webp"],
  "apple-watch-se": ["/images/categories/apple-watch.webp"],
  "airpods-pro-2": ["/images/categories/airpods.webp"],
  "airpods-4-anc": ["/images/categories/airpods.webp"],
  "airpods-4": ["/images/categories/airpods.webp"],
  "airpods-max": ["/images/categories/airpods.webp"],
  "ps5-pro": ["/images/categories/gaming.webp"],
  "ps5-slim": ["/images/categories/gaming.webp"],
  "xbox-series-x": ["/images/categories/gaming.webp"],
  "nintendo-switch-oled": ["/images/categories/gaming.webp"]
};

/**
 * Get product images with guaranteed fallback
 */
export function getProductImages(
  productId: string,
  category?: string
): string[] {
  const placeholder = "/images/categories/accessories.webp";

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

  return [productCategoryFallbacks[category || ""] || placeholder];
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
  iphones: "/images/home/featured-iphone-16-pro-max-cutout.webp",
  macbooks: "/images/home/macbook-air/macbook-air-open-midnight.webp",
  ipads: "/images/categories/ipads.webp",
  watches: "/images/categories/apple-watch.webp",
  airpods: "/images/categories/airpods.webp",
  gaming: "/images/categories/gaming.webp",
  accessories: "/images/categories/accessories.webp"
};
