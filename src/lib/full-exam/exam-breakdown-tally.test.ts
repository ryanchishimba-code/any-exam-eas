import { describe, expect, it } from "vitest";
import { practiceResultsTotals } from "@/lib/full-exam/administered-score";
import {
  breakdownMatchesHeadline,
  buildClientNeedBreakdown,
  buildTopicBreakdown,
} from "@/lib/full-exam/exam-breakdown-tally";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";

function answer(index: number, correct: boolean): ExamAnswerRecord {
  return {
    questionIndex: index,
    selected: correct ? "A" : "B",
    correct,
    answeredAt: "2026-10-06T12:00:00.000Z",
  };
}

describe("exam breakdown reconciliation", () => {
  it("topic and client-need rows sum to headline attempted and correct", () => {
    const questions = [
      { subjectId: "psychiatric", blueprintTopic: "therapeutic-communication", question: "Depression screening" },
      { subjectId: "physiological-adaptation", blueprintTopic: "sepsis-shock" },
      { subjectId: "management-of-care", blueprintTopic: "prioritization" },
      { subjectId: "pharmacology-nursing", blueprintTopic: "medication-safety" },
      { subjectId: "reduction-risk", blueprintTopic: "dosage-calculations" },
    ];
    const answers = [
      answer(0, false),
      answer(1, true),
      answer(2, true),
      answer(3, false),
      answer(4, true),
    ];
    const totals = practiceResultsTotals({ delivered: questions.length, answers, cat: true });
    const correct = answers.filter((row) => row.correct).length;
    const headline = { attempted: totals.denominator, correct };

    const topicRows = buildTopicBreakdown(questions, answers, { examSlug: "nclex" });
    const needRows = buildClientNeedBreakdown(questions, answers);

    expect(breakdownMatchesHeadline(topicRows, headline)).toBe(true);
    expect(breakdownMatchesHeadline(needRows, headline)).toBe(true);
    expect(needRows.some((row) => row.label === "Psychosocial Integrity")).toBe(true);
    expect(topicRows.every((row) => row.topic.trim().length > 0)).toBe(true);
  });
});
