"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent,
} from "react";
import { useReducedMotion } from "framer-motion";
import {
  Focus,
  Maximize2,
  Pause,
  Play,
  RotateCw,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  ANATOMY_VIDEO_CYCLE_SEC,
  ANATOMY_VIDEO_HOTSPOTS,
  HOTSPOT_VIEW_CENTER,
  HOTSPOT_VIEW_HEIGHT,
  HOTSPOT_VIEW_WIDTH,
  filterHotspotsByLayer,
  getHotspotLabel,
  getHotspotMeta,
  getPrimaryHotspotForStructure,
  getSeekTimeForStructure,
  isHotspotActiveAtTime,
  type AnatomyVideoHotspot,
} from "@/lib/anatomy/video-hotspots";
import { ANATOMY_REFERENCE_VIDEO, ANATOMY_REFERENCE_VIDEO_ALT } from "@/lib/anatomy/media";
import type { AnatomyLayer } from "@/lib/anatomy/types";
import { cn } from "@/lib/utils";

const SPEEDS = [0.75, 1, 1.25, 1.5] as const;
const MIN_ZOOM = 1;
const MAX_ZOOM = 2.8;
const FOCUS_ZOOM = 2.1;

type Props = {
  className?: string;
  visibleLayers: Set<AnatomyLayer>;
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
  quizActive?: boolean;
  /** Hide header/footer chrome when nested in Anatomy Engine. */
  chromeless?: boolean;
};

