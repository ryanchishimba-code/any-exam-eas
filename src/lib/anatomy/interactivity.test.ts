import { describe, expect, it } from "vitest";
import { getAllAnatomyStructures, getAnatomyStructure } from "./index";
import { ANATOMY_LAYER_LABELS, ANATOMY_SYSTEM_LABELS, type AnatomySystem } from "./types";
import { ANATOMY_QUIZ_QUESTIONS } from "./tours";
import {
  ATLAS_REGIONS,
  assertAtlasCatalogIntegrity,
  assertAtlasGeometry,
  getBestViewForStructure,
  getPrimaryRegionForStructure,
  getRegionsForView,
  structureVisibleInView,
} from "./atlas";
import { getHotspotMeta } from "./video-hotspots";
import { isIndividual3dBoneStructure } from "./bones/catalog-utils";

describe("anatomy interactivity", () => {
  it("labels every atlas-mapped structure with an atlas region", () => {
    expect(assertAtlasCatalogIntegrity()).toEqual([]);
    const atlasStructures = getAllAnatomyStructures().filter((s) => !isIndividual3dBoneStructure(s.id));
    const uniqueStructures = new Set(ATLAS_REGIONS.map((r) => r.structureId));
    expect(uniqueStructures.size).toBe(atlasStructures.length);
  });

  it("covers all major organ systems on the illustrated body", () => {
    const catalogSystems = new Set(getAllAnatomyStructures().map((s) => s.system));
    const atlasSystems = new Set<AnatomySystem>();
    for (const region of ATLAS_REGIONS) {
      const meta = getHotspotMeta(region.structureId);
      if (meta) atlasSystems.add(meta.system);
    }
    for (const system of catalogSystems) {
      expect(atlasSystems.has(system)).toBe(true);
    }
    expect(atlasSystems.size).toBeGreaterThanOrEqual(8);
  });

  it("assigns valid geometry to every atlas region", () => {
    expect(assertAtlasGeometry()).toEqual([]);
  });

  it("exposes organ name and system for every atlas structure", () => {
    for (const region of ATLAS_REGIONS) {
      const meta = getHotspotMeta(region.structureId);
      expect(meta).toBeDefined();
      expect(meta!.name.length).toBeGreaterThan(1);
      expect(ANATOMY_SYSTEM_LABELS[meta!.system]).toBeTruthy();
      expect(ANATOMY_LAYER_LABELS[meta!.layer]).toBeTruthy();
    }
  });

  it("exposes structures across all atlas views", () => {
    const views = ["anterior", "posterior", "left"] as const;
    for (const view of views) {
      expect(getRegionsForView(view).length).toBeGreaterThan(5);
    }
    const seen = new Set<string>();
    for (const view of views) {
      for (const r of getRegionsForView(view)) {
        seen.add(r.structureId);
      }
    }
    expect(seen.size).toBe(
      getAllAnatomyStructures().filter((s) => !isIndividual3dBoneStructure(s.id)).length
    );
  });

  it("resolves a primary view for each atlas-mapped structure", () => {
    for (const structure of getAllAnatomyStructures()) {
      if (isIndividual3dBoneStructure(structure.id)) continue;
      const primary = getPrimaryRegionForStructure(structure.id);
      expect(primary).toBeDefined();
      expect(getBestViewForStructure(structure.id)).toBe(primary!.view);
      expect(structureVisibleInView(structure.id, primary!.view)).toBe(true);
    }
  });

  it("supports quiz clicks — every quiz answer has a region on its primary view", () => {
    for (const q of ANATOMY_QUIZ_QUESTIONS) {
      const primary = getPrimaryRegionForStructure(q.structureId)!;
      expect(primary).toBeDefined();
      expect(structureVisibleInView(q.structureId, primary.view)).toBe(true);
      expect(getAnatomyStructure(q.structureId)).toBeDefined();
    }
  });

  it("maps posterior structures to the back view", () => {
    const posterior = ["spinal-cord", "vertebral-column", "scapula"];
    for (const id of posterior) {
      expect(getBestViewForStructure(id)).toBe("posterior");
    }
  });
});
