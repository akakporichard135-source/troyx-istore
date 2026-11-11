"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Database,
  Store,
  Phone,
  MapPin,
  CheckCircle2,
  Lock,
  Save,
  Key,
  ShieldCheck,
  AlertCircle,
  Image as ImageIcon,
  Share2,
  Trash2,
  Plus,
} from "lucide-react";
import { SiteSettings } from "@/lib/types";
import UniversalMediaPicker, { SelectedMedia } from "@/components/admin/UniversalMediaPicker";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);

  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Universal Media Picker state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"logoUrl" | "faviconUrl" | "ogImageUrl" | null>(null);
  const [pickerTitle, setPickerTitle] = useState("Select Brand Media");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSavingSettings(true);
    setSettingsMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSettingsMessage("Store identity and settings updated successfully!");
        setTimeout(() => setSettingsMessage(null), 3000);
      }
    } catch {
      alert("Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_password",
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      setPasswordSuccess("Your staff password has been securely updated and hashed.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(err.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const openPicker = (target: "logoUrl" | "faviconUrl" | "ogImageUrl", title: string) => {
    setPickerTarget(target);
    setPickerTitle(title);
    setPickerOpen(true);
  };

  const handleMediaSelected = (media: SelectedMedia) => {
    if (!settings || !pickerTarget) return;
    setSettings({
      ...settings,
      [pickerTarget]: media.url,
    });
    setPickerOpen(false);
  };

  if (loading || !settings) {
    return <div className="p-12 text-center text-zinc-500">Loading Store Configuration...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="pb-6 border-b border-zinc-800">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
          Configuration & Security
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">
          Store Settings & Access Security
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Business information, announcements, branding, and password security for TroyX iStore.
        </p>
      </div>

      {settingsMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{settingsMessage}</span>
        </div>
      )}

      {/* 1. Account Password Security */}
      <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Key className="w-4 h-4 text-purple-400" />
          <span>Staff Password & Security Key</span>
        </div>
        <p className="text-xs text-zinc-400">
          Set your private cryptographic password. Passwords are encrypted with PBKDF2 and SHA-512 with cryptographically unique salts.
        </p>

        {passwordError && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1">New Secure Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 8 chars, uppercase, lowercase, number"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={changingPassword || !newPassword}
              className="apple-btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{changingPassword ? "Updating..." : "Update Password"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Brand Visual Identity & Media */}
      <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <ImageIcon className="w-4 h-4 text-blue-400" />
          <span>Brand Visual Assets & Logos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Logo */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-white">TroyX Logo</span>
              {settings.logoUrl && (
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, logoUrl: "" })}
                  className="text-red-400 text-[10px] hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
            {settings.logoUrl ? (
              <div className="h-16 rounded-lg bg-black border border-zinc-800 flex items-center justify-center p-2">
                <img src={settings.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
              </div>
            ) : (
              <div className="h-16 rounded-lg bg-zinc-950 border border-dashed border-zinc-800 flex items-center justify-center text-[10px] text-zinc-500">
                Default Apple Minimalist Text
              </div>
            )}
            <button
              type="button"
              onClick={() => openPicker("logoUrl", "Select Brand Logo")}
              className="w-full apple-btn-secondary text-[11px] py-1.5"
            >
              {settings.logoUrl ? "Replace Logo" : "Upload Brand Logo"}
            </button>
          </div>

          {/* Favicon */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-white">Store Favicon</span>
              {settings.faviconUrl && (
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, faviconUrl: "" })}
                  className="text-red-400 text-[10px] hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
            {settings.faviconUrl ? (
              <div className="h-16 rounded-lg bg-black border border-zinc-800 flex items-center justify-center p-2">
                <img src={settings.faviconUrl} alt="Favicon" className="w-8 h-8 object-contain" />
              </div>
            ) : (
              <div className="h-16 rounded-lg bg-zinc-950 border border-dashed border-zinc-800 flex items-center justify-center text-[10px] text-zinc-500">
                Default SVG Icon
              </div>
            )}
            <button
              type="button"
              onClick={() => openPicker("faviconUrl", "Select Store Favicon")}
              className="w-full apple-btn-secondary text-[11px] py-1.5"
            >
              {settings.faviconUrl ? "Replace Favicon" : "Upload Favicon"}
            </button>
          </div>

          {/* Open Graph Image */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-white">Open Graph Image</span>
              {settings.ogImageUrl && (
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, ogImageUrl: "" })}
                  className="text-red-400 text-[10px] hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
            {settings.ogImageUrl ? (
              <div className="h-16 rounded-lg bg-black border border-zinc-800 flex items-center justify-center p-2">
                <img src={settings.ogImageUrl} alt="OG Preview" className="max-h-full max-w-full object-cover" />
              </div>
            ) : (
              <div className="h-16 rounded-lg bg-zinc-950 border border-dashed border-zinc-800 flex items-center justify-center text-[10px] text-zinc-500">
                Default Social Banner
              </div>
            )}
            <button
              type="button"
              onClick={() => openPicker("ogImageUrl", "Select Social Share Image")}
              className="w-full apple-btn-secondary text-[11px] py-1.5"
            >
              {settings.ogImageUrl ? "Replace Image" : "Upload OG Image"}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Store Business Profile & Direct Contacts */}
      <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Store className="w-4 h-4 text-blue-400" />
            <span>Business Profile & Social Channels</span>
          </div>
          <button
            type="submit"
            disabled={savingSettings}
            className="apple-btn-primary text-xs flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{savingSettings ? "Saving..." : "Save Identity"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1">Store Name</label>
            <input
              type="text"
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Slogan</label>
            <input
              type="text"
              value={settings.storeSlogan}
              onChange={(e) => setSettings({ ...settings, storeSlogan: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Showroom Location</label>
            <input
              type="text"
              value={settings.location}
              onChange={(e) => setSettings({ ...settings, location: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Official WhatsApp Contact</label>
            <input
              type="text"
              value={settings.whatsappNumber || "233207137437"}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              placeholder="e.g. 233207137437"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Primary Phone Line</label>
            <input
              type="text"
              value={settings.contactPhones[0] || ""}
              onChange={(e) => {
                const phones = [...settings.contactPhones];
                phones[0] = e.target.value;
                setSettings({ ...settings, contactPhones: phones });
              }}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Secondary Phone Line</label>
            <input
              type="text"
              value={settings.contactPhones[1] || ""}
              onChange={(e) => {
                const phones = [...settings.contactPhones];
                phones[1] = e.target.value;
                setSettings({ ...settings, contactPhones: phones });
              }}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">TikTok Handle</label>
            <input
              type="text"
              value={settings.tikTokHandle}
              onChange={(e) => setSettings({ ...settings, tikTokHandle: e.target.value })}
              placeholder="@troyx_istore"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Instagram Handle</label>
            <input
              type="text"
              value={settings.instagramHandle || "@troyx_istore"}
              onChange={(e) => setSettings({ ...settings, instagramHandle: e.target.value })}
              placeholder="@troyx_istore"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
            />
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="pt-4 border-t border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Store Announcement Banner</span>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={settings.isAnnouncementActive}
                onChange={(e) =>
                  setSettings({ ...settings, isAnnouncementActive: e.target.checked })
                }
                className="rounded bg-zinc-900 border-zinc-800 text-blue-600 focus:ring-0"
              />
              <span>Display on Storefront</span>
            </label>
          </div>
          <input
            type="text"
            value={settings.announcementText || ""}
            onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
            placeholder="e.g. Free tempered glass installation with every certified iPhone purchase."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
      </form>

      {/* 4. Universal Media Picker */}
      <UniversalMediaPicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleMediaSelected}
        title={pickerTitle}
        filter="image"
        currentValue={pickerTarget && settings ? (settings[pickerTarget] as string) : undefined}
      />
    </div>
  );
}
