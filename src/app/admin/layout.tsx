import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // If unauthenticated, let the children handle login if on /admin/login
  // Otherwise redirect to /admin/login
  if (!session) {
    return <div className="min-h-screen bg-black text-white">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <AdminHeader user={session.user} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 bg-[#0a0a0a] overflow-x-hidden min-h-[calc(100vh-3.5rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
