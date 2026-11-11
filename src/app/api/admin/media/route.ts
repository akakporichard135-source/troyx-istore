import { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth/session";
import { getMediaAssets, createMediaAsset } from "@/lib/storage/db";
import {
  isCloudinaryConfigured,
  uploadStreamToCloudinary,
} from "@/lib/cloudinary/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireAdminRole(["owner", "editor", "viewer"]);
  if (!auth.authorized) {
    return auth.response;
  }

  const { searchParams } = new URL(req.url);
  const mediaType = searchParams.get("type") as "image" | "video" | undefined;
  const search = searchParams.get("q") || undefined;

  const assets = await getMediaAssets({ mediaType, search });
  return NextResponse.json({ assets });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminRole(["owner", "editor"]);
  if (!auth.authorized) {
    return auth.response;
  }
  const session = auth.session;

  const contentType = req.headers.get("content-type") || "";

  // CASE 1: Direct Signed Cloudinary Upload Completion (JSON Payload)
  if (contentType.includes("application/json")) {
    try {
      const body = await req.json();
      const {
        publicUrl,
        filename,
        fileSize,
        mimeType,
        mediaType,
        publicId,
        assetId,
        width,
        height,
        duration,
        format,
        altText = "",
        caption = "",
        focalPointX = 50,
        focalPointY = 50,
      } = body;

      if (!publicUrl || !filename) {
        return NextResponse.json(
          { error: "Missing required media fields (publicUrl, filename)." },
          { status: 400 }
        );
      }

      // Reject Base64 data URIs - Cloud Firestore stores ONLY real URLs and metadata
      if (publicUrl.startsWith("data:")) {
        return NextResponse.json(
          {
            error:
              "Base64 media storage is disabled. Cloud Firestore stores only asset metadata and Cloudinary CDN URLs. Please upload via Cloudinary or provide an external HTTPS URL.",
            code: "BASE64_MEDIA_FORBIDDEN",
          },
          { status: 400 }
        );
      }

      const asset = await createMediaAsset(
        {
          filename,
          filePath: publicUrl,
          publicUrl,
          fileSize: Number(fileSize) || 0,
          mimeType: mimeType || (mediaType === "video" ? "video/mp4" : "image/jpeg"),
          mediaType: mediaType === "video" ? "video" : "image",
          provider: publicId ? "cloudinary" : "local",
          publicId,
          assetId,
          width: width ? Number(width) : undefined,
          height: height ? Number(height) : undefined,
          duration: duration ? Number(duration) : undefined,
          format: format || undefined,
          altText,
          caption,
          focalPointX: Number(focalPointX) || 50,
          focalPointY: Number(focalPointY) || 50,
          usageCount: 0,
        },
        session.user.id
      );

      return NextResponse.json({ success: true, asset });
    } catch (err: any) {
      return NextResponse.json(
        { error: err.message || "Failed to save media metadata" },
        { status: 500 }
      );
    }
  }

  // CASE 2: Multipart Form Upload (Server-side Streaming Upload)
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string) || "";
    const caption = (formData.get("caption") as string) || "";
    const focalPointX = parseFloat((formData.get("focalPointX") as string) || "50");
    const focalPointY = parseFloat((formData.get("focalPointY") as string) || "50");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate mime type
    const mime = file.type;
    const isImage = mime.startsWith("image/");
    const isVideo = mime.startsWith("video/");

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Invalid file format. Only image and video files are permitted." },
        { status: 400 }
      );
    }

    // Validate size (max 100MB for video, 10MB for image)
    const maxBytes = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${isVideo ? "100MB" : "10MB"}.` },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // If Cloudinary is configured, stream to Cloudinary
    if (isCloudinaryConfigured()) {
      const cloudResult = await uploadStreamToCloudinary(buffer, {
        resourceType: isVideo ? "video" : "image",
        folder: "troyx-istore/media",
        filename: file.name,
      });

      const asset = await createMediaAsset(
        {
          filename: file.name,
          filePath: cloudResult.secureUrl,
          publicUrl: cloudResult.secureUrl,
          fileSize: cloudResult.bytes || file.size,
          mimeType: file.type,
          mediaType: isVideo ? "video" : "image",
          provider: "cloudinary",
          publicId: cloudResult.publicId,
          assetId: cloudResult.assetId,
          width: cloudResult.width,
          height: cloudResult.height,
          duration: cloudResult.duration,
          format: cloudResult.format,
          altText,
          caption,
          focalPointX,
          focalPointY,
          usageCount: 0,
        },
        session.user.id
      );

      return NextResponse.json({ success: true, asset });
    }

    // Cloudinary is required for binary file uploads. Base64 storage in Firestore is strictly forbidden.
    return NextResponse.json(
      {
        error:
          "Cloudinary is not configured. Cloud Firestore stores only media metadata, Cloudinary asset identifiers, and media URLs. Base64 file storage in Firestore is disabled for production safety. Please configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your Vercel project or .env.local to enable real image and video uploads.",
        code: "CLOUDINARY_NOT_CONFIGURED",
      },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
