import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  nclexBankItemIsServeReady,
  prepareNclexItemsForSession,
} from "@/lib/exam-prep/nclex-serve-gate";

const pediatricMismatch: BankItem = {
  subjectId: "pediatrics-nursing",
  vignette:
    "Pediatric unit. An 18-year-old man with moderate persistent asthma, wheezing, and retractions is stable after initial assessment.",
  question: "Which action should the nurse take first?",
  options: ["A", "B", "C", "D"],
  correctAnswer: "A",
  explanation: "Pediatric asthma management requires prioritized nursing action.",
};

const infectionOptions = [
  "Use alcohol-based hand rub alone without soap and water after caring for this client",
  "Place the client on droplet precautions only and reuse non-critical equipment without cleaning between clients",
  "Keep the client in a negative-pressure room with airborne precautions for all visitors without PPE",
  "Place the client on contact precautions; use dedicated equipment and perform hand hygiene with soap and water before and after care",
];

const mismatched: BankItem = {
  subjectId: "safety-infection",
  vignette:
    "Medical-surgical unit, Room 353. 68-year-old woman with acute decompensated heart failure. BP 88/54, HR 112, crackles bilaterally, weight up 2.5 kg. The nurse must prevent transmission to other clients and staff.",
  question: "Which action demonstrates appropriate transmission-based precautions for this client?",
  options: infectionOptions,
  correctAnswer: infectionOptions[3]!,
  explanation:
    "Contact precautions are required for C. diff transmission. Clinical Judgment: recognize infection risk and implement appropriate isolation.",
};

describe("nclex-serve-gate", () => {
  it("rejects pediatric age mismatch safety failures", () => {
    expect(nclexBankItemIsServeReady(pediatricMismatch)).toBe(false);
  });

  it("rejects template-swapped infection items", () => {
    expect(nclexBankItemIsServeReady(mismatched)).toBe(false);
  });

  it("filters stale qaPassed rows that fail runtime alignment audit", () => {
    const accepted = prepareNclexItemsForSession({
      items: [mismatched, pediatricMismatch],
      field: "Nursing",
      limit: 2,
    });
    expect(accepted).toHaveLength(0);
  });
});
