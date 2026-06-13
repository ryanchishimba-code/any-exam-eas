import { describe, expect, it } from "vitest";
import { FIGURE } from "./proportions";
import {
  buildSingleSkullBoneCatalogParts,
  buildSkullBoneWorldParts,
  parseSkullBoneId,
  SKULL_BONE_IDS,
} from "./skull-bone-geometry";

describe("skull bone geometry", () => {
  it("defines 22 individual skull bones", () => {
    expect(SKULL_BONE_IDS).toHaveLength(22);
  });

  it("parses skull bone ids", () => {
    expect(parseSkullBoneId("mandible")).toBe("mandible");
    expect(parseSkullBoneId("parietal-bone-l")).toBe("parietal-bone-l");
    expect(parseSkullBoneId("femur-r")).toBeNull();
  });

  it("builds catalog and world meshes for every skull bone", () => {
    for (const id of SKULL_BONE_IDS) {
      const catalog = buildSingleSkullBoneCatalogParts(id, 0.8);
      expect(catalog.length).toBeGreaterThan(0);
      expect(catalog[0]!.getAttribute("position").count).toBeGreaterThan(0);

      const world = buildSkullBoneWorldParts(id, FIGURE, FIGURE.centerZ);
      expect(world?.length).toBeGreaterThan(0);
    }
  });

  it("mandible has richer geometry than a single box", () => {
    const parts = buildSingleSkullBoneCatalogParts("mandible", 0.8);
    expect(parts.length).toBeGreaterThan(3);
  });
});
