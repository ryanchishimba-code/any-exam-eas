\set ON_ERROR_STOP on
BEGIN;
SET LOCAL statement_timeout = '15min';
SET LOCAL lock_timeout = '120s';
\ir p2-guard.sql
\ir p2-body.sql
\ir p2-assert.sql
COMMIT;
