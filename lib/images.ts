/**
 * Image Service - Centralized Apple & Gaming product image management
 * Maps local image paths for the storefront.
 */

export const productCategoryFallbacks: Record<string, string> = {
  iPhone: "/images/iphone/studio/iphone-17-pro-max.webp",
  MacBook: "/images/categories/macbooks.webp",
  iPad: "/images/categories/ipads.webp",
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
  Speakers: "/images/categories/airpods.webp",
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
  "iphone-17-pro-max": ["/images/iphone/studio/iphone-17-pro-max.webp"]
};

/**
 * Get product images with guaranteed fallback
 */
export function getProductImages(
  productId: string,
  category?: string
): string[] {
  const placeholder = "/images/products/official-image-coming-soon.svg";

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
  iphones: "/images/iphone/studio/iphone-17-pro-max.webp",
  macbooks: "/images/categories/macbooks.webp",
  ipads: "/images/categories/ipads.webp",
  watches: "/images/categories/apple-watch.webp",
  airpods: "/images/categories/airpods.webp",
  gaming: "/images/categories/gaming.webp",
  accessories: "/images/categories/accessories.webp"
};
