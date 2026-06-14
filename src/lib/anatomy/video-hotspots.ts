import { isIndividual3dBoneStructure } from "./bones/catalog-utils";
import { ANATOMY_STRUCTURES } from "./structures";
import { ANATOMY_SYSTEM_LABELS, type AnatomyLayer, type AnatomySystem } from "./types";

const structureById = new Map(ANATOMY_STRUCTURES.map((s) => [s.id, s]));

/**
 * Clickable regions on the real human in the reference anatomy video.
 * Coordinates use a portrait viewBox matching the video aspect ratio (464×688).
 * The Grok export is a screen recording — the body sits left-of-center (~35% x).
 * Scrubbing spins anterior → posterior → lateral over ~10 s.
 */
export const ANATOMY_VIDEO_CYCLE_SEC = 10.042;

/** Normalized hotspot canvas width (video width = 100 units). */
export const HOTSPOT_VIEW_WIDTH = 100;
/** Normalized hotspot canvas height (688 / 464 × 100). */
export const HOTSPOT_VIEW_HEIGHT = 148.276;
export const HOTSPOT_VIEW_CENTER = {
  x: HOTSPOT_VIEW_WIDTH / 2,
  y: HOTSPOT_VIEW_HEIGHT / 2,
} as const;

export type AnatomyVideoHotspot = {
  structureId: string;
  startSec: number;
  endSec: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
};

export const ANATOMY_VIDEO_HOTSPOTS: AnatomyVideoHotspot[] = [
  // Anterior head & neck (0 – 1.8 s)
  { structureId: "skull", startSec: 0, endSec: 1.8, cx: 35, cy: 24, rx: 6, ry: 5 },
  { structureId: "brain", startSec: 0, endSec: 1.8, cx: 35, cy: 26, rx: 5, ry: 4 },
  { structureId: "thyroid", startSec: 0, endSec: 1.8, cx: 35, cy: 32, rx: 4, ry: 2.5 },
  { structureId: "trachea", startSec: 0, endSec: 1.8, cx: 35, cy: 36, rx: 2.5, ry: 6 },
  { structureId: "carotid-artery", startSec: 0, endSec: 1.8, cx: 31, cy: 34, rx: 3, ry: 5 },
  { structureId: "esophagus", startSec: 0, endSec: 1.8, cx: 35, cy: 40, rx: 2, ry: 8 },

  // Anterior thorax (0 – 1.8 s)
  { structureId: "lungs", startSec: 0, endSec: 1.8, cx: 35, cy: 46, rx: 11, ry: 7 },
  { structureId: "heart", startSec: 0, endSec: 1.8, cx: 39, cy: 48, rx: 5, ry: 5 },
  { structureId: "sternum", startSec: 0, endSec: 1.8, cx: 35, cy: 48, rx: 4, ry: 10 },
  { structureId: "aorta", startSec: 0, endSec: 1.8, cx: 36, cy: 44, rx: 2.5, ry: 11 },
  { structureId: "clavicle", startSec: 0, endSec: 2, cx: 35, cy: 38, rx: 12, ry: 2.5 },
  { structureId: "diaphragm", startSec: 0, endSec: 2, cx: 35, cy: 56, rx: 12, ry: 2.5 },

  // Anterior abdomen & pelvis (0 – 2 s)
  { structureId: "liver", startSec: 0, endSec: 1.8, cx: 30, cy: 62, rx: 6, ry: 5.5 },
  { structureId: "stomach", startSec: 0, endSec: 1.8, cx: 40, cy: 63, rx: 5.5, ry: 5 },
  { structureId: "spleen", startSec: 0.2, endSec: 4.2, cx: 41, cy: 60, rx: 4.5, ry: 5 },
  { structureId: "gallbladder", startSec: 0, endSec: 1.8, cx: 32, cy: 65, rx: 3.5, ry: 3.5 },
  { structureId: "pancreas", startSec: 0, endSec: 1.8, cx: 35, cy: 66, rx: 8, ry: 2.5 },
  { structureId: "duodenum", startSec: 0, endSec: 1.8, cx: 37, cy: 68, rx: 5, ry: 3.5 },
  { structureId: "small-intestine", startSec: 0, endSec: 1.8, cx: 35, cy: 69, rx: 7, ry: 5.5 },
  { structureId: "colon", startSec: 0, endSec: 1.8, cx: 35, cy: 70, rx: 9, ry: 6.5 },
  { structureId: "appendix", startSec: 0, endSec: 1.8, cx: 39, cy: 72, rx: 3, ry: 4 },
  { structureId: "bladder", startSec: 0, endSec: 2, cx: 35, cy: 78, rx: 5.5, ry: 4.5 },
  { structureId: "prostate", startSec: 0, endSec: 2, cx: 35, cy: 82, rx: 4.5, ry: 3 },

  // Extremities — visible on anterior / early spin (0 – 2.5 s)
  { structureId: "biceps-brachii", startSec: 0, endSec: 2.2, cx: 23, cy: 50, rx: 3.5, ry: 8 },
  { structureId: "humerus", startSec: 0, endSec: 2.2, cx: 21, cy: 52, rx: 3, ry: 9 },
  { structureId: "femur", startSec: 0, endSec: 2.5, cx: 35, cy: 98, rx: 7, ry: 14 },
  { structureId: "tibia", startSec: 0, endSec: 2.5, cx: 36, cy: 118, rx: 3.5, ry: 11 },

  // Posterior & retroperitoneal (2 – 4.5 s)
  { structureId: "kidneys", startSec: 2.2, endSec: 8.2, cx: 35, cy: 64, rx: 10, ry: 6 },
  { structureId: "adrenal-glands", startSec: 2.2, endSec: 8, cx: 35, cy: 60, rx: 9, ry: 3 },
  { structureId: "spinal-cord", startSec: 2, endSec: 4.5, cx: 35, cy: 52, rx: 2.5, ry: 22 },
  { structureId: "vertebral-column", startSec: 2, endSec: 4.5, cx: 35, cy: 54, rx: 4, ry: 24 },
  { structureId: "scapula", startSec: 2.2, endSec: 4.8, cx: 29, cy: 44, rx: 5, ry: 6 },
];

