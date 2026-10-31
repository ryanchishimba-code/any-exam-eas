-- Shared backup: every column any pance-9 step changes. First snapshot wins (re-runs keep pre-change values).
create table if not exists pance9_backup(id text primary key, "taskCategory" text, active boolean, options text, "references" jsonb, curation_meta jsonb, backed_up_at timestamptz default now());
alter table pance9_backup add column if not exists difficulty int;
alter table pance9_backup add column if not exists explanation text;
alter table pance9_backup add column if not exists "correctAnswer" text;
alter table pance9_backup add column if not exists scenario text;
alter table pance9_backup add column if not exists question text;
insert into pance9_backup(id,"taskCategory",active,options,"references",curation_meta,difficulty,explanation,"correctAnswer",scenario,question)
 select q.id,q."taskCategory",q.active,q.options,q."references",q.curation_meta,q.difficulty,q.explanation,q."correctAnswer",q.scenario,q.question from "QuestionBankItem" q
 where q.id in (select id from s_retag union select id from s_hide union select id from s_cite union select id from s_diff union select id from s_fifth)
 on conflict (id) do nothing;
-- rows backed up by the turn-2 package (no difficulty/explanation yet): fill those columns only if the row is still unchanged in them
update pance9_backup b set difficulty=q.difficulty, explanation=q.explanation, "correctAnswer"=q."correctAnswer", scenario=q.scenario, question=q.question
 from "QuestionBankItem" q where q.id=b.id and b.explanation is null and b.difficulty is null;
