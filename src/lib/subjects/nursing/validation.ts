import type { ValidationInput, ValidationResult } from "../types";
import {
  isDrugCenteredQuestion,
  isDrugProfileComplete,
  normalizeDrugProfile,
} from "../../engine/prompts/pharm-drug-profile";

export function validateNursingExam(input: ValidationInput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const q of input.exam.questions) {
    if (!q.options || q.options.length !== 4) {
      errors.push(`Question ${q.id}: must have exactly 4 options.`);
    }
    if (q.options && !q.options.includes(q.correctAnswer)) {
      errors.push(`Question ${q.id}: correctAnswer must match an option.`);
    }

    if (input.subjectId === "pharmacology-nursing" || isDrugCenteredQuestion(q)) {
      const profile = normalizeDrugProfile(q.drugProfile);
      if (!profile) {
        warnings.push(`Question ${q.id}: NCLEX pharm item missing drugProfile.`);
      } else if (!isDrugProfileComplete(profile)) {
        warnings.push(`Question ${q.id}: incomplete drugProfile for pharmacology item.`);
      } else if (!profile.nursingConsiderations?.length) {
        warnings.push(`Question ${q.id}: add nursingConsiderations to drugProfile (teaching/monitoring/hold criteria).`);
      }
    }
  }

  const prioritizationStems = input.exam.questions.filter((q) =>
    /first|priority|most appropriate|see first/i.test(q.question)
  );
  if (
    input.subjectId === "management-of-care" &&
    prioritizationStems.length === 0 &&
    input.exam.questions.length > 8
  ) {
    warnings.push("Management of Care: consider adding prioritization-style stems.");
  }

  return { valid: errors.length === 0, errors, warnings };
}
