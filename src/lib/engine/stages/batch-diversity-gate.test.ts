import { describe, expect, it } from "vitest";
import type { GeneratedExam } from "@/lib/ai";
import {
  enforceGeneratedExamQuality,
  examQuestionPassesGenerationGate,
} from "./batch-diversity-gate";

function mcq(
  id: number,
  stem: string,
  options: string[],
  correct: string,
  vignette?: string
) {
  return {
    id,
    type: "multiple_choice" as const,
    question: stem,
    vignette,
    options,
    correctAnswer: correct,
    explanation: "Board-style rationale explaining why the keyed answer is best.",
  };
}

describe("batch-diversity-gate", () => {
  it("rejects placeholder MCQ options at generation time", () => {
    expect(
      examQuestionPassesGenerationGate(
        mcq(1, "Which intervention is indicated?", ["Option A", "Option B", "Option C", "Option D"], "Option A")
      )
    ).toBe(false);
  });

  it("drops weak items and preserves strong ones in generated exams", () => {
    const exam: GeneratedExam = {
      title: "Test",
      field: "USMLE",
      topic: "Cardiology",
      sourcesReviewed: 0,
      questions: [
        mcq(
          1,
          "A 62-year-old with acute dyspnea and elevated BNP — next step?",
          [
            "Start IV furosemide and oxygen",
            "Obtain urgent CT pulmonary angiography",
            "Schedule outpatient echocardiography in 4 weeks",
            "Discharge with oral antibiotics",
          ],
          "Start IV furosemide and oxygen",
          "A 62-year-old man with acute dyspnea, bilateral crackles, and BNP 980 pg/mL."
        ),
        mcq(2, "Bad?", ["Option A", "Option B", "Option C", "Option D"], "Option A"),
      ],
    };

    const { exam: cleaned, report } = enforceGeneratedExamQuality(exam, 1);
    expect(report.droppedIndividual).toBe(1);
    expect(cleaned.questions).toHaveLength(1);
    expect(cleaned.questions[0]?.correctAnswer).toBe("Start IV furosemide and oxygen");
  });
});
