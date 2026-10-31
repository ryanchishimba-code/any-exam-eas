-- Target: Neon project lively-silence-56893462, database anyexameasy, branch main (br-super-frog-apuqj2ol).
-- NAPLEX item cmsg08i5x00021yiylzrl0zhf. Ryan approved the amoxicillin rewrite at 9:13 PM CT on 2026-10-30.
-- Changes the vignette, lead-in, options, key, rationale, citations, and difficulty.
-- Sets qaPassed = true, active = true, and manual_correction = true.
-- contentHash is sha256(fieldId|subjectId|lower(trim(scenario))|lower(trim(question))),
-- the same formula as bankItemContentHash in src/lib/sync-question-bank-guard.ts.
-- Does not edit application code. Does not drop the backup table.
-- Apply the approved rewrite to exactly 1 row.
-- Aborts unless the backup holds that 1 row and the update matches 1 row.
-- Run inside a transaction; this file does not COMMIT.

DO $do$
DECLARE
  n int;
  new_scenario text := $amoxs$A pharmacist receives a prescription for amoxicillin 400 mg/5 mL for a 4-year-old child. The product is supplied as a dry powder because amoxicillin degrades in aqueous solution.$amoxs$;
  new_question text := $amoxq$Which plan for preparing, storing, and labeling the suspension is most appropriate?$amoxq$;
  new_options text := $amoxo${"options": ["Reconstitute stock bottles in advance in batches, refrigerate them until dispensed, and label each to discard unused suspension after 14 days", "Reconstitute the powder at dispensing, store the bottle at room temperature, and label it to discard unused suspension after 30 days", "Reconstitute the powder with water at dispensing, keep the bottle refrigerated, and label it to discard unused suspension after 14 days", "Dispense the dry powder so the caregiver can reconstitute it at home, refrigerate the bottle, and discard unused suspension after 14 days"], "distractorRationale": {"Reconstitute stock bottles in advance in batches, refrigerate them until dispensed, and label each to discard unused suspension after 14 days": "Reconstituting ahead of dispensing starts the stability clock before the patient has the bottle and shortens the usable time; the label says to prepare the suspension at the time of dispensing.", "Reconstitute the powder at dispensing, store the bottle at room temperature, and label it to discard unused suspension after 30 days": "Room-temperature storage is allowed, but the labeled limit is 14 days after reconstitution, so a 30-day discard date lets degraded suspension be given.", "Dispense the dry powder so the caregiver can reconstitute it at home, refrigerate the bottle, and discard unused suspension after 14 days": "Reconstitution is done by the pharmacy at dispensing (measured water, vigorous shaking); sending the dry powder home risks wrong volume and an incorrect discard date."}, "clinicalReasoning": "Amoxicillin hydrolyzes in water, so it is supplied as a dry powder, reconstituted by the pharmacy at dispensing, refrigerated when possible, and discarded 14 days after reconstitution.", "keyTakeaways": ["Reconstitute amoxicillin powder at the time of dispensing.", "Refrigeration is preferable but not required; discard unused suspension after 14 days."], "blueprintTopic": "biopharmaceutics-dissolution", "blueprintSystem": "naplex-area1-foundations"}$amoxo$;
  new_key text := $amoxk$Reconstitute the powder with water at dispensing, keep the bottle refrigerated, and label it to discard unused suspension after 14 days$amoxk$;
  new_explanation text := $amoxe$Why correct: The label directs the pharmacy to prepare the suspension at the time of dispensing. Once reconstituted, amoxicillin is stable only for a limited time, so the bottle is refrigerated when possible (preferred, not required), shaken well before each use, and any unused suspension is discarded after 14 days.

Why the others are wrong:
- Batch reconstitution in advance: label says prepare at the time of dispensing.
- Room temperature with a 30-day discard date: room temperature is acceptable, but the 14-day limit is the labeled beyond-use date.
- Caregiver reconstitution at home: the pharmacy reconstitutes with the measured water volume.

Pearl: dry powder protects the drug from water until dispensing; the 14-day clock starts at reconstitution.

