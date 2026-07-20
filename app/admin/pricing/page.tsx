"use client";

import React, { useState, useMemo } from "react";
import { 
  DollarSign, 
  Search, 
  TrendingDown, 
  Percent, 
  Save, 
  AlertTriangle,
  Sparkles,
  ArrowDown
} from "lucide-react";
import { useAdminStore } from "@/context/admin-store";
import { formatCurrency } from "@/lib/utils";

export default function PricingPage() {
  const { products, editProduct, currentRole } = useAdminStore();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Bulk discount inputs
  const [bulkCategory, setBulkCategory] = useState("iPhone");
  const [bulkDiscountPct, setBulkDiscountPct] = useState(5);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const handlePriceChange = (productId: string, field: "price" | "compareAtPrice", val: number) => {
    if (currentRole === "Sales Staff" || currentRole === "Support Staff") {
      alert("Access Denied: Restricted role permissions.");
      return;
    }
    const product = products.find(p => p.id === productId);
    if (product) {
      editProduct({
        ...product,
        [field]: val
      });
    }
  };

  const handleApplyBulkDiscount = () => {
    if (currentRole === "Sales Staff" || currentRole === "Support Staff") {
      alert("Access Denied: Restricted role permissions.");
      return;
    }

    if (window.confirm(`Are you sure you want to apply a ${bulkDiscountPct}% discount to all products in category "${bulkCategory}"?`)) {
      products.forEach(p => {
        if (p.category === bulkCategory) {
          const factor = (100 - bulkDiscountPct) / 100;
          const newPrice = Math.round(p.price * factor);
          editProduct({
            ...p,
            compareAtPrice: p.price,
            price: newPrice
          });
        }
      });
      alert(`Successfully applied ${bulkDiscountPct}% discount to all "${bulkCategory}" products!`);
    }
  };

  const categoriesList = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-brand-ink dark:text-white">Pricing & Campaigns</h1>
        <p className="text-zinc-500 text-sm">Fine-tune device prices, configure markdown ratios, and apply bulk category-wide discounts.</p>
      </div>

      {/* Grid: Category markdown + alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Bulk markdown manager */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-brand-ink dark:text-white pb-3 border-b border-black/5 dark:border-white/5 flex items-center gap-2">
            <Percent className="h-5 w-5 text-brand-blue" /> Bulk Category Markdown
          </h2>
          <p className="text-xs text-zinc-500">Instantly slash prices for an entire department for flash deals or restock clearouts.</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-xs font-bold text-zinc-500">
              Target Category
              <select
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value)}
                className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-850 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition text-xs font-semibold"
              >
                {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </label>

            <label className="grid gap-1 text-xs font-bold text-zinc-500">
              Discount Amount (%)
              <input
                type="number"
                min={1}
                max={90}
                value={bulkDiscountPct}
                onChange={(e) => setBulkDiscountPct(Number(e.target.value))}
                className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition text-xs font-semibold"
              />
            </label>
          </div>

          <button
            onClick={handleApplyBulkDiscount}
            className="w-full py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20"
          >
            <ArrowDown className="h-4 w-4" /> Apply Category Markdown
          </button>
        </div>

        {/* Pricing notice */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4 justify-between flex flex-col">
          <div className="space-y-2">
            <h3 className="font-bold text-brand-ink dark:text-white flex items-center gap-1.5">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> Margin Guard Policy
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              TroyX iStore pricing operations follow strict local VAT configurations (default: 15% VAT). Ensure list price changes leave adequate space above wholesale landing costs to avoid negative billing lines.
            </p>
          </div>
          <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 text-amber-800 dark:text-amber-300 rounded-2xl text-[10px] font-semibold">
            Warning: Dropping final customer price below original supplier MSRP prompts audit logs alert.
          </div>
        </div>
      </div>

      {/* Pricing list table */}
      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-850/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search catalog models..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 focus:border-brand-blue outline-none text-xs rounded-full"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 rounded-full px-3 py-1.5 font-semibold outline-none"
          >
            <option value="all">All Categories</option>
            {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-850/20 text-zinc-400 font-semibold uppercase">
                <th className="px-6 py-4">Product Model</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">MSRP / Original (₵)</th>
                <th className="px-6 py-4 text-right">Selling Price (₵)</th>
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
                  <td className="px-6 py-4 text-right">
                    <input
                      type="number"
                      value={p.compareAtPrice || ""}
                      onChange={(e) => handlePriceChange(p.id, "compareAtPrice", Number(e.target.value))}
                      placeholder="MSRP"
                      className="w-24 text-right px-2.5 py-1 bg-zinc-50 dark:bg-zinc-800 border border-black/10 dark:border-white/10 rounded-md font-mono font-bold"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <input
                      type="number"
                      value={p.price || ""}
                      onChange={(e) => handlePriceChange(p.id, "price", Number(e.target.value))}
                      className="w-24 text-right px-2.5 py-1 bg-zinc-50 dark:bg-zinc-800 border border-black/10 dark:border-white/10 rounded-md font-mono font-bold text-brand-blue"
                    />
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
