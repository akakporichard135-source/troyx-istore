import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/security";
import { requireAdmin } from "@/services/auth";
import { productMutationSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 15);
  if (limited) return limited;

  try {
    requireAdmin(request.headers.get("x-demo-role") === "admin" ? "admin" : "guest");
  } catch {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = productMutationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  return NextResponse.json({
    status: "created",
    product: parsed.data,
    message: "Connect Supabase service role storage for production writes."
  });
}
