import React from "react";
import { Phone, MessageCircle, MapPin, Clock, Share2 } from "lucide-react";
import { getPublishedSections } from "@/lib/storage/db";
import SectionRenderer from "@/components/public/SectionRenderer";

export const revalidate = 0;

export default async function ContactPage() {
  const sections = await getPublishedSections("page-contact");

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

      <section className="py-16 sm:py-24 px-4 sm:px-6 text-center border-b border-zinc-900 bg-zinc-950">
        <div className="max-w-2xl mx-auto space-y-3">
          <p className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
            Contact & Location
          </p>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
            Connect with TroyX iStore
          </h1>
          <p className="text-sm text-zinc-400">
            Home of Original Apple Products in Bawaleshie, East Legon, Accra, Ghana.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
              <h2 className="text-lg font-semibold text-white">Direct Phone Lines</h2>
              <div className="space-y-3">
                <a
                  href="tel:0207137437"
                  className="flex items-center gap-3 text-sm text-zinc-300 hover:text-white p-3 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors"
                >
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span className="font-medium">0207137437</span>
                  <span className="text-xs text-zinc-500 ml-auto">Primary Line</span>
                </a>

                <a
                  href="tel:0548974717"
                  className="flex items-center gap-3 text-sm text-zinc-300 hover:text-white p-3 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors"
                >
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span className="font-medium">0548974717</span>
                  <span className="text-xs text-zinc-500 ml-auto">Secondary Line</span>
                </a>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
              <h2 className="text-lg font-semibold text-white">Instant Messaging & Social</h2>
              <div className="space-y-3">
                <a
                  href="https://wa.me/233207137437"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-sm text-zinc-300 hover:text-white p-3 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-medium">WhatsApp Customer Service</div>
                    <div className="text-xs text-zinc-500">+233 20 713 7437</div>
                  </div>
                </a>

                <a
                  href="https://tiktok.com/@troyx_istore"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-sm text-zinc-300 hover:text-white p-3 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors"
                >
                  <Share2 className="w-4 h-4 text-pink-400" />
                  <div>
                    <div className="font-medium">TikTok Channel</div>
                    <div className="text-xs text-zinc-500">@troyx_istore</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Showroom Location & Operating Hours */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span>Showroom Location</span>
              </h2>
              <div className="text-sm text-zinc-300 space-y-1">
                <p className="font-medium text-white">TroyX iStore</p>
                <p>Bawaleshie, East Legon</p>
                <p>Accra, Greater Accra Region, Ghana</p>
              </div>
              <div className="pt-2 text-xs text-zinc-500">
                Convenient pickup available for all confirmed orders.
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>Operating Hours</span>
              </h2>
              <div className="space-y-2 text-xs text-zinc-400">
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span>Monday – Friday</span>
                  <span className="text-white font-medium">9:00 AM – 7:00 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span>Saturday</span>
                  <span className="text-white font-medium">10:00 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Sunday</span>
                  <span className="text-zinc-500">By Appointment / WhatsApp Orders Only</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
