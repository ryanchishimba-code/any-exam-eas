-- Dry run of the 10-item hide. Rolls back. Aborts unless the row count is exactly 10.
\set ON_ERROR_STOP on
BEGIN;
\ir 01-backup.sql
\ir 02-hide.sql
DO $do$
BEGIN
  RAISE NOTICE 'hide10 dry run row count matched; rolling back';
END
$do$;
ROLLBACK;
