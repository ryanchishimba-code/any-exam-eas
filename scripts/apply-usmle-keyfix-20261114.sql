-- Key fixes for flagged served USMLE items, 2026-11-14.
-- 6 items. Stems for malignant hypertension and hyperosmolar state.
-- The COPD item's keyed choice changes from high-flow oxygen to a saturation target of 88-92%.
-- References are not changed.
-- Backup qbi_usmle_keyfix_20261114_backup.
-- Undo: scripts/undo-usmle-keyfix-20261114.sql
BEGIN;
CREATE TABLE qbi_usmle_keyfix_20261114_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'cmqxdeovw00a51ymasqxrjtgu',
    'cmqxdepsq00ae1ymayvonhif4',
    'cmqxdeqp600an1ymata96p5ym',
    'cmrrtw84q009o1y8wf8l3trr9',
    'cmqxf0knf00051yf16gxaj63n',
    'cmr4djbw3011o1ykyaabvjr4l'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_keyfix_20261114_backup) <> 6 THEN
    RAISE EXCEPTION 'backup row count %, expected 6', (SELECT COUNT(*) FROM qbi_usmle_keyfix_20261114_backup);
  END IF;
END
$check$;
UPDATE "QuestionBankItem" SET
  "scenario" = $scenario0$A 62-year-old woman with a history of hypertension and hyperlipidemia presents to the emergency department with a blood pressure of 210/130 mm Hg and complaints of severe headache and blurred vision. She is currently taking lisinopril and atorvastatin. On examination, she has bilateral retinal hemorrhages. Laboratory tests reveal a serum creatinine of 1.5 mg/dL and a potassium level of 4.2 mEq/L.$scenario0$,
  "contentHash" = '90b9f6ad01acd0e90aa5cd03ca6d2b51dab7137925f0cbf66b4848118f827171',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmqxdeovw00a51ymasqxrjtgu'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" IN ('usmle-step-1','usmle-step-2','usmle-step-3')
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w0$Malignant hypertension$w0$;
UPDATE "QuestionBankItem" SET
  "scenario" = $scenario1$A 55-year-old woman presents to the emergency department with a blood pressure of 210/130 mm Hg and a heart rate of 95 bpm. She has a history of poorly controlled hypertension and reports severe headaches for the past two days. On examination, she has bilateral retinal hemorrhages. Laboratory tests reveal a serum creatinine of 1.8 mg/dL and a potassium level of 4.5 mEq/L.$scenario1$,
  "contentHash" = '69356bb7608673f97a24891817bf198f3ec9d287d9ecf618c86ea5f9206ff0d7',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmqxdepsq00ae1ymayvonhif4'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" IN ('usmle-step-1','usmle-step-2','usmle-step-3')
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w1$Malignant hypertension$w1$;
UPDATE "QuestionBankItem" SET
  "scenario" = $scenario2$A 62-year-old woman presents to the emergency department with a blood pressure of 210/130 mm Hg and a complaint of severe headache. She has a history of hypertension and is currently taking lisinopril. On examination, she is alert but anxious, and her heart rate is 88 bpm. A fundoscopic exam reveals bilateral retinal hemorrhages.$scenario2$,
  "contentHash" = 'e6f8b74b63582563411d010dfd48de52d6c449cd80ef11df6f3588e66108f0d8',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmqxdeqp600an1ymata96p5ym'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" IN ('usmle-step-1','usmle-step-2','usmle-step-3')
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w2$Malignant hypertension$w2$;
UPDATE "QuestionBankItem" SET
  "scenario" = $scenario3$A 40-year-old woman presents with persistent headaches and visual changes. She has a history of hypertension and is currently taking lisinopril. On examination, her blood pressure is 210/130 mm Hg, and she has bilateral papilledema. Laboratory tests show elevated creatinine levels and proteinuria.$scenario3$,
  "contentHash" = '4465b2fc60871fc2ff44b702182ee3b3e5ff761248e3bc9b021465e80715fd33',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmrrtw84q009o1y8wf8l3trr9'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" IN ('usmle-step-1','usmle-step-2','usmle-step-3')
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w3$Malignant hypertension$w3$;
UPDATE "QuestionBankItem" SET
  "scenario" = $scenario4$A 68-year-old man with a history of chronic obstructive pulmonary disease (COPD) presents to the emergency department with worsening shortness of breath and a productive cough. His vital signs show a respiratory rate of 28 breaths per minute, oxygen saturation of 88% on room air, and a blood pressure of 130/85 mm Hg. A chest X-ray reveals hyperinflation of the lungs, and his arterial blood gas shows a pH of 7.32, pCO2 of 60 mm Hg, and pO2 of 55 mm Hg.$scenario4$,
  "question" = $question4$What is the appropriate oxygen saturation target?$question4$,
  "correctAnswer" = $correctAnswer4$Target oxygen saturation 88–92%$correctAnswer4$,
  explanation = $explanation4$## Why this answer is correct
