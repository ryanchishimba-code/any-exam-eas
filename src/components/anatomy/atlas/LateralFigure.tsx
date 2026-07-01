import { getAnatomyStructure } from "@/lib/anatomy";
import { ATLAS_PALETTE, ATLAS_SYSTEM_FILLS } from "@/lib/anatomy/atlas";
import type { AnatomyLayer } from "@/lib/anatomy/types";
import { cn } from "@/lib/utils";

type Props = {
  visibleLayers: Set<AnatomyLayer>;
  selectedId: string | null;
  highlightedId: string | null;
};

function Organ({
  id,
  visibleLayers,
  selectedId,
  highlightedId,
  d,
  fill,
  stroke = ATLAS_PALETTE.outlineSoft,
  strokeWidth = 0.8,
  fillOpacity = 1,
  strokeLinecap,
}: {
  id: string;
  visibleLayers: Set<AnatomyLayer>;
  selectedId: string | null;
  highlightedId: string | null;
  d: string;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  fillOpacity?: number;
  strokeLinecap?: "butt" | "round" | "square" | "inherit";
}) {
  const structure = getAnatomyStructure(id);
  if (!structure || !visibleLayers.has(structure.layer)) return null;
  const emphasis = selectedId === id || highlightedId === id;
  return (
    <path
      d={d}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={emphasis ? ATLAS_PALETTE.selectedGlow : stroke}
      strokeWidth={emphasis ? 2 : strokeWidth}
      strokeLinecap={strokeLinecap}
      filter={emphasis ? "url(#atlas-selected-glow)" : undefined}
      className={cn("transition-all duration-300")}
      style={{ pointerEvents: "none" }}
    />
  );
}

/** Left lateral profile — nose points left. */
export function LateralFigure({ visibleLayers, selectedId, highlightedId }: Props) {
  const showSkin = visibleLayers.has("skin");
  const showMuscle = visibleLayers.has("muscle");
  const showBone = visibleLayers.has("bone");

  return (
    <g aria-hidden>
      <ellipse cx={112} cy={508} rx={64} ry={10} fill="rgba(255,255,255,0.04)" />

      {showSkin ? (
        <>
          <path
            d="M 100 278 Q 96 360 100 430 Q 104 490 110 508 L 118 508 Q 114 400 116 300 Q 118 278 122 278 Z"
            fill="url(#atlas-skin)"
            stroke={ATLAS_PALETTE.outlineSoft}
            strokeWidth={0.6}
          />
          <path
            d="M 88 98 Q 72 140 76 200 Q 78 250 84 278 L 128 278 Q 134 250 136 200 Q 140 140 124 98 Q 112 90 100 96 Z"
            fill="url(#atlas-skin)"
            stroke={ATLAS_PALETTE.outlineSoft}
            strokeWidth={0.8}
            filter="url(#atlas-soft-shadow)"
          />
          <path
            d="M 100 96 Q 88 110 82 150 Q 78 200 84 240 L 96 236 Q 92 180 96 130 Q 98 108 108 98 Z"
            fill="url(#atlas-skin)"
            stroke={ATLAS_PALETTE.outlineSoft}
            strokeWidth={0.5}
          />
          <path
            d="M 108 68 Q 112 72 118 76 L 116 92 Q 108 94 104 88 Z"
            fill="url(#atlas-skin)"
            stroke={ATLAS_PALETTE.outlineSoft}
            strokeWidth={0.5}
          />
          <path
            d="M 82 36 Q 108 20 128 40 Q 136 56 128 72 Q 108 80 86 68 Q 74 52 82 36 Z"
            fill="url(#atlas-skin)"
            stroke={ATLAS_PALETTE.outlineSoft}
            strokeWidth={0.8}
          />
        </>
      ) : null}

      {showMuscle ? (
        <path
          d="M 90 120 Q 84 160 88 200 Q 94 228 102 240 L 110 230 Q 100 180 104 130 Z"
          fill="url(#atlas-muscle)"
          opacity={0.85}
        />
      ) : null}

      {showBone ? (
        <>
          <path
            d="M 92 108 L 88 228"
            fill="none"
            stroke="url(#atlas-bone)"
            strokeWidth={7}
            strokeLinecap="round"
          />
          <path
            d="M 108 290 L 106 500"
            fill="none"
            stroke="url(#atlas-bone)"
            strokeWidth={10}
            strokeLinecap="round"
          />
        </>
      ) : null}

      <Organ
        id="lungs"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 96 112 Q 86 140 92 162 Q 108 158 112 130 Q 108 112 96 112 Z"
        fill={ATLAS_SYSTEM_FILLS.respiratory}
        fillOpacity={0.75}
      />
      <Organ
        id="heart"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 108 128 Q 124 122 128 142 Q 124 162 110 158 Q 102 148 108 128 Z"
        fill={ATLAS_SYSTEM_FILLS.cardiovascular}
      />
      <Organ
        id="liver"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 104 188 Q 128 184 132 208 Q 124 226 100 218 Z"
        fill={ATLAS_SYSTEM_FILLS.digestive}
      />
      <Organ
        id="stomach"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 92 194 Q 82 208 88 222 Q 100 224 106 208 Z"
        fill="#c9a84c"
      />
      <Organ
        id="kidneys"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 98 198 Q 88 208 94 220 Q 106 218 108 204 Z"
        fill={ATLAS_SYSTEM_FILLS.urinary}
      />
      <Organ
        id="pancreas"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 94 212 Q 112 218 128 212"
        fill="none"
        stroke="#d9b85c"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <Organ
        id="bladder"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 100 248 Q 110 256 118 248 Q 116 266 106 268 Z"
        fill={ATLAS_SYSTEM_FILLS.urinary}
      />
      <Organ
        id="carotid-artery"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 114 76 Q 118 100 116 130"
        fill="none"
        stroke={ATLAS_PALETTE.vessel}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Organ
        id="trachea"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 112 78 L 108 118"
        fill="none"
        stroke="#94c5e8"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </g>
  );
}
