export type ShareMark = "clean" | "hint" | "open";

export function shareEmoji(marks: ShareMark[]): string {
  return marks
    .map((mark) => (mark === "clean" ? "🟩" : mark === "hint" ? "🟨" : "⬛"))
    .join("");
}

export function spoilerFreeShareText(input: {
  boardLabel: string;
  dateLabel: string;
  elapsedLabel: string | null;
  streak: number;
  hinted: boolean;
  complete: boolean;
  marks: ShareMark[];
  challengeUrl: string;
}): string {
  const lines = [
    `AnyExamEasy ${input.boardLabel} Crossword`,
    input.dateLabel,
    input.complete && input.elapsedLabel ? `Completed in ${input.elapsedLabel}` : "Still solving",
    `${input.streak}-day streak`,
    input.hinted ? "Used hints" : "No hints",
    shareEmoji(input.marks),
    "",
    "Spoiler-free result. No answers included.",
    `Challenge a friend: ${input.challengeUrl}`,
  ];
  return lines.join("\n");
}

export function challengeText(input: {
  boardLabel: string;
  dateLabel: string;
  challengeUrl: string;
}): string {
  return `Can you solve the ${input.boardLabel} daily crossword for ${input.dateLabel}? Same puzzle, no spoilers.\n${input.challengeUrl}`;
}
