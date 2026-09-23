# Item and rationale QA

Board-generic checks for every question bank. They detect defects and block **new** publishes. They do not unpublish items students already see (`qaPassed` and `active` stay as they are).

## What it checks

| Check | What fails |
| --- | --- |
| Near-duplicates | Same field, normalized stem + options. Exact copies, or a long stem with Jaccard ≥ 0.90 (or ≥ 0.84 when options are also ≥ 0.80). |
| Text lint | Empty stem, empty explanation, truncated options (`...`, dangling `and`/`or`), unclosed markdown, encoding glitches (`�`, mojibake). |
| Rationale schema | Correct-answer explanation, a specific reason each MCQ/select-all distractor is wrong, and a governing principle or priority rule. A citation is optional (warning). |

Normalization lowercases text, strips punctuation and markdown, and collapses whitespace. Comparison stays inside one `fieldId`, so the same stem on two boards is not a duplicate.

The principle is board-generic. A nursing priority rule, a pharmacy monitoring rule, and a USMLE next-step rule all use the same field.

## Run a report

```bash
# Spot-check one topic (report only)
npm run db:audit-item-qa -- --field nursing --subject management-of-care --limit 50

# One board, full active bank
npm run db:audit-item-qa -- --field pharmacy

# Every active field
npm run db:audit-item-qa
```

Writes `artifacts/item-qa-<field>.md` and `.json`. The markdown lists issue counts and the first 30 duplicate pairs. `--limit` only compares items inside that sample, so use it for a spot check. A full field scan is the duplicate job.

## Flag the admin queue

```bash
# Text defects + near-duplicates. Does not change qaPassed or active.
npm run db:audit-item-qa -- --field nursing --flag

# Also queue rationale schema gaps (common on older items)
npm run db:audit-item-qa -- --field nursing --subject management-of-care --limit 50 --flag --include-rationale

# Drop this pipeline's flag when a previously flagged item now passes
npm run db:audit-item-qa -- --field nursing --clear-resolved
```

Flags land on `reviewFlag` and `curationMeta.itemQa` (`pipeline: item-qa-v1`). In **Admin → Question bank**, open **Item QA flags** or the **Item QA** count. The row shows the issue codes. The detail drawer shows the summary.

The lower id in a duplicate pair is kept. The other id is queued as `near_duplicate`.

## Publish schema

New questions created in admin with **Save as draft** unchecked must pass the schema. Drafts can be incomplete.

Approving or marking QA-passed a `manual` item (or any item stored with `generationMeta.itemQaSchema = "v1"`) runs the same gate. Seed and curated rows are not blocked, so the existing bank stays servable.

Required on that path:

1. Correct-answer explanation (paragraph, or a structured why-correct headline).
2. For MCQ and select-all, a reason of at least 20 characters for each wrong option.
3. Governing principle or priority rule (the form field, a `Principle:` / `Priority:` line, or an expert key takeaway).

Citation is optional. Text lint errors (truncated options, broken markdown, encoding) also block.

The add-question form collects the principle, each distractor reason, and an optional citation.

## Source and review date

When a served item has a real citation (`references`, `generationMeta.sourceLabel`) or `lastReviewedAt`, the question shows a source line under the stem. Pipeline tags such as `seed` and `curated` are not shown as sources.

## Verify

```bash
npx vitest run src/lib/exam-prep/item-qa/item-qa.test.ts tests/unit/components/QuestionRenderer.test.tsx
```

The unit tests cover exact and near duplicates, truncated/encoding/markdown defects, the rationale schema, the manual-only publish gate, and the source line.
