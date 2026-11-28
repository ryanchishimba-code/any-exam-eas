import { describe, expect, it } from "vitest";
import { mergeCrosswordStores, sanitizeCrosswordStore } from "@/lib/crossword/merge-progress";
import { mergeStreakRecords, nextStreak, visibleStreak } from "@/lib/crossword/streak";
import type { CrosswordGameSave } from "@/lib/crossword/browser-store";

const TODAY = "2026-11-14";

function game(partial: Partial<CrosswordGameSave>): CrosswordGameSave {
  return {
    fills: {},
    hints: {},
    elapsed: 0,
    started: true,
    complete: false,
    hinted: false,
    ...partial,
  };
}

describe("crossword streak merge", () => {
  it("continues yesterday's account streak when this device solves today", () => {
    const merged = mergeStreakRecords({ last: "2026-11-13", streak: 5 }, { last: TODAY, streak: 1 });
    expect(merged).toEqual({ last: TODAY, streak: 6 });
    expect(visibleStreak(merged ?? undefined, TODAY)).toBe(6);
  });

  it("does not count the same day twice and drops a broken chain from the display", () => {
    expect(mergeStreakRecords({ last: TODAY, streak: 3 }, { last: TODAY, streak: 8 })).toEqual({
      last: TODAY,
      streak: 8,
    });
    expect(nextStreak({ last: TODAY, streak: 4 }, TODAY).streak).toBe(4);
    expect(visibleStreak({ last: "2026-11-01", streak: 9 }, TODAY)).toBe(0);
    expect(mergeStreakRecords({ last: "2026-11-01", streak: 9 }, { last: TODAY, streak: 1 })?.streak).toBe(1);
  });

  it("keeps the fuller grid and a completed solve", () => {
    const local = sanitizeCrosswordStore({
      streaks: { naplex: { last: TODAY, streak: 2 } },
      games: {
        "naplex:2026-11-14": game({ fills: { "0,0": "A", "0,1": "B" }, elapsed: 1000 }),
        "nclex:2026-11-14": game({ complete: true, elapsed: 4000, fills: { "1,1": "C" } }),
        "not-a-board:2026-11-14": game({ fills: { "0,0": "Z" } }),
      },
    });
    const remote = sanitizeCrosswordStore({
      streaks: { naplex: { last: "2026-11-13", streak: 1 } },
      games: {
        "naplex:2026-11-14": game({ fills: { "0,0": "A" }, elapsed: 500 }),
        "nclex:2026-11-14": game({ fills: { "1,1": "C", "1,2": "D" }, elapsed: 2000 }),
      },
    });
    expect(local.games["not-a-board:2026-11-14"]).toBeUndefined();
    const merged = mergeCrosswordStores(local, remote, TODAY);
    expect(merged.streaks.naplex).toEqual({ last: TODAY, streak: 2 });
    expect(Object.keys(merged.games["naplex:2026-11-14"]!.fills)).toHaveLength(2);
    expect(merged.games["nclex:2026-11-14"]!.complete).toBe(true);
  });
});