export function InteractiveAnatomyVideo({
  className,
  visibleLayers,
  selectedId,
  highlightedId,
  onSelect,
  quizActive = false,
  chromeless = false,
}: Props) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  const [playing, setPlaying] = useState(!reduceMotion);
  const [muted, setMuted] = useState(true);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const [error, setError] = useState(false);
  const [duration, setDuration] = useState(ANATOMY_VIDEO_CYCLE_SEC);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const lastSeekedId = useRef<string | null>(null);

  const layerFiltered = useMemo(
    () => filterHotspotsByLayer(ANATOMY_VIDEO_HOTSPOTS, visibleLayers),
    [visibleLayers]
  );

  const focusId = highlightedId ?? selectedId;

  const togglePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) void el.play().then(() => setPlaying(true)).catch(() => setError(true));
    else {
      el.pause();
      setPlaying(false);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen();
  }, []);

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const focusOnStructure = useCallback((structureId: string) => {
    const hotspot = getPrimaryHotspotForStructure(structureId);
    if (!hotspot) return;
    setZoom(FOCUS_ZOOM);
    setPan({
      x: (HOTSPOT_VIEW_CENTER.x - hotspot.cx) * 4,
      y: (HOTSPOT_VIEW_CENTER.y - hotspot.cy) * 4,
    });
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    if (!selectedId || selectedId === lastSeekedId.current) return;
    const el = videoRef.current;
    if (!el) return;
    const target = getSeekTimeForStructure(selectedId);
    try {
      el.currentTime = target % (el.duration || ANATOMY_VIDEO_CYCLE_SEC);
      el.pause();
      setPlaying(false);
    } catch {
      /* metadata not ready */
    }
    focusOnStructure(selectedId);
    lastSeekedId.current = selectedId;
  }, [focusOnStructure, selectedId]);

  const handleWheel = useCallback((e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.12 : 0.12;
    setZoom((z) => {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta));
      if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (zoom <= 1) return;
      dragRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [pan.x, pan.y, zoom]
  );

  const handlePointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    setPan({
      x: drag.panX + (e.clientX - drag.x),
      y: drag.panY + (e.clientY - drag.y),
    });
  }, []);

  const handlePointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }, []);

  const handleScrub = useCallback((value: number) => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = value;
    setCurrentTime(value);
  }, []);

  const handleHotspotSelect = useCallback(
    (structureId: string) => {
      const el = videoRef.current;
      if (el) {
        el.pause();
        setPlaying(false);
      }
      onSelect(structureId);
      focusOnStructure(structureId);
    },
    [focusOnStructure, onSelect]
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "aee-anatomy-video relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-gradient-to-b from-slate-950 via-slate-900 to-black shadow-[var(--shadow-apple-md)]",
        className
      )}
    >
      {!chromeless ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-300">
              Interactive human anatomy
            </p>
            <p className="truncate text-sm font-semibold text-white">
              {focusId ? getHotspotLabel(focusId) : "Click any body part on the real human"}
            </p>
          </div>
          {quizActive ? (
            <span className="rounded-full bg-amber-500/25 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-100">
              Quiz — click the answer on the body
            </span>
          ) : null}
        </div>
      ) : null}

      <div
        ref={viewportRef}
        className="relative min-h-0 flex-1 touch-none overflow-hidden bg-black"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {error ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <p className="text-sm font-medium text-white/90">Video unavailable</p>
            <p className="text-xs text-white/50">
              Place your anatomy video at{" "}
              <code className="rounded bg-white/10 px-1 py-0.5 text-[10px]">
                public/videos/anatomy/anatomy-reference.mp4
              </code>
            </p>
          </div>
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out will-change-transform"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            }}
          >
            <div className="relative h-full w-full">
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
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || ANATOMY_VIDEO_CYCLE_SEC)}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              />

              <svg
                className="absolute inset-0 h-full w-full"
                viewBox={`0 0 ${HOTSPOT_VIEW_WIDTH} ${HOTSPOT_VIEW_HEIGHT}`}
                preserveAspectRatio="xMidYMid meet"
                role="group"
                aria-label="Interactive body part regions"
              >
                {layerFiltered.map((hotspot) => (
                  <HotspotHitArea
                    key={`${hotspot.structureId}-${hotspot.startSec}`}
                    hotspot={hotspot}
                    clickable={isHotspotActiveAtTime(hotspot, currentTime)}
                    onSelect={handleHotspotSelect}
                  />
                ))}
              </svg>
            </div>
          </div>
        )}

      </div>

      {!error ? (
        <>
          <div className="border-t border-white/10 bg-black/40 px-4 py-2">
            <div className="mb-1 flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-white/40">
              <span className="inline-flex items-center gap-1">
                <RotateCw className="h-3 w-3" aria-hidden />
                Spin the body
              </span>
              <span>{currentTime.toFixed(1)}s / {duration.toFixed(1)}s</span>
            </div>
            <input
              type="range"
              min={0}
              max={duration || ANATOMY_VIDEO_CYCLE_SEC}
              step={0.05}
              value={currentTime}
              onChange={(e) => handleScrub(Number(e.target.value))}
              className="aee-anatomy-scrubber h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-violet-500"
              aria-label="Rotate anatomy view"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-3 py-2">
            <div className="flex items-center gap-1">
              <ToolbarButton onClick={togglePlay} label={playing ? "Pause" : "Play"}>
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </ToolbarButton>
              <ToolbarButton onClick={() => setMuted((m) => !m)} label={muted ? "Unmute" : "Mute"}>
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </ToolbarButton>
              <ToolbarButton onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 0.25))} label="Zoom in">
                <ZoomIn className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 0.25))} label="Zoom out">
                <ZoomOut className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton onClick={resetView} label="Reset view">
                <Focus className="h-4 w-4" />
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
        </>
      ) : null}

      {!chromeless ? (
        <p className="border-t border-white/5 px-4 py-2 text-center text-[10px] text-white/40">
          Scroll to zoom · drag when zoomed · scrub timeline to spin · click body parts to learn
        </p>
      ) : null}
    </div>
  );
}

function HotspotHitArea({
  hotspot,
  clickable,
  onSelect,
}: {
  hotspot: AnatomyVideoHotspot;
  clickable: boolean;
  onSelect: (id: string) => void;
}) {
  const meta = getHotspotMeta(hotspot.structureId);
  const label = meta?.name ?? getHotspotLabel(hotspot.structureId);

  return (
    <g
      className={cn(clickable ? "cursor-pointer" : "pointer-events-none")}
      role="button"
      tabIndex={clickable ? 0 : -1}
      aria-hidden={!clickable}
      aria-label={`${label}${meta ? `, ${meta.systemLabel} system` : ""}`}
      onClick={(e) => {
        if (!clickable) return;
        e.stopPropagation();
        onSelect(hotspot.structureId);
      }}
      onKeyDown={(e) => {
        if (!clickable) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(hotspot.structureId);
        }
      }}
    >
      <ellipse
        cx={hotspot.cx}
        cy={hotspot.cy}
        rx={hotspot.rx}
        ry={hotspot.ry}
        fill="transparent"
        stroke="none"
      />
    </g>
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
      title={label}
      className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  );
}
