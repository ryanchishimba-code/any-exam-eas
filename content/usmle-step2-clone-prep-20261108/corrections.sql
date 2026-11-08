-- DRAFT. Do not run until Ryan approves. No deletes.
-- Teaching corrections for kept clone representatives and sampled citation/tag defects.
-- Hides are in hide.sql. Backup first (backup.sql).

-- Stroke reperfusion keeper. The stored stem never says when symptoms started.
-- This does not invent a last-known-well time in order to keep alteplase as the key.
-- The husband cannot time the onset, so the decision is to establish that time
-- before a thrombolytic. CT has already been done.
UPDATE "QuestionBankItem"
SET
  question = $stem$A 63-year-old woman is brought to the emergency department after her husband found her with right-sided weakness and slurred speech. He did not see the onset, and he cannot say when she was last known to be well. She has atrial fibrillation and is not anticoagulated. Blood pressure is 178/96 mm Hg, heart rate is 88 and irregular, and oxygen saturation is 98% on room air. Examination shows a right hemiparesis, a right facial droop, and dysarthria (NIH Stroke Scale 12). Glucose is 142 mg/dL and INR is 1.1. Noncontrast head CT shows no hemorrhage.

What is the next best step?$stem$,
  "correctAnswer" = $key$Determine the time last known well before any thrombolytic or thrombectomy decision$key$,
  explanation = $exp$The CT has already excluded hemorrhage, and the syndrome is an acute ischemic stroke in atrial fibrillation. A thrombolytic or a thrombectomy decision still depends on the time last known well. That time is not available: her husband found her and cannot say when she was last well. The next step is to establish that time (and vessel imaging as indicated) before any reperfusion drug. Giving alteplase now treats an unknown clock as if it were known. Aspirin does not replace vessel imaging, and imaging has already been done, so deferring it for 24 hours is backward. Systolic pressure of 178 mm Hg is below the usual 185 mm Hg threshold used before alteplase; driving it under 120 mm Hg is not the next step and is not required before the time is known. Lumbar puncture is not the study for this CT-negative focal stroke.

Source for the time requirement: Powers WJ et al. Guidelines for the Early Management of Patients With Acute Ischemic Stroke: 2019 Update to the 2018 Guidelines. Stroke. 2019. https://www.ahajournals.org/doi/10.1161/STR.0000000000000211
The stored key ("evaluate for thrombolysis within time windows") was the least-wrong option on a stem that omitted the clock. It is replaced here rather than preserved by inventing a symptom duration.$exp$,
  options = (
    jsonb_set(
      jsonb_set(
        CASE WHEN left(btrim(options), 1) = '{' THEN options::jsonb ELSE jsonb_build_object('options', options::jsonb) END,
        '{options}',
        $opts$[
          "Determine the time last known well before any thrombolytic or thrombectomy decision",
          "Give intravenous alteplase now because the CT shows no hemorrhage",
          "Start aspirin and defer vessel imaging for 24 hours",
          "Lower systolic blood pressure below 120 mm Hg before a reperfusion decision",
          "Perform a lumbar puncture before treatment"
        ]$opts$::jsonb
      ),
      '{blueprintTopic}',
      '"stroke-management"'::jsonb
    )
  )::text,
  "blueprintTopic" = 'stroke-management',
  "blueprintDomain" = 'behavioral-nervous',
  "subjectId" = 'neurology',
  "references" = $ref$[{"url":"https://www.ahajournals.org/doi/10.1161/STR.0000000000000211","label":"Powers WJ et al. AHA/ASA 2019 guideline for the early management of acute ischemic stroke. Stroke. 2019."}]$ref$::jsonb,
  source = 'clone-prep-draft',
  "updatedAt" = NOW()
WHERE id = 'cmpnjjcsd09cv1ymxcxoj7f5g';

