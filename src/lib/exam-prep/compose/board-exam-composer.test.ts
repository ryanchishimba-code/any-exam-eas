import { describe, expect, it } from "vitest";
import {
  areasOutsidePlan,
  composeBoardExams,
  planAreaCounts,
  scenariosNearDuplicate,
  type ComposerItem,
  type TestPlanArea,
  reuseStats,
} from "./board-exam-composer";
import { planBoardExamRows } from "./board-exam-row-plan";
import { nclexAreaId, nclexRn2026ComposeConfig } from "./nclex-rn-2026-plan";
import { naplex2025ComposeConfig, naplexComposerItem } from "./naplex-2025-plan";

const TWO_AREAS: TestPlanArea[] = [
  { id: "alpha", label: "Alpha", minPct: 40, maxPct: 60, weight: 50 },
  { id: "beta", label: "Beta", minPct: 40, maxPct: 60, weight: 50 },
];

function item(id: string, areaId: string, text: string, subjectId = areaId): ComposerItem {
  return { id, areaId, subjectId, scenarioText: text };
}

function distinctCase(areaId: string, n: number): string {
  const tokens = Array.from({ length: 24 }, (_, k) => `${areaId}${n}w${k}`).join(" ");
  return `Case ${areaId} ${n}. ${tokens} Pressure ${120 + n}/${70 + (n % 9)} and rate ${60 + n}.`;
}

function pool(perArea: number, areas = ["alpha", "beta"]): ComposerItem[] {
  const items: ComposerItem[] = [];
  for (const areaId of areas) {
    for (let n = 0; n < perArea; n++) {
      items.push(item(`${areaId}-${n}`, areaId, distinctCase(areaId, n)));
    }
  }
  return items;
}

describe("planAreaCounts", () => {
  it("fits an 85-item NCLEX form inside every 2026 range", () => {
    const config = nclexRn2026ComposeConfig();
    const quota = planAreaCounts(config.fullExamLength, config.areas);
    expect(quota).not.toBeNull();
    const total = Object.values(quota ?? {}).reduce((sum, count) => sum + count, 0);
    expect(total).toBe(85);
    expect(areasOutsidePlan(quota ?? {}, 85, config.areas)).toEqual([]);
    expect(quota?.psychosocial).toBeGreaterThanOrEqual(5);
  });
});

describe("composeBoardExams", () => {
  it("publishes unique balanced exams and stops when the pool runs out", () => {
    const result = composeBoardExams(pool(12), {
      boardId: "demo",
      areas: TWO_AREAS,
      fullExamLength: 10,
      maxFullExams: 5,
      maxItemReuse: 1,
      fullExamTitle: (index) => `Demo Practice Exam ${index}`,
    });
    expect(result.math.publishedFullExams).toBe(2);
    expect(result.math.publishedFullExams).toBeLessThan(5);
    expect(result.overlap.identicalPairs).toBe(0);
    expect(result.overlap.maxSharedItems).toBe(0);
    expect(result.exams.every((exam) => exam.areasOutOfRange.length === 0)).toBe(true);
    expect(result.exams.every((exam) => !exam.title.includes("Full-Length"))).toBe(true);
    expect(result.math.stopReason).toMatch(/Stopped at 2/);
  });

  it("keeps near-duplicate scenarios out of the same exam", () => {
    const shared =
      "A 67-year-old client has BP 88/54, HR 124, RR 28, and a 2.5 kg weight gain with crackles. Oxygen saturation is 88 percent.";
    const items = [
      item("dup-a", "alpha", shared),
      item("dup-b", "alpha", `${shared} The family is at the bedside.`),
      ...pool(8).filter((row) => row.areaId === "alpha").slice(0, 6),
      ...pool(8).filter((row) => row.areaId === "beta"),
    ];
    expect(scenariosNearDuplicate(items[0]!.scenarioText, items[1]!.scenarioText)).toBe(true);
    const result = composeBoardExams(items, {
      boardId: "demo",
      areas: TWO_AREAS,
      fullExamLength: 10,
      maxFullExams: 1,
      maxItemReuse: 1,
      fullExamTitle: (index) => `Demo ${index}`,
    });
    expect(result.math.publishedFullExams).toBe(1);
    const ids = result.exams[0]!.itemIds;
    expect(ids.includes("dup-a") && ids.includes("dup-b")).toBe(false);
  });

  it("titles a leftover single-subject form as a practice set", () => {
    const peds = Array.from({ length: 40 }, (_, n) =>
      item(`peds-${n}`, "alpha", distinctCase("peds", n), "pediatrics-nursing")
    );
    const result = composeBoardExams(peds, {
      boardId: "demo",
      areas: TWO_AREAS,
      fullExamLength: 10,
      maxFullExams: 2,
      maxItemReuse: 1,
      fullExamTitle: (index) => `Demo Full-Length ${index}`,
      subjectSets: { length: 40, titles: { "pediatrics-nursing": "Pediatrics Practice Set" } },
    });
    expect(result.math.publishedFullExams).toBe(0);
    expect(result.exams.map((exam) => exam.title)).toEqual(["Pediatrics Practice Set"]);
    expect(result.exams[0]?.kind).toBe("subject-set");
  });
});

