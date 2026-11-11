"use client";

import React, { useState, useEffect } from "react";
import { PromotionRecord } from "@/lib/types";
import { Tag, Plus, CheckCircle2, CircleDashed, Calendar, Percent } from "lucide-react";

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<PromotionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("10");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10)
  );
  const [bannerText, setBannerText] = useState("");

  const loadPromos = async () => {
    try {
      const res = await fetch("/api/admin/promotions");
      const data = await res.json();
      if (data.promotions) setPromotions(data.promotions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromos();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          code,
          discountType,
          discountValue: parseFloat(discountValue),
          startDate,
          endDate,
          bannerText,
          isActive: true,
        }),
      });
      const data = await res.json();
      if (data.promotion) {
        setPromotions((prev) => [data.promotion, ...prev]);
        setShowModal(false);
        setTitle("");
        setCode("");
      }
    } catch (err) {
      alert("Failed to create promotion");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Marketing & Campaigns
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">
            Promotions & Campaigns
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Create coupon codes, holiday discounts, and promotional banners with server validation.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="apple-btn-primary text-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Promotion</span>
        </button>
      </div>

      {promotions.length === 0 ? (
        <div className="p-16 rounded-2xl bg-[#161617] border border-zinc-800 text-center space-y-3">
          <Tag className="w-10 h-10 text-zinc-600 mx-auto" />
          <h2 className="text-base font-semibold text-white">No Active Campaigns</h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Create promo codes with date windows and server-enforced discounts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promotions.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-[#161617] border border-zinc-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-950/60 border border-blue-800 px-2 py-0.5 rounded">
                  {p.code}
                </span>
                <span className="text-xs text-emerald-400 font-semibold">
                  {p.discountType === "percentage" ? `${p.discountValue}% OFF` : `GH₵ ${p.discountValue} OFF`}
                </span>
              </div>
              <h3 className="font-semibold text-white text-base">{p.title}</h3>
              <p className="text-xs text-zinc-400">{p.bannerText || "Valid across original Apple catalog."}</p>
              <div className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{p.startDate} to {p.endDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Promotion Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#161617] border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-white">Create New Promotion</h2>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Independence Day Special"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Promo Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="TROYX10"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Ghana Cedi (GH₵)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Banner Text (Optional)</label>
                <input
                  type="text"
                  value={bannerText}
                  onChange={(e) => setBannerText(e.target.value)}
                  placeholder="e.g. Save GH₵ 500 on all MacBook Pro models this week"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button type="submit" className="apple-btn-primary px-4 py-2">
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
