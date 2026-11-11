"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ProductRecord, ProductVariant } from "@/lib/types";
import { formatGHS } from "@/lib/pricing";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Layers,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";

export default function AdminEditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("Apple");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("iphone");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("Brand New");
  const [simConfig, setSimConfig] = useState("Physical SIM");
  const [batteryHealth, setBatteryHealth] = useState<string>("");
  const [sku, setSku] = useState("");
  const [basePrice, setBasePrice] = useState<string>("");
  const [discountPrice, setDiscountPrice] = useState<string>("");
  const [stockQuantity, setStockQuantity] = useState<string>("1");
  const [isPublished, setIsPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [slug, setSlug] = useState("");

  // Variants
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Load product
  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/admin/products/${productId}`);
        const data = await res.json();
        if (!res.ok || !data.product) {
          throw new Error(data.error || "Product not found");
        }
        const p: ProductRecord = data.product;
        setName(p.name);
        setBrand(p.brand || "Apple");
        setModel(p.model || "");
        setCategory(p.category || "iphone");
        setDescription(p.description || "");
        setCondition(p.condition || "Brand New");
        setSimConfig(p.simConfig || "Physical SIM");
        setBatteryHealth(p.batteryHealth ? p.batteryHealth.toString() : "");
        setSku(p.sku);
        setBasePrice(p.basePrice ? p.basePrice.toString() : "");
        setDiscountPrice(p.discountPrice ? p.discountPrice.toString() : "");
        setStockQuantity(p.stockQuantity ? p.stockQuantity.toString() : "0");
        setIsPublished(p.isPublished || false);
        setIsFeatured(p.isFeatured || false);
        setImages(p.images || []);
        setVariants(p.variants || []);
        setSlug(p.slug);
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  // Image actions
  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Variant actions
  const handleAddVariant = () => {
    const newVar: ProductVariant = {
      id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      productId,
      sku: `${sku}-${variants.length + 1}`,
      title: "New Variant",
      storage: "128GB",
      color: "Space Black",
      price: parseFloat(basePrice) || 0,
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      stockQuantity: 1,
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setVariants((prev) => [...prev, newVar]);
  };

  const handleUpdateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      // auto-update title from storage + color
      if (field === "storage" || field === "color") {
        const s = field === "storage" ? value : updated[index].storage;
        const c = field === "color" ? value : updated[index].color;
        updated[index].title = `${s || ""} ${c || ""}`.trim() || "Variant";
      }
      return updated;
    });
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim() || !basePrice) {
      setError("Please fill out Name, SKU, and Base Price.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          brand: brand.trim(),
          model: model.trim(),
          category,
          description: description.trim(),
          condition,
          simConfig,
          batteryHealth: batteryHealth ? parseInt(batteryHealth) : null,
          sku: sku.trim(),
          basePrice: parseFloat(basePrice),
          discountPrice: discountPrice ? parseFloat(discountPrice) : null,
          stockQuantity: parseInt(stockQuantity) || 0,
          isPublished,
          isFeatured,
          images,
          variants,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update product");
      }

      setSuccess("Product and variants updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to save product changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-zinc-500 animate-pulse">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Edit Product: {name || "Apple Device"}
            </h1>
            {slug && (
              <Link
                href={`/product/${slug}`}
                target="_blank"
                className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="View on store"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Configure device specifications, stock in East Legon, and purchase variants.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="apple-btn-primary text-xs flex items-center gap-1.5 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Changes"}</span>
        </button>
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

      <form onSubmit={handleSubmit} className="space-y-8 text-xs">
        {/* Core Info */}
        <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
          <h2 className="text-sm font-semibold text-white border-b border-zinc-800 pb-3">
            General Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium">Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium">Model</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-white capitalize"
              >
                <option value="iphone">iPhone</option>
                <option value="mac">Mac</option>
                <option value="ipad">iPad</option>
                <option value="watch">Apple Watch</option>
                <option value="airpods">AirPods</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-white"
              >
                <option value="Brand New">Brand New</option>
                <option value="Open Box">Open Box</option>
                <option value="Refurbished">Refurbished</option>
                <option value="Pre-Owned">Pre-Owned</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-zinc-300 font-medium">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Technical Specs & Inventory */}
        <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
          <h2 className="text-sm font-semibold text-white border-b border-zinc-800 pb-3">
            Hardware Specs & Inventory
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium">SIM Configuration</label>
              <select
                value={simConfig}
                onChange={(e) => setSimConfig(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-white"
              >
                <option value="Physical SIM">Physical SIM</option>
                <option value="eSIM">eSIM</option>
                <option value="Dual eSIM">Dual eSIM</option>
                <option value="Dual SIM (Physical + eSIM)">Dual SIM (Physical + eSIM)</option>
                <option value="Dual Physical SIM">Dual Physical SIM</option>
                <option value="None">None</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium">Battery Health (%)</label>
              <input
                type="number"
                min="50"
                max="100"
                value={batteryHealth}
                onChange={(e) => setBatteryHealth(e.target.value)}
                placeholder="100"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium">SKU (Stock Keeping Unit) *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
          <h2 className="text-sm font-semibold text-white border-b border-zinc-800 pb-3">
            Base Pricing & Visibility
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium">Base Price (GH₵) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium">Discount Price (GH₵)</label>
              <input
                type="number"
                step="0.01"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Optional promotional price"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-white font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-3 border-t border-zinc-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0"
              />
              <span className="text-zinc-300 font-medium">Published on Public Store</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0"
              />
              <span className="text-zinc-300 font-medium">Featured Device</span>
            </label>
          </div>
        </div>

        {/* Media Images */}
        <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
          <h2 className="text-sm font-semibold text-white border-b border-zinc-800 pb-3">
            Product Media Gallery
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Paste public image URL (e.g. from Media Library)..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-white"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="apple-btn-secondary text-xs px-4"
            >
              Add Image
            </button>
          </div>

          {images.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2">
              {images.map((img, i) => (
                <div key={i} className="relative group w-24 h-24 rounded-xl bg-zinc-900 border border-zinc-800 p-2 overflow-hidden flex items-center justify-center">
                  <img src={img} alt="" className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Variant Builder */}
        <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-400" />
                <span>Product Variants ({variants.length})</span>
              </h2>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Configure color finishes, storage sizes, and individual GH₵ prices for the customer configurator.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddVariant}
              className="apple-btn-secondary text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Variant</span>
            </button>
          </div>

          {variants.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 rounded-xl bg-zinc-900/40 border border-dashed border-zinc-800">
              No specific variants configured yet. The base price and stock will be used.
            </div>
          ) : (
            <div className="space-y-3">
              {variants.map((v, idx) => (
                <div
                  key={v.id || idx}
                  className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 grid grid-cols-1 sm:grid-cols-6 gap-3 items-center"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-semibold">Finish / Color</label>
                    <input
                      type="text"
                      value={v.color}
                      onChange={(e) => handleUpdateVariant(idx, "color", e.target.value)}
                      placeholder="Space Black"
                      className="w-full bg-black border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-semibold">Storage</label>
                    <input
                      type="text"
                      value={v.storage || ""}
                      onChange={(e) => handleUpdateVariant(idx, "storage", e.target.value)}
                      placeholder="256GB"
                      className="w-full bg-black border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-semibold">Variant SKU</label>
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) => handleUpdateVariant(idx, "sku", e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-semibold">Price (GH₵)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={v.price}
                      onChange={(e) => handleUpdateVariant(idx, "price", parseFloat(e.target.value) || 0)}
                      className="w-full bg-black border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-semibold">Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={v.stockQuantity}
                      onChange={(e) => handleUpdateVariant(idx, "stockQuantity", parseInt(e.target.value) || 0)}
                      className="w-full bg-black border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-white font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 sm:pt-0">
                    <label className="flex items-center gap-1.5 text-[11px] text-zinc-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={v.isAvailable}
                        onChange={(e) => handleUpdateVariant(idx, "isAvailable", e.target.checked)}
                        className="rounded border-zinc-700 bg-black text-white"
                      />
                      <span>Active</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors ml-2"
                      title="Remove variant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="apple-btn-primary text-xs flex items-center gap-2 py-3 px-8 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Product & Variants"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
