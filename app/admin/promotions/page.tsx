"use client";

import React, { useState } from "react";
import { 
  Percent, 
  Plus, 
  Trash2, 
  Sparkles,
  Volume2,
  Calendar,
  Image as ImageIcon,
  Check,
  ToggleLeft,
  ToggleRight,
  Save,
  Tag
} from "lucide-react";
import { useAdminStore } from "@/context/admin-store";
import { formatCurrency } from "@/lib/utils";

export default function PromotionsPage() {
  const { coupons, addCoupon, toggleCoupon, deleteCoupon, currentRole } = useAdminStore();

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    value: 10,
    minSpend: 200,
    expiryDate: "2026-12-31"
  });

  const [announcement, setAnnouncement] = useState("🚚 Free same-day delivery on all Apple devices above ₵5,000 within Accra!");
  const [heroConfig, setHeroConfig] = useState({
    title: "iPhone 16 Pro Max",
    subtitle: "Built for Apple Intelligence. Titanium design.",
    buttonText: "Order Now",
    buttonLink: "/product/iphone-16-pro-max"
  });

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole === "Sales Staff" || currentRole === "Support Staff") {
      alert("Access Denied: Restricted role permissions.");
      return;
    }
    if (!newCoupon.code) return;
    addCoupon({
      code: newCoupon.code.toUpperCase(),
      discountType: newCoupon.discountType,
      value: Number(newCoupon.value),
      minSpend: Number(newCoupon.minSpend),
      active: true,
      expiryDate: newCoupon.expiryDate
    });
    setNewCoupon({
      code: "",
      discountType: "percentage",
      value: 10,
      minSpend: 200,
      expiryDate: "2026-12-31"
    });
  };

  const handleSaveBanners = () => {
    if (currentRole === "Sales Staff" || currentRole === "Support Staff") {
      alert("Access Denied: Restricted role permissions.");
      return;
    }
    alert("Promotional configurations saved successfully! (Simulation)");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-brand-ink dark:text-white">Marketing & Promotions</h1>
        <p className="text-zinc-500 text-sm">Schedule store coupon discounts, manage flash sales, and customize global banner announcements.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Coupon Manager */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-brand-ink dark:text-white pb-3 border-b border-black/5 dark:border-white/5 flex items-center gap-2">
            <Percent className="h-5 w-5 text-brand-blue" /> Coupon Code Manager
          </h2>

          {/* Add Coupon Form */}
          <form onSubmit={handleAddCoupon} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-xs font-bold text-zinc-500">
                Discount Code
                <input
                  type="text"
                  placeholder="e.g. SUMMER20"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value }))}
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition text-xs font-semibold"
                />
              </label>

              <label className="grid gap-1 text-xs font-bold text-zinc-500">
                Discount Type
                <select
                  value={newCoupon.discountType}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, discountType: e.target.value as any }))}
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-850 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition text-xs font-semibold"
                >
                  <option value="percentage">Percentage Off (%)</option>
                  <option value="fixed">Fixed Amount (₵)</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="grid gap-1 text-xs font-bold text-zinc-500">
                Value
                <input
                  type="number"
                  value={newCoupon.value}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, value: Number(e.target.value) }))}
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition text-xs font-semibold"
                />
              </label>

              <label className="grid gap-1 text-xs font-bold text-zinc-500">
                Min Spend (₵)
                <input
                  type="number"
                  value={newCoupon.minSpend}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, minSpend: Number(e.target.value) }))}
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition text-xs font-semibold"
                />
              </label>

              <label className="grid gap-1 text-xs font-bold text-zinc-500">
                Expiry Date
                <input
                  type="date"
                  value={newCoupon.expiryDate}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-850 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition text-xs font-semibold"
                />
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-full text-xs font-bold transition flex items-center justify-center gap-1 shadow-lg shadow-blue-500/20"
            >
              <Plus className="h-4 w-4" /> Add Coupon
            </button>
          </form>

          {/* Coupons List */}
          <div className="space-y-3 pt-3 border-t border-black/5 dark:border-white/5">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Coupons</h3>
            <div className="divide-y divide-black/5 dark:divide-white/5">
              {coupons.map((coupon) => (
                <div key={coupon.code} className="py-3 flex justify-between items-center text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-brand-blue" />
                    <div>
                      <span className="font-bold text-brand-ink dark:text-white bg-zinc-50 dark:bg-zinc-850 px-2 py-0.5 rounded border border-black/5 dark:border-white/5 font-mono">
                        {coupon.code}
                      </span>
                      <p className="text-[10px] text-zinc-500 mt-1">
                        {coupon.discountType === "percentage" ? `${coupon.value}% off` : `₵${coupon.value} off`} | Min spend: ₵{coupon.minSpend || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleCoupon(coupon.code)}
                      className="p-1 hover:bg-zinc-50 rounded dark:hover:bg-zinc-850"
                      title={coupon.active ? "Deactivate" : "Activate"}
                    >
                      {coupon.active ? (
                        <ToggleRight className="h-6 w-6 text-brand-blue" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-zinc-400" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteCoupon(coupon.code)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded dark:hover:bg-rose-950/20"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Promos & Banner Settings */}
        <div className="space-y-6">
          {/* Top Announcement Editor */}
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-brand-ink dark:text-white pb-3 border-b border-black/5 dark:border-white/5 flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-amber-500 animate-pulse" /> Announcement Bar
            </h2>

            <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
              Active Banner Message
              <input
                type="text"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition text-xs font-semibold"
              />
            </label>

            <button
              onClick={handleSaveBanners}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-700 dark:hover:bg-zinc-650 text-white rounded-full text-xs font-bold transition flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" /> Save Announcement
            </button>
          </div>

          {/* Hero Banner Manager */}
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-brand-ink dark:text-white pb-3 border-b border-black/5 dark:border-white/5 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-purple-500" /> Homepage Hero Configurator
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
                Hero Title
                <input
                  type="text"
                  value={heroConfig.title}
                  onChange={(e) => setHeroConfig(prev => ({ ...prev, title: e.target.value }))}
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition text-xs font-semibold"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
                Hero Subtitle
                <input
                  type="text"
                  value={heroConfig.subtitle}
                  onChange={(e) => setHeroConfig(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition text-xs font-semibold"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
                Button Label
                <input
                  type="text"
                  value={heroConfig.buttonText}
                  onChange={(e) => setHeroConfig(prev => ({ ...prev, buttonText: e.target.value }))}
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-850 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition text-xs font-semibold"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
                Button Redirect Link
                <input
                  type="text"
                  value={heroConfig.buttonLink}
                  onChange={(e) => setHeroConfig(prev => ({ ...prev, buttonLink: e.target.value }))}
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-850 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition text-xs font-semibold"
                />
              </label>
            </div>

            <button
              onClick={handleSaveBanners}
              className="px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
            >
              <Save className="h-3.5 w-3.5" /> Save Hero Config
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
