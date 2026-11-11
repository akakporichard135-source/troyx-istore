import { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth/session";
import { updateSection, deleteSection, getSectionById } from "@/lib/storage/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdminRole(["owner", "editor", "viewer"]);
  if (!auth.authorized) {
    return auth.response;
  }

  const section = await getSectionById(params.id);
  if (!section) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  return NextResponse.json({ section });
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

    // Sanitize any potential script tags in text fields
    const sanitized: any = { ...body };
    if (typeof sanitized.title === "string") {
      sanitized.title = sanitized.title.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    }
    if (typeof sanitized.subtitle === "string") {
      sanitized.subtitle = sanitized.subtitle.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    }
    if (typeof sanitized.tagline === "string") {
      sanitized.tagline = sanitized.tagline.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    }

    const updated = await updateSection(params.id, sanitized, session.user.id);
    if (!updated) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, section: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update section" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdminRole(["owner", "editor"]);
  if (!auth.authorized) {
    return auth.response;
  }
  const session = auth.session;

  const success = await deleteSection(params.id, session.user.id);
  if (!success) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Section deleted" });
}
