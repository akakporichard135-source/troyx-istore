"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("Apple");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("iphone");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("Brand New");
  const [simConfig, setSimConfig] = useState("Physical SIM");
  const [batteryHealth, setBatteryHealth] = useState("100");
  const [sku, setSku] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("1");
  const [imageUrl, setImageUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !model || !sku || !basePrice) {
      setError("Please fill out name, model, SKU, and base price.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          brand,
          model,
          category,
          description,
          condition,
          simConfig,
          batteryHealth: batteryHealth ? parseInt(batteryHealth) : null,
          sku,
          basePrice: parseFloat(basePrice),
          discountPrice: discountPrice ? parseFloat(discountPrice) : null,
          stockQuantity: parseInt(stockQuantity) || 0,
          images: imageUrl ? [imageUrl] : [],
          isPublished,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create product.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Add New Device</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Create a genuine Apple product entry in TroyX catalog with full specs.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Core Info */}
        <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
          <h2 className="text-sm font-semibold text-white">1. Basic Device Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. iPhone 16 Pro Max 256GB"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
              >
                <option value="iphone">iPhone</option>
                <option value="mac">Mac</option>
                <option value="ipad">iPad</option>
                <option value="watch">Apple Watch</option>
                <option value="airpods">AirPods</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Model String *</label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. A3296"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed specifications, condition notes, included box accessories..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
            />
          </div>
        </div>

        {/* Specs, Condition & Battery */}
        <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
          <h2 className="text-sm font-semibold text-white">2. Condition & Technical Specs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-400 mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
              >
                <option value="Brand New">Brand New (Sealed)</option>
                <option value="Open Box">Open Box</option>
                <option value="Refurbished">Refurbished</option>
                <option value="Pre-Owned">Pre-Owned</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">SIM Configuration</label>
              <select
                value={simConfig}
                onChange={(e) => setSimConfig(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
              >
                <option value="Physical SIM">Physical SIM</option>
                <option value="eSIM">eSIM (US Model)</option>
                <option value="Dual eSIM">Dual eSIM</option>
                <option value="Dual SIM (Physical + eSIM)">Dual SIM (Physical + eSIM)</option>
                <option value="Dual Physical SIM">Dual Physical SIM (Hong Kong / China)</option>
                <option value="None">None (Wi-Fi only)</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Battery Health (%)</label>
              <input
                type="number"
                min="50"
                max="100"
                value={batteryHealth}
                onChange={(e) => setBatteryHealth(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
          <h2 className="text-sm font-semibold text-white">3. Pricing (Ghana Cedi GH₵) & Stock</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-zinc-400 mb-1">Base Price (GH₵) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="14500"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Discount Price (GH₵)</label>
              <input
                type="number"
                step="0.01"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Optional promo price"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">SKU Number *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="TX-IP16P-256"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Media & Publication */}
        <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
          <h2 className="text-sm font-semibold text-white">4. Image & Publishing</h2>
          <div>
            <label className="block text-zinc-400 mb-1">Primary Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="e.g. /uploads/iphone-16.png (or from Media Library)"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
            />
          </div>

          <label className="flex items-center gap-2 text-zinc-300 pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-800 text-blue-600 focus:ring-0"
            />
            <span className="font-medium">Publish to Store immediately</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="apple-btn-primary px-6 py-2 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "Creating..." : "Save Product"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
