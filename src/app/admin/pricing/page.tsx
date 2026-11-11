"use client";

import React, { useState, useEffect, useRef } from "react";
import { formatGHS } from "@/lib/pricing";
import { ProductRecord } from "@/lib/types";
import {
  Tag,
  Save,
  CheckCircle2,
  AlertCircle,
  Download,
  Upload,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";

export default function AdminPricingPage() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [prices, setPrices] = useState<Record<string, { basePrice: number; discountPrice?: number | null }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
        const map: Record<string, { basePrice: number; discountPrice?: number | null }> = {};
        data.products.forEach((p: ProductRecord) => {
          map[p.id] = { basePrice: p.basePrice, discountPrice: p.discountPrice };
        });
        setPrices(map);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handlePriceChange = (id: string, field: "basePrice" | "discountPrice", value: string) => {
    const num = parseFloat(value);
    setPrices((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: isNaN(num) ? 0 : num,
      },
    }));
  };

  const handleBulkSave = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);

    const updates = Object.entries(prices).map(([id, p]) => ({
      id,
      basePrice: p.basePrice,
      discountPrice: p.discountPrice || null,
    }));

    try {
      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save prices");
      }

      setMessage(`Successfully updated pricing for ${data.count} product(s) with audit log!`);
      loadProducts();
    } catch (err: any) {
      setError(err.message || "Failed to save prices.");
    } finally {
      setSaving(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (products.length === 0) return;

    let csv = "ID,Name,SKU,Category,BasePrice_GHS,DiscountPrice_GHS\n";
    products.forEach((p) => {
      const current = prices[p.id] || { basePrice: p.basePrice, discountPrice: p.discountPrice };
      const safeName = `"${p.name.replace(/"/g, '""')}"`;
      csv += `${p.id},${safeName},${p.sku},${p.category},${current.basePrice},${current.discountPrice || ""}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `troyx_prices_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import CSV
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) return;

        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          setError("CSV file appears to be empty or missing header.");
          return;
        }

        let updatedCount = 0;
        const newPrices = { ...prices };

        // Parse rows (ignoring header)
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i];
          // Simple CSV parser supporting quotes
          const matches = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
          if (!matches || matches.length < 5) continue;

          const idOrSku = matches[0].replace(/^"|"$/g, "").trim();
          const basePriceStr = matches[4] ? matches[4].replace(/^"|"$/g, "").trim() : "";
          const discountStr = matches[5] ? matches[5].replace(/^"|"$/g, "").trim() : "";

          const basePriceNum = parseFloat(basePriceStr);
          const discountNum = discountStr ? parseFloat(discountStr) : null;

          if (!isNaN(basePriceNum) && basePriceNum > 0) {
            // Find product by id or sku
            const prod = products.find((p) => p.id === idOrSku || p.sku === idOrSku);
            if (prod) {
              newPrices[prod.id] = {
                basePrice: basePriceNum,
                discountPrice: discountNum,
              };
              updatedCount++;
            }
          }
        }

        setPrices(newPrices);
        setMessage(`Imported and populated new prices for ${updatedCount} products from CSV. Click "Save All Prices" to apply.`);
      } catch (err: any) {
        setError("Failed to parse CSV file: " + err.message);
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Financial Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">
            Pricing & Inventory Engine
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage Ghana cedi (GH₵) price points, CSV bulk spreadsheets, and discount campaigns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {products.length > 0 && (
            <>
              {/* CSV Export */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="apple-btn-secondary text-xs flex items-center gap-1.5"
                title="Download pricing spreadsheet"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              {/* CSV Import */}
              <label className="apple-btn-secondary text-xs flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Import CSV</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={handleImportCSV}
                />
              </label>

              {/* Bulk Save */}
              <button
                type="button"
                onClick={handleBulkSave}
                disabled={saving}
                className="apple-btn-primary text-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving Changes..." : "Save All Prices"}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {products.length === 0 ? (
        <div className="p-16 rounded-2xl bg-[#161617] border border-zinc-800 text-center space-y-3">
          <Tag className="w-10 h-10 text-zinc-600 mx-auto" />
          <h2 className="text-base font-semibold text-white">No Catalog Products Found</h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Once you add genuine Apple items to your catalog, you can manage bulk pricing in Ghana cedi here.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#161617] border border-zinc-800 overflow-hidden">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
              <tr>
                <th className="px-6 py-4">Product Name & SKU</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Regular Base Price (GH₵)</th>
                <th className="px-6 py-4">Special Discount Price (GH₵)</th>
                <th className="px-6 py-4">Effective Customer Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {products.map((prod) => {
                const current = prices[prod.id] || { basePrice: prod.basePrice, discountPrice: prod.discountPrice };
                const effective = current.discountPrice && current.discountPrice > 0 ? current.discountPrice : current.basePrice;

                return (
                  <tr key={prod.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{prod.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        SKU: {prod.sku}
                      </div>
                    </td>

                    <td className="px-6 py-4 capitalize text-zinc-400">{prod.category}</td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-zinc-200">{prod.stockQuantity} units</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-zinc-500 font-medium">GH₵</span>
                        <input
                          type="number"
                          step="0.01"
                          value={current.basePrice || ""}
                          onChange={(e) => handlePriceChange(prod.id, "basePrice", e.target.value)}
                          className="w-32 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-white"
                        />
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-zinc-500 font-medium">GH₵</span>
                        <input
                          type="number"
                          step="0.01"
                          value={current.discountPrice || ""}
                          onChange={(e) => handlePriceChange(prod.id, "discountPrice", e.target.value)}
                          placeholder="Optional"
                          className="w-32 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-white"
                        />
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-emerald-400">{formatGHS(effective)}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