describe("nclex area tags", () => {
  it("maps specialty subjects onto the 2026 client-needs areas", () => {
    expect(nclexAreaId("pediatrics-nursing", null)).toBe("health-promotion");
    expect(nclexAreaId("maternal-child", null)).toBe("health-promotion");
    expect(nclexAreaId("fundamentals", null)).toBe("basic-care-comfort");
    expect(nclexAreaId("med-surg", null)).toBe("physiological-adaptation");
    expect(nclexAreaId("pharmacology-nursing", "safety-infection")).toBe("safety-infection");
  });
});

describe("planBoardExamRows", () => {
  it("keeps published forms inside 1–100 and pauses the high-numbered duplicates", () => {
    const existing = [
      ...Array.from({ length: 21 }, (_, index) => ({ examNumber: index + 1, active: true })),
      { examNumber: 9201, active: true },
      { examNumber: 9302, active: true },
    ];
    const plan = planBoardExamRows({ existing, composedCount: 43 });
    expect(plan.replace).toEqual(Array.from({ length: 21 }, (_, index) => index + 1));
    expect(plan.create[0]).toBe(22);
    expect(plan.create[plan.create.length - 1]).toBe(43);
    expect(plan.pause).toEqual([9201, 9302]);
  });

  it("refuses to publish exam numbers the launcher cannot open", () => {
    expect(() => planBoardExamRows({ existing: [], composedCount: 101 })).toThrow(/1–100/);
  });

  it("keeps NAPLEX exam numbers 10–33 instead of compacting to 1–24", () => {
    const existing = [
      ...Array.from({ length: 9 }, (_, index) => ({ examNumber: index + 1, active: false })),
      ...Array.from({ length: 24 }, (_, index) => ({ examNumber: index + 10, active: true })),
    ];
    const active = existing.filter((row) => row.active).map((row) => row.examNumber);
    const plan = planBoardExamRows({ existing, composedCount: 20, publishNumbers: active });
    expect(plan.replace).toEqual(Array.from({ length: 20 }, (_, index) => index + 10));
    expect(plan.create).toEqual([]);
    expect(plan.pause).toEqual([30, 31, 32, 33]);
  });
});

