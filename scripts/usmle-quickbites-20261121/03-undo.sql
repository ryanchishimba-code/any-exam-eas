-- Undo for the hidden USMLE Quick Bites library.
-- No database rows were inserted, so there is nothing to restore.
-- Leaving USMLE_QUICK_BITES_PUBLIC and NEXT_PUBLIC_USMLE_QUICK_BITES_PUBLIC unset
-- keeps /usmle/quick-bites hidden from students.
-- Do not run scripts/06-rollback-DO-NOT-RUN.sql.

SELECT 0 AS usmle_quick_bite_rows_remaining;
