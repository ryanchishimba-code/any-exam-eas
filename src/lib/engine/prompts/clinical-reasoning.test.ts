import { describe, expect, it } from "vitest";
import {
  buildClinicalReasoningBlock,
  hasEtiologyOrPathophysiology,
  hasSignsAndSymptoms,
  scoreClinicalRichness,
} from "./clinical-reasoning";
import type { ExamQuestion } from "../../ai";

describe("clinical reasoning prompts", () => {
  it("includes CJMM for nursing", () => {
    const block = buildClinicalReasoningBlock("nursing");
    expect(block).toContain("Recognize Cues");
    expect(block).toContain("Evaluate Outcomes");
  });

  it("includes Step 1 vs Step 2 guidance", () => {
    expect(buildClinicalReasoningBlock("usmle-step-1")).toContain("basic science");
    expect(buildClinicalReasoningBlock("usmle-step-2")).toContain("next best step");
  });

  it("detects signs and symptoms in stems", () => {
    expect(hasSignsAndSymptoms("Client reports chest pain and BP 180/100")).toBe(true);
    expect(hasEtiologyOrPathophysiology("Due to insulin deficiency and ketosis")).toBe(true);
  });

  it("scores clinically rich questions higher", () => {
    const q: ExamQuestion = {
      id: 1,
      type: "multiple_choice",
      vignette: "A 62-year-old with fever, hypotension BP 88/50, and lactate 4.2.",
      question: "What is the next best step?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "Sepsis due to bacterial translocation causes distributive shock.",
      clinicalReasoning: "Recognize cues → analyze → prioritize → act",
      distractorRationale: { B: "wrong", C: "wrong", D: "wrong" },
      references: ["USMLE Content Outline"],
    };
    const score = scoreClinicalRichness(q, "usmle-step-2");
    expect(score).toBeGreaterThan(0.15);
  });
});
