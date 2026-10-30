-- 00-dry-run.sql
-- NCLEX Management of Care pilot v6, built 2026-10-30. Prepared only. Not RN-reviewed.
-- This file is a dry run. It ends in ROLLBACK and leaves the database unchanged.
-- Target table: "QuestionBankItem". Field: nursing.
-- Do not run scripts/06-rollback-DO-NOT-RUN.sql. This package has no such file.
-- Backup tables: qbi_nclex_moc_v6_insert_20261030, qbi_nclex_item5_v6_rewrite_20261030, qbi_nclex_item5_ibu_hide_20261030, qbi_nclex_moc_v6_activate_20261030.

BEGIN;

CREATE TEMP TABLE moc_v6_dry_baseline AS
SELECT
  (SELECT count(*)::int FROM "QuestionBankItem") AS all_rows,
  (SELECT count(*)::int FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active) AS active_n,
  (SELECT count(*)::int FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active AND "qaPassed") AS served,
  (SELECT count(*)::int FROM "QuestionBankItem" WHERE "subjectId" = 'management-of-care' AND active AND "qaPassed") AS moc_served;

CREATE TEMP TABLE moc_v6_dry_log (
  step text,
  all_rows int,
  active_n int,
  served int,
  moc_served int
);
INSERT INTO moc_v6_dry_log SELECT 'baseline', * FROM moc_v6_dry_baseline;

DO $guard$
BEGIN
  IF to_regclass('public.qbi_nclex_moc_v6_insert_20261030') IS NOT NULL THEN
    RAISE EXCEPTION 'qbi_nclex_moc_v6_insert_20261030 already exists; refusing to run again';
  END IF;
END
$guard$;

DO $guard$
BEGIN
  IF to_regclass('public.qbi_nclex_item5_v6_rewrite_20261030') IS NOT NULL THEN
    RAISE EXCEPTION 'qbi_nclex_item5_v6_rewrite_20261030 already exists; refusing to run again';
  END IF;
END
$guard$;

-- Snapshot the six item5 rows before the rewrites.
CREATE TABLE qbi_nclex_item5_v6_rewrite_20261030 AS
SELECT * FROM "QuestionBankItem"
WHERE id IN ($nclexmocv6$cmr10qu8s004b1y8a0dec0jwg$nclexmocv6$, $nclexmocv6$cmr7h3beq00281yx37jhuz8o1$nclexmocv6$, $nclexmocv6$cmr77iubz010y1ywud6yfj667$nclexmocv6$, $nclexmocv6$cmr8oj5p000221y5n2ejafia4$nclexmocv6$, $nclexmocv6$cmr8qk18300b51yvfpi42yu14$nclexmocv6$, $nclexmocv6$cmsex2vtw00c61y56oysbpti1$nclexmocv6$);
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_item5_v6_rewrite_20261030)::integer INTO n;
  IF n IS DISTINCT FROM 6 THEN
    RAISE EXCEPTION 'rewrite backup: expected 6, found %', n;
  END IF;
END
$check$;

DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_item5_v6_rewrite_20261030
WHERE id = $nclexmocv6$cmr10qu8s004b1y8a0dec0jwg$nclexmocv6$
  AND "contentHash" = $nclexmocv6$13ccd40ece9c834149cf5c6d70675d90c34e143722b4bbf6986add4125df20f8$nclexmocv6$
  AND "subjectId" = $nclexmocv6$safety-infection$nclexmocv6$
  AND active = true
  AND "qaPassed" = true)::integer INTO n;
  IF n IS DISTINCT FROM 1 THEN
    RAISE EXCEPTION 'rewrite pre-image cmr10qu8s004b1y8a0dec0jwg: expected 1, found %', n;
  END IF;
END
$check$;

DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" SET
    "subjectId" = $nclexmocv6$management-of-care$nclexmocv6$,
    scenario = $nclexmocv6$The nurse is caring for four clients on a surgical unit at the start of the shift.$nclexmocv6$,
    question = $nclexmocv6$Which client should the nurse assess first?$nclexmocv6$,
    options = $nclexmocv6${"kind":"mcq","options":["A 62-year-old client with hypertension who reports a mild headache and has a BP of 152/90 mm Hg today","A 70-year-old client on postoperative day 2 with a Foley catheter who reports mild abdominal discomfort","A 45-year-old client 6 hours after a total abdominal hysterectomy with BP 88/54 mm Hg and HR 118/min","A 58-year-old client with type 2 diabetes who has a glucose of 168 mg/dL and asks for help with a meal tray"],"clientNeedsCategory":"Management of Care","blueprintTopic":"prioritization","distractorRationale":{"A 62-year-old client with hypertension who reports a mild headache and has a BP of 152/90 mm Hg today":"Mild headache with a moderately elevated BP in a client with known hypertension is not an immediate threat to life.","A 70-year-old client on postoperative day 2 with a Foley catheter who reports mild abdominal discomfort":"Mild discomfort on postoperative day 2 with a catheter in place is not unstable; assess after the unstable client.","A 58-year-old client with type 2 diabetes who has a glucose of 168 mg/dL and asks for help with a meal tray":"A glucose of 168 mg/dL and a request for meal help are stable needs that can wait."}}$nclexmocv6$,
    "correctAnswer" = $nclexmocv6$A 45-year-old client 6 hours after a total abdominal hysterectomy with BP 88/54 mm Hg and HR 118/min$nclexmocv6$,
    explanation = $nclexmocv6$The early postoperative client with hypotension and tachycardia has unstable, possibly hemorrhagic findings, so she is assessed first (acuity-based prioritization). The other three clients are stable or have expected, non-urgent findings.$nclexmocv6$,
    "references" = $nclexmocv6$[{"src":"NCSBN2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"OPENRN-PRIOR","label":"Open RN Nursing Management and Professional Concepts - Prioritization (Open RN/NCBI Bookshelf)","url":"https://www.ncbi.nlm.nih.gov/books/NBK610461/"}]$nclexmocv6$::jsonb,
    "contentHash" = $nclexmocv6$2436d3f949e2fa9033378d7b17779d9c12e1d956c9f32aa81700c5d47c91665d$nclexmocv6$,
    "topicCategory" = $nclexmocv6$Management of Care$nclexmocv6$,
    "blueprintDomain" = $nclexmocv6$nclex-safe-care$nclexmocv6$,
    "blueprintTopic" = $nclexmocv6$prioritization$nclexmocv6$,
    "clientNeeds" = $nclexmocv6$Management of Care$nclexmocv6$,
    manual_correction = true,
    "qaAuditedAt" = NULL,
    embedding = NULL,
    quality_score = NULL,
    cluster_id = NULL,
    keep_recommendation = NULL,
    review_flag = NULL,
    curation_meta = $nclexmocv6${"metadataBy":"nclex-item5-v6-rewrite","item5":1,"heldUntilRnReview":true}$nclexmocv6$::jsonb,
    "generationMeta" = (
      COALESCE("generationMeta", '{}'::jsonb)
      - 'expertRationale'
      - 'visualRationale'
      - 'rationaleQualityScore'
      - 'expertRationaleVersion'
      - 'rationaleEnrichedAt'
      - 'rationaleEnrichFailCount'
      - 'rationaleEnrichFailReason'
    ) || $nclexmocv6${"manualCorrection":true,"nclexItem5V6Rewrite":true,"rewriteBatch":"nclex-item5-v6-20261030","item5":1}$nclexmocv6$::jsonb,
    "updatedAt" = CURRENT_TIMESTAMP
  WHERE id = $nclexmocv6$cmr10qu8s004b1y8a0dec0jwg$nclexmocv6$
    AND "contentHash" = $nclexmocv6$13ccd40ece9c834149cf5c6d70675d90c34e143722b4bbf6986add4125df20f8$nclexmocv6$
    AND "subjectId" = $nclexmocv6$safety-infection$nclexmocv6$
    AND active = true
    AND "qaPassed" = true;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'rewrite cmr10qu8s004b1y8a0dec0jwg expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cmr10qu8s004b1y8a0dec0jwg$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$f9ff33054ac49b2f3be006267312e55a$nclexmocv6$ THEN
    RAISE EXCEPTION 'rewrite stem mismatch for cmr10qu8s004b1y8a0dec0jwg';
  END IF;
  IF (SELECT "contentHash" FROM "QuestionBankItem" WHERE id = $nclexmocv6$cmr10qu8s004b1y8a0dec0jwg$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$2436d3f949e2fa9033378d7b17779d9c12e1d956c9f32aa81700c5d47c91665d$nclexmocv6$ THEN
    RAISE EXCEPTION 'rewrite hash mismatch for cmr10qu8s004b1y8a0dec0jwg';
  END IF;
END
$do$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_item5_v6_rewrite_20261030
WHERE id = $nclexmocv6$cmr7h3beq00281yx37jhuz8o1$nclexmocv6$
  AND "contentHash" = $nclexmocv6$bba366f15bdd325c010ff2a2f05e591c09c0f1e065cda260e507e1570bc07430$nclexmocv6$
  AND "subjectId" = $nclexmocv6$health-promotion$nclexmocv6$
  AND active = true
  AND "qaPassed" = true)::integer INTO n;
  IF n IS DISTINCT FROM 1 THEN
    RAISE EXCEPTION 'rewrite pre-image cmr7h3beq00281yx37jhuz8o1: expected 1, found %', n;
  END IF;
END
$check$;

DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" SET
    "subjectId" = $nclexmocv6$pharmacology-nursing$nclexmocv6$,
    scenario = $nclexmocv6$A 60-year-old client with type 2 diabetes is admitted for hyperglycemia and takes metformin and glipizide at home. The client reports thirst and frequent urination. Admission glucose is 350 mg/dL and the recheck is 338 mg/dL. BP is 126/78 mm Hg, HR 92/min, RR 16/min, the client is alert and oriented, and point-of-care ketones are negative. The provider has ordered basal insulin and correction-dose rapid-acting insulin.$nclexmocv6$,
    question = $nclexmocv6$Which action should the nurse take at this time?$nclexmocv6$,
    options = $nclexmocv6${"kind":"mcq","options":["Offer 1 liter of water and recheck the glucose in 4 hours before any medication is given","Administer the ordered insulin and recheck the glucose according to the unit protocol","Begin teaching about carbohydrate counting before any other intervention is carried out","Request an order for a continuous insulin infusion because the glucose is above 300 mg/dL"],"clientNeedsCategory":"Pharmacological and Parenteral Therapies","blueprintTopic":"endocrine-meds","distractorRationale":{"Offer 1 liter of water and recheck the glucose in 4 hours before any medication is given":"Fluids alone do not treat the persistent hyperglycemia and delay ordered treatment.","Begin teaching about carbohydrate counting before any other intervention is carried out":"Teaching is useful once the glucose is being treated; it does not address the current hyperglycemia.","Request an order for a continuous insulin infusion because the glucose is above 300 mg/dL":"The current findings (alert, stable VS, negative ketones) and the existing subcutaneous orders do not call for a new infusion request."}}$nclexmocv6$,
    "correctAnswer" = $nclexmocv6$Administer the ordered insulin and recheck the glucose according to the unit protocol$nclexmocv6$,
    explanation = $nclexmocv6$Persistent hyperglycemia in a non-ICU client calls for insulin and/or other glucose-lowering therapy. The client is alert with stable VS and negative ketones, and the provider has ordered a basal plus correction regimen, so the nurse gives the ordered insulin and rechecks the glucose.$nclexmocv6$,
    "references" = $nclexmocv6$[{"src":"ADA2026-S16","label":"16. Diabetes Care in the Hospital: Standards of Care in Diabetes-2026 (ADA)","url":"https://doi.org/10.2337/dc26-s016"},{"src":"NCSBN2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    "contentHash" = $nclexmocv6$064985e21183a667ae1661c2fad3d75e89fddba80ebe085a0b488c54b9042fcf$nclexmocv6$,
    "topicCategory" = $nclexmocv6$Pharmacological and Parenteral Therapies$nclexmocv6$,
    "blueprintDomain" = $nclexmocv6$nclex-physiological$nclexmocv6$,
    "blueprintTopic" = $nclexmocv6$endocrine-meds$nclexmocv6$,
    "clientNeeds" = $nclexmocv6$Pharmacological and Parenteral Therapies$nclexmocv6$,
    manual_correction = true,
    "qaAuditedAt" = NULL,
    embedding = NULL,
    quality_score = NULL,
    cluster_id = NULL,
    keep_recommendation = NULL,
    review_flag = NULL,
    curation_meta = $nclexmocv6${"metadataBy":"nclex-item5-v6-rewrite","item5":2,"heldUntilRnReview":true}$nclexmocv6$::jsonb,
    "generationMeta" = (
      COALESCE("generationMeta", '{}'::jsonb)
      - 'expertRationale'
      - 'visualRationale'
      - 'rationaleQualityScore'
      - 'expertRationaleVersion'
      - 'rationaleEnrichedAt'
      - 'rationaleEnrichFailCount'
      - 'rationaleEnrichFailReason'
    ) || $nclexmocv6${"manualCorrection":true,"nclexItem5V6Rewrite":true,"rewriteBatch":"nclex-item5-v6-20261030","item5":2}$nclexmocv6$::jsonb,
    "updatedAt" = CURRENT_TIMESTAMP
  WHERE id = $nclexmocv6$cmr7h3beq00281yx37jhuz8o1$nclexmocv6$
    AND "contentHash" = $nclexmocv6$bba366f15bdd325c010ff2a2f05e591c09c0f1e065cda260e507e1570bc07430$nclexmocv6$
    AND "subjectId" = $nclexmocv6$health-promotion$nclexmocv6$
    AND active = true
    AND "qaPassed" = true;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'rewrite cmr7h3beq00281yx37jhuz8o1 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cmr7h3beq00281yx37jhuz8o1$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$089712c10fce8a4b7fc6b5040882ec3f$nclexmocv6$ THEN
    RAISE EXCEPTION 'rewrite stem mismatch for cmr7h3beq00281yx37jhuz8o1';
  END IF;
  IF (SELECT "contentHash" FROM "QuestionBankItem" WHERE id = $nclexmocv6$cmr7h3beq00281yx37jhuz8o1$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$064985e21183a667ae1661c2fad3d75e89fddba80ebe085a0b488c54b9042fcf$nclexmocv6$ THEN
    RAISE EXCEPTION 'rewrite hash mismatch for cmr7h3beq00281yx37jhuz8o1';
  END IF;
END
$do$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_item5_v6_rewrite_20261030
WHERE id = $nclexmocv6$cmr77iubz010y1ywud6yfj667$nclexmocv6$
  AND "contentHash" = $nclexmocv6$497358b93fa2f3078b43f20ed9390884ed04866ededc59b0230b179644548de4$nclexmocv6$
  AND "subjectId" = $nclexmocv6$pharmacology-nursing$nclexmocv6$
  AND active = true
  AND "qaPassed" = true)::integer INTO n;
  IF n IS DISTINCT FROM 1 THEN
    RAISE EXCEPTION 'rewrite pre-image cmr77iubz010y1ywud6yfj667: expected 1, found %', n;
  END IF;
END
$check$;

DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" SET
    "subjectId" = $nclexmocv6$pharmacology-nursing$nclexmocv6$,
    scenario = $nclexmocv6$A 55-year-old client with type 2 diabetes is admitted with pneumonia. Two months ago he received IV antibiotics in the hospital for a leg wound, and the wound culture grew MRSA. He is on contact precautions. Temp is 38.4 C, HR 98/min, BP 124/76 mm Hg, RR 22/min, and SpO2 93% on room air. The provider has ordered sputum and blood cultures and IV vancomycin.$nclexmocv6$,
    question = $nclexmocv6$Which action should the nurse take first?$nclexmocv6$,
    options = $nclexmocv6${"kind":"mcq","options":["Give the first IV vancomycin dose right away and collect the cultures after the infusion","Send a nasal MRSA screening swab and hold the vancomycin until the result returns","Request a portable chest x-ray and hold all specimens until the result has been reviewed","Collect the sputum and blood cultures, then give the first dose of the vancomycin"],"clientNeedsCategory":"Pharmacological and Parenteral Therapies","blueprintTopic":"anti-infectives","distractorRationale":{"Give the first IV vancomycin dose right away and collect the cultures after the infusion":"Antibiotics given first can reduce the yield of the cultures that guide therapy.","Send a nasal MRSA screening swab and hold the vancomycin until the result returns":"CDC reserves AIIR/negative pressure for airborne pathogens; MDRO precautions are Contact + Standard.","Request a portable chest x-ray and hold all specimens until the result has been reviewed":"Waiting for imaging results delays both cultures and treatment."}}$nclexmocv6$,
    "correctAnswer" = $nclexmocv6$Collect the sputum and blood cultures, then give the first dose of the vancomycin$nclexmocv6$,
    explanation = $nclexmocv6$ATS/IDSA recommends pretreatment cultures when a hospitalized client was previously infected with MRSA or received parenteral antibiotics in the last 90 days. The client is not in shock, so the nurse collects the cultures and then gives the first dose without delay. A nasal screen is not a culture of the infection site and holding antibiotics for it delays treatment; MDRO precautions are contact plus standard.$nclexmocv6$,
    "references" = $nclexmocv6$[{"src":"IDSA-CAP2019","label":"Diagnosis and Treatment of Adults with Community-acquired Pneumonia (ATS/IDSA)","url":"https://doi.org/10.1164/rccm.201908-1581ST"},{"src":"CDC-ISO","label":"Isolation Precautions Guideline, Appendix A: Type and Duration of Precautions (CDC/HICPAC)","url":"https://www.cdc.gov/infection-control/hcp/isolation-precautions/appendix-a-type-duration.html"},{"src":"CDC-AIR","label":"CDC. Transmission-Based Precautions (Airborne Precautions/AIIR reserved for airborne pathogens such as TB, measles, chickenpox)","url":"https://cdc.gov/infection-control/hcp/basics/transmission-based-precautions.html"}]$nclexmocv6$::jsonb,
    "contentHash" = $nclexmocv6$17521cb98055c65ff8534d8bd09d3991d36af597f35ad371c578a8f7d46fd5f6$nclexmocv6$,
    "topicCategory" = $nclexmocv6$Pharmacological and Parenteral Therapies$nclexmocv6$,
    "blueprintDomain" = $nclexmocv6$nclex-physiological$nclexmocv6$,
    "blueprintTopic" = $nclexmocv6$anti-infectives$nclexmocv6$,
    "clientNeeds" = $nclexmocv6$Pharmacological and Parenteral Therapies$nclexmocv6$,
    manual_correction = true,
    "qaAuditedAt" = NULL,
    embedding = NULL,
    quality_score = NULL,
    cluster_id = NULL,
    keep_recommendation = NULL,
    review_flag = NULL,
    curation_meta = $nclexmocv6${"metadataBy":"nclex-item5-v6-rewrite","item5":3,"heldUntilRnReview":true}$nclexmocv6$::jsonb,
    "generationMeta" = (
      COALESCE("generationMeta", '{}'::jsonb)
      - 'expertRationale'
      - 'visualRationale'
      - 'rationaleQualityScore'
      - 'expertRationaleVersion'
      - 'rationaleEnrichedAt'
      - 'rationaleEnrichFailCount'
      - 'rationaleEnrichFailReason'
    ) || $nclexmocv6${"manualCorrection":true,"nclexItem5V6Rewrite":true,"rewriteBatch":"nclex-item5-v6-20261030","item5":3}$nclexmocv6$::jsonb,
    "updatedAt" = CURRENT_TIMESTAMP
  WHERE id = $nclexmocv6$cmr77iubz010y1ywud6yfj667$nclexmocv6$
    AND "contentHash" = $nclexmocv6$497358b93fa2f3078b43f20ed9390884ed04866ededc59b0230b179644548de4$nclexmocv6$
    AND "subjectId" = $nclexmocv6$pharmacology-nursing$nclexmocv6$
    AND active = true
    AND "qaPassed" = true;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'rewrite cmr77iubz010y1ywud6yfj667 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cmr77iubz010y1ywud6yfj667$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$1452419ec273a8da9fc9742f620faef2$nclexmocv6$ THEN
    RAISE EXCEPTION 'rewrite stem mismatch for cmr77iubz010y1ywud6yfj667';
  END IF;
  IF (SELECT "contentHash" FROM "QuestionBankItem" WHERE id = $nclexmocv6$cmr77iubz010y1ywud6yfj667$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$17521cb98055c65ff8534d8bd09d3991d36af597f35ad371c578a8f7d46fd5f6$nclexmocv6$ THEN
    RAISE EXCEPTION 'rewrite hash mismatch for cmr77iubz010y1ywud6yfj667';
  END IF;
END
$do$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_item5_v6_rewrite_20261030
WHERE id = $nclexmocv6$cmr8oj5p000221y5n2ejafia4$nclexmocv6$
  AND "contentHash" = $nclexmocv6$a3e6cd1e00b77191d9b677b90d0e99a52b2a0a2ddc43402f94bbfa6a5abe2853$nclexmocv6$
  AND "subjectId" = $nclexmocv6$management-of-care$nclexmocv6$
  AND active = true
  AND "qaPassed" = true)::integer INTO n;
  IF n IS DISTINCT FROM 1 THEN
    RAISE EXCEPTION 'rewrite pre-image cmr8oj5p000221y5n2ejafia4: expected 1, found %', n;
  END IF;
END
$check$;

DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" SET
    "subjectId" = $nclexmocv6$management-of-care$nclexmocv6$,
    scenario = $nclexmocv6$A 68-year-old client who lives alone is on day 3 of hospitalization for a COPD exacerbation, his second admission in 90 days. He is improving and uses oxygen at 2 L/min by nasal cannula. He tells the nurse he has no one to drive him to appointments and is unsure how he will pay for his inhalers and oxygen at home.$nclexmocv6$,
    question = $nclexmocv6$Which action should the nurse take next for this client?$nclexmocv6$,
    options = $nclexmocv6${"kind":"mcq","options":["Request a case management consult now so his needs are arranged before he goes home","Tell him the provider will arrange home oxygen and a ride to clinic at the visit next month","Give him the numbers of local agencies and ask him to arrange his own transport and equipment","Call the insurer to ask which inhaler and oxygen suppliers are covered, then tell the client"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management","distractorRationale":{"Tell him the provider will arrange home oxygen and a ride to clinic at the visit next month":"Deferring needs to a clinic visit after discharge leaves the identified gaps unaddressed.","Give him the numbers of local agencies and ask him to arrange his own transport and equipment":"Waiting until the discharge order leaves too little time to arrange equipment and coverage.","Call the insurer to ask which inhaler and oxygen suppliers are covered, then tell the client":"Verifying coverage is part of the case manager role; the nurse first identifies needs and refers."}}$nclexmocv6$,
    "correctAnswer" = $nclexmocv6$Request a case management consult now so his needs are arranged before he goes home$nclexmocv6$,
    explanation = $nclexmocv6$Discharge planning should begin early for clients at risk of adverse outcomes after discharge. This client has a recent readmission and unmet needs for transport, oxygen and medications. The nurse requests a case management consult so these needs are evaluated and arranged before discharge, which fits the RN activity 'assess the need for referrals'.$nclexmocv6$,
    "references" = $nclexmocv6$[{"src":"CFR482.43","label":"42 CFR 482.43 Condition of participation: Discharge planning (CMS/eCFR)","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.43"},{"src":"GOLD2026","label":"GOLD 2026 Report: Global Strategy for the Diagnosis, Management, and Prevention of COPD (GOLD)","url":"https://goldcopd.org/2026-gold-report-and-pocket-guide/"},{"src":"NCSBN2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    "contentHash" = $nclexmocv6$843191ce565e49341f244aaba2a9cb5e3c2bd16c00142cdf715f1583f4c38b3a$nclexmocv6$,
    "topicCategory" = $nclexmocv6$Management of Care$nclexmocv6$,
    "blueprintDomain" = $nclexmocv6$nclex-safe-care$nclexmocv6$,
    "blueprintTopic" = $nclexmocv6$continuity-case-management$nclexmocv6$,
    "clientNeeds" = $nclexmocv6$Management of Care$nclexmocv6$,
    manual_correction = true,
    "qaAuditedAt" = NULL,
    embedding = NULL,
    quality_score = NULL,
    cluster_id = NULL,
    keep_recommendation = NULL,
    review_flag = NULL,
    curation_meta = $nclexmocv6${"metadataBy":"nclex-item5-v6-rewrite","item5":4,"heldUntilRnReview":true}$nclexmocv6$::jsonb,
    "generationMeta" = (
      COALESCE("generationMeta", '{}'::jsonb)
      - 'expertRationale'
      - 'visualRationale'
      - 'rationaleQualityScore'
      - 'expertRationaleVersion'
      - 'rationaleEnrichedAt'
      - 'rationaleEnrichFailCount'
      - 'rationaleEnrichFailReason'
    ) || $nclexmocv6${"manualCorrection":true,"nclexItem5V6Rewrite":true,"rewriteBatch":"nclex-item5-v6-20261030","item5":4}$nclexmocv6$::jsonb,
    "updatedAt" = CURRENT_TIMESTAMP
  WHERE id = $nclexmocv6$cmr8oj5p000221y5n2ejafia4$nclexmocv6$
    AND "contentHash" = $nclexmocv6$a3e6cd1e00b77191d9b677b90d0e99a52b2a0a2ddc43402f94bbfa6a5abe2853$nclexmocv6$
    AND "subjectId" = $nclexmocv6$management-of-care$nclexmocv6$
    AND active = true
    AND "qaPassed" = true;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'rewrite cmr8oj5p000221y5n2ejafia4 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cmr8oj5p000221y5n2ejafia4$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$70387d29979842e6be29e1b809c9826d$nclexmocv6$ THEN
    RAISE EXCEPTION 'rewrite stem mismatch for cmr8oj5p000221y5n2ejafia4';
  END IF;
  IF (SELECT "contentHash" FROM "QuestionBankItem" WHERE id = $nclexmocv6$cmr8oj5p000221y5n2ejafia4$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$843191ce565e49341f244aaba2a9cb5e3c2bd16c00142cdf715f1583f4c38b3a$nclexmocv6$ THEN
    RAISE EXCEPTION 'rewrite hash mismatch for cmr8oj5p000221y5n2ejafia4';
  END IF;
END
$do$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_item5_v6_rewrite_20261030
WHERE id = $nclexmocv6$cmr8qk18300b51yvfpi42yu14$nclexmocv6$
  AND "contentHash" = $nclexmocv6$f281a8acbbb8d4ef832139ff1147332bbcbb4d7279dd6ff8ec43a611aedc5f17$nclexmocv6$
  AND "subjectId" = $nclexmocv6$psychosocial$nclexmocv6$
  AND active = true
  AND "qaPassed" = true)::integer INTO n;
  IF n IS DISTINCT FROM 1 THEN
    RAISE EXCEPTION 'rewrite pre-image cmr8qk18300b51yvfpi42yu14: expected 1, found %', n;
  END IF;
END
$check$;

DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" SET
    "subjectId" = $nclexmocv6$health-promotion$nclexmocv6$,
    scenario = $nclexmocv6$A 28-year-old client at 36 weeks of gestation, who had a preterm birth at 33 weeks in her last pregnancy, is seen in the prenatal clinic. She reports tightening of her abdomen since this morning, about 3 times in the past hour, irregular and each lasting 20 to 30 seconds, and is worried about preterm labor. She denies vaginal bleeding or leaking of fluid, and says the baby is moving as usual. BP is 118/74 mm Hg and HR is 84/min.$nclexmocv6$,
    question = $nclexmocv6$Which action should the nurse take first?$nclexmocv6$,
    options = $nclexmocv6${"kind":"mcq","options":["Prepare a tocolytic medication for the provider to order to stop the contractions","Teach the client the signs of true labor, then send her home to rest and drink fluids","Monitor the contractions and fetal heart rate, then report to the provider","Schedule a cervical examination for her next routine prenatal visit in 2 weeks"],"clientNeedsCategory":"Health Promotion and Maintenance","blueprintTopic":"labor-fetal-monitoring","distractorRationale":{"Prepare a tocolytic medication for the provider to order to stop the contractions":"ACOG advises that women with preterm contractions but no cervical change generally should not be treated with tocolytics.","Teach the client the signs of true labor, then send her home to rest and drink fluids":"Sending the client home before assessing the pattern risks missing evolving labor.","Schedule a cervical examination for her next routine prenatal visit in 2 weeks":"Immediate travel for an exam is not justified before the nurse knows the contraction pattern and symptoms."}}$nclexmocv6$,
    "correctAnswer" = $nclexmocv6$Monitor the contractions and fetal heart rate, then report to the provider$nclexmocv6$,
    explanation = $nclexmocv6$A prior preterm birth is a risk factor for preterm labor, so even irregular contractions at 36 weeks are not dismissed. Preterm labor is diagnosed from regular contractions with cervical change, and tocolysis is not given for contractions without cervical change. The nurse first characterizes the contraction pattern by monitoring the contractions and fetal heart rate, then reports to the provider, who decides on a cervical exam and further testing. Sending her home to rest without assessment, or waiting 2 weeks, could miss evolving labor.$nclexmocv6$,
    "references" = $nclexmocv6$[{"src":"ACOG-PB171","label":"Practice Bulletin No. 171: Management of Preterm Labor (ACOG)","url":"https://www.acog.org/clinical/guidance/practice-bulletin/2016/10/management-of-preterm-labor/"},{"src":"NCSBN2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    "contentHash" = $nclexmocv6$e3d9ce992cab15679a78db824cd4df7ef18d0666a5dd9fc2d454209ea378b57e$nclexmocv6$,
    "topicCategory" = $nclexmocv6$Health Promotion and Maintenance$nclexmocv6$,
    "blueprintDomain" = $nclexmocv6$nclex-health-promotion$nclexmocv6$,
    "blueprintTopic" = $nclexmocv6$labor-fetal-monitoring$nclexmocv6$,
    "clientNeeds" = $nclexmocv6$Health Promotion and Maintenance$nclexmocv6$,
    manual_correction = true,
    "qaAuditedAt" = NULL,
    embedding = NULL,
    quality_score = NULL,
    cluster_id = NULL,
    keep_recommendation = NULL,
    review_flag = NULL,
    curation_meta = $nclexmocv6${"metadataBy":"nclex-item5-v6-rewrite","item5":5,"heldUntilRnReview":true}$nclexmocv6$::jsonb,
    "generationMeta" = (
      COALESCE("generationMeta", '{}'::jsonb)
      - 'expertRationale'
      - 'visualRationale'
      - 'rationaleQualityScore'
      - 'expertRationaleVersion'
      - 'rationaleEnrichedAt'
      - 'rationaleEnrichFailCount'
      - 'rationaleEnrichFailReason'
    ) || $nclexmocv6${"manualCorrection":true,"nclexItem5V6Rewrite":true,"rewriteBatch":"nclex-item5-v6-20261030","item5":5}$nclexmocv6$::jsonb,
    "updatedAt" = CURRENT_TIMESTAMP
  WHERE id = $nclexmocv6$cmr8qk18300b51yvfpi42yu14$nclexmocv6$
    AND "contentHash" = $nclexmocv6$f281a8acbbb8d4ef832139ff1147332bbcbb4d7279dd6ff8ec43a611aedc5f17$nclexmocv6$
    AND "subjectId" = $nclexmocv6$psychosocial$nclexmocv6$
    AND active = true
    AND "qaPassed" = true;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'rewrite cmr8qk18300b51yvfpi42yu14 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cmr8qk18300b51yvfpi42yu14$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$94d8e5a3818d0d3fef3d73ea344216cd$nclexmocv6$ THEN
    RAISE EXCEPTION 'rewrite stem mismatch for cmr8qk18300b51yvfpi42yu14';
  END IF;
  IF (SELECT "contentHash" FROM "QuestionBankItem" WHERE id = $nclexmocv6$cmr8qk18300b51yvfpi42yu14$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$e3d9ce992cab15679a78db824cd4df7ef18d0666a5dd9fc2d454209ea378b57e$nclexmocv6$ THEN
    RAISE EXCEPTION 'rewrite hash mismatch for cmr8qk18300b51yvfpi42yu14';
  END IF;
END
$do$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_item5_v6_rewrite_20261030
WHERE id = $nclexmocv6$cmsex2vtw00c61y56oysbpti1$nclexmocv6$
  AND "contentHash" = $nclexmocv6$ec09cd8bf9466dccad95842d96c6116d94fb19040cbf0106a58c41fd3e5fae6a$nclexmocv6$
  AND "subjectId" = $nclexmocv6$fundamentals$nclexmocv6$
  AND active = true
  AND "qaPassed" = true)::integer INTO n;
  IF n IS DISTINCT FROM 1 THEN
    RAISE EXCEPTION 'rewrite pre-image cmsex2vtw00c61y56oysbpti1: expected 1, found %', n;
  END IF;
END
$check$;

DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" SET
    "subjectId" = $nclexmocv6$psychosocial$nclexmocv6$,
    scenario = $nclexmocv6$A 40-year-old client with a history of depression is admitted to the psychiatric unit. He reports feeling hopeless and has been isolating from family and friends. He tells the nurse he has had thoughts of harming himself and denies a specific plan.$nclexmocv6$,
    question = $nclexmocv6$Which action should the nurse take first?$nclexmocv6$,
    options = $nclexmocv6${"kind":"mcq","options":["Arrange a sitter for the shift and hold all questions about suicide until the provider has evaluated him","Conduct a structured suicide risk assessment of his current thoughts, behaviors and available means","Ask him to sign a no-harm safety contract and review the contract with him tomorrow morning","Reassure the client that feelings of hopelessness are common and improve with treatment"],"clientNeedsCategory":"Psychosocial Integrity","blueprintTopic":"suicide-risk","distractorRationale":{"Arrange a sitter for the shift and hold all questions about suicide until the provider has evaluated him":"Observation level should follow the risk assessment and orders; this option skips the assessment.","Ask him to sign a no-harm safety contract and review the contract with him tomorrow morning":"Group activity does not address the unassessed risk.","Reassure the client that feelings of hopelessness are common and improve with treatment":"Premature reassurance closes off disclosure and does not assess risk."}}$nclexmocv6$,
    "correctAnswer" = $nclexmocv6$Conduct a structured suicide risk assessment of his current thoughts, behaviors and available means$nclexmocv6$,
    explanation = $nclexmocv6$Thoughts of self-harm are a warning sign that calls for a comprehensive suicide risk assessment, including self-directed violence thoughts and behaviors and availability of lethal means. The nurse asks directly first; the level of observation and other safety measures are then set from the findings and the provider.$nclexmocv6$,
    "references" = $nclexmocv6$[{"src":"VADOD-SUI2024","label":"VA/DoD CPG for Assessment and Management of Patients at Risk for Suicide v3.0 (VA/DoD)","url":"https://www.healthquality.va.gov/guidelines/MH/srb/"},{"src":"NCSBN2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    "contentHash" = $nclexmocv6$14dff837bd70fea2514cd24b338d1d44794e833a79f8ea7b142cd205fc15d7da$nclexmocv6$,
    "topicCategory" = $nclexmocv6$Psychosocial Integrity$nclexmocv6$,
    "blueprintDomain" = $nclexmocv6$nclex-health-promotion$nclexmocv6$,
    "blueprintTopic" = $nclexmocv6$suicide-risk$nclexmocv6$,
    "clientNeeds" = $nclexmocv6$Psychosocial Integrity$nclexmocv6$,
    manual_correction = true,
    "qaAuditedAt" = NULL,
    embedding = NULL,
    quality_score = NULL,
    cluster_id = NULL,
    keep_recommendation = NULL,
    review_flag = NULL,
    curation_meta = $nclexmocv6${"metadataBy":"nclex-item5-v6-rewrite","item5":6,"heldUntilRnReview":true}$nclexmocv6$::jsonb,
    "generationMeta" = (
      COALESCE("generationMeta", '{}'::jsonb)
      - 'expertRationale'
      - 'visualRationale'
      - 'rationaleQualityScore'
      - 'expertRationaleVersion'
      - 'rationaleEnrichedAt'
      - 'rationaleEnrichFailCount'
      - 'rationaleEnrichFailReason'
    ) || $nclexmocv6${"manualCorrection":true,"nclexItem5V6Rewrite":true,"rewriteBatch":"nclex-item5-v6-20261030","item5":6}$nclexmocv6$::jsonb,
    "updatedAt" = CURRENT_TIMESTAMP
  WHERE id = $nclexmocv6$cmsex2vtw00c61y56oysbpti1$nclexmocv6$
    AND "contentHash" = $nclexmocv6$ec09cd8bf9466dccad95842d96c6116d94fb19040cbf0106a58c41fd3e5fae6a$nclexmocv6$
    AND "subjectId" = $nclexmocv6$fundamentals$nclexmocv6$
    AND active = true
    AND "qaPassed" = true;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'rewrite cmsex2vtw00c61y56oysbpti1 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cmsex2vtw00c61y56oysbpti1$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$02c38516e8169555d086805a81d5a905$nclexmocv6$ THEN
    RAISE EXCEPTION 'rewrite stem mismatch for cmsex2vtw00c61y56oysbpti1';
  END IF;
  IF (SELECT "contentHash" FROM "QuestionBankItem" WHERE id = $nclexmocv6$cmsex2vtw00c61y56oysbpti1$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$14dff837bd70fea2514cd24b338d1d44794e833a79f8ea7b142cd205fc15d7da$nclexmocv6$ THEN
    RAISE EXCEPTION 'rewrite hash mismatch for cmsex2vtw00c61y56oysbpti1';
  END IF;
END
$do$;
-- Insert the 60 Management of Care pilot items, held inactive until activation.
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$cc32ad23631fdf5e61b7c7532$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: cc32ad23631fdf5e61b7c7532';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$09d615c084756423f9efb377962214edf3dc4a3b7c4347a0138255ad654d6053$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q1';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$cc32ad23631fdf5e61b7c7532$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$The RN is making assignments on a medical-surgical unit. The team includes one LPN and one unlicensed assistive personnel (UAP).$nclexmocv6$, $nclexmocv6$Which task is most appropriate for the RN to delegate to the UAP?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Assessing the surgical incision of a client on postoperative day 3 for signs of infection","Teaching a client on postoperative day 3 how to use an incentive spirometer correctly","Measuring and recording vital signs for a client who is stable on postoperative day 3","Evaluating a client's response to a pain medication given earlier on postoperative day 3"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocv6$,
    $nclexmocv6$Measuring and recording vital signs for a client who is stable on postoperative day 3$nclexmocv6$, $nclexmocv6$Routine vital signs on a stable client are a predictable, low-risk task within UAP competence. Assessment, teaching and evaluation require nursing judgment and cannot be delegated (NCSBN delegation guidelines; scope per facility policy and state law).$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-DELEG-2016","label":"National Guidelines for Nursing Delegation (NCSBN)","locator":"Five rights of delegation; nursing judgment/clinical reasoning not delegable","url":"https://www.ncsbn.org/public-files/NCSBN_Delegation_Guidelines.pdf"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Delegate and supervise care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$09d615c084756423f9efb377962214edf3dc4a3b7c4347a0138255ad654d6053$nclexmocv6$,
    false, false, true,
    2, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$delegation-assignment$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":1,"subtopic":"Delegation","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":1,"subtopic":"Delegation"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q1 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cc32ad23631fdf5e61b7c7532$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$d5600a37fe74200b9c19f1b14f6892c3$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q1';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c07375bc6c73c8a35a86d34a4$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c07375bc6c73c8a35a86d34a4';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$9919ae6abef76b015f6106695dd6d00f7bf9f2d4e28a66360af302bf0ccc1840$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q2';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c07375bc6c73c8a35a86d34a4$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A UAP was delegated morning care for a client who is on postoperative day 2 after a hip replacement. The UAP tells the RN the client "seems more confused than yesterday."$nclexmocv6$, $nclexmocv6$Which response by the RN to the UAP's report is most appropriate?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Assess the client now, then decide whether the planned care can still be delegated","Tell the UAP to finish the morning care and report any other changes after the task","Reassign the morning care to the LPN and ask the LPN to report any changes","Document the UAP's observation and reassess the client during the next scheduled rounds"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocv6$,
    $nclexmocv6$Assess the client now, then decide whether the planned care can still be delegated$nclexmocv6$, $nclexmocv6$A change in condition reported by a delegatee means the circumstances that supported delegation have changed. The RN must reassess before deciding what can safely continue; reassigning or waiting delays assessment of possible new confusion.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-DELEG-2016","label":"National Guidelines for Nursing Delegation (NCSBN)","locator":"Right circumstances; delegatee reports changes and the licensed nurse reassesses","url":"https://www.ncsbn.org/public-files/NCSBN_Delegation_Guidelines.pdf"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Delegate and supervise care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$9919ae6abef76b015f6106695dd6d00f7bf9f2d4e28a66360af302bf0ccc1840$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$delegation-assignment$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":2,"subtopic":"Delegation","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":2,"subtopic":"Delegation"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q2 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c07375bc6c73c8a35a86d34a4$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$1c1dc3280120c3009d0ec1abda86978e$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q2';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$cce68108de2a85d091037ef02$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: cce68108de2a85d091037ef02';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$97a40ad9093153544527608442eaa8009379bd1b55135a691d14b25db9d4b62a$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q3';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$cce68108de2a85d091037ef02$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$Per the NCSBN delegation guidelines, and assuming each task is within the facility's job description for UAP, the RN is reviewing tasks for a group of clients who are in stable condition.$nclexmocv6$, $nclexmocv6$Which tasks may the RN delegate to the UAP? Select all that apply.$nclexmocv6$, $nclexmocv6${"kind":"select_all","options":["Assessing a client's lung sounds after a scheduled nebulizer treatment","Repositioning a client who is on bedrest every 2 hours according to the care plan","Interpreting a client's trend of blood pressure readings over three days","Assisting a client with a walker to walk to the bathroom per the care plan","Feeding a client who has no swallowing difficulty and is alert at mealtime","Teaching a client about a newly prescribed low-sodium eating plan"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocv6$,
    $nclexmocv6$Repositioning a client who is on bedrest every 2 hours according to the care plan|||Assisting a client with a walker to walk to the bathroom per the care plan|||Feeding a client who has no swallowing difficulty and is alert at mealtime$nclexmocv6$, $nclexmocv6$Repositioning, feeding a client without dysphagia and ambulating with a device are routine tasks for stable clients. Assessment, teaching and interpreting data require nursing judgment and remain with the RN.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-DELEG-2016","label":"National Guidelines for Nursing Delegation (NCSBN)","locator":"Tasks requiring clinical reasoning, nursing judgment or critical decision making cannot be delegated","url":"https://www.ncsbn.org/public-files/NCSBN_Delegation_Guidelines.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$97a40ad9093153544527608442eaa8009379bd1b55135a691d14b25db9d4b62a$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$delegation-assignment$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$select_all$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":3,"subtopic":"Delegation","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":3,"subtopic":"Delegation"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q3 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cce68108de2a85d091037ef02$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$23fe08bc891cd90e94178c80567c27c2$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q3';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c33e391a46b05f148bcee19ce$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c33e391a46b05f148bcee19ce';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$82611bd031046cca8697f433998eaf44ccdba871e6536c96d65d9163236b6342$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q4';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c33e391a46b05f148bcee19ce$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$The RN is assigning clients to an LPN. Assume the facility and nurse practice act permit the LPN to give oral and IV-piggyback medications to stable clients.$nclexmocv6$, $nclexmocv6$Which client is most appropriate to assign to the LPN?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["A client admitted two hours ago who needs the admission assessment and an initial plan of care","A client returned from surgery 30 minutes ago with a fluctuating blood pressure","A client who needs a teaching plan developed for newly prescribed insulin therapy","A client with stable chronic heart failure who needs scheduled oral medications"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocv6$,
    $nclexmocv6$A client with stable chronic heart failure who needs scheduled oral medications$nclexmocv6$, $nclexmocv6$The RN keeps initial assessment, care-plan development, teaching plans and care of clients with unstable or changing conditions. A stable client with an established plan fits LPN scope; facility policy and the state nurse practice act define the exact limits.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-DELEG-2016","label":"National Guidelines for Nursing Delegation (NCSBN)","locator":"Assignment based on client complexity, stability and the delegatee's competence","url":"https://www.ncsbn.org/public-files/NCSBN_Delegation_Guidelines.pdf"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Delegate and supervise care (LPN/VN)","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$82611bd031046cca8697f433998eaf44ccdba871e6536c96d65d9163236b6342$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$delegation-assignment$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":4,"subtopic":"Delegation","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":4,"subtopic":"Delegation"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q4 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c33e391a46b05f148bcee19ce$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$d991d8edeed47abb098f80fd0b99ff10$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q4';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c56c89825597afcebe6c3d07d$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c56c89825597afcebe6c3d07d';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$8eeea199b8bb366e38f6d02289c2333c10c19f54dcad81821b7eb970fdd1bd97$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q5';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c56c89825597afcebe6c3d07d$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$The RN delegated a bath and linen change to a UAP for a client who is on contact precautions after a hip replacement.$nclexmocv6$, $nclexmocv6$Which action best fulfills the RN's responsibility for supervision of this task?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Assume the task was done correctly because the UAP has worked on the unit for years","Follow up with the UAP after the bath to review the client's skin and tolerance","Ask the UAP to chart the client's skin status as the official nursing skin assessment","Review the UAP's documentation at the end of the shift and then co-sign the entry"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocv6$,
    $nclexmocv6$Follow up with the UAP after the bath to review the client's skin and tolerance$nclexmocv6$, $nclexmocv6$The RN remains accountable for delegated tasks and evaluates the outcome and the client's response; a UAP does not perform the nursing assessment, and delayed review is not timely supervision.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-DELEG-2016","label":"National Guidelines for Nursing Delegation (NCSBN)","locator":"Right supervision and evaluation; accountability remains with the delegating nurse","url":"https://www.ncsbn.org/public-files/NCSBN_Delegation_Guidelines.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$8eeea199b8bb366e38f6d02289c2333c10c19f54dcad81821b7eb970fdd1bd97$nclexmocv6$,
    false, false, true,
    4, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$delegation-assignment$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":5,"subtopic":"Delegation","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":5,"subtopic":"Delegation"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q5 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c56c89825597afcebe6c3d07d$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$d3c6b1d4803891ddaea50d6a54336df3$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q5';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c0e71d73dae1ebf4b29f96dd8$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c0e71d73dae1ebf4b29f96dd8';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$14eef8e1222231d46b230b108b5557f411a7cecbe21aeeecd810db8db8857559$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q6';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c0e71d73dae1ebf4b29f96dd8$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$The RN needs a UAP to measure vital signs on a client who is 6 hours postoperative after a colon resection. The client's baseline vital signs earlier in the shift were BP 118/72 mm Hg and pulse 88/min.$nclexmocv6$, $nclexmocv6$Which statement gives the UAP the clearest and most appropriate direction for this client?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Take room 12's vital signs now and report right away if the client looks pale or says he feels unwell.","Check room 12's vital signs by noon and chart them; I will review the numbers later in the day.","Take room 12's vital signs now and report right away if systolic is under 100 or pulse is over 110.","Take room 12's vital signs now and report right away if any value is outside the usual adult normal range."],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocv6$,
    $nclexmocv6$Take room 12's vital signs now and report right away if systolic is under 100 or pulse is over 110.$nclexmocv6$, $nclexmocv6$Clear delegation states the task, timing, what to report and report parameters that fit this client's baseline (BP 118/72 mm Hg, pulse 88/min). Reporting only symptoms, using a generic range that is not tied to the baseline, or reviewing the numbers later does not let the RN detect an early change after surgery.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-DELEG-2016","label":"National Guidelines for Nursing Delegation (NCSBN)","locator":"Right direction and communication","url":"https://www.ncsbn.org/public-files/NCSBN_Delegation_Guidelines.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$14eef8e1222231d46b230b108b5557f411a7cecbe21aeeecd810db8db8857559$nclexmocv6$,
    false, false, true,
    4, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$delegation-assignment$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":6,"subtopic":"Delegation","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":6,"subtopic":"Delegation"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q6 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c0e71d73dae1ebf4b29f96dd8$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$854f740b3b630b153b5c80024287fcba$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q6';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$cda49979c786ee698480a2c50$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: cda49979c786ee698480a2c50';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$fed832de28bdb382d896e4f1bc3513fade9f976075ff9c08183ef61737a11e5d$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q7';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$cda49979c786ee698480a2c50$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$The RN is deciding whether to delegate measurement of intake and output for a client on a medical unit.$nclexmocv6$, $nclexmocv6$Following the NCSBN five rights of delegation (right task, right circumstance, right person, right direction and communication, right supervision and evaluation), place the RN's steps in order.$nclexmocv6$, $nclexmocv6${"kind":"ordered_response","options":["Give specific directions, what to record and when to report back","Confirm that the UAP who would do the task has the training and demonstrated competence","Assess the client's condition and decide whether the task is appropriate to delegate","Review the recorded totals and the client's response, then document","Monitor the UAP's performance and answer questions during the shift"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocv6$,
    $nclexmocv6$Assess the client's condition and decide whether the task is appropriate to delegate|||Confirm that the UAP who would do the task has the training and demonstrated competence|||Give specific directions, what to record and when to report back|||Monitor the UAP's performance and answer questions during the shift|||Review the recorded totals and the client's response, then document$nclexmocv6$, $nclexmocv6$The NCSBN delegation process starts with the RN's assessment of the client and the task (right task, right circumstance), then confirms the person (competence and job description), gives directions and communication, supervises, and finally evaluates and gives feedback.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-DELEG-2016","label":"National Guidelines for Nursing Delegation (NCSBN)","locator":"Delegation process: assess, plan, communicate, surveil/supervise, evaluate and feedback","url":"https://www.ncsbn.org/public-files/NCSBN_Delegation_Guidelines.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$fed832de28bdb382d896e4f1bc3513fade9f976075ff9c08183ef61737a11e5d$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$delegation-assignment$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$ordered_response$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":7,"subtopic":"Delegation","itemType":"ord","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":7,"subtopic":"Delegation"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q7 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cda49979c786ee698480a2c50$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$28c5548baf9a603caa6e4e2a4c3648d8$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q7';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$cb5613a4a0ff6390172746769$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: cb5613a4a0ff6390172746769';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$ecc34da121344fd6332e572d038368b69c1e566bb943573de69370f23a7f5d9a$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q8';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$cb5613a4a0ff6390172746769$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A float RN from the outpatient clinic has never cared for clients on telemetry. The charge RN is making assignments on a cardiac unit.$nclexmocv6$, $nclexmocv6$Which assignment is most appropriate for the float RN?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Two clients with stable pneumonia who are on room air and are not on cardiac monitors","A client with new atrial fibrillation who has an IV diltiazem infusion to be titrated","A client with chest pain who is on continuous cardiac monitoring and has a heparin infusion","A client returning from cardiac catheterization with a femoral puncture site to monitor"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocv6$,
    $nclexmocv6$Two clients with stable pneumonia who are on room air and are not on cardiac monitors$nclexmocv6$, $nclexmocv6$Assignments match the nurse's knowledge and skills to client complexity. A float RN without telemetry experience should receive clients whose needs fit current competence, with support available.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-DELEG-2016","label":"National Guidelines for Nursing Delegation (NCSBN)","locator":"Right person: appropriate skills and knowledge for the task and setting","url":"https://www.ncsbn.org/public-files/NCSBN_Delegation_Guidelines.pdf"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Assign care / Recognize limitations of self and others and use resources","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$ecc34da121344fd6332e572d038368b69c1e566bb943573de69370f23a7f5d9a$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$delegation-assignment$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":8,"subtopic":"Delegation","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":8,"subtopic":"Delegation"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q8 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cb5613a4a0ff6390172746769$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$5565e8c2c62bb28a22a3f362562a2890$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q8';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c3b42b4e57ed73c4e483ca8bf$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c3b42b4e57ed73c4e483ca8bf';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$938b29c117dc02df217da2c64c8acf4d4c28f414e69c303807fb2d65c72865a1$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q9';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c3b42b4e57ed73c4e483ca8bf$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A UAP tells the RN, "I've never used the mechanical lift, and I'm not comfortable moving Mr. Ortiz with it." The lift transfer was part of the UAP's assignment.$nclexmocv6$, $nclexmocv6$How should the RN respond to the UAP's concern about the lift?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Tell the UAP to follow the lift manufacturer's directions and proceed, since lifts are made for safe transfers","Tell the UAP to ask a coworker how the lift works, then do it and call the RN if a problem arises","Ask the UAP and a second UAP to slide the client to the chair by hand so the lift is not used","Take the task back and arrange for trained staff to do it while the UAP observes and learns"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocv6$,
    $nclexmocv6$Take the task back and arrange for trained staff to do it while the UAP observes and learns$nclexmocv6$, $nclexmocv6$A delegatee who lacks competence for a task must say so, and the RN must not require it. The safe response is to reassign to a competent person and provide training; pushing ahead risks client and staff injury.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-DELEG-2016","label":"National Guidelines for Nursing Delegation (NCSBN)","locator":"Delegatee accountability and communication of concerns; right person","url":"https://www.ncsbn.org/public-files/NCSBN_Delegation_Guidelines.pdf"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Delegate and supervise care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$938b29c117dc02df217da2c64c8acf4d4c28f414e69c303807fb2d65c72865a1$nclexmocv6$,
    false, false, true,
    5, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$delegation-assignment$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":9,"subtopic":"Delegation","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":9,"subtopic":"Delegation"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q9 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c3b42b4e57ed73c4e483ca8bf$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$4ef410a7526aa807596f265a087b1e84$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q9';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$cd84ec2e33b301266b2fdb81e$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: cd84ec2e33b301266b2fdb81e';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$cac380659337013da81abd37d6eb1de2bf399494a0906dc93ad1b7e29846fd7b$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q10';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$cd84ec2e33b301266b2fdb81e$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$The RN is reviewing responsibilities for the shift on a medical unit.$nclexmocv6$, $nclexmocv6$Which responsibilities belong to the RN and may NOT be delegated to an LPN or UAP? Select all that apply.$nclexmocv6$, $nclexmocv6${"kind":"select_all","options":["Measuring intake and output for a client with a stable condition","Recording a stable client's weight on the daily weight sheet","Developing the plan of care for a newly admitted client","Repositioning a client who is on bedrest according to the care plan","Evaluating whether a delegated task met the expected client outcome","Completing the initial admission assessment for a newly admitted client"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocv6$,
    $nclexmocv6$Developing the plan of care for a newly admitted client|||Evaluating whether a delegated task met the expected client outcome|||Completing the initial admission assessment for a newly admitted client$nclexmocv6$, $nclexmocv6$Initial assessment, care planning and evaluation rely on nursing judgment and remain RN responsibilities; routine measurements and repositioning for stable clients may be delegated per policy.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-DELEG-2016","label":"National Guidelines for Nursing Delegation (NCSBN)","locator":"Activities requiring clinical reasoning/nursing judgment are not delegable; RN retains evaluation","url":"https://www.ncsbn.org/public-files/NCSBN_Delegation_Guidelines.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$cac380659337013da81abd37d6eb1de2bf399494a0906dc93ad1b7e29846fd7b$nclexmocv6$,
    false, false, true,
    4, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$delegation-assignment$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$select_all$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":10,"subtopic":"Delegation","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":10,"subtopic":"Delegation"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q10 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cd84ec2e33b301266b2fdb81e$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$4052089d7fa0021f8aefc5ab6851ece6$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q10';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$ca21e93236bf8bb5e03c81805$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: ca21e93236bf8bb5e03c81805';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$32e1b470574a3c03215f5dfc818def7bbb6a2635f43911fd250d757ef41fe546$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q11';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$ca21e93236bf8bb5e03c81805$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$The RN delegated fingerstick glucose checks to a UAP. The unit has a nurse-driven hypoglycemia protocol. The UAP reports a result of 52 mg/dL for a client with type 2 diabetes who is diaphoretic and trembling.$nclexmocv6$, $nclexmocv6$What should the RN do first after the UAP reports the glucose result?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Tell the UAP to give orange juice and recheck in 15 minutes while the RN finishes the medication pass","Go to the client now, assess the symptoms and treat the low glucose per the unit protocol","Ask the UAP to repeat the glucose check with a second meter and report back the result","Notify the provider of the result and wait for an order before treating the low glucose"],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocv6$,
    $nclexmocv6$Go to the client now, assess the symptoms and treat the low glucose per the unit protocol$nclexmocv6$, $nclexmocv6$A symptomatic low glucose is an unstable finding. The RN assesses and treats per the unit protocol instead of leaving assessment and treatment to the UAP, whose role is to report. Repeating the check, or waiting for an order when a protocol exists, delays treatment.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-DELEG-2016","label":"National Guidelines for Nursing Delegation (NCSBN)","locator":"Delegatee reports; RN assesses and acts on changes in condition","url":"https://www.ncsbn.org/public-files/NCSBN_Delegation_Guidelines.pdf"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Delegate and supervise care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$32e1b470574a3c03215f5dfc818def7bbb6a2635f43911fd250d757ef41fe546$nclexmocv6$,
    false, false, true,
    4, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$delegation-assignment$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":11,"subtopic":"Delegation","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":11,"subtopic":"Delegation"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q11 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$ca21e93236bf8bb5e03c81805$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$8e58541594fcd94d268bb8773eb31247$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q11';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c1c028fd663df54d67c162c00$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c1c028fd663df54d67c162c00';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$7fb8411d05b0ba1026c1ebcc33cb08bd86ab0810564cb441f4dca00bd41ffa8a$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q12';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c1c028fd663df54d67c162c00$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A new graduate RN is discussing delegation during orientation.$nclexmocv6$, $nclexmocv6$Which statement by the new graduate RN shows an accurate understanding of delegation?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["\"After I delegate a task, the UAP becomes accountable for the client's outcome as well as the task.\"","\"I may delegate a task to a UAP when the UAP says he is willing and has done it before.\"","\"When I delegate a task, I remain accountable for supervising it and the outcome.\"","\"I should choose who gets a task based mainly on who has the lightest workload.\""],"clientNeedsCategory":"Management of Care","blueprintTopic":"delegation-assignment"}$nclexmocv6$,
    $nclexmocv6$"When I delegate a task, I remain accountable for supervising it and the outcome."$nclexmocv6$, $nclexmocv6$Delegation transfers the task, not accountability. Delegation depends on the task, the client's condition and the delegatee's competence, not willingness or workload alone.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","delegation-assignment","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-DELEG-2016","label":"National Guidelines for Nursing Delegation (NCSBN)","locator":"Accountability and the five rights","url":"https://www.ncsbn.org/public-files/NCSBN_Delegation_Guidelines.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$7fb8411d05b0ba1026c1ebcc33cb08bd86ab0810564cb441f4dca00bd41ffa8a$nclexmocv6$,
    false, false, true,
    2, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$delegation-assignment$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":12,"subtopic":"Delegation","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":12,"subtopic":"Delegation"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q12 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c1c028fd663df54d67c162c00$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$2ea09470a7854a87aa4ac42770b15449$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q12';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$cb2c6bfdbcd95ff94d6fd9fb3$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: cb2c6bfdbcd95ff94d6fd9fb3';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$0fba9c74ba49d541943033c01364fff5c7b00ca150ba06266ddedf6dcbc5a23e$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q13';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$cb2c6bfdbcd95ff94d6fd9fb3$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A client is scheduled for a laparoscopic cholecystectomy tomorrow. The signed consent form is in the chart. The client tells the RN, "I'm still not sure what the risks are."$nclexmocv6$, $nclexmocv6$How should the RN respond to the client's statement about the risks?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Notify the provider that the client is unsure about the risks so they can be explained","Explain the surgical risks in detail using the unit's pamphlet and then continue preoperative care","Ask the client to sign a second consent form after the RN finishes the teaching","Tell the client the form is already signed and the surgeon will answer questions at the bedside"],"clientNeedsCategory":"Management of Care","blueprintTopic":"informed-consent-advance-directives"}$nclexmocv6$,
    $nclexmocv6$Notify the provider that the client is unsure about the risks so they can be explained$nclexmocv6$, $nclexmocv6$Informed consent requires that the client receive and understand the information needed to decide. The provider is responsible for explaining the procedure, risks and alternatives; the RN advocates by notifying the provider so consent is truly informed.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","informed-consent-advance-directives","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(b)(2): right to make informed decisions about care","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"},{"src":"CFR-482-51","label":"(b)(2): informed consent form in the chart before surgery","locator":"(b)(2): informed consent form in the chart before surgery"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Verify the client receives education and consents","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$0fba9c74ba49d541943033c01364fff5c7b00ca150ba06266ddedf6dcbc5a23e$nclexmocv6$,
    false, false, true,
    2, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$informed-consent-advance-directives$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":13,"subtopic":"Informed consent","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":13,"subtopic":"Informed consent"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q13 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cb2c6bfdbcd95ff94d6fd9fb3$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$c9d9e4aa202b784f37e93694d4ca4ae2$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q13';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c74d58795d8a23a732a7c086b$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c74d58795d8a23a732a7c086b';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$1b126a7a62b071e2605c7966bd97017888807b3f9fbb948e4c69d0e0a8a59446$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q14';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c74d58795d8a23a732a7c086b$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A hospital nurse is preparing a client for an elective procedure. Assume the facility policy lets the RN witness the client's signature.$nclexmocv6$, $nclexmocv6$Which actions are appropriate nursing responsibilities in the informed consent process? Select all that apply.$nclexmocv6$, $nclexmocv6${"kind":"select_all","options":["Explain the risks, benefits and alternatives in place of the provider when the provider is delayed","Notify the provider when the client expresses doubts or asks questions about the procedure","Confirm that a properly completed consent form is in the chart before the procedure","Ask the client's spouse to co-sign the form to confirm the client's decision","Verify that the client's signature is voluntary and that the client seems to understand","Have a nursing assistant obtain the signature when the RN is busy with another client"],"clientNeedsCategory":"Management of Care","blueprintTopic":"informed-consent-advance-directives"}$nclexmocv6$,
    $nclexmocv6$Notify the provider when the client expresses doubts or asks questions about the procedure|||Confirm that a properly completed consent form is in the chart before the procedure|||Verify that the client's signature is voluntary and that the client seems to understand$nclexmocv6$, $nclexmocv6$The RN confirms that consent is documented, that the signature is voluntary and the client appears to understand, and notifies the provider of questions. The provider explains the procedure; competent clients decide for themselves, and sedation before signing undermines valid consent.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","informed-consent-advance-directives","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(b)(2): informed decisions","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"},{"src":"CFR-482-51","label":"(b)(2): consent in chart before surgery","locator":"(b)(2): consent in chart before surgery"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 1.4: self-determination, choice without coercion","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$1b126a7a62b071e2605c7966bd97017888807b3f9fbb948e4c69d0e0a8a59446$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$informed-consent-advance-directives$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$select_all$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":14,"subtopic":"Informed consent","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":14,"subtopic":"Informed consent"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q14 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c74d58795d8a23a732a7c086b$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$ee4bac54a51d365faff3204e27024f63$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q14';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c555870efe25d91e5847623a3$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c555870efe25d91e5847623a3';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$90aaa08b41cadc5ef22f03889807f040061a4a54860cef6c53331cffebad0321$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q15';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c555870efe25d91e5847623a3$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$In the preoperative area, a client who has just received IV midazolam for anxiety is handed the surgical consent form by a staff member. The client is drowsy, slow to respond and cannot state what the procedure involves.$nclexmocv6$, $nclexmocv6$What should the RN do about the consent form for this client?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Review the consent form with the client again and have the client sign once the review is finished","Ask the client's adult daughter in the waiting area to sign because the client is sedated","Have the client sign the form now and document the sedation in the nursing record afterward","Hold the form and notify the provider that the client is sedated and cannot consent"],"clientNeedsCategory":"Management of Care","blueprintTopic":"informed-consent-advance-directives"}$nclexmocv6$,
    $nclexmocv6$Hold the form and notify the provider that the client is sedated and cannot consent$nclexmocv6$, $nclexmocv6$Valid consent requires capacity and voluntariness. A sedated client may not understand the information, so consent should be obtained before sedation or when capacity returns, per facility policy and the provider's direction.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","informed-consent-advance-directives","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 1.4: informed choice without coercion","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(b)(2): informed decisions by the patient or representative as allowed by State law","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$90aaa08b41cadc5ef22f03889807f040061a4a54860cef6c53331cffebad0321$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$informed-consent-advance-directives$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":15,"subtopic":"Informed consent","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":15,"subtopic":"Informed consent"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q15 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c555870efe25d91e5847623a3$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$f1da3cb3ca9486a0775ec01790424911$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q15';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c7edf5a2505d52c5aa881e359$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c7edf5a2505d52c5aa881e359';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$062d807641e9d3b2c147b7ddc159317f2e3fa572db55cdca948ff149053c2cd7$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q16';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c7edf5a2505d52c5aa881e359$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A client who speaks Portuguese and very little English needs a consent discussion before a cardiac catheterization. The client's adult son offers to interpret.$nclexmocv6$, $nclexmocv6$Per HHS language-access guidance, which action should the RN take?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Accept the son's offer and ask him to interpret each part of the consent form","Arrange a qualified medical interpreter for the consent discussion","Ask a bilingual nursing assistant who is nearby to interpret from the hallway","Give the client a translated consent form and ask the client to sign it"],"clientNeedsCategory":"Management of Care","blueprintTopic":"informed-consent-advance-directives"}$nclexmocv6$,
    $nclexmocv6$Arrange a qualified medical interpreter for the consent discussion$nclexmocv6$, $nclexmocv6$Language assistance should be provided by qualified interpreters; relying on family members is generally discouraged except in an emergency or at the client's informed request when a qualified interpreter is also available. A form alone does not ensure the discussion occurs.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","informed-consent-advance-directives","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"HHS-LEP","label":"HHS Title VI LEP guidance and Section 1557 language-access materials","locator":"HHS Title VI LEP guidance and Section 1557 language-access materials"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(b)(2): informed decisions","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$062d807641e9d3b2c147b7ddc159317f2e3fa572db55cdca948ff149053c2cd7$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$informed-consent-advance-directives$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":16,"subtopic":"Informed consent","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":16,"subtopic":"Informed consent"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q16 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c7edf5a2505d52c5aa881e359$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$1935f233731744104a7c6f757bb98c19$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q16';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c84953a9b935465c840121903$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c84953a9b935465c840121903';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$2242428c62be2f12696fca544f84e1825769ab2e5d015d0f6a808e5483198ecc$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q17';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c84953a9b935465c840121903$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$An unidentified adult is brought to the emergency department after a motor vehicle crash, unresponsive, with a rapidly expanding abdomen and a systolic blood pressure of 70 mm Hg. The surgeon states the client needs emergency surgery. No family can be reached.$nclexmocv6$, $nclexmocv6$Per the facility's emergency-treatment policy, which statement by the RN is most accurate?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["The surgery must wait until a family member or legal guardian is located to sign the form","Two nurses should sign the consent form on behalf of the client before the surgery begins","The surgery may proceed under the emergency exception, documented by the provider","The hospital administrator must sign the consent form before surgery may begin"],"clientNeedsCategory":"Management of Care","blueprintTopic":"informed-consent-advance-directives"}$nclexmocv6$,
    $nclexmocv6$The surgery may proceed under the emergency exception, documented by the provider$nclexmocv6$, $nclexmocv6$Federal hospital requirements require consent in the chart before surgery "except in emergencies." Facility policy and state law define the process; the provider documents the emergency and the lack of a surrogate.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","informed-consent-advance-directives","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"CFR-482-51","label":"(b)(2): consent form in the chart before surgery, except in emergencies","locator":"(b)(2): consent form in the chart before surgery, except in emergencies"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$2242428c62be2f12696fca544f84e1825769ab2e5d015d0f6a808e5483198ecc$nclexmocv6$,
    false, false, true,
    4, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$informed-consent-advance-directives$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":17,"subtopic":"Informed consent","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":17,"subtopic":"Informed consent"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q17 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c84953a9b935465c840121903$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$66496cff104cabfccb090725147ed661$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q17';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$cf38870462969b0caf8df52d9$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: cf38870462969b0caf8df52d9';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$23f7a3da8cb1c07fc6a52a7ba7a733608a0e5d9b758ebb35e9feda61bbb6371c$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q18';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$cf38870462969b0caf8df52d9$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A competent 58-year-old client with a hemoglobin of 6.8 g/dL refuses a blood transfusion because of personal religious beliefs. The provider has explained the risks of refusing.$nclexmocv6$, $nclexmocv6$How should the RN respond to the client's refusal of the transfusion?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Respect the refusal, confirm understanding of the risks and notify the provider","Ask the client's family to help persuade the client to accept the transfusion today","Prepare the transfusion because the provider explained the risks, then revisit consent later","Ask the chaplain to help the client accept the transfusion before documenting the refusal"],"clientNeedsCategory":"Management of Care","blueprintTopic":"informed-consent-advance-directives"}$nclexmocv6$,
    $nclexmocv6$Respect the refusal, confirm understanding of the risks and notify the provider$nclexmocv6$, $nclexmocv6$Competent clients have the right to refuse treatment after being informed of the consequences. The RN supports the decision, ensures understanding and communication with the team, and documents; coercion is not acceptable.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","informed-consent-advance-directives","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(b)(2): right to refuse treatment","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 1.4: right to self-determination, including no treatment","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$23f7a3da8cb1c07fc6a52a7ba7a733608a0e5d9b758ebb35e9feda61bbb6371c$nclexmocv6$,
    false, false, true,
    4, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$informed-consent-advance-directives$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":18,"subtopic":"Informed consent","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":18,"subtopic":"Informed consent"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q18 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cf38870462969b0caf8df52d9$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$5e5c30f83bea817b2472c28bf2a3b923$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q18';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c838aad32a852e85466dc34ad$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c838aad32a852e85466dc34ad';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$9bae2ed8e888fbd76251c1278761680851782c94749aa3032ace871a4c24f484$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q19';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c838aad32a852e85466dc34ad$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A 74-year-old client is being admitted to a medical unit through the emergency department. The client is alert and oriented.$nclexmocv6$, $nclexmocv6$Which action by the RN best meets the requirements regarding advance directives?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Ask the client to complete an advance directive before the admission process is finished","Give the client the written information at discharge and ask about an advance directive then","Ask the client's family whether an advance directive exists and record that answer instead of asking the client","Ask if the client has an advance directive and give written information about making one"],"clientNeedsCategory":"Management of Care","blueprintTopic":"informed-consent-advance-directives"}$nclexmocv6$,
    $nclexmocv6$Ask if the client has an advance directive and give written information about making one$nclexmocv6$, $nclexmocv6$Hospitals must give written information about advance directives, document whether the client has one in the record, and may not condition care on having one.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","informed-consent-advance-directives","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"CFR-489-102","label":"42 CFR 489.102 Requirements for providers (advance directives) (CMS/eCFR)","locator":"(a): provide written information; document in the medical record; not condition care on having an AD","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-489/subpart-I/section-489.102"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Integrate advance directives into the client plan of care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$9bae2ed8e888fbd76251c1278761680851782c94749aa3032ace871a4c24f484$nclexmocv6$,
    false, false, true,
    2, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$informed-consent-advance-directives$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":19,"subtopic":"Advance directives","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":19,"subtopic":"Advance directives"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q19 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c838aad32a852e85466dc34ad$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$daa466d67aced051a24220ff57dbf120$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q19';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c6ae4672605defeb29fc44589$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c6ae4672605defeb29fc44589';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$9e3c431145e99f9d6d14f92cfcf141e5a836bf9d7659b5194cd31c275bff3e6c$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q20';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c6ae4672605defeb29fc44589$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A client with end-stage COPD has a living will on the chart that states "no intubation or mechanical ventilation." The client becomes unresponsive. The client's son tells the RN, "Do everything. Put him on the machine."$nclexmocv6$, $nclexmocv6$How should the RN respond to the conflict between the living will and the son's request?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Follow the son's request because family wishes override a living will","Follow the client's directive, notify the provider and support the son","Ask the son to sign a form that removes the living will from the chart","Delay all treatment until the hospital's legal department reaches the family"],"clientNeedsCategory":"Management of Care","blueprintTopic":"informed-consent-advance-directives"}$nclexmocv6$,
    $nclexmocv6$Follow the client's directive, notify the provider and support the son$nclexmocv6$, $nclexmocv6$A valid advance directive expresses the client's own decision. The RN honors it per state law and facility policy, informs the provider, and supports the family with ethics or palliative resources as needed.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","informed-consent-advance-directives","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(b)(3): right to formulate advance directives and have staff comply per State law","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"},{"src":"CFR-489-102","label":"42 CFR 489.102 Requirements for providers (advance directives) (CMS/eCFR)","locator":"(a)(4): compliance with State law on advance directives","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-489/subpart-I/section-489.102"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$9e3c431145e99f9d6d14f92cfcf141e5a836bf9d7659b5194cd31c275bff3e6c$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$informed-consent-advance-directives$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":20,"subtopic":"Advance directives","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":20,"subtopic":"Advance directives"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q20 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c6ae4672605defeb29fc44589$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$d4772588d5c25c88a8e8119a310edc03$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q20';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c865c51fbb07fe12c643e0627$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c865c51fbb07fe12c643e0627';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$69c500db2a7d511bf58ef0d02dbdb94669dd75bab83aa2d3149c6f3a46e52339$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q21';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c865c51fbb07fe12c643e0627$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A hospital RN is teaching a client and family about advance directives at admission. Answer under the federal hospital requirements (42 CFR 489.102) and general advance-directive principles.$nclexmocv6$, $nclexmocv6$Which statements about advance directives are accurate? Select all that apply.$nclexmocv6$, $nclexmocv6${"kind":"select_all","options":["A competent client may revoke or change an advance directive at any time","A living will names the person who makes health decisions when the client cannot","A hospital may require an advance directive to be on file before an elective admission","An advance directive is valid only after a hospital ethics committee has approved it","A health care agent makes decisions when the client has lost decision-making capacity","A hospital must document in the record whether a client has an advance directive"],"clientNeedsCategory":"Management of Care","blueprintTopic":"informed-consent-advance-directives"}$nclexmocv6$,
    $nclexmocv6$A competent client may revoke or change an advance directive at any time|||A health care agent makes decisions when the client has lost decision-making capacity|||A hospital must document in the record whether a client has an advance directive$nclexmocv6$, $nclexmocv6$Directives can be changed by a competent client; an agent decides for a client who lacks capacity; the hospital documents whether the client has a directive and cannot condition care or admission on having one. A living will states treatment wishes, and the person named to decide is the health care agent (durable power of attorney for health care). Ethics committee approval is not required for validity.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","informed-consent-advance-directives","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"CFR-489-102","label":"42 CFR 489.102 Requirements for providers (advance directives) (CMS/eCFR)","locator":"(a)(2)-(3): document whether the individual has an AD; do not condition care","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-489/subpart-I/section-489.102"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(b)(3)","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$69c500db2a7d511bf58ef0d02dbdb94669dd75bab83aa2d3149c6f3a46e52339$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$informed-consent-advance-directives$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$select_all$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":21,"subtopic":"Advance directives","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":21,"subtopic":"Advance directives"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q21 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c865c51fbb07fe12c643e0627$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$12c5e59621afdc3d5d424de9f88cb721$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q21';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$cfe3ad49941a9576b112c13d5$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: cfe3ad49941a9576b112c13d5';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$b8006a4634deb3b4db41dfedf3b621f59de405d78382a4c2e459ee6ea8365d73$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q22';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$cfe3ad49941a9576b112c13d5$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A client with a stroke cannot make decisions. The chart contains a durable power of attorney for health care naming the client's daughter as agent. The client's wife asks that a feeding tube be placed; the daughter declines it based on her father's earlier statements.$nclexmocv6$, $nclexmocv6$Whose decision should the RN follow regarding the feeding tube?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Follow the wife's request since she is the spouse and has known the client longer","Ask the wife and daughter to settle the disagreement before the provider is told","Follow the daughter's decisions as the named agent and inform the provider","Decide that placing the tube is safest while the family continues to disagree"],"clientNeedsCategory":"Management of Care","blueprintTopic":"informed-consent-advance-directives"}$nclexmocv6$,
    $nclexmocv6$Follow the daughter's decisions as the named agent and inform the provider$nclexmocv6$, $nclexmocv6$Under state law, the person named in a valid health care power of attorney generally speaks for a client who lacks capacity. The RN informs the provider and uses ethics or social work resources to support the family.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","informed-consent-advance-directives","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(b)(2)-(3): decisions by the patient's representative per State law; advance directives","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"},{"src":"CFR-489-102","label":"42 CFR 489.102 Requirements for providers (advance directives) (CMS/eCFR)","locator":"(a)(4)","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-489/subpart-I/section-489.102"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$b8006a4634deb3b4db41dfedf3b621f59de405d78382a4c2e459ee6ea8365d73$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$informed-consent-advance-directives$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":22,"subtopic":"Advance directives","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":22,"subtopic":"Advance directives"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q22 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cfe3ad49941a9576b112c13d5$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$30f9ad49dbdd003577f9c9b8fa52ce6d$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q22';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c407b78b5015c0f9095f00485$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c407b78b5015c0f9095f00485';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$1e7a3ffae16df986a43ffd7ac773ef9a750d595656708252841ff08c63faf568$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q23';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c407b78b5015c0f9095f00485$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A client transferred from a skilled nursing facility arrives with a POLST form that indicates "Do Not Attempt Resuscitation" and comfort-focused treatment. The admission orders are written as "Full Code."$nclexmocv6$, $nclexmocv6$How should the RN resolve the conflict between the POLST form and the admission order?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Clarify code status with the provider and client or agent and request matching orders","Follow the Full Code admission order because it is the most recent written order for the client","Disregard the POLST form because it was completed at another facility and is not a hospital order","Ask the client's family which code status they prefer and record that choice in the admission note"],"clientNeedsCategory":"Management of Care","blueprintTopic":"informed-consent-advance-directives"}$nclexmocv6$,
    $nclexmocv6$Clarify code status with the provider and client or agent and request matching orders$nclexmocv6$, $nclexmocv6$A POLST is a portable medical order reflecting a seriously ill client's goals. A conflict between it and admission orders must be clarified promptly with the provider and the client or agent so the plan reflects the client's wishes.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","informed-consent-advance-directives","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"POLST","label":"National POLST: portable medical order for seriously ill or frail clients","locator":"National POLST: portable medical order for seriously ill or frail clients"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Integrate advance directives into the client plan of care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(b)(3)","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$1e7a3ffae16df986a43ffd7ac773ef9a750d595656708252841ff08c63faf568$nclexmocv6$,
    false, false, true,
    4, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$informed-consent-advance-directives$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":23,"subtopic":"Advance directives","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":23,"subtopic":"Advance directives"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q23 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c407b78b5015c0f9095f00485$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$164b6ac6fab12ca649f3c02da654604b$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q23';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$ce03ea29bc1e64249e4c9848a$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: ce03ea29bc1e64249e4c9848a';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$174f310a22f79e0f78c7f940d0b32727de3d0066066b11ccedbf00d910b0cd28$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q24';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$ce03ea29bc1e64249e4c9848a$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A client with a living will and health care agent is admitted for pneumonia.$nclexmocv6$, $nclexmocv6$Which action best ensures the care team will follow the client's wishes?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Place a copy of the living will in the admission note and review it again only if the client becomes unstable","Tell the provider about the living will and the agent, and leave other staff to ask the client about it","Ask the client to restate the wishes to each new nurse at every shift change during the stay","Record the wishes and the agent's contact details in the chart and share them with the team at handoff"],"clientNeedsCategory":"Management of Care","blueprintTopic":"informed-consent-advance-directives"}$nclexmocv6$,
    $nclexmocv6$Record the wishes and the agent's contact details in the chart and share them with the team at handoff$nclexmocv6$, $nclexmocv6$Integration means the wishes are documented where the whole team will see them, communicated at transitions, and used to guide decisions. They are not stored passively, shared with one clinician or repeated by the client.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","informed-consent-advance-directives","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Integrate advance directives into the client plan of care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-489-102","label":"42 CFR 489.102 Requirements for providers (advance directives) (CMS/eCFR)","locator":"(a)(2)","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-489/subpart-I/section-489.102"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$174f310a22f79e0f78c7f940d0b32727de3d0066066b11ccedbf00d910b0cd28$nclexmocv6$,
    false, false, true,
    2, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$informed-consent-advance-directives$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":24,"subtopic":"Advance directives","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":24,"subtopic":"Advance directives"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q24 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$ce03ea29bc1e64249e4c9848a$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$cab50b574d961d4e9aa7393c5cf79b09$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q24';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c62e77ea0c937450ea460baee$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c62e77ea0c937450ea460baee';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$9d153a5a8dcbc69818ac2dd888036205d53e1fed1c80ee3efd9096e6f8040c98$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q25';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c62e77ea0c937450ea460baee$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A 29-year-old transgender man is admitted to a medical unit. A nursing assistant repeatedly uses the client's former name and pronouns despite the client's correction.$nclexmocv6$, $nclexmocv6$How should the RN respond to the nursing assistant's behavior?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Ask the client whether the nursing assistant should be reassigned to another unit","Use the client's chosen name and pronouns, and correct staff who do not use them","Give the nursing assistant an inclusive language handout and recheck the assignment next week","Document the concern in the chart and remind the assistant at the next huddle"],"clientNeedsCategory":"Management of Care","blueprintTopic":"client-advocacy-education"}$nclexmocv6$,
    $nclexmocv6$Use the client's chosen name and pronouns, and correct staff who do not use them$nclexmocv6$, $nclexmocv6$Unbiased treatment and equal access to care regardless of gender identity is a tested 2026 competency. The RN respects the client's identity and addresses the behavior with staff.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","client-advocacy-education","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: support unbiased treatment and equal access to care (incl. gender identity/expression)","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 1: respect for the dignity, worth and unique attributes of every person","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$9d153a5a8dcbc69818ac2dd888036205d53e1fed1c80ee3efd9096e6f8040c98$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$client-advocacy-education$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":25,"subtopic":"Client rights and advocacy","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":25,"subtopic":"Client rights and advocacy"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q25 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c62e77ea0c937450ea460baee$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$e768f4e09bf46596f4fa5132864fa332$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q25';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c4d7ef9c9ac7188980f4b1557$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c4d7ef9c9ac7188980f4b1557';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$4558a39e0598be10d4c9d1ffc70d7ad5555ffc051c3d7b6408a803648f08cb3b$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q26';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c4d7ef9c9ac7188980f4b1557$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A 78-year-old man who is homeless is admitted with cellulitis of the lower leg. Staff comment that "he will just be back in a week."$nclexmocv6$, $nclexmocv6$Which RN action best demonstrates equal access to care for this client?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Plan a shorter teaching session because the client is unlikely to follow instructions after discharge","Give the discharge instructions to a shelter worker without discussing them with the client","Plan discharge with the case manager so the client has a place to continue wound care and medications","Suggest to the team that the client's discharge be delayed until housing is guaranteed"],"clientNeedsCategory":"Management of Care","blueprintTopic":"client-advocacy-education"}$nclexmocv6$,
    $nclexmocv6$Plan discharge with the case manager so the client has a place to continue wound care and medications$nclexmocv6$, $nclexmocv6$Equal access means planning for the client's real circumstances with resources and referrals, not assuming nonadherence or withholding teaching.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","client-advocacy-education","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: support unbiased treatment and equal access to care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-43","label":"42 CFR 482.43 Condition of participation: Discharge planning (CMS/eCFR)","locator":"(a): identify patients likely to suffer adverse consequences without adequate discharge planning","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.43"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$4558a39e0598be10d4c9d1ffc70d7ad5555ffc051c3d7b6408a803648f08cb3b$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$client-advocacy-education$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":26,"subtopic":"Client rights and advocacy","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":26,"subtopic":"Client rights and advocacy"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q26 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c4d7ef9c9ac7188980f4b1557$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$dc0f693a0457c0a8b1762ea3787a7107$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q26';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c255a88eacd6d2b708c3782b7$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c255a88eacd6d2b708c3782b7';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$18df47b634a5bab89cc94a4bc8a3df18cff67735337b546c5e2f2aad7187e800$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q27';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c255a88eacd6d2b708c3782b7$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A competent 65-year-old client tells the RN that in her culture her husband makes health decisions and she wants him to decide about her chemotherapy plan after the provider's explanation.$nclexmocv6$, $nclexmocv6$How should the RN respond to the client's request for her husband to decide?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Ask the client privately how she wants decisions made, then respect and document it","Tell the client that only she can make decisions and the husband may not participate","Ask the husband to sign the consent form without the client's further involvement","Ask the social worker to explain to the client that her husband may be informed but not decide"],"clientNeedsCategory":"Management of Care","blueprintTopic":"client-advocacy-education"}$nclexmocv6$,
    $nclexmocv6$Ask the client privately how she wants decisions made, then respect and document it$nclexmocv6$, $nclexmocv6$Self-determination includes the client's choice about how decisions are made, with respect for cultural values. The RN confirms the preference privately and ensures that it is voluntary and documented.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","client-advocacy-education","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 1.4: right to self-determination, with respect for cultural decision-making","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(b)(2)","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$18df47b634a5bab89cc94a4bc8a3df18cff67735337b546c5e2f2aad7187e800$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$client-advocacy-education$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":27,"subtopic":"Client rights and advocacy","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":27,"subtopic":"Client rights and advocacy"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q27 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c255a88eacd6d2b708c3782b7$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$d08c56cc30f4255a245c2f4eb03dd808$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q27';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c1e21bdb6035c9cfc38017f04$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c1e21bdb6035c9cfc38017f04';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$602a009acec35f939de2522c7541bdad6d49f4a7c24dd827fd0663b1e7e95402$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q28';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c1e21bdb6035c9cfc38017f04$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A client with opioid use disorder who takes methadone daily as maintenance treatment (this morning's dose was given) is 1 day after an open reduction of the femur. The client rates pain at 9/10 and asks for pain medication. The client is alert with RR 16/min, SpO2 96% and a sedation score of 1 (awake). The provider has ordered an as-needed opioid analgesic. A colleague says, "He's just drug seeking."$nclexmocv6$, $nclexmocv6$Which action by the RN is most appropriate?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Give half of the ordered dose and reassess in 1 hour to lower the risk of misuse","Hold the ordered opioid because the client already receives methadone each day","Hold the ordered dose until an addiction medicine consultant has seen the client","Assess pain with a standard scale, give the ordered analgesic and reassess"],"clientNeedsCategory":"Management of Care","blueprintTopic":"client-advocacy-education"}$nclexmocv6$,
    $nclexmocv6$Assess pain with a standard scale, give the ordered analgesic and reassess$nclexmocv6$, $nclexmocv6$Clients with opioid use disorder, including those on methadone maintenance, are entitled to equal assessment and treatment of acute pain. Maintenance medication continues and does not by itself treat acute surgical pain, and the client may need additional analgesia. The RN assesses objectively, gives the ordered analgesic and reassesses; stigma, withholding or reducing analgesia without a clinical reason is not acceptable.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","client-advocacy-education","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: support unbiased treatment and equal access to care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 1 and Provision 3: dignity; advocacy for rights, health and safety","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$602a009acec35f939de2522c7541bdad6d49f4a7c24dd827fd0663b1e7e95402$nclexmocv6$,
    false, false, true,
    4, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$client-advocacy-education$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":28,"subtopic":"Client rights and advocacy","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":28,"subtopic":"Client rights and advocacy"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q28 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c1e21bdb6035c9cfc38017f04$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$8063569522e20ecb29432b2a6d8386c7$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q28';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c4552c4fa2434cdfd60827754$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c4552c4fa2434cdfd60827754';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$a358d87f213a95e50b314af57b3ffcd3b72da6d8f17ba79ba6e517aebf6f5851$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q29';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c4552c4fa2434cdfd60827754$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$The RN is caring for a client on a surgical unit and is reviewing ways to uphold the client's rights.$nclexmocv6$, $nclexmocv6$Which actions support the client's rights? Select all that apply.$nclexmocv6$, $nclexmocv6${"kind":"select_all","options":["Telling the client whom to contact to file a grievance about the care received","Delaying a requested change of room until the end of the month","Closing the room door and curtain before performing a dressing change","Respecting the client's decision to refuse a scheduled treatment after the risks are explained","Discussing the client's diagnosis with a visitor who says he is a friend of the family","Asking the client to withdraw a complaint before the unit manager hears about it"],"clientNeedsCategory":"Management of Care","blueprintTopic":"client-advocacy-education"}$nclexmocv6$,
    $nclexmocv6$Telling the client whom to contact to file a grievance about the care received|||Closing the room door and curtain before performing a dressing change|||Respecting the client's decision to refuse a scheduled treatment after the risks are explained$nclexmocv6$, $nclexmocv6$Privacy, notice of the grievance process and the right to refuse treatment are protected patient rights. Sharing information with an unauthorized visitor or discouraging complaints is not.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","client-advocacy-education","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(a)(2) grievance process; (b)(2) refuse treatment; (c)(1) personal privacy","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$a358d87f213a95e50b314af57b3ffcd3b72da6d8f17ba79ba6e517aebf6f5851$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$client-advocacy-education$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$select_all$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":29,"subtopic":"Client rights and advocacy","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":29,"subtopic":"Client rights and advocacy"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q29 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c4552c4fa2434cdfd60827754$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$c40a1eb1b592ce72fe9b9c2eac57319c$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q29';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$cc02c17378aaeb4ec2e202b5f$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: cc02c17378aaeb4ec2e202b5f';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$802264d9adcd933e917a6bdfa7bc9160a7cae7a9532b3c1c23ec4d1caf3adb99$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q30';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$cc02c17378aaeb4ec2e202b5f$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$The hospital's current visitation policy follows the CMS rule. A printed unit sheet from an earlier year still reads "immediate family only." A client's same-sex partner of 10 years arrives during visiting hours, and the client says, "He is the person I want to see."$nclexmocv6$, $nclexmocv6$How should the RN handle the partner's request to visit?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Ask the partner to wait until the client's sister arrives to confirm the relationship","Allow the partner to visit and tell the charge nurse the unit sheet needs updating","Allow a visit of only five minutes because the partner is not legally related","Ask the nurse manager for permission before allowing the visit, and have the partner wait outside"],"clientNeedsCategory":"Management of Care","blueprintTopic":"client-advocacy-education"}$nclexmocv6$,
    $nclexmocv6$Allow the partner to visit and tell the charge nurse the unit sheet needs updating$nclexmocv6$, $nclexmocv6$Under 42 CFR 482.13(h) hospitals must honor the visitors a client designates (including a domestic partner) and may not restrict visitation based on sexual orientation or gender identity. An outdated unit sheet does not override current policy; clinical restrictions apply equally to all visitors.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","client-advocacy-education","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(h)(2)-(4): visitation rights; no restriction on the basis of sexual orientation or gender identity","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: support unbiased treatment and equal access to care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$802264d9adcd933e917a6bdfa7bc9160a7cae7a9532b3c1c23ec4d1caf3adb99$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$client-advocacy-education$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":30,"subtopic":"Client rights and advocacy","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":30,"subtopic":"Client rights and advocacy"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q30 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cc02c17378aaeb4ec2e202b5f$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$d1452425a3313331086917bd4e7ca2f6$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q30';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$cceccd2112bb739d0845e5a46$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: cceccd2112bb739d0845e5a46';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$259a58cd7c79b30c92dfca2b2ad08e7933534e1d8c4508d64444afe9b85f10aa$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q31';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$cceccd2112bb739d0845e5a46$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$The RN is planning care for a diverse group of clients and wants to support unbiased treatment and equal access to care.$nclexmocv6$, $nclexmocv6$Which actions support unbiased treatment and equal access to care? Select all that apply.$nclexmocv6$, $nclexmocv6${"kind":"select_all","options":["Directing teaching to the family member when the client has a physical disability and family is present","Asking each client how the client wishes to be addressed and recording the response","Using a qualified interpreter for clients who have limited English proficiency","Giving the longest teaching sessions to clients the nurse expects to follow the plan best","Using the same validated pain scale for every client and asking about each client's pain goals","Assuming a client's dietary needs from the client's name, accent or appearance"],"clientNeedsCategory":"Management of Care","blueprintTopic":"client-advocacy-education"}$nclexmocv6$,
    $nclexmocv6$Asking each client how the client wishes to be addressed and recording the response|||Using a qualified interpreter for clients who have limited English proficiency|||Using the same validated pain scale for every client and asking about each client's pain goals$nclexmocv6$, $nclexmocv6$Asking preferences, using qualified interpreters, and applying the same validated assessment tool while asking about each client's goals support equal access. Assumptions and unequal treatment based on background, disability or payer are biased.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","client-advocacy-education","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: support unbiased treatment and equal access to care","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"HHS-LEP","label":"Language access for LEP clients","locator":"Language access for LEP clients"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 1","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$259a58cd7c79b30c92dfca2b2ad08e7933534e1d8c4508d64444afe9b85f10aa$nclexmocv6$,
    false, false, true,
    4, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$client-advocacy-education$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$select_all$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":31,"subtopic":"Client rights and advocacy","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":31,"subtopic":"Client rights and advocacy"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q31 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cceccd2112bb739d0845e5a46$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$04a5d531edccfc30270bdf6f5b4cb600$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q31';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c29629af0189008b5c0d02b05$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c29629af0189008b5c0d02b05';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$e41ec06da8227e9bfd4c3a777ac4d356484a89a8343f4bf476a0e7366f44a107$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q32';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c29629af0189008b5c0d02b05$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A client is scheduled for an intimate examination by a male provider and tells the RN she is uncomfortable.$nclexmocv6$, $nclexmocv6$Which action by the RN best advocates for the client?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Tell the client that the provider is professional and the examination is routine","Offer to stay in the room and tell the client the provider has done this exam often","Ask about her preference and request an alternative provider or chaperone","Ask the provider to keep the exam short so the client is uncomfortable for less time"],"clientNeedsCategory":"Management of Care","blueprintTopic":"client-advocacy-education"}$nclexmocv6$,
    $nclexmocv6$Ask about her preference and request an alternative provider or chaperone$nclexmocv6$, $nclexmocv6$Advocacy means listening to the client's concern, protecting privacy and dignity, and working with the team to accommodate preferences where possible.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","client-advocacy-education","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Advocate for client rights and needs","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(c)(1): personal privacy","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$e41ec06da8227e9bfd4c3a777ac4d356484a89a8343f4bf476a0e7366f44a107$nclexmocv6$,
    false, false, true,
    2, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$client-advocacy-education$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":32,"subtopic":"Client rights and advocacy","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":32,"subtopic":"Client rights and advocacy"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q32 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c29629af0189008b5c0d02b05$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$621b9970a59d563608db2dff960e5dba$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q32';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c3c1745f1388b1e92f829a752$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c3c1745f1388b1e92f829a752';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$0cf1a9056faab956c8bebd469fbb90f5359a704c82f0115cc7192663e50f201e$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q33';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c3c1745f1388b1e92f829a752$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$While reviewing the unit census, an RN sees that a neighbor is a client on another unit. The RN is not assigned to that client.$nclexmocv6$, $nclexmocv6$Which action is appropriate?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Avoid opening the neighbor's record or discussing the admission with anyone","Open the record to check the neighbor's care and close it quickly","Ask the unit clerk for a status update to pass along if the family asks","Ask the neighbor's nurse for an update because the neighbor is a close friend"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocv6$,
    $nclexmocv6$Avoid opening the neighbor's record or discussing the admission with anyone$nclexmocv6$, $nclexmocv6$Access to client information is limited to those with a care-related need to know, and nurses protect privacy and confidentiality of personal and clinical information.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 3.1: protect privacy and confidentiality","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Maintain client confidentiality and privacy","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$0cf1a9056faab956c8bebd469fbb90f5359a704c82f0115cc7192663e50f201e$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$legal-aspects$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":33,"subtopic":"Ethics and legal","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":33,"subtopic":"Ethics and legal"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q33 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c3c1745f1388b1e92f829a752$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$2f9b2a31e9e92101f87a8b9088319b20$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q33';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c26a0ff7b922ace428fcdd745$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c26a0ff7b922ace428fcdd745';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$7bb34b5adcbc91f46cb518f8a38f9500ec4c76001650860c2a21de09bb4f20c4$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q34';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c26a0ff7b922ace428fcdd745$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$An RN posts a photo from a night shift to a private social media account. A client's wristband is blurred, but the room number and the client's unusual injury are visible.$nclexmocv6$, $nclexmocv6$Per the NCSBN social media guidance, which action should the RN take?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Keep the post because the account is private and the wristband is blurred","Edit the caption so it does not mention the injury and leave the post","Ask friends not to share the post and wait to see if anyone complains","Delete the post and report the breach promptly per the employer's policy"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocv6$,
    $nclexmocv6$Delete the post and report the breach promptly per the employer's policy$nclexmocv6$, $nclexmocv6$Privacy settings and blurred names do not prevent a breach; room numbers and conditions can identify clients. Breaches should be reported promptly and handled according to employer policy.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-SOCIAL","label":"A Nurse's Guide to the Use of Social Media (2018)","locator":"A Nurse's Guide to the Use of Social Media (2018)"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 3.1","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$7bb34b5adcbc91f46cb518f8a38f9500ec4c76001650860c2a21de09bb4f20c4$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$legal-aspects$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":34,"subtopic":"Ethics and legal","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":34,"subtopic":"Ethics and legal"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q34 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c26a0ff7b922ace428fcdd745$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$cdb7f2c4d2bae92385637073f60be7c0$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q34';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c90bbcbfac0b05bf410b27e35$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c90bbcbfac0b05bf410b27e35';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$2a35c78782e6686eebeb1c4569a6be923f2f33c684f78d07ccf5ae7c248b31bb$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q35';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c90bbcbfac0b05bf410b27e35$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$Before the morning medication pass, the RN notices that a coworker has slurred speech, an unsteady gait and an odor of alcohol.$nclexmocv6$, $nclexmocv6$What is the RN's most appropriate response to the coworker's condition?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Speak privately with the coworker, accept a promise to go home and report only if it happens again","Make sure the coworker does not care for clients and report to the charge nurse","Offer to cover the coworker's medication pass for the shift and say nothing else about it","Notify the state board of nursing first and tell the unit manager at the end of the shift"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocv6$,
    $nclexmocv6$Make sure the coworker does not care for clients and report to the charge nurse$nclexmocv6$, $nclexmocv6$Impaired practice threatens client safety and must be reported through the chain of command so the coworker is removed from care and receives help; delay or covering for a colleague puts clients at risk.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 3.5: identify and report impaired practice","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Practice in a manner consistent with a code of ethics","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$2a35c78782e6686eebeb1c4569a6be923f2f33c684f78d07ccf5ae7c248b31bb$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$legal-aspects$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":35,"subtopic":"Ethics and legal","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":35,"subtopic":"Ethics and legal"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q35 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c90bbcbfac0b05bf410b27e35$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$fa685e422d1265a9e49e1dcd378ce3a6$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q35';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c7a08fdc5e8789a3897fbc660$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c7a08fdc5e8789a3897fbc660';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$dcd74f19f031f47423bfcd3b431c7fd7d74b77b9e51a0e28eaac5bb32cb12fa0$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q36';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c7a08fdc5e8789a3897fbc660$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$An RN in a pediatric clinic examines a 2-year-old with bruises on the back and thighs in different stages of healing. The caregiver's explanations for the bruises change during the visit.$nclexmocv6$, $nclexmocv6$Under mandatory-reporting laws, which action should the RN take?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Wait until the provider confirms the diagnosis of abuse before reporting it to any agency","Confront the caregiver with the concerns and report only if the caregiver admits it","Report suspected abuse to the child protective agency per state law and tell the provider","Document the findings and let the social worker decide whether a report is needed"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocv6$,
    $nclexmocv6$Report suspected abuse to the child protective agency per state law and tell the provider$nclexmocv6$, $nclexmocv6$Health care workers are mandated reporters of suspected child abuse in all states. Reporting is based on reasonable suspicion, not proof, and cannot be delegated or delayed.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"CWIG","label":"Child Welfare Information Gateway: mandatory reporting; follow the state law","locator":"Child Welfare Information Gateway: mandatory reporting; follow the state law"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Report client conditions as required by law","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$dcd74f19f031f47423bfcd3b431c7fd7d74b77b9e51a0e28eaac5bb32cb12fa0$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$legal-aspects$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":36,"subtopic":"Ethics and legal","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":36,"subtopic":"Ethics and legal"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q36 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c7a08fdc5e8789a3897fbc660$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$3e50c1d41b15f980ad8e2b15f0afecc0$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q36';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c2041435416b32d85a96272e5$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c2041435416b32d85a96272e5';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$6dabb06bdd52fe3e0f52bf4d5b75030ab8da6e10f28c36054c82ccd93d8d3331$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q37';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c2041435416b32d85a96272e5$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$An RN gave a scheduled oral antibiotic 2 hours after the ordered time. The facility's window for scheduled doses is 1 hour before to 1 hour after the ordered time. The client has no adverse effects.$nclexmocv6$, $nclexmocv6$What should the RN do in addition to assessing the client and notifying the provider?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Complete an incident report that describes the late dose in factual terms","Tell the client the dose was late and apologize, then take no further action","Ask the provider to change the ordered time so the dose is not charted as late","Chart the dose at the scheduled time since it was given within the same shift"],"clientNeedsCategory":"Management of Care","blueprintTopic":"quality-improvement"}$nclexmocv6$,
    $nclexmocv6$Complete an incident report that describes the late dose in factual terms$nclexmocv6$, $nclexmocv6$Safety event reporting is system-focused and should describe what happened objectively. Altering records or hiding a near miss prevents learning and violates professional standards.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","quality-improvement","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"AHRQ-PSNET","label":"PSNet: Reporting Patient Safety Events","locator":"PSNet: Reporting Patient Safety Events"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Acknowledge and document practice errors and near misses","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$6dabb06bdd52fe3e0f52bf4d5b75030ab8da6e10f28c36054c82ccd93d8d3331$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$quality-improvement$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":37,"subtopic":"Ethics and legal","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":37,"subtopic":"Ethics and legal"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q37 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c2041435416b32d85a96272e5$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$78d1bbf4d5ac2e9e961e43dae9fe60f5$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q37';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$cbad23a4c617f03ef9f1b684d$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: cbad23a4c617f03ef9f1b684d';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$db4ed9555c60ed43626983d69f25b392263c91fc54e195520edd48486cb4a0b2$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q38';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$cbad23a4c617f03ef9f1b684d$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$The RN was walking down the hall and saw a client slide to the floor while walking to the bathroom. The client was not injured after assessment. The RN is writing an incident report.$nclexmocv6$, $nclexmocv6$Which information belongs in the incident report? Select all that apply.$nclexmocv6$, $nclexmocv6${"kind":"select_all","options":["An objective description of what the RN saw and did, written without opinion","A conclusion that the fall happened because the client skipped the call light","A recommendation that the coworker on break be disciplined","Notifications made, such as to the provider, the family and the supervisor","The date, time, location and the client's condition after the event was assessed","A note that an incident report was completed, for the client's medical record"],"clientNeedsCategory":"Management of Care","blueprintTopic":"quality-improvement"}$nclexmocv6$,
    $nclexmocv6$An objective description of what the RN saw and did, written without opinion|||Notifications made, such as to the provider, the family and the supervisor|||The date, time, location and the client's condition after the event was assessed$nclexmocv6$, $nclexmocv6$Incident reports are factual, objective and system-focused. Opinions about fault or legal speculation do not belong.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","quality-improvement","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"AHRQ-PSNET","label":"PSNet: patient safety event reporting is system-focused","locator":"PSNet: patient safety event reporting is system-focused"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Acknowledge and document practice errors and near misses","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$db4ed9555c60ed43626983d69f25b392263c91fc54e195520edd48486cb4a0b2$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$quality-improvement$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$select_all$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":38,"subtopic":"Ethics and legal","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":38,"subtopic":"Ethics and legal"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q38 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cbad23a4c617f03ef9f1b684d$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$c5b87474fa45f8294214c7c292190c71$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q38';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c20d2179ba4b29f9570cdd364$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c20d2179ba4b29f9570cdd364';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$eba24aa3a22d96812e97db1b91f84f6298fd5eb19392e0893250664759db69fc$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q39';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c20d2179ba4b29f9570cdd364$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A charge nurse asks an RN who has never inserted a PICC and has not been trained to place a PICC for a client on the unit.$nclexmocv6$, $nclexmocv6$Which response by the RN is most appropriate?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Agree to place the PICC if the charge nurse stays in the room and signs the procedure note","Review the facility's policy on PICC insertion and place the line once the review is documented","Place the PICC only after watching a video on the unit's education site","Explain that the RN is not trained for the procedure and ask for a qualified nurse"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocv6$,
    $nclexmocv6$Explain that the RN is not trained for the procedure and ask for a qualified nurse$nclexmocv6$, $nclexmocv6$Nurses act within their legal scope and demonstrated competence and recognize their limits; performing an untrained procedure endangers the client and the RN's license.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Provide care within the legal scope of practice; recognize limitations of self and others","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 4: authority, accountability and competence","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$eba24aa3a22d96812e97db1b91f84f6298fd5eb19392e0893250664759db69fc$nclexmocv6$,
    false, false, true,
    4, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$legal-aspects$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":39,"subtopic":"Ethics and legal","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":39,"subtopic":"Ethics and legal"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q39 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c20d2179ba4b29f9570cdd364$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$a60f8d7b7397cd12ab52b0237121eb5b$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q39';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c5e6badbe7f0c33e317542d81$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c5e6badbe7f0c33e317542d81';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$1dd12e4bf4bcc5889056cb8872681f93e54d67daaa93262de42caa42f9aecf04$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q40';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c5e6badbe7f0c33e317542d81$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$The daughter of a 70-year-old client who has just been diagnosed with metastatic cancer says to the RN, "Please don't tell Dad. It would break his heart." The client is competent and has not asked to be spared information.$nclexmocv6$, $nclexmocv6$How should the RN respond to the daughter's request?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Agree to withhold the diagnosis and tell the provider not to discuss it with the client","Acknowledge the concern, explain the client's right to information and notify the provider","Tell the client the diagnosis in detail before the provider has had a chance to see the client","Agree to let the daughter be present and speak for the client while the provider discusses the diagnosis"],"clientNeedsCategory":"Management of Care","blueprintTopic":"ethical-principles"}$nclexmocv6$,
    $nclexmocv6$Acknowledge the concern, explain the client's right to information and notify the provider$nclexmocv6$, $nclexmocv6$Competent clients have the right to information about their health status and to decide how much to know. The RN responds with empathy, does not collude in withholding information, and involves the provider and ethics resources as needed.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","ethical-principles","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(b)(2): patient's right to be informed of health status and to make decisions","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 1.4: self-determination","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$1dd12e4bf4bcc5889056cb8872681f93e54d67daaa93262de42caa42f9aecf04$nclexmocv6$,
    false, false, true,
    4, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$ethical-principles$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":40,"subtopic":"Ethics and legal","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":40,"subtopic":"Ethics and legal"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q40 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c5e6badbe7f0c33e317542d81$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$3efcdb3102612275caf08e550e1661e6$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q40';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$cb2c778a5199bb82ff75d38d5$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: cb2c778a5199bb82ff75d38d5';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$cf4f83718af474dc233704da9bf1a3e5fe9508144c47a5c9e4f8c89c81920bc5$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q41';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$cb2c778a5199bb82ff75d38d5$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A nurse is describing ethical principles to students.$nclexmocv6$, $nclexmocv6$Which nursing action is an example of beneficence (acting to do good for the client) rather than nonmaleficence (avoiding harm)?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Asking a competent client to choose between two treatment options after teaching","Giving every client on the unit the same amount of nursing time each shift","Advocating for pain relief for a postoperative client with uncontrolled pain","Double-checking a high-alert medication dose to avoid giving a harmful overdose"],"clientNeedsCategory":"Management of Care","blueprintTopic":"ethical-principles"}$nclexmocv6$,
    $nclexmocv6$Advocating for pain relief for a postoperative client with uncontrolled pain$nclexmocv6$, $nclexmocv6$Beneficence is acting to benefit the client. Offering a choice reflects autonomy, equal time reflects justice, and double-checking a dose to avoid harm reflects nonmaleficence.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","ethical-principles","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provisions 1-3: compassion, primary commitment to the client, advocacy","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$cf4f83718af474dc233704da9bf1a3e5fe9508144c47a5c9e4f8c89c81920bc5$nclexmocv6$,
    false, false, true,
    2, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$ethical-principles$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":41,"subtopic":"Ethics and legal","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":41,"subtopic":"Ethics and legal"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q41 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cb2c778a5199bb82ff75d38d5$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$d80a030658d7f10df3f41f9097b61d3d$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q41';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c4515bbadefd5349f3cb97f50$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c4515bbadefd5349f3cb97f50';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$05a29fa436cbe93787231cf610282edaed64c5822222955b9ebbed18341bb4a8$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q42';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c4515bbadefd5349f3cb97f50$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$The RN is reviewing ways to protect client privacy on a busy medical unit.$nclexmocv6$, $nclexmocv6$Which actions are consistent with protecting client privacy? Select all that apply.$nclexmocv6$, $nclexmocv6${"kind":"select_all","options":["Discussing a client's care with another nurse in the break room with the door open","Asking visitors to step out, with the client's permission, before discussing test results","Logging out of the computer before leaving the workstation for any reason","Shredding paper reports that contain client names at the end of the shift","Printing a copy of the client's record to review at home later","Leaving the computer screen with the client's record open while stepping away briefly"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocv6$,
    $nclexmocv6$Asking visitors to step out, with the client's permission, before discussing test results|||Logging out of the computer before leaving the workstation for any reason|||Shredding paper reports that contain client names at the end of the shift$nclexmocv6$, $nclexmocv6$Limiting who can hear or see identifiable information and securing records protect privacy; public discussion and visible displays create exposure.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 3.1: protect privacy and confidentiality, including security practices","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"},{"src":"CFR-482-13","label":"42 CFR 482.13 Condition of participation: Patient rights (CMS/eCFR)","locator":"(c)(1): personal privacy","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.13"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$05a29fa436cbe93787231cf610282edaed64c5822222955b9ebbed18341bb4a8$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$legal-aspects$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$select_all$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":42,"subtopic":"Ethics and legal","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":42,"subtopic":"Ethics and legal"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q42 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c4515bbadefd5349f3cb97f50$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$17b11b764bf4ccb1802dbf7d250b56b5$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q42';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c560c084939d3c7510af09c50$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c560c084939d3c7510af09c50';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$972696e755cc988bfd85c0f8d21c1188a4dd0d3a8bbe7192eba2103af8beab6c$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q43';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c560c084939d3c7510af09c50$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A provider orders 10 times the usual dose of a high-alert medication for an adult client. The RN believes the order may be an error.$nclexmocv6$, $nclexmocv6$How should the RN respond to the order that appears to contain an error?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Clarify the order with the prescriber and use the chain of command if unresolved","Give the dose as ordered and document afterward that the RN questioned the dose","Reduce the dose to the usual amount and note the change in the medication record","Ask the pharmacist to give the medication because the pharmacy prepared the dose"],"clientNeedsCategory":"Management of Care","blueprintTopic":"legal-aspects"}$nclexmocv6$,
    $nclexmocv6$Clarify the order with the prescriber and use the chain of command if unresolved$nclexmocv6$, $nclexmocv6$The RN is accountable for what is given and must clarify questionable orders before giving them; unilateral changes are outside scope and passing responsibility does not remove accountability.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","legal-aspects","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Receive and verify orders; recognize limitations","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 4: accountability","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"},{"src":"ISMP-HIGHALERT","label":"ISMP List of High-Alert Medications in Acute Care Settings (ISMP)","locator":"High-alert medication list","url":"https://www.ismp.org/recommendations/high-alert-medications-acute-list"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$972696e755cc988bfd85c0f8d21c1188a4dd0d3a8bbe7192eba2103af8beab6c$nclexmocv6$,
    false, false, true,
    4, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$legal-aspects$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":43,"subtopic":"Ethics and legal","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":43,"subtopic":"Ethics and legal"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q43 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c560c084939d3c7510af09c50$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$6f118929bed0780d41ec331e3d8af18a$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q43';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$cecb78f127bf979b43ebb0602$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: cecb78f127bf979b43ebb0602';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$60b18292fd607b00c7f88de52c2d91ce6f4df01ceee5c1fd1c7539cbaa8d0f3c$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q44';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$cecb78f127bf979b43ebb0602$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$An RN is calling the provider about a 4-year-old with asthma who is still wheezing with a SpO2 of 90% after two albuterol treatments. The RN has stated the situation and the assessment.$nclexmocv6$, $nclexmocv6$Which statement should the RN add to complete the SBAR Recommendation?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["He has had asthma since age 2 and uses an inhaler at home most mornings.","I think he is tiring because his breathing is more labored than an hour ago.","He became short of breath at preschool this morning and has had a cough since last night.","Please see him within 15 minutes and tell me whether to start another treatment."],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocv6$,
    $nclexmocv6$Please see him within 15 minutes and tell me whether to start another treatment.$nclexmocv6$, $nclexmocv6$The Recommendation/Request states what is needed and when. The other statements are Background, Assessment or Situation details.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"AHRQ-SBAR","label":"TeamSTEPPS SBAR: Situation, Background, Assessment, Recommendation","locator":"TeamSTEPPS SBAR: Situation, Background, Assessment, Recommendation"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$60b18292fd607b00c7f88de52c2d91ce6f4df01ceee5c1fd1c7539cbaa8d0f3c$nclexmocv6$,
    false, false, true,
    2, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$continuity-case-management$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":44,"subtopic":"Handoff and continuity","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":44,"subtopic":"Handoff and continuity"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q44 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cecb78f127bf979b43ebb0602$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$6419fc9d343d2797c2b1f1e8b8624b07$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q44';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c1388cb5dd1c47e23f86692e5$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c1388cb5dd1c47e23f86692e5';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$562399c13cb3b0ab9d5584a3fd551c6d7bf85ca8cd67c7a9166e5e2cfcda260e$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q45';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c1388cb5dd1c47e23f86692e5$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$An RN is calling the provider about a client whose urine output has been 15 mL/hour for 3 hours.$nclexmocv6$, $nclexmocv6$Place the statements in the correct SBAR order.$nclexmocv6$, $nclexmocv6${"kind":"ordered_response","options":["\"Would you come evaluate him and consider a fluid bolus or labs?\"","\"He is 1 day after an abdominal surgery and has a history of kidney disease.\"","\"I'm calling about Mr. Lee, who has had 15 mL/hour of urine for 3 hours.\"","\"I think the client may be developing acute kidney injury or hypovolemia.\""],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocv6$,
    $nclexmocv6$"I'm calling about Mr. Lee, who has had 15 mL/hour of urine for 3 hours."|||"He is 1 day after an abdominal surgery and has a history of kidney disease."|||"I think the client may be developing acute kidney injury or hypovolemia."|||"Would you come evaluate him and consider a fluid bolus or labs?"$nclexmocv6$, $nclexmocv6$SBAR order: Situation, Background, Assessment, Recommendation.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"AHRQ-SBAR","label":"TeamSTEPPS SBAR","locator":"TeamSTEPPS SBAR"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$562399c13cb3b0ab9d5584a3fd551c6d7bf85ca8cd67c7a9166e5e2cfcda260e$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$continuity-case-management$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$ordered_response$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":45,"subtopic":"Handoff and continuity","itemType":"ord","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":45,"subtopic":"Handoff and continuity"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q45 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c1388cb5dd1c47e23f86692e5$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$201c0f82088c52b8d45fb088046320a5$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q45';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$cb41ebcd2c34e9c3cc8e66b2c$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: cb41ebcd2c34e9c3cc8e66b2c';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$431b8712bd0f6a9357ba2f31fd3c1856672f466e4ae0cfb825ed67ed8220e106$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q46';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$cb41ebcd2c34e9c3cc8e66b2c$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$At change of shift, the outgoing RN is giving report on a client with a new chest tube using the I-PASS format.$nclexmocv6$, $nclexmocv6$Which information should the outgoing RN include to meet the Illness severity and Situation awareness components?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["The client is admitted for a pneumothorax and has a history of smoking and hypertension","The client is stable but could worsen; call the provider if drainage increases or breathing worsens","The client is allergic to penicillin and uses a walker with standby help for transfers and toileting","The client's chest tube was inserted yesterday and the dressing was last changed at 0700 today"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocv6$,
    $nclexmocv6$The client is stable but could worsen; call the provider if drainage increases or breathing worsens$nclexmocv6$, $nclexmocv6$Illness severity tells the receiver how stable the client is (for example stable, watcher or unstable), and situation awareness and contingency planning give if/then actions. The other statements are patient summary details.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"AHRQ-IPASS","label":"I-PASS: Illness severity, Patient summary, Action list, Situation awareness and contingency, Synthesis by receiver","locator":"I-PASS: Illness severity, Patient summary, Action list, Situation awareness and contingency, Synthesis by receiver"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$431b8712bd0f6a9357ba2f31fd3c1856672f466e4ae0cfb825ed67ed8220e106$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$continuity-case-management$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":46,"subtopic":"Handoff and continuity","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":46,"subtopic":"Handoff and continuity"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q46 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cb41ebcd2c34e9c3cc8e66b2c$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$a56ea83357daa86521b818387d33cfa2$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q46';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$cd43a0cc1cd6439f5a91b942b$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: cd43a0cc1cd6439f5a91b942b';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$4f7a2ec059d9586632fc6e6d5555aa35b37bd0d55d684663d8393fe9389e63e4$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q47';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$cd43a0cc1cd6439f5a91b942b$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A nurse manager is teaching staff about safe handoffs.$nclexmocv6$, $nclexmocv6$Which elements support a safe handoff? Select all that apply.$nclexmocv6$, $nclexmocv6${"kind":"select_all","options":["A report that lists pending results only if the provider asks about them","A chance for the receiver to ask questions and to restate the key actions","A report at the bedside with visitors present, without asking the client","A summary limited to the diagnosis, room number and code status","A contingency plan for what to do if the client worsens","A to-do list that states who is responsible and the timeline"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocv6$,
    $nclexmocv6$A chance for the receiver to ask questions and to restate the key actions|||A contingency plan for what to do if the client worsens|||A to-do list that states who is responsible and the timeline$nclexmocv6$, $nclexmocv6$Structured handoffs include synthesis by the receiver, an action list with ownership and timelines, and contingency planning. Omitting pending items or rushing leads to omissions.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"AHRQ-IPASS","label":"I-PASS elements","locator":"I-PASS elements"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Provide and receive handoff of care (report)","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$4f7a2ec059d9586632fc6e6d5555aa35b37bd0d55d684663d8393fe9389e63e4$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$continuity-case-management$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$select_all$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":47,"subtopic":"Handoff and continuity","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":47,"subtopic":"Handoff and continuity"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q47 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cd43a0cc1cd6439f5a91b942b$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$c1743a41a6c187a02e002426ceb68449$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q47';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$ca51cdf35a21f30091244c6fb$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: ca51cdf35a21f30091244c6fb';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$a8258b5fd36e02b4263e3c05d484dd4b3db6696e3a37276d85e6839e4d8258fc$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q48';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$ca51cdf35a21f30091244c6fb$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$An RN is transferring a client to a skilled nursing facility for rehabilitation after a hospital stay.$nclexmocv6$, $nclexmocv6$Which action best supports continuity of care?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Give the family the hospital's number so the facility can request records after the transfer","Send a written summary with the family and ask the facility nurse to call for a report","Give a verbal report to the receiving nurse and send a written summary with pending tests","Send the medication list and last progress note, and tell the facility to call for the rest"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocv6$,
    $nclexmocv6$Give a verbal report to the receiving nurse and send a written summary with pending tests$nclexmocv6$, $nclexmocv6$Hospitals must send necessary medical information, including current treatment, goals and preferences, to the post-acute provider at transfer, and a verbal report supports safe transition.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"CFR-482-43","label":"42 CFR 482.43 Condition of participation: Discharge planning (CMS/eCFR)","locator":"(b): transmit necessary medical information to the post-acute provider at discharge or transfer","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.43"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Provide and receive handoff of care; admission, transfer, discharge","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$a8258b5fd36e02b4263e3c05d484dd4b3db6696e3a37276d85e6839e4d8258fc$nclexmocv6$,
    false, false, true,
    4, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$continuity-case-management$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":48,"subtopic":"Handoff and continuity","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":48,"subtopic":"Handoff and continuity"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q48 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$ca51cdf35a21f30091244c6fb$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$109a9540161d417891d1cd2ece55969c$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q48';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$cbffa08bca993a371dc599498$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: cbffa08bca993a371dc599498';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$81f02abbc6cb314ec75ee49351ca3c3ff1c2ac3a240a49a7ca5c9eaa86485453$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q49';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$cbffa08bca993a371dc599498$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$At 0630, a client's potassium result is 3.1 mEq/L. The RN notified the provider at 0645, and no orders have been received. It is almost the end of the shift.$nclexmocv6$, $nclexmocv6$Which action should the outgoing RN take?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Follow up with the provider about the unresolved result and add it to the handoff","Tell the oncoming RN the potassium is a little low and leave the follow-up to the next shift","Wait for the provider to respond and leave a note on the client's chart","Document the result as reported and tell the oncoming RN there are no pending issues"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocv6$,
    $nclexmocv6$Follow up with the provider about the unresolved result and add it to the handoff$nclexmocv6$, $nclexmocv6$Unresolved abnormal results must be followed up and communicated explicitly with ownership at handoff so they are not lost.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"AHRQ-IPASS","label":"Action list: to-do items with timelines and ownership","locator":"Action list: to-do items with timelines and ownership"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Follow up on unresolved client care issues","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$81f02abbc6cb314ec75ee49351ca3c3ff1c2ac3a240a49a7ca5c9eaa86485453$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$continuity-case-management$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":49,"subtopic":"Handoff and continuity","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":49,"subtopic":"Handoff and continuity"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q49 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cbffa08bca993a371dc599498$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$6daf63fdf52d537c6e354e2b7ab93392$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q49';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$cd2051b57c974bcd1b3a5eeb5$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: cd2051b57c974bcd1b3a5eeb5';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$5a9a14afb46022558e743c13c0c638a3792f3637c98b3d3b3c7f43e317807a23$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q50';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$cd2051b57c974bcd1b3a5eeb5$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A client who is 3 days after a total hip replacement has difficulty standing and walking since surgery. Equipment and the discharge destination are already arranged, and the client needs help before discharge.$nclexmocv6$, $nclexmocv6$Which referral should the RN request an order for?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Case management for discharge destination and equipment coverage after discharge","Wound care nurse for incision care and the dressing change schedule after going home","Respiratory therapy for incentive spirometry teaching and deep breathing exercises","Physical therapy for strengthening, balance work and stair and transfer practice"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocv6$,
    $nclexmocv6$Physical therapy for strengthening, balance work and stair and transfer practice$nclexmocv6$, $nclexmocv6$Physical therapy addresses strength, balance and mobility (transfers, stairs) after joint replacement. Equipment and destination are already arranged, so case management is not needed; the other services are not indicated by the findings.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Assess the need for referrals and obtain necessary orders","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$5a9a14afb46022558e743c13c0c638a3792f3637c98b3d3b3c7f43e317807a23$nclexmocv6$,
    false, false, true,
    2, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$continuity-case-management$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":50,"subtopic":"Case management and referrals","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":50,"subtopic":"Case management and referrals"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q50 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cd2051b57c974bcd1b3a5eeb5$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$7c415d96c26fd576becc8d8f4e58f91c$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q50';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$cd51ffe710213cb4297548604$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: cd51ffe710213cb4297548604';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$77b13e844963748753ac370d943cb901f6fb3f47056d1e0b800a2599a3e2d27d$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q51';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$cd51ffe710213cb4297548604$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A client with a stroke has coughing during meals and a wet vocal quality after swallowing. The client has been eating less for 2 days.$nclexmocv6$, $nclexmocv6$What should the RN do first when the client coughs during meals?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Request an order for a dietitian to start calorie counts and offer extra snacks","Hold oral intake and request a swallow evaluation by speech-language pathology","Ask occupational therapy to provide adaptive utensils for the next meal service","Encourage the client to take smaller bites and continue eating meals as usual"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocv6$,
    $nclexmocv6$Hold oral intake and request a swallow evaluation by speech-language pathology$nclexmocv6$, $nclexmocv6$Signs of dysphagia call for holding oral intake and a swallow evaluation to prevent aspiration; nutrition and adaptive devices follow the evaluation.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Assess the need for referrals and obtain necessary orders","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$77b13e844963748753ac370d943cb901f6fb3f47056d1e0b800a2599a3e2d27d$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$continuity-case-management$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":51,"subtopic":"Case management and referrals","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":51,"subtopic":"Case management and referrals"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q51 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cd51ffe710213cb4297548604$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$d7a47e17bc587fbfb207d8b2545d1ba6$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q51';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$cd8537a20bb0b1582b0517cd7$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: cd8537a20bb0b1582b0517cd7';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$de77c5c297658600dea36d7fad5e3b02f2fc49cef06dbd2bb4dab57b5538838f$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q52';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$cd8537a20bb0b1582b0517cd7$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A client who lives alone has macular degeneration with severe vision loss and cannot read syringe markings even with a magnifier. The client is being discharged on new insulin therapy, and the provider has prescribed a prefilled insulin pen. The client says, "I can't read the numbers on the syringe."$nclexmocv6$, $nclexmocv6$How should the RN address the client's difficulty reading the syringe?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Give written instructions in large print and ask the client to practice at home each day","Ask the client to have a neighbor read the syringe markings aloud each day at home","Request home health and teach dosing with the prescribed pen and return demonstration","Teach the dose using a magnifier on a standard syringe and discharge as planned"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocv6$,
    $nclexmocv6$Request home health and teach dosing with the prescribed pen and return demonstration$nclexmocv6$, $nclexmocv6$A client who cannot read dose markings even with a magnifier needs another way to measure the dose. With the provider's order for a prefilled pen (which gives audible or tactile dose feedback), the RN teaches dosing with the pen, has the client return-demonstrate, and requests a home health referral for follow-up. Large print, a neighbor or a magnifier on a syringe do not remove the barrier.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"CFR-482-43","label":"42 CFR 482.43 Condition of participation: Discharge planning (CMS/eCFR)","locator":"(a): identify patients likely to suffer adverse consequences without adequate discharge planning","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.43"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Assess the need for referrals and obtain necessary orders","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$de77c5c297658600dea36d7fad5e3b02f2fc49cef06dbd2bb4dab57b5538838f$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$continuity-case-management$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":52,"subtopic":"Case management and referrals","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":52,"subtopic":"Case management and referrals"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q52 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cd8537a20bb0b1582b0517cd7$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$e8c5b2bc80ccec77c3e4d581f4672a98$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q52';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c771be3182abea75c31bbbb48$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c771be3182abea75c31bbbb48';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$b284a25b75759ef641d2d80f2c44c89de3a5fff3c1be6a2622f7e8a5bb5a2a94$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q53';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c771be3182abea75c31bbbb48$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A hospital case manager and the RN are identifying clients who need early discharge planning.$nclexmocv6$, $nclexmocv6$Which clients are at high risk for adverse outcomes after discharge? Select all that apply.$nclexmocv6$, $nclexmocv6${"kind":"select_all","options":["A client who takes eight medications and has no caregiver to help with them","A client with a short stay for a minor skin infection who has a supportive spouse","A client admitted for a scheduled cataract procedure who is going home the same day","A client who lives alone, has limited mobility and is going home on new oxygen","A client who has been admitted three times in the past 90 days for heart failure","A client who is independent and is recovering from an uncomplicated appendectomy"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocv6$,
    $nclexmocv6$A client who takes eight medications and has no caregiver to help with them|||A client who lives alone, has limited mobility and is going home on new oxygen|||A client who has been admitted three times in the past 90 days for heart failure$nclexmocv6$, $nclexmocv6$Living alone with new equipment, frequent readmissions and complex regimens without support are risk factors that call for early discharge planning.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"CFR-482-43","label":"42 CFR 482.43 Condition of participation: Discharge planning (CMS/eCFR)","locator":"(a): identify at an early stage patients likely to suffer adverse consequences without adequate discharge planning","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.43"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$b284a25b75759ef641d2d80f2c44c89de3a5fff3c1be6a2622f7e8a5bb5a2a94$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$continuity-case-management$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$select_all$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":53,"subtopic":"Case management and referrals","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":53,"subtopic":"Case management and referrals"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q53 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c771be3182abea75c31bbbb48$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$7fd357ced68031b15072329e0025d0b9$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q53';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$cf844cf91bac7d60384079071$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: cf844cf91bac7d60384079071';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$6a96771b8213655cda8626215d5bdcfef8de4958cfb337a898c00390c1ef9bf1$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q54';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$cf844cf91bac7d60384079071$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A client with end-stage heart failure has been admitted three times in 2 months and states, "I just want to be comfortable and at home."$nclexmocv6$, $nclexmocv6$Which action by the RN best supports the client's goals?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Ask the provider about a palliative care consultation and document the client's goals","Tell the client that going home is not possible until the heart failure improves","Ask the provider to start a new heart failure medication and defer the goals discussion until it takes effect","Refer the client to cardiac rehabilitation before discussing the client's care wishes"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocv6$,
    $nclexmocv6$Ask the provider about a palliative care consultation and document the client's goals$nclexmocv6$, $nclexmocv6$Palliative care aligns treatment with the client's stated goals and needs a provider order. The RN advocates and documents the goals rather than deferring.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Assess the need for referrals and obtain necessary orders; advocate for client rights and needs","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"ANA-CODE-2025","label":"Code of Ethics for Nurses with Interpretive Statements (ANA)","locator":"Provision 1.4","url":"https://www.nursingworld.org/practice-policy/nursing-excellence/ethics/code-of-ethics-for-nurses/"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$6a96771b8213655cda8626215d5bdcfef8de4958cfb337a898c00390c1ef9bf1$nclexmocv6$,
    false, false, true,
    4, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$continuity-case-management$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":54,"subtopic":"Case management and referrals","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":54,"subtopic":"Case management and referrals"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q54 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cf844cf91bac7d60384079071$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$9ef5060e5e5e3a6af61dc4b946da9bd2$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q54';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c541fe4d1afc0890f2e466f33$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c541fe4d1afc0890f2e466f33';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$d44523514317960ad895df6871c6cc51ce47485ac8c87324499b4165264a5753$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q55';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c541fe4d1afc0890f2e466f33$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A client with heart failure who lives alone is being discharged home to self-care with a new diuretic and a daily weight plan.$nclexmocv6$, $nclexmocv6$Which action best supports the transition from hospital to home?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Tell the client to call the clinic for an appointment after getting settled at home","Give the discharge instructions in a packet and ask the client to read them at home","Review the medication list with the client and say to call with any questions","Schedule the follow-up visit before discharge and give a list of whom to call"],"clientNeedsCategory":"Management of Care","blueprintTopic":"continuity-case-management"}$nclexmocv6$,
    $nclexmocv6$Schedule the follow-up visit before discharge and give a list of whom to call$nclexmocv6$, $nclexmocv6$Safe transitions include arranging follow-up before the client leaves and giving clear written instructions on whom to contact. Leaving appointments and questions to the client after discharge creates gaps.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","continuity-case-management","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"CFR-482-43","label":"42 CFR 482.43 Condition of participation: Discharge planning (CMS/eCFR)","locator":"Intro and (b): effective transition to post-discharge care; necessary information to the outpatient practitioners responsible for follow-up","url":"https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.43"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: admission, transfer, discharge","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$d44523514317960ad895df6871c6cc51ce47485ac8c87324499b4165264a5753$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$continuity-case-management$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":55,"subtopic":"Case management and referrals","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":55,"subtopic":"Case management and referrals"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q55 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c541fe4d1afc0890f2e466f33$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$9d4635301fd77645b41c5613322956aa$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q55';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c970869c6399c66f8d554b3f5$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c970869c6399c66f8d554b3f5';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$7a7b9eb2bbc3c3546d8f082aa6b62057b8672b507a436389e90a79884650151a$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q56';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c970869c6399c66f8d554b3f5$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$The RN receives report on four clients at the beginning of the shift.$nclexmocv6$, $nclexmocv6$Which client should the RN assess first?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["A client with pneumonia who has a temperature of 100.4 F (38 C) and a productive cough","A client 2 days after colectomy with new confusion and a SpO2 of 88% on room air","A client 1 day after a knee replacement who has pain of 7/10 and requests medication","A client with chronic kidney disease who has a potassium of 5.2 mEq/L and no ECG changes"],"clientNeedsCategory":"Management of Care","blueprintTopic":"prioritization"}$nclexmocv6$,
    $nclexmocv6$A client 2 days after colectomy with new confusion and a SpO2 of 88% on room air$nclexmocv6$, $nclexmocv6$New confusion with hypoxia suggests a threat to airway, breathing or perfusion and takes priority over pain, mild fever and a stable, mildly elevated potassium.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","prioritization","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"OPENRN-PRIOR","label":"Open RN Nursing Management and Professional Concepts - Prioritization (Open RN/NCBI Bookshelf)","locator":"Open RN prioritization: ABCs, acute vs chronic, unexpected vs expected","url":"https://www.ncbi.nlm.nih.gov/books/NBK610461/"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Prioritize the delivery of client care based on acuity","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$7a7b9eb2bbc3c3546d8f082aa6b62057b8672b507a436389e90a79884650151a$nclexmocv6$,
    false, false, true,
    4, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$prioritization$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":56,"subtopic":"Prioritization and performance improvement","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":56,"subtopic":"Prioritization and performance improvement"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q56 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c970869c6399c66f8d554b3f5$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$9cc64972f40bc06837cf0c2c754e06b9$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q56';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$cdee11f8f80ffaddee2848958$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: cdee11f8f80ffaddee2848958';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$0a00e2633c9c7d80f74fb6926fd1b5d720311837dc6dcf44424bf928be273418$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q57';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$cdee11f8f80ffaddee2848958$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$The RN is assigned four clients at the start of the shift.$nclexmocv6$, $nclexmocv6$Place the clients in the order in which the RN should assess them, from first to last.$nclexmocv6$, $nclexmocv6${"kind":"ordered_response","options":["A client with new atrial fibrillation, a heart rate of 132/min and a BP of 98/60 mm Hg","A client who is ready for discharge teaching and waiting for transport this afternoon","A client with COPD with a SpO2 of 82% on 2 L/min, using accessory muscles and agitated","A client with cellulitis of the leg who has a temperature of 100.2 F and asks for a dressing change"],"clientNeedsCategory":"Management of Care","blueprintTopic":"prioritization"}$nclexmocv6$,
    $nclexmocv6$A client with COPD with a SpO2 of 82% on 2 L/min, using accessory muscles and agitated|||A client with new atrial fibrillation, a heart rate of 132/min and a BP of 98/60 mm Hg|||A client with cellulitis of the leg who has a temperature of 100.2 F and asks for a dressing change|||A client who is ready for discharge teaching and waiting for transport this afternoon$nclexmocv6$, $nclexmocv6$Airway and breathing first (hypoxia with distress), then unstable circulation, then pain, then a stable discharge task.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","prioritization","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"OPENRN-PRIOR","label":"Open RN Nursing Management and Professional Concepts - Prioritization (Open RN/NCBI Bookshelf)","locator":"Prioritization frameworks","url":"https://www.ncbi.nlm.nih.gov/books/NBK610461/"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Prioritize the delivery of client care based on acuity","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$0a00e2633c9c7d80f74fb6926fd1b5d720311837dc6dcf44424bf928be273418$nclexmocv6$,
    false, false, true,
    4, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$prioritization$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$ordered_response$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":57,"subtopic":"Prioritization and performance improvement","itemType":"ord","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":57,"subtopic":"Prioritization and performance improvement"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q57 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cdee11f8f80ffaddee2848958$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$3875c42411ba205c451eca079f2042b0$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q57';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c840270eb5d38316dbe901b7e$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c840270eb5d38316dbe901b7e';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$272f2b5689c1def7588eb6968de034acc829d32e6ac52e306a8404c66dee446b$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q58';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c840270eb5d38316dbe901b7e$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$The RN is making rounds at the start of the shift on a medical-surgical unit.$nclexmocv6$, $nclexmocv6$Which findings require immediate RN follow-up? Select all that apply.$nclexmocv6$, $nclexmocv6${"kind":"select_all","options":["A client 6 hours after surgery whose BP is 84/50 mm Hg and heart rate is 124/min","A client receiving morphine who is difficult to arouse and has a respiratory rate of 8/min","A client with COPD whose SpO2 is 90% on 2 L/min, the client's baseline, and who is comfortable","A client with diabetes who has a new facial droop and slurred speech that began 30 minutes ago","A client 2 days after surgery with a temperature of 99.5 F and an unchanged incision","A client with a urinary catheter whose urine output is 40 mL/hour and who is resting"],"clientNeedsCategory":"Management of Care","blueprintTopic":"prioritization"}$nclexmocv6$,
    $nclexmocv6$A client 6 hours after surgery whose BP is 84/50 mm Hg and heart rate is 124/min|||A client receiving morphine who is difficult to arouse and has a respiratory rate of 8/min|||A client with diabetes who has a new facial droop and slurred speech that began 30 minutes ago$nclexmocv6$, $nclexmocv6$New neurologic deficit, hypotension with tachycardia after surgery and opioid-related respiratory depression are time-critical findings.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","prioritization","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"OPENRN-PRIOR","label":"Open RN Nursing Management and Professional Concepts - Prioritization (Open RN/NCBI Bookshelf)","locator":"Prioritization","url":"https://www.ncbi.nlm.nih.gov/books/NBK610461/"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Prioritize the delivery of client care based on acuity","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$272f2b5689c1def7588eb6968de034acc829d32e6ac52e306a8404c66dee446b$nclexmocv6$,
    false, false, true,
    4, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$prioritization$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$select_all$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":58,"subtopic":"Prioritization and performance improvement","itemType":"sata","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":58,"subtopic":"Prioritization and performance improvement"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q58 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c840270eb5d38316dbe901b7e$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$06fe962854a294701b62cc48827c9df9$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q58';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$cab0faeb8590247422a27c126$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: cab0faeb8590247422a27c126';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$cddca775b22284af712b1a0cfdbb46abe39712f533e62b3244dc5085d6360ae0$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q59';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$cab0faeb8590247422a27c126$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$Three catheter-associated urinary tract infections occurred on the unit within 2 months. The RN joins the quality improvement team.$nclexmocv6$, $nclexmocv6$Which action best fits a performance improvement process?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Review each infected client's chart and retrain the nurses who inserted the catheters","Start a new catheter care checklist on the unit and use it without measuring the results","Collect data on catheter days and insertion practices to find contributing factors","Set a goal of zero infections and review the unit's progress at the end of the year"],"clientNeedsCategory":"Management of Care","blueprintTopic":"quality-improvement"}$nclexmocv6$,
    $nclexmocv6$Collect data on catheter days and insertion practices to find contributing factors$nclexmocv6$, $nclexmocv6$Quality improvement begins with measuring the problem and understanding contributing factors before selecting a change; punitive or reflexive responses do not address system causes.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","quality-improvement","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Participate in performance improvement projects and quality improvement processes","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"},{"src":"AHRQ-PSNET","label":"PSNet: investigating patient safety events with a system focus","locator":"PSNet: investigating patient safety events with a system focus"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$cddca775b22284af712b1a0cfdbb46abe39712f533e62b3244dc5085d6360ae0$nclexmocv6$,
    false, false, true,
    3, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$quality-improvement$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":59,"subtopic":"Prioritization and performance improvement","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":59,"subtopic":"Prioritization and performance improvement"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q59 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$cab0faeb8590247422a27c126$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$bfb0f2189803ef2efec173560a47d5b3$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q59';
  END IF;