This patient has a COPD exacerbation with hypercapnic respiratory failure (pH 7.32 and PCO2 60 mm Hg). The oxygen saturation target is 88–92%.
• A saturation target of **88–92%** is used when COPD is complicated by carbon dioxide retention.
• His arterial **PCO2 is 60 mm Hg** and the pH is 7.32, so the target stays in that range.
• **High-flow oxygen** that pushes the saturation above this range can worsen carbon dioxide retention.
**In practice:** Titrate oxygen to 88–92% and repeat the blood gas. Do not use a non-rebreather mask to drive the saturation higher.
## Why the other options are wrong

**Target oxygen saturation 94–98%**
• Trap: 94–98% is the usual target for acutely ill patients who are not retaining carbon dioxide.
• Why it fails here: his PCO2 is 60 mm Hg and the pH is 7.32.
• Remember: do not use 94–98% once hypercapnic respiratory failure is present.

**High-flow oxygen by non-rebreather mask**
• Trap: a non-rebreather mask seems the fastest way to correct a PO2 of 55 mm Hg.
• Why it fails here: uncontrolled high-flow oxygen can raise the saturation above 92% and worsen hypercapnia.
• Remember: oxygen in this setting is titrated, not given at high flow.

**Withhold oxygen until the saturation falls below 80%**
• Trap: his saturation is already 88%, so withholding more oxygen can look harmless.
• Why it fails here: the PO2 is 55 mm Hg and the respiratory rate is 28. He needs controlled oxygen aimed at 88–92%.
• Remember: 88% is the lower edge of the target, not a reason to wait for a dangerous desaturation.
## Key takeaway
**In a COPD exacerbation with hypercapnia, target an oxygen saturation of 88–92%.**

