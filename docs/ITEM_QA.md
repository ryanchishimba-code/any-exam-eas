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

A flagged `missing_governing_principle` can be quoted into `generationMeta.governingPrinciple` with the propose command below. A flagged `missing_distractor_reason` can be quoted into `distractorRationale` with the distractor command that follows it. Neither command clears the flag.

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

## Propose a governing principle

Some older items already teach the priority rule in the explanation, and the schema still fails because `generationMeta.governingPrinciple` is empty and the explanation has no labeled `Principle:` / `Priority:` / `Pearl:` line. This command quotes a short line from the stored explanation or clinical-reasoning text. It does not call a model, and it does not invent a sentence that is not already stored.

Dry-run is the default. `--apply` is the only write. The write sets `generationMeta.governingPrinciple` and nothing else. Stem, options, explanation, `qaPassed`, and `active` stay as they are, so this command does not refresh the public inventory cache. Item QA flags stay as they are. Near-duplicate rows are skipped, including rows that also carry `missing_governing_principle`.

```bash
# Propose for one subject. No writes. Artifacts land in artifacts/ (gitignored).
npm run db:propose-governing-principles -- --field nursing --subject management-of-care

# Same preview, first 25 matching rows in id order.
npm run db:propose-governing-principles -- --field nursing --subject management-of-care --limit 25

# Preview a reviewed id list. Still no writes.
npm run db:propose-governing-principles -- --field nursing --subject management-of-care --ids-file ./reviewed-ids.txt

# Write only those reviewed ids. Do this only after a person accepts the quoted lines.
npm run db:propose-governing-principles -- --field nursing --subject management-of-care --ids-file ./reviewed-ids.txt --apply
```

`--field` is required. `--subject` and `--limit` are optional, so another board uses the same command. A row is eligible when it is active, in that field, and either flagged `missing_governing_principle` or currently failing the principle check. Unflagged gaps are included so a board can be scanned before the audit flag run.

| Class | When | Write on `--apply` |
| --- | --- | --- |
| `auto_extract` | One stored sentence, labeled `Correct:` line, Prioritize Hypotheses clause, expert pearl, or single key takeaway is 24–200 characters and is a quote from the item. | Yes, unless `--ids-file` is set. Then only ids on that list. |
| `needs_human` | Several candidate sentences, a line longer than 200 characters, an answer-key restatement, or no usable quote. A shorter principle already stored on the row is not overwritten automatically. | Only when the id is on `--ids-file`. |
| Skipped `near_duplicate` | The Item QA codes include `near_duplicate`. | Never. |

Without `--ids-file`, `--apply` writes every current `auto_extract` row. Production content should wait for a reviewed `--ids-file`. `--apply` and `--dry-run` together refuse to write.

The report is `artifacts/governing-principle-proposals-<field>.md` and `.json` (gitignored). It lists the id, stem preview, explanation excerpt, proposed principle, and class. It prints the failing-principle count before and the predicted count after. A shape example of 25 fixtures (16 `auto_extract`, 9 `needs_human`) is in `docs/item-qa/governing-principle-proposal-sample.md`. That file is not an allowlist.

Management of Care is the first subject to run. It is not an NCLEX-only fork: pharmacy, medicine, and the other boards use the same command and the same `governingPrinciple` field.

After a reviewed apply, drop flags that now pass. This does not change `qaPassed` or `active`:

```bash
npm run db:audit-item-qa -- --field nursing --subject management-of-care --clear-resolved
```

`--clear-resolved` removes this pipeline's flag only when the row now passes text lint, the rationale schema, and is not a near-duplicate in that scan. A row that still lacks a distractor reason stays flagged. Refresh those codes with `--flag --include-rationale` after the principle is stored. This propose command does not clear flags itself.

## Propose distractor reasons

Some items already say why a wrong option fails, but the schema still reports `missing_distractor_reason`. The checker only counts a reason when it is stored on `distractorRationale`, on expert `whyIncorrect`, or on the same explanation line as the option text. A generic “Why other options are incorrect / Plausible nursing action but not the FIRST priority” block does not name the option, so it does not count. This command quotes a reason that does name the option. It does not call a model, and it does not invent a clinical fact.

Dry-run is the default. `--apply` is the only write. The write sets `generationMeta.distractorRationale`, keyed by the option text. Select-all rows, and any options envelope that already stores `distractorRationale`, also receive those same keys. Option text, the stem, the correct answer, and the explanation stay as they are. `qaPassed` and `active` stay as they are, so this command does not refresh the public inventory cache. Item QA flags stay as they are. Near-duplicate rows are skipped, including rows that also carry `missing_distractor_reason`.

