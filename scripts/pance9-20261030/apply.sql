-- APPLY retag (incl. +45 professional), 69 hides, 2 citation fixes, difficulty down-rates. NOT fifth options/shuffle (see apply_fifth.sql).
-- Needs Ryan's OK on the dry-run output. Run: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f apply.sql
\i stage.sql
begin;
\i backup.sql
update "QuestionBankItem" q set "taskCategory"=s.new_task, "updatedAt"=now()
 from s_retag s where q.id=s.id and q."fieldId"='pance' and q."taskCategory" is not distinct from s.old_task;
update "QuestionBankItem" q set active=false, "updatedAt"=now(),
 curation_meta=coalesce(q.curation_meta,'{}'::jsonb)||jsonb_build_object('pance9',coalesce(q.curation_meta->'pance9','{}'::jsonb)||jsonb_build_object('hidden',s.reason,'hiddenAt','2026-10'))
 from s_hide s where q.id=s.id and q."fieldId"='pance' and q.active;
update "QuestionBankItem" q set "references"=s.new_refs, "updatedAt"=now() from s_cite s where q.id=s.id and q."references"=s.old_refs;
update "QuestionBankItem" q set difficulty=s.new_d, "updatedAt"=now() from s_diff s where q.id=s.id and q.difficulty=s.old_d;
select 'retag not applied' c, count(*) from "QuestionBankItem" q join s_retag s using(id) where q."taskCategory" is distinct from s.new_task
union all select 'hide not applied', count(*) from "QuestionBankItem" q join s_hide s using(id) where q.active
union all select 'cite not applied', count(*) from "QuestionBankItem" q join s_cite s using(id) where q."references" is distinct from s.new_refs
union all select 'difficulty not applied', count(*) from "QuestionBankItem" q join s_diff s using(id) where q.difficulty is distinct from s.new_d;
-- all 0 expected
commit;
