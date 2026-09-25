/**
 * SQL mirror of `assessStudentEligibility` for active, qaPassed rows.
 *
 * A restored row (`curationMeta.studentEligibility.status = restored`) stays
 * eligible. Counts and id-exclusion lists append this boolean. It uses
 * unqualified columns of `"QuestionBankItem"`.
 *
 * Keep this in step with `student-eligibility.ts`. The dry-run script reports
 * both and they should agree on the qaPassed pool.
 */

const OPTIONS_JSON = `
CASE
  WHEN left(btrim(options), 1) IN ('{', '[') THEN options::jsonb
  ELSE '{}'::jsonb
END
`;

const OPTION_ARRAY = `
CASE
  WHEN jsonb_typeof((${OPTIONS_JSON})) = 'array' THEN (${OPTIONS_JSON})
  ELSE COALESCE((${OPTIONS_JSON})->'options', '[]'::jsonb)
END
`;

/**
 * Same branches as parseSelectAllCorrectAnswers:
 * pipe-split when `|||` is present, else a whole-option match is 1,
 * else a comma list whose every part is an option, else 1 if non-empty.
 */
const KEYED_COUNT = `
CASE
  WHEN position('|||' IN "correctAnswer") > 0 THEN
    1 + (length("correctAnswer") - length(replace("correctAnswer", '|||', ''))) / 3
  WHEN btrim(COALESCE("correctAnswer", '')) = '' THEN 0
  WHEN EXISTS (
    SELECT 1
    FROM jsonb_array_elements_text((${OPTION_ARRAY})) AS opt(value)
    WHERE lower(btrim(opt.value)) = lower(btrim("correctAnswer"))
  ) THEN 1
  WHEN (
    SELECT COUNT(*)
    FROM regexp_split_to_table("correctAnswer", ',') AS part
    WHERE btrim(part) <> ''
  ) >= 2
  AND (
    SELECT bool_and(EXISTS (
      SELECT 1
      FROM jsonb_array_elements_text((${OPTION_ARRAY})) AS opt(value)
      WHERE lower(btrim(opt.value)) = lower(btrim(part))
    ))
    FROM regexp_split_to_table("correctAnswer", ',') AS part
    WHERE btrim(part) <> ''
  ) THEN (
    SELECT COUNT(*)
    FROM regexp_split_to_table("correctAnswer", ',') AS part
    WHERE btrim(part) <> ''
  )
  ELSE 1
END
`;

const BOWTIE_DEFECT = `
"itemType" IN ('ngn_bowtie', 'bow_tie')
AND (
  COALESCE(jsonb_array_length((${OPTIONS_JSON})->'actions'), 0) < 1
  OR COALESCE(jsonb_array_length((${OPTIONS_JSON})->'monitors'), 0) < 1
  OR (
    btrim(COALESCE((${OPTIONS_JSON})->>'condition', '')) <> ''
    AND (
      lower(regexp_replace(btrim((${OPTIONS_JSON})->>'condition'), '\\s+', ' ', 'g'))
        = lower(regexp_replace(btrim(question), '\\s+', ' ', 'g'))
      OR (
        btrim(COALESCE(scenario, '')) <> ''
        AND lower(regexp_replace(btrim((${OPTIONS_JSON})->>'condition'), '\\s+', ' ', 'g'))
          = lower(regexp_replace(btrim(scenario), '\\s+', ' ', 'g'))
      )
    )
  )
  OR EXISTS (
    SELECT 1
    FROM jsonb_array_elements_text(
      COALESCE((${OPTIONS_JSON})->'actions', '[]'::jsonb)
      || COALESCE((${OPTIONS_JSON})->'monitors', '[]'::jsonb)
      || CASE
           WHEN btrim(COALESCE((${OPTIONS_JSON})->>'condition', '')) <> ''
             THEN jsonb_build_array((${OPTIONS_JSON})->>'condition')
           ELSE '[]'::jsonb
         END
    ) AS choice(value)
    WHERE length(btrim(choice.value)) >= 8
      AND position(lower(btrim(choice.value)) IN lower("correctAnswer")) > 0
      AND position('why other options are incorrect' IN lower(explanation)) > 0
      AND position(
        lower(btrim(choice.value)) IN split_part(lower(explanation), 'why other options are incorrect', 2)
      ) > 0
  )
)
`;

const CASE_DEFECT = `
"itemType" IN ('case_study', 'unfolding_case', 'case_based')
AND (
  btrim(COALESCE((${OPTIONS_JSON})->>'caseGroupId', '')) = ''
  OR (
    SELECT COUNT(*)
    FROM "QuestionBankItem" AS case_group
    WHERE case_group.active = true
      AND case_group."fieldId" = "QuestionBankItem"."fieldId"
      AND case_group."itemType" = "QuestionBankItem"."itemType"
      AND left(btrim(case_group.options), 1) = '{'
      AND COALESCE(case_group.options::jsonb->>'caseGroupId', '')
        = COALESCE("QuestionBankItem".options::jsonb->>'caseGroupId', '')
  ) <> 6
)
`;

const STRUCTURAL_DEFECT = `
"itemType" IN ('select_all', 'sata') AND (${KEYED_COUNT}) < 2
OR (
  "itemType" IN ('vignette', 'mcq')
  AND (question ~* '\\mselect all\\M' OR COALESCE(scenario, '') ~* '\\mselect all\\M')
  AND (${KEYED_COUNT}) < 2
)
OR (${BOWTIE_DEFECT})
OR (
  "itemType" IN ('ngn_matrix', 'matrix')
  AND (
    COALESCE(jsonb_array_length((${OPTIONS_JSON})->'rows'), 0) = 0
    OR (
      length("correctAnswer") - length(replace("correctAnswer", '|||', ''))
    ) / 3 < COALESCE(jsonb_array_length((${OPTIONS_JSON})->'rows'), 0)
  )
)
OR (
  "itemType" IN ('ordered_response', 'drag_drop')
  AND COALESCE(
    "correctAnswer" = (
      SELECT string_agg(opt.value, ',' ORDER BY opt.ord)
      FROM jsonb_array_elements_text((${OPTION_ARRAY})) WITH ORDINALITY AS opt(value, ord)
    ),
    false
  )
)
OR (
  "itemType" IN ('ngn_highlight', 'highlight')
  AND btrim(COALESCE((${OPTIONS_JSON})->>'text', '')) = ''
)
OR (${CASE_DEFECT})
OR NULLIF(curation_meta #>> '{itemQa,retiredReason}', '') IS NOT NULL
OR NULLIF(curation_meta #>> '{itemQa,retiredAt}', '') IS NOT NULL
`;

/** True when a qaPassed, active row may be shown. */
export const STUDENT_ELIGIBLE_SQL = `
(
  (
    COALESCE(curation_meta #>> '{studentEligibility,pipeline}', '') = 'student-eligibility-v1'
    AND COALESCE(curation_meta #>> '{studentEligibility,status}', '') = 'restored'
  )
  OR NOT COALESCE((${STRUCTURAL_DEFECT}), false)
)
`;

export function studentEligibleAndSql(): string {
  return `AND ${STUDENT_ELIGIBLE_SQL}`;
}