END
$do$;
DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = $nclexmocv6$c0484e351a36e112c7f55bd17$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot id already exists: c0484e351a36e112c7f55bd17';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = $nclexmocv6$38f8b57b9fbc36559cddf93952106a1e4466d558414e6bebe0435b08c7ed5f4c$nclexmocv6$) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q60';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    $nclexmocv6$c0484e351a36e112c7f55bd17$nclexmocv6$, $nclexmocv6$nursing$nclexmocv6$, $nclexmocv6$management-of-care$nclexmocv6$,
    $nclexmocv6$A root cause analysis of a near-miss medication event finds that two vials with similar labels were stored next to each other.$nclexmocv6$, $nclexmocv6$Which proposal best reflects a quality improvement approach?$nclexmocv6$, $nclexmocv6${"kind":"mcq","options":["Separate the look-alike vials, relabel them and monitor whether near misses decrease","Remind all nurses to read each label carefully at the next staff meeting","Require a second-nurse check on every vial and review the event only if harm results","Report the near miss to the unit manager only and handle it in the nurse's review"],"clientNeedsCategory":"Management of Care","blueprintTopic":"quality-improvement"}$nclexmocv6$,
    $nclexmocv6$Separate the look-alike vials, relabel them and monitor whether near misses decrease$nclexmocv6$, $nclexmocv6$Strong improvements change the system (storage, labeling) and measure results; reminders and discipline are weak or punitive and discourage reporting.$nclexmocv6$,
    $nclexmocv6$["nclex-moc-pilot-v6","management-of-care","quality-improvement","held-for-rn-review"]$nclexmocv6$, $nclexmocv6$[{"src":"AHRQ-PSNET","label":"PSNet: system-focused response to safety events, near misses","locator":"PSNet: system-focused response to safety events, near misses"},{"src":"NCSBN-TP-2026","label":"2026 NCLEX-RN Test Plan (NCSBN)","locator":"MoC: Participate in performance improvement projects and quality improvement processes","url":"https://ncsbn.org/public-files/2026_RN_Test%20Plan_English-F.pdf"}]$nclexmocv6$::jsonb,
    $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$38f8b57b9fbc36559cddf93952106a1e4466d558414e6bebe0435b08c7ed5f4c$nclexmocv6$,
    false, false, true,
    4, $nclexmocv6$Management of Care$nclexmocv6$, $nclexmocv6$nclex-safe-care$nclexmocv6$,
    $nclexmocv6$quality-improvement$nclexmocv6$, $nclexmocv6$Management of Care$nclexmocv6$,
    $nclexmocv6$vignette$nclexmocv6$, $nclexmocv6$nclex-moc-pilot-v6$nclexmocv6$, $nclexmocv6$pending$nclexmocv6$,
    $nclexmocv6${"batchId":"nclex-moc-pilot-v6-20261030","pipelineVersion":"nclex-moc-pilot-v6","sourceItem":60,"subtopic":"Prioritization and performance improvement","itemType":"mc","heldForRnReview":true,"manualCorrection":true}$nclexmocv6$::jsonb, $nclexmocv6${"metadataBy":"nclex-moc-pilot-v6","heldForRnReview":true,"sourceItem":60,"subtopic":"Prioritization and performance improvement"}$nclexmocv6$::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q60 expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = $nclexmocv6$c0484e351a36e112c7f55bd17$nclexmocv6$)
       IS DISTINCT FROM $nclexmocv6$dc492edb9af6a0050b1787b496829b93$nclexmocv6$ THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q60';
  END IF;
