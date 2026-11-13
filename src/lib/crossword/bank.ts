/**
 * Answer key for the daily crossword. Do not import this module from a
 * client component — the letters live here, not in the page HTML for today.
 */

import { boardProfile, isCrosswordBoard, quizHref, signupHref } from "@/lib/crossword/boards";
import {
  crosswordDatedPath,
  dayIndexFromIso,
  todayIsoCentral,
} from "@/lib/crossword/schedule";
import type {
  CrosswordFile,
  CrosswordKey,
  CrosswordPuzzle,
  PublicCell,
  PublicPuzzle,
} from "@/lib/crossword/types";
import type { ExamSlug } from "@/types/edtech";
import { getSiteUrl } from "@/lib/seo";
import raw from "@/data/crossword/puzzles.json";

const data = raw as CrosswordFile;

export const CROSSWORD_VERSION = data.version;
export const CROSSWORD_REVIEW = data.review;

export function puzzlesFor(board: ExamSlug): CrosswordPuzzle[] {
  return data.boards[board] ?? [];
}

export function puzzleForDate(board: ExamSlug, dateIso: string, now = new Date()): CrosswordPuzzle | null {
  const index = dayIndexFromIso(dateIso, now);
  const list = puzzlesFor(board);
  if (index === null || list.length === 0) return null;
  return list[index % list.length] ?? null;
}

export function toPublicPuzzle(board: ExamSlug, dateIso: string, now = new Date()): PublicPuzzle | null {
  if (!isCrosswordBoard(board)) return null;
  const puzzle = puzzleForDate(board, dateIso, now);
  if (!puzzle) return null;
  const profile = boardProfile(board);
  const numbers = new Map<string, number>();
  for (const slot of puzzle.slots) {
    const key = `${slot.r},${slot.c}`;
    if (!numbers.has(key)) numbers.set(key, slot.num);
  }
  const cells: PublicCell[][] = puzzle.grid.map((row, r) =>
    [...row].map((char, c) => {
      const block = char === "#";
      const num = numbers.get(`${r},${c}`);
      return block ? { block: true } : num ? { block: false, num } : { block: false };
    }),
  );
  return {
    id: puzzle.id,
    board,
    date: dateIso,
    rows: puzzle.rows,
    cols: puzzle.cols,
    cells,
    slots: puzzle.slots.map((slot) => ({
      dir: slot.dir,
      r: slot.r,
      c: slot.c,
      num: slot.num,
      len: slot.answer.length,
      clue: slot.clue,
      topic: slot.topic,
    })),
    shareUrl: `${getSiteUrl()}${crosswordDatedPath(board, dateIso)}`,
    quizHref: quizHref(board),
    signupHref: signupHref(board),
    boardLabel: profile.shortName,
    examName: profile.examName,
    archive: dateIso !== todayIsoCentral(now),
  };
}

export function toKey(board: ExamSlug, dateIso: string, now = new Date()): CrosswordKey | null {
  const puzzle = puzzleForDate(board, dateIso, now);
  if (!puzzle) return null;
  return {
    slots: puzzle.slots.map((slot) => ({
      dir: slot.dir,
      num: slot.num,
      answer: slot.answer,
      rationale: slot.rationale,
      topic: slot.topic,
    })),
  };
}

export function archiveAnswers(board: ExamSlug, dateIso: string, now = new Date()) {
  const puzzle = puzzleForDate(board, dateIso, now);
  if (!puzzle || dateIso === todayIsoCentral(now)) return null;
  return puzzle.slots.map((slot) => ({
    label: `${slot.num} ${slot.dir === "across" ? "Across" : "Down"}`,
    answer: slot.answer,
    clue: slot.clue,
    rationale: slot.rationale,
  }));
}
