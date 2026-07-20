import { NextResponse } from "next/server";
import { products } from "@/database/products";

export async function GET() {
  return NextResponse.json({ products });
}
