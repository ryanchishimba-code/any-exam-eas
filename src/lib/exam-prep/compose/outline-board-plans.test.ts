import { describe, expect, it } from "vitest";
import {
  allocateSecondaryTargets,
  areaCountBounds,
  areasOutsidePlan,
  composeBoardExams,
  planAreaCounts,
  type ComposerItem,
} from "./board-exam-composer";
import { planBoardExamRows } from "./board-exam-row-plan";
import { aanpAgeGroupId, aanpDomainId, aanpFnpComposeConfig } from "./aanp-fnp-2024-plan";
import { npteBodySystemId, nptePtComposeConfig, npteTaskId, NPTE_PT_TASK_WEIGHT_SUM } from "./npte-pt-2026-plan";
import { PANCE_2025_CONTENT, panceComposeConfig, panceContentId, panceTaskId } from "./pance-2025-plan";
import { usmleBlockComposeConfig, usmleDisciplineId, usmleOrganSystemId, usmlePhysicianTaskId } from "./usmle-block-plan";

function distinctCase(areaId: string, n: number): string {
  const tokens = Array.from({ length: 12 }, (_, k) => `${areaId}${n}tok${k}`).join(" ");
  return `Case ${areaId} ${n}. ${tokens} Pressure ${110 + n}/${70 + (n % 7)}.`;
}

describe("reuse caps", () => {
  it("reuses Step 2, AANP, PANCE, and NPTE up to 3 times and leaves Step 1 and Step 3 unique", () => {
    expect(usmleBlockComposeConfig("step1").maxItemReuse).toBe(1);
    expect(usmleBlockComposeConfig("step3").maxItemReuse).toBe(1);
    expect(usmleBlockComposeConfig("step2")).toMatchObject({ maxItemReuse: 3, maxFullExams: 117, fullExamLength: 40 });
    expect(aanpFnpComposeConfig()).toMatchObject({ maxItemReuse: 3, maxFullExams: 100, fullExamLength: 135 });
    expect(panceComposeConfig()).toMatchObject({ maxItemReuse: 3, maxFullExams: 100, fullExamLength: 60 });
    expect(nptePtComposeConfig()).toMatchObject({ maxItemReuse: 3, maxFullExams: 100, fullExamLength: 50 });
  });
});

describe("outline quotas", () => {
  it("fits a 40-item USMLE block inside every published organ-system range", () => {
    for (const step of ["step1", "step2", "step3"] as const) {
      const config = usmleBlockComposeConfig(step, 1);
      const quota = planAreaCounts(config.fullExamLength, config.areas);
      expect(quota, step).not.toBeNull();
      const total = Object.values(quota ?? {}).reduce((sum, count) => sum + count, 0);
      expect(total).toBe(40);
      expect(areasOutsidePlan(quota ?? {}, 40, config.areas)).toEqual([]);
      expect(config.fullExamTitle(2, ["human-development"])).toBe(
        `${step === "step1" ? "USMLE Step 1" : step === "step2" ? "USMLE Step 2 CK" : "USMLE Step 3"} Practice Exam 2`
      );
      expect(config.fullExamTitle(1)).not.toMatch(/shortfall|coming soon|placeholder/i);
    }
  });

  it("fits AANP domain and age quotas on a 135-item scored form", () => {
    const config = aanpFnpComposeConfig(1);
    expect(config.fullExamLength).toBe(135);
    for (const areas of [config.areas, config.secondaryAreas ?? []]) {
      const quota = planAreaCounts(135, areas);
      expect(quota).not.toBeNull();
      expect(Object.values(quota ?? {}).reduce((sum, count) => sum + count, 0)).toBe(135);
      expect(areasOutsidePlan(quota ?? {}, 135, areas)).toEqual([]);
    }
    expect(config.fullExamTitle(1)).toBe("AANP FNP-C Practice Exam 1");
  });

  it("fits PANCE content and task quotas on a 60-item block", () => {
    const config = panceComposeConfig(1);
    expect(PANCE_2025_CONTENT.reduce((sum, row) => sum + row.weight, 0)).toBeCloseTo(1, 5);
    for (const areas of [config.areas, config.secondaryAreas ?? []]) {
      const quota = planAreaCounts(60, areas);
      expect(quota).not.toBeNull();
      expect(Object.values(quota ?? {}).reduce((sum, count) => sum + count, 0)).toBe(60);
      expect(areasOutsidePlan(quota ?? {}, 60, areas)).toEqual([]);
    }
  });

  it("fits NPTE body-system quotas on a 50-item section and does not quota the 63% tasks", () => {
    const config = nptePtComposeConfig(1);
    expect(config.secondaryAreas).toBeUndefined();
    expect(NPTE_PT_TASK_WEIGHT_SUM).toBeCloseTo(0.63, 5);
    const quota = planAreaCounts(50, config.areas);
    expect(quota).not.toBeNull();
    expect(Object.values(quota ?? {}).reduce((sum, count) => sum + count, 0)).toBe(50);
    expect(areasOutsidePlan(quota ?? {}, 50, config.areas)).toEqual([]);
  });
});

