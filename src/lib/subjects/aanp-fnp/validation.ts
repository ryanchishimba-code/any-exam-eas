import type { ValidationInput, ValidationResult } from "../types";

export function validateAanpFnpExam(input: ValidationInput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (input.exam.questions.length === 0) {
    errors.push("empty_exam");
  }

  for (const q of input.exam.questions) {
    if (!q.vignette?.trim()) {
      warnings.push(`Question ${q.id}: missing clinical vignette.`);
    }
    if ((q.options?.length ?? 0) < 4 && q.type !== "select_all") {
      errors.push(`Question ${q.id}: needs at least 4 options.`);
    }
    if (q.options && !q.options.includes(q.correctAnswer)) {
      errors.push(`Question ${q.id}: correctAnswer must match an option.`);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}
