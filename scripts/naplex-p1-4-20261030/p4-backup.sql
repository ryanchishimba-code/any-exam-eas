-- Full-row backup of the 54 p4 rows into public.qbi_naplex_p4_20261030_backup.
-- SELECT * keeps every column, including embedding. Rolls back the table if the
-- pharmacy/NAPLEX count guard fails. Does not drop anything.
\set ON_ERROR_STOP on
BEGIN;
SET LOCAL statement_timeout = '15min';
SET LOCAL lock_timeout = '120s';
CREATE TABLE public.qbi_naplex_p4_20261030_backup AS
SELECT *
FROM "QuestionBankItem"
WHERE id IN (
  SELECT jsonb_array_elements_text($ids$["cmr7sbvmg00181y2vsbjypz8k","cmr0mle46000q1y3490phnae0","cmshjhax4000e1yspzhhgi60e","cmshi6sg3000w1y29myjdx6d8","cmros03zl001x1yok8cg1xwed","cmr0mwumu005u1y34d17ywgi8","cmr4j6rb3001j1ygk3d8iub8e","cmrorqphl00041yokjywzmgz7","cmsfjapv400081yms128u5ldf","cmr80qoix001j1yjnfiqt6uv4","cmr4fwi6x004a1yroyencxdt1","cmshg6q0i001y1yft25u0888l","cmr4edxdz003t1yk37bjn2ajl","cmrovuyoo000c1yu3xnnykipd","cmr7ugsow00151yt3cpldkcqn","cmra6ltbk000k1ybjys03owcn","cmr4itdnw004f1y7u7to1kbt1","cmrlfp7jl00171yolj8l9qnfa","cmrlgnbrf001b1yu0jkwwu5gz","cmrlhe4tt00151yf3it4mvuee","cmrlhg4le001l1yf3xlgzxsnt","cmrli3n3600151yuv4z1f5xol","cmrli4v3p001d1yuvmnprd3eq","cmrli7jcl001t1yuvkw7caiy1","cmrli8qhs00211yuv1029mcix","cmrlio14n00161ybl36w9usq4","cmrlioxsj001e1ybltr9dfkn6","cmrlkcpzz001d1ya8ybdri2i7","cmrlkdnup001l1ya86kdk4859","cmrm22jr1000u1yshc72dn175","cmrm23ogo00121yshdcnqc4ob","cmrmtbir300111y58oswbu3ay","cmrnbs3o9000g1ywdmckm1x7c","cmrnbt6e0000o1ywdbcf7fpjm","cmrnbuacn000w1ywdyirq2p8x","cmroe90pc000w1yc0bsollmiw","cmrog7dys00191ymqees56l6s","cmrog89o5001h1ymqp1c3xau2","cmrovyvj0000y1yu3doe4wm22","cmrow2da8001e1yu3vlzmjif4","cmrow2yg1001m1yu3ri5hsz01","cmrp2z98a000y1yp4iel69yws","cmrp46xuc00181yesodbww0gs","cmrp49uxj001o1yesw175ny7k","cmrp7qtwp000r1y2n883a8wd1","cmrp7s84z000z1y2njbejk2s6","cmrp7ssam00171y2nbquwj81g","cmsfjtw91001b1yq4ilo3l1zb","cmsfy8g1x001d1yth4gescgg9","cmshcxs6e002d1yaru5q27fg8","cmshdzwo6001g1y1i4b7parvq","cmshfzxce00091yftwfu02on2","cmshi10q3001u1y66kt152cnu","cmshi4y4a000c1y29jlcimbat"]$ids$::jsonb)
);
\ir p4-guard.sql
COMMIT;
SELECT 'p4 backup' AS step, count(*) AS rows
FROM public.qbi_naplex_p4_20261030_backup;
