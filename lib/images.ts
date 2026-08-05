/**
 * Image Service - Centralized Apple & Gaming product image management
 * Maps local image paths for the storefront.
 */

export const productCategoryFallbacks: Record<string, string> = {
  iPhone: "/images/iphone/iphone-17-pro-max.webp",
  MacBook: "/images/products/official-image-coming-soon.svg",
  iPad: "/images/products/official-image-coming-soon.svg",
  "Apple Watch": "/images/products/official-image-coming-soon.svg",
  AirPods: "/images/products/official-image-coming-soon.svg",
  "Apple TV": "/images/products/official-image-coming-soon.svg",
  HomePod: "/images/products/official-image-coming-soon.svg",
  Accessories: "/images/products/official-image-coming-soon.svg",
  Cases: "/images/products/official-image-coming-soon.svg",
  Chargers: "/images/products/official-image-coming-soon.svg",
  "Power Banks": "/images/products/official-image-coming-soon.svg",
  "Screen Protectors": "/images/products/official-image-coming-soon.svg",
  Adapters: "/images/products/official-image-coming-soon.svg",
  Cables: "/images/products/official-image-coming-soon.svg",
  Speakers: "/images/products/official-image-coming-soon.svg",
  "Smart Accessories": "/images/products/official-image-coming-soon.svg",
  Gaming: "/images/products/official-image-coming-soon.svg",
  PlayStation: "/images/products/official-image-coming-soon.svg",
  Xbox: "/images/products/official-image-coming-soon.svg",
  Nintendo: "/images/products/official-image-coming-soon.svg",
  Controllers: "/images/products/official-image-coming-soon.svg",
  "Gaming Headsets": "/images/products/official-image-coming-soon.svg"
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
  "iphone-17-pro-max": ["/images/iphone/iphone-17-pro-max.webp"]
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
  iphones: "/images/iphone/iphone-17-pro-max.webp",
  macbooks: "/images/categories/macbooks.webp",
  ipads: "/images/categories/ipads.webp",
  watches: "/images/products/official-image-coming-soon.svg",
  airpods: "/images/products/official-image-coming-soon.svg",
  gaming: "/images/categories/gaming.webp",
  accessories: "/images/products/official-image-coming-soon.svg"
};
