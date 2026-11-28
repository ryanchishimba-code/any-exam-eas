import type { TileMark } from "@/lib/daily-vitals/types";

/** Teal is the right spot. Gold is in the word, wrong spot. Extra copies stay navy. */
export function scoreGuess(guess: string, answer: string): TileMark[] {
  const marks: TileMark[] = Array.from({ length: guess.length }, () => "absent");
  const left = new Map<string, number>();
  for (const letter of answer) left.set(letter, (left.get(letter) ?? 0) + 1);

  for (let i = 0; i < guess.length; i += 1) {
    if (guess[i] !== answer[i]) continue;
    marks[i] = "correct";
    left.set(guess[i]!, (left.get(guess[i]!) ?? 0) - 1);
  }

  for (let i = 0; i < guess.length; i += 1) {
    if (marks[i] === "correct") continue;
    const remain = left.get(guess[i]!) ?? 0;
    if (remain > 0) {
      marks[i] = "present";
      left.set(guess[i]!, remain - 1);
    }
  }

  return marks;
}

export function guessSolved(marks: TileMark[]): boolean {
  return marks.length > 0 && marks.every((mark) => mark === "correct");
}
