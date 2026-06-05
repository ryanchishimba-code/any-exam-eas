import type { DifficultyContext, DifficultyEvaluation } from "../types";

export async function evaluateMpjeDifficulty(
  ctx: DifficultyContext
): Promise<DifficultyEvaluation> {
  const adjustments: string[] = [];
  if (ctx.subjectId === "state-practice-act") {
    adjustments.push("Include state-specific practice act and board rule application.");
  }
  if (ctx.subjectId === "uniform-mpje") {
    adjustments.push("Emphasize uniform multistate jurisprudence (UMPJE) patterns.");
  }
  return {
    score: ctx.difficulty === "hard" ? 0.8 : 0.52,
    rationale: "MPJE difficulty weights federal vs state law conflict and scenario application.",
    adjustments,
  };
}
