import { describe, expect, it } from "vitest";
import { polishMpjeBankItem } from "./mpje-polish";

describe("polishMpjeBankItem", () => {
  it("rebuilds weak stems into pharmacy law scenarios", () => {
    const result = polishMpjeBankItem(
      {
        subjectId: "controlled-substances",
        question: "Which law applies?",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
        explanation: "Short.",
      },
      "controlled-substances",
      "Controlled Substances (DEA)",
      42,
      { variant: "uniform" }
    );

    expect(result.item.question.length).toBeGreaterThan(100);
    expect(result.item.question).toMatch(/pharmacist|pharmacy/i);
    expect(result.item.explanation).toMatch(/federal|state|DEA|regulation/i);
    expect(result.changed).toBe(true);
  });

  it("tags state-specific items when variant is state", () => {
    const result = polishMpjeBankItem(
      {
        subjectId: "state-practice-act",
        question: "What is required?",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
        explanation: "Short.",
      },
      "state-practice-act",
      "State Practice Act & Board Rules",
      7,
      { variant: "state", stateCode: "CA" }
    );

    expect(result.item.tags).toContain("state-CA");
    expect(result.item.question).toMatch(/California/i);
  });
});
