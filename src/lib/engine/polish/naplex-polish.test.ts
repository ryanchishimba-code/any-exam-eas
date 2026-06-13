import { describe, expect, it } from "vitest";
import {
  needsNaplexPolish,
  polishNaplexBankItem,
  scoreNaplexBankItem,
} from "@/lib/engine/polish/naplex-polish";
import type { BankItem } from "@/lib/question-bank";

const weakTemplate: BankItem = {
  subjectId: "pharmacology",
  question:
    "NAPLEX 12: Which counseling point is most important for ACE inhibitor used in cardiovascular pharmacotherapy?",
  options: [
    "Counsel on adherence, adverse effects, and monitoring for cardiovascular pharmacotherapy",
    "Stop therapy without informing the prescriber if any question arises",
    "Share medication with family members with similar symptoms",
    "Skip monitoring labs in all patients",
  ],
  correctAnswer:
    "Counsel on adherence, adverse effects, and monitoring for cardiovascular pharmacotherapy",
  explanation: "Patient counseling (NAPLEX hints).",
};

describe("naplex-polish", () => {
  it("scores weak template items low", () => {
    expect(scoreNaplexBankItem(weakTemplate)).toBeLessThan(0.55);
    expect(needsNaplexPolish(weakTemplate)).toBe(true);
  });

  it("polishes weak items with vignette, drug names, and expanded rationale", () => {
    const { item, changed, qualityAfter } = polishNaplexBankItem(
      weakTemplate,
      "pharmacology",
      "General Pharmacology"
    );

    expect(changed).toBe(true);
    expect(qualityAfter).toBeGreaterThan(0.55);
    expect(item.question).not.toMatch(/^NAPLEX\s+\d+:/i);
    const blob = `${item.vignette ?? ""}\n${item.question}`.trim();
    expect(blob.length).toBeGreaterThan(120);
    expect(item.explanation.length).toBeGreaterThan(150);
    expect(item.options).toHaveLength(4);
    expect(item.options).toContain(item.correctAnswer);
    expect(item.explanation.toLowerCase()).toMatch(/monitor|counsel|incorrect/);
  });

  it("polishes duplicate vignette stems by splitting scenario from question", () => {
    const duplicateVignette: BankItem = {
      subjectId: "pharmacology",
      vignette:
        "A 64-year-old man with hypertension (BP 158/92 mmHg, creatinine 1.1 mg/dL) receives lisinopril.",
      question:
        "A 64-year-old man with hypertension (BP 158/92 mmHg, creatinine 1.1 mg/dL) receives lisinopril.\n\nWhich monitoring parameter is most appropriate after initiation?",
      options: [
        "Serum potassium and creatinine within 1–2 weeks",
        "Daily fasting glucose only",
        "INR every 3 days",
        "No laboratory monitoring",
      ],
      correctAnswer: "Serum potassium and creatinine within 1–2 weeks",
      explanation:
        "Correct: serum potassium and creatinine — lisinopril is an ACE inhibitor; renal function and hyperkalemia risk require monitoring after initiation per guidelines.",
    };

    expect(needsNaplexPolish(duplicateVignette)).toBe(true);
    const { item, changed } = polishNaplexBankItem(
      duplicateVignette,
      "pharmacology",
      "General Pharmacology"
    );
    expect(changed).toBe(true);
    expect(item.question).not.toContain("64-year-old man");
    expect(item.vignette).toMatch(/64-year-old man/);
  });

  it("rebuilds topiramate MOA with real mechanisms, not drug-labeled garbage distractors", () => {
    const topiramateWeak: BankItem = {
      subjectId: "pharmacology",
      question: "Which mechanism of action best explains the therapeutic benefit of Topiramate (Topamax)?",
      options: [
        "Topiramate — Antiepileptic / migraine prophylactic targeting seizures",
        "Vancomycin — direct thrombin inhibition unrelated to this indication",
        "Belatacept — dopamine reuptake inhibition in the CNS",
        "Raltegravir — non-selective histamine blockade without vascular effect",
      ],
      correctAnswer: "Topiramate — Antiepileptic / migraine prophylactic targeting seizures",
      explanation: "MOA item.",
    };

    expect(needsNaplexPolish(topiramateWeak)).toBe(true);
    const { item, changed } = polishNaplexBankItem(topiramateWeak, "pharmacology", "General Pharmacology", 75);
    expect(changed).toBe(true);
    expect(item.correctAnswer.toLowerCase()).toMatch(/sodium|gaba|glutamate|hyperexcitab/);
    expect(item.options.every((o) => !/— direct thrombin inhibition unrelated/i.test(o))).toBe(true);
    expect(item.options.every((o) => !/targeting seizures/i.test(o))).toBe(true);
    expect(item.vignette).toMatch(/seizure|seizures/i);
    expect(item.vignette).not.toMatch(/encounter \d+/i);
  });

  it("preserves strong items when already high quality", () => {
    const strong: BankItem = {
      subjectId: "pharmacology",
      vignette:
        "A 64-year-old man with hypertension and type 2 diabetes (BP 158/92 mmHg, creatinine 1.1 mg/dL) receives lisinopril (Zestril).",
      question: "Which monitoring parameter is priority after initiation?",
      options: [
        "Serum potassium and creatinine within 1–2 weeks of initiation or dose change",
        "Daily fasting blood glucose only — renal function is not relevant",
        "INR every 3 days regardless of concurrent anticoagulation",
        "No laboratory monitoring is required for ACE inhibitors",
      ],
      correctAnswer:
        "Serum potassium and creatinine within 1–2 weeks of initiation or dose change",
      explanation:
        "Correct: serum potassium and creatinine — lisinopril (Zestril) is an ACE inhibitor; renal function and hyperkalemia risk require monitoring after initiation. Why other options are incorrect: fasting glucose alone misses electrolyte/renal effects; INR is not indicated without anticoagulation; ACE inhibitors require baseline and follow-up labs per guidelines.",
    };
    const before = scoreNaplexBankItem(strong);
    const { changed } = polishNaplexBankItem(strong, "pharmacology", "General Pharmacology");
    expect(before).toBeGreaterThan(0.62);
    expect(changed).toBe(false);
  });
});
