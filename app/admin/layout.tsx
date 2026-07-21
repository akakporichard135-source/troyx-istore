"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Boxes, 
  FileText, 
  Home, 
  LockKeyhole, 
  Megaphone, 
  PackagePlus, 
  Percent, 
  Settings, 
  Shield, 
  Users, 
  ImageIcon, 
  DollarSign, 
  Archive,
  ArrowLeft,
  Menu,
  X,
  Bell,
  Search,
  User,
  ShieldAlert,
  ChevronDown,
  Store,
  CreditCard,
  Sparkles
} from "lucide-react";
import { useAdminStore, AdminRole } from "@/context/admin-store";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Overview", href: "/admin" },
  { icon: Store, label: "Marketplace Overview", href: "/admin/marketplace" },
  { icon: Users, label: "Store Vendors", href: "/admin/marketplace/vendors" },
  { icon: FileText, label: "Seller Applications", href: "/admin/marketplace/applications" },
  { icon: Sparkles, label: "Subscription Plans", href: "/admin/marketplace/plans" },
  { icon: CreditCard, label: "Vendor Payouts", href: "/admin/marketplace/payouts" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: PackagePlus, label: "Products", href: "/admin/products" },
  { icon: Boxes, label: "Inventory", href: "/admin/inventory" },
  { icon: FileText, label: "Orders", href: "/admin/orders" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: Percent, label: "Promotions", href: "/admin/promotions" },
  { icon: Shield, label: "Role Matrix", href: "/admin/roles" },
  { icon: Settings, label: "Store Settings", href: "/admin/settings" },
  { icon: LockKeyhole, label: "Audit Logs", href: "/admin/logs" },
];

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const { currentRole, setRole } = useAdminStore();

  const handleRoleChange = (role: AdminRole) => {
    setRole(role);
    setRoleDropdownOpen(false);
  };

  const activeItem = menuItems.find(item => item.href === pathname) || menuItems[0];

  return (
    <div className="min-h-screen bg-brand-mist dark:bg-zinc-950 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-brand-ink/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-zinc-900 border-r border-black/5 dark:border-white/5 flex flex-col transition-transform lg:translate-x-0 lg:static lg:h-screen",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue text-white font-bold text-sm">
              TX
            </span>
            <div className="leading-tight">
              <span className="block text-sm font-semibold text-brand-ink dark:text-white">TroyX Admin</span>
              <span className="block text-[10px] text-zinc-500 font-mono">v1.2.0 (Enterprise)</span>
            </div>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-brand-blue text-white shadow-lg shadow-blue-500/10" 
                    : "text-zinc-600 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/5"
                )}
              >
                <Icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-white" : "text-zinc-500")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-black/5 dark:border-white/5 bg-brand-mist/50 dark:bg-zinc-900/50 space-y-3">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-black/5 bg-white hover:bg-zinc-50 text-xs font-semibold text-brand-ink transition dark:border-white/5 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Storefront
          </Link>

          {/* Quick Role Status Indicator */}
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-black/5 dark:border-white/5">
            <Shield className="h-4.5 w-4.5 text-brand-blue" />
            <div className="leading-tight">
              <p className="text-[10px] text-zinc-500 uppercase font-semibold">Active Session</p>
              <p className="text-xs font-bold text-brand-ink dark:text-white">{currentRole}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-black/5 dark:border-white/5 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden md:flex items-center gap-2 text-sm text-zinc-500">
              <span className="font-semibold text-brand-ink dark:text-white">Admin Dashboard</span>
              <span>/</span>
              <span className="capitalize">{activeItem.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Role Switcher Selector */}
            <div className="relative">
              <button 
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/10 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 transition"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Role: <span className="text-brand-blue font-bold">{currentRole}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {roleDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setRoleDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-2rem border border-black/5 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-zinc-800 z-20">
                    <p className="text-[10px] text-zinc-400 font-semibold px-3 py-1.5 uppercase border-b border-black/5 dark:border-white/5 mb-1">
                      Switch Active Role
                    </p>
                    {(["Owner", "Administrator", "Manager", "Sales Staff", "Support Staff"] as AdminRole[]).map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleChange(role)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition",
                          currentRole === role 
                            ? "bg-brand-blue text-white" 
                            : "text-zinc-700 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/5"
                        )}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <ThemeToggle />

            {/* Notification Ring */}
            <button className="relative p-2 rounded-full border border-black/10 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-blue" />
            </button>

            {/* User Icon */}
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-700">
              <div className="h-8 w-8 rounded-full bg-zinc-100 border border-black/5 dark:bg-zinc-800 dark:border-white/5 flex items-center justify-center">
                <User className="h-4 w-4 text-zinc-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-brand-mist/50 dark:bg-zinc-950/20">
          {children}
        </main>
      </div>
    </div>
  );
}
