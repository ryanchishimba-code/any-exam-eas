import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { serializeBankOptions, parseBankOptions } from "@/lib/mpje/parse-bank-options";
import {
  hasCorruptedNgnPayloadOptions,
  repairNclexNgnPayloadFromSeed,
} from "./nclex-ngn-payload-repair";
import { nclexNgnCorrectAnswerValid } from "./nclex-ngn-audit";

describe("repairNclexNgnPayloadFromSeed", () => {
  it("restores select-all payload options from nursing seeds", () => {
    const item: BankItem = {
      subjectId: "management-of-care",
      vignette: "Discharge teaching for new heart failure client.",
      question: "Select all essential teaching points. (Select all that apply.)",
      options: ["A", "B", "C", "D"],
      correctAnswer: "Daily weights,Low sodium diet,When to call provider,Sskip meds if feeling well",
      explanation: "HF teaching: weights, diet, symptoms — never skip meds without provider.",
      itemType: "select_all",
      ngnPayload: {
        kind: "select_all",
        options: ["A", "B", "C", "D"],
        partialCredit: true,
      },
      tags: ["test"],
    };

    expect(hasCorruptedNgnPayloadOptions(item)).toBe(true);
    const fixed = repairNclexNgnPayloadFromSeed(item);
    expect(fixed?.ngnPayload?.options).toContain("Skip meds if feeling well");
    expect(nclexNgnCorrectAnswerValid(fixed!)).toBe(true);

    const serialized = serializeBankOptions(fixed!);
    const parsed = parseBankOptions(serialized);
    expect(parsed.ngnPayload?.options).toContain("Daily weights");
    expect(parsed.options).toContain("Daily weights");
  });
});

describe("serializeBankOptions", () => {
  it("preserves real ngnPayload options instead of overwriting with A–D placeholders", () => {
    const item: BankItem = {
      subjectId: "physiological-adaptation",
      question: "Order interventions from first to last priority.",
      options: ["A", "B", "C", "D"],
      correctAnswer: "Notify provider / rapid response,Obtain blood cultures,IV fluid bolus,Antibiotics per protocol",
      explanation: "Sepsis bundle.",
      itemType: "ordered_response",
      ngnPayload: {
        kind: "ordered_response",
        options: [
          "Notify provider / rapid response",
          "Obtain blood cultures",
          "IV fluid bolus",
          "Antibiotics per protocol",
          "Oral fluids only",
        ],
      },
      tags: [],
    };

    const parsed = parseBankOptions(serializeBankOptions(item));
    expect(parsed.options[0]).toBe("Notify provider / rapid response");
  });
});
