-- Generated 2026-10-30 (America/Chicago). Target: Neon project lively-silence-56893462, table "QuestionBankItem". Run with psql.
-- Undo: re-activates the one hidden early-deceleration row.
-- The hide set active=false only. qaPassed was left true, matching the 2026-10-30 naloxone hides.
-- Guarded on the contentHash, key, and active=false.
BEGIN;
DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" SET active = true
  WHERE id = 'cmsewq8pv005b1y56ub57mswj'
    AND "contentHash" = 'f82ab02311d046a33ddc2c118f59596185b1b3309f0c549e512cede08041c7cd'
    AND "correctAnswer" = $qb$Early decelerations on the fetal heart rate monitor$qb$
    AND active = false;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'undo: expected 1 hidden row for cmsewq8pv005b1y56ub57mswj, found %', n; END IF;
END
$do$;

SELECT id, active, "qaPassed", manual_correction AS mc, left("contentHash",12) AS hash12, difficulty AS diff, left("correctAnswer",70) AS key70, left(question,60) AS question60
FROM "QuestionBankItem" WHERE id = 'cmsewq8pv005b1y56ub57mswj';
SELECT count(*) FILTER (WHERE active AND "qaPassed") AS nursing_active_qapassed, count(*) FILTER (WHERE active) AS nursing_active, count(*) AS nursing_total
FROM "QuestionBankItem" WHERE "fieldId" = 'nursing';
COMMIT;
-- Alternative restore from the backup table (all columns) if ever needed:
--   UPDATE "QuestionBankItem" t SET question=b.question, scenario=b.scenario, options=b.options, "correctAnswer"=b."correctAnswer",
--     explanation=b.explanation, "references"=b."references", difficulty=b.difficulty, "contentHash"=b."contentHash",
--     "generationMeta"=b."generationMeta", curation_meta=b.curation_meta, manual_correction=b.manual_correction,
--     "qaAuditedAt"=b."qaAuditedAt", "updatedAt"=b."updatedAt", active=b.active
--   FROM qbi_nclex_decel_20261030_backup b WHERE b.id=t.id;
