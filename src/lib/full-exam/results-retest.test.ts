import { describe, expect, it } from "vitest";
import { practiceResultsTotals } from "@/lib/full-exam/administered-score";
import { buildTopicBreakdown } from "@/lib/full-exam/topic-breakdown";
import { fullExamTimeUsedSec } from "@/lib/full-exam/time-used";
import { catPracticeProgressPct } from "@/lib/questions/cat-select";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";

function answer(index: number, correct: boolean, at: string): ExamAnswerRecord {
  return {
    questionIndex: index,
    selected: correct ? "A" : "B",
    correct,
    answeredAt: at,
  };
}

describe("ended-early results", () => {
  it("scores a CAT from answered items, not the prefetched next item", () => {
    const answers = [
      ...Array.from({ length: 9 }, (_, i) => answer(i, true, "2026-10-06T12:00:00.000Z")),
      ...Array.from({ length: 23 }, (_, i) => answer(i + 9, false, "2026-10-06T12:05:00.000Z")),
    ];
    const totals = practiceResultsTotals({ delivered: 33, answers, cat: true });
    expect(totals).toMatchObject({ denominator: 32, answered: 32, unanswered: 1 });
    expect(totals.denominator - 9).toBe(23);
  });

  it("keeps a fixed form denominator and reports unanswered separately", () => {
    const answers = Array.from({ length: 32 }, (_, i) => answer(i, i < 9, "2026-10-06T12:00:00.000Z"));
    const totals = practiceResultsTotals({ delivered: 50, answers, cat: false });
    expect(totals).toMatchObject({ denominator: 50, answered: 32, unanswered: 18 });
  });

  it("percentages use answered items and keep a psychosocial row", () => {
    const questions = [
      { subjectId: "med-surg", question: "The client reports depression and a suicide plan." },
      { subjectId: "med-surg", question: "Which therapeutic response is best?" },
      { subjectId: "reduction-risk", question: "Postoperative bleeding is increasing." },
      { subjectId: "basic-care-comfort", question: "The client needs help with bathing." },
    ];
    const rows = buildTopicBreakdown(questions, [
      answer(0, false, "2026-10-06T12:00:00.000Z"),
      answer(1, true, "2026-10-06T12:01:00.000Z"),
    ]);
    const psych = rows.find((row) => row.topic === "Psychosocial Integrity");
    expect(psych).toMatchObject({ correct: 1, total: 2, pct: 50 });
    const unanswered = rows.reduce((sum, row) => sum + (row.unanswered ?? 0), 0);
    expect(unanswered).toBe(2);
    expect(rows.every((row) => row.total === 0 || row.pct === Math.round((row.correct / row.total) * 100))).toBe(
      true
    );
  });

  it("does not let a late start stamp undercut the answer span", () => {
    const used = fullExamTimeUsedSec({
      startedAt: "2026-10-06T12:10:28.000Z",
      nowMs: Date.parse("2026-10-06T12:10:56.000Z"),
      fallbackSec: 28,
      answerTimes: ["2026-10-06T12:04:00.000Z", "2026-10-06T12:10:40.000Z"],
    });
    expect(used).toBeGreaterThan(28);
  });

  it("shows practice progress from answered accuracy when the CAT ended early", () => {
    expect(
      catPracticeProgressPct({
        ability: -1,
        correctCount: 9,
        incorrectCount: 23,
        stopReason: null,
      })
    ).toBe(28);
  });
});
