"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import {
  Maximize2,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  ANATOMY_REFERENCE_VIDEO,
  ANATOMY_REFERENCE_VIDEO_ALT,
} from "@/lib/anatomy/media";
import { cn } from "@/lib/utils";

const SPEEDS = [0.75, 1, 1.25, 1.5] as const;

type Props = {
  className?: string;
  selectedName?: string | null;
  compact?: boolean;
};

export function AnatomyReferenceVideo({ className, selectedName, compact = false }: Props) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(!reduceMotion);
  const [muted, setMuted] = useState(true);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const [error, setError] = useState(false);

  const togglePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play().then(() => setPlaying(true)).catch(() => setError(true));
    } else {
      el.pause();
      setPlaying(false);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void el.requestFullscreen();
    }
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.target instanceof HTMLInputElement) return;
      const root = containerRef.current;
      if (!root?.contains(document.activeElement) && document.activeElement !== document.body) {
        return;
      }
      e.preventDefault();
      togglePlay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePlay]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "aee-anatomy-video relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-gradient-to-b from-slate-950 via-slate-900 to-black shadow-[var(--shadow-apple-sm)]",
        className
      )}
    >
      {!compact ? (
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-200/90">
            Reference video
          </p>
          {selectedName ? (
            <p className="truncate text-sm font-medium text-white/90">{selectedName}</p>
          ) : (
            <p className="text-sm text-white/60">Spatial orientation for board prep</p>
          )}
        </div>
      ) : null}

      <div className="relative min-h-0 flex-1 bg-black">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <p className="text-sm font-medium text-white/90">Video unavailable</p>
            <p className="text-xs text-white/50">
              Add{" "}
              <code className="rounded bg-white/10 px-1 py-0.5 text-[10px]">
                public/videos/anatomy/anatomy-reference.mp4
              </code>{" "}
              or switch to Interactive 3D.
            </p>
          </div>
        ) : (
          <video
            ref={videoRef}
            className="h-full w-full object-contain"
            src={ANATOMY_REFERENCE_VIDEO}
            playsInline
            loop
            muted={muted}
            autoPlay={!reduceMotion}
            preload="metadata"
            aria-label={ANATOMY_REFERENCE_VIDEO_ALT}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setError(true)}
          />
        )}
      </div>

      {!error ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-3 py-2">
          <div className="flex items-center gap-1">
            <ToolbarButton onClick={togglePlay} label={playing ? "Pause" : "Play"}>
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </ToolbarButton>
            <ToolbarButton
              onClick={() => setMuted((m) => !m)}
              label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </ToolbarButton>
            <ToolbarButton onClick={toggleFullscreen} label="Fullscreen">
              <Maximize2 className="h-4 w-4" />
            </ToolbarButton>
          </div>
          <div className="flex items-center gap-1">
            <span className="mr-1 text-[10px] font-semibold uppercase tracking-wide text-white/40">
              Speed
            </span>
            {SPEEDS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className={cn(
                  "rounded-lg px-2 py-1 text-xs font-semibold transition",
                  speed === s
                    ? "bg-violet-500/30 text-violet-100"
                    : "text-white/50 hover:bg-white/10 hover:text-white/80"
                )}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  label,
}: {
  children: ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  );
}
