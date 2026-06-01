import type { ExamQuestion } from "../../ai";
import type { ValidationInput, ValidationResult } from "../types";
import {
  isDrugCenteredQuestion,
  isDrugProfileComplete,
  normalizeDrugProfile,
} from "../../engine/prompts/pharm-drug-profile";
import { scoreNaplexBankItem } from "../../engine/polish/naplex-polish";
import type { BankItem } from "../../question-bank";

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

    const stem = `${q.vignette ?? ""} ${q.question}`;
    if (stem.length < 80) {
      warnings.push(`Question ${q.id}: stem may be too brief for NAPLEX clinical application.`);
    }

    if (q.explanation.length < 120) {
      warnings.push(`Question ${q.id}: rationale should be more detailed (counseling/monitoring/distractors).`);
    }

    const distractorCount = Object.keys(q.distractorRationale ?? {}).length;
    if (distractorCount < 2) {
      warnings.push(`Question ${q.id}: include distractorRationale for incorrect options.`);
    }

    if (/counsel|dispens|patient/i.test(stem) && !/counsel|monitor|adher|teach|inform/i.test(q.explanation)) {
      warnings.push(`Question ${q.id}: counseling-focused stem should include counseling in rationale.`);
    }

    const profile = normalizeDrugProfile(q.drugProfile);
    if (isDrugCenteredQuestion(q) || input.subjectId?.includes("pharmacology") || input.subjectId?.includes("-rx")) {
      if (!profile) {
        warnings.push(`Question ${q.id}: missing drugProfile for NAPLEX pharmacology item.`);
      } else if (!isDrugProfileComplete(profile)) {
        warnings.push(
          `Question ${q.id}: incomplete drugProfile — need generic, brandNames, class, indication, conditionSymptoms, conditionEtiology, majorSideEffects, monitoring.`
        );
      } else if (!q.explanation.toLowerCase().includes(profile.generic.toLowerCase())) {
        warnings.push(`Question ${q.id}: rationale should name ${profile.generic}.`);
      }
    }
  }

  if (input.subjectId === "compounding-calculations") {
    const hasNumbers = input.exam.questions.some((q) => /\d/.test(q.question));
    if (!hasNumbers) {
      warnings.push("Calculations subject: stems should include numeric data.");
    }
  }

  const withProfile = input.exam.questions.filter((q) => q.drugProfile?.generic).length;
  const pct = input.exam.questions.length ? withProfile / input.exam.questions.length : 0;
  if (pct < 0.7 && input.exam.questions.length >= 5) {
    warnings.push(
      `NAPLEX set: only ${Math.round(pct * 100)}% of items include drugProfile (target ≥85%).`
    );
  }

  return { valid: errors.length === 0, errors, warnings };
}

/** Quality score for generated NAPLEX items (0–1). */
export function scorePharmacyQuestionQuality(q: ExamQuestion): number {
  let score = 0.45;
  const stem = `${q.vignette ?? ""} ${q.question}`;

  if (stem.length > 150) score += 0.1;
  if (/\d{1,3}[-‑]year|patient|pharmacist|mg|BP|creatinine|allerg/i.test(stem)) score += 0.08;

  if (q.explanation.length > 180) score += 0.12;
  if (Object.keys(q.distractorRationale ?? {}).length >= 3) score += 0.1;
  if (q.clinicalReasoning && q.clinicalReasoning.length > 50) score += 0.06;

  const profile = normalizeDrugProfile(q.drugProfile);
  if (profile && isDrugProfileComplete(profile)) score += 0.12;
  if (profile && q.explanation.toLowerCase().includes(profile.generic.toLowerCase())) score += 0.04;

  if (/counsel|monitor|adher|MTM|interaction/i.test(q.explanation)) score += 0.05;

  return Math.min(1, score);
}

/** Score a stored bank item (sync/polish pipeline). */
export function scorePharmacyBankItem(item: BankItem): number {
  return scoreNaplexBankItem(item);
}
