\set ON_ERROR_STOP on
BEGIN;
SET LOCAL statement_timeout = '15min';
SET LOCAL lock_timeout = '120s';
\ir p1-guard.sql
\ir p1-body.sql
DO $notice$
BEGIN
  RAISE NOTICE 'p1 dry run counts matched; rolling back';
END
$notice$;
ROLLBACK;
