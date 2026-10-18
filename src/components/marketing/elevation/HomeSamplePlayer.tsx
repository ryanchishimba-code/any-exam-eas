"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "poster" | "loading" | "ready" | "failed";

/**
 * Poster until the visitor presses play. The video file is requested only then.
 */
export function HomeSamplePlayer({
  title,
  webp,
  jpg,
  mediaUrl,
  captions,
  imageAlt = "",
}: {
  title: string;
  webp: string;
  jpg: string;
  mediaUrl: string;
  captions: boolean;
  /** Poster alt. Empty keeps the image decorative when the play button already names the video. */
  imageAlt?: string;
}) {
  const [phase, setPhase] = useState<Phase>("poster");
  const [videoUrl, setVideoUrl] = useState("");
  const [captionsUrl, setCaptionsUrl] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (phase !== "ready") return;
    const video = videoRef.current;
    if (!video) return;
    try {
      const pending = video.play?.();
      if (pending && typeof pending.catch === "function") pending.catch(() => {});
    } catch {
      // Autoplay can be blocked. The controls stay available.
    }
  }, [phase, videoUrl]);

  async function start() {
    if (phase === "loading" || phase === "ready") return;
    setPhase("loading");
    try {
      const response = await fetch(mediaUrl);
      if (!response.ok) throw new Error("unavailable");
      const body = (await response.json()) as { videoUrl?: string; captionsUrl?: string };
      if (!body.videoUrl) throw new Error("unavailable");
      setVideoUrl(body.videoUrl);
      setCaptionsUrl(body.captionsUrl ?? "");
      setPhase("ready");
    } catch {
      setPhase("failed");
    }
  }

  if (phase === "ready") {
    return (
      <video
        ref={videoRef}
        className="home-bites__video"
        controls
        playsInline
        preload="none"
        poster={webp}
        src={videoUrl}
        width={1280}
        height={720}
        aria-label={`${title} video`}
      >
        {captions && captionsUrl ? (
          <track kind="captions" src={captionsUrl} srcLang="en" label="English" />
        ) : null}
      </video>
    );
  }

  return (
    <button type="button" className="home-bites__play" onClick={start} aria-label={`Play ${title}`}>
      <picture>
        <source srcSet={webp} type="image/webp" />
        <img src={jpg} alt={imageAlt} width={1280} height={720} loading="lazy" decoding="async" />
      </picture>
      <span className="home-bites__play-mark" aria-hidden>
        <svg viewBox="0 0 24 24" width="22" height="22">
          <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
        </svg>
      </span>
      {phase === "failed" ? (
        <span className="home-bites__play-note">This sample did not load. Try again.</span>
      ) : null}
    </button>
  );
}
