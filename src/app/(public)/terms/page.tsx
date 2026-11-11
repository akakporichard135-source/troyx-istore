import React from "react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Terms & Conditions</h1>
        <p className="text-xs text-zinc-500">Last updated: November 2026</p>

        <div className="space-y-4 text-xs sm:text-sm text-zinc-400 leading-relaxed">
          <p>
            Welcome to TroyX iStore. By accessing this platform or completing purchases with our
            store, you agree to comply with the terms and guidelines detailed below.
          </p>

          <h2 className="text-base font-semibold text-white pt-4">1. Business Identity</h2>
          <p>
            TroyX iStore is an independent electronics retailer situated in Bawaleshie, East Legon,
            Accra, Ghana. We specialize in original Apple hardware. We do not claim Apple-authorized
            reseller status. Apple, iPhone, Mac, iPad, Apple Watch, and AirPods are registered
            trademarks of Apple Inc.
          </p>

          <h2 className="text-base font-semibold text-white pt-4">2. Pricing and Currency</h2>
          <p>
            All prices displayed on this website are denominated in Ghana cedi (GH₵). While we
            endeavor to maintain exact catalog pricing, we reserve the right to rectify accidental
            typographical discrepancies prior to order fulfillment.
          </p>

          <h2 className="text-base font-semibold text-white pt-4">3. Device Condition</h2>
          <p>
            Products are clearly cataloged as “Brand New”, “Open Box”, “Refurbished”, or
            “Pre-Owned”. Each classification carries specific warranty terms detailed at point of
            sale.
          </p>
        </div>
      </div>
    </div>
  );
}
