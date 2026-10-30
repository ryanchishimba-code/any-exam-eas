# NCLEX Management of Care batches 2 and 3

Prepared only. Held until a licensed RN review. Nothing in this folder has been applied, and nothing here is RN-reviewed.

`00-dry-run.sql` is the only script that was executed. It inserts the 140 items, activates them, and runs both undos in one transaction, then ends in `ROLLBACK`.

There is no `scripts/06-rollback-DO-NOT-RUN.sql` in this package. Do not run a file by that name.

## Scripts

| File | What it does | Backup table |
|---|---|---|
| `01-insert.sql` | Inserts the 140 items with `active=false` and `qaPassed=false`. | `qbi_nclex_moc_b2b3_insert_20261030` |
| `02-activate-after-rn-review.sql` | After the RN review, sets those 140 rows to `active=true` and `qaPassed=true`. | `qbi_nclex_moc_b2b3_activate_20261030` |
| `03-undo-insert.sql` | Deletes the 140 rows only while they are still held (`active=false`, `qaPassed=false`). | uses the insert backup |
| `04-undo-activate.sql` | Puts the 140 rows back to the held flags. This is not a full-bank rollback. | uses the activate backup |

Every apply and undo file refuses to run unless the session has run `SET nclex.moc_b2b3_apply = '1'`. Run the activation undo before the insert undo.

Item ids, hashes, and topics are in `manifest.json`. `build.py` reads batch 2 `items-v7.json` / `answer-key-v7.md` and batch 3 `items-v4.json` / `answer-key-v4.md` and regenerates the SQL. Each batch is 58 single-best, 9 select-all, and 3 ordered. The answer-key letters match the JSON keys.

The nightly seed sync skips ids and content hashes stored in these backup tables once they exist. The table names are listed in `KEYFIX_BACKUP_TABLES`. The tables are not created until an apply script runs.

## Duplicate check, 2026-10-30

Each of the 140 items was checked against the live nursing bank (10,922 rows) and against the other 139 items.

| Check | Hits |
|---|---:|
| Same `contentHash` | 0 |
| Same stem (`scenario` + question) | 0 |
| Same generated id | 0 |
| Same item inside this package | 0 |
| Near stem (shared wording, similarity at least 0.72) | 0 same items |

Two live items share the short "which client first" frame and are different items. Batch 3 Q9 (new confusion and SpO2 89% after hip replacement) is not the live row `cmr1d6l4h00001ydfkr6pb1j0` (pain after cholecystectomy, dyspnea with SpO2 88%, glucose, bathroom). Batch 3 Q15 (thyroidectomy airway, atrial fibrillation with dizziness, laxative, incision pain) is not the live v6 row `cdee11f8f80ffaddee2848958` (COPD with SpO2 82%, new atrial fibrillation with BP 98/60, cellulitis, discharge teaching).

## Dry run, 2026-10-30

Served means `fieldId = nursing` and both `active` and `qaPassed`. Management of Care served means `subjectId = management-of-care` among those served rows.

The transaction ran the insert, the activation, and both undos, then executed `ROLLBACK`.

| Step | All rows | Nursing active | Nursing served | Management of Care served |
|---|---:|---:|---:|---:|
| Baseline | 86,253 | 5,007 | 4,331 | 680 |
| After insert and activate | 86,393 (+140) | 5,147 (+140) | 4,471 (+140) | 820 (+140) |
| After both undos | 86,253 | 5,007 | 4,331 | 680 |

After the rollback, both backup tables were absent and batch 2 item 1 (`c15a3f1fa8923fdaa50cd2273`) was not in the bank. The live counts were unchanged.

`01-insert.sql` was also executed without the apply flag. It stopped with the refusal error and did not create its backup table.
