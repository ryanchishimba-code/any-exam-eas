/**
 * Hand / foot bone placement — shared by clickable skeleton instances and mesh builders.
 */

import * as THREE from "three";
import type { FIGURE as FigureConst } from "./proportions";

type Figure = typeof FigureConst;

export const CARPAL_NAMES = [
  "scaphoid",
  "lunate",
  "triquetrum",
  "pisiform",
  "trapezium",
  "trapezoid",
  "capitate",
  "hamate",
] as const;

export type CarpalName = (typeof CARPAL_NAMES)[number];

export const TARSAL_NAMES = [
  "calcaneus",
  "talus",
  "navicular",
  "cuboid",
  "medial-cuneiform",
  "intermediate-cuneiform",
  "lateral-cuneiform",
] as const;

export type TarsalName = (typeof TARSAL_NAMES)[number];

export function palmFromWrist(wrist: THREE.Vector3): THREE.Vector3 {
  return wrist.clone().add(new THREE.Vector3(0, -0.028, 0.018));
}

export function carpalPosition(index: number, palm: THREE.Vector3, sx: -1 | 1): THREE.Vector3 {
  const row = index < 4 ? 0 : 1;
  const col = index % 4;
  return palm.clone().add(new THREE.Vector3(sx * (0.02 - col * 0.012), -0.004 - row * 0.008, 0.004 + col * 0.004));
}

export function tarsalOffsets(sx: -1 | 1): readonly (readonly [number, number, number])[] {
  return [
    [0, 0.008, -0.02],
    [0, 0.012, 0.015],
    [sx * -0.012, 0.006, 0.028],
    [sx * 0.014, 0.004, 0.022],
    [sx * -0.018, 0.005, 0.038],
    [sx * -0.006, 0.005, 0.04],
    [sx * 0.008, 0.005, 0.039],
  ] as const;
}

export function tarsalPosition(index: number, ankle: THREE.Vector3, sx: -1 | 1, f: Figure): THREE.Vector3 {
  const footY = f.footY + 0.016;
  const z = f.centerZ;
  const p = tarsalOffsets(sx)[index]!;
  return new THREE.Vector3(ankle.x + p[0], footY + p[1], z + p[2]);
}

export function parseCarpalName(boneId: string): CarpalName | null {
  const match = /^(scaphoid|lunate|triquetrum|pisiform|trapezium|trapezoid|capitate|hamate)-[rl]$/.exec(boneId);
  return (match?.[1] as CarpalName | undefined) ?? null;
}

export function parseTarsalName(boneId: string): TarsalName | null {
  const match =
    /^(calcaneus|talus|navicular|cuboid|medial-cuneiform|intermediate-cuneiform|lateral-cuneiform)-[rl]$/.exec(boneId);
  return (match?.[1] as TarsalName | undefined) ?? null;
}

export function parsePhalanxKind(
  boneId: string
): { kind: "hand" | "toe"; distal: boolean } | null {
  const hand = /^phalanx-\d+-\d+-[rl]$/.exec(boneId);
  if (hand) {
    const digit = Number.parseInt(boneId.split("-")[1]!, 10);
    const segment = Number.parseInt(boneId.split("-")[2]!, 10);
    const distal = digit === 1 ? segment === 2 : segment === 3;
    return { kind: "hand", distal };
  }
  const toe = /^toe-phalanx-\d+-\d+-[rl]$/.exec(boneId);
  if (toe) {
    const digit = Number.parseInt(boneId.split("-")[2]!, 10);
    const segment = Number.parseInt(boneId.split("-")[3]!, 10);
    const distal = digit === 1 ? segment === 2 : segment === 3;
    return { kind: "toe", distal };
  }
  return null;
}

export function parseMetacarpal(boneId: string): boolean {
  return /^mc-\d+-[rl]$/.test(boneId);
}

export function parseMetatarsal(boneId: string): boolean {
  return /^mt-\d+-[rl]$/.test(boneId);
}
