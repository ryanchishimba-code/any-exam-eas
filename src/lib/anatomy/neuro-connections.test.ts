import { describe, expect, it } from "vitest";
import {
  getNeuroConnectedStructureIds,
  isNeuroConnected,
  isNeuroStructure,
} from "./neuro-connections";

describe("neuro-connections", () => {
  it("links spinal cord to skull and carotid", () => {
    const connected = getNeuroConnectedStructureIds("spinal-cord");
    expect(connected.has("spinal-cord")).toBe(true);
    expect(connected.has("skull")).toBe(true);
    expect(connected.has("carotid-artery")).toBe(true);
  });

  it("marks neuro structures for pathway overlays", () => {
    expect(isNeuroStructure("spinal-cord")).toBe(true);
    expect(isNeuroStructure("heart")).toBe(false);
  });

  it("detects connected highlight targets", () => {
    expect(isNeuroConnected("spinal-cord", "skull")).toBe(true);
    expect(isNeuroConnected("spinal-cord", "spinal-cord")).toBe(false);
    expect(isNeuroConnected(null, "spinal-cord")).toBe(false);
  });
});
