import { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth/session";
import { getCloudinaryPublicStatus } from "@/lib/cloudinary/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireAdminRole(["owner", "editor", "viewer"]);
  if (!auth.authorized) {
    return auth.response;
  }

  const status = getCloudinaryPublicStatus();
  return NextResponse.json({
    status: "ok",
    ...status,
  });
}
