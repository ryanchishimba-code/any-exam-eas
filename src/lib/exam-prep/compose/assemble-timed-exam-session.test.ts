import { describe, expect, it, vi } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  assembleTimedExamSessionItems,
  collectFastTimedPool,
  fastGatherClusterGoal,
  fastGatherItemGoal,
  logComposeUnavailable,
} from "./assemble-timed-exam-session";

vi.mock("@/lib/exam-prep/gather-sprint-timed-pool", () => ({
  gatherSprintTimedExamPool: vi.fn(),
}));

vi.mock("@/lib/exam-prep/try-timed-preset-exam", () => ({
  tryLoadTimedPresetSession: vi.fn(),
}));

vi.mock("@/lib/exam-prep/gather-progressive-bank-pool", () => ({
  gatherProgressiveBankPool: vi.fn(),
}));

vi.mock("./compose-timed-exam-session", () => ({
  composeBlueprintTimedExamSession: vi.fn(),
  fieldSupportsBlueprintTimedExam: vi.fn(() => false),
}));

vi.mock("@/lib/questions/timed-exam-sampling", () => ({
  gatherTimedExamBankItems: vi.fn(),
}));

vi.mock("@/lib/question-bank-db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/question-bank-db")>();
  return {
    ...actual,
    sampleActiveItemsByFormat: vi.fn(async () => []),
    samplePharmacyCalculationItems: vi.fn(async () => []),
  };
});

vi.mock("@/lib/assessment/serve-db", () => ({
  loadPublishedClinicalBank: vi.fn(async () => ({ catalog: [] })),
}));

import { gatherSprintTimedExamPool } from "@/lib/exam-prep/gather-sprint-timed-pool";
import { tryLoadTimedPresetSession } from "@/lib/exam-prep/try-timed-preset-exam";
import { gatherProgressiveBankPool } from "@/lib/exam-prep/gather-progressive-bank-pool";
import { gatherTimedExamBankItems } from "@/lib/questions/timed-exam-sampling";

const DISTINCT: Array<[string, string, string[]]> = [
  ["Which auxiliary label belongs on this carton?", "Refrigerate after opening", ["Refrigerate after opening", "Freeze solid", "Leave in a sunny window", "Discard the leaflet"]],
  ["Which beyond-use date fits this nonsterile compound?", "14 days refrigerated", ["14 days refrigerated", "24 hours frozen", "One year at room temperature", "Until the stock bottle is empty"]],
  ["Which balance check comes first this morning?", "Level the pan", ["Level the pan", "Skip the calibration", "Weigh the spatula", "Tare the printer"]],
  ["Which glove change is required at the hood?", "New sterile gloves", ["New sterile gloves", "Keep the same pair", "Use kitchen gloves", "Skip gloves for a rush"]],
  ["Which bin receives this recalled lot?", "Quarantine cage", ["Quarantine cage", "Will-call", "Front register", "Break-room shelf"]],
  ["Which temperature log entry is complete?", "Record the noon reading", ["Record the noon reading", "Leave the log blank", "Copy yesterday", "Erase the excursion"]],
  ["Which courier bag fits a cold-chain delivery?", "Insulated tote with ice", ["Insulated tote with ice", "Paper sack", "Open tray", "Mailbox drop"]],
  ["Which label printer setting avoids a cutoff warning?", "Full label stock", ["Full label stock", "Receipt paper", "Blank cardstock", "No stock"]],
  ["Which counting tray step avoids a cross-contact?", "Wash the tray", ["Wash the tray", "Reuse the powder", "Count on the counter", "Skip the wipe"]],
  ["Which safe is used for this schedule II delivery?", "Locked narcotic safe", ["Locked narcotic safe", "Open shelf", "Refrigerator door", "Cash drawer"]],
  ["Which phone script fits a prescriber clarification?", "Read back the order", ["Read back the order", "Guess the strength", "Hang up", "Dispense the closest bottle"]],
  ["Which spill kit is opened for this powder?", "Dry chemical kit", ["Dry chemical kit", "Mop and bucket only", "Paper towels", "Leave it until close"]],
];

