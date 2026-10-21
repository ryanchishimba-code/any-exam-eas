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

  it("maps PANCE items to NCCPA knowledge areas and reconciles with the headline", () => {
    const questions = [
      { subjectId: "cardiovascular", topicCategory: "cardiovascular" },
      { subjectId: "pulmonary", topicCategory: "pulmonary" },
      { subjectId: "professional-practice", topicCategory: "ethics" },
    ];
    const answers = [answer(0, true), answer(1, false), answer(2, true)];
    const rows = buildTopicBreakdown(questions, answers, { examSlug: "pance" });
    expect(rows.map((row) => row.topic).sort()).toEqual(
      ["Cardiovascular System", "Professional Practice", "Pulmonary System"].sort()
    );
    expect(rows.some((row) => row.topic === "Ethics")).toBe(false);
    const totals = practiceResultsTotals({ delivered: questions.length, answers, cat: false });
    expect(
      breakdownMatchesHeadline(rows, {
        attempted: totals.denominator,
        correct: answers.filter((row) => row.correct).length,
      })
    ).toBe(true);
  });

  it("maps AANP FNP and NPTE-PT items to board subject labels", () => {
    const fnpQuestions = [
      { subjectId: "womens-health" },
      { subjectId: "psychiatry-behavioral" },
    ];
    const fnpAnswers = [answer(0, true), answer(1, false)];
    const fnpRows = buildTopicBreakdown(fnpQuestions, fnpAnswers, { examSlug: "aanp-fnp" });
    expect(fnpRows.map((row) => row.topic).sort()).toEqual(
      ["Psychiatry & Behavioral Health", "Women's Health"].sort()
    );

    const npteQuestions = [
      { subjectId: "musculoskeletal" },
      { subjectId: "professional-responsibilities", topicCategory: "ethics" },
    ];
    const npteAnswers = [answer(0, true), answer(1, true)];
    const npteRows = buildTopicBreakdown(npteQuestions, npteAnswers, { examSlug: "npte-pt" });
    expect(npteRows.map((row) => row.topic)).toEqual([
      "Musculoskeletal System",
      "Professional Responsibilities",
    ]);
    expect(npteRows.some((row) => row.topic === "Ethics")).toBe(false);
  });

  it("includes answered items beyond the snapshot length in the breakdown tally", () => {
    const questions = [{ subjectId: "management-of-care" }];
    const answers = [
      answer(0, true),
      {
        questionIndex: 4,
        selected: "A",
        correct: false,
        answeredAt: "2026-10-05T00:00:00.000Z",
      },
    ];
    const rows = buildTopicBreakdown(questions, answers, { examSlug: "nclex" });
    const totals = practiceResultsTotals({ delivered: 5, answers, cat: true });
    expect(totals.denominator).toBe(2);
    expect(
      breakdownMatchesHeadline(rows, {
        attempted: totals.denominator,
        correct: 1,
      })
    ).toBe(true);
  });
});
