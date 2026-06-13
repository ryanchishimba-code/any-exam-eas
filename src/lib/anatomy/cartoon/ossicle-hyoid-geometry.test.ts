import { describe, expect, it } from "vitest";
import { FIGURE } from "./proportions";
import {
  buildHyoidWorldParts,
  buildOssicleParts,
  buildOssicleWorldParts,
  ossicleWorldCenter,
  parseOssicleName,
} from "./ossicle-hyoid-geometry";

describe("ossicle and hyoid geometry", () => {
  it("parses ossicle bone ids", () => {
    expect(parseOssicleName("malleus-r")).toBe("malleus");
    expect(parseOssicleName("stapes-l")).toBe("stapes");
    expect(parseOssicleName("hyoid")).toBeNull();
  });

  it("builds shaped ossicle meshes in world space", () => {
    for (const id of ["malleus-r", "incus-l", "stapes-r"] as const) {
      const parts = buildOssicleWorldParts(id, FIGURE, FIGURE.centerZ);
      expect(parts?.length).toBeGreaterThan(1);
      expect(parts![0]!.getAttribute("position").count).toBeGreaterThan(0);
    }
  });

  it("builds hyoid with body and horns", () => {
    const parts = buildHyoidWorldParts(FIGURE, FIGURE.centerZ);
    expect(parts.length).toBeGreaterThan(2);
  });

  it("malleus has more parts than a single box", () => {
    const center = ossicleWorldCenter("malleus", -1, FIGURE, FIGURE.centerZ);
    expect(buildOssicleParts("malleus", center, -1).length).toBeGreaterThan(2);
  });
});
