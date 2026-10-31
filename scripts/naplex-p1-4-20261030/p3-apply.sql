\set ON_ERROR_STOP on
BEGIN;
SET LOCAL statement_timeout = '15min';
SET LOCAL lock_timeout = '120s';
\ir p3-guard.sql
\ir p3-body.sql
\ir p3-assert.sql
COMMIT;
