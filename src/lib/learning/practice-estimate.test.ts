import { describe, expect, it } from "vitest";
import { calendarDaysUntil as planDays } from "@/lib/learning/exam-day-plan";
import { calendarDaysUntil } from "@/lib/edtech/exam-date-utils";
import { outlineCoveragePct } from "@/lib/learning/practice-measure";
import {
  outlineDepthPct,
  practiceEstimateFromHistory,
  sharedPracticeRead,
} from "@/lib/learning/practice-estimate";
import {
  accuracyTrendFromInstants,
  trendDayKey,
  weakAreaAccuracyPct,
} from "@/lib/learning/student-dashboard";
import { specificQuestionReason } from "@/components/study/AdaptiveReasoningChip";
import {
  cleanStudentRationale,
  collapseRepeatedLabels,
  showAiAssistedRationaleLabel,
  studentRationalePlain,
} from "@/lib/questions/student-display-text";
import { lengthOptionHint, lengthOptionTitle } from "@/components/exam/FullExamLengthWheel";
import { chicagoCalendarDay } from "@/lib/learning/student-dashboard";
import { getLengthOptions } from "@/lib/full-exam/config";
import { weakAreaPracticeHref } from "@/lib/learning/weak-area-practice-href";
import { initialClientSession } from "@/lib/auth/client-session";

describe("practice estimate", () => {
  it("stays empty until there are answers", () => {
    expect(
      practiceEstimateFromHistory({
        attempts: 0,
        accuracyPct: 90,
        coveragePct: 90,
        remediationPct: 90,
      })
    ).toBeNull();
  });

  it("labels the read as a practice measure and explains the baseline", () => {
    const estimate = practiceEstimateFromHistory({
      attempts: 330,
      accuracyPct: 56,
      coveragePct: 18,
      remediationPct: 40,
    });
    expect(estimate?.label).toBe("A practice measure, not a pass prediction.");
    expect(estimate?.explanation).toMatch(/not the readiness baseline/i);
    expect(estimate?.explanation).toMatch(/practice history/i);
    expect(estimate?.summary).not.toMatch(/you will pass|pass prediction/i);
  });
});

describe("shared student numbers", () => {
  it("counts exam days the same on the plan and the countdown", () => {
    const now = new Date("2026-11-10T03:30:00.000Z");
    expect(calendarDaysUntil("2027-02-10", now)).toBe(planDays("2027-02-10", now));
    expect(calendarDaysUntil("2027-02-10", now.getTime())).toBe(92);
  });

  it("keeps a local-midnight SQL date on the calendar day it names", () => {
    const localMidnight = new Date(2026, 10, 8, 0, 0, 0, 0);
    expect(trendDayKey(localMidnight)).toBe("2026-11-08");
    expect(trendDayKey("2026-11-08")).toBe("2026-11-08");
  });

  it("buckets an evening attempt on the Chicago day and keeps earlier days", () => {
    const now = new Date("2026-11-10T04:30:00.000Z");
    expect(trendDayKey(now)).toBe("2026-11-09");
    const points = accuracyTrendFromInstants(
      [
        { createdAt: new Date("2026-11-08T18:00:00.000Z"), correct: true },
        { createdAt: now, correct: false },
      ],
      now
    );
    expect(points).toHaveLength(14);
    expect(points.at(-1)?.date).toBe("2026-11-09");
    expect(points.find((point) => point.date === "2026-11-08")?.attempts).toBe(1);
    expect(points.find((point) => point.date === "2026-11-09")?.attempts).toBe(1);
    expect(points.some((point) => point.date === "2026-11-10")).toBe(false);
    const evening = new Date("2026-11-10T04:10:00.000Z");
    expect(chicagoCalendarDay(evening)).toBe("2026-11-09");
    const axis = accuracyTrendFromInstants([], evening);
    expect(axis.at(-1)?.date).toBe("2026-11-09");
    expect(axis.at(0)?.date).toBe("2026-10-27");
    expect(axis.some((point) => point.date === "2026-11-10")).toBe(false);
  });

  it("uses one outline depth and one estimate for dashboard, analytics, and readiness", () => {
    const read = sharedPracticeRead({
      totalAttempts: 40,
      openIncorrectCount: 4,
      topics: [
        {
          attempts: 30,
          correct: 9,
          pushesCompleted: 4,
          pushesAvailable: 20,
          blueprintWeightPct: 50,
        },
        {
          attempts: 10,
          correct: 1,
          pushesCompleted: 0,
          pushesAvailable: 10,
          blueprintWeightPct: 50,
        },
      ],
    });
    const depth = outlineDepthPct([
      { seen: 4, available: 20, weightPct: 50 },
      { seen: 0, available: 10, weightPct: 50 },
    ]);
    expect(read.accuracyPct).toBe(25);
    expect(read.outlineDepthPct).toBe(depth);
    expect(depth).toBe(
      outlineCoveragePct([
        { blueprintWeightPct: 50, answerCredit: 4, denominator: 20 },
        { blueprintWeightPct: 50, answerCredit: 0, denominator: 10 },
      ])
    );
    const again = sharedPracticeRead({
      totalAttempts: 40,
      openIncorrectCount: 4,
      topics: [
        {
          attempts: 30,
          correct: 9,
          pushesCompleted: 4,
          pushesAvailable: 20,
          blueprintWeightPct: 50,
        },
        {
          attempts: 10,
          correct: 1,
          pushesCompleted: 0,
          pushesAvailable: 10,
          blueprintWeightPct: 50,
        },
      ],
    });
    expect(again.estimate).toEqual(read.estimate);
    expect(again.outlineDepthPct).toBe(read.outlineDepthPct);
    expect(again.accuracyPct).toBe(read.accuracyPct);
  });

  it("uses correct answers over a zero mastery score", () => {
    expect(weakAreaAccuracyPct({ attempts: 10, correct: 6, masteryScore: 0 })).toBe(60);
    expect(weakAreaAccuracyPct({ attempts: 0, correct: 0, masteryScore: 0 })).toBeNull();
  });
});

