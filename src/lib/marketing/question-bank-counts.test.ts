import { describe, expect, it } from "vitest";
import { EXAM_FIELD_IDS } from "@/lib/subjects/field-ids";
import {
  buildLandingBankCountsDisplay,
  displayQuestionCountForField,
  displayTotalQuestionCount,
  landingServedTotal,
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
  it("shows exact live serve-ready counts from the DB snapshot", () => {
    const snapshot = snapshotWithServed({
      nursing: 6938,
      pharmacy: 6380,
      "usmle-step-2": 28373,
      pance: 7081,
      "aanp-fnp": 4598,
      "npte-pt": 4124,
    });

    expect(displayQuestionCountForField("nursing", snapshot)).toBe("6,938");
    expect(displayQuestionCountForField("pharmacy", snapshot)).toBe("6,380");
    expect(displayQuestionCountForField("usmle-step-2", snapshot)).toBe("28,373");
    expect(displayTotalQuestionCount(snapshot)).toBe("57,494");
    expect(landingServedTotal(snapshot)).toBe(57_494);
  });

  it("builds six-exam landing display rows with serve-ready labels", () => {
    const display = buildLandingBankCountsDisplay(
      snapshotWithServed({
        nursing: 6938,
        pharmacy: 6380,
        "usmle-step-2": 28373,
        pance: 7081,
        "aanp-fnp": 4598,
        "npte-pt": 4124,
      })
    );

    expect(display.exams).toHaveLength(6);
    expect(display.exams.map((e) => e.slug)).toEqual([
      "usmle",
      "nclex",
      "naplex",
      "pance",
      "aanp-fnp",
      "npte-pt",
    ]);
    expect(display.exams[0]?.countLabel).toBe("28,373");
    expect(display.exams[0]?.questionsLabel).toBe("28,373 serve-ready questions");
    expect(display.exams[1]?.countLabel).toBe("6,938");
    expect(display.exams[2]?.countLabel).toBe("6,380");
    expect(display.totalLabel).toBe("57,494");
    expect(display.totalQuestionsLabel).toBe("57,494 serve-ready questions");
    expect(display.totalServed).toBe(57_494);
  });

  it("falls back to published floor counts when snapshot is degraded", () => {
    const snapshot = snapshotWithServed({});
    snapshot.degraded = true;

    expect(displayQuestionCountForField("pharmacy", snapshot)).toBe("10,332");
    expect(displayTotalQuestionCount(snapshot)).toBe("47,969");
  });
});
