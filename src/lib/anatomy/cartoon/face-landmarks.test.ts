import { describe, expect, it } from "vitest";
import { FACE_CATALOG, getFigureFaceTransform } from "@/lib/anatomy/cartoon/face-landmarks";
import { CATALOG_SKULL_RADIUS } from "@/lib/anatomy/cartoon/skull-geometry";
import { FIGURE, getFigureHeadHeight } from "@/lib/anatomy/cartoon/proportions";

describe("face-landmarks", () => {
  it("places eyes at ~31% of bizygomatic width (IPD canon)", () => {
    const bizygomatic = CATALOG_SKULL_RADIUS * 2;
    const ipd = FACE_CATALOG.eyeX * 2;
    expect(ipd / bizygomatic).toBeGreaterThan(0.28);
    expect(ipd / bizygomatic).toBeLessThan(0.38);
  });

  it("scales face to FIGURE head the same way as skull geometry", () => {
    const t = getFigureFaceTransform(FIGURE);
    const uniform = FIGURE.headRadius / CATALOG_SKULL_RADIUS;
    expect(t.scale[0]).toBeCloseTo(uniform, 4);
    expect(t.scale[1]).toBeCloseTo(uniform * (FIGURE.headScaleY / 1.36), 4);
    expect(t.position[1]).toBe(FIGURE.headY);
  });

  it("keeps body near 7–7.5 head units tall", () => {
    const crown = FIGURE.headY + FIGURE.headRadius * FIGURE.headScaleY;
    const floor = FIGURE.footY;
    const headHeight = getFigureHeadHeight();
    const heads = (crown - floor) / headHeight;
    expect(heads).toBeGreaterThan(6.5);
    expect(heads).toBeLessThan(8);
  });
});
