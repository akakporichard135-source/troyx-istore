import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getPublishedSections, getPageBySlug } from "@/lib/storage/db";
import SectionRenderer from "@/components/public/SectionRenderer";
import { formatGHS } from "@/lib/pricing";
import { ChevronRight } from "lucide-react";

interface LearnMorePageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 0;

export default async function LearnMorePage({ params }: LearnMorePageProps) {
  const product = await getProductBySlug(params.slug);
  const page = (await getPageBySlug(`learn-more-${params.slug}`)) || (await getPageBySlug(params.slug));

  // Fetch published cinematic sections attached to this Learn More page
  const sections = page ? await getPublishedSections(page.id) : [];

  if (!product && (!sections || sections.length === 0)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sticky Cinematic Subnav */}
      <div className="border-b border-zinc-800 bg-black/80 backdrop-blur-md sticky top-12 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm sm:text-base text-white tracking-tight">
              {product?.name || page?.title || "Product Overview"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {product && (
              <span className="text-zinc-400 hidden sm:inline">
                From {formatGHS(product.discountPrice ?? product.basePrice)}
              </span>
            )}
            {product && (
              <Link
                href={`/product/${product.slug}`}
                className="apple-btn-primary text-xs py-1.5 px-3"
              >
                Buy
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Render Cinematic Learn More Sections */}
      {sections.length > 0 ? (
        <div className="space-y-4">
          {sections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
        </div>
      ) : (
        /* Clean Intro Hero when sections are being drafted */
        <div className="py-24 px-4 sm:px-6 text-center max-w-3xl mx-auto space-y-6">
          <p className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
            TroyX iStore • Cinematic Introduction
          </p>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white">
            {product?.name}
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed font-light">
            {product?.description ||
              "Explore engineering breakthroughs, display technology, and all-day battery life."}
          </p>
          {product && (
            <div className="pt-4 flex items-center justify-center gap-4">
              <Link
                href={`/product/${product.slug}`}
                className="apple-btn-primary text-sm px-6 py-2.5"
              >
                Buy Now
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
