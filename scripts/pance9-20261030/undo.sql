-- UNDO: restore EVERY changed column from pance9_backup (pre-change snapshot). Safe to re-run.
-- r4: undo also covers the 4 new hides and the 6 formerly excluded items, because both are in s_hide/s_fifth and are backed up by backup.sql.
begin;
update "QuestionBankItem" q set "taskCategory"=b."taskCategory", active=b.active, options=b.options, "references"=b."references", curation_meta=b.curation_meta,
 difficulty=coalesce(b.difficulty,q.difficulty), explanation=coalesce(b.explanation,q.explanation), "correctAnswer"=coalesce(b."correctAnswer",q."correctAnswer"), scenario=coalesce(b.scenario,q.scenario), question=coalesce(b.question,q.question), "updatedAt"=now()
 from pance9_backup b where q.id=b.id;
select 'rows differing from backup' c, count(*) from "QuestionBankItem" q join pance9_backup b using(id)
 where q."taskCategory" is distinct from b."taskCategory" or q.active is distinct from b.active or q.options is distinct from b.options
  or q."references" is distinct from b."references" or q.curation_meta is distinct from b.curation_meta
  or (b.difficulty is not null and q.difficulty is distinct from b.difficulty) or (b.scenario is not null and q.scenario is distinct from b.scenario) or (b."correctAnswer" is not null and q."correctAnswer" is distinct from b."correctAnswer") or (b.explanation is not null and q.explanation is distinct from b.explanation);
commit;
