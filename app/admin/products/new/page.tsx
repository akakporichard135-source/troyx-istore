"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Plus, 
  Sparkles,
  Barcode,
  Image as ImageIcon,
  Check
} from "lucide-react";
import { useAdminStore } from "@/context/admin-store";
import type { ProductCategory, ProductCondition } from "@/types";

export default function NewProductPage() {
  const router = useRouter();
  const { addProduct, currentRole } = useAdminStore();

  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "iPhone" as ProductCategory,
    series: "",
    price: 0,
    compareAtPrice: 0,
    warranty: "12-month TroyX warranty",
    deliveryEstimate: "1-3 business days delivery",
    availability: "In Stock" as "In Stock" | "Low Stock" | "Preorder" | "Out of Stock",
    badge: "",
    description: "",
    colorsInput: "Natural Titanium, Black, White",
    storageInput: "128GB, 256GB, 512GB",
    conditions: ["New"] as ProductCondition[],
    barcode: "",
    sku: ""
  });

  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>([
    { key: "Display", value: "" },
    { key: "Chip", value: "" },
    { key: "Camera", value: "" }
  ]);

  const [uploadedImages, setUploadedImages] = useState<string[]>([
    "/iphone-dummy.png"
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleConditionChange = (cond: ProductCondition) => {
    setForm(prev => {
      const conditions = prev.conditions.includes(cond)
        ? prev.conditions.filter(c => c !== cond)
        : [...prev.conditions, cond];
      return { ...prev, conditions };
    });
  };

  // Dynamic Specs
  const handleSpecChange = (index: number, field: "key" | "value", val: string) => {
    setSpecs(prev => {
      const next = [...prev];
      next[index][field] = val;
      return next;
    });
  };

  const addSpecRow = () => {
    setSpecs(prev => [...prev, { key: "", value: "" }]);
  };

  const removeSpecRow = (index: number) => {
    setSpecs(prev => prev.filter((_, i) => i !== index));
  };

  // SKU & Barcode Generator
  const generateIdentifiers = () => {
    if (!form.name || !form.category) {
      alert("Please fill in Name and Category before generating SKU.");
      return;
    }
    const cleanName = form.name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, "X");
    const categoryCode = form.category.substring(0, 3).toUpperCase();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const sku = `TX-${categoryCode}-${cleanName}-${randomSuffix}`;
    const barcode = `789${Math.floor(100000000 + Math.random() * 900000000)}`;
    
    setForm(prev => ({ ...prev, sku, barcode, id: sku.toLowerCase() }));
  };

  // Mock upload images
  const triggerImageUpload = () => {
    // Add a mockup secondary image
    setUploadedImages(prev => [
      ...prev,
      `/iphone-detail-${prev.length + 1}.png`
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole === "Sales Staff" || currentRole === "Support Staff") {
      alert(`Access Denied: Your role (${currentRole}) does not have permission to create products.`);
      return;
    }

    if (!form.name || form.price <= 0) {
      alert("Product Name and valid price are required.");
      return;
    }

    const parsedColors = form.colorsInput.split(",").map(c => c.trim()).filter(Boolean);
    const parsedStorage = form.storageInput.split(",").map(s => s.trim()).filter(Boolean);
    
    const formattedSpecs: Record<string, string> = {};
    specs.forEach(s => {
      if (s.key && s.value) formattedSpecs[s.key] = s.value;
    });

    addProduct({
      id: form.id || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: form.name,
      category: form.category,
      series: form.series || `${form.category} Series`,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      rating: 5.0,
      reviewCount: 0,
      images: uploadedImages,
      colors: parsedColors,
      storage: parsedStorage,
      condition: form.conditions,
      availability: form.availability,
      warranty: form.warranty,
      deliveryEstimate: form.deliveryEstimate,
      badge: form.badge || undefined,
      description: form.description,
      specs: formattedSpecs,
      bestSeller: form.badge === "Best Seller" ? true : undefined,
      newArrival: form.badge === "New" ? true : undefined,
      deal: form.badge === "Sale" ? true : undefined
    });

    router.push("/admin/products");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Top Breadcrumb Actions */}
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/products" 
          className="text-xs font-bold text-zinc-500 hover:text-brand-ink dark:hover:text-white flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
        <div className="flex gap-3">
          <Link 
            href="/admin/products"
            className="px-4 py-2 border border-black/10 text-xs font-bold text-zinc-700 bg-white hover:bg-zinc-50 rounded-full dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750 transition"
          >
            Cancel
          </Link>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-brand-blue hover:bg-blue-600 rounded-full text-xs font-bold text-white transition flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
          >
            <Save className="h-3.5 w-3.5" /> Save Product
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Details Form */}
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-brand-ink dark:text-white pb-3 border-b border-black/5 dark:border-white/5">Product Specifications</h2>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
                Product Title *
                <input 
                  type="text" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. iPhone 16 Pro"
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition font-medium"
                />
              </label>
              
              <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
                Category *
                <select 
                  name="category" 
                  value={form.category} 
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-850 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition font-medium"
                >
                  <option value="iPhone">iPhone</option>
                  <option value="MacBook">MacBook</option>
                  <option value="iPad">iPad</option>
                  <option value="Apple Watch">Apple Watch</option>
                  <option value="AirPods">AirPods</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Gaming">Gaming</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
                Regular Price (₵) *
                <input 
                  type="number" 
                  name="price" 
                  value={form.price || ""} 
                  onChange={handleChange} 
                  required
                  placeholder="Price in GHS"
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition font-medium"
                />
              </label>
              
              <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
                Compare At Price (₵)
                <input 
                  type="number" 
                  name="compareAtPrice" 
                  value={form.compareAtPrice || ""} 
                  onChange={handleChange}
                  placeholder="Original price before discount"
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition font-medium"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
                Series Name
                <input 
                  type="text" 
                  name="series" 
                  value={form.series} 
                  onChange={handleChange}
                  placeholder="e.g. iPhone 16 Series"
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition font-medium"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
                Badge / Tag
                <select 
                  name="badge" 
                  value={form.badge} 
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-850 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition font-medium"
                >
                  <option value="">No Badge</option>
                  <option value="New">New Arrival</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="Sale">On Sale</option>
                  <option value="Pre-order">Pre-order</option>
                </select>
              </label>
            </div>

            <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
              Product Description
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange}
                rows={4}
                placeholder="Write description detailing specs, features, condition logs..."
                className="px-4 py-3 rounded-2rem border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition font-medium resize-none"
              />
            </label>
          </div>

          {/* Variants and Options */}
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-brand-ink dark:text-white pb-3 border-b border-black/5 dark:border-white/5">Variants & Attributes</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
                Available Colors (comma separated)
                <input 
                  type="text" 
                  name="colorsInput" 
                  value={form.colorsInput} 
                  onChange={handleChange} 
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition font-medium"
                />
              </label>
              
              <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
                Storage Tiers (comma separated)
                <input 
                  type="text" 
                  name="storageInput" 
                  value={form.storageInput} 
                  onChange={handleChange} 
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition font-medium"
                />
              </label>
            </div>

            <div>
              <p className="text-xs font-bold text-zinc-500 mb-2">Device Condition Tiers</p>
              <div className="flex gap-4">
                {(["New", "Used", "Refurbished"] as ProductCondition[]).map(cond => {
                  const isChecked = form.conditions.includes(cond);
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => handleConditionChange(cond)}
                      className={`px-4 py-2 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition ${
                        isChecked 
                          ? "bg-brand-blue/10 border-brand-blue text-brand-blue dark:bg-brand-blue/20" 
                          : "border-black/10 text-zinc-500 dark:border-white/10 hover:border-black/20"
                      }`}
                    >
                      {isChecked && <Check className="h-3.5 w-3.5" />}
                      {cond}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dynamic Technical Specifications */}
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-black/5 dark:border-white/5">
              <h2 className="text-lg font-bold text-brand-ink dark:text-white">Technical Specs Grid</h2>
              <button 
                type="button" 
                onClick={addSpecRow}
                className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add Row
              </button>
            </div>

            <div className="space-y-3">
              {specs.map((spec, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                    placeholder="Spec Attribute (e.g. Display)"
                    className="flex-1 px-4 py-2 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                    placeholder="Attribute value (e.g. 6.7-inch OLED)"
                    className="flex-1 px-4 py-2 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition text-xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecRow(index)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-full dark:hover:bg-rose-950/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Side Panel: Barcode, Images, Status */}
        <div className="space-y-6">
          {/* Inventory Controls */}
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
            <h3 className="font-bold text-brand-ink dark:text-white">Identifiers</h3>
            
            <button
              type="button"
              onClick={generateIdentifiers}
              className="w-full py-2.5 bg-gradient-to-r from-zinc-800 to-zinc-900 dark:from-zinc-800 dark:to-zinc-700 text-white rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 hover:shadow-md"
            >
              <Sparkles className="h-3.5 w-3.5" /> Generate SKU & Barcode
            </button>

            <div className="space-y-3 pt-2">
              <div className="text-xs">
                <span className="text-zinc-500 font-semibold">SKU Code</span>
                <p className="font-mono font-bold mt-0.5 text-zinc-800 dark:text-zinc-200">
                  {form.sku || <span className="text-zinc-400 italic">Not generated yet</span>}
                </p>
              </div>

              <div className="text-xs">
                <span className="text-zinc-500 font-semibold flex items-center gap-1">
                  <Barcode className="h-3.5 w-3.5 text-zinc-400" /> Barcode EAN
                </span>
                <p className="font-mono font-bold mt-0.5 text-zinc-800 dark:text-zinc-200">
                  {form.barcode || <span className="text-zinc-400 italic">Not generated yet</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Availability Status */}
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
            <h3 className="font-bold text-brand-ink dark:text-white">Fulfillment Status</h3>
            
            <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
              Availability Option
              <select
                name="availability"
                value={form.availability}
                onChange={handleChange}
                className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-850 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition font-medium"
              >
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Preorder">Pre-order Availability</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </label>

            <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
              Fulfillment Estimate
              <input 
                type="text" 
                name="deliveryEstimate" 
                value={form.deliveryEstimate} 
                onChange={handleChange} 
                className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition font-medium"
              />
            </label>
          </div>

          {/* Product Gallery Images */}
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
            <h3 className="font-bold text-brand-ink dark:text-white">Media Manager</h3>
            <p className="text-xs text-zinc-400">Add high-fidelity visuals</p>

            <div className="grid grid-cols-2 gap-3">
              {uploadedImages.map((img, i) => (
                <div key={i} className="h-20 relative border border-black/5 bg-zinc-50 dark:bg-zinc-800 dark:border-white/5 rounded-xl flex items-center justify-center overflow-hidden">
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/40 text-[8px] text-white rounded font-mono">
                    #{i + 1}
                  </span>
                  <ImageIcon className="h-6 w-6 text-zinc-400" />
                </div>
              ))}

              <button
                type="button"
                onClick={triggerImageUpload}
                className="h-20 border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-brand-blue text-zinc-400 hover:text-brand-blue rounded-xl flex flex-col items-center justify-center gap-1.5 transition text-xs font-semibold"
              >
                <Plus className="h-4 w-4" /> Add Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
