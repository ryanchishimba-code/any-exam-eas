"use client";

import { useMemo, useRef } from "react";
import { ExternalLink } from "lucide-react";
import { getAnatomyStructure } from "@/lib/anatomy";
import { getAllAnatomyStructures } from "@/lib/anatomy/systems/catalog/queries";
import { ANATOMY_ENGINE_PRODUCT_NAME } from "@/lib/anatomy/engine";
import { getHotspotLabel } from "@/lib/anatomy/systems/regions/video";
import { ANATOMY_LAYER_LABELS, type AnatomyLayer } from "@/lib/anatomy/types";
import { cn } from "@/lib/utils";
import { SurfaceHost } from "@/components/anatomy/systems/SurfaceHost";
import type { AnatomySurfaceId } from "@/lib/anatomy/systems/surfaces/types";

type Props = {
  visibleLayers: Set<AnatomyLayer>;
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
  quizActive?: boolean;
  surfaceId?: AnatomySurfaceId;
};

const LAYER_ORDER: AnatomyLayer[] = ["skin", "muscle", "organ", "vascular", "nerve", "bone"];

/** Supportive anatomy — reference human + catalog; not a flagship 3D product. */
export function AnatomyEngineViewer({
  visibleLayers,
  selectedId,
  highlightedId,
  onSelect,
  className,
  quizActive = false,
  surfaceId = "reference-video",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const structures = useMemo(() => getAllAnatomyStructures(), []);
  const focusId = highlightedId ?? selectedId;
  const focusStructure = focusId ? getAnatomyStructure(focusId) : null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "aee-anatomy-engine relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-gradient-to-b from-slate-950 via-slate-900 to-black shadow-[var(--shadow-apple-md)]",
        className
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-300">
            {ANATOMY_ENGINE_PRODUCT_NAME}
          </p>
          <p className="truncate text-sm font-semibold text-white">
            {focusId ? getHotspotLabel(focusId) : "Click a body part or pick from the sidebar"}
          </p>
          {focusStructure ? (
            <p className="truncate text-[11px] capitalize text-white/45">
              {focusStructure.system} · pearls & practice below
            </p>
          ) : null}
        </div>
        {quizActive ? (
          <span className="rounded-full bg-amber-500/25 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-100">
            Quiz
          </span>
        ) : null}
      </header>

      <div className="flex flex-wrap gap-1 border-b border-white/5 px-4 py-1.5">
        {LAYER_ORDER.map((layer) => {
          const on = visibleLayers.has(layer);
          return (
            <span
              key={layer}
              className={cn(
                "rounded px-1.5 py-0.5 text-[9px] font-semibold",
                on ? "text-white/60" : "text-white/25 line-through"
              )}
            >
              {ANATOMY_LAYER_LABELS[layer]}
            </span>
          );
        })}
      </div>

      <div className="relative min-h-0 flex-1">
        <SurfaceHost
          surfaceId={surfaceId}
          structures={structures}
          visibleLayers={visibleLayers}
          selectedId={selectedId}
          highlightedId={highlightedId}
          onSelect={onSelect}
          quizActive={quizActive}
          className="h-full"
        />
      </div>

      <footer className="flex flex-wrap items-center justify-center gap-3 border-t border-white/10 px-4 py-2 text-[10px] text-white/40">
        <span>Spin · zoom · click — then study pearls in the panel</span>
        <a
          href="https://www.zygotebody.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-white/55 hover:text-white/80"
        >
          Full 3D explorer
          <ExternalLink className="h-3 w-3" aria-hidden />
        </a>
      </footer>
    </div>
  );
}
