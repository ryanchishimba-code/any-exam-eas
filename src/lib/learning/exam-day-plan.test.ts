import { describe, expect, it } from "vitest";
import type { ExamSlug } from "@/types/edtech";
import {
  READINESS_FORMULA,
  READINESS_MIN_SAMPLE,
  TODAY_DRUG_COUNT,
  TODAY_INCORRECT_CAP,
  TODAY_QBANK_COUNT,
  blueprintTouchCoveragePct,
  buildExamDayPlan,
  calendarDaysUntil,
  classifyExamDayReadiness,
  readinessScoreFromFactors,
  remediationCompletionPct,
  type ExamDayTopicInput,
} from "./exam-day-plan";

const FIELD_BY_EXAM: Record<ExamSlug, string> = {
  nclex: "nursing",
  usmle: "usmle-step-2",
  naplex: "pharmacy",
  pance: "pance",
  "aanp-fnp": "aanp-fnp",
  "npte-pt": "npte-pt",
};

function topic(
  partial: Partial<ExamDayTopicInput> & Pick<ExamDayTopicInput, "id" | "label">
): ExamDayTopicInput {
  return {
    blueprintWeightPct: 20,
    attempts: 0,
    accuracyPct: null,
    coveragePct: 0,
    practiceHref: `/question-bank?field=nursing&mode=bank&subjectId=${partial.id}&count=15`,
    guideHref: `/dashboard/topics?topic=${partial.id}`,
    guideLabel: partial.label,
    drugHref: `/study/drugs300?class=${partial.id}`,
    drugLabel: partial.label,
    ...partial,
  };
}

function planText(value: unknown): string {
  return JSON.stringify(value);
}

