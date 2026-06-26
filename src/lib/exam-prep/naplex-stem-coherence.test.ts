import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { auditNaplexBankItem } from "./naplex-bank-audit";
import {
  extractCounselTemplateDrugs,
  findPharmacySeedByVignette,
  naplexStemOptionDrugMismatch,
  resetPharmacySeedIndexForTests,
} from "./naplex-stem-coherence";

describe("naplexStemOptionDrugMismatch", () => {
  it("flags Allopurinol options on a warfarin vignette", () => {
    const item: BankItem = {
      subjectId: "infectious-disease-rx",
      vignette:
        "Community pharmacist: patient on warfarin needs antibiotic for dental prophylaxis discussion.",
      question: "Which counseling point is most essential before the patient leaves the pharmacy?",
      options: [
        "Counsel on Allopurinol adherence, expected benefits, recognizing Stevens-Johnson (HLA-B*5801 in Asians), monitoring Therapeutic response, and when to call the pharmacist or prescriber",
        "Encourage sharing unused tablets with family members with similar symptoms",
        "Advise stopping Allopurinol without calling anyone if any question arises",
        "State that no monitoring or follow-up is ever required for this medication",
      ],
      correctAnswer:
        "Counsel on Allopurinol adherence, expected benefits, recognizing Stevens-Johnson (HLA-B*5801 in Asians), monitoring Therapeutic response, and when to call the pharmacist or prescriber",
      explanation: "Correct: Counsel on Allopurinol adherence…",
      tags: ["test"],
    };

    expect(naplexStemOptionDrugMismatch(item)).toBe("allopurinol");
    expect(
      auditNaplexBankItem(item).issues.some((i) => i.code === "naplex_stem_option_mismatch")
    ).toBe(true);
  });

  it("allows counsel-on-proper when stem discusses inhaler technique", () => {
    const item: BankItem = {
      subjectId: "respiratory-rx",
      vignette: "A 58-year-old with asthma refills albuterol and asks about proper inhaler technique.",
      question: "Which action should the pharmacist take first?",
      options: [
        "Counsel on proper metered-dose inhaler technique and spacer use",
        "Discontinue albuterol",
        "Add oral prednisone daily",
        "Ignore technique questions",
      ],
      correctAnswer: "Counsel on proper metered-dose inhaler technique and spacer use",
      explanation:
        "Correct: Counsel on proper metered-dose inhaler technique and spacer use — technique errors reduce drug delivery.",
      tags: ["test"],
    };

    expect(naplexStemOptionDrugMismatch(item)).toBeNull();
  });

  it("finds canonical seed for warfarin SATA vignette", () => {
    resetPharmacySeedIndexForTests();
    const item: BankItem = {
      subjectId: "infectious-disease-rx",
      vignette:
        "Community pharmacist: patient on warfarin needs antibiotic for dental prophylaxis discussion.",
      question: "Which counseling point is most essential before the patient leaves the pharmacy?",
      options: ["wrong"],
      correctAnswer: "wrong",
      explanation: "wrong",
      tags: ["test"],
    };

    const seed = findPharmacySeedByVignette(item);
    expect(seed?.question).toBe(
      "Which antibiotics warrant extra INR monitoring when combined with warfarin? (Select all that apply.)"
    );
    expect(extractCounselTemplateDrugs(seed?.options.join("\n") ?? "")).toEqual([]);
  });
});
