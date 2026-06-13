import { describe, expect, it } from "vitest";
import { ADULT_BONE_COUNT, buildBoneInstances, verifyBoneCount } from "./instances";
import { createBoneMeshMap } from "./mesh";
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

  it("builds mesh geometry for every bone including curved ribs and clavicles", () => {
    const bones = buildBoneInstances();
    const meshMap = createBoneMeshMap(bones);
    expect(meshMap.size).toBe(ADULT_BONE_COUNT);

    for (const id of [
      "rib-1-r",
      "rib-7-l",
      "clavicle-r",
      "sternum-bone",
      "t5-vertebra",
      "sacrum",
      "scapula-r",
      "innominate-l",
      "capitate-r",
      "calcaneus-l",
      "phalanx-2-3-r",
      "mc-3-l",
      "mt-1-r",
      "toe-phalanx-5-3-l",
      "patella-r",
      "frontal-bone",
      "mandible",
      "zygomatic-r",
      "nasal-concha-l",
      "malleus-r",
      "incus-l",
      "stapes-r",
      "hyoid",
    ]) {
      expect(meshMap.has(id)).toBe(true);
      expect(meshMap.get(id)!.getAttribute("position").count).toBeGreaterThan(0);
    }
  });
});
