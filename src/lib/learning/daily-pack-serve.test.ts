import { beforeEach, describe, expect, it, vi } from "vitest";
import { calendarDateKey, calendarDayIndex } from "@/lib/learning/today-set";
import { DAILY_PACK_TIME_ZONE } from "@/lib/learning/daily-pack";
import { loadSharedDailyPack, resetSharedDailyPackCache } from "@/lib/learning/daily-pack-serve";

type Row = {
  id: string;
  subjectId: string;
  topicCategory: null;
  blueprintDomain: null;
  correctAnswer: string;
  options: string;
  itemType: string;
  fieldId: string;
  stepLevel: null;
  active: boolean;
  qaPassed: boolean;
};

const LETTERS = ["Hold", "Give", "Call", "Document"];
const OPTIONS = JSON.stringify(LETTERS);

function row(id: string, fieldId = "nursing"): Row {
  const index = Number(id.replace(/\D/g, "")) || 0;
  return {
    id,
    subjectId: "cardiac",
    topicCategory: null,
    blueprintDomain: null,
    correctAnswer: LETTERS[index % 4]!,
    options: OPTIONS,
    itemType: "mcq",
    fieldId,
    stepLevel: null,
    active: true,
    qaPassed: true,
  };
}

const state = vi.hoisted(() => ({
  rows: [] as Row[],
  retiredId: "",
}));

vi.mock("@/lib/exam-prep/student-eligibility", () => ({
  ineligibleServedIds: vi.fn(async () => []),
}));

vi.mock("@/lib/full-exam/load-bank-items-by-ids", () => ({
  loadBankItemsByIds: vi.fn(async (_field: string, ids: string[]) => ids.map((id) => ({ id }))),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    questionBankItem: {
      findMany: vi.fn(async (args?: { where?: { id?: { in?: string[] } } }) => {
        const ids = args?.where?.id?.in;
        if (ids) {
          return state.rows.filter((row) => ids.includes(row.id) && row.id !== state.retiredId);
        }
        return state.rows;
      }),
    },
  },
}));

function chicagoDay(iso: string): { now: Date; even: boolean } {
  const now = new Date(iso);
  const date = calendarDateKey(now, DAILY_PACK_TIME_ZONE);
  return { now, even: calendarDayIndex(date) % 2 === 0 };
}

const EVEN = chicagoDay("2026-09-26T18:00:00.000Z");
const ODD = chicagoDay("2026-09-27T18:00:00.000Z");

describe("shared daily pack serve", () => {
  beforeEach(() => {
    state.retiredId = "";
    state.rows = Array.from({ length: 25 }, (_, index) => row(`id-${String(index).padStart(2, "0")}`));
    resetSharedDailyPackCache();
  });

  it("serves the same ids twice and keeps another field out", async () => {
    state.rows = [...state.rows, row("pharmacy-1", "pharmacy")];
    const now = EVEN.even ? EVEN.now : ODD.now;
    const first = await loadSharedDailyPack({ fieldId: "nursing", now });
    const second = await loadSharedDailyPack({ fieldId: "nursing", now });
    expect(second.ids).toEqual(first.ids);
    expect(first.ids).toHaveLength(20);
    expect(first.ids).not.toContain("pharmacy-1");
    expect(first.items.map((item) => item.id)).toEqual(first.ids);
  });

  it("replaces a retired id from the overflow and keeps that id out on the next read", async () => {
    expect(EVEN.even).toBe(true);
    state.retiredId = "id-00";
    const first = await loadSharedDailyPack({ fieldId: "nursing", now: EVEN.now });
    expect(first.ids).toHaveLength(20);
    expect(first.ids).not.toContain("id-00");
    expect(first.ids).toContain("id-20");
    const second = await loadSharedDailyPack({ fieldId: "nursing", now: EVEN.now });
    expect(second.ids).toEqual(first.ids);
  });

  it("serves a thin pool whole on consecutive Chicago days", async () => {
    state.rows = Array.from({ length: 7 }, (_, index) => row(`thin-${index}`));
    const today = await loadSharedDailyPack({ fieldId: "nursing", now: EVEN.now });
    const tomorrow = await loadSharedDailyPack({ fieldId: "nursing", now: ODD.now });
    expect(today.ids).toHaveLength(7);
    expect(tomorrow.ids).toEqual(today.ids);
    expect(new Set(today.ids).size).toBe(7);
  });

  it("keeps an empty pool empty", async () => {
    state.rows = [];
    const pack = await loadSharedDailyPack({ fieldId: "nursing", now: EVEN.now });
    expect(pack.ids).toEqual([]);
    expect(pack.items).toEqual([]);
  });
});
