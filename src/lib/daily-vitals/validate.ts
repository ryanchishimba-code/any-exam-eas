import type { DailyVitalsPuzzle } from "@/lib/daily-vitals/types";
import { isDailyVitalsBoard } from "@/lib/daily-vitals/boards";

const BANNED = /\b(uworld|archer|kaplan|hurst|picmonic|rxprep)\b/i;

export function validatePuzzle(puzzle: DailyVitalsPuzzle): string[] {
  const issues: string[] = [];
  if (!isDailyVitalsBoard(puzzle.board)) issues.push("board");
  if (!/^[A-Z]{5,7}$/.test(puzzle.word)) issues.push("word");
  if (puzzle.clue.trim().length < 20) issues.push("clue");
  if (puzzle.prompt.trim().length < 8) issues.push("prompt");
  const sentences = puzzle.explanation.split(/(?<=[.])\s+/).filter(Boolean);
  if (sentences.length < 2 || sentences.length > 3) issues.push("explanation");
  if (puzzle.clue.toUpperCase().includes(puzzle.word) || puzzle.prompt.toUpperCase().includes(puzzle.word)) {
    issues.push("spoiler");
  }
  const blob = `${puzzle.clue} ${puzzle.prompt} ${puzzle.explanation}`;
  if (BANNED.test(blob)) issues.push("competitor");
  if (/you will pass|guarantee a pass|pass promise/i.test(blob)) issues.push("pass-promise");
  return issues;
}
