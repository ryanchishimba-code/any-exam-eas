-- DRAFT ONLY. Do not run.
-- These four items were not hidden. The pancreatitis and stroke rows are the
-- kept representatives of clone groups. They are not quality-certified.
-- No timing is invented for the stroke item.

-- Pancreatitis fluids. Keeper cmq33agod01rn1yiur85vh2wi.
-- ACG 2024 suggests moderately aggressive lactated Ringer, about 1.5 mL/kg/h,
-- with a 10 mL/kg bolus only if hypovolemic.
-- https://journals.lww.com/ajg/fulltext/2024/03000/american_college_of_gastroenterology_guidelines_.14.aspx
-- WATERFALL stopped the aggressive arm (20 mL/kg then 3 mL/kg/h) for more
-- fluid overload without fewer moderately severe or severe cases.
-- https://www.nejm.org/doi/full/10.1056/NEJMoa2202884
UPDATE "QuestionBankItem"
SET
  "correctAnswer" = 'Moderately aggressive lactated Ringer (about 1.5 mL/kg/h, 10 mL/kg bolus only if hypovolemic), pain control, and early enteral feeding when tolerated',
  options = replace(
    options,
    'Aggressive IV fluids, pain control, monitor for organ failure; NPO initially with early enteral nutrition when tolerated',
    'Moderately aggressive lactated Ringer (about 1.5 mL/kg/h, 10 mL/kg bolus only if hypovolemic), pain control, and early enteral feeding when tolerated'
  ),
  explanation = $exp$Moderately aggressive lactated Ringer is the initial fluid plan for this alcoholic pancreatitis. ACG 2024 suggests about 1.5 mL/kg/h when the patient is not hypovolemic, and a 10 mL/kg bolus only if hypovolemia is present. The WATERFALL aggressive protocol, a 20 mL/kg bolus then 3 mL/kg/h, caused more fluid overload without improving outcomes.

Immediate ERCP for every case is not indicated. There are no gallstones and no cholangitis. Prophylactic antibiotics are not given for pancreatitis without infection. Discharge with a later lipase check does not treat tachycardia, fever, and hypocalcemia.

Sources: ACG 2024 acute pancreatitis guideline, recommendations on fluid resuscitation. WATERFALL, N Engl J Med 2022.$exp$
WHERE id = 'cmq33agod01rn1yiur85vh2wi';

-- Severe asthma. Not clones. GINA 2025 summary guide, opened:
-- for a severe exacerbation immediately give inhaled SABA, inhaled ipratropium,
-- oxygen, and a systemic corticosteroid. Adult oxygen target 93-95%.
-- Adult prednisolone 40-50 mg for 5-7 days.
-- https://ginasthma.org/wp-content/uploads/2025/11/GINA-Summary-Guide-2025-WEB_FINAL-WMS.pdf
-- PEF 50% of personal best and saturation 88% is severe. Saturation 92% with
-- accessory muscles is also below the adult target and is severe.
UPDATE "QuestionBankItem"
SET
  "correctAnswer" = 'Oxygen titrated to 93-95%, repeated inhaled albuterol, inhaled ipratropium, and prednisone 40-50 mg',
  options = $opts${"options":["Oxygen titrated to 93-95%, repeated inhaled albuterol, inhaled ipratropium, and prednisone 40-50 mg","Nebulized albuterol alone","Oral prednisone alone","Intubate now","Discharge on the current rescue inhaler"]}$opts$,
  explanation = $exp$Both of these patients are in a severe asthma exacerbation. One has a peak flow 50% of personal best and saturation 88%. The other has a respiratory rate of 28, accessory muscles, and saturation 92%. GINA 2025 says to give inhaled short-acting beta agonist, inhaled ipratropium, oxygen, and a systemic corticosteroid immediately. Adult oxygen is titrated to 93-95%. Prednisone or prednisolone is 40-50 mg for 5-7 days.

Albuterol alone, prednisone alone, and discharge leave out parts of that bundle. Intubation is not the first step while the patient is still moving air and has not failed this treatment.$exp$
WHERE id IN ('cmr8g794001q51ylokr7o2c50', 'cmru7tn2o001g1yd6flymj1p0');

-- Stroke keeper cmq33a301007m1yiuntexke7l.
-- The stem says the deficit is sudden and the CT shows no hemorrhage.
-- It does not say when she was last known to be well. No clock is added.
-- AHA/ASA 2019 requires that time before alteplase or a thrombectomy decision.
-- https://www.ahajournals.org/doi/10.1161/STR.0000000000000211
UPDATE "QuestionBankItem"
SET
  question = replace(
    question,
    'What is the next best step in management?',
    'No source can say when she was last known to be well. What is the next best step in management?'
  ),
  "correctAnswer" = 'Determine the time last known well before any thrombolytic or thrombectomy decision',
  options = replace(
    options,
    'Evaluate for IV thrombolysis and/or mechanical thrombectomy within time windows; admit to stroke unit',
    'Determine the time last known well before any thrombolytic or thrombectomy decision'
  ),
  explanation = $exp$The CT has excluded hemorrhage and the syndrome is an acute ischemic stroke in atrial fibrillation. A thrombolytic or thrombectomy decision still depends on the time last known well. That time is not in the history. The next step is to establish it. The stem does not support treating her as if the clock were known.

Aspirin does not replace that step, and the CT has already been done, so deferring imaging is backward. Systolic pressure is 178 mm Hg, below the usual 185 mm Hg threshold used before alteplase. Driving it under 120 mm Hg is not the next step. Lumbar puncture is not the study for this focal, CT-negative deficit.

Source: Powers WJ et al. AHA/ASA 2019 guideline for early management of acute ischemic stroke.$exp$
WHERE id = 'cmq33a301007m1yiuntexke7l';

-- PPV item cmr8n3sfa00qq1ygi57xp7qbq. Proposed hide, not a repair.
-- The stem is measles (fever, rash from the face, conjunctivitis, Koplik spots)
-- and then asks for a positive predictive value. No sensitivity, specificity,
-- or prevalence is stated. The stored explanation invents "about 90%" and an
-- outbreak. Putting numbers in now would fabricate the question. Changing the
-- ask to "measles" would test a different skill. Do not run this hide until
-- it is approved. It is not part of the clone hide already applied.
-- UPDATE "QuestionBankItem"
-- SET active = false, "updatedAt" = NOW()
-- WHERE id = 'cmr8n3sfa00qq1ygi57xp7qbq' AND active = true;