```bash
# Propose for one subject. No writes. Artifacts land in artifacts/ (gitignored).
npm run db:propose-distractor-reasons -- --field nursing --subject management-of-care

# Same preview, first 25 matching rows in id order.
npm run db:propose-distractor-reasons -- --field nursing --subject management-of-care --limit 25

# Preview a reviewed id list. Still no writes.
npm run db:propose-distractor-reasons -- --field nursing --subject management-of-care --ids-file ./reviewed-ids.txt

# Write only those reviewed ids. Do this only after a person accepts the quoted lines.
npm run db:propose-distractor-reasons -- --field nursing --subject management-of-care --ids-file ./reviewed-ids.txt --apply
```

`--field` is required. `--subject` and `--limit` are optional, so another board uses the same command. A row is eligible when it is active, in that field, and either flagged `missing_distractor_reason` or currently failing the distractor check. Unflagged gaps are included so a board can be scanned before the audit flag run.

| Class | When | Write on `--apply` |
| --- | --- | --- |
| `auto_extract` | Every wrong option that is still missing a 20-character reason has a quote: a labeled incorrect line that names the option, the incorrect line directly under that option, or expert `whyIncorrect` for that option. | Yes, unless `--ids-file` is set. Then only ids on that list. |
| `needs_human` | Any missing option has no quote. That includes generic placeholder lines, an answer-key restatement, and an option the teaching summary describes as appropriate (a possible key mismatch). | Only when the id is on `--ids-file` and at least one option has a quote. Options with no quote are left blank. |
| Skipped `near_duplicate` | The Item QA codes include `near_duplicate`. | Never. |

Without `--ids-file`, `--apply` writes every current `auto_extract` row. Production content should wait for a reviewed `--ids-file`. `--apply` and `--dry-run` together refuse to write. The explanation body is not rewritten.

The report is `artifacts/distractor-reason-proposals-<field>.md` and `.json` (gitignored). It lists the id, stem preview, each wrong option, the proposed reason or none, and the class. It prints the failing-distractor count before and the predicted count after. A partial quote does not clear the code: the predicted count drops only when every missing wrong option received a reason.

Management of Care is the first subject to review. The published queue of 19 ids is **0 `auto_extract`**, **18 `needs_human`**, and **1 skipped near-duplicate** (`cmrm08rnm006u1yf1nbt3cahm`). A shape example is in `docs/item-qa/distractor-reason-proposal-sample.md`. That file is not an allowlist. Pharmacy, medicine, and the other boards use the same command and the same `distractorRationale` map.

After a reviewed apply, drop flags that now pass. This does not change `qaPassed` or `active`. A row that still lacks a governing principle, or any other schema error, stays flagged:

```bash
npm run db:audit-item-qa -- --field nursing --subject management-of-care --include-rationale --clear-resolved
```

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
npx vitest run src/lib/exam-prep/item-qa/item-qa.test.ts src/lib/exam-prep/item-qa/retire-near-duplicates.test.ts src/lib/exam-prep/item-qa/text-flag-remediation.test.ts src/lib/exam-prep/item-qa/governing-principle-proposal.test.ts src/lib/exam-prep/item-qa/distractor-reason-proposal.test.ts src/lib/inventory/active-inventory-cache.test.ts src/lib/inventory/revalidate-active-inventory.test.ts tests/unit/components/QuestionRenderer.test.tsx
```

The unit tests cover exact and near duplicates, truncated/encoding/markdown defects, letter-only A–D choices, a complete "watch for" choice, the rationale schema, the publish gate (incomplete Approve rejected, incomplete archived save allowed), the source line, the near-duplicate retire plan (keeper stays, text-only flags stay, chains longer than 12 retire, an inactive middle still reaches the active keeper, an all-inactive chain is skipped, `qaPassed` is not a write), the text-flag plan (empty stems retire, NGN letter placeholders clear, content is not rewritten), the governing-principle proposal (quotes a stored line, refuses a write without `--apply`, writes `governingPrinciple` only, and keeps other fields out), and the distractor-reason proposal (quotes a stored incorrect line, refuses generic triage placeholders and suspected key mismatches, writes `distractorRationale` only, and keeps the explanation out).
