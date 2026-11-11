import { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth/session";
import { reorderSections } from "@/lib/storage/db";

export async function POST(req: NextRequest) {
  const auth = await requireAdminRole(["owner", "editor"]);
  if (!auth.authorized) {
    return auth.response;
  }
  const session = auth.session;

  try {
    const { sectionIds, pageId } = await req.json();
    if (!Array.isArray(sectionIds) || !pageId) {
      return NextResponse.json(
        { error: "sectionIds array and pageId are required" },
        { status: 400 }
      );
    }

    const updated = await reorderSections(sectionIds, pageId, session.user.id);
    return NextResponse.json({ success: true, sections: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to reorder sections" }, { status: 500 });
  }
}
