import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { aggregateActiveInventory } from "@/lib/inventory/active-questions";
import {
  SERVED_QUESTION_COUNT_REVALIDATE_SECONDS,
  applyServedFieldCounts,
  inventoryFromLiveFieldCounts,
} from "@/lib/marketing/served-question-counts";
import type { LiveBoardQuestionCounts } from "@/lib/marketing/live-board-counts";

function live(): LiveBoardQuestionCounts {
  return {
    byField: {
      nursing: 3945,
      pharmacy: 4410,
      "usmle-step-1": 100,
      "usmle-step-2": 200,
      "usmle-step-3": 300,
      pance: 2559,
      "aanp-fnp": 5136,
      "npte-pt": 1748,
    },
    itemTypesByField: {
      nursing: { mcq: 3900, select_all: 45 },
      pharmacy: { vignette: 4410 },
      "usmle-step-1": { mcq: 100 },
      "usmle-step-2": { mcq: 200 },
      "usmle-step-3": { ccs_prompt: 300 },
      pance: { vignette: 2559 },
      "aanp-fnp": { vignette: 5136 },
      "npte-pt": { vignette: 1748 },
    },
  };
}

describe("served question counts", () => {
  it("uses the picker serve filter and refreshes within an hour", () => {
    const source = readFileSync(
      path.join(process.cwd(), "src/lib/marketing/served-question-counts.ts"),
      "utf8"
    );
    const bundle = readFileSync(
      path.join(process.cwd(), "src/lib/marketing/question-bank-counts.ts"),
      "utf8"
    );
    expect(SERVED_QUESTION_COUNT_REVALIDATE_SECONDS).toBe(60 * 60);
    expect(SERVED_QUESTION_COUNT_REVALIDATE_SECONDS).toBeLessThanOrEqual(60 * 60);
    expect(source).toContain("loadLiveBoardQuestionCounts");
    expect(source).toContain('["served-clinical-extras-v1"]');
    expect(bundle).toContain("loadServedQuestionCounts");
    const gate = readFileSync(
      path.join(process.cwd(), "src/lib/marketing/live-board-counts.ts"),
      "utf8"
    );
    expect(gate).toContain("studentEligibleAndSql()");
    expect(gate).toContain("active = true");
    expect(gate).toContain('"qaPassed" = true');
  });

  it("keeps catalog NGN out of the board total", () => {
    const inventory = inventoryFromLiveFieldCounts(live());
    expect(inventory.boards.nclex.active).toBe(3945);
    expect(inventory.boards.nclex.formats).toEqual({ mcq: 3900, ngn: 45, case: 0 });
    expect(inventory.boards.usmle.active).toBe(600);
    expect(inventory.boards.naplex.active).toBe(4410);
    expect(inventory.fields["usmle-step-2"]?.active).toBe(200);
    expect(inventory.boards.usmle.formats.case).toBe(300);
  });

  it("replaces a stale snapshot total and leaves topic rows in place", () => {
    const stored = aggregateActiveInventory([
      {
        fieldId: "nursing",
        subjectId: "management-of-care",
        clientNeeds: "management-of-care",
        itemType: "mcq",
        hasCaseGroup: false,
        count: 4247,
      },
    ]);
    applyServedFieldCounts(stored, live());
    expect(stored.boards.nclex.active).toBe(3945);
    expect(stored.fields.nursing?.topics[0]?.count).toBe(4247);
    expect(stored.boards.naplex.active).toBe(4410);
  });
});
