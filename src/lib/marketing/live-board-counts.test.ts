import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  boardQuestionUnits,
  formatBoardQuestionSentence,
  formatExactQuestionCount,
  scoredQuestionCount,
} from "@/lib/counts";
import { buildHubBoardDonutSegments } from "@/lib/marketing/board-landing/hub-board-donut";
import {
  LIVE_BOARD_COUNT_QUERY_TIMEOUT_MS,
  LIVE_BOARD_COUNT_REVALIDATE_SECONDS,
  LIVE_BOARD_COUNT_SQL,
  applyLiveBankItemCount,
  boardPageQuestionUnits,
  liveBankItemCount,
  liveBoardQuestionCountsFromRows,
  liveUsmleStepCounts,
  type LiveBoardQuestionCounts,
} from "@/lib/marketing/live-board-counts";

function counts(rows: { fieldId: string; itemType: string; count: number }[]): LiveBoardQuestionCounts {
  return liveBoardQuestionCountsFromRows(rows);
}

describe("live board question counts", () => {
  it("uses the snapshot serve filter and caches it for an hour", () => {
    const source = readFileSync(path.join(process.cwd(), "src/lib/marketing/live-board-counts.ts"), "utf8");
    const snapshot = readFileSync(path.join(process.cwd(), "src/lib/inventory/active-questions.ts"), "utf8");
    expect(LIVE_BOARD_COUNT_REVALIDATE_SECONDS).toBe(3600);
    expect(LIVE_BOARD_COUNT_QUERY_TIMEOUT_MS).toBeGreaterThan(5_000);
    expect(source).toContain("revalidate: LIVE_BOARD_COUNT_REVALIDATE_SECONDS");
    expect(source).toContain("unstable_cache");
    expect(source).toContain("studentEligibleAndSql()");
    expect(source).toContain("EFFECTIVE_MCQ_SQL");
    expect(source).not.toMatch(/unstable_noStore|connection\(/);
    expect(LIVE_BOARD_COUNT_SQL).toContain("active = true");
    expect(LIVE_BOARD_COUNT_SQL).toContain('"qaPassed" = true');
    expect(LIVE_BOARD_COUNT_SQL).toContain('FROM "QuestionBankItem"');
    expect(LIVE_BOARD_COUNT_SQL).toContain(`"fieldId" = 'usmle-step-2' AND "stepLevel" = 'step3'`);
    expect(LIVE_BOARD_COUNT_SQL).toContain("studentEligibility");
    expect(LIVE_BOARD_COUNT_SQL).not.toContain("ActiveInventoryCount");
    expect(snapshot).toContain("studentEligibleAndSql()");
    for (const fieldId of ["nursing", "pharmacy", "pance", "aanp-fnp", "npte-pt", "usmle-step-1", "usmle-step-2", "usmle-step-3"]) {
      expect(LIVE_BOARD_COUNT_SQL).toContain(`'${fieldId}'`);
    }
  });

  it("sums USMLE steps and keeps each other board on its own field", () => {
    const live = counts([
      { fieldId: "pance", itemType: "vignette", count: 3276 },
      { fieldId: "nursing", itemType: "vignette", count: 3754 },
      { fieldId: "pharmacy", itemType: "vignette", count: 5620 },
      { fieldId: "aanp-fnp", itemType: "vignette", count: 5328 },
      { fieldId: "npte-pt", itemType: "vignette", count: 1748 },
      { fieldId: "usmle-step-1", itemType: "mcq", count: 3170 },
      { fieldId: "usmle-step-2", itemType: "mcq", count: 5165 },
      { fieldId: "usmle-step-3", itemType: "mcq", count: 8407 },
    ]);
    expect(liveBankItemCount(live, "pance")).toBe(3276);
    expect(liveBankItemCount(live, "nclex")).toBe(3754);
    expect(liveBankItemCount(live, "naplex")).toBe(5620);
    expect(liveBankItemCount(live, "aanp-fnp")).toBe(5328);
    expect(liveBankItemCount(live, "npte-pt")).toBe(1748);
    expect(liveBankItemCount(live, "usmle")).toBe(16742);
    expect(liveUsmleStepCounts(live)).toEqual({ step1: 3170, step2: 5165, step3: 8407 });
    expect(formatExactQuestionCount(liveBankItemCount(live, "pance"))).toBe("3,276");
  });

  it("replaces the stale bank total and keeps the published NGN clause", () => {
    const pance = applyLiveBankItemCount(
      boardQuestionUnits({
        slug: "pance",
        bankItems: 2856,
        formats: { mcq: 2856, ngn: 0, case: 0 },
      }),
      3276
    );
    expect(scoredQuestionCount(pance)).toBe(3276);
    expect(formatBoardQuestionSentence(pance)).toBe("3,276 questions");
    expect(
      buildHubBoardDonutSegments({
        examKey: "pance",
        liveQuestionCount: scoredQuestionCount(pance),
        includeStudyGuide: false,
        includeAllUsmleSteps: false,
      })[0]?.detail
    ).toBe("3,276 live scored questions.");

    const nclex = applyLiveBankItemCount(
      boardQuestionUnits({
        slug: "nclex",
        bankItems: 3754,
        formats: { mcq: 3754, ngn: 0, case: 0 },
        clinical: { standaloneNgn: 57, caseStudies: 37, caseItems: 222 },
      }),
      3754
    );
    expect(scoredQuestionCount(nclex)).toBe(4033);
    expect(formatBoardQuestionSentence(nclex)).toBe(
      "4,033 questions, including 222 items in 37 case studies and 57 standalone NGN items"
    );
  });

  it("uses the live count when the snapshot is missing and the snapshot when the live read fails", () => {
    const live = counts([{ fieldId: "pance", itemType: "vignette", count: 3276 }]);
    const fromLive = boardPageQuestionUnits({ slug: "pance", snapshotUnits: null, live });
    expect(fromLive && scoredQuestionCount(fromLive)).toBe(3276);

    const snapshot = boardQuestionUnits({
      slug: "pance",
      bankItems: 2856,
      formats: { mcq: 2856, ngn: 0, case: 0 },
    });
    const fallback = boardPageQuestionUnits({ slug: "pance", snapshotUnits: snapshot, live: null });
    expect(fallback && scoredQuestionCount(fallback)).toBe(2856);
    expect(boardPageQuestionUnits({ slug: "pance", snapshotUnits: null, live: null })).toBeNull();
  });

  it("wires every board page through the live count and leaves the route static", () => {
    for (const file of ["src/app/nclex/page.tsx", "src/app/naplex/page.tsx"]) {
      const source = readFileSync(path.join(process.cwd(), file), "utf8");
      expect(source, file).toContain("loadBoardPageQuestionUnits");
      expect(source, file).toContain("export const revalidate = 300");
      expect(source, file).not.toContain('dynamic = "force-dynamic"');
    }
    const hub = readFileSync(
      path.join(process.cwd(), "src/lib/marketing/board-landing/hub-page-data.ts"),
      "utf8"
    );
    expect(hub).toContain("boardPageQuestionUnits");
    expect(hub).toContain("loadLiveBoardQuestionCounts");
    for (const file of [
      "src/app/pance/page.tsx",
      "src/app/usmle/page.tsx",
      "src/app/aanp-fnp/page.tsx",
      "src/app/npte-pt/page.tsx",
    ]) {
      const source = readFileSync(path.join(process.cwd(), file), "utf8");
      expect(source, file).toContain("loadHubBoardLanding");
      expect(source, file).toContain("export const revalidate = 300");
      expect(source, file).not.toContain('dynamic = "force-dynamic"');
    }
  });
});
