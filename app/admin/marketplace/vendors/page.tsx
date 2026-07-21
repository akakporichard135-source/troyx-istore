"use client";

import { useState } from "react";
import { Users, Search, ShieldCheck, Star, Power, Trash2, ExternalLink } from "lucide-react";
import { useVendorStore } from "@/context/vendor-store";
import { Button } from "@/components/ui/button";
import type { VendorStatus } from "@/types";

export default function AdminVendorsPage() {
  const vendors = useVendorStore((state) => state.vendors);
  const updateVendorStatus = useVendorStore((state) => state.updateVendorStatus);
  const toggleFeaturedVendor = useVendorStore((state) => state.toggleFeaturedVendor);
  const deleteVendor = useVendorStore((state) => state.deleteVendor);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const filtered = vendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      v.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || v.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-ink dark:text-white">Registered Marketplace Vendors</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Manage active merchants, feature stores on homepage, or update suspension statuses.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by store name, owner, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 pl-10 pr-4 text-xs text-brand-ink dark:text-white placeholder-zinc-400 focus:border-brand-blue focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 p-1 text-xs">
          {["All", "Approved", "Suspended", "Pending"].map((st) => (
            <button
              key={st}
              type="button"
              className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                filterStatus === st ? "bg-brand-blue text-white" : "text-zinc-600 dark:text-zinc-400 hover:text-brand-ink dark:hover:text-white"
              }`}
              onClick={() => setFilterStatus(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Vendors Table */}
      <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-black/5 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950/80 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Store Name & Owner</th>
                <th className="py-3.5 px-4">Location & Plan</th>
                <th className="py-3.5 px-4">Revenue & Sales</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Homepage Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5 text-zinc-700 dark:text-zinc-300">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={v.logoUrl} alt={v.name} className="h-10 w-10 rounded-xl border border-black/10 dark:border-white/10 object-cover bg-zinc-100 dark:bg-zinc-800 shrink-0" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-brand-ink dark:text-white text-xs">{v.name}</p>
                          {v.isFlagship && (
                            <span className="rounded bg-brand-blue/20 text-brand-blue px-1.5 py-0.2 text-[9px] font-extrabold uppercase">
                              Flagship
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500">{v.ownerName} &bull; {v.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-brand-ink dark:text-white">{v.city}, {v.country}</p>
                    <span className="text-[10px] font-bold text-brand-blue">{v.planId} Tier</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold">
                    <p className="text-emerald-600 dark:text-emerald-400">GH₵ {v.totalRevenue.toLocaleString()}</p>
                    <p className="text-[10px] text-zinc-500">{v.salesCount} Completed Sales</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      v.status === "Approved"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : v.status === "Suspended"
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => toggleFeaturedVendor(v.id)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold border transition ${
                        v.featuredOnHomepage
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-black/5 dark:border-white/5"
                      }`}
                    >
                      <Star className={`h-3 w-3 ${v.featuredOnHomepage ? "fill-amber-500" : ""}`} />
                      {v.featuredOnHomepage ? "Featured" : "Regular"}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {v.status === "Approved" ? (
                        <button
                          type="button"
                          onClick={() => updateVendorStatus(v.id, "Suspended")}
                          className="rounded-lg border border-red-500/20 p-1.5 text-red-500 hover:bg-red-500/10"
                          title="Suspend Vendor"
                        >
                          <Power className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => updateVendorStatus(v.id, "Approved")}
                          className="rounded-lg border border-emerald-500/20 p-1.5 text-emerald-500 hover:bg-emerald-500/10"
                          title="Approve Vendor"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {!v.isFlagship && (
                        <button
                          type="button"
                          onClick={() => deleteVendor(v.id)}
                          className="rounded-lg border border-black/10 dark:border-white/10 p-1.5 text-zinc-400 hover:text-red-500"
                          title="Delete Vendor"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
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
