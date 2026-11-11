import React from "react";
import { Truck, ShieldCheck, Clock, MapPin } from "lucide-react";

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="py-16 sm:py-24 px-4 sm:px-6 text-center border-b border-zinc-900 bg-zinc-950">
        <div className="max-w-2xl mx-auto space-y-3">
          <p className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
            Fulfillment Services
          </p>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
            Delivery Information
          </h1>
          <p className="text-sm text-zinc-400">
            Secure, rapid delivery throughout Greater Accra and across Ghana.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-3">
            <MapPin className="w-6 h-6 text-blue-500" />
            <h2 className="text-lg font-semibold text-white">In-Store Pickup (Free)</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Pick up your reserved Apple device at our Bawaleshie, East Legon showroom immediately
              after confirmation. Inspect the device, test features, and complete payment in person.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-3">
            <Truck className="w-6 h-6 text-blue-500" />
            <h2 className="text-lg font-semibold text-white">Same-Day Greater Accra Delivery</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Standard delivery across Accra (East Legon, Airport, Cantonments, Osu, Madina, Spintex,
              Dzorwulu, Tema) within 2 to 5 hours for GH₵ 50.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span>Regional Deliveries Across Ghana</span>
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Deliveries outside Accra (Kumasi, Takoradi, Sunyani, Tamale, Cape Coast) are fulfilled via
            trusted insured VIP courier services within 24 to 48 hours. Tracking details and driver
            contact information are provided directly via WhatsApp.
          </p>
        </div>
      </section>
    </div>
  );
}
