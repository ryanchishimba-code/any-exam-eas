import { beforeEach, describe, expect, it, vi } from "vitest";
import { isKeyWrongPendingReview } from "@/lib/exam-prep/reviewed-key-queue";
import { resetIneligibleServedIdCache } from "@/lib/exam-prep/student-eligibility";

const HIDE_LISTED_CALC_ID = "cmra6lyew002xic04rnufu0in";

type SampleRow = {
  id: string;
  subjectId: string;
  fieldId: string;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  solutionSteps: null;
  tags: null;
  itemType: string;
  scenario: string;
  active: boolean;
  qaPassed: boolean;
};

function row(partial: Pick<SampleRow, "id" | "question" | "correctAnswer" | "itemType"> & Partial<SampleRow>): SampleRow {
  return {
    subjectId: "calculations",
    fieldId: "pharmacy",
    options: "[]",
    explanation: "The keyed quantity follows from the labeled strength.",
    solutionSteps: null,
    tags: null,
    scenario: "Outpatient pharmacy window.",
    active: true,
    qaPassed: true,
    ...partial,
  };
}

const pool: SampleRow[] = [
  row({
    id: HIDE_LISTED_CALC_ID,
    question: "How many milligrams of amoxicillin are in each milliliter of the 250 mg/5 mL suspension?",
    correctAnswer: "4.3",
    itemType: "constructed_response",
  }),
  row({
    id: "eligible-calc",
    question: "How many milligrams of vancomycin are required for a 70 kg adult? Round to the nearest whole milligram.",
    correctAnswer: "1500",
    itemType: "constructed_response",
  }),
  row({
    id: "qa-failed-calc",
    question: "How many milliliters of gentamicin should be drawn for an 80 kg adult?",
    correctAnswer: "4",
    itemType: "constructed_response",
    qaPassed: false,
  }),
  row({
    id: "sata-one-key",
    question: "Select all monitoring steps required before the next phenytoin dose.",
    correctAnswer: "Check the level",
    itemType: "select_all",
    options: JSON.stringify(["Check the level", "Skip the level", "Call the lab"]),
  }),
];

const findMany = vi.hoisted(() => vi.fn());
const sqlQuery = vi.hoisted(() => vi.fn());

vi.mock("@/lib/prisma", () => ({
  prisma: {
    questionBankItem: {
      count: vi.fn(async () => 4),
      findMany,
    },
  },
}));

vi.mock("@/lib/db", () => ({
  sqlQuery,
}));

import { samplePharmacyCalculationItems } from "@/lib/question-bank-db";

describe("samplePharmacyCalculationItems", () => {
  beforeEach(() => {
    resetIneligibleServedIdCache();
    findMany.mockReset();
    sqlQuery.mockReset();
    findMany.mockImplementation(async () => pool);
    sqlQuery.mockImplementation(async () => [{ id: HIDE_LISTED_CALC_ID }]);
  });

  it("never returns a hide-listed calculation even when the row is still in the query result", async () => {
    expect(isKeyWrongPendingReview(HIDE_LISTED_CALC_ID)).toBe(true);
    const items = await samplePharmacyCalculationItems(2);
    const ids = items.map((item) => item.id);
    const where = findMany.mock.calls[0]?.[0]?.where as { id?: { notIn?: string[] } } | undefined;

    expect(where?.id?.notIn).toContain(HIDE_LISTED_CALC_ID);
    expect(ids).toEqual(["eligible-calc"]);
    expect(ids).not.toContain(HIDE_LISTED_CALC_ID);
    expect(ids).not.toContain("qa-failed-calc");
    expect(ids).not.toContain("sata-one-key");
  });

  it("drops a hide-listed calculation when the eligibility id list cannot be loaded", async () => {
    sqlQuery.mockImplementation(async () => {
      throw new Error("eligibility list unavailable");
    });
    const items = await samplePharmacyCalculationItems(2);
    expect(items.map((item) => item.id)).toEqual(["eligible-calc"]);
  });
});
