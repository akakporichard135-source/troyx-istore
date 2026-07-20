"use client";

import React, { useState, useMemo } from "react";
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Printer, 
  MessageSquare, 
  Calendar, 
  Truck,
  CreditCard,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from "lucide-react";
import { useAdminStore } from "@/context/admin-store";
import { formatCurrency } from "@/lib/utils";
import type { OrderStatus } from "@/types";

export default function OrdersManagerPage() {
  const { 
    orders, 
    currentRole,
    updateOrderStatus, 
    updateOrderDetails,
    addOrderNote, 
    cancelOrder,
    refundOrder 
  } = useAdminStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  
  // Note input state
  const [noteInput, setNoteInput] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) || 
                            o.id.toLowerCase().includes(search.toLowerCase()) ||
                            o.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const activeOrder = useMemo(() => {
    return orders.find(o => o.id === activeOrderId) || null;
  }, [orders, activeOrderId]);

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  };

  const handleShippingPaymentChange = (orderId: string, shipStatus: any, payStatus: any) => {
    updateOrderDetails(orderId, shipStatus, payStatus);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim() || !activeOrderId) return;
    addOrderNote(activeOrderId, noteInput.trim());
    setNoteInput("");
  };

  const handlePrint = (orderId: string) => {
    // Basic browser trigger or print layout styling helper
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in print:bg-white print:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-ink dark:text-white">Orders Fulfillment</h1>
          <p className="text-zinc-500 text-sm">Process incoming purchases, update tracking details, generate billing invoices, and log notes.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm flex flex-col md:flex-row md:items-center gap-4 print:hidden">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search orders by invoice ID, customer name, or email..."
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
          <option value="all">All Order Statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Processing">Processing</option>
          <option value="Packed">Packed</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Split view: Orders List / Order Detail Inspector */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1.8fr]">
        
        {/* Left Side: Order List */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm overflow-hidden flex flex-col print:hidden">
          <div className="p-4 border-b border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-850/20">
            <span className="text-xs font-bold text-zinc-500">{filteredOrders.length} matching orders</span>
          </div>

          <div className="divide-y divide-black/5 dark:divide-white/5 overflow-y-auto max-h-[500px]">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((o) => {
                const isActive = o.id === activeOrderId;
                return (
                  <button
                    key={o.id}
                    onClick={() => setActiveOrderId(o.id)}
                    className={`w-full text-left p-5 flex flex-col gap-2 transition ${
                      isActive ? "bg-blue-50/40 dark:bg-blue-950/10 border-l-4 border-brand-blue" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-mono font-bold text-brand-blue text-sm">{o.id}</span>
                      <span className="text-[10px] text-zinc-400 font-medium">
                        {new Date(o.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center w-full">
                      <div>
                        <p className="font-bold text-sm text-brand-ink dark:text-white">{o.customerName}</p>
                        <p className="text-[10px] text-zinc-400">{o.items.length} item(s)</p>
                      </div>
                      <span className="font-extrabold text-sm text-brand-ink dark:text-white">
                        {formatCurrency(o.total)}
                      </span>
                    </div>

                    <div className="flex gap-2 items-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        o.status === "Delivered" 
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                          : o.status === "Cancelled"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                      }`}>
                        {o.status}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        o.paymentStatus === "Paid" 
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                      }`}>
                        Card - {o.paymentStatus}
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-12 text-center text-zinc-400 font-semibold">
                No orders match search parameters.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Order Detail Inspector */}
        <div className="space-y-6">
          {activeOrder ? (
            <>
              {/* Main Invoice view (Print Target) */}
              <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-6 print:border-none print:shadow-none">
                {/* Print Invoice Header */}
                <div className="flex justify-between items-start border-b border-black/5 dark:border-white/5 pb-5">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Fulfillment Invoice</span>
                    <h2 className="text-2xl font-black text-brand-ink dark:text-white font-mono mt-0.5">{activeOrder.id}</h2>
                    <p className="text-zinc-400 text-xs mt-1">Order Date: {new Date(activeOrder.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2 print:hidden">
                    <button 
                      onClick={() => handlePrint(activeOrder.id)}
                      className="p-2 border border-black/10 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-300 transition"
                      title="Print Invoice"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Logistics & Payment Management */}
                <div className="grid gap-4 sm:grid-cols-2 bg-brand-mist/50 dark:bg-zinc-800/30 p-4 rounded-2xl print:hidden">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5" /> Shipping Status
                    </span>
                    <select
                      value={activeOrder.shippingStatus}
                      onChange={(e) => handleShippingPaymentChange(activeOrder.id, e.target.value, activeOrder.paymentStatus)}
                      className="text-xs font-semibold bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-full px-3 py-1.5 outline-none"
                    >
                      <option value="Unshipped">Unshipped</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                      <CreditCard className="h-3.5 w-3.5" /> Payment Status
                    </span>
                    <select
                      value={activeOrder.paymentStatus}
                      onChange={(e) => handleShippingPaymentChange(activeOrder.id, activeOrder.shippingStatus, e.target.value)}
                      className="text-xs font-semibold bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-full px-3 py-1.5 outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                {/* Quick Status Setter */}
                <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-black/5 dark:border-white/5 print:hidden">
                  <span className="text-xs text-zinc-400 font-semibold mr-1">Move Order Status:</span>
                  {(["Confirmed", "Processing", "Packed", "Out for Delivery", "Delivered"] as OrderStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(activeOrder.id, status)}
                      className={`px-3 py-1 rounded-full text-[10px] font-semibold transition ${
                        activeOrder.status === status 
                          ? "bg-brand-blue text-white" 
                          : "bg-zinc-50 border border-black/5 hover:bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:border-white/5 dark:text-zinc-300"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                {/* Customer Details */}
                <div className="grid gap-6 sm:grid-cols-2 text-xs">
                  <div>
                    <h3 className="font-bold text-zinc-400 uppercase tracking-wider mb-2">Deliver To</h3>
                    <p className="font-bold text-sm text-brand-ink dark:text-white">{activeOrder.customerName}</p>
                    <p className="text-zinc-500 mt-1">{activeOrder.phone}</p>
                    <p className="text-zinc-500">{activeOrder.email}</p>
                    <p className="text-zinc-600 dark:text-zinc-300 mt-2 font-medium leading-relaxed">{activeOrder.shippingAddress}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-400 uppercase tracking-wider mb-2">Billing & Payment</h3>
                    <p className="text-zinc-600 dark:text-zinc-300 font-medium">Method: {activeOrder.paymentMethod}</p>
                    <p className="text-zinc-650 dark:text-zinc-350 mt-1 font-medium leading-relaxed">Billing Address: {activeOrder.billingAddress}</p>
                    {activeOrder.customerNotes && (
                      <div className="mt-3 p-3 bg-amber-50/50 border border-amber-200/50 text-amber-800 rounded-xl dark:bg-amber-950/20 dark:text-amber-300">
                        <span className="font-bold block text-[10px] uppercase">Customer Notes</span>
                        {activeOrder.customerNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Invoice Items Table */}
                <div className="border-t border-b border-black/5 dark:border-white/5 py-4">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-zinc-400 font-bold uppercase">
                        <th className="py-2 text-left">Item Description</th>
                        <th className="py-2 text-center w-16">Qty</th>
                        <th className="py-2 text-right w-24">Unit Price</th>
                        <th className="py-2 text-right w-24">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 font-semibold text-brand-ink dark:text-white">
                      {activeOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-3">
                            <p className="font-bold">{item.name}</p>
                            <p className="text-[10px] text-zinc-400 font-medium">
                              {item.color} {item.storage} {item.condition}
                            </p>
                          </td>
                          <td className="py-3 text-center">{item.quantity}</td>
                          <td className="py-3 text-right">{formatCurrency(item.price)}</td>
                          <td className="py-3 text-right font-bold">{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total pricing calculation */}
                <div className="flex justify-between items-center text-sm font-black pt-2">
                  <span className="text-zinc-400 uppercase tracking-wider text-xs">Invoice Total</span>
                  <span className="text-xl text-brand-ink dark:text-white font-mono">{formatCurrency(activeOrder.total)}</span>
                </div>

                {/* Order cancellation and refund controls */}
                <div className="flex gap-3 pt-4 border-t border-black/5 dark:border-white/5 print:hidden">
                  <button
                    onClick={() => {
                      if (window.confirm("Process a refund for this order?")) refundOrder(activeOrder.id);
                    }}
                    disabled={activeOrder.paymentStatus !== "Paid"}
                    className="flex-1 py-2.5 rounded-full border border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750 text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Refund Order
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm("Cancel this order?")) cancelOrder(activeOrder.id);
                    }}
                    disabled={activeOrder.status === "Cancelled" || activeOrder.status === "Delivered"}
                    className="flex-1 py-2.5 rounded-full bg-rose-50 border border-rose-200 hover:bg-rose-100 dark:bg-rose-950/20 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Cancel Order
                  </button>
                </div>
              </div>

              {/* Admin Support Notes Widget */}
              <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4 print:hidden">
                <h3 className="font-bold text-brand-ink dark:text-white flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-brand-blue" /> Support Log & Internal Notes
                </h3>
                
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {activeOrder.adminNotes && activeOrder.adminNotes.length > 0 ? (
                    activeOrder.adminNotes.map((note, idx) => (
                      <div key={idx} className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-xs font-semibold leading-relaxed border border-black/5 dark:border-white/5">
                        {note}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-400 italic">No admin notes logged for this invoice.</p>
                  )}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Type internal tracking update or note..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="flex-1 px-4 py-2 bg-brand-mist/50 focus:bg-white rounded-full border border-black/5 focus:border-brand-blue outline-none text-xs text-brand-ink dark:bg-zinc-800/50 dark:focus:bg-zinc-900 dark:border-white/5 dark:text-white transition"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-950 dark:bg-zinc-700 dark:hover:bg-zinc-650 text-white rounded-full text-xs font-bold transition"
                  >
                    Log Note
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="p-12 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm text-center text-zinc-400 font-semibold h-full flex flex-col items-center justify-center">
              <AlertCircle className="h-8 w-8 text-zinc-300 mb-2" />
              Select an order from the list to inspect details.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
