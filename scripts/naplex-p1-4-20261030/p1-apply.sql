\set ON_ERROR_STOP on
BEGIN;
SET LOCAL statement_timeout = '15min';
SET LOCAL lock_timeout = '120s';
\ir p1-guard.sql
\ir p1-body.sql
\ir p1-assert.sql
COMMIT;
