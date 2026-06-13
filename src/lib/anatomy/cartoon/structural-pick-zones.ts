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

/** Click targets for structures shown only in the merged structural shell (no organ mesh). */
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
];
