"use client";

import React, { useState, useEffect } from "react";
import { formatGHS } from "@/lib/pricing";
import { OrderRecord } from "@/lib/types";
import { ShoppingBag, MessageCircle, Phone, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: OrderRecord["status"]) => {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handlePaymentChange = async (orderId: string, paymentStatus: OrderRecord["paymentStatus"]) => {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus }),
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus } : o))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Fulfillment & Sales
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">
            Orders & Purchase Requests
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Track customer inquiries, showroom pickups, and deliveries across Accra.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="p-16 rounded-2xl bg-[#161617] border border-zinc-800 text-center space-y-3">
          <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto" />
          <h2 className="text-base font-semibold text-white">No Customer Orders Yet</h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            When visitors request devices on the live store or click WhatsApp checkout, orders will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">
                      #{order.orderNumber}
                    </span>
                    <span className="text-xs font-semibold text-zinc-300">
                      {order.customerName}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{order.customerPhone}</span>
                    </span>
                    <span>Method: {order.deliveryMethod === "pickup" ? "Showroom Pickup (East Legon)" : `Accra Delivery (${order.deliveryAddress})`}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* WhatsApp Direct Assist */}
                  <a
                    href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(order.customerName)},%20this%20is%20TroyX%20iStore%20regarding%20order%20%23${order.orderNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-medium hover:bg-emerald-900 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp Customer</span>
                  </a>

                  {/* Order Status Selector */}
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="ready_for_pickup">Ready for Pickup</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {/* Payment Status Selector */}
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => handlePaymentChange(order.id, e.target.value as any)}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid_on_delivery">Paid on Delivery</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="momo">MTN / Telecel MoMo</option>
                  </select>
                </div>
              </div>

              {/* Items in Order */}
              <div className="space-y-2 text-xs">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-zinc-300 py-1">
                    <div>
                      <span className="font-medium text-white">{item.productName}</span>{" "}
                      <span className="text-zinc-500">x {item.quantity}</span>
                      <span className="text-zinc-600 font-mono ml-2">({item.sku})</span>
                    </div>
                    <span className="font-semibold">{formatGHS(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800/80 pt-3 flex justify-between items-center text-xs">
                <span className="text-zinc-400">Total Validated Amount</span>
                <span className="text-base font-bold text-white">{formatGHS(order.totalAmount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
