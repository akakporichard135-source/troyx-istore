"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  ArrowUp,
  ArrowDown,
  Eye,
  CheckCircle2,
  CircleDashed,
  Trash2,
  Copy,
  Edit3,
  ExternalLink,
  Smartphone,
  Monitor,
  History,
  Save,
  Image as ImageIcon,
  Video,
  X,
  AlertCircle,
} from "lucide-react";
import { PageRecord, PageSection, PageRevision, MediaAsset } from "@/lib/types";
import SectionRenderer from "@/components/public/SectionRenderer";

export default function AdminPageEditor() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;

  const [page, setPage] = useState<PageRecord | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [revisions, setRevisions] = useState<PageRevision[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Editor Modal State
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [previewSection, setPreviewSection] = useState<PageSection | null>(null);
  const [previewViewport, setPreviewViewport] = useState<"desktop" | "mobile">("desktop");
  const [showRevisionModal, setShowRevisionModal] = useState(false);

  // Media Library Picker Modal State
  const [pickerTarget, setPickerTarget] = useState<
    "desktopImageUrl" | "mobileImageUrl" | "desktopVideoUrl" | "mobileVideoUrl" | "posterImageUrl" | null
  >(null);
  const [libraryAssets, setLibraryAssets] = useState<MediaAsset[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryFilter, setLibraryFilter] = useState<"all" | "image" | "video">("all");

  // Load page and its sections
  const loadData = async () => {
    try {
      const [pageRes, secRes, revRes] = await Promise.all([
        fetch(`/api/admin/pages/${pageId}`),
        fetch(`/api/admin/sections?pageId=${pageId}`),
        fetch(`/api/admin/revisions?pageId=${pageId}`),
      ]);

      const pageData = await pageRes.json();
      const secData = await secRes.json();
      const revData = await revRes.json();

      if (pageData.page) setPage(pageData.page);
      if (secData.sections) setSections(secData.sections);
      if (revData.revisions) setRevisions(revData.revisions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pageId]);

  // Section Ordering: Move Up
  const moveSection = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    setSections(newSections);

    // Save order to server
    const sectionIds = newSections.map((s) => s.id);
    await fetch("/api/admin/sections/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionIds, pageId }),
    });
  };

  // Toggle Publish / Unpublish on a section
  const togglePublish = async (section: PageSection) => {
    const updatedStatus = !section.isPublished;
    setSections((prev) =>
      prev.map((s) => (s.id === section.id ? { ...s, isPublished: updatedStatus } : s))
    );

    await fetch(`/api/admin/sections/${section.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: updatedStatus }),
    });

    setMessage(
      updatedStatus
        ? `Section '${section.draftLabel}' is now PUBLISHED and live on public site!`
        : `Section '${section.draftLabel}' is now UNPUBLISHED (hidden from public view).`
    );
    setTimeout(() => setMessage(null), 4000);
  };

  // Delete Section
  const handleDelete = async (sectionId: string, label: string) => {
    if (!confirm(`Are you sure you want to remove '${label}'?`)) return;

    await fetch(`/api/admin/sections/${sectionId}`, { method: "DELETE" });
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  };

  // Duplicate Section
  const handleDuplicate = async (section: PageSection) => {
    const copyData = {
      ...section,
      draftLabel: `${section.draftLabel} (Copy)`,
      isPublished: false,
      sortOrder: sections.length + 1,
    };
    delete (copyData as any).id;
    delete (copyData as any).createdAt;
    delete (copyData as any).updatedAt;

    const res = await fetch("/api/admin/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(copyData),
    });
    const result = await res.json();
    if (result.section) {
      setSections((prev) => [...prev, result.section]);
    }
  };

  // Add a new blank section
  const handleAddSection = async () => {
    const res = await fetch("/api/admin/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pageId,
        sectionType: "cinematic_hero",
        draftLabel: `New Section ${sections.length + 1}`,
        sortOrder: sections.length + 1,
        isPublished: false,
        theme: "dark",
        backgroundColor: "#000000",
        textColor: "#f5f5f7",
        textAlignment: "center",
      }),
    });
    const result = await res.json();
    if (result.section) {
      setSections((prev) => [...prev, result.section]);
      setEditingSection(result.section);
    }
  };

  // Save changes to edited section
  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/sections/${editingSection.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSection),
      });
      const data = await res.json();
      if (data.section) {
        setSections((prev) =>
          prev.map((s) => (s.id === data.section.id ? data.section : s))
        );
        setEditingSection(null);
        setMessage(`Saved section '${data.section.draftLabel}' successfully!`);
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      alert("Failed to save section changes");
    } finally {
      setSaving(false);
    }
  };

  // Create Snapshot Revision
  const handleCreateRevision = async () => {
    const notes = prompt("Enter revision snapshot note (e.g. 'Before holiday campaign launch'):");
    if (notes === null) return;

    const res = await fetch("/api/admin/revisions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", pageId, notes }),
    });
    const data = await res.json();
    if (data.revision) {
      setRevisions((prev) => [data.revision, ...prev]);
      alert("Snapshot revision saved!");
    }
  };

  // Rollback Revision
  const handleRollback = async (revisionId: string) => {
    if (!confirm("Are you sure you want to rollback this page to this snapshot?")) return;

    const res = await fetch("/api/admin/revisions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "rollback", revisionId }),
    });
    if (res.ok) {
      alert("Page rolled back successfully!");
      setShowRevisionModal(false);
      loadData();
    }
  };

  const openMediaPicker = async (
    target: "desktopImageUrl" | "mobileImageUrl" | "desktopVideoUrl" | "mobileVideoUrl" | "posterImageUrl",
    filter: "all" | "image" | "video" = "all"
  ) => {
    setPickerTarget(target);
    setLibraryFilter(filter);
    setLibraryLoading(true);
    try {
      const q = filter !== "all" ? `?type=${filter}` : "";
      const res = await fetch(`/api/admin/media${q}`);
      const data = await res.json();
      if (data.assets) setLibraryAssets(data.assets);
    } catch (err) {
      console.error(err);
    } finally {
      setLibraryLoading(false);
    }
  };

  const handleSelectAsset = (asset: MediaAsset) => {
    if (!pickerTarget || !editingSection) return;
    setEditingSection({
      ...editingSection,
      [pickerTarget]: asset.publicUrl,
    });
    setPickerTarget(null);
  };

  if (loading) {
    return <div className="p-12 text-center text-zinc-500">Loading Page Architecture...</div>;
  }

  if (!page) {
    return <div className="p-12 text-center text-red-400">Page record not found.</div>;
  }

  const isHome = page.slug === "home";

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div className="space-y-1">
          <Link
            href="/admin/pages"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Pages</span>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              {page.title}
            </h1>
            {isHome && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                Exact 6 Draft Slots Architecture
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400">
            Route: <span className="font-mono text-zinc-300">/{isHome ? "" : page.slug}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCreateRevision}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white flex items-center gap-1.5"
            title="Create version snapshot"
          >
            <History className="w-3.5 h-3.5" />
            <span>Snapshot</span>
          </button>

          {revisions.length > 0 && (
            <button
              onClick={() => setShowRevisionModal(true)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white flex items-center gap-1.5"
            >
              <span>Revisions ({revisions.length})</span>
            </button>
          )}

          <Link
            href={`/${isHome ? "" : page.slug}`}
            target="_blank"
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white flex items-center gap-1.5"
          >
            <span>Live URL</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleAddSection}
            className="apple-btn-primary text-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Section</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Homepage Mission Guidance Callout */}
      {isHome && (
        <div className="p-5 rounded-2xl bg-[#161617] border border-zinc-800 text-xs space-y-2">
          <div className="font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span>Initial State Specification: 6 Ordered Unpublished Draft Slots</span>
          </div>
          <p className="text-zinc-400 leading-relaxed">
            The six draft sections below match the exact initial blueprint:{" "}
            <span className="text-zinc-300 font-mono">1. iPhone 18 Pro (dark)</span>,{" "}
            <span className="text-zinc-300 font-mono">2. iPhone Duo (white)</span>,{" "}
            <span className="text-zinc-300 font-mono">3. MacBook Pro (dark)</span>,{" "}
            <span className="text-zinc-300 font-mono">4. Apple Watch Series 12 (white)</span>,{" "}
            <span className="text-zinc-300 font-mono">5. iPad A16 (white)</span>, and{" "}
            <span className="text-zinc-300 font-mono">6. AirPods Pro 3 (dark)</span>. All six exist as
            unpublished drafts with no fake initial images or prices. To launch a section, click{" "}
            <span className="text-white font-medium">Edit Content</span>, attach your media or text, and
            toggle <span className="text-emerald-400 font-medium">Publish</span>.
          </p>
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((section, index) => {
          const hasMedia =
            section.desktopImageUrl ||
            section.desktopVideoUrl ||
            section.mobileImageUrl ||
            section.mobileVideoUrl;

          return (
            <div
              key={section.id}
              className={`p-5 rounded-2xl border transition-all ${
                section.isPublished
                  ? "bg-[#161617] border-zinc-700/80 shadow-md"
                  : "bg-zinc-950/80 border-zinc-900"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Slot index, Title & Metadata */}
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0">
                    {index + 1}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white tracking-tight">
                        {section.draftLabel}
                      </span>
                      <span
                        className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                          section.theme === "dark"
                            ? "bg-black text-zinc-300 border-zinc-800"
                            : "bg-white text-zinc-900 border-zinc-300"
                        }`}
                      >
                        {section.theme} Theme
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                      <span>Type: {section.sectionType}</span>
                      <span>•</span>
                      <span>Alignment: {section.textAlignment}</span>
                      <span>•</span>
                      <span>
                        Media:{" "}
                        {hasMedia ? (
                          <span className="text-emerald-400">Attached</span>
                        ) : (
                          <span className="text-zinc-500">None (Empty draft)</span>
                        )}
                      </span>
                      {section.title && (
                        <>
                          <span>•</span>
                          <span className="text-zinc-300 font-medium truncate max-w-xs">
                            Title: &quot;{section.title}&quot;
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section Controls */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {/* Reorder Buttons */}
                  <div className="flex items-center rounded-xl bg-zinc-900 border border-zinc-800 p-0.5">
                    <button
                      onClick={() => moveSection(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 rounded hover:bg-zinc-800"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveSection(index, "down")}
                      disabled={index === sections.length - 1}
                      className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 rounded hover:bg-zinc-800"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Preview Button */}
                  <button
                    onClick={() => setPreviewSection(section)}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white flex items-center gap-1"
                    title="Preview Section"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Preview</span>
                  </button>

                  {/* Edit Content */}
                  <button
                    onClick={() => setEditingSection(section)}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Edit</span>
                  </button>

                  {/* Duplicate */}
                  <button
                    onClick={() => handleDuplicate(section)}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-white"
                    title="Duplicate Section"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Publish Toggle Button */}
                  <button
                    onClick={() => togglePublish(section)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      section.isPublished
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                        : "bg-zinc-800 hover:bg-zinc-700 text-yellow-400 border border-yellow-500/30"
                    }`}
                  >
                    {section.isPublished ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Published</span>
                      </>
                    ) : (
                      <>
                        <CircleDashed className="w-3.5 h-3.5" />
                        <span>Publish</span>
                      </>
                    )}
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(section.id, section.draftLabel)}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400"
                    title="Delete section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section Editor Drawer/Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-end animate-fade-in">
          <div className="w-full max-w-2xl h-full bg-[#161617] border-l border-zinc-800 p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Section Configurator
                </span>
                <h2 className="text-xl font-semibold text-white">
                  {editingSection.draftLabel}
                </h2>
              </div>
              <button
                onClick={() => setEditingSection(null)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="space-y-6 text-xs">
              {/* Draft Label */}
              <div className="space-y-1">
                <label className="block text-zinc-400 font-medium">Admin Draft Label</label>
                <input
                  type="text"
                  value={editingSection.draftLabel}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, draftLabel: e.target.value })
                  }
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              {/* Theme & Layout */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-zinc-400 font-medium">Theme Aesthetic</label>
                  <select
                    value={editingSection.theme}
                    onChange={(e) =>
                      setEditingSection({
                        ...editingSection,
                        theme: e.target.value as any,
                        backgroundColor: e.target.value === "dark" ? "#000000" : "#ffffff",
                        textColor: e.target.value === "dark" ? "#f5f5f7" : "#1d1d1f",
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="dark">Dark (#000000)</option>
                    <option value="white">White (#ffffff)</option>
                    <option value="custom">Custom Colors</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-zinc-400 font-medium">Text Alignment</label>
                  <select
                    value={editingSection.textAlignment}
                    onChange={(e) =>
                      setEditingSection({
                        ...editingSection,
                        textAlignment: e.target.value as any,
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="center">Center</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <h3 className="font-semibold text-white">Showcase Copy</h3>

                <div className="space-y-1">
                  <label className="block text-zinc-400">Eyebrow / Tagline</label>
                  <input
                    type="text"
                    value={editingSection.tagline || ""}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, tagline: e.target.value })
                    }
                    placeholder="e.g. Pro Beyond"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-zinc-400">Headline / Title</label>
                  <input
                    type="text"
                    value={editingSection.title || ""}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, title: e.target.value })
                    }
                    placeholder="e.g. iPhone 18 Pro"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-zinc-400">Subtitle</label>
                  <input
                    type="text"
                    value={editingSection.subtitle || ""}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, subtitle: e.target.value })
                    }
                    placeholder="e.g. Titanium. So strong. So light. So Pro."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Media Configuration & Cinematic Controls */}
              <div className="space-y-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Cinematic Media Assets</h3>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                    Cloudinary CDN Ready
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block text-zinc-400">Media Mode</label>
                  <select
                    value={editingSection.mediaType}
                    onChange={(e) =>
                      setEditingSection({
                        ...editingSection,
                        mediaType: e.target.value as any,
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="none">None (Text Only / Clean Blueprint State)</option>
                    <option value="image">Image Showcase</option>
                    <option value="video">Cinematic Video</option>
                    <option value="both">Image + Video</option>
                  </select>
                </div>

                {/* Desktop Image */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-zinc-400">Desktop Image URL</label>
                    <button
                      type="button"
                      onClick={() => openMediaPicker("desktopImageUrl", "image")}
                      className="text-[11px] text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Choose from Library
                    </button>
                  </div>
                  <input
                    type="text"
                    value={editingSection.desktopImageUrl || ""}
                    onChange={(e) =>
                      setEditingSection({
                        ...editingSection,
                        desktopImageUrl: e.target.value,
                      })
                    }
                    placeholder="e.g. https://res.cloudinary.com/.../hero.jpg"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                {/* Mobile Image */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-zinc-400">Mobile Image URL (Optional)</label>
                    <button
                      type="button"
                      onClick={() => openMediaPicker("mobileImageUrl", "image")}
                      className="text-[11px] text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Choose from Library
                    </button>
                  </div>
                  <input
                    type="text"
                    value={editingSection.mobileImageUrl || ""}
                    onChange={(e) =>
                      setEditingSection({
                        ...editingSection,
                        mobileImageUrl: e.target.value,
                      })
                    }
                    placeholder="Mobile specific aspect ratio"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                {/* Desktop Video */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-zinc-400">Desktop Video URL</label>
                    <button
                      type="button"
                      onClick={() => openMediaPicker("desktopVideoUrl", "video")}
                      className="text-[11px] text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Choose from Library
                    </button>
                  </div>
                  <input
                    type="text"
                    value={editingSection.desktopVideoUrl || ""}
                    onChange={(e) =>
                      setEditingSection({
                        ...editingSection,
                        desktopVideoUrl: e.target.value,
                      })
                    }
                    placeholder="e.g. https://res.cloudinary.com/.../showcase.mp4"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                {/* Mobile Video */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-zinc-400">Mobile Video URL (Optional)</label>
                    <button
                      type="button"
                      onClick={() => openMediaPicker("mobileVideoUrl", "video")}
                      className="text-[11px] text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Choose from Library
                    </button>
                  </div>
                  <input
                    type="text"
                    value={editingSection.mobileVideoUrl || ""}
                    onChange={(e) =>
                      setEditingSection({
                        ...editingSection,
                        mobileVideoUrl: e.target.value,
                      })
                    }
                    placeholder="Mobile vertical crop (9:16 or portrait)"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                {/* Poster Image */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-zinc-400">Video Poster Image URL</label>
                    <button
                      type="button"
                      onClick={() => openMediaPicker("posterImageUrl", "image")}
                      className="text-[11px] text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Choose from Library
                    </button>
                  </div>
                  <input
                    type="text"
                    value={editingSection.posterImageUrl || ""}
                    onChange={(e) =>
                      setEditingSection({
                        ...editingSection,
                        posterImageUrl: e.target.value,
                      })
                    }
                    placeholder="Static fallback frame before video streams"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                {/* Cinematic Video Playback Controls */}
                {(editingSection.mediaType === "video" || editingSection.mediaType === "both") && (
                  <div className="pt-3 border-t border-zinc-800 space-y-3">
                    <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                      Cinematic Playback Controls
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingSection.config?.videoAutoplay !== false}
                          onChange={(e) =>
                            setEditingSection({
                              ...editingSection,
                              config: {
                                ...editingSection.config,
                                videoAutoplay: e.target.checked,
                              },
                            })
                          }
                          className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
                        />
                        <span>Autoplay</span>
                      </label>

                      <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingSection.config?.videoLoop !== false}
                          onChange={(e) =>
                            setEditingSection({
                              ...editingSection,
                              config: {
                                ...editingSection.config,
                                videoLoop: e.target.checked,
                              },
                            })
                          }
                          className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
                        />
                        <span>Loop</span>
                      </label>

                      <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingSection.config?.videoMuted !== false}
                          onChange={(e) =>
                            setEditingSection({
                              ...editingSection,
                              config: {
                                ...editingSection.config,
                                videoMuted: e.target.checked,
                              },
                            })
                          }
                          className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
                        />
                        <span>Muted</span>
                      </label>

                      <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(editingSection.config?.videoControls)}
                          onChange={(e) =>
                            setEditingSection({
                              ...editingSection,
                              config: {
                                ...editingSection.config,
                                videoControls: e.target.checked,
                              },
                            })
                          }
                          className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0"
                        />
                        <span>Controls</span>
                      </label>
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <label className="text-zinc-400">Background Overlay Opacity</label>
                        <span className="font-mono text-zinc-300">
                          {Math.round((editingSection.config?.overlayOpacity || 0) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={editingSection.config?.overlayOpacity ?? 0}
                        onChange={(e) =>
                          setEditingSection({
                            ...editingSection,
                            config: {
                              ...editingSection.config,
                              overlayOpacity: parseFloat(e.target.value),
                            },
                          })
                        }
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons (Learn More, Buy) */}
              <div className="space-y-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <h3 className="font-semibold text-white">Call to Action Links</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-zinc-400">Learn More Link</label>
                    <input
                      type="text"
                      value={editingSection.learnMoreUrl || ""}
                      onChange={(e) =>
                        setEditingSection({
                          ...editingSection,
                          learnMoreUrl: e.target.value,
                        })
                      }
                      placeholder="/learn-more/iphone"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-zinc-400">Buy Link</label>
                    <input
                      type="text"
                      value={editingSection.buyUrl || ""}
                      onChange={(e) =>
                        setEditingSection({
                          ...editingSection,
                          buyUrl: e.target.value,
                        })
                      }
                      placeholder="/store"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="apple-btn-primary px-5 py-2 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving..." : "Save Section"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Responsive Preview Modal (Desktop & Mobile viewports) */}
      {previewSection && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-5xl flex items-center justify-between pb-3 text-xs text-zinc-400">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white">Previewing: {previewSection.draftLabel}</span>
              <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                <button
                  onClick={() => setPreviewViewport("desktop")}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 ${
                    previewViewport === "desktop" ? "bg-zinc-800 text-white" : "text-zinc-400"
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  onClick={() => setPreviewViewport("mobile")}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 ${
                    previewViewport === "mobile" ? "bg-zinc-800 text-white" : "text-zinc-400"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setPreviewSection(null)}
              className="text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-900 border border-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div
            className={`border border-zinc-800 rounded-2xl overflow-y-auto shadow-2xl transition-all duration-300 ${
              previewViewport === "mobile" ? "w-[390px] h-[720px]" : "w-full max-w-5xl h-[640px]"
            } bg-black`}
          >
            <SectionRenderer section={previewSection} priority={true} />
          </div>
        </div>
      )}

      {/* Revision History Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#161617] border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h2 className="text-base font-semibold text-white">Version History & Rollback</h2>
              <button onClick={() => setShowRevisionModal(false)}>
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto text-xs">
              {revisions.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-white">
                      Version #{rev.versionNumber} — {rev.revisionNotes}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">
                      {new Date(rev.createdAt).toLocaleString()} by {rev.createdBy}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRollback(rev.id)}
                    className="apple-btn-secondary text-xs py-1 px-2.5"
                  >
                    Rollback
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Media Library Picker Modal */}
      {pickerTarget && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-[#161617] border border-zinc-800 rounded-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-sm font-semibold text-white">Select Media from Cloud Library</h3>
                <p className="text-[11px] text-zinc-400">
                  Target field: <span className="font-mono text-blue-400">{pickerTarget}</span>
                </p>
              </div>
              <button
                onClick={() => setPickerTarget(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {libraryLoading ? (
              <div className="py-12 text-center text-xs text-zinc-400">Loading Cloudinary Assets...</div>
            ) : libraryAssets.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <ImageIcon className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-xs text-zinc-400">No media assets found in library.</p>
                <Link
                  href="/admin/media"
                  target="_blank"
                  className="text-xs text-blue-400 hover:underline inline-block"
                >
                  Go to Media Library to upload new assets &rarr;
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 overflow-y-auto pr-1 flex-1">
                {libraryAssets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => handleSelectAsset(asset)}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-blue-500 cursor-pointer transition-colors space-y-2 group"
                  >
                    <div className="aspect-square rounded-lg bg-black overflow-hidden flex items-center justify-center relative">
                      {asset.mediaType === "image" ? (
                        <img
                          src={asset.publicUrl}
                          alt={asset.altText || asset.filename}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-blue-400 p-2">
                          <Video className="w-6 h-6 mb-1" />
                          <span className="text-[9px] uppercase font-bold">Video</span>
                        </div>
                      )}
                      <span className="absolute top-1 right-1 text-[8px] font-bold px-1 py-0.5 rounded bg-black/80 text-white uppercase">
                        {asset.mediaType}
                      </span>
                    </div>
                    <div>
                      <div className="text-[11px] font-medium text-white truncate" title={asset.filename}>
                        {asset.filename}
                      </div>
                      <div className="text-[9px] text-zinc-500 mt-0.5">
                        {(asset.fileSize / 1024).toFixed(0)} KB
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
              <Link
                href="/admin/media"
                target="_blank"
                className="text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Open Full Media Library</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                type="button"
                onClick={() => setPickerTarget(null)}
                className="px-4 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
