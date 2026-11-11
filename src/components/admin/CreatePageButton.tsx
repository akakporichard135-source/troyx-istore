"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2 } from "lucide-react";

export default function CreatePageButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [inNavigation, setInNavigation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, "-")) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setError("Title and slug are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          seoTitle: seoTitle.trim() || title.trim(),
          seoDescription: seoDescription.trim(),
          inNavigation,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create page");
      }

      setIsOpen(false);
      setTitle("");
      setSlug("");
      setSeoTitle("");
      setSeoDescription("");
      router.refresh();
      if (data.page?.id) {
        router.push(`/admin/pages/${data.page.id}`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to create page");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="apple-btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
      >
        <Plus className="w-4 h-4" />
        <span>Create New Page</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1c1e] border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h2 className="text-base font-semibold text-white">Create New Page</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {error && (
                <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                  Page Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. iPhone 18 Pro Learn More"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                  Route Slug *
                </label>
                <div className="flex items-center bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 text-sm text-zinc-500">
                  <span>/</span>
                  <input
                    type="text"
                    required
                    placeholder="learn-more-iphone-18-pro"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                    className="w-full bg-transparent py-2 pl-1 text-white focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Tip: For product cinematic pages, use &quot;learn-more-[product-slug]&quot;.
                </p>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                  SEO Meta Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Leave blank to use Page Title"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                  SEO Meta Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief description for search engines and social previews..."
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="inNavCheck"
                  checked={inNavigation}
                  onChange={(e) => setInNavigation(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0"
                />
                <label htmlFor="inNavCheck" className="text-xs text-zinc-300 cursor-pointer">
                  Include in main navigation header
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="apple-btn-primary text-xs py-2 px-5 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{loading ? "Creating..." : "Create Page & Open Builder"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
