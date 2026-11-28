/**
 * Answer key for Daily Vitals. Do not import this module from a client
 * component. The word and the why stay here until a guess finishes the case.
 *
 * To add a case, append an object to src/data/daily-vitals/puzzles.json:
 * id, board (nclex | naplex | pance | aanp-fnp), word (5–8 letters),
 * clue, prompt, and a two-sentence explanation.
 * The Chicago date picks puzzles[(days since 2024-01-01 + PUZZLE_SHIFT) % length].
 * Adding items changes that remainder, so check puzzleForDate for dates you
 * care about. Index 27 is the juice case, which lands on 2026-11-28.
 */

import { boardMark, legalLinesFor, practiceHref, trialHref, trialNote } from "@/lib/daily-vitals/boards";
import { dayIndexFromIso, todayIsoCentral } from "@/lib/daily-vitals/schedule";
import type { DailyVitalsFile, DailyVitalsPuzzle, PublicDailyVitals } from "@/lib/daily-vitals/types";
import { formatDailyVitalsDate, DAILY_VITALS_SHARE_LABEL } from "@/lib/daily-vitals/schedule";
import raw from "@/data/daily-vitals/puzzles.json";

const data = raw as DailyVitalsFile;

/**
 * 2026-11-28 is day index 1062 from 2024-01-01, and 1062 % 30 is 12.
 * Shift 15 places that date on index 27 (Day 28), the juice case.
 */
export const PUZZLE_SHIFT = 15;

export const DAILY_VITALS_VERSION = data.version;
export const DAILY_VITALS_REVIEW = data.review;

export function allPuzzles(): DailyVitalsPuzzle[] {
  return data.puzzles;
}

export function puzzleIndexForDate(dateIso: string, now = new Date()): number | null {
  const index = dayIndexFromIso(dateIso, now);
  const list = allPuzzles();
  if (index === null || list.length === 0) return null;
  return (index + PUZZLE_SHIFT) % list.length;
}

export function puzzleForDate(dateIso: string, now = new Date()): DailyVitalsPuzzle | null {
  const index = puzzleIndexForDate(dateIso, now);
  if (index === null) return null;
  return allPuzzles()[index] ?? null;
}

export function toPublicPuzzle(dateIso: string, now = new Date()): PublicDailyVitals | null {
  const index = puzzleIndexForDate(dateIso, now);
  const puzzle = index === null ? null : allPuzzles()[index];
  if (!puzzle || index === null) return null;
  const mark = boardMark(puzzle.board);
  return {
    id: puzzle.id,
    date: dateIso,
    dayNumber: index + 1,
    board: puzzle.board,
    boardLabel: mark.label,
    clue: puzzle.clue,
    prompt: puzzle.prompt,
    length: puzzle.word.length,
    practiceHref: practiceHref(puzzle.board),
    trialHref: trialHref(puzzle.board),
    trialNote: trialNote(),
    dateLabel: formatDailyVitalsDate(dateIso),
    sharePath: DAILY_VITALS_SHARE_LABEL,
    legalLines: legalLinesFor(puzzle.board),
    archive: dateIso !== todayIsoCentral(now),
  };
}
