"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { COMPLETION_RULES_V2 } from "@/lib/learning/study-completion/completion-rules-v2";

const PROGRESS_INTERVAL_MS = 10_000;
const TIMEUPDATE_MIN_MS = 8_000;
const WATCH_PCT_COMPLETE = COMPLETION_RULES_V2.quickBiteWatchPctComplete;

function isSpuriousHeadPositionSave(
  playbackPositionSec: number,
  maxMomentWatchPct: number,
  force: boolean
): boolean {
  return force && playbackPositionSec <= 0.5 && maxMomentWatchPct > 3;
}

export type QuickBiteProgressClient = {
  watchPct: number;
  playbackPositionSec: number;
  watchSeconds: number;
  completedAt: string | null;
};

/** Resume from last saved playback head, not max watchPct. */
export function quickBiteResumeSeconds(
  playbackPositionSec: number,
  duration: number,
  completed: boolean
): number | null {
  if (completed) return null;
  if (!Number.isFinite(duration) || duration <= 0) return null;
  if (!Number.isFinite(playbackPositionSec) || playbackPositionSec <= 0.5) return null;
  if (playbackPositionSec >= duration - 1) return null;
  return Math.min(duration - 0.25, playbackPositionSec);
}

export function isQuickBiteWatched(progress: QuickBiteProgressClient | undefined): boolean {
  if (!progress) return false;
  if (progress.completedAt) return true;
  return progress.watchPct >= WATCH_PCT_COMPLETE;
}

export function quickBiteListProgressPercent(
  progress: QuickBiteProgressClient | undefined
): number {
  if (!progress || isQuickBiteWatched(progress)) return 0;
  return Math.min(100, Math.max(0, Math.round(progress.watchPct)));
}

export function useQuickBiteProgressMap({
  apiBase,
  enabled,
}: {
  apiBase: string;
  enabled: boolean;
}) {
  const [progress, setProgress] = useState<Record<string, QuickBiteProgressClient>>({});
  const [progressLoaded, setProgressLoaded] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setProgress({});
      setProgressLoaded(false);
      return;
    }
    setProgressLoaded(false);
    const controller = new AbortController();
    let active = true;
    void fetch(`${apiBase}/progress`, {
      signal: controller.signal,
      cache: "no-store",
      credentials: "same-origin",
    })
      .then(async (response) => {
        if (!active || !response.ok) return;
        const body = (await response.json()) as {
          progress?: Record<string, QuickBiteProgressClient>;
        };
        if (!active || !body.progress) return;
        setProgress(body.progress);
        setProgressLoaded(true);
      })
      .catch(() => {
        /* best-effort */
      })
      .finally(() => {
        if (active) setProgressLoaded(true);
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
        playbackPositionSec: patch.playbackPositionSec,
        watchSeconds: Math.max(current[slug]?.watchSeconds ?? 0, patch.watchSeconds),
        completedAt:
          patch.completedAt ??
          current[slug]?.completedAt ??
          (patch.watchPct >= WATCH_PCT_COMPLETE ? new Date().toISOString() : null),
      },
    }));
  }, []);

  return { progress, mergeProgress, progressLoaded };
}

export type QuickBiteResumeSnapshot = {
  playbackPositionSec: number;
  completed: boolean;
};

/**
 * Freeze resume inputs for one episode open (library click / next episode).
 * Ignores later progress POSTs so the reporter does not re-seek mid-playback.
 */
export function useQuickBiteResumeSnapshot(
  sessionKey: string,
  slug: string,
  progress: Record<string, QuickBiteProgressClient>,
  progressLoaded: boolean
): { snapshot: QuickBiteResumeSnapshot; ready: boolean } {
  const lockedSessionRef = useRef<string | null>(null);
  const [snapshot, setSnapshot] = useState<QuickBiteResumeSnapshot>({
    playbackPositionSec: 0,
    completed: false,
  });
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    if (!slug || !sessionKey) {
      setReady(false);
      return;
    }
    if (!progressLoaded) {
      setReady(false);
      return;
    }
    const row = progress[slug];

    if (lockedSessionRef.current !== sessionKey) {
      lockedSessionRef.current = sessionKey;
      setSnapshot({
        playbackPositionSec: row?.playbackPositionSec ?? 0,
        completed: row ? isQuickBiteWatched(row) : false,
      });
      setReady(true);
      return;
    }

    setSnapshot((current) => {
      if (current.playbackPositionSec > 0.5 || !row) return current;
      const position = row.playbackPositionSec ?? 0;
      if (position <= 0.5) return current;
      return {
        playbackPositionSec: position,
        completed: isQuickBiteWatched(row),
      };
    });
    setReady(true);
  }, [sessionKey, slug, progress, progressLoaded]);

  return { snapshot, ready };
}

