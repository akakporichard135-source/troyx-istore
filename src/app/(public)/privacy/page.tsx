import React from "react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Privacy Policy</h1>
        <p className="text-xs text-zinc-500">Last updated: November 2026</p>

        <div className="space-y-4 text-xs sm:text-sm text-zinc-400 leading-relaxed">
          <p>
            At TroyX iStore (“we,” “our,” or “us”), protecting your personal information is of paramount
            importance. This Privacy Policy outlines how we collect, handle, and protect your data
            when visiting our website or ordering devices from our Bawaleshie, East Legon showroom in
            Accra, Ghana.
          </p>

          <h2 className="text-base font-semibold text-white pt-4">1. Information We Collect</h2>
          <p>
            We collect contact details (full name, telephone number, email address, and delivery
            location) solely for the fulfillment of orders and inquiries submitted via our web forms
            or direct WhatsApp communication. We do not store sensitive payment card credentials.
          </p>

          <h2 className="text-base font-semibold text-white pt-4">2. Use of Information</h2>
          <p>
            Customer information is used strictly to process product orders, schedule showroom
            pickups, dispatch couriers, and provide warranty support. We never sell or lease personal
            data to third-party marketing entities.
          </p>

          <h2 className="text-base font-semibold text-white pt-4">3. Contact Inquiries</h2>
          <p>
            Questions regarding this privacy statement may be directed to our customer service desk at
            0207137437 or by visiting our showroom at Bawaleshie, East Legon, Accra.
          </p>
        </div>
      </div>
    </div>
  );
}
