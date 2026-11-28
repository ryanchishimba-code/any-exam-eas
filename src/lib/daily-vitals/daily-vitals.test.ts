import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { puzzleForDate, PUZZLE_SHIFT, toPublicPuzzle, allPuzzles } from "@/lib/daily-vitals/bank";
import { EDUCATIONAL_LINE, legalLinesFor } from "@/lib/daily-vitals/boards";
import { gradeGuess } from "@/lib/daily-vitals/grade";
import { isAllowedWord } from "@/lib/daily-vitals/lexicon";
import { DAILY_VITALS_DESCRIPTION, DAILY_VITALS_TITLE } from "@/lib/daily-vitals/metadata";
import { scoreGuess } from "@/lib/daily-vitals/score";
import { dailyVitalsShareText } from "@/lib/daily-vitals/share-text";
import { DAILY_VITALS_SHARE_LABEL, DAILY_VITALS_SHARE_URL, todayIsoCentral } from "@/lib/daily-vitals/schedule";
import { nextStreak, STREAK_RULE, visibleStreak } from "@/lib/daily-vitals/streak";
import { validatePuzzle } from "@/lib/daily-vitals/validate";
import { monitorReading } from "@/lib/daily-vitals/vitals";
import { todayIsoCentral as qotdToday } from "@/lib/demo/qotd-public";
import { SEO_DESC_MAX, SEO_DESC_MIN, SEO_TITLE_MAX, SEO_TITLE_MIN } from "@/lib/seo/meta-budget";

const NOW = new Date("2026-11-28T18:00:00.000Z");
const BANNED = ["wor", "dle"].join("");

function sourceFiles(dir: string): string[] {
  const abs = path.join(process.cwd(), dir);
  const out: string[] = [];
  for (const name of readdirSync(abs)) {
    const full = path.join(abs, name);
    if (statSync(full).isDirectory()) out.push(...sourceFiles(path.relative(process.cwd(), full)));
    else if (/\.(ts|tsx|css|json)$/.test(name) && !name.endsWith(".test.ts")) {
        out.push(path.relative(process.cwd(), full));
      }
  }
  return out;
}

