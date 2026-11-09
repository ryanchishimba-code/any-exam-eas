/**
 * Step 2 CK rows a student can be served.
 *
 * Blank `stepLevel` is part of that route. A legacy `stepLevel = 'step3'`
 * row filed on `usmle-step-2` is not. Comparing `stepLevel = 'step3'` and
 * then negating it drops the blank rows: NULL compared with 'step3' is
 * unknown, and NOT unknown is still unknown, so the filter excludes them.
 */
export const USMLE_STEP2_SERVE_SQL = `AND (
  "fieldId" <> 'usmle-step-2'
  OR "stepLevel" IS NULL
  OR "stepLevel" <> 'step3'
)`;

export type Step2ServeRow = {
  fieldId: string;
  active: boolean;
  qaPassed: boolean;
  stepLevel: string | null;
};

/** Same include/exclude rules as `USMLE_STEP2_SERVE_SQL`, plus active and QA. */
export function step2ServeRowCounts(row: Step2ServeRow): boolean {
  if (!row.active || !row.qaPassed) return false;
  if (row.fieldId !== "usmle-step-2") return true;
  return row.stepLevel == null || row.stepLevel !== "step3";
}
