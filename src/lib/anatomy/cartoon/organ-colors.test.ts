import { describe, expect, it } from "vitest";
import { ORGAN_MESH_COLORS, getOrganMeshColor } from "./organ-colors";

describe("organ-colors", () => {
  it("assigns a unique color to each major organ mesh", () => {
    const organIds = [
      "heart",
      "lungs",
      "liver",
      "stomach",
      "spleen",
      "pancreas",
      "colon",
      "kidneys",
      "spinal-cord",
    ];
    const colors = organIds.map((id) => getOrganMeshColor(id));
    const unique = new Set(colors);
    expect(unique.size).toBe(organIds.length);
  });

  it("covers all catalog organ mesh ids", () => {
    expect(Object.keys(ORGAN_MESH_COLORS).length).toBeGreaterThanOrEqual(20);
    expect(getOrganMeshColor("heart")).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
