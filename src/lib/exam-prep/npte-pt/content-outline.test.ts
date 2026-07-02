import { describe, expect, it } from "vitest";
import {
  NPTE_PT_BODY_SYSTEMS,
  NPTE_PT_EXAM_DOMAINS,
  NPTE_PT_HIGH_YIELD_FOCUS_AREAS,
  NPTE_PT_OUTLINE_SOURCE,
  NPTE_PT_PLATFORM_STUDY_FEATURES,
  NPTE_PT_TASK_AREAS,
  getNptePtBodySystem,
} from "./content-outline";

describe("NPTE-PT content outline", () => {
  it("defines four high-level exam domains that sum to 100%", () => {
    expect(NPTE_PT_EXAM_DOMAINS).toHaveLength(4);
    const total = NPTE_PT_EXAM_DOMAINS.reduce((sum, d) => sum + d.weight, 0);
    expect(total).toBeCloseTo(1, 5);
    const clinical = NPTE_PT_EXAM_DOMAINS.find((d) => d.id === "clinical-practice");
    expect(clinical?.weightLabel).toContain("60");
  });

  it("covers three FSBPT process task areas", () => {
    expect(NPTE_PT_TASK_AREAS).toHaveLength(3);
    const evalDx = NPTE_PT_TASK_AREAS.find(
      (t) => t.id === "evaluation-diagnosis-prognosis"
    );
    expect(evalDx?.weight).toBe(0.24);
  });

  it("defines 14 body-system areas with musculoskeletal as highest weight", () => {
    expect(NPTE_PT_BODY_SYSTEMS).toHaveLength(14);
    const msk = getNptePtBodySystem("musculoskeletal");
    expect(msk?.weight).toBeGreaterThan(0.25);
    expect(msk?.topics.some((t) => /ACL/i.test(t))).toBe(true);
    expect(msk?.topics.some((t) => /rotator cuff/i.test(t))).toBe(true);
  });

  it("includes pediatric, geriatric, and acute care in system interactions", () => {
    const interactions = getNptePtBodySystem("system-interactions");
    expect(interactions?.topics.some((t) => /Pediatric/i.test(t))).toBe(true);
    expect(interactions?.topics.some((t) => /Geriatric/i.test(t))).toBe(true);
    expect(interactions?.topics.some((t) => /ICU/i.test(t))).toBe(true);
  });

  it("lists cross-cutting high-yield focus areas", () => {
    expect(NPTE_PT_HIGH_YIELD_FOCUS_AREAS.length).toBeGreaterThanOrEqual(5);
    expect(NPTE_PT_HIGH_YIELD_FOCUS_AREAS.some((f) => /red flags/i.test(f))).toBe(true);
  });

  it("describes platform study features for NPTE-PT", () => {
    expect(NPTE_PT_PLATFORM_STUDY_FEATURES.some((f) => /250/i.test(f))).toBe(true);
  });

  it("references the 2026 FSBPT blueprint with 250 questions", () => {
    expect(NPTE_PT_OUTLINE_SOURCE).toContain("2026");
    expect(NPTE_PT_OUTLINE_SOURCE).toContain("250");
  });
});
