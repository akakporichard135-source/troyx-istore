"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Check,
  CheckCircle2,
  Clock,
  Upload,
  ArrowRight,
  ShieldCheck,
  Store,
  Building2,
  FileText,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { useVendorStore } from "@/context/vendor-store";
import { Button } from "@/components/ui/button";
import type { SubscriptionTier } from "@/types";

export default function SellerApplicationPage() {
  const searchParams = useSearchParams();
  const initialPlan = (searchParams?.get("plan") as SubscriptionTier) || "Business";
  
  const submitApplication = useVendorStore((state) => state.submitApplication);
  const plans = useVendorStore((state) => state.plans);

  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "Accra",
    country: "Ghana",
    category: "Apple & Tech Gadgets",
    description: "",
    logoUrl: "",
    bannerUrl: "",
    govIdUrl: "",
    taxNumber: "",
    website: "",
    socialInstagram: "",
    socialFacebook: "",
    socialX: "",
    selectedPlan: initialPlan as SubscriptionTier,
    agreedToTerms: false
  });

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.businessName || !formData.ownerName || !formData.email || !formData.phone || !formData.address) {
      setError("Please fill in all required business and owner contact information.");
      return;
    }

    if (!formData.agreedToTerms) {
      setError("You must agree to the Marketplace Terms to proceed.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const appId = submitApplication({
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        category: formData.category,
        description: formData.description || "Electronics & gadget merchant registered on TroyX iStore Marketplace.",
        logoUrl: formData.logoUrl || "/assets/product-device-blue.svg",
        bannerUrl: formData.bannerUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80",
        govIdUrl: formData.govIdUrl || "/uploads/docs/gov-id-sample.pdf",
        taxNumber: formData.taxNumber,
        website: formData.website,
        socialInstagram: formData.socialInstagram,
        socialFacebook: formData.socialFacebook,
        socialX: formData.socialX,
        selectedPlan: formData.selectedPlan,
        agreedToTerms: formData.agreedToTerms
      });
      setSubmitting(false);
      setSubmittedAppId(appId);
    }, 600);
  };

  // If application was submitted, show confirmation screen
  if (submittedAppId) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
        <div className="max-w-xl w-full rounded-3xl border border-white/10 bg-zinc-900/80 p-8 text-center backdrop-blur-2xl shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="h-8 w-8 animate-pulse" />
          </div>

          <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
            Status: Pending Approval
          </span>

          <h1 className="mt-4 text-3xl font-extrabold text-white">Application Received!</h1>
          <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
            Thank you for applying to sell on TroyX iStore Marketplace. Your seller application reference is:
          </p>
          <div className="mt-4 rounded-xl border border-white/10 bg-zinc-950 p-3 font-mono text-base font-bold text-brand-blue">
            {submittedAppId}
          </div>

          <div className="mt-6 text-left rounded-2xl border border-white/10 bg-zinc-950/60 p-4 text-xs text-zinc-300 space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-400">Business Name:</span>
              <span className="font-semibold text-white">{formData.businessName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Selected Plan:</span>
              <span className="font-semibold text-emerald-400">{formData.selectedPlan} Tier</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Contact Email:</span>
              <span className="text-white">{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Review Estimate:</span>
              <span className="text-amber-400 font-medium">Within 24 - 48 Hours</span>
            </div>
          </div>

          <p className="mt-6 text-xs text-zinc-400">
            Our compliance officer will verify your documents. You can access your vendor portal in demo mode or contact support.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/vendor" className="flex-1">
              <Button className="w-full h-11 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-sm">
                Open Vendor Dashboard Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full h-11 border-white/20 text-white hover:bg-white/10 text-sm">
                Return to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12 px-4 sm:px-6 lg:px-8 selection:bg-brand-blue">
      <div className="max-w-4xl mx-auto">
        {/* Top Header */}
        <div className="text-center">
          <Link href="/sell" className="inline-flex items-center gap-2 text-xs font-semibold text-brand-blue hover:underline mb-4">
            &larr; Back to Seller Overview
          </Link>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Register Your Merchant Store
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Complete the form below to start selling on Ghana's premium electronics marketplace.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="mt-10 space-y-8 rounded-3xl border border-white/10 bg-zinc-900/60 p-6 sm:p-10 backdrop-blur-xl">
          {error && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Business Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-lg font-bold text-white">
              <Building2 className="h-5 w-5 text-brand-blue" />
              <h2>1. Business Profile</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Business Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. iTech Ghana Store"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white placeholder-zinc-500 focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Owner / Representative Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kwame Mensah"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white placeholder-zinc-500 focus:border-brand-blue focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Business Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="sales@yourcompany.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white placeholder-zinc-500 focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Phone Number (Mobile Money) <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+233 24 000 0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white placeholder-zinc-500 focus:border-brand-blue focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Physical Store Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Street / Plaza address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white placeholder-zinc-500 focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white placeholder-zinc-500 focus:border-brand-blue focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Business Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white focus:border-brand-blue focus:outline-none"
              >
                <option value="Apple & Tech Gadgets">Apple & Tech Gadgets</option>
                <option value="Mobile Phones & Tablets">Mobile Phones & Tablets</option>
                <option value="Computers & Laptops">Computers & Laptops</option>
                <option value="Gaming & Consoles">Gaming & Consoles</option>
                <option value="Smart Accessories & Wearables">Smart Accessories & Wearables</option>
                <option value="Audio & Sound Equipment">Audio & Sound Equipment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Business Description</label>
              <textarea
                rows={3}
                placeholder="Tell customers about your products and company history..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-zinc-950 p-4 text-sm text-white placeholder-zinc-500 focus:border-brand-blue focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Store Branding & Identification */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-lg font-bold text-white">
              <Upload className="h-5 w-5 text-purple-400" />
              <h2>2. Branding & Compliance</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Store Logo Image URL</label>
                <input
                  type="text"
                  placeholder="https://... or leave empty for default"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="w-full h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white placeholder-zinc-500 focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Store Banner Image URL</label>
                <input
                  type="text"
                  placeholder="https://... or leave empty for default"
                  value={formData.bannerUrl}
                  onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                  className="w-full h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white placeholder-zinc-500 focus:border-brand-blue focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Government ID Document Link / Upload</label>
                <input
                  type="text"
                  placeholder="Ghana Card / Passport doc link"
                  value={formData.govIdUrl}
                  onChange={(e) => setFormData({ ...formData, govIdUrl: e.target.value })}
                  className="w-full h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white placeholder-zinc-500 focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Tax Number (TIN - Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. TIN-GH-00112233"
                  value={formData.taxNumber}
                  onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                  className="w-full h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white placeholder-zinc-500 focus:border-brand-blue focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Website (Optional)</label>
                <input
                  type="url"
                  placeholder="https://yourstore.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white placeholder-zinc-500 focus:border-brand-blue focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Instagram URL</label>
                <input
                  type="text"
                  placeholder="https://instagram.com/..."
                  value={formData.socialInstagram}
                  onChange={(e) => setFormData({ ...formData, socialInstagram: e.target.value })}
                  className="w-full h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white placeholder-zinc-500 focus:border-brand-blue focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Facebook / X URL</label>
                <input
                  type="text"
                  placeholder="https://facebook.com/..."
                  value={formData.socialFacebook}
                  onChange={(e) => setFormData({ ...formData, socialFacebook: e.target.value })}
                  className="w-full h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white placeholder-zinc-500 focus:border-brand-blue focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Select Subscription Plan */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-lg font-bold text-white">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <h2>3. Select Subscription Plan</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setFormData({ ...formData, selectedPlan: plan.id })}
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    formData.selectedPlan === plan.id
                      ? "border-brand-blue bg-brand-blue/15 text-white"
                      : "border-white/10 bg-zinc-950 text-zinc-400 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{plan.name}</span>
                    {formData.selectedPlan === plan.id && (
                      <CheckCircle2 className="h-4 w-4 text-brand-blue" />
                    )}
                  </div>
                  <p className="mt-2 text-xl font-extrabold text-white">GH₵ {plan.priceMonthly}<span className="text-xs font-normal text-zinc-400">/mo</span></p>
                  <p className="mt-1 text-[11px] text-zinc-400">
                    {plan.maxProducts === -1 ? "Unlimited" : plan.maxProducts} max products | {plan.commissionRate}% comm.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Terms & Submission */}
          <div className="pt-4 border-t border-white/10 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={formData.agreedToTerms}
                onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-zinc-950 text-brand-blue focus:ring-brand-blue"
              />
              <span className="text-xs text-zinc-300 leading-relaxed">
                I agree to the <Link href="/terms" className="text-brand-blue underline">TroyX Marketplace Seller Agreement</Link>, commission policy, and confirm that all listed electronics are genuine and legally sourced.
              </span>
            </label>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 text-base font-bold bg-brand-blue hover:bg-brand-blue/90 text-white shadow-lg shadow-brand-blue/20"
            >
              {submitting ? "Submitting Application..." : "Submit Seller Registration Application"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
