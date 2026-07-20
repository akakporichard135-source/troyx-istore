"use client";

import React, { useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Copy, 
  Archive, 
  Trash2, 
  Edit,
  Download, 
  Upload,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { useAdminStore } from "@/context/admin-store";
import { formatCurrency, cn } from "@/lib/utils";
import type { Product, ProductCategory } from "@/types";

export default function ProductsManagerPage() {
  const { 
    products, 
    currentRole,
    deleteProduct, 
    duplicateProduct, 
    archiveProduct,
    bulkDeleteProducts,
    bulkUploadProducts
  } = useAdminStore();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.id.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      const matchesStock = stockFilter === "all" || p.availability === stockFilter;
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, search, categoryFilter, stockFilter]);

  // Paginated list
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (currentRole === "Support Staff") {
      alert("Access Denied: Support Staff do not have deletion permissions.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) {
      bulkDeleteProducts(selectedIds);
      setSelectedIds([]);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = "ID,Name,Category,Price,Availability,Warranty\n";
    const rows = products.map(p => 
      `"${p.id}","${p.name.replace(/"/g, '""')}","${p.category}",${p.price},"${p.availability}","${p.warranty}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `troyx-products-${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import (Simulated / Parse client-side file upload)
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n");
      const newProducts: any[] = [];

      // Skip headers (row 0)
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        // Basic parser
        const parts = lines[i].split(",").map(p => p.replace(/^"|"$/g, '').trim());
        if (parts.length >= 4) {
          newProducts.push({
            id: parts[0] || `csv-${Date.now()}-${i}`,
            name: parts[1],
            category: (parts[2] || "iPhone") as ProductCategory,
            series: parts[2] || "Devices",
            price: Number(parts[3]) || 99,
            rating: 4.8,
            reviewCount: 15,
            images: ["/iphone-dummy.png"],
            colors: ["Black"],
            storage: ["128GB"],
            condition: ["New"],
            availability: (parts[4] || "In Stock") as any,
            warranty: parts[5] || "12-month TroyX warranty",
            deliveryEstimate: "1-3 days",
            description: `Imported ${parts[1]}`
          });
        }
      }

      if (newProducts.length > 0) {
        bulkUploadProducts(newProducts);
        alert(`Successfully imported ${newProducts.length} products!`);
      } else {
        alert("Failed to parse CSV. Make sure headers match ID,Name,Category,Price,Availability,Warranty.");
      }
    };
    reader.readAsText(file);
  };

  const categoriesList = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  const isRoleRestricted = currentRole === "Sales Staff" || currentRole === "Support Staff";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-ink dark:text-white">Product Catalog</h1>
          <p className="text-zinc-500 text-sm">Manage store inventory, edit configurations, run CSV imports, and trigger bulk jobs.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="px-4 py-2 border border-black/5 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-700 rounded-full flex items-center gap-1.5 dark:border-white/5 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border border-black/5 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-700 rounded-full flex items-center gap-1.5 dark:border-white/5 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Upload className="h-3.5 w-3.5" /> Import CSV
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImportCSV} 
            accept=".csv" 
            className="hidden" 
          />

          <Link 
            href="/admin/products/new"
            className="px-4 py-2 bg-brand-blue hover:bg-blue-600 rounded-full text-xs font-bold text-white transition flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
          >
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search products by title, category, or model SKU..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-brand-mist/50 focus:bg-white rounded-full border border-black/5 focus:border-brand-blue outline-none text-sm text-brand-ink dark:bg-zinc-800/50 dark:focus:bg-zinc-900 dark:border-white/5 dark:text-white transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-zinc-400" />
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="text-xs font-semibold bg-brand-mist/50 dark:bg-zinc-800/50 border border-black/5 dark:border-white/5 rounded-full px-3 py-2"
            >
              <option value="all">All Categories</option>
              {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <select
            value={stockFilter}
            onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }}
            className="text-xs font-semibold bg-brand-mist/50 dark:bg-zinc-800/50 border border-black/5 dark:border-white/5 rounded-full px-3 py-2"
          >
            <option value="all">All Stock Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Preorder">Preorder</option>
          </select>
        </div>
      </div>

      {/* Selected Items / Bulk Actions Banner */}
      {selectedIds.length > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-[2rem] border border-brand-blue/20 flex items-center justify-between animate-slide-up">
          <p className="text-xs font-bold text-brand-blue flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> Selected {selectedIds.length} items
          </p>
          <div className="flex gap-3">
            <button 
              onClick={handleBulkDelete}
              className="px-4 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900 text-xs font-bold text-rose-700 dark:text-rose-300 rounded-full flex items-center gap-1.5 transition"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete Selected
            </button>
            <button 
              onClick={() => setSelectedIds([])}
              className="px-4 py-1.5 bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-xs font-bold text-zinc-700 dark:text-zinc-300 rounded-full transition"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Products Table Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-400 font-semibold uppercase">
                <th className="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedProducts.length && paginatedProducts.length > 0}
                    onChange={handleSelectAll}
                    className="h-3.5 w-3.5 rounded border-zinc-300 text-brand-blue"
                  />
                </th>
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Condition</th>
                <th className="px-6 py-4">Availability</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5 font-semibold text-brand-ink dark:text-white">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  return (
                    <tr 
                      key={p.id} 
                      className={cn(
                        "hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition",
                        isSelected && "bg-blue-50/30 dark:bg-blue-950/10"
                      )}
                    >
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(p.id)}
                          className="h-3.5 w-3.5 rounded border-zinc-300 text-brand-blue"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 relative bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center border border-black/5 dark:border-white/5">
                            <Image
                              src={p.images[0] || "/iphone-dummy.png"}
                              alt={p.name}
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{p.name}</p>
                            <p className="text-[10px] text-zinc-400 font-mono">ID: {p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-500">{p.category}</td>
                      <td className="px-6 py-4 text-brand-blue font-bold">{formatCurrency(p.price)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {p.condition.map(c => (
                            <span key={c} className="text-[9px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md">
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.availability === "In Stock" 
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                            : p.availability === "Low Stock"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                        }`}>
                          {p.availability}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/products/${p.id}`}
                            title="Edit Product"
                            className="p-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 rounded-lg dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Link>
                          
                          <button
                            onClick={() => {
                              if (!isRoleRestricted) duplicateProduct(p.id);
                              else alert("Access Denied: Restricted role permissions.");
                            }}
                            title="Duplicate SKU"
                            className="p-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 rounded-lg dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (!isRoleRestricted) archiveProduct(p.id);
                              else alert("Access Denied: Restricted role permissions.");
                            }}
                            title="Archive"
                            className="p-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 rounded-lg dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition"
                          >
                            <Archive className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (currentRole !== "Support Staff") {
                                if (window.confirm("Delete this product?")) deleteProduct(p.id);
                              } else {
                                alert("Access Denied: Support Staff do not have deletion permissions.");
                              }
                            }}
                            title="Delete"
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-900/30 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-400 font-semibold">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-zinc-300" />
                    No products found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-850/20 text-xs">
            <span className="text-zinc-400 font-semibold">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-750 transition"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-750 transition"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