function item(id: string, shared = false): BankItem {
  const row = DISTINCT[Number(id.replace(/\D/g, "")) % DISTINCT.length]!;
  return {
    id,
    subjectId: "pharmacotherapy",
    question: shared ? "Which regimen should be started today for this shared case?" : row[0],
    options: shared
      ? ["Start warfarin today", "Hold anticoagulation", "Give vitamin K", "Recheck in one year"]
      : row[2],
    correctAnswer: shared ? "Start warfarin today" : row[1],
    explanation: "Because this is the keyed choice for the vignette.",
    scenario: shared
      ? "A 54-year-old man with atrial fibrillation and a prior stroke takes no medicines."
      : `Case ${id} is about ${row[0]}`,
    itemType: "mcq",
    tags: ["pass"],
    qaPassed: true,
    active: true,
  };
}

describe("collectFastTimedPool", () => {
  it("uses a 1.5 cluster floor and a two-sprint row floor", () => {
    expect(fastGatherClusterGoal(50)).toBe(75);
    expect(fastGatherClusterGoal(1)).toBe(2);
    expect(fastGatherItemGoal(50, 130, 390)).toBe(260);
    expect(fastGatherClusterGoal(225)).toBe(450);
    expect(fastGatherItemGoal(225, 360, 1080)).toBe(900);
  });

  it("keeps pulling after the sitting length and after the 1.5 cluster floor until the row floor", async () => {
    const pulls: number[] = [];
    let cursor = 0;
    const pool = await collectFastTimedPool({
      limit: 50,
      rowCap: 1000,
      sprintTarget: 40,
      pull: async (count) => {
        pulls.push(count);
        const batch = Array.from({ length: count }, (_, index) => {
          const n = cursor + index;
          const row = item(`row-${n}`);
          return {
            ...row,
            question: `Which monitoring step is required before agent ${n} in case ${n * 3}?`,
            options: [`Check level ${n}`, `Ignore ${n}`, `Stop ${n}`, `Discharge ${n}`],
            correctAnswer: `Check level ${n}`,
            scenario: `Unique history ${n} with finding ${n * 17} and drug ${n * 13}.`,
          };
        });
        cursor += count;
        return batch;
      },
    });
    expect(pool.length).toBe(fastGatherItemGoal(50, 40, 1000));
    expect(pool.length).toBe(200);
    expect(pulls.length).toBeGreaterThan(2);
    expect(pulls[0]).toBe(40);
  });

  it("stops when a pull adds no new rows, even if the goals are unmet", async () => {
    let calls = 0;
    const pool = await collectFastTimedPool({
      limit: 50,
      rowCap: 1000,
      sprintTarget: 130,
      pull: async () => {
        calls += 1;
        return calls === 1 ? [item("only")] : [];
      },
    });
    expect(pool.map((row) => row.id)).toEqual(["only"]);
    expect(calls).toBe(2);
  });
});

describe("assembleTimedExamSessionItems fast path", () => {
  it("falls through when the fast pool cannot fill, and returns a later path that can", async () => {
    vi.mocked(gatherSprintTimedExamPool).mockReset();
    vi.mocked(tryLoadTimedPresetSession).mockReset();
    vi.mocked(gatherProgressiveBankPool).mockReset();
    vi.mocked(gatherTimedExamBankItems).mockReset();

    vi.mocked(gatherSprintTimedExamPool).mockImplementation(async ({ limit }) =>
      Array.from({ length: limit }, (_, index) => item(`fast-${index}`, true))
    );
    vi.mocked(tryLoadTimedPresetSession).mockResolvedValue({
      examNumber: 3,
      items: Array.from({ length: 12 }, (_, index) => item(`preset-${index}`)),
    });
    vi.mocked(gatherProgressiveBankPool).mockResolvedValue([]);
    vi.mocked(gatherTimedExamBankItems).mockResolvedValue([]);

    const result = await assembleTimedExamSessionItems({
      fieldId: "pharmacy",
      field: "pharmacy",
      limit: 8,
      sampleCount: 20,
      sessionId: "cmux-fallthrough",
    });

    expect(result?.source).toBe("preset");
    expect(result?.items).toHaveLength(8);
    expect(result?.presetExamNumber).toBe(3);
    expect(tryLoadTimedPresetSession).toHaveBeenCalled();
  });

  it("returns the fast path without the preset when that pool fills", async () => {
    vi.mocked(gatherSprintTimedExamPool).mockReset();
    vi.mocked(tryLoadTimedPresetSession).mockReset();
    vi.mocked(gatherSprintTimedExamPool).mockImplementation(async ({ limit }) =>
      Array.from({ length: limit }, (_, index) => item(`fast-ok-${index}`))
    );
    vi.mocked(tryLoadTimedPresetSession).mockResolvedValue({
      examNumber: 9,
      items: Array.from({ length: 12 }, (_, index) => item(`preset-unused-${index}`)),
    });

    const result = await assembleTimedExamSessionItems({
      fieldId: "pharmacy",
      field: "pharmacy",
      limit: 8,
      sampleCount: 20,
      sessionId: "cmux-fast-ok",
    });

    expect(result?.source).toBe("gather");
    expect(result?.items).toHaveLength(8);
    expect(tryLoadTimedPresetSession).not.toHaveBeenCalled();
  });
});

