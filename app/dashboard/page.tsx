"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  FileText,
  Lock,
  History,
  Settings,
  ShieldAlert,
  ArrowRight,
  Download,
  Trash2,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCommerceStore } from "@/context/store";
import { useAdminStore } from "@/context/admin-store";
import { ProductGrid } from "@/components/product/product-grid";

export default function CustomerDashboardPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");

  const wishlist = useCommerceStore((state) => state.wishlist);
  const recentlyViewed = useCommerceStore((state) => state.recentlyViewed);
  const products = useAdminStore((state) => state.products);
  const orders = useAdminStore((state) => state.orders);

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));
  const recentlyViewedProducts = products.filter((p) => recentlyViewed.includes(p.id));

  // Security password state
  const [passSaved, setPassSaved] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  return (
    <div className="min-h-screen bg-brand-mist dark:bg-zinc-950 text-brand-ink dark:text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-6">
          <div>
            <span className="text-xs font-extrabold uppercase text-brand-blue tracking-wider">Customer Portal</span>
            <h1 className="text-3xl font-extrabold text-brand-ink dark:text-white">Ama K. Osei Account</h1>
            <p className="text-xs text-zinc-500 mt-1">ama.k@example.com &bull; East Legon, Accra &bull; Member since 2025</p>
          </div>

          <Link href="/shop">
            <Button className="h-10 px-5 text-xs font-bold bg-brand-blue text-white hover:bg-brand-blue/90">
              Continue Shopping &rarr;
            </Button>
          </Link>
        </div>

        {/* Layout Grid */}
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Dashboard Navigation Sidebar */}
          <aside className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-4 shadow-sm h-fit space-y-1">
            {[
              { id: "overview", label: "Dashboard Overview", icon: User },
              { id: "orders", label: "Orders & Tracking", icon: Package },
              { id: "wishlist", label: `Wishlist (${wishlist.length})`, icon: Heart },
              { id: "addresses", label: "Saved Addresses", icon: MapPin },
              { id: "payments", label: "Payment Methods", icon: CreditCard },
              { id: "invoices", label: "Invoices & Downloads", icon: FileText },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "history", label: "Recently Viewed", icon: History },
              { id: "security", label: "Security & Password", icon: Lock },
              { id: "settings", label: "Account Settings", icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition text-left ${
                    isActive
                      ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-ink dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </aside>

          {/* Main Dashboard Content Panel */}
          <div className="space-y-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                    <span className="text-xs font-semibold text-zinc-500">Total Completed Orders</span>
                    <p className="mt-2 text-2xl font-extrabold text-brand-ink dark:text-white">2 Orders</p>
                    <span className="mt-1 text-[11px] text-emerald-500 font-bold">Total Spent: GH₵ 4,198</span>
                  </div>

                  <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                    <span className="text-xs font-semibold text-zinc-500">Saved Wishlist</span>
                    <p className="mt-2 text-2xl font-extrabold text-brand-ink dark:text-white">{wishlist.length} Items</p>
                    <button onClick={() => setActiveTab("wishlist")} className="mt-1 text-[11px] text-brand-blue font-bold hover:underline">
                      View Wishlist &rarr;
                    </button>
                  </div>

                  <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                    <span className="text-xs font-semibold text-zinc-500">Default Shipping Address</span>
                    <p className="mt-2 text-xs font-bold text-brand-ink dark:text-white">House 24, East Legon</p>
                    <span className="mt-1 text-[10px] text-zinc-400">Accra, Ghana</span>
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
                    <h2 className="text-base font-bold text-brand-ink dark:text-white">Recent Purchase Orders</h2>
                    <button onClick={() => setActiveTab("orders")} className="text-xs font-bold text-brand-blue hover:underline">
                      View All Orders &rarr;
                    </button>
                  </div>

                  <div className="space-y-3">
                    {orders.slice(0, 2).map((o) => (
                      <div key={o.id} className="flex items-center justify-between rounded-2xl border border-black/5 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950 p-4 text-xs">
                        <div>
                          <p className="font-bold text-brand-blue font-mono">{o.id}</p>
                          <p className="text-zinc-500 mt-0.5">{o.items[0]?.name} ({o.items.length} items)</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-500">GH₵ {o.total.toLocaleString()}</p>
                          <span className="text-[10px] font-bold text-zinc-400">{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Orders & Tracking Tab */}
            {activeTab === "orders" && (
              <div className="space-y-4 rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-brand-ink dark:text-white border-b border-black/5 dark:border-white/10 pb-4">Order History & Live Progress</h2>
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div key={o.id} className="rounded-2xl border border-black/5 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 p-5 space-y-3 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/5 dark:border-white/10 pb-3 gap-2">
                        <div>
                          <span className="font-mono font-bold text-brand-blue text-sm">{o.id}</span>
                          <p className="text-zinc-500 text-[11px] mt-0.5">Placed on {new Date(o.createdAt).toLocaleDateString("en-GB")}</p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500 border border-emerald-500/20">
                          {o.status}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {o.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-brand-ink dark:text-white">{item.name} x{item.quantity}</span>
                            <span className="font-bold text-emerald-500">GH₵ {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-black/5 dark:border-white/5 font-bold">
                        <span>Total Paid:</span>
                        <span className="text-brand-blue text-sm">GH₵ {o.total.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-brand-ink dark:text-white">Saved Wishlist Products</h2>
                {wishlistProducts.length > 0 ? (
                  <ProductGrid products={wishlistProducts} />
                ) : (
                  <div className="py-12 text-center text-xs text-zinc-500 rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900">
                    Your wishlist is currently empty. Browse our catalog to save items!
                  </div>
                )}
              </div>
            )}

            {/* Saved Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="space-y-4 rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-brand-ink dark:text-white border-b border-black/5 dark:border-white/10 pb-4">Saved Shipping & Billing Addresses</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-brand-blue/30 bg-brand-blue/5 p-4 text-xs space-y-1">
                    <span className="font-bold text-brand-blue text-[10px] uppercase">Default Primary Address</span>
                    <p className="font-bold text-brand-ink dark:text-white">House 24, East Legon</p>
                    <p className="text-zinc-500">Accra, Greater Accra Region, Ghana</p>
                    <p className="text-zinc-500">Phone: +233 20 445 1122</p>
                  </div>
                </div>
              </div>
            )}

            {/* Invoices & Downloads Tab */}
            {activeTab === "invoices" && (
              <div className="space-y-4 rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 shadow-sm text-xs">
                <h2 className="text-lg font-bold text-brand-ink dark:text-white border-b border-black/5 dark:border-white/10 pb-4">Invoices & Digital Receipts</h2>
                {orders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950">
                    <div>
                      <p className="font-bold font-mono text-brand-blue">{o.id}-INVOICE.pdf</p>
                      <p className="text-zinc-500 text-[11px]">{new Date(o.createdAt).toLocaleDateString("en-GB")} &bull; GH₵ {o.total.toLocaleString()}</p>
                    </div>
                    <Button variant="outline" className="h-9 px-3 text-xs font-bold">
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Download PDF
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6 rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 shadow-sm text-xs">
                <h2 className="text-lg font-bold text-brand-ink dark:text-white border-b border-black/5 dark:border-white/10 pb-4">Security & Authentication</h2>

                {passSaved && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-bold text-emerald-500 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Password updated successfully!
                  </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); setPassSaved(true); setTimeout(() => setPassSaved(false), 3000); }} className="space-y-3 max-w-md">
                  <div>
                    <label className="block font-semibold text-zinc-500 mb-1">Current Password</label>
                    <input type="password" required className="w-full h-10 rounded-xl border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 px-3 text-brand-ink dark:text-white" />
                  </div>
                  <div>
                    <label className="block font-semibold text-zinc-500 mb-1">New Password</label>
                    <input type="password" required className="w-full h-10 rounded-xl border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 px-3 text-brand-ink dark:text-white" />
                  </div>
                  <Button type="submit" className="h-10 px-5 text-xs font-bold bg-brand-blue text-white">Update Password</Button>
                </form>

                <div className="pt-6 border-t border-red-500/20 space-y-2">
                  <h3 className="font-bold text-red-500 text-sm">Danger Zone</h3>
                  <p className="text-zinc-500 text-xs">Permanently delete your customer account and data.</p>
                  <Button variant="outline" onClick={() => setDeleteModal(true)} className="h-9 border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs font-bold">
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Delete Account
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
