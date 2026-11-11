import { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth/session";
import {
  isCloudinaryConfigured,
  generateSignedUploadParams,
} from "@/lib/cloudinary/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const auth = await requireAdminRole(["owner", "editor"]);
  if (!auth.authorized) {
    return auth.response;
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      {
        error: "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local.",
        code: "CLOUDINARY_NOT_CONFIGURED",
      },
      { status: 503 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const resourceType = body.resourceType === "video" ? "video" : "image";
    const folder = body.folder || "troyx-istore/media";
    const tags = Array.isArray(body.tags) ? body.tags : ["troyx-istore"];

    const signedParams = generateSignedUploadParams({
      folder,
      resourceType,
      tags,
    });

    return NextResponse.json({
      success: true,
      ...signedParams,
      resourceType,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to generate upload signature" },
      { status: 500 }
    );
  }
}
