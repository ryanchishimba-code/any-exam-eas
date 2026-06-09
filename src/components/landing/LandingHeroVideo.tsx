"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  getLandingVisual,
  landingVideoSrc,
  landingVisualSrc,
} from "@/lib/marketing/landing-visuals";

type Props = {
  /** Poster frame when video is off, loading, or reduced-motion */
  posterVisualId?: string;
  className?: string;
};

/**
 * Hero showcase video — muted autoplay loop (Tesla-style product reel).
 * Falls back to static mockup poster when prefers-reduced-motion or on load error.
 */
export function LandingHeroVideo({
  posterVisualId = "hero-app-mockup",
  className = "",
}: Props) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [usePoster, setUsePoster] = useState(Boolean(reduceMotion));
  const [loaded, setLoaded] = useState(false);

  const videoSrc = landingVideoSrc("heroShowcase");
  const posterSrc = landingVisualSrc(posterVisualId);
  const posterAlt =
    getLandingVisual(posterVisualId)?.alt ??
    "Any Exam Easy exam prep platform preview";

  useEffect(() => {
    if (reduceMotion) {
      setUsePoster(true);
      return;
    }
    const el = videoRef.current;
    if (!el) return;

    const play = () => {
      el.play().catch(() => setUsePoster(true));
    };

    if (el.readyState >= 2) play();
    else el.addEventListener("canplay", play, { once: true });

    return () => el.removeEventListener("canplay", play);
  }, [reduceMotion]);

  if (usePoster && posterSrc) {
    return (
      <figure className={`aee-flagship-hero-video ${className}`}>
        <div className="aee-flagship-hero-video__frame">
          <Image
            src={posterSrc}
            alt={posterAlt}
            width={1200}
            height={900}
            priority
            className="aee-flagship-hero-video__poster"
            sizes="(max-width: 1024px) 100vw, 480px"
          />
        </div>
      </figure>
    );
  }

  return (
    <figure className={`aee-flagship-hero-video ${className}`}>
      <div className="aee-flagship-hero-video__frame">
        {!loaded && posterSrc ? (
          <Image
            src={posterSrc}
            alt=""
            aria-hidden
            width={1200}
            height={900}
            priority
            className="aee-flagship-hero-video__poster aee-flagship-hero-video__poster--loading"
            sizes="(max-width: 1024px) 100vw, 480px"
          />
        ) : null}
        <video
          ref={videoRef}
          className={`aee-flagship-hero-video__el${loaded ? " is-ready" : ""}`}
          src={videoSrc}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          poster={posterSrc}
          aria-label={posterAlt}
          onLoadedData={() => setLoaded(true)}
          onError={() => setUsePoster(true)}
        />
        <div className="aee-flagship-hero-video__shine" aria-hidden />
      </div>
      <figcaption className="sr-only">{posterAlt}</figcaption>
    </figure>
  );
}
