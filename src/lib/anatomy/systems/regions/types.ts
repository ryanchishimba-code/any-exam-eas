import type { AnatomyLayer, AnatomySystem } from "../../types";

/** Normalized hit region on a visual surface (video, atlas, 3D, etc.). */
export type AnatomyRegion = {
  structureId: string;
  /** Optional time window for animated surfaces (seconds). */
  startSec?: number;
  endSec?: number;
  /** Ellipse center and radii in surface-normalized coordinates. */
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  /** Illustrated atlas: anterior | posterior | left */
  view?: string;
};

export type RegionMeta = {
  structureId: string;
  name: string;
  system: AnatomySystem;
  systemLabel: string;
  layer: AnatomyLayer;
};

export type RegionProviderConfig = {
  viewWidth: number;
  viewHeight: number;
  cycleSec?: number;
};

/** Pluggable region source — swap video, atlas, or future surfaces without touching catalog. */
export type RegionProvider = {
  id: string;
  config: RegionProviderConfig;
  getAllRegions(): AnatomyRegion[];
  getRegionsAtTime?(timeSec: number): AnatomyRegion[];
  getRegionsForView?(view: string): AnatomyRegion[];
  getPrimaryRegionForStructure(structureId: string): AnatomyRegion | undefined;
  getSeekTimeForStructure?(structureId: string): number;
  getBestViewForStructure?(structureId: string): string | undefined;
  getRegionMeta(structureId: string): RegionMeta | undefined;
  filterByLayers(regions: AnatomyRegion[], visibleLayers: Set<AnatomyLayer>): AnatomyRegion[];
  assertIntegrity?(): string[];
};
