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
    <div className="home-reveal relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[#0D111B]/90 p-5 shadow-[0_44px_130px_rgba(0,0,0,0.42)] sm:min-h-[590px] sm:p-10 lg:min-h-[650px]">
      <div className="home-glow-breathe absolute h-[68%] w-[68%] rounded-full bg-[#1687F8]/25 blur-[76px]" />
      <div className="absolute inset-4 rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_50%_20%,rgba(101,180,255,0.19),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.015))]" />
      <div className="absolute inset-x-12 bottom-8 h-20 rounded-full bg-[#1687F8]/14 blur-3xl" />

      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {shouldUseVideo ? (
          <video
            ref={videoRef}
            aria-label="Cinematic iPhone product video"
            className="relative z-10 h-auto max-h-[390px] w-auto max-w-[88%] rounded-[1.35rem] object-contain drop-shadow-[0_42px_80px_rgba(0,0,0,0.52)] sm:max-h-[540px] lg:max-h-[600px]"
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
            className="home-device-float relative z-10 max-h-[390px] w-auto max-w-[88%] rounded-[1.35rem] object-contain drop-shadow-[0_42px_80px_rgba(0,0,0,0.52)] sm:max-h-[540px] lg:max-h-[600px]"
          />
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,15,0.04),rgba(7,9,15,0.36))]" />
      <div className="absolute inset-x-[20%] bottom-7 h-6 rounded-full bg-black/50 blur-2xl" />

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
