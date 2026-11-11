"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Video,
  Search,
  Trash2,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  Crosshair,
  Cloud,
  HardDrive,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Film,
  Info,
} from "lucide-react";
import { MediaAsset } from "@/lib/types";

interface CloudinaryConfigStatus {
  isConfigured: boolean;
  cloudName?: string;
  apiKey?: string;
  defaultFolder?: string;
}

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">("all");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Cloudinary Status
  const [cloudStatus, setCloudStatus] = useState<CloudinaryConfigStatus | null>(null);

  // Form states for new uploads
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [focalPointX, setFocalPointX] = useState("50");
  const [focalPointY, setFocalPointY] = useState("50");

  // Selected asset for modal inspector (crop/focal point, video preview, details, replacement)
  const [inspectingAsset, setInspectingAsset] = useState<MediaAsset | null>(null);
  const [inspectFocalX, setInspectFocalX] = useState(50);
  const [inspectFocalY, setInspectFocalY] = useState(50);
  const [inspectAltText, setInspectAltText] = useState("");
  const [inspectCaption, setInspectCaption] = useState("");
  const [savingDetails, setSavingDetails] = useState(false);
  const [replacingAsset, setReplacingAsset] = useState(false);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const loadConfigStatus = async () => {
    try {
      const res = await fetch("/api/admin/media/config");
      if (res.ok) {
        const data = await res.json();
        setCloudStatus(data);
      }
    } catch (err) {
      console.warn("Failed to check Cloudinary configuration status:", err);
    }
  };

  const loadAssets = async () => {
    try {
      const q = search ? `&q=${encodeURIComponent(search)}` : "";
      const t = typeFilter !== "all" ? `&type=${typeFilter}` : "";
      const res = await fetch(`/api/admin/media?${q}${t}`);
      const data = await res.json();
      if (data.assets) setAssets(data.assets);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigStatus();
    loadAssets();
  }, [typeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadAssets();
  };

  // Upload handler with direct signed Cloudinary architecture or local preview fallback
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(10);
    setError(null);
    setSuccess(null);

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isVideo && !isImage) {
      setError("Only image and video files are supported.");
      setUploading(false);
      return;
    }

    try {
      // Step 1: If Cloudinary is configured, use direct signed upload
      if (cloudStatus?.isConfigured) {
        setUploadProgress(20);
        // Request HMAC-SHA1 signature from server
        const signRes = await fetch("/api/admin/media/sign-upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resourceType: isVideo ? "video" : "image",
            folder: "troyx-istore/media",
          }),
        });

        const signData = await signRes.json();
        if (!signRes.ok || !signData.signature) {
          throw new Error(signData.error || "Failed to generate signed upload authorization.");
        }

        // Direct upload to Cloudinary signed endpoint with live progress tracking
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append("file", file);
        cloudinaryFormData.append("api_key", signData.apiKey);
        cloudinaryFormData.append("timestamp", String(signData.timestamp));
        cloudinaryFormData.append("signature", signData.signature);
        cloudinaryFormData.append("folder", signData.folder);

        const uploadResult = await new Promise<any>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", signData.uploadUrl);

          xhr.upload.onprogress = (evt) => {
            if (evt.lengthComputable) {
              const percent = Math.round(20 + (evt.loaded / evt.total) * 60);
              setUploadProgress(percent);
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                resolve(JSON.parse(xhr.responseText));
              } catch (e) {
                reject(new Error("Invalid response from Cloudinary."));
              }
            } else {
              try {
                const errJson = JSON.parse(xhr.responseText);
                reject(new Error(errJson.error?.message || `Cloudinary upload failed (${xhr.status}).`));
              } catch {
                reject(new Error(`Cloudinary upload failed with status ${xhr.status}.`));
              }
            }
          };

          xhr.onerror = () => reject(new Error("Network error connecting to Cloudinary."));
          xhr.send(cloudinaryFormData);
        });

        setUploadProgress(85);

        // Step 2: Persist Cloudinary metadata into Firebase Cloud Firestore
        const metadataRes = await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            publicUrl: uploadResult.secure_url,
            filename: file.name,
            fileSize: uploadResult.bytes || file.size,
            mimeType: file.type,
            mediaType: isVideo ? "video" : "image",
            provider: "cloudinary",
            publicId: uploadResult.public_id,
            assetId: uploadResult.asset_id,
            width: uploadResult.width,
            height: uploadResult.height,
            duration: uploadResult.duration,
            format: uploadResult.format,
            altText,
            caption,
            focalPointX: parseFloat(focalPointX) || 50,
            focalPointY: parseFloat(focalPointY) || 50,
          }),
        });

        const metaData = await metadataRes.json();
        if (!metadataRes.ok) {
          throw new Error(metaData.error || "Failed to persist media metadata in Cloud Firestore.");
        }

        setUploadProgress(100);
        setAssets((prev) => [metaData.asset, ...prev]);
        setSuccess(`Uploaded '${file.name}' to Cloudinary successfully!`);
      } else {
        // Fallback: Local Preview Upload Mode
        const formData = new FormData();
        formData.append("file", file);
        formData.append("altText", altText);
        formData.append("caption", caption);
        formData.append("focalPointX", focalPointX);
        formData.append("focalPointY", focalPointY);

        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => (prev < 90 ? prev + 20 : prev));
        }, 120);

        const res = await fetch("/api/admin/media", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "File upload failed.");
        }

        setAssets((prev) => [data.asset, ...prev]);
        setSuccess(`Uploaded '${file.name}' in local preview mode.`);
      }

      // Reset form fields
      setAltText("");
      setCaption("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setError(err.message || "Failed to upload file.");
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  // Replace media asset with another file while preserving references
  const handleReplaceAsset = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !inspectingAsset) return;

    setReplacingAsset(true);
    setError(null);
    setSuccess(null);

    try {
      const isVideo = file.type.startsWith("video/");
      let newPublicUrl = "";
      let newPublicId: string | undefined;
      let newWidth: number | undefined;
      let newHeight: number | undefined;
      let newDuration: number | undefined;
      let newFormat: string | undefined;

      if (cloudStatus?.isConfigured) {
        // Request signature
        const signRes = await fetch("/api/admin/media/sign-upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resourceType: isVideo ? "video" : "image",
            folder: "troyx-istore/media",
          }),
        });

        const signData = await signRes.json();
        if (!signRes.ok) throw new Error(signData.error || "Signature generation failed.");

        const cFormData = new FormData();
        cFormData.append("file", file);
        cFormData.append("api_key", signData.apiKey);
        cFormData.append("timestamp", String(signData.timestamp));
        cFormData.append("signature", signData.signature);
        cFormData.append("folder", signData.folder);

        const cloudRes = await fetch(signData.uploadUrl, {
          method: "POST",
          body: cFormData,
        });

        const cData = await cloudRes.json();
        if (!cloudRes.ok) throw new Error(cData.error?.message || "Cloudinary upload failed.");

        newPublicUrl = cData.secure_url;
        newPublicId = cData.public_id;
        newWidth = cData.width;
        newHeight = cData.height;
        newDuration = cData.duration;
        newFormat = cData.format;
      } else {
        // Fallback local upload
        const formData = new FormData();
        formData.append("file", file);
        formData.append("altText", inspectingAsset.altText || "");
        const res = await fetch("/api/admin/media", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed.");
        newPublicUrl = data.asset.publicUrl;
      }

      // Update existing record in Firestore
      const patchRes = await fetch(`/api/admin/media/${inspectingAsset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicUrl: newPublicUrl,
          filename: file.name,
          fileSize: file.size,
          mimeType: file.type,
          mediaType: isVideo ? "video" : "image",
          publicId: newPublicId,
          width: newWidth,
          height: newHeight,
          duration: newDuration,
          format: newFormat,
        }),
      });

      const patchData = await patchRes.json();
      if (!patchRes.ok) throw new Error(patchData.error || "Failed to update asset.");

      setAssets((prev) =>
        prev.map((a) => (a.id === inspectingAsset.id ? patchData.asset : a))
      );
      setInspectingAsset(patchData.asset);
      setSuccess(`Replaced media with '${file.name}' successfully!`);
    } catch (err: any) {
      setError(err.message || "Failed to replace asset.");
    } finally {
      setReplacingAsset(false);
      if (replaceInputRef.current) replaceInputRef.current.value = "";
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete '${name}'?\nThis will check for active references in sections and products before deleting.`)) {
      return;
    }
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to delete media asset");
        return;
      }
      setSuccess(`Deleted '${name}' successfully.`);
      setAssets((prev) => prev.filter((a) => a.id !== id));
      if (inspectingAsset?.id === id) {
        setInspectingAsset(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete media");
    }
  };

  // Inspect Asset Modal
  const openInspector = (asset: MediaAsset) => {
    setInspectingAsset(asset);
    setInspectFocalX(asset.focalPointX ?? 50);
    setInspectFocalY(asset.focalPointY ?? 50);
    setInspectAltText(asset.altText || "");
    setInspectCaption(asset.caption || "");
  };

  const handleImageFocalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setInspectFocalX(Math.max(0, Math.min(100, x)));
    setInspectFocalY(Math.max(0, Math.min(100, y)));
  };

  const handleSaveDetails = async () => {
    if (!inspectingAsset) return;
    setSavingDetails(true);
    try {
      const res = await fetch(`/api/admin/media/${inspectingAsset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          focalPointX: inspectFocalX,
          focalPointY: inspectFocalY,
          altText: inspectAltText,
          caption: inspectCaption,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAssets((prev) =>
          prev.map((a) => (a.id === inspectingAsset.id ? data.asset : a))
        );
        setSuccess("Asset details updated successfully!");
        setInspectingAsset(data.asset);
      } else {
        setError(data.error || "Failed to update asset details");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update asset details");
    } finally {
      setSavingDetails(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Digital Asset Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">
            Cinematic Media Management
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Upload, crop focal points, inspect cinematic videos, and safely reference media across sections and products.
          </p>
        </div>
      </div>

      {/* Cloudinary Integration Status & Firebase Spark Plan Banner */}
      <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-zinc-200">
            Firebase Cloud Storage Status: Spark Plan (No-Cost) • Cloudinary Permanent Hosting
          </span>
          <span className="ml-auto text-[10px] text-zinc-400 font-mono">
            {cloudStatus?.isConfigured ? `Cloud: ${cloudStatus.cloudName}` : "Local Preview Active"}
          </span>
        </div>
        <p className="text-zinc-400 text-[11px] leading-relaxed">
          Cloud media storage uploads are not yet configured on Firebase Storage to respect the no-cost Spark plan limits. TroyX iStore uses Cloudinary for permanent image and cinematic 4K video hosting with HMAC-SHA1 signed uploads, storing metadata in Firebase Cloud Firestore.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {/* Upload Zone & Metadata Inputs */}
      <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Upload New Asset</h2>
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            {cloudStatus?.isConfigured ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <Cloud className="w-3.5 h-3.5" />
                <span>Signed Cloud Upload</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-zinc-400">
                <HardDrive className="w-3.5 h-3.5" />
                <span>Local Preview Storage</span>
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1 font-medium">Alt Text (Accessibility & SEO)</label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="e.g. iPhone 18 Pro in Dark Titanium"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1 font-medium">Caption / Label</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Front profile showcase view"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Focal X (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={focalPointX}
                onChange={(e) => setFocalPointX(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Focal Y (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={focalPointY}
                onChange={(e) => setFocalPointY(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white"
              />
            </div>
          </div>
        </div>

        {/* Upload Progress Bar */}
        {uploading && (
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3 animate-spin text-blue-400" />
                <span>
                  {cloudStatus?.isConfigured
                    ? "Uploading securely to Cloudinary..."
                    : "Uploading asset..."}
                </span>
              </span>
              <span className="font-mono">{uploadProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Dropzone */}
        <label className="border-2 border-dashed border-zinc-800 hover:border-zinc-600 bg-zinc-900/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors block text-center">
          <Upload className="w-8 h-8 text-zinc-400 mb-2" />
          <span className="text-xs font-semibold text-white">
            {uploading ? "Uploading Asset..." : "Click to select or drop image/video file"}
          </span>
          <span className="text-[10px] text-zinc-500 mt-1">
            Supports PNG, JPG, WebP, AVIF, MP4, WebM, MOV (Max 100MB for video, 10MB for image)
          </span>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            accept="image/*,video/*"
          />
        </label>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename or alt text..."
            className="w-full bg-[#161617] border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white"
          />
        </form>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#161617] border border-zinc-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => setTypeFilter("all")}
            className={`px-3 py-1 rounded-lg transition-colors ${
              typeFilter === "all" ? "bg-zinc-800 text-white font-medium" : "text-zinc-400 hover:text-white"
            }`}
          >
            All Media ({assets.length})
          </button>
          <button
            onClick={() => setTypeFilter("image")}
            className={`px-3 py-1 rounded-lg transition-colors ${
              typeFilter === "image" ? "bg-zinc-800 text-white font-medium" : "text-zinc-400 hover:text-white"
            }`}
          >
            Images ({assets.filter((a) => a.mediaType === "image").length})
          </button>
          <button
            onClick={() => setTypeFilter("video")}
            className={`px-3 py-1 rounded-lg transition-colors ${
              typeFilter === "video" ? "bg-zinc-800 text-white font-medium" : "text-zinc-400 hover:text-white"
            }`}
          >
            Videos ({assets.filter((a) => a.mediaType === "video").length})
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {assets.length === 0 ? (
        <div className="p-16 rounded-2xl bg-[#161617] border border-zinc-800 text-center space-y-2">
          <ImageIcon className="w-10 h-10 text-zinc-600 mx-auto" />
          <div className="text-sm font-medium text-white">No Media Assets Uploaded Yet</div>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Upload images or cinematic videos above to use them in homepage showcases or product pages.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="group p-3 rounded-2xl bg-[#161617] border border-zinc-800 space-y-2.5 flex flex-col justify-between hover:border-zinc-700 transition-colors"
            >
              <div
                onClick={() => openInspector(asset)}
                className="aspect-square rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center relative cursor-pointer group-hover:opacity-90"
              >
                {asset.mediaType === "image" ? (
                  <img
                    src={asset.publicUrl}
                    alt={asset.altText || asset.filename}
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: `${asset.focalPointX ?? 50}% ${asset.focalPointY ?? 50}%`,
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-zinc-500 p-2">
                    <Video className="w-8 h-8 text-blue-400 mb-1" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Cinematic Video</span>
                    {asset.duration && (
                      <span className="text-[9px] text-zinc-400 font-mono mt-0.5">
                        {Math.round(asset.duration)}s
                      </span>
                    )}
                  </div>
                )}

                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/80 text-white uppercase tracking-wider">
                    {asset.mediaType}
                  </span>
                  {asset.provider === "cloudinary" && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-600/80 text-white uppercase tracking-wider">
                      Cloud
                    </span>
                  )}
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs gap-1">
                  <Eye className="w-4 h-4" />
                  <span>Inspect</span>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-white truncate" title={asset.filename}>
                  {asset.filename}
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5 flex items-center justify-between">
                  <span>{(asset.fileSize / 1024).toFixed(0)} KB</span>
                  {asset.width && asset.height && (
                    <span className="font-mono text-zinc-400">
                      {asset.width}×{asset.height}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleCopy(asset.publicUrl, asset.id)}
                  className="inline-flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white"
                  title="Copy media URL"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(asset.id, asset.filename)}
                  className="text-zinc-500 hover:text-red-400 p-1"
                  title="Delete media"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Asset Inspector, Video Preview & Focal Point Modal */}
      {inspectingAsset && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#161617] border border-zinc-800 rounded-2xl max-w-3xl w-full p-6 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white truncate max-w-md">
                    {inspectingAsset.filename}
                  </h3>
                  {inspectingAsset.provider === "cloudinary" ? (
                    <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      Cloudinary Asset
                    </span>
                  ) : (
                    <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      Local Preview
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {inspectingAsset.mediaType === "image"
                    ? "Click on the image to set the focal point coordinate for responsive cropping."
                    : "Cinematic video player preview with playback controls."}
                </p>
              </div>

              <button
                onClick={() => setInspectingAsset(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Canvas */}
            {inspectingAsset.mediaType === "image" ? (
              <div className="space-y-3">
                <div
                  onClick={handleImageFocalClick}
                  className="relative aspect-video max-h-96 w-full rounded-xl bg-black border border-zinc-800 overflow-hidden cursor-crosshair flex items-center justify-center select-none"
                >
                  <img
                    src={inspectingAsset.publicUrl}
                    alt={inspectingAsset.altText || ""}
                    className="w-full h-full object-contain pointer-events-none select-none"
                  />

                  {/* Focal point indicator */}
                  <div
                    className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-blue-500/40 pointer-events-none shadow-lg flex items-center justify-center"
                    style={{
                      left: `${inspectFocalX}%`,
                      top: `${inspectFocalY}%`,
                    }}
                  >
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Crosshair className="w-4 h-4 text-white" />
                    <span>Focal Point Coordinate: </span>
                    <span className="font-mono text-white">
                      X: {inspectFocalX}%, Y: {inspectFocalY}%
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500">
                    Click anywhere on image to update focal center
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative aspect-video max-h-96 w-full rounded-xl bg-black border border-zinc-800 overflow-hidden">
                  <video
                    src={inspectingAsset.publicUrl}
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Technical Metadata Details Grid */}
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-2.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Asset Metadata (Authoritative Firestore Record)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-zinc-300">
                <div>
                  <span className="text-zinc-500 block text-[10px]">Media URL</span>
                  <div className="flex items-center gap-1 font-mono text-[11px] truncate">
                    <span className="truncate">{inspectingAsset.publicUrl}</span>
                    <button
                      onClick={() => handleCopy(inspectingAsset.publicUrl, inspectingAsset.id)}
                      className="text-zinc-400 hover:text-white shrink-0"
                      title="Copy URL"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {inspectingAsset.publicId && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Cloudinary Public ID</span>
                    <span className="font-mono text-[11px] text-zinc-200 truncate block">
                      {inspectingAsset.publicId}
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-zinc-500 block text-[10px]">File Size & Type</span>
                  <span className="font-mono text-[11px] text-zinc-200">
                    {(inspectingAsset.fileSize / 1024).toFixed(1)} KB ({inspectingAsset.mimeType})
                  </span>
                </div>

                {inspectingAsset.width && inspectingAsset.height && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Dimensions</span>
                    <span className="font-mono text-[11px] text-zinc-200">
                      {inspectingAsset.width} × {inspectingAsset.height} px
                    </span>
                  </div>
                )}

                {inspectingAsset.duration !== undefined && inspectingAsset.duration > 0 && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Video Duration</span>
                    <span className="font-mono text-[11px] text-zinc-200">
                      {inspectingAsset.duration.toFixed(1)}s
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-zinc-500 block text-[10px]">Upload Date</span>
                  <span className="text-[11px] text-zinc-300">
                    {new Date(inspectingAsset.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Editable Fields (Alt Text & Caption) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Alt Text</label>
                <input
                  type="text"
                  value={inspectAltText}
                  onChange={(e) => setInspectAltText(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Caption</label>
                <input
                  type="text"
                  value={inspectCaption}
                  onChange={(e) => setInspectCaption(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <input
                  ref={replaceInputRef}
                  type="file"
                  onChange={handleReplaceAsset}
                  disabled={replacingAsset}
                  className="hidden"
                  accept={inspectingAsset.mediaType === "video" ? "video/*" : "image/*"}
                />
                <button
                  onClick={() => replaceInputRef.current?.click()}
                  disabled={replacingAsset}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${replacingAsset ? "animate-spin" : ""}`} />
                  <span>{replacingAsset ? "Replacing..." : "Replace Media File"}</span>
                </button>

                <button
                  onClick={() => handleDelete(inspectingAsset.id, inspectingAsset.filename)}
                  className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-900 text-xs text-red-300 hover:text-red-200 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Delete Unused</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInspectingAsset(null)}
                  className="px-4 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveDetails}
                  disabled={savingDetails}
                  className="apple-btn-primary text-xs py-1.5 px-4"
                >
                  {savingDetails ? "Saving..." : "Save Details"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
