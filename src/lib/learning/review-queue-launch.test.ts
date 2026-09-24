import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  attemptsForReviewIds,
  reviewFieldIdsForQuery,
  selectLaunchReviewQueueIds,
} from "./review-queue-launch";

const t0 = Date.parse("2026-09-23T15:00:00.000Z");

/**
 * One saved miss on a non-NCLEX-shaped topic. The fixture names pharmacy
 * subjects only as data; the selector has no board branch.
 */
const naplexMiss = {
  bankItemId: "item-metformin",
  questionKey: "item-metformin",
  correct: false,
  createdAt: t0,
  sessionId: "today-1",
  subjectId: "endocrine-rx",
};

describe("review incorrect launch eligibility", () => {
  it("makes the dashboard count and the queue agree for one servable miss", () => {
    const servableIds = new Set(["item-metformin"]);
    const dashboardIds = selectLaunchReviewQueueIds({
      attempts: [naplexMiss],
      servableIds,
    });
    const mixedQueue = selectLaunchReviewQueueIds({
      attempts: [naplexMiss],
      subjectId: "__mixed__",
      servableIds,
    });
    const literalMixedQueue = selectLaunchReviewQueueIds({
      attempts: [naplexMiss],
      subjectId: "mixed",
      servableIds,
    });
    const otherTopicQueue = selectLaunchReviewQueueIds({
      attempts: [naplexMiss],
      subjectId: "pharmacokinetics",
      servableIds,
    });

    expect(dashboardIds.length).toBeGreaterThanOrEqual(1);
    expect(mixedQueue).toEqual(dashboardIds);
    expect(literalMixedQueue).toEqual(dashboardIds);
    expect(otherTopicQueue).toEqual(dashboardIds);
    expect(otherTopicQueue).toEqual(["item-metformin"]);
    expect(servableIds.has(otherTopicQueue[0]!)).toBe(true);
    expect(attemptsForReviewIds([naplexMiss], dashboardIds)).toEqual([naplexMiss]);
  });

  it("keeps a scoped topic that already has a servable miss", () => {
    const attempts = [
      {
        bankItemId: "item-care",
        correct: false,
        createdAt: t0,
        sessionId: "s1",
        subjectId: "management-of-care",
      },
      {
        bankItemId: "item-pharm",
        correct: false,
        createdAt: t0 + 1,
        sessionId: "s1",
        subjectId: "pharmacological-therapies",
      },
    ];
    const servableIds = new Set(["item-care", "item-pharm"]);
    const scoped = selectLaunchReviewQueueIds({
      attempts,
      subjectId: "management-of-care",
      servableIds,
    });
    expect(scoped).toEqual(["item-care"]);
    expect(selectLaunchReviewQueueIds({ attempts, servableIds }).sort()).toEqual([
      "item-care",
      "item-pharm",
    ]);
  });

  it("drops ids that are not in the servable inventory, including ephemeral keys", () => {
    const attempts = [
      naplexMiss,
      {
        bankItemId: "bank-pharmacy-0",
        questionKey: "bank-pharmacy-0",
        correct: false,
        createdAt: t0 + 1,
        subjectId: "endocrine-rx",
      },
      {
        bankItemId: null,
        questionKey: "12",
        correct: false,
        createdAt: t0 + 2,
        subjectId: "endocrine-rx",
      },
    ];
    const ids = selectLaunchReviewQueueIds({
      attempts,
      subjectId: "pharmacokinetics",
      servableIds: new Set(["item-metformin"]),
    });
    expect(ids).toEqual(["item-metformin"]);
  });

  it("keeps a cardiovascular miss when the launcher topic is pharmacokinetics", () => {
    const bankItemId = "cmqvjpyri000i1yaidxytujtb";
    const attempt = {
      bankItemId,
      questionKey: bankItemId,
      correct: false,
      createdAt: t0,
      sessionId: "naplex-today",
      subjectId: "cardiovascular-rx",
    };
    const servableIds = new Set([bankItemId]);
    const dashboardIds = selectLaunchReviewQueueIds({ attempts: [attempt], servableIds });
    const launcherTopicQueue = selectLaunchReviewQueueIds({
      attempts: [attempt],
      subjectId: "pharmacokinetics",
      servableIds,
    });
    expect(dashboardIds).toEqual([bankItemId]);
    expect(launcherTopicQueue).toEqual(dashboardIds);
    expect(servableIds.has(launcherTopicQueue[0]!)).toBe(true);
    expect(attemptsForReviewIds([attempt], dashboardIds)).toEqual([attempt]);
  });

  it("treats the NAPLEX label and naplex slug as the pharmacy attempt field", () => {
    for (const requested of ["NAPLEX", "naplex", "pharmacy"]) {
      const fields = reviewFieldIdsForQuery(requested);
      expect(fields).toContain("pharmacy");
      expect(fields).toContain("naplex");
    }
    expect(reviewFieldIdsForQuery("NAPLEX")).toContain("NAPLEX");
    expect(reviewFieldIdsForQuery("NCLEX")).toContain("nursing");
    expect(reviewFieldIdsForQuery("NCLEX")).not.toContain("pharmacy");
    expect(reviewFieldIdsForQuery("PANCE")).not.toContain("mpje");
  });

  it("counts one saved miss the same way for NCLEX, NAPLEX, and USMLE alias shapes", () => {
    const shapes = [
      { requested: "nursing", stored: "nclex" },
      { requested: "NCLEX", stored: "nclex-rn" },
      { requested: "pharmacy", stored: "naplex" },
      { requested: "NAPLEX", stored: "pharmacy" },
      { requested: "usmle-step-1", stored: "usmle-step-1" },
      { requested: "USMLE Step 1", stored: "usmle-step1" },
      { requested: "usmle-step-2", stored: "medicine" },
      { requested: "usmle", stored: "usmle" },
    ];

    for (const shape of shapes) {
      const attempt = {
        fieldId: shape.stored,
        bankItemId: "item-1",
        questionKey: "item-1",
        correct: false,
        createdAt: t0,
        subjectId: "pathology",
      };
      const visible = reviewFieldIdsForQuery(shape.requested).includes(shape.stored)
        ? [attempt]
        : [];
      const queue = selectLaunchReviewQueueIds({
        attempts: visible,
        servableIds: new Set(["item-1"]),
      });
      const analyticsAttempts = visible.length;
      const dashboardOpen = queue.length;
      expect(reviewFieldIdsForQuery(shape.requested)).toContain(shape.stored);
      expect(dashboardOpen).toBe(1);
      expect(queue).toHaveLength(1);
      expect(analyticsAttempts).toBe(dashboardOpen);
    }

    // Catalog USMLE is Step 2. A Step 1 miss must not be counted there.
    expect(reviewFieldIdsForQuery("usmle-step-2")).not.toContain("usmle-step-1");
    expect(reviewFieldIdsForQuery("usmle-step-1")).toContain("usmle-step1");
    expect(reviewFieldIdsForQuery("usmle-step-1")).not.toContain("medicine");
    expect(reviewFieldIdsForQuery("PANCE")).not.toContain("mpje");
  });

  it("is the selector the dashboard roadmap and the review loader both call", () => {
    const roadmap = readFileSync(new URL("./exam-roadmap.ts", import.meta.url), "utf8");
    const loader = readFileSync(new URL("./review-incorrect.ts", import.meta.url), "utf8");
    const page = readFileSync(new URL("../../app/(app)/question-bank/page.tsx", import.meta.url), "utf8");
    expect(roadmap).toContain("selectLaunchReviewQueueIds");
    expect(roadmap).toContain("reviewFieldIdsForQuery");
    expect(roadmap).toContain("attemptsForReviewIds");
    expect(loader).toContain("selectLaunchReviewQueueIds");
    expect(loader).toContain("reviewFieldIdsForQuery");
    expect(loader).toContain("loadServableReviewBankIds");
    expect(page).toContain("subjectId: null");
    expect(selectLaunchReviewQueueIds.toString()).not.toMatch(/naplex|nclex/i);

    const analytics = readFileSync(
      new URL("../../app/(app)/analytics/page.tsx", import.meta.url),
      "utf8"
    );
    const stats = readFileSync(new URL("../edtech/stats.ts", import.meta.url), "utf8");
    const dashboardData = readFileSync(new URL("./student-dashboard.ts", import.meta.url), "utf8");
    expect(analytics).toContain("canonicalPracticeFieldId");
    expect(analytics).not.toContain("resolveExamFieldId");
    expect(stats).toContain("reviewFieldIdsForQuery");
    expect(dashboardData).toContain("expandReviewFieldIds");
    expect(roadmap).toContain("skipFreshL1");
  });
});
