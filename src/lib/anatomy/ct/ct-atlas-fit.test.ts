import { describe, expect, it } from "vitest";
import { FIGURE } from "@/lib/anatomy/cartoon/proportions";
import {
  createCtClipPlanes,
  formatCtSliceLabel,
  getClipSliceRange,
  getFigureClipCenter,
  sliceOffsetToWorld,
} from "./ct-atlas-fit";

describe("ct-atlas-fit MPR slices", () => {
  it("returns anatomical ranges per MPR plane", () => {
    const axial = getClipSliceRange("axial");
    expect(axial?.axis).toBe("y");
    expect(axial?.min).toBe(FIGURE.footY);
    expect(axial?.max).toBeGreaterThan(axial!.min);

    expect(getClipSliceRange("coronal")?.axis).toBe("z");
    expect(getClipSliceRange("sagittal")?.axis).toBe("x");
    expect(getClipSliceRange("off")).toBeNull();
  });

  it("maps slice offset −1…1 through the body axis", () => {
    const range = getClipSliceRange("axial")!;
    expect(sliceOffsetToWorld("axial", -1)).toBe(range.min);
    expect(sliceOffsetToWorld("axial", 1)).toBeCloseTo(range.max, 5);
    const mid = sliceOffsetToWorld("axial", 0)!;
    expect(mid).toBeCloseTo((range.min + range.max) / 2, 5);
  });

  it("moves clip plane with slice offset", () => {
    const center = getFigureClipCenter();
    const mid = createCtClipPlanes("axial", 0)[0]!;
    const feet = createCtClipPlanes("axial", -1)[0]!;
    expect(mid.distanceToPoint(center)).toBeLessThan(0.01);
    expect(Math.abs(feet.distanceToPoint(center))).toBeGreaterThan(0.5);
  });

  it("formats slice position as percentage label", () => {
    expect(formatCtSliceLabel("axial", -1)).toBe("Axial 0%");
    expect(formatCtSliceLabel("sagittal", 1)).toBe("Sagittal 100%");
    expect(formatCtSliceLabel("coronal", 0)).toBe("Coronal 50%");
  });
});
