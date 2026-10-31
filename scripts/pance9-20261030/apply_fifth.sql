-- GATED: run ONLY after the blind check passes and Ryan OKs it. 87 items (96 - 8 near-twin hides - #8 excluded). ROUND-2 content: run only after the r2 blind check (fifth-option-blind-r2.md) passes.
-- Adds the 5th option, writes the balanced (shuffled) order (keys 17/17/17/17/17 A-E), appends the "Why not <new option>" line
-- to the explanation. correctAnswer (answer text) changes on 19 items; scenario/question change on 41 items (through r5). Items stay flagged "pending blind check".
\set ON_ERROR_STOP on
\i stage.sql
select case when :'blind_check_passed'='yes' then 1 else (select 1/0) end as gate;  -- psql -v blind_check_passed=yes
begin;
\i backup.sql
update "QuestionBankItem" q set options=jsonb_set(q.options::jsonb,'{options}',s.new_options)::text, explanation=s.new_expl, scenario=s.new_sc, question=s.new_q, "correctAnswer"=s.key_text, "updatedAt"=now(),
 curation_meta=coalesce(q.curation_meta,'{}'::jsonb)||jsonb_build_object('pance9',coalesce(q.curation_meta->'pance9','{}'::jsonb)||jsonb_build_object('fifthOption','pending blind check','addedOption',s.new_option,'keyLetter',s.new_key_letter,'shuffled','2026-10'))
 from s_fifth s where q.id=s.id and q.active
  and (case when left(btrim(q.options),1)='{' then q.options::jsonb->'options' end)=s.old_options
  and q."correctAnswer"=s.old_key and md5(coalesce(q.explanation,''))=s.old_expl_md5
  and md5(coalesce(q.scenario,''))=s.old_sc_md5 and md5(coalesce(q.question,''))=s.old_q_md5;
select 'fifth not applied' c, count(*) from "QuestionBankItem" q join s_fifth s using(id) where (case when left(btrim(q.options),1)='{' then q.options::jsonb->'options' end) is distinct from s.new_options
union all select 'key not at mapped letter', count(*) from "QuestionBankItem" q join s_fifth s using(id) where (q.options::jsonb->'options'->>(ascii(s.new_key_letter)-65)) is distinct from q."correctAnswer"
union all select 'stem not updated', count(*) from "QuestionBankItem" q join s_fifth s using(id) where q.scenario is distinct from s.new_sc or q.question is distinct from s.new_q
union all select 'explanation not updated', count(*) from "QuestionBankItem" q join s_fifth s using(id) where q.explanation is distinct from s.new_expl;
-- all 0 expected
commit;
