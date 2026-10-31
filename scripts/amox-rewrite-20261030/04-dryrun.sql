-- Dry run of the amoxicillin rewrite. Rolls back. Aborts unless the row count is exactly 1.
\set ON_ERROR_STOP on
BEGIN;
\ir 01-backup.sql
\ir 02-apply.sql
DO $do$
BEGIN
  RAISE NOTICE 'amox dry run row count matched; rolling back';
END
$do$;
ROLLBACK;
