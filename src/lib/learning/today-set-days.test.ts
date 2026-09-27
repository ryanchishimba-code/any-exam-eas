import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  invalidateTodayServedCache,
  loadServedTodaySet,
  loadTodaySetPreview,
} from "@/lib/learning/today-set-plan";

/**
 * NCLEX (nursing) and NAPLEX (pharmacy) banks for one student.
 * Lowest ids are a single topic, plus one hidden row that must never be served.
 */
const TOPICS = ["cardiac", "renal", "neuro"] as const;

type FreshRow = {
  id: string;
  subjectId: string;
  topicCategory: null;
  blueprintDomain: null;
  fieldId: string;
  stepLevel: null;
  hidden?: boolean;
};

function freshBank(prefix: string, fieldId: string): FreshRow[] {
  const rows: FreshRow[] = [
    {
      id: `${prefix}-000-hidden`,
      subjectId: "cardiac",
      topicCategory: null,
      blueprintDomain: null,
      fieldId,
      stepLevel: null,
      hidden: true,
    },
  ];
  for (const [topicIndex, topic] of TOPICS.entries()) {
    const letter = ["a", "b", "c"][topicIndex]!;
    for (let i = 0; i < 12; i++) {
      rows.push({
        id: `${prefix}-${letter}-${String(i).padStart(2, "0")}`,
        subjectId: topic,
        topicCategory: null,
        blueprintDomain: null,
        fieldId,
        stepLevel: null,
      });
    }
  }
  return rows.sort((a, b) => a.id.localeCompare(b.id));
}

const BOARDS = [
  {
    label: "NCLEX",
    examSlug: "nclex" as const,
    fieldId: "nursing",
    review: Array.from({ length: 40 }, (_, i) => `nclex-miss-${String(i).padStart(2, "0")}`),
    spaced: ["nclex-spaced-0", "nclex-spaced-1"],
    hiddenId: "nclex-000-hidden",
    fresh: freshBank("nclex", "nursing"),
  },
  {
    label: "NAPLEX",
    examSlug: "naplex" as const,
    fieldId: "pharmacy",
    review: Array.from({ length: 40 }, (_, i) => `naplex-miss-${String(i).padStart(2, "0")}`),
    spaced: ["naplex-spaced-0", "naplex-spaced-1"],
    hiddenId: "naplex-000-hidden",
    fresh: freshBank("naplex", "pharmacy"),
  },
];

const state = vi.hoisted(() => ({
  fieldId: "nursing",
  metadata: null as string | null,
  open: {} as Record<string, string[]>,
  seen: {} as Record<string, string[]>,
}));

function boardByField(fieldId: string) {
  const board = BOARDS.find((item) => item.fieldId === fieldId);
  if (!board) throw new Error(`missing fixture ${fieldId}`);
  return board;
}

vi.mock("@/lib/exam-prep/student-eligibility", () => ({
  ineligibleServedIds: vi.fn(async () => [boardByField(state.fieldId).hiddenId]),
}));

vi.mock("@/lib/learning/review-incorrect", () => ({
  loadStillIncorrectBankItemIds: vi.fn(async () => state.open[state.fieldId] ?? []),
  loadServableReviewBankIds: vi.fn(async (_field: string, ids: string[]) => {
    const hidden = boardByField(state.fieldId).hiddenId;
    return new Set(ids.filter((id) => id !== hidden));
  }),
}));

vi.mock("@/lib/full-exam/load-bank-items-by-ids", () => ({
  loadBankItemsByIds: vi.fn(async (fieldId: string, ids: string[]) => {
    const hidden = boardByField(fieldId).hiddenId;
    return ids.filter((id) => id && id !== hidden).map((id) => ({ id }));
  }),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    userPreference: {
      findUnique: vi.fn(async () => ({ metadata: state.metadata })),
      upsert: vi.fn(async (args: { create?: { metadata?: string }; update?: { metadata?: string } }) => {
        state.metadata = args.update?.metadata ?? args.create?.metadata ?? state.metadata;
        return { metadata: state.metadata };
      }),
    },
    questionMastery: {
      findMany: vi.fn(async () =>
        boardByField(state.fieldId).spaced.map((questionKey) => ({ questionKey }))
      ),
    },
    questionAttempt: {
      findMany: vi.fn(async () =>
        (state.seen[state.fieldId] ?? []).map((bankItemId) => ({ bankItemId }))
      ),
    },
    questionBankItem: {
      count: vi.fn(async (args?: { where?: { id?: { notIn?: string[] } } }) => {
        const blocked = new Set(args?.where?.id?.notIn ?? []);
        return boardByField(state.fieldId).fresh.filter((row) => !row.hidden && !blocked.has(row.id))
          .length;
      }),
      findMany: vi.fn(async (args?: {
        where?: { id?: { in?: string[]; notIn?: string[] } };
        skip?: number;
        take?: number;
      }) => {
        const board = boardByField(state.fieldId);
        const ids = args?.where?.id?.in;
        if (ids) {
          const byId = new Map(board.fresh.map((row) => [row.id, row]));
          return ids.map((id) => byId.get(id)).filter((row): row is FreshRow => Boolean(row));
        }
        const blocked = new Set(args?.where?.id?.notIn ?? []);
        const rows = board.fresh.filter((row) => !row.hidden && !blocked.has(row.id));
        const skip = args?.skip ?? 0;
        const take = args?.take ?? rows.length;
        return rows.slice(skip, skip + take);
      }),
    },
  },
}));

