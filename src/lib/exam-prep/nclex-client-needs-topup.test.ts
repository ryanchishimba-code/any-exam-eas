import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BankItem } from "@/lib/question-bank";

vi.mock("@/lib/question-bank/random-sample", () => ({
  sampleQuestionBankRows: vi.fn(),
}));

vi.mock("@/lib/exam-prep/student-eligibility", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/exam-prep/student-eligibility")>();
  return {
    ...actual,
    ineligibleServedIds: vi.fn(async () => []),
  };
});

import { sampleQuestionBankRows } from "@/lib/question-bank/random-sample";
import {
  clientNeedsDeficits,
  clientNeedsTargets,
  clientNeedsWithinRanges,
  composeWithinClientNeeds,
  examClientNeedsCategory,
} from "@/lib/exam-prep/nclex-client-needs-quota";
import { nursingClientNeedsWhere, topUpNursingClientNeedsPool } from "@/lib/exam-prep/nclex-client-needs-topup";

function row(id: string, category: string): BankItem {
  return {
    id,
    question: `Which action is first for ${id}?`,
    options: ["Assess", "Wait", "Document", "Delegate"],
    correctAnswer: "Assess",
    explanation: `Assess ${id} before the other steps.`,
    subjectId: category,
    qaPassed: true,
    active: true,
  };
}

function bankRow(id: string) {
  return {
    id,
    subjectId: "health-promotion",
    question: `Which screening is due for ${id}?`,
    options: JSON.stringify(["Assess", "Wait", "Document", "Delegate"]),
    correctAnswer: "Assess",
    explanation: `Assess ${id} before the other steps.`,
    solutionSteps: null,
    tags: null,
    clientNeeds: "health-promotion",
    qaPassed: true,
    active: true,
  };
}

describe("nursing client-needs top-up", () => {
  beforeEach(() => {
    vi.mocked(sampleQuestionBankRows).mockReset();
  });

  it("queries the category itself and not specialty subjects", () => {
    const where = nursingClientNeedsWhere("health-promotion", ["already"]);
    const packed = JSON.stringify(where);
    expect(packed).toContain("health-promotion");
    expect(packed).toContain("Health Promotion and Maintenance");
    expect(packed).not.toContain("maternal-child");
    expect(packed).not.toContain("pediatrics-nursing");
    expect(packed).not.toContain("med-surg");
    expect(packed).toContain("already");
  });

  it("pulls a short Health Promotion minimum and the merged pool can fill a CAT exam", async () => {
    const limit = 150;
    const targets = clientNeedsTargets(limit)!;
    const hpm = targets.find((row) => row.id === "health-promotion")!;
    const window: BankItem[] = [];
    for (const target of targets) {
      const count = target.id === "health-promotion" ? 4 : target.max;
      for (let index = 0; index < count; index += 1) {
        window.push(row(`window-${target.id}-${index}`, target.id));
      }
    }
    window.push(
      ...Array.from({ length: 5 }, (_, index) => row(`peds-${index}`, "pediatrics-nursing")),
      ...Array.from({ length: 4 }, (_, index) => row(`maternal-${index}`, "maternal-child")),
      ...Array.from({ length: 2 }, (_, index) => row(`medsurg-${index}`, "med-surg"))
    );
    expect(clientNeedsDeficits(window, limit)).toEqual([{ id: "health-promotion", have: 4, min: hpm.min }]);

    vi.mocked(sampleQuestionBankRows).mockImplementation(async () =>
      Array.from({ length: hpm.max }, (_, index) => bankRow(`pulled-hpm-${index}`))
    );

    const extra = await topUpNursingClientNeedsPool(window, limit);
    expect(sampleQuestionBankRows).toHaveBeenCalledTimes(1);
    const query = JSON.stringify(vi.mocked(sampleQuestionBankRows).mock.calls[0]?.[0]?.where);
    expect(query).toContain("health-promotion");
    expect(query).not.toContain("maternal-child");
    expect(extra.length).toBeGreaterThanOrEqual(hpm.min - 4);
    expect(extra.every((item) => examClientNeedsCategory(item) === "health-promotion")).toBe(true);

    const merged = [...window, ...extra];
    expect(clientNeedsDeficits(merged, limit)).toEqual([]);
    const draw = composeWithinClientNeeds({
      preferred: window.slice(0, limit),
      pool: merged,
      limit,
      seed: 15,
    });
    expect(draw).not.toBeNull();
    expect(clientNeedsWithinRanges(draw!)).toBe(true);
    expect(draw!.filter((item) => examClientNeedsCategory(item) === "health-promotion").length).toBeGreaterThanOrEqual(
      hpm.min
    );
    expect(
      draw!.some(
        (item) =>
          item.subjectId === "pediatrics-nursing" ||
          item.subjectId === "maternal-child" ||
          item.subjectId === "med-surg"
      )
    ).toBe(false);
  });
});
