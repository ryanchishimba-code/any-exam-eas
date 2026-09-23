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
  classifyReadinessBand,
  examSimTrendFromSessions,
  readinessScoreFromFactors,
  remediationCompletionPct,
  rollingAccuracyFromAttempts,
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
    expect(plan.items.map((item) => item.id)).toEqual(["qbank", "guide", "drugs", "incorrect"]);
    expect(plan.items[0]?.title).toBe(`${TODAY_QBANK_COUNT} Qbank questions`);
    expect(plan.items[0]?.why).toMatch(/Management of Care/);
    expect(plan.items[0]?.why).toMatch(/untouched high-weight/);
    expect(plan.items[0]?.href).toContain("field=nursing");
    expect(plan.items[0]?.href).toContain(`count=${TODAY_QBANK_COUNT}`);
    expect(plan.items[0]?.href).toContain("autostart=1");
    const incorrect = plan.items.find((item) => item.id === "incorrect");
    expect(incorrect?.href).toBeNull();
    expect(incorrect?.detail).toMatch(/0 incorrect items/);
    expect(plan.items.find((item) => item.id === "guide")?.title).toBe("1 guide topic");
    expect(plan.items.find((item) => item.id === "drugs")?.title).toBe(`${TODAY_DRUG_COUNT} drugs`);
    expect(plan.readiness.visible).toBe(false);
    expect(plan.readiness.label).toBeNull();
    expect(plan.readiness.headline).toBe("Not enough practice yet");
    expect(plan.readiness.sampleDetail).toMatch(/0 of 100/);
    expect(plan.readiness.score).toBeNull();
    expect(plan.readiness.minSample).toBe(READINESS_MIN_SAMPLE);
    expect(plan.readiness.formula).toBe(READINESS_FORMULA);
    expect(plan.readiness.criteria.every((row) => row.status === "not_scored")).toBe(true);
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
    expect(before.items[0]?.id).toBe("qbank");
    expect(before.items[0]?.detail).toMatch(/Management of Care/);
    const beforeIncorrect = before.items.find((item) => item.id === "incorrect");
    expect(beforeIncorrect?.title).toBe("Review 2 incorrect");
    expect(beforeIncorrect?.href).toContain("style=review_incorrect");
    expect(beforeIncorrect?.href).toContain("count=2");
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
    expect(shown.readiness.label).toBe("Ready");
    expect(shown.readiness.bandKey).toBe(classifyReadinessBand(3).key);
    expect(shown.readiness.criteria.filter((row) => row.status === "met")).toHaveLength(3);
    expect(shown.readiness.formula).toMatch(/not a pass prediction/);
    expect(shown.readiness.domains.map((domain) => domain.label).sort()).toEqual(["Alpha", "Beta"]);
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
    const incorrect = plan.items.find((item) => item.id === "incorrect");
    expect(incorrect?.detail).toMatch(/could not be counted/);
    expect(incorrect?.href).toContain("style=review_incorrect");
    expect(incorrect?.href).not.toContain("autostart=1");
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
    const incorrect = plan.items.find((item) => item.id === "incorrect");
    expect(incorrect?.title).toBe(`Review ${TODAY_INCORRECT_CAP} incorrect`);
    expect(incorrect?.href).toContain(`count=${TODAY_INCORRECT_CAP}`);
    expect(plan.items[0]?.id).toBe("incorrect");
    expect(plan.items[0]?.why).toMatch(/18/);
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

  it("multiplies the three factors and classifies by how many criteria are met", () => {
    expect(readinessScoreFromFactors(80, 90, 50)).toBe(36);
    expect(classifyReadinessBand(3)).toEqual({ key: "ready", label: "Ready" });
    expect(classifyReadinessBand(2)).toEqual({ key: "almost", label: "Almost" });
    expect(classifyReadinessBand(1)).toEqual({ key: "not_yet", label: "Not yet" });
  });
});

