import React from "react";
import { getPages } from "@/lib/storage/db";
import { Search, Globe, FileCode, CheckCircle2 } from "lucide-react";

export const revalidate = 0;

export default async function AdminSeoPage() {
  const pages = await getPages();
  const publishedPages = pages.filter((p) => p.isPublished);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Search Visibility
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">
            SEO & Sitemap Manager
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Audit meta titles, descriptions, and dynamic XML sitemap generated for published routes only.
          </p>
        </div>
      </div>

      {/* Sitemaps Preview Card */}
      <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <FileCode className="w-4 h-4 text-purple-400" />
          <span>Dynamic XML Sitemap Status</span>
        </div>
        <p className="text-xs text-zinc-400">
          In strict compliance with SEO best practices, the sitemap engine only emits verified,
          currently published routes to search crawlers (Googlebot, Bingbot).
        </p>
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 font-mono text-xs text-zinc-300 space-y-1">
          <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-2">
            Active Published Endpoints ({publishedPages.length} routes):
          </div>
          {publishedPages.map((p) => (
            <div key={p.id} className="flex items-center gap-2">
              <span className="text-emerald-400">✔</span>
              <span>https://troyxistore.com/{p.slug === "home" ? "" : p.slug}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pages SEO List */}
      <div className="rounded-2xl bg-[#161617] border border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-900 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
            <tr>
              <th className="px-6 py-4">Page</th>
              <th className="px-6 py-4">Search Engine Title</th>
              <th className="px-6 py-4">Meta Description</th>
              <th className="px-6 py-4">Indexing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {pages.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-900/40">
                <td className="px-6 py-4 font-semibold text-white">/{p.slug === "home" ? "" : p.slug}</td>
                <td className="px-6 py-4 text-zinc-300">{p.seoTitle || p.title}</td>
                <td className="px-6 py-4 text-zinc-400 max-w-sm truncate">{p.seoDescription || "Default store meta description"}</td>
                <td className="px-6 py-4">
                  {p.isPublished ? (
                    <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Index, Follow</span>
                    </span>
                  ) : (
                    <span className="text-zinc-500 font-medium text-[11px]">Noindex (Draft)</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
