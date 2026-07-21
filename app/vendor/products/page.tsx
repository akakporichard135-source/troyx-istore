"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  Upload,
  Package,
  Check,
  X,
  AlertCircle,
  Image as ImageIcon
} from "lucide-react";
import { useVendorStore } from "@/context/vendor-store";
import { useAdminStore } from "@/context/admin-store";
import { Button } from "@/components/ui/button";
import type { ProductCategory, ProductCondition, Product } from "@/types";

export default function VendorProductsPage() {
  const activeVendorId = useVendorStore((state) => state.activeVendorId);
  const vendors = useVendorStore((state) => state.vendors);
  const plans = useVendorStore((state) => state.plans);
  
  const products = useAdminStore((state) => state.products);
  const addProduct = useAdminStore((state) => state.addProduct);
  const editProduct = useAdminStore((state) => state.editProduct);
  const deleteProduct = useAdminStore((state) => state.deleteProduct);

  const vendor = vendors.find((v) => v.id === activeVendorId) || vendors[0];
  const plan = plans.find((p) => p.id === vendor?.planId) || plans[1];

  const vendorProducts = products.filter(
    (p) => p.vendorId === vendor?.id || (vendor?.isFlagship && (!p.vendorId || p.vendorId === "v-troyx-flagship"))
  );

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProd, setEditingProd] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ProductCategory>("iPhone");
  const [series, setSeries] = useState("Series 16");
  const [price, setPrice] = useState<number>(999);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(undefined);
  const [availability, setAvailability] = useState<"In Stock" | "Low Stock" | "Preorder" | "Out of Stock">("In Stock");
  const [description, setDescription] = useState("");
  const [imageUrl1, setImageUrl1] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [imageUrl3, setImageUrl3] = useState("");
  const [colors, setColors] = useState("Space Black, Natural Titanium");
  const [storage, setStorage] = useState("128GB, 256GB");

  const isQuotaReached = plan.maxProducts !== -1 && vendorProducts.length >= plan.maxProducts;

  const openAddModal = () => {
    setEditingProd(null);
    setName("");
    setCategory("iPhone");
    setSeries("Standard");
    setPrice(999);
    setCompareAtPrice(undefined);
    setAvailability("In Stock");
    setDescription("");
    setImageUrl1("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80");
    setImageUrl2("");
    setImageUrl3("");
    setModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProd(prod);
    setName(prod.name);
    setCategory(prod.category);
    setSeries(prod.series);
    setPrice(prod.price);
    setCompareAtPrice(prod.compareAtPrice);
    setAvailability(prod.availability);
    setDescription(prod.description);
    setImageUrl1(prod.images[0] || "");
    setImageUrl2(prod.images[1] || "");
    setImageUrl3(prod.images[2] || "");
    setColors(prod.colors.join(", "));
    setStorage(prod.storage.join(", "));
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const imgArray = [imageUrl1, imageUrl2, imageUrl3].filter(Boolean);
    if (imgArray.length === 0) {
      imgArray.push("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80");
    }

    const colorArray = colors.split(",").map((c) => c.trim()).filter(Boolean);
    const storageArray = storage.split(",").map((s) => s.trim()).filter(Boolean);

    if (editingProd) {
      editProduct({
        ...editingProd,
        name,
        category,
        series,
        price,
        compareAtPrice: compareAtPrice || undefined,
        availability,
        description,
        images: imgArray,
        colors: colorArray.length > 0 ? colorArray : ["Standard"],
        storage: storageArray.length > 0 ? storageArray : ["128GB"]
      });
    } else {
      addProduct({
        id: `prod-${Date.now()}`,
        name,
        category,
        series,
        price,
        compareAtPrice: compareAtPrice || undefined,
        rating: 5.0,
        reviewCount: 0,
        images: imgArray,
        colors: colorArray.length > 0 ? colorArray : ["Standard"],
        storage: storageArray.length > 0 ? storageArray : ["128GB"],
        condition: ["New" as ProductCondition],
        availability,
        warranty: "1 Year Store Warranty",
        deliveryEstimate: "1-2 Days Nationwide Delivery",
        description: description || `${name} supplied directly by ${vendor.name}.`,
        specs: { "Vendor": vendor.name, "Condition": "Brand New" },
        vendorId: vendor.id,
        vendorName: vendor.name,
        vendorSlug: vendor.slug,
        isVerifiedVendor: vendor.isVerified
      });
    }

    setModalOpen(false);
  };

  const filtered = vendorProducts.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Vendor Products & Inventory</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Listed by <strong className="text-white">{vendor?.name}</strong> &bull; Plan Limit: {plan.maxProducts === -1 ? "Unlimited" : `${vendorProducts.length} / ${plan.maxProducts}`}
          </p>
        </div>

        <Button
          onClick={openAddModal}
          disabled={isQuotaReached && !editingProd}
          className="h-10 px-5 text-xs font-bold bg-brand-blue hover:bg-brand-blue/90 text-white disabled:opacity-50"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add New Product
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search products by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 rounded-xl border border-white/10 bg-zinc-900 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-brand-blue focus:outline-none"
        />
      </div>

      {/* Products Grid / Table */}
      <div className="rounded-3xl border border-white/10 bg-zinc-900/60 overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-zinc-950/80 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-white/5 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={prod.images[0]} alt={prod.name} className="h-10 w-10 rounded-xl border border-white/10 object-cover bg-zinc-800 shrink-0" />
                      <div className="min-w-0">
                        <p className="truncate font-bold text-white text-xs">{prod.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">ID: {prod.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-zinc-300">{prod.category}</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">
                    GH₵ {prod.price.toLocaleString()}
                    {prod.compareAtPrice && (
                      <span className="ml-1.5 text-[10px] text-zinc-500 line-through">GH₵ {prod.compareAtPrice}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      prod.availability === "In Stock"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {prod.availability}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(prod)}
                        className="rounded-lg border border-white/10 p-1.5 text-zinc-300 hover:bg-white/10 hover:text-white"
                        title="Edit Product"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(prod.id)}
                        className="rounded-lg border border-red-500/20 p-1.5 text-red-400 hover:bg-red-500/10"
                        title="Delete Product"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-zinc-500">
                    No matching products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-zinc-900 p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold">{editingProd ? "Edit Vendor Product" : "Add New Vendor Product"}</h2>
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg p-1 text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. iPhone 16 Pro Max 256GB"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 rounded-xl border border-white/10 bg-zinc-950 px-3 text-white placeholder-zinc-500 focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full h-10 rounded-xl border border-white/10 bg-zinc-950 px-3 text-white focus:border-brand-blue focus:outline-none"
                  >
                    <option value="iPhone">iPhone</option>
                    <option value="MacBook">MacBook</option>
                    <option value="iPad">iPad</option>
                    <option value="Apple Watch">Apple Watch</option>
                    <option value="AirPods">AirPods</option>
                    <option value="Gaming">Gaming & Consoles</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Cases">Cases & Covers</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Availability</label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value as any)}
                    className="w-full h-10 rounded-xl border border-white/10 bg-zinc-950 px-3 text-white focus:border-brand-blue focus:outline-none"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Preorder">Preorder</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Price (GH₵)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full h-10 rounded-xl border border-white/10 bg-zinc-950 px-3 text-white focus:border-brand-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Original Price (Compare At GH₵)</label>
                  <input
                    type="number"
                    placeholder="Optional discount price"
                    value={compareAtPrice || ""}
                    onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full h-10 rounded-xl border border-white/10 bg-zinc-950 px-3 text-white focus:border-brand-blue focus:outline-none"
                  />
                </div>
              </div>

              {/* Multi-Image Upload Preview URLs */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="block font-semibold text-zinc-300">Product Image URLs (Multi-Image Upload Preview)</label>
                <input
                  type="text"
                  placeholder="Primary Image URL (https://...)"
                  value={imageUrl1}
                  onChange={(e) => setImageUrl1(e.target.value)}
                  className="w-full h-10 rounded-xl border border-white/10 bg-zinc-950 px-3 text-white placeholder-zinc-500 focus:border-brand-blue focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Secondary Image URL 2 (Optional)"
                  value={imageUrl2}
                  onChange={(e) => setImageUrl2(e.target.value)}
                  className="w-full h-10 rounded-xl border border-white/10 bg-zinc-950 px-3 text-white placeholder-zinc-500 focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Available Colors (comma separated)</label>
                  <input
                    type="text"
                    value={colors}
                    onChange={(e) => setColors(e.target.value)}
                    className="w-full h-10 rounded-xl border border-white/10 bg-zinc-950 px-3 text-white focus:border-brand-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Storage / Specs (comma separated)</label>
                  <input
                    type="text"
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    className="w-full h-10 rounded-xl border border-white/10 bg-zinc-950 px-3 text-white focus:border-brand-blue focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 p-3 text-white focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="h-10 px-4 text-xs border-white/10 text-white">
                  Cancel
                </Button>
                <Button type="submit" className="h-10 px-6 text-xs font-bold bg-brand-blue text-white hover:bg-brand-blue/90">
                  Save Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
