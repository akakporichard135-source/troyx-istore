import type { Metadata } from "next";
import { Mail, MapPin, Phone, Instagram, Smartphone } from "lucide-react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { LinkButton } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { bannerImages } from "@/lib/images";

export const metadata: Metadata = { title: "Contact", description: "Contact TroyX iStore." };

const contactMethods: Array<[LucideIcon, string, string]> = [
  [Phone, siteConfig.phone, "Primary"],
  [Phone, siteConfig.phoneAlt || "0548974717", "Secondary"],
  [Mail, siteConfig.email, "Email"],
  [MapPin, siteConfig.address, "Location"]
];

export default function ContactPage() {
  return (
    <>
      <PageHeader 
        eyebrow="Contact" 
        title="Get in Touch with TroyX iStore" 
        description="We're here to help with product advice, orders, repairs, trade-ins, and everything Apple & Gaming." 
      />
      
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              {contactMethods.map(([Icon, text, label]) => (
                <div key={text} className="flex items-start gap-4 rounded-2xl border border-black/5 bg-white p-5 hover:shadow-md transition dark:border-white/10 dark:bg-white/5">
                  <Icon className="h-6 w-6 text-brand-blue mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-zinc-500">{label}</p>
                    <p className="font-semibold text-brand-ink dark:text-white mt-1">{text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media & Store Info */}
            <div className="rounded-2xl border border-black/5 bg-gradient-to-br from-blue-50 to-white p-6 dark:border-white/10 dark:from-white/5 dark:to-white/2.5">
              <h3 className="font-semibold text-brand-ink dark:text-white mb-4">Follow Us</h3>
              <div className="flex gap-3">
                <a href="https://www.tiktok.com/@troyx_istore" className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-sm hover:shadow-md transition dark:bg-white/10">
                  <Smartphone className="h-4 w-4" />
                  TikTok @troyx_istore
                </a>
              </div>
            </div>

            {/* Store Hours */}
            <div className="rounded-2xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-white/5">
              <h3 className="font-semibold text-brand-ink dark:text-white mb-4">Store Hours</h3>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between"><span className="text-zinc-600 dark:text-zinc-400">Monday - Friday</span> <span className="font-medium">9:00 AM - 6:00 PM</span></p>
                <p className="flex justify-between"><span className="text-zinc-600 dark:text-zinc-400">Saturday</span> <span className="font-medium">10:00 AM - 4:00 PM</span></p>
                <p className="flex justify-between"><span className="text-zinc-600 dark:text-zinc-400">Sunday</span> <span className="font-medium">Closed</span></p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className="space-y-4 rounded-2xl border border-black/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div>
              <label className="block text-sm font-semibold text-brand-ink dark:text-white mb-2">Full Name</label>
              <Input placeholder="Your name" className="h-11" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-ink dark:text-white mb-2">Email Address</label>
              <Input type="email" placeholder="your@email.com" className="h-11" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-ink dark:text-white mb-2">Subject</label>
              <Input placeholder="How can we help?" className="h-11" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-ink dark:text-white mb-2">Message</label>
              <Textarea placeholder="Tell us more about your inquiry..." className="min-h-32" />
            </div>
            <Button type="submit" className="w-full h-11">Send Message</Button>
          </form>
        </div>
      </Section>

      {/* Location Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 bg-white dark:bg-white/5">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Visit Our Showroom</p>
              <h2 className="mt-3 text-4xl font-bold text-brand-ink dark:text-white">Bawaleshie, East Legon</h2>
              <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Experience our premium showroom where you can see, test, and compare authentic Apple products and gaming consoles. Our expert team is ready to help you find exactly what you need.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-brand-blue mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-brand-ink dark:text-white">Address</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Bawaleshie, East Legon, Accra, Ghana</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-brand-blue mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-brand-ink dark:text-white">Call Us</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{siteConfig.phone}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{siteConfig.phoneAlt}</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <LinkButton href="/shop">Start Shopping</LinkButton>
              </div>
            </div>
            <div className="relative h-64 md:h-auto rounded-2xl overflow-hidden">
              <Image
                src={bannerImages.accessories}
                alt="TroyX iStore Showroom"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Section eyebrow="Frequently Asked" title="Common Questions" description="Find quick answers to your questions about our products and services.">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { q: "Do you offer same-day pickup?", a: "Yes! Orders placed before 1 PM can be picked up the same day from our Bawaleshie showroom." },
            { q: "What payment methods do you accept?", a: "We accept all major credit cards, mobile money (MTN, Vodafone, AirtelTigo), and bank transfers." },
            { q: "Do you offer warranty?", a: "Yes, all products come with a 12-month TroyX warranty covering manufacturing defects." },
            { q: "Can I trade in my old device?", a: "Absolutely! Visit our Trade-In page or call us for an instant valuation." },
            { q: "Do you repair devices?", a: "Yes, we provide repair and diagnostic services. Book an appointment on our Repair page." },
            { q: "Are all products genuine?", a: "100% authentic. All inventory is verified and documented with authenticity guarantees." }
          ].map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-white/5">
              <h3 className="font-semibold text-brand-ink dark:text-white">{item.q}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{item.a}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
