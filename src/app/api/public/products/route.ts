import { NextRequest, NextResponse } from "next/server";
import { getProductById, getProducts } from "@/lib/storage/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const category = searchParams.get("category") || undefined;

  if (id) {
    const product = await getProductById(id);
    if (!product || !product.isPublished) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  }

  const products = await getProducts({ category, isPublished: true });
  return NextResponse.json({ products });
}
