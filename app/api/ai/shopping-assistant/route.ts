import { NextRequest, NextResponse } from "next/server";
import { products } from "@/database/products";
import { rateLimit } from "@/lib/security";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 25);
  if (limited) return limited;

  const { message = "" } = await request.json();
  const lower = String(message).toLowerCase();
  const recommendations = products
    .filter((product) => {
      if (lower.includes("iphone")) return product.category === "iPhone";
      if (lower.includes("mac")) return product.category === "MacBook";
      if (lower.includes("accessor") || lower.includes("charger")) return product.price < 150;
      return product.bestSeller;
    })
    .slice(0, 3);

  return NextResponse.json({
    answer:
      "I can recommend products, compare devices, suggest accessories, answer delivery questions, and guide trade-in choices. Connect this route to an LLM provider for production responses.",
    recommendations
  });
}
