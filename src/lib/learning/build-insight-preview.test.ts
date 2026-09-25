import { describe, expect, it } from "vitest";
import { buildInsightPreview } from "./build-insight-preview";
import type { StudyQuestion } from "@/lib/questions/types";

const question: StudyQuestion = {
  id: "q1",
  sourceIndex: 0,
  type: "multiple_choice",
  stem: "Which action is the nurse's priority?",
  options: ["Call the provider", "Assess airway", "Document findings"],
  correctAnswers: ["Assess airway"],
  explanation: "Airway before circulation in ABC prioritization.",
  explanationDetail: {
    summary: "ABCs",
    whyCorrect: "Airway is always first.",
    whyIncorrect: { "Call the provider": "Premature without assessment." },
    keyTakeaways: ["Think ABCs"],
    pearls: ["Stabilize before calling"],
    relatedConcepts: ["prioritization"],
  },
  tags: ["prioritization"],
};

describe("buildInsightPreview", () => {
  it("surfaces explanationDetail immediately without attempt API", () => {
    const preview = buildInsightPreview(question, false, ["Document findings"]);
    expect(preview.whyCorrect).toBe("Airway is always first.");
    expect(preview.whyIncorrect["Document findings"]).toContain("AI Tutor");
    expect(preview.keyTakeaways).toEqual(["Think ABCs"]);
  });

  it("skips a CJMM step label and uses the explanatory sentence", () => {
    const preview = buildInsightPreview(
      {
        ...question,
        explanation:
          "Clinical Judgment (CJMM): 1. Recognize cues: watery diarrhea after antibiotics needs soap and water. 2. Take action: start contact precautions.",
        explanationDetail: {
          ...question.explanationDetail!,
          whyCorrect: "Clinical Judgment (CJMM): 1.",
        },
      },
      false,
      ["Call the provider"]
    );
    expect(preview.whyCorrect.toLowerCase()).not.toContain("clinical judgment");
    expect(preview.whyCorrect).toMatch(/watery diarrhea after antibiotics needs soap and water/i);
  });

  it("uses encouraging copy on correct answers", () => {
    const preview = buildInsightPreview(question, true, ["Assess airway"]);
    expect(preview.summary).toContain("AI Tutor");
  });
});
