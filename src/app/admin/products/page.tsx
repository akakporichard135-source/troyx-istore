"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatGHS } from "@/lib/pricing";
import { ProductRecord } from "@/lib/types";
import {
  Smartphone,
  Plus,
  ExternalLink,
  Edit3,
  CheckCircle2,
  CircleDashed,
  Trash2,
  Layers,
  Search,
  Filter,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete '${name}'? This cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === "all" || p.category === categoryFilter;
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.model.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">
            Product Catalog
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage certified original Apple hardware, variants, battery health, and pricing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/pricing"
            className="apple-btn-secondary text-xs flex items-center gap-1.5"
          >
            <span>Bulk Pricing</span>
          </Link>

          <Link
            href="/admin/products/new"
            className="apple-btn-primary text-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, or model..."
            className="w-full bg-[#161617] border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-zinc-500" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#161617] border border-zinc-800 text-xs text-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-white capitalize"
          >
            <option value="all">All Categories</option>
            <option value="iphone">iPhone</option>
            <option value="mac">Mac</option>
            <option value="ipad">iPad</option>
            <option value="watch">Watch</option>
            <option value="airpods">AirPods</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-zinc-500 animate-pulse">
          Loading catalog...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-16 rounded-2xl bg-[#161617] border border-zinc-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-white">No Products Found</h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            {search || categoryFilter !== "all"
              ? "No products match your current search and filter settings."
              : "TroyX iStore begins with an intentionally empty catalog so no fabricated items appear. Add certified Apple stock arriving at the Bawaleshie showroom."}
          </p>
          <div className="pt-2">
            <Link
              href="/admin/products/new"
              className="apple-btn-primary text-xs inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Product</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#161617] border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                <tr>
                  <th className="px-6 py-4">Device Name & SKU</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Condition & Variants</th>
                  <th className="px-6 py-4">Price (GH₵)</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{prod.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        SKU: {prod.sku}
                      </div>
                    </td>

                    <td className="px-6 py-4 capitalize text-zinc-300">{prod.category}</td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          {prod.condition}
                        </span>
                        {prod.variants && prod.variants.length > 0 && (
                          <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                            <Layers className="w-3 h-3 text-zinc-500" />
                            <span>{prod.variants.length} variants configured</span>
                          </div>
                        )}
                        <div className="text-[10px] text-zinc-400">
                          SIM: {prod.simConfig}
                          {prod.batteryHealth && ` • Battery: ${prod.batteryHealth}%`}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">
                        {formatGHS(prod.discountPrice ?? prod.basePrice)}
                      </div>
                      {prod.discountPrice && (
                        <div className="text-[10px] line-through text-zinc-500">
                          {formatGHS(prod.basePrice)}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold ${
                          prod.stockQuantity > 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {prod.stockQuantity} units
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {prod.isPublished ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-yellow-400 font-medium">
                          <CircleDashed className="w-3.5 h-3.5" />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button */}
                        <Link
                          href={`/admin/products/${prod.id}`}
                          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                          title="Edit product & variants"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>

                        {/* View on Store */}
                        <Link
                          href={`/product/${prod.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                          title="View on public store"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDelete(prod.id, prod.name)}
                          disabled={deletingId === prod.id}
                          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
