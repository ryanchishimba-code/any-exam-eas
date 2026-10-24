import { describe, expect, it } from "vitest";
import { examQuestionToStudy, studyQuestionsToExamQuestions } from "@/lib/questions/prepare";
import { gradeStudySelection } from "@/lib/exam-sessions/grade-stored-answer";

/**
 * Legacy timed practice at /exam/* loads withheld payloads (no client key) but
 * must grade from the stored bank row — same path as PATCH /exam-sessions/.../answer.
 */
describe("timed practice withheld keys", () => {
  it("grades the learner choice from the bank row when the client payload omits the key", () => {
    const study = examQuestionToStudy(
      {
        id: 1,
        bankItemId: "timed-1",
        type: "multiple_choice",
        question: "Which action comes first?",
        options: ["Call the provider", "Document only", "Offer fluids"],
        correctAnswer: "Call the provider",
      },
      0,
      { shuffleSeed: 3 }
    );
    const [wire] = studyQuestionsToExamQuestions([study]);
    expect(wire?.correctAnswer).toBe("");

    const keyed = "Call the provider";
    const picked = study.options.find((option) => option === keyed)!;
    const distractor = study.options.find((option) => option !== keyed)!;
    expect(gradeStudySelection(study, picked)).toBe(true);
    expect(gradeStudySelection(study, distractor)).toBe(false);
  });
});
