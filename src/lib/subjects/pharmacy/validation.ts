import type { ValidationInput, ValidationResult } from "../types";

export function validatePharmacyExam(input: ValidationInput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const q of input.exam.questions) {
    if (!q.options || q.options.length !== 4) {
      errors.push(`Question ${q.id}: must have exactly 4 options.`);
    }
    if (q.options && !q.options.includes(q.correctAnswer)) {
      errors.push(`Question ${q.id}: correctAnswer must match an option.`);
    }
  }

  if (input.subjectId === "compounding-calculations") {
    const hasNumbers = input.exam.questions.some((q) => /\d/.test(q.question));
    if (!hasNumbers) {
      warnings.push("Calculations subject: stems should include numeric data.");
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}
