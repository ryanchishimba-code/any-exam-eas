import type { ExamQuestion } from "../../ai";
import type { ValidationInput, ValidationResult } from "../types";
import { validateClinicalVignette } from "../../engine/prompts/vignette";

export function validateMpjeExam(input: ValidationInput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const q of input.exam.questions) {
    if (!q.options || q.options.length !== 4) {
      errors.push(`Question ${q.id}: must have exactly 4 options.`);
    }
    if (q.options && !q.options.includes(q.correctAnswer)) {
      errors.push(`Question ${q.id}: correctAnswer must match an option.`);
    }

    const vignetteIssues = validateClinicalVignette(q);
    for (const issue of vignetteIssues) {
      warnings.push(`Question ${q.id}: ${issue}`);
    }

    const stem = `${q.vignette ?? ""} ${q.question}`;
    if (!/pharmacist|pharmacy|board|DEA|prescription|dispens|law|regulat|controlled|HIPAA|practice act/i.test(stem)) {
      warnings.push(`Question ${q.id}: MPJE items should reference pharmacy law or practice context.`);
    }

    if (q.explanation.length < 100) {
      warnings.push(`Question ${q.id}: rationale should cite legal authority and rule application.`);
    }

    if (!/federal|state|DEA|FDA|HIPAA|board|statute|regulation|practice act/i.test(q.explanation)) {
      warnings.push(`Question ${q.id}: rationale should reference governing law or regulation.`);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function scoreMpjeQuestionQuality(q: ExamQuestion): number {
  let score = 0.5;
  const stem = `${q.vignette ?? ""} ${q.question}`;

  if (stem.length > 120) score += 0.1;
  if (/pharmacist|pharmacy technician|board of pharmacy/i.test(stem)) score += 0.08;
  if (/DEA|schedule|controlled|HIPAA|practice act|board rule/i.test(stem)) score += 0.1;
  if (q.explanation.length > 150) score += 0.08;
  if (/federal|state law|regulation|statute/i.test(q.explanation)) score += 0.08;

  return Math.min(1, score);
}