describe("readiness proof gaps", () => {
  const now = new Date("2026-09-22T15:00:00.000Z");

  it("puts review incorrect first when open remediations are the top gap", () => {
    const plan = buildExamDayPlan({
      examSlug: "nclex",
      examName: "NCLEX-RN",
      fieldId: "nursing",
      now,
      totalAttempts: 120,
      recentAccuracyPct: 74,
      recentWindowAttempts: 100,
      openIncorrect: 12,
      topics: [
        topic({
          id: "safety",
          label: "Safety and Infection Control",
          blueprintWeightPct: 12,
          attempts: 40,
          accuracyPct: 80,
          coveragePct: 50,
        }),
        topic({
          id: "management-of-care",
          label: "Management of Care",
          blueprintWeightPct: 18,
          attempts: 40,
          accuracyPct: 78,
          coveragePct: 45,
        }),
      ],
    });
    expect(plan.items[0]?.id).toBe("incorrect");
    expect(plan.items[0]?.why).toMatch(/12 incorrect items are still open/);
    expect(plan.readiness.leadReason).toBe(plan.items[0]?.why);
    expect(plan.readiness.visible).toBe(true);
    expect(plan.readiness.label).toBe("Almost");
    expect(plan.readiness.criteria.find((row) => row.id === "remediation")?.status).toBe("missing");
  });

  it("keeps an untouched high-weight domain ahead of a short incorrect queue", () => {
    const plan = buildExamDayPlan({
      examSlug: "usmle",
      examName: "USMLE Step 2",
      fieldId: "usmle-step-2",
      now,
      totalAttempts: 40,
      recentAccuracyPct: 70,
      recentWindowAttempts: 40,
      openIncorrect: 2,
      topics: [
        topic({
          id: "cardiovascular",
          label: "Cardiovascular",
          blueprintWeightPct: 13,
          attempts: 0,
          coveragePct: 0,
        }),
        topic({
          id: "renal",
          label: "Renal",
          blueprintWeightPct: 8,
          attempts: 20,
          accuracyPct: 80,
          coveragePct: 40,
        }),
      ],
    });
    expect(plan.items[0]?.id).toBe("qbank");
    expect(plan.items[0]?.why).toMatch(/Cardiovascular/);
    expect(plan.items[0]?.detail).toMatch(/Cardiovascular/);
    expect(plan.items.map((item) => item.id)[1]).toBe("guide");
  });

  it("shows Almost when two criteria are met and Not yet when coverage is the only miss among a weak set", () => {
    const almost = buildExamDayPlan({
      examSlug: "pance",
      examName: "PANCE",
      fieldId: "pance",
      now,
      totalAttempts: 100,
      recentAccuracyPct: 72,
      recentWindowAttempts: 80,
      openIncorrect: 4,
      topics: [
        topic({
          id: "cardio",
          label: "Cardiovascular",
          blueprintWeightPct: 80,
          attempts: 90,
          accuracyPct: 75,
          coveragePct: 40,
        }),
        topic({
          id: "pulm",
          label: "Pulmonary",
          blueprintWeightPct: 20,
          attempts: 0,
          coveragePct: 0,
        }),
      ],
    });
    expect(almost.readiness.label).toBe("Almost");
    expect(almost.readiness.criteria.find((row) => row.id === "coverage")?.status).toBe("missing");
    expect(almost.readiness.criteria.find((row) => row.id === "coverage")?.detail).toMatch(/Pulmonary/);

    const early = buildExamDayPlan({
      examSlug: "pance",
      examName: "PANCE",
      fieldId: "pance",
      now,
      totalAttempts: 100,
      recentAccuracyPct: 40,
      recentWindowAttempts: 20,
      openIncorrect: 30,
      topics: [
        topic({
          id: "cardio",
          label: "Cardiovascular",
          blueprintWeightPct: 50,
          attempts: 0,
          coveragePct: 0,
        }),
      ],
    });
    expect(early.readiness.label).toBe("Not yet");
    expect(early.readiness.criteria.find((row) => row.id === "recent_accuracy")?.detail).toMatch(/40 answers/);
  });

  it("does not let an optional exam simulation change the band", () => {
    const shared = {
      examSlug: "nclex" as const,
      examName: "NCLEX-RN",
      fieldId: "nursing",
      now,
      totalAttempts: 100,
      recentAccuracyPct: 80,
      recentWindowAttempts: 100,
      openIncorrect: 0,
      topics: [
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
      ],
    };
    const without = buildExamDayPlan(shared);
    const withSim = buildExamDayPlan({
      ...shared,
      examSimTrend: {
        latestScore: 42,
        previousScore: 55,
        direction: "down",
        completedCount: 2,
        practiceBandLabel: "Building practice band",
      },
    });
    expect(withSim.readiness.label).toBe(without.readiness.label);
    expect(withSim.readiness.score).toBe(without.readiness.score);
    expect(withSim.readiness.criteria.find((row) => row.id === "exam_sim")?.status).toBe("not_scored");
    expect(withSim.readiness.criteria.find((row) => row.id === "exam_sim")?.detail).toMatch(/not a licensure result/);
    expect(planText(withSim)).not.toMatch(/you will pass/i);
  });

  it("updates the proof when open remediations shrink", () => {
    const shared = {
      examSlug: "naplex" as const,
      examName: "NAPLEX",
      fieldId: "pharmacy",
      now,
      totalAttempts: 110,
      recentAccuracyPct: 76,
      recentWindowAttempts: 100,
      topics: [
        topic({
          id: "medication-use-process",
          label: "Medication Use Process",
          blueprintWeightPct: 40,
          attempts: 40,
          accuracyPct: 70,
          coveragePct: 30,
        }),
      ],
    };
    const open = buildExamDayPlan({ ...shared, openIncorrect: 20 });
    const closed = buildExamDayPlan({ ...shared, openIncorrect: 2 });
    expect(open.items[0]?.id).toBe("incorrect");
    expect(closed.readiness.remediationPct).toBeGreaterThan(open.readiness.remediationPct);
    expect(closed.readiness.score).not.toBe(open.readiness.score);
    expect(closed.items[0]?.id).not.toBe("incorrect");
  });
});

describe("rolling accuracy and exam simulation trend", () => {
  it("uses the newest answers in the rolling window", () => {
    const attempts = [
      ...Array.from({ length: 80 }, (_, index) => ({
        correct: false,
        createdAt: new Date(Date.UTC(2026, 0, 1, 0, index)),
      })),
      ...Array.from({ length: 20 }, (_, index) => ({
        correct: true,
        createdAt: new Date(Date.UTC(2026, 1, 1, 0, index)),
      })),
    ];
    const window = rollingAccuracyFromAttempts(attempts, 20);
    expect(window.windowAttempts).toBe(20);
    expect(window.pct).toBe(100);
    expect(rollingAccuracyFromAttempts(attempts).pct).toBe(20);
  });

  it("ignores short sessions and untrusted band labels", () => {
    expect(
      examSimTrendFromSessions([
        { status: "completed", score: 90, questionCount: 10, practiceBandLabel: "You will pass" },
      ])
    ).toBeNull();
    const trend = examSimTrendFromSessions([
      {
        status: "completed",
        score: 70,
        questionCount: 85,
        practiceBandLabel: "Developing practice band",
      },
      { status: "completed", score: 60, questionCount: 100 },
      { status: "in_progress", score: 10, questionCount: 85 },
    ]);
    expect(trend).toMatchObject({
      latestScore: 70,
      previousScore: 60,
      direction: "up",
      practiceBandLabel: "Developing practice band",
    });
  });
});
