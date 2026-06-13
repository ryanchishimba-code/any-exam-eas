import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { buildCarpalParts, buildPhalanxParts, buildTarsalParts } from "./digit-bone-geometry";
import { parseCarpalName, parsePhalanxKind, parseTarsalName } from "./digit-placements";

describe("digit bone geometry", () => {
  it("parses carpal, tarsal, and phalanx bone ids", () => {
    expect(parseCarpalName("capitate-r")).toBe("capitate");
    expect(parseTarsalName("calcaneus-l")).toBe("calcaneus");
    expect(parsePhalanxKind("phalanx-3-3-r")).toEqual({ kind: "hand", distal: true });
    expect(parsePhalanxKind("toe-phalanx-1-2-l")).toEqual({ kind: "toe", distal: true });
    expect(parsePhalanxKind("humerus-r")).toBeNull();
  });

  it("builds non-empty shaped meshes for carpals and tarsals", () => {
    const center = new THREE.Vector3(0.1, 0.5, 0.02);
    for (const name of ["scaphoid", "hamate", "pisiform"] as const) {
      const parts = buildCarpalParts(name, center);
      expect(parts.length).toBeGreaterThan(0);
      expect(parts[0]!.getAttribute("position").count).toBeGreaterThan(0);
    }
    for (const name of ["calcaneus", "talus", "navicular"] as const) {
      const parts = buildTarsalParts(name, center);
      expect(parts.length).toBeGreaterThan(0);
      expect(parts[0]!.getAttribute("position").count).toBeGreaterThan(0);
    }
  });

  it("builds tapered phalanx geometry with distal tuft", () => {
    const from = new THREE.Vector3(0, 0.5, 0.1);
    const to = new THREE.Vector3(0, 0.48, 0.12);
    const plain = buildPhalanxParts(from, to, 0.003);
    const distal = buildPhalanxParts(from, to, 0.003, { distal: true });
    expect(plain.length).toBeGreaterThan(0);
    expect(distal.length).toBeGreaterThan(plain.length);
  });
});
