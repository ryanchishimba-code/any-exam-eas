\set ON_ERROR_STOP on
\ir p4-assert.sql
SELECT 'p4 verify' AS step, count(*) AS backup_rows FROM public.qbi_naplex_p4_20261030_backup;
