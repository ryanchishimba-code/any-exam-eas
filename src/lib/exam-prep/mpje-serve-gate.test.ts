import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  mpjeBankItemIsServeReady,
  prepareMpjeItemsForSession,
} from "./mpje-serve-gate";

const validItem: BankItem = {
  id: "mpje-db-1",
  subjectId: "federal-pharmacy-law",
  question: "A pharmacist receives a Schedule II prescription. Which action is required?",
  options: [
    "Accept the oral order without written follow-up",
    "Verify prescriber DEA number and document on the prescription",
    "Transfer the prescription to any pharmacy on patient request",
    "Dispense a 90-day supply without authorization",
  ],
  correctAnswer: "Verify prescriber DEA number and document on the prescription",
  explanation:
    "Schedule II prescriptions require a valid written prescription with prescriber DEA number; oral orders are not permitted except in limited emergencies.",
};

const bulkItem: BankItem = {
  subjectId: "uniform-mpje",
  question: "NAPLEX-style filler without database id",
  options: ["A", "B", "C", "D"],
  correctAnswer: "A",
  explanation: "Too short.",
};

describe("mpje-serve-gate", () => {
  it("rejects items without a database id", () => {
    expect(mpjeBankItemIsServeReady(bulkItem)).toBe(false);
  });

  it("accepts qa-passed database items", () => {
    expect(mpjeBankItemIsServeReady(validItem)).toBe(true);
  });

  it("passes through vetted items and dedupes stems", () => {
    const prepared = prepareMpjeItemsForSession({
      items: [validItem, { ...validItem, id: "mpje-db-2" }, bulkItem],
      limit: 5,
    });
    expect(prepared).toHaveLength(1);
    expect(prepared[0]!.id).toBe("mpje-db-1");
  });
});
