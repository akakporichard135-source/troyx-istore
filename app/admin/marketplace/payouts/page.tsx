"use client";

import { useState } from "react";
import { DollarSign, CheckCircle2, XCircle, CreditCard } from "lucide-react";
import { useVendorStore } from "@/context/vendor-store";
import { Button } from "@/components/ui/button";

export default function AdminPayoutsPage() {
  const payouts = useVendorStore((state) => state.payouts);
  const updatePayoutStatus = useVendorStore((state) => state.updatePayoutStatus);

  const pendingCount = payouts.filter((p) => p.status === "Pending").length;
  const totalPayoutsSum = payouts.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-ink dark:text-white">Vendor Payouts & Disbursements</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Approve and mark Mobile Money / Bank withdrawals as paid to verified merchants.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-zinc-500">Total Disbursements:</span>
          <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">GH₵ {totalPayoutsSum.toLocaleString()}</p>
        </div>
      </div>

      {/* Payout Ledger Table */}
      <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-black/5 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950/80 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Payout Ref & Vendor</th>
                <th className="py-3.5 px-4">Channel & Account</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Requested Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5 text-zinc-700 dark:text-zinc-300">
              {payouts.map((po) => (
                <tr key={po.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-brand-blue font-mono">{po.id}</p>
                    <p className="font-semibold text-brand-ink dark:text-white">{po.vendorName}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-brand-ink dark:text-white">{po.paymentMethod}</p>
                    <p className="text-[11px] text-zinc-500">{po.accountDetails}</p>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    GH₵ {po.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      po.status === "Paid" || po.status === "Approved"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : po.status === "Rejected"
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    }`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-500">
                    {new Date(po.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {po.status === "Pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => updatePayoutStatus(po.id, "Paid")}
                          className="h-8 px-3 text-[11px] font-bold bg-emerald-600 text-white hover:bg-emerald-500"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Mark Paid
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updatePayoutStatus(po.id, "Rejected")}
                          className="h-8 px-3 text-[11px] font-semibold border-red-500/20 text-red-500 hover:bg-red-500/10"
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-zinc-400">Processed</span>
                    )}
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