**Memory hook:** Hypercapnic COPD: 88 to 92, not a non-rebreather.$explanation4$,
  options = $options4${"options": ["Target oxygen saturation 94–98%", "Target oxygen saturation 88–92%", "High-flow oxygen by non-rebreather mask", "Withhold oxygen until the saturation falls below 80%"], "distractorRationale": {"Target oxygen saturation 88–92%": "Correct. He has COPD with hypercapnic respiratory failure (pH 7.32, PCO2 60 mm Hg), so the saturation target is 88–92%.", "Target oxygen saturation 94–98%": "Incorrect. A target of 94–98% is for patients who are not retaining carbon dioxide. His PCO2 is 60 mm Hg.", "High-flow oxygen by non-rebreather mask": "Incorrect. A non-rebreather mask is uncontrolled high-flow oxygen and can worsen carbon dioxide retention.", "Withhold oxygen until the saturation falls below 80%": "Incorrect. His PO2 is 55 mm Hg. Give controlled oxygen aimed at 88–92% rather than waiting for a saturation below 80%."}, "clinicalReasoning": "He has a COPD exacerbation with pH 7.32 and PCO2 60 mm Hg. The oxygen saturation target in hypercapnic COPD is 88–92%, not 94–98% and not high-flow oxygen.", "keyTakeaways": ["In a COPD exacerbation with carbon dioxide retention, target an oxygen saturation of 88–92%."], "kind": "lab_interpretation", "taskCategory": "professionalism", "blueprintTopic": "antibiotic-mechanisms", "blueprintSystem": "internal-medicine", "generationMeta": {"model": "gpt-4o-mini", "batchId": "increment-step3-1782627528907", "qcScore": 8.1, "slotIndex": 6, "stepLevel": "step3", "examNumber": 4907, "generatedAt": "2026-06-28T06:23:00.469Z", "pipelineVersion": "gpt-4o-mini-usmle-full-exam-v1"}, "stepLevel": "step3", "physicianTask": "professionalism", "labTable": {"pH": 7.32, "pCO2": 60, "pO2": 55, "Respiratory Rate": 28, "Oxygen Saturation": 88, "Blood Pressure": "130/85"}}$options4$,
  "contentHash" = '613a1471decfd18b22d7efd77410f24a32ffe80fbca0bcf37252431cbe68ca4e',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmqxf0knf00051yf16gxaj63n'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" IN ('usmle-step-1','usmle-step-2','usmle-step-3')
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w4$Administering high-flow oxygen therapy$w4$;
UPDATE "QuestionBankItem" SET
  "scenario" = $scenario5$A 54-year-old man with type 2 diabetes mellitus is brought to the emergency department after 5 days of increasing thirst, frequent urination, and progressive confusion. He takes metformin. He is lethargic, and his mucous membranes are dry. Temperature is 37.2°C, pulse is 110/min, respirations are 18/min, and blood pressure is 100/70 mm Hg. Laboratory studies show a plasma glucose of 720 mg/dL, sodium of 148 mEq/L, bicarbonate of 22 mEq/L, and an effective serum osmolality of 336 mOsm/kg. Urine ketones are negative. The HbA1c is 9.5%.$scenario5$,
  explanation = $explanation5$## Why this answer is correct
The most likely diagnosis is hyperglycemic hyperosmolar state. Glucose is 720 mg/dL and the effective serum osmolality is 336 mOsm/kg, with dehydration and confusion, and without ketoacidosis.
• **Plasma glucose of 720 mg/dL** is severe hyperglycemia, above 600 mg/dL.
• **Effective serum osmolality of 336 mOsm/kg** is above 320 mOsm/kg. It equals 2 × 148 + 720/18.
• **Bicarbonate is 22 mEq/L** and **urine ketones are negative**, so this is not diabetic ketoacidosis.
• Thirst, polyuria, dry mucous membranes, and lethargy are the dehydration and mental-status changes of this state.
**In practice:** HHS is severe hyperglycemia with hyperosmolality and dehydration, without significant ketoacidosis.
## Why the other options are wrong

**Diabetic ketoacidosis (DKA)**
• Trap: both HHS and DKA cause marked hyperglycemia.
• Why it fails here: bicarbonate is 22 mEq/L and urine ketones are negative.
• Remember: DKA has ketoacidosis. This stem does not.

**Type 1 diabetes mellitus**
• Trap: a very high glucose can suggest new type 1 diabetes.
• Why it fails here: he already has type 2 diabetes, and the acute picture is hyperosmolar dehydration rather than a new diabetes type.
• Remember: the question asks for the acute diagnosis.

**Hypoglycemia (a low blood glucose)**
• Trap: confusion can be low glucose.
• Why it fails here: the plasma glucose is 720 mg/dL.
• Remember: this glucose is high, not low.
## Key takeaway
**HHS is glucose above 600 mg/dL with effective osmolality above 320 mOsm/kg, dehydration, and no significant ketoacidosis.**

**Memory hook:** High glucose, high osmolality, no ketones.$explanation5$,
  "contentHash" = '3e470d25d400b8df19f4b9b4647bfb59b0455898f06e4da7b4cf9d4621e27b83',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr4djbw3011o1ykyaabvjr4l'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" IN ('usmle-step-1','usmle-step-2','usmle-step-3')
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w5$Hyperglycemic hyperosmolar state$w5$;
COMMIT;
