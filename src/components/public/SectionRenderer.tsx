"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  Cpu,
  Camera,
  Battery,
  Smartphone,
  Wifi,
  Sparkles,
  ChevronDown,
  Check,
  Play,
  Pause,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  Layers,
  ArrowRight,
  Maximize2,
} from "lucide-react";
import { PageSection } from "@/lib/types";

interface SectionRendererProps {
  section: PageSection;
  priority?: boolean;
}

export default function SectionRenderer({ section, priority }: SectionRendererProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Autoplay handling respecting reduced-motion
  useEffect(() => {
    if (videoRef.current && (section.mediaType === "video" || section.mediaType === "both")) {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else if (section.config?.videoAutoplay !== false) {
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [section]);

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const isDark =
    section.theme === "dark" ||
    (!section.theme && (section.backgroundColor === "#000000" || !section.backgroundColor));
  const bgClass = section.backgroundColor ? "" : isDark ? "bg-[#000000]" : "bg-[#ffffff]";
  const textClass = section.textColor ? "" : isDark ? "text-[#f5f5f7]" : "text-[#1d1d1f]";

  const textAlignClass =
    section.textAlignment === "left"
      ? "text-left items-start"
      : section.textAlignment === "right"
      ? "text-right items-end"
      : "text-center items-center";

  const paddingYClass =
    section.config?.paddingTop === "small"
      ? "py-8 sm:py-12"
      : section.config?.paddingTop === "none"
      ? "py-0"
      : "py-16 sm:py-24";

  const inlineStyles: React.CSSProperties = {
    backgroundColor: section.backgroundColor || (isDark ? "#000000" : "#ffffff"),
    color: section.textColor || (isDark ? "#f5f5f7" : "#1d1d1f"),
  };

  // 1. SPLIT STORY / IMAGE & TEXT SPLIT
  if (section.sectionType === "split_story" || section.sectionType === "video_story") {
    return (
      <section id={section.id} className={`w-full overflow-hidden ${bgClass} ${textClass} ${paddingYClass}`} style={inlineStyles}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className={`space-y-4 ${textAlignClass}`}>
              {section.tagline && (
                <p className="text-xs uppercase tracking-widest font-semibold text-blue-500">
                  {section.tagline}
                </p>
              )}
              {section.title && (
                <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight">
                  {section.title}
                </h2>
              )}
              {section.subtitle && (
                <p className={`text-base sm:text-xl font-normal leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                  {section.subtitle}
                </p>
              )}
              {(section.learnMoreUrl || section.buyUrl) && (
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  {section.learnMoreUrl && (
                    <Link
                      href={section.learnMoreUrl}
                      className="inline-flex items-center gap-1 text-sm font-normal text-blue-500 hover:text-blue-400"
                    >
                      <span>{section.learnMoreText || "Learn more"}</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                  {section.buyUrl && (
                    <Link href={section.buyUrl} className="apple-btn-primary text-xs py-2 px-4">
                      <span>{section.buyText || "Buy"}</span>
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="relative rounded-3xl overflow-hidden bg-black/40 border border-zinc-800 aspect-[4/3] flex items-center justify-center">
              {section.desktopVideoUrl ? (
                <video
                  src={section.desktopVideoUrl}
                  poster={section.posterImageUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : section.desktopImageUrl ? (
                <img
                  src={section.desktopImageUrl}
                  alt={section.title || section.draftLabel}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-zinc-600 text-xs">Media Pending</div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 2. FEATURE HIGHLIGHTS / SHOWCASE
  if (section.sectionType === "feature_showcase") {
    const features = section.config?.features || [
      { title: "Supercharged Performance", description: "Pro-tier silicon architecture built for extreme battery efficiency." },
      { title: "Cinematic 4K Imaging", description: "Studio-grade sensor stabilization and computational photonics." },
      { title: "Aerospace Titanium", description: "Featherweight luxury alloy designed for unmatched durability." },
    ];

    return (
      <section id={section.id} className={`w-full ${bgClass} ${textClass} ${paddingYClass}`} style={inlineStyles}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className={`space-y-3 max-w-2xl mx-auto ${textAlignClass}`}>
            {section.tagline && (
              <p className="text-xs uppercase tracking-widest font-semibold text-blue-500">
                {section.tagline}
              </p>
            )}
            {section.title && (
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">
                {section.title}
              </h2>
            )}
            {section.subtitle && (
              <p className={`text-sm sm:text-base ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                {section.subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <div key={i} className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 text-blue-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 3. TECHNICAL SPECIFICATIONS
  if (section.sectionType === "tech_specs") {
    const specs = section.config?.specs || [
      { label: "Display", value: "Super Retina XDR with ProMotion up to 120Hz" },
      { label: "Chipset", value: "Apple Silicon with 16-core Neural Engine" },
      { label: "Camera", value: "48MP Main Fusion Camera with 5x Telephoto" },
      { label: "Battery", value: "All-day battery life with fast MagSafe charging" },
      { label: "Finish", value: "Grade 5 Titanium with textured matte glass" },
    ];

    return (
      <section id={section.id} className={`w-full ${bgClass} ${textClass} ${paddingYClass}`} style={inlineStyles}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className={`space-y-2 ${textAlignClass}`}>
            {section.tagline && (
              <p className="text-xs uppercase tracking-widest font-semibold text-blue-500">{section.tagline}</p>
            )}
            {section.title && (
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">{section.title}</h2>
            )}
          </div>

          <div className="divide-y divide-zinc-800 border-y border-zinc-800">
            {specs.map((spec, i) => (
              <div key={i} className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-baseline">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{spec.label}</div>
                <div className="sm:col-span-2 text-sm text-zinc-200">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 4. COMPARISON TABLE
  if (section.sectionType === "comparison_table") {
    const items = section.config?.comparisonItems || [
      { name: "Pro Max", tag: "The ultimate iPhone", specs: { Display: "6.9-inch", Chip: "A18 Pro", Battery: "33 hrs" } },
      { name: "Pro", tag: "Pro powerhouse", specs: { Display: "6.3-inch", Chip: "A18 Pro", Battery: "27 hrs" } },
      { name: "Base", tag: "Total powerhouse", specs: { Display: "6.1-inch", Chip: "A18", Battery: "22 hrs" } },
    ];

    return (
      <section id={section.id} className={`w-full ${bgClass} ${textClass} ${paddingYClass}`} style={inlineStyles}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className={`space-y-2 text-center`}>
            {section.tagline && <p className="text-xs uppercase tracking-widest font-semibold text-blue-500">{section.tagline}</p>}
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">{section.title || "Compare Models"}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <div key={i} className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 text-center space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">{item.name}</h3>
                  <p className="text-xs text-blue-400">{item.tag}</p>
                </div>
                <div className="border-t border-zinc-800 pt-4 space-y-3 text-xs">
                  {Object.entries(item.specs || {}).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-zinc-300">
                      <span className="text-zinc-500">{k}:</span>
                      <span className="font-medium text-white">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 5. IMAGE CAROUSEL
  if (section.sectionType === "image_carousel") {
    const slides = section.config?.galleryImages || (section.desktopImageUrl ? [{ url: section.desktopImageUrl }] : []);

    return (
      <section id={section.id} className={`w-full ${bgClass} ${textClass} ${paddingYClass}`} style={inlineStyles}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              {section.tagline && <p className="text-xs uppercase tracking-widest font-semibold text-blue-500">{section.tagline}</p>}
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{section.title || "Showcase Gallery"}</h2>
            </div>
            {slides.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCarouselIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
                  className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCarouselIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0))}
                  className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-black border border-zinc-800 relative">
            {slides[carouselIndex]?.url ? (
              <img
                src={slides[carouselIndex].url}
                alt={slides[carouselIndex].alt || "Showcase"}
                className="w-full h-full object-cover transition-all duration-500"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-600 text-xs">No media in carousel</div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // 6. PRODUCT PHOTOGRAPHY GALLERY / FULL GALLERY
  if (section.sectionType === "media_gallery" || section.sectionType === "full_gallery") {
    const gallery = section.config?.galleryImages || (section.desktopImageUrl ? [{ url: section.desktopImageUrl }] : []);

    return (
      <section id={section.id} className={`w-full ${bgClass} ${textClass} ${paddingYClass}`} style={inlineStyles}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className={`space-y-2 ${textAlignClass}`}>
            {section.tagline && <p className="text-xs uppercase tracking-widest font-semibold text-blue-500">{section.tagline}</p>}
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">{section.title || "Gallery"}</h2>
            {section.subtitle && <p className="text-sm text-zinc-400">{section.subtitle}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.map((img, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 group relative">
                <img src={img.url} alt={img.alt || `Photo ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-black/60 backdrop-blur-md text-[11px] text-white">
                    {img.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 7. INTERACTIVE FAQ ACCORDION
  if (section.sectionType === "faq") {
    const faqs = section.config?.faqs || [
      { question: "Are all products original with genuine Apple warranty?", answer: "Yes. Every iPhone, Mac, iPad, Watch, and accessory sold at TroyX iStore is 100% genuine with factory warranty and authentic parts." },
      { question: "Where is the physical store located?", answer: "Our flagship showroom is in Bawaleshie, East Legon, Accra, Ghana. We offer in-store pickup and doorstep delivery across Ghana." },
      { question: "Can I inspect the device before payment?", answer: "Yes, we encourage complete device inspection, battery health verification, and Serial/IMEI validation upon pickup or delivery." },
    ];

    return (
      <section id={section.id} className={`w-full ${bgClass} ${textClass} ${paddingYClass}`} style={inlineStyles}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <div className={`space-y-2 ${textAlignClass}`}>
            {section.tagline && <p className="text-xs uppercase tracking-widest font-semibold text-blue-500">{section.tagline}</p>}
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">{section.title || "Frequently Asked Questions"}</h2>
          </div>

          <div className="divide-y divide-zinc-800 border-y border-zinc-800">
            {faqs.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div key={i} className="py-4">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between text-left text-sm sm:text-base font-medium text-white hover:text-blue-400 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed pr-6">{faq.answer}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // 8. STORE PHOTOGRAPHY & CONTACT INFORMATION
  if (section.sectionType === "contact_section" || section.sectionType === "store_photography") {
    return (
      <section id={section.id} className={`w-full ${bgClass} ${textClass} ${paddingYClass}`} style={inlineStyles}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className={`space-y-2 ${textAlignClass}`}>
            {section.tagline && <p className="text-xs uppercase tracking-widest font-semibold text-blue-500">{section.tagline}</p>}
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">{section.title || "Visit TroyX iStore"}</h2>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto">Home of Original Apple Products in Accra, Ghana.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Store Photography */}
            <div className="rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-[4/3]">
              {section.desktopImageUrl ? (
                <img src={section.desktopImageUrl} alt="TroyX Storefront" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-2 p-6 text-center">
                  <MapPin className="w-8 h-8 text-blue-500" />
                  <span className="text-xs font-semibold text-white">Bawaleshie, East Legon, Accra</span>
                  <span className="text-[11px] text-zinc-400">Flagship Showroom & Service Center</span>
                </div>
              )}
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-start gap-4">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <div className="font-semibold text-white">Physical Location</div>
                  <div className="text-zinc-400">Bawaleshie, East Legon, Accra, Ghana</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-start gap-4">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <div className="font-semibold text-white">Direct Line</div>
                  <div className="text-zinc-400 font-mono">0207137437 / 0548974717</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-start gap-4">
                <MessageCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <div className="font-semibold text-white">Official WhatsApp</div>
                  <a href="https://wa.me/233207137437" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                    Chat with us: +233 20 713 7437
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 9. PROMOTIONAL BANNER / CAMPAIGN
  if (section.sectionType === "promo_banner") {
    return (
      <section id={section.id} className={`w-full ${bgClass} ${textClass} py-12 px-4 sm:px-6`} style={inlineStyles}>
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 p-8 sm:p-12 text-center space-y-4 relative overflow-hidden">
          {section.tagline && (
            <span className="inline-block px-3 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold uppercase tracking-wider">
              {section.tagline}
            </span>
          )}
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white">{section.title || "Special Campaign"}</h2>
          {section.subtitle && <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">{section.subtitle}</p>}
          {(section.buyUrl || section.learnMoreUrl) && (
            <div className="pt-2 flex justify-center gap-3">
              {section.buyUrl && (
                <Link href={section.buyUrl} className="apple-btn-primary text-xs py-2 px-5">
                  {section.buyText || "Shop Deals"}
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  // 10. CALL TO ACTION (CTA) SECTION
  if (section.sectionType === "cta_section") {
    return (
      <section id={section.id} className={`w-full ${bgClass} ${textClass} py-20 px-4 sm:px-6`} style={inlineStyles}>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {section.tagline && <p className="text-xs uppercase tracking-widest font-semibold text-blue-500">{section.tagline}</p>}
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight">{section.title || "Ready to upgrade?"}</h2>
          {section.subtitle && <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">{section.subtitle}</p>}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {section.buyUrl && (
              <Link href={section.buyUrl} className="apple-btn-primary text-sm py-2.5 px-6">
                {section.buyText || "Browse Catalog"}
              </Link>
            )}
            {section.learnMoreUrl && (
              <Link href={section.learnMoreUrl} className="apple-btn-secondary text-sm py-2.5 px-6">
                {section.learnMoreText || "Contact Showroom"}
              </Link>
            )}
          </div>
        </div>
      </section>
    );
  }

  // 11. DEFAULT & CINEMATIC HERO / FULL-WIDTH VIDEO & IMAGE SHOWCASE (Preserves homepage exact aesthetic)
  const textPosClass =
    section.config?.textPosition === "bottom"
      ? "justify-end pb-12 sm:pb-16"
      : section.config?.textPosition === "center"
      ? "justify-center"
      : "justify-start pt-12 sm:pt-16";

  return (
    <section
      id={section.id}
      className={`relative w-full overflow-hidden ${bgClass} ${textClass} select-none`}
      style={inlineStyles}
    >
      {/* Video Background Layer */}
      {(section.mediaType === "video" || section.mediaType === "both") && (
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          {section.desktopVideoUrl && (
            <video
              ref={videoRef}
              src={section.desktopVideoUrl}
              poster={section.posterImageUrl}
              autoPlay={section.config?.videoAutoplay !== false}
              muted={section.config?.videoMuted !== false}
              loop={section.config?.videoLoop !== false}
              playsInline
              className="w-full h-full object-cover hidden sm:block"
            />
          )}

          {section.mobileVideoUrl ? (
            <video
              src={section.mobileVideoUrl}
              poster={section.posterImageUrl}
              autoPlay={section.config?.videoAutoplay !== false}
              muted={section.config?.videoMuted !== false}
              loop={section.config?.videoLoop !== false}
              playsInline
              className="w-full h-full object-cover sm:hidden"
            />
          ) : (
            section.desktopVideoUrl && (
              <video
                src={section.desktopVideoUrl}
                poster={section.posterImageUrl}
                autoPlay={section.config?.videoAutoplay !== false}
                muted={section.config?.videoMuted !== false}
                loop={section.config?.videoLoop !== false}
                playsInline
                className="w-full h-full object-cover sm:hidden"
              />
            )
          )}

          {section.config?.overlayOpacity && (
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: section.config.overlayOpacity }}
            />
          )}
        </div>
      )}

      {/* Image Background Layer */}
      {(section.mediaType === "image" || section.mediaType === "both" || !section.mediaType) &&
        section.desktopImageUrl && (
          <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
            <picture>
              {section.mobileImageUrl && (
                <source media="(max-width: 640px)" srcSet={section.mobileImageUrl} />
              )}
              <img
                src={section.desktopImageUrl}
                alt={section.title || section.draftLabel}
                className="w-full h-full object-cover"
                loading={priority ? "eager" : "lazy"}
              />
            </picture>
            {section.config?.overlayOpacity && (
              <div
                className="absolute inset-0 bg-black"
                style={{ opacity: section.config.overlayOpacity }}
              />
            )}
          </div>
        )}

      {/* Foreground Text Content */}
      <div
        className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 min-h-[500px] sm:min-h-[640px] flex flex-col ${textPosClass} ${textAlignClass}`}
      >
        <div className="max-w-2xl space-y-2 sm:space-y-3">
          {section.tagline && (
            <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-blue-500">
              {section.tagline}
            </p>
          )}

          {section.title && (
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight">
              {section.title}
            </h2>
          )}

          {section.subtitle && (
            <p
              className={`text-lg sm:text-2xl font-normal tracking-tight ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              {section.subtitle}
            </p>
          )}

          {/* Action CTAs (NO PRICES on homepage showcases as required) */}
          {(section.learnMoreUrl || section.buyUrl) && (
            <div className="flex flex-wrap items-center gap-4 pt-3">
              {section.learnMoreUrl && (
                <Link
                  href={section.learnMoreUrl}
                  className="inline-flex items-center gap-1 text-sm sm:text-base font-normal text-blue-500 hover:text-blue-400 hover:underline"
                >
                  <span>{section.learnMoreText || "Learn more"}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
              {section.buyUrl && (
                <Link
                  href={section.buyUrl}
                  className="inline-flex items-center gap-1 text-sm sm:text-base font-normal text-blue-500 hover:text-blue-400 hover:underline"
                >
                  <span>{section.buyText || "Buy"}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
