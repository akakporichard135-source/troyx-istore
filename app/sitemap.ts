import type { MetadataRoute } from "next";
import { products } from "@/database/products";
import { siteConfig } from "@/lib/site";

const staticRoutes = [
  "",
  "/shop",
  "/categories",
  "/iphones",
  "/macbooks",
  "/ipads",
  "/apple-watch",
  "/airpods",
  "/gaming-consoles",
  "/gaming-accessories",
  "/apple-accessories",
  "/cart",
  "/checkout",
  "/wishlist",
  "/compare",
  "/search",
  "/trade-in",
  "/repair-booking",
  "/contact",
  "/about",
  "/faq",
  "/privacy-policy",
  "/terms",
  "/shipping-policy"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7
    })),
    ...products.map((product) => ({
      url: `${siteConfig.url}/product/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8
    }))
  ];
}
