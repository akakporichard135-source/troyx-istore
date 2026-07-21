"use client";

import { useState } from "react";
import { ShoppingBag, Search, CheckCircle2, Clock, Truck, PackageCheck, AlertCircle } from "lucide-react";
import { useVendorStore } from "@/context/vendor-store";
import { useAdminStore } from "@/context/admin-store";
import { Button } from "@/components/ui/button";
import type { OrderStatus } from "@/types";

export default function VendorOrdersPage() {
  const activeVendorId = useVendorStore((state) => state.activeVendorId);
  const vendors = useVendorStore((state) => state.vendors);
  const orders = useAdminStore((state) => state.orders);
  const updateOrderStatus = useAdminStore((state) => state.updateOrderStatus);

  const vendor = vendors.find((v) => v.id === activeVendorId) || vendors[0];

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const vendorOrders = orders; // All orders integrated with admin order pipeline

  const filtered = vendorOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Store Orders & Fulfillment</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Orders placed for <strong className="text-white">{vendor?.name}</strong> products across Ghana.
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by Order ID, customer name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-xl border border-white/10 bg-zinc-900 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-brand-blue focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 p-1 text-xs">
          {["All", "Confirmed", "Processing", "Out for Delivery", "Delivered", "Cancelled"].map((st) => (
            <button
              key={st}
              type="button"
              className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                filterStatus === st ? "bg-brand-blue text-white" : "text-zinc-400 hover:text-white"
              }`}
              onClick={() => setFilterStatus(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filtered.map((order) => (
          <div
            key={order.id}
            className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-brand-blue">{order.id}</span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                    order.status === "Delivered"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : order.status === "Cancelled"
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-400">Update Status:</span>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                  className="h-9 rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs font-semibold text-white focus:border-brand-blue focus:outline-none"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Packed">Packed</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Order Items & Customer Details */}
            <div className="grid gap-6 md:grid-cols-3 text-xs">
              <div className="md:col-span-2 space-y-3">
                <p className="font-bold text-zinc-400 text-[11px] uppercase tracking-wider">Ordered Items</p>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-xl border border-white/5 bg-zinc-950/60 p-3">
                      <div>
                        <p className="font-bold text-white">{item.name}</p>
                        <p className="text-[11px] text-zinc-400">
                          Qty: {item.quantity} &bull; Color: {item.color || "Standard"} &bull; Storage: {item.storage || "N/A"}
                        </p>
                      </div>
                      <p className="font-bold text-emerald-400">GH₵ {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-zinc-950/60 p-4 space-y-2 text-zinc-300">
                <p className="font-bold text-zinc-400 text-[11px] uppercase tracking-wider">Customer & Delivery</p>
                <p className="font-bold text-white">{order.customerName}</p>
                <p className="text-[11px] text-zinc-400">{order.phone} &bull; {order.email}</p>
                <p className="text-[11px] text-zinc-300 border-t border-white/5 pt-2 mt-2">{order.shippingAddress}</p>
                <p className="text-[11px] font-semibold text-emerald-400 mt-1">Payment Method: {order.paymentMethod}</p>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-xs text-zinc-500 rounded-3xl border border-white/10 bg-zinc-900/40">
            No orders match your filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
