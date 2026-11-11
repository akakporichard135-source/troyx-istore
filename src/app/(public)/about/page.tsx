import React from "react";
import Link from "next/link";
import { ShieldCheck, MapPin, Phone, Award } from "lucide-react";
import { getPublishedSections } from "@/lib/storage/db";
import SectionRenderer from "@/components/public/SectionRenderer";

export const revalidate = 0;

export default async function AboutPage() {
  const sections = await getPublishedSections("page-about");

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Dynamic CMS Sections if published */}
      {sections && sections.length > 0 && (
        <div className="w-full flex flex-col space-y-2 pb-6">
          {sections.map((sec) => (
            <SectionRenderer key={sec.id} section={sec} />
          ))}
        </div>
      )}

      {/* Hero */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 text-center border-b border-zinc-900 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
            About TroyX iStore
          </p>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white">
            Home of Original Apple Products.
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 font-light leading-relaxed">
            Founded with a commitment to authenticity and excellence, TroyX iStore is Accra’s premier
            destination for genuine Apple devices, backed by transparent battery health verification
            and comprehensive after-sales care.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-[#161617] border border-zinc-800 space-y-3">
            <ShieldCheck className="w-8 h-8 text-blue-500" />
            <h3 className="text-xl font-semibold text-white">Authenticity Guarantee</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Every iPhone, Mac, iPad, Watch, and accessory in our store is inspected for original
              components, clean serials, and uncompromised Apple hardware standards.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#161617] border border-zinc-800 space-y-3">
            <Award className="w-8 h-8 text-blue-500" />
            <h3 className="text-xl font-semibold text-white">Transparent Verification</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              We publish real battery health metrics and SIM configurations so you know exact device
              specifications before you invest.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#161617] border border-zinc-800 space-y-3">
            <MapPin className="w-8 h-8 text-blue-500" />
            <h3 className="text-xl font-semibold text-white">East Legon Showroom</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Visit us in person at Bawaleshie, East Legon, Accra to test devices hands-on or receive
              expert advice and personal setup assistance from our team.
            </p>
          </div>
        </div>

        {/* Location & Contact Callout */}
        <div className="mt-16 p-8 sm:p-12 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl font-semibold text-white">Visit Our Accra Showroom</h2>
            <p className="text-sm text-zinc-400">
              Bawaleshie, East Legon, Accra, Ghana • Mon–Sat: 9:00 AM – 7:00 PM
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/contact" className="apple-btn-primary text-xs">
              Get Directions & Contact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
