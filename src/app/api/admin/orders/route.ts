import { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth/session";
import { getOrders } from "@/lib/storage/db";

export async function GET() {
  const auth = await requireAdminRole(["owner", "editor", "viewer"]);
  if (!auth.authorized) {
    return auth.response;
  }

  const orders = await getOrders();
  return NextResponse.json({ orders });
}
