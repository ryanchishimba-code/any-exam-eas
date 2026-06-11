"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Maximize2 } from "lucide-react";
import { getAnatomyStructure } from "@/lib/anatomy";
import {
  buildZygoteBodyUrl,
  getZygoteEntityForStructure,
  ZYGOTE_BODY_ORIGIN,
} from "@/lib/anatomy/zygote-mapping";
import { getHotspotLabel } from "@/lib/anatomy/video-hotspots";
import type { AnatomyLayer } from "@/lib/anatomy/types";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  visibleLayers: Set<AnatomyLayer>;
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
  quizActive?: boolean;
};

/**
 * Photorealistic 3D human via Zygote Body embed.
 * Sidebar/tour selection updates the iframe hash to focus structures.
 * In-iframe clicks stay inside Zygote (cross-origin); use the sidebar to sync pearls.
 */
export function ZygoteBodyViewer({
  className,
  visibleLayers: _visibleLayers,
  selectedId,
  highlightedId,
  onSelect: _onSelect,
  quizActive = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastEntityRef = useRef<string | null>(null);

  const focusId = highlightedId ?? selectedId;
  const focusStructure = focusId ? getAnatomyStructure(focusId) : null;

  const initialSrc = useMemo(() => buildZygoteBodyUrl(), []);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const entity = focusId ? getZygoteEntityForStructure(focusId) : undefined;
    if (!entity || entity === lastEntityRef.current || !iframeRef.current) return;
    lastEntityRef.current = entity;
    iframeRef.current.src = buildZygoteBodyUrl({ entityId: entity });
  }, [focusId]);

  const openFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen();
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "aee-zygote-viewer relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-[#0a0f1a] shadow-[var(--shadow-apple-md)]",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-300">
            Photorealistic 3D human
          </p>
          <p className="truncate text-sm font-semibold text-white">
            {focusId ? getHotspotLabel(focusId) : "Explore the body in 3D — pick a structure in the sidebar"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {quizActive ? (
            <span className="rounded-full bg-amber-500/25 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-100">
              Quiz — find it in 3D, then pick the name in the sidebar
            </span>
          ) : null}
          <a
            href={buildZygoteBodyUrl({
              entityId: focusId ? getZygoteEntityForStructure(focusId) : undefined,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/70 transition hover:bg-white/15 hover:text-white"
          >
            <ExternalLink className="h-3 w-3" aria-hidden />
            Open full
          </a>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 bg-black">
        {!loaded ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0a0f1a]">
            <div className="text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-violet-400/30 border-t-violet-400" />
              <p className="text-xs text-white/50">Loading Zygote Body…</p>
            </div>
          </div>
        ) : null}

        <iframe
          ref={iframeRef}
          src={initialSrc}
          title="Zygote Body 3D anatomy"
          className="h-full w-full border-0"
          allow="fullscreen"
          onLoad={() => setLoaded(true)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-3 py-2">
        <p className="text-[10px] text-white/45">
          Drag to rotate · scroll to zoom · use Zygote&apos;s layer slider to peel skin and muscle
          {focusStructure ? (
            <>
              {" "}
              · focusing <span className="text-white/70">{focusStructure.name}</span>
            </>
          ) : null}
        </p>
        <button
          type="button"
          onClick={openFullscreen}
          className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
          aria-label="Fullscreen"
          title="Fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      <p className="border-t border-white/5 px-4 py-2 text-center text-[10px] text-white/35">
        3D anatomy by{" "}
        <a
          href={ZYGOTE_BODY_ORIGIN}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 underline-offset-2 hover:text-white/70 hover:underline"
        >
          Zygote Body
        </a>
        . Select structures in the sidebar for clinical pearls and practice links.
      </p>
    </div>
  );
}
