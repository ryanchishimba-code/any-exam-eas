# Item and rationale QA

Board-generic checks for every question bank. They detect defects and block **new** publishes. They do not unpublish items students already see (`qaPassed` and `active` stay as they are).

## What it checks

| Check | What fails |
| --- | --- |
| Near-duplicates | Same field, normalized stem + options. Exact copies, or a long stem with Jaccard ≥ 0.90 (or ≥ 0.84 when options are also ≥ 0.80). |
| Text lint | Empty stem, empty explanation, truncated options (`...`, dangling `and`/`or`), letter-only choices (`A`–`D`, including `A.` and `(B)`), unclosed markdown, encoding glitches (`�`, mojibake). |
| Rationale schema | Correct-answer explanation, a specific reason each MCQ/select-all distractor is wrong, and a governing principle or priority rule. A citation is optional (warning). |

Normalization lowercases text, strips punctuation and markdown, and collapses whitespace. Comparison stays inside one `fieldId`, so the same stem on two boards is not a duplicate.

The principle is board-generic. A nursing priority rule, a pharmacy monitoring rule, and a USMLE next-step rule all use the same field.

Letter-only choices use the code `letter_only_option`. Other cut-off choice text stays `truncated_option`, so the two cleanups stay separate. A single digit option is neither defect. A one-character option that is not A–D (for example `E` or `?`) stays `truncated_option`. A complete phrase that ends in "watch for" or "look for" is not a cut-off. On a bow-tie, matrix, or highlight item, letter placeholders stored beside the real choices are not linted; the structured choices are.

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

Run the report with no `--flag` first. `--limit` only spot-checks the first ids, so omit it for a full subject. Then repeat the same command with `--flag`.

```bash
# Full management-of-care report, then queue. Does not rewrite stems or rationales.
npm run db:audit-item-qa -- --field nursing --subject management-of-care --include-rationale
npm run db:audit-item-qa -- --field nursing --subject management-of-care --include-rationale --flag
```

Legacy items that are already student-visible may fail this schema until someone edits them. `--flag` writes `fails_schema` and the specific gap (`missing_governing_principle`, `missing_distractor_reason`, and any text or near-duplicate code) onto `reviewFlag` and `curationMeta.itemQa`. It does not change `qaPassed` or `active`, so those items stay published.

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
3. The stored partner id is strictly lower than this row's id (the kept twin from the audit).
4. Walking partner links ends at an active keeper in the same field. Inactive partners in the middle are followed. The keeper is not retired.

### Partner chains

The audit stores one partner id on each flagged copy. Copies of copies form a chain (`item-c` → `item-b` → `item-a`). Retirement walks that chain and deactivates every flagged higher id. The active keeper at the end stays published.

The walk has no hop cap:

1. A row joins the chain only when its partner id is strictly lower than its own id.
2. Those links are a strictly decreasing sequence of ids. A decreasing sequence cannot repeat an id, so it cannot cycle. Length is not a cycle risk.
3. Queued near-duplicates are followed. An inactive row is not the end of the walk. If that row stores a strictly lower partner id, the walk follows it. That covers a near-duplicate already retired with `retiredReason: near_duplicate`, and any other inactive partner that still points onward.
4. The walk stops at the first active row in the same field. That row is the keeper. It must be lower than the row being retired. The keeper is not retired, and its own partner link is not followed.
5. Hard stops skip the queued row: a repeated id (`cycle`), a partner id that is not in the bank (`keeper_missing`), a row in another field (`keeper_other_field`), or an inactive row with no strictly lower partner (`keeper_inactive`). `keeper_not_lower_id` means the active keeper is not lower than the queued row. A chain that is inactive all the way down, with no active keeper, is skipped.
6. Two rows that point at each other are not a cycle to retire around. The higher id retires. The lower id is the active keeper and stays active.
7. The resolved keeper is memoized, so a long chain is walked once.
8. If a retire id is also someone's keeper, it is skipped (`keeper_in_retire_set`). `--apply` refuses the whole write if that happens, and writes nothing.

An earlier cap of 12 skipped the rest of a chain as `chain_too_long`. That was about 250 active nursing near-duplicates after the first apply (1,216 retired). Removing the cap left those rows skipped as `keeper_inactive`: each one points at an already retired near-duplicate, and that inactive row points on at the live keeper. The walk now continues through those inactive rows. `chain_too_long` is no longer produced.

Text-only flags (`truncated_option`, `letter_only_option`, `empty_stem`) stay in the queue for the text-flag tool below. If a retired near-duplicate also has another Item QA code, `near_duplicate` is removed and `reviewFlag` stays true for the remaining code. A duplicate-only row has `reviewFlag` cleared and keeps a retirement note on `curationMeta.itemQa`.

Public inventory counts rows that are both `active` and `qaPassed`. The dry-run prints that published count, the expected drop, and the expected count after apply. The drop equals the eligible rows that are already `qaPassed`. When most queued near-duplicates are published, that is roughly the retired count. Read the live count from the dry-run. The pre-cleanup nursing total (7,581) is not the current hub total. Keepers stay published, so their share of the total does not move.

The report is `artifacts/retire-near-duplicates-<field>.md` and `.json` (gitignored). Full-exam links are left in place; the practice bank stops serving the row because practice requires `active`.

## Remediate text flags

Dry-run is the default. The command reads active flagged rows for one field and classifies `truncated_option`, `empty_stem`, `letter_only_option`, and `empty_option`. It does not change near-duplicate rows. It does not rewrite choice text. It does not change `qaPassed`. It does not delete rows.

