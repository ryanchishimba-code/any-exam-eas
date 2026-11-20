-- Restores the pre-correction text of b4-s1-25 only.
-- Requires qbi_usmle_batch4_s125_before. Does not activate or deactivate anything.
BEGIN;
DO $$
DECLARE
  n integer;
BEGIN
  UPDATE "QuestionBankItem" q
  SET options = b.options,
      "correctAnswer" = b."correctAnswer",
      explanation = b.explanation,
      "generationMeta" = b."generationMeta",
      "updatedAt" = NOW()
  FROM qbi_usmle_batch4_s125_before b
  WHERE q.id = b.id
    AND q.source = 'batch4-draft'
    AND q.active = false
    AND q."qaPassed" = false;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'restored % rows, expected 1 hidden b4-s1-25', n;
  END IF;
END $$;
COMMIT;
