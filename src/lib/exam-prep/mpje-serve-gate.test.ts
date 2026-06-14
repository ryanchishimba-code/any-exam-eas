import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  mpjeBankItemIsServeReady,
  prepareMpjeItemsForSession,
} from "./mpje-serve-gate";

const validItem: BankItem = {
  id: "mpje-db-1",
  subjectId: "federal-pharmacy-law",
  vignette:
    "Scenario: A 58-year-old patient presents a written prescription for oxycodone 10 mg tablets dated 22 days ago with no partial fills documented.",
  question: "What is the pharmacist's most appropriate action?",
  options: [
    "Dispense the remaining tablets after verifying patient identity",
    "Refuse to fill because the prescription is more than 21 days old",
    "Contact the prescriber only if the patient insists on same-day service",
    "Partially fill 30 tablets and annotate the balance for future fill",
  ],
  correctAnswer: "Refuse to fill because the prescription is more than 21 days old",
  explanation:
    "Federal rules limit dispensing of Schedule II controlled substances from a written prescription to within 21 days of the date written. A prescription dated 22 days ago is no longer valid for initial dispensing; the pharmacist must refuse and request a new prescription.",
  tags: ["physician-educator", "mpje"],
  references: [{ label: "DEA", citation: "21 CFR § 1306" }],
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
