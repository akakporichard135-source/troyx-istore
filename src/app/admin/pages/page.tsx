import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";
import { getPages, getPageSections } from "@/lib/storage/db";
import { Layers, Plus, ExternalLink, ArrowRight, CheckCircle2, CircleDashed } from "lucide-react";

export const revalidate = 0;

export default async function AdminPagesPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const pages = await getPages();

  // Load section counts for each page
  const pagesWithCounts = await Promise.all(
    pages.map(async (page) => {
      const sections = await getPageSections(page.id);
      const publishedCount = sections.filter((s) => s.isPublished).length;
      return {
        ...page,
        totalSections: sections.length,
        publishedSections: publishedCount,
        draftSections: sections.length - publishedCount,
      };
    })
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Content Architecture
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">
            Visual Page Manager
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage pages, SEO descriptions, and schema-driven component sections.
          </p>
        </div>
      </div>

      {/* Pages Table */}
      <div className="rounded-2xl bg-[#161617] border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
              <tr>
                <th className="px-6 py-4">Page Title & Slug</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">CMS Sections</th>
                <th className="px-6 py-4">Navigation</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {pagesWithCounts.map((page) => {
                const isHome = page.slug === "home";
                return (
                  <tr key={page.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white flex items-center gap-2">
                        <span>{page.title}</span>
                        {isHome && (
                          <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                            Homepage Showcase
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                        /{isHome ? "" : page.slug}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {page.isPublished ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-yellow-400 font-medium">
                          <CircleDashed className="w-3.5 h-3.5" />
                          <span>Draft / Unpublished</span>
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <div className="font-medium text-white">
                          {page.totalSections} total section(s)
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          {page.publishedSections} published • {page.draftSections} draft(s)
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-[11px] text-zinc-400">
                      {page.inNavigation ? "Visible in Header" : "Hidden / Footer only"}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/${isHome ? "" : page.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                          title="Preview public route"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/pages/${page.id}`}
                          className="apple-btn-primary text-xs py-1 px-3 flex items-center gap-1"
                        >
                          <span>Manage Sections</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
