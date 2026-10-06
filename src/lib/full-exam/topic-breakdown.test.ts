import { describe, expect, it } from "vitest";
import { buildTopicBreakdown } from "@/lib/full-exam/topic-breakdown";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";

function answer(index: number, correct: boolean): ExamAnswerRecord {
  return {
    questionIndex: index,
    selected: "A",
    correct,
    answeredAt: "2026-10-05T00:00:00.000Z",
  };
}

describe("buildTopicBreakdown", () => {
  it("splits NCLEX items by Client Needs instead of one General bucket", () => {
    const rows = buildTopicBreakdown(
      [
        { subjectId: "management-of-care" },
        { subjectId: "management-of-care" },
        { subjectId: "pharmacology-nursing" },
      ],
      [answer(0, true), answer(1, false), answer(2, true)]
    );
    expect(rows.map((row) => row.topic).sort()).toEqual([
      "Management of Care",
      "Pharmacological Therapies",
    ]);
    expect(rows.find((row) => row.topic === "Management of Care")).toMatchObject({
      correct: 1,
      total: 2,
    });
  });

  it("splits NAPLEX items by content area or topic when the bank has them", () => {
    const rows = buildTopicBreakdown(
      [
        { subjectId: "pharmacokinetics", blueprintDomain: "naplex-2026-drug-information" },
        { subjectId: "cardiovascular-rx", blueprintDomain: "naplex-2026-pharmacotherapy" },
      ],
      [answer(0, true), answer(1, false)]
    );
    const topics = rows.map((row) => row.topic);
    expect(topics).toContain("Pharmacokinetics & Pharmacodynamics");
    expect(topics).toContain("Cardiovascular Pharmacotherapy");
    expect(topics).not.toContain("General");
  });

  it("uses a NAPLEX blueprint area when that is the only label on the item", () => {
    const rows = buildTopicBreakdown(
      [{ blueprintDomain: "naplex-2026-pharmacotherapy" }],
      [answer(0, true)]
    );
    expect(rows[0]?.topic).toBe("Pharmacotherapy");
  });

  it("keeps General when the item has no topic data", () => {
    const rows = buildTopicBreakdown([{}, { subjectId: "__mixed__" }], [answer(0, false), answer(1, true)]);
    expect(rows).toEqual([{ topic: "General", correct: 1, total: 2, pct: 50 }]);
  });
});
