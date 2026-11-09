import { describe, expect, it } from "vitest";
import { buildBulkQuestion } from "../bulk-question-generator";
import { getSubjectsForFieldId } from "../subjects/registry";
import {
  generatedItemFromBankItem,
  reviewGeneratedItem,
  stemFamilyFingerprint,
  withGeneratedItemGate,
  type GeneratedItemForGate,
} from "./generated-item-gate";

function readyItem(overrides: Partial<GeneratedItemForGate> = {}): GeneratedItemForGate {
  const takeaway =
    "Mild fever is not a reason to delay MMR; give the vaccines due today.";
  return {
    fieldId: "usmle-step-2",
    stepLevel: "step2",
    scenario:
      "A 12-month-old girl is due for MMR and varicella. Since yesterday she has a clear runny nose and a temperature of 38.2 C. She is playful and feeding.",
    question: "Which action is the most appropriate next step?",
    options: [
      "Administer the scheduled vaccines today",
      "Defer the vaccines until the illness resolves",
      "Record a permanent contraindication to MMR",
    ],
    correctAnswer: "Administer the scheduled vaccines today",
    explanation: `${takeaway} CDC immunization guidance (2024) says a mild illness is not a precaution, so administer the scheduled vaccines today. Defer the vaccines until the illness resolves only for moderate or severe illness. Record a permanent contraindication to MMR only after anaphylaxis or severe immunodeficiency.`,
    difficulty: 3,
    outlineWeight: 2,
    examTakeaway: takeaway,
    citation: "CDC 2024",
    ...overrides,
  };
}

describe("generated item gate", () => {
  it("activates only when every rule passes", () => {
    expect(reviewGeneratedItem(readyItem(), new Set()).activate).toBe(true);
  });

  it("keeps an item inactive when it does not show exam-readiness value", () => {
    const missing = reviewGeneratedItem(
      readyItem({ examTakeaway: "", outlineWeight: 0, difficulty: null }),
      new Set()
    );
    expect(missing.activate).toBe(false);
    expect(missing.failures[0]).toMatch(/exam-readiness value/);
  });

  it("rejects a near-duplicate stem family already in the served bank", () => {
    const item = readyItem();
    const fingerprint = stemFamilyFingerprint(item.scenario ?? "", item.question);
    const aged = readyItem({
      scenario: item.scenario?.replace("12-month-old", "14-month-old"),
    });
    expect(stemFamilyFingerprint(aged.scenario ?? "", aged.question)).toBe(fingerprint);
    const result = reviewGeneratedItem(item, new Set([fingerprint]));
    expect(result.activate).toBe(false);
    expect(result.failures.join(" ")).toMatch(/duplicates/);
  });

  it("rejects a generic Step outline and an option the rationale skips", () => {
    const result = reviewGeneratedItem(
      readyItem({
        explanation:
          "USMLE Step 2 CK reasoning: 1. Recognize cues. 2. Select the answer. Mild fever is not a reason to delay MMR; give the vaccines due today.",
      }),
      new Set()
    );
    expect(result.activate).toBe(false);
    expect(result.failures.join(" ")).toMatch(/every option/);
  });

  it("rejects two keyed answers and a step label that does not match the field", () => {
    const two = reviewGeneratedItem(
      readyItem({ correctAnswer: "Defer the vaccines until the illness resolves|||" }),
      new Set()
    );
    expect(two.failures.join(" ")).toMatch(/one defensible best answer/);

    const step = reviewGeneratedItem(readyItem({ stepLevel: "step3" }), new Set());
    expect(step.failures.join(" ")).toMatch(/Step label must be step2/);
  });

  it("activates a passing row once, then keeps a same-family twin inactive", () => {
    const fingerprints = new Set<string>();
    const row = { active: true, qaPassed: true, generationMeta: { keep: true } };
    const first = withGeneratedItemGate(row, readyItem(), fingerprints);
    expect(first.active).toBe(true);
    expect(first.qaPassed).toBe(true);
    expect(first.generationMeta).toMatchObject({
      keep: true,
      generatedItemGate: { activate: true, failures: [] },
    });

    const twin = withGeneratedItemGate(
      row,
      readyItem({ scenario: readyItem().scenario?.replace("12-month-old", "14-month-old") }),
      fingerprints
    );
    expect(twin.active).toBe(false);
    expect(twin.qaPassed).toBe(false);
  });

  it("stays inactive when the structural ingest gate did not pass", () => {
    const gated = withGeneratedItemGate({ active: true, qaPassed: false }, readyItem(), new Set());
    expect(gated.active).toBe(false);
    expect(gated.qaPassed).toBe(false);
  });

  it("keeps a procedural USMLE template inactive", () => {
    for (const fieldId of ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const) {
      const subject = getSubjectsForFieldId(fieldId)[0];
      expect(subject).toBeTruthy();
      const bulk = buildBulkQuestion(fieldId, subject!, 0);
      const gated = withGeneratedItemGate(
        { active: true, qaPassed: true },
        generatedItemFromBankItem(fieldId, bulk),
        new Set()
      );
      expect(gated.active).toBe(false);
      expect(gated.qaPassed).toBe(false);
      const meta = gated.generationMeta as { generatedItemGate: { failures: string[] } };
      expect(meta.generatedItemGate.failures[0]).toMatch(/exam-readiness value/);
    }
  });

  it("requires a citation on a management decision", () => {
    const result = reviewGeneratedItem(
      readyItem({
        explanation:
          "Mild fever is not a reason to delay MMR; give the vaccines due today. Defer the vaccines until the illness resolves only for a moderate illness. Record a permanent contraindication to MMR only after anaphylaxis.",
        citation: null,
      }),
      new Set()
    );
    expect(result.activate).toBe(false);
    expect(result.failures.join(" ")).toMatch(/citation/);
  });
});
