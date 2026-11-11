import { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth/session";
import { getPromotions, createPromotion, updatePromotion } from "@/lib/storage/db";

export async function GET() {
  const auth = await requireAdminRole(["owner", "editor", "viewer"]);
  if (!auth.authorized) {
    return auth.response;
  }

  const promotions = await getPromotions();
  return NextResponse.json({ promotions });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminRole(["owner", "editor"]);
  if (!auth.authorized) {
    return auth.response;
  }
  const session = auth.session;

  try {
    const body = await req.json();
    const { title, code, discountType, discountValue, startDate, endDate, isActive = true, bannerText = "" } = body;

    if (!title || !code || !discountValue || !startDate || !endDate) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const promo = await createPromotion(
      {
        title,
        code: code.toUpperCase().trim(),
        discountType: discountType || "percentage",
        discountValue: parseFloat(discountValue),
        startDate,
        endDate,
        isActive,
        bannerText,
      },
      session.user.id
    );

    return NextResponse.json({ success: true, promotion: promo });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create promotion" }, { status: 500 });
  }
}
