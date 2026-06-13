import { describe, expect, it } from "vitest";
import { normalizeQuestionOptions } from "@/lib/question-format";
import {
  examQuestionToStudy,
  prepareQuestionsForSession,
  studyQuestionsToExamQuestions,
} from "./prepare";
import type { RawQuestionInput } from "./types";

function nclexItem(
  id: number,
  bankItemId: string,
  vignette: string,
  stem: string,
  options: string[],
  correct: string
): RawQuestionInput {
  return {
    id,
    bankItemId,
    type: "multiple_choice",
    vignette,
    question: stem,
    options,
    correctAnswer: correct,
    explanation: `Explanation for ${bankItemId}`,
    field: "nursing",
    subjectId: "med-surg",
  };
}

describe("studyQuestionsToExamQuestions", () => {
  it("keeps vignette and correct answer aligned after session shuffle", () => {
    const raw = [
      nclexItem(
        1,
        "sepsis-q",
        "Client with fever, hypotension, lactate 4.2.",
        "Which action should the nurse take first?",
        ["Give fluids", "Obtain cultures then antibiotics", "Apply oxygen", "Insert catheter"],
        "Obtain cultures then antibiotics"
      ),
      nclexItem(
        2,
        "icp-q",
        "Client after head injury with GCS 12 and sluggish pupils.",
        "Which action should the nurse take first?",
        ["Give acetaminophen", "Apply restraints", "Elevate HOB 30° and notify provider", "Insert catheter"],
        "Elevate HOB 30° and notify provider"
      ),
    ];

    const prepared = prepareQuestionsForSession(raw, { shuffleOrder: true });
    const exam = studyQuestionsToExamQuestions(prepared);

    expect(exam).toHaveLength(2);

    for (const q of exam) {
      expect(q.vignette).toBeTruthy();
      expect(q.options).toContain(q.correctAnswer);
      if (q.vignette?.includes("lactate")) {
        expect(q.correctAnswer).toBe("Obtain cultures then antibiotics");
        expect(q.explanation).toContain("sepsis-q");
      }
      if (q.vignette?.includes("GCS 12")) {
        expect(q.correctAnswer).toBe("Elevate HOB 30° and notify provider");
        expect(q.explanation).toContain("icp-q");
      }
    }
  });
});

describe("normalizeQuestionOptions", () => {
  it("does not default to option A when correctAnswer text differs slightly", () => {
    const { options, correctAnswer } = normalizeQuestionOptions(
      ["Document finding", "Delegate to UAP", "Reassure client", "Notify provider"],
      "Notify provider"
    );
    expect(correctAnswer).toBe("Notify provider");
    expect(options).toContain("Notify provider");
  });

  it("preserves correct answer through examQuestionToStudy pipeline", () => {
    const q = examQuestionToStudy(
      {
        id: 1,
        type: "multiple_choice",
        question: "Which action first?",
        options: ["A) Wrong", "B) Right answer", "C) Also wrong", "D) Nope"],
        correctAnswer: "B) Right answer",
        explanation: "Because B.",
      },
      0
    );
    expect(q.correctAnswers[0]).toBe("Right answer");
    expect(q.options).toContain("Right answer");
  });
});
