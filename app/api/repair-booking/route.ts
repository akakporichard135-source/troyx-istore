import { NextRequest, NextResponse } from "next/server";
import { rateLimit, validateCsrf } from "@/lib/security";
import { repairBookingSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 20);
  if (limited) return limited;
  if (!validateCsrf(request)) return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });

  const body = await request.json();
  const parsed = repairBookingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  return NextResponse.json({
    bookingId: `RB-${Date.now()}`,
    status: "requested",
    message: "Repair booking received. Connect email provider for confirmation."
  });
}
