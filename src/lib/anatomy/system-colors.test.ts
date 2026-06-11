import { describe, expect, it } from "vitest";
import { ANATOMY_SYSTEM_COLORS, blendHexColor } from "./system-colors";
import type { AnatomySystem } from "./types";

describe("anatomy system colors", () => {
  it("defines a color for every organ system", () => {
    const systems: AnatomySystem[] = [
      "cardiovascular",
      "respiratory",
      "nervous",
      "digestive",
      "urinary",
      "skeletal",
      "muscular",
      "lymphatic",
      "endocrine",
    ];
    for (const system of systems) {
      expect(ANATOMY_SYSTEM_COLORS[system]).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("blends hex colors toward an accent", () => {
    expect(blendHexColor("#000000", "#ffffff", 0.5)).toBe("#808080");
    expect(blendHexColor("#ff0000", "#00ff00", 0)).toBe("#ff0000");
    expect(blendHexColor("#ff0000", "#00ff00", 1)).toBe("#00ff00");
  });
});
