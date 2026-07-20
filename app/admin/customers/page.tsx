"use client";

import React, { useState, useMemo } from "react";
import { 
  Users, 
  Search, 
  DollarSign, 
  ShoppingBag, 
  MapPin, 
  Heart, 
  Plus, 
  MessageSquare, 
  Clock, 
  Mail, 
  Phone,
  AlertCircle
} from "lucide-react";
import { useAdminStore } from "@/context/admin-store";
import { formatCurrency } from "@/lib/utils";

export default function CustomersPage() {
  const { customers, orders, currentRole, addCustomerNote } = useAdminStore();
  
  const [search, setSearch] = useState("");
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState("");

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    );
  }, [customers, search]);

  const activeCustomer = useMemo(() => {
    return customers.find(c => c.id === activeCustomerId) || null;
  }, [customers, activeCustomerId]);

  const customerOrders = useMemo(() => {
    if (!activeCustomer) return [];
    return orders.filter(o => o.email.toLowerCase() === activeCustomer.email.toLowerCase());
  }, [orders, activeCustomer]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim() || !activeCustomerId) return;
    addCustomerNote(activeCustomerId, noteInput.trim());
    setNoteInput("");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-brand-ink dark:text-white">Customer Profiles</h1>
        <p className="text-zinc-500 text-sm">Manage user accounts, review lifecycle values, trace wishlists, and log communication notes.</p>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search customers by name, phone contact, or registered email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-brand-mist/50 focus:bg-white rounded-full border border-black/5 focus:border-brand-blue outline-none text-sm text-brand-ink dark:bg-zinc-800/50 dark:focus:bg-zinc-900 dark:border-white/5 dark:text-white transition"
          />
        </div>
      </div>

      {/* Split view: Customer list & profile details card */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1.8fr]">
        
        {/* Customer List */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-850/20">
            <span className="text-xs font-bold text-zinc-500">{filteredCustomers.length} registered profiles</span>
          </div>

          <div className="divide-y divide-black/5 dark:divide-white/5 overflow-y-auto max-h-[500px]">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((c) => {
                const isActive = c.id === activeCustomerId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveCustomerId(c.id)}
                    className={`w-full text-left p-5 flex items-center gap-3 transition ${
                      isActive ? "bg-blue-50/40 dark:bg-blue-950/10 border-l-4 border-brand-blue" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-600 dark:text-zinc-300">
                      {c.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-brand-ink dark:text-white truncate">{c.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{c.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-brand-ink dark:text-white">{formatCurrency(c.lifetimeSpend)}</p>
                      <p className="text-[9px] text-zinc-400">{c.ordersCount} orders</p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-12 text-center text-zinc-400 font-semibold">
                No customer profiles match.
              </div>
            )}
          </div>
        </div>

        {/* Customer Detail Inspector */}
        <div className="space-y-6">
          {activeCustomer ? (
            <>
              {/* Profile Card */}
              <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-6">
                <div className="flex items-center gap-4 pb-5 border-b border-black/5 dark:border-white/5">
                  <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-black text-lg text-brand-blue">
                    {activeCustomer.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-brand-ink dark:text-white">{activeCustomer.name}</h2>
                    <p className="text-xs text-zinc-400">Customer ID: {activeCustomer.id} | Joined: {new Date(activeCustomer.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* KPI block */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-brand-mist/50 dark:bg-zinc-800/30 rounded-2xl">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5" /> Lifetime Value
                    </span>
                    <p className="text-lg font-black text-brand-ink dark:text-white mt-1">
                      {formatCurrency(activeCustomer.lifetimeSpend)}
                    </p>
                  </div>

                  <div className="p-4 bg-brand-mist/50 dark:bg-zinc-800/30 rounded-2xl">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide flex items-center gap-1">
                      <ShoppingBag className="h-3.5 w-3.5" /> Placed Orders
                    </span>
                    <p className="text-lg font-black text-brand-ink dark:text-white mt-1">
                      {activeCustomer.ordersCount}
                    </p>
                  </div>
                </div>

                {/* Contacts & Addresses */}
                <div className="grid gap-6 sm:grid-cols-2 text-xs">
                  <div className="space-y-2">
                    <h3 className="font-bold text-zinc-400 uppercase tracking-wider">Contact Details</h3>
                    <p className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 font-semibold">
                      <Mail className="h-4 w-4 text-zinc-400" /> {activeCustomer.email}
                    </p>
                    <p className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 font-semibold">
                      <Phone className="h-4 w-4 text-zinc-400" /> {activeCustomer.phone}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-zinc-400 uppercase tracking-wider">Default Address</h3>
                    <p className="flex items-start gap-2 text-zinc-650 dark:text-zinc-350 font-semibold leading-relaxed">
                      <MapPin className="h-4 w-4 text-zinc-400 mt-0.5" /> {activeCustomer.address}
                    </p>
                  </div>
                </div>

                {/* Wishlist Tracking */}
                {activeCustomer.wishlist && activeCustomer.wishlist.length > 0 && (
                  <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-2">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                      <Heart className="h-4 w-4 text-rose-500" /> Wishlist Tracker
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activeCustomer.wishlist.map(w => (
                        <span key={w} className="text-xs px-3 py-1 bg-zinc-50 border border-black/5 dark:bg-zinc-800 dark:border-white/5 text-zinc-700 dark:text-zinc-300 rounded-full font-semibold">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Order history trail */}
              <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
                <h3 className="font-bold text-brand-ink dark:text-white">Order History</h3>
                {customerOrders.length > 0 ? (
                  <div className="divide-y divide-black/5 dark:divide-white/5">
                    {customerOrders.map(o => (
                      <div key={o.id} className="py-3 flex justify-between items-center text-xs font-bold">
                        <div>
                          <p className="text-brand-blue font-mono">{o.id}</p>
                          <p className="text-[10px] text-zinc-400 font-medium">{new Date(o.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-brand-ink dark:text-white">{formatCurrency(o.total)}</p>
                          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">No checkout orders registered for this email address.</p>
                )}
              </div>

              {/* Customer logs / Admin CRM Notes */}
              <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
                <h3 className="font-bold text-brand-ink dark:text-white flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-brand-blue" /> CRM Notes & Log
                </h3>

                <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                  {activeCustomer.notes && activeCustomer.notes.length > 0 ? (
                    activeCustomer.notes.map((note, idx) => (
                      <div key={idx} className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-xs font-semibold leading-relaxed border border-black/5 dark:border-white/5">
                        {note}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-400 italic">No communication logs recorded.</p>
                  )}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Log a client interaction update note..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="flex-1 px-4 py-2 bg-brand-mist/50 focus:bg-white rounded-full border border-black/5 focus:border-brand-blue outline-none text-xs text-brand-ink dark:bg-zinc-800/50 dark:focus:bg-zinc-900 dark:border-white/5 dark:text-white transition"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-950 dark:bg-zinc-700 dark:hover:bg-zinc-650 text-white rounded-full text-xs font-bold transition"
                  >
                    Save Log
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="p-12 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm text-center text-zinc-400 font-semibold h-full flex flex-col items-center justify-center">
              <AlertCircle className="h-8 w-8 text-zinc-300 mb-2" />
              Select a customer profile to inspect timeline activity.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
