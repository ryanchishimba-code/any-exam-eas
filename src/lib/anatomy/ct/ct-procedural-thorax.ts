/**
 * CT atlas procedural thorax — VH v1.2 has no rib/sternum GLBs; render figure-space bones in CT window.
 */

import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { FIGURE } from "../cartoon/proportions";
import {
  buildRibCageParts,
  buildSingleClavicleParts,
  buildSternumBoneParts,
} from "../cartoon/skeletal-geometry";

export type CtProceduralThoraxSegment = {
  id: string;
  /** Structure ids that highlight this segment in CT mode. */
  structureIds: string[];
  meshId: string;
};

export const CT_PROCEDURAL_THORAX_SEGMENTS: CtProceduralThoraxSegment[] = [
  {
    id: "ct-sternum",
    structureIds: ["sternum-bone", "sternum"],
    meshId: "sternum",
  },
  {
    id: "ct-clavicle-r",
    structureIds: ["clavicle-r", "clavicle"],
    meshId: "clavicle",
  },
  {
    id: "ct-clavicle-l",
    structureIds: ["clavicle-l", "clavicle"],
    meshId: "clavicle",
  },
  {
    id: "ct-rib-cage",
    structureIds: [
      "rib-1-r",
      "rib-1-l",
      "rib-2-r",
      "rib-2-l",
      "rib-3-r",
      "rib-3-l",
      "rib-4-r",
      "rib-4-l",
      "rib-5-r",
      "rib-5-l",
      "rib-6-r",
      "rib-6-l",
      "rib-7-r",
      "rib-7-l",
      "rib-8-r",
      "rib-8-l",
      "rib-9-r",
      "rib-9-l",
      "rib-10-r",
      "rib-10-l",
      "rib-11-r",
      "rib-11-l",
      "rib-12-r",
      "rib-12-l",
    ],
    meshId: "rib",
  },
];

function mergeSegmentParts(parts: THREE.BufferGeometry[]): THREE.BufferGeometry | null {
  if (parts.length === 0) return null;
  const merged = mergeGeometries(parts, false);
  if (merged) merged.computeVertexNormals();
  return merged;
}

export function buildCtProceduralThoraxGeometries(): Map<string, THREE.BufferGeometry> {
  const z = FIGURE.centerZ;
  const map = new Map<string, THREE.BufferGeometry>();

  const sternum = mergeSegmentParts(buildSternumBoneParts(FIGURE, z));
  if (sternum) map.set("ct-sternum", sternum);

  const clavicleR = mergeSegmentParts(buildSingleClavicleParts(-1, FIGURE, z));
  if (clavicleR) map.set("ct-clavicle-r", clavicleR);

  const clavicleL = mergeSegmentParts(buildSingleClavicleParts(1, FIGURE, z));
  if (clavicleL) map.set("ct-clavicle-l", clavicleL);

  const ribCage = mergeSegmentParts(buildRibCageParts(FIGURE, z));
  if (ribCage) map.set("ct-rib-cage", ribCage);

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
