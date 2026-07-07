import { describe, expect, it } from "vitest";
import { deriveLabTableFromItem, extractLabRowsFromText } from "./derive-visual-rationale";
import type { BankItem } from "@/lib/question-bank";

describe("derive-visual-rationale", () => {
  it("extracts vitals and labs from vignette text", () => {
    const text =
      "A 68-year-old with fever. BP 92/58, HR 112, Temp 101.2°F, SpO2 88%, WBC 14,000/mm³.";
    const rows = extractLabRowsFromText(text);
    expect(rows.length).toBeGreaterThanOrEqual(4);
    expect(rows.find((r) => r.label === "Blood pressure")?.abnormal).toBe(true);
    expect(rows.find((r) => r.label === "SpO₂")?.abnormal).toBe(true);
  });

  it("builds lab table from bank item with 2+ values", () => {
    const item = {
      vignette:
        "Client with clindamycin-associated diarrhea. Temp 100.8°F, WBC 14,000, BP 118/72.",
      question: "Which action should the nurse take first?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "test",
    } as BankItem;

    const table = deriveLabTableFromItem(item);
    expect(table?.kind).toBe("lab_table");
    expect(table!.rows.length).toBeGreaterThanOrEqual(2);
  });
});
