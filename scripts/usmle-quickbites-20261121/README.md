# USMLE Quick Bites backup and undo

The 540 bites live in `content/usmle-quickbites/` and are hidden behind
`USMLE_QUICK_BITES_PUBLIC` and `NEXT_PUBLIC_USMLE_QUICK_BITES_PUBLIC`.
Both flags default off. Students receive a 404. Admins can preview.

`01-backup.sql` records that no question-bank or study-guide rows existed for
this library before it was added. `03-undo.sql` records that none were written.

Do not run `scripts/06-rollback-DO-NOT-RUN.sql`.
Do not turn the flags on without Ryan's explicit OK.
