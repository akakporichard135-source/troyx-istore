"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Video,
  Search,
  Check,
  Trash2,
  RefreshCw,
  Sliders,
  ExternalLink,
  AlertCircle,
  Eye,
  Film,
} from "lucide-react";
import { MediaAsset } from "@/lib/types";

export interface SelectedMedia {
  url: string;
  assetId?: string;
  publicId?: string;
  altText?: string;
  caption?: string;
  focalPointX?: number;
  focalPointY?: number;
  mediaType?: "image" | "video";
  filename?: string;
  format?: string;
}

interface UniversalMediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: SelectedMedia) => void;
  title?: string;
  filter?: "all" | "image" | "video";
  currentValue?: string;
  allowClear?: boolean;
  onClear?: () => void;
}

export default function UniversalMediaPicker({
  isOpen,
  onClose,
  onSelect,
  title = "Select Media Asset",
  filter = "all",
  currentValue,
  allowClear = true,
  onClear,
}: UniversalMediaPickerProps) {
  const [activeTab, setActiveTab] = useState<"library" | "upload" | "url">("library");
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<"all" | "image" | "video">(filter);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);

  // Upload Tab States
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [focalPoint, setFocalPoint] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isCloudinaryConfigured, setIsCloudinaryConfigured] = useState<boolean | null>(null);

  // URL Tab States
  const [manualUrl, setManualUrl] = useState(currentValue || "");
  const [manualAlt, setManualAlt] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync filter when prop changes
  useEffect(() => {
    setMediaTypeFilter(filter);
  }, [filter]);

  // Check Cloudinary Status
  const checkCloudinaryConfig = async () => {
    try {
      const res = await fetch("/api/admin/media/config");
      const data = await res.json();
      setIsCloudinaryConfigured(Boolean(data.isConfigured));
    } catch {
      setIsCloudinaryConfigured(false);
    }
  };

  // Load Library Assets
  const loadAssets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (mediaTypeFilter !== "all") params.append("type", mediaTypeFilter);
      if (searchQuery.trim()) params.append("q", searchQuery.trim());

      const res = await fetch(`/api/admin/media?${params.toString()}`);
      const data = await res.json();
      if (data.assets) {
        setAssets(data.assets);
        // Highlight current asset if found
        if (currentValue) {
          const match = data.assets.find((a: MediaAsset) => a.publicUrl === currentValue);
          if (match) setSelectedAsset(match);
        }
      }
    } catch (err: any) {
      console.error("Failed to load assets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAssets();
      checkCloudinaryConfig();
      setUploadError(null);
      setUploadSuccess(null);
    }
  }, [isOpen, mediaTypeFilter]);

  if (!isOpen) return null;

  // Handle file drop/selection
  const handleFileSelect = (file: File) => {
    setUploadError(null);
    setUploadSuccess(null);

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isImage && !isVideo) {
      setUploadError("Invalid format. Please select an image (JPG, PNG, WebP, AVIF) or video (MP4, WebM).");
      return;
    }

    if (mediaTypeFilter === "image" && isVideo) {
      setUploadError("This setting only accepts images. Please choose an image file.");
      return;
    }
    if (mediaTypeFilter === "video" && isImage) {
      setUploadError("This setting only accepts videos. Please choose a video file.");
      return;
    }

    const maxBytes = isVideo ? 100 * 1024 * 1024 : 15 * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError(`File is too large. Max limit is ${isVideo ? "100MB" : "15MB"}.`);
      return;
    }

    setUploadFile(file);
    const previewUrl = URL.createObjectURL(file);
    setUploadPreview(previewUrl);
    setAltText(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
  };

  // Perform Real Direct Cloudinary / Serverless Upload
  const handleUploadSubmit = async () => {
    if (!uploadFile) return;

    if (isCloudinaryConfigured === false) {
      setUploadError(
        "Cloudinary is not configured. Cloud Firestore stores only asset metadata and Cloudinary CDN URLs. Base64 file storage in Firestore is disabled. Please configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your Vercel project or use the External URL tab."
      );
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setUploadError(null);

    try {
      const isVideo = uploadFile.type.startsWith("video/");
      const resourceType = isVideo ? "video" : "image";

      // 1. Request signature from server
      let signedRes: any = null;
      try {
        const sigRes = await fetch("/api/admin/media/sign-upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resourceType,
            folder: "troyx-istore/media",
            tags: ["troyx-istore", resourceType],
          }),
        });

        if (sigRes.ok) {
          signedRes = await sigRes.json();
        }
      } catch {}

      // 2. Direct Signed Upload to Cloudinary if configured
      if (signedRes && signedRes.signature && signedRes.uploadUrl) {
        setUploadProgress(25);
        const cloudFormData = new FormData();
        cloudFormData.append("file", uploadFile);
        cloudFormData.append("api_key", signedRes.apiKey);
        cloudFormData.append("timestamp", String(signedRes.timestamp));
        cloudFormData.append("signature", signedRes.signature);
        cloudFormData.append("folder", signedRes.folder);
        if (signedRes.tags) {
          cloudFormData.append("tags", Array.isArray(signedRes.tags) ? signedRes.tags.join(",") : signedRes.tags);
        }

        const xhr = new XMLHttpRequest();
        const uploadPromise = new Promise<any>((resolve, reject) => {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const pct = Math.round((e.loaded / e.total) * 60) + 25; // 25% to 85%
              setUploadProgress(pct);
            }
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                resolve(JSON.parse(xhr.responseText));
              } catch (e) {
                reject(e);
              }
            } else {
              reject(new Error(`Cloudinary upload failed: ${xhr.statusText || xhr.status}`));
            }
          };
          xhr.onerror = () => reject(new Error("Network error during Cloudinary transfer"));
        });

        xhr.open("POST", signedRes.uploadUrl, true);
        xhr.send(cloudFormData);

        const cloudData = await uploadPromise;
        setUploadProgress(90);

        // Save metadata to Firestore
        const metaRes = await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            publicUrl: cloudData.secure_url || cloudData.url,
            filename: uploadFile.name,
            fileSize: cloudData.bytes || uploadFile.size,
            mimeType: uploadFile.type,
            mediaType: resourceType,
            publicId: cloudData.public_id,
            assetId: cloudData.asset_id,
            width: cloudData.width,
            height: cloudData.height,
            duration: cloudData.duration,
            format: cloudData.format,
            altText,
            caption,
            focalPointX: focalPoint.x,
            focalPointY: focalPoint.y,
          }),
        });

        const metaData = await metaRes.json();
        if (metaData.asset) {
          setUploadProgress(100);
          setUploadSuccess("Media uploaded and registered successfully!");
          // Automatically pick the newly uploaded asset
          setTimeout(() => {
            onSelect({
              url: metaData.asset.publicUrl,
              assetId: metaData.asset.id,
              publicId: metaData.asset.publicId,
              altText: metaData.asset.altText || altText,
              focalPointX: focalPoint.x,
              focalPointY: focalPoint.y,
              mediaType: metaData.asset.mediaType,
              filename: metaData.asset.filename,
            });
            onClose();
          }, 600);
          return;
        }
      }

      // 3. Fallback to server streaming endpoint
      setUploadProgress(30);
      const serverFormData = new FormData();
      serverFormData.append("file", uploadFile);
      serverFormData.append("altText", altText);
      serverFormData.append("caption", caption);
      serverFormData.append("focalPointX", String(focalPoint.x));
      serverFormData.append("focalPointY", String(focalPoint.y));

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: serverFormData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed on server.");
      }

      setUploadProgress(100);
      setUploadSuccess("Uploaded successfully!");
      setTimeout(() => {
        onSelect({
          url: data.asset.publicUrl,
          assetId: data.asset.id,
          publicId: data.asset.publicId,
          altText: data.asset.altText || altText,
          focalPointX: focalPoint.x,
          focalPointY: focalPoint.y,
          mediaType: data.asset.mediaType,
          filename: data.asset.filename,
        });
        onClose();
      }, 600);
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Upload failed. Please check network and try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmSelect = () => {
    if (!selectedAsset) return;
    onSelect({
      url: selectedAsset.publicUrl,
      assetId: selectedAsset.id,
      publicId: selectedAsset.publicId,
      altText: selectedAsset.altText,
      caption: selectedAsset.caption,
      focalPointX: selectedAsset.focalPointX,
      focalPointY: selectedAsset.focalPointY,
      mediaType: selectedAsset.mediaType,
      filename: selectedAsset.filename,
      format: selectedAsset.format,
    });
    onClose();
  };

  const handleManualUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    const isVideo = manualUrl.endsWith(".mp4") || manualUrl.endsWith(".webm") || manualUrl.includes("/video/upload/");
    onSelect({
      url: manualUrl.trim(),
      altText: manualAlt.trim() || undefined,
      mediaType: isVideo ? "video" : "image",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="max-w-4xl w-full bg-[#161617] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/50">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Universal Media Engine
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-zinc-800/80 flex items-center gap-4 bg-zinc-950/20 text-xs">
          <button
            onClick={() => setActiveTab("library")}
            className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === "library"
                ? "border-blue-500 text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Media Library ({assets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("upload")}
            className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === "upload"
                ? "border-blue-500 text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Direct Upload</span>
          </button>

          <button
            onClick={() => setActiveTab("url")}
            className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === "url"
                ? "border-blue-500 text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            <span>External URL</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: MEDIA LIBRARY */}
          {activeTab === "library" && (
            <div className="space-y-4">
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && loadAssets()}
                    placeholder="Search by filename or alt text..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {(["all", "image", "video"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setMediaTypeFilter(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors ${
                        mediaTypeFilter === t
                          ? "bg-blue-600 text-white font-medium"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {t === "all" ? "All Formats" : t + "s"}
                    </button>
                  ))}
                  <button
                    onClick={loadAssets}
                    title="Refresh Library"
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Asset Grid */}
              {loading ? (
                <div className="py-20 text-center text-xs text-zinc-500">
                  Loading assets from Cloud Firestore...
                </div>
              ) : assets.length === 0 ? (
                <div className="py-16 text-center space-y-3 border border-dashed border-zinc-800 rounded-2xl p-8">
                  <ImageIcon className="w-10 h-10 text-zinc-600 mx-auto" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">No matching media found</h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                      Upload your high-resolution images or 4K cinematic videos directly to start using them.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="apple-btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload New Asset Now</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {assets.map((asset) => {
                    const isSelected = selectedAsset?.id === asset.id || currentValue === asset.publicUrl;
                    return (
                      <div
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset)}
                        className={`group relative p-2 rounded-2xl bg-zinc-900/60 border cursor-pointer transition-all ${
                          isSelected
                            ? "border-blue-500 ring-2 ring-blue-500/30 bg-blue-950/20"
                            : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
                        }`}
                      >
                        {/* Thumbnail Container */}
                        <div className="aspect-square rounded-xl bg-black overflow-hidden flex items-center justify-center relative">
                          {asset.mediaType === "image" ? (
                            <img
                              src={asset.publicUrl}
                              alt={asset.altText || asset.filename}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-zinc-400 p-2">
                              <Film className="w-8 h-8 text-blue-400 mb-1" />
                              <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">
                                Video
                              </span>
                            </div>
                          )}

                          {/* Badge */}
                          <span className="absolute top-1.5 right-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-white uppercase tracking-wider border border-white/10">
                            {asset.mediaType}
                          </span>

                          {isSelected && (
                            <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        {/* Metadata */}
                        <div className="pt-2 px-0.5">
                          <div
                            className="text-xs font-medium text-white truncate"
                            title={asset.filename}
                          >
                            {asset.filename}
                          </div>
                          <div className="text-[10px] text-zinc-500 flex items-center justify-between mt-0.5">
                            <span>{(asset.fileSize / 1024).toFixed(0)} KB</span>
                            {asset.width && asset.height && (
                              <span>
                                {asset.width}x{asset.height}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DIRECT UPLOAD */}
          {activeTab === "upload" && (
            <div className="space-y-6 max-w-xl mx-auto py-2">
              {isCloudinaryConfigured === false && (
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/80 text-xs text-amber-300 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-amber-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Cloudinary Configuration Required for Direct Binary Uploads</span>
                  </div>
                  <p className="leading-relaxed text-amber-300/90 font-light">
                    Cloud Firestore strictly stores asset metadata, Cloudinary identifiers, and CDN URLs.
                    Base64 file storage in Firestore has been disabled for database health and production safety.
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    To enable direct uploads, add <code className="text-zinc-200 bg-zinc-900 px-1 py-0.5 rounded">CLOUDINARY_CLOUD_NAME</code>, <code className="text-zinc-200 bg-zinc-900 px-1 py-0.5 rounded">CLOUDINARY_API_KEY</code>, and <code className="text-zinc-200 bg-zinc-900 px-1 py-0.5 rounded">CLOUDINARY_API_SECRET</code> to your Vercel project or local <code className="text-zinc-200 bg-zinc-900 px-1 py-0.5 rounded">.env.local</code>.
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab("url")}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium underline flex items-center gap-1"
                    >
                      <span>Or use the External URL tab to link hosted media right now →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Drag and Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileSelect(e.dataTransfer.files[0]);
                  }
                }}
                className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                  uploadFile
                    ? "border-blue-500 bg-blue-950/10"
                    : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/avif,video/mp4,video/webm"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />

                {uploadPreview ? (
                  <div className="space-y-4">
                    <div className="max-h-56 mx-auto rounded-2xl overflow-hidden bg-black inline-block border border-zinc-800 relative">
                      {uploadFile?.type.startsWith("video/") ? (
                        <video src={uploadPreview} className="max-h-56 max-w-full" controls />
                      ) : (
                        <img
                          src={uploadPreview}
                          alt="Upload preview"
                          className="max-h-56 max-w-full object-contain"
                        />
                      )}
                    </div>
                    <div className="text-xs text-zinc-300">
                      <span className="font-semibold text-white">{uploadFile?.name}</span> (
                      {((uploadFile?.size || 0) / 1024 / 1024).toFixed(2)} MB)
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadFile(null);
                        setUploadPreview(null);
                      }}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Choose a different file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 py-4">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-blue-400 flex items-center justify-center mx-auto">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Click or drag media file to upload
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Images (PNG, JPG, WebP, AVIF up to 15MB) or Cinematic Videos (MP4, WebM up to 100MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Alt Text & Metadata Form */}
              {uploadFile && (
                <div className="space-y-4 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">
                      Alt Text / Accessibility Label
                    </label>
                    <input
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="e.g. iPhone 18 Pro in Space Black finish"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">
                      Caption / Usage Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="e.g. Cinematic hero banner for iPhone category"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Focal Point Slider */}
                  {uploadFile.type.startsWith("image/") && (
                    <div className="space-y-2 pt-2 border-t border-zinc-800">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-zinc-300 flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Focal Point Coordinates</span>
                        </span>
                        <span className="text-zinc-500 font-mono text-[11px]">
                          X: {focalPoint.x}% • Y: {focalPoint.y}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-zinc-500">Horizontal (X)</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={focalPoint.x}
                            onChange={(e) => setFocalPoint({ ...focalPoint, x: Number(e.target.value) })}
                            className="w-full accent-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-500">Vertical (Y)</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={focalPoint.y}
                            onChange={(e) => setFocalPoint({ ...focalPoint, y: Number(e.target.value) })}
                            className="w-full accent-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Progress Bar */}
                  {isUploading && (
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span>Uploading to Cloud...</span>
                        <span className="font-mono">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-500 h-full transition-all duration-300 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Alerts */}
                  {uploadError && (
                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/80 text-xs text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {uploadSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-xs text-emerald-300 flex items-center gap-2">
                      <Check className="w-4 h-4 flex-shrink-0" />
                      <span>{uploadSuccess}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleUploadSubmit}
                    disabled={isUploading}
                    className="w-full apple-btn-primary py-2.5 text-xs font-medium flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Uploading ({uploadProgress}%)...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>Upload and Select Asset</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EXTERNAL URL */}
          {activeTab === "url" && (
            <form onSubmit={handleManualUrlSubmit} className="space-y-4 max-w-lg mx-auto py-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  Asset HTTPS URL
                </label>
                <input
                  type="url"
                  required
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/... or https://..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  Alt Text (Optional)
                </label>
                <input
                  type="text"
                  value={manualAlt}
                  onChange={(e) => setManualAlt(e.target.value)}
                  placeholder="Descriptive text for accessibility"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {manualUrl && (
                <div className="rounded-2xl border border-zinc-800 p-3 bg-zinc-900/40 space-y-2">
                  <div className="text-[11px] text-zinc-400 font-medium">Live URL Preview:</div>
                  <div className="max-h-48 overflow-hidden rounded-xl bg-black flex items-center justify-center">
                    <img
                      src={manualUrl}
                      alt="URL Preview"
                      className="max-h-48 max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full apple-btn-primary py-2.5 text-xs font-medium"
              >
                Use External URL
              </button>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            {allowClear && (currentValue || selectedAsset) && (
              <button
                type="button"
                onClick={() => {
                  if (onClear) onClear();
                  onClose();
                }}
                className="text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Media</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            {activeTab === "library" && (
              <button
                type="button"
                onClick={handleConfirmSelect}
                disabled={!selectedAsset}
                className={`apple-btn-primary px-5 py-2 font-medium ${
                  !selectedAsset ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Choose Selected Media
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
