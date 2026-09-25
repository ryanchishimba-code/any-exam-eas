import { describe, expect, it } from "vitest";
import { FIRST_LOGIN_TOUR_ID } from "@/lib/onboarding/tour-record";
import {
  TODAY_SET_DEFAULT_SIZE,
  applyQuestionAllowance,
  composeTodaySet,
  computeDailyHabitStreak,
  dailyGoalProgress,
  formatTodayMixLine,
  mergeDailyHabitDay,
  questionAllowanceFromUsage,
  readDailyHabitDays,
  recountTodayMix,
  resolveTodaySetSize,
  weakestTopicFromOutcomes,
} from "@/lib/learning/today-set";

describe("resolveTodaySetSize", () => {
  it("defaults to 25 when no goal is stored", () => {
    expect(resolveTodaySetSize(null)).toBe(TODAY_SET_DEFAULT_SIZE);
    expect(resolveTodaySetSize({})).toBe(25);
    expect(resolveTodaySetSize({ dailyGoal: 0, weekGoal: null, examDatePlanSize: Number.NaN })).toBe(
      25
    );
  });

  it("prefers a daily goal, then the week goal, then the exam-date plan", () => {
    expect(resolveTodaySetSize({ dailyGoal: 40, weekGoal: 30, examDatePlanSize: 15 })).toBe(40);
    expect(resolveTodaySetSize({ weekGoal: 30, examDatePlanSize: 15 })).toBe(30);
    expect(resolveTodaySetSize({ examDatePlanSize: 15 })).toBe(15);
  });

  it("ignores non-positive settings and caps an oversized goal", () => {
    expect(resolveTodaySetSize({ dailyGoal: -4, weekGoal: 10 })).toBe(10);
    expect(resolveTodaySetSize({ dailyGoal: 250 })).toBe(100);
  });
});

describe("question allowance", () => {
  it("caps the set by the tighter remaining allowance and leaves unlimited plans alone", () => {
    expect(applyQuestionAllowance(25, null)).toBe(25);
    expect(applyQuestionAllowance(25, 10)).toBe(10);
    expect(applyQuestionAllowance(25, 0)).toBe(0);
    expect(
      questionAllowanceFromUsage({ remainingToday: 40, remainingTrialTotal: 12 })
    ).toBe(12);
    expect(questionAllowanceFromUsage({ remainingToday: null, remainingTrialTotal: null })).toBe(
      null
    );
  });
});

describe("composeTodaySet", () => {
  const random = () => 0;

  it("mixes due review, due spaced review, and new items without inflating", () => {
    const set = composeTodaySet({
      size: 25,
      reviewIncorrectIds: ["r1", "r2", "r1"],
      spacedReviewIds: ["r2", "s1", "s2"],
      newCandidates: Array.from({ length: 30 }, (_, i) => ({
        id: `n${i}`,
        weight: i === 0 ? 1 : 10,
      })),
      random,
    });

    expect(set.ids).toHaveLength(25);
    expect(set.reviewIncorrectIds).toEqual(["r1", "r2"]);
    expect(set.spacedReviewIds).toEqual(["s1", "s2"]);
    expect(set.reviewCount).toBe(4);
    expect(set.newCount).toBe(21);
    expect(set.mixLine).toBe("4 to review · 21 new");
    expect(new Set(set.ids).size).toBe(25);
    expect(set.ids.slice(0, 4)).toEqual(["r1", "r2", "s1", "s2"]);
  });

  it("shows the example split when eight items are due and the rest are new", () => {
    const review = Array.from({ length: 8 }, (_, i) => `miss-${i}`);
    const set = composeTodaySet({
      size: 25,
      reviewIncorrectIds: review,
      spacedReviewIds: [],
      newCandidates: Array.from({ length: 40 }, (_, i) => ({ id: `new-${i}`, weight: 1 })),
      random,
    });
    expect(set.mixLine).toBe("8 to review · 17 new");
    expect(set.ids).toHaveLength(25);
  });

  it("does not claim new items when review already fills the set", () => {
    const set = composeTodaySet({
      size: 25,
      reviewIncorrectIds: Array.from({ length: 40 }, (_, i) => `miss-${i}`),
      spacedReviewIds: ["s1"],
      newCandidates: [{ id: "n1", weight: 50 }],
      random,
    });
    expect(set.reviewCount).toBe(25);
    expect(set.newCount).toBe(0);
    expect(set.mixLine).toBe("25 to review");
    expect(set.ids).not.toContain("n1");
    expect(set.ids).not.toContain("s1");
  });

  it("shortens the set instead of inventing new questions", () => {
    const set = composeTodaySet({
      size: 25,
      reviewIncorrectIds: ["r1"],
      spacedReviewIds: [],
      newCandidates: [
        { id: "n1", weight: 2 },
        { id: "n2", weight: 1 },
      ],
      random,
    });
    expect(set.ids).toEqual(["r1", "n1", "n2"]);
    expect(set.mixLine).toBe("1 to review · 2 new");
  });

  it("weights new items toward the heavier blueprint share", () => {
    const picks = new Map<string, number>();
    for (let i = 0; i < 40; i++) {
      const set = composeTodaySet({
        size: 1,
        reviewIncorrectIds: [],
        spacedReviewIds: [],
        newCandidates: [
          { id: "light", weight: 1 },
          { id: "heavy", weight: 50 },
        ],
        random: () => (i + 1) / 41,
      });
      const id = set.newIds[0] ?? "";
      picks.set(id, (picks.get(id) ?? 0) + 1);
    }
    expect(picks.get("heavy") ?? 0).toBeGreaterThan(picks.get("light") ?? 0);
  });

  it("drops ids the bank could not load before recounting", () => {
    const set = composeTodaySet({
      size: 4,
      reviewIncorrectIds: ["r1", "r2"],
      spacedReviewIds: [],
      newCandidates: [
        { id: "n1", weight: 1 },
        { id: "n2", weight: 1 },
      ],
      random,
    });
    const recounted = recountTodayMix(set, new Set(["r1", "n2"]));
    expect(recounted.ids).toEqual(["r1", "n2"]);
    expect(recounted.mixLine).toBe("1 to review · 1 new");
  });

  it("returns an empty line when nothing is available", () => {
    const set = composeTodaySet({
      size: 25,
      reviewIncorrectIds: [],
      spacedReviewIds: [],
      newCandidates: [],
    });
    expect(set.mixLine).toBeNull();
    expect(formatTodayMixLine(0, 0)).toBeNull();
  });

  it("does not mention a specific board", () => {
    expect(composeTodaySet.toString()).not.toMatch(/nclex|naplex|usmle|pance/i);
  });
});

