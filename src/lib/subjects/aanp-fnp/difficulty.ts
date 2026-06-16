import type { ExamQuestion } from "@/lib/ai";

export function evaluateAanpFnpDifficulty(q: ExamQuestion): "easy" | "medium" | "hard" {
  const stem = `${q.vignette ?? ""} ${q.question}`.length;
  if (stem > 400) return "hard";
  if (stem > 220) return "medium";
  return "easy";
}
