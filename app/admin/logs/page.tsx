"use client";

import React, { useState, useMemo } from "react";
import { 
  LockKeyhole, 
  Search, 
  Trash2, 
  ShieldAlert, 
  Calendar, 
  UserCheck, 
  Filter, 
  Clock,
  Sparkles,
  AlertTriangle
} from "lucide-react";
import { useAdminStore } from "@/context/admin-store";

export default function SecurityLogsPage() {
  const { auditLogs, currentRole, clearAuditLogs } = useAdminStore();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesSearch = log.action.toLowerCase().includes(search.toLowerCase()) ||
                            log.actor.toLowerCase().includes(search.toLowerCase()) ||
                            (log.details && log.details.toLowerCase().includes(search.toLowerCase())) ||
                            (log.entityId && log.entityId.toLowerCase().includes(search.toLowerCase()));
      const matchesRole = roleFilter === "all" || log.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [auditLogs, search, roleFilter]);

  const handleClearLogs = () => {
    if (currentRole !== "Owner") {
      alert("Access Denied: Only Owner accounts can clear security audit trails.");
      return;
    }
    if (window.confirm("Are you sure you want to purge all security logs? This action is irreversible.")) {
      clearAuditLogs();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-ink dark:text-white">Security Audit Trail</h1>
          <p className="text-zinc-500 text-sm">Read-only tamper-evident logs tracing admin edits, configuration updates, and role hotswaps.</p>
        </div>
        <button 
          onClick={handleClearLogs}
          disabled={currentRole !== "Owner"}
          className="px-4 py-2 border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-full text-xs font-bold transition flex items-center gap-1.5 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-400"
        >
          <Trash2 className="h-3.5 w-3.5" /> Purge Logs
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Filter audit logs by action title, user actor, or modified SKU ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-brand-mist/50 focus:bg-white rounded-full border border-black/5 focus:border-brand-blue outline-none text-sm text-brand-ink dark:bg-zinc-800/50 dark:focus:bg-zinc-900 dark:border-white/5 dark:text-white transition"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="text-xs font-semibold bg-brand-mist/50 dark:bg-zinc-800/50 border border-black/5 dark:border-white/5 rounded-full px-4 py-2 outline-none"
        >
          <option value="all">All Role Actions</option>
          <option value="Owner">Owner Actions</option>
          <option value="Administrator">Administrator Actions</option>
          <option value="Manager">Manager Actions</option>
          <option value="Sales Staff">Sales Staff Actions</option>
          <option value="Support Staff">Support Staff Actions</option>
        </select>
      </div>

      {/* Log Feed */}
      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-850/20 flex items-center justify-between">
          <h3 className="font-bold text-brand-ink dark:text-white text-xs flex items-center gap-1.5">
            <LockKeyhole className="h-4 w-4 text-brand-blue" /> Tamper-Proof Audit Log Feed
          </h3>
          <span className="text-[10px] text-zinc-400 font-mono font-bold">SHA-256 Chain Secured</span>
        </div>

        <div className="divide-y divide-black/5 dark:divide-white/5 max-h-[550px] overflow-y-auto">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-5 flex flex-col sm:flex-row sm:items-start gap-4 transition hover:bg-zinc-50 dark:hover:bg-zinc-850/20">
                {/* Icon indicator */}
                <div className="h-9 w-9 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-black/5 dark:border-white/5 flex items-center justify-center text-zinc-400 flex-shrink-0">
                  {log.action.includes("Purge") || log.action.includes("Delete") ? (
                    <ShieldAlert className="h-4 w-4 text-rose-500" />
                  ) : log.action.includes("Created") || log.action.includes("Added") ? (
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <UserCheck className="h-4 w-4 text-brand-blue" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <p className="text-sm font-extrabold text-brand-ink dark:text-white">{log.action}</p>
                    <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed">{log.details}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-1.5 text-[10px] font-semibold text-zinc-400">
                    <span>Actor: <strong className="text-zinc-700 dark:text-zinc-300">{log.actor}</strong></span>
                    <span>•</span>
                    <span>Role Group: <strong className="text-brand-blue">{log.role}</strong></span>
                    {log.entityId && (
                      <>
                        <span>•</span>
                        <span>Entity ID: <strong className="text-zinc-600 dark:text-zinc-400 font-mono">{log.entityId}</strong></span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-zinc-400 font-semibold">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-zinc-300" />
              No audit logs recorded matching selected search parameters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