describe("daily goal ring", () => {
  it("compares questions done today with the target and caps the stroke", () => {
    expect(dailyGoalProgress(0, 25)).toEqual({ done: 0, target: 25, met: false, ring: 0 });
    expect(dailyGoalProgress(12, 25).ring).toBeCloseTo(12 / 25);
    expect(dailyGoalProgress(25, 25).met).toBe(true);
    const over = dailyGoalProgress(32, 25);
    expect(over.done).toBe(32);
    expect(over.met).toBe(true);
    expect(over.ring).toBe(1);
  });

  it("does not treat a missing target as met", () => {
    expect(dailyGoalProgress(4, 0)).toEqual({ done: 4, target: 0, met: false, ring: 0 });
  });
});

describe("daily habit streak", () => {
  it("counts a finished set and a met target as one day", () => {
    expect(
      computeDailyHabitStreak({
        today: "2026-09-25",
        days: [
          { date: "2026-09-23", completedSet: true },
          { date: "2026-09-24", targetMet: true, completedSet: true },
          { date: "2026-09-25", completedSet: true },
        ],
      })
    ).toBe(3);
  });

  it("keeps yesterday's streak until today is missed", () => {
    expect(
      computeDailyHabitStreak({
        today: "2026-09-25",
        days: [
          { date: "2026-09-23", targetMet: true },
          { date: "2026-09-24", completedSet: true },
        ],
      })
    ).toBe(2);
  });

  it("resets after a gap and ignores future dates", () => {
    expect(
      computeDailyHabitStreak({
        today: "2026-09-25",
        days: [
          { date: "2026-09-20", completedSet: true },
          { date: "2026-09-23", completedSet: true },
          { date: "2026-09-26", completedSet: true },
        ],
      })
    ).toBe(0);
  });

  it("does not add a separate activity streak", () => {
    expect(computeDailyHabitStreak.length).toBe(1);
    expect(computeDailyHabitStreak.toString()).not.toMatch(/studyStreakDays/);
  });
});

describe("daily habit metadata", () => {
  it("stores the day in metadata without dropping the tour record", () => {
    const metadata = {
      tours: { [FIRST_LOGIN_TOUR_ID]: { status: "completed", step: 4, at: "2026-09-01T00:00:00.000Z" } },
      examTestDates: { nclex: "2026-11-03" },
    };
    const next = mergeDailyHabitDay(metadata, {
      examSlug: "aanp-fnp",
      date: "2026-09-25",
      completedSet: true,
    });
    expect(next.tours).toEqual(metadata.tours);
    expect(next.examTestDates).toEqual(metadata.examTestDates);
    expect(readDailyHabitDays(next, "aanp-fnp")).toEqual([
      { date: "2026-09-25", completedSet: true },
    ]);
    expect(readDailyHabitDays(next, "naplex")).toEqual([]);
  });

  it("ors flags on the same day instead of clearing a finished set", () => {
    const once = mergeDailyHabitDay({}, {
      examSlug: "pance",
      date: "2026-09-25",
      completedSet: true,
    });
    const twice = mergeDailyHabitDay(once, {
      examSlug: "pance",
      date: "2026-09-25",
      targetMet: true,
    });
    expect(readDailyHabitDays(twice, "pance")).toEqual([
      { date: "2026-09-25", completedSet: true, targetMet: true },
    ]);
  });
});

describe("weakest topic in a finished set", () => {
  it("picks the topic with the most misses and skips unanswered rows", () => {
    const weakest = weakestTopicFromOutcomes([
      { topicId: "cardiac", topicLabel: "Cardiac", correct: false, answered: true },
      { topicId: "cardiac", topicLabel: "Cardiac", correct: true, answered: true },
      { topicId: "renal", topicLabel: "Renal", correct: false, answered: true },
      { topicId: "renal", topicLabel: "Renal", correct: false, answered: true },
      { topicId: "neuro", topicLabel: "Neuro", correct: false, answered: false },
    ]);
    expect(weakest?.topicId).toBe("renal");
    expect(weakest?.misses).toBe(2);
  });

  it("returns nothing when the set has no misses", () => {
    expect(
      weakestTopicFromOutcomes([
        { topicId: "cardiac", topicLabel: "Cardiac", correct: true, answered: true },
      ])
    ).toBeNull();
  });
});
