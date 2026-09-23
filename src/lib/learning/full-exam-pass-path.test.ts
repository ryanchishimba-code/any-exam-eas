import { describe, expect, it } from "vitest";
import { examSimCompletedOnUtcDay } from "@/lib/learning/exam-day-plan";
import {
  FULL_EXAM_PRACTICE_DISCLAIMER,
  analysisWithAnsweredCount,
  countFullExamMisses,
  draftsFromFullExamAnswers,
  examSimQualifyingQuestionCount,
  fullExamPassPathCopy,
  fullExamStudyMode,
  parseFullExamAnswerLog,
} from "@/lib/learning/full-exam-pass-path";

describe("full exam pass path", () => {
  it("keeps scored answers and drops blanks", () => {
    const parsed = parseFullExamAnswerLog([
      { questionIndex: 1, questionId: "b", selected: "B", correct: false, topicCategory: "cardiac" },
      { questionIndex: 0, questionId: "a", selected: "A", correct: true, topicCategory: "__mixed__" },
      { questionIndex: 2, questionId: "c", selected: "  ", correct: false },
      { questionIndex: 3, selected: "D", correct: false },
    ]);
    expect(parsed).toHaveLength(2);
    const drafts = draftsFromFullExamAnswers({
      answers: parsed ?? [],
      snapshots: [{ id: "b", question: "Stem about priority.", topicCategory: "cardiac" }],
    });
    expect(drafts.map((draft) => draft.questionKey)).toEqual(["a", "b"]);
    expect(drafts[0]?.subjectId).toBeUndefined();
    expect(drafts[1]).toMatchObject({
      bankItemId: "b",
      subjectId: "cardiac",
      correct: false,
      stemPreview: "Stem about priority.",
    });
    expect(countFullExamMisses(drafts)).toBe(1);
  });

  it("uses answered count for the qualifying length, including an early stop", () => {
    expect(examSimQualifyingQuestionCount({ questionCount: 150 })).toBe(150);
    const stamped = analysisWithAnsweredCount({ summary: "ended" }, 8);
    expect(stamped.passPathPersisted).toBe(true);
    expect(
      examSimQualifyingQuestionCount({
        questionCount: 150,
        analysis: stamped,
      })
    ).toBe(8);
    const now = new Date("2026-09-24T18:00:00.000Z");
    const early = examSimQualifyingQuestionCount({
      questionCount: 150,
      analysis: { answeredCount: 8 },
    });
    expect(
      examSimCompletedOnUtcDay(
        [
          {
            status: "ended_early",
            score: 50,
            questionCount: early,
            completedAt: "2026-09-24T12:00:00.000Z",
          },
        ],
        now
      )
    ).toBe(false);
    expect(
      examSimCompletedOnUtcDay(
        [
          {
            status: "completed",
            score: 70,
            questionCount: examSimQualifyingQuestionCount({
              questionCount: 50,
              analysis: { answeredCount: 50 },
            }),
            completedAt: "2026-09-24T12:00:00.000Z",
          },
        ],
        now
      )
    ).toBe(true);
  });

  it("states the practice band and an honest empty remediation path", () => {
    const empty = fullExamPassPathCopy({ missCount: 0, persisted: true });
    expect(empty.disclaimer).toBe(FULL_EXAM_PRACTICE_DISCLAIMER);
    expect(empty.reviewCta).toBeNull();
    expect(empty.title).toMatch(/No misses/);
    const misses = fullExamPassPathCopy({ missCount: 2, persisted: true });
    const legacy = fullExamPassPathCopy({ missCount: 4, persisted: false });
    expect(legacy.title).toBe("Practice simulation");
    expect(legacy.detail).toMatch(/before simulation misses/);
    expect(misses.reviewCta).toBe("Review incorrect");
    expect(`${empty.disclaimer} ${misses.detail}`).not.toMatch(/you will pass|guaranteed pass|board-ready/i);
    expect(fullExamStudyMode({ sessionConfig: { timed: false } })).toBe("tutor");
    expect(fullExamStudyMode({ sessionConfig: { timed: true } })).toBe("mock");
  });
});
