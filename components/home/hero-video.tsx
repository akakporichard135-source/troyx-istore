"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type HeroVideoProps = {
  alt: string;
  fallbackImageSrc: string;
  hasVideo: boolean;
  mp4Src?: string;
  posterSrc: string;
  webmSrc?: string;
};

export function HeroVideo({
  alt,
  fallbackImageSrc,
  hasVideo,
  mp4Src,
  posterSrc,
  webmSrc
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(hasVideo);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [prefersReducedData, setPrefersReducedData] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () =>
      setPrefersReducedMotion(motionQuery.matches);
    updateMotionPreference();
    motionQuery.addEventListener("change", updateMotionPreference);

    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    setPrefersReducedData(Boolean(connection?.saveData));

    return () =>
      motionQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  const shouldUseVideo = hasVideo && !prefersReducedMotion && !prefersReducedData;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldUseVideo) {
      setIsPlaying(false);
      return;
    }

    video
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [shouldUseVideo]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="home-reveal relative flex min-h-[390px] items-center justify-center overflow-visible p-3 sm:min-h-[560px] sm:p-8 lg:min-h-[650px]">
      <div className="absolute inset-[-12%] rounded-full bg-[radial-gradient(circle_at_50%_34%,rgba(101,180,255,0.20),transparent_38%),radial-gradient(circle_at_50%_62%,rgba(22,135,248,0.15),transparent_50%),radial-gradient(circle_at_50%_82%,rgba(0,0,0,0.62),transparent_58%)]" />
      <div className="home-glow-breathe absolute h-[74%] w-[74%] rounded-full bg-[#1687F8]/24 blur-[90px]" />
      <div className="absolute inset-x-[14%] bottom-8 h-24 rounded-full bg-[#1687F8]/12 blur-3xl" />
      <div className="absolute inset-x-[22%] bottom-10 h-9 rounded-full bg-black/55 blur-2xl" />
      <div className="home-hero-particles pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {shouldUseVideo ? (
          <video
            ref={videoRef}
            aria-label="Cinematic iPhone product video"
            className="relative z-10 h-auto max-h-[410px] w-auto max-w-[94%] object-contain drop-shadow-[0_46px_88px_rgba(0,0,0,0.58)] sm:max-h-[560px] lg:max-h-[620px]"
            loop
            muted
            playsInline
            poster={posterSrc}
            preload="metadata"
          >
            {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
            {mp4Src ? <source src={mp4Src} type="video/mp4" /> : null}
          </video>
        ) : (
          <Image
            src={posterSrc || fallbackImageSrc}
            alt={alt}
            width={736}
            height={952}
            priority
            sizes="(min-width: 1024px) 34vw, (min-width: 640px) 58vw, 78vw"
            className="home-device-float home-hero-camera-drift relative z-10 max-h-[410px] w-auto max-w-[94%] object-contain drop-shadow-[0_46px_88px_rgba(0,0,0,0.58)] sm:max-h-[560px] lg:max-h-[620px]"
          />
        )}
      </div>

      <div className="pointer-events-none absolute inset-[-6%] bg-[radial-gradient(circle_at_50%_50%,transparent_42%,rgba(7,9,15,0.52)_78%)]" />

      {hasVideo && shouldUseVideo ? (
        <button
          type="button"
          onClick={togglePlayback}
          className="focus-ring absolute bottom-5 right-5 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white shadow-[0_16px_46px_rgba(0,0,0,0.36)] backdrop-blur transition hover:border-[#1687F8] hover:text-[#65B4FF]"
          aria-label={isPlaying ? "Pause hero video" : "Play hero video"}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Play className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      ) : null}
    </div>
  );
}
