"use client";

import { useEffect, useRef, type RefObject } from "react";

const PROGRESS_INTERVAL_MS = 15_000;

export function useQuickBiteProgressReporter({
  slug,
  apiBase,
  enabled,
  videoRef,
}: {
  slug: string;
  apiBase: string;
  enabled: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
}) {
  const lastSentAtRef = useRef<number>(Date.now());
  const lastWatchPctRef = useRef(0);

  const sendProgress = (watchSecondsDelta: number) => {
    const video = videoRef.current;
    if (!slug || !video || !enabled) return;
    const duration = video.duration;
    const watchPct =
      Number.isFinite(duration) && duration > 0
        ? Math.min(100, (video.currentTime / duration) * 100)
        : lastWatchPctRef.current;
    lastWatchPctRef.current = watchPct;
    lastSentAtRef.current = Date.now();
    void fetch(`${apiBase}/${slug}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ watchPct, watchSecondsDelta }),
    }).catch(() => {
      /* best-effort */
    });
  };

  useEffect(() => {
    if (!enabled || !slug) return;
    const video = videoRef.current;
    if (!video) return;

    const tick = () => {
      const elapsed = Math.max(0, Math.round((Date.now() - lastSentAtRef.current) / 1000));
      if (elapsed > 0 && !video.paused && !video.ended) {
        sendProgress(elapsed);
      }
    };

    const interval = window.setInterval(tick, PROGRESS_INTERVAL_MS);
    const onPause = () => {
      const elapsed = Math.max(0, Math.round((Date.now() - lastSentAtRef.current) / 1000));
      if (elapsed > 0) sendProgress(elapsed);
    };
    const onEnded = onPause;

    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);

    return () => {
      window.clearInterval(interval);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
    };
  }, [apiBase, enabled, slug, videoRef]);
}
