import { describe, expect, it } from "vitest";
import { FIGURE } from "./proportions";
import {
  ribLateralReach,
  ribPathPoints,
  sternumAnchorY,
  thoracicVertebraY,
} from "./skeletal-geometry";

describe("skeletal-geometry thorax", () => {
  it("anchors rib 1 near T1 vertebral level (not above shoulders)", () => {
    const t1 = thoracicVertebraY(FIGURE, 0);
    const { bone } = ribPathPoints(0, 1, FIGURE, FIGURE.centerZ);
    expect(bone[0]!.y).toBeLessThan(FIGURE.shoulderY);
    expect(bone[0]!.y).toBeCloseTo(t1, 1);
  });

  it("steps ribs down through thoracic column", () => {
    const y1 = ribPathPoints(0, 1, FIGURE, FIGURE.centerZ).bone[0]!.y;
    const y12 = ribPathPoints(11, 1, FIGURE, FIGURE.centerZ).bone[0]!.y;
    expect(y12).toBeLessThan(y1);
    expect(y12).toBeCloseTo(thoracicVertebraY(FIGURE, 11), 1);
  });

  it("peaks lateral reach at mid-thorax", () => {
    expect(ribLateralReach(5)).toBeGreaterThan(ribLateralReach(0));
    expect(ribLateralReach(5)).toBeGreaterThan(ribLateralReach(11));
  });

  it("places sternum between T1 and T10 landmarks", () => {
    const { manubrium, xiphoid } = sternumAnchorY(FIGURE);
    expect(manubrium).toBeLessThan(FIGURE.shoulderY);
    expect(xiphoid).toBeLessThan(manubrium);
    expect(xiphoid).toBeGreaterThan(FIGURE.waistY - 0.2);
  });
});