/** Seek once when metadata/buffer is ready; calls onReady after seek settles or when no seek is needed. */
export function scheduleQuickBiteResumeSeek(
  video: HTMLVideoElement,
  snapshot: QuickBiteResumeSnapshot,
  onReady: () => void,
  options?: { suppressProgressFlush?: { current: boolean } }
): () => void {
  let settled = false;
  const releaseSuppress = () => {
    if (options?.suppressProgressFlush) options.suppressProgressFlush.current = false;
  };
  const finish = () => {
    if (settled) return;
    settled = true;
    releaseSuppress();
    onReady();
  };

  const attemptSeek = () => {
    if (settled) return;
    const seconds = quickBiteResumeSeconds(
      snapshot.playbackPositionSec,
      video.duration,
      snapshot.completed
    );
    if (seconds == null) {
      finish();
      return;
    }
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    const onSeeked = () => {
      video.removeEventListener("seeked", onSeeked);
      window.clearTimeout(seekTimeout);
      finish();
    };
    const seekTimeout = window.setTimeout(() => {
      video.removeEventListener("seeked", onSeeked);
      finish();
    }, 2_000);
    video.addEventListener("seeked", onSeeked);
    try {
      if (options?.suppressProgressFlush) options.suppressProgressFlush.current = true;
      video.pause();
      video.currentTime = seconds;
      if (Math.abs(video.currentTime - seconds) < 0.35) {
        onSeeked();
      }
    } catch {
      onSeeked();
    }
  };

  const attemptReady = () => {
    if (settled) return;
    const needsSeek =
      quickBiteResumeSeconds(
        snapshot.playbackPositionSec,
        Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 999_999,
        snapshot.completed
      ) != null;
    if (!needsSeek) {
      finish();
      return;
    }
    attemptSeek();
  };

  video.addEventListener("loadedmetadata", attemptReady, { once: true });
  video.addEventListener("canplay", attemptSeek, { once: true });
  if (video.readyState >= 1) attemptReady();

  return () => {
    settled = true;
    releaseSuppress();
  };
}

export function useQuickBiteProgressReporter({
  slug,
  apiBase,
  enabled,
  videoRef,
  videoElement,
  suppressProgressFlushRef,
  resumeSeekCompletedRef,
  onSaved,
}: {
  slug: string;
  apiBase: string;
  enabled: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  /** Set via callback ref so listeners attach when the <video> mounts. */
  videoElement: HTMLVideoElement | null;
  /** Skip pause/pagehide saves while the player seeks to the resume point. */
  suppressProgressFlushRef?: { current: boolean };
  /** False until initial resume seek (if any) has finished. */
  resumeSeekCompletedRef?: { current: boolean };
  onSaved?: (slug: string, row: QuickBiteProgressClient) => void;
}) {
  const lastSentAtRef = useRef<number>(Date.now());
  const lastTimeupdateSentRef = useRef<number>(0);
  const lastMaxWatchPctRef = useRef(0);

  useEffect(() => {
    lastSentAtRef.current = Date.now();
    lastTimeupdateSentRef.current = 0;
    lastMaxWatchPctRef.current = 0;
  }, [slug]);

  const sendProgress = useCallback(
    (watchSecondsDelta: number, useKeepalive = false, force = false) => {
      if (resumeSeekCompletedRef && !resumeSeekCompletedRef.current) return;
      if (suppressProgressFlushRef?.current) return;
      const video = videoRef.current ?? videoElement;
      if (!slug || !video || !enabled) return;
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;
      const playbackPositionSec = video.currentTime;
      const momentWatchPct = Math.min(100, (playbackPositionSec / duration) * 100);
      lastMaxWatchPctRef.current = Math.max(lastMaxWatchPctRef.current, momentWatchPct);
      if (
        isSpuriousHeadPositionSave(playbackPositionSec, lastMaxWatchPctRef.current, force)
      ) {
        return;
      }
      if (!force && watchSecondsDelta <= 0) return;
      lastSentAtRef.current = Date.now();
      const payload = JSON.stringify({
        playbackPositionSec,
        momentWatchPct: lastMaxWatchPctRef.current,
        watchSecondsDelta,
      });
      const url = `${apiBase}/${slug}/progress`;
      void fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        credentials: "same-origin",
        keepalive: useKeepalive,
      })
        .then(async (response) => {
          if (!response.ok) return;
          const body = (await response.json()) as {
            progress?: {
              watchPct: number;
              playbackPositionSec: number;
              watchSeconds: number;
              completedAt: string | null;
            };
          };
          if (!body.progress) return;
          onSaved?.(slug, {
            watchPct: body.progress.watchPct,
            playbackPositionSec: body.progress.playbackPositionSec,
            watchSeconds: body.progress.watchSeconds,
            completedAt: body.progress.completedAt,
          });
        })
        .catch(() => {
          /* best-effort */
        });
    },
    [
      apiBase,
      enabled,
      onSaved,
      resumeSeekCompletedRef,
      slug,
      suppressProgressFlushRef,
      videoElement,
      videoRef,
    ]
  );

  useEffect(() => {
    if (!enabled || !slug || !videoElement) return;
    const video = videoElement;

    const flushElapsed = (useKeepalive = false, force = false) => {
      const elapsed = Math.max(0, Math.round((Date.now() - lastSentAtRef.current) / 1000));
      if (elapsed > 0) sendProgress(elapsed, useKeepalive, force);
      else if (force) sendProgress(0, useKeepalive, true);
    };

    const tick = () => {
      if (!video.paused && !video.ended) flushElapsed();
    };

    const interval = window.setInterval(tick, PROGRESS_INTERVAL_MS);
    const onPause = () => flushElapsed(false, true);
    const onEnded = onPause;
    const onSeeked = () => flushElapsed(false, true);
    const onTimeupdate = () => {
      const now = Date.now();
      if (now - lastTimeupdateSentRef.current < TIMEUPDATE_MIN_MS) return;
      if (video.paused || video.ended) return;
      lastTimeupdateSentRef.current = now;
      flushElapsed();
    };
    const onPageHide = () => flushElapsed(true, true);

    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("timeupdate", onTimeupdate);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      window.clearInterval(interval);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("timeupdate", onTimeupdate);
      window.removeEventListener("pagehide", onPageHide);
      if (video.currentTime > 0.5) flushElapsed(true, true);
    };
  }, [enabled, sendProgress, slug, videoElement]);
}
