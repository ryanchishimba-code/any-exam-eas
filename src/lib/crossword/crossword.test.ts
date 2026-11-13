import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { archiveAnswers, CROSSWORD_VERSION, puzzleForDate, puzzlesFor, toPublicPuzzle } from "@/lib/crossword/bank";
import { CROSSWORD_BOARDS, CROSSWORD_PRACTICE_NOTE, boardProfile } from "@/lib/crossword/boards";
import {
  HUB_DESCRIPTION,
  HUB_TITLE,
  crosswordDescription,
  crosswordTitle,
} from "@/lib/crossword/metadata";
import {
  formatCountdown,
  nextChicagoMidnight,
  todayIsoCentral,
} from "@/lib/crossword/schedule";
import { challengeText, spoilerFreeShareText } from "@/lib/crossword/share-text";
import { validatePuzzle, windowRepeats } from "@/lib/crossword/validate";
import { todayIsoCentral as qotdToday } from "@/lib/demo/qotd-public";
import { SEO_DESC_MAX, SEO_DESC_MIN, SEO_TITLE_MAX, SEO_TITLE_MIN } from "@/lib/seo/meta-budget";

const NOW = new Date("2026-11-13T18:00:00.000Z");

describe("crossword bank", () => {
  it("ships a reviewed, versioned bank with 30 days for every board", () => {
    expect(CROSSWORD_VERSION.length).toBeGreaterThan(0);
    expect(CROSSWORD_PRACTICE_NOTE).toContain("not a promise you'll pass");
    for (const board of CROSSWORD_BOARDS) {
      const puzzles = puzzlesFor(board);
      expect(puzzles.length, board).toBeGreaterThanOrEqual(30);
      for (const puzzle of puzzles) {
        expect(validatePuzzle(puzzle), `${board} ${puzzle.id}`).toEqual([]);
      }
      expect(windowRepeats(puzzles, 14), board).toEqual([]);
    }
  });

  it("rolls the puzzle at America/Chicago midnight and hides future answers", () => {
    const before = new Date("2026-11-13T05:59:00.000Z");
    const after = new Date("2026-11-13T06:00:00.000Z");
    expect(todayIsoCentral(before)).toBe("2026-11-12");
    expect(todayIsoCentral(after)).toBe("2026-11-13");
    expect(todayIsoCentral(before)).toBe(qotdToday(before));
    expect(todayIsoCentral(after)).toBe(qotdToday(after));
    expect(puzzleForDate("nclex", "2026-11-12", before)?.id).not.toBe(
      puzzleForDate("nclex", "2026-11-13", after)?.id,
    );
    expect(puzzleForDate("nclex", "2099-01-01", NOW)).toBeNull();
    expect(nextChicagoMidnight(new Date("2026-11-13T12:00:00.000Z"))).toBe(
      Date.parse("2026-11-14T06:00:00.000Z"),
    );
    expect(formatCountdown(65_000)).toBe("0:01:05");
  });

  it("keeps today's letters out of the public payload and reveals past rationales", () => {
    for (const board of CROSSWORD_BOARDS) {
      const today = "2026-11-13";
      const puzzle = puzzleForDate(board, today, NOW);
      const pub = toPublicPuzzle(board, today, NOW);
      expect(puzzle).not.toBeNull();
      expect(pub?.archive).toBe(false);
      expect(pub?.slots.every((slot) => !("answer" in slot) && !("rationale" in slot))).toBe(true);
      expect(archiveAnswers(board, today, NOW)).toBeNull();
      const pastPuzzle = puzzleForDate(board, "2026-11-12", NOW);
      const past = archiveAnswers(board, "2026-11-12", NOW);
      expect(past?.length).toBe(pastPuzzle?.slots.length);
      expect(past?.[0]?.rationale.length).toBeGreaterThan(10);
    }
  });

  it("writes spoiler-free share text", () => {
    const puzzle = puzzlesFor("nclex")[0]!;
    const text = spoilerFreeShareText({
      boardLabel: "NCLEX",
      dateLabel: "November 13, 2026",
      elapsedLabel: "4:12",
      streak: 3,
      hinted: false,
      complete: true,
      marks: puzzle.slots.map(() => "clean"),
      challengeUrl: "https://example.com/crossword/nclex/2026-11-13",
    });
    const challenge = challengeText({
      boardLabel: "NCLEX",
      dateLabel: "November 13, 2026",
      challengeUrl: "https://example.com/crossword/nclex/2026-11-13",
    });
    for (const slot of puzzle.slots) {
      expect(text.toUpperCase()).not.toContain(slot.answer);
      expect(challenge.toUpperCase()).not.toContain(slot.answer);
    }
    expect(text).toContain("Spoiler-free");
    expect(text).toContain("2026-11-13");
  });

  it("keeps titles and descriptions inside the SEO budget", () => {
    expect(HUB_TITLE.length).toBeGreaterThanOrEqual(SEO_TITLE_MIN);
    expect(HUB_TITLE.length).toBeLessThanOrEqual(SEO_TITLE_MAX);
    expect(HUB_DESCRIPTION.length).toBeGreaterThanOrEqual(SEO_DESC_MIN);
    expect(HUB_DESCRIPTION.length).toBeLessThanOrEqual(SEO_DESC_MAX);
    const labels = ["May 1, 2026", "September 30, 2026", "November 13, 2026"];
    for (const board of CROSSWORD_BOARDS) {
      const profile = boardProfile(board);
      for (const label of labels) {
        const title = crosswordTitle(profile.shortName, label);
        const description = crosswordDescription(profile.shortName, label, profile.focus);
        expect(title.length, title).toBeGreaterThanOrEqual(SEO_TITLE_MIN);
        expect(title.length, title).toBeLessThanOrEqual(SEO_TITLE_MAX);
        expect(description.length, description).toBeGreaterThanOrEqual(SEO_DESC_MIN);
        expect(description.length, description).toBeLessThanOrEqual(SEO_DESC_MAX);
        expect(description.toLowerCase()).not.toContain("you will pass");
      }
    }
  });

  it("does not touch homepages or the signed-in dashboard session", () => {
    const files = [
      "src/app/(marketing)/(with-flagship)/page.tsx",
      "src/app/nclex/page.tsx",
      "src/app/usmle/page.tsx",
      "src/app/naplex/page.tsx",
      "src/app/pance/page.tsx",
      "src/app/aanp-fnp/page.tsx",
      "src/app/npte-pt/page.tsx",
      "src/components/dashboard/TodaySession.tsx",
      "src/app/(app)/dashboard/page.tsx",
      "src/app/(app)/question-bank/page.tsx",
    ];
    for (const file of files) {
      expect(readFileSync(file, "utf8"), file).not.toContain("crossword");
    }
  });
});
