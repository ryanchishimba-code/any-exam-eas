import { describe, expect, it } from "vitest";
import { collectAanpFnpSeedItems } from "@/lib/edtech/seeds/aanp-fnp-seed-registry";
import {
  AANP_FNP_CLINICAL_GATE_CHECKLIST,
  buildVariantGenerationUserPrompt,
  summarizeAanpFnpGateFailures,
} from "./clinical-gate-prompt";

describe("clinical-gate-prompt", () => {
  it("includes mandatory vitals and history requirements", () => {
    expect(AANP_FNP_CLINICAL_GATE_CHECKLIST).toMatch(/year-old/i);
    expect(AANP_FNP_CLINICAL_GATE_CHECKLIST).toMatch(/mm Hg/i);
    expect(AANP_FNP_CLINICAL_GATE_CHECKLIST).toMatch(/distractor rationale/i);
  });

  it("builds variant prompt from seed", () => {
    const seed = collectAanpFnpSeedItems()[0]!;
    const prompt = buildVariantGenerationUserPrompt({
      variantTask: "age-shift",
      seed,
      domain: "assess",
    });
    expect(prompt).toContain("PASSING EXEMPLAR");
    expect(prompt).toContain("CLINICAL GATE CHECKLIST");
    expect(prompt).toContain(seed.correctAnswer);
  });

  it("summarizes gate failures for thin items", () => {
    const failures = summarizeAanpFnpGateFailures({
      question: "What next?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "short",
      subjectId: "cardiovascular",
    });
    expect(failures.length).toBeGreaterThan(0);
  });
});
