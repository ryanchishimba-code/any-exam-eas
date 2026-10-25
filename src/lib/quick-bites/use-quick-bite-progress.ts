"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { COMPLETION_RULES_V2 } from "@/lib/learning/study-completion/completion-rules-v2";

const PROGRESS_INTERVAL_MS = 15_000;
const WATCH_PCT_COMPLETE = COMPLETION_RULES_V2.quickBiteWatchPctComplete;

export type QuickBiteProgressClient = {
  watchPct: number;
  watchSeconds: number;
  completedAt: string | null;
};

export function quickBiteResumeSeconds(
  watchPct: number,
  duration: number
): number | null {
  if (!Number.isFinite(duration) || duration <= 0) return null;
  if (!Number.isFinite(watchPct) || watchPct <= 0) return null;
  if (watchPct >= 99) return null;
  return Math.min(duration - 0.25, (watchPct / 100) * duration);
}

export function isQuickBiteWatched(progress: QuickBiteProgressClient | undefined): boolean {
  if (!progress) return false;
  if (progress.completedAt) return true;
  return progress.watchPct >= WATCH_PCT_COMPLETE;
}

export function useQuickBiteProgressMap({
  apiBase,
  enabled,
}: {
  apiBase: string;
  enabled: boolean;
}) {
  const [progress, setProgress] = useState<Record<string, QuickBiteProgressClient>>({});

  useEffect(() => {
    if (!enabled) {
      setProgress({});
      return;
    }
    const controller = new AbortController();
    let active = true;
    void fetch(`${apiBase}/progress`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!active || !response.ok) return;
        const body = (await response.json()) as {
          progress?: Record<string, QuickBiteProgressClient>;
        };
        if (!active || !body.progress) return;
        setProgress(body.progress);
      })
      .catch(() => {
        /* best-effort */
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [apiBase, enabled]);

  const mergeProgress = useCallback((slug: string, patch: QuickBiteProgressClient) => {
    setProgress((current) => ({
      ...current,
      [slug]: {
        watchPct: Math.max(current[slug]?.watchPct ?? 0, patch.watchPct),
        watchSeconds: Math.max(current[slug]?.watchSeconds ?? 0, patch.watchSeconds),
        completedAt:
          patch.completedAt ??
          current[slug]?.completedAt ??
          (patch.watchPct >= WATCH_PCT_COMPLETE ? new Date().toISOString() : null),
      },
    }));
  }, []);

  return { progress, mergeProgress };
}

export function useQuickBiteProgressReporter({
  slug,
  apiBase,
  enabled,
  videoRef,
  resumeWatchPct = 0,
  onSaved,
}: {
  slug: string;
  apiBase: string;
  enabled: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  resumeWatchPct?: number;
  onSaved?: (slug: string, row: QuickBiteProgressClient) => void;
}) {
  const lastSentAtRef = useRef<number>(Date.now());
  const lastWatchPctRef = useRef(0);
  const resumeAppliedRef = useRef("");

  const sendProgress = useCallback(
    (watchSecondsDelta: number, useBeacon = false) => {
      const video = videoRef.current;
      if (!slug || !video || !enabled) return;
      const duration = video.duration;
      const watchPct =
        Number.isFinite(duration) && duration > 0
          ? Math.min(100, (video.currentTime / duration) * 100)
          : lastWatchPctRef.current;
      lastWatchPctRef.current = watchPct;
      lastSentAtRef.current = Date.now();
      const payload = JSON.stringify({ watchPct, watchSecondsDelta });
      const url = `${apiBase}/${slug}/progress`;
      const completedAt =
        watchPct >= WATCH_PCT_COMPLETE ? new Date().toISOString() : null;
      if (useBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }));
        onSaved?.(slug, { watchPct, watchSeconds: 0, completedAt });
        return;
      }
      void fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: useBeacon,
      })
        .then(async (response) => {
          if (!response.ok) return;
          const body = (await response.json()) as {
            progress?: { watchPct: number; watchSeconds: number; completedAt: string | null };
          };
          if (!body.progress) return;
          onSaved?.(slug, {
            watchPct: body.progress.watchPct,
            watchSeconds: body.progress.watchSeconds,
            completedAt: body.progress.completedAt,
          });
        })
        .catch(() => {
          /* best-effort */
        });
    },
    [apiBase, enabled, onSaved, slug, videoRef]
  );

  useEffect(() => {
    if (!enabled || !slug) return;
    const video = videoRef.current;
    if (!video) return;

    const applyResume = () => {
      const token = `${slug}:${resumeWatchPct}`;
      if (resumeAppliedRef.current === token) return;
      const seconds = quickBiteResumeSeconds(resumeWatchPct, video.duration);
      if (seconds == null) return;
      resumeAppliedRef.current = token;
      try {
        video.currentTime = seconds;
      } catch {
        // jsdom may reject seeking.
      }
    };

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
    const onLoadedMetadata = () => applyResume();
    const onPageHide = () => {
      const elapsed = Math.max(0, Math.round((Date.now() - lastSentAtRef.current) / 1000));
      if (elapsed > 0) sendProgress(elapsed, true);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    window.addEventListener("pagehide", onPageHide);
    if (video.readyState >= 1) applyResume();

    return () => {
      window.clearInterval(interval);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      window.removeEventListener("pagehide", onPageHide);
      const elapsed = Math.max(0, Math.round((Date.now() - lastSentAtRef.current) / 1000));
      if (elapsed > 0) sendProgress(elapsed, true);
    };
  }, [apiBase, enabled, resumeWatchPct, sendProgress, slug, videoRef]);
}
