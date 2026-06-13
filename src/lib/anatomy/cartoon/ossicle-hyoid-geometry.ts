/**
 * Ear ossicles and hyoid — shaped meshes for the remaining axial bones.
 */

import * as THREE from "three";
import type { FIGURE as FigureConst } from "./proportions";
import { skullCatalogPointToWorld } from "./skull-bone-geometry";

type Figure = typeof FigureConst;

export const OSSICLE_NAMES = ["malleus", "incus", "stapes"] as const;
export type OssicleName = (typeof OSSICLE_NAMES)[number];

const OSSICLE_ID_PATTERN =
  /^(malleus|incus|stapes)-[rl]$/;

export function parseOssicleName(boneId: string): OssicleName | null {
  const match = OSSICLE_ID_PATTERN.exec(boneId);
  return (match?.[1] as OssicleName | undefined) ?? null;
}

export function parseOssicleSide(boneId: string): -1 | 1 | null {
  if (boneId.endsWith("-r")) return -1;
  if (boneId.endsWith("-l")) return 1;
  return null;
}

/** Middle-ear ossicle positions in catalog skull space (±X lateral, Y superior, Z anterior). */
export const OSSICLE_CATALOG_POSITIONS: Record<OssicleName, [number, number, number]> = {
  malleus: [0.58, -0.02, 0.14],
  incus: [0.58, 0.02, 0.1],
  stapes: [0.58, -0.04, 0.17],
};

export function ossicleWorldCenter(name: OssicleName, side: -1 | 1, f: Figure, z: number): THREE.Vector3 {
  const [x, y, cz] = OSSICLE_CATALOG_POSITIONS[name];
  return skullCatalogPointToWorld(side * x, y, cz, f, z);
}

export function buildMalleusParts(center: THREE.Vector3, sx: -1 | 1): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const head = new THREE.SphereGeometry(0.0042, 8, 8);
  head.scale(1.15, 0.82, 0.95);
  head.translate(center.x, center.y + 0.0025, center.z);
  parts.push(head);

  const neck = new THREE.CapsuleGeometry(0.0011, 0.003, 4, 6);
  neck.translate(center.x + sx * 0.0015, center.y, center.z - 0.001);
  parts.push(neck);

  const handle = new THREE.CapsuleGeometry(0.001, 0.0055, 4, 6);
  handle.rotateZ(Math.PI / 2);
  handle.translate(center.x + sx * 0.0045, center.y - 0.001, center.z - 0.002);
  parts.push(handle);

  return parts;
}

export function buildIncusParts(center: THREE.Vector3, sx: -1 | 1): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const body = new THREE.BoxGeometry(0.0045, 0.0038, 0.0032);
  body.translate(center.x, center.y, center.z);
  parts.push(body);

  const longProc = new THREE.CapsuleGeometry(0.0009, 0.0048, 4, 6);
  longProc.rotateZ(sx * 0.35);
  longProc.translate(center.x + sx * 0.003, center.y + 0.002, center.z - 0.001);
  parts.push(longProc);

  const shortProc = new THREE.CapsuleGeometry(0.00085, 0.0035, 4, 6);
  shortProc.rotateZ(sx * -0.55);
  shortProc.translate(center.x + sx * 0.002, center.y - 0.0025, center.z + 0.0015);
  parts.push(shortProc);

  return parts;
}

export function buildStapesParts(center: THREE.Vector3, sx: -1 | 1): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const footplate = new THREE.BoxGeometry(0.0028, 0.0012, 0.0034);
  footplate.rotateY(sx * 0.18);
  footplate.translate(center.x, center.y - 0.0015, center.z + 0.001);
  parts.push(footplate);

  const arch = new THREE.TorusGeometry(0.0018, 0.00055, 6, 12, Math.PI * 0.92);
  arch.rotateY(sx * 0.22);
  arch.rotateX(Math.PI / 2);
  arch.translate(center.x, center.y + 0.001, center.z - 0.001);
  parts.push(arch);

  const head = new THREE.SphereGeometry(0.0014, 6, 6);
  head.translate(center.x + sx * 0.001, center.y + 0.0022, center.z - 0.0015);
  parts.push(head);

  return parts;
}

export function buildOssicleParts(name: OssicleName, center: THREE.Vector3, sx: -1 | 1): THREE.BufferGeometry[] {
  switch (name) {
    case "malleus":
      return buildMalleusParts(center, sx);
    case "incus":
      return buildIncusParts(center, sx);
    case "stapes":
      return buildStapesParts(center, sx);
  }
}

/** U-shaped hyoid with body and greater/lesser horns. */
export function buildHyoidParts(center: THREE.Vector3): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const body = new THREE.CapsuleGeometry(0.004, 0.034, 6, 10);
  body.rotateZ(Math.PI / 2);
  body.translate(center.x, center.y, center.z);
  parts.push(body);

  for (const sx of [-1, 1] as const) {
    const horn = new THREE.CapsuleGeometry(0.0028, 0.014, 4, 8);
    horn.rotateZ(sx * 0.85);
    horn.translate(center.x + sx * 0.022, center.y + 0.004, center.z - 0.002);
    parts.push(horn);

    const lesser = new THREE.CapsuleGeometry(0.0018, 0.006, 4, 6);
    lesser.rotateZ(sx * 0.4);
    lesser.translate(center.x + sx * 0.012, center.y - 0.003, center.z + 0.003);
    parts.push(lesser);
  }

  return parts;
}

export function buildOssicleWorldParts(boneId: string, f: Figure, z: number): THREE.BufferGeometry[] | null {
  const name = parseOssicleName(boneId);
  const sx = parseOssicleSide(boneId);
  if (!name || sx === null) return null;
  return buildOssicleParts(name, ossicleWorldCenter(name, sx, f, z), sx);
}

export function buildHyoidWorldParts(f: Figure, z: number): THREE.BufferGeometry[] {
  const center = new THREE.Vector3(0, f.neckY - 0.02, z + 0.06);
  return buildHyoidParts(center);
}
