"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Info, KeyRound, ShieldAlert, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error ||
            "Staff authentication is postponed until verified store owner credentials are provided from Firebase."
        );
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(
        err.message ||
          "Staff authentication setup is postponed. Privileged CMS operations are temporarily restricted until verified Firebase Auth credentials are provided."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-white shadow-xl">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
              TroyX iStore • Accra, Ghana
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">
              TroyX Control Center
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Dedicated store administration and visual content management.
            </p>
          </div>
        </div>

        {/* Administrative Setup Notice */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-2.5">
          <div className="flex items-center gap-2 font-semibold text-white">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Administrative Setup Required — Auth Postponed</span>
          </div>
          <p className="leading-relaxed text-[11px] text-zinc-400">
            Sign in with your provisioned administrator credentials. Public registration is disabled. Administrator accounts are provisioned via trusted server administration. Default initial passwords have been permanently disabled.
          </p>
          <div className="pt-1 text-[10px] text-zinc-500 border-t border-zinc-800/60">
            Default bootstrap passwords (such as <code className="text-zinc-400">TroyX@2026!</code>) are permanently rejected.
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4 shadow-2xl">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-300">Store Owner / Staff Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@troyxistore.com"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-300">Access Passcode</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors mt-2"
          >
            <span>{loading ? "Authenticating..." : "Sign in to Control Center"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Owner Onboarding Instructions */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 text-xs text-zinc-400 space-y-2">
          <div className="flex items-center gap-2 font-medium text-zinc-300 text-[11px] uppercase tracking-wider">
            <KeyRound className="w-3.5 h-3.5 text-blue-400" />
            <span>Owner Authentication Setup Steps:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-[11px] text-zinc-400 leading-relaxed">
            <li>Owner provides verified store email address.</li>
            <li>Firebase Authentication provider registers owner account.</li>
            <li>Custom claims assign <code className="text-zinc-200">role: &quot;owner&quot;</code> in Cloud Firestore.</li>
            <li>Control Center CMS editing operations unlock securely.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
