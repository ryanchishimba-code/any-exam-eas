import { describe, expect, it } from "vitest";
import { listBoneIdentities } from "./bone-identity";
import { buildBoneInstances } from "./instances";

describe("bone identity catalog", () => {
  it("matches the 3D skeleton ids, names, regions, kinds, and high-yield flags", () => {
    const identities = listBoneIdentities().map((bone) => [
      bone.id,
      bone.name,
      bone.region,
      bone.kind,
      Boolean(bone.highYield),
    ]);
    const placed = buildBoneInstances().map((bone) => [
      bone.id,
      bone.name,
      bone.region,
      bone.kind,
      Boolean(bone.highYield),
    ]);
    expect(identities).toEqual(placed);
  });
});
