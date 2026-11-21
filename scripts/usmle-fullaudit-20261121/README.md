# USMLE full audit, 2026-11-21

Draft only. These scripts do not change production until someone runs the apply file on purpose. Do not merge this pull request for that purpose.

The universe is every served Step 1, Step 2, and Step 3 item that passes the attached served gate, minus:

- ids in `qbi_usmle_audit240_20261114_backup` (236)
- the 240-item sample on `cursor/usmle-audit80b-20261121-4883` (the `md5(id || 'usmle-audit80b-20261121')` draw; all 175 defect ids from that pull request sit inside it)
- the 265 ids in `scripts/usmle-optlen-20261121/usmle-optlen-20261121-report.csv` on `cursor/usmle-optlen-20261121-165d`

That leaves 9,398 items: Step 1 2,538, Step 2 2,598, Step 3 4,262.

## Batch 1 (pass 1)

26 items. Sources were opened before the key was changed.

- 18 ischemic-stroke items give alteplase even though the stem never states a last-known-well time. The key becomes the listed aspirin option. Source: 2018 AHA/ASA guideline.
- 4 pulmonary-embolism items with blood pressure 90/60 mm Hg are keyed to heparin or warfarin. The key becomes the listed thrombolysis option. Sources: Merck Manual Professional (pulmonary embolism) and the 2019 ESC guideline.
- 4 items ask which choice is contraindicated, or sit on the border of high-risk embolism, and no listed option is uniquely correct. They are staged `active = false`.

Three of the stroke items and one embolism item are Step 1 management questions. Those four move to Step 2 with the corrected key. Blueprint tags on the rekeyed items are set to the concept the stem tests.

Run later, in order:

1. `psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/usmle-fullaudit-20261121/batch-01-pass1-stage.sql`
2. `psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/usmle-fullaudit-20261121/batch-01-pass1-apply.sql`

Undo with `scripts/usmle-fullaudit-20261121/batch-01-pass1-undo.sql`. Apply aborts if a live row no longer matches the backup snapshot.
