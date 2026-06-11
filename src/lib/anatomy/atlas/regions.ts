import { ANATOMY_STRUCTURES } from "../structures";
import type { AtlasRegion, AtlasView } from "./types";

/**
 * Click targets per view. Coordinates match AtlasFigure viewBox (240×520).
 * Ellipses are invisible hit areas aligned to illustrated anatomy.
 */
export const ATLAS_REGIONS: AtlasRegion[] = [
  // —— Anterior ——
  { structureId: "skull", view: "anterior", cx: 120, cy: 44, rx: 28, ry: 32, primary: true },
  { structureId: "brain", view: "anterior", cx: 120, cy: 46, rx: 22, ry: 24, primary: true },
  { structureId: "thyroid", view: "anterior", cx: 120, cy: 74, rx: 13, ry: 7, primary: true },
  { structureId: "trachea", view: "anterior", cx: 120, cy: 82, rx: 7, ry: 16, primary: true },
  { structureId: "carotid-artery", view: "anterior", cx: 106, cy: 78, rx: 9, ry: 14, primary: true },
  { structureId: "esophagus", view: "anterior", cx: 120, cy: 108, rx: 6, ry: 22, primary: true },
  { structureId: "clavicle", view: "anterior", cx: 120, cy: 92, rx: 54, ry: 7, primary: true },
  { structureId: "lungs", view: "anterior", cx: 120, cy: 132, rx: 50, ry: 34, primary: true },
  { structureId: "heart", view: "anterior", cx: 134, cy: 136, rx: 18, ry: 20, primary: true },
  { structureId: "sternum", view: "anterior", cx: 120, cy: 132, rx: 14, ry: 38, primary: true },
  { structureId: "aorta", view: "anterior", cx: 123, cy: 118, rx: 7, ry: 42, primary: true },
  { structureId: "diaphragm", view: "anterior", cx: 120, cy: 178, rx: 54, ry: 9, primary: true },
  { structureId: "liver", view: "anterior", cx: 152, cy: 198, rx: 24, ry: 20, primary: true },
  { structureId: "stomach", view: "anterior", cx: 96, cy: 202, rx: 20, ry: 18, primary: true },
  { structureId: "spleen", view: "anterior", cx: 86, cy: 192, rx: 14, ry: 15, primary: true },
  { structureId: "gallbladder", view: "anterior", cx: 144, cy: 208, rx: 11, ry: 11, primary: true },
  { structureId: "pancreas", view: "anterior", cx: 118, cy: 214, rx: 30, ry: 9, primary: true },
  { structureId: "duodenum", view: "anterior", cx: 136, cy: 220, rx: 16, ry: 11, primary: true },
  { structureId: "small-intestine", view: "anterior", cx: 120, cy: 228, rx: 22, ry: 16, primary: true },
  { structureId: "colon", view: "anterior", cx: 120, cy: 232, rx: 28, ry: 18, primary: true },
  { structureId: "appendix", view: "anterior", cx: 148, cy: 236, rx: 9, ry: 14, primary: true },
  { structureId: "bladder", view: "anterior", cx: 120, cy: 258, rx: 20, ry: 15, primary: true },
  { structureId: "prostate", view: "anterior", cx: 120, cy: 272, rx: 15, ry: 9, primary: true },
  { structureId: "biceps-brachii", view: "anterior", cx: 68, cy: 142, rx: 14, ry: 30, primary: true },
  { structureId: "humerus", view: "anterior", cx: 64, cy: 148, rx: 11, ry: 34, primary: true },
  { structureId: "femur", view: "anterior", cx: 120, cy: 348, rx: 24, ry: 58, primary: true },
  { structureId: "tibia", view: "anterior", cx: 122, cy: 438, rx: 13, ry: 48, primary: true },

  // —— Posterior ——
  { structureId: "skull", view: "posterior", cx: 120, cy: 44, rx: 28, ry: 32 },
  { structureId: "spinal-cord", view: "posterior", cx: 120, cy: 158, rx: 6, ry: 88, primary: true },
  { structureId: "vertebral-column", view: "posterior", cx: 120, cy: 160, rx: 12, ry: 92, primary: true },
  { structureId: "scapula", view: "posterior", cx: 92, cy: 114, rx: 16, ry: 20 },
  { structureId: "scapula", view: "posterior", cx: 148, cy: 114, rx: 16, ry: 20, primary: true },
  { structureId: "lungs", view: "posterior", cx: 120, cy: 132, rx: 48, ry: 32 },
  { structureId: "diaphragm", view: "posterior", cx: 120, cy: 178, rx: 54, ry: 9 },
  { structureId: "kidneys", view: "posterior", cx: 120, cy: 204, rx: 38, ry: 16, primary: true },
  { structureId: "adrenal-glands", view: "posterior", cx: 120, cy: 192, rx: 34, ry: 7, primary: true },
  { structureId: "femur", view: "posterior", cx: 120, cy: 348, rx: 24, ry: 58 },
  { structureId: "tibia", view: "posterior", cx: 122, cy: 438, rx: 13, ry: 48 },

  // —— Left lateral ——
  { structureId: "skull", view: "left", cx: 108, cy: 44, rx: 30, ry: 32 },
  { structureId: "brain", view: "left", cx: 106, cy: 46, rx: 24, ry: 24 },
  { structureId: "thyroid", view: "left", cx: 112, cy: 76, rx: 10, ry: 7 },
  { structureId: "carotid-artery", view: "left", cx: 118, cy: 80, rx: 8, ry: 14, primary: true },
  { structureId: "trachea", view: "left", cx: 114, cy: 84, rx: 7, ry: 14 },
  { structureId: "esophagus", view: "left", cx: 116, cy: 110, rx: 6, ry: 20 },
  { structureId: "lungs", view: "left", cx: 108, cy: 132, rx: 28, ry: 34 },
  { structureId: "heart", view: "left", cx: 118, cy: 138, rx: 16, ry: 18 },
  { structureId: "liver", view: "left", cx: 112, cy: 200, rx: 22, ry: 18 },
  { structureId: "stomach", view: "left", cx: 104, cy: 206, rx: 18, ry: 16 },
  { structureId: "kidneys", view: "left", cx: 106, cy: 202, rx: 14, ry: 12 },
  { structureId: "pancreas", view: "left", cx: 108, cy: 214, rx: 20, ry: 8 },
  { structureId: "small-intestine", view: "left", cx: 110, cy: 228, rx: 18, ry: 14 },
  { structureId: "colon", view: "left", cx: 112, cy: 232, rx: 22, ry: 16 },
  { structureId: "bladder", view: "left", cx: 110, cy: 258, rx: 16, ry: 14 },
  { structureId: "femur", view: "left", cx: 112, cy: 348, rx: 18, ry: 58, primary: true },
  { structureId: "humerus", view: "left", cx: 108, cy: 148, rx: 12, ry: 34, primary: true },
  { structureId: "biceps-brachii", view: "left", cx: 112, cy: 142, rx: 14, ry: 28 },
];

