import { describe, expect, it } from "vitest";
import {
  USMLE_ORGAN_SYSTEMS,
  organSystemWeightsForStep,
  isUsmleOrganSystemId,
} from "./official-content-model";
import {
  buildSpineExamBlueprint,
  resolveOrganSystemId,
  listSpineOrganSystemIds,
  USMLE_TOPIC_NODES,
} from "./content-spine";
import {
  normalizeUsmleBlueprintTopic,
  expandUsmleBlueprintTopicMatchers,
} from "./blueprint-topic-aliases";

describe("official-content-model", () => {
  it("has 11 organ systems with Step 1 weights summing near 1", () => {
    expect(USMLE_ORGAN_SYSTEMS).toHaveLength(11);
    const w = organSystemWeightsForStep("step1");
    const sum = Object.values(w).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 5);
    expect(isUsmleOrganSystemId("cardiovascular")).toBe(true);
    expect(isUsmleOrganSystemId("anatomy")).toBe(false);
  });

  it("normalizes weights for all steps", () => {
    for (const step of ["step1", "step2", "step3"] as const) {
      const sum = Object.values(organSystemWeightsForStep(step)).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1, 5);
    }
  });
});

describe("content-spine", () => {
  it("maps known topics to organ systems", () => {
    expect(resolveOrganSystemId(null, "acs-management")).toBe("cardiovascular");
    expect(resolveOrganSystemId(null, "informed-consent-capacity")).toBe("social-sciences");
    expect(resolveOrganSystemId("cardiovascular", null)).toBe("cardiovascular");
  });

  it("builds spine blueprints with 11 categories", () => {
    const bp = buildSpineExamBlueprint("usmle-step-1", "USMLE Step 1", "step1");
    expect(bp.categories).toHaveLength(11);
    expect(listSpineOrganSystemIds()).toEqual(bp.categories.map((c) => c.id));
    expect(USMLE_TOPIC_NODES.length).toBeGreaterThan(100);
  });
});

describe("blueprint-topic-aliases", () => {
  it("normalizes common aliases", () => {
    expect(normalizeUsmleBlueprintTopic("STEMI")).toBe("acs-management");
    expect(normalizeUsmleBlueprintTopic("heart failure")).toBe("chf-management");
    expect(normalizeUsmleBlueprintTopic("unknown-topic-xyz")).toBeNull();
  });

  it("expands matchers for practice filters", () => {
    const matchers = expandUsmleBlueprintTopicMatchers("acs-management");
    expect(matchers).toContain("acs-management");
    expect(matchers).toContain("stemi");
  });
});
