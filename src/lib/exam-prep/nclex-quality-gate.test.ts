import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { assessNclexItemQuality, isNclexBestQuality } from "./nclex-quality-gate";

const cDiffBest: BankItem = {
  subjectId: "safety-infection",
  vignette:
    "Skilled nursing facility, Room 330. An 83-year-old woman is admitted with Clostridioides difficile infection. Completed a 10-day course of clindamycin 1 week ago for dental infection. Assessment: BP 118/72 mmHg, HR 88, RR 18, temp 100.8°F (38.2°C). Watery diarrhea 6 times in 8 hours, abdominal cramping, WBC 14,000/mm³.",
  question: "Which infection control measure should the nurse implement first?",
  options: [
    "Place the client on droplet precautions only and reuse non-critical equipment without cleaning between clients",
    "Use alcohol-based hand rub alone without soap and water after caring for this client",
    "Place the client on contact precautions; use dedicated equipment and perform hand hygiene with soap and water before and after care",
    "Keep the client in a negative-pressure room with airborne precautions for all visitors without PPE",
  ],
  correctAnswer:
    "Place the client on contact precautions; use dedicated equipment and perform hand hygiene with soap and water before and after care",
  explanation:
    "Clinical Judgment (CJMM):\n1. Recognize cues: watery diarrhea after antibiotics, fever, leukocytosis.\n2. Analyze cues: C. diff spore transmission via contact.\n3. Take action: contact precautions and soap-and-water hand hygiene.\nWhy other options are incorrect:\n• Use alcohol-based hand rub alone: Incorrect — spores require soap and water.\n• Droplet precautions only: Incorrect — wrong transmission category for C. diff.\n• Airborne precautions: Incorrect — not an airborne pathogen.",
  tags: ["cjmm-polished", "infection"],
  source: "polished",
};

describe("nclex-quality-gate", () => {
  it("rates infection-control items as best tier", () => {
    const verdict = assessNclexItemQuality(cDiffBest, { source: "polished" });
    expect(verdict.tier).toBe("best");
    expect(isNclexBestQuality(cDiffBest, { source: "polished" })).toBe(true);
  });

  it("rejects cartoon teaching distractors", () => {
    const verdict = assessNclexItemQuality({
      subjectId: "health-promotion",
      vignette: "Stable client preparing for discharge.",
      question: "Which nursing action best confirms effective patient education?",
      options: [
        "Discourage questions to keep the discharge process efficient",
        "Assume understanding because the client nodded during the explanation",
        "Provide only written materials in English when the client prefers another language",
        "Ask the client to teach back instructions in their own words",
      ],
      correctAnswer: "Ask the client to teach back instructions in their own words",
      explanation: "Short.",
    });
    expect(verdict.tier).toBe("reject");
    expect(verdict.issues).toContain("cartoon_distractors");
  });
});