describe("daily vitals bank", () => {
  it("ships 30 reviewed nursing cases and keeps the juice case on 28 Nov 2026", () => {
    const puzzles = allPuzzles();
    expect(puzzles).toHaveLength(30);
    expect(PUZZLE_SHIFT).toBe(15);
    const words = new Set<string>();
    for (const puzzle of puzzles) {
      expect(validatePuzzle(puzzle), puzzle.id).toEqual([]);
      expect(words.has(puzzle.word), puzzle.word).toBe(false);
      words.add(puzzle.word);
      expect(puzzle.board).toBe("nclex");
    }
    const before = new Date("2026-11-28T05:59:00.000Z");
    const after = new Date("2026-11-28T06:00:00.000Z");
    expect(todayIsoCentral(before)).toBe("2026-11-27");
    expect(todayIsoCentral(after)).toBe("2026-11-28");
    expect(todayIsoCentral(after)).toBe(qotdToday(after));
    const juice = puzzleForDate("2026-11-28", NOW);
    expect(juice?.word).toBe("JUICE");
    expect(juice?.id).toBe("dv-28");
    expect(juice?.clue).toBe(
      "A 28-year-old with type 1 diabetes is found pale and clammy. The lunch tray is untouched.",
    );
    expect(juice?.prompt).toBe("What do you give first?");
    expect(juice?.explanation).toBe(
      "Glucose fell to 48 mg/dL after insulin and a missed meal. Give 4 oz juice, then recheck in 15 minutes.",
    );
    expect(puzzleForDate("2026-11-27", NOW)?.word).not.toBe("JUICE");
    expect(puzzleForDate("2099-01-01", NOW)).toBeNull();
  });

  it("hides the word until the case is finished", () => {
    const pub = toPublicPuzzle("2026-11-28", NOW);
    expect(pub?.dayNumber).toBe(28);
    expect(pub?.boardLabel).toBe("NCLEX®");
    expect(pub?.length).toBe(5);
    expect(pub?.archive).toBe(false);
    expect(pub?.trialNote).toBe("5-day free trial · No card needed");
    expect(pub?.practiceHref).toBe("/free-practice-questions#nclex");
    expect(pub?.legalLines[0]).toBe(EDUCATIONAL_LINE);
    expect(pub?.legalLines[1]).toContain("NCSBN");
    const payload = JSON.stringify(pub).toUpperCase();
    expect(payload).not.toContain("JUICE");
    expect(payload).not.toContain("EXPLANATION");
    const early = gradeGuess({ date: "2026-11-28", guess: "WATER", attempt: 1, now: NOW });
    expect(early.ok).toBe(true);
    if (early.ok) {
      expect(early.marks).toEqual(["absent", "absent", "absent", "present", "absent"]);
      expect(early.word).toBeUndefined();
      expect(early.explanation).toBeUndefined();
    }
    const won = gradeGuess({ date: "2026-11-28", guess: "JUICE", attempt: 3, now: NOW });
    expect(won.ok && won.solved && won.word).toBe("JUICE");
    const missed = gradeGuess({ date: "2026-11-28", guess: "WATER", attempt: 6, now: NOW });
    expect(missed.ok && missed.lost && missed.explanation).toContain("4 oz juice");
    expect(gradeGuess({ date: "2026-11-28", guess: "ZZZZZ", attempt: 1, now: NOW })).toEqual({
      ok: false,
      message: "That is not in the word list.",
    });
  });

  it("colors the juice path the way the screen shows it", () => {
    const water = scoreGuess("WATER", "JUICE");
    const guide = scoreGuess("GUIDE", "JUICE");
    expect(water).toEqual(["absent", "absent", "absent", "present", "absent"]);
    expect(guide).toEqual(["absent", "correct", "correct", "absent", "correct"]);
    expect(scoreGuess("EELEE", "SWEET")).toEqual(["present", "absent", "absent", "correct", "absent"]);
    expect(monitorReading([], 5, false)).toEqual({ hr: 128, label: "Unstable", tone: "alarm" });
    expect(monitorReading([water, guide], 5, false)).toEqual({ hr: 104, label: "Improving", tone: "warn" });
    expect(monitorReading([water, guide, scoreGuess("JUICE", "JUICE")], 5, true)).toEqual({
      hr: 86,
      label: "Stable",
      tone: "ok",
    });
  });

  it("accepts real words and the clinical answers", () => {
    expect(isAllowedWord("WATER")).toBe(true);
    expect(isAllowedWord("GUIDE")).toBe(true);
    expect(isAllowedWord("JUICE")).toBe(true);
    expect(isAllowedWord("HEPARIN")).toBe(true);
    expect(isAllowedWord("ZZZZZ")).toBe(false);
    for (const puzzle of allPuzzles()) expect(isAllowedWord(puzzle.word)).toBe(true);
  });

  it("writes spoiler-free share text and a device streak", () => {
    const text = dailyVitalsShareText({ solved: true, guessesUsed: 3, streak: 7 });
    expect(text).toContain("Saved in 3/6");
    expect(text).toContain("Can you beat me?");
    expect(text).toContain(DAILY_VITALS_SHARE_URL);
    expect(text).toContain(DAILY_VITALS_SHARE_LABEL);
    expect(text.toUpperCase()).not.toContain("JUICE");
    expect(text.toLowerCase()).not.toContain(BANNED);
    expect(dailyVitalsShareText({ solved: false, guessesUsed: 6, streak: 0 })).toContain("Missed in 6/6");
    expect(text.toLowerCase()).not.toContain("sample result");
    expect(readFileSync("src/lib/daily-vitals/share-card.ts", "utf8").toLowerCase()).not.toContain("sample result");
    expect(readFileSync("src/lib/daily-vitals/share-text.ts", "utf8").toLowerCase()).not.toContain("sample result");
  });

  it("keeps a streak after a miss and breaks it only when a day is skipped", () => {
    expect(visibleStreak(undefined, "2026-11-28")).toBe(0);
    const firstDay = nextStreak(undefined, "2026-11-26");
    expect(firstDay).toEqual({ last: "2026-11-26", streak: 1 });
    const afterMiss = nextStreak({ last: "2026-11-27", streak: 6 }, "2026-11-28");
    expect(afterMiss).toEqual({ last: "2026-11-28", streak: 7 });
    expect(visibleStreak(afterMiss, "2026-11-28")).toBe(7);
    expect(nextStreak(afterMiss, "2026-11-28")).toEqual(afterMiss);
    const skipped = nextStreak({ last: "2026-11-26", streak: 6 }, "2026-11-28");
    expect(skipped).toEqual({ last: "2026-11-28", streak: 1 });
    expect(visibleStreak({ last: "2026-11-26", streak: 6 }, "2026-11-28")).toBe(0);
    expect(visibleStreak({ last: "2026-11-27", streak: 6 }, "2026-11-28")).toBe(6);
  });

  it("keeps the title, description, and other board marks inside the rules", () => {
    expect(DAILY_VITALS_TITLE.length).toBeGreaterThanOrEqual(SEO_TITLE_MIN);
    expect(DAILY_VITALS_TITLE.length).toBeLessThanOrEqual(SEO_TITLE_MAX);
    expect(DAILY_VITALS_DESCRIPTION.length).toBeGreaterThanOrEqual(SEO_DESC_MIN);
    expect(DAILY_VITALS_DESCRIPTION.length).toBeLessThanOrEqual(SEO_DESC_MAX);
    expect(DAILY_VITALS_DESCRIPTION.toLowerCase()).not.toContain("you will pass");
    expect(legalLinesFor("naplex")[1]).toContain("NABP");
    expect(legalLinesFor("pance")[1]).toContain("NCCPA");
    expect(legalLinesFor("aanp-fnp")[1]).toContain("AANP");
    expect(legalLinesFor("nclex").join(" ")).toContain(EDUCATIONAL_LINE);
  });

  it("does not use the other game's name, colors, or answer module in the client", () => {
    const files = [
      ...sourceFiles("src/lib/daily-vitals"),
      ...sourceFiles("src/components/daily-vitals"),
      ...sourceFiles("src/app/(marketing)/daily-vitals"),
      ...sourceFiles("src/app/api/daily-vitals"),
      "src/data/daily-vitals/puzzles.json",
    ];
    const player = readFileSync("src/components/daily-vitals/DailyVitalsPlayer.tsx", "utf8");
    expect(player).not.toContain("@/lib/daily-vitals/bank");
    expect(player).not.toContain("puzzles.json");
    expect(player).toContain("STREAK_RULE");
    expect(player).toContain("data.solved || data.lost");
    expect(STREAK_RULE).toContain("saved or missed");
    expect(STREAK_RULE).toContain("Skipping a day breaks it");
    for (const file of files) {
      const source = readFileSync(file, "utf8").toLowerCase();
      expect(source, file).not.toContain(BANNED);
      expect(source, file).not.toContain("#6aaa64");
      expect(source, file).not.toContain("#c9b458");
      expect(source, file).not.toContain("#787c7e");
    }
  });
});
