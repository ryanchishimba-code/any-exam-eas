import type { ValidationInput, ValidationResult } from "../types";

const CLINICAL_SAFETY_TERMS = [
  "contraindicated",
  "first-line",
  "stabilize",
  "airway",
  "anaphylaxis",
];

/** Subject-aware validation for medical exams (not shared core logic). */
export function validateMedicineExam(input: ValidationInput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const q of input.exam.questions) {
    if (!q.options || q.options.length !== 4) {
      errors.push(`Question ${q.id}: must have exactly 4 options.`);
    }
    if (q.options && !q.options.includes(q.correctAnswer)) {
      errors.push(`Question ${q.id}: correctAnswer must match an option verbatim.`);
    }
    const unique = new Set(q.options?.map((o) => o.trim().toLowerCase()));
    if (unique.size < 4) {
      warnings.push(`Question ${q.id}: duplicate or near-duplicate options.`);
    }
    if (q.question.length < 20) {
      warnings.push(`Question ${q.id}: stem may be too short for clinical quality.`);
    }
  }

  const hasSafety = input.exam.questions.some((q) =>
    CLINICAL_SAFETY_TERMS.some((t) => q.question.toLowerCase().includes(t))
  );
  if (
    input.subjectId === "emergency-medicine" ||
    input.subjectId === "pharmacology"
  ) {
    if (!hasSafety && input.exam.questions.length > 5) {
      warnings.push("Consider including at least one patient-safety or contraindication item.");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
