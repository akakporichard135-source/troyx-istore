"use client";

import React, { useState, useEffect } from "react";
import { 
  Settings, 
  Save, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Coins, 
  ShieldAlert, 
  UserCheck, 
  KeyRound, 
  Percent, 
  Truck
} from "lucide-react";
import { useAdminStore, StoreSettings } from "@/context/admin-store";

export default function SettingsPage() {
  const { settings, updateSettings, currentRole } = useAdminStore();
  
  const [form, setForm] = useState<StoreSettings>(settings);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "number" ? Number(value) : value;
    setForm(prev => ({ ...prev, [name]: val }));
  };

  const handleToggle = (name: keyof StoreSettings) => {
    setForm(prev => ({ ...prev, [name]: !prev[name] as any }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole === "Sales Staff" || currentRole === "Support Staff") {
      alert("Access Denied: Restricted role permissions.");
      return;
    }
    updateSettings(form);
    alert("Store parameters saved successfully and logged in security audit logs!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-ink dark:text-white font-sans">Settings Panel</h1>
          <p className="text-zinc-500 text-sm">Configure regional currency rules, VAT calculations, shipping coefficients, and API tokens.</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-4 py-2.5 bg-brand-blue hover:bg-blue-600 rounded-full text-xs font-bold text-white transition flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
        >
          <Save className="h-3.5 w-3.5" /> Save Parameters
        </button>
      </div>

      <form onSubmit={handleSave} className="grid gap-6 md:grid-cols-3">
        {/* Core settings */}
        <div className="md:col-span-2 space-y-6">
          {/* Identity and contacts */}
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-brand-ink dark:text-white pb-3 border-b border-black/5 dark:border-white/5 flex items-center gap-2">
              <Globe className="h-4.5 w-4.5 text-brand-blue" /> Store Identity & Profile
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
                Store Name
                <input 
                  type="text" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition font-medium"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
                Contact Email
                <input 
                  type="email" 
                  name="contactEmail" 
                  value={form.contactEmail} 
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-850 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition font-medium"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
                Contact Phone
                <input 
                  type="text" 
                  name="contactPhone" 
                  value={form.contactPhone} 
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition font-medium"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
                Store Physical Address
                <input 
                  type="text" 
                  name="address" 
                  value={form.address} 
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-850 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition font-medium"
                />
              </label>
            </div>
          </div>

          {/* Logistics & Finances */}
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-brand-ink dark:text-white pb-3 border-b border-black/5 dark:border-white/5 flex items-center gap-2">
              <Coins className="h-4.5 w-4.5 text-emerald-500" /> Regional Pricing & Taxes
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
                Tax (VAT) Rate (%)
                <input 
                  type="number" 
                  name="taxRatePercent" 
                  value={form.taxRatePercent} 
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition font-medium"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
                Base Currency Symbol
                <select 
                  name="currencySymbol" 
                  value={form.currencySymbol} 
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-850 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition font-medium"
                >
                  <option value="₵">₵ (GHS)</option>
                  <option value="$">$ (USD)</option>
                  <option value="€">€ (EUR)</option>
                  <option value="£">£ (GBP)</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-bold text-zinc-500">
                Shipping Flat Rate (₵)
                <input 
                  type="number" 
                  name="shippingFlatRate" 
                  value={form.shippingFlatRate} 
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-full border border-black/10 focus:border-brand-blue bg-white text-zinc-800 dark:bg-zinc-850 dark:border-white/10 dark:text-white outline-none transition font-medium"
                />
              </label>

              <div className="flex flex-col justify-end pb-1.5">
                <span className="text-xs font-bold text-zinc-500 mb-2">Preorder Authorization</span>
                <button
                  type="button"
                  onClick={() => handleToggle("allowPreorders")}
                  className={`w-full py-2.5 rounded-full border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    form.allowPreorders 
                      ? "bg-brand-blue/10 border-brand-blue text-brand-blue dark:bg-brand-blue/20" 
                      : "border-black/10 text-zinc-500 dark:border-white/10"
                  }`}
                >
                  {form.allowPreorders ? "Authorized" : "Blocked"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Security and admin users list */}
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
            <h3 className="font-bold text-brand-ink dark:text-white flex items-center gap-2">
              <ShieldAlert className="h-4.5 w-4.5 text-rose-500" /> Security Policies
            </h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-zinc-500 font-semibold">Mock CSRF Protection Level</span>
                <p className="font-semibold text-zinc-800 dark:text-zinc-200 mt-1">High (Signed Session-Bound Tokens)</p>
              </div>

              <div>
                <span className="text-zinc-500 font-semibold">Session Timeout Limit</span>
                <select className="w-full px-3 py-1.5 rounded-full border border-black/10 bg-white mt-1 dark:bg-zinc-800 dark:border-white/10 text-xs">
                  <option>15 Minutes</option>
                  <option>30 Minutes</option>
                  <option>1 Hour</option>
                  <option>Never Timeout</option>
                </select>
              </div>

              <div>
                <span className="text-zinc-500 font-semibold">Login Rate Limiter (Redis)</span>
                <p className="font-semibold text-brand-blue mt-0.5">Enabled (5 attempts / min)</p>
              </div>
            </div>
          </div>

          {/* Active Admin Accounts */}
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
            <h3 className="font-bold text-brand-ink dark:text-white flex items-center gap-2">
              <UserCheck className="h-4.5 w-4.5 text-brand-blue" /> Admin Accounts
            </h3>
            
            <div className="space-y-3">
              {[
                { name: "Kofi Owner", role: "Owner" },
                { name: "Jane Admin", role: "Administrator" },
                { name: "Alex Manager", role: "Manager" },
                { name: "Support Staff #1", role: "Support Staff" },
              ].map(admin => (
                <div key={admin.name} className="flex justify-between items-center text-xs border-b border-black/5 dark:border-white/5 pb-2">
                  <span className="font-semibold text-brand-ink dark:text-white">{admin.name}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-md dark:bg-zinc-800 dark:text-zinc-400">
                    {admin.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
