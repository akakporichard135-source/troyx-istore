"use client";

import React, { useState, useMemo } from "react";
import { 
  ImageIcon, 
  Upload, 
  Trash2, 
  Link as LinkIcon, 
  Check, 
  Search, 
  AlertCircle,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { useAdminStore } from "@/context/admin-store";

export default function ImagesPage() {
  const { products, editProduct, currentRole } = useAdminStore();
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string>("all");

  const imagesList = useMemo(() => {
    const list: Array<{ url: string; productName: string; productId: string; index: number }> = [];
    products.forEach((p) => {
      if (selectedProduct === "all" || p.id === selectedProduct) {
        p.images.forEach((img, idx) => {
          if (p.name.toLowerCase().includes(search.toLowerCase())) {
            list.push({
              url: img,
              productName: p.name,
              productId: p.id,
              index: idx
            });
          }
        });
      }
    });
    return list;
  }, [products, search, selectedProduct]);

  const handleUploadImage = () => {
    if (currentRole === "Sales Staff" || currentRole === "Support Staff") {
      alert("Access Denied: Restricted role permissions.");
      return;
    }
    alert("Photo uploaded to Cloudinary sandbox and synched with mock repository! (Simulation)");
  };

  const handleDeleteImage = (productId: string, imgUrl: string) => {
    if (currentRole === "Sales Staff" || currentRole === "Support Staff") {
      alert("Access Denied: Restricted role permissions.");
      return;
    }
    const product = products.find(p => p.id === productId);
    if (product) {
      if (product.images.length <= 1) {
        alert("Products require at least one visual asset.");
        return;
      }
      editProduct({
        ...product,
        images: product.images.filter(img => img !== imgUrl)
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-brand-ink dark:text-white">Media Manager</h1>
        <p className="text-zinc-500 text-sm">Upload product asset galleries, reorder listings, and connect with Cloudinary integrations.</p>
      </div>

      {/* Cloudinary Integration Alert banner */}
      <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-900 rounded-[2rem] flex gap-3 items-center">
        <span className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-xl text-purple-700 dark:text-purple-300 flex-shrink-0">
          <Sparkles className="h-5 w-5 animate-pulse" />
        </span>
        <div className="text-xs">
          <p className="font-bold text-zinc-800 dark:text-zinc-200">Cloudinary Integration Status</p>
          <p className="text-zinc-500 mt-0.5">
            Cloudinary media endpoints are active. Device photos fall back to simulated SVG blueprints until custom Cloudinary variables are set in your <code className="font-mono bg-zinc-150 px-1 py-0.5 rounded text-[10px] dark:bg-zinc-800">.env.local</code> file.
          </p>
        </div>
      </div>

      {/* Drag & drop upload grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Upload box */}
        <div className="md:col-span-1 p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-bold text-brand-ink dark:text-white">Upload Media Assets</h3>
            <p className="text-xs text-zinc-500">Supports PNG, JPG, WEBP, and MP4 up to 10MB.</p>
          </div>

          <div 
            onClick={handleUploadImage}
            className="h-44 border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-brand-blue rounded-2xl flex flex-col items-center justify-center gap-3 transition cursor-pointer text-xs font-semibold text-zinc-400 hover:text-brand-blue bg-zinc-50/50 dark:bg-zinc-850/10"
          >
            <Upload className="h-8 w-8 text-zinc-400" />
            <span>Click to upload or drag files here</span>
          </div>

          <button
            onClick={handleUploadImage}
            className="w-full py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20"
          >
            <Upload className="h-3.5 w-3.5" /> Start Upload Job
          </button>
        </div>

        {/* Media Library */}
        <div className="md:col-span-2 p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-black/5 dark:border-white/5">
            <div>
              <h3 className="font-bold text-brand-ink dark:text-white">Central Media Library</h3>
              <p className="text-xs text-zinc-500">Showing {imagesList.length} asset visuals</p>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="text-xs bg-zinc-50 dark:bg-zinc-800 border border-black/10 dark:border-white/10 rounded-full px-3 py-1.5 font-semibold outline-none"
              >
                <option value="all">All Products</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          {/* Grid of images */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-1">
            {imagesList.map((img, idx) => (
              <div key={idx} className="group relative h-28 border border-black/5 dark:border-white/5 bg-zinc-50 dark:bg-zinc-850 rounded-xl flex items-center justify-center overflow-hidden">
                <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/40 text-[8px] text-white rounded font-mono">
                  {img.productName.substring(0, 8)}...
                </span>
                
                <ImageIcon className="h-8 w-8 text-zinc-400" />
                
                {/* Hover overlay actions */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleDeleteImage(img.productId, img.url)}
                    className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
                    title="Remove Visual Asset"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => alert(`Copied image link: ${img.url}`)}
                    className="p-1.5 bg-white text-zinc-700 rounded-lg hover:bg-zinc-50 transition"
                    title="Copy URL"
                  >
                    <LinkIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
