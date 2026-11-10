import { describe, expect, it } from "vitest";
import { usmleBlueprintStemMatches } from "@/lib/exam-prep/usmle/topic-blueprint-match";
import { weakAreaItemIsOnTopic } from "@/lib/learning/weak-area-on-topic";
import type { BankItem } from "@/lib/question-bank";

function item(partial: Partial<BankItem> & { question: string }): BankItem {
  return {
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Rationale.",
    ...partial,
  };
}

describe("weak-area items must match the topic, not only the stored tag", () => {
  it("does not treat sensitivity to cold as a biostatistics item", () => {
    const thyroid = item({
      blueprintTopic: "sensitivity-specificity-lr",
      scenario:
        "A 28-year-old woman has fatigue, weight gain, and increased sensitivity to cold. Heart rate is 58.",
      question: "What is the most likely diagnosis?",
    });
    expect(usmleBlueprintStemMatches(thyroid, "sensitivity-specificity-lr")).toBe(false);
  });

  it("rejects an asthma vignette stamped as sensitivity and specificity", () => {
    const asthma = item({
      subjectId: "internal-medicine",
      blueprintTopic: "sensitivity-specificity-lr",
      tags: ["sensitivity-specificity-lr", "biostatistics"],
      scenario: "A 24-year-old has an asthma exacerbation with wheezing after pollen exposure.",
      question: "What is the most likely diagnosis?",
    });
    expect(
      weakAreaItemIsOnTopic(
        asthma,
        { subjectId: "sensitivity-specificity-lr", blueprintTopics: ["sensitivity-specificity-lr"] },
        "usmle-step-3"
      )
    ).toBe(false);
    expect(usmleBlueprintStemMatches(asthma, "sensitivity-specificity-lr")).toBe(false);
  });

  it("keeps a stem that is about sensitivity, specificity, and likelihood ratios", () => {
    const stats = item({
      subjectId: "internal-medicine",
      blueprintTopic: "sensitivity-specificity-lr",
      scenario:
        "A screening test has a sensitivity of 90% and a specificity of 80%. The positive likelihood ratio is 4.5.",
      question: "Which value is the positive likelihood ratio?",
    });
    expect(
      weakAreaItemIsOnTopic(
        stats,
        { subjectId: "sensitivity-specificity-lr", blueprintTopics: ["sensitivity-specificity-lr"] },
        "usmle-step-3"
      )
    ).toBe(true);
  });

  it("does not treat laboratory as a labor-and-delivery item", () => {
    const labs = item({
      blueprintTopic: "ob-labor-ccs",
      scenario: "A study reports a positive likelihood ratio. Laboratory values are pending.",
      question: "Which statistic is described?",
    });
    expect(usmleBlueprintStemMatches(labs, "ob-labor-ccs")).toBe(false);
  });

  it("keeps an OB labor stem tagged to the labor topic", () => {
    const labor = item({
      blueprintTopic: "ob-labor-ccs",
      scenario: "A patient in active labor has vaginal bleeding from placental abruption.",
      question: "What is the next step in delivery?",
    });
    expect(
      weakAreaItemIsOnTopic(
        labor,
        { subjectId: "ob-labor-ccs", blueprintTopics: ["ob-labor-ccs"] },
        "usmle-step-3"
      )
    ).toBe(true);
  });

  it("rejects NCLEX shock and labor items filed under Health Promotion without that client-needs tag", () => {
    const shock = item({
      subjectId: "health-promotion",
      blueprintTopic: "labor-fetal-monitoring",
      scenario: "A client in induced labor has late decelerations and signs of hypovolemic shock.",
      question: "What does the nurse do first?",
    });
    expect(
      weakAreaItemIsOnTopic(
        shock,
        { subjectId: "health-promotion", blueprintTopics: [] },
        "nursing"
      )
    ).toBe(false);
  });

  it("rejects hypertension that only denies heart failure", () => {
    const pressure = item({
      subjectId: "cardiology",
      scenario:
        "A 48-year-old man has repeated blood pressures of 152/96 mm Hg. He has no heart failure and no coronary disease.",
      question: "What is the most appropriate next step?",
    });
    expect(
      weakAreaItemIsOnTopic(pressure, { subjectId: "cardiology", blueprintTopics: [] }, "usmle-step-3")
    ).toBe(false);
  });

  it("rejects anemia in kidney disease that only denies chest pain", () => {
    const anemia = item({
      subjectId: "cardiology",
      scenario:
        "A woman with chronic kidney disease has fatigue and a hemoglobin of 8.5. She reports no chest pain.",
      question: "What is the most appropriate next step?",
    });
    expect(
      weakAreaItemIsOnTopic(anemia, { subjectId: "cardiology", blueprintTopics: [] }, "usmle-step-3")
    ).toBe(false);
  });

  it("rejects a diabetes vignette filed under cardiology", () => {
    const diabetes = item({
      subjectId: "cardiology",
      scenario: "A 45-year-old woman presents with a blood glucose level of 450 mg/dL and polyuria.",
      question: "What is the most likely diagnosis?",
    });
    expect(
      weakAreaItemIsOnTopic(diabetes, { subjectId: "cardiology", blueprintTopics: [] }, "usmle-step-3")
    ).toBe(false);
  });

  it("keeps a Health Promotion item whose client-needs tag is Health Promotion", () => {
    const vaccine = item({
      subjectId: "health-promotion",
      clientNeedsCategory: "Health Promotion and Maintenance",
      scenario: "Parents of a term newborn ask which vaccine is given before discharge.",
      question: "Which teaching is best?",
    });
    expect(
      weakAreaItemIsOnTopic(
        vaccine,
        { subjectId: "health-promotion", blueprintTopics: [] },
        "nursing"
      )
    ).toBe(true);
  });
});