describe("outline tag maps", () => {
  it("does not guess a USMLE system from a discipline tag", () => {
    expect(usmleOrganSystemId("cardiovascular")).toBe("cardiovascular");
    expect(usmleOrganSystemId("pathology")).toBeNull();
    expect(usmleOrganSystemId("pharmacology")).toBeNull();
    expect(usmleDisciplineId("step1", "pathology")).toBe("pathology");
    expect(usmleDisciplineId("step1", "anatomy")).toBeNull();
    expect(usmleDisciplineId("step3", "pathology")).toBeNull();
    expect(usmlePhysicianTaskId("diagnosis")).toBe("diagnosis");
    expect(usmlePhysicianTaskId("interpretation")).toBeNull();
  });

  it("keeps PANCE renal and drops tags that are not on the 2025 blueprint", () => {
    expect(panceContentId("renal")).toBe("renal");
    expect(panceContentId("professional-practice")).toBe("professional-practice");
    expect(panceContentId("other")).toBeNull();
    expect(panceTaskId("diagnosis")).toBe("diagnosis");
    expect(panceTaskId("renal")).toBeNull();
  });

  it("maps AANP and NPTE tags only when they are exact category ids", () => {
    expect(aanpDomainId("assess")).toBe("assess");
    expect(aanpDomainId("plan ")).toBe("plan");
    expect(aanpAgeGroupId("older-adult")).toBe("older-adult");
    expect(aanpAgeGroupId("geriatrics")).toBeNull();
    expect(npteBodySystemId("musculoskeletal")).toBe("musculoskeletal");
    expect(npteBodySystemId("msk")).toBeNull();
    expect(npteTaskId("interventions")).toBe("interventions");
    expect(npteTaskId("treatment")).toBeNull();
  });
});

describe("AANP joint age grid", () => {
  it("keeps building forms from the real domain-by-age pools", () => {
    const config = aanpFnpComposeConfig(1);
    const bounds = areaCountBounds(config.fullExamLength, config.secondaryAreas ?? []);
    const quota = planAreaCounts(config.fullExamLength, config.areas);
    expect(bounds).not.toBeNull();
    expect(quota).not.toBeNull();
    const available: Record<string, Record<string, number>> = {
      assess: {
        adolescent: 2,
        child: 71,
        infant: 250,
        "middle-adult": 96,
        newborn: 353,
        "older-adult": 650,
        toddler: 136,
        "young-adult": 5,
      },
      diagnose: {
        adolescent: 1,
        child: 77,
        infant: 410,
        "middle-adult": 582,
        newborn: 29,
        "older-adult": 42,
        toddler: 217,
        "young-adult": 100,
      },
      evaluate: {
        adolescent: 671,
        child: 348,
        infant: 67,
        "middle-adult": 26,
        newborn: 271,
        "older-adult": 51,
        toddler: 25,
        "young-adult": 5,
      },
      plan: {
        adolescent: 47,
        child: 258,
        infant: 42,
        "middle-adult": 30,
        newborn: 98,
        "older-adult": 88,
        toddler: 378,
        "young-adult": 679,
      },
    };
    let forms = 0;
    while (forms < 30 && quota && bounds) {
      const placed = allocateSecondaryTargets({ primaryQuota: quota, bounds, available });
      if (!placed) break;
      forms += 1;
      for (const [areaId, row] of Object.entries(placed)) {
        for (const [age, count] of Object.entries(row)) {
          available[areaId]![age] = (available[areaId]?.[age] ?? 0) - count;
        }
      }
    }
    expect(forms).toBeGreaterThanOrEqual(12);
  });
});