describe("logComposeUnavailable", () => {
  it("warns with pool size, kept count, and rejections by reason", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    logComposeUnavailable(50, {
      poolSize: 130,
      kept: 41,
      rejections: { drug: 22, narrow: 9, "repeat:template": 4 },
    });
    expect(warn).toHaveBeenCalledWith("[full-exam] could not compose exam", {
      limit: 50,
      poolSize: 130,
      kept: 41,
      rejections: { drug: 22, narrow: 9, "repeat:template": 4 },
      relaxLevel: 0,
      strictKept: 41,
      strictRejections: { drug: 22, narrow: 9, "repeat:template": 4 },
    });
    warn.mockRestore();
  });
});

describe("assembleTimedExamSessionItems time budget", () => {
  it("returns within the deadline when a pull never resolves", async () => {
    vi.useFakeTimers();
    try {
      vi.mocked(gatherSprintTimedExamPool).mockReset();
      vi.mocked(tryLoadTimedPresetSession).mockReset();
      vi.mocked(gatherProgressiveBankPool).mockReset();
      vi.mocked(gatherTimedExamBankItems).mockReset();
      vi.mocked(gatherSprintTimedExamPool).mockImplementation(() => new Promise(() => {}));
      vi.mocked(tryLoadTimedPresetSession).mockResolvedValue(null);
      vi.mocked(gatherProgressiveBankPool).mockResolvedValue([]);
      vi.mocked(gatherTimedExamBankItems).mockResolvedValue([]);
      const started = Date.now();
      const pending = assembleTimedExamSessionItems({
        fieldId: "pharmacy",
        field: "pharmacy",
        limit: 8,
        sampleCount: 20,
        sessionId: "deadline-never",
        deadlineMs: 25_000,
      });
      const finished = pending.then((result) => ({ result, elapsed: Date.now() - started }));
      await vi.advanceTimersByTimeAsync(26_000);
      const outcome = await finished;
      expect(outcome.elapsed).toBeLessThanOrEqual(26_000);
      expect(outcome.result?.items.length ?? 0).toBeLessThan(8);
    } finally {
      vi.useRealTimers();
    }
  });

  it("returns within the deadline when each pull takes 10s", async () => {
    vi.useFakeTimers();
    try {
      vi.mocked(gatherSprintTimedExamPool).mockReset();
      vi.mocked(tryLoadTimedPresetSession).mockReset();
      vi.mocked(gatherProgressiveBankPool).mockReset();
      vi.mocked(gatherTimedExamBankItems).mockReset();
      let calls = 0;
      vi.mocked(gatherSprintTimedExamPool).mockImplementation(
        () =>
          new Promise((resolve) => {
            calls += 1;
            const n = calls;
            setTimeout(() => resolve([item(`slow-${n}`)]), 10_000);
          })
      );
      vi.mocked(tryLoadTimedPresetSession).mockResolvedValue(null);
      vi.mocked(gatherProgressiveBankPool).mockResolvedValue([]);
      vi.mocked(gatherTimedExamBankItems).mockResolvedValue([]);
      const started = Date.now();
      const pending = assembleTimedExamSessionItems({
        fieldId: "pharmacy",
        field: "pharmacy",
        limit: 8,
        sampleCount: 20,
        sessionId: "deadline-slow",
        deadlineMs: 25_000,
      });
      const finished = pending.then((result) => ({ result, elapsed: Date.now() - started }));
      await vi.advanceTimersByTimeAsync(26_000);
      const outcome = await finished;
      expect(outcome.elapsed).toBeLessThanOrEqual(26_000);
      expect(outcome.result?.items.length ?? 0).toBeLessThan(8);
    } finally {
      vi.useRealTimers();
    }
  });
});
