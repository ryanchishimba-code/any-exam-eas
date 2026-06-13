import { describe, expect, it } from "vitest";
import {
  getNeuroConnectedStructureIds,
  isNeuroConnected,
  isNeuroStructure,
} from "./neuro-connections";

describe("neuro-connections", () => {
  it("links brain to spinal cord, skull, and carotid", () => {
    const connected = getNeuroConnectedStructureIds("brain");
    expect(connected.has("brain")).toBe(true);
    expect(connected.has("spinal-cord")).toBe(true);
    expect(connected.has("skull")).toBe(true);
    expect(connected.has("carotid-artery")).toBe(true);
  });

  it("marks neuro structures for pathway overlays", () => {
    expect(isNeuroStructure("brain")).toBe(true);
    expect(isNeuroStructure("heart")).toBe(false);
  });

  it("detects connected highlight targets", () => {
    expect(isNeuroConnected("brain", "spinal-cord")).toBe(true);
    expect(isNeuroConnected("brain", "brain")).toBe(false);
    expect(isNeuroConnected(null, "brain")).toBe(false);
  });
});
