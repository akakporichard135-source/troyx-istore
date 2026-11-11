import { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth/session";
import { getAuditLogs } from "@/lib/storage/db";

export async function GET() {
  const auth = await requireAdminRole(["owner"]);
  if (!auth.authorized) {
    return auth.response;
  }

  const logs = await getAuditLogs(100);
  return NextResponse.json({ logs });
}
