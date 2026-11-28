import { puzzleForDate } from "@/lib/daily-vitals/bank";
import { isAllowedWord } from "@/lib/daily-vitals/lexicon";
import { guessSolved, scoreGuess } from "@/lib/daily-vitals/score";
import { DAILY_VITALS_TRIES } from "@/lib/daily-vitals/vitals";
import type { TileMark } from "@/lib/daily-vitals/types";

export type GradeResult =
  | { ok: false; message: string }
  | {
      ok: true;
      marks: TileMark[];
      solved: boolean;
      lost: boolean;
      word?: string;
      explanation?: string;
    };

export function gradeGuess(input: {
  date: string;
  guess: string;
  attempt: number;
  now?: Date;
}): GradeResult {
  const puzzle = puzzleForDate(input.date, input.now);
  if (!puzzle) return { ok: false, message: "That case is not open." };
  const guess = input.guess.trim().toUpperCase();
  if (!/^[A-Z]+$/.test(guess) || guess.length !== puzzle.word.length) {
    return { ok: false, message: `This case is ${puzzle.word.length} letters.` };
  }
  if (!Number.isInteger(input.attempt) || input.attempt < 1 || input.attempt > DAILY_VITALS_TRIES) {
    return { ok: false, message: "That guess does not fit this case." };
  }
  if (guess !== puzzle.word && !isAllowedWord(guess)) {
    return { ok: false, message: "That is not in the word list." };
  }
  const marks = scoreGuess(guess, puzzle.word);
  const solved = guessSolved(marks);
  const lost = !solved && input.attempt >= DAILY_VITALS_TRIES;
  const reveal = solved || lost;
  return {
    ok: true,
    marks,
    solved,
    lost,
    word: reveal ? puzzle.word : undefined,
    explanation: reveal ? puzzle.explanation : undefined,
  };
}
