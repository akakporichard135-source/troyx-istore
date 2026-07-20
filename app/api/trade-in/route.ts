import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/security";
import { tradeInSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 30);
  if (limited) return limited;

  const body = await request.json();
  const parsed = tradeInSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const base = parsed.data.device.toLowerCase().includes("pro") ? 650 : 400;
  const condition = { excellent: 1, good: 0.85, fair: 0.65, poor: 0.4 }[parsed.data.physicalCondition];
  const estimate = Math.round(base * (parsed.data.batteryHealth / 100) * condition);

  return NextResponse.json({
    estimate,
    disclaimer: "Final trade-in value is confirmed only after physical inspection."
  });
}
