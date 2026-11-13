-- Option-length gloss trim, 2026-11-13. Four keys lose an em-dash aside that does not change the choice.
-- Backup qbi_usmle_optlen2_20261113_backup (4 rows).
-- Undo: scripts/undo-usmle-optlen2-20261113.sql
BEGIN;
CREATE TABLE qbi_usmle_optlen2_20261113_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN ('cmra6lzkv003yic04yckey7kr', 'cmrrbwant000tl10483z9gubp', 'cmru6qyfx0027l104xbqu6fco', 'cmr31dkd400b3js047wbojq6e');
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_optlen2_20261113_backup) <> 4 THEN
    RAISE EXCEPTION 'backup row count %, expected 4', (SELECT COUNT(*) FROM qbi_usmle_optlen2_20261113_backup);
  END IF;
END
$check$;
UPDATE "QuestionBankItem" SET
  "correctAnswer" = $k0$Preeclampsia with severe features$k0$,
  options = replace(options, $o0$Preeclampsia with severe features — risk of eclampsia/HELLP$o0$, $n0$Preeclampsia with severe features$n0$),
  explanation = replace(explanation, $e0$Preeclampsia with severe features — risk of eclampsia/HELLP$e0$, $f0$Preeclampsia with severe features$f0$),
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmra6lzkv003yic04yckey7kr' AND "correctAnswer" = $w0$Preeclampsia with severe features — risk of eclampsia/HELLP$w0$;
UPDATE "QuestionBankItem" SET
  "correctAnswer" = $k1$Preeclampsia with severe features$k1$,
  options = replace(options, $o1$Preeclampsia with severe features — risk of eclampsia/HELLP$o1$, $n1$Preeclampsia with severe features$n1$),
  explanation = replace(explanation, $e1$Preeclampsia with severe features — risk of eclampsia/HELLP$e1$, $f1$Preeclampsia with severe features$f1$),
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmrrbwant000tl10483z9gubp' AND "correctAnswer" = $w1$Preeclampsia with severe features — risk of eclampsia/HELLP$w1$;
UPDATE "QuestionBankItem" SET
  "correctAnswer" = $k2$Preeclampsia with severe features$k2$,
  options = replace(options, $o2$Preeclampsia with severe features — risk of eclampsia/HELLP$o2$, $n2$Preeclampsia with severe features$n2$),
  explanation = replace(explanation, $e2$Preeclampsia with severe features — risk of eclampsia/HELLP$e2$, $f2$Preeclampsia with severe features$f2$),
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmru6qyfx0027l104xbqu6fco' AND "correctAnswer" = $w2$Preeclampsia with severe features — risk of eclampsia/HELLP$w2$;
UPDATE "QuestionBankItem" SET
  "correctAnswer" = $k3$Mechanical mitral valve requires warfarin; DOACs contraindicated$k3$,
  options = replace(options, $o3$Mechanical mitral valve requires warfarin; DOACs contraindicated — reinforce adherence and INR follow-up$o3$, $n3$Mechanical mitral valve requires warfarin; DOACs contraindicated$n3$),
  explanation = replace(explanation, $e3$Mechanical mitral valve requires warfarin; DOACs contraindicated — reinforce adherence and INR follow-up$e3$, $f3$Mechanical mitral valve requires warfarin; DOACs contraindicated$f3$),
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr31dkd400b3js047wbojq6e' AND "correctAnswer" = $w3$Mechanical mitral valve requires warfarin; DOACs contraindicated — reinforce adherence and INR follow-up$w3$;
COMMIT;
