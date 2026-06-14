import { describe, expect, it } from "vitest";
import {
  enrichBankItemGuidelines,
  hasStructuredGuidelineReferences,
  matchGuidelineRules,
  resolveGuidelineReferences,
} from "./enrich-guidelines";
import type { BankItem } from "@/lib/question-bank";

const sepsisItem: BankItem = {
  subjectId: "physiological-adaptation",
  vignette:
    "A 68-year-old client has fever, hypotension, tachycardia, altered mental status, and lactate 3.8 mmol/L after a urinary tract infection.",
  question: "Which action should the nurse take first?",
  options: ["IV fluids", "Blood cultures then antibiotics", "Oxygen", "Foley catheter"],
  correctAnswer: "Blood cultures then antibiotics",
  explanation: "This client has sepsis with organ dysfunction and needs timely antibiotics after cultures.",
};

describe("enrich-guidelines", () => {
  it("matches sepsis content to Surviving Sepsis references", () => {
    const rules = matchGuidelineRules("nursing", sepsisItem);
    expect(rules[0]?.id).toBe("sepsis");
    const { references } = resolveGuidelineReferences("nursing", sepsisItem);
    expect(references.some((r) => /Surviving Sepsis/i.test(r.label))).toBe(true);
  });

  it("enriches items missing structured references", () => {
    const result = enrichBankItemGuidelines(sepsisItem, "nursing");
    expect(result.changed).toBe(true);
    expect(result.referencesAdded).toBe(true);
    expect(hasStructuredGuidelineReferences(result.item)).toBe(true);
    expect(result.item.explanation).toMatch(/Clinical basis:/);
  });

  it("skips items that already have structured references", () => {
    const withRefs: BankItem = {
      ...sepsisItem,
      references: [{ label: "Surviving Sepsis Campaign", citation: "Hour-1 bundle" }],
    };
    const result = enrichBankItemGuidelines(withRefs, "nursing");
    expect(result.changed).toBe(false);
  });

  it("rejects generic-only reference labels", () => {
    expect(
      hasStructuredGuidelineReferences({
        ...sepsisItem,
        references: [{ label: "guidelines" }],
      })
    ).toBe(false);
  });
});
