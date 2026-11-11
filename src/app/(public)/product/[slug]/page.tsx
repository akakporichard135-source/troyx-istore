import React from "react";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/storage/db";
import ProductConfigurator from "@/components/public/ProductConfigurator";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 0;

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product || !product.isPublished) {
    notFound();
  }

  return <ProductConfigurator product={product} />;
}
