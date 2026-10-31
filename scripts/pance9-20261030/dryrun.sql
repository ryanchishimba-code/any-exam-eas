-- DRY RUN: read-only apart from session temp tables. Run: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f dryrun.sql
\i stage.sql
select 'retag: would change' step, count(*) from "QuestionBankItem" q join s_retag s using(id) where q."fieldId"='pance' and q."taskCategory" is not distinct from s.old_task
union all select 'retag: already applied', count(*) from "QuestionBankItem" q join s_retag s using(id) where q."taskCategory"=s.new_task
union all select 'retag: drift', count(*) from "QuestionBankItem" q join s_retag s using(id) where q."taskCategory" is distinct from s.old_task and q."taskCategory" is distinct from s.new_task
union all select 'hide: would change', count(*) from "QuestionBankItem" q join s_hide s using(id) where q."fieldId"='pance' and q.active
union all select 'hide: already inactive', count(*) from "QuestionBankItem" q join s_hide s using(id) where not q.active
union all select 'cite: would change', count(*) from "QuestionBankItem" q join s_cite s using(id) where q."references"=s.old_refs
union all select 'cite: already applied', count(*) from "QuestionBankItem" q join s_cite s using(id) where q."references"=s.new_refs
union all select 'difficulty: would change', count(*) from "QuestionBankItem" q join s_diff s using(id) where q.difficulty=s.old_d
union all select 'difficulty: already applied', count(*) from "QuestionBankItem" q join s_diff s using(id) where q.difficulty=s.new_d
union all select 'difficulty: drift', count(*) from "QuestionBankItem" q join s_diff s using(id) where q.difficulty is distinct from s.old_d and q.difficulty is distinct from s.new_d
union all select 'fifth: would change (gated step)', count(*) from "QuestionBankItem" q join s_fifth s using(id) where (case when left(btrim(q.options),1)='{' then q.options::jsonb->'options' end)=s.old_options and q."correctAnswer"=s.old_key and md5(coalesce(q.scenario,''))=s.old_sc_md5 and md5(coalesce(q.explanation,''))=s.old_expl_md5
union all select 'fifth: already applied', count(*) from "QuestionBankItem" q join s_fifth s using(id) where (case when left(btrim(q.options),1)='{' then q.options::jsonb->'options' end)=s.new_options
union all select 'fifth: drift', count(*) from "QuestionBankItem" q join s_fifth s using(id) where (case when left(btrim(q.options),1)='{' then q.options::jsonb->'options' end) is distinct from s.old_options and (case when left(btrim(q.options),1)='{' then q.options::jsonb->'options' end) is distinct from s.new_options
union all select 'overlap fifth & hide (expect 0)', count(*) from s_fifth join s_hide using(id)
union all select 'missing ids', count(*) from (select id from s_retag union select id from s_hide union select id from s_cite union select id from s_diff union select id from s_fifth) x where not exists(select 1 from "QuestionBankItem" q where q.id=x.id);
-- expected on a fresh DB: retag 646 / hide 69 / cite 2 / difficulty 65 / fifth 87 / every drift 0 / overlap 0 / missing 0
