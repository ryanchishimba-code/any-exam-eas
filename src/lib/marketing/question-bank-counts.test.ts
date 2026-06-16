import { describe, expect, it } from "vitest";
import { EXAM_FIELD_IDS } from "@/lib/subjects/field-ids";
import {
  buildLandingBankCountsDisplay,
  displayQuestionCountForField,
  displayTotalQuestionCount,
  type QuestionBankCountsSnapshot,
} from "./question-bank-counts";

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
      nursing: 11_359,
      pharmacy: 21_190,
    });

    expect(displayQuestionCountForField("nursing", snapshot)).toBe("11K+");
    expect(displayQuestionCountForField("pharmacy", snapshot)).toBe("21K+");
    expect(displayTotalQuestionCount(snapshot)).toBe("32K+");
  });

  it("falls back to design targets when served is zero", () => {
    const snapshot = snapshotWithServed({ pance: 0, "aanp-fnp": 0 });

    expect(displayQuestionCountForField("pance", snapshot)).toBe("30K+");
    expect(displayQuestionCountForField("aanp-fnp", snapshot)).toBe("24K+");
    expect(displayTotalQuestionCount(snapshot)).toBe("120K+");
  });

  it("builds four-exam landing display rows", () => {
    const display = buildLandingBankCountsDisplay(
      snapshotWithServed({ nursing: 11_359, "usmle-step-2": 5_306 })
    );

    expect(display.exams).toHaveLength(4);
    expect(display.exams.map((e) => e.label)).toEqual([
      "USMLE",
      "NCLEX",
      "NAPLEX",
      "PANCE",
    ]);
    expect(display.exams[0]?.countLabel).toBe("5K+");
    expect(display.exams[1]?.countLabel).toBe("11K+");
  });
});
