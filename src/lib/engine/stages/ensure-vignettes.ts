import type { ExamQuestion, GeneratedExam } from "@/lib/ai";
import {
  ensureClinicalVignette,
  hasOrphanDeicticStem,
  isVignetteRich,
  validateClinicalVignette,
} from "@/lib/engine/prompts/vignette";

/** Enforce vignette + lead-in structure on every generated question before enrichment. */
export function ensureVignettesOnExam(exam: GeneratedExam): GeneratedExam {
  return {
    ...exam,
    questions: exam.questions.map((q, idx) => ensureVignetteOnQuestion(q, idx)),
  };
}

function ensureVignetteOnQuestion(q: ExamQuestion, idx: number): ExamQuestion {
  const repaired = ensureClinicalVignette({ ...q, id: idx + 1 });
  const issues = validateClinicalVignette(repaired);

  if (issues.length > 0) {
    const tag = "vignette-qa";
    repaired.tags = [...new Set([...(repaired.tags ?? []), tag])];
  }

  if (hasOrphanDeicticStem(repaired) || !repaired.vignette || !isVignetteRich(repaired.vignette)) {
    repaired.highYield = repaired.highYield ?? true;
  }

  return repaired;
}
