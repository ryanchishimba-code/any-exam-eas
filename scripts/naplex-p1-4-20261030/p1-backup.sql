-- Full-row backup of the 25 p1 rows into public.qbi_naplex_p1_20261030_backup.
-- SELECT * keeps every column, including embedding. Rolls back the table if the
-- pharmacy/NAPLEX count guard fails. Does not drop anything.
\set ON_ERROR_STOP on
BEGIN;
SET LOCAL statement_timeout = '15min';
SET LOCAL lock_timeout = '120s';
CREATE TABLE public.qbi_naplex_p1_20261030_backup AS
SELECT *
FROM "QuestionBankItem"
WHERE id IN (
  SELECT jsonb_array_elements_text($ids$["cmra7vbdt004w1y3ewz30krtr","cmr7sbvmg00181y2vsbjypz8k","cmrm22k1h000x1yshd85zlmd7","cmr0qcbhr005n1y9axb0jveim","cmr0mle46000q1y3490phnae0","cmshjhax4000e1yspzhhgi60e","cmshi6sg3000w1y29myjdx6d8","cmros03zl001x1yok8cg1xwed","cmr0mwumu005u1y34d17ywgi8","cmr4j6rb3001j1ygk3d8iub8e","cmros04ee00211yokmeq6u7pc","cmrorqphl00041yokjywzmgz7","cmr4edxdz003t1yk37bjn2ajl","cmsfjapv400081yms128u5ldf","cmr80qoix001j1yjnfiqt6uv4","cmr4fwi6x004a1yroyencxdt1","cmshg6q0i001y1yft25u0888l","cmr4itdnw004f1y7u7to1kbt1","cmr7ugsow00151yt3cpldkcqn","cmra6ltbk000k1ybjys03owcn","cmrovuyoo000c1yu3xnnykipd","cmqvlh4fv00171y745ijian72","cmrlhabol00071yf3p44ab0jv","cmr062ltj005b1yhothxwdmxw","cmr7td8z600191y4g9f54g92p"]$ids$::jsonb)
);
\ir p1-guard.sql
COMMIT;
SELECT 'p1 backup' AS step, count(*) AS rows
FROM public.qbi_naplex_p1_20261030_backup;
