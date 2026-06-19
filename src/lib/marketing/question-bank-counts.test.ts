import { describe, expect, it } from "vitest";
import { EXAM_FIELD_IDS } from "@/lib/subjects/field-ids";
import {
  buildLandingBankCountsDisplay,
  displayQuestionCountForField,
  displayTotalQuestionCount,
  type QuestionBankCountsSnapshot,
} from "./question-bank-counts";
import {
  PUBLISHED_QUESTION_BANK_TOTAL,
  formatMarketingQuestionCount,
} from "./bank-stats";

function snapshotWithServed(
  servedByField: Partial<Record<(typeof EXAM_FIELD_IDS)[number], number>>
): QuestionBankCountsSnapshot {
  const fields = Object.fromEntries(
    EXAM_FIELD_IDS.map((fieldId) => [
      fieldId,
      {
        fieldId,
        total: servedByField[fieldId] ?? 0,
        active: servedByField[fieldId] ?? 0,
        served: servedByField[fieldId] ?? 0,
      },
    ])
  ) as QuestionBankCountsSnapshot["fields"];

  const totals = Object.values(fields).reduce(
    (acc, row) => ({
      total: acc.total + row.total,
      active: acc.active + row.active,
      served: acc.served + row.served,
    }),
    { total: 0, active: 0, served: 0 }
  );

  return {
    fields,
    totals,
    updatedAt: "2026-06-16T00:00:00.000Z",
    degraded: false,
  };
}

describe("question-bank-counts display", () => {
  it("uses live served counts when available", () => {
    const snapshot = snapshotWithServed({
      nursing: 7_000,
      pharmacy: 6_500,
    });

    expect(displayQuestionCountForField("nursing", snapshot)).toBe("7K+");
    expect(displayQuestionCountForField("pharmacy", snapshot)).toBe("6K+");
    expect(displayTotalQuestionCount(snapshot)).toBe("13K+");
  });

  it("falls back to design targets when served is zero", () => {
    const snapshot = snapshotWithServed({ pance: 0, "aanp-fnp": 0 });

    expect(displayQuestionCountForField("pance", snapshot)).toBe("6K+");
    expect(displayQuestionCountForField("aanp-fnp", snapshot)).toBe("6K+");
    expect(displayTotalQuestionCount(snapshot)).toBe(
      formatMarketingQuestionCount(PUBLISHED_QUESTION_BANK_TOTAL)
    );
  });

  it("builds six-exam landing display rows with question labels", () => {
    const display = buildLandingBankCountsDisplay(
      snapshotWithServed({ nursing: 7_000, "usmle-step-2": 9_930, "aanp-fnp": 4_598 })
    );

    expect(display.exams).toHaveLength(6);
    expect(display.exams.map((e) => e.label)).toEqual([
      "USMLE (Step 1·2·3)",
      "NCLEX",
      "NAPLEX",
      "PANCE",
      "AANP FNP",
      "NPTE-PT",
    ]);
    expect(display.exams[0]?.countLabel).toBe("9K+");
    expect(display.exams[0]?.questionsLabel).toBe("9,930 questions");
    expect(display.exams[1]?.countLabel).toBe("7K+");
    expect(display.exams[1]?.questionsLabel).toBe("7,000 questions");
    expect(display.totalQuestionsLabel).toBe("21,528 questions");
  });
});
