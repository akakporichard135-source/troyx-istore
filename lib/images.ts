/**
 * Image Service - Centralized Apple & Gaming product image management
 * Generates custom, high-resolution vector rear-view device artwork
 * for every iPhone model, ensuring 100% load reliability.
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

/**
 * Generates a clean, centered, premium SVG rear-view illustration
 * matching the exact styling, color, and camera array of each iPhone model.
 */
export function getIPhoneSvg(modelId: string): string {
  // Default chassis colors
  let bodyColor = "#8e8e93"; // Space Gray
  let logoColor = "#ffffff";
  let cameraType: "single" | "dual-horizontal" | "dual-vertical" | "dual-diagonal" | "triple" | "triple-large" | "custom" = "single";
  let cameraModuleColor = "rgba(255, 255, 255, 0.08)";
  let isTwoTone = false;
  let isThreeStage = false;
  let hasAntennaBands = false;
  let isCurved = false;

  const id = modelId.toLowerCase();

  // Color mapping based on model
  if (id.includes("17") || id.includes("16") || id.includes("15")) {
    if (id.includes("pro")) {
      bodyColor = "#bebebe"; // Titanium
      logoColor = "#e3e3e3";
      cameraType = "triple-large";
    } else {
      bodyColor = "#3bb2b8"; // Teal / Ultramarine
      logoColor = "#ffffff";
      cameraType = "dual-vertical";
    }
  } else if (id.includes("14") || id.includes("13") || id.includes("12")) {
    if (id.includes("pro")) {
      bodyColor = "#4b4a54"; // Deep Purple / Graphite
      logoColor = "#d1cfd7";
      cameraType = "triple";
    } else {
      bodyColor = "#2c5b8f"; // Blue
      logoColor = "#ffffff";
      cameraType = "dual-diagonal";
    }
  } else if (id.includes("11")) {
    if (id.includes("pro")) {
      bodyColor = "#4e5b52"; // Midnight Green
      logoColor = "#a2b4a8";
      cameraType = "triple";
    } else {
      bodyColor = "#f9e4b7"; // Yellow
      logoColor = "#ffffff";
      cameraType = "dual-vertical";
    }
  } else if (id.includes("xs") || id.includes("x")) {
    bodyColor = "#d4af37"; // Gold
    logoColor = "#ffffff";
    cameraType = "dual-vertical";
  } else if (id.includes("xr")) {
    bodyColor = "#ff7f50"; // Coral
    logoColor = "#ffffff";
    cameraType = "single";
  } else if (id.includes("8") || id.includes("7") || id.includes("6s") || id.includes("6")) {
    bodyColor = "#ffc0cb"; // Rose Gold
    logoColor = "#ffffff";
    cameraType = id.includes("plus") ? "dual-horizontal" : "single";
    if (id.includes("6") || id.includes("7")) {
      hasAntennaBands = true;
    }
  } else if (id.includes("se")) {
    bodyColor = "#1c1c1e"; // Midnight
    logoColor = "#ffffff";
    cameraType = "single";
    if (id === "iphone-se") {
      isThreeStage = true; // iPhone SE 1st gen style
    }
  } else if (id.includes("5c")) {
    bodyColor = "#3cd070"; // Bright Green
    logoColor = "#000000";
    cameraType = "single";
  } else if (id.includes("5s") || id.includes("5")) {
    bodyColor = "#e3e3e3"; // Silver / Gold
    logoColor = "#8e8e93";
    cameraType = "single";
    isThreeStage = true;
  } else if (id.includes("4s") || id.includes("4")) {
    bodyColor = "#ffffff";
    logoColor = "#8e8e93";
    cameraType = "single";
  } else if (id.includes("3g")) {
    bodyColor = "#1c1c1e";
    logoColor = "#d1d1d6";
    cameraType = "single";
    isCurved = true;
  } else if (id.includes("1st-gen") || id === "iphone") {
    bodyColor = "#a1a1a6";
    logoColor = "#ffffff";
    cameraType = "single";
    isTwoTone = true;
  }

  // Camera drawing
  let cameraSVG = "";
  if (cameraType === "single") {
    cameraSVG = `
      <g transform="translate(48, 48)">
        <circle cx="0" cy="0" r="10" fill="#1c1c1e" stroke="#2c2c2e" stroke-width="2"/>
        <circle cx="0" cy="0" r="4" fill="#0a0a0a"/>
        <circle cx="16" cy="0" r="3" fill="#ffffff"/>
      </g>
    `;
  } else if (cameraType === "dual-horizontal") {
    cameraSVG = `
      <g transform="translate(48, 48)">
        <rect x="-12" y="-10" width="34" height="20" rx="10" fill="#1c1c1e"/>
        <circle cx="-4" cy="0" r="6" fill="#000"/>
        <circle cx="10" cy="0" r="6" fill="#000"/>
        <circle cx="28" cy="0" r="3" fill="#ffffff"/>
      </g>
    `;
  } else if (cameraType === "dual-vertical") {
    cameraSVG = `
      <g transform="translate(42, 42)">
        <rect x="-8" y="-8" width="24" height="42" rx="12" fill="${cameraModuleColor}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        <circle cx="4" cy="0" r="7" fill="#000" stroke="#333"/>
        <circle cx="4" cy="22" r="7" fill="#000" stroke="#333"/>
        <circle cx="4" cy="11" r="2.5" fill="#fff"/>
      </g>
    `;
  } else if (cameraType === "dual-diagonal") {
    cameraSVG = `
      <g transform="translate(42, 42)">
        <rect x="-8" y="-8" width="36" height="36" rx="12" fill="${cameraModuleColor}"/>
        <circle cx="4" cy="4" r="7" fill="#000"/>
        <circle cx="20" cy="20" r="7" fill="#000"/>
        <circle cx="20" cy="4" r="3" fill="#fff"/>
      </g>
    `;
  } else if (cameraType === "triple") {
    cameraSVG = `
      <g transform="translate(40, 40)">
        <rect x="-8" y="-8" width="46" height="46" rx="14" fill="${cameraModuleColor}"/>
        <circle cx="6" cy="10" r="8" fill="#000" stroke="#444" stroke-width="1.5"/>
        <circle cx="28" cy="10" r="8" fill="#000" stroke="#444" stroke-width="1.5"/>
        <circle cx="17" cy="28" r="8" fill="#000" stroke="#444" stroke-width="1.5"/>
        <circle cx="6" cy="28" r="3" fill="#fff"/>
        <circle cx="28" cy="28" r="2" fill="#222"/>
      </g>
    `;
  } else if (cameraType === "triple-large") {
    cameraSVG = `
      <g transform="translate(38, 38)">
        <rect x="-8" y="-8" width="52" height="52" rx="16" fill="${cameraModuleColor}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
        <circle cx="8" cy="12" r="10" fill="#000" stroke="#222" stroke-width="2"/>
        <circle cx="34" cy="12" r="10" fill="#000" stroke="#222" stroke-width="2"/>
        <circle cx="21" cy="34" r="10" fill="#000" stroke="#222" stroke-width="2"/>
        <circle cx="8" cy="34" r="3.5" fill="#fff"/>
        <circle cx="34" cy="34" r="4.5" fill="#111"/>
      </g>
    `;
  }

  // Apple Logo SVG
  const appleLogo = `
    <g transform="translate(100, 140) scale(1.1)" fill="${logoColor}" opacity="0.85">
      <path d="M15.2,12.9 C14.4,13.8 13.5,14.7 12.3,14.7 C11.2,14.7 10.8,14.1 9.5,14.1 C8.1,14.1 7.7,14.7 6.6,14.7 C5.5,14.7 4.5,13.8 3.7,12.7 C2.1,10.4 0.9,6.5 2.5,3.8 C3.3,2.4 4.8,1.5 6.3,1.5 C7.5,1.5 8.6,2.3 9.4,2.3 C10.1,2.3 11.4,1.4 12.8,1.5 C13.4,1.6 15.0,1.8 16.1,3.4 C16.0,3.5 13.9,4.7 13.9,7.2 C13.9,10.2 16.5,11.2 16.6,11.2 C16.6,11.3 16.2,12.7 15.2,12.9 Z M12.2,0 C12.8,-0.7 13.2,-1.7 13.1,-2.7 C12.2,-2.7 11.1,-2.1 10.5,-1.4 C10.0,-0.8 9.5,0.2 9.7,1.2 C10.7,1.3 11.7,0.7 12.2,0 Z" />
    </g>
  `;

  // Draw full chassis
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" width="100%" height="100%">
    <defs>
      <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${bodyColor}" />
        <stop offset="100%" stop-color="${bodyColor}cc" />
      </linearGradient>
      <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="%23000000" flood-opacity="0.2" />
      </filter>
    </defs>
    
    <!-- Phone Chassis -->
    <rect x="25" y="15" width="150" height="270" rx="${isCurved ? "36" : "26"}" fill="url(%23bodyGrad)" filter="url(%23cardShadow)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
    
    ${isTwoTone ? `
      <!-- 1st Gen Two-Tone Bottom Bar -->
      <path d="M 25 240 L 175 240 L 175 259 C 175 274 159 285 145 285 L 55 285 C 41 285 25 274 25 259 Z" fill="%231c1c1e" />
    ` : ""}

    ${isThreeStage ? `
      <!-- iPhone 5 style Glass Panels -->
      <rect x="26" y="16" width="148" height="24" rx="2" fill="%23ffffff" opacity="0.15"/>
      <rect x="26" y="260" width="148" height="24" rx="2" fill="%23ffffff" opacity="0.15"/>
    ` : ""}

    ${hasAntennaBands ? `
      <!-- Curved antenna lines -->
      <path d="M 25 35 Q 100 45 175 35" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
      <path d="M 25 265 Q 100 255 175 265" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
    ` : ""}

    <!-- Apple Logo -->
    ${appleLogo}

    <!-- Camera module -->
    ${cameraSVG}
  </svg>`.replace(/#/g, "%23");
}

// Curated high-res Apple & Gaming product photography
export const productImages: Record<string, string[]> = {
  // Dynamic sitemap fallback mappings
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
  if (category === "iPhone" || productId.startsWith("iphone")) {
    return [getIPhoneSvg(productId)];
  }

  const images = productImages[productId as keyof typeof productImages];
  const categoryFallback = category ? productCategoryFallbacks[category] : "/assets/product-device-blue.svg";

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
  iphones: "/assets/product-device-blue.svg",
  macbooks: "/assets/product-laptop-dark.svg",
  ipads: "/assets/product-tablet-dark.svg",
  watches: "/assets/product-watch-dark.svg",
  airpods: "/assets/product-audio.svg",
  gaming: "/assets/product-device-dark.svg",
  accessories: "/assets/product-accessory-blue.svg"
};