export function isHotspotActiveAtTime(hotspot: AnatomyVideoHotspot, timeSec: number): boolean {
  const cycle = ANATOMY_VIDEO_CYCLE_SEC;
  const t = ((timeSec % cycle) + cycle) % cycle;
  if (hotspot.startSec <= hotspot.endSec) {
    return t >= hotspot.startSec && t <= hotspot.endSec;
  }
  return t >= hotspot.startSec || t <= hotspot.endSec;
}

export function getActiveHotspotsAtTime(
  timeSec: number,
  hotspots: AnatomyVideoHotspot[] = ANATOMY_VIDEO_HOTSPOTS
): AnatomyVideoHotspot[] {
  return hotspots.filter((h) => isHotspotActiveAtTime(h, timeSec));
}

export function getPrimaryHotspotForStructure(structureId: string): AnatomyVideoHotspot | undefined {
  const matches = ANATOMY_VIDEO_HOTSPOTS.filter((h) => h.structureId === structureId);
  if (matches.length === 0) return undefined;
  return matches.reduce((best, h) => {
    const duration = h.endSec - h.startSec;
    const bestDuration = best.endSec - best.startSec;
    return duration > bestDuration ? h : best;
  });
}

export function getSeekTimeForStructure(structureId: string): number {
  const primary = getPrimaryHotspotForStructure(structureId);
  if (!primary) return 0;
  return (primary.startSec + primary.endSec) / 2;
}

export function filterHotspotsByLayer(
  hotspots: AnatomyVideoHotspot[],
  visibleLayers: Set<AnatomyLayer>
): AnatomyVideoHotspot[] {
  return hotspots.filter((h) => {
    const structure = structureById.get(h.structureId);
    if (!structure) return false;
    return visibleLayers.has(structure.layer);
  });
}

export function getHotspotLabel(structureId: string): string {
  return structureById.get(structureId)?.name ?? structureId;
}

export type HotspotMeta = {
  structureId: string;
  name: string;
  system: AnatomySystem;
  systemLabel: string;
  layer: AnatomyLayer;
};

export function getHotspotMeta(structureId: string): HotspotMeta | undefined {
  const structure = structureById.get(structureId);
  if (!structure) return undefined;
  return {
    structureId,
    name: structure.name,
    system: structure.system,
    systemLabel: ANATOMY_SYSTEM_LABELS[structure.system],
    layer: structure.layer,
  };
}

/** @deprecated Use ANATOMY_SYSTEM_COLORS from ./system-colors */
export { ANATOMY_SYSTEM_COLORS as HOTSPOT_SYSTEM_COLORS } from "./system-colors";

export function getSystemsWithHotspots(): AnatomySystem[] {
  const systems = new Set<AnatomySystem>();
  for (const h of ANATOMY_VIDEO_HOTSPOTS) {
    const meta = getHotspotMeta(h.structureId);
    if (meta) systems.add(meta.system);
  }
  return [...systems];
}

export function assertHotspotGeometry(): string[] {
  const issues: string[] = [];
  for (const h of ANATOMY_VIDEO_HOTSPOTS) {
    if (h.cx < 0 || h.cx > HOTSPOT_VIEW_WIDTH || h.cy < 0 || h.cy > HOTSPOT_VIEW_HEIGHT) {
      issues.push(`${h.structureId}: center out of bounds`);
    }
    if (h.rx <= 0 || h.ry <= 0 || h.rx > 50 || h.ry > 50) {
      issues.push(`${h.structureId}: invalid radius`);
    }
    if (h.startSec < 0 || h.endSec > ANATOMY_VIDEO_CYCLE_SEC + 0.01) {
      issues.push(`${h.structureId}: time window out of range`);
    }
  }
  return issues;
}

/** Every catalog structure (except 3D-only individual bones) must have a video hotspot. */
export function assertHotspotCatalogIntegrity(): string[] {
  return ANATOMY_STRUCTURES.filter(
    (s) =>
      !s.parentId &&
      !isIndividual3dBoneStructure(s.id) &&
      !ANATOMY_VIDEO_HOTSPOTS.some((h) => h.structureId === s.id)
  ).map((s) => s.id);
}
