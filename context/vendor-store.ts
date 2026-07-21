"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Vendor,
  VendorPlan,
  SellerApplication,
  StoreReview,
  PayoutRequest,
  Advertisement,
  VendorStatus,
  SubscriptionTier,
  Product
} from "@/types";
import {
  initialVendors,
  initialVendorPlans,
  initialSellerApplications,
  initialStoreReviews,
  initialPayoutRequests,
  initialAdvertisements
} from "@/database/vendors";

interface VendorState {
  activeVendorId: string;
  vendors: Vendor[];
  plans: VendorPlan[];
  applications: SellerApplication[];
  reviews: StoreReview[];
  payouts: PayoutRequest[];
  advertisements: Advertisement[];

  // Vendor session
  setActiveVendorId: (id: string) => void;

  // Seller applications
  submitApplication: (app: Omit<SellerApplication, "id" | "status" | "createdAt">) => string;
  approveApplication: (appId: string) => void;
  rejectApplication: (appId: string, reason: string) => void;

  // Vendor administration
  updateVendorStatus: (vendorId: string, status: VendorStatus) => void;
  updateVendorProfile: (vendorId: string, updates: Partial<Vendor>) => void;
  toggleFeaturedVendor: (vendorId: string) => void;
  deleteVendor: (vendorId: string) => void;

  // Subscription plans management (Admin)
  updatePlan: (planId: SubscriptionTier, updates: Partial<VendorPlan>) => void;

  // Financials & Payouts
  requestPayout: (vendorId: string, amount: number, paymentMethod: PayoutRequest["paymentMethod"], accountDetails: string) => void;
  updatePayoutStatus: (payoutId: string, status: PayoutRequest["status"], adminNotes?: string) => void;

  // Reviews
  addStoreReview: (review: Omit<StoreReview, "id" | "date">) => void;

  // Ads
  addAdvertisement: (ad: Omit<Advertisement, "id">) => void;
  toggleAdvertisement: (adId: string) => void;
}

export const useVendorStore = create<VendorState>()(
  persist(
    (set, get) => ({
      activeVendorId: "v-itech-ghana", // default vendor session for seller dashboard
      vendors: initialVendors,
      plans: initialVendorPlans,
      applications: initialSellerApplications,
      reviews: initialStoreReviews,
      payouts: initialPayoutRequests,
      advertisements: initialAdvertisements,

      setActiveVendorId: (id) => set({ activeVendorId: id }),

      submitApplication: (appData) => {
        const id = `app-${Date.now()}`;
        const newApp: SellerApplication = {
          ...appData,
          id,
          status: "Pending",
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          applications: [newApp, ...state.applications]
        }));
        return id;
      },

      approveApplication: (appId) => {
        const app = get().applications.find((a) => a.id === appId);
        if (!app) return;

        const slug = app.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const newVendor: Vendor = {
          id: `v-${Date.now()}`,
          slug,
          name: app.businessName,
          ownerName: app.ownerName,
          email: app.email,
          phone: app.phone,
          address: app.address,
          city: app.city,
          country: app.country,
          category: app.category,
          description: app.description,
          logoUrl: app.logoUrl || "/assets/product-device-blue.svg",
          bannerUrl: app.bannerUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80",
          isVerified: true,
          isFlagship: false,
          rating: 5.0,
          reviewCount: 0,
          productCount: 0,
          salesCount: 0,
          totalRevenue: 0,
          walletBalance: 0,
          status: "Approved",
          planId: app.selectedPlan,
          govIdUrl: app.govIdUrl,
          taxNumber: app.taxNumber,
          website: app.website,
          socialLinks: {
            instagram: app.socialInstagram,
            facebook: app.socialFacebook,
            x: app.socialX
          },
          createdAt: new Date().toISOString()
        };

        set((state) => ({
          applications: state.applications.map((a) => (a.id === appId ? { ...a, status: "Approved" as VendorStatus } : a)),
          vendors: [newVendor, ...state.vendors],
          activeVendorId: newVendor.id
        }));
      },

      rejectApplication: (appId, reason) => {
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === appId ? { ...a, status: "Rejected" as VendorStatus, rejectionReason: reason } : a
          )
        }));
      },

      updateVendorStatus: (vendorId, status) => {
        set((state) => ({
          vendors: state.vendors.map((v) => (v.id === vendorId ? { ...v, status } : v))
        }));
      },

      updateVendorProfile: (vendorId, updates) => {
        set((state) => ({
          vendors: state.vendors.map((v) => (v.id === vendorId ? { ...v, ...updates } : v))
        }));
      },

      toggleFeaturedVendor: (vendorId) => {
        set((state) => ({
          vendors: state.vendors.map((v) => (v.id === vendorId ? { ...v, featuredOnHomepage: !v.featuredOnHomepage } : v))
        }));
      },

      deleteVendor: (vendorId) => {
        set((state) => ({
          vendors: state.vendors.filter((v) => v.id !== vendorId)
        }));
      },

      updatePlan: (planId, updates) => {
        set((state) => ({
          plans: state.plans.map((p) => (p.id === planId ? { ...p, ...updates } : p))
        }));
      },

      requestPayout: (vendorId, amount, paymentMethod, accountDetails) => {
        const vendor = get().vendors.find((v) => v.id === vendorId);
        if (!vendor || amount > vendor.walletBalance) return;

        const newPayout: PayoutRequest = {
          id: `po-${Date.now()}`,
          vendorId,
          vendorName: vendor.name,
          amount,
          paymentMethod,
          accountDetails,
          status: "Pending",
          createdAt: new Date().toISOString()
        };

        set((state) => ({
          payouts: [newPayout, ...state.payouts],
          vendors: state.vendors.map((v) => (v.id === vendorId ? { ...v, walletBalance: v.walletBalance - amount } : v))
        }));
      },

      updatePayoutStatus: (payoutId, status, adminNotes) => {
        set((state) => ({
          payouts: state.payouts.map((p) =>
            p.id === payoutId
              ? {
                  ...p,
                  status,
                  adminNotes: adminNotes || p.adminNotes,
                  processedAt: status === "Paid" || status === "Approved" ? new Date().toISOString() : p.processedAt
                }
              : p
          )
        }));
      },

      addStoreReview: (rev) => {
        const newReview: StoreReview = {
          ...rev,
          id: `rev-${Date.now()}`,
          date: new Date().toISOString().split("T")[0]
        };

        set((state) => {
          const vendorReviews = [...state.reviews.filter((r) => r.vendorId === rev.vendorId), newReview];
          const avgRating = vendorReviews.reduce((sum, r) => sum + r.rating, 0) / vendorReviews.length;

          return {
            reviews: [newReview, ...state.reviews],
            vendors: state.vendors.map((v) =>
              v.id === rev.vendorId
                ? {
                    ...v,
                    rating: Number(avgRating.toFixed(1)),
                    reviewCount: v.reviewCount + 1
                  }
                : v
            )
          };
        });
      },

      addAdvertisement: (adData) => {
        const newAd: Advertisement = {
          ...adData,
          id: `ad-${Date.now()}`
        };
        set((state) => ({
          advertisements: [newAd, ...state.advertisements]
        }));
      },

      toggleAdvertisement: (adId) => {
        set((state) => ({
          advertisements: state.advertisements.map((a) => (a.id === adId ? { ...a, active: !a.active } : a))
        }));
      }
    }),
    {
      name: "troyx-vendor-store"
    }
  )
);
