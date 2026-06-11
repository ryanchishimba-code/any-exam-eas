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
  fillOpacity = 1,
  stroke = ATLAS_PALETTE.outlineSoft,
  strokeWidth = 0.8,
}: {
  id: string;
  visibleLayers: Set<AnatomyLayer>;
  selectedId: string | null;
  highlightedId: string | null;
  d: string;
  fill: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
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
      filter={emphasis ? "url(#atlas-selected-glow)" : undefined}
      className={cn("transition-all duration-300")}
      style={{ pointerEvents: "none" }}
    />
  );
}

/** Stylized anterior medical illustration — cohesive atlas aesthetic. */
export function AnteriorFigure({ visibleLayers, selectedId, highlightedId }: Props) {
  const showSkin = visibleLayers.has("skin");
  const showMuscle = visibleLayers.has("muscle");
  const showBone = visibleLayers.has("bone");

  return (
    <g aria-hidden>
      {/* Ambient floor */}
      <ellipse cx={120} cy={508} rx={72} ry={10} fill="rgba(255,255,255,0.04)" />

      {/* Legs */}
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
        </>
      ) : null}

      {/* Femurs */}
      {showBone ? (
        <>
          <path
            d="M 108 290 L 106 420 Q 106 470 108 500"
            fill="none"
            stroke="url(#atlas-bone)"
            strokeWidth={10}
            strokeLinecap="round"
          />
          <path
            d="M 132 290 L 134 420 Q 134 470 132 500"
            fill="none"
            stroke="url(#atlas-bone)"
            strokeWidth={10}
            strokeLinecap="round"
          />
        </>
      ) : null}

      {/* Torso skin */}
      {showSkin ? (
        <path
          d="M 72 98 Q 58 140 62 200 Q 64 250 70 278 L 170 278 Q 176 250 178 200 Q 182 140 168 98 Q 150 88 120 88 Q 90 88 72 98 Z"
          fill="url(#atlas-skin)"
          stroke={ATLAS_PALETTE.outlineSoft}
          strokeWidth={0.8}
          filter="url(#atlas-soft-shadow)"
        />
      ) : null}

      {/* Pectoral / abdominal muscles */}
      {showMuscle ? (
        <>
          <path
            d="M 88 108 Q 78 150 82 190 Q 86 220 92 240 L 108 230 Q 100 180 104 130 Z"
            fill="url(#atlas-muscle)"
            opacity={0.85}
          />
          <path
            d="M 152 108 Q 162 150 158 190 Q 154 220 148 240 L 132 230 Q 140 180 136 130 Z"
            fill="url(#atlas-muscle)"
            opacity={0.85}
          />
          <path
            d="M 100 248 Q 120 255 140 248 L 138 270 Q 120 276 102 270 Z"
            fill="url(#atlas-muscle)"
            opacity={0.7}
          />
        </>
      ) : null}

      {/* Arms */}
      {showSkin ? (
        <>
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
        </>
      ) : null}

      {showMuscle ? (
        <path
          d="M 44 150 Q 40 180 46 210 L 54 208 Q 50 175 52 148 Z"
          fill="url(#atlas-muscle)"
          opacity={0.9}
        />
      ) : null}

      {showBone ? (
        <>
          <path
            d="M 48 108 L 46 220"
            fill="none"
            stroke="url(#atlas-bone)"
            strokeWidth={7}
            strokeLinecap="round"
          />
          <path
            d="M 88 92 L 152 92"
            fill="none"
            stroke="url(#atlas-bone)"
            strokeWidth={5}
            strokeLinecap="round"
          />
        </>
      ) : null}

      {/* Neck */}
      {showSkin ? (
        <path
          d="M 104 68 Q 120 72 136 68 L 134 92 Q 120 96 106 92 Z"
          fill="url(#atlas-skin)"
          stroke={ATLAS_PALETTE.outlineSoft}
          strokeWidth={0.5}
        />
      ) : null}

      {/* Head */}
      {showSkin ? (
        <ellipse
          cx={120}
          cy={44}
          rx={28}
          ry={32}
          fill="url(#atlas-skin)"
          stroke={ATLAS_PALETTE.outlineSoft}
          strokeWidth={0.8}
          filter="url(#atlas-soft-shadow)"
        />
      ) : null}

      {showBone ? (
        <ellipse
          cx={120}
          cy={44}
          rx={20}
          ry={24}
          fill="none"
          stroke="url(#atlas-bone)"
          strokeWidth={3}
          opacity={0.7}
        />
      ) : null}

      {/* —— Organs & vessels (layer-gated) —— */}
      <Organ
        id="lungs"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 78 108 Q 68 132 72 158 Q 78 168 92 162 Q 100 140 98 118 Q 92 108 78 108 Z M 162 108 Q 172 132 168 158 Q 162 168 148 162 Q 140 140 142 118 Q 148 108 162 108 Z"
        fill={ATLAS_SYSTEM_FILLS.respiratory}
        fillOpacity={0.75}
      />
      <Organ
        id="heart"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 128 122 Q 148 118 152 138 Q 150 158 132 168 Q 118 158 122 132 Q 124 122 128 122 Z"
        fill={ATLAS_SYSTEM_FILLS.cardiovascular}
      />
      <Organ
        id="liver"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 132 188 Q 168 186 172 208 Q 168 228 140 224 Q 128 218 132 188 Z"
        fill={ATLAS_SYSTEM_FILLS.digestive}
      />
      <Organ
        id="stomach"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 88 192 Q 72 200 76 218 Q 88 228 102 218 Q 108 204 88 192 Z"
        fill="#c9a84c"
      />
      <Organ
        id="spleen"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 74 186 Q 66 198 70 212 Q 80 216 86 200 Z"
        fill={ATLAS_SYSTEM_FILLS.lymphatic}
      />
      <Organ
        id="gallbladder"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 138 210 Q 148 208 150 220 Q 144 230 136 224 Z"
        fill="#9a8f3a"
      />
      <Organ
        id="pancreas"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 92 214 Q 120 220 148 214 Q 142 226 98 224 Z"
        fill="#d9b85c"
      />
      <Organ
        id="bladder"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 104 248 Q 120 254 136 248 Q 134 268 120 272 Q 106 268 104 248 Z"
        fill={ATLAS_SYSTEM_FILLS.urinary}
      />
      <Organ
        id="thyroid"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 108 72 Q 120 76 132 72 Q 128 80 120 82 Q 112 80 108 72 Z"
        fill={ATLAS_SYSTEM_FILLS.endocrine}
      />
      <Organ
        id="aorta"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 120 88 L 122 230"
        fill="none"
        stroke={ATLAS_PALETTE.vessel}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <Organ
        id="trachea"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 117 76 L 115 118 M 123 76 L 125 118"
        fill="none"
        stroke="#94c5e8"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Organ
        id="esophagus"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 120 78 Q 118 100 120 130"
        fill="none"
        stroke="#c4b5fd"
        strokeWidth={2.5}
        strokeLinecap="round"
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
        strokeLinecap="round"
      />
      <Organ
        id="sternum"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 117 100 L 115 168 M 123 100 L 125 168"
        fill="none"
        stroke="url(#atlas-bone)"
        strokeWidth={5}
      />
      <Organ
        id="brain"
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        d="M 100 32 Q 120 24 140 32 Q 148 44 140 56 Q 120 62 100 56 Q 92 44 100 32 Z"
        fill={ATLAS_SYSTEM_FILLS.nervous}
        fillOpacity={0.55}
      />
    </g>
  );
}
