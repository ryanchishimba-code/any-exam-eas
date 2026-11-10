import { describe, expect, it } from "vitest";
import { calendarDaysUntil as planDays } from "@/lib/learning/exam-day-plan";
import { calendarDaysUntil } from "@/lib/edtech/exam-date-utils";
import { practiceEstimateFromHistory } from "@/lib/learning/practice-estimate";
import { trendDayKey, weakAreaAccuracyPct } from "@/lib/learning/student-dashboard";
import { specificQuestionReason } from "@/components/study/AdaptiveReasoningChip";
import { collapseRepeatedLabels } from "@/lib/questions/student-display-text";

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
    expect(estimate?.explanation).toMatch(/baseline measures accuracy/i);
    expect(estimate?.explanation).toMatch(/practice set updates/i);
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
});
