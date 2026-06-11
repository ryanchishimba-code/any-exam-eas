import { ANATOMY_STRUCTURES } from "../../structures";
import { ANATOMY_SYSTEM_LABELS, type AnatomyLayer } from "../../types";
import {
  ANATOMY_VIDEO_CYCLE_SEC,
  ANATOMY_VIDEO_HOTSPOTS,
  HOTSPOT_VIEW_HEIGHT,
  HOTSPOT_VIEW_WIDTH,
  assertHotspotCatalogIntegrity,
  assertHotspotGeometry,
  filterHotspotsByLayer,
  getActiveHotspotsAtTime,
  getHotspotMeta,
  getPrimaryHotspotForStructure,
  getSeekTimeForStructure,
  isHotspotActiveAtTime,
  type AnatomyVideoHotspot,
} from "../../video-hotspots";
import type { AnatomyRegion, RegionMeta, RegionProvider } from "./types";

function toRegion(h: AnatomyVideoHotspot): AnatomyRegion {
  return {
    structureId: h.structureId,
    startSec: h.startSec,
    endSec: h.endSec,
    cx: h.cx,
    cy: h.cy,
    rx: h.rx,
    ry: h.ry,
  };
}

export const videoRegionProvider: RegionProvider = {
  id: "reference-video",
  config: {
    viewWidth: HOTSPOT_VIEW_WIDTH,
    viewHeight: HOTSPOT_VIEW_HEIGHT,
    cycleSec: ANATOMY_VIDEO_CYCLE_SEC,
  },
  getAllRegions() {
    return ANATOMY_VIDEO_HOTSPOTS.map(toRegion);
  },
  getRegionsAtTime(timeSec: number) {
    return getActiveHotspotsAtTime(timeSec).map(toRegion);
  },
  getPrimaryRegionForStructure(structureId: string) {
    const h = getPrimaryHotspotForStructure(structureId);
    return h ? toRegion(h) : undefined;
  },
  getSeekTimeForStructure,
  getRegionMeta(structureId: string): RegionMeta | undefined {
    const meta = getHotspotMeta(structureId);
    if (!meta) return undefined;
    return meta;
  },
  filterByLayers(regions, visibleLayers) {
    const hotspots = regions.map((r) => ({
      structureId: r.structureId,
      startSec: r.startSec ?? 0,
      endSec: r.endSec ?? ANATOMY_VIDEO_CYCLE_SEC,
      cx: r.cx,
      cy: r.cy,
      rx: r.rx,
      ry: r.ry,
    }));
    return filterHotspotsByLayer(hotspots, visibleLayers).map(toRegion);
  },
  assertIntegrity() {
    return [...assertHotspotGeometry(), ...assertHotspotCatalogIntegrity().map((id) => `missing:${id}`)];
  },
};

export {
  ANATOMY_VIDEO_CYCLE_SEC,
  ANATOMY_VIDEO_HOTSPOTS,
  HOTSPOT_VIEW_HEIGHT,
  HOTSPOT_VIEW_WIDTH,
  isHotspotActiveAtTime,
  getActiveHotspotsAtTime,
  getPrimaryHotspotForStructure,
  getSeekTimeForStructure,
  filterHotspotsByLayer,
  getHotspotMeta,
  type AnatomyVideoHotspot,
};

/** Distinct colors per organ system (legacy overlays). */
export { HOTSPOT_SYSTEM_COLORS, getSystemsWithHotspots } from "../../video-hotspots";

export function getHotspotLabel(structureId: string): string {
  return ANATOMY_STRUCTURES.find((s) => s.id === structureId)?.name ?? structureId;
}
