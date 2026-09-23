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

## Retire queued near-duplicates

Dry-run is the default. `--apply` is the only way to write. The command sets `active=false` on flagged near-duplicates in one field. It does not delete rows, does not change `qaPassed`, and does not update the kept twin.

```bash
# List the nursing rows that would be retired. No writes.
npm run db:retire-near-duplicates -- --field nursing

# Same preview, explicit dry-run flag.
npm run db:retire-near-duplicates -- --field nursing --dry-run

# Deactivate only those rows after the dry-run looks right.
npm run db:retire-near-duplicates -- --field nursing --apply
```

`--field` is required, so another board uses the same command with its own field id. Add `--subject <subjectId>` to limit the scan to one topic. A row is eligible only when all of these are true:

1. It is active, in that field, and `reviewFlag` is true.
2. `curationMeta.itemQa` is pipeline `item-qa-v1` and includes `near_duplicate`.
3. The stored partner id is the lower id (the kept twin from the audit).
4. Walking partner links ends at an active keeper in the same field. The keeper is not retired.

Text-only flags (`truncated_option`, `empty_stem`) stay in the queue. If a retired row also has another Item QA code, `near_duplicate` is removed and `reviewFlag` stays true for the remaining code. A duplicate-only row has `reviewFlag` cleared and keeps a retirement note on `curationMeta.itemQa`.

Public inventory counts rows that are both `active` and `qaPassed`. The dry-run prints that published count, the expected drop, and the expected count after apply. The drop equals the eligible rows that are already `qaPassed`. When most queued near-duplicates are published, that is roughly the retired count. For nursing, that published count is the NCLEX hub total (7,581 before this cleanup). Keepers stay published, so their share of the total does not move.

The report is `artifacts/retire-near-duplicates-<field>.md` and `.json` (gitignored). Full-exam links are left in place; the practice bank stops serving the row because practice requires `active`.

## Confirm the public count

`/nclex`, the other board hubs, and `/question-bank` read one cached inventory (`unstable_cache`, tag `question-bank-counts`). A hard refresh does not skip it. The entry lasts up to one hour if nothing revalidates it. `/api/marketing/bank-counts` uses that same cache; after the hour it may serve the previous JSON for about a minute, not a day.

`--apply` that updates at least one row POSTs `/api/cron/revalidate-inventory` with `Authorization: Bearer $CRON_SECRET`. That drops the tag and revalidates the hub and question-bank paths, so the next request reads the database. The origin is `INVENTORY_REVALIDATE_URL`, then `NEXT_PUBLIC_SITE_URL`, then `NEXTAUTH_URL`, then `https://www.anyexameasy.com`.

A cleared cache prints `Inventory cache revalidated` and sets `cacheRevalidated: true` in the JSON report. Then hard-refresh:

- `https://www.anyexameasy.com/nclex`
- `https://www.anyexameasy.com/question-bank?field=nursing`

Both should show the report's published-after count (active and qaPassed). The same number is the NCLEX `served` value from:

```bash
curl -s https://www.anyexameasy.com/api/marketing/bank-counts
```

If the rows were updated and the cache call failed, the script exits non-zero after writing the report. The database change is already saved. Retry without retiring anything again:

```bash
curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
  https://www.anyexameasy.com/api/cron/revalidate-inventory
```

`200` with `{ "ok": true, "revalidated": true, "tag": "question-bank-counts" }` means the next visit rebuilds the hub and the question bank from the database. Use that same curl after this change deploys if a previous `--apply` already retired rows and the UI is still on the old total.

Admin approve, reject, archive, restore, QA pass, and QA unpass use the same invalidation. So does applying a question-report fix that marks an item QA-passed. Flagging or editing tags does not, because those do not change `active` or `qaPassed`.

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
npx vitest run src/lib/exam-prep/item-qa/item-qa.test.ts src/lib/exam-prep/item-qa/retire-near-duplicates.test.ts src/lib/inventory/active-inventory-cache.test.ts src/lib/inventory/revalidate-active-inventory.test.ts tests/unit/components/QuestionRenderer.test.tsx
```

The unit tests cover exact and near duplicates, truncated/encoding/markdown defects, the rationale schema, the manual-only publish gate, the source line, and the near-duplicate retire plan (keeper stays, text-only flags stay, `qaPassed` is not a write).
