# USMLE Quick Bites backup and undo

The 540 bites live in `content/usmle-quickbites/` and are hidden behind
`USMLE_QUICK_BITES_PUBLIC` and `NEXT_PUBLIC_USMLE_QUICK_BITES_PUBLIC`.
Both flags default off. Students receive a 404. Admins can preview.

`01-backup.sql` records that no question-bank or study-guide rows existed for
this library before it was added. `03-undo.sql` records that none were written.

Do not run `scripts/06-rollback-DO-NOT-RUN.sql`.
Do not turn the flags on without Ryan's explicit OK.

## pass10 (Step 2 CK guideline re-sourcing)

Backup: `backup-pre-pass10-20261121/` (step-2 bites.json, AUDIT.md, diagrams.json, usmle-bites.test.ts).
Undo: `bash scripts/usmle-quickbites-20261121/15-undo-pass10.sh` restores those four files. It changes no flags and touches no database.

## pass11 (blind-review fixes and Step 3 re-sourcing)

Backup: `backup-pre-pass11-20261121/` (Step 1, 2 and 3 bites.json, AUDIT.md, diagrams.json, usmle-bites.test.ts, usmle-diagrams.tsx).
Undo: `bash scripts/usmle-quickbites-20261121/16-undo-pass11.sh` restores those files. It changes no flags and touches no database.

## pass12 (Step 1 full-text re-sourcing and Step 3 blind-review fixes)

Backup: `backup-pre-pass12-20261121/` (Step 1 and Step 3 bites.json, AUDIT.md, diagrams.json, usmle-bites.test.ts).
Undo: `bash scripts/usmle-quickbites-20261121/17-undo-pass12.sh` restores those files. It changes no flags and touches no database.
