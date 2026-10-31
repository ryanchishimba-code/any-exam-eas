\set ON_ERROR_STOP on
\ir p3-assert.sql
SELECT 'p3 verify' AS step, count(*) AS backup_rows FROM public.qbi_naplex_p3_20261030_backup;
