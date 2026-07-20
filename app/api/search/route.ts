import { NextRequest, NextResponse } from "next/server";
import { products } from "@/database/products";
import { rateLimit } from "@/lib/security";
import { searchSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request);
  if (limited) return limited;

  const parsed = searchSchema.safeParse({ q: request.nextUrl.searchParams.get("q") || "" });
  if (!parsed.success) return NextResponse.json({ error: "Search query is required" }, { status: 400 });

  const q = parsed.data.q.toLowerCase();
  const results = products.filter((product) =>
    [product.name, product.category, product.series, ...product.colors, ...product.storage, product.description]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );

  return NextResponse.json({ results });
}
