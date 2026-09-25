import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  invalidateTodayServedCache,
  loadServedTodaySet,
  loadTodaySetPreview,
} from "@/lib/learning/today-set-plan";

const state = vi.hoisted(() => ({
  windowCall: 0,
  /** First id page is another field, so a one-window read would backfill all review. */
  shortWindow: false,
  dropFirstNew: false,
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
  loadBankItemsByIds: vi.fn(async (_field: string, ids: string[]) => {
    const fresh = ids.filter((id) => id.startsWith("new-"));
    const drop = state.dropFirstNew ? fresh[0] : undefined;
    return ids.filter((id) => id && id !== drop).map((id) => ({ id }));
  }),
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
    },
    questionMastery: {
      findMany: vi.fn(async () => []),
    },
    questionAttempt: {
      findMany: vi.fn(async () => openIds.map((bankItemId) => ({ bankItemId }))),
    },
    questionBankItem: {
      count: vi.fn(async () => {
        state.windowCall = 0;
        return state.shortWindow ? 600 : newIds.length;
      }),
      findMany: vi.fn(async (args: { where?: { id?: { in?: string[] } }; take?: number }) => {
        const ids = args.where?.id?.in;
        if (ids) return ids.map((id) => bankRow(id, "nursing"));
        state.windowCall += 1;
        if (state.shortWindow && state.windowCall === 1) {
          return Array.from({ length: 500 }, (_, i) => bankRow(`other-${i}`, "dentistry"));
        }
        return newIds.map((id) => bankRow(id, "nursing"));
      }),
    },
  },
}));

const now = new Date("2026-09-25T18:07:00.000Z");

async function dashboardAndServed() {
  const preview = await loadTodaySetPreview({
    userId: "student",
    examSlug: "nclex",
    fieldId: "nursing",
    questionsDone: 0,
    now,
  });
  const served = await loadServedTodaySet({
    userId: "student",
    examSlug: "nclex",
    fieldId: "nursing",
    size: 25,
    now,
  });
  return { preview, served };
}

describe("dashboard mix line and the served set", () => {
  beforeEach(async () => {
    state.windowCall = 0;
    state.shortWindow = false;
    state.dropFirstNew = false;
    await invalidateTodayServedCache("student", "nursing", now);
  });

  it("shows the same 15 review and 10 new line the session serves for 41 open misses", async () => {
    const { preview, served } = await dashboardAndServed();

    expect(preview.mixLine).toBe("15 to review · 10 new");
    expect(preview.mixLine).toBe(served.mix.mixLine);
    expect(preview.reviewCount).toBe(served.mix.reviewCount);
    expect(preview.newCount).toBe(served.mix.newCount);
    expect(preview.reviewCount).toBe(15);
    expect(preview.newCount).toBe(10);
    expect(served.mix.ids).toHaveLength(25);
    expect(served.items.map((item) => item.id)).toEqual(served.mix.ids);
  });

  it("still matches after a bank id drops out of the sitting", async () => {
    state.dropFirstNew = true;
    const { preview, served } = await dashboardAndServed();

    expect(preview.mixLine).toBe(served.mix.mixLine);
    expect(preview.mixLine).toBe("15 to review · 9 new");
    expect(preview.reviewCount).toBe(15);
    expect(preview.newCount).toBe(9);
  });

  it("reuses the served composition for the same student, board, and day", async () => {
    const findMany = prisma.questionBankItem.findMany as unknown as { mock: { calls: unknown[] } };
    const first = await loadServedTodaySet({
      userId: "student",
      examSlug: "nclex",
      fieldId: "nursing",
      size: 25,
      now,
    });
    const reads = findMany.mock.calls.length;
    const second = await loadServedTodaySet({
      userId: "student",
      examSlug: "nclex",
      fieldId: "nursing",
      size: 25,
      now,
    });

    expect(second.mix.ids).toEqual(first.mix.ids);
    expect(second.mix.mixLine).toBe(first.mix.mixLine);
    expect(second.mix.mixLine).toBe("15 to review · 10 new");
    expect(findMany.mock.calls.length).toBe(reads);

    await invalidateTodayServedCache("student", "nursing", now);
    await loadServedTodaySet({
      userId: "student",
      examSlug: "nclex",
      fieldId: "nursing",
      size: 25,
      now,
    });
    expect(findMany.mock.calls.length).toBeGreaterThan(reads);
  });

  it("does not turn a missed id window into an all-review line when new questions exist", async () => {
    state.shortWindow = true;
    const { preview, served } = await dashboardAndServed();

    expect(preview.mixLine).toBe("15 to review · 10 new");
    expect(preview.mixLine).toBe(served.mix.mixLine);
    expect(served.mix.newCount).toBe(10);
  });
});
