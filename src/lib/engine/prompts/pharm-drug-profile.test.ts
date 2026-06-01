import { describe, expect, it } from "vitest";
import type { ExamQuestion } from "../../ai";
import type { ExamGenerationContext } from "../../subjects/types";
import {
  buildDrugCatalogReferenceBlock,
  buildPharmDrugRequirementsBlock,
  formatDrugProfileForExplanation,
  isDrugProfileComplete,
  isPharmDrugContext,
  normalizeDrugProfile,
  requiresDrugProfileOnEveryQuestion,
  scoreDrugProfileCompleteness,
} from "./pharm-drug-profile";

const baseCtx = (overrides: Partial<ExamGenerationContext>): ExamGenerationContext => ({
  field: "Pharmacy",
  fieldId: "pharmacy",
  topic: "anticoagulants",
  difficulty: "medium",
  questionCount: 10,
  sources: [],
  researchBrief: "",
  ...overrides,
});

describe("pharm drug profile generation", () => {
  it("detects pharmacy and NCLEX pharm contexts", () => {
    expect(isPharmDrugContext(baseCtx({ fieldId: "pharmacy" }))).toBe(true);
    expect(
      isPharmDrugContext(
        baseCtx({ fieldId: "nursing", subjectId: "pharmacology-nursing", field: "Nursing" })
      )
    ).toBe(true);
    expect(isPharmDrugContext(baseCtx({ fieldId: "usmle-step-1", field: "USMLE" }))).toBe(false);
  });

  it("requires drugProfile on every NAPLEX and NCLEX pharm question", () => {
    expect(requiresDrugProfileOnEveryQuestion(baseCtx({ fieldId: "pharmacy" }))).toBe(true);
    expect(
      requiresDrugProfileOnEveryQuestion(
        baseCtx({ fieldId: "nursing", subjectId: "pharmacology-nursing" })
      )
    ).toBe(true);
  });

  it("normalizes legacy brand/drugClass fields", () => {
    const profile = normalizeDrugProfile({
      generic: "Warfarin",
      brand: "Coumadin, Jantoven",
      drugClass: "Vitamin K antagonist",
      indication: "Atrial fibrillation stroke prevention",
      majorSideEffects: ["Bleeding"],
      monitoring: ["INR"],
    });
    expect(profile?.brandNames).toEqual(["Coumadin", "Jantoven"]);
    expect(profile?.therapeuticClass).toBe("Vitamin K antagonist");
  });

  it("validates complete drug profiles", () => {
    const complete = normalizeDrugProfile({
      generic: "Metformin",
      brandNames: ["Glucophage"],
      therapeuticClass: "Biguanide",
      indication: "Type 2 diabetes",
      conditionSymptoms: ["Polyuria", "Hyperglycemia 312 mg/dL"],
      conditionEtiology: "Insulin resistance with increased hepatic gluconeogenesis",
      majorSideEffects: ["GI upset", "Lactic acidosis"],
      monitoring: ["Renal function", "B12"],
    });
    expect(isDrugProfileComplete(complete)).toBe(true);
  });

  it("builds NAPLEX requirements with schema fields", () => {
    const block = buildPharmDrugRequirementsBlock(baseCtx({ fieldId: "pharmacy" }));
    expect(block).toContain("brandNames");
    expect(block).toContain("conditionSymptoms");
    expect(block).toContain("conditionEtiology");
    expect(block).toContain("NAPLEX");
  });

  it("builds NCLEX pharm requirements with nursingConsiderations", () => {
    const block = buildPharmDrugRequirementsBlock(
      baseCtx({ fieldId: "nursing", subjectId: "pharmacology-nursing", field: "Nursing" })
    );
    expect(block).toContain("NCLEX");
    expect(block).toContain("nursingConsiderations");
  });

  it("includes Top 300/500 catalog reference", () => {
    const block = buildDrugCatalogReferenceBlock(baseCtx({ topic: "warfarin anticoagulation" }));
    expect(block).toContain("TOP 300/500");
    expect(block.toLowerCase()).toMatch(/warfarin|apixaban|heparin/);
  });

  it("scores richer drug profiles higher", () => {
    const q: ExamQuestion = {
      id: 1,
      type: "multiple_choice",
      question: "Which counseling is priority for this client receiving metformin?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "Metformin requires renal monitoring due to lactic acidosis risk.",
      drugProfile: {
        generic: "Metformin",
        brandNames: ["Glucophage"],
        therapeuticClass: "Biguanide",
        indication: "Type 2 diabetes",
        conditionSymptoms: ["Polyuria", "Fasting glucose 210 mg/dL"],
        conditionEtiology: "Insulin resistance with hepatic gluconeogenesis",
        majorSideEffects: ["GI upset", "Lactic acidosis"],
        monitoring: ["Serum creatinine/eGFR", "B12"],
        nursingConsiderations: ["Take with meals", "Hold if NPO or contrast dye"],
      },
    };
    expect(scoreDrugProfileCompleteness(q)).toBeGreaterThan(0.15);
    expect(formatDrugProfileForExplanation(normalizeDrugProfile(q.drugProfile)!)).toContain(
      "Metformin"
    );
  });
});
