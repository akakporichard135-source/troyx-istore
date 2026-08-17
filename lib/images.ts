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
  "macbook-air-13": ["/images/catalogue/non-iphone/macbook-air-13.webp"],
  "macbook-air-15": ["/images/catalogue/non-iphone/macbook-air-15.webp"],
  "macbook-pro-14": ["/images/catalogue/non-iphone/macbook-pro-14.webp"],
  "macbook-pro-16": ["/images/catalogue/non-iphone/macbook-pro-16.webp"],
  "imac-24": ["/images/catalogue/non-iphone/imac-24.webp"],
  "mac-mini": ["/images/catalogue/non-iphone/mac-mini.webp"],
  "mac-studio": ["/images/catalogue/non-iphone/mac-studio.webp"],
  "studio-display": ["/images/catalogue/non-iphone/studio-display.webp"],
  "ipad-pro-13-m4": ["/images/catalogue/non-iphone/ipad-pro-13-m4.webp"],
  "ipad-pro-11-m4": ["/images/catalogue/non-iphone/ipad-pro-11-m4.webp"],
  "ipad-air-11": ["/images/catalogue/non-iphone/ipad-air-11.webp"],
  "ipad-11th-gen": ["/images/catalogue/non-iphone/ipad-11th-gen.webp"],
  "ipad-mini": ["/images/catalogue/non-iphone/ipad-mini.webp"],
  "apple-watch-ultra-2": [
    "/images/catalogue/non-iphone/apple-watch-ultra-2.webp"
  ],
  "apple-watch-series-10": [
    "/images/catalogue/non-iphone/apple-watch-series-10.webp"
  ],
  "apple-watch-se": ["/images/catalogue/non-iphone/apple-watch-se.webp"],
  "airpods-pro-2": ["/images/catalogue/non-iphone/airpods-pro-2.webp"],
  "airpods-4-anc": ["/images/catalogue/non-iphone/airpods-4-anc.webp"],
  "airpods-4": ["/images/catalogue/non-iphone/airpods-4.webp"],
  "airpods-max": ["/images/catalogue/non-iphone/airpods-max.webp"],
  "apple-pencil-pro": [
    "/images/catalogue/non-iphone/apple-pencil-pro.webp"
  ],
  "magic-keyboard": ["/images/catalogue/non-iphone/magic-keyboard.webp"],
  "magsafe-charger": ["/images/catalogue/non-iphone/magsafe-charger.webp"],
  "airtag-4pack": ["/images/catalogue/non-iphone/airtag-4pack.webp"],
  "ps5-pro": ["/images/catalogue/non-iphone/ps5-pro.webp"],
  "ps5-slim": ["/images/catalogue/non-iphone/ps5-slim.webp"],
  "xbox-series-x": ["/images/catalogue/non-iphone/xbox-series-x.webp"],
  "nintendo-switch-oled": [
    "/images/catalogue/non-iphone/nintendo-switch-oled.webp"
  ],
  "dualsense-edge-controller": [
    "/images/catalogue/non-iphone/dualsense-edge-controller.webp"
  ],
  "xbox-wireless-controller": [
    "/images/catalogue/non-iphone/xbox-wireless-controller.webp"
  ],
  "nintendo-switch-pro-controller": [
    "/images/catalogue/non-iphone/nintendo-switch-pro-controller.webp"
  ],
  "pulse-elite-wireless-headset": [
    "/images/catalogue/non-iphone/pulse-elite-wireless-headset.webp"
  ],
  "xbox-wireless-headset": [
    "/images/catalogue/non-iphone/xbox-wireless-headset.webp"
  ],
  "ps5-nvme-ssd-expansion": [
    "/images/catalogue/non-iphone/ps5-nvme-ssd-expansion.webp"
  ],
  "xbox-storage-expansion-card": [
    "/images/catalogue/non-iphone/xbox-storage-expansion-card.webp"
  ],
  "dualsense-charging-station": [
    "/images/catalogue/non-iphone/dualsense-charging-station.webp"
  ],
  "joy-con-charging-dock": [
    "/images/catalogue/non-iphone/joy-con-charging-dock.webp"
  ]
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
