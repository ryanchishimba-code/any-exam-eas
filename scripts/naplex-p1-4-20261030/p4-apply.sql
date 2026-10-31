\set ON_ERROR_STOP on
BEGIN;
SET LOCAL statement_timeout = '15min';
SET LOCAL lock_timeout = '120s';
\ir p4-guard.sql
\ir p4-body.sql
\ir p4-assert.sql
COMMIT;
