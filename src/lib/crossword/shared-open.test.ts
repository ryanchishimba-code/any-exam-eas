import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { puzzlesFor, toPublicPuzzle } from "@/lib/crossword/bank";
import { maskFromGrid } from "@/lib/crossword/og-card";
import { challengeText, spoilerFreeShareText } from "@/lib/crossword/share-text";
import type { CrosswordGameSave } from "@/lib/crossword/browser-store";
import {
  canReplaceSavedGame,
  gameToOpen,
  shareLocationSeedsGrid,
} from "@/lib/crossword/shared-open";

const NOW = new Date("2026-11-13T18:00:00.000Z");

function game(partial: Partial<CrosswordGameSave>): CrosswordGameSave {
  return {
    fills: {},
    hints: {},
    elapsed: 0,
    started: false,
    complete: false,
    hinted: false,
    ...partial,
  };
}

const OWN = game({
  fills: { "0,0": "A", "0,1": "B" },
  hints: { "1,1": true },
  elapsed: 90_000,
  started: true,
});

const CRAFTED =
  "?fills=2%2C2%3DZ&answer=DISULFIRAM&complete=1&hints=1%2C1&revealed=1&elapsed=999&letters=CAT&streak=9";

describe("a shared crossword opens blank unless this browser already has that puzzle", () => {
  it("starts fresh when the recipient has no save, and ignores letters in the link", () => {
    expect(shareLocationSeedsGrid(CRAFTED)).toBe(true);
    expect(gameToOpen(undefined, CRAFTED)).toBeNull();
    expect(gameToOpen(game({}), CRAFTED)).toBeNull();
    expect(gameToOpen(undefined, "#fills=0,0=A&answer=CAT")).toBeNull();
  });

  it("resumes the recipient's own in-progress grid and drops the sharer's payload", () => {
    const opened = gameToOpen(OWN, CRAFTED);
    expect(opened?.fills).toEqual({ "0,0": "A", "0,1": "B" });
    expect(opened?.hints).toEqual({ "1,1": true });
    expect(opened?.elapsed).toBe(90_000);
    expect(opened?.complete).toBe(false);
    expect(JSON.stringify(opened)).not.toContain("DISULFIRAM");
    expect(JSON.stringify(opened)).not.toContain("CAT");
  });

  it("does not blank out a grid this browser already started or finished", () => {
    const fresh = game({});
    expect(canReplaceSavedGame(OWN, fresh)).toBe(false);
    expect(canReplaceSavedGame(game({ complete: true, fills: { "0,0": "Q" } }), fresh)).toBe(false);
    expect(canReplaceSavedGame(OWN, game({ fills: { "0,0": "A", "0,1": "B", "0,2": "C" }, started: true }))).toBe(
      true,
    );
    expect(canReplaceSavedGame(undefined, fresh)).toBe(true);
  });

  it("keeps answers out of the share link, the share text, and the public image", () => {
    const puzzle = puzzlesFor("naplex")[0]!;
    const pub = toPublicPuzzle("naplex", "2026-11-13", NOW);
    expect(pub).not.toBeNull();
    const url = new URL(pub!.shareUrl);
    expect(url.pathname).toBe("/crossword/naplex/2026-11-13");
    expect(url.search).toBe("");
    expect(url.hash).toBe("");
    expect(shareLocationSeedsGrid(url.search)).toBe(false);

    const text = spoilerFreeShareText({
      boardLabel: pub!.spokenName,
      dateLabel: "November 13, 2026",
      elapsedLabel: "4:12",
      streak: 3,
      hinted: false,
      complete: true,
      marks: puzzle.slots.map(() => "clean"),
      challengeUrl: pub!.shareUrl,
    });
    const challenge = challengeText({
      boardLabel: pub!.spokenName,
      dateLabel: "November 13, 2026",
      challengeUrl: pub!.shareUrl,
    });
    const mask = JSON.stringify(maskFromGrid(puzzle.grid));
    const card = JSON.stringify({ cells: pub!.cells, hints: {} });
    for (const slot of puzzle.slots) {
      expect(pub!.shareUrl.toUpperCase()).not.toContain(slot.answer);
      expect(text.toUpperCase()).not.toContain(slot.answer);
      expect(challenge.toUpperCase()).not.toContain(slot.answer);
      expect(mask).not.toContain(slot.answer);
      expect(card.toUpperCase()).not.toContain(slot.answer);
    }
    expect(mask).not.toMatch(/[A-Z]/);

    for (const file of [
      "src/app/(marketing)/crossword/[board]/[date]/page.tsx",
      "src/app/(marketing)/crossword/[board]/[date]/opengraph-image/route.tsx",
      "src/app/(marketing)/crossword/[board]/[date]/square-image/route.tsx",
    ]) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toContain("searchParams");
      expect(source, file).not.toContain("fills");
    }
  });
});
