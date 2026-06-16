import { describe, expect, it } from "vitest";
import { BATCH_DIVERSITY_RULES, BATCH_DIVERSITY_USER_REMINDER } from "./batch-diversity";
import { composeExamSystemPrompt } from "./compose";
import { buildHighYieldRequirements } from "./high-yield";
import { medicineModule } from "../../subjects/medicine";
import type { ExamGenerationContext } from "../../subjects/types";

describe("batch diversity prompts", () => {
  it("includes mandatory rules for all board exams", () => {
    expect(BATCH_DIVERSITY_RULES).toContain("all board exams");
    expect(BATCH_DIVERSITY_RULES).toContain("No two consecutive questions");
    expect(BATCH_DIVERSITY_RULES).toContain("batch of 10");
    expect(BATCH_DIVERSITY_USER_REMINDER).toContain("Every set of 10 questions");
  });

  it("injects batch diversity into composed system and user prompts", () => {
    const system = composeExamSystemPrompt(medicineModule);
    expect(system).toContain("BATCH DIVERSITY & ANTI-REPETITION");

    const user = buildHighYieldRequirements(medicineModule, {
      field: "USMLE",
      fieldId: "usmle-step-2",
      topic: "Cardiology",
      subjectId: "cardiology",
      difficulty: "medium",
      questionCount: 10,
      sources: [],
      researchBrief: "Brief",
    } satisfies ExamGenerationContext);

    expect(user).toContain("BATCH DIVERSITY & ANTI-REPETITION");
  });
});
