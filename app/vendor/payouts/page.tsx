"use client";

import { useState } from "react";
import { DollarSign, CreditCard, Clock, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";
import { useVendorStore } from "@/context/vendor-store";
import { Button } from "@/components/ui/button";

export default function VendorPayoutsPage() {
  const activeVendorId = useVendorStore((state) => state.activeVendorId);
  const vendors = useVendorStore((state) => state.vendors);
  const payouts = useVendorStore((state) => state.payouts);
  const requestPayout = useVendorStore((state) => state.requestPayout);

  const vendor = vendors.find((v) => v.id === activeVendorId) || vendors[0];
  const vendorPayouts = payouts.filter((p) => p.vendorId === vendor?.id);

  const [amount, setAmount] = useState<number>(1000);
  const [method, setMethod] = useState<"Mobile Money (MTN)" | "Mobile Money (Telecel)" | "Bank Transfer">("Mobile Money (MTN)");
  const [accountDetails, setAccountDetails] = useState(`${vendor?.phone || "0240000000"} (${vendor?.ownerName || "Merchant"})`);
  const [msg, setMsg] = useState<string | null>(null);

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || amount > (vendor?.walletBalance || 0)) {
      setMsg("Invalid withdrawal amount or exceeds current wallet balance.");
      return;
    }

    requestPayout(vendor.id, amount, method, accountDetails);
    setMsg("Payout request submitted successfully! Funds will process according to your plan schedule.");
    setAmount(1000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Store Payouts & Earnings</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Wallet Balance for <strong className="text-white">{vendor?.name}</strong>: <span className="text-emerald-400 font-bold">GH₵ {vendor?.walletBalance?.toLocaleString()}</span>
          </p>
        </div>
      </div>

      {/* Main Grid: Request Form & History */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Request Form */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-400" />
            Request Withdrawal
          </h2>

          {msg && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
              {msg}
            </div>
          )}

          <form onSubmit={handleRequest} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Withdrawal Amount (GH₵)</label>
              <input
                type="number"
                required
                min={100}
                max={vendor?.walletBalance || 0}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-10 rounded-xl border border-white/10 bg-zinc-950 px-3 text-white focus:border-brand-blue focus:outline-none"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">Max available: GH₵ {vendor?.walletBalance?.toLocaleString()}</span>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Payout Channel</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full h-10 rounded-xl border border-white/10 bg-zinc-950 px-3 text-white focus:border-brand-blue focus:outline-none"
              >
                <option value="Mobile Money (MTN)">Mobile Money (MTN)</option>
                <option value="Mobile Money (Telecel)">Mobile Money (Telecel)</option>
                <option value="Bank Transfer">Bank Transfer (Ghana GIP)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Account & Name Details</label>
              <input
                type="text"
                required
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
                className="w-full h-10 rounded-xl border border-white/10 bg-zinc-950 px-3 text-white focus:border-brand-blue focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              disabled={(vendor?.walletBalance || 0) <= 0}
              className="w-full h-11 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/20"
            >
              Submit Withdrawal Request
            </Button>
          </form>
        </div>

        {/* Payout History */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl space-y-4">
          <h2 className="text-lg font-bold text-white">Payout Request History</h2>

          <div className="divide-y divide-white/5 overflow-x-auto text-xs">
            {vendorPayouts.map((po) => (
              <div key={po.id} className="flex items-center justify-between py-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">{po.id}</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                      po.status === "Paid" || po.status === "Approved"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {po.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {po.paymentMethod} &bull; {po.accountDetails}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-emerald-400 text-sm">GH₵ {po.amount.toLocaleString()}</p>
                  <p className="text-[10px] text-zinc-500">{new Date(po.createdAt).toLocaleDateString("en-GB")}</p>
                </div>
              </div>
            ))}

            {vendorPayouts.length === 0 && (
              <div className="py-12 text-center text-xs text-zinc-500">
                No past payout requests found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
