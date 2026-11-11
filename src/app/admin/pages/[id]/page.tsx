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
  Sparkles,
  Layout,
  Layers,
  HelpCircle,
  Sliders,
  Film,
  Camera,
  Grid,
} from "lucide-react";
import { PageRecord, PageSection, PageRevision, SectionType } from "@/lib/types";
import SectionRenderer from "@/components/public/SectionRenderer";
import UniversalMediaPicker, { SelectedMedia } from "@/components/admin/UniversalMediaPicker";

const TEMPLATE_OPTIONS: Array<{
  type: SectionType;
  title: string;
  category: string;
  description: string;
  defaultTheme: "dark" | "white";
}> = [
  {
    type: "cinematic_hero",
    title: "Cinematic Video Hero",
    category: "Hero Showcases",
    description: "Full-width video background with Apple typography and dual CTA buttons.",
    defaultTheme: "dark",
  },
  {
    type: "image_hero",
    title: "Full-Width Image Hero",
    category: "Hero Showcases",
    description: "Photographic high-resolution hero with responsive desktop and mobile pictures.",
    defaultTheme: "dark",
  },
  {
    type: "fullscreen_image",
    title: "Full-Screen Visual Showcase",
    category: "Hero Showcases",
    description: "Immersive edge-to-edge hardware visual with subtle dark contrast overlay.",
    defaultTheme: "dark",
  },
  {
    type: "split_story",
    title: "Image-and-Text Split Story",
    category: "Storytelling",
    description: "50/50 split layout pairing product narrative with crisp hardware photography.",
    defaultTheme: "dark",
  },
  {
    type: "video_story",
    title: "Video Narrative Split",
    category: "Storytelling",
    description: "Side-by-side looping cinematic clip and product feature explanation.",
    defaultTheme: "dark",
  },
  {
    type: "feature_showcase",
    title: "Feature Highlights Grid",
    category: "Features & Specs",
    description: "Three-column modern card grid detailing hardware features with icons.",
    defaultTheme: "dark",
  },
  {
    type: "tech_specs",
    title: "Technical Specifications",
    category: "Features & Specs",
    description: "Minimalist Apple-style horizontal divider table for chips, displays, and battery.",
    defaultTheme: "dark",
  },
  {
    type: "comparison_table",
    title: "Device Comparison Cards",
    category: "Features & Specs",
    description: "Multi-model comparison columns highlighting tier differences.",
    defaultTheme: "dark",
  },
  {
    type: "media_gallery",
    title: "Product Photography Gallery",
    category: "Galleries & Carousels",
    description: "Interactive photo grid showcase for device finishes and angles.",
    defaultTheme: "dark",
  },
  {
    type: "image_carousel",
    title: "Swipeable Image Carousel",
    category: "Galleries & Carousels",
    description: "Smooth horizontal slider with next/previous controls for gallery photography.",
    defaultTheme: "dark",
  },
  {
    type: "promo_banner",
    title: "Campaign / Promotional Banner",
    category: "Marketing",
    description: "High-contrast promotional card with badge and direct purchase link.",
    defaultTheme: "dark",
  },
  {
    type: "faq",
    title: "Frequently Asked Questions",
    category: "Information",
    description: "Interactive expandable FAQ accordion for store policies, warranty, and battery.",
    defaultTheme: "dark",
  },
  {
    type: "contact_section",
    title: "Store Location & Contact Info",
    category: "Storefront",
    description: "Physical East Legon showroom photography, phone numbers, and direct WhatsApp.",
    defaultTheme: "dark",
  },
  {
    type: "cta_section",
    title: "Call-to-Action Closing Section",
    category: "Marketing",
    description: "High-impact closing section encouraging buyers to explore stock or visit store.",
    defaultTheme: "dark",
  },
];

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
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Universal Media Picker State
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<
    "desktopImageUrl" | "mobileImageUrl" | "desktopVideoUrl" | "mobileVideoUrl" | "posterImageUrl" | "gallery" | null
  >(null);
  const [pickerFilter, setPickerFilter] = useState<"all" | "image" | "video">("all");
  const [pickerTitle, setPickerTitle] = useState("Select Media Asset");

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

  // Section Ordering: Move Up or Down
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
      setMessage(`Duplicated section '${result.section.draftLabel}'`);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Create Section from Selected Template
  const handleSelectTemplate = async (template: typeof TEMPLATE_OPTIONS[0]) => {
    setShowTemplateModal(false);
    const res = await fetch("/api/admin/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pageId,
        sectionType: template.type,
        draftLabel: `${template.title} #${sections.length + 1}`,
        sortOrder: sections.length + 1,
        isPublished: false,
        theme: template.defaultTheme,
        backgroundColor: template.defaultTheme === "dark" ? "#000000" : "#ffffff",
        textColor: template.defaultTheme === "dark" ? "#f5f5f7" : "#1d1d1f",
        textAlignment: "center",
        mediaType: template.type.includes("video") ? "video" : "image",
      }),
    });
    const result = await res.json();
    if (result.section) {
      setSections((prev) => [...prev, result.section]);
      setEditingSection(result.section);
    }
  };

  // Save Section changes
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
    const notes = prompt("Enter revision snapshot note (e.g. 'Before launch update'):");
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

  // Open Universal Media Picker
  const openMediaPicker = (
    target: "desktopImageUrl" | "mobileImageUrl" | "desktopVideoUrl" | "mobileVideoUrl" | "posterImageUrl" | "gallery",
    title: string,
    filter: "all" | "image" | "video" = "all"
  ) => {
    setPickerTarget(target);
    setPickerTitle(title);
    setPickerFilter(filter);
    setPickerOpen(true);
  };

  const handleMediaSelected = (media: SelectedMedia) => {
    if (!editingSection || !pickerTarget) return;

    if (pickerTarget === "gallery") {
      const currentGallery = editingSection.config?.galleryImages || [];
      const updatedGallery = [
        ...currentGallery,
        { url: media.url, caption: media.caption || "", alt: media.altText || media.filename || "" },
      ];
      setEditingSection({
        ...editingSection,
        config: {
          ...editingSection.config,
          galleryImages: updatedGallery,
        },
      });
    } else {
      setEditingSection({
        ...editingSection,
        [pickerTarget]: media.url,
      });
    }
    setPickerOpen(false);
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
            className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Page Manager</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              {page.title}
            </h1>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                page.isPublished
                  ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                  : "bg-yellow-950 text-yellow-400 border-yellow-800"
              }`}
            >
              {page.isPublished ? "Published" : "Draft"}
            </span>
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
            onClick={() => setShowTemplateModal(true)}
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
            unpublished drafts. To launch a section, click <span className="text-white font-medium">Edit Content</span>, attach your media or text, and toggle <span className="text-emerald-400 font-medium">Publish</span>.
          </p>
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-3">
        {sections.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-zinc-800 bg-[#161617]/50 space-y-3">
            <Layout className="w-8 h-8 text-zinc-600 mx-auto" />
            <div className="text-sm font-semibold text-white">No sections on this page yet</div>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Add your first section from our 20 Apple-inspired templates to start visually designing this page.
            </p>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="apple-btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Choose Section Template</span>
            </button>
          </div>
        ) : (
          sections.map((section, index) => {
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
          })
        )}
      </div>

      {/* TEMPLATE SELECTOR MODAL */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-4xl w-full bg-[#161617] border border-zinc-800 rounded-3xl p-6 space-y-6 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Section Template Library
                </span>
                <h2 className="text-xl font-semibold text-white">Choose a Section Template</h2>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1">
              {TEMPLATE_OPTIONS.map((tmpl) => (
                <div
                  key={tmpl.type}
                  onClick={() => handleSelectTemplate(tmpl)}
                  className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-blue-500 hover:bg-zinc-900 cursor-pointer transition-all space-y-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                      {tmpl.category}
                    </span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-black text-zinc-400 border border-zinc-800">
                      {tmpl.defaultTheme}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {tmpl.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION EDITOR DRAWER */}
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
                    placeholder="e.g. Titanium Power"
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
                    placeholder="e.g. Built for performance and all-day endurance."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Media Configuration with Universal Media Picker */}
              <div className="space-y-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Universal Media Assets</h3>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                    Direct Cloud Upload
                  </span>
                </div>

                {/* Desktop Image Slot */}
                <div className="space-y-1.5 p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
                  <div className="flex items-center justify-between">
                    <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                      <span>Desktop Image</span>
                    </label>
                    {editingSection.desktopImageUrl && (
                      <button
                        type="button"
                        onClick={() => setEditingSection({ ...editingSection, desktopImageUrl: "" })}
                        className="text-[10px] text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {editingSection.desktopImageUrl ? (
                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-14 h-14 rounded-lg bg-black border border-zinc-800 overflow-hidden shrink-0">
                        <img src={editingSection.desktopImageUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 truncate text-[11px] text-zinc-400">
                        {editingSection.desktopImageUrl}
                      </div>
                      <button
                        type="button"
                        onClick={() => openMediaPicker("desktopImageUrl", "Select Desktop Image", "image")}
                        className="apple-btn-secondary text-[11px] py-1 px-2.5"
                      >
                        Replace
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openMediaPicker("desktopImageUrl", "Select Desktop Image", "image")}
                      className="w-full py-2 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center gap-2 hover:border-zinc-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Select or Upload Desktop Image</span>
                    </button>
                  )}
                </div>

                {/* Mobile Image Slot */}
                <div className="space-y-1.5 p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
                  <div className="flex items-center justify-between">
                    <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                      <span>Mobile Image (Optional)</span>
                    </label>
                    {editingSection.mobileImageUrl && (
                      <button
                        type="button"
                        onClick={() => setEditingSection({ ...editingSection, mobileImageUrl: "" })}
                        className="text-[10px] text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {editingSection.mobileImageUrl ? (
                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-14 h-14 rounded-lg bg-black border border-zinc-800 overflow-hidden shrink-0">
                        <img src={editingSection.mobileImageUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 truncate text-[11px] text-zinc-400">
                        {editingSection.mobileImageUrl}
                      </div>
                      <button
                        type="button"
                        onClick={() => openMediaPicker("mobileImageUrl", "Select Mobile Image", "image")}
                        className="apple-btn-secondary text-[11px] py-1 px-2.5"
                      >
                        Replace
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openMediaPicker("mobileImageUrl", "Select Mobile Image", "image")}
                      className="w-full py-2 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center gap-2 hover:border-zinc-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Select or Upload Mobile Image</span>
                    </button>
                  )}
                </div>

                {/* Desktop Video Slot */}
                <div className="space-y-1.5 p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
                  <div className="flex items-center justify-between">
                    <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-blue-400" />
                      <span>Cinematic Desktop Video</span>
                    </label>
                    {editingSection.desktopVideoUrl && (
                      <button
                        type="button"
                        onClick={() => setEditingSection({ ...editingSection, desktopVideoUrl: "" })}
                        className="text-[10px] text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {editingSection.desktopVideoUrl ? (
                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-14 h-14 rounded-lg bg-black border border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center text-blue-400">
                        <Video className="w-6 h-6" />
                      </div>
                      <div className="flex-1 truncate text-[11px] text-zinc-400">
                        {editingSection.desktopVideoUrl}
                      </div>
                      <button
                        type="button"
                        onClick={() => openMediaPicker("desktopVideoUrl", "Select Desktop Video", "video")}
                        className="apple-btn-secondary text-[11px] py-1 px-2.5"
                      >
                        Replace
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openMediaPicker("desktopVideoUrl", "Select Desktop Video", "video")}
                      className="w-full py-2 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center gap-2 hover:border-zinc-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Select or Upload Desktop Video</span>
                    </button>
                  )}
                </div>

                {/* Poster Image Slot */}
                <div className="space-y-1.5 p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
                  <div className="flex items-center justify-between">
                    <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                      <span>Video Poster Image</span>
                    </label>
                    {editingSection.posterImageUrl && (
                      <button
                        type="button"
                        onClick={() => setEditingSection({ ...editingSection, posterImageUrl: "" })}
                        className="text-[10px] text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {editingSection.posterImageUrl ? (
                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-14 h-14 rounded-lg bg-black border border-zinc-800 overflow-hidden shrink-0">
                        <img src={editingSection.posterImageUrl} alt="Poster" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 truncate text-[11px] text-zinc-400">
                        {editingSection.posterImageUrl}
                      </div>
                      <button
                        type="button"
                        onClick={() => openMediaPicker("posterImageUrl", "Select Video Poster Image", "image")}
                        className="apple-btn-secondary text-[11px] py-1 px-2.5"
                      >
                        Replace
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openMediaPicker("posterImageUrl", "Select Video Poster Image", "image")}
                      className="w-full py-2 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center gap-2 hover:border-zinc-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Select or Upload Poster</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Call to Action Buttons */}
              <div className="space-y-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <h3 className="font-semibold text-white">Call to Action Buttons</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-zinc-400">Learn More Text</label>
                    <input
                      type="text"
                      value={editingSection.learnMoreText || ""}
                      onChange={(e) =>
                        setEditingSection({ ...editingSection, learnMoreText: e.target.value })
                      }
                      placeholder="Learn more"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-zinc-400">Learn More Destination URL</label>
                    <input
                      type="text"
                      value={editingSection.learnMoreUrl || ""}
                      onChange={(e) =>
                        setEditingSection({ ...editingSection, learnMoreUrl: e.target.value })
                      }
                      placeholder="/learn-more/iphone-18-pro"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-zinc-400">Buy Button Text</label>
                    <input
                      type="text"
                      value={editingSection.buyText || ""}
                      onChange={(e) =>
                        setEditingSection({ ...editingSection, buyText: e.target.value })
                      }
                      placeholder="Buy"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-zinc-400">Buy Destination URL</label>
                    <input
                      type="text"
                      value={editingSection.buyUrl || ""}
                      onChange={(e) =>
                        setEditingSection({ ...editingSection, buyUrl: e.target.value })
                      }
                      placeholder="/product/iphone-18-pro"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Form Action Controls */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
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
                  className="apple-btn-primary px-6 py-2.5 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving Section..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewSection && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-6xl flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-white">Live Section Preview</span>
              <div className="flex items-center rounded-xl bg-zinc-900 border border-zinc-800 p-0.5">
                <button
                  onClick={() => setPreviewViewport("desktop")}
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                    previewViewport === "desktop" ? "bg-zinc-800 text-white font-medium" : "text-zinc-400"
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  onClick={() => setPreviewViewport("mobile")}
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                    previewViewport === "mobile" ? "bg-zinc-800 text-white font-medium" : "text-zinc-400"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>
            <button
              onClick={() => setPreviewSection(null)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 w-full overflow-y-auto py-6 flex items-center justify-center">
            <div
              className={`transition-all duration-300 rounded-3xl overflow-hidden border border-zinc-800 ${
                previewViewport === "mobile" ? "w-[375px] shadow-2xl" : "w-full max-w-6xl"
              }`}
            >
              <SectionRenderer section={previewSection} priority={true} />
            </div>
          </div>
        </div>
      )}

      {/* REVISION HISTORY MODAL */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-[#161617] border border-zinc-800 rounded-3xl p-6 space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h2 className="text-base font-semibold text-white">Version Snapshot History</h2>
              <button onClick={() => setShowRevisionModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="divide-y divide-zinc-800/80 overflow-y-auto pr-1 flex-1">
              {revisions.map((rev) => (
                <div key={rev.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-white">
                      Version #{rev.versionNumber} — {rev.revisionNotes || "Snapshot"}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">
                      {new Date(rev.createdAt).toLocaleString()} by {rev.createdBy || "Admin"}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRollback(rev.id)}
                    className="apple-btn-secondary text-xs py-1 px-3"
                  >
                    Rollback
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* UNIVERSAL MEDIA PICKER MODAL */}
      <UniversalMediaPicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleMediaSelected}
        title={pickerTitle}
        filter={pickerFilter}
        currentValue={
          editingSection && pickerTarget && pickerTarget !== "gallery"
            ? (editingSection[pickerTarget] as string)
            : undefined
        }
      />
    </div>
  );
}
