"use client";

import { Html } from "@react-three/drei";
import { useCallback, useMemo, useState } from "react";
import type { Plane } from "three";
import { BufferGeometry, DoubleSide, MeshBasicMaterial } from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { useAnatomyPointer, useAnatomyHoverReset } from "@/components/anatomy/cartoon/AnatomyPointerProvider";
import { isPrimaryPointerHit } from "@/lib/anatomy/cartoon/anatomy-raycast";
import { FIGURE } from "@/lib/anatomy/cartoon/proportions";
import {
  buildRibCageParts,
} from "@/lib/anatomy/cartoon/skeletal-geometry";
import { buildSkullParts } from "@/lib/anatomy/cartoon/skull-geometry";
import { getAnatomyStructure, getAnatomyStructureByMeshId } from "@/lib/anatomy";
import { getBoneIdsForStructure } from "@/lib/anatomy/bones";
import { getNeuroConnectedStructureIds } from "@/lib/anatomy/neuro-connections";
import type { CtWindowId } from "@/lib/anatomy/ct/ct-windows";
import { CT_ORGAN_HU, CT_WINDOWS, huToHex } from "@/lib/anatomy/ct/ct-windows";
import type { ThreeEvent } from "@react-three/fiber";

type ThoracicBonePart = "skull" | "rib-cage";

const THORACIC_BONE_HU: Record<ThoracicBonePart, number> = {
  skull: CT_ORGAN_HU.skull ?? 420,
  "rib-cage": CT_ORGAN_HU.sternum ?? 310,
};

const PICK_STRUCTURE: Record<ThoracicBonePart, string> = {
  skull: "skull",
  "rib-cage": "sternum",
};

function mergeBoneParts(parts: BufferGeometry[]): BufferGeometry | null {
  const merged = mergeGeometries(parts, false);
  if (merged) merged.computeVertexNormals();
  return merged;
}

function CtThoracicBoneMesh({
  part,
  geometry,
  windowId,
  clippingPlanes,
  visible,
  highlighted,
  selected,
  dimmed,
  onPick,
}: {
  part: ThoracicBonePart;
  geometry: BufferGeometry;
  windowId: CtWindowId;
  clippingPlanes: Plane[];
  visible: boolean;
  highlighted: boolean;
  selected: boolean;
  dimmed: boolean;
  onPick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const emphasized = highlighted || selected || hovered;
  const { setHovering } = useAnatomyPointer();

  const clearHover = useCallback(() => {
    setHovered(false);
    setHovering(false);
  }, [setHovering]);
  useAnatomyHoverReset(clearHover);

  const structureId = PICK_STRUCTURE[part];
  const label =
    getAnatomyStructure(structureId)?.name ??
    getAnatomyStructureByMeshId(structureId)?.name ??
    (part === "skull" ? "Skull" : "Rib cage");

  const material = useMemo(() => {
    const window = CT_WINDOWS[windowId];
    const hu = THORACIC_BONE_HU[part];
    const baseColor = huToHex(hu, window);
    return new MeshBasicMaterial({
      color: emphasized ? "#ddd6fe" : baseColor,
      transparent: dimmed,
      opacity: dimmed ? 0.38 : 0.96,
      depthWrite: !dimmed,
      side: DoubleSide,
      clippingPlanes,
    });
  }, [part, windowId, emphasized, dimmed, clippingPlanes]);

  if (!visible) return null;

  return (
    <group>
      <mesh
        geometry={geometry}
        material={material}
        renderOrder={part === "skull" ? 4 : 3}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          if (!isPrimaryPointerHit(e)) return;
          e.stopPropagation();
          onPick();
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          if (!isPrimaryPointerHit(e)) return;
          e.stopPropagation();
          setHovered(true);
          setHovering(true);
        }}
        onPointerOut={() => {
          setHovered(false);
          setHovering(false);
        }}
      />
      {hovered ? (
        <Html
          center
          distanceFactor={6}
          position={[0, part === "skull" ? 0.45 : 0.15, 0]}
          style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
        >
          <span className="rounded-full border border-violet-400/40 bg-[#0b1220]/92 px-2.5 py-1 text-[11px] font-bold text-violet-50 shadow-[0_0_16px_rgba(167,139,250,0.35)]">
            {label}
          </span>
        </Html>
      ) : null}
    </group>
  );
}

type Props = {
  visible: boolean;
  windowId: CtWindowId;
  clippingPlanes: Plane[];
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (structureId: string) => void;
  systemFiltered?: boolean;
};

/** Procedural skull + rib cage in CT bone window — HuBMAP has no VH thorax GLBs. */
export function CtThoracicBonesRig({
  visible,
  windowId,
  clippingPlanes,
  selectedId,
  highlightedId,
  onSelect,
  systemFiltered = false,
}: Props) {
  const geometries = useMemo(() => {
    const z = FIGURE.centerZ;
    const ctOpts = { ctFidelity: true as const };
    return {
      skull: mergeBoneParts(buildSkullParts(FIGURE, z)),
      ribCage: mergeBoneParts(buildRibCageParts(FIGURE, z, ctOpts)),
    };
  }, []);

  const focusIds = useMemo(
    () => [...getNeuroConnectedStructureIds(highlightedId ?? selectedId)],
    [highlightedId, selectedId]
  );

  const skullFocused = focusIds.some(
    (id: string) =>
      id === "skull" ||
      getAnatomyStructure(id)?.meshId === "skull" ||
      getBoneIdsForStructure("skull").includes(id)
  );
  const ribFocused = focusIds.some(
    (id: string) =>
      id === "sternum" ||
      id.startsWith("rib-") ||
      getAnatomyStructure(id)?.meshId === "sternum" ||
      getBoneIdsForStructure("sternum").includes(id)
  );

  const dimmed = systemFiltered;

  if (!visible) return null;

  return (
    <group>
      {geometries.skull ? (
        <CtThoracicBoneMesh
          part="skull"
          geometry={geometries.skull}
          windowId={windowId}
          clippingPlanes={clippingPlanes}
          visible
          highlighted={skullFocused}
          selected={selectedId === "skull"}
          dimmed={dimmed && !skullFocused}
          onPick={() => onSelect("skull")}
        />
      ) : null}
      {geometries.ribCage ? (
        <CtThoracicBoneMesh
          part="rib-cage"
          geometry={geometries.ribCage}
          windowId={windowId}
          clippingPlanes={clippingPlanes}
          visible
          highlighted={ribFocused}
          selected={selectedId === "sternum"}
          dimmed={dimmed && !ribFocused}
          onPick={() => onSelect("sternum")}
        />
      ) : null}
    </group>
  );
}