export function getRegionsForView(view: AtlasView): AtlasRegion[] {
  return ATLAS_REGIONS.filter((r) => r.view === view);
}

export function getPrimaryRegionForStructure(structureId: string): AtlasRegion | undefined {
  const matches = ATLAS_REGIONS.filter((r) => r.structureId === structureId);
  if (matches.length === 0) return undefined;
  return matches.find((r) => r.primary) ?? matches[0];
}

export function getBestViewForStructure(structureId: string): AtlasView {
  return getPrimaryRegionForStructure(structureId)?.view ?? "anterior";
}

export function structureVisibleInView(structureId: string, view: AtlasView): boolean {
  return ATLAS_REGIONS.some((r) => r.structureId === structureId && r.view === view);
}

export function assertAtlasCatalogIntegrity(): string[] {
  return ANATOMY_STRUCTURES.filter(
    (s) => !ATLAS_REGIONS.some((r) => r.structureId === s.id)
  ).map((s) => s.id);
}

export function assertAtlasGeometry(): string[] {
  const { width, height } = { width: 240, height: 520 };
  const issues: string[] = [];
  for (const r of ATLAS_REGIONS) {
    if (r.cx < 0 || r.cx > width || r.cy < 0 || r.cy > height) {
      issues.push(`${r.structureId}@${r.view}: center out of bounds`);
    }
    if (r.rx <= 0 || r.ry <= 0) {
      issues.push(`${r.structureId}@${r.view}: invalid radius`);
    }
  }
  return issues;
}
