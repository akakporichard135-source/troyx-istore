"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
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
  const bgClass =
    section.backgroundColor || (isDark ? "bg-[#000000]" : "bg-[#ffffff]");
  const textClass =
    section.textColor || (isDark ? "text-[#f5f5f7]" : "text-[#1d1d1f]");

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

  // 1. SPLIT STORY SECTION
  if (section.sectionType === "split_story") {
    return (
      <section
        id={section.id}
        className={`w-full overflow-hidden ${bgClass} ${textClass} ${paddingYClass}`}
        style={{ backgroundColor: section.backgroundColor, color: section.textColor }}
      >
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
                    <Link
                      href={section.buyUrl}
                      className="apple-btn-primary text-xs py-2 px-4"
                    >
                      <span>{section.buyText || "Buy"}</span>
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
              {section.desktopImageUrl && (
                <img
                  src={section.desktopImageUrl}
                  alt={section.title || section.draftLabel}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              )}
              {section.desktopVideoUrl && (
                <video
                  src={section.desktopVideoUrl}
                  poster={section.posterImageUrl}
                  autoPlay={section.config?.videoAutoplay !== false}
                  muted={section.config?.videoMuted !== false}
                  loop={section.config?.videoLoop !== false}
                  playsInline
                  className="w-full h-auto object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 2. FEATURE SHOWCASE (Chip, Camera, Display, Battery)
  if (section.sectionType === "feature_showcase") {
    const features = section.config?.features || [
      { title: "Apple Silicon", description: "Unmatched speed and power efficiency.", icon: "cpu" },
      { title: "Pro Camera System", description: "Cinematic 4K video recording with optical stabilization.", icon: "camera" },
      { title: "All-Day Battery Life", description: "Optimized power architecture engineered for endurance.", icon: "battery" },
    ];

    const iconMap: Record<string, any> = {
      cpu: Cpu,
      camera: Camera,
      battery: Battery,
      display: Smartphone,
      wireless: Wifi,
    };

    return (
      <section
        id={section.id}
        className={`w-full ${bgClass} ${textClass} ${paddingYClass}`}
        style={{ backgroundColor: section.backgroundColor, color: section.textColor }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className={`max-w-2xl mx-auto ${textAlignClass} space-y-3`}>
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
              <p className={`text-base sm:text-lg ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                {section.subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, i) => {
              const IconComponent = iconMap[feat.icon || "cpu"] || Sparkles;
              return (
                <div
                  key={i}
                  className={`p-6 rounded-2xl border transition-all ${
                    isDark ? "bg-[#161617] border-zinc-800" : "bg-zinc-50 border-zinc-200"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-4">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feat.title}</h3>
                  <p className={`text-xs leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // 3. TECHNICAL SPECIFICATIONS TABLE
  if (section.sectionType === "tech_specs") {
    const specs = section.config?.specs || [
      { label: "Processor", value: "Apple Silicon with 16-core Neural Engine" },
      { label: "Display", value: "Super Retina XDR with ProMotion up to 120Hz" },
      { label: "Material", value: "Grade 5 Titanium enclosure with textured matte glass" },
      { label: "Camera", value: "48MP Fusion system with 5x optical telephoto" },
      { label: "Connectivity", value: "USB-C with USB 3 speeds up to 10Gb/s, Wi-Fi 6E, 5G" },
      { label: "Security", value: "Secure Enclave with biometric Face ID" },
    ];

    return (
      <section
        id={section.id}
        className={`w-full ${bgClass} ${textClass} ${paddingYClass}`}
        style={{ backgroundColor: section.backgroundColor, color: section.textColor }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">
              {section.title || "Technical Specifications"}
            </h2>
            {section.subtitle && (
              <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                {section.subtitle}
              </p>
            )}
          </div>

          <div className="divide-y divide-zinc-800 border-t border-b border-zinc-800 text-xs sm:text-sm">
            {specs.map((spec, i) => (
              <div key={i} className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <span className="font-semibold text-zinc-400">{spec.label}</span>
                <span className="sm:col-span-2 text-zinc-200">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 4. COMPARISON TABLE
  if (section.sectionType === "comparison_table") {
    return (
      <section
        id={section.id}
        className={`w-full ${bgClass} ${textClass} ${paddingYClass}`}
        style={{ backgroundColor: section.backgroundColor, color: section.textColor }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">
              {section.title || "Compare with Previous Generations"}
            </h2>
            {section.subtitle && (
              <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                {section.subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-3">
              <span className="text-[10px] uppercase font-bold text-blue-400">Latest Flagship</span>
              <div className="text-lg font-semibold text-white">Current Model</div>
              <p className="text-zinc-400">Next-gen Apple Silicon, Titanium frame, 48MP Pro camera.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-3">
              <span className="text-[10px] uppercase font-bold text-zinc-500">Certified Pre-Owned</span>
              <div className="text-lg font-semibold text-white">Previous Generation</div>
              <p className="text-zinc-400">A16 Bionic, Ceramic Shield, Dynamic Island.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-3 hidden sm:block">
              <span className="text-[10px] uppercase font-bold text-zinc-500">Value Pick</span>
              <div className="text-lg font-semibold text-white">Entry Generation</div>
              <p className="text-zinc-400">Solid performance, dual camera, all-day battery life.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 5. FAQ ACCORDION
  if (section.sectionType === "faq") {
    const faqs = section.config?.faqs || [
      { question: "Are devices original genuine Apple products?", answer: "Yes, 100% genuine Apple devices with authentic serial numbers and full warranty." },
      { question: "Where is the showroom located?", answer: "We are located at Bawaleshie, East Legon, Accra, Ghana." },
      { question: "How does in-store pickup work?", answer: "You can reserve or order on WhatsApp/checkout, inspect the device at our East Legon showroom, and pay upon collection." },
    ];

    return (
      <section
        id={section.id}
        className={`w-full ${bgClass} ${textClass} ${paddingYClass}`}
        style={{ backgroundColor: section.backgroundColor, color: section.textColor }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">
              {section.title || "Frequently Asked Questions"}
            </h2>
            {section.subtitle && (
              <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                {section.subtitle}
              </p>
            )}
          </div>

          <div className="divide-y divide-zinc-800 border-t border-b border-zinc-800">
            {faqs.map((faq, i) => (
              <div key={i} className="py-4">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full flex justify-between items-center text-left text-sm font-medium text-white hover:text-blue-400 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openFaqIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaqIndex === i && (
                  <p className="pt-2 text-xs text-zinc-400 leading-relaxed animate-fade-in">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 6. DEFAULT / CINEMATIC HERO (Full-Width Cinematic Showcase)
  const textPosClass =
    section.config?.textPosition === "bottom"
      ? "justify-end pb-12 sm:pb-16"
      : section.config?.textPosition === "center"
      ? "justify-center py-16"
      : "justify-start pt-12 sm:pt-16";

  return (
    <section
      id={section.id}
      className={`relative w-full overflow-hidden transition-colors ${bgClass} ${textClass}`}
      style={{
        backgroundColor: section.backgroundColor,
        color: section.textColor,
      }}
    >
      {/* Background Media: Video */}
      {(section.mediaType === "video" || section.mediaType === "both") && (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {section.desktopVideoUrl && (
            <video
              ref={videoRef}
              src={section.desktopVideoUrl}
              poster={section.posterImageUrl}
              autoPlay={section.config?.videoAutoplay !== false}
              muted={section.config?.videoMuted !== false}
              loop={section.config?.videoLoop !== false}
              playsInline
              controls={section.config?.videoControls || false}
              className={`w-full h-full object-cover hidden sm:block ${
                section.config?.overlayOpacity ? `opacity-${Math.round((1 - (section.config.overlayOpacity || 0)) * 100)}` : ""
              }`}
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

      {/* Background Media: Image */}
      {(section.mediaType === "image" || section.mediaType === "both") &&
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
                loading="lazy"
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

      {/* Foreground Content Container */}
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

          {/* Action CTAs (Learn More, Buy) - NO PRICES on homepage showcases as required */}
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
