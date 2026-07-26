import type { Product, ProductCategory } from "@/types";

export type CategoryRoute = {
  key: string;
  path: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  description: string;
  categories: ProductCategory[];
  matches?: (product: Product) => boolean;
};

export const categoryRoutes: Record<string, CategoryRoute> = {
  iphones: {
    key: "iphones",
    path: "/iphones",
    title: "Latest iPhones",
    shortTitle: "iPhones",
    eyebrow: "Apple phones",
    description:
      "Explore verified iPhone models from iPhone 11 through the latest official generation.",
    categories: ["iPhone"]
  },
  macbooks: {
    key: "macbooks",
    path: "/macbooks",
    title: "MacBook Collection",
    shortTitle: "MacBooks",
    eyebrow: "Mac computers",
    description:
      "Shop MacBook Air, MacBook Pro, and Mac desktop options prepared for work, school, and creative teams.",
    categories: ["MacBook"]
  },
  ipads: {
    key: "ipads",
    path: "/ipads",
    title: "iPad Range",
    shortTitle: "iPads",
    eyebrow: "Apple tablets",
    description:
      "Discover iPad Pro, iPad Air, iPad mini, and standard iPad catalogue options.",
    categories: ["iPad"]
  },
  "apple-watch": {
    key: "apple-watch",
    path: "/apple-watch",
    title: "Apple Watch",
    shortTitle: "Watch",
    eyebrow: "Wearables",
    description:
      "Compare Apple Watch SE, Series, and Ultra models for fitness, health, and everyday use.",
    categories: ["Apple Watch"]
  },
  airpods: {
    key: "airpods",
    path: "/airpods",
    title: "AirPods",
    shortTitle: "AirPods",
    eyebrow: "Apple audio",
    description:
      "Browse AirPods, AirPods Pro, and AirPods Max options for calls, music, travel, and work.",
    categories: ["AirPods"]
  },
  "gaming-consoles": {
    key: "gaming-consoles",
    path: "/gaming-consoles",
    title: "Gaming Consoles",
    shortTitle: "Consoles",
    eyebrow: "Console gaming",
    description:
      "Shop PlayStation, Xbox, and Nintendo console catalogue entries with clear quote-based availability.",
    categories: ["Gaming"],
    matches: (product) =>
      product.category === "Gaming" &&
      !product.series.toLowerCase().includes("storage") &&
      !product.name.toLowerCase().includes("ssd") &&
      !product.name.toLowerCase().includes("storage")
  },
  "gaming-accessories": {
    key: "gaming-accessories",
    path: "/gaming-accessories",
    title: "Gaming Accessories",
    shortTitle: "Gaming Gear",
    eyebrow: "Controllers and add-ons",
    description:
      "Find controllers, headsets, storage upgrades, and charging docks for major console platforms.",
    categories: ["Controllers", "Gaming Headsets", "Accessories", "Gaming"],
    matches: (product) =>
      product.category === "Controllers" ||
      product.category === "Gaming Headsets" ||
      product.series.toLowerCase().includes("gaming") ||
      product.series.toLowerCase().includes("storage")
  },
  "apple-accessories": {
    key: "apple-accessories",
    path: "/apple-accessories",
    title: "Apple Accessories",
    shortTitle: "Accessories",
    eyebrow: "Essentials",
    description:
      "Browse Apple Pencil, Magic Keyboard, MagSafe, AirTag, chargers, cases, cables, and everyday add-ons.",
    categories: [
      "Accessories",
      "Cases",
      "Chargers",
      "Power Banks",
      "Screen Protectors",
      "Adapters",
      "Cables",
      "Speakers",
      "Smart Accessories"
    ],
    matches: (product) =>
      [
        "Accessories",
        "Cases",
        "Chargers",
        "Power Banks",
        "Screen Protectors",
        "Adapters",
        "Cables",
        "Speakers",
        "Smart Accessories"
      ].includes(product.category) &&
      !product.series.toLowerCase().includes("gaming")
  }
};

export const featuredCategoryRoutes = [
  categoryRoutes.iphones,
  categoryRoutes.macbooks,
  categoryRoutes.ipads,
  categoryRoutes["gaming-consoles"],
  categoryRoutes["apple-watch"],
  categoryRoutes.airpods,
  categoryRoutes["gaming-accessories"],
  categoryRoutes["apple-accessories"]
];

export function getCategoryRoute(key?: string) {
  if (!key) return undefined;
  return categoryRoutes[key];
}

export function getProductsForCategory(
  route: CategoryRoute,
  products: Product[]
) {
  if (route.matches) return products.filter(route.matches);
  return products.filter((product) =>
    route.categories.includes(product.category)
  );
}
