/**
 * Facial landmarks — Vitruvian thirds + classical head-unit (7.5 Hu) canon.
 * Coordinates in catalog skull space (reference radius = CATALOG_SKULL_RADIUS).
 *
 * References: bizygomatic ≈ 2× head radius; IPD ≈ 31% of face width;
 * one eye width ≈ face width / 5; mouth width ≈ 1.5× IPD at rest.
 */

import { CATALOG_SKULL_RADIUS } from "@/lib/anatomy/cartoon/skull-geometry";
import { FIGURE } from "@/lib/anatomy/cartoon/proportions";

const R = CATALOG_SKULL_RADIUS;

/** Feature layout in catalog skull units (skull radius ≈ 0.8). */
export const FACE_CATALOG = {
  /** Interpupillary half-distance — ~0.31× bizygomatic width. */
  eyeX: R * 0.3,
  /** Eye line — slightly above vertical midline (classic “halfway” crown-to-chin). */
  eyeY: R * 0.075,
  eyeZ: R * 0.55,
  eyeGlobeRadius: R * 0.105,
  irisRadius: R * 0.064,
  pupilRadius: R * 0.028,
  socketRadius: R * 0.24,
  browY: R * 0.22,
  browX: R * 0.32,
  noseBridgeY: R * 0.04,
  noseTipY: -R * 0.08,
  noseZ: R * 0.58,
  nostrilX: R * 0.07,
  mouthY: -R * 0.28,
  mouthZ: R * 0.5,
  lipRadius: R * 0.17,
  earX: R * 0.88,
  earY: -R * 0.02,
  earZ: R * 0.05,
} as const;

export type FigureFaceTransform = {
  position: [number, number, number];
  scale: [number, number, number];
};

/** Maps catalog face features onto the FIGURE head oval (matches skull scaling). */
export function getFigureFaceTransform(f: typeof FIGURE = FIGURE): FigureFaceTransform {
  const uniform = f.headRadius / R;
  return {
    position: [0, f.headY, f.centerZ + 0.02],
    scale: [
      uniform,
      uniform * (f.headScaleY / 1.36),
      uniform * (f.headScaleZ / 0.92),
    ],
  };
}
