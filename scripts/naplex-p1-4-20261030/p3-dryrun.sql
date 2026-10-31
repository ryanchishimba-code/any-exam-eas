\set ON_ERROR_STOP on
BEGIN;
SET LOCAL statement_timeout = '15min';
SET LOCAL lock_timeout = '120s';
\ir p3-guard.sql
\ir p3-body.sql
DO $notice$
BEGIN
  RAISE NOTICE 'p3 dry run counts matched; rolling back';
END
$notice$;
ROLLBACK;