END
$do$;
CREATE TABLE qbi_nclex_moc_v6_insert_20261030 AS
SELECT * FROM "QuestionBankItem"
WHERE id IN ($nclexmocv6$cc32ad23631fdf5e61b7c7532$nclexmocv6$, $nclexmocv6$c07375bc6c73c8a35a86d34a4$nclexmocv6$, $nclexmocv6$cce68108de2a85d091037ef02$nclexmocv6$, $nclexmocv6$c33e391a46b05f148bcee19ce$nclexmocv6$, $nclexmocv6$c56c89825597afcebe6c3d07d$nclexmocv6$, $nclexmocv6$c0e71d73dae1ebf4b29f96dd8$nclexmocv6$, $nclexmocv6$cda49979c786ee698480a2c50$nclexmocv6$, $nclexmocv6$cb5613a4a0ff6390172746769$nclexmocv6$, $nclexmocv6$c3b42b4e57ed73c4e483ca8bf$nclexmocv6$, $nclexmocv6$cd84ec2e33b301266b2fdb81e$nclexmocv6$, $nclexmocv6$ca21e93236bf8bb5e03c81805$nclexmocv6$, $nclexmocv6$c1c028fd663df54d67c162c00$nclexmocv6$, $nclexmocv6$cb2c6bfdbcd95ff94d6fd9fb3$nclexmocv6$, $nclexmocv6$c74d58795d8a23a732a7c086b$nclexmocv6$, $nclexmocv6$c555870efe25d91e5847623a3$nclexmocv6$, $nclexmocv6$c7edf5a2505d52c5aa881e359$nclexmocv6$, $nclexmocv6$c84953a9b935465c840121903$nclexmocv6$, $nclexmocv6$cf38870462969b0caf8df52d9$nclexmocv6$, $nclexmocv6$c838aad32a852e85466dc34ad$nclexmocv6$, $nclexmocv6$c6ae4672605defeb29fc44589$nclexmocv6$, $nclexmocv6$c865c51fbb07fe12c643e0627$nclexmocv6$, $nclexmocv6$cfe3ad49941a9576b112c13d5$nclexmocv6$, $nclexmocv6$c407b78b5015c0f9095f00485$nclexmocv6$, $nclexmocv6$ce03ea29bc1e64249e4c9848a$nclexmocv6$, $nclexmocv6$c62e77ea0c937450ea460baee$nclexmocv6$, $nclexmocv6$c4d7ef9c9ac7188980f4b1557$nclexmocv6$, $nclexmocv6$c255a88eacd6d2b708c3782b7$nclexmocv6$, $nclexmocv6$c1e21bdb6035c9cfc38017f04$nclexmocv6$, $nclexmocv6$c4552c4fa2434cdfd60827754$nclexmocv6$, $nclexmocv6$cc02c17378aaeb4ec2e202b5f$nclexmocv6$, $nclexmocv6$cceccd2112bb739d0845e5a46$nclexmocv6$, $nclexmocv6$c29629af0189008b5c0d02b05$nclexmocv6$, $nclexmocv6$c3c1745f1388b1e92f829a752$nclexmocv6$, $nclexmocv6$c26a0ff7b922ace428fcdd745$nclexmocv6$, $nclexmocv6$c90bbcbfac0b05bf410b27e35$nclexmocv6$, $nclexmocv6$c7a08fdc5e8789a3897fbc660$nclexmocv6$, $nclexmocv6$c2041435416b32d85a96272e5$nclexmocv6$, $nclexmocv6$cbad23a4c617f03ef9f1b684d$nclexmocv6$, $nclexmocv6$c20d2179ba4b29f9570cdd364$nclexmocv6$, $nclexmocv6$c5e6badbe7f0c33e317542d81$nclexmocv6$, $nclexmocv6$cb2c778a5199bb82ff75d38d5$nclexmocv6$, $nclexmocv6$c4515bbadefd5349f3cb97f50$nclexmocv6$, $nclexmocv6$c560c084939d3c7510af09c50$nclexmocv6$, $nclexmocv6$cecb78f127bf979b43ebb0602$nclexmocv6$, $nclexmocv6$c1388cb5dd1c47e23f86692e5$nclexmocv6$, $nclexmocv6$cb41ebcd2c34e9c3cc8e66b2c$nclexmocv6$, $nclexmocv6$cd43a0cc1cd6439f5a91b942b$nclexmocv6$, $nclexmocv6$ca51cdf35a21f30091244c6fb$nclexmocv6$, $nclexmocv6$cbffa08bca993a371dc599498$nclexmocv6$, $nclexmocv6$cd2051b57c974bcd1b3a5eeb5$nclexmocv6$, $nclexmocv6$cd51ffe710213cb4297548604$nclexmocv6$, $nclexmocv6$cd8537a20bb0b1582b0517cd7$nclexmocv6$, $nclexmocv6$c771be3182abea75c31bbbb48$nclexmocv6$, $nclexmocv6$cf844cf91bac7d60384079071$nclexmocv6$, $nclexmocv6$c541fe4d1afc0890f2e466f33$nclexmocv6$, $nclexmocv6$c970869c6399c66f8d554b3f5$nclexmocv6$, $nclexmocv6$cdee11f8f80ffaddee2848958$nclexmocv6$, $nclexmocv6$c840270eb5d38316dbe901b7e$nclexmocv6$, $nclexmocv6$cab0faeb8590247422a27c126$nclexmocv6$, $nclexmocv6$c0484e351a36e112c7f55bd17$nclexmocv6$);
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_moc_v6_insert_20261030)::integer INTO n;
  IF n IS DISTINCT FROM 60 THEN
    RAISE EXCEPTION 'insert backup: expected 60, found %', n;
  END IF;
