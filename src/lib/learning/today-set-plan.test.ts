import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { resetSharedDailyPackCache } from "@/lib/learning/daily-pack-serve";
import {
  invalidateTodayServedCache,
  loadReviewMissesSet,
  loadServedTodaySet,
  loadTodaySetPreview,
} from "@/lib/learning/today-set-plan";

const state = vi.hoisted(() => ({
  foreignOnly: false,
  dropRetired: false,
}));

const openIds = Array.from({ length: 41 }, (_, i) => `miss-${i}`);
const newIds = Array.from({ length: 40 }, (_, i) => `new-${i}`);

vi.mock("@/lib/exam-prep/student-eligibility", () => ({
  ineligibleServedIds: vi.fn(async () => []),
}));

vi.mock("@/lib/learning/review-incorrect", () => ({
  loadStillIncorrectBankItemIds: vi.fn(async () => openIds),
  loadServableReviewBankIds: vi.fn(async (_field: string, ids: string[]) => new Set(ids)),
}));

vi.mock("@/lib/full-exam/load-bank-items-by-ids", () => ({
  loadBankItemsByIds: vi.fn(async (_field: string, ids: string[]) =>
    ids.filter((id) => !(state.dropRetired && id === "new-0")).map((id) => ({ id }))
  ),
}));

function bankRow(id: string, fieldId: string) {
  return {
    id,
    subjectId: "management-of-care",
    topicCategory: null,
    blueprintDomain: null,
    fieldId,
    stepLevel: null,
  };
}

vi.mock("@/lib/prisma", () => ({
  prisma: {
    userPreference: {
      findUnique: vi.fn(async () => ({ metadata: null })),
      upsert: vi.fn(async () => ({})),
    },
    questionMastery: {
      findMany: vi.fn(async () => []),
    },
    questionAttempt: {
      findMany: vi.fn(async () => openIds.map((bankItemId) => ({ bankItemId }))),
    },
    questionBankItem: {
      count: vi.fn(async () => newIds.length),
      findMany: vi.fn(async (args: { where?: { id?: { in?: string[] } } }) => {
        const ids = args.where?.id?.in;
        if (ids) return ids.map((id) => bankRow(id, "nursing"));
        if (state.foreignOnly) return [bankRow("other-1", "dentistry")];
        return newIds.map((id) => bankRow(id, "nursing"));
      }),
    },
  },
}));

const now = new Date("2026-09-25T18:07:00.000Z");
/** Even Chicago day index, so the first slice includes new-0. */
const evenDay = new Date("2026-09-26T18:00:00.000Z");

async function dashboardAndServed(at = now) {
  const preview = await loadTodaySetPreview({
    userId: "student",
    examSlug: "nclex",
    fieldId: "nursing",
    questionsDone: 0,
    now: at,
  });
  const served = await loadServedTodaySet({
    userId: "student",
    examSlug: "nclex",
    fieldId: "nursing",
    size: 25,
    now: at,
  });
  return { preview, served };
}

describe("dashboard mix line and the served set", () => {
  beforeEach(async () => {
    state.foreignOnly = false;
    state.dropRetired = false;
    resetSharedDailyPackCache();
    await invalidateTodayServedCache("student", "nursing", now);
  });

  it("serves the shared pack of 20 and leaves misses out of it", async () => {
    const { preview, served } = await dashboardAndServed();
    const review = await loadReviewMissesSet({
      userId: "student",
      examSlug: "nclex",
      fieldId: "nursing",
      size: 20,
      now,
    });

    expect(preview.mixLine).toBe("20 questions");
    expect(preview.mixLine).toBe(served.mix.mixLine);
    expect(preview.target).toBe(20);
    expect(preview.reviewCount).toBe(0);
    expect(preview.newCount).toBe(20);
    expect(served.mix.ids).toHaveLength(20);
    expect(served.mix.ids.every((id) => id.startsWith("new-"))).toBe(true);
    expect(served.items.map((item) => item.id)).toEqual(served.mix.ids);
    expect(review.mix.mixLine).toBe("20 to review");
    expect(review.mix.ids).toHaveLength(20);
    expect(review.mix.newCount).toBe(0);
    expect(review.mix.ids.every((id) => id.startsWith("miss-"))).toBe(true);
    expect(review.mix.ids.filter((id) => served.mix.ids.includes(id))).toEqual([]);
  });

  it("replaces a retired id and keeps the pack full", async () => {
    state.dropRetired = true;
    const { preview, served } = await dashboardAndServed(evenDay);

    expect(served.mix.ids).toHaveLength(20);
    expect(served.mix.ids).not.toContain("new-0");
    expect(preview.mixLine).toBe(served.mix.mixLine);
    expect(preview.mixLine).toBe("20 questions");
  });

  it("reuses the shared pack after a per-student cache drop", async () => {
    const findMany = prisma.questionBankItem.findMany as unknown as {
      mock: { calls: { 0?: { where?: { id?: { in?: string[] } } } }[] };
    };
    const sequenceReads = () =>
      findMany.mock.calls.filter((call) => !call[0]?.where?.id?.in).length;

    const first = await loadServedTodaySet({
      userId: "student",
      examSlug: "nclex",
      fieldId: "nursing",
      size: 25,
      now,
    });
    const reads = sequenceReads();
    const second = await loadServedTodaySet({
      userId: "student",
      examSlug: "nclex",
      fieldId: "nursing",
      size: 25,
      now,
    });

    expect(second.mix.ids).toEqual(first.mix.ids);
    expect(second.mix.mixLine).toBe("20 questions");
    expect(sequenceReads()).toBe(reads);

    await invalidateTodayServedCache("student", "nursing", now);
    const third = await loadServedTodaySet({
      userId: "student",
      examSlug: "nclex",
      fieldId: "nursing",
      size: 25,
      now,
    });
    expect(third.mix.ids).toEqual(first.mix.ids);
    expect(sequenceReads()).toBe(reads);
  });

  it("does not serve another field when that is all the query returns", async () => {
    state.foreignOnly = true;
    const { preview, served } = await dashboardAndServed();

    expect(preview.mixLine).toBeNull();
    expect(preview.empty).toBe(true);
    expect(served.mix.ids).toEqual([]);
    expect(served.items).toEqual([]);
  });
});
