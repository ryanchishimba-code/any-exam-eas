import { describe, expect, it } from "vitest";
import {
  assessAanpFnpBlueprintAlignment,
  computeAanpFnpAgeGroupQuotas,
  computeAanpFnpClinicalSystemQuotas,
  computeAanpFnpDomainQuotas,
  planAanpFnpGenerationSlots,
} from "./blueprint-quota";
import { AANP_FNP_TARGET_TOTAL } from "./types";

describe("AANP FNP blueprint quotas", () => {
  it("allocates 6000 questions proportional to AANPCB domain weights", () => {
    const quotas = computeAanpFnpDomainQuotas(6000);
    const total = quotas.reduce((s, q) => s + q.targetCount, 0);
    expect(total).toBeGreaterThanOrEqual(5990);
    expect(total).toBeLessThanOrEqual(6010);

    const assess = quotas.find((q) => q.domain === "assess");
    expect(assess?.targetCount).toBe(1920);
    expect(assess?.weight).toBeCloseTo(0.32, 2);
  });

  it("allocates age groups proportional to lifespan weights", () => {
    const quotas = computeAanpFnpAgeGroupQuotas(6000);
    const older = quotas.find((q) => q.ageGroup === "older-adult");
    expect(older?.targetCount).toBe(1800);
    expect(older?.weight).toBeCloseTo(0.3, 2);
  });

  it("detects blueprint misalignment beyond tolerance", () => {
    const counts = {
      assess: 3000,
      diagnose: 500,
      plan: 500,
      evaluate: 500,
    };
    const result = assessAanpFnpBlueprintAlignment(counts, AANP_FNP_TARGET_TOTAL);
    expect(result.aligned).toBe(false);
    expect(result.deviations.some((d) => d.domain === "assess" && d.deltaPct > 5)).toBe(true);
  });

  it("allocates clinical systems proportional to yield weights", () => {
    const quotas = computeAanpFnpClinicalSystemQuotas(6000);
    expect(quotas.length).toBe(12);
    const cv = quotas.find((q) => q.system === "cardiovascular");
    const derm = quotas.find((q) => q.system === "dermatology-ent");
    expect(cv!.targetCount).toBeGreaterThan(derm!.targetCount);
  });

  it("skips zero-deficit Evaluate and overfilled pediatric ages", () => {
    const slots = planAanpFnpGenerationSlots({
      count: 40,
      domainDeficits: { assess: 20, diagnose: 15, plan: 5, evaluate: 0 },
      ageGroupDeficits: {
        newborn: 0,
        infant: 0,
        toddler: 0,
        child: 0,
        adolescent: 0,
        "young-adult": 10,
        "middle-adult": 15,
        "older-adult": 20,
      },
    });
    expect(slots.every((s) => s.blueprintDomain !== "evaluate")).toBe(true);
    expect(slots.some((s) => s.blueprintDomain === "assess")).toBe(true);
    const peds = new Set(["newborn", "infant", "toddler", "child", "adolescent"]);
    expect(slots.every((s) => !peds.has(s.patientAgeGroup))).toBe(true);
    expect(slots.filter((s) => s.patientAgeGroup === "older-adult").length).toBeGreaterThan(0);
  });
});