END
$check$;

DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_moc_v6_insert_20261030
WHERE active = false AND "qaPassed" = false AND "fieldId" = 'nursing'
  AND "subjectId" = 'management-of-care' AND manual_correction = true)::integer INTO n;
  IF n IS DISTINCT FROM 60 THEN
    RAISE EXCEPTION 'insert backup held flags: expected 60, found %', n;
  END IF;
END
$check$;

DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM "QuestionBankItem"
WHERE "contentHash" IN ($nclexmocv6$09d615c084756423f9efb377962214edf3dc4a3b7c4347a0138255ad654d6053$nclexmocv6$, $nclexmocv6$9919ae6abef76b015f6106695dd6d00f7bf9f2d4e28a66360af302bf0ccc1840$nclexmocv6$, $nclexmocv6$97a40ad9093153544527608442eaa8009379bd1b55135a691d14b25db9d4b62a$nclexmocv6$, $nclexmocv6$82611bd031046cca8697f433998eaf44ccdba871e6536c96d65d9163236b6342$nclexmocv6$, $nclexmocv6$8eeea199b8bb366e38f6d02289c2333c10c19f54dcad81821b7eb970fdd1bd97$nclexmocv6$, $nclexmocv6$14eef8e1222231d46b230b108b5557f411a7cecbe21aeeecd810db8db8857559$nclexmocv6$, $nclexmocv6$fed832de28bdb382d896e4f1bc3513fade9f976075ff9c08183ef61737a11e5d$nclexmocv6$, $nclexmocv6$ecc34da121344fd6332e572d038368b69c1e566bb943573de69370f23a7f5d9a$nclexmocv6$, $nclexmocv6$938b29c117dc02df217da2c64c8acf4d4c28f414e69c303807fb2d65c72865a1$nclexmocv6$, $nclexmocv6$cac380659337013da81abd37d6eb1de2bf399494a0906dc93ad1b7e29846fd7b$nclexmocv6$, $nclexmocv6$32e1b470574a3c03215f5dfc818def7bbb6a2635f43911fd250d757ef41fe546$nclexmocv6$, $nclexmocv6$7fb8411d05b0ba1026c1ebcc33cb08bd86ab0810564cb441f4dca00bd41ffa8a$nclexmocv6$, $nclexmocv6$0fba9c74ba49d541943033c01364fff5c7b00ca150ba06266ddedf6dcbc5a23e$nclexmocv6$, $nclexmocv6$1b126a7a62b071e2605c7966bd97017888807b3f9fbb948e4c69d0e0a8a59446$nclexmocv6$, $nclexmocv6$90aaa08b41cadc5ef22f03889807f040061a4a54860cef6c53331cffebad0321$nclexmocv6$, $nclexmocv6$062d807641e9d3b2c147b7ddc159317f2e3fa572db55cdca948ff149053c2cd7$nclexmocv6$, $nclexmocv6$2242428c62be2f12696fca544f84e1825769ab2e5d015d0f6a808e5483198ecc$nclexmocv6$, $nclexmocv6$23f7a3da8cb1c07fc6a52a7ba7a733608a0e5d9b758ebb35e9feda61bbb6371c$nclexmocv6$, $nclexmocv6$9bae2ed8e888fbd76251c1278761680851782c94749aa3032ace871a4c24f484$nclexmocv6$, $nclexmocv6$9e3c431145e99f9d6d14f92cfcf141e5a836bf9d7659b5194cd31c275bff3e6c$nclexmocv6$, $nclexmocv6$69c500db2a7d511bf58ef0d02dbdb94669dd75bab83aa2d3149c6f3a46e52339$nclexmocv6$, $nclexmocv6$b8006a4634deb3b4db41dfedf3b621f59de405d78382a4c2e459ee6ea8365d73$nclexmocv6$, $nclexmocv6$1e7a3ffae16df986a43ffd7ac773ef9a750d595656708252841ff08c63faf568$nclexmocv6$, $nclexmocv6$174f310a22f79e0f78c7f940d0b32727de3d0066066b11ccedbf00d910b0cd28$nclexmocv6$, $nclexmocv6$9d153a5a8dcbc69818ac2dd888036205d53e1fed1c80ee3efd9096e6f8040c98$nclexmocv6$, $nclexmocv6$4558a39e0598be10d4c9d1ffc70d7ad5555ffc051c3d7b6408a803648f08cb3b$nclexmocv6$, $nclexmocv6$18df47b634a5bab89cc94a4bc8a3df18cff67735337b546c5e2f2aad7187e800$nclexmocv6$, $nclexmocv6$602a009acec35f939de2522c7541bdad6d49f4a7c24dd827fd0663b1e7e95402$nclexmocv6$, $nclexmocv6$a358d87f213a95e50b314af57b3ffcd3b72da6d8f17ba79ba6e517aebf6f5851$nclexmocv6$, $nclexmocv6$802264d9adcd933e917a6bdfa7bc9160a7cae7a9532b3c1c23ec4d1caf3adb99$nclexmocv6$, $nclexmocv6$259a58cd7c79b30c92dfca2b2ad08e7933534e1d8c4508d64444afe9b85f10aa$nclexmocv6$, $nclexmocv6$e41ec06da8227e9bfd4c3a777ac4d356484a89a8343f4bf476a0e7366f44a107$nclexmocv6$, $nclexmocv6$0cf1a9056faab956c8bebd469fbb90f5359a704c82f0115cc7192663e50f201e$nclexmocv6$, $nclexmocv6$7bb34b5adcbc91f46cb518f8a38f9500ec4c76001650860c2a21de09bb4f20c4$nclexmocv6$, $nclexmocv6$2a35c78782e6686eebeb1c4569a6be923f2f33c684f78d07ccf5ae7c248b31bb$nclexmocv6$, $nclexmocv6$dcd74f19f031f47423bfcd3b431c7fd7d74b77b9e51a0e28eaac5bb32cb12fa0$nclexmocv6$, $nclexmocv6$6dabb06bdd52fe3e0f52bf4d5b75030ab8da6e10f28c36054c82ccd93d8d3331$nclexmocv6$, $nclexmocv6$db4ed9555c60ed43626983d69f25b392263c91fc54e195520edd48486cb4a0b2$nclexmocv6$, $nclexmocv6$eba24aa3a22d96812e97db1b91f84f6298fd5eb19392e0893250664759db69fc$nclexmocv6$, $nclexmocv6$1dd12e4bf4bcc5889056cb8872681f93e54d67daaa93262de42caa42f9aecf04$nclexmocv6$, $nclexmocv6$cf4f83718af474dc233704da9bf1a3e5fe9508144c47a5c9e4f8c89c81920bc5$nclexmocv6$, $nclexmocv6$05a29fa436cbe93787231cf610282edaed64c5822222955b9ebbed18341bb4a8$nclexmocv6$, $nclexmocv6$972696e755cc988bfd85c0f8d21c1188a4dd0d3a8bbe7192eba2103af8beab6c$nclexmocv6$, $nclexmocv6$60b18292fd607b00c7f88de52c2d91ce6f4df01ceee5c1fd1c7539cbaa8d0f3c$nclexmocv6$, $nclexmocv6$562399c13cb3b0ab9d5584a3fd551c6d7bf85ca8cd67c7a9166e5e2cfcda260e$nclexmocv6$, $nclexmocv6$431b8712bd0f6a9357ba2f31fd3c1856672f466e4ae0cfb825ed67ed8220e106$nclexmocv6$, $nclexmocv6$4f7a2ec059d9586632fc6e6d5555aa35b37bd0d55d684663d8393fe9389e63e4$nclexmocv6$, $nclexmocv6$a8258b5fd36e02b4263e3c05d484dd4b3db6696e3a37276d85e6839e4d8258fc$nclexmocv6$, $nclexmocv6$81f02abbc6cb314ec75ee49351ca3c3ff1c2ac3a240a49a7ca5c9eaa86485453$nclexmocv6$, $nclexmocv6$5a9a14afb46022558e743c13c0c638a3792f3637c98b3d3b3c7f43e317807a23$nclexmocv6$, $nclexmocv6$77b13e844963748753ac370d943cb901f6fb3f47056d1e0b800a2599a3e2d27d$nclexmocv6$, $nclexmocv6$de77c5c297658600dea36d7fad5e3b02f2fc49cef06dbd2bb4dab57b5538838f$nclexmocv6$, $nclexmocv6$b284a25b75759ef641d2d80f2c44c89de3a5fff3c1be6a2622f7e8a5bb5a2a94$nclexmocv6$, $nclexmocv6$6a96771b8213655cda8626215d5bdcfef8de4958cfb337a898c00390c1ef9bf1$nclexmocv6$, $nclexmocv6$d44523514317960ad895df6871c6cc51ce47485ac8c87324499b4165264a5753$nclexmocv6$, $nclexmocv6$7a7b9eb2bbc3c3546d8f082aa6b62057b8672b507a436389e90a79884650151a$nclexmocv6$, $nclexmocv6$0a00e2633c9c7d80f74fb6926fd1b5d720311837dc6dcf44424bf928be273418$nclexmocv6$, $nclexmocv6$272f2b5689c1def7588eb6968de034acc829d32e6ac52e306a8404c66dee446b$nclexmocv6$, $nclexmocv6$cddca775b22284af712b1a0cfdbb46abe39712f533e62b3244dc5085d6360ae0$nclexmocv6$, $nclexmocv6$38f8b57b9fbc36559cddf93952106a1e4466d558414e6bebe0435b08c7ed5f4c$nclexmocv6$))::integer INTO n;
  IF n IS DISTINCT FROM 60 THEN
    RAISE EXCEPTION 'pilot hashes present once: expected 60, found %', n;
  END IF;
