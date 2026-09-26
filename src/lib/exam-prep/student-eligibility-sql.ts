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
  OR EXISTS (
    SELECT 1
    FROM jsonb_array_elements_text(
      COALESCE((${OPTIONS_JSON})->'actions', '[]'::jsonb)
      || COALESCE((${OPTIONS_JSON})->'monitors', '[]'::jsonb)
    ) AS opt(value)
    WHERE lower(btrim(opt.value)) ~ '^(and|or)[[:space:]]'
      OR EXISTS (
        SELECT 1
        FROM jsonb_array_elements_text(
          COALESCE((${OPTIONS_JSON})->'actions', '[]'::jsonb)
          || COALESCE((${OPTIONS_JSON})->'monitors', '[]'::jsonb)
        ) AS sib(value)
        WHERE opt.value <> sib.value
          AND position(',' IN sib.value) > 0
          AND (
            left(lower(sib.value), length(lower(btrim(opt.value))) + 1) = lower(btrim(opt.value)) || ','
            OR lower(btrim(opt.value)) IN (
              SELECT lower(btrim(part))
              FROM regexp_split_to_table(sib.value, ',') AS part
            )
          )
      )
  )
)
`;

const CASE_MEMBER = `
case_group.active = true
AND case_group."fieldId" = "QuestionBankItem"."fieldId"
AND case_group."itemType" = "QuestionBankItem"."itemType"
AND left(btrim(case_group.options), 1) = '{'
AND COALESCE(case_group.options::jsonb->>'caseGroupId', '')
  = COALESCE("QuestionBankItem".options::jsonb->>'caseGroupId', '')
`;

const CASE_NARRATIVE = `lower(COALESCE(NULLIF(btrim(case_group.scenario), ''), case_group.question))`;

/**
 * A case set is servable only when it has six items about one patient and at
 * least one real NGN response. Six unrelated single-answer items are not a case.
 */
const CASE_DEFECT = `
"itemType" IN ('case_study', 'unfolding_case', 'case_based')
AND (
  btrim(COALESCE((${OPTIONS_JSON})->>'caseGroupId', '')) = ''
  OR (
    SELECT COUNT(*)
    FROM "QuestionBankItem" AS case_group
    WHERE ${CASE_MEMBER}
  ) <> 6
  OR (
    (
      SELECT COUNT(*)
      FROM "QuestionBankItem" AS case_group
      WHERE ${CASE_MEMBER}
    ) = 6
    AND (
      (
        SELECT COUNT(DISTINCT substring(${CASE_NARRATIVE} from '([0-9]{1,3})-year-old'))
        FROM "QuestionBankItem" AS case_group
        WHERE ${CASE_MEMBER}
          AND ${CASE_NARRATIVE} ~ '[0-9]{1,3}-year-old'
      ) > 1
      OR (
        SELECT COUNT(DISTINCT
          CASE
            WHEN ${CASE_NARRATIVE} ~ '[0-9]{1,3}-year-old[[:space:]]+(male|man|boy)([^[:alnum:]]|$)' THEN 'm'
            WHEN ${CASE_NARRATIVE} ~ '[0-9]{1,3}-year-old[[:space:]]+(female|woman|girl|primigravida|multigravida)([^[:alnum:]]|$)' THEN 'f'
            WHEN ${CASE_NARRATIVE} ~ '[0-9]{1,3}-year-old[[:space:]]+infant([^[:alnum:]]|$)' THEN 'i'
            ELSE NULL
          END
        )
        FROM "QuestionBankItem" AS case_group
        WHERE ${CASE_MEMBER}
      ) > 1
      OR (
        (
          SELECT COUNT(*)
          FROM "QuestionBankItem" AS case_group
          WHERE ${CASE_MEMBER}
            AND ${CASE_NARRATIVE} ~ '[0-9]{1,3}-year-old'
        ) = 0
        AND (
          SELECT COUNT(DISTINCT left(regexp_replace(${CASE_NARRATIVE}, '\\s+', ' ', 'g'), 48))
          FROM "QuestionBankItem" AS case_group
          WHERE ${CASE_MEMBER}
        ) > 1
      )
      OR NOT EXISTS (
        SELECT 1
        FROM "QuestionBankItem" AS case_group
        WHERE ${CASE_MEMBER}
          AND (
            lower(COALESCE(case_group.options::jsonb->>'kind', '')) IN (
              'bow_tie', 'bowtie', 'ngn_bowtie', 'matrix', 'ngn_matrix', 'highlight', 'ngn_highlight',
              'select_all', 'sata', 'ordered_response', 'drag_drop', 'cloze', 'dropdown', 'drop_down',
              'trend', 'hotspot', 'hot_spot', 'constructed_response', 'multiple_response'
            )
            OR (
              COALESCE(jsonb_array_length(case_group.options::jsonb->'highlights'), 0) > 0
              AND lower(COALESCE(case_group.options::jsonb->>'kind', '')) NOT IN ('mcq', 'vignette')
            )
            OR (
              COALESCE(jsonb_array_length(case_group.options::jsonb->'actions'), 0) > 0
              AND lower(COALESCE(case_group.options::jsonb->>'kind', '')) LIKE '%bow%'
            )
            OR (
              COALESCE(jsonb_array_length(case_group.options::jsonb->'rows'), 0) > 0
              AND lower(COALESCE(case_group.options::jsonb->>'kind', '')) NOT IN ('mcq', 'vignette')
            )
            OR position('|||' IN case_group."correctAnswer") > 0
            OR case_group."itemType" IN (
              'ngn_bowtie', 'bow_tie', 'ngn_matrix', 'matrix', 'ordered_response', 'drag_drop',
              'ngn_highlight', 'highlight', 'select_all', 'sata'
            )
          )
      )
    )
  )
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
OR (
  "itemType" IN ('ngn_highlight', 'highlight')
  AND btrim(COALESCE((${OPTIONS_JSON})->>'text', '')) <> ''
  AND (
    (
      COALESCE(jsonb_array_length((${OPTIONS_JSON})->'highlights'), 0) = 0
      AND COALESCE(jsonb_array_length((${OPTION_ARRAY})), 0) = 0
    )
    OR EXISTS (
      SELECT 1
      FROM jsonb_array_elements_text(
        CASE
          WHEN COALESCE(jsonb_array_length((${OPTIONS_JSON})->'highlights'), 0) > 0
            THEN (${OPTIONS_JSON})->'highlights'
          ELSE (${OPTION_ARRAY})
        END
      ) AS span(value)
      WHERE btrim(span.value) = ''
        OR position(
          lower(regexp_replace(btrim(span.value), '\\s+', ' ', 'g'))
          IN lower(regexp_replace(btrim(COALESCE((${OPTIONS_JSON})->>'text', '')), '\\s+', ' ', 'g'))
        ) = 0
    )
  )
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
