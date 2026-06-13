import { describe, expect, it } from "vitest";
import {
  CT_PROCEDURAL_THORAX_SEGMENTS,
  buildCtProceduralThoraxGeometries,
  ctThoraxSegmentHighlighted,
  ctThoraxSegmentPickStructure,
} from "./ct-procedural-thorax";

describe("ct procedural thorax", () => {
  it("defines sternum, clavicles, and rib cage segments", () => {
    expect(CT_PROCEDURAL_THORAX_SEGMENTS.map((s) => s.id)).toEqual([
      "ct-sternum",
      "ct-clavicle-r",
      "ct-clavicle-l",
      "ct-rib-cage",
    ]);
  });

  it("builds merged figure-space thorax geometries", () => {
    const map = buildCtProceduralThoraxGeometries();
    expect(map.size).toBe(4);
    for (const id of ["ct-sternum", "ct-clavicle-r", "ct-clavicle-l", "ct-rib-cage"]) {
      expect(map.get(id)?.getAttribute("position").count).toBeGreaterThan(0);
    }
  });

  it("highlights rib cage when any rib is selected", () => {
    const ribCage = CT_PROCEDURAL_THORAX_SEGMENTS.find((s) => s.id === "ct-rib-cage")!;
    expect(ctThoraxSegmentHighlighted(ribCage, new Set(["rib-5-l"]))).toBe(true);
    expect(ctThoraxSegmentHighlighted(ribCage, new Set(["heart"]))).toBe(false);
  });

  it("maps picks to catalog structure ids", () => {
    const sternum = CT_PROCEDURAL_THORAX_SEGMENTS.find((s) => s.id === "ct-sternum")!;
    expect(ctThoraxSegmentPickStructure(sternum)).toBe("sternum-bone");
  });
});