END
$check$;


DO $guard$
BEGIN
  IF to_regclass('public.qbi_nclex_item5_ibu_hide_20261030') IS NOT NULL THEN
    RAISE EXCEPTION 'qbi_nclex_item5_ibu_hide_20261030 already exists; refusing to run again';
  END IF;
END
$guard$;

-- Snapshot the ibuprofen row before hiding it.
CREATE TABLE qbi_nclex_item5_ibu_hide_20261030 AS
SELECT * FROM "QuestionBankItem"
WHERE id = $nclexmocv6$cmr8p5czr00a11y5nwf6lu2yu$nclexmocv6$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_item5_ibu_hide_20261030)::integer INTO n;
  IF n IS DISTINCT FROM 1 THEN
    RAISE EXCEPTION 'ibuprofen backup: expected 1, found %', n;
  END IF;
END
$check$;

DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_item5_ibu_hide_20261030
WHERE "contentHash" = $nclexmocv6$50e1760f03c15a4605b16c631fbc8f08cdad4b44c141ea73f71f57d0cb6fc6ba$nclexmocv6$
  AND "subjectId" = $nclexmocv6$pharmacology-nursing$nclexmocv6$
  AND "correctAnswer" = $nclexmocv6$Assess for signs of gastrointestinal bleeding.$nclexmocv6$
  AND active = true
  AND "qaPassed" = true)::integer INTO n;
  IF n IS DISTINCT FROM 1 THEN
    RAISE EXCEPTION 'ibuprofen pre-image: expected 1, found %', n;
  END IF;
END
$check$;

DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" SET
    active = false,
    manual_correction = true,
    "updatedAt" = CURRENT_TIMESTAMP,
    "generationMeta" = COALESCE("generationMeta", '{}'::jsonb) || $nclexmocv6${"manualCorrection":true,"nclexItem5IbuprofenHide":true,"hideBatch":"nclex-item5-v6-20261030"}$nclexmocv6$::jsonb,
    curation_meta = COALESCE(curation_meta, '{}'::jsonb) || $nclexmocv6${"metadataBy":"nclex-item5-ibuprofen-hide","hidden":true}$nclexmocv6$::jsonb
  WHERE id = $nclexmocv6$cmr8p5czr00a11y5nwf6lu2yu$nclexmocv6$
    AND "contentHash" = $nclexmocv6$50e1760f03c15a4605b16c631fbc8f08cdad4b44c141ea73f71f57d0cb6fc6ba$nclexmocv6$
    AND "subjectId" = $nclexmocv6$pharmacology-nursing$nclexmocv6$
    AND "correctAnswer" = $nclexmocv6$Assess for signs of gastrointestinal bleeding.$nclexmocv6$
    AND active = true
    AND "qaPassed" = true;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'ibuprofen hide expected 1 row, found %', n;
  END IF;
END
$do$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM "QuestionBankItem"
WHERE id = $nclexmocv6$cmr8p5czr00a11y5nwf6lu2yu$nclexmocv6$ AND active = false AND "qaPassed" = true
  AND "contentHash" = $nclexmocv6$50e1760f03c15a4605b16c631fbc8f08cdad4b44c141ea73f71f57d0cb6fc6ba$nclexmocv6$)::integer INTO n;
  IF n IS DISTINCT FROM 1 THEN
    RAISE EXCEPTION 'ibuprofen hidden: expected 1, found %', n;
  END IF;
END
$check$;


DO $guard$
BEGIN
  IF to_regclass('public.qbi_nclex_moc_v6_activate_20261030') IS NOT NULL THEN
    RAISE EXCEPTION 'qbi_nclex_moc_v6_activate_20261030 already exists; refusing to run again';
  END IF;
END
$guard$;

-- Snapshot the held pilot flags before publishing them.
CREATE TABLE qbi_nclex_moc_v6_activate_20261030 AS
SELECT id, active, "qaPassed", "reviewStatus", "lastReviewedAt", "qaAuditedAt", "updatedAt", "contentHash"
FROM "QuestionBankItem"
WHERE id IN ($nclexmocv6$cc32ad23631fdf5e61b7c7532$nclexmocv6$, $nclexmocv6$c07375bc6c73c8a35a86d34a4$nclexmocv6$, $nclexmocv6$cce68108de2a85d091037ef02$nclexmocv6$, $nclexmocv6$c33e391a46b05f148bcee19ce$nclexmocv6$, $nclexmocv6$c56c89825597afcebe6c3d07d$nclexmocv6$, $nclexmocv6$c0e71d73dae1ebf4b29f96dd8$nclexmocv6$, $nclexmocv6$cda49979c786ee698480a2c50$nclexmocv6$, $nclexmocv6$cb5613a4a0ff6390172746769$nclexmocv6$, $nclexmocv6$c3b42b4e57ed73c4e483ca8bf$nclexmocv6$, $nclexmocv6$cd84ec2e33b301266b2fdb81e$nclexmocv6$, $nclexmocv6$ca21e93236bf8bb5e03c81805$nclexmocv6$, $nclexmocv6$c1c028fd663df54d67c162c00$nclexmocv6$, $nclexmocv6$cb2c6bfdbcd95ff94d6fd9fb3$nclexmocv6$, $nclexmocv6$c74d58795d8a23a732a7c086b$nclexmocv6$, $nclexmocv6$c555870efe25d91e5847623a3$nclexmocv6$, $nclexmocv6$c7edf5a2505d52c5aa881e359$nclexmocv6$, $nclexmocv6$c84953a9b935465c840121903$nclexmocv6$, $nclexmocv6$cf38870462969b0caf8df52d9$nclexmocv6$, $nclexmocv6$c838aad32a852e85466dc34ad$nclexmocv6$, $nclexmocv6$c6ae4672605defeb29fc44589$nclexmocv6$, $nclexmocv6$c865c51fbb07fe12c643e0627$nclexmocv6$, $nclexmocv6$cfe3ad49941a9576b112c13d5$nclexmocv6$, $nclexmocv6$c407b78b5015c0f9095f00485$nclexmocv6$, $nclexmocv6$ce03ea29bc1e64249e4c9848a$nclexmocv6$, $nclexmocv6$c62e77ea0c937450ea460baee$nclexmocv6$, $nclexmocv6$c4d7ef9c9ac7188980f4b1557$nclexmocv6$, $nclexmocv6$c255a88eacd6d2b708c3782b7$nclexmocv6$, $nclexmocv6$c1e21bdb6035c9cfc38017f04$nclexmocv6$, $nclexmocv6$c4552c4fa2434cdfd60827754$nclexmocv6$, $nclexmocv6$cc02c17378aaeb4ec2e202b5f$nclexmocv6$, $nclexmocv6$cceccd2112bb739d0845e5a46$nclexmocv6$, $nclexmocv6$c29629af0189008b5c0d02b05$nclexmocv6$, $nclexmocv6$c3c1745f1388b1e92f829a752$nclexmocv6$, $nclexmocv6$c26a0ff7b922ace428fcdd745$nclexmocv6$, $nclexmocv6$c90bbcbfac0b05bf410b27e35$nclexmocv6$, $nclexmocv6$c7a08fdc5e8789a3897fbc660$nclexmocv6$, $nclexmocv6$c2041435416b32d85a96272e5$nclexmocv6$, $nclexmocv6$cbad23a4c617f03ef9f1b684d$nclexmocv6$, $nclexmocv6$c20d2179ba4b29f9570cdd364$nclexmocv6$, $nclexmocv6$c5e6badbe7f0c33e317542d81$nclexmocv6$, $nclexmocv6$cb2c778a5199bb82ff75d38d5$nclexmocv6$, $nclexmocv6$c4515bbadefd5349f3cb97f50$nclexmocv6$, $nclexmocv6$c560c084939d3c7510af09c50$nclexmocv6$, $nclexmocv6$cecb78f127bf979b43ebb0602$nclexmocv6$, $nclexmocv6$c1388cb5dd1c47e23f86692e5$nclexmocv6$, $nclexmocv6$cb41ebcd2c34e9c3cc8e66b2c$nclexmocv6$, $nclexmocv6$cd43a0cc1cd6439f5a91b942b$nclexmocv6$, $nclexmocv6$ca51cdf35a21f30091244c6fb$nclexmocv6$, $nclexmocv6$cbffa08bca993a371dc599498$nclexmocv6$, $nclexmocv6$cd2051b57c974bcd1b3a5eeb5$nclexmocv6$, $nclexmocv6$cd51ffe710213cb4297548604$nclexmocv6$, $nclexmocv6$cd8537a20bb0b1582b0517cd7$nclexmocv6$, $nclexmocv6$c771be3182abea75c31bbbb48$nclexmocv6$, $nclexmocv6$cf844cf91bac7d60384079071$nclexmocv6$, $nclexmocv6$c541fe4d1afc0890f2e466f33$nclexmocv6$, $nclexmocv6$c970869c6399c66f8d554b3f5$nclexmocv6$, $nclexmocv6$cdee11f8f80ffaddee2848958$nclexmocv6$, $nclexmocv6$c840270eb5d38316dbe901b7e$nclexmocv6$, $nclexmocv6$cab0faeb8590247422a27c126$nclexmocv6$, $nclexmocv6$c0484e351a36e112c7f55bd17$nclexmocv6$);
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_moc_v6_activate_20261030)::integer INTO n;
  IF n IS DISTINCT FROM 60 THEN
    RAISE EXCEPTION 'activate backup: expected 60, found %', n;
  END IF;
END
$check$;

DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_moc_v6_activate_20261030 b
JOIN (VALUES
($nclexmocv6$cc32ad23631fdf5e61b7c7532$nclexmocv6$, $nclexmocv6$09d615c084756423f9efb377962214edf3dc4a3b7c4347a0138255ad654d6053$nclexmocv6$),
($nclexmocv6$c07375bc6c73c8a35a86d34a4$nclexmocv6$, $nclexmocv6$9919ae6abef76b015f6106695dd6d00f7bf9f2d4e28a66360af302bf0ccc1840$nclexmocv6$),
($nclexmocv6$cce68108de2a85d091037ef02$nclexmocv6$, $nclexmocv6$97a40ad9093153544527608442eaa8009379bd1b55135a691d14b25db9d4b62a$nclexmocv6$),
($nclexmocv6$c33e391a46b05f148bcee19ce$nclexmocv6$, $nclexmocv6$82611bd031046cca8697f433998eaf44ccdba871e6536c96d65d9163236b6342$nclexmocv6$),
($nclexmocv6$c56c89825597afcebe6c3d07d$nclexmocv6$, $nclexmocv6$8eeea199b8bb366e38f6d02289c2333c10c19f54dcad81821b7eb970fdd1bd97$nclexmocv6$),
($nclexmocv6$c0e71d73dae1ebf4b29f96dd8$nclexmocv6$, $nclexmocv6$14eef8e1222231d46b230b108b5557f411a7cecbe21aeeecd810db8db8857559$nclexmocv6$),
($nclexmocv6$cda49979c786ee698480a2c50$nclexmocv6$, $nclexmocv6$fed832de28bdb382d896e4f1bc3513fade9f976075ff9c08183ef61737a11e5d$nclexmocv6$),
($nclexmocv6$cb5613a4a0ff6390172746769$nclexmocv6$, $nclexmocv6$ecc34da121344fd6332e572d038368b69c1e566bb943573de69370f23a7f5d9a$nclexmocv6$),
($nclexmocv6$c3b42b4e57ed73c4e483ca8bf$nclexmocv6$, $nclexmocv6$938b29c117dc02df217da2c64c8acf4d4c28f414e69c303807fb2d65c72865a1$nclexmocv6$),
($nclexmocv6$cd84ec2e33b301266b2fdb81e$nclexmocv6$, $nclexmocv6$cac380659337013da81abd37d6eb1de2bf399494a0906dc93ad1b7e29846fd7b$nclexmocv6$),
($nclexmocv6$ca21e93236bf8bb5e03c81805$nclexmocv6$, $nclexmocv6$32e1b470574a3c03215f5dfc818def7bbb6a2635f43911fd250d757ef41fe546$nclexmocv6$),
($nclexmocv6$c1c028fd663df54d67c162c00$nclexmocv6$, $nclexmocv6$7fb8411d05b0ba1026c1ebcc33cb08bd86ab0810564cb441f4dca00bd41ffa8a$nclexmocv6$),
($nclexmocv6$cb2c6bfdbcd95ff94d6fd9fb3$nclexmocv6$, $nclexmocv6$0fba9c74ba49d541943033c01364fff5c7b00ca150ba06266ddedf6dcbc5a23e$nclexmocv6$),
($nclexmocv6$c74d58795d8a23a732a7c086b$nclexmocv6$, $nclexmocv6$1b126a7a62b071e2605c7966bd97017888807b3f9fbb948e4c69d0e0a8a59446$nclexmocv6$),
($nclexmocv6$c555870efe25d91e5847623a3$nclexmocv6$, $nclexmocv6$90aaa08b41cadc5ef22f03889807f040061a4a54860cef6c53331cffebad0321$nclexmocv6$),
($nclexmocv6$c7edf5a2505d52c5aa881e359$nclexmocv6$, $nclexmocv6$062d807641e9d3b2c147b7ddc159317f2e3fa572db55cdca948ff149053c2cd7$nclexmocv6$),
($nclexmocv6$c84953a9b935465c840121903$nclexmocv6$, $nclexmocv6$2242428c62be2f12696fca544f84e1825769ab2e5d015d0f6a808e5483198ecc$nclexmocv6$),
($nclexmocv6$cf38870462969b0caf8df52d9$nclexmocv6$, $nclexmocv6$23f7a3da8cb1c07fc6a52a7ba7a733608a0e5d9b758ebb35e9feda61bbb6371c$nclexmocv6$),
($nclexmocv6$c838aad32a852e85466dc34ad$nclexmocv6$, $nclexmocv6$9bae2ed8e888fbd76251c1278761680851782c94749aa3032ace871a4c24f484$nclexmocv6$),
($nclexmocv6$c6ae4672605defeb29fc44589$nclexmocv6$, $nclexmocv6$9e3c431145e99f9d6d14f92cfcf141e5a836bf9d7659b5194cd31c275bff3e6c$nclexmocv6$),
($nclexmocv6$c865c51fbb07fe12c643e0627$nclexmocv6$, $nclexmocv6$69c500db2a7d511bf58ef0d02dbdb94669dd75bab83aa2d3149c6f3a46e52339$nclexmocv6$),
($nclexmocv6$cfe3ad49941a9576b112c13d5$nclexmocv6$, $nclexmocv6$b8006a4634deb3b4db41dfedf3b621f59de405d78382a4c2e459ee6ea8365d73$nclexmocv6$),
($nclexmocv6$c407b78b5015c0f9095f00485$nclexmocv6$, $nclexmocv6$1e7a3ffae16df986a43ffd7ac773ef9a750d595656708252841ff08c63faf568$nclexmocv6$),
($nclexmocv6$ce03ea29bc1e64249e4c9848a$nclexmocv6$, $nclexmocv6$174f310a22f79e0f78c7f940d0b32727de3d0066066b11ccedbf00d910b0cd28$nclexmocv6$),
($nclexmocv6$c62e77ea0c937450ea460baee$nclexmocv6$, $nclexmocv6$9d153a5a8dcbc69818ac2dd888036205d53e1fed1c80ee3efd9096e6f8040c98$nclexmocv6$),
($nclexmocv6$c4d7ef9c9ac7188980f4b1557$nclexmocv6$, $nclexmocv6$4558a39e0598be10d4c9d1ffc70d7ad5555ffc051c3d7b6408a803648f08cb3b$nclexmocv6$),
($nclexmocv6$c255a88eacd6d2b708c3782b7$nclexmocv6$, $nclexmocv6$18df47b634a5bab89cc94a4bc8a3df18cff67735337b546c5e2f2aad7187e800$nclexmocv6$),
($nclexmocv6$c1e21bdb6035c9cfc38017f04$nclexmocv6$, $nclexmocv6$602a009acec35f939de2522c7541bdad6d49f4a7c24dd827fd0663b1e7e95402$nclexmocv6$),
($nclexmocv6$c4552c4fa2434cdfd60827754$nclexmocv6$, $nclexmocv6$a358d87f213a95e50b314af57b3ffcd3b72da6d8f17ba79ba6e517aebf6f5851$nclexmocv6$),
($nclexmocv6$cc02c17378aaeb4ec2e202b5f$nclexmocv6$, $nclexmocv6$802264d9adcd933e917a6bdfa7bc9160a7cae7a9532b3c1c23ec4d1caf3adb99$nclexmocv6$),
($nclexmocv6$cceccd2112bb739d0845e5a46$nclexmocv6$, $nclexmocv6$259a58cd7c79b30c92dfca2b2ad08e7933534e1d8c4508d64444afe9b85f10aa$nclexmocv6$),
($nclexmocv6$c29629af0189008b5c0d02b05$nclexmocv6$, $nclexmocv6$e41ec06da8227e9bfd4c3a777ac4d356484a89a8343f4bf476a0e7366f44a107$nclexmocv6$),
($nclexmocv6$c3c1745f1388b1e92f829a752$nclexmocv6$, $nclexmocv6$0cf1a9056faab956c8bebd469fbb90f5359a704c82f0115cc7192663e50f201e$nclexmocv6$),
($nclexmocv6$c26a0ff7b922ace428fcdd745$nclexmocv6$, $nclexmocv6$7bb34b5adcbc91f46cb518f8a38f9500ec4c76001650860c2a21de09bb4f20c4$nclexmocv6$),
($nclexmocv6$c90bbcbfac0b05bf410b27e35$nclexmocv6$, $nclexmocv6$2a35c78782e6686eebeb1c4569a6be923f2f33c684f78d07ccf5ae7c248b31bb$nclexmocv6$),
($nclexmocv6$c7a08fdc5e8789a3897fbc660$nclexmocv6$, $nclexmocv6$dcd74f19f031f47423bfcd3b431c7fd7d74b77b9e51a0e28eaac5bb32cb12fa0$nclexmocv6$),
($nclexmocv6$c2041435416b32d85a96272e5$nclexmocv6$, $nclexmocv6$6dabb06bdd52fe3e0f52bf4d5b75030ab8da6e10f28c36054c82ccd93d8d3331$nclexmocv6$),
($nclexmocv6$cbad23a4c617f03ef9f1b684d$nclexmocv6$, $nclexmocv6$db4ed9555c60ed43626983d69f25b392263c91fc54e195520edd48486cb4a0b2$nclexmocv6$),
($nclexmocv6$c20d2179ba4b29f9570cdd364$nclexmocv6$, $nclexmocv6$eba24aa3a22d96812e97db1b91f84f6298fd5eb19392e0893250664759db69fc$nclexmocv6$),
($nclexmocv6$c5e6badbe7f0c33e317542d81$nclexmocv6$, $nclexmocv6$1dd12e4bf4bcc5889056cb8872681f93e54d67daaa93262de42caa42f9aecf04$nclexmocv6$),
($nclexmocv6$cb2c778a5199bb82ff75d38d5$nclexmocv6$, $nclexmocv6$cf4f83718af474dc233704da9bf1a3e5fe9508144c47a5c9e4f8c89c81920bc5$nclexmocv6$),
($nclexmocv6$c4515bbadefd5349f3cb97f50$nclexmocv6$, $nclexmocv6$05a29fa436cbe93787231cf610282edaed64c5822222955b9ebbed18341bb4a8$nclexmocv6$),
($nclexmocv6$c560c084939d3c7510af09c50$nclexmocv6$, $nclexmocv6$972696e755cc988bfd85c0f8d21c1188a4dd0d3a8bbe7192eba2103af8beab6c$nclexmocv6$),
($nclexmocv6$cecb78f127bf979b43ebb0602$nclexmocv6$, $nclexmocv6$60b18292fd607b00c7f88de52c2d91ce6f4df01ceee5c1fd1c7539cbaa8d0f3c$nclexmocv6$),
($nclexmocv6$c1388cb5dd1c47e23f86692e5$nclexmocv6$, $nclexmocv6$562399c13cb3b0ab9d5584a3fd551c6d7bf85ca8cd67c7a9166e5e2cfcda260e$nclexmocv6$),
($nclexmocv6$cb41ebcd2c34e9c3cc8e66b2c$nclexmocv6$, $nclexmocv6$431b8712bd0f6a9357ba2f31fd3c1856672f466e4ae0cfb825ed67ed8220e106$nclexmocv6$),
($nclexmocv6$cd43a0cc1cd6439f5a91b942b$nclexmocv6$, $nclexmocv6$4f7a2ec059d9586632fc6e6d5555aa35b37bd0d55d684663d8393fe9389e63e4$nclexmocv6$),
($nclexmocv6$ca51cdf35a21f30091244c6fb$nclexmocv6$, $nclexmocv6$a8258b5fd36e02b4263e3c05d484dd4b3db6696e3a37276d85e6839e4d8258fc$nclexmocv6$),
($nclexmocv6$cbffa08bca993a371dc599498$nclexmocv6$, $nclexmocv6$81f02abbc6cb314ec75ee49351ca3c3ff1c2ac3a240a49a7ca5c9eaa86485453$nclexmocv6$),
($nclexmocv6$cd2051b57c974bcd1b3a5eeb5$nclexmocv6$, $nclexmocv6$5a9a14afb46022558e743c13c0c638a3792f3637c98b3d3b3c7f43e317807a23$nclexmocv6$),
($nclexmocv6$cd51ffe710213cb4297548604$nclexmocv6$, $nclexmocv6$77b13e844963748753ac370d943cb901f6fb3f47056d1e0b800a2599a3e2d27d$nclexmocv6$),
($nclexmocv6$cd8537a20bb0b1582b0517cd7$nclexmocv6$, $nclexmocv6$de77c5c297658600dea36d7fad5e3b02f2fc49cef06dbd2bb4dab57b5538838f$nclexmocv6$),
($nclexmocv6$c771be3182abea75c31bbbb48$nclexmocv6$, $nclexmocv6$b284a25b75759ef641d2d80f2c44c89de3a5fff3c1be6a2622f7e8a5bb5a2a94$nclexmocv6$),
($nclexmocv6$cf844cf91bac7d60384079071$nclexmocv6$, $nclexmocv6$6a96771b8213655cda8626215d5bdcfef8de4958cfb337a898c00390c1ef9bf1$nclexmocv6$),
($nclexmocv6$c541fe4d1afc0890f2e466f33$nclexmocv6$, $nclexmocv6$d44523514317960ad895df6871c6cc51ce47485ac8c87324499b4165264a5753$nclexmocv6$),
($nclexmocv6$c970869c6399c66f8d554b3f5$nclexmocv6$, $nclexmocv6$7a7b9eb2bbc3c3546d8f082aa6b62057b8672b507a436389e90a79884650151a$nclexmocv6$),
($nclexmocv6$cdee11f8f80ffaddee2848958$nclexmocv6$, $nclexmocv6$0a00e2633c9c7d80f74fb6926fd1b5d720311837dc6dcf44424bf928be273418$nclexmocv6$),
($nclexmocv6$c840270eb5d38316dbe901b7e$nclexmocv6$, $nclexmocv6$272f2b5689c1def7588eb6968de034acc829d32e6ac52e306a8404c66dee446b$nclexmocv6$),
($nclexmocv6$cab0faeb8590247422a27c126$nclexmocv6$, $nclexmocv6$cddca775b22284af712b1a0cfdbb46abe39712f533e62b3244dc5085d6360ae0$nclexmocv6$),
($nclexmocv6$c0484e351a36e112c7f55bd17$nclexmocv6$, $nclexmocv6$38f8b57b9fbc36559cddf93952106a1e4466d558414e6bebe0435b08c7ed5f4c$nclexmocv6$)
) AS v(id, hash) ON v.id = b.id AND v.hash = b."contentHash"
WHERE b.active = false AND b."qaPassed" = false)::integer INTO n;
  IF n IS DISTINCT FROM 60 THEN
    RAISE EXCEPTION 'activate pre-image: expected 60, found %', n;
  END IF;
END
$check$;

DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" q SET
    active = true,
    "qaPassed" = true,
    "reviewStatus" = 'approved',
    "lastReviewedAt" = CURRENT_TIMESTAMP,
    "qaAuditedAt" = CURRENT_TIMESTAMP,
    "updatedAt" = CURRENT_TIMESTAMP
  FROM (VALUES
($nclexmocv6$cc32ad23631fdf5e61b7c7532$nclexmocv6$, $nclexmocv6$09d615c084756423f9efb377962214edf3dc4a3b7c4347a0138255ad654d6053$nclexmocv6$),
($nclexmocv6$c07375bc6c73c8a35a86d34a4$nclexmocv6$, $nclexmocv6$9919ae6abef76b015f6106695dd6d00f7bf9f2d4e28a66360af302bf0ccc1840$nclexmocv6$),
($nclexmocv6$cce68108de2a85d091037ef02$nclexmocv6$, $nclexmocv6$97a40ad9093153544527608442eaa8009379bd1b55135a691d14b25db9d4b62a$nclexmocv6$),
($nclexmocv6$c33e391a46b05f148bcee19ce$nclexmocv6$, $nclexmocv6$82611bd031046cca8697f433998eaf44ccdba871e6536c96d65d9163236b6342$nclexmocv6$),
($nclexmocv6$c56c89825597afcebe6c3d07d$nclexmocv6$, $nclexmocv6$8eeea199b8bb366e38f6d02289c2333c10c19f54dcad81821b7eb970fdd1bd97$nclexmocv6$),
($nclexmocv6$c0e71d73dae1ebf4b29f96dd8$nclexmocv6$, $nclexmocv6$14eef8e1222231d46b230b108b5557f411a7cecbe21aeeecd810db8db8857559$nclexmocv6$),
($nclexmocv6$cda49979c786ee698480a2c50$nclexmocv6$, $nclexmocv6$fed832de28bdb382d896e4f1bc3513fade9f976075ff9c08183ef61737a11e5d$nclexmocv6$),
($nclexmocv6$cb5613a4a0ff6390172746769$nclexmocv6$, $nclexmocv6$ecc34da121344fd6332e572d038368b69c1e566bb943573de69370f23a7f5d9a$nclexmocv6$),
($nclexmocv6$c3b42b4e57ed73c4e483ca8bf$nclexmocv6$, $nclexmocv6$938b29c117dc02df217da2c64c8acf4d4c28f414e69c303807fb2d65c72865a1$nclexmocv6$),
($nclexmocv6$cd84ec2e33b301266b2fdb81e$nclexmocv6$, $nclexmocv6$cac380659337013da81abd37d6eb1de2bf399494a0906dc93ad1b7e29846fd7b$nclexmocv6$),
($nclexmocv6$ca21e93236bf8bb5e03c81805$nclexmocv6$, $nclexmocv6$32e1b470574a3c03215f5dfc818def7bbb6a2635f43911fd250d757ef41fe546$nclexmocv6$),
($nclexmocv6$c1c028fd663df54d67c162c00$nclexmocv6$, $nclexmocv6$7fb8411d05b0ba1026c1ebcc33cb08bd86ab0810564cb441f4dca00bd41ffa8a$nclexmocv6$),
($nclexmocv6$cb2c6bfdbcd95ff94d6fd9fb3$nclexmocv6$, $nclexmocv6$0fba9c74ba49d541943033c01364fff5c7b00ca150ba06266ddedf6dcbc5a23e$nclexmocv6$),
($nclexmocv6$c74d58795d8a23a732a7c086b$nclexmocv6$, $nclexmocv6$1b126a7a62b071e2605c7966bd97017888807b3f9fbb948e4c69d0e0a8a59446$nclexmocv6$),
($nclexmocv6$c555870efe25d91e5847623a3$nclexmocv6$, $nclexmocv6$90aaa08b41cadc5ef22f03889807f040061a4a54860cef6c53331cffebad0321$nclexmocv6$),
($nclexmocv6$c7edf5a2505d52c5aa881e359$nclexmocv6$, $nclexmocv6$062d807641e9d3b2c147b7ddc159317f2e3fa572db55cdca948ff149053c2cd7$nclexmocv6$),
($nclexmocv6$c84953a9b935465c840121903$nclexmocv6$, $nclexmocv6$2242428c62be2f12696fca544f84e1825769ab2e5d015d0f6a808e5483198ecc$nclexmocv6$),
($nclexmocv6$cf38870462969b0caf8df52d9$nclexmocv6$, $nclexmocv6$23f7a3da8cb1c07fc6a52a7ba7a733608a0e5d9b758ebb35e9feda61bbb6371c$nclexmocv6$),
($nclexmocv6$c838aad32a852e85466dc34ad$nclexmocv6$, $nclexmocv6$9bae2ed8e888fbd76251c1278761680851782c94749aa3032ace871a4c24f484$nclexmocv6$),
($nclexmocv6$c6ae4672605defeb29fc44589$nclexmocv6$, $nclexmocv6$9e3c431145e99f9d6d14f92cfcf141e5a836bf9d7659b5194cd31c275bff3e6c$nclexmocv6$),
($nclexmocv6$c865c51fbb07fe12c643e0627$nclexmocv6$, $nclexmocv6$69c500db2a7d511bf58ef0d02dbdb94669dd75bab83aa2d3149c6f3a46e52339$nclexmocv6$),
($nclexmocv6$cfe3ad49941a9576b112c13d5$nclexmocv6$, $nclexmocv6$b8006a4634deb3b4db41dfedf3b621f59de405d78382a4c2e459ee6ea8365d73$nclexmocv6$),
($nclexmocv6$c407b78b5015c0f9095f00485$nclexmocv6$, $nclexmocv6$1e7a3ffae16df986a43ffd7ac773ef9a750d595656708252841ff08c63faf568$nclexmocv6$),
($nclexmocv6$ce03ea29bc1e64249e4c9848a$nclexmocv6$, $nclexmocv6$174f310a22f79e0f78c7f940d0b32727de3d0066066b11ccedbf00d910b0cd28$nclexmocv6$),
($nclexmocv6$c62e77ea0c937450ea460baee$nclexmocv6$, $nclexmocv6$9d153a5a8dcbc69818ac2dd888036205d53e1fed1c80ee3efd9096e6f8040c98$nclexmocv6$),
($nclexmocv6$c4d7ef9c9ac7188980f4b1557$nclexmocv6$, $nclexmocv6$4558a39e0598be10d4c9d1ffc70d7ad5555ffc051c3d7b6408a803648f08cb3b$nclexmocv6$),
($nclexmocv6$c255a88eacd6d2b708c3782b7$nclexmocv6$, $nclexmocv6$18df47b634a5bab89cc94a4bc8a3df18cff67735337b546c5e2f2aad7187e800$nclexmocv6$),
($nclexmocv6$c1e21bdb6035c9cfc38017f04$nclexmocv6$, $nclexmocv6$602a009acec35f939de2522c7541bdad6d49f4a7c24dd827fd0663b1e7e95402$nclexmocv6$),
($nclexmocv6$c4552c4fa2434cdfd60827754$nclexmocv6$, $nclexmocv6$a358d87f213a95e50b314af57b3ffcd3b72da6d8f17ba79ba6e517aebf6f5851$nclexmocv6$),
($nclexmocv6$cc02c17378aaeb4ec2e202b5f$nclexmocv6$, $nclexmocv6$802264d9adcd933e917a6bdfa7bc9160a7cae7a9532b3c1c23ec4d1caf3adb99$nclexmocv6$),
($nclexmocv6$cceccd2112bb739d0845e5a46$nclexmocv6$, $nclexmocv6$259a58cd7c79b30c92dfca2b2ad08e7933534e1d8c4508d64444afe9b85f10aa$nclexmocv6$),
($nclexmocv6$c29629af0189008b5c0d02b05$nclexmocv6$, $nclexmocv6$e41ec06da8227e9bfd4c3a777ac4d356484a89a8343f4bf476a0e7366f44a107$nclexmocv6$),
($nclexmocv6$c3c1745f1388b1e92f829a752$nclexmocv6$, $nclexmocv6$0cf1a9056faab956c8bebd469fbb90f5359a704c82f0115cc7192663e50f201e$nclexmocv6$),
($nclexmocv6$c26a0ff7b922ace428fcdd745$nclexmocv6$, $nclexmocv6$7bb34b5adcbc91f46cb518f8a38f9500ec4c76001650860c2a21de09bb4f20c4$nclexmocv6$),
($nclexmocv6$c90bbcbfac0b05bf410b27e35$nclexmocv6$, $nclexmocv6$2a35c78782e6686eebeb1c4569a6be923f2f33c684f78d07ccf5ae7c248b31bb$nclexmocv6$),
($nclexmocv6$c7a08fdc5e8789a3897fbc660$nclexmocv6$, $nclexmocv6$dcd74f19f031f47423bfcd3b431c7fd7d74b77b9e51a0e28eaac5bb32cb12fa0$nclexmocv6$),
($nclexmocv6$c2041435416b32d85a96272e5$nclexmocv6$, $nclexmocv6$6dabb06bdd52fe3e0f52bf4d5b75030ab8da6e10f28c36054c82ccd93d8d3331$nclexmocv6$),
($nclexmocv6$cbad23a4c617f03ef9f1b684d$nclexmocv6$, $nclexmocv6$db4ed9555c60ed43626983d69f25b392263c91fc54e195520edd48486cb4a0b2$nclexmocv6$),
($nclexmocv6$c20d2179ba4b29f9570cdd364$nclexmocv6$, $nclexmocv6$eba24aa3a22d96812e97db1b91f84f6298fd5eb19392e0893250664759db69fc$nclexmocv6$),
($nclexmocv6$c5e6badbe7f0c33e317542d81$nclexmocv6$, $nclexmocv6$1dd12e4bf4bcc5889056cb8872681f93e54d67daaa93262de42caa42f9aecf04$nclexmocv6$),
($nclexmocv6$cb2c778a5199bb82ff75d38d5$nclexmocv6$, $nclexmocv6$cf4f83718af474dc233704da9bf1a3e5fe9508144c47a5c9e4f8c89c81920bc5$nclexmocv6$),
($nclexmocv6$c4515bbadefd5349f3cb97f50$nclexmocv6$, $nclexmocv6$05a29fa436cbe93787231cf610282edaed64c5822222955b9ebbed18341bb4a8$nclexmocv6$),
($nclexmocv6$c560c084939d3c7510af09c50$nclexmocv6$, $nclexmocv6$972696e755cc988bfd85c0f8d21c1188a4dd0d3a8bbe7192eba2103af8beab6c$nclexmocv6$),
($nclexmocv6$cecb78f127bf979b43ebb0602$nclexmocv6$, $nclexmocv6$60b18292fd607b00c7f88de52c2d91ce6f4df01ceee5c1fd1c7539cbaa8d0f3c$nclexmocv6$),
($nclexmocv6$c1388cb5dd1c47e23f86692e5$nclexmocv6$, $nclexmocv6$562399c13cb3b0ab9d5584a3fd551c6d7bf85ca8cd67c7a9166e5e2cfcda260e$nclexmocv6$),
($nclexmocv6$cb41ebcd2c34e9c3cc8e66b2c$nclexmocv6$, $nclexmocv6$431b8712bd0f6a9357ba2f31fd3c1856672f466e4ae0cfb825ed67ed8220e106$nclexmocv6$),
($nclexmocv6$cd43a0cc1cd6439f5a91b942b$nclexmocv6$, $nclexmocv6$4f7a2ec059d9586632fc6e6d5555aa35b37bd0d55d684663d8393fe9389e63e4$nclexmocv6$),
($nclexmocv6$ca51cdf35a21f30091244c6fb$nclexmocv6$, $nclexmocv6$a8258b5fd36e02b4263e3c05d484dd4b3db6696e3a37276d85e6839e4d8258fc$nclexmocv6$),
($nclexmocv6$cbffa08bca993a371dc599498$nclexmocv6$, $nclexmocv6$81f02abbc6cb314ec75ee49351ca3c3ff1c2ac3a240a49a7ca5c9eaa86485453$nclexmocv6$),
($nclexmocv6$cd2051b57c974bcd1b3a5eeb5$nclexmocv6$, $nclexmocv6$5a9a14afb46022558e743c13c0c638a3792f3637c98b3d3b3c7f43e317807a23$nclexmocv6$),
($nclexmocv6$cd51ffe710213cb4297548604$nclexmocv6$, $nclexmocv6$77b13e844963748753ac370d943cb901f6fb3f47056d1e0b800a2599a3e2d27d$nclexmocv6$),
($nclexmocv6$cd8537a20bb0b1582b0517cd7$nclexmocv6$, $nclexmocv6$de77c5c297658600dea36d7fad5e3b02f2fc49cef06dbd2bb4dab57b5538838f$nclexmocv6$),
($nclexmocv6$c771be3182abea75c31bbbb48$nclexmocv6$, $nclexmocv6$b284a25b75759ef641d2d80f2c44c89de3a5fff3c1be6a2622f7e8a5bb5a2a94$nclexmocv6$),
($nclexmocv6$cf844cf91bac7d60384079071$nclexmocv6$, $nclexmocv6$6a96771b8213655cda8626215d5bdcfef8de4958cfb337a898c00390c1ef9bf1$nclexmocv6$),
($nclexmocv6$c541fe4d1afc0890f2e466f33$nclexmocv6$, $nclexmocv6$d44523514317960ad895df6871c6cc51ce47485ac8c87324499b4165264a5753$nclexmocv6$),
($nclexmocv6$c970869c6399c66f8d554b3f5$nclexmocv6$, $nclexmocv6$7a7b9eb2bbc3c3546d8f082aa6b62057b8672b507a436389e90a79884650151a$nclexmocv6$),
($nclexmocv6$cdee11f8f80ffaddee2848958$nclexmocv6$, $nclexmocv6$0a00e2633c9c7d80f74fb6926fd1b5d720311837dc6dcf44424bf928be273418$nclexmocv6$),
($nclexmocv6$c840270eb5d38316dbe901b7e$nclexmocv6$, $nclexmocv6$272f2b5689c1def7588eb6968de034acc829d32e6ac52e306a8404c66dee446b$nclexmocv6$),
($nclexmocv6$cab0faeb8590247422a27c126$nclexmocv6$, $nclexmocv6$cddca775b22284af712b1a0cfdbb46abe39712f533e62b3244dc5085d6360ae0$nclexmocv6$),
($nclexmocv6$c0484e351a36e112c7f55bd17$nclexmocv6$, $nclexmocv6$38f8b57b9fbc36559cddf93952106a1e4466d558414e6bebe0435b08c7ed5f4c$nclexmocv6$)
  ) AS v(id, hash)
  WHERE q.id = v.id
    AND q."contentHash" = v.hash
    AND q.active = false
    AND q."qaPassed" = false;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 60 THEN
    RAISE EXCEPTION 'activation expected 60 rows, found %', n;
  END IF;
