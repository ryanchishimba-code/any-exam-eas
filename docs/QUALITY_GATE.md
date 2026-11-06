# Cue and difficulty quality gate

Week-1 read-only triage for question-bank cleanup. The script scores `QuestionBankItem` rows with deterministic heuristics and writes a worklist. It does not call a model, and it does not `UPDATE`, `INSERT`, or `DELETE`.

Live-bank runs are triage until Ryan says a given export is actionable. Do not treat a large JSON file as a change list on its own.

## Run

```bash
npx tsx scripts/quality-gate-cue-difficulty.ts --help
npm run db:quality-gate -- --board nclex --served-only --limit 200
npm run db:quality-gate -- --board nclex-rn-2026 --ids-file ids.txt
npm run db:quality-gate -- --board naplex --json-out tmp/quality-gate/naplex.json
npm run db:quality-gate -- --board pance --validate-flags path/to/cue-flags.json
npm run db:quality-gate -- --fixture items.json
```

`--help` and `--fixture` do not open a database connection. A board run needs `DATABASE_URL` (or `POSTGRES_URL`) and only runs `SELECT`.

`--apply` and `--write` are refused.

### Boards

| CLI | `fieldId` |
| --- | --- |
| `pance` | `pance` |
| `nclex`, `nclex-rn`, `nclex-rn-2026`, `nursing` | `nursing` |
| `naplex`, `pharmacy` | `pharmacy` |
| `aanp-fnp`, `fnp` | `aanp-fnp` |

### Filters

- `--limit <n>` keeps the first `n` rows in `id` order.
- `--ids-file` is a newline-separated id list (`#` comments are ignored).
- `--served-only` keeps rows that are `active`, `qaPassed`, and student-eligible. The SQL is `studentEligibleAndSql()` from `src/lib/exam-prep/student-eligibility-sql.ts`, which is the same predicate practice counts use. Fixture mode uses `isStudentEligible` from `student-eligibility.ts` plus `active` and `qaPassed`.

Default output:

- `tmp/quality-gate/<board>-<UTC date>.json`
- `tmp/quality-gate/<board>-<UTC date>.md`

## Checks

1. **Key length.** A single-answer item is flagged `key_longest` when the keyed option is strictly longer than every distractor. A tie is not flagged. A batch (the whole run, and any topic with at least 10 scored items) is flagged when the keyed-longest share is over 30%.
2. **Stem echo.** `stem_echo` when the key shares at least two content words with the stem (question + scenario) and that overlap is greater than every distractor. Stopwords and tokens shorter than four characters are ignored.
3. **Distractor shape.** `distractor_absolute` when a distractor contains `always`, `never`, `all`, or `guarantee(s)/guaranteed` and the key does not. `option_length_outlier` when a distractor is under 45% or over 220% of the median length, and at least 18 characters away. `allergy` does not match `all`.
4. **SATA.** For `sata` / `select_all` (and stems that say "select all" with two or more keys), `sata_keyed_longest` when every keyed option is longer than every distractor. Those rows are not also scored as single-answer key length.
5. **Duplicates and templates.** Inside a topic (`blueprintTopic`, else `topicCategory`, else `subjectId`), near-duplicate pairs reuse `findNearDuplicatePairs`. A repeated template is the same first eight content tokens (digits collapsed) on three or more stems.
6. **Answer position.** Single-answer keys are counted by index for the most common option count. The batch is skewed when at least 40 items are scored and one index is over 40%. A topic is skewed at 20 items and over 45%.
7. **Difficulty.** The stored 1–5 value uses the same bands as the bank label helper: 1–2 Easy, 3 Medium, 4–5 Hard. The proxy is higher when the stem is longer and option-length entropy is closer to uniform, and it is forced Easy when a strong cue (`key_longest`, `stem_echo`, `sata_keyed_longest`, `distractor_absolute`) sits on a stem under 70 words. A full-band disagreement (Easy vs Hard) is `difficulty_band_mismatch`. Genuinely hard candidates are proxy-Hard, have no strong cue, have a stem of at least 45 words, and have an option-length entropy ratio of at least 0.90. **NCLEX (`nursing`) is report-only:** mismatches are counted, and the JSON does not include `relabelSuggestion`. Other boards may include that field. Nothing is written either way.
8. **Support.** A citation counts when `references` has a label, citation, or url, or when `generationMeta.citation` / `generationMeta.sourceLabel` is set. Source-check is reported only when a scanned row already has one of `sourceCheck`, `sourceChecked`, `sourceCheckedAt`, `sourceReview`, or `source_check` on `generationMeta` or `curationMeta`. If those keys are absent, the report says the field is not stored and does not flag every row. Citation and source-check gaps are counted on the batch. They are copied onto an item only when that item is already on the worklist.

Structured NGN rows with no flat option list are skipped for the option-shape checks.

## Output shape

`mode` is `"read-only"` and `writes` is `false`.

- `checks.keyLength` — `evaluated`, `flagged`, `rate`, `batchFlag`, `threshold` (0.3)
- `checks.stemEcho.flagged`
- `checks.distractorShape` — `absoluteFlags`, `lengthFlags`
- `checks.sata` — `evaluated`, `flagged`
- `checks.duplicates` — `nearPairs`, `templateGroups`
- `checks.answerPosition` — `optionCount`, `evaluated`, `counts`, `maxShare`, `batchFlag`
- `checks.difficulty` — `compared`, `bandMismatches`, `proxyCounts`, `genuinelyHard`, `genuinelyHardIds` (capped at 100), `nclexReportOnly`, `relabelProposals`, `note`
- `checks.support` — `citationPresent`, `citationMissing`, `citationMissingSample`, `sourceCheckFieldPresent`, `sourceCheckRecorded`, `sourceCheckMissing`
- `topics` — ranked by cue-flag count, including per-topic key-length rate and position skew
- `items` — flagged rows only, cue flags first. Each item has `flags[]` and a `difficulty` object

## Validation

`--validate-flags` accepts a JSON array, or `{ "flags": [...] }`, or `{ "items": [...] }`. Each entry is `{ "id", "code" }` or `{ "id", "codes": [] }`.

Recall is known CUE flags that this gate also raised, divided by known CUE flags. Aliases such as `keyed_longest`, `absolute`, `distractor_shape`, and `sata` map onto the codes above. An entry with no codes counts as one generic cue hit if the item has any cue flag. The number is reported only. The later target is at least 80% recall; this script does not fail the run on that target.

```json
{
  "flags": [
    { "id": "clx_example", "codes": ["stem_echo", "key_longest"] }
  ]
}
```
