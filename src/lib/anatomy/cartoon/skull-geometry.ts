/**
 * Procedural human skull — calvaria, orbits, nasal aperture, zygomatic arches, mandible.
 * Built in catalog space (radius ≈ 0.8) to align with HumanFaceFeatures orbit positions.
 */

import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { FIGURE } from "./proportions";
import {
  applySkullWorldTransform,
  buildCalvariaCatalogParts,
  buildOrbitRimCatalogParts,
  buildSingleSkullBoneCatalogParts,
  CATALOG_SKULL_RADIUS,
  SKULL_BONE_IDS,
} from "./skull-bone-geometry";

export { SKULL_BONE_IDS, parseSkullBoneId, buildSkullBoneWorldParts, CATALOG_SKULL_RADIUS } from "./skull-bone-geometry";

type Figure = typeof FIGURE;

/**
 * Skull parts in catalog space — origin near cranial center, +Z anterior, +Y superior.
 */
export function buildSkullGeometryParts(r: number = CATALOG_SKULL_RADIUS): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [...buildCalvariaCatalogParts(r)];

  for (const id of SKULL_BONE_IDS) {
    parts.push(...buildSingleSkullBoneCatalogParts(id, r));
  }

  for (const sx of [-1, 1] as const) {
    parts.push(...buildOrbitRimCatalogParts(sx, r));
  }

  const piriform = new THREE.BoxGeometry(r * 0.14, r * 0.16, r * 0.06);
  piriform.translate(0, -r * 0.04, r * 0.58);
  parts.push(piriform);

  const maxillaCenter = new THREE.BoxGeometry(r * 0.38, r * 0.06, r * 0.07);
  maxillaCenter.translate(0, -r * 0.28, r * 0.46);
  parts.push(maxillaCenter);

  const teethShelf = new THREE.BoxGeometry(r * 0.62, r * 0.03, r * 0.05);
  teethShelf.translate(0, -r * 0.32, r * 0.5);
  parts.push(teethShelf);

  return parts;
}

export function buildCatalogSkullGeometry(): THREE.BufferGeometry | null {
  const merged = mergeGeometries(buildSkullGeometryParts(CATALOG_SKULL_RADIUS), false);
  if (merged) merged.computeVertexNormals();
  return merged;
}

/** World-space skull aligned to FIGURE head position. */
export function buildSkullParts(f: Figure, z: number): THREE.BufferGeometry[] {
  const parts = buildSkullGeometryParts(CATALOG_SKULL_RADIUS);
  applySkullWorldTransform(parts, f, z);
  return parts;
}

export function buildSkullGeometry(f: Figure, z: number): THREE.BufferGeometry | null {
  const merged = mergeGeometries(buildSkullParts(f, z), false);
  if (merged) merged.computeVertexNormals();
  return merged;
}
