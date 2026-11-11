"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, ExternalLink, LogOut, User } from "lucide-react";
import { UserProfile } from "@/lib/types";

interface AdminHeaderProps {
  user: UserProfile;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  const roleColors: Record<string, string> = {
    owner: "bg-purple-950 text-purple-300 border-purple-800",
    editor: "bg-blue-950 text-blue-300 border-blue-800",
    viewer: "bg-zinc-800 text-zinc-300 border-zinc-700",
  };

  return (
    <header className="h-14 border-b border-zinc-800 bg-[#161617] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
            <Shield className="w-4 h-4 text-zinc-200" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-white">
            Troy<span className="text-zinc-400 font-light">X</span> Control Center
          </span>
        </Link>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-zinc-300">
          CMS v2.0
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors border border-zinc-800 rounded-full px-3 py-1 bg-zinc-900"
        >
          <span>View Live Store</span>
          <ExternalLink className="w-3 h-3" />
        </Link>

        {/* Staff Profile and Role Badge */}
        <div className="flex items-center gap-2 border-l border-zinc-800 pl-4">
          <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 text-xs">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-medium text-white">{user.fullName}</div>
            <div className="text-[10px] text-zinc-400">{user.email}</div>
          </div>
          <span
            className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
              roleColors[user.role] || "bg-zinc-800 text-zinc-300 border-zinc-700"
            }`}
          >
            {user.role}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-zinc-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-zinc-900"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
