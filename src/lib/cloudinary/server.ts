// TroyX iStore - Cloudinary Server-Side Integration
// Official Cloudinary SDK signed upload and media asset management
// Server-only: Never import this module in client components or leak CLOUDINARY_API_SECRET

import { v2 as cloudinary } from "cloudinary";

function getCloudName(): string | undefined {
  return process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
}

function getApiKey(): string | undefined {
  return process.env.CLOUDINARY_API_KEY;
}

function getApiSecret(): string | undefined {
  return process.env.CLOUDINARY_API_SECRET;
}

export function isCloudinaryConfigured(): boolean {
  const cloudName = getCloudName();
  const apiKey = getApiKey();
  const apiSecret = getApiSecret();

  return Boolean(
    cloudName &&
    apiKey &&
    apiSecret &&
    cloudName.trim() !== "" &&
    apiKey.trim() !== "" &&
    apiSecret.trim() !== "" &&
    !cloudName.includes("your-")
  );
}

// Configures and returns the Cloudinary v2 instance
export function getCloudinaryClient() {
  const cloudName = getCloudName();
  const apiKey = getApiKey();
  const apiSecret = getApiSecret();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not fully configured. Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET in environment."
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

// Safe public status for Admin UI (never exposes secret)
export function getCloudinaryPublicStatus() {
  const configured = isCloudinaryConfigured();
  return {
    isConfigured: configured,
    cloudName: configured ? getCloudName() : undefined,
    apiKey: configured ? getApiKey() : undefined,
    defaultFolder: "troyx-istore/media",
  };
}

export interface SignedUploadParams {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  uploadUrl: string;
}

/**
 * Generates an HMAC-SHA1 signed upload signature using the official Cloudinary SDK.
 * Used for direct client-to-Cloudinary signed uploads without streaming through Node server.
 */
export function generateSignedUploadParams(options?: {
  folder?: string;
  resourceType?: "image" | "video";
}): SignedUploadParams {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cannot generate upload signature: Cloudinary is not configured.");
  }

  const cloudName = getCloudName()!;
  const apiKey = getApiKey()!;
  const apiSecret = getApiSecret()!;

  const timestamp = Math.round(Date.now() / 1000);
  const folder = options?.folder || "troyx-istore/media";
  const resourceType = options?.resourceType || "image";

  const paramsToSign: Record<string, any> = {
    folder,
    timestamp,
  };

  // Use official Cloudinary SDK signature generator
  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  return {
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
    uploadUrl,
  };
}

/**
 * Server-side upload stream for server processing or fallback uploads
 */
export async function uploadStreamToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string;
    resourceType?: "image" | "video";
    filename?: string;
    tags?: string[];
  }
): Promise<{
  publicId: string;
  assetId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  format: string;
  bytes: number;
  duration?: number;
  resourceType: "image" | "video";
}> {
  const client = getCloudinaryClient();
  const folder = options.folder || "troyx-istore/media";
  const resourceType = options.resourceType || "image";

  return new Promise((resolve, reject) => {
    const uploadStream = client.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        tags: options.tags,
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed with empty result."));
        }
        resolve({
          publicId: result.public_id,
          assetId: result.asset_id,
          secureUrl: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          duration: result.duration,
          resourceType: (result.resource_type as "image" | "video") || resourceType,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Safely delete an asset from Cloudinary by its public ID
 */
export async function deleteCloudinaryAsset(
  publicId: string,
  resourceType: "image" | "video" = "image"
): Promise<boolean> {
  if (!isCloudinaryConfigured()) {
    return false;
  }

  try {
    const client = getCloudinaryClient();
    const res = await client.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    return res.result === "ok" || res.result === "not found";
  } catch (err) {
    console.error(`Failed to delete Cloudinary asset ${publicId}:`, err);
    return false;
  }
}
