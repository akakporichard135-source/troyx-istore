import { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth/session";
import { updatePage, deletePage, getPageById } from "@/lib/storage/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdminRole(["owner", "editor", "viewer"]);
  if (!auth.authorized) {
    return auth.response;
  }

  const page = await getPageById(params.id);
  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  return NextResponse.json({ page });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdminRole(["owner", "editor"]);
  if (!auth.authorized) {
    return auth.response;
  }
  const session = auth.session;

  try {
    const body = await req.json();
    const updated = await updatePage(params.id, body, session.user.id);
    if (!updated) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, page: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update page" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdminRole(["owner"]);
  if (!auth.authorized) {
    return auth.response;
  }
  const session = auth.session;

  const success = await deletePage(params.id, session.user.id);
  if (!success) {
    return NextResponse.json(
      { error: "Page cannot be deleted or does not exist." },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, message: "Page deleted" });
}
