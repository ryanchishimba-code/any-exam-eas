import { describe, expect, it } from "vitest";
import { ADULT_BONE_COUNT, buildBoneInstances, verifyBoneCount } from "./instances";
import { generateBoneStructures } from "./structures";
import { assertModuleCatalogIntegrity } from "../modules/registry";

describe("adult skeleton catalog", () => {
  it("defines exactly 206 bones", () => {
    expect(verifyBoneCount()).toBe(ADULT_BONE_COUNT);
    expect(buildBoneInstances().length).toBe(206);
  });

  it("assigns unique bone ids", () => {
    const ids = buildBoneInstances().map((b) => b.id);
    expect(new Set(ids).size).toBe(206);
  });

  it("registers a structure and module for every bone", () => {
    const boneIds = new Set(buildBoneInstances().map((b) => b.id));
    const structures = generateBoneStructures();
    expect(structures.length).toBe(206);
    for (const s of structures) {
      expect(boneIds.has(s.id)).toBe(true);
      expect(s.meshId).toBe(s.id);
    }
    const missing = assertModuleCatalogIntegrity().filter((id) => boneIds.has(id));
    expect(missing).toEqual([]);
  });
});
