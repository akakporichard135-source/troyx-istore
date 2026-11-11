"use client";

import React, { useState, useEffect } from "react";
import { NavigationItem, FooterColumn } from "@/lib/types";
import { Compass, Save, CheckCircle2, ArrowUp, ArrowDown, Plus, Trash2 } from "lucide-react";

export default function AdminNavigationPage() {
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [footerColumns, setFooterColumns] = useState<FooterColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/navigation")
      .then((r) => r.json())
      .then((data) => {
        if (data.navigation?.items) setNavItems(data.navigation.items);
        if (data.footer) setFooterColumns(data.footer);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const moveNavItem = (index: number, dir: "up" | "down") => {
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= navItems.length) return;
    const copy = [...navItems];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    setNavItems(copy);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await fetch("/api/admin/navigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ navItems, footerColumns }),
      });
      setMessage("Navigation and Footer updated successfully!");
      setTimeout(() => setMessage(null), 3000);
    } catch {
      alert("Failed to save navigation.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Structure & Links
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">
            Navigation & Footer Editor
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Reorder header menu categories, modify labels, and manage footer directory columns.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="apple-btn-primary text-xs flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Navigation"}</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Header Navigation Section */}
      <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white">Header Navigation Links</h2>
        <p className="text-xs text-zinc-400">
          The main navigation displayed across desktop and mobile headers.
        </p>

        <div className="space-y-2">
          {navItems.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-zinc-500 w-4">{index + 1}.</span>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => {
                    const copy = [...navItems];
                    copy[index].label = e.target.value;
                    setNavItems(copy);
                  }}
                  className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-white text-xs w-36"
                />
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => {
                    const copy = [...navItems];
                    copy[index].href = e.target.value;
                    setNavItems(copy);
                  }}
                  className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-zinc-400 font-mono text-xs w-48"
                />
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveNavItem(index, "up")}
                  disabled={index === 0}
                  className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-20"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveNavItem(index, "down")}
                  disabled={index === navItems.length - 1}
                  className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-20"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Directory Columns */}
      <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white">Footer Columns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {footerColumns.map((col) => (
            <div key={col.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
              <h3 className="font-semibold text-white text-xs">{col.columnTitle}</h3>
              <ul className="space-y-1.5 text-[11px] text-zinc-400">
                {col.links.map((link, i) => (
                  <li key={i} className="flex justify-between items-center">
                    <span>{link.label}</span>
                    <span className="font-mono text-zinc-600 text-[10px]">{link.href}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