describe("secondary axis", () => {
  it("publishes a form only when both axes are inside their bands", () => {
    const items: ComposerItem[] = [];
    const ages = ["young", "older"];
    for (const areaId of ["assess", "plan"]) {
      for (let n = 0; n < 8; n++) {
        items.push({
          id: `${areaId}-${n}`,
          areaId,
          secondaryId: ages[n % 2],
          subjectId: "cardio",
          scenarioText: distinctCase(areaId, n),
          answerKey: `k-${areaId}-${n}`,
        });
      }
    }
    items.push({
      id: "no-age",
      areaId: "assess",
      subjectId: "cardio",
      scenarioText: distinctCase("assess", 99),
    });
    const result = composeBoardExams(items, {
      boardId: "demo-dual",
      fullExamLength: 4,
      maxFullExams: 3,
      maxItemReuse: 1,
      selectionSeed: "dual",
      areas: [
        { id: "assess", label: "Assess", minPct: 50, maxPct: 50, weight: 50 },
        { id: "plan", label: "Plan", minPct: 50, maxPct: 50, weight: 50 },
      ],
      secondaryAreas: [
        { id: "young", label: "Young", minPct: 50, maxPct: 50, weight: 50 },
        { id: "older", label: "Older", minPct: 50, maxPct: 50, weight: 50 },
      ],
      fullExamTitle: (index) => `Demo Practice Exam ${index}`,
    });
    expect(result.math.secondaryUnmappedItems).toBe(1);
    expect(result.math.publishedFullExams).toBeGreaterThan(0);
    for (const exam of result.exams) {
      expect(exam.secondaryOutOfRange).toEqual([]);
      expect(exam.secondaryCounts.young).toBe(2);
      expect(exam.secondaryCounts.older).toBe(2);
      expect(exam.title).not.toMatch(/shortfall|coming soon|placeholder/i);
    }
  });

  it("does not publish a USMLE block when a required system has no items", () => {
    const config = usmleBlockComposeConfig("step1", 2);
    const items: ComposerItem[] = [];
    for (const area of config.areas) {
      if (area.id === "human-development") continue;
      for (let n = 0; n < 12; n++) {
        items.push({
          id: `${area.id}-${n}`,
          areaId: area.id,
          subjectId: "pathology",
          scenarioText: distinctCase(area.id, n),
          answerKey: `k-${area.id}-${n}`,
        });
      }
    }
    const result = composeBoardExams(items, config);
    expect(result.math.publishedFullExams).toBe(0);
    expect(result.math.stopReason).toMatch(/human-development/);
    expect(result.exams).toEqual([]);
  });
});

describe("scoped row plan", () => {
  it("does not pause anything when no form is on plan", () => {
    const plan = planBoardExamRows({
      existing: [
        { examNumber: 1, active: true },
        { examNumber: 9201, active: true },
      ],
      composedCount: 0,
      publishNumbers: [1, 9201],
    });
    expect(plan).toEqual({ replace: [], create: [], pause: [] });
  });

  it("creates USMLE numbers above the other steps instead of reusing 1–N", () => {
    const reserved = Array.from({ length: 100 }, (_, index) => index + 1);
    const plan = planBoardExamRows({
      existing: [],
      composedCount: 2,
      maxExamNumber: 100_000,
      publishNumbers: [],
      reservedNumbers: reserved,
    });
    expect(plan.replace).toEqual([]);
    expect(plan.create).toEqual([101, 102]);
    expect(plan.pause).toEqual([]);
  });
});
