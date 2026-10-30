# NCLEX Management of Care pilot v6

Prepared only. Held until a licensed RN review. Nothing in this folder has been applied, and nothing here is RN-reviewed.

Ryan approved building the package. Do not apply it, and do not merge the pull request, until that review is done and someone explicitly decides to apply it.

`00-dry-run.sql` is the only script that was executed. It runs the insert, the ibuprofen hide, the activation, and all three undos in one transaction and ends in `ROLLBACK`.

There is no `scripts/06-rollback-DO-NOT-RUN.sql` in this package. Do not run a file by that name.

## Scripts

| File | What it does | Backup table |
|---|---|---|
| `01-insert.sql` | Inserts the 60 pilot items with `active=false` and `qaPassed=false`. Updates the 6 item5 rewrites in place, guarded by id and the current content hash. | `qbi_nclex_moc_v6_insert_20261030` (the 60 new rows) and `qbi_nclex_item5_v6_rewrite_20261030` (the 6 rows before the rewrite) |
| `02-hide-ibuprofen.sql` | Hides item5 #7, row `cmr8p5czr00a11y5nwf6lu2yu` (`active=false`). The text is not rewritten. | `qbi_nclex_item5_ibu_hide_20261030` |
| `03-activate-after-rn-review.sql` | After the RN review, sets the 60 pilot rows to `active=true` and `qaPassed=true`. | `qbi_nclex_moc_v6_activate_20261030` |
| `04-undo-insert.sql` | Restores the 6 rewrites from the backup and deletes the 60 pilot rows only while they are still held (`active=false`, `qaPassed=false`). | uses the insert and rewrite backups |
| `05-undo-hide-ibuprofen.sql` | Restores the ibuprofen row from its backup. | uses the hide backup |
| `06-undo-activate.sql` | Puts the 60 pilot rows back to the held flags. This is not a full-bank rollback. | uses the activate backup |

Every apply and undo file refuses to run unless the session has run `SET nclex.moc_v6_apply = '1'`. Run the activation undo before the insert undo. The 6 rewrites replace text that is already served, so `01-insert.sql` stays held until the same RN review.

Item ids, hashes, and topics are in `manifest.json`. `build.py` reads the v6 review files and regenerates the SQL. The 60 items are `item1/items-v6.json` (identical to `items-v6.json` item1): 46 single-best, 11 select-all, 3 ordered. Item5 #1 and #6 come from `item5/v2-items.json`, #2 from `item5/proposals.json`, and #3–#5 from `item5/v5-items.json` (identical to `items-v6.json`). Item5 #7 is the hide, not a rewrite.

The nightly seed sync skips ids and pre-change hashes stored in these backup tables once they exist. The table names are listed in `KEYFIX_BACKUP_TABLES`. The tables are not created until an apply script runs.

## Dry run, 2026-10-30

Served means `fieldId = nursing` and both `active` and `qaPassed`. Management of Care served means `subjectId = management-of-care` among those served rows.

| Step | All rows | Nursing active | Nursing served | Management of Care served |
|---|---:|---:|---:|---:|
| Baseline | 86,193 | 4,948 | 4,272 | 619 |
| After insert, hide, and activate | 86,253 (+60) | 5,007 (+59) | 4,331 (+59) | 680 (+61) |
| After the three undos | 86,193 | 4,948 | 4,272 | 619 |

The transaction then executed `ROLLBACK`. Afterward, the four backup tables were absent, the ibuprofen row was still active, and pilot item 1 (`cc32ad23631fdf5e61b7c7532`) was not in the bank.

Guarded row counts inside that transaction: 60 inserted and held, 6 rewrites, 1 hide, 60 activated, then 60 activation undos, 1 hide undo, 6 rewrite restores, and 60 pilot deletes.

The served change is 60 published pilot rows minus the hidden ibuprofen row. The Management of Care change is those 60 plus item5 #1, which moves from `safety-infection` to `management-of-care`. Item5 #4 was already Management of Care.
