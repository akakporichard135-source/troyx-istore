import { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth/session";
import {
  getNavigation,
  updateNavigation,
  getFooterColumns,
  updateFooterColumns,
} from "@/lib/storage/db";

export async function GET() {
  const [nav, footer] = await Promise.all([getNavigation(), getFooterColumns()]);
  return NextResponse.json({ navigation: nav, footer });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminRole(["owner", "editor"]);
  if (!auth.authorized) {
    return auth.response;
  }
  const session = auth.session;

  try {
    const { navItems, footerColumns } = await req.json();

    if (Array.isArray(navItems)) {
      await updateNavigation(navItems, session.user.id);
    }
    if (Array.isArray(footerColumns)) {
      await updateFooterColumns(footerColumns, session.user.id);
    }

    return NextResponse.json({ success: true, message: "Navigation updated successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update navigation" }, { status: 500 });
  }
}
