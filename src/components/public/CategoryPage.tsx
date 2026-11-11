import React from "react";
import Link from "next/link";
import { MessageCircle, Shield, ArrowRight } from "lucide-react";
import { ProductRecord, ProductCategory, PageSection } from "@/lib/types";
import { formatGHS } from "@/lib/pricing";
import SectionRenderer from "./SectionRenderer";

interface CategoryPageProps {
  categoryTitle: string;
  categorySlug: ProductCategory | "all";
  tagline?: string;
  description?: string;
  products: ProductRecord[];
  sections?: PageSection[];
}

export default function CategoryPage({
  categoryTitle,
  categorySlug,
  tagline = "Original Apple Products",
  description,
  products,
  sections = [],
}: CategoryPageProps) {
  const publishedProducts = products.filter((p) => p.isPublished);
  const publishedSections = sections.filter((s) => s.isPublished);

  // Separate sections intended for top hero vs bottom storytelling/specs/faq
  const topSections = publishedSections.filter(
    (s) =>
      s.sectionType === "cinematic_hero" ||
      s.sectionType === "image_hero" ||
      s.sectionType === "video_hero" ||
      s.sectionType === "fullscreen_image" ||
      s.sectionType === "promo_banner"
  );
  const bottomSections = publishedSections.filter(
    (s) =>
      s.sectionType !== "cinematic_hero" &&
      s.sectionType !== "image_hero" &&
      s.sectionType !== "video_hero" &&
      s.sectionType !== "fullscreen_image" &&
      s.sectionType !== "promo_banner"
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Dynamic Top CMS Sections if published, or default Category Hero Header */}
      {topSections.length > 0 ? (
        <div className="w-full flex flex-col space-y-2">
          {topSections.map((sec) => (
            <SectionRenderer key={sec.id} section={sec} />
          ))}
        </div>
      ) : (
        <section className="border-b border-zinc-900 bg-gradient-to-b from-zinc-950 to-black py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto text-center space-y-3">
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
              {tagline}
            </p>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
              {categoryTitle}
            </h1>
            <p className="max-w-xl mx-auto text-sm sm:text-base text-zinc-400 font-light">
              {description ||
                `Explore genuine original Apple ${categoryTitle.toLowerCase()} hardware with warranty at TroyX iStore, Bawaleshie, East Legon.`}
            </p>
          </div>
        </section>
      )}

      {/* Subcategory Navigation Bar */}
      <div className="border-b border-zinc-900 bg-zinc-950/60 sticky top-12 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-6 overflow-x-auto text-xs text-zinc-400">
          <Link
            href="/store"
            className={`hover:text-white whitespace-nowrap ${categorySlug === "all" ? "text-white font-medium" : ""}`}
          >
            All Products
          </Link>
          <Link
            href="/iphone"
            className={`hover:text-white whitespace-nowrap ${categorySlug === "iphone" ? "text-white font-medium" : ""}`}
          >
            iPhone
          </Link>
          <Link
            href="/mac"
            className={`hover:text-white whitespace-nowrap ${categorySlug === "mac" ? "text-white font-medium" : ""}`}
          >
            Mac
          </Link>
          <Link
            href="/ipad"
            className={`hover:text-white whitespace-nowrap ${categorySlug === "ipad" ? "text-white font-medium" : ""}`}
          >
            iPad
          </Link>
          <Link
            href="/watch"
            className={`hover:text-white whitespace-nowrap ${categorySlug === "watch" ? "text-white font-medium" : ""}`}
          >
            Apple Watch
          </Link>
          <Link
            href="/airpods"
            className={`hover:text-white whitespace-nowrap ${categorySlug === "airpods" ? "text-white font-medium" : ""}`}
          >
            AirPods
          </Link>
          <Link
            href="/accessories"
            className={`hover:text-white whitespace-nowrap ${categorySlug === "accessories" ? "text-white font-medium" : ""}`}
          >
            Accessories
          </Link>
        </div>
      </div>

      {/* Product Grid or Clean Empty State */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {publishedProducts.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 space-y-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
              <Shield className="w-6 h-6 text-zinc-400" />
            </div>
            <h2 className="text-xl font-medium tracking-tight text-white">
              No {categoryTitle} Models Published Yet
            </h2>
            <p className="text-sm text-zinc-400">
              Our store administrators publish certified stock upon arrival at our East Legon
              showroom. Have a specific model in mind? Contact our sales team directly.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/233207137437?text=Hello%20TroyX%20iStore,%20I%20am%20inquiring%20about%20${encodeURIComponent(categoryTitle)}%20availability`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-4 py-2.5 rounded-full transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp 0207137437</span>
              </a>
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 border border-zinc-800 text-zinc-300 hover:text-white text-xs px-4 py-2.5 rounded-full transition-colors"
              >
                <span>Visit Showroom</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-[#161617] rounded-2xl border border-zinc-800/80 p-6 flex flex-col justify-between hover:border-zinc-700 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="uppercase tracking-wider font-semibold text-zinc-500 text-[10px]">
                      {product.condition}
                    </span>
                    {product.batteryHealth && (
                      <span className="text-[10px] text-zinc-400">
                        Battery: {product.batteryHealth}%
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-white tracking-tight">
                    {product.name}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2">
                    {product.description}
                  </p>

                  {product.images && product.images.length > 0 && (
                    <div className="aspect-square w-full my-4 rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-zinc-800/60 mt-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-zinc-500">Price</div>
                    <div className="text-base font-semibold text-white">
                      {formatGHS(product.discountPrice ?? product.basePrice)}
                    </div>
                  </div>
                  <Link
                    href={`/product/${product.slug}`}
                    className="apple-btn-primary text-xs"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Dynamic Bottom CMS Sections if published */}
      {bottomSections.length > 0 && (
        <div className="w-full flex flex-col space-y-2 pb-16 border-t border-zinc-900">
          {bottomSections.map((sec) => (
            <SectionRenderer key={sec.id} section={sec} />
          ))}
        </div>
      )}
    </div>
  );
}
