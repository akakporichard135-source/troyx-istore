"use client";

import { useState } from "react";
import { Boxes, AlertTriangle, CheckCircle2, ArrowUpDown } from "lucide-react";
import { useVendorStore } from "@/context/vendor-store";
import { useAdminStore } from "@/context/admin-store";
import { Button } from "@/components/ui/button";

export default function VendorInventoryPage() {
  const activeVendorId = useVendorStore((state) => state.activeVendorId);
  const vendors = useVendorStore((state) => state.vendors);
  const products = useAdminStore((state) => state.products);
  const editProduct = useAdminStore((state) => state.editProduct);

  const vendor = vendors.find((v) => v.id === activeVendorId) || vendors[0];
  const vendorProducts = products.filter(
    (p) => p.vendorId === vendor?.id || (vendor?.isFlagship && (!p.vendorId || p.vendorId === "v-troyx-flagship"))
  );

  const lowStockCount = vendorProducts.filter((p) => p.availability === "Low Stock" || p.availability === "Out of Stock").length;

  const toggleAvailability = (prodId: string, current: string) => {
    const prod = vendorProducts.find((p) => p.id === prodId);
    if (!prod) return;

    const nextStatus = current === "In Stock" ? "Low Stock" : current === "Low Stock" ? "Out of Stock" : "In Stock";
    editProduct({
      ...prod,
      availability: nextStatus as any
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Stock & Inventory Management</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time stock alerts and availability toggles for <strong className="text-white">{vendor?.name}</strong>.
          </p>
        </div>
      </div>

      {lowStockCount > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs font-semibold text-amber-300">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
          <span>
            Attention: You have <strong>{lowStockCount} product(s)</strong> with low or out-of-stock inventory. Update stock status to prevent missing orders.
          </span>
        </div>
      )}

      {/* Inventory Table */}
      <div className="rounded-3xl border border-white/10 bg-zinc-900/60 overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-zinc-950/80 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Current Stock Status</th>
                <th className="py-3.5 px-4 text-right">Quick Stock Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {vendorProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-white/5 transition">
                  <td className="py-3.5 px-4 font-bold text-white">
                    <div className="flex items-center gap-3">
                      <img src={prod.images[0]} alt={prod.name} className="h-9 w-9 rounded-xl border border-white/10 object-cover bg-zinc-800 shrink-0" />
                      <span>{prod.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400">{prod.category}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">GH₵ {prod.price.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      prod.availability === "In Stock"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : prod.availability === "Low Stock"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>
                      {prod.availability}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleAvailability(prod.id, prod.availability)}
                      className="h-8 text-[11px] font-semibold border-white/10 text-white hover:bg-white/10"
                    >
                      <ArrowUpDown className="h-3 w-3 mr-1 text-brand-blue" />
                      Toggle Status
                    </Button>
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