-- Pancreatitis fluids. ACG 2024 suggests moderately aggressive resuscitation.
-- WATERFALL stopped early because the aggressive arm (20 mL/kg then 3 mL/kg/h)
-- caused more fluid overload without a benefit. The other three choices stay wrong.
UPDATE "QuestionBankItem"
SET
  "correctAnswer" = $key$Moderately aggressive lactated Ringer resuscitation (about 1.5 mL/kg/h, with a 10 mL/kg bolus only if hypovolemic), pain control, and early enteral feeding when tolerated$key$,
  options = replace(
    options,
    'Aggressive IV fluids, pain control, monitor for organ failure; NPO initially with early enteral nutrition when tolerated',
    'Moderately aggressive lactated Ringer resuscitation (about 1.5 mL/kg/h, with a 10 mL/kg bolus only if hypovolemic), pain control, and early enteral feeding when tolerated'
  ),
  explanation = replace(
    explanation,
    'Aggressive IV fluids, pain control, and monitoring for organ failure are essential in managing acute pancreatitis.',
    'Moderately aggressive lactated Ringer resuscitation, pain control, and monitoring for organ failure are the initial management of acute pancreatitis. The WATERFALL aggressive protocol (20 mL/kg bolus, then 3 mL/kg/h) increased fluid overload without improving outcomes and is not the regimen to choose.'
  )
  || $add$

