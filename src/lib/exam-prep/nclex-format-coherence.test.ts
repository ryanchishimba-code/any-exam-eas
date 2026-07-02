import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  fixNclexClinicalFormatCoherence,
  itemHasNclexClinicalFormatIssue,
  prepareNclexBankItem,
} from "./nclex-format-coherence";

describe("nclex-format-coherence", () => {
  it("repairs pediatric ED prioritization vignette with unrelated medication counseling options", () => {
    const item: BankItem = {
      subjectId: "pediatrics-nursing",
      vignette:
        "The nurse is assigned four clients on a pediatric emergency department. Room 56: 9-year-old with known asthma, RR 34, SpO₂ 88% on room air, intercostal retractions, speaking in short phrases. Room 59: 6-week-old infant, temp 102.2°F (39.0°C), lethargic, poor feeding x 24 hours, capillary refill 3 seconds. Room 62: 14-year-old forearm deformity after fall, neurovascular intact, pain 7/10, distal pulses 2+. Room 55: 4-year-old with vomiting/diarrhea 24 hours, alert, drinking small sips, HR 110, BP 98/60, no fever.",
      question: "Which client should the nurse assess first?",
      options: [
        "Instruct the client to take the medication with food.",
        "Educate the client about potential side effects.",
        "Assess the client's renal function before administration.",
        "Ensure the client understands the importance of completing the full course of antibiotics.",
      ],
      correctAnswer: "Educate the client about potential side effects.",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(itemHasNclexClinicalFormatIssue(item)).toBe(true);

    const prepared = prepareNclexBankItem(item);
    expect(itemHasNclexClinicalFormatIssue(prepared)).toBe(false);
    expect(prepared.correctAnswer).toMatch(/room 56|asthma|spo?₂?|retractions/i);
    expect(prepared.options).toContain(prepared.correctAnswer);

    const { item: fixed, changed } = fixNclexClinicalFormatCoherence(item);
    expect(changed).toBe(true);
    expect(itemHasNclexClinicalFormatIssue(fixed)).toBe(false);
  });
});
