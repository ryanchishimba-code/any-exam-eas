import { describe, expect, it } from "vitest";
import {
  areasOutsidePlan,
  composeBoardExams,
  planAreaCounts,
  scenariosNearDuplicate,
  type ComposerItem,
  type TestPlanArea,
} from "./board-exam-composer";
import { planBoardExamRows } from "./board-exam-row-plan";
import { nclexAreaId, nclexRn2026ComposeConfig } from "./nclex-rn-2026-plan";

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
});
