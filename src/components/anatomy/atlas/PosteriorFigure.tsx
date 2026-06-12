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

export function PosteriorFigure({ visibleLayers, selectedId, highlightedId }: Props) {
  const showSkin = visibleLayers.has("skin");
  const showMuscle = visibleLayers.has("muscle");
  const showBone = visibleLayers.has("bone");

  return (
    <g aria-hidden>
      <ellipse cx={120} cy={508} rx={72} ry={10} fill="rgba(255,255,255,0.04)" />

      {showSkin ? (
        <>
          <path
            d="M 98 278 Q 92 360 96 430 Q 98 490 104 508 L 112 508 Q 108 430 110 350 Q 112 290 118 278 Z"
            fill="url(#atlas-skin)"
            stroke={ATLAS_PALETTE.outlineSoft}
            strokeWidth={0.6}
          />
          <path
            d="M 142 278 Q 148 360 144 430 Q 142 490 136 508 L 128 508 Q 132 430 130 350 Q 128 290 122 278 Z"
            fill="url(#atlas-skin)"
            stroke={ATLAS_PALETTE.outlineSoft}
            strokeWidth={0.6}
          />
          <path
            d="M 72 98 Q 58 140 62 200 Q 64 250 70 278 L 170 278 Q 176 250 178 200 Q 182 140 168 98 Q 150 88 120 88 Q 90 88 72 98 Z"
            fill="url(#atlas-skin)"
            stroke={ATLAS_PALETTE.outlineSoft}
            strokeWidth={0.8}
            filter="url(#atlas-soft-shadow)"
          />
          <path
            d="M 72 98 Q 48 120 42 160 Q 38 200 44 240 L 56 238 Q 52 190 58 140 Q 62 110 72 98 Z"
            fill="url(#atlas-skin)"
            stroke={ATLAS_PALETTE.outlineSoft}
            strokeWidth={0.5}
          />
          <path
            d="M 168 98 Q 192 120 198 160 Q 202 200 196 240 L 184 238 Q 188 190 182 140 Q 178 110 168 98 Z"
            fill="url(#atlas-skin)"
            stroke={ATLAS_PALETTE.outlineSoft}
            strokeWidth={0.5}
          />
          <path
            d="M 104 68 Q 120 72 136 68 L 134 92 Q 120 96 106 92 Z"
            fill="url(#atlas-skin)"
            stroke={ATLAS_PALETTE.outlineSoft}
            strokeWidth={0.5}
          />
          <ellipse
            cx={120}
            cy={44}
            rx={28}
            ry={32}
            fill="url(#atlas-skin)"
            stroke={ATLAS_PALETTE.outlineSoft}
            strokeWidth={0.8}
          />
        </>
      ) : null}

      {showMuscle ? (
        <>
          <path
            d="M 88 108 Q 78 150 82 190 Q 86 220 92 240 L 108 230 Q 100 180 104 130 Z"
            fill="url(#atlas-muscle)"
            opacity={0.8}
          />
          <path
            d="M 152 108 Q 162 150 158 190 Q 154 220 148 240 L 132 230 Q 140 180 136 130 Z"
            fill="url(#atlas-muscle)"
            opacity={0.8}
          />
          <path
            d="M 100 118 Q 120 108 140 118 Q 150 140 140 170 Q 120 178 100 170 Q 90 140 100 118 Z"
            fill="url(#atlas-muscle)"
            opacity={0.65}
          />
        </>
      ) : null}

      {showBone ? (
        <>
          <path
            d="M 48 108 L 46 220 M 194 108 L 196 220"
            fill="none"
            stroke="url(#atlas-bone)"
            strokeWidth={7}
            strokeLinecap="round"
          />
          <path
            d="M 108 290 L 106 500 M 132 290 L 134 500"
            fill="none"
            stroke="url(#atlas-bone)"
            strokeWidth={10}
            strokeLinecap="round"
          />
          <path
            d="M 120 100 L 120 268"
            fill="none"
            stroke="url(#atlas-bone)"
            strokeWidth={11}
            strokeLinecap="round"
          />
        </>
      ) : null}

      <Organ
        id="vertebral-column"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 114 96 L 112 270 M 126 96 L 128 270"
        fill="none"
        stroke="url(#atlas-bone)"
        strokeWidth={6}
      />
      <Organ
        id="spinal-cord"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 120 98 L 120 265"
        fill="none"
        stroke={ATLAS_PALETTE.nerve}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Organ
        id="scapula"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 78 108 Q 68 128 72 148 Q 82 152 90 132 Z M 162 108 Q 172 128 168 148 Q 158 152 150 132 Z"
        fill="url(#atlas-bone)"
      />
      <Organ
        id="kidneys"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 88 196 Q 78 208 82 222 Q 94 226 102 210 Z M 152 196 Q 162 208 158 222 Q 146 226 138 210 Z"
        fill={ATLAS_SYSTEM_FILLS.urinary}
      />
      <Organ
        id="adrenal-glands"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 86 190 Q 94 186 102 190 M 138 190 Q 146 186 154 190"
        fill="none"
        stroke={ATLAS_SYSTEM_FILLS.endocrine}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <Organ
        id="lungs"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 82 112 Q 72 140 78 162 Q 92 158 96 130 Z M 158 112 Q 168 140 162 162 Q 148 158 144 130 Z"
        fill={ATLAS_SYSTEM_FILLS.respiratory}
        fillOpacity={0.6}
      />
      <Organ
        id="diaphragm"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 68 176 Q 120 186 172 176"
        fill="none"
        stroke={ATLAS_SYSTEM_FILLS.muscular}
        strokeWidth={5}
      />
    </g>
  );
}
