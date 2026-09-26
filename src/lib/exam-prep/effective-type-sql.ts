/**
 * SQL mirror of `isPlainSingleAnswerReclass`.
 *
 * True when a labelled highlight or case row is a plain single-answer MCQ.
 * A restored row keeps its stored item type. Bow-tie rows are never matched.
 * Keep this in step with `effective-type.ts`.
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
  WHEN jsonb_typeof((${OPTIONS_JSON})->'options') = 'array' THEN (${OPTIONS_JSON})->'options'
  ELSE '[]'::jsonb
END
`;

const PASSAGE = `lower(regexp_replace(btrim(COALESCE((${OPTIONS_JSON})->>'text', '')), '\\s+', ' ', 'g'))`;

const REAL_HIGHLIGHT = `
(
  "itemType" IN ('ngn_highlight', 'highlight')
  OR lower(COALESCE((${OPTIONS_JSON})->>'kind', '')) = 'highlight'
)
AND btrim(COALESCE((${OPTIONS_JSON})->>'text', '')) <> ''
AND CASE
  WHEN jsonb_typeof((${OPTIONS_JSON})->'highlights') = 'array'
    THEN jsonb_array_length((${OPTIONS_JSON})->'highlights')
  ELSE 0
END > 0
AND NOT EXISTS (
  SELECT 1
  FROM jsonb_array_elements_text(
    CASE
      WHEN jsonb_typeof((${OPTIONS_JSON})->'highlights') = 'array' THEN (${OPTIONS_JSON})->'highlights'
      ELSE '[]'::jsonb
    END
  ) AS span(value)
  WHERE btrim(span.value) = ''
    OR position(
      lower(regexp_replace(btrim(span.value), '\\s+', ' ', 'g'))
      IN ${PASSAGE}
    ) = 0
)
`;

const NESTED_NGN_KIND = `
lower(COALESCE((${OPTIONS_JSON})->>'kind', '')) IN (
  'bow_tie', 'bowtie', 'ngn_bowtie', 'matrix', 'ngn_matrix', 'select_all', 'sata',
  'ordered_response', 'drag_drop', 'constructed_response'
)
`;

const DISTINCT_OPTIONS = `
(
  SELECT COUNT(*)
  FROM jsonb_array_elements_text((${OPTION_ARRAY})) AS opt(value)
  WHERE btrim(opt.value) <> ''
) = jsonb_array_length((${OPTION_ARRAY}))
AND (
  SELECT COUNT(DISTINCT lower(regexp_replace(btrim(opt.value), '\\s+', ' ', 'g')))
  FROM jsonb_array_elements_text((${OPTION_ARRAY})) AS opt(value)
) = jsonb_array_length((${OPTION_ARRAY}))
`;

const FRAGMENT_OPTION = `
EXISTS (
  SELECT 1
  FROM jsonb_array_elements_text((${OPTION_ARRAY})) AS opt(value)
  WHERE lower(btrim(opt.value)) ~ '^(and|or)[[:space:]]'
    OR EXISTS (
      SELECT 1
      FROM jsonb_array_elements_text((${OPTION_ARRAY})) AS sib(value)
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
`;

const ONE_KEY = `
position('|||' IN COALESCE("correctAnswer", '')) = 0
AND btrim(COALESCE("correctAnswer", '')) <> ''
AND (
  btrim("correctAnswer") ~ '^[A-Fa-f]$'
  OR EXISTS (
    SELECT 1
    FROM jsonb_array_elements_text((${OPTION_ARRAY})) AS opt(value)
    WHERE lower(regexp_replace(btrim(opt.value), '\\s+', ' ', 'g'))
      = lower(regexp_replace(btrim("correctAnswer"), '\\s+', ' ', 'g'))
  )
)
`;

/** Unqualified `"QuestionBankItem"` columns. */
export const EFFECTIVE_MCQ_SQL = `
(
  "itemType" IN ('ngn_highlight', 'highlight', 'case_study', 'unfolding_case', 'case_based')
  AND NOT (
    COALESCE(curation_meta #>> '{effectiveType,pipeline}', '') = 'effective-type-v1'
    AND COALESCE(curation_meta #>> '{effectiveType,status}', '') = 'restored'
  )
  AND NOT (${NESTED_NGN_KIND})
  AND NOT (${REAL_HIGHLIGHT})
  AND NOT (
    question ~* '\\mselect all\\M'
    OR COALESCE(scenario, '') ~* '\\mselect all\\M'
  )
  AND jsonb_typeof((${OPTION_ARRAY})) = 'array'
  AND jsonb_array_length((${OPTION_ARRAY})) BETWEEN 2 AND 10
  AND (${DISTINCT_OPTIONS})
  AND NOT (${FRAGMENT_OPTION})
  AND (${ONE_KEY})
)
`;
