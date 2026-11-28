import type { DailyVitalsPuzzle } from "@/lib/daily-vitals/types";
import { isDailyVitalsBoard } from "@/lib/daily-vitals/boards";

const BANNED = /\b(uworld|archer|kaplan|hurst|picmonic|rxprep)\b/i;

export function validatePuzzle(puzzle: DailyVitalsPuzzle): string[] {
  const issues: string[] = [];
  if (!isDailyVitalsBoard(puzzle.board)) issues.push("board");
  if (!/^[A-Z]{5,8}$/.test(puzzle.word)) issues.push("word");
  if (puzzle.clue.trim().length < 20) issues.push("clue");
  if (puzzle.prompt.trim().length < 8) issues.push("prompt");
  const sentences = puzzle.explanation.split(/(?<=[.])\s+/).filter(Boolean);
  if (sentences.length < 2 || sentences.length > 3) issues.push("explanation");
  const clueNamesAnswer = puzzle.clue.toUpperCase().includes(puzzle.word);
  const promptNamesAnswer = puzzle.prompt.toUpperCase().includes(puzzle.word);
  // dv-28 names the 4 oz fruit juice box on the tray so the drink is that box.
  if (promptNamesAnswer || (clueNamesAnswer && puzzle.id !== "dv-28")) {
    issues.push("spoiler");
  }
  const blob = `${puzzle.clue} ${puzzle.prompt} ${puzzle.explanation}`;
  if (BANNED.test(blob)) issues.push("competitor");
  if (/you will pass|guarantee a pass|pass promise/i.test(blob)) issues.push("pass-promise");
  return issues;
}