const USER = "student-days";
const DAY_1 = new Date("2026-09-27T18:00:00.000Z");
/** Next UTC day, still the same Chicago calendar day. */
const STILL_DAY_1 = new Date("2026-09-28T02:30:00.000Z");
const DAY_2 = new Date("2026-09-28T18:00:00.000Z");
const ZONE = "America/Chicago";

describe("consecutive local days for one student", () => {
  beforeEach(async () => {
    state.metadata = null;
    state.open = {};
    state.seen = {};
    state.fieldId = "nursing";
    await invalidateTodayServedCache(USER, "nursing", DAY_1);
    await invalidateTodayServedCache(USER, "pharmacy", DAY_1);
  });

  for (const board of BOARDS) {
    it(`gives ${board.label} a new capped set on the next Chicago day`, async () => {
      state.fieldId = board.fieldId;
      state.open[board.fieldId] = [board.hiddenId, ...board.review];
      state.seen[board.fieldId] = [];

      const first = await loadServedTodaySet({
        userId: USER,
        examSlug: board.examSlug,
        fieldId: board.fieldId,
        size: 25,
        now: DAY_1,
        timeZone: ZONE,
      });
      const preview = await loadTodaySetPreview({
        userId: USER,
        examSlug: board.examSlug,
        fieldId: board.fieldId,
        questionsDone: 0,
        now: DAY_1,
        timeZone: ZONE,
      });

      expect(first.mix.ids).toHaveLength(25);
      expect(first.mix.reviewCount).toBe(15);
      expect(first.mix.newCount).toBe(10);
      expect(first.mix.mixLine).toBe("15 to review · 10 new");
      expect(preview.mixLine).toBe(first.mix.mixLine);
      expect(preview.reviewCount).toBe(first.mix.reviewCount);
      expect(preview.newCount).toBe(first.mix.newCount);
      expect(first.mix.ids).not.toContain(board.hiddenId);
      expect(first.items.map((item) => item.id)).toEqual(first.mix.ids);

      const topicById = new Map(board.fresh.map((row) => [row.id, row.subjectId]));
      const newTopics = new Set(first.mix.newIds.map((id) => topicById.get(id)));
      expect(newTopics.size).toBeGreaterThan(1);
      expect(first.mix.newIds.slice(0, 10).every((id) => id.includes("-a-"))).toBe(false);

      const answeredNew = first.mix.newIds.slice(0, 3);
      const answeredReview = first.mix.reviewIncorrectIds.slice(0, 2);
      state.seen[board.fieldId] = [...answeredNew, ...answeredReview];
      state.open[board.fieldId] = state.open[board.fieldId]!.filter(
        (id) => !answeredReview.includes(id)
      );

      await invalidateTodayServedCache(USER, board.fieldId, STILL_DAY_1);
      const laterSameDay = await loadServedTodaySet({
        userId: USER,
        examSlug: board.examSlug,
        fieldId: board.fieldId,
        size: 25,
        now: STILL_DAY_1,
        timeZone: ZONE,
      });
      expect(laterSameDay.mix.ids).toEqual(first.mix.ids);
      expect(laterSameDay.mix.mixLine).toBe(first.mix.mixLine);

      await invalidateTodayServedCache(USER, board.fieldId, DAY_2);
      const second = await loadServedTodaySet({
        userId: USER,
        examSlug: board.examSlug,
        fieldId: board.fieldId,
        size: 25,
        now: DAY_2,
        timeZone: ZONE,
      });

      expect(second.mix.ids).toHaveLength(25);
      expect(second.mix.reviewCount).toBe(15);
      expect(second.mix.newCount).toBe(10);
      expect(second.mix.mixLine).toBe("15 to review · 10 new");
      expect(second.mix.ids).not.toEqual(first.mix.ids);
      expect(second.mix.ids).not.toContain(board.hiddenId);
      expect(second.mix.newIds.filter((id) => first.mix.newIds.includes(id))).toEqual([]);
      expect(second.mix.newIds.filter((id) => answeredNew.includes(id))).toEqual([]);
      expect(
        second.mix.reviewIncorrectIds.filter((id) => first.mix.reviewIncorrectIds.includes(id))
      ).toEqual([]);
      expect(second.mix.reviewCount / second.mix.ids.length).toBeLessThanOrEqual(0.6);
    });
  }
});
