import { describe, expect, it } from "vitest";
import { FIRST_LOGIN_TOUR_ID } from "@/lib/onboarding/tour-record";
import {
  FALLBACK_STUDY_TIME_ZONE,
  TODAY_REVIEW_MAX_SHARE,
  TODAY_SET_DEFAULT_SIZE,
  applyQuestionAllowance,
  calendarDateKey,
  composeTodaySet,
  computeDailyHabitStreak,
  dailyGoalProgress,
  fitTodayComposition,
  formatTodayMixLine,
  mergeDailyHabitDay,
  mergeStoredTodaySet,
  priorTodaySetIds,
  questionAllowanceFromUsage,
  readDailyHabitDays,
  readStoredTodaySetForDate,
  recountTodayMix,
  resolveStudyTimeZone,
  resolveTodaySetSize,
  todayReviewSlotCap,
  todaySetRandom,
  todayUnseenNeeded,
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

  it("keeps the review share at 60 percent so a long miss list still includes new questions", () => {
    expect(TODAY_REVIEW_MAX_SHARE).toBe(0.6);
    expect(todayReviewSlotCap(TODAY_SET_DEFAULT_SIZE)).toBe(15);
    expect(todayUnseenNeeded(25, 41)).toBe(10);

    const open = Array.from({ length: 41 }, (_, i) => `miss-${i}`);
    const set = composeTodaySet({
      size: resolveTodaySetSize(null),
      reviewIncorrectIds: open,
      spacedReviewIds: ["spaced-1", "spaced-2"],
      newCandidates: Array.from({ length: 30 }, (_, i) => ({ id: `new-${i}`, weight: 1 })),
      random,
    });

    expect(set.reviewCount).toBe(15);
    expect(set.newCount).toBe(10);
    expect(set.mixLine).toBe("15 to review · 10 new");
    expect(set.ids).toHaveLength(25);
    expect(set.reviewIncorrectIds).toEqual(open.slice(0, 15));
    expect(set.spacedReviewIds).toEqual([]);
    expect(set.newIds).toEqual(Array.from({ length: 10 }, (_, i) => `new-${i}`));
    expect(formatTodayMixLine(set.reviewCount, set.newCount)).toBe(set.mixLine);
  });

  it("uses only the open items that exist when the backlog is small", () => {
    const set = composeTodaySet({
      size: 25,
      reviewIncorrectIds: ["miss-0"],
      spacedReviewIds: [],
      newCandidates: Array.from({ length: 40 }, (_, i) => ({ id: `new-${i}`, weight: 1 })),
      random,
    });
    expect(todayUnseenNeeded(25, 1)).toBe(24);
    expect(set.reviewCount).toBe(1);
    expect(set.newCount).toBe(24);
    expect(set.mixLine).toBe("1 to review · 24 new");
    expect(set.ids).toHaveLength(25);
    expect(set.ids[0]).toBe("miss-0");
  });

  it("backfills empty new slots with more review, open remediation before spaced review", () => {
    const open = Array.from({ length: 18 }, (_, i) => `miss-${i}`);
    const spaced = Array.from({ length: 10 }, (_, i) => `spaced-${i}`);
    const set = composeTodaySet({
      size: 25,
      reviewIncorrectIds: open,
      spacedReviewIds: spaced,
      newCandidates: Array.from({ length: 3 }, (_, i) => ({ id: `new-${i}`, weight: 1 })),
      random,
    });
    expect(set.ids).toHaveLength(25);
    expect(set.reviewIncorrectIds).toEqual(open);
    expect(set.spacedReviewIds).toEqual(spaced.slice(0, 4));
    expect(set.newIds).toEqual(["new-0", "new-1", "new-2"]);
    expect(set.reviewCount).toBe(22);
    expect(set.newCount).toBe(3);
    expect(set.mixLine).toBe("22 to review · 3 new");
    expect(set.ids.slice(0, 22)).toEqual([...open, ...spaced.slice(0, 4)]);
  });

  it("fills from review when no new questions are available", () => {
    const set = composeTodaySet({
      size: 25,
      reviewIncorrectIds: Array.from({ length: 41 }, (_, i) => `miss-${i}`),
      spacedReviewIds: ["s1"],
      newCandidates: [],
      random,
    });
    expect(set.reviewCount).toBe(25);
    expect(set.newCount).toBe(0);
    expect(set.mixLine).toBe("25 to review");
    expect(set.ids).toHaveLength(25);
    expect(set.ids).not.toContain("s1");
  });

  it("applies the same share to a custom set size", () => {
    const size = resolveTodaySetSize({ dailyGoal: 10 });
    const set = composeTodaySet({
      size,
      reviewIncorrectIds: Array.from({ length: 41 }, (_, i) => `miss-${i}`),
      spacedReviewIds: ["s1"],
      newCandidates: Array.from({ length: 20 }, (_, i) => ({ id: `new-${i}`, weight: 1 })),
      random,
    });
    expect(size).toBe(10);
    expect(todayReviewSlotCap(size)).toBe(6);
    expect(todayUnseenNeeded(size, 41)).toBe(4);
    expect(set.reviewCount).toBe(6);
    expect(set.newCount).toBe(4);
    expect(set.mixLine).toBe("6 to review · 4 new");
    expect(set.ids).toHaveLength(10);
    expect(set.spacedReviewIds).toEqual([]);
  });

  it("keeps the same mix when the day is composed again and does not refill on recount", () => {
    const input = {
      size: 25,
      reviewIncorrectIds: Array.from({ length: 41 }, (_, i) => `miss-${i}`),
      spacedReviewIds: ["s1"],
      newCandidates: [
        { id: "light", weight: 1 },
        { id: "heavy", weight: 9 },
        ...Array.from({ length: 20 }, (_, i) => ({ id: `new-${i}`, weight: 2 })),
      ],
    };
    const seed = ["student", "nursing", "2026-09-25"] as const;
    const first = composeTodaySet({ ...input, random: todaySetRandom(seed) });
    const second = composeTodaySet({ ...input, random: todaySetRandom(seed) });
    expect(second).toEqual(first);
    expect(first.mixLine).toBe("15 to review · 10 new");

    const dropped = first.newIds[0];
    expect(dropped).toBeTruthy();
    const recounted = recountTodayMix(
      first,
      new Set(first.ids.filter((id) => id !== dropped))
    );
    expect(recounted.reviewCount).toBe(15);
    expect(recounted.newCount).toBe(9);
    expect(recounted.mixLine).toBe("15 to review · 9 new");
    expect(recounted.ids).toHaveLength(24);
    expect(recounted.ids).not.toContain(dropped);
    expect(formatTodayMixLine(recounted.reviewCount, recounted.newCount)).toBe(recounted.mixLine);
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

  it("spreads new questions across topics instead of the lowest ids", () => {
    const set = composeTodaySet({
      size: 6,
      reviewIncorrectIds: [],
      spacedReviewIds: [],
      newCandidates: [
        ...Array.from({ length: 8 }, (_, i) => ({ id: `a-${i}`, weight: 1, topicKey: "alpha" })),
        ...Array.from({ length: 8 }, (_, i) => ({ id: `b-${i}`, weight: 1, topicKey: "beta" })),
        ...Array.from({ length: 8 }, (_, i) => ({ id: `c-${i}`, weight: 1, topicKey: "gamma" })),
      ],
      random: () => 0,
    });
    expect(set.newIds).toHaveLength(6);
    expect(new Set(set.newIds.map((id) => id[0])).size).toBe(3);
    expect(set.newIds.filter((id) => id.startsWith("a-")).length).toBeLessThan(6);
  });

  it("rotates due review and holds back new items already shown", () => {
    const open = Array.from({ length: 40 }, (_, i) => `miss-${i}`);
    const fresh = Array.from({ length: 30 }, (_, i) => ({
      id: `new-${i}`,
      weight: 1,
      topicKey: ["alpha", "beta", "gamma"][i % 3],
    }));
    const input = {
      size: 25,
      reviewIncorrectIds: open,
      spacedReviewIds: ["spaced-0"],
      newCandidates: fresh,
    };
    const day1 = composeTodaySet({
      ...input,
      random: todaySetRandom(["student", "nursing", "2026-09-27"]),
      reviewCycle: { date: "2026-09-27", salt: 0 },
    });
    const again = composeTodaySet({
      ...input,
      random: todaySetRandom(["student", "nursing", "2026-09-27"]),
      reviewCycle: { date: "2026-09-27", salt: 0 },
    });
    const shown = new Set(day1.newIds);
    const day2 = composeTodaySet({
      ...input,
      newCandidates: fresh.map((row) => ({ ...row, previouslyShown: shown.has(row.id) })),
      avoidReviewIds: day1.reviewIncorrectIds,
      random: todaySetRandom(["student", "nursing", "2026-09-28"]),
      reviewCycle: { date: "2026-09-28", salt: 0 },
    });

    expect(again).toEqual(day1);
    expect(day1.reviewCount).toBe(15);
    expect(day1.newCount).toBe(10);
    expect(day1.mixLine).toBe("15 to review · 10 new");
    expect(day2.reviewCount).toBe(15);
    expect(day2.newCount).toBe(10);
    expect(day2.mixLine).toBe(day1.mixLine);
    expect(day2.ids).not.toEqual(day1.ids);
    expect(day2.newIds.filter((id) => shown.has(id))).toEqual([]);
    expect(day2.reviewIncorrectIds.filter((id) => day1.reviewIncorrectIds.includes(id))).toEqual([]);
    expect(new Set(day1.newIds.map((id) => Number(id.slice(4)) % 3)).size).toBeGreaterThan(1);
  });

  it("uses previously shown new items only after the unseen pool runs out", () => {
    const set = composeTodaySet({
      size: 4,
      reviewIncorrectIds: [],
      spacedReviewIds: [],
      newCandidates: [
        { id: "fresh-1", weight: 1, topicKey: "alpha" },
        { id: "old-1", weight: 9, previouslyShown: true, topicKey: "beta" },
        { id: "old-2", weight: 9, previouslyShown: true, topicKey: "gamma" },
        { id: "old-3", weight: 9, previouslyShown: true, topicKey: "delta" },
      ],
      random: () => 0,
    });
    expect(set.newIds[0]).toBe("fresh-1");
    expect(set.newCount).toBe(4);
    expect(set.newIds).toContain("old-1");
    expect(set.mixLine).toBe("4 new");
  });

  it("fits a smaller sitting from the same ids and keeps the review cap", () => {
    const full = composeTodaySet({
      size: 25,
      reviewIncorrectIds: Array.from({ length: 41 }, (_, i) => `miss-${i}`),
      spacedReviewIds: [],
      newCandidates: Array.from({ length: 20 }, (_, i) => ({ id: `new-${i}`, weight: 1 })),
      random: () => 0,
    });
    const fitted = fitTodayComposition(full, 10);
    expect(fitted.reviewCount).toBe(6);
    expect(fitted.newCount).toBe(4);
    expect(fitted.mixLine).toBe("6 to review · 4 new");
    expect(fitted.ids.every((id) => full.ids.includes(id))).toBe(true);
    expect(fitTodayComposition(full, 25).ids).toEqual(full.ids);
  });
});

describe("study calendar day", () => {
  it("uses the student zone and falls back to Chicago", () => {
    expect(FALLBACK_STUDY_TIME_ZONE).toBe("America/Chicago");
    expect(resolveStudyTimeZone(null)).toBe("America/Chicago");
    expect(resolveStudyTimeZone("Not/AZone")).toBe("America/Chicago");
    expect(resolveStudyTimeZone("America/New_York")).toBe("America/New_York");
    expect(calendarDateKey(new Date("2026-09-28T02:30:00.000Z"), "America/Chicago")).toBe(
      "2026-09-27"
    );
    expect(calendarDateKey(new Date("2026-09-28T05:30:00.000Z"), "America/Chicago")).toBe(
      "2026-09-28"
    );
    expect(calendarDateKey(new Date("2026-09-28T02:30:00.000Z"), "UTC")).toBe("2026-09-28");
  });
});

describe("stored today set", () => {
  it("keeps the tour record and remembers yesterday's ids", () => {
    const metadata = {
      tours: { [FIRST_LOGIN_TOUR_ID]: { status: "completed", step: 4, at: "2026-09-01T00:00:00.000Z" } },
    };
    const saved = mergeStoredTodaySet(metadata, "nursing", {
      date: "2026-09-27",
      timeZone: "America/Chicago",
      requestedSize: 25,
      reviewIncorrectIds: ["miss-0"],
      spacedReviewIds: [],
      newIds: ["new-0", "new-1"],
    });
    expect(saved.tours).toEqual(metadata.tours);
    expect(readStoredTodaySetForDate(saved, "nursing", "2026-09-27")?.newIds).toEqual([
      "new-0",
      "new-1",
    ]);
    expect(priorTodaySetIds(saved, "nursing", "2026-09-28").newIds).toEqual(["new-0", "new-1"]);
    expect(priorTodaySetIds(saved, "nursing", "2026-09-27").newIds).toEqual([]);
    expect(priorTodaySetIds(saved, "pharmacy", "2026-09-28").newIds).toEqual([]);
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
