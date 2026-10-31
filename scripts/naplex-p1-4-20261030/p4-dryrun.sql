\set ON_ERROR_STOP on
BEGIN;
SET LOCAL statement_timeout = '15min';
SET LOCAL lock_timeout = '120s';
\ir p4-guard.sql
\ir p4-body.sql
DO $notice$
BEGIN
  RAISE NOTICE 'p4 dry run counts matched; rolling back';
END
$notice$;
ROLLBACK;