describe("question-specific reason", () => {
  it("names the reason or drops a generic line", () => {
    expect(specificQuestionReason("Spaced repetition — due for review")).toBe("Due for review");
    expect(specificQuestionReason("Topic is a known weak area")).toBe("Weak area");
    expect(specificQuestionReason("Unseen question — broadens coverage")).toBe("New topic");
    expect(specificQuestionReason("Adaptive selection based on your weak areas and review schedule.")).toBeNull();
  });
});

describe("student-facing rationale cleanup", () => {
  it("collapses a doubled practice lead and the Chek typo", () => {
    expect(collapseRepeatedLabels("In practice: In practice, watch the airway.")).toBe(
      "In practice: watch the airway."
    );
    expect(collapseRepeatedLabels("Chek the airway.")).toBe("Check the airway.");
  });

  it("renders markdown markers as text without a doubled practice lead", () => {
    const raw = "**Airway** first.\nIn practice: In practice, watch the airway.";
    expect(cleanStudentRationale(raw)).toContain("**Airway**");
    expect(studentRationalePlain(raw)).toBe("Airway first.\nIn practice: watch the airway.");
    expect(studentRationalePlain(raw)).not.toContain("**");
    expect(studentRationalePlain("In practice: In practice, watch.")).not.toMatch(/In practice: In practice/i);
  });

  it("does not show an AI-assisted label", () => {
    expect(showAiAssistedRationaleLabel()).toBe(false);
  });
});

describe("full exam length labels", () => {
  it("names the USMLE step on every option, including the 200-question full exam", () => {
    const options = getLengthOptions("usmle", "usmle-step-3");
    const full = options.find((option) => option.questionCount === 200);
    expect(full?.preset).toBe("full");
    expect(lengthOptionTitle(full!)).toMatch(/Step 3/);
    expect(options.every((option) => /Step 3/.test(lengthOptionTitle(option)))).toBe(true);
    const step2 = getLengthOptions("usmle", "usmle-step-2");
    const step2Full = step2.find((option) => option.preset === "full");
    expect(step2Full?.questionCount).toBe(280);
    expect(lengthOptionTitle(step2Full!)).toMatch(/Step 2 CK/);
    expect(lengthOptionTitle(step2Full!)).not.toBe("Full");
    expect(lengthOptionHint(step2Full!)).toMatch(/Step 2 CK/);
    expect(lengthOptionHint(step2Full!)).not.toMatch(/Full-length adaptive/);
  });
});

describe("weak area practice link", () => {
  it("opens Confidentiality Reporting on Step 3, not a generic Step 2 session", () => {
    const href = weakAreaPracticeHref({
      examSlug: "usmle",
      topicKey: "tag:Confidentiality Reporting",
      fieldId: "usmle-step-3",
      count: 25,
    });
    const url = new URL(href!, "https://anyexameasy.local");
    expect(url.searchParams.get("field")).toBe("usmle-step-3");
    expect(url.searchParams.get("field")).not.toBe("usmle-step-2");
    expect(url.searchParams.get("blueprintTopics")).toBe("confidentiality-reporting");
    expect(url.searchParams.get("usmleTopic")).toBe("confidentiality-reporting");
    expect(url.searchParams.get("subjectId")).toBe("confidentiality-reporting");
    expect(url.searchParams.get("style")).toBe("standard");
    expect(href).not.toContain("subjectId=internal-medicine");
  });

  it("drops Step 3 Antibiotic Mechanisms instead of opening Internal Medicine", () => {
    expect(
      weakAreaPracticeHref({
        examSlug: "usmle",
        topicKey: "antibiotic-mechanisms",
        fieldId: "usmle-step-3",
        count: 5,
      })
    ).toBeNull();
    expect(
      weakAreaPracticeHref({
        examSlug: "usmle",
        topicKey: "clinical-intervention",
        fieldId: "usmle-step-3",
        count: 5,
      })
    ).toBeNull();
  });
});

describe("signed-in header session", () => {
  it("does not freeze a missing session as logged out", () => {
    expect(initialClientSession(null)).toBeUndefined();
    const session = { user: { name: "Dev" } };
    expect(initialClientSession(session)).toBe(session);
  });
});
