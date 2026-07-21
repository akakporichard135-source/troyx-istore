"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Zap,
  TrendingUp,
  Store,
  DollarSign,
  BarChart3,
  Globe,
  HelpCircle,
  Sparkles,
  ChevronDown,
  Building2,
  Users
} from "lucide-react";
import { useVendorStore } from "@/context/vendor-store";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "How long does the store approval process take?",
    a: "Our compliance team reviews seller applications within 24 to 48 hours. Once approved, your seller dashboard is unlocked immediately."
  },
  {
    q: "How do I receive payments for my sales?",
    a: "Payouts are automatically deposited into your registered Mobile Money (MTN / Telecel) or Ghanaian Bank Account according to your plan schedule."
  },
  {
    q: "Can I sell non-Apple products on TroyX Marketplace?",
    a: "Yes! While TroyX iStore Flagship handles official Apple hardware, verified sellers can list certified electronics, gaming consoles, smart accessories, gadgets, and audio equipment."
  },
  {
    q: "What documents are required to register?",
    a: "You need a valid Government ID (Ghana Card or Passport), business contact details, store branding images, and an optional Business Registration Tax Number (TIN)."
  }
];

export default function OpenStoreLandingPage() {
  const plans = useVendorStore((state) => state.plans);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-brand-blue selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-zinc-900/80 via-zinc-950 to-zinc-950 pb-20 pt-16">
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand-blue/15 blur-[120px]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-brand-blue backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>TroyX Seller Marketplace 2026</span>
          </div>

          <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Become a Seller on <span className="bg-gradient-to-r from-brand-blue via-indigo-400 to-purple-400 bg-clip-text text-transparent">TroyX iStore</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-zinc-300">
                Grow your tech business across Ghana. Reach thousands of eager shoppers, enjoy instant store trust, secure Mobile Money payouts, and powerful seller analytics.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/sell/apply">
                  <Button className="h-12 px-8 text-base font-bold shadow-lg shadow-brand-blue/20">
                    Open Your Store
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#pricing">
                  <Button variant="outline" className="h-12 border-white/20 bg-white/5 px-6 text-base font-semibold text-white hover:bg-white/10">
                    View Pricing Plans
                  </Button>
                </a>
              </div>

              {/* Key Features Badges */}
              <div className="mt-10 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <span className="text-xs font-medium text-zinc-300">Secure Payments</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Zap className="h-5 w-5 text-amber-400" />
                  <span className="text-xs font-medium text-zinc-300">Fast 24h Approval</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="h-5 w-5 text-brand-blue" />
                  <span className="text-xs font-medium text-zinc-300">Pro Dashboard</span>
                </div>
              </div>
            </div>

            {/* Glassmorphism Hero Showcase */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-3xl border border-white/15 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-blue to-purple-600 font-bold text-white">
                      TX
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-white">Merchant Seller Portal</h2>
                      <p className="text-xs text-zinc-400">Accra, Kumasi & Takoradi Network</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                    Active Verified
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
                    <p className="text-xs text-zinc-400">Monthly Sales</p>
                    <p className="mt-1 text-2xl font-bold text-white">GH₵ 86,500</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                      <TrendingUp className="h-3 w-3" /> +28% this month
                    </span>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
                    <p className="text-xs text-zinc-400">Active Products</p>
                    <p className="mt-1 text-2xl font-bold text-white">42 Listed</p>
                    <span className="mt-2 text-[11px] text-zinc-400">Limit: 250 (Business)</span>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-amber-400" />
                      <div>
                        <p className="text-sm font-medium text-white">Next Mobile Money Payout</p>
                        <p className="text-xs text-zinc-400">Scheduled for Friday, 10:00 AM</p>
                      </div>
                    </div>
                    <span className="text-base font-bold text-emerald-400">GH₵ 12,400</span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link href="/sell/apply">
                    <span className="text-xs font-medium text-brand-blue hover:underline">
                      Join 150+ Merchants Selling Today &rarr;
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Why Top Electronics Merchants Choose TroyX
            </h2>
            <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
              Everything you need to launch, manage, and scale your storefront across Ghana with total peace of mind.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-8 transition hover:border-brand-blue/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">Instant Flagship Trust</h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Leverage TroyX iStore's brand reputation. Buyers trust our verified badge, leading to significantly higher conversion rates.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-8 transition hover:border-brand-blue/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <DollarSign className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">Automated Payouts</h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Receive earnings directly to MTN Mobile Money, Telecel Cash, or bank accounts. Transparency with zero hidden charges.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-8 transition hover:border-brand-blue/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">Real-Time Analytics</h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Track views, order fulfillment, stock alerts, and customer inquiries with our high-speed merchant dashboard.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-8 transition hover:border-brand-blue/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">Custom Public Storefront</h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Get your own branded URL (e.g. troyxistore.com/store/your-name) with banner customization and direct customer messaging.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-8 transition hover:border-brand-blue/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">Dedicated Seller Support</h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Our seller support team based in Accra assists you with product uploads, stock management, and dispute resolution.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-8 transition hover:border-brand-blue/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400">
                <Store className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">Multi-Location Coverage</h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Whether your shop is in Accra, Kumasi, Tema, or Takoradi, reach customers in all 16 regions of Ghana.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 border-t border-white/10 bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Transparent Merchant Pricing Plans
            </h2>
            <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
              Choose the right tier for your product catalog size. All plans include full seller dashboard access.
            </p>

            {/* Billing Switcher */}
            <div className="mt-8 inline-flex items-center rounded-full border border-white/10 bg-zinc-900 p-1.5">
              <button
                type="button"
                className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                  billingCycle === "monthly" ? "bg-brand-blue text-white" : "text-zinc-400 hover:text-white"
                }`}
                onClick={() => setBillingCycle("monthly")}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                  billingCycle === "yearly" ? "bg-brand-blue text-white" : "text-zinc-400 hover:text-white"
                }`}
                onClick={() => setBillingCycle("yearly")}
              >
                Annual Billing (Save 17%)
              </button>
            </div>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => {
              const price = billingCycle === "monthly" ? plan.priceMonthly : Math.round(plan.priceYearly / 12);
              const isPopular = plan.id === "Business";

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col justify-between rounded-3xl border p-8 transition ${
                    isPopular
                      ? "border-brand-blue bg-gradient-to-b from-brand-blue/15 via-zinc-900 to-zinc-900 shadow-2xl shadow-brand-blue/10"
                      : "border-white/10 bg-zinc-900/50 hover:border-white/20"
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-blue px-3 py-1 text-[11px] font-bold tracking-wider text-white uppercase shadow-md">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    <p className="mt-2 text-xs text-zinc-400">
                      {plan.id === "Starter" && "Ideal for new merchants & boutiques"}
                      {plan.id === "Business" && "Perfect for established electronics stores"}
                      {plan.id === "Enterprise" && "For high-volume distributors & chain stores"}
                    </p>

                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-white">GH₵ {price}</span>
                      <span className="text-sm text-zinc-400">/ month</span>
                    </div>
                    {billingCycle === "yearly" && (
                      <span className="mt-1 block text-xs text-emerald-400 font-medium">Billed annually (GH₵ {plan.priceYearly}/yr)</span>
                    )}

                    <div className="mt-6 space-y-2 border-t border-white/10 pt-6 text-xs text-zinc-300">
                      <div className="flex items-center justify-between font-medium">
                        <span>Max Listed Products:</span>
                        <span className="text-white font-bold">{plan.maxProducts === -1 ? "Unlimited" : plan.maxProducts}</span>
                      </div>
                      <div className="flex items-center justify-between font-medium">
                        <span>Marketplace Commission:</span>
                        <span className="text-emerald-400 font-bold">{plan.commissionRate}%</span>
                      </div>
                      <div className="flex items-center justify-between font-medium">
                        <span>Support Level:</span>
                        <span className="text-white">{plan.supportLevel}</span>
                      </div>
                    </div>

                    <ul className="mt-6 space-y-3 text-xs text-zinc-300">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <Link href={`/sell/apply?plan=${plan.id}`}>
                      <Button
                        className={`w-full h-11 text-sm font-bold ${
                          isPopular
                            ? "bg-brand-blue hover:bg-brand-blue/90 text-white"
                            : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                        }`}
                      >
                        Choose {plan.name} Plan
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Onboarding Steps */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Start Selling in 4 Simple Steps
            </h2>
            <p className="mt-4 text-zinc-400">Fast onboarding designed for Ghanaian merchants.</p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative rounded-3xl border border-white/10 bg-zinc-900/40 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-blue/20 text-brand-blue font-bold text-lg">1</span>
              <h3 className="mt-4 text-lg font-bold text-white">Apply Online</h3>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Fill out the seller registration form with your store branding and business details in under 5 minutes.
              </p>
            </div>

            <div className="relative rounded-3xl border border-white/10 bg-zinc-900/40 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 font-bold text-lg">2</span>
              <h3 className="mt-4 text-lg font-bold text-white">Fast Review</h3>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Our verification team reviews your documents within 24-48 hours to grant Verified Seller status.
              </p>
            </div>

            <div className="relative rounded-3xl border border-white/10 bg-zinc-900/40 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400 font-bold text-lg">3</span>
              <h3 className="mt-4 text-lg font-bold text-white">List Products</h3>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Upload product photos, set prices, conditions, stock levels, and customize your public storefront.
              </p>
            </div>

            <div className="relative rounded-3xl border border-white/10 bg-zinc-900/40 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 font-bold text-lg">4</span>
              <h3 className="mt-4 text-lg font-bold text-white">Earn & Withdraw</h3>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Receive orders from across Ghana and withdraw your earnings straight to Mobile Money or bank account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 border-t border-white/10 bg-zinc-900/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="mt-2 text-sm text-zinc-400">Everything you need to know about selling on TroyX.</p>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-zinc-900/60 overflow-hidden transition"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-white hover:bg-white/5"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="h-4 w-4 text-brand-blue shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-zinc-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/sell/apply">
              <Button className="h-12 px-8 text-base font-bold bg-brand-blue hover:bg-brand-blue/90 text-white">
                Start Seller Registration Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
