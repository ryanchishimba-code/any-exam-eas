import { describe, expect, it } from "vitest";
import type { ExamGenerationContext } from "@/lib/subjects/types";
import { usmleStep2Module } from "@/lib/subjects/usmle-step-2";
import { usmleStep3Module } from "@/lib/subjects/usmle-step-3";

const ctx = {
  field: "usmle-step-3",
  fieldId: "usmle-step-3",
  topic: "management",
  difficulty: "Medium",
  questionCount: 1,
  sources: [],
  researchBrief: "",
} as ExamGenerationContext;

describe("USMLE Step 3 generation prompt", () => {
  it("cites the Step 3 outline and does not inherit the Step 2 CK writer", () => {
    const system = usmleStep3Module.getExamSystemAugmentation();
    const user = usmleStep3Module.getExamUserAugmentation(ctx);
    expect(system).toMatch(/Cite USMLE Step 3 Content Outline/);
    expect(system).not.toMatch(/Cite USMLE Step 2 CK/);
    expect(user).toMatch(/USMLE STEP 3 AUGMENTATION/);
    expect(user).not.toMatch(/USMLE STEP 2 CK AUGMENTATION/);
    expect(usmleStep2Module.getExamSystemAugmentation()).toMatch(/Cite USMLE Step 2 CK Content Outline/);
  });
});