Fluid correction: ACG 2024 suggests moderately aggressive isotonic fluid, preferably lactated Ringer, about 1.5 mL/kg/h when the patient is not hypovolemic, and a 10 mL/kg bolus only if hypovolemia is present, with reassessment over the first 6 to 24 hours (https://journals.lww.com/ajg/fulltext/2024/03000/american_college_of_gastroenterology_guidelines_.14.aspx). WATERFALL was stopped because aggressive resuscitation caused more overload (20.5% vs 6.3%) without fewer moderately severe or severe cases (https://www.nejm.org/doi/full/10.1056/NEJMoa2202884). Immediate ERCP for every case of pancreatitis is not indicated without cholangitis or persistent biliary obstruction. Prophylactic antibiotics are not given for mild pancreatitis without infection. Discharge with a lipase recheck in a month does not treat this tachycardic, hypocalcemic presentation.$add$,
  "blueprintTopic" = 'pancreatitis-hepatitis',
  "blueprintDomain" = 'gastrointestinal',
  "subjectId" = 'internal-medicine',
  "references" = $ref$[
    {"url":"https://journals.lww.com/ajg/fulltext/2024/03000/american_college_of_gastroenterology_guidelines_.14.aspx","label":"Tenner S et al. ACG guideline: acute pancreatitis. Am J Gastroenterol. 2024. Recommendations 3 and 4."},
    {"url":"https://www.nejm.org/doi/full/10.1056/NEJMoa2202884","label":"de-Madaria E et al. Aggressive or moderate fluid resuscitation in acute pancreatitis (WATERFALL). N Engl J Med. 2022."}
  ]$ref$::jsonb,
  source = 'clone-prep-draft',
  "updatedAt" = NOW()
WHERE id = 'cmpnjjlxf0awe1ymxp2alr335';

-- Scarlet fever treatment keeper. Penicillin prevents rheumatic fever, not PSGN.
UPDATE "QuestionBankItem"
SET
  question = replace(question, 'desquamating rash in flexural areas', 'sandpaper rash accentuated in the flexural creases'),
  scenario = replace(COALESCE(scenario, ''), 'desquamating rash in flexural areas', 'sandpaper rash accentuated in the flexural creases'),
  explanation = replace(
    replace(
      replace(
        explanation,
        'Treating with penicillin or amoxicillin for 10 days is essential to prevent rheumatic fever and complications.',
        'Penicillin or amoxicillin for 10 days prevents acute rheumatic fever and suppurative complications. It does not prevent poststreptococcal glomerulonephritis.'
      ),
      'In practice, timely treatment with antibiotics can prevent long-term complications in children with streptococcal infections, ensuring better health outcomes.',
      'Penicillin or amoxicillin prevents acute rheumatic fever when given within 9 days of onset. The same treatment does not prevent poststreptococcal glomerulonephritis.'
    ),
    'When treating GAS pharyngitis, always prioritize penicillin or amoxicillin to prevent serious complications.',
    'For group A streptococcal pharyngitis, use penicillin or amoxicillin first if it is tolerated. That course prevents acute rheumatic fever. It does not prevent poststreptococcal glomerulonephritis.'
  )
  || $add$

PSGN correction: IDSA 2012 states that treatment of pharyngitis prevents acute rheumatic fever when started within 9 days, and that treatment does not affect the development of poststreptococcal glomerulonephritis (https://pmc.ncbi.nlm.nih.gov/articles/PMC7108032/). Azithromycin is not first-line when penicillin is tolerated. A sandpaper rash with a positive rapid strep test is not a reason to withhold antibiotics, and corticosteroids do not treat the infection.$add$,
  "blueprintTopic" = 'pediatric-infections',
  "blueprintDomain" = 'human-development',
  "subjectId" = 'pediatrics',
  "references" = $ref$[{"url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC7108032/","label":"Shulman ST et al. IDSA 2012 update: group A streptococcal pharyngitis. Clin Infect Dis. 2012."}]$ref$::jsonb,
  source = 'clone-prep-draft',
  "updatedAt" = NOW()
WHERE id = 'cmpnjjm2x0ax81ymx1p0getp2';

-- Scarlet fever diagnosis keeper. Same PSGN sentence, so the kept pair agrees.
UPDATE "QuestionBankItem"
SET
  question = replace(question, 'desquamating rash in flexural areas', 'sandpaper rash accentuated in the flexural creases'),
  scenario = replace(COALESCE(scenario, ''), 'desquamating rash in flexural areas', 'sandpaper rash accentuated in the flexural creases'),
  explanation = explanation || $add$

PSGN correction: the diagnosis is scarlet fever from group A streptococcus (positive rapid test, sandpaper rash, exudative pharyngitis, circumoral pallor). Antibiotic treatment prevents acute rheumatic fever. It does not prevent poststreptococcal glomerulonephritis (IDSA 2012, https://pmc.ncbi.nlm.nih.gov/articles/PMC7108032/). EBV does not produce this rash with a positive rapid strep test. Kawasaki disease needs several days of fever plus mucocutaneous signs that are absent here. There is no drug exposure to support a drug eruption.$add$,
  "blueprintTopic" = 'pediatric-infections',
  "blueprintDomain" = 'human-development',
  "subjectId" = 'pediatrics',
  "references" = $ref$[{"url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC7108032/","label":"Shulman ST et al. IDSA 2012 update: group A streptococcal pharyngitis. Clin Infect Dis. 2012."}]$ref$::jsonb,
  source = 'clone-prep-draft',
  "updatedAt" = NOW()
WHERE id = 'cmpnjjmed0azw1ymxg4r0vn9i';

-- Scarlet fever mechanism keeper. Distinct decision (toxin mechanism). Retag off labor-delivery.
UPDATE "QuestionBankItem"
SET
  question = replace(question, 'desquamating rash in flexural areas', 'sandpaper rash accentuated in the flexural creases'),
  scenario = replace(COALESCE(scenario, ''), 'desquamating rash in flexural areas', 'sandpaper rash accentuated in the flexural creases'),
  explanation = explanation || $add$

The rash is from streptococcal pyrogenic exotoxin acting as a superantigen. Antibiotic treatment of the pharyngitis prevents acute rheumatic fever and does not prevent poststreptococcal glomerulonephritis (https://pmc.ncbi.nlm.nih.gov/articles/PMC7108032/).$add$,
  "blueprintTopic" = 'pediatric-infections',
  "blueprintDomain" = 'human-development',
  "subjectId" = 'pediatrics',
  "references" = $ref$[{"url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC7108032/","label":"Shulman ST et al. IDSA 2012 update: group A streptococcal pharyngitis. Clin Infect Dis. 2012."}]$ref$::jsonb,
  source = 'clone-prep-draft',
  "updatedAt" = NOW()
WHERE id = 'cmqkgnyd50k98l304pmvigv64';

-- Tag fixes on kept representatives. Topics are catalog slugs already used by the bank.
UPDATE "QuestionBankItem" SET
  "blueprintTopic" = 'aki-ckd-electrolytes',
  "blueprintDomain" = 'respiratory-renal',
  "subjectId" = 'nephrology',
  source = 'clone-prep-draft',
  "updatedAt" = NOW()
WHERE id = 'cmpnjhacg001v1ymxgq5z4o45';

UPDATE "QuestionBankItem" SET
  "subjectId" = 'nephrology',
  "blueprintTopic" = 'aki-ckd-electrolytes',
  "blueprintDomain" = 'respiratory-renal',
  source = 'clone-prep-draft',
  "updatedAt" = NOW()
WHERE id = 'cmpnjjlxf0awo1ymx14o4p17b';

UPDATE "QuestionBankItem" SET
  "subjectId" = 'cardiology',
  "blueprintTopic" = 'chf-management',
  "blueprintDomain" = 'cardiovascular',
  source = 'clone-prep-draft',
  "updatedAt" = NOW()
WHERE id = 'cmpnjhahy001x1ymx3of7522a';

UPDATE "QuestionBankItem" SET
  "subjectId" = 'neurology',
  "blueprintTopic" = 'stroke-management',
  "blueprintDomain" = 'behavioral-nervous',
  source = 'clone-prep-draft',
  "updatedAt" = NOW()
WHERE id = 'cmpnjjm8d0ayy1ymxa4ysrtzj';

UPDATE "QuestionBankItem" SET
  "subjectId" = 'internal-medicine',
  "blueprintTopic" = 'diabetes-dka-management',
  "blueprintDomain" = 'reproductive-endocrine',
  source = 'clone-prep-draft',
  "updatedAt" = NOW()
WHERE id = 'cmpnjjn2v0b2j1ymxi7v5x24r';

UPDATE "QuestionBankItem" SET
  "subjectId" = 'internal-medicine',
  "blueprintTopic" = 'pancreatitis-hepatitis',
  "blueprintDomain" = 'gastrointestinal',
  source = 'clone-prep-draft',
  "updatedAt" = NOW()
WHERE id = 'cmpnjjm2x0axs1ymxb04op7hb';

UPDATE "QuestionBankItem" SET
  "subjectId" = 'emergency-medicine',
  source = 'clone-prep-draft',
  "updatedAt" = NOW()
WHERE id = 'cmpnjjlxf0awj1ymxqx4p6knk';

-- Hashimoto keeper. No Step 2 catalog slug exists for hypothyroidism.
-- thyroid-storm would be a new misfile, so the topic is left for review.
UPDATE "QuestionBankItem" SET
  "subjectId" = 'internal-medicine',
  "blueprintDomain" = 'reproductive-endocrine',
  "references" = $ref$[{"url":"https://www.liebertpub.com/doi/10.1089/thy.2014.0028","label":"Jonklaas J et al. ATA guidelines for the treatment of hypothyroidism. Thyroid. 2014."}]$ref$::jsonb,
  source = 'clone-prep-draft',
  "updatedAt" = NOW()
WHERE id = 'cmq0g7k1800441y4f51z1rb68';

-- Sampled items that are not clones. Tags and citations only, except where noted.

-- STEMI recognition. Topic was nephrotic syndrome. Citation had no URL.
UPDATE "QuestionBankItem" SET
  "blueprintTopic" = 'acs-management',
  "blueprintDomain" = 'cardiovascular',
  "subjectId" = 'cardiology',
  "references" = $ref$[{"url":"https://www.ahajournals.org/doi/10.1161/CIR.0000000000000133","label":"O'Gara PT et al. 2013 ACCF/AHA guideline for STEMI. Circulation. 2013."}]$ref$::jsonb,
  source = 'clone-prep-draft',
  "updatedAt" = NOW()
WHERE id = 'cmtps7us1000f1y1qb9uxwtqm';

-- Primary hypothyroidism. Citation was the USMLE outline. Topic left off thyroid-storm on purpose.
UPDATE "QuestionBankItem" SET
  "subjectId" = 'internal-medicine',
  "blueprintDomain" = 'reproductive-endocrine',
  "references" = $ref$[{"url":"https://www.liebertpub.com/doi/10.1089/thy.2014.0028","label":"Jonklaas J et al. ATA guidelines for the treatment of hypothyroidism. Thyroid. 2014."}]$ref$::jsonb,
  source = 'clone-prep-draft',
  "updatedAt" = NOW()
WHERE id = 'cmrtggal6004l1ydwj9yh6135';

-- Thyrotoxicosis while breastfeeding. Stored citation said Endocrine Society.
-- The supporting document is the 2016 ATA hyperthyroidism guideline, recommendation 1.
UPDATE "QuestionBankItem" SET
  "subjectId" = 'internal-medicine',
  "blueprintDomain" = 'reproductive-endocrine',
  "references" = $ref$[{"url":"https://journals.sagepub.com/doi/full/10.1089/thy.2016.0229","label":"Ross DS et al. 2016 ATA guidelines for hyperthyroidism and thyrotoxicosis. Thyroid. 2016. Recommendation 1."}]$ref$::jsonb,
  source = 'clone-prep-draft',
  "updatedAt" = NOW()
WHERE id = 'cmrqhfmzc002t1ypxxqtf61lq';

-- Burn ice contraindication. Topic burns-management is already the catalog slug.
UPDATE "QuestionBankItem" SET
  "subjectId" = 'emergency-medicine',
  "blueprintDomain" = 'msk-skin',
  "blueprintTopic" = 'burns-management',
  "references" = $ref$[{"url":"https://ameriburn.org/resources/burn-first-aid/","label":"American Burn Association. Burn first aid. Do not apply ice."}]$ref$::jsonb,
  source = 'clone-prep-draft',
  "updatedAt" = NOW()
WHERE id = 'cmtpwsndb003w1y6hmw6qhq59';

-- Cord compression. Topic string stated the answer. Steroid point is CNS 2013, not the ATLS homepage.
UPDATE "QuestionBankItem" SET
  "blueprintTopic" = 'trauma-atls',
  "blueprintDomain" = 'multisystem',
  "references" = $ref$[
    {"url":"https://www.cns.org/about/press-room-detail/congress-of-neurological-surgeions-recommends-agai","label":"CNS/AANS 2013: methylprednisolone is not recommended for acute spinal cord injury."}
  ]$ref$::jsonb,
  source = 'clone-prep-draft',
  "updatedAt" = NOW()
WHERE id = 'f67caecd-6c37-47f2-9deb-23ceec340c58';

-- NMS with an ongoing convulsion. Topic string stated the answer.
-- The tested decision is the first drug for the convulsion (AES 2016).
UPDATE "QuestionBankItem" SET
  "blueprintTopic" = 'seizures-headaches',
  "blueprintDomain" = 'behavioral-nervous',
  "references" = $ref$[{"url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC4749120/","label":"Glauser T et al. AES evidence-based guideline: convulsive status epilepticus. Epilepsy Currents. 2016."}]$ref$::jsonb,
  source = 'clone-prep-draft',
  "updatedAt" = NOW()
WHERE id = '5146ae60-2b9b-4bb4-9fad-5f878a1ca6cb';

-- Postoperative C. difficile. Topic string stated the answer.
-- No CDI catalog slug. pre-post-op-care is the closest existing slug and is imperfect.
UPDATE "QuestionBankItem" SET
  "blueprintTopic" = 'pre-post-op-care',
  "blueprintDomain" = 'multisystem',
  "references" = $ref$[{"url":"https://www.idsociety.org/practice-guideline/clostridioides-difficile-2021-focused-update/","label":"IDSA/SHEA 2021 focused update: fidaxomicin suggested over standard vancomycin for an initial CDI episode. Vancomycin remains acceptable."}]$ref$::jsonb,
  source = 'clone-prep-draft',
  "updatedAt" = NOW()
WHERE id = '7f561a59-a76c-4a59-b8cf-eeb640019d97';

-- First-trimester bleeding. Citation was the USMLE outline, which is not a clinical source.
-- Topic is not forced to labor-delivery or prenatal-care; neither slug is this decision.
UPDATE "QuestionBankItem" SET
  "references" = $ref$[{"url":"https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2018/11/early-pregnancy-loss","label":"ACOG Practice Bulletin 200. Early pregnancy loss. November 2018."}]$ref$::jsonb,
  source = 'clone-prep-draft',
  "updatedAt" = NOW()
WHERE id = 'cmrrbwb1s0014l104xtbm71j4';
