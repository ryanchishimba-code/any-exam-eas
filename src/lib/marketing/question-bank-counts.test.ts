import { describe, expect, it } from "vitest";
import { boardQuestionUnits } from "@/lib/counts";
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
    expect(display.exams[0]?.questionsLabel).toBe("28,373 active questions");
    expect(display.exams[1]?.countLabel).toBe("6,938");
    expect(display.exams[2]?.countLabel).toBe("6,380");
    expect(display.totalLabel).toBe("57,494");
    expect(display.totalQuestionsLabel).toBe("57,494 active questions");
    expect(display.totalServed).toBe(57_494);
  });

  it("uses the six-board active sum when totals.served is a different figure", () => {
    const snapshot = snapshotWithServed({
      nursing: 8000,
      pharmacy: 10000,
      "usmle-step-2": 17000,
      pance: 2800,
      "aanp-fnp": 4700,
      "npte-pt": 4200,
    });
    snapshot.totals = { total: 48136, active: 48136, served: 48136 };
    const display = buildLandingBankCountsDisplay(snapshot);
    expect(landingServedTotal(snapshot)).toBe(46_700);
    expect(display.totalServed).toBe(46_700);
    expect(display.totalLabel).toBe("46,700");
    expect(display.totalQuestionsLabel).toBe("46,700 active questions");
    expect(displayTotalQuestionCount(snapshot)).toBe("46,700");
  });

  it("floors and labels the bank total when field.served still includes catalog NGN", () => {
    const snapshot = snapshotWithServed({
      nursing: 4247,
      pharmacy: 4411,
      "usmle-step-2": 16742,
      pance: 2559,
      "aanp-fnp": 5136,
      "npte-pt": 1748,
    });
    snapshot.boards = {
      nclex: boardQuestionUnits({
        slug: "nclex",
        bankItems: 3947,
        clinical: { standaloneNgn: 66, caseStudies: 39, caseItems: 234 },
      }),
      usmle: boardQuestionUnits({ slug: "usmle", bankItems: 16742 }),
      naplex: boardQuestionUnits({ slug: "naplex", bankItems: 4411 }),
      pance: boardQuestionUnits({ slug: "pance", bankItems: 2559 }),
      "aanp-fnp": boardQuestionUnits({ slug: "aanp-fnp", bankItems: 5136 }),
      "npte-pt": boardQuestionUnits({ slug: "npte-pt", bankItems: 1748 }),
    };
    const display = buildLandingBankCountsDisplay(snapshot);
    expect(landingServedTotal(snapshot)).toBe(34_843);
    expect(display.totalServed).toBe(34_543);
    expect(display.totalLabel).toBe("34,543");
    expect(display.roundedDown).toBe("34,500+");
    expect(display.exams.find((exam) => exam.slug === "nclex")?.countLabel).toBe("3,947");
    expect(displayTotalQuestionCount(snapshot)).toBe("34,543");
  });

  it("omits the number when the snapshot is degraded", () => {
    const snapshot = snapshotWithServed({});
    snapshot.degraded = true;

    expect(displayQuestionCountForField("pharmacy", snapshot)).toBe("");
    expect(displayTotalQuestionCount(snapshot)).toBe("");
    const display = buildLandingBankCountsDisplay(snapshot);
    expect(display.totalLabel).toBe("");
    expect(display.sentence).toBe("");
    expect(display.exams.every((exam) => exam.countLabel === "")).toBe(true);
  });
});