describe("naplex composition", () => {
  it("targets the May 2025 weights on an 85-item form", () => {
    const config = naplex2025ComposeConfig();
    const quota = planAreaCounts(config.fullExamLength, config.areas);
    expect(config.areas).toHaveLength(5);
    expect(config.areas.map((area) => [area.label, area.weight])).toEqual([
      ["Foundational Knowledge for Pharmacy Practice", 25],
      ["Medication Use Process", 25],
      ["Person-Centered Assessment and Treatment Planning", 40],
      ["Professional Practice", 5],
      ["Pharmacy Management and Leadership", 5],
    ]);
    expect(quota).not.toBeNull();
    const total = Object.values(quota ?? {}).reduce((sum, count) => sum + count, 0);
    expect(total).toBe(85);
    expect(areasOutsidePlan(quota ?? {}, 85, config.areas)).toEqual([]);
  });

  it("does not treat a therapeutic vignette as a calculation", () => {
    const item = naplexComposerItem({
      id: "law-1",
      subjectId: "pharmacy-law",
      blueprintDomain: "naplex-area3-treatment-planning",
      itemType: "vignette",
      question: "Which counseling point is best?",
      scenario: "The patient asks about a refill.",
      correctAnswer: "Call the prescriber",
      scenarioText: "The patient asks about a refill. Which counseling point is best?",
    });
    expect(item?.signals ?? []).not.toContain("calculation");
    expect(item?.areaId).toBe("naplex-area3-treatment-planning");
  });

  it("keeps a normal title when professional-practice items cannot fill the weight", () => {
    const config = naplex2025ComposeConfig(1);
    const areas = config.areas.map((area) => area.id);
    const items: ComposerItem[] = [];
    for (const areaId of areas) {
      const count = areaId === "naplex-area4-safety" ? 1 : 40;
      for (let n = 0; n < count; n++) {
        items.push({
          id: `${areaId}-${n}`,
          areaId,
          subjectId: areaId === "naplex-area1-foundations" && n < 6 ? "pharmacokinetics" : "cardiovascular-rx",
          scenarioText: distinctCase(areaId, n),
          answerKey: `key ${areaId} ${n}`,
          signals: areaId === "naplex-area1-foundations" && n < 8 ? ["calculation"] : [],
        });
      }
    }
    for (const subjectId of ["cns-rx", "endocrine-rx", "infectious-disease-rx"]) {
      for (let n = 0; n < 5; n++) {
        items.push({
          id: `${subjectId}-${n}`,
          areaId: "naplex-area3-treatment-planning",
          subjectId,
          scenarioText: distinctCase(subjectId, n + 50),
          answerKey: `key ${subjectId} ${n}`,
        });
      }
    }
    const result = composeBoardExams(items, config);
    expect(result.math.publishedFullExams).toBe(1);
    expect(result.exams[0]?.title).toBe("NAPLEX Practice Exam 1");
    expect(result.exams[0]?.shortfall).toContain("naplex-area4-safety");
    expect(result.exams[0]?.areaCounts["naplex-area4-safety"]).toBe(1);
  });

  it("uses leftover items before repeating one", () => {
    const items = pool(3);
    const result = composeBoardExams(items, {
      boardId: "demo",
      areas: TWO_AREAS,
      fullExamLength: 4,
      maxFullExams: 2,
      maxItemReuse: 2,
      selectionSeed: "reuse-seed",
      fullExamTitle: (index) => `Demo ${index}`,
    });
    expect(result.math.publishedFullExams).toBe(2);
    const first = new Set(result.exams[0]!.itemIds);
    const leftovers = items.map((item) => item.id).filter((id) => !first.has(id));
    expect(leftovers.length).toBeGreaterThan(0);
    for (const id of leftovers) expect(result.exams[1]!.itemIds).toContain(id);
    expect(reuseStats(result.exams).maxReuse).toBeLessThanOrEqual(2);
  });

  it("caps how many items any two forms share", () => {
    const items = pool(4);
    const shared = {
      boardId: "demo",
      areas: TWO_AREAS,
      fullExamLength: 4,
      maxFullExams: 4,
      maxItemReuse: 3,
      fullExamTitle: (index: number) => `Demo ${index}`,
    };
    const open = composeBoardExams(items, shared);
    const capped = composeBoardExams(items, { ...shared, maxSharedItems: 1 });
    expect(open.overlap.maxSharedItems).toBeGreaterThan(1);
    expect(capped.math.publishedFullExams).toBeGreaterThan(0);
    expect(capped.overlap.maxSharedItems).toBeLessThanOrEqual(1);
    expect(capped.math.publishedFullExams).toBeLessThan(open.math.publishedFullExams);
    for (const exam of capped.exams) {
      expect(new Set(exam.itemIds).size).toBe(exam.itemIds.length);
      expect(exam.areasOutOfRange).toEqual([]);
    }
    expect(capped.math.stopReason).toMatch(/pairwise-overlap|share more than 1/);
  });
});
