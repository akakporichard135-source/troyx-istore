import type { Product, ProductCategory } from "@/types";
import { getProductImages } from "@/lib/images";

export const categories: ProductCategory[] = [
  "iPhone",
  "MacBook",
  "iPad",
  "Apple Watch",
  "AirPods",
  "Apple TV",
  "HomePod",
  "Accessories",
  "Cases",
  "Chargers",
  "Power Banks",
  "Screen Protectors",
  "Adapters",
  "Cables",
  "Speakers",
  "Smart Accessories",
  "Gaming",
  "PlayStation",
  "Xbox",
  "Nintendo",
  "Controllers",
  "Gaming Headsets"
];

export const products: Product[] = [
  // ===================================
  // IPHONE CATALOG (51 MODELS: NEWEST TO OLDEST)
  // ===================================
  {
    id: "iphone-17-pro-max",
    slug: "iphone-17-pro-max",
    name: "iPhone 17 Pro Max",
    category: "iPhone",
    series: "iPhone 17 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 5.0,
    reviewCount: 8,
    images: getProductImages("iphone-17-pro-max", "iPhone"),
    colors: ["Titanium Gray", "Titanium Black", "Titanium Bronze"],
    storage: ["256GB", "512GB", "1TB"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month TroyX warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Official Model",
    description:
      "Official iPhone 17 Pro Max catalogue entry with A19 Pro performance, Pro display technology, and Apple's latest pro camera system. Final TroyX pricing and stock are confirmed on request.",
    specs: {
      Display: "Pro Super Retina XDR display",
      Chip: "A19 Pro",
      Camera: "Pro camera system",
      Charging: "USB-C"
    }
  },
  {
    id: "iphone-17-pro",
    slug: "iphone-17-pro",
    name: "iPhone 17 Pro",
    category: "iPhone",
    series: "iPhone 17 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.9,
    reviewCount: 5,
    images: getProductImages("iphone-17-pro", "iPhone"),
    colors: ["Titanium Gray", "Titanium Black"],
    storage: ["128GB", "256GB", "512GB", "1TB"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month TroyX warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Official Model",
    description:
      "Official iPhone 17 Pro catalogue entry with A19 Pro performance, ProMotion display technology, and a pro camera system. Final TroyX pricing and stock are confirmed on request.",
    specs: {
      Display: "Pro Super Retina XDR display",
      Chip: "A19 Pro",
      Camera: "Pro camera system",
      Charging: "USB-C"
    }
  },
  {
    id: "iphone-17-air",
    slug: "iphone-17-air",
    name: "iPhone 17 Air",
    category: "iPhone",
    series: "iPhone 17 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 3,
    images: getProductImages("iphone-17-air", "iPhone"),
    colors: ["Space Black", "Cloud White", "Light Gold", "Sky Blue"],
    storage: ["256GB", "512GB", "1TB"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month TroyX warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Ultra Thin",
    description:
      "Official iPhone 17 Air catalogue entry with an ultra-thin design, A19 Pro performance, and a 48MP Fusion camera. Final TroyX pricing and stock are confirmed on request.",
    specs: {
      Display: "Super Retina XDR display",
      Chip: "A19 Pro",
      Camera: "48MP Fusion camera",
      Charging: "USB-C"
    }
  },
  {
    id: "iphone-17",
    slug: "iphone-17",
    name: "iPhone 17",
    category: "iPhone",
    series: "iPhone 17 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 4,
    images: getProductImages("iphone-17", "iPhone"),
    colors: ["Blue", "Green", "Pink", "Black"],
    storage: ["128GB", "256GB", "512GB"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month TroyX warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "New Gen",
    description:
      "Official iPhone 17 catalogue entry with A19 performance, a bright Super Retina XDR display, and a 48MP Fusion camera system. Final TroyX pricing and stock are confirmed on request.",
    specs: {
      Display: "Super Retina XDR display",
      Chip: "A19",
      Camera: "48MP Fusion camera system",
      Charging: "USB-C"
    }
  },
  {
    id: "iphone-16e",
    slug: "iphone-16e",
    name: "iPhone 16e",
    category: "iPhone",
    series: "iPhone 16 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.7,
    reviewCount: 14,
    images: getProductImages("iphone-16e", "iPhone"),
    colors: ["Purple", "Teal", "White", "Black"],
    storage: ["128GB", "256GB"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month TroyX warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Compact Value",
    description: "A lightweight, efficient addition to the iPhone 16 family.",
    specs: {
      Display: "6.1-inch OLED",
      Chip: "A18",
      Camera: "48MP Single Lens",
      Charging: "USB-C"
    }
  },
  {
    id: "iphone-16-pro-max",
    slug: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    category: "iPhone",
    series: "iPhone 16 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.9,
    reviewCount: 248,
    images: getProductImages("iphone-16-pro-max", "iPhone"),
    colors: [
      "Natural Titanium",
      "Desert Titanium",
      "Black Titanium",
      "White Titanium"
    ],
    storage: ["256GB", "512GB", "1TB"],
    condition: ["New", "Refurbished"],
    availability: "Available on request",
    warranty: "12-month TroyX Ghana warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Best Seller",
    description:
      "The ultimate iPhone with a 6.9-inch Super Retina XDR display, A18 Pro chip, 48MP Fusion camera system, and Camera Control.",
    specs: {
      Display: "6.9-inch OLED",
      Chip: "A18 Pro",
      Camera: "48MP Pro System",
      Charging: "USB-C"
    },
    bestSeller: true,
    newArrival: true,
    deal: true
  },
  {
    id: "iphone-16-pro",
    slug: "iphone-16-pro",
    name: "iPhone 16 Pro",
    category: "iPhone",
    series: "iPhone 16 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.9,
    reviewCount: 182,
    images: getProductImages("iphone-16-pro", "iPhone"),
    colors: ["Natural Titanium", "Desert Titanium", "Black Titanium"],
    storage: ["128GB", "256GB", "512GB", "1TB"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month TroyX warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Flagship Pro",
    description:
      "6.3-inch Super Retina XDR display, A18 Pro chip, 5x Telephoto optical zoom camera system.",
    specs: {
      Display: "6.3-inch OLED",
      Chip: "A18 Pro",
      Camera: "48MP Triple Lens",
      Charging: "USB-C"
    },
    bestSeller: true,
    newArrival: true
  },
  {
    id: "iphone-16-plus",
    slug: "iphone-16-plus",
    name: "iPhone 16 Plus",
    category: "iPhone",
    series: "iPhone 16 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 94,
    images: getProductImages("iphone-16-plus", "iPhone"),
    colors: ["Teal", "Pink", "Ultramarine", "Black", "White"],
    storage: ["128GB", "256GB", "512GB"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month TroyX warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Big Screen Value",
    description:
      "6.7-inch Super Retina XDR display with A18 chip, Camera Control, and extraordinary battery life.",
    specs: {
      Display: "6.7-inch OLED",
      Chip: "A18",
      Camera: "48MP Dual Lens",
      Charging: "USB-C"
    },
    newArrival: true
  },
  {
    id: "iphone-16",
    slug: "iphone-16",
    name: "iPhone 16",
    category: "iPhone",
    series: "iPhone 16 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 142,
    images: getProductImages("iphone-16", "iPhone"),
    colors: ["Teal", "Pink", "Ultramarine", "Black"],
    storage: ["128GB", "256GB", "512GB"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month TroyX warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Popular Choice",
    description:
      "6.1-inch Super Retina XDR display with Action Button, Camera Control, and A18 performance.",
    specs: {
      Display: "6.1-inch OLED",
      Chip: "A18",
      Camera: "48MP Fusion",
      Charging: "USB-C"
    },
    bestSeller: true,
    newArrival: true
  },
  {
    id: "iphone-15-pro-max",
    slug: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    category: "iPhone",
    series: "iPhone 15 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.9,
    reviewCount: 310,
    images: getProductImages("iphone-15-pro-max", "iPhone"),
    colors: ["Natural Titanium", "Blue Titanium", "Black Titanium"],
    storage: ["256GB", "512GB", "1TB"],
    condition: ["New", "Refurbished"],
    availability: "Available on request",
    warranty: "12-month TroyX warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Special Deal",
    description:
      "Titanium design with A17 Pro chip, Action button, 5x Optical Telephoto zoom, and USB-C speed.",
    specs: {
      Display: "6.7-inch OLED",
      Chip: "A17 Pro",
      Camera: "48MP Triple System",
      Charging: "USB-C"
    },
    deal: true
  },
  {
    id: "iphone-15-pro",
    slug: "iphone-15-pro",
    name: "iPhone 15 Pro",
    category: "iPhone",
    series: "iPhone 15 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 215,
    images: getProductImages("iphone-15-pro", "iPhone"),
    colors: ["Natural Titanium", "Blue Titanium", "White Titanium"],
    storage: ["128GB", "256GB", "512GB"],
    condition: ["New", "Refurbished"],
    availability: "Available on request",
    warranty: "12-month TroyX warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Best Value Pro",
    description:
      "A17 Pro performance with Pro camera capabilities in a lightweight titanium body.",
    specs: {
      Display: "6.1-inch OLED",
      Chip: "A17 Pro",
      Camera: "48MP Triple System",
      Charging: "USB-C"
    }
  },
  {
    id: "iphone-15-plus",
    slug: "iphone-15-plus",
    name: "iPhone 15 Plus",
    category: "iPhone",
    series: "iPhone 15 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.7,
    reviewCount: 88,
    images: getProductImages("iphone-15-plus", "iPhone"),
    colors: ["Pink", "Yellow", "Green", "Blue", "Black"],
    storage: ["128GB", "256GB"],
    condition: ["New", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Dynamic Island with 48MP Main camera, 6.7-inch display, and all-day battery performance.",
    specs: {
      Display: "6.7-inch OLED",
      Chip: "A16 Bionic",
      Camera: "48MP Dual Lens",
      Charging: "USB-C"
    }
  },
  {
    id: "iphone-15",
    slug: "iphone-15",
    name: "iPhone 15",
    category: "iPhone",
    series: "iPhone 15 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 304,
    images: getProductImages("iphone-15", "iPhone"),
    colors: ["Pink", "Yellow", "Green", "Blue", "Black"],
    storage: ["128GB", "256GB", "512GB"],
    condition: ["New", "Refurbished"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Popular Value",
    description:
      "Dynamic Island, 48MP camera, color-infused glass, and durable aluminum design.",
    specs: {
      Display: "6.1-inch OLED",
      Chip: "A16 Bionic",
      Camera: "48MP Dual Lens",
      Charging: "USB-C"
    },
    deal: true
  },
  {
    id: "iphone-14-pro-max",
    slug: "iphone-14-pro-max",
    name: "iPhone 14 Pro Max",
    category: "iPhone",
    series: "iPhone 14 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.9,
    reviewCount: 182,
    images: getProductImages("iphone-14-pro-max", "iPhone"),
    colors: ["Space Black", "Deep Purple", "Gold", "Silver"],
    storage: ["128GB", "256GB", "512GB", "1TB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Pro Dynamic Island",
    description:
      "The first iPhone with Dynamic Island and a 48MP primary sensor.",
    specs: {
      Display: "6.7-inch OLED",
      Chip: "A16 Bionic",
      Camera: "48MP Triple-Lens",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-14-pro",
    slug: "iphone-14-pro",
    name: "iPhone 14 Pro",
    category: "iPhone",
    series: "iPhone 14 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 145,
    images: getProductImages("iphone-14-pro", "iPhone"),
    colors: ["Space Black", "Deep Purple", "Silver"],
    storage: ["128GB", "256GB", "512GB", "1TB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description: "6.1-inch Dynamic Island Pro experience.",
    specs: {
      Display: "6.1-inch OLED",
      Chip: "A16 Bionic",
      Camera: "48MP Triple-Lens",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-14-plus",
    slug: "iphone-14-plus",
    name: "iPhone 14 Plus",
    category: "iPhone",
    series: "iPhone 14 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.7,
    reviewCount: 76,
    images: getProductImages("iphone-14-plus", "iPhone"),
    colors: ["Midnight", "Starlight", "Purple", "Blue"],
    storage: ["128GB", "256GB"],
    condition: ["Used", "Refurbished"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Big 6.7-inch display, dual camera system, Crash Detection, and ultra-long battery life.",
    specs: {
      Display: "6.7-inch OLED",
      Chip: "A15 Bionic",
      Camera: "12MP Dual Lens",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-14",
    slug: "iphone-14",
    name: "iPhone 14",
    category: "iPhone",
    series: "iPhone 14 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.7,
    reviewCount: 260,
    images: getProductImages("iphone-14", "iPhone"),
    colors: ["Midnight", "Starlight", "Purple", "PRODUCT(RED)"],
    storage: ["128GB", "256GB"],
    condition: ["Used", "Refurbished"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "6.1-inch Super Retina XDR display, dual-camera system, Action Mode video stabilization.",
    specs: {
      Display: "6.1-inch OLED",
      Chip: "A15 Bionic",
      Camera: "12MP Dual Lens",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-se-3",
    slug: "iphone-se-3",
    name: "iPhone SE 3",
    category: "iPhone",
    series: "iPhone SE Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.7,
    reviewCount: 92,
    images: getProductImages("iphone-se-3", "iPhone"),
    colors: ["Midnight", "Starlight", "Red"],
    storage: ["64GB", "128GB", "256GB"],
    condition: ["New", "Refurbished"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description: "Touch ID Home button and highly capable A15 Bionic 5G speed.",
    specs: {
      Display: "4.7-inch LCD",
      Chip: "A15 Bionic",
      Camera: "12MP Single",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-13-pro-max",
    slug: "iphone-13-pro-max",
    name: "iPhone 13 Pro Max",
    category: "iPhone",
    series: "iPhone 13 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.9,
    reviewCount: 312,
    images: getProductImages("iphone-13-pro-max", "iPhone"),
    colors: ["Sierra Blue", "Graphite", "Gold", "Alpine Green"],
    storage: ["128GB", "256GB", "512GB", "1TB"],
    condition: ["Used", "Refurbished"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Exceptional 120Hz ProMotion display and legendary battery longevity.",
    specs: {
      Display: "6.7-inch ProMotion",
      Chip: "A15 Bionic",
      Camera: "12MP Triple-Lens",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-13-pro",
    slug: "iphone-13-pro",
    name: "iPhone 13 Pro",
    category: "iPhone",
    series: "iPhone 13 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 220,
    images: getProductImages("iphone-13-pro", "iPhone"),
    colors: ["Sierra Blue", "Graphite", "Gold"],
    storage: ["128GB", "256GB", "512GB", "1TB"],
    condition: ["Used", "Refurbished"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description: "6.1-inch 120Hz display with pro cinematic video standard.",
    specs: {
      Display: "6.1-inch ProMotion",
      Chip: "A15 Bionic",
      Camera: "12MP Triple-Lens",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-13",
    slug: "iphone-13",
    name: "iPhone 13",
    category: "iPhone",
    series: "iPhone 13 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 410,
    images: getProductImages("iphone-13", "iPhone"),
    colors: ["Midnight", "Starlight", "Blue", "Pink"],
    storage: ["128GB", "256GB"],
    condition: ["Used", "Refurbished"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Budget iPhone",
    description:
      "Cinematic mode video recording, durable flat-edge design, and bright Super Retina XDR display.",
    specs: {
      Display: "6.1-inch OLED",
      Chip: "A15 Bionic",
      Camera: "12MP Dual Lens",
      Charging: "Lightning"
    },
    deal: true
  },
  {
    id: "iphone-13-mini",
    slug: "iphone-13-mini",
    name: "iPhone 13 Mini",
    category: "iPhone",
    series: "iPhone 13 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 104,
    images: getProductImages("iphone-13-mini", "iPhone"),
    colors: ["Midnight", "Starlight", "Blue", "Green"],
    storage: ["128GB", "256GB"],
    condition: ["Used", "Refurbished"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Compact powerhouse with 5.4-inch OLED display and diagonal dual-camera layout.",
    specs: {
      Display: "5.4-inch OLED",
      Chip: "A15 Bionic",
      Camera: "12MP Dual",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-se-2",
    slug: "iphone-se-2",
    name: "iPhone SE 2",
    category: "iPhone",
    series: "iPhone SE Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.6,
    reviewCount: 88,
    images: getProductImages("iphone-se-2", "iPhone"),
    colors: ["Black", "White", "Red"],
    storage: ["64GB", "128GB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Highly portable 4.7-inch smartphone with Touch ID and A13 Bionic performance.",
    specs: {
      Display: "4.7-inch LCD",
      Chip: "A13 Bionic",
      Camera: "12MP Single",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-12-pro-max",
    slug: "iphone-12-pro-max",
    name: "iPhone 12 Pro Max",
    category: "iPhone",
    series: "iPhone 12 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 290,
    images: getProductImages("iphone-12-pro-max", "iPhone"),
    colors: ["Pacific Blue", "Graphite", "Gold", "Silver"],
    storage: ["128GB", "256GB", "512GB"],
    condition: ["Used", "Refurbished"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "The first 6.7-inch flat-edge model with HDR Dolby Vision video support.",
    specs: {
      Display: "6.7-inch OLED",
      Chip: "A14 Bionic",
      Camera: "12MP Triple-Lens",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-12-pro",
    slug: "iphone-12-pro",
    name: "iPhone 12 Pro",
    category: "iPhone",
    series: "iPhone 12 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.7,
    reviewCount: 204,
    images: getProductImages("iphone-12-pro", "iPhone"),
    colors: ["Pacific Blue", "Graphite", "Gold"],
    storage: ["128GB", "256GB", "512GB"],
    condition: ["Used", "Refurbished"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Flat-edge design with premium surgical-grade stainless steel band.",
    specs: {
      Display: "6.1-inch OLED",
      Chip: "A14 Bionic",
      Camera: "12MP Triple-Lens",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-12",
    slug: "iphone-12",
    name: "iPhone 12",
    category: "iPhone",
    series: "iPhone 12 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.7,
    reviewCount: 382,
    images: getProductImages("iphone-12", "iPhone"),
    colors: ["Black", "White", "Blue", "Green", "Red"],
    storage: ["64GB", "128GB", "256GB"],
    condition: ["Used", "Refurbished"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "6.1-inch Super Retina XDR OLED display, MagSafe support, and A14 Bionic power.",
    specs: {
      Display: "6.1-inch OLED",
      Chip: "A14 Bionic",
      Camera: "12MP Dual",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-12-mini",
    slug: "iphone-12-mini",
    name: "iPhone 12 Mini",
    category: "iPhone",
    series: "iPhone 12 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.6,
    reviewCount: 130,
    images: getProductImages("iphone-12-mini", "iPhone"),
    colors: ["Black", "White", "Blue", "Green"],
    storage: ["64GB", "128GB"],
    condition: ["Used", "Refurbished"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description: "Extremely compact 5.4-inch display with full 5G speeds.",
    specs: {
      Display: "5.4-inch OLED",
      Chip: "A14 Bionic",
      Camera: "12MP Dual",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-11-pro-max",
    slug: "iphone-11-pro-max",
    name: "iPhone 11 Pro Max",
    category: "iPhone",
    series: "iPhone 11 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 420,
    images: getProductImages("iphone-11-pro-max", "iPhone"),
    colors: ["Midnight Green", "Space Gray", "Gold", "Silver"],
    storage: ["64GB", "256GB", "512GB"],
    condition: ["Used", "Refurbished"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "The first Pro Max iPhone with a premium triple-camera arrangement.",
    specs: {
      Display: "6.5-inch Super Retina",
      Chip: "A13 Bionic",
      Camera: "12MP Triple-Lens",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-11-pro",
    slug: "iphone-11-pro",
    name: "iPhone 11 Pro",
    category: "iPhone",
    series: "iPhone 11 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 310,
    images: getProductImages("iphone-11-pro", "iPhone"),
    colors: ["Midnight Green", "Space Gray", "Gold"],
    storage: ["64GB", "256GB", "512GB"],
    condition: ["Used", "Refurbished"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "5.8-inch display, triple cameras with night mode, and matte glass back.",
    specs: {
      Display: "5.8-inch Super Retina",
      Chip: "A13 Bionic",
      Camera: "12MP Triple-Lens",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-11",
    slug: "iphone-11",
    name: "iPhone 11",
    category: "iPhone",
    series: "iPhone 11 Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.7,
    reviewCount: 520,
    images: getProductImages("iphone-11", "iPhone"),
    colors: ["Black", "White", "Yellow", "Purple", "Green", "Red"],
    storage: ["64GB", "128GB", "256GB"],
    condition: ["Used", "Refurbished"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Vibrant glass design with dual camera (Wide and Ultra Wide) and Night Mode support.",
    specs: {
      Display: "6.1-inch Liquid Retina",
      Chip: "A13 Bionic",
      Camera: "12MP Dual",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-xr",
    slug: "iphone-xr",
    name: "iPhone XR",
    category: "iPhone",
    series: "Legacy Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.7,
    reviewCount: 395,
    images: getProductImages("iphone-xr", "iPhone"),
    colors: ["Blue", "Yellow", "Coral", "Red", "Black", "White"],
    storage: ["64GB", "128GB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Legacy Champion",
    description:
      "Vibrant liquid retina display with a highly responsive single-lens camera.",
    specs: {
      Display: "6.1-inch LCD",
      Chip: "A12 Bionic",
      Camera: "12MP Single",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-xs-max",
    slug: "iphone-xs-max",
    name: "iPhone XS Max",
    category: "iPhone",
    series: "Legacy Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 280,
    images: getProductImages("iphone-xs-max", "iPhone"),
    colors: ["Gold", "Space Gray", "Silver"],
    storage: ["64GB", "256GB", "512GB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "6.5-inch Super Retina display, dual camera system, and Smart HDR.",
    specs: {
      Display: "6.5-inch OLED",
      Chip: "A12 Bionic",
      Camera: "12MP Dual",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-xs",
    slug: "iphone-xs",
    name: "iPhone XS",
    category: "iPhone",
    series: "Legacy Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.7,
    reviewCount: 195,
    images: getProductImages("iphone-xs", "iPhone"),
    colors: ["Gold", "Space Gray", "Silver"],
    storage: ["64GB", "256GB", "512GB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "5.8-inch display, dual cameras, and beautiful surgical stainless steel chassis.",
    specs: {
      Display: "5.8-inch OLED",
      Chip: "A12 Bionic",
      Camera: "12MP Dual",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-x",
    slug: "iphone-x",
    name: "iPhone X",
    category: "iPhone",
    series: "Legacy Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 512,
    images: getProductImages("iphone-x", "iPhone"),
    colors: ["Space Gray", "Silver"],
    storage: ["64GB", "256GB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "10th Anniversary",
    description:
      "The historic all-screen iPhone X with Face ID, surgical stainless steel frame, and dual camera.",
    specs: {
      Display: "5.8-inch Super Retina",
      Chip: "A11 Bionic",
      Camera: "12MP Dual",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-8-plus",
    slug: "iphone-8-plus",
    name: "iPhone 8 Plus",
    category: "iPhone",
    series: "Legacy Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.7,
    reviewCount: 220,
    images: getProductImages("iphone-8-plus", "iPhone"),
    colors: ["Gold", "Silver", "Space Gray"],
    storage: ["64GB", "256GB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Classic design with high-quality glass back, dual camera, and Portrait Mode support.",
    specs: {
      Display: "5.5-inch LCD",
      Chip: "A11 Bionic",
      Camera: "12MP Dual",
      Charging: "Lightning Wireless"
    }
  },
  {
    id: "iphone-8",
    slug: "iphone-8",
    name: "iPhone 8",
    category: "iPhone",
    series: "Legacy Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.6,
    reviewCount: 310,
    images: getProductImages("iphone-8", "iPhone"),
    colors: ["Gold", "Silver", "Space Gray"],
    storage: ["64GB", "256GB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Compact 4.7-inch display, glass body, wireless charging compatibility.",
    specs: {
      Display: "4.7-inch LCD",
      Chip: "A11 Bionic",
      Camera: "12MP Single",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-7-plus",
    slug: "iphone-7-plus",
    name: "iPhone 7 Plus",
    category: "iPhone",
    series: "Legacy Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.7,
    reviewCount: 420,
    images: getProductImages("iphone-7-plus", "iPhone"),
    colors: ["Black", "Jet Black", "Rose Gold", "Gold", "Silver"],
    storage: ["32GB", "128GB", "256GB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "The first iPhone with a dual-camera setup for Portrait Mode and water resistance.",
    specs: {
      Display: "5.5-inch LCD",
      Chip: "A10 Fusion",
      Camera: "12MP Dual",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-7",
    slug: "iphone-7",
    name: "iPhone 7",
    category: "iPhone",
    series: "Legacy Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.6,
    reviewCount: 380,
    images: getProductImages("iphone-7", "iPhone"),
    colors: ["Black", "Jet Black", "Gold", "Silver"],
    storage: ["32GB", "128GB", "256GB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Water resistant, A10 Fusion chip, and a solid-state Home button.",
    specs: {
      Display: "4.7-inch LCD",
      Chip: "A10 Fusion",
      Camera: "12MP Single",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-se",
    slug: "iphone-se",
    name: "iPhone SE (1st Gen)",
    category: "iPhone",
    series: "Vintage Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 150,
    images: getProductImages("iphone-se", "iPhone"),
    colors: ["Rose Gold", "Gold", "Silver", "Space Gray"],
    storage: ["16GB", "32GB", "64GB", "128GB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Vintage Classic",
    description:
      "A beloved 4-inch design with the powerful guts of the iPhone 6s.",
    specs: {
      Display: "4.0-inch LCD",
      Chip: "A9",
      Camera: "12MP Single",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-6s-plus",
    slug: "iphone-6s-plus",
    name: "iPhone 6s Plus",
    category: "iPhone",
    series: "Vintage Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.7,
    reviewCount: 190,
    images: getProductImages("iphone-6s-plus", "iPhone"),
    colors: ["Rose Gold", "Gold", "Silver", "Space Gray"],
    storage: ["16GB", "32GB", "64GB", "128GB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "5.5-inch display featuring 3D Touch and optical image stabilization.",
    specs: {
      Display: "5.5-inch LCD",
      Chip: "A9",
      Camera: "12MP Single",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-6s",
    slug: "iphone-6s",
    name: "iPhone 6s",
    category: "iPhone",
    series: "Vintage Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.6,
    reviewCount: 290,
    images: getProductImages("iphone-6s", "iPhone"),
    colors: ["Rose Gold", "Gold", "Silver", "Space Gray"],
    storage: ["16GB", "32GB", "64GB", "128GB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Introduced 3D Touch, 12MP camera, and aluminum 7000 series body strength.",
    specs: {
      Display: "4.7-inch LCD",
      Chip: "A9",
      Camera: "12MP Single",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-6-plus",
    slug: "iphone-6-plus",
    name: "iPhone 6 Plus",
    category: "iPhone",
    series: "Vintage Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.6,
    reviewCount: 140,
    images: getProductImages("iphone-6-plus", "iPhone"),
    colors: ["Gold", "Silver", "Space Gray"],
    storage: ["16GB", "64GB", "128GB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "The first large-format 5.5-inch iPhone with optical image stabilization.",
    specs: {
      Display: "5.5-inch LCD",
      Chip: "A8",
      Camera: "8MP Single",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-6",
    slug: "iphone-6",
    name: "iPhone 6",
    category: "iPhone",
    series: "Vintage Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.5,
    reviewCount: 310,
    images: getProductImages("iphone-6", "iPhone"),
    colors: ["Gold", "Silver", "Space Gray"],
    storage: ["16GB", "64GB", "128GB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Historic redesign bringing curved thin aluminium chassis and 4.7-inch display.",
    specs: {
      Display: "4.7-inch LCD",
      Chip: "A8",
      Camera: "8MP Single",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-5s",
    slug: "iphone-5s",
    name: "iPhone 5s",
    category: "iPhone",
    series: "Vintage Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.7,
    reviewCount: 220,
    images: getProductImages("iphone-5s", "iPhone"),
    colors: ["Gold", "Silver", "Space Gray"],
    storage: ["16GB", "32GB", "64GB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Touch ID Debut",
    description:
      "Introduced the biometric Touch ID sensor, 64-bit A7 chip, and dual-tone flash.",
    specs: {
      Display: "4.0-inch Retina",
      Chip: "A7 64-bit",
      Camera: "8MP Single",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-5c",
    slug: "iphone-5c",
    name: "iPhone 5c",
    category: "iPhone",
    series: "Vintage Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.5,
    reviewCount: 110,
    images: getProductImages("iphone-5c", "iPhone"),
    colors: ["Blue", "Green", "Pink", "Yellow", "White"],
    storage: ["8GB", "16GB", "32GB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Vibrant, glossy polycarbonate body designs with standard A6 performance.",
    specs: {
      Display: "4.0-inch Retina",
      Chip: "A6",
      Camera: "8MP Single",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-5",
    slug: "iphone-5",
    name: "iPhone 5",
    category: "iPhone",
    series: "Vintage Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.6,
    reviewCount: 180,
    images: getProductImages("iphone-5", "iPhone"),
    colors: ["Black & Slate", "White & Silver"],
    storage: ["16GB", "32GB", "64GB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "The first 4-inch tall design featuring the newly designed Lightning interface.",
    specs: {
      Display: "4.0-inch Retina",
      Chip: "A6",
      Camera: "8MP Single",
      Charging: "Lightning"
    }
  },
  {
    id: "iphone-4s",
    slug: "iphone-4s",
    name: "iPhone 4s",
    category: "iPhone",
    series: "Vintage Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.7,
    reviewCount: 205,
    images: getProductImages("iphone-4s", "iPhone"),
    colors: ["Black", "White"],
    storage: ["8GB", "16GB", "32GB", "64GB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Siri Debut",
    description:
      "Introduced Siri voice assistant, dual-antenna design, and A5 dual-core chip performance.",
    specs: {
      Display: "3.5-inch Retina",
      Chip: "A5 Dual-Core",
      Camera: "8MP Single",
      Charging: "30-Pin"
    }
  },
  {
    id: "iphone-4",
    slug: "iphone-4",
    name: "iPhone 4",
    category: "iPhone",
    series: "Vintage Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.7,
    reviewCount: 295,
    images: getProductImages("iphone-4", "iPhone"),
    colors: ["Black", "White"],
    storage: ["8GB", "16GB", "32GB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Retina Display",
    description:
      "Introduced the super-crisp Retina Display, flat glass construction, and front-facing camera.",
    specs: {
      Display: "3.5-inch Retina",
      Chip: "A4",
      Camera: "5MP Single",
      Charging: "30-Pin"
    }
  },
  {
    id: "iphone-3gs",
    slug: "iphone-3gs",
    name: "iPhone 3GS",
    category: "iPhone",
    series: "Vintage Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.6,
    reviewCount: 140,
    images: getProductImages("iphone-3gs", "iPhone"),
    colors: ["Black", "White"],
    storage: ["8GB", "16GB", "32GB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Video Recording",
    description:
      "Introduced video recording capabilities, voice control, and twice the processing speeds.",
    specs: {
      Display: "3.5-inch LCD",
      Chip: "600MHz ARM",
      Camera: "3MP Auto-Focus",
      Charging: "30-Pin"
    }
  },
  {
    id: "iphone-3g",
    slug: "iphone-3g",
    name: "iPhone 3G",
    category: "iPhone",
    series: "Vintage Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.5,
    reviewCount: 220,
    images: getProductImages("iphone-3g", "iPhone"),
    colors: ["Black", "White"],
    storage: ["8GB", "16GB"],
    condition: ["Refurbished", "Used"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "App Store Debut",
    description:
      "Introduced 3G network compatibility, GPS mapping, and the launch of the App Store.",
    specs: {
      Display: "3.5-inch LCD",
      Chip: "412MHz ARM",
      Camera: "2MP Single",
      Charging: "30-Pin"
    }
  },
  {
    id: "iphone-1st-gen",
    slug: "iphone-1st-gen",
    name: "iPhone (1st Gen)",
    category: "iPhone",
    series: "Vintage Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 5.0,
    reviewCount: 500,
    images: getProductImages("iphone-1st-gen", "iPhone"),
    colors: ["Silver"],
    storage: ["4GB", "8GB", "16GB"],
    condition: ["Used", "Refurbished"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Historical Collector",
    description:
      "The historical original iPhone released in 2007 by Steve Jobs. A legendary multi-touch collector's item.",
    specs: {
      Display: "3.5-inch Multi-Touch",
      Chip: "412MHz ARM",
      Camera: "2MP",
      Interface: "Original OS"
    }
  },

  // ===================================
  // MAC / MACBOOK CATALOG
  // ===================================
  {
    id: "macbook-air-13",
    slug: "macbook-air-13",
    name: 'MacBook Air 13" M3',
    category: "MacBook",
    series: "MacBook Air",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.9,
    reviewCount: 165,
    images: getProductImages("macbook-air-13", "MacBook"),
    colors: ["Midnight", "Starlight", "Space Gray", "Silver"],
    storage: ["256GB SSD", "512GB SSD", "1TB SSD"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month TroyX warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Top Seller Laptop",
    description:
      "Lean, mean M3 machine. Ultra-thin fanless design, up to 18 hours battery life, Liquid Retina display.",
    specs: {
      Display: "13.6-inch Liquid Retina",
      Chip: "Apple M3 8-core CPU",
      Memory: "8GB/16GB Unified",
      Charging: "MagSafe 3"
    },
    bestSeller: true,
    newArrival: true
  },
  {
    id: "macbook-air-15",
    slug: "macbook-air-15",
    name: 'MacBook Air 15" M3',
    category: "MacBook",
    series: "MacBook Air",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.9,
    reviewCount: 98,
    images: getProductImages("macbook-air-15", "MacBook"),
    colors: ["Midnight", "Starlight", "Space Gray"],
    storage: ["256GB SSD", "512GB SSD", "1TB SSD"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month TroyX warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Immersive 15.3-inch display with powerful M3 performance and six-speaker sound system.",
    specs: {
      Display: "15.3-inch Liquid Retina",
      Chip: "Apple M3 8-core CPU",
      Memory: "16GB Unified",
      Charging: "MagSafe 3"
    },
    newArrival: true
  },
  {
    id: "macbook-pro-14",
    slug: "macbook-pro-14",
    name: 'MacBook Pro 14" M3 Pro',
    category: "MacBook",
    series: "MacBook Pro",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.9,
    reviewCount: 140,
    images: getProductImages("macbook-pro-14", "MacBook"),
    colors: ["Space Black", "Silver"],
    storage: ["512GB SSD", "1TB SSD", "2TB SSD"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month TroyX warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Pro Workstation",
    description:
      "M3 Pro chip with Liquid Retina XDR display, HDMI port, SDXC card slot, and Space Black finish.",
    specs: {
      Display: "14.2-inch XDR 120Hz",
      Chip: "Apple M3 Pro 11-core CPU",
      Memory: "18GB Unified",
      Charging: "MagSafe 3"
    },
    bestSeller: true
  },
  {
    id: "macbook-pro-16",
    slug: "macbook-pro-16",
    name: 'MacBook Pro 16" M3 Max',
    category: "MacBook",
    series: "MacBook Pro",
    price: 0,
    compareAtPrice: undefined,
    rating: 5.0,
    reviewCount: 82,
    images: getProductImages("macbook-pro-16", "MacBook"),
    colors: ["Space Black", "Silver"],
    storage: ["1TB SSD", "2TB SSD", "4TB SSD"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month TroyX warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Extreme Power",
    description:
      "The ultimate laptop for developers, 3D artists, and 8K video editors with M3 Max horsepower.",
    specs: {
      Display: "16.2-inch XDR 120Hz",
      Chip: "Apple M3 Max 16-core CPU",
      Memory: "36GB Unified",
      Charging: "MagSafe 3"
    }
  },
  {
    id: "imac-24",
    slug: "imac-24",
    name: 'iMac 24" M3 All-In-One',
    category: "MacBook",
    series: "iMac",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 46,
    images: getProductImages("imac-24", "MacBook"),
    colors: ["Blue", "Green", "Pink", "Silver"],
    storage: ["256GB SSD", "512GB SSD"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Striking 24-inch 4.5K Retina display, 1080p FaceTime camera, and color-matched Magic Keyboard.",
    specs: {
      Display: "24-inch 4.5K Retina",
      Chip: "Apple M3 8-core CPU",
      Memory: "8GB Unified",
      Ports: "Thunderbolt 4"
    }
  },
  {
    id: "mac-mini",
    slug: "mac-mini",
    name: "Mac Mini M2 Pro",
    category: "MacBook",
    series: "Mac Desktop",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 92,
    images: getProductImages("mac-mini", "MacBook"),
    colors: ["Silver"],
    storage: ["256GB SSD", "512GB SSD"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Compact Workstation",
    description:
      "Compact desktop powerhouse with M2 speed, versatile ports, and low power consumption.",
    specs: {
      Display: "External Monitor Support",
      Chip: "Apple M2 8-core CPU",
      Memory: "8GB/16GB Unified"
    }
  },
  {
    id: "mac-studio",
    slug: "mac-studio",
    name: "Mac Studio M2 Max",
    category: "MacBook",
    series: "Mac Desktop",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.9,
    reviewCount: 38,
    images: getProductImages("mac-studio", "MacBook"),
    colors: ["Silver"],
    storage: ["512GB SSD", "1TB SSD"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Outrageous performance and extensive connectivity in an incredibly compact footprint.",
    specs: {
      Display: "Up to 8 Displays",
      Chip: "Apple M2 Max 12-core",
      Memory: "32GB Unified"
    }
  },
  {
    id: "studio-display",
    slug: "studio-display",
    name: 'Apple Studio Display 27"',
    category: "MacBook",
    series: "Displays",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 54,
    images: getProductImages("studio-display", "MacBook"),
    colors: ["Silver"],
    storage: ["Standard Glass", "Nano-Texture Glass"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Immersive 27-inch 5K Retina display with 12MP Ultra Wide camera, studio-quality mics, and 6-speaker audio.",
    specs: {
      Display: "27-inch 5K Retina 600 nits",
      Camera: "12MP Ultra Wide Center Stage",
      Audio: "Spatial Audio 6-Speakers"
    }
  },

  // ===================================
  // IPAD CATALOG
  // ===================================
  {
    id: "ipad-pro-13-m4",
    slug: "ipad-pro-13-m4",
    name: 'iPad Pro 13" M4',
    category: "iPad",
    series: "iPad Pro",
    price: 0,
    compareAtPrice: undefined,
    rating: 5.0,
    reviewCount: 78,
    images: getProductImages("ipad-pro-13-m4", "iPad"),
    colors: ["Space Black", "Silver"],
    storage: ["256GB", "512GB", "1TB", "2TB"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month TroyX warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Ultra Thin M4",
    description:
      "Breakthrough Ultra Retina XDR Tandem OLED display, ridiculously thin design, powered by M4 chip.",
    specs: {
      Display: "13-inch Tandem OLED",
      Chip: "Apple M4",
      Camera: "12MP Wide 4K Video",
      Accessories: "Apple Pencil Pro"
    },
    bestSeller: true,
    newArrival: true
  },
  {
    id: "ipad-pro-11-m4",
    slug: "ipad-pro-11-m4",
    name: 'iPad Pro 11" M4',
    category: "iPad",
    series: "iPad Pro",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.9,
    reviewCount: 65,
    images: getProductImages("ipad-pro-11-m4", "iPad"),
    colors: ["Space Black", "Silver"],
    storage: ["256GB", "512GB", "1TB"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Portable 11-inch Ultra Retina XDR Tandem OLED display with extreme M4 graphics.",
    specs: {
      Display: "11-inch Tandem OLED",
      Chip: "Apple M4",
      Camera: "12MP Wide",
      Charging: "USB-C Thunderbolt"
    },
    newArrival: true
  },
  {
    id: "ipad-air-11",
    slug: "ipad-air-11",
    name: 'iPad Air 11" M2',
    category: "iPad",
    series: "iPad Air",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 112,
    images: getProductImages("ipad-air-11", "iPad"),
    colors: ["Space Gray", "Starlight", "Purple", "Blue"],
    storage: ["128GB", "256GB", "512GB"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Versatile Choice",
    description:
      "Fresh M2 performance, Liquid Retina display, Touch ID, and Apple Pencil Pro support.",
    specs: {
      Display: "11-inch Liquid Retina",
      Chip: "Apple M2",
      Camera: "12MP Center Stage"
    }
  },
  {
    id: "ipad-11th-gen",
    slug: "ipad-11th-gen",
    name: "iPad 10th Gen (10.9-inch)",
    category: "iPad",
    series: "Standard iPad",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.7,
    reviewCount: 190,
    images: getProductImages("ipad-11th-gen", "iPad"),
    colors: ["Blue", "Pink", "Yellow", "Silver"],
    storage: ["64GB", "256GB"],
    condition: ["New", "Refurbished"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Best Value iPad",
    description:
      "All-screen design with 10.9-inch Liquid Retina display, A14 Bionic chip, landscape front camera.",
    specs: {
      Display: "10.9-inch Liquid Retina",
      Chip: "A14 Bionic",
      Camera: "12MP Landscape"
    },
    deal: true
  },
  {
    id: "ipad-mini",
    slug: "ipad-mini",
    name: "iPad Mini 7 (A17 Pro)",
    category: "iPad",
    series: "iPad Mini",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 52,
    images: getProductImages("ipad-mini", "iPad"),
    colors: ["Space Gray", "Starlight", "Purple", "Blue"],
    storage: ["128GB", "256GB", "512GB"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Mega power in mini size. 8.3-inch Liquid Retina display powered by A17 Pro chip and Apple Intelligence.",
    specs: {
      Display: "8.3-inch Liquid Retina",
      Chip: "A17 Pro",
      Stylus: "Apple Pencil Pro Support"
    },
    newArrival: true
  },

  // ===================================
  // APPLE WATCH CATALOG
  // ===================================
  {
    id: "apple-watch-ultra-2",
    slug: "apple-watch-ultra-2",
    name: "Apple Watch Ultra 2",
    category: "Apple Watch",
    series: "Ultra Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.9,
    reviewCount: 135,
    images: getProductImages("apple-watch-ultra-2", "Apple Watch"),
    colors: ["Black Titanium", "Natural Titanium"],
    storage: ["64GB"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month TroyX warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Rugged Outdoor",
    description:
      "The most capable Apple Watch with 3000 nits display, S9 SiP Double Tap gesture, precision GPS.",
    specs: {
      Case: "49mm Titanium",
      Display: "3000 nits Sapphire",
      Battery: "Up to 72 hrs Low Power"
    },
    bestSeller: true
  },
  {
    id: "apple-watch-series-10",
    slug: "apple-watch-series-10",
    name: "Apple Watch Series 10",
    category: "Apple Watch",
    series: "Series 10",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 96,
    images: getProductImages("apple-watch-series-10", "Apple Watch"),
    colors: ["Jet Black", "Rose Gold", "Silver", "Slate Titanium"],
    storage: ["64GB"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Thinnest Design",
    description:
      "Thinnest Apple Watch ever with largest display area, wide-angle OLED display, and depth gauge.",
    specs: {
      Case: "42mm / 46mm Aluminum or Titanium",
      Display: "Wide-Angle OLED",
      Charging: "Fast Charge 80% in 30min"
    },
    newArrival: true
  },
  {
    id: "apple-watch-se",
    slug: "apple-watch-se",
    name: "Apple Watch SE (2nd Gen)",
    category: "Apple Watch",
    series: "SE Series",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.7,
    reviewCount: 210,
    images: getProductImages("apple-watch-se", "Apple Watch"),
    colors: ["Midnight", "Starlight", "Silver"],
    storage: ["32GB"],
    condition: ["New", "Refurbished"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Essential fitness tracking, Heart Rate notifications, Crash Detection, and water resistance to 50m.",
    specs: {
      Case: "40mm / 44mm Aluminum",
      Sensors: "Optical Heart Rate",
      Water: "50m Water Resistant"
    },
    deal: true
  },

  // ===================================
  // AIRPODS & AUDIO CATALOG
  // ===================================
  {
    id: "airpods-pro-2",
    slug: "airpods-pro-2",
    name: "AirPods Pro 2 (USB-C)",
    category: "AirPods",
    series: "Pro Audio",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.9,
    reviewCount: 380,
    images: getProductImages("airpods-pro-2", "AirPods"),
    colors: ["White"],
    storage: ["USB-C MagSafe Case"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Best Noise Cancelling",
    description:
      "Up to 2x more Active Noise Cancellation, Adaptive Audio, Conversation Awareness, and USB-C MagSafe case.",
    specs: {
      ANC: "2x Active Noise Cancellation",
      Chip: "H2 Headphone Chip",
      Battery: "Up to 30 hrs with Case"
    },
    bestSeller: true
  },
  {
    id: "airpods-4-anc",
    slug: "airpods-4-anc",
    name: "AirPods 4 with Active Noise Cancellation",
    category: "AirPods",
    series: "AirPods 4",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 84,
    images: getProductImages("airpods-4-anc", "AirPods"),
    colors: ["White"],
    storage: ["Wireless USB-C Case"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Open-Ear ANC",
    description:
      "First open-ear design with Active Noise Cancellation, Transparency mode, and H2 chip clarity.",
    specs: {
      ANC: "Open-Ear Active Noise Cancellation",
      Chip: "H2 Chip",
      Charging: "USB-C + Qi Wireless"
    },
    newArrival: true
  },
  {
    id: "airpods-4",
    slug: "airpods-4",
    name: "AirPods 4",
    category: "AirPods",
    series: "AirPods 4",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.7,
    reviewCount: 105,
    images: getProductImages("airpods-4", "AirPods"),
    colors: ["White"],
    storage: ["USB-C Case"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Re-engineered acoustic architecture with Personalized Spatial Audio and head tracking.",
    specs: {
      Audio: "Personalized Spatial Audio",
      Chip: "H2 Chip",
      Case: "USB-C Compact Case"
    }
  },
  {
    id: "airpods-max",
    slug: "airpods-max",
    name: "AirPods Max (USB-C)",
    category: "AirPods",
    series: "Max Headband",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 142,
    images: getProductImages("airpods-max", "AirPods"),
    colors: ["Midnight", "Starlight", "Blue", "Purple", "Orange"],
    storage: ["USB-C Smart Case"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Over-Ear Luxury",
    description:
      "High-fidelity audio masterwork with custom dynamic driver, Pro Active Noise Cancellation, and USB-C.",
    specs: {
      Audio: "High-Fidelity Dynamic Driver",
      ANC: "Pro Active Noise Cancellation",
      Charging: "USB-C"
    }
  },

  // ===================================
  // ACCESSORIES & CHARGERS
  // ===================================
  {
    id: "apple-pencil-pro",
    slug: "apple-pencil-pro",
    name: "Apple Pencil Pro",
    category: "Accessories",
    series: "Pencil",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.9,
    reviewCount: 75,
    images: getProductImages("apple-pencil-pro", "Accessories"),
    colors: ["White"],
    storage: ["Magnetic Wireless"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Squeeze & Barrel Roll",
    description:
      "Haptic feedback engine, squeeze gesture toolbar, barrel roll rotation sensor, and Find My location.",
    specs: {
      Compatibility: "iPad Pro M4 / iPad Air M2",
      Precision: "Pixel-perfect low latency"
    }
  },
  {
    id: "magic-keyboard",
    slug: "magic-keyboard",
    name: "Magic Keyboard for iPad Pro 13-inch",
    category: "Accessories",
    series: "Keyboards",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 48,
    images: getProductImages("magic-keyboard", "Accessories"),
    colors: ["Space Black", "White"],
    storage: ["Aluminum Palm Rest"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Cantilever floating design, glass haptic trackpad, function row keys, and aluminum wrist rest.",
    specs: { Trackpad: "Haptic Glass", Construction: "Machined Aluminum" }
  },
  {
    id: "magsafe-charger",
    slug: "magsafe-charger",
    name: "Apple MagSafe Charger (25W)",
    category: "Chargers",
    series: "MagSafe",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.7,
    reviewCount: 280,
    images: getProductImages("magsafe-charger", "Chargers"),
    colors: ["Silver/White"],
    storage: ["1m Cable", "2m Cable"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Fast wireless charging up to 25W for iPhone 16 series with perfectly aligned magnetic snap.",
    specs: { Speed: "Up to 25W Fast Charging", Connector: "USB-C" }
  },
  {
    id: "airtag-4pack",
    slug: "airtag-4pack",
    name: "Apple AirTag (4-Pack)",
    category: "Accessories",
    series: "Find My",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.9,
    reviewCount: 310,
    images: getProductImages("airtag-4pack", "Accessories"),
    colors: ["White/Stainless Steel"],
    storage: ["4 Tags included"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Must-Have Accessory",
    description:
      "Keep track of keys, bags, luggage, and electronics in the Find My app with Precision Finding.",
    specs: {
      Battery: "User Replaceable CR2032",
      Water: "IP67 Water-Resistant"
    },
    bestSeller: true
  },

  // ===================================
  // GAMING CONSOLES & ACCESSORIES
  // ===================================
  {
    id: "ps5-pro",
    slug: "ps5-pro",
    name: "PlayStation 5 Pro Console",
    category: "Gaming",
    series: "PlayStation",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.9,
    reviewCount: 156,
    images: getProductImages("ps5-pro", "Gaming"),
    colors: ["White/Black"],
    storage: ["2TB High-Speed SSD"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month TroyX Gaming warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Flagship 4K 120fps",
    description:
      "PlayStation Spectral Super Resolution (PSSR) AI upscaling, upgraded GPU, 2TB SSD, and 60fps Ray Tracing.",
    specs: {
      Storage: "2TB NVMe SSD",
      Output: "4K 120Hz / 8K VRR",
      Audio: "3D Tempest Audio"
    },
    bestSeller: true,
    newArrival: true
  },
  {
    id: "ps5-slim",
    slug: "ps5-slim",
    name: "PlayStation 5 Slim Digital / Disc Edition",
    category: "Gaming",
    series: "PlayStation",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 240,
    images: getProductImages("ps5-slim", "Gaming"),
    colors: ["White"],
    storage: ["1TB SSD"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Popular Console",
    description:
      "Sleeker design with 1TB SSD, DualSense wireless controller, 4K HDR ray-traced visuals.",
    specs: { Storage: "1TB Custom SSD", Controller: "DualSense Haptic" }
  },
  {
    id: "xbox-series-x",
    slug: "xbox-series-x",
    name: "Xbox Series X (1TB / 2TB Galaxy Black)",
    category: "Gaming",
    series: "Xbox",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 110,
    images: getProductImages("xbox-series-x", "Gaming"),
    colors: ["Matte Black", "Galaxy Black Special Edition"],
    storage: ["1TB SSD", "2TB SSD"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "The fastest, most powerful Xbox ever with 12 teraflops GPU horsepower and Quick Resume.",
    specs: { GPU: "12 TFLOPS RDNA 2", Storage: "1TB Custom NVMe" }
  },
  {
    id: "nintendo-switch-oled",
    slug: "nintendo-switch-oled",
    name: "Nintendo Switch OLED Model",
    category: "Gaming",
    series: "Nintendo",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 175,
    images: getProductImages("nintendo-switch-oled", "Gaming"),
    colors: ["White Joy-Con", "Neon Red/Blue", "Mario Red Edition"],
    storage: ["64GB Internal"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Handheld Champion",
    description:
      "Vibrant 7-inch OLED screen, wide adjustable stand, wired LAN dock port, 64GB storage.",
    specs: {
      Display: "7-inch OLED Touchscreen",
      Battery: "Up to 9 hrs Handheld"
    }
  },
  {
    id: "dualsense-edge-controller",
    slug: "dualsense-edge-controller",
    name: "PlayStation DualSense Edge Wireless Controller",
    category: "Controllers",
    series: "PlayStation",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.9,
    reviewCount: 64,
    images: getProductImages("dualsense-edge-controller", "Gaming"),
    colors: ["White/Black"],
    storage: ["Carrying Case included"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Pro Esports Controller",
    description:
      "Customizable controls, remappable rear back buttons, changeable stick caps and module triggers.",
    specs: {
      Customization: "Remappable Back Buttons",
      Haptics: "Adaptive Triggers"
    }
  },
  {
    id: "xbox-wireless-controller",
    slug: "xbox-wireless-controller",
    name: "Xbox Wireless Controller",
    category: "Controllers",
    series: "Xbox",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 42,
    images: getProductImages("xbox-wireless-controller", "Controllers"),
    colors: ["Carbon Black", "Robot White", "Shock Blue"],
    storage: ["Wireless"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Controller",
    description:
      "Official Xbox Wireless Controller catalogue entry prepared for Xbox Series X|S, Xbox One, Windows PC, and mobile gaming setups.",
    specs: {
      Compatibility: "Xbox Series X|S / Xbox One / Windows",
      Connection: "Bluetooth / Xbox Wireless",
      Power: "AA batteries or rechargeable pack"
    }
  },
  {
    id: "nintendo-switch-pro-controller",
    slug: "nintendo-switch-pro-controller",
    name: "Nintendo Switch Pro Controller",
    category: "Controllers",
    series: "Nintendo",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 38,
    images: getProductImages("nintendo-switch-pro-controller", "Controllers"),
    colors: ["Black"],
    storage: ["USB-C charging cable"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Nintendo Switch Pro Controller catalogue entry for docked and tabletop play with motion controls, HD rumble, and amiibo support.",
    specs: {
      Compatibility: "Nintendo Switch family",
      Connection: "Bluetooth / USB-C",
      Features: "Motion controls, HD rumble, NFC"
    }
  },
  {
    id: "pulse-elite-wireless-headset",
    slug: "pulse-elite-wireless-headset",
    name: "PlayStation Pulse Elite Wireless Headset",
    category: "Gaming Headsets",
    series: "PlayStation",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 28,
    images: getProductImages("pulse-elite-wireless-headset", "Gaming Headsets"),
    colors: ["White/Black"],
    storage: ["Wireless charging hanger"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Gaming Audio",
    description:
      "PlayStation Pulse Elite wireless headset catalogue entry for low-latency console audio, retractable microphone, and premium gaming chat.",
    specs: {
      Compatibility: "PS5 / PC / Mac / Mobile",
      Connection: "PlayStation Link / Bluetooth",
      Microphone: "Retractable boom"
    }
  },
  {
    id: "xbox-wireless-headset",
    slug: "xbox-wireless-headset",
    name: "Xbox Wireless Headset",
    category: "Gaming Headsets",
    series: "Xbox",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.7,
    reviewCount: 31,
    images: getProductImages("xbox-wireless-headset", "Gaming Headsets"),
    colors: ["Black"],
    storage: ["USB-C charging cable"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Xbox Wireless Headset catalogue entry for spatial audio, voice isolation, and direct pairing with Xbox consoles.",
    specs: {
      Compatibility: "Xbox Series X|S / Xbox One / Windows",
      Audio: "Spatial audio support",
      Charging: "USB-C"
    }
  },
  {
    id: "ps5-nvme-ssd-expansion",
    slug: "ps5-nvme-ssd-expansion",
    name: "PS5 Compatible NVMe SSD Expansion",
    category: "Gaming",
    series: "Storage Accessories",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 34,
    images: getProductImages("ps5-nvme-ssd-expansion", "Gaming"),
    colors: ["Black"],
    storage: ["1TB", "2TB", "4TB"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Storage",
    description:
      "PS5 compatible NVMe storage expansion catalogue entry. Final model, capacity, and heatsink compatibility are confirmed before sale.",
    specs: {
      Compatibility: "PlayStation 5 M.2 slot",
      Capacity: "1TB / 2TB / 4TB options",
      Requirement: "Heatsink-compatible NVMe SSD"
    }
  },
  {
    id: "xbox-storage-expansion-card",
    slug: "xbox-storage-expansion-card",
    name: "Xbox Storage Expansion Card",
    category: "Gaming",
    series: "Storage Accessories",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.8,
    reviewCount: 24,
    images: getProductImages("xbox-storage-expansion-card", "Gaming"),
    colors: ["Black"],
    storage: ["512GB", "1TB", "2TB"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Xbox Series X|S storage expansion catalogue entry for plug-in game storage with console-optimized performance.",
    specs: {
      Compatibility: "Xbox Series X|S",
      Capacity: "512GB / 1TB / 2TB options",
      Setup: "Plug-and-play expansion slot"
    }
  },
  {
    id: "dualsense-charging-station",
    slug: "dualsense-charging-station",
    name: "DualSense Charging Station",
    category: "Accessories",
    series: "Gaming Charging Docks",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.7,
    reviewCount: 33,
    images: getProductImages("dualsense-charging-station", "Accessories"),
    colors: ["White/Black"],
    storage: ["Two-controller dock"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    badge: "Charging Dock",
    description:
      "DualSense charging station catalogue entry for neatly charging up to two PlayStation wireless controllers.",
    specs: {
      Compatibility: "DualSense wireless controllers",
      Capacity: "Two controllers",
      Power: "AC charging dock"
    }
  },
  {
    id: "joy-con-charging-dock",
    slug: "joy-con-charging-dock",
    name: "Joy-Con Charging Dock",
    category: "Accessories",
    series: "Gaming Charging Docks",
    price: 0,
    compareAtPrice: undefined,
    rating: 4.6,
    reviewCount: 21,
    images: getProductImages("joy-con-charging-dock", "Accessories"),
    colors: ["Black"],
    storage: ["Four Joy-Con slots"],
    condition: ["New"],
    availability: "Available on request",
    warranty: "12-month warranty",
    deliveryEstimate: "Confirmed after availability check",
    description:
      "Nintendo Switch Joy-Con charging dock catalogue entry for organizing and charging multiple controllers.",
    specs: {
      Compatibility: "Nintendo Switch Joy-Con",
      Capacity: "Up to four Joy-Con controllers",
      Power: "USB charging dock"
    }
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((product) => product.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(
    (product) => product.bestSeller || product.newArrival || product.deal
  );
}

export const featuredGroups = {
  bestSellers: products.filter((p) => p.bestSeller),
  newArrivals: products.filter((p) => p.newArrival),
  deals: products.filter((p) => p.deal),
  gaming: products.filter((p) =>
    [
      "Gaming",
      "PlayStation",
      "Xbox",
      "Nintendo",
      "Controllers",
      "Gaming Headsets"
    ].includes(p.category)
  )
};
