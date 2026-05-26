import type { DifficultyContext, DifficultyEvaluation } from "../types";

export async function evaluatePharmacyDifficulty(
  ctx: DifficultyContext
): Promise<DifficultyEvaluation> {
  const adjustments: string[] = [];
  if (ctx.subjectId === "compounding-calculations" && ctx.difficulty !== "easy") {
    adjustments.push("Include multi-step pharmacy calculations with unit conversions.");
  }
  return {
    score: ctx.difficulty === "hard" ? 0.82 : 0.5,
    rationale: "NAPLEX difficulty weights calculations and therapeutic reasoning.",
    adjustments,
  };
}
