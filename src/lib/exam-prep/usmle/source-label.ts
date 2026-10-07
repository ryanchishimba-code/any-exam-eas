/**
 * Student-facing outline citation for the sitting the learner is actually in.
 * Step 3 rows were generated with the Step 2 CK prompt, which told the model
 * to cite "USMLE Step 2 CK Content Outline". The sitting still draws
 * `usmle-step-3` rows (legacy Step 3 rows filed on `usmle-step-2` only when
 * `stepLevel` is step3). The source line was the mislabel, not a Step 2 bank.
 */
const STEP_2_CK_OUTLINE = /USMLE Step 2 CK Content Outline/i;

export function sourceLabelForPracticeField(
  label: string | undefined,
  fieldId?: string | null
): string | undefined {
  if (!label) return label;
  if (fieldId !== "usmle-step-3") return label;
  if (!STEP_2_CK_OUTLINE.test(label)) return label;
  return label.replace(/USMLE Step 2 CK Content Outline/gi, "USMLE Step 3 Content Outline");
}