Source: Amoxicillin for oral suspension prescribing information (DailyMed setid 1dc5cc5a-59ba-4bc9-b581-cb7b70ce2652): 2.6 Directions for Mixing Oral Suspension; 'Any unused portion of the reconstituted suspension must be discarded after 14 days. Refrigeration is preferable, but not required.'$amoxe$;
  new_refs jsonb := $amoxr$[{"label":"Amoxicillin for oral suspension prescribing information (DailyMed)","url":"https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=1dc5cc5a-59ba-4bc9-b581-cb7b70ce2652"}]$amoxr$::jsonb;
  new_meta jsonb := $amoxm${"rationale":{"whyCorrect":"Why correct: The label directs the pharmacy to prepare the suspension at the time of dispensing. Once reconstituted, amoxicillin is stable only for a limited time, so the bottle is refrigerated when possible (preferred, not required), shaken well before each use, and any unused suspension is discarded after 14 days.","distractorRationales":{"Reconstitute stock bottles in advance in batches, refrigerate them until dispensed, and label each to discard unused suspension after 14 days":"Reconstituting ahead of dispensing starts the stability clock before the patient has the bottle and shortens the usable time; the label says to prepare the suspension at the time of dispensing.","Reconstitute the powder at dispensing, store the bottle at room temperature, and label it to discard unused suspension after 30 days":"Room-temperature storage is allowed, but the labeled limit is 14 days after reconstitution, so a 30-day discard date lets degraded suspension be given.","Dispense the dry powder so the caregiver can reconstitute it at home, refrigerate the bottle, and discard unused suspension after 14 days":"Reconstitution is done by the pharmacy at dispensing (measured water, vigorous shaking); sending the dry powder home risks wrong volume and an incorrect discard date."}},"rewrite":{"date":"2026-10-30","reason":"key aligned to amoxicillin label (reconstitute at dispensing; refrigeration preferable; discard after 14 days)","difficulty_basis":"one-step application of labeled handling facts; 4 complete near-miss plans (rubric score 2)","hedge_fix":"2026-10-30: removed 'when possible' hedge and 'the unused' wording from key option (only the key carried them)"},"manualCorrection":true}$amoxm$::jsonb;
  new_hash text := 'a0d06433216316017a690037fdb481a44244dcc27e03cf5f80cf1070d9a578a6';
BEGIN
  IF to_regclass('public.qbi_served_hide11_20261030_backup') IS NULL THEN
    RAISE EXCEPTION 'qbi_served_hide11_20261030_backup does not exist yet';
  END IF;
  IF to_regclass('public.qbi_amox_rewrite_20261030_backup') IS NULL THEN
    RAISE EXCEPTION 'qbi_amox_rewrite_20261030_backup does not exist';
  END IF;
  IF (SELECT count(*) FROM qbi_amox_rewrite_20261030_backup) <> 1
     OR (SELECT count(*) FROM qbi_amox_rewrite_20261030_backup WHERE id = 'cmsg08i5x00021yiylzrl0zhf' AND "fieldId" = 'pharmacy') <> 1 THEN
    RAISE EXCEPTION 'backup is not exactly the 1 pharmacy row';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE "contentHash" = new_hash AND id <> 'cmsg08i5x00021yiylzrl0zhf'
  ) THEN
    RAISE EXCEPTION 'new contentHash collides with another row';
  END IF;
  IF NOT (new_options::jsonb->'options' ? new_key) THEN
    RAISE EXCEPTION 'key is not one of the new options';
  END IF;

  UPDATE "QuestionBankItem" AS q
  SET
    scenario = new_scenario,
    question = new_question,
    options = new_options,
    "correctAnswer" = new_key,
    explanation = new_explanation,
    "references" = new_refs,
    difficulty = 2,
    "contentHash" = new_hash,
    "qaPassed" = true,
    active = true,
    manual_correction = true,
    "generationMeta" = COALESCE(q."generationMeta", '{}'::jsonb) || new_meta,
    "updatedAt" = NOW()
  WHERE q.id = 'cmsg08i5x00021yiylzrl0zhf'
    AND q."fieldId" = 'pharmacy'
    AND EXISTS (
      SELECT 1 FROM qbi_amox_rewrite_20261030_backup AS backup WHERE backup.id = q.id
    );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'matched row count %, expected 1', n;
  END IF;

  IF (
    SELECT count(*)
    FROM "QuestionBankItem" AS q
    WHERE q.id = 'cmsg08i5x00021yiylzrl0zhf'
      AND q."fieldId" = 'pharmacy'
      AND q.scenario = new_scenario
      AND q.question = new_question
      AND q.options = new_options
      AND q."correctAnswer" = new_key
      AND q.explanation = new_explanation
      AND q."references" = new_refs
      AND q.difficulty = 2
      AND q."contentHash" = new_hash
      AND q."qaPassed" = true
      AND q.active = true
      AND q.manual_correction = true
      AND COALESCE(q."generationMeta"->>'manualCorrection', '') = 'true'
      AND q."generationMeta"->'rationale' = new_meta->'rationale'
  ) <> 1 THEN
    RAISE EXCEPTION 'amox rewrite verification failed';
  END IF;
  RAISE NOTICE 'amox apply row count %', n;
END
$do$;
