export type UploadIntent = {
  folder: string;
  tags?: string[];
};

export async function createCloudinaryUploadIntent(intent: UploadIntent) {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "demo-cloud",
    folder: intent.folder,
    tags: intent.tags || [],
    note: "Connect signed uploads in production with CLOUDINARY_API_SECRET on the server."
  };
}
