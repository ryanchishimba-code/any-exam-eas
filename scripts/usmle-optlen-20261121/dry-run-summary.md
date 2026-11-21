# Dry run: served USMLE option-length giveaways (2026-11-21)

Read-only recount on Neon project `lively-silence-56893462`, database `anyexameasy`, production branch `main` (`br-super-frog-apuqj2ol`). Served gate is the attached served CTE: active, `qaPassed`, USMLE Step 1/2/3, with code-level hidden ids excluded unless student eligibility was restored.

A correct option is flagged when it is uniquely the longest and substantially longer than the next longest option: at least 25% longer, or at least 20 characters longer. Length is Unicode characters. Select-all keys use the `|||` parts; none of the flagged rows were select-all.

## Recount (production, before any edit)

| Step | Served | Flagged | Rate |
| --- | ---: | ---: | ---: |
| Step 1 | 2,882 | 186 | 6.45% |
| Step 2 | 2,784 | 29 | 1.04% |
| Step 3 | 4,467 | 50 | 1.12% |
| All USMLE | 10,133 | 265 | 2.61% |

The earlier ~1,055 figure is not the current production count. The 2026-11-13 option-length edits already landed; 265 served items still meet this rule.

## Staged

| Step | Flagged | Staged | Skipped |
| --- | ---: | ---: | ---: |
| Step 1 | 186 | 186 | 0 |
| Step 2 | 29 | 29 | 0 |
| Step 3 | 50 | 50 | 0 |
| All | 265 | 265 | 0 |

No item was skipped. Explanations were updated on 69 items whose text quoted an option that changed (Step 1: 26, Step 2: 20, Step 3: 23). `correctAnswer` was updated in the same edit whenever its option text changed, and it still equals that option exactly.

## Verification (Neon branch only)

Branch `optlen-verify-20261121` (`br-sparkling-shape-apu4v833`), forked from production. Both apply scripts were executed there. Production was not written: the staging table is absent on `main`, and a sampled Step 1 key is still the original wording.

| Check | Result |
| --- | --- |
| Staging rows | 186 batch 1 + 79 batch 2 |
| Staged items still uniquely longest and substantially longer | 0 |
| Staged items whose `correctAnswer` is not exactly one option | 0 |
| Served substantial-giveaway rate after the branch apply | Step 1 0/2,882, Step 2 0/2,784, Step 3 0/4,467 |

## How to apply later

Do not run these scripts until the draft is approved. Run batch 1 and batch 2 separately if you want incremental review. Each apply creates its backup table and inserts its rows into `qbi_usmle_optlen_20261121_stage`, then updates `QuestionBankItem` only where the current options, key, and explanation still match the backup text.

- `batch-01-step1-backup.sql`, `batch-01-step1-apply.sql`, `batch-01-step1-undo.sql` (186 Step 1 rows, backup `qbi_usmle_optlen_20261121_b1_backup`)
- `batch-02-step2-step3-backup.sql`, `batch-02-step2-step3-apply.sql`, `batch-02-step2-step3-undo.sql` (79 Step 2 and Step 3 rows, backup `qbi_usmle_optlen_20261121_b2_backup`)

Report: `usmle-optlen-20261121-report.csv` (`id`, `step`, `old_options`, `new_options`, `old_length_ratio`, `new_length_ratio`).
