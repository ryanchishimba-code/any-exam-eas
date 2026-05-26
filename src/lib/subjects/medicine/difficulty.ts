import type { DifficultyContext, DifficultyEvaluation } from "../types";

/** Medicine-specific difficulty: clinical reasoning depth, DDx complexity. */
export async function evaluateMedicineDifficulty(
  ctx: DifficultyContext
): Promise<DifficultyEvaluation> {
  const base =
    ctx.difficulty === "hard" ? 0.85 : ctx.difficulty === "easy" ? 0.35 : 0.6;

  const adjustments: string[] = [];

  if (ctx.difficulty === "hard") {
    adjustments.push(
      "Include multi-step clinical reasoning, competing diagnoses, and interpretation of labs/imaging when appropriate."
    );
  }
  if (ctx.difficulty === "easy") {
    adjustments.push(
      "Focus on foundational mechanisms, classic presentations, and single best facts."
    );
  }

  if (ctx.subjectId === "pharmacology" || ctx.subjectId === "emergency-medicine") {
    adjustments.push("Emphasize safety, contraindications, and first-line therapy selection.");
  }

  return {
    score: base,
    rationale: `Medicine difficulty (${ctx.difficulty}) weighted for clinical reasoning depth.`,
    adjustments,
  };
}
