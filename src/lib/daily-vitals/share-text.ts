import { DAILY_VITALS_SHARE_URL } from "@/lib/daily-vitals/schedule";

/** Spoiler-free text. The colored pattern lives on the image, not in this copy. */
export function dailyVitalsShareText(input: {
  solved: boolean;
  guessesUsed: number;
  streak: number;
}): string {
  const result = input.solved ? `Saved in ${input.guessesUsed}/6` : "Missed in 6/6";
  const lines = ["Daily Vitals", result];
  if (input.streak > 0) lines.push(`${input.streak}-day streak`);
  lines.push("", "Can you beat me?", DAILY_VITALS_SHARE_URL);
  return lines.join("\n");
}
