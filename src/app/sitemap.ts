import { MetadataRoute } from "next";
import { getPages, getProducts } from "@/lib/storage/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://troyxistore.com";

  // Fetch only PUBLISHED pages
  const pages = await getPages();
  const publishedPages = pages.filter((p) => p.isPublished);

  // Fetch only PUBLISHED products
  const products = await getProducts({ isPublished: true });

  const pageUrls: MetadataRoute.Sitemap = publishedPages.map((page) => ({
    url: `${baseUrl}/${page.slug === "home" ? "" : page.slug}`,
    lastModified: new Date(page.updatedAt || page.createdAt),
    changeFrequency: page.slug === "home" ? "daily" : "weekly",
    priority: page.slug === "home" ? 1.0 : 0.8,
  }));

  const productUrls: MetadataRoute.Sitemap = products.map((prod) => ({
    url: `${baseUrl}/product/${prod.slug}`,
    lastModified: new Date(prod.updatedAt || prod.createdAt),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...pageUrls, ...productUrls];
}
