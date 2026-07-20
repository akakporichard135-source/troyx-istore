"use client";

import React from "react";
import { 
  Shield, 
  Check, 
  X, 
  ShieldAlert, 
  UserCheck, 
  HelpCircle,
  Sparkles
} from "lucide-react";
import { useAdminStore } from "@/context/admin-store";

const rolesList = [
  {
    name: "Owner",
    desc: "Complete administrative access to all financial parameters, database records, role permissions, and API credentials.",
    level: "Super Admin"
  },
  {
    name: "Administrator",
    desc: "Manage product catalogs, process orders, print invoices, CRM reviews, and inspect audit logs. Cannot delete the Owner account.",
    level: "Admin Access"
  },
  {
    name: "Manager",
    desc: "Maintain product catalog, adjust pricing indices, coordinate stock levels, and review customer segments.",
    level: "Management Level"
  },
  {
    name: "Sales Staff",
    desc: "Authorized to record orders, adjust inventory count, generate customer invoices, and add coupon rules.",
    level: "Staff Level"
  },
  {
    name: "Support Staff",
    desc: "Review order histories, inspect shipping parameters, and add internal notes to customer profiles.",
    level: "Read-Only / CRM"
  }
];

const permissionsMatrix = [
  { permission: "Access Admin Dashboard", owner: true, admin: true, manager: true, sales: true, support: true },
  { permission: "Add/Edit Products", owner: true, admin: true, manager: true, sales: true, support: false },
  { permission: "Delete Products", owner: true, admin: true, manager: false, sales: false, support: false },
  { permission: "View Revenue & Conversion Analytics", owner: true, admin: true, manager: true, sales: false, support: false },
  { permission: "Fulfill Orders & Generate Invoices", owner: true, admin: true, manager: true, sales: true, support: false },
  { permission: "Issue Refunds (Mock Process)", owner: true, admin: true, manager: false, sales: false, support: false },
  { permission: "Configure Tax & Currency Settings", owner: true, admin: false, manager: false, sales: false, support: false },
  { permission: "Log Internal CRM Notes & Log support", owner: true, admin: true, manager: true, sales: true, support: true },
  { permission: "Purge System Security Audit Logs", owner: true, stroke: false, admin: false, manager: false, sales: false, support: false }
];

export default function RolesMatrixPage() {
  const { currentRole } = useAdminStore();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-brand-ink dark:text-white">Role-Based Access (RBAC)</h1>
        <p className="text-zinc-500 text-sm">Review operational boundaries and visual authorization layers for enterprise staff roles.</p>
      </div>

      {/* Role Notice alert */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-brand-blue/10 rounded-[2rem] flex gap-3 items-center">
        <span className="p-2 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-xl text-brand-blue flex-shrink-0">
          <ShieldAlert className="h-5 w-5" />
        </span>
        <div className="text-xs">
          <p className="font-bold text-zinc-800 dark:text-zinc-200">Active Simulation Engine</p>
          <p className="text-zinc-500 mt-0.5">
            You are currently viewing the panel under the <strong className="text-brand-blue">{currentRole}</strong> role. Use the dropdown in the header to hot-swap profiles and observe lockouts.
          </p>
        </div>
      </div>

      {/* Role Profiles grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {rolesList.map((r) => {
          const isActive = r.name === currentRole;
          return (
            <div 
              key={r.name} 
              className={`p-6 rounded-[2rem] border transition relative flex flex-col justify-between ${
                isActive 
                  ? "bg-white border-brand-blue shadow-lg dark:bg-zinc-900" 
                  : "bg-white border-black/5 dark:bg-zinc-900 dark:border-white/5"
              }`}
            >
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-black/5 dark:border-white/5 mb-3">
                  <h3 className="font-bold text-brand-ink dark:text-white text-base flex items-center gap-2">
                    <Shield className={`h-4.5 w-4.5 ${isActive ? "text-brand-blue" : "text-zinc-400"}`} /> {r.name}
                  </h3>
                  <span className="text-[9px] px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-md font-mono dark:bg-zinc-800 dark:text-zinc-400">
                    {r.level}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-zinc-500">{r.desc}</p>
              </div>

              {isActive && (
                <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 text-[10px] font-bold text-brand-blue flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4" /> CURRENT SIMULATION SESSION
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison permissions Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-850/20">
          <h3 className="font-bold text-brand-ink dark:text-white text-sm flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-brand-blue" /> Access Authorization Matrix
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 text-zinc-400 font-semibold uppercase">
                <th className="px-6 py-4">Permission Scope</th>
                <th className="px-6 py-4 text-center">Owner</th>
                <th className="px-6 py-4 text-center">Admin</th>
                <th className="px-6 py-4 text-center">Manager</th>
                <th className="px-6 py-4 text-center">Sales</th>
                <th className="px-6 py-4 text-center">Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5 font-semibold text-brand-ink dark:text-white">
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-850/20 transition">
                  <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300 font-bold">{row.permission}</td>
                  <td className="px-6 py-4 text-center">
                    {row.owner ? <Check className="h-4 w-4 text-emerald-500 mx-auto" /> : <X className="h-4 w-4 text-zinc-300 mx-auto" />}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.admin ? <Check className="h-4 w-4 text-emerald-500 mx-auto" /> : <X className="h-4 w-4 text-zinc-300 mx-auto" />}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.manager ? <Check className="h-4 w-4 text-emerald-500 mx-auto" /> : <X className="h-4 w-4 text-zinc-300 mx-auto" />}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.sales ? <Check className="h-4 w-4 text-emerald-500 mx-auto" /> : <X className="h-4 w-4 text-zinc-300 mx-auto" />}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.support ? <Check className="h-4 w-4 text-emerald-500 mx-auto" /> : <X className="h-4 w-4 text-zinc-300 mx-auto" />}
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
