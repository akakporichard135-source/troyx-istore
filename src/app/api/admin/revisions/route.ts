import { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth/session";
import {
  getPageRevisions,
  createPageRevision,
  rollbackPageRevision,
} from "@/lib/storage/db";

export async function GET(req: NextRequest) {
  const auth = await requireAdminRole(["owner", "editor", "viewer"]);
  if (!auth.authorized) {
    return auth.response;
  }

  const { searchParams } = new URL(req.url);
  const pageId = searchParams.get("pageId");
  if (!pageId) {
    return NextResponse.json({ error: "pageId is required" }, { status: 400 });
  }

  const revisions = await getPageRevisions(pageId);
  return NextResponse.json({ revisions });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminRole(["owner", "editor"]);
  if (!auth.authorized) {
    return auth.response;
  }
  const session = auth.session;

  try {
    const { action, pageId, revisionId, notes } = await req.json();

    if (action === "create") {
      if (!pageId) {
        return NextResponse.json({ error: "pageId required" }, { status: 400 });
      }
      const revision = await createPageRevision(pageId, notes, session.user.id);
      return NextResponse.json({ success: true, revision });
    }

    if (action === "rollback") {
      if (!revisionId) {
        return NextResponse.json({ error: "revisionId required" }, { status: 400 });
      }
      const ok = await rollbackPageRevision(revisionId, session.user.id);
      if (!ok) {
        return NextResponse.json({ error: "Rollback failed or revision not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: "Page rolled back successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Operation failed" }, { status: 500 });
  }
}
