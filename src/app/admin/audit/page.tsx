import React from "react";
import { getAuditLogs } from "@/lib/storage/db";
import { ShieldAlert, ShieldCheck, UserCheck, Clock, Key } from "lucide-react";

export const revalidate = 0;

export default async function AdminAuditPage() {
  const logs = await getAuditLogs(100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Security & Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">
            Audit Trail & Access Logs
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Complete immutable log of administrative sessions, price modifications, and publications.
          </p>
        </div>
      </div>

      {/* Security Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#161617] border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-xs text-purple-400">
            <Key className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">Role Authorization</span>
          </div>
          <div className="text-sm font-semibold text-white">Owner, Editor, Viewer Roles</div>
          <p className="text-[11px] text-zinc-400">
            Staff access is segregated with server-side privilege checking.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#161617] border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">Pricing Protection</span>
          </div>
          <div className="text-sm font-semibold text-white">Server-Side Order Validation</div>
          <p className="text-[11px] text-zinc-400">
            Order calculations verify actual DB unit prices, preventing browser price tampering.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#161617] border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-xs text-blue-400">
            <ShieldAlert className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">Content Sanitization</span>
          </div>
          <div className="text-sm font-semibold text-white">XSS & Script Injection Shield</div>
          <p className="text-[11px] text-zinc-400">
            CMS text fields automatically strip script tags to prevent stored script execution.
          </p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl bg-[#161617] border border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-900 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
            <tr>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Entity Type</th>
              <th className="px-6 py-4">Staff User</th>
              <th className="px-6 py-4">Audit Payload</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-zinc-900/40">
                <td className="px-6 py-4 font-mono text-[10px] text-zinc-400">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold font-mono text-white text-[11px] px-2 py-0.5 rounded bg-zinc-800">
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 capitalize text-zinc-400">{log.entityType}</td>
                <td className="px-6 py-4 text-zinc-300">{log.userEmail || log.userId || "System"}</td>
                <td className="px-6 py-4 font-mono text-[10px] text-zinc-500 max-w-xs truncate">
                  {JSON.stringify(log.details || {})}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
