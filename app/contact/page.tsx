import type { Metadata } from "next";
import { Mail, MapPin, Phone, MessageCircle, Clock, Navigation, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Showroom Location",
  description: "Visit TroyX iStore flagship showroom in Accra or contact our tech support team."
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact & Showroom"
        title="Get in Touch with TroyX iStore"
        description="Visit our flagship showroom in Accra or message our team for device inquiries, repair bookings, and sales."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left Column: Contact Methods & Hours */}
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-4 rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                <Phone className="h-6 w-6 text-brand-blue mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase text-zinc-400">Phone Support</p>
                  <p className="font-bold text-brand-ink dark:text-white mt-1 text-xs">{siteConfig.phone}</p>
                  <p className="text-xs text-zinc-500">{siteConfig.phoneAlt}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                <Mail className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase text-zinc-400">Email Inquiry</p>
                  <p className="font-bold text-brand-ink dark:text-white mt-1 text-xs">{siteConfig.email}</p>
                  <p className="text-xs text-zinc-500">Fast 2-hour response</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Chat Action */}
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white font-bold">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-brand-ink dark:text-white">Instant WhatsApp Chat</h3>
                    <p className="text-xs text-emerald-400">Speak directly with an Apple specialist</p>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${siteConfig.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-emerald-500 hover:bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition shadow-md"
                >
                  Chat Now
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="rounded-3xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-zinc-900 shadow-sm">
              <h3 className="font-bold text-sm text-brand-ink dark:text-white mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                Showroom Operating Hours
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                  <span className="text-zinc-500">Monday - Friday</span>
                  <span className="font-bold text-brand-ink dark:text-white">8:30 AM - 6:30 PM</span>
                </div>
                <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                  <span className="text-zinc-500">Saturday</span>
                  <span className="font-bold text-brand-ink dark:text-white">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Sunday</span>
                  <span className="font-bold text-amber-500">Closed (Online Orders Active)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <form className="space-y-4 rounded-3xl border border-black/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-brand-ink dark:text-white">Send Us a Direct Message</h2>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Full Name</label>
              <Input placeholder="e.g. Abena Mensah" className="h-11 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Email Address</label>
              <Input type="email" placeholder="your@email.com" className="h-11 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Subject</label>
              <Input placeholder="Product availability, repair, trade-in..." className="h-11 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Message</label>
              <Textarea placeholder="Tell us more about how we can assist you..." className="min-h-28 rounded-xl text-xs" />
            </div>
            <Button type="submit" className="w-full h-11 text-xs font-bold bg-brand-blue text-white hover:bg-brand-blue/90">
              Submit Message
            </Button>
          </form>
        </div>
      </Section>

      {/* Showroom & Interactive Google Maps Embed */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl">
          <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
            <div className="space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-blue">
                Flagship Experience Showroom
              </span>
              <h2 className="text-3xl font-black text-brand-ink dark:text-white">
                Spintex Road & East Legon Flagships
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Step inside Accra's premier Apple and gaming destination. Test-drive the latest MacBook M3 series, experience iPhone 16 Pro Max displays, and explore certified accessories with direct technician guidance.
              </p>

              <div className="space-y-3 text-xs text-zinc-700 dark:text-zinc-300">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-brand-blue mt-0.5 shrink-0" />
                  <span>{siteConfig.address}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Navigation className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Free Customer Parking & Security Escort Available</span>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Spintex+Accra+Ghana"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-brand-ink dark:bg-white text-white dark:text-brand-ink px-6 py-3 text-xs font-bold shadow-md hover:opacity-90 transition"
              >
                <Navigation className="h-4 w-4" />
                Get Driving Directions
              </a>
            </div>

            {/* Google Maps iFrame Container */}
            <div className="h-80 lg:h-auto rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-zinc-800 relative">
              <iframe
                title="TroyX iStore Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.6273418528!2d-0.1264426!3d5.6219803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzcnMTkuMSJOIDDCsDA3JzM1LjIiVw!5e0!3m2!1sen!2sgh!4v1625000000000!5m2!1sen!2sgh"
                className="w-full h-full border-0 filter opacity-90 hover:opacity-100 transition"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
