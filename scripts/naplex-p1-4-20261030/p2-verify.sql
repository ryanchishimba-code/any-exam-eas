\set ON_ERROR_STOP on
\ir p2-assert.sql
SELECT 'p2 verify' AS step, count(*) AS backup_rows FROM public.qbi_naplex_p2_20261030_backup;
