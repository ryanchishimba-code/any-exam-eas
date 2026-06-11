"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent,
} from "react";
import { useReducedMotion } from "framer-motion";
import { Focus, Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import {
  ATLAS_VIEW_LABELS,
  ATLAS_VIEWS,
  getBestViewForStructure,
  type AtlasView,
} from "@/lib/anatomy/atlas";
import { getHotspotLabel } from "@/lib/anatomy/video-hotspots";
import type { AnatomyLayer } from "@/lib/anatomy/types";
import { cn } from "@/lib/utils";
import { AtlasFigure } from "./atlas/AtlasFigure";

const MIN_ZOOM = 1;
const MAX_ZOOM = 2.6;
const FOCUS_ZOOM = 2;

type Props = {
  className?: string;
  visibleLayers: Set<AnatomyLayer>;
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
  quizActive?: boolean;
};

export function InteractiveAnatomyAtlas({
  className,
  visibleLayers,
  selectedId,
  highlightedId,
  onSelect,
  quizActive = false,
}: Props) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const lastFocusedId = useRef<string | null>(null);

  const [view, setView] = useState<AtlasView>("anterior");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const focusId = highlightedId ?? selectedId;

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const focusOnStructure = useCallback((structureId: string) => {
    const bestView = getBestViewForStructure(structureId);
    setView(bestView);
    setZoom(FOCUS_ZOOM);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (!selectedId || selectedId === lastFocusedId.current) return;
    focusOnStructure(selectedId);
    lastFocusedId.current = selectedId;
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

  const handleSelect = useCallback(
    (structureId: string) => {
      onSelect(structureId);
      focusOnStructure(structureId);
    },
    [focusOnStructure, onSelect]
  );

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "aee-anatomy-atlas relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-gradient-to-b from-slate-950 via-slate-900 to-black shadow-[var(--shadow-apple-md)]",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-300">
            Anatomy atlas
          </p>
          <p className="truncate text-sm font-semibold text-white">
            {focusId ? getHotspotLabel(focusId) : "Click any body part on the illustrated human"}
          </p>
        </div>
        {quizActive ? (
          <span className="rounded-full bg-amber-500/25 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-100">
            Quiz — click the answer on the body
          </span>
        ) : null}
      </div>

      <div className="flex gap-1 border-b border-white/10 px-3 py-2">
        {ATLAS_VIEWS.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => {
              setView(v);
              if (zoom > 1 && !selectedId) resetView();
            }}
            className={cn(
              "flex-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition sm:text-xs",
              view === v
                ? "bg-violet-500/30 text-violet-100 shadow-sm"
                : "text-white/50 hover:bg-white/10 hover:text-white/80"
            )}
          >
            {ATLAS_VIEW_LABELS[v]}
          </button>
        ))}
      </div>

      <div
        className="relative min-h-0 flex-1 touch-none overflow-hidden"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center will-change-transform",
            !reduceMotion && "transition-transform duration-300 ease-out"
          )}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          <div className="h-full w-full max-w-md px-2 py-3 sm:max-w-lg">
            <AtlasFigure
              view={view}
              visibleLayers={visibleLayers}
              selectedId={selectedId}
              highlightedId={highlightedId}
              onSelect={handleSelect}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-3 py-2">
        <div className="flex items-center gap-1">
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
        <span className="text-[10px] font-medium uppercase tracking-wide text-white/40">
          {ATLAS_VIEW_LABELS[view]} view
        </span>
      </div>

      <p className="border-t border-white/5 px-4 py-2 text-center text-[10px] text-white/40">
        Switch views · scroll to zoom · drag when zoomed · click body parts to learn
      </p>
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
      title={label}
      className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  );
}
