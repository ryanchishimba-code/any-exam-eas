import { describe, expect, it } from "vitest";
import { classifyUsmleStep, fieldIdForUsmleStep } from "./classify-step";

describe("classifyUsmleStep", () => {
  it("treats Step 3 item types as definitive Step 3", () => {
    for (const itemType of ["ccs_prompt", "biostats", "ethics", "abstract", "drug_ad"]) {
      const g = classifyUsmleStep({ itemType, question: "A patient..." });
      expect(g.step).toBe("step3");
      expect(g.confidence).toBe("high");
    }
  });

  it("classifies biostatistics / ethics vocabulary as Step 3", () => {
    expect(
      classifyUsmleStep({
        question:
          "A study reports a number needed to treat of 12 and a 95% confidence interval...",
      }).step
    ).toBe("step3");
    expect(
      classifyUsmleStep({ question: "Regarding informed consent and advance directive decisions..." })
        .step
    ).toBe("step3");
  });

  it("classifies basic-science vocabulary as Step 1", () => {
    const g = classifyUsmleStep({
      subjectId: "biochemistry",
      question: "Which enzyme in the metabolic pathway is rate-limiting?",
    });
    expect(g.step).toBe("step1");
    expect(g.confidence).toBe("high");
  });

  it("classifies next-best-step management as Step 2 CK", () => {
    const g = classifyUsmleStep({
      question: "What is the next best step in management of this patient with chest pain?",
    });
    expect(g.step).toBe("step2");
  });

  it("falls back to fieldId with medium confidence when signals are weak", () => {
    const g = classifyUsmleStep({ fieldId: "usmle-step-1", question: "A 54-year-old presents." });
    expect(g.step).toBe("step1");
    expect(g.confidence).toBe("medium");
  });

  it("returns null when there is no signal at all", () => {
    expect(classifyUsmleStep({ question: "A 54-year-old presents." }).step).toBeNull();
  });

  it("prefers Step 3 vocabulary over a usmle-step-2 field (mis-file correction)", () => {
    const g = classifyUsmleStep({
      fieldId: "usmle-step-2",
      question: "Interpret the abstract: the odds ratio was 2.1 (p-value 0.03).",
    });
    expect(g.step).toBe("step3");
    expect(g.confidence).toBe("high");
  });
});

describe("fieldIdForUsmleStep", () => {
  it("maps each step to its canonical field", () => {
    expect(fieldIdForUsmleStep("step1")).toBe("usmle-step-1");
    expect(fieldIdForUsmleStep("step2")).toBe("usmle-step-2");
    expect(fieldIdForUsmleStep("step3")).toBe("usmle-step-3");
  });
});
