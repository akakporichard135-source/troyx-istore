/**
 * Image Service - Centralized Apple & Gaming product image management
 * Maps local image paths for the storefront.
 */

export const productCategoryFallbacks: Record<string, string> = {
  iPhone: "/images/products/verified-image-pending.webp",
  MacBook: "/images/products/verified-image-pending.webp",
  iPad: "/images/products/verified-image-pending.webp",
  "Apple Watch": "/images/products/verified-image-pending.webp",
  AirPods: "/images/products/verified-image-pending.webp",
  "Apple TV": "/images/products/verified-image-pending.webp",
  HomePod: "/images/products/verified-image-pending.webp",
  Accessories: "/images/products/verified-image-pending.webp",
  Cases: "/images/products/verified-image-pending.webp",
  Chargers: "/images/products/verified-image-pending.webp",
  "Power Banks": "/images/products/verified-image-pending.webp",
  "Screen Protectors": "/images/products/verified-image-pending.webp",
  Adapters: "/images/products/verified-image-pending.webp",
  Cables: "/images/products/verified-image-pending.webp",
  Speakers: "/images/products/verified-image-pending.webp",
  "Smart Accessories": "/images/products/verified-image-pending.webp",
  Gaming: "/images/products/verified-image-pending.webp",
  PlayStation: "/images/products/verified-image-pending.webp",
  Xbox: "/images/products/verified-image-pending.webp",
  Nintendo: "/images/products/verified-image-pending.webp",
  Controllers: "/images/products/verified-image-pending.webp",
  "Gaming Headsets": "/images/products/verified-image-pending.webp"
};

// Curated clean studio product renders for the storefront.
export const productImages: Record<string, string[]> = {
  "iphone-11": ["/images/products/verified-image-pending.webp"],
  "iphone-11-pro": ["/images/products/verified-image-pending.webp"],
  "iphone-11-pro-max": ["/images/products/verified-image-pending.webp"],
  "iphone-12": ["/images/products/verified-image-pending.webp"],
  "iphone-12-mini": ["/images/products/verified-image-pending.webp"],
  "iphone-12-pro": ["/images/products/verified-image-pending.webp"],
  "iphone-12-pro-max": ["/images/products/verified-image-pending.webp"],
  "iphone-13": ["/images/products/verified-image-pending.webp"],
  "iphone-13-mini": ["/images/products/verified-image-pending.webp"],
  "iphone-13-pro": ["/images/products/verified-image-pending.webp"],
  "iphone-13-pro-max": ["/images/products/verified-image-pending.webp"],
  "iphone-14": ["/images/products/verified-image-pending.webp"],
  "iphone-14-plus": ["/images/products/verified-image-pending.webp"],
  "iphone-14-pro": ["/images/products/verified-image-pending.webp"],
  "iphone-14-pro-max": ["/images/products/verified-image-pending.webp"],
  "iphone-15": ["/images/products/verified-image-pending.webp"],
  "iphone-15-plus": ["/images/products/verified-image-pending.webp"],
  "iphone-15-pro": ["/images/products/verified-image-pending.webp"],
  "iphone-15-pro-max": ["/images/products/verified-image-pending.webp"],
  "iphone-16": ["/images/products/verified-image-pending.webp"],
  "iphone-16-plus": ["/images/products/verified-image-pending.webp"],
  "iphone-16-pro": ["/images/products/verified-image-pending.webp"],
  "iphone-16-pro-max": ["/images/home/featured-iphone-16-pro-max-cutout.webp"],
  "iphone-17": ["/images/products/verified-image-pending.webp"],
  "iphone-17-air": ["/images/products/verified-image-pending.webp"],
  "iphone-17-pro": ["/images/products/verified-image-pending.webp"],
  "iphone-17-pro-max": ["/images/products/verified-image-pending.webp"]
};

/**
 * Get product images with guaranteed fallback
 */
export function getProductImages(
  productId: string,
  category?: string
): string[] {
  const placeholder = "/images/products/verified-image-pending.webp";

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
  macbooks: "/images/products/verified-image-pending.webp",
  ipads: "/images/categories/ipads.webp",
  watches: "/images/products/verified-image-pending.webp",
  airpods: "/images/products/verified-image-pending.webp",
  gaming: "/images/categories/gaming.webp",
  accessories: "/images/products/verified-image-pending.webp"
};
