"use client";

import React, { useState, useEffect, use } from "react";
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
  Check,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from "lucide-react";
import { useAdminStore } from "@/context/admin-store";
import type { ProductCategory, ProductCondition, Product } from "@/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditProductPage({ params }: Props) {
  const router = useRouter();
  const { id } = use(params);
  const { products, editProduct, deleteProduct, currentRole } = useAdminStore();

  const originalProduct = products.find(p => p.id === id);

  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "iPhone" as ProductCategory,
    series: "",
    price: 0,
    compareAtPrice: 0,
    warranty: "",
    deliveryEstimate: "",
    availability: "In Stock" as "In Stock" | "Low Stock" | "Preorder" | "Out of Stock",
    badge: "",
    description: "",
    colorsInput: "",
    storageInput: "",
    conditions: [] as ProductCondition[],
    barcode: "",
    sku: ""
  });

  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Load existing details
  useEffect(() => {
    if (originalProduct) {
      setForm({
        id: originalProduct.id,
        name: originalProduct.name,
        category: originalProduct.category,
        series: originalProduct.series,
        price: originalProduct.price,
        compareAtPrice: originalProduct.compareAtPrice || 0,
        warranty: originalProduct.warranty,
        deliveryEstimate: originalProduct.deliveryEstimate,
        availability: originalProduct.availability,
        badge: originalProduct.badge || "",
        description: originalProduct.description,
        colorsInput: originalProduct.colors.join(", "),
        storageInput: originalProduct.storage.join(", "),
        conditions: originalProduct.condition,
        barcode: originalProduct.specs?.["Barcode"] || `789${Math.floor(100000000 + Math.random() * 900000000)}`,
        sku: originalProduct.specs?.["SKU"] || originalProduct.id.toUpperCase()
      });

      const parsedSpecs = Object.entries(originalProduct.specs || {})
        .filter(([k]) => k !== "Barcode" && k !== "SKU")
        .map(([k, v]) => ({ key: k, value: v }));
      
      setSpecs(parsedSpecs.length ? parsedSpecs : [{ key: "Display", value: "" }]);
      setUploadedImages(originalProduct.images);
    }
  }, [originalProduct]);

  if (!originalProduct) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-brand-ink dark:text-white">Product Not Found</h2>
        <p className="text-sm text-zinc-500">The product SKU code may have been deleted or archived.</p>
        <Link href="/admin/products" className="inline-block px-4 py-2 bg-brand-blue text-white rounded-full text-xs font-bold shadow">
          Back to Catalog
        </Link>
      </div>
    );
  }

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

  // Specs List
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

  // Image Reordering
  const moveImage = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= uploadedImages.length) return;

    setUploadedImages(prev => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  const deleteImage = (index: number) => {
    if (uploadedImages.length <= 1) {
      alert("Products require at least one visual asset.");
      return;
    }
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const triggerImageUpload = () => {
    setUploadedImages(prev => [...prev, `/iphone-detail-mock-${prev.length + 1}.png`]);
  };

  const handleDelete = () => {
    if (currentRole === "Support Staff") {
      alert("Access Denied: Support Staff do not have deletion permissions.");
      return;
    }
    if (window.confirm("Are you sure you want to permanently delete this product?")) {
      deleteProduct(form.id);
      router.push("/admin/products");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole === "Sales Staff" || currentRole === "Support Staff") {
      alert(`Access Denied: Restricted role (${currentRole}) cannot modify catalog products.`);
      return;
    }

    const parsedColors = form.colorsInput.split(",").map(c => c.trim()).filter(Boolean);
    const parsedStorage = form.storageInput.split(",").map(s => s.trim()).filter(Boolean);
    
    const formattedSpecs: Record<string, string> = {
      SKU: form.sku,
      Barcode: form.barcode
    };
    specs.forEach(s => {
      if (s.key && s.value) formattedSpecs[s.key] = s.value;
    });

    const updatedProduct: Product = {
      id: form.id,
      slug: form.id,
      name: form.name,
      category: form.category,
      series: form.series || `${form.category} Series`,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      rating: originalProduct.rating,
      reviewCount: originalProduct.reviewCount,
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
    };

    editProduct(updatedProduct);
    router.push("/admin/products");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/products" 
          className="text-xs font-bold text-zinc-500 hover:text-brand-ink dark:hover:text-white flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-full text-xs font-bold transition flex items-center gap-1.5 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-400"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete SKU
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-brand-blue hover:bg-blue-600 rounded-full text-xs font-bold text-white transition flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
          >
            <Save className="h-3.5 w-3.5" /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Forms */}
        <form onSubmit={handleSave} className="md:col-span-2 space-y-6">
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-brand-ink dark:text-white pb-3 border-b border-black/5 dark:border-white/5">Edit Product Core</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
                Product Title
                <input 
                  type="text" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition font-medium"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
                Category
                <select 
                  name="category" 
                  value={form.category} 
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-855 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition font-medium"
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
                Regular Price (₵)
                <input 
                  type="number" 
                  name="price" 
                  value={form.price || ""} 
                  onChange={handleChange} 
                  required
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
                  <option value="Preorder">Preorder</option>
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
                    placeholder="Spec Attribute"
                    className="flex-1 px-4 py-2 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                    placeholder="Attribute value"
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

        {/* Right Info Bar */}
        <div className="space-y-6">
          {/* Identifiers */}
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
            <h3 className="font-bold text-brand-ink dark:text-white">Identifiers</h3>
            
            <div className="space-y-3 pt-2">
              <div className="text-xs">
                <span className="text-zinc-500 font-semibold">SKU Code</span>
                <input 
                  type="text" 
                  name="sku" 
                  value={form.sku} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full border border-black/10 bg-zinc-50 focus:bg-white dark:bg-zinc-800 dark:border-white/10 dark:text-white mt-1 font-mono font-bold"
                />
              </div>

              <div className="text-xs">
                <span className="text-zinc-500 font-semibold flex items-center gap-1">
                  <Barcode className="h-3.5 w-3.5 text-zinc-400" /> Barcode EAN
                </span>
                <input 
                  type="text" 
                  name="barcode" 
                  value={form.barcode} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full border border-black/10 bg-zinc-50 focus:bg-white dark:bg-zinc-800 dark:border-white/10 dark:text-white mt-1 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Fulfillment */}
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
                <option value="Preorder">Preorder Availability</option>
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

          {/* Reorderable Media Manager */}
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
            <h3 className="font-bold text-brand-ink dark:text-white">Media Manager</h3>
            <p className="text-xs text-zinc-400">Reorder and prioritize product images</p>

            <div className="space-y-3">
              {uploadedImages.map((img, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-black/5 dark:border-white/5 justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-400">#{i + 1}</span>
                    <ImageIcon className="h-5 w-5 text-zinc-400" />
                    <span className="text-[10px] text-zinc-500 truncate max-w-[120px]">{img.split("/").pop()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={i === 0}
                      onClick={() => moveImage(i, "left")}
                      className="p-1 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 rounded"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={i === uploadedImages.length - 1}
                      onClick={() => moveImage(i, "right")}
                      className="p-1 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 rounded"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteImage(i)}
                      className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={triggerImageUpload}
                className="w-full py-2 border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-brand-blue text-zinc-400 hover:text-brand-blue rounded-xl flex items-center justify-center gap-1.5 transition text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5" /> Upload Visual Asset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
