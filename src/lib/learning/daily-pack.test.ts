import { describe, expect, it } from "vitest";
import {
  DAILY_PACK_SIZE,
  answerKeyIndex,
  buildDailyPackSequence,
  dailyPackServeWhere,
  examUsesSharedDailyPack,
  excludeStep3FiledOnStep2,
  isDailyPackFieldRow,
  masteryTodayExamSlug,
  serveDailyPack,
  type DailyPackCandidate,
} from "@/lib/learning/daily-pack";

function candidate(
  id: string,
  categoryKey: string,
  weight: number,
  keyIndex: number | null
): DailyPackCandidate {
  return { id, categoryKey, weight, keyIndex };
}

function letters(prefix: string, count: number, keyIndex: number): DailyPackCandidate[] {
  return Array.from({ length: count }, (_, index) =>
    candidate(`${prefix}-k${keyIndex}-${String(index).padStart(2, "0")}`, prefix, 1, keyIndex)
  );
}

describe("daily pack sequence", () => {
  it("is deterministic and uses each id once", () => {
    const pool = [
      ...letters("cardiac", 8, 0),
      ...letters("renal", 8, 1),
      ...letters("neuro", 8, 2),
    ].map((item, index) => ({ ...item, weight: index % 2 === 0 ? 0.5 : 0.25, id: `q-${index}` }));
    const first = buildDailyPackSequence(pool);
    const second = buildDailyPackSequence([...pool].reverse());
    expect(second).toEqual(first);
    expect(new Set(first).size).toBe(first.length);
    expect(first).toHaveLength(pool.length);
  });

  it("interleaves answer keys inside a blueprint category", () => {
    const pool = [0, 1, 2, 3].flatMap((key) => letters("cardiac", 10, key));
    const sequence = buildDailyPackSequence(pool);
    const first = sequence.slice(0, DAILY_PACK_SIZE);
    const counts = [0, 0, 0, 0];
    for (const id of first) {
      const item = pool.find((row) => row.id === id);
      expect(item?.keyIndex).not.toBeNull();
      counts[item!.keyIndex!] += 1;
    }
    expect(counts).toEqual([5, 5, 5, 5]);
  });

  it("walks heavier blueprint categories more often", () => {
    const heavy = Array.from({ length: 30 }, (_, index) =>
      candidate(`heavy-${index}`, "cardiac", 0.75, index % 4)
    );
    const light = Array.from({ length: 30 }, (_, index) =>
      candidate(`light-${index}`, "renal", 0.25, index % 4)
    );
    const first = buildDailyPackSequence([...heavy, ...light]).slice(0, DAILY_PACK_SIZE);
    const heavyCount = first.filter((id) => id.startsWith("heavy-")).length;
    const lightCount = first.filter((id) => id.startsWith("light-")).length;
    expect(heavyCount + lightCount).toBe(DAILY_PACK_SIZE);
    expect(heavyCount).toBeGreaterThan(lightCount * 2);
  });
});

describe("daily pack days", () => {
  const sequence = Array.from({ length: 50 }, (_, index) => `id-${index}`);

  it("does not repeat an id inside one full pass", () => {
    const days = [0, 1, 2].map((dayIndex) => serveDailyPack({ sequence, dayIndex }).ids);
    expect(days[0]).toHaveLength(20);
    expect(days[1]).toHaveLength(20);
    expect(days[2]).toHaveLength(10);
    const union = new Set(days.flat());
    expect(union.size).toBe(50);
    expect(serveDailyPack({ sequence, dayIndex: 3 }).ids).toEqual(days[0]);
  });

  it("serves a thin pool as-is and starts the next day over", () => {
    const thin = ["a", "b", "c", "d", "e", "f", "g"];
    const today = serveDailyPack({ sequence: thin, dayIndex: 4 });
    const tomorrow = serveDailyPack({ sequence: thin, dayIndex: 5 });
    expect(today.ids).toEqual(thin);
    expect(tomorrow.ids).toEqual(thin);
    expect(new Set(today.ids).size).toBe(thin.length);
  });

  it("keeps an empty pool empty", () => {
    expect(serveDailyPack({ sequence: [], dayIndex: 0 })).toEqual({
      ids: [],
      borrowed: [],
      overflow: [],
    });
    expect(serveDailyPack({ sequence: [], dayIndex: 12, borrowed: ["x"] }).ids).toEqual([]);
  });

  it("replaces a retired id from the deterministic overflow without repeating it later", () => {
    const retired = new Set(["id-0"]);
    const today = serveDailyPack({ sequence, dayIndex: 0, ineligible: retired });
    expect(today.ids).toHaveLength(20);
    expect(today.ids).not.toContain("id-0");
    expect(today.ids).toContain("id-20");
    expect(today.borrowed).toContain("id-20");

    const again = serveDailyPack({ sequence, dayIndex: 0, ineligible: retired });
    expect(again.ids).toEqual(today.ids);

    const tomorrow = serveDailyPack({
      sequence,
      dayIndex: 1,
      borrowed: today.borrowed,
      ineligible: retired,
    });
    expect(tomorrow.ids).not.toContain("id-20");
    expect(tomorrow.ids).not.toContain("id-0");
    const overlap = today.ids.filter((id) => tomorrow.ids.includes(id));
    expect(overlap).toEqual([]);
  });
});