describe("buildExamDayPlan", () => {
  const now = new Date("2026-09-22T15:00:00.000Z");

  it("gives a new student a concrete block without a readiness band", () => {
    const plan = buildExamDayPlan({
      examSlug: "nclex",
      examName: "NCLEX-RN",
      fieldId: "nursing",
      testDate: "2026-11-03",
      now,
      totalAttempts: 0,
      recentAccuracyPct: 0,
      openIncorrect: 0,
      topics: [
        topic({ id: "management-of-care", label: "Management of Care", blueprintWeightPct: 20 }),
        topic({ id: "pharmacology", label: "Pharmacological Therapies", blueprintWeightPct: 15 }),
      ],
    });

    expect(plan.daysUntilExam).toBe(calendarDaysUntil("2026-11-03", now));
    expect(plan.pacing).toMatch(/NCLEX-RN/);
    expect(plan.items.map((item) => item.id)).toEqual(["qbank", "incorrect", "guide", "drugs"]);
    expect(plan.items[0]?.title).toBe(`${TODAY_QBANK_COUNT} Qbank questions`);
    expect(plan.items[0]?.href).toContain("field=nursing");
    expect(plan.items[0]?.href).toContain(`count=${TODAY_QBANK_COUNT}`);
    expect(plan.items[0]?.href).toContain("autostart=1");
    expect(plan.items[1]?.href).toBeNull();
    expect(plan.items[1]?.detail).toMatch(/0 incorrect items/);
    expect(plan.items[2]?.title).toBe("1 guide topic");
    expect(plan.items[3]?.title).toBe(`${TODAY_DRUG_COUNT} drugs`);
    expect(plan.readiness.visible).toBe(false);
    expect(plan.readiness.label).toBeNull();
    expect(plan.readiness.score).toBeNull();
    expect(plan.readiness.minSample).toBe(READINESS_MIN_SAMPLE);
    expect(plan.readiness.formula).toBe(READINESS_FORMULA);
    expect(planText(plan)).not.toMatch(/you will pass/i);
  });

  it("scopes the same block to every board field", () => {
    for (const examSlug of Object.keys(FIELD_BY_EXAM) as ExamSlug[]) {
      const fieldId = FIELD_BY_EXAM[examSlug];
      const plan = buildExamDayPlan({
        examSlug,
        examName: examSlug,
        fieldId,
        now,
        totalAttempts: 0,
        recentAccuracyPct: 0,
        openIncorrect: 0,
        topics: [],
      });
      expect(plan.items[0]?.href).toContain(`field=${encodeURIComponent(fieldId)}`);
      expect(plan.items[2]?.href).toContain(`exam=${encodeURIComponent(examSlug)}`);
      expect(plan.items[3]?.href).toContain(`exam=${encodeURIComponent(examSlug)}`);
    }
  });

  it("moves the Qbank gap after saved attempts change coverage", () => {
    const shared = {
      examSlug: "nclex" as const,
      examName: "NCLEX-RN",
      fieldId: "nursing",
      now,
      recentAccuracyPct: 70,
      openIncorrect: 2,
    };
    const before = buildExamDayPlan({
      ...shared,
      totalAttempts: 10,
      topics: [
        topic({
          id: "management-of-care",
          label: "Management of Care",
          blueprintWeightPct: 20,
          attempts: 0,
          coveragePct: 0,
        }),
        topic({
          id: "safety",
          label: "Safety",
          blueprintWeightPct: 12,
          attempts: 10,
          accuracyPct: 80,
          coveragePct: 40,
        }),
      ],
    });
    expect(before.items[0]?.detail).toMatch(/Management of Care/);
    expect(before.items[1]?.title).toBe("Review 2 incorrect");
    expect(before.items[1]?.href).toContain("style=review_incorrect");
    expect(before.items[1]?.href).toContain("count=2");
    expect(before.readiness.visible).toBe(false);

    const after = buildExamDayPlan({
      ...shared,
      totalAttempts: 40,
      topics: [
        topic({
          id: "management-of-care",
          label: "Management of Care",
          blueprintWeightPct: 20,
          attempts: 30,
          accuracyPct: 90,
          coveragePct: 80,
        }),
        topic({
          id: "safety",
          label: "Safety",
          blueprintWeightPct: 12,
          attempts: 10,
          accuracyPct: 40,
          coveragePct: 5,
        }),
      ],
    });
    expect(after.items[0]?.detail).toMatch(/Safety/);
    expect(after.totalAttempts).toBe(40);
  });

  it("hides the band below 100 answers and shows the formula at the sample floor", () => {
    const topics = [
      topic({
        id: "a",
        label: "Alpha",
        blueprintWeightPct: 50,
        attempts: 50,
        accuracyPct: 80,
        coveragePct: 40,
      }),
      topic({
        id: "b",
        label: "Beta",
        blueprintWeightPct: 50,
        attempts: 50,
        accuracyPct: 80,
        coveragePct: 40,
      }),
    ];
    const hidden = buildExamDayPlan({
      examSlug: "pance",
      examName: "PANCE",
      fieldId: "pance",
      now,
      totalAttempts: READINESS_MIN_SAMPLE - 1,
      recentAccuracyPct: 80,
      openIncorrect: 0,
      topics,
    });
    expect(hidden.readiness.visible).toBe(false);
    expect(hidden.readiness.sampleDetail).toMatch(/99/);

    const shown = buildExamDayPlan({
      examSlug: "pance",
      examName: "PANCE",
      fieldId: "pance",
      now,
      totalAttempts: READINESS_MIN_SAMPLE,
      recentAccuracyPct: 80,
      openIncorrect: 0,
      topics,
    });
    expect(shown.readiness.visible).toBe(true);
    expect(shown.readiness.coveragePct).toBe(100);
    expect(shown.readiness.remediationPct).toBe(100);
    expect(shown.readiness.score).toBe(readinessScoreFromFactors(100, 80, 100));
    expect(shown.readiness.label).toBe(classifyExamDayReadiness(shown.readiness.score ?? 0));
    expect(shown.readiness.formula).toMatch(/not a pass prediction/);
    expect(planText(shown)).not.toMatch(/you will pass/i);
  });

  it("rotates today's focus across equal gaps by UTC day", () => {
    const topics = [
      topic({ id: "alpha", label: "Alpha" }),
      topic({ id: "beta", label: "Beta" }),
    ];
    const first = buildExamDayPlan({
      examSlug: "naplex",
      examName: "NAPLEX",
      fieldId: "pharmacy",
      now: new Date("2026-01-01T12:00:00.000Z"),
      totalAttempts: 0,
      recentAccuracyPct: 0,
      openIncorrect: 0,
      topics,
    });
    const second = buildExamDayPlan({
      examSlug: "naplex",
      examName: "NAPLEX",
      fieldId: "pharmacy",
      now: new Date("2026-01-02T12:00:00.000Z"),
      totalAttempts: 0,
      recentAccuracyPct: 0,
      openIncorrect: 0,
      topics,
    });
    expect(first.week[0]?.label).not.toBe(second.week[0]?.label);
    expect(first.week[0]?.isToday).toBe(true);
  });

  it("does not claim zero incorrect items when the count is unknown", () => {
    const plan = buildExamDayPlan({
      examSlug: "usmle",
      examName: "USMLE",
      fieldId: "usmle-step-1",
      now,
      totalAttempts: 12,
      recentAccuracyPct: 50,
      openIncorrect: null,
      topics: [],
    });
    expect(plan.items[1]?.detail).toMatch(/could not be counted/);
    expect(plan.items[1]?.href).toContain("style=review_incorrect");
    expect(plan.items[1]?.href).not.toContain("autostart=1");
    expect(plan.items[0]?.href).toContain("field=usmle-step-1");
  });

  it("caps the incorrect block at 10", () => {
    const plan = buildExamDayPlan({
      examSlug: "aanp-fnp",
      examName: "AANP FNP-C",
      fieldId: "aanp-fnp",
      now,
      totalAttempts: 40,
      recentAccuracyPct: 55,
      openIncorrect: 18,
      topics: [topic({ id: "cardio", label: "Cardiology", practiceHref: "/question-bank?subjectId=cardio" })],
    });
    expect(plan.items[1]?.title).toBe(`Review ${TODAY_INCORRECT_CAP} incorrect`);
    expect(plan.items[1]?.href).toContain(`count=${TODAY_INCORRECT_CAP}`);
    expect(plan.readiness.remediationPct).toBe(remediationCompletionPct(40, 18));
  });
});

describe("readiness factors", () => {
  it("weights coverage by blueprint share of touched categories", () => {
    expect(
      blueprintTouchCoveragePct([
        { blueprintWeightPct: 75, attempts: 0 },
        { blueprintWeightPct: 25, attempts: 3 },
      ])
    ).toBe(25);
  });

  it("multiplies the three factors", () => {
    expect(readinessScoreFromFactors(80, 90, 50)).toBe(36);
    expect(classifyExamDayReadiness(36)).toBe("Early practice");
    expect(classifyExamDayReadiness(64)).toBe("Building");
    expect(classifyExamDayReadiness(81)).toBe("Steady practice");
  });
});
