"use client";

import { useState } from "react";
import { Store, Upload, Save, CheckCircle2 } from "lucide-react";
import { useVendorStore } from "@/context/vendor-store";
import { Button } from "@/components/ui/button";

export default function VendorSettingsPage() {
  const activeVendorId = useVendorStore((state) => state.activeVendorId);
  const vendors = useVendorStore((state) => state.vendors);
  const updateVendorProfile = useVendorStore((state) => state.updateVendorProfile);

  const vendor = vendors.find((v) => v.id === activeVendorId) || vendors[0];

  const [formData, setFormData] = useState({
    name: vendor?.name || "",
    description: vendor?.description || "",
    logoUrl: vendor?.logoUrl || "",
    bannerUrl: vendor?.bannerUrl || "",
    phone: vendor?.phone || "",
    email: vendor?.email || "",
    address: vendor?.address || "",
    city: vendor?.city || "",
    website: vendor?.website || "",
    instagram: vendor?.socialLinks?.instagram || "",
    facebook: vendor?.socialLinks?.facebook || ""
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateVendorProfile(vendor.id, {
      name: formData.name,
      description: formData.description,
      logoUrl: formData.logoUrl,
      bannerUrl: formData.bannerUrl,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      website: formData.website,
      socialLinks: {
        instagram: formData.instagram,
        facebook: formData.facebook
      }
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-2xl font-extrabold text-white">Storefront Customization & Settings</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Customize your public store profile page on TroyX Marketplace.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <span>Storefront settings saved successfully! Your public storefront has been updated.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl text-xs">
        {/* Banner Preview & Input */}
        <div>
          <label className="block font-semibold text-zinc-300 mb-1.5">Storefront Banner Image URL</label>
          <input
            type="text"
            value={formData.bannerUrl}
            onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
            className="w-full h-10 rounded-xl border border-white/10 bg-zinc-950 px-3 text-white focus:border-brand-blue focus:outline-none mb-3"
          />
          <div className="h-32 w-full rounded-2xl border border-white/10 overflow-hidden relative bg-zinc-950">
            <img src={formData.bannerUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80"} alt="Banner Preview" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[11px] font-bold text-white uppercase tracking-wider">
              Banner Preview
            </div>
          </div>
        </div>

        {/* Logo Preview & Input */}
        <div className="grid gap-4 sm:grid-cols-3 items-center">
          <div className="sm:col-span-2">
            <label className="block font-semibold text-zinc-300 mb-1.5">Store Logo Image URL</label>
            <input
              type="text"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              className="w-full h-10 rounded-xl border border-white/10 bg-zinc-950 px-3 text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <img src={formData.logoUrl || "/assets/product-device-blue.svg"} alt="Logo" className="h-12 w-12 rounded-2xl border border-white/10 object-cover bg-zinc-800" />
            <span className="text-[11px] text-zinc-400">Logo Preview</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5">Store Display Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-10 rounded-xl border border-white/10 bg-zinc-950 px-3 text-white focus:border-brand-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5">Business Contact Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full h-10 rounded-xl border border-white/10 bg-zinc-950 px-3 text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-zinc-300 mb-1.5">Storefront Business Description</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-zinc-950 p-3 text-white focus:border-brand-blue focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5">Physical Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full h-10 rounded-xl border border-white/10 bg-zinc-950 px-3 text-white focus:border-brand-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full h-10 rounded-xl border border-white/10 bg-zinc-950 px-3 text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5">Instagram Profile</label>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              className="w-full h-10 rounded-xl border border-white/10 bg-zinc-950 px-3 text-white focus:border-brand-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5">Website URL</label>
            <input
              type="text"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full h-10 rounded-xl border border-white/10 bg-zinc-950 px-3 text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <Button type="submit" className="h-11 px-8 text-xs font-bold bg-brand-blue hover:bg-brand-blue/90 text-white shadow-lg shadow-brand-blue/20">
            <Save className="h-4 w-4 mr-2" />
            Save Storefront Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