```bash
# Classify every active text flag. No writes.
npm run db:remediate-text-flags -- --field nursing

# Same list. Names the retire write, but still does not write.
npm run db:remediate-text-flags -- --field nursing --retire

# Same list. Names the clear write, but still does not write.
npm run db:remediate-text-flags -- --field nursing --clear-resolved

# Soft-deactivate only the retire class after the dry-run looks right.
npm run db:remediate-text-flags -- --field nursing --retire --apply

# Drop text flags the lint no longer supports. Does not change active or qaPassed.
npm run db:remediate-text-flags -- --field nursing --clear-resolved --apply
```

`--field` is required. `--apply` without `--retire` or `--clear-resolved` refuses to write. `--apply` and `--dry-run` together also refuse.

| Action | When | Write |
| --- | --- | --- |
| Retire | The stem is still under 12 characters, or every student-facing choice is only a letter, empty, or a single character. | `active=false`, `curationMeta.itemQa.retiredReason`, text codes removed. `reviewFlag` stays true only if another code remains. |
| Clear false positive | Student-facing text no longer fails text lint. Letter placeholders on a bow-tie, matrix, or highlight item are ignored when the structured choices are complete. A choice that ends in "watch for" (or the same kind of complete phrase) is not a cut-off. | Text codes removed. `reviewFlag` cleared when nothing remains. `active` and `qaPassed` stay as they are. |
| Fix content | A cut-off choice has exactly one longer completion in the explanation, correct answer, or scenario. | None. The report quotes the completion. A person edits the item, then `--clear-resolved` can drop the flag after the lint agrees. |
| Needs human | The cut-off is not uniquely recoverable, a letter sits beside real choices, or the row is also a near-duplicate. | None. |

Structured NGN rows often store `options: ["A","B","C","D"]` next to the real actions, monitors, rows, or highlight phrases. Students see the structured choices. Those letter lists are a false positive, not a truncated question. Clearing that flag does not publish the item: `qaPassed` and `reviewStatus` stay as they are.

The report is `artifacts/text-flag-remediation-<field>.md` and `.json` (gitignored). A production snapshot of the nursing queue is in `docs/item-qa/nursing-text-flag-inventory.md`. Full-exam links on a retired row are left in place. A retire that updates at least one row refreshes the public inventory cache the same way near-duplicate retire does. A clear does not, because the public count did not change.

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

The same gate runs on every admin publish, including legacy seed and curated rows:

- **Approve** (drawer or bulk). Approve sets review status to approved and `active` to true. It does not set `qaPassed`, and it is still rejected when the schema fails.
- the first time the item becomes student-visible (`active` and `qaPassed`): Mark QA passed on an active item, or Activate / Restore when it is already QA-passed
- a later edit of the stem, options, key, explanation, principle, distractor reasons, or citation while the item stays student-visible
- QA pass or activate on a `manual` item, or any item stored with `generationMeta.itemQaSchema = "v1"`, even if that step alone does not serve it yet

Save changes on a draft or archived item that is not approved and will not be student-visible stays open, including an incomplete principle or blank distractor reasons. Seed and curated rows that are already student-visible stay served until someone edits or republishes them. A failed Approve or publish does not change the stem, options, explanation, `qaPassed`, or `active`. It writes `fails_schema` onto the existing Item QA flag (`reviewFlag` + `curationMeta.itemQa`) so the gap shows in **Admin → Question bank → Item QA flags** and the **Fails schema** filter. Passing a later gated save removes only the schema codes.

To queue a sample without rewriting rationales:

```bash
npm run db:audit-item-qa -- --field nursing --subject management-of-care --limit 50 --flag --include-rationale
```

Required on that path:

1. Correct-answer explanation (paragraph, or a structured why-correct headline).
2. For MCQ and select-all, a reason of at least 20 characters for each wrong option.
3. Governing principle or priority rule (the form field, a `Principle:` / `Priority:` / `Pearl:` line, or an expert clinical pearl or key takeaway).

Citation is optional. Text lint errors (truncated options, broken markdown, encoding) also block.

The add-question form collects the principle, each distractor reason, and an optional citation.

## Source and review date

When a served item has a real citation (`references`, `generationMeta.sourceLabel`, or `generationMeta.citation`) or a review date (`lastReviewedAt`, `generationMeta.contentReviewedAt`), the question shows a source line under the stem. Pipeline tags such as `seed` and `curated` are not shown as sources. Items with neither stay quiet.

The principle field is shared. The editor label follows the board: nursing priority, monitoring rule, clinical pearl, or intervention principle.

## Verify

```bash
npx vitest run src/lib/exam-prep/item-qa/item-qa.test.ts src/lib/exam-prep/item-qa/retire-near-duplicates.test.ts src/lib/exam-prep/item-qa/text-flag-remediation.test.ts src/lib/inventory/active-inventory-cache.test.ts src/lib/inventory/revalidate-active-inventory.test.ts tests/unit/components/QuestionRenderer.test.tsx
```

The unit tests cover exact and near duplicates, truncated/encoding/markdown defects, letter-only A–D choices, a complete "watch for" choice, the rationale schema, the publish gate (incomplete Approve rejected, incomplete archived save allowed), the source line, the near-duplicate retire plan (keeper stays, text-only flags stay, chains longer than 12 retire, an inactive middle still reaches the active keeper, an all-inactive chain is skipped, `qaPassed` is not a write), and the text-flag plan (empty stems retire, NGN letter placeholders clear, content is not rewritten).
