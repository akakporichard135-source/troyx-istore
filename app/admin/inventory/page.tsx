"use client";

import React, { useState, useMemo } from "react";
import { 
  Boxes, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  Save,
  Download,
  Plus,
  Minus
} from "lucide-react";
import { useAdminStore } from "@/context/admin-store";
import { formatCurrency } from "@/lib/utils";

export default function InventoryPage() {
  const { products, editProduct, currentRole } = useAdminStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.availability === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const stockSummary = useMemo(() => {
    const total = products.length;
    const instock = products.filter(p => p.availability === "In Stock").length;
    const low = products.filter(p => p.availability === "Low Stock").length;
    const out = products.filter(p => p.availability === "Out of Stock").length;
    return { total, instock, low, out };
  }, [products]);

  const handleStockStatusChange = (productId: string, availability: any) => {
    if (currentRole === "Support Staff") {
      alert("Access Denied: Support Staff do not have edit product permissions.");
      return;
    }
    const product = products.find(p => p.id === productId);
    if (product) {
      editProduct({
        ...product,
        availability
      });
    }
  };

  const handleExportStockReport = () => {
    const headers = "ID,Name,Category,Availability,Warranty\n";
    const rows = products.map(p => 
      `"${p.id}","${p.name}","${p.category}","${p.availability}","${p.warranty}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `troyx-inventory-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-ink dark:text-white">Inventory Stocks</h1>
          <p className="text-zinc-500 text-sm">Monitor warehouse logistics, resolve low-stock triggers, and update device availability states.</p>
        </div>
        <button 
          onClick={handleExportStockReport}
          className="px-4 py-2 border border-black/5 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-700 rounded-full flex items-center gap-1.5 dark:border-white/5 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <Download className="h-3.5 w-3.5" /> Export Stock CSV
        </button>
      </div>

      {/* Stock summaries */}
      <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm">
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Total SKU Catalog</p>
          <p className="text-3xl font-black text-brand-ink dark:text-white mt-2">{stockSummary.total} models</p>
        </div>
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm">
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">In Stock</p>
          <p className="text-3xl font-black text-brand-ink dark:text-white mt-2">{stockSummary.instock} models</p>
        </div>
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm">
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">Low Stock Alerts</p>
          <p className="text-3xl font-black text-brand-ink dark:text-white mt-2">{stockSummary.low} models</p>
        </div>
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm">
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">Out of Stock</p>
          <p className="text-3xl font-black text-brand-ink dark:text-white mt-2">{stockSummary.out} models</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search warehouse logs by product title or SKU ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-brand-mist/50 focus:bg-white rounded-full border border-black/5 focus:border-brand-blue outline-none text-sm text-brand-ink dark:bg-zinc-800/50 dark:focus:bg-zinc-900 dark:border-white/5 dark:text-white transition"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs font-semibold bg-brand-mist/50 dark:bg-zinc-800/50 border border-black/5 dark:border-white/5 rounded-full px-4 py-2 outline-none"
        >
          <option value="all">All Stocks Statuses</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
          <option value="Preorder">Pre-order Availability</option>
        </select>
      </div>

      {/* Stock Catalog Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-850/20 text-zinc-400 font-semibold uppercase">
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Current Status</th>
                <th className="px-6 py-4">Adjust Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5 font-semibold text-brand-ink dark:text-white">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-850/20 transition">
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm">{p.name}</p>
                    <p className="text-[10px] text-zinc-400 font-mono">SKU: {p.id}</p>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">{p.category}</td>
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
                    <select
                      value={p.availability}
                      onChange={(e) => handleStockStatusChange(p.id, e.target.value)}
                      className="text-xs bg-zinc-50 dark:bg-zinc-800 border border-black/10 dark:border-white/10 rounded-full px-3 py-1.5 font-semibold outline-none"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                      <option value="Preorder">Pre-order</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
