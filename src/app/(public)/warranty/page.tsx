import React from "react";
import { ShieldCheck, CheckCircle2, RotateCcw } from "lucide-react";

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="py-16 sm:py-24 px-4 sm:px-6 text-center border-b border-zinc-900 bg-zinc-950">
        <div className="max-w-2xl mx-auto space-y-3">
          <p className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
            Protection & Coverage
          </p>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
            Warranty & Returns
          </h1>
          <p className="text-sm text-zinc-400">
            Transparent protection for original Apple hardware at TroyX iStore.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-8">
        <div className="p-8 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
            <h2 className="text-xl font-semibold text-white">Authenticity & Hardware Warranty</h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            All devices purchased at TroyX iStore are guaranteed to be authentic original Apple
            hardware. Brand new devices include manufacturer coverage, and certified pre-owned or
            refurbished devices include comprehensive TroyX store warranty covering functional
            hardware components (motherboard, display, cameras, Face ID / Touch ID, speakers).
          </p>
          <ul className="space-y-2 text-xs text-zinc-300 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full diagnostic inspection report provided with each purchase</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Accurate battery health capacity verification</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct replacement or repair for any verifiable factory defect</span>
            </li>
          </ul>
        </div>

        <div className="p-8 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
          <div className="flex items-center gap-3">
            <RotateCcw className="w-7 h-7 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Exchange Policy</h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Customers may request a replacement within 7 calendar days of receipt if the unit
            encounters an unresolvable hardware anomaly, provided the device has not sustained
            liquid ingress, accidental drop impact, physical alterations, or third-party disassembly.
          </p>
        </div>
      </section>
    </div>
  );
}
