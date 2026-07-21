import type { MetadataRoute } from "next";
import { products } from "@/database/products";
import { initialVendors } from "@/database/vendors";
import { siteConfig } from "@/lib/site";

const staticRoutes = [
  "",
  "/shop",
  "/stores",
  "/sell",
  "/categories",
  "/cart",
  "/checkout",
  "/login",
  "/register",
  "/forgot-password",
  "/dashboard",
  "/wishlist",
  "/compare",
  "/order-tracking",
  "/contact",
  "/about",
  "/faq",
  "/trade-in",
  "/repair-booking",
  "/search",
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
    ...initialVendors.map((vendor) => ({
      url: `${siteConfig.url}/store/${vendor.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9
    })),
    ...products.map((product) => ({
      url: `${siteConfig.url}/product/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8
    }))
  ];
}
