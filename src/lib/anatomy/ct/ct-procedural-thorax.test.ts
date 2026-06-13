import { describe, expect, it } from "vitest";
import {
  CT_THORAX_REGISTRATION,
  getCtProceduralThoraxSegments,
  buildCtProceduralThoraxGeometries,
  ctThoraxSegmentHighlighted,
  ctThoraxSegmentPickStructure,
} from "./ct-procedural-thorax";

describe("ct procedural thorax", () => {
  it("defines sternum, clavicles, and 24 individual rib segments", () => {
    const ids = getCtProceduralThoraxSegments().map((s) => s.id);
    expect(ids.slice(0, 3)).toEqual(["ct-sternum", "ct-clavicle-r", "ct-clavicle-l"]);
    expect(ids).toContain("ct-rib-5-l");
    expect(ids).toHaveLength(27);
  });

  it("builds per-rib figure-space geometries", () => {
    const map = buildCtProceduralThoraxGeometries();
    expect(map.size).toBe(27);
    for (const id of ["ct-sternum", "ct-clavicle-r", "ct-clavicle-l", "ct-rib-1-r", "ct-rib-12-l"]) {
      expect(map.get(id)?.getAttribute("position").count).toBeGreaterThan(0);
    }
  });

  it("highlights a single rib segment when selected", () => {
    const rib5 = getCtProceduralThoraxSegments().find((s) => s.id === "ct-rib-5-l")!;
    expect(ctThoraxSegmentHighlighted(rib5, new Set(["rib-5-l"]))).toBe(true);
    expect(ctThoraxSegmentHighlighted(rib5, new Set(["rib-6-r"]))).toBe(false);
    expect(ctThoraxSegmentHighlighted(rib5, new Set(["heart"]))).toBe(false);
  });

  it("maps picks to catalog structure ids", () => {
    const sternum = getCtProceduralThoraxSegments().find((s) => s.id === "ct-sternum")!;
    expect(ctThoraxSegmentPickStructure(sternum)).toBe("sternum-bone");
  });

  it("registers thorax slightly inferior to raw figure anchors for VH fit", () => {
    expect(CT_THORAX_REGISTRATION.yOffset).toBeLessThan(0);
  });
});
