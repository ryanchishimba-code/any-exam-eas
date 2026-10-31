\set ON_ERROR_STOP on
\ir p1-assert.sql
SELECT 'p1 verify' AS step, count(*) AS backup_rows FROM public.qbi_naplex_p1_20261030_backup;
