import { describe, expect, it } from "vitest";
import { breakdownMatchesHeadline } from "@/lib/full-exam/exam-breakdown-tally";
import { practiceResultsTotals } from "@/lib/full-exam/administered-score";
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
  it("maps NCLEX items to official Client Needs labels", () => {
    const questions = [
      { subjectId: "management-of-care" },
      { subjectId: "management-of-care" },
      { subjectId: "pharmacology-nursing" },
    ];
    const answers = [answer(0, true), answer(1, false), answer(2, true)];
    const rows = buildTopicBreakdown(questions, answers, { examSlug: "nclex" });
    expect(rows.map((row) => row.topic).sort()).toEqual([
      "Management of Care",
      "Pharmacological Therapies",
    ]);
    const totals = practiceResultsTotals({ delivered: questions.length, answers, cat: true });
    expect(
      breakdownMatchesHeadline(rows, {
        attempted: totals.denominator,
        correct: answers.filter((row) => row.correct).length,
      })
    ).toBe(true);
  });

  it("maps NAPLEX items to NABP 2026 competency areas", () => {
    const questions = [
      { subjectId: "pharmacokinetics", blueprintDomain: "naplex-2026-medication-dispensing" },
      { subjectId: "cardiovascular-rx", blueprintDomain: "naplex-2026-pharmacotherapy" },
      { subjectId: "patient-counseling", blueprintDomain: "naplex-2026-patient-centered-care" },
    ];
    const answers = [answer(0, true), answer(1, false), answer(2, false)];
    const rows = buildTopicBreakdown(questions, answers, { examSlug: "naplex" });
    const topics = rows.map((row) => row.topic);
    expect(topics).toContain("Medication Dispensing & Distribution");
    expect(topics).toContain("Pharmacotherapy");
    expect(topics).toContain("Patient-Centered Care & Patient Safety");
    expect(topics).not.toContain("Other");
  });

  it("uses Other when the item has no topic data", () => {
    const answers = [answer(0, false), answer(1, true)];
    const rows = buildTopicBreakdown([{}, { subjectId: "__mixed__" }], answers, { examSlug: "nclex" });
    expect(rows).toEqual([{ topic: "Other", correct: 1, total: 2, pct: 50 }]);
  });
});
