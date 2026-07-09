import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  inferUsmleBlueprint,
  isValidUsmle2026BlueprintTopic,
  normalizeUsmleTopicSlug,
  resolveLegacyUsmleTopicAlias,
} from "./infer-blueprint-topic";

function item(partial: Partial<BankItem> & Pick<BankItem, "question">): BankItem {
  return {
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Test explanation.",
    subjectId: "internal-medicine",
    ...partial,
  };
}

describe("normalizeUsmleTopicSlug", () => {
  it("converts spaced labels to kebab-case slugs", () => {
    expect(normalizeUsmleTopicSlug("heart failure GDMT")).toBe("heart-failure-gdmt");
    expect(normalizeUsmleTopicSlug("gram-positive organisms")).toBe("gram-positive-organisms");
  });
});

describe("resolveLegacyUsmleTopicAlias", () => {
  it("maps legacy labels to 2026 slugs", () => {
    expect(resolveLegacyUsmleTopicAlias("heart failure GDMT", "step2")).toBe("chf-management");
    expect(resolveLegacyUsmleTopicAlias("DKA/HHS", "step2")).toBe("diabetes-dka-management");
    expect(resolveLegacyUsmleTopicAlias("ACS management", "step2")).toBe("acs-management");
  });

  it("uses step-specific overrides", () => {
    expect(resolveLegacyUsmleTopicAlias("AKI workup", "step1")).toBe("aki-mechanisms");
    expect(resolveLegacyUsmleTopicAlias("AKI workup", "step2")).toBe("aki-ckd-electrolytes");
  });
});

describe("inferUsmleBlueprint", () => {
  it("keeps valid existing 2026 slugs", () => {
    const result = inferUsmleBlueprint(
      item({
        question: "A patient with chest pain.",
        blueprintTopic: "acs-management",
        subjectId: "cardiology",
      }),
      "usmle-step-2"
    );
    expect(result.blueprintTopic).toBe("acs-management");
    expect(result.blueprintDomain).toBe("internal-medicine");
    expect(result.source).toBe("existing");
  });

  it("reassigns legacy spaced labels to canonical slugs and groups", () => {
    const result = inferUsmleBlueprint(
      item({
        question: "A patient with STEMI needs PCI and heparin.",
        blueprintTopic: "ACS management",
        subjectId: "cardiology",
      }),
      "usmle-step-2"
    );
    expect(result.blueprintTopic).toBe("acs-management");
    expect(result.blueprintDomain).toBe("internal-medicine");
    expect(result.source).toBe("legacy-alias");
  });

  it("infers ACS from vignette content when blueprintTopic is missing", () => {
    const result = inferUsmleBlueprint(
      item({
        question:
          "A 58-year-old man presents with crushing chest pain. Troponin is elevated. ECG shows ST elevation in leads II, III, aVF.",
        subjectId: "cardiology",
      }),
      "usmle-step-2"
    );
    expect(result.blueprintTopic).toBe("acs-management");
    expect(result.source).toBe("content-match");
  });

  it("assigns Step 3 biostats items to biostatistics group", () => {
    const result = inferUsmleBlueprint(
      item({
        question: "What is the number needed to treat if ARR is 0.05?",
        itemType: "biostats",
        subjectId: "internal-medicine",
      }),
      "usmle-step-3"
    );
    expect(result.blueprintTopic).toMatch(/nnt-arr|sensitivity-specificity-lr|study-design-appraisal/);
    expect(result.blueprintDomain).toBe("biostatistics");
  });

  it("validates catalog slugs", () => {
    expect(isValidUsmle2026BlueprintTopic("acs-management", "step2")).toBe(true);
    expect(isValidUsmle2026BlueprintTopic("heart failure GDMT", "step2")).toBe(false);
    expect(isValidUsmle2026BlueprintTopic("acs-management", "step1")).toBe(false);
  });
});
