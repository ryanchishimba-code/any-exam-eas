import { ANATOMY_STRUCTURES } from "../../structures";
import {
  assertAtlasCatalogIntegrity,
  assertAtlasGeometry,
  ATLAS_REGIONS,
  getBestViewForStructure,
  getPrimaryRegionForStructure,
  getRegionsForView,
  type AtlasView,
} from "../../atlas";
import { ATLAS_VIEWBOX } from "../../atlas/types";
import type { AnatomyLayer } from "../../types";
import { getHotspotMeta } from "../../video-hotspots";
import type { AnatomyRegion, RegionMeta, RegionProvider } from "./types";

const structureById = new Map(ANATOMY_STRUCTURES.map((s) => [s.id, s]));

function toRegion(r: (typeof ATLAS_REGIONS)[number]): AnatomyRegion {
  return {
    structureId: r.structureId,
    cx: r.cx,
    cy: r.cy,
    rx: r.rx,
    ry: r.ry,
    view: r.view,
  };
}

function filterAtlasByLayers(regions: AnatomyRegion[], visibleLayers: Set<AnatomyLayer>) {
  return regions.filter((r) => {
    const structure = structureById.get(r.structureId);
    if (!structure) return false;
    return visibleLayers.has(structure.layer);
  });
}

export const atlasRegionProvider: RegionProvider = {
  id: "illustrated-atlas",
  config: {
    viewWidth: ATLAS_VIEWBOX.width,
    viewHeight: ATLAS_VIEWBOX.height,
  },
  getAllRegions() {
    return ATLAS_REGIONS.map(toRegion);
  },
  getRegionsForView(view: string) {
    return getRegionsForView(view as AtlasView).map(toRegion);
  },
  getPrimaryRegionForStructure(structureId: string) {
    const region = getPrimaryRegionForStructure(structureId);
    return region ? toRegion(region) : undefined;
  },
  getBestViewForStructure(structureId: string) {
    return getBestViewForStructure(structureId);
  },
  getRegionMeta(structureId: string): RegionMeta | undefined {
    const meta = getHotspotMeta(structureId);
    if (!meta) return undefined;
    return meta;
  },
  filterByLayers: filterAtlasByLayers,
  assertIntegrity() {
    return [
      ...assertAtlasGeometry(),
      ...assertAtlasCatalogIntegrity().map((id) => `missing:${id}`),
    ];
  },
};

export function getAtlasStructureLabel(structureId: string): string {
  return structureById.get(structureId)?.name ?? structureId;
}

export { ATLAS_VIEWBOX, getBestViewForStructure, getRegionsForView };
