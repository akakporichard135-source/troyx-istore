import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { requireAdminRole } from "@/lib/auth/session";
import {
  updateMediaAsset,
  deleteMediaAsset,
  getMediaAssetById,
  checkMediaAssetUsage,
} from "@/lib/storage/db";
import { deleteCloudinaryAsset } from "@/lib/cloudinary/server";

export const dynamic = "force-dynamic";

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
    const updated = await updateMediaAsset(params.id, body, session.user.id);
    if (!updated) {
      return NextResponse.json({ error: "Media asset not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, asset: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Update failed" }, { status: 500 });
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

  const asset = await getMediaAssetById(params.id);
  if (!asset) {
    return NextResponse.json({ error: "Media asset not found" }, { status: 404 });
  }

  // Safe deletion check: prevent deleting media referenced by sections or products
  const usage = await checkMediaAssetUsage(asset.publicUrl);
  if (usage.inUse) {
    const refNames = usage.references.map((r) => r.label).join(", ");
    return NextResponse.json(
      {
        error: `Cannot delete '${asset.filename}' because it is in use by ${refNames}. Remove all references before deleting.`,
        inUse: true,
        references: usage.references,
      },
      { status: 400 }
    );
  }

  // If asset has a Cloudinary publicId, delete it from Cloudinary
  if (asset.publicId) {
    try {
      await deleteCloudinaryAsset(asset.publicId, asset.mediaType);
    } catch (cloudErr) {
      console.warn(`Cloudinary deletion warning for ${asset.publicId}:`, cloudErr);
    }
  }

  // If asset has a local file on disk, remove it
  if (asset.filePath && fs.existsSync(asset.filePath)) {
    try {
      fs.unlinkSync(asset.filePath);
    } catch (fsErr) {
      console.warn(`Local file deletion warning for ${asset.filePath}:`, fsErr);
    }
  }

  const success = await deleteMediaAsset(params.id, session.user.id);
  if (!success) {
    return NextResponse.json({ error: "Failed to delete media asset" }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Media deleted" });
}
