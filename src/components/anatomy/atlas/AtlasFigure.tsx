"use client";

import { AnimatePresence, motion } from "framer-motion";
import { getAnatomyStructure, structureVisibleInLayers } from "@/lib/anatomy";
import { ATLAS_VIEWBOX, getRegionsForView, type AtlasView } from "@/lib/anatomy/atlas";
import { getHotspotLabel, getHotspotMeta } from "@/lib/anatomy/video-hotspots";
import type { AnatomyLayer } from "@/lib/anatomy/types";
import { AtlasDefs } from "./AtlasDefs";
import { AnteriorFigure } from "./AnteriorFigure";
import { LateralFigure } from "./LateralFigure";
import { PosteriorFigure } from "./PosteriorFigure";

type Props = {
  view: AtlasView;
  visibleLayers: Set<AnatomyLayer>;
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
};

export function AtlasFigure({
  view,
  visibleLayers,
  selectedId,
  highlightedId,
  onSelect,
}: Props) {
  const regions = getRegionsForView(view);

  return (
    <svg
      viewBox={`0 0 ${ATLAS_VIEWBOX.width} ${ATLAS_VIEWBOX.height}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      role="group"
      aria-label="Interactive anatomy illustration"
    >
      <AtlasDefs />
      <rect width={ATLAS_VIEWBOX.width} height={ATLAS_VIEWBOX.height} fill="url(#atlas-bg-radial)" />

      <AnimatePresence mode="wait">
        <motion.g
          key={view}
          initial={{ opacity: 0, x: view === "posterior" ? 12 : view === "left" ? -12 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          {view === "anterior" ? (
            <AnteriorFigure
              visibleLayers={visibleLayers}
              selectedId={selectedId}
              highlightedId={highlightedId}
            />
          ) : null}
          {view === "posterior" ? (
            <PosteriorFigure
              visibleLayers={visibleLayers}
              selectedId={selectedId}
              highlightedId={highlightedId}
            />
          ) : null}
          {view === "left" ? (
            <LateralFigure
              visibleLayers={visibleLayers}
              selectedId={selectedId}
              highlightedId={highlightedId}
            />
          ) : null}
        </motion.g>
      </AnimatePresence>

      {/* Invisible click targets — no labels or markings */}
      <g role="presentation">
        {regions.map((region) => {
          const structure = getAnatomyStructure(region.structureId);
          if (!structure || !structureVisibleInLayers(structure, visibleLayers)) return null;

          const meta = getHotspotMeta(region.structureId);
          const label = meta?.name ?? getHotspotLabel(region.structureId);

          return (
            <ellipse
              key={`${region.view}-${region.structureId}-${region.cx}`}
              cx={region.cx}
              cy={region.cy}
              rx={region.rx}
              ry={region.ry}
              fill="transparent"
              stroke="none"
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`${label}${meta ? `, ${meta.systemLabel} system` : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(region.structureId);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(region.structureId);
                }
              }}
            />
          );
        })}
      </g>
    </svg>
  );
}