END
$do$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM "QuestionBankItem" q
JOIN (VALUES
($nclexmocv6$cc32ad23631fdf5e61b7c7532$nclexmocv6$, $nclexmocv6$09d615c084756423f9efb377962214edf3dc4a3b7c4347a0138255ad654d6053$nclexmocv6$),
($nclexmocv6$c07375bc6c73c8a35a86d34a4$nclexmocv6$, $nclexmocv6$9919ae6abef76b015f6106695dd6d00f7bf9f2d4e28a66360af302bf0ccc1840$nclexmocv6$),
($nclexmocv6$cce68108de2a85d091037ef02$nclexmocv6$, $nclexmocv6$97a40ad9093153544527608442eaa8009379bd1b55135a691d14b25db9d4b62a$nclexmocv6$),
($nclexmocv6$c33e391a46b05f148bcee19ce$nclexmocv6$, $nclexmocv6$82611bd031046cca8697f433998eaf44ccdba871e6536c96d65d9163236b6342$nclexmocv6$),
($nclexmocv6$c56c89825597afcebe6c3d07d$nclexmocv6$, $nclexmocv6$8eeea199b8bb366e38f6d02289c2333c10c19f54dcad81821b7eb970fdd1bd97$nclexmocv6$),
($nclexmocv6$c0e71d73dae1ebf4b29f96dd8$nclexmocv6$, $nclexmocv6$14eef8e1222231d46b230b108b5557f411a7cecbe21aeeecd810db8db8857559$nclexmocv6$),
($nclexmocv6$cda49979c786ee698480a2c50$nclexmocv6$, $nclexmocv6$fed832de28bdb382d896e4f1bc3513fade9f976075ff9c08183ef61737a11e5d$nclexmocv6$),
($nclexmocv6$cb5613a4a0ff6390172746769$nclexmocv6$, $nclexmocv6$ecc34da121344fd6332e572d038368b69c1e566bb943573de69370f23a7f5d9a$nclexmocv6$),
($nclexmocv6$c3b42b4e57ed73c4e483ca8bf$nclexmocv6$, $nclexmocv6$938b29c117dc02df217da2c64c8acf4d4c28f414e69c303807fb2d65c72865a1$nclexmocv6$),
($nclexmocv6$cd84ec2e33b301266b2fdb81e$nclexmocv6$, $nclexmocv6$cac380659337013da81abd37d6eb1de2bf399494a0906dc93ad1b7e29846fd7b$nclexmocv6$),
($nclexmocv6$ca21e93236bf8bb5e03c81805$nclexmocv6$, $nclexmocv6$32e1b470574a3c03215f5dfc818def7bbb6a2635f43911fd250d757ef41fe546$nclexmocv6$),
($nclexmocv6$c1c028fd663df54d67c162c00$nclexmocv6$, $nclexmocv6$7fb8411d05b0ba1026c1ebcc33cb08bd86ab0810564cb441f4dca00bd41ffa8a$nclexmocv6$),
($nclexmocv6$cb2c6bfdbcd95ff94d6fd9fb3$nclexmocv6$, $nclexmocv6$0fba9c74ba49d541943033c01364fff5c7b00ca150ba06266ddedf6dcbc5a23e$nclexmocv6$),
($nclexmocv6$c74d58795d8a23a732a7c086b$nclexmocv6$, $nclexmocv6$1b126a7a62b071e2605c7966bd97017888807b3f9fbb948e4c69d0e0a8a59446$nclexmocv6$),
($nclexmocv6$c555870efe25d91e5847623a3$nclexmocv6$, $nclexmocv6$90aaa08b41cadc5ef22f03889807f040061a4a54860cef6c53331cffebad0321$nclexmocv6$),
($nclexmocv6$c7edf5a2505d52c5aa881e359$nclexmocv6$, $nclexmocv6$062d807641e9d3b2c147b7ddc159317f2e3fa572db55cdca948ff149053c2cd7$nclexmocv6$),
($nclexmocv6$c84953a9b935465c840121903$nclexmocv6$, $nclexmocv6$2242428c62be2f12696fca544f84e1825769ab2e5d015d0f6a808e5483198ecc$nclexmocv6$),
($nclexmocv6$cf38870462969b0caf8df52d9$nclexmocv6$, $nclexmocv6$23f7a3da8cb1c07fc6a52a7ba7a733608a0e5d9b758ebb35e9feda61bbb6371c$nclexmocv6$),
($nclexmocv6$c838aad32a852e85466dc34ad$nclexmocv6$, $nclexmocv6$9bae2ed8e888fbd76251c1278761680851782c94749aa3032ace871a4c24f484$nclexmocv6$),
($nclexmocv6$c6ae4672605defeb29fc44589$nclexmocv6$, $nclexmocv6$9e3c431145e99f9d6d14f92cfcf141e5a836bf9d7659b5194cd31c275bff3e6c$nclexmocv6$),
($nclexmocv6$c865c51fbb07fe12c643e0627$nclexmocv6$, $nclexmocv6$69c500db2a7d511bf58ef0d02dbdb94669dd75bab83aa2d3149c6f3a46e52339$nclexmocv6$),
($nclexmocv6$cfe3ad49941a9576b112c13d5$nclexmocv6$, $nclexmocv6$b8006a4634deb3b4db41dfedf3b621f59de405d78382a4c2e459ee6ea8365d73$nclexmocv6$),
($nclexmocv6$c407b78b5015c0f9095f00485$nclexmocv6$, $nclexmocv6$1e7a3ffae16df986a43ffd7ac773ef9a750d595656708252841ff08c63faf568$nclexmocv6$),
($nclexmocv6$ce03ea29bc1e64249e4c9848a$nclexmocv6$, $nclexmocv6$174f310a22f79e0f78c7f940d0b32727de3d0066066b11ccedbf00d910b0cd28$nclexmocv6$),
($nclexmocv6$c62e77ea0c937450ea460baee$nclexmocv6$, $nclexmocv6$9d153a5a8dcbc69818ac2dd888036205d53e1fed1c80ee3efd9096e6f8040c98$nclexmocv6$),
($nclexmocv6$c4d7ef9c9ac7188980f4b1557$nclexmocv6$, $nclexmocv6$4558a39e0598be10d4c9d1ffc70d7ad5555ffc051c3d7b6408a803648f08cb3b$nclexmocv6$),
($nclexmocv6$c255a88eacd6d2b708c3782b7$nclexmocv6$, $nclexmocv6$18df47b634a5bab89cc94a4bc8a3df18cff67735337b546c5e2f2aad7187e800$nclexmocv6$),
($nclexmocv6$c1e21bdb6035c9cfc38017f04$nclexmocv6$, $nclexmocv6$602a009acec35f939de2522c7541bdad6d49f4a7c24dd827fd0663b1e7e95402$nclexmocv6$),
($nclexmocv6$c4552c4fa2434cdfd60827754$nclexmocv6$, $nclexmocv6$a358d87f213a95e50b314af57b3ffcd3b72da6d8f17ba79ba6e517aebf6f5851$nclexmocv6$),
($nclexmocv6$cc02c17378aaeb4ec2e202b5f$nclexmocv6$, $nclexmocv6$802264d9adcd933e917a6bdfa7bc9160a7cae7a9532b3c1c23ec4d1caf3adb99$nclexmocv6$),
($nclexmocv6$cceccd2112bb739d0845e5a46$nclexmocv6$, $nclexmocv6$259a58cd7c79b30c92dfca2b2ad08e7933534e1d8c4508d64444afe9b85f10aa$nclexmocv6$),
($nclexmocv6$c29629af0189008b5c0d02b05$nclexmocv6$, $nclexmocv6$e41ec06da8227e9bfd4c3a777ac4d356484a89a8343f4bf476a0e7366f44a107$nclexmocv6$),
($nclexmocv6$c3c1745f1388b1e92f829a752$nclexmocv6$, $nclexmocv6$0cf1a9056faab956c8bebd469fbb90f5359a704c82f0115cc7192663e50f201e$nclexmocv6$),
($nclexmocv6$c26a0ff7b922ace428fcdd745$nclexmocv6$, $nclexmocv6$7bb34b5adcbc91f46cb518f8a38f9500ec4c76001650860c2a21de09bb4f20c4$nclexmocv6$),
($nclexmocv6$c90bbcbfac0b05bf410b27e35$nclexmocv6$, $nclexmocv6$2a35c78782e6686eebeb1c4569a6be923f2f33c684f78d07ccf5ae7c248b31bb$nclexmocv6$),
($nclexmocv6$c7a08fdc5e8789a3897fbc660$nclexmocv6$, $nclexmocv6$dcd74f19f031f47423bfcd3b431c7fd7d74b77b9e51a0e28eaac5bb32cb12fa0$nclexmocv6$),
($nclexmocv6$c2041435416b32d85a96272e5$nclexmocv6$, $nclexmocv6$6dabb06bdd52fe3e0f52bf4d5b75030ab8da6e10f28c36054c82ccd93d8d3331$nclexmocv6$),
($nclexmocv6$cbad23a4c617f03ef9f1b684d$nclexmocv6$, $nclexmocv6$db4ed9555c60ed43626983d69f25b392263c91fc54e195520edd48486cb4a0b2$nclexmocv6$),
($nclexmocv6$c20d2179ba4b29f9570cdd364$nclexmocv6$, $nclexmocv6$eba24aa3a22d96812e97db1b91f84f6298fd5eb19392e0893250664759db69fc$nclexmocv6$),
($nclexmocv6$c5e6badbe7f0c33e317542d81$nclexmocv6$, $nclexmocv6$1dd12e4bf4bcc5889056cb8872681f93e54d67daaa93262de42caa42f9aecf04$nclexmocv6$),
($nclexmocv6$cb2c778a5199bb82ff75d38d5$nclexmocv6$, $nclexmocv6$cf4f83718af474dc233704da9bf1a3e5fe9508144c47a5c9e4f8c89c81920bc5$nclexmocv6$),
($nclexmocv6$c4515bbadefd5349f3cb97f50$nclexmocv6$, $nclexmocv6$05a29fa436cbe93787231cf610282edaed64c5822222955b9ebbed18341bb4a8$nclexmocv6$),
($nclexmocv6$c560c084939d3c7510af09c50$nclexmocv6$, $nclexmocv6$972696e755cc988bfd85c0f8d21c1188a4dd0d3a8bbe7192eba2103af8beab6c$nclexmocv6$),
($nclexmocv6$cecb78f127bf979b43ebb0602$nclexmocv6$, $nclexmocv6$60b18292fd607b00c7f88de52c2d91ce6f4df01ceee5c1fd1c7539cbaa8d0f3c$nclexmocv6$),
($nclexmocv6$c1388cb5dd1c47e23f86692e5$nclexmocv6$, $nclexmocv6$562399c13cb3b0ab9d5584a3fd551c6d7bf85ca8cd67c7a9166e5e2cfcda260e$nclexmocv6$),
($nclexmocv6$cb41ebcd2c34e9c3cc8e66b2c$nclexmocv6$, $nclexmocv6$431b8712bd0f6a9357ba2f31fd3c1856672f466e4ae0cfb825ed67ed8220e106$nclexmocv6$),
($nclexmocv6$cd43a0cc1cd6439f5a91b942b$nclexmocv6$, $nclexmocv6$4f7a2ec059d9586632fc6e6d5555aa35b37bd0d55d684663d8393fe9389e63e4$nclexmocv6$),
($nclexmocv6$ca51cdf35a21f30091244c6fb$nclexmocv6$, $nclexmocv6$a8258b5fd36e02b4263e3c05d484dd4b3db6696e3a37276d85e6839e4d8258fc$nclexmocv6$),
($nclexmocv6$cbffa08bca993a371dc599498$nclexmocv6$, $nclexmocv6$81f02abbc6cb314ec75ee49351ca3c3ff1c2ac3a240a49a7ca5c9eaa86485453$nclexmocv6$),
($nclexmocv6$cd2051b57c974bcd1b3a5eeb5$nclexmocv6$, $nclexmocv6$5a9a14afb46022558e743c13c0c638a3792f3637c98b3d3b3c7f43e317807a23$nclexmocv6$),
($nclexmocv6$cd51ffe710213cb4297548604$nclexmocv6$, $nclexmocv6$77b13e844963748753ac370d943cb901f6fb3f47056d1e0b800a2599a3e2d27d$nclexmocv6$),
($nclexmocv6$cd8537a20bb0b1582b0517cd7$nclexmocv6$, $nclexmocv6$de77c5c297658600dea36d7fad5e3b02f2fc49cef06dbd2bb4dab57b5538838f$nclexmocv6$),
($nclexmocv6$c771be3182abea75c31bbbb48$nclexmocv6$, $nclexmocv6$b284a25b75759ef641d2d80f2c44c89de3a5fff3c1be6a2622f7e8a5bb5a2a94$nclexmocv6$),
($nclexmocv6$cf844cf91bac7d60384079071$nclexmocv6$, $nclexmocv6$6a96771b8213655cda8626215d5bdcfef8de4958cfb337a898c00390c1ef9bf1$nclexmocv6$),
($nclexmocv6$c541fe4d1afc0890f2e466f33$nclexmocv6$, $nclexmocv6$d44523514317960ad895df6871c6cc51ce47485ac8c87324499b4165264a5753$nclexmocv6$),
($nclexmocv6$c970869c6399c66f8d554b3f5$nclexmocv6$, $nclexmocv6$7a7b9eb2bbc3c3546d8f082aa6b62057b8672b507a436389e90a79884650151a$nclexmocv6$),
($nclexmocv6$cdee11f8f80ffaddee2848958$nclexmocv6$, $nclexmocv6$0a00e2633c9c7d80f74fb6926fd1b5d720311837dc6dcf44424bf928be273418$nclexmocv6$),
($nclexmocv6$c840270eb5d38316dbe901b7e$nclexmocv6$, $nclexmocv6$272f2b5689c1def7588eb6968de034acc829d32e6ac52e306a8404c66dee446b$nclexmocv6$),
($nclexmocv6$cab0faeb8590247422a27c126$nclexmocv6$, $nclexmocv6$cddca775b22284af712b1a0cfdbb46abe39712f533e62b3244dc5085d6360ae0$nclexmocv6$),
($nclexmocv6$c0484e351a36e112c7f55bd17$nclexmocv6$, $nclexmocv6$38f8b57b9fbc36559cddf93952106a1e4466d558414e6bebe0435b08c7ed5f4c$nclexmocv6$)
) AS v(id, hash) ON v.id = q.id AND v.hash = q."contentHash"
WHERE q.active = true AND q."qaPassed" = true AND q."reviewStatus" = 'approved' )::integer INTO n;
  IF n IS DISTINCT FROM 60 THEN
    RAISE EXCEPTION 'activated pilot rows: expected 60, found %', n;
  END IF;
END
$check$;



DO $check$
DECLARE b moc_v6_dry_baseline%ROWTYPE;
DECLARE all_rows int; active_n int; served int; moc_served int;
BEGIN
  SELECT * INTO b FROM moc_v6_dry_baseline;
  SELECT count(*)::int INTO all_rows FROM "QuestionBankItem";
  SELECT count(*)::int INTO active_n FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active;
  SELECT count(*)::int INTO served FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active AND "qaPassed";
  SELECT count(*)::int INTO moc_served FROM "QuestionBankItem" WHERE "subjectId" = 'management-of-care' AND active AND "qaPassed";
  IF all_rows <> b.all_rows + 60 THEN
    RAISE EXCEPTION 'forward all_rows % expected %', all_rows, b.all_rows + 60;
  END IF;
  IF active_n <> b.active_n - 1 + 60 THEN
    RAISE EXCEPTION 'forward active % expected %', active_n, b.active_n + 59;
  END IF;
  IF served <> b.served - 1 + 60 THEN
    RAISE EXCEPTION 'forward served % expected %', served, b.served + 59;
  END IF;
  IF moc_served <> b.moc_served + 61 THEN
    RAISE EXCEPTION 'forward moc_served % expected % (60 new + item5 #1 retag)', moc_served, b.moc_served + 61;
  END IF;
  IF (SELECT count(*)::int FROM "QuestionBankItem" WHERE id = $nclexmocv6$cmr10qu8s004b1y8a0dec0jwg$nclexmocv6$ AND "subjectId" = 'management-of-care' AND active AND "qaPassed") <> 1 THEN
    RAISE EXCEPTION 'item5 #1 was not retagged into Management of Care';
  END IF;
  IF (SELECT count(*)::int FROM "QuestionBankItem" WHERE id IN ($nclexmocv6$cc32ad23631fdf5e61b7c7532$nclexmocv6$, $nclexmocv6$c07375bc6c73c8a35a86d34a4$nclexmocv6$, $nclexmocv6$cce68108de2a85d091037ef02$nclexmocv6$, $nclexmocv6$c33e391a46b05f148bcee19ce$nclexmocv6$, $nclexmocv6$c56c89825597afcebe6c3d07d$nclexmocv6$, $nclexmocv6$c0e71d73dae1ebf4b29f96dd8$nclexmocv6$, $nclexmocv6$cda49979c786ee698480a2c50$nclexmocv6$, $nclexmocv6$cb5613a4a0ff6390172746769$nclexmocv6$, $nclexmocv6$c3b42b4e57ed73c4e483ca8bf$nclexmocv6$, $nclexmocv6$cd84ec2e33b301266b2fdb81e$nclexmocv6$, $nclexmocv6$ca21e93236bf8bb5e03c81805$nclexmocv6$, $nclexmocv6$c1c028fd663df54d67c162c00$nclexmocv6$, $nclexmocv6$cb2c6bfdbcd95ff94d6fd9fb3$nclexmocv6$, $nclexmocv6$c74d58795d8a23a732a7c086b$nclexmocv6$, $nclexmocv6$c555870efe25d91e5847623a3$nclexmocv6$, $nclexmocv6$c7edf5a2505d52c5aa881e359$nclexmocv6$, $nclexmocv6$c84953a9b935465c840121903$nclexmocv6$, $nclexmocv6$cf38870462969b0caf8df52d9$nclexmocv6$, $nclexmocv6$c838aad32a852e85466dc34ad$nclexmocv6$, $nclexmocv6$c6ae4672605defeb29fc44589$nclexmocv6$, $nclexmocv6$c865c51fbb07fe12c643e0627$nclexmocv6$, $nclexmocv6$cfe3ad49941a9576b112c13d5$nclexmocv6$, $nclexmocv6$c407b78b5015c0f9095f00485$nclexmocv6$, $nclexmocv6$ce03ea29bc1e64249e4c9848a$nclexmocv6$, $nclexmocv6$c62e77ea0c937450ea460baee$nclexmocv6$, $nclexmocv6$c4d7ef9c9ac7188980f4b1557$nclexmocv6$, $nclexmocv6$c255a88eacd6d2b708c3782b7$nclexmocv6$, $nclexmocv6$c1e21bdb6035c9cfc38017f04$nclexmocv6$, $nclexmocv6$c4552c4fa2434cdfd60827754$nclexmocv6$, $nclexmocv6$cc02c17378aaeb4ec2e202b5f$nclexmocv6$, $nclexmocv6$cceccd2112bb739d0845e5a46$nclexmocv6$, $nclexmocv6$c29629af0189008b5c0d02b05$nclexmocv6$, $nclexmocv6$c3c1745f1388b1e92f829a752$nclexmocv6$, $nclexmocv6$c26a0ff7b922ace428fcdd745$nclexmocv6$, $nclexmocv6$c90bbcbfac0b05bf410b27e35$nclexmocv6$, $nclexmocv6$c7a08fdc5e8789a3897fbc660$nclexmocv6$, $nclexmocv6$c2041435416b32d85a96272e5$nclexmocv6$, $nclexmocv6$cbad23a4c617f03ef9f1b684d$nclexmocv6$, $nclexmocv6$c20d2179ba4b29f9570cdd364$nclexmocv6$, $nclexmocv6$c5e6badbe7f0c33e317542d81$nclexmocv6$, $nclexmocv6$cb2c778a5199bb82ff75d38d5$nclexmocv6$, $nclexmocv6$c4515bbadefd5349f3cb97f50$nclexmocv6$, $nclexmocv6$c560c084939d3c7510af09c50$nclexmocv6$, $nclexmocv6$cecb78f127bf979b43ebb0602$nclexmocv6$, $nclexmocv6$c1388cb5dd1c47e23f86692e5$nclexmocv6$, $nclexmocv6$cb41ebcd2c34e9c3cc8e66b2c$nclexmocv6$, $nclexmocv6$cd43a0cc1cd6439f5a91b942b$nclexmocv6$, $nclexmocv6$ca51cdf35a21f30091244c6fb$nclexmocv6$, $nclexmocv6$cbffa08bca993a371dc599498$nclexmocv6$, $nclexmocv6$cd2051b57c974bcd1b3a5eeb5$nclexmocv6$, $nclexmocv6$cd51ffe710213cb4297548604$nclexmocv6$, $nclexmocv6$cd8537a20bb0b1582b0517cd7$nclexmocv6$, $nclexmocv6$c771be3182abea75c31bbbb48$nclexmocv6$, $nclexmocv6$cf844cf91bac7d60384079071$nclexmocv6$, $nclexmocv6$c541fe4d1afc0890f2e466f33$nclexmocv6$, $nclexmocv6$c970869c6399c66f8d554b3f5$nclexmocv6$, $nclexmocv6$cdee11f8f80ffaddee2848958$nclexmocv6$, $nclexmocv6$c840270eb5d38316dbe901b7e$nclexmocv6$, $nclexmocv6$cab0faeb8590247422a27c126$nclexmocv6$, $nclexmocv6$c0484e351a36e112c7f55bd17$nclexmocv6$) AND active AND "qaPassed") <> 60 THEN
    RAISE EXCEPTION 'pilot rows were not all published by activation';
  END IF;
  INSERT INTO moc_v6_dry_log VALUES ('after_insert_hide_activate', all_rows, active_n, served, moc_served);
  RAISE NOTICE 'forward all_rows % -> % (+60)', b.all_rows, all_rows;
  RAISE NOTICE 'forward nursing active % -> % (+59)', b.active_n, active_n;
  RAISE NOTICE 'forward nursing served % -> % (+59)', b.served, served;
  RAISE NOTICE 'forward management-of-care served % -> % (+61)', b.moc_served, moc_served;
END
$check$;

DO $guard$
BEGIN
  IF to_regclass('public.qbi_nclex_moc_v6_activate_20261030') IS NULL THEN
    RAISE EXCEPTION 'activation undo requires qbi_nclex_moc_v6_activate_20261030';
  END IF;
END
$guard$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_moc_v6_activate_20261030)::integer INTO n;
  IF n IS DISTINCT FROM 60 THEN
    RAISE EXCEPTION 'undo activate backup: expected 60, found %', n;
  END IF;
END
$check$;

DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" q SET
    active = b.active,
    "qaPassed" = b."qaPassed",
    "reviewStatus" = b."reviewStatus",
    "lastReviewedAt" = b."lastReviewedAt",
    "qaAuditedAt" = b."qaAuditedAt",
    "updatedAt" = b."updatedAt"
  FROM qbi_nclex_moc_v6_activate_20261030 b
  WHERE q.id = b.id
    AND q."contentHash" = b."contentHash"
    AND q.active = true
    AND q."qaPassed" = true;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 60 THEN
    RAISE EXCEPTION 'undo activation expected 60 rows, found %', n;
  END IF;
END
$do$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM "QuestionBankItem" q
JOIN qbi_nclex_moc_v6_activate_20261030 b ON b.id = q.id
WHERE q.active = b.active
  AND q."qaPassed" = b."qaPassed"
  AND q."reviewStatus" IS NOT DISTINCT FROM b."reviewStatus")::integer INTO n;
  IF n IS DISTINCT FROM 60 THEN
    RAISE EXCEPTION 'activation flags restored: expected 60, found %', n;
  END IF;
END
$check$;


DO $guard$
BEGIN
  IF to_regclass('public.qbi_nclex_item5_ibu_hide_20261030') IS NULL THEN
    RAISE EXCEPTION 'hide undo requires qbi_nclex_item5_ibu_hide_20261030';
  END IF;
END
$guard$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_item5_ibu_hide_20261030)::integer INTO n;
  IF n IS DISTINCT FROM 1 THEN
    RAISE EXCEPTION 'undo hide backup: expected 1, found %', n;
  END IF;
END
$check$;

DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" q SET
  "fieldId" = b."fieldId",
  "subjectId" = b."subjectId",
  "stateCode" = b."stateCode",
  "difficulty" = b."difficulty",
  "topicCategory" = b."topicCategory",
  "blueprintDomain" = b."blueprintDomain",
  "taskCategory" = b."taskCategory",
  "blueprintTopic" = b."blueprintTopic",
  "clientNeeds" = b."clientNeeds",
  "cjmmFunction" = b."cjmmFunction",
  "generationVersion" = b."generationVersion",
  "reviewStatus" = b."reviewStatus",
  "lastReviewedAt" = b."lastReviewedAt",
  "generationMeta" = b."generationMeta",
  "itemType" = b."itemType",
  "stepLevel" = b."stepLevel",
  "patientAgeGroup" = b."patientAgeGroup",
  "scenario" = b."scenario",
  "question" = b."question",
  "options" = b."options",
  "correctAnswer" = b."correctAnswer",
  "explanation" = b."explanation",
  "solutionSteps" = b."solutionSteps",
  "tags" = b."tags",
  "references" = b."references",
  "source" = b."source",
  "contentHash" = b."contentHash",
  "active" = b."active",
  "manual_correction" = b."manual_correction",
  "qaPassed" = b."qaPassed",
  "qaAuditedAt" = b."qaAuditedAt",
  "embedding" = b."embedding",
  "quality_score" = b."quality_score",
  "cluster_id" = b."cluster_id",
  "keep_recommendation" = b."keep_recommendation",
  "review_flag" = b."review_flag",
  "curation_meta" = b."curation_meta",
  "createdAt" = b."createdAt",
  "updatedAt" = b."updatedAt"
  FROM qbi_nclex_item5_ibu_hide_20261030 b
  WHERE q.id = b.id
    AND q."contentHash" = b."contentHash"
    AND q.active = false;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'undo ibuprofen hide expected 1 row, found %', n;
  END IF;
END
$do$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM "QuestionBankItem" q
JOIN qbi_nclex_item5_ibu_hide_20261030 b ON b.id = q.id
WHERE q.active = b.active
  AND q."qaPassed" = b."qaPassed"
  AND q."contentHash" = b."contentHash"
  AND q."correctAnswer" = b."correctAnswer"
  AND q.manual_correction = b.manual_correction)::integer INTO n;
  IF n IS DISTINCT FROM 1 THEN
    RAISE EXCEPTION 'ibuprofen restored: expected 1, found %', n;
  END IF;
END
$check$;


DO $guard$
BEGIN
  IF to_regclass('public.qbi_nclex_moc_v6_insert_20261030') IS NULL OR to_regclass('public.qbi_nclex_item5_v6_rewrite_20261030') IS NULL THEN
    RAISE EXCEPTION 'insert undo requires qbi_nclex_moc_v6_insert_20261030 and qbi_nclex_item5_v6_rewrite_20261030';
  END IF;
END
$guard$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_moc_v6_insert_20261030)::integer INTO n;
  IF n IS DISTINCT FROM 60 THEN
    RAISE EXCEPTION 'undo insert backup: expected 60, found %', n;
  END IF;
END
$check$;

DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_item5_v6_rewrite_20261030)::integer INTO n;
  IF n IS DISTINCT FROM 6 THEN
    RAISE EXCEPTION 'undo rewrite backup: expected 6, found %', n;
  END IF;
END
$check$;

DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" q SET
  "fieldId" = b."fieldId",
  "subjectId" = b."subjectId",
  "stateCode" = b."stateCode",
  "difficulty" = b."difficulty",
  "topicCategory" = b."topicCategory",
  "blueprintDomain" = b."blueprintDomain",
  "taskCategory" = b."taskCategory",
  "blueprintTopic" = b."blueprintTopic",
  "clientNeeds" = b."clientNeeds",
  "cjmmFunction" = b."cjmmFunction",
  "generationVersion" = b."generationVersion",
  "reviewStatus" = b."reviewStatus",
  "lastReviewedAt" = b."lastReviewedAt",
  "generationMeta" = b."generationMeta",
  "itemType" = b."itemType",
  "stepLevel" = b."stepLevel",
  "patientAgeGroup" = b."patientAgeGroup",
  "scenario" = b."scenario",
  "question" = b."question",
  "options" = b."options",
  "correctAnswer" = b."correctAnswer",
  "explanation" = b."explanation",
  "solutionSteps" = b."solutionSteps",
  "tags" = b."tags",
  "references" = b."references",
  "source" = b."source",
  "contentHash" = b."contentHash",
  "active" = b."active",
  "manual_correction" = b."manual_correction",
  "qaPassed" = b."qaPassed",
  "qaAuditedAt" = b."qaAuditedAt",
  "embedding" = b."embedding",
  "quality_score" = b."quality_score",
  "cluster_id" = b."cluster_id",
  "keep_recommendation" = b."keep_recommendation",
  "review_flag" = b."review_flag",
  "curation_meta" = b."curation_meta",
  "createdAt" = b."createdAt",
  "updatedAt" = b."updatedAt"
  FROM qbi_nclex_item5_v6_rewrite_20261030 b
  WHERE q.id = b.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 6 THEN
    RAISE EXCEPTION 'undo rewrites expected 6 rows, found %', n;
  END IF;
END
$do$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM "QuestionBankItem" q
JOIN qbi_nclex_item5_v6_rewrite_20261030 b ON b.id = q.id
WHERE q."contentHash" = b."contentHash"
  AND q."subjectId" = b."subjectId"
  AND q.question = b.question
  AND q.scenario IS NOT DISTINCT FROM b.scenario
  AND q."correctAnswer" = b."correctAnswer"
  AND q.active = b.active
  AND q."qaPassed" = b."qaPassed")::integer INTO n;
  IF n IS DISTINCT FROM 6 THEN
    RAISE EXCEPTION 'rewrites restored: expected 6, found %', n;
  END IF;
END
$check$;

DO $do$
DECLARE n integer;
BEGIN
  DELETE FROM "QuestionBankItem" q
  USING qbi_nclex_moc_v6_insert_20261030 b
  WHERE q.id = b.id
    AND q."contentHash" = b."contentHash"
    AND q.active = false
    AND q."qaPassed" = false
    AND q.active IS NOT DISTINCT FROM b.active
    AND q."qaPassed" IS NOT DISTINCT FROM b."qaPassed";
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 60 THEN
    RAISE EXCEPTION 'undo pilot insert expected to delete 60 held rows, found %. Undo activation first if the pilot was published.', n;
  END IF;
END
$do$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM "QuestionBankItem"
WHERE id IN (SELECT id FROM qbi_nclex_moc_v6_insert_20261030))::integer INTO n;
  IF n IS DISTINCT FROM 0 THEN
    RAISE EXCEPTION 'pilot rows removed: expected 0, found %', n;
  END IF;
END
$check$;



DO $check$
DECLARE b moc_v6_dry_baseline%ROWTYPE;
DECLARE all_rows int; active_n int; served int; moc_served int;
BEGIN
  SELECT * INTO b FROM moc_v6_dry_baseline;
  SELECT count(*)::int INTO all_rows FROM "QuestionBankItem";
  SELECT count(*)::int INTO active_n FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active;
  SELECT count(*)::int INTO served FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active AND "qaPassed";
  SELECT count(*)::int INTO moc_served FROM "QuestionBankItem" WHERE "subjectId" = 'management-of-care' AND active AND "qaPassed";
  IF all_rows <> b.all_rows OR active_n <> b.active_n OR served <> b.served OR moc_served <> b.moc_served THEN
    RAISE EXCEPTION 'undo did not restore baseline all=% active=% served=% moc=%', all_rows, active_n, served, moc_served;
  END IF;
  IF (SELECT count(*)::int FROM "QuestionBankItem" WHERE id = $nclexmocv6$cmr8p5czr00a11y5nwf6lu2yu$nclexmocv6$ AND active = true AND "contentHash" = $nclexmocv6$50e1760f03c15a4605b16c631fbc8f08cdad4b44c141ea73f71f57d0cb6fc6ba$nclexmocv6$) <> 1 THEN
    RAISE EXCEPTION 'ibuprofen row was not restored';
  END IF;
  INSERT INTO moc_v6_dry_log VALUES ('after_undo', all_rows, active_n, served, moc_served);
  RAISE NOTICE 'undo restored all_rows % active % served % moc_served %', all_rows, active_n, served, moc_served;
END
$check$;

SELECT step, all_rows, active_n, served, moc_served FROM moc_v6_dry_log ORDER BY step;

ROLLBACK;
