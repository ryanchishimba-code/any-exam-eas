/**
 * CT atlas procedural thorax — VH v1.2 has no rib/sternum GLBs; render figure-space bones in CT window.
 */

import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { FIGURE } from "../cartoon/proportions";
import {
  buildSingleRibParts,
  buildSingleClavicleParts,
  buildSternumBoneParts,
} from "../cartoon/skeletal-geometry";

export type CtProceduralThoraxSegment = {
  id: string;
  /** Structure ids that highlight this segment in CT mode. */
  structureIds: string[];
  meshId: string;
};

/** Nudge procedural thorax to match HuBMAP lung/heart bbox after atlas fit (figure space). */
export const CT_THORAX_REGISTRATION = {
  yOffset: -0.042,
  zOffset: 0.006,
} as const;

const CT_OPTS = { ctFidelity: true as const };

function ribSegment(ribIndex: number, side: "r" | "l"): CtProceduralThoraxSegment {
  const n = ribIndex + 1;
  const id = `rib-${n}-${side}`;
  return { id: `ct-${id}`, structureIds: [id], meshId: "rib" };
}

/** Sternum, clavicles, and 24 individual ribs for CT bone window / MPR. */
export function getCtProceduralThoraxSegments(): CtProceduralThoraxSegment[] {
  const ribs: CtProceduralThoraxSegment[] = [];
  for (let i = 0; i < 12; i++) {
    ribs.push(ribSegment(i, "r"), ribSegment(i, "l"));
  }
  return [
    { id: "ct-sternum", structureIds: ["sternum-bone", "sternum"], meshId: "sternum" },
    { id: "ct-clavicle-r", structureIds: ["clavicle-r", "clavicle"], meshId: "clavicle" },
    { id: "ct-clavicle-l", structureIds: ["clavicle-l", "clavicle"], meshId: "clavicle" },
    ...ribs,
  ];
}

/** @deprecated use getCtProceduralThoraxSegments() */
export const CT_PROCEDURAL_THORAX_SEGMENTS = getCtProceduralThoraxSegments();

function mergeSegmentParts(parts: THREE.BufferGeometry[]): THREE.BufferGeometry | null {
  if (parts.length === 0) return null;
  const merged = mergeGeometries(parts, false);
  if (merged) merged.computeVertexNormals();
  return merged;
}

export function buildCtProceduralThoraxGeometries(): Map<string, THREE.BufferGeometry> {
  const z = FIGURE.centerZ;
  const map = new Map<string, THREE.BufferGeometry>();

  const sternum = mergeSegmentParts(buildSternumBoneParts(FIGURE, z, CT_OPTS));
  if (sternum) map.set("ct-sternum", sternum);

  const clavicleR = mergeSegmentParts(buildSingleClavicleParts(-1, FIGURE, z, CT_OPTS));
  if (clavicleR) map.set("ct-clavicle-r", clavicleR);

  const clavicleL = mergeSegmentParts(buildSingleClavicleParts(1, FIGURE, z, CT_OPTS));
  if (clavicleL) map.set("ct-clavicle-l", clavicleL);

  for (let i = 0; i < 12; i++) {
    for (const [side, sx] of [
      ["r", -1],
      ["l", 1],
    ] as const) {
      const rib = mergeSegmentParts(buildSingleRibParts(i, sx, FIGURE, z, CT_OPTS));
      if (rib) map.set(`ct-rib-${i + 1}-${side}`, rib);
    }
  }

  return map;
}

export function ctThoraxSegmentHighlighted(segment: CtProceduralThoraxSegment, focusStructureIds: Set<string>): boolean {
  if (focusStructureIds.size === 0) return false;
  return segment.structureIds.some((id) => focusStructureIds.has(id));
}

export function ctThoraxSegmentPickStructure(segment: CtProceduralThoraxSegment): string {
  return segment.structureIds[0]!;
}

export function ctThoraxSegmentMatchesRibSelection(structureId: string | null): boolean {
  return structureId !== null && /^rib-\d+-[rl]$/.test(structureId);
}
