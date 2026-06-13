import { FIGURE } from "./proportions";
import type { AnatomyLayer } from "@/lib/anatomy/types";

export type StructuralPickZone = {
  structureId: string;
  label: string;
  layer: AnatomyLayer;
  position: [number, number, number];
  /** Invisible hit box half-extents. */
  scale: [number, number, number];
  bilateral?: boolean;
};

const z = FIGURE.centerZ;

/** Click targets aligned to merged muscle / vascular shells (catalog structure ids). */
export const STRUCTURAL_PICK_ZONES: StructuralPickZone[] = [
  {
    structureId: "biceps-brachii",
    label: "Biceps Brachii",
    layer: "muscle",
    position: [0.33, 0.7, z + 0.05],
    scale: [0.09, 0.2, 0.09],
    bilateral: true,
  },
  {
    structureId: "diaphragm",
    label: "Diaphragm",
    layer: "muscle",
    position: [0, FIGURE.waistY + 0.2, z - 0.02],
    scale: [0.24, 0.06, 0.14],
  },
  {
    structureId: "aorta",
    label: "Aorta",
    layer: "vascular",
    position: [0.01, FIGURE.chestY + 0.08, z - 0.03],
    scale: [0.08, 0.38, 0.08],
  },
  {
    structureId: "carotid-artery",
    label: "Carotid Arteries",
    layer: "vascular",
    position: [0.045, FIGURE.chestY + 0.28, z + 0.04],
    scale: [0.05, 0.16, 0.05],
    bilateral: true,
  },
];
