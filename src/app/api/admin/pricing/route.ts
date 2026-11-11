import { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth/session";
import { bulkUpdateProductPrices } from "@/lib/storage/db";

export async function POST(req: NextRequest) {
  const auth = await requireAdminRole(["owner", "editor"]);
  if (!auth.authorized) {
    return auth.response;
  }
  const session = auth.session;

  try {
    const { updates } = await req.json();
    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: "No price updates supplied" }, { status: 400 });
    }

    // Validate updates
    for (const u of updates) {
      if (!u.id || typeof u.basePrice !== "number" || u.basePrice <= 0) {
        return NextResponse.json(
          { error: `Invalid price configuration for record ${u.id}` },
          { status: 400 }
        );
      }
    }

    const count = await bulkUpdateProductPrices(updates, session.user.id);
    return NextResponse.json({ success: true, count });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update prices" }, { status: 500 });
  }
}
