"use client";

import { useState } from "react";
import { FileText, CheckCircle2, XCircle, ShieldCheck, ExternalLink, Clock, Building2 } from "lucide-react";
import { useVendorStore } from "@/context/vendor-store";
import { Button } from "@/components/ui/button";

export default function AdminApplicationsPage() {
  const applications = useVendorStore((state) => state.applications);
  const approveApplication = useVendorStore((state) => state.approveApplication);
  const rejectApplication = useVendorStore((state) => state.rejectApplication);

  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectModalId) {
      rejectApplication(rejectModalId, rejectReason || "Application failed compliance verification.");
      setRejectModalId(null);
      setRejectReason("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-black/5 dark:border-white/10 pb-6">
        <h1 className="text-2xl font-extrabold text-brand-ink dark:text-white">Seller Registration Applications</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Review business identification, Ghana Card / TIN documents, and approve merchant storefronts.
        </p>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/5 dark:border-white/10 pb-4 gap-3">
              <div className="flex items-center gap-3">
                <img src={app.logoUrl} alt={app.businessName} className="h-11 w-11 rounded-2xl border border-black/10 dark:border-white/10 object-cover bg-zinc-100 dark:bg-zinc-800 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-brand-ink dark:text-white">{app.businessName}</h2>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      app.status === "Approved"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : app.status === "Rejected"
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    Applied on {new Date(app.createdAt).toLocaleDateString("en-GB")} &bull; Plan Requested: <span className="font-bold text-brand-blue">{app.selectedPlan}</span>
                  </p>
                </div>
              </div>

              {app.status === "Pending" && (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => approveApplication(app.id)}
                    className="h-9 px-4 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    Approve Store
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setRejectModalId(app.id)}
                    className="h-9 px-4 text-xs font-semibold border-red-500/30 text-red-500 hover:bg-red-500/10"
                  >
                    <XCircle className="h-4 w-4 mr-1.5" />
                    Reject
                  </Button>
                </div>
              )}
            </div>

            {/* Application Data Grid */}
            <div className="grid gap-4 sm:grid-cols-3 text-xs text-zinc-700 dark:text-zinc-300">
              <div>
                <p className="font-semibold text-zinc-400 text-[11px] uppercase tracking-wider">Owner Contact</p>
                <p className="font-bold text-brand-ink dark:text-white mt-1">{app.ownerName}</p>
                <p className="text-[11px] text-zinc-500">{app.email}</p>
                <p className="text-[11px] text-zinc-500">{app.phone}</p>
              </div>

              <div>
                <p className="font-semibold text-zinc-400 text-[11px] uppercase tracking-wider">Location & Category</p>
                <p className="font-bold text-brand-ink dark:text-white mt-1">{app.city}, {app.country}</p>
                <p className="text-[11px] text-zinc-500">{app.address}</p>
                <p className="text-[11px] font-semibold text-brand-blue">{app.category}</p>
              </div>

              <div>
                <p className="font-semibold text-zinc-400 text-[11px] uppercase tracking-wider">Verification Docs</p>
                <p className="text-[11px] font-mono text-zinc-500 mt-1">Tax TIN: {app.taxNumber || "N/A"}</p>
                <a
                  href={app.govIdUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Uploaded Government ID
                </a>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-black/5 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950 p-3.5 text-xs text-zinc-600 dark:text-zinc-400">
              <span className="font-semibold text-zinc-500">Business Description: </span>
              {app.description}
            </div>

            {app.status === "Rejected" && app.rejectionReason && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 font-semibold">
                Rejection Reason: {app.rejectionReason}
              </div>
            )}
          </div>
        ))}

        {applications.length === 0 && (
          <div className="py-16 text-center text-xs text-zinc-500 rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900">
            No seller applications found.
          </div>
        )}
      </div>

      {/* Reject Reason Modal */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-black/10 dark:border-white/15 bg-white dark:bg-zinc-900 p-6 text-brand-ink dark:text-white space-y-4">
            <h2 className="text-base font-bold">Reject Seller Application</h2>
            <p className="text-xs text-zinc-500">Specify the reason for rejecting this registration application.</p>
            <textarea
              rows={3}
              placeholder="e.g. Invalid Government ID document provided."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 p-3 text-xs focus:border-red-500 focus:outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setRejectModalId(null)} className="h-9 text-xs">
                Cancel
              </Button>
              <Button onClick={handleConfirmReject} className="h-9 text-xs font-bold bg-red-600 text-white hover:bg-red-500">
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