describe("daily pack field isolation", () => {
  it("keeps Step 3 rows filed on Step 2 off the Step 2 pack and on the Step 3 pack", () => {
    const step3OnStep2 = { fieldId: "usmle-step-2", stepLevel: "step3", itemType: "mcq", active: true, qaPassed: true };
    const step2 = { fieldId: "usmle-step-2", stepLevel: "step2", itemType: "mcq", active: true, qaPassed: true };
    const nursing = { fieldId: "nursing", stepLevel: null, itemType: "mcq", active: true, qaPassed: true };
    const retired = { fieldId: "pance", stepLevel: null, itemType: "mcq", active: false, qaPassed: true };
    const failed = { fieldId: "pance", stepLevel: null, itemType: "mcq", active: true, qaPassed: false };
    const caseRow = { fieldId: "pance", stepLevel: null, itemType: "case_study", active: true, qaPassed: true };

    expect(isDailyPackFieldRow(step3OnStep2, "usmle-step-2")).toBe(false);
    expect(isDailyPackFieldRow(step3OnStep2, "usmle-step-3")).toBe(true);
    expect(isDailyPackFieldRow(step2, "usmle-step-2")).toBe(true);
    expect(isDailyPackFieldRow(step2, "usmle-step-3")).toBe(false);
    expect(isDailyPackFieldRow(nursing, "pance")).toBe(false);
    expect(isDailyPackFieldRow(retired, "pance")).toBe(false);
    expect(isDailyPackFieldRow(failed, "pance")).toBe(false);
    expect(isDailyPackFieldRow(caseRow, "pance")).toBe(false);
  });

  it("builds the serve filter from active, qaPassed, the field, and no case types", () => {
    expect(dailyPackServeWhere("pance")).toMatchObject({
      active: true,
      qaPassed: true,
      fieldId: "pance",
    });
    expect(dailyPackServeWhere("nclex")).toMatchObject({ fieldId: "nursing" });
    const step2 = dailyPackServeWhere("usmle-step-2");
    expect(step2.fieldId).toBe("usmle-step-2");
    expect(step2.OR).toEqual([{ stepLevel: null }, { stepLevel: { not: "step3" } }]);
    expect(excludeStep3FiledOnStep2("usmle-step-2")).toEqual({
      OR: [{ stepLevel: null }, { stepLevel: { not: "step3" } }],
    });
    expect(excludeStep3FiledOnStep2("usmle-step-3")).toEqual({});
    const step3 = dailyPackServeWhere("usmle-step-3");
    expect(step3.OR).toEqual([
      { fieldId: "usmle-step-3" },
      { fieldId: "usmle-step-2", stepLevel: "step3" },
    ]);
    const excluded = (dailyPackServeWhere("aanp-fnp").itemType as { notIn: string[] }).notIn;
    expect(excluded).toEqual(expect.arrayContaining(["case_study", "unfolding_case", "case_based"]));
  });

  it("does not share ids across two field sequences", () => {
    const nursing = buildDailyPackSequence(
      Array.from({ length: 25 }, (_, index) => candidate(`nursing-${index}`, "cardiac", 1, index % 4))
    );
    const pharmacy = buildDailyPackSequence(
      Array.from({ length: 25 }, (_, index) => candidate(`pharmacy-${index}`, "calc", 1, index % 4))
    );
    const shared = nursing.filter((id) => pharmacy.includes(id));
    expect(shared).toEqual([]);
  });
});

describe("which boards use the shared pack", () => {
  it("sends PANCE, AANP FNP, and NPTE-PT to the pack and keeps mastery on the three engines", () => {
    expect(examUsesSharedDailyPack("pance")).toBe(true);
    expect(examUsesSharedDailyPack("aanp-fnp")).toBe(true);
    expect(examUsesSharedDailyPack("npte-pt", "npte-pt")).toBe(true);
    expect(examUsesSharedDailyPack("nclex", "nursing")).toBe(false);
    expect(masteryTodayExamSlug("pance", "pance")).toBeNull();
    expect(masteryTodayExamSlug("aanp-fnp", "aanp-fnp")).toBeNull();
    expect(masteryTodayExamSlug("npte-pt", "npte-pt")).toBeNull();
    expect(masteryTodayExamSlug("dentistry", null)).toBeNull();
    expect(masteryTodayExamSlug("nursing", "nclex")).toBe("nclex");
    expect(masteryTodayExamSlug("pharmacy", "naplex")).toBe("naplex");
    expect(masteryTodayExamSlug("usmle-step-1", "usmle")).toBe("usmle");
    expect(masteryTodayExamSlug("usmle-step-3", "usmle")).toBe("usmle");
  });
});

describe("answer key index", () => {
  it("reads the letter from the stored option order", () => {
    const options = JSON.stringify(["Hold", "Give", "Call", "Document"]);
    expect(answerKeyIndex("Call", options)).toBe(2);
    expect(answerKeyIndex("Give, Call", options)).toBeNull();
    expect(answerKeyIndex("Missing", options)).toBeNull();
  });
});
