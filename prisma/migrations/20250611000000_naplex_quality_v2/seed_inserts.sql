-- NAPLEX 2025 seeds (85 items: v2 + calc v3 + area3 v3)
-- Regenerate: npx tsx scripts/generate-naplex-quality-sql.mjs

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacokinetics',
  4,
  'pharmacokinetics',
  'naplex-area1-foundations',
  'case_based',
  'Chart: M.W., 68 y/o man | INR 4.8 (goal 2–3) | PMH: AFib, CKD stage 3 | Meds: warfarin 5 mg daily, amiodarone 200 mg daily (started 2 wk ago) | CYP2C9 *1/*3, VKORC1 AA',
  'Which action is most appropriate today?',
  '{"kind":"case_based","options":["Hold warfarin; recheck INR in 3–5 days; reduce maintenance dose ~30–50%","Continue warfarin 5 mg; add vitamin K 10 mg PO now","Switch to apixaban 5 mg BID without bridging","Increase warfarin to 7.5 mg daily to offset amiodarone"]}',
  'Hold warfarin; recheck INR in 3–5 days; reduce maintenance dose ~30–50%',
  'Amiodarone inhibits CYP2C9 and VKORC1 variants increase sensitivity. Expect supratherapeutic INR after amiodarone initiation; hold or reduce warfarin and monitor closely. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '9208c4a6c361173113564d78d2de5200',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'compounding-calculations',
  3,
  'compounding-calculations',
  'naplex-area1-foundations',
  'constructed_response',
  'Order: D5W 1000 mL + KCl 40 mEq + regular insulin 100 units IV continuous. Pharmacy prepares 250 mL in a 250 mL bag; nurse infuses entire bag over 4 hours.',
  'At what rate (mL/hr) should the nurse set the infusion pump? (Round to the nearest whole number.)',
  '{"kind":"constructed","unit":"mL/hr","acceptUnits":["mL/hr","mL/hr"],"options":["63"]}',
  '63',
  '250 mL ÷ 4 h = 62.5 mL/hr → 63 mL/hr when rounded to a whole number per pump programming. (FDA prescribing information)',
  '["Volume = 250 mL","Time = 4 hours","Rate = 250/4 = 62.5 → 63 mL/hr"]',
  '["naplex","v2","NAPLEX-2025","calculation"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '47c992d41c21f83170e982e40ac3159b',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmaceutics',
  3,
  'pharmaceutics',
  'naplex-area1-foundations',
  'vignette',
  NULL,
  'A community pharmacy prepares a nonsterile hydrocortisone 2% topical cream in a standard USP <795> facility. The beyond-use date (BUD) is primarily determined by:',
  '["The earliest component expiration date, stability data, and storage conditions per USP <795>","Always 14 days regardless of preparation type","The pharmacist''s arbitrary preference if the patient is known","FDA New Drug Application approval date of hydrocortisone"]',
  'The earliest component expiration date, stability data, and storage conditions per USP <795>',
  'USP <795> assigns BUDs based on formulation risk, container, storage, and documented stability—not a single fixed interval. (USP <795> Nonsterile Compounding)',
  NULL,
  '["naplex","v2","NAPLEX-2025"]',
  '[{"label":"USP <795> Nonsterile Compounding","url":"https://www.usp.org"}]'::jsonb,
  'seed',
  '1b2cd6ae6bca33d7b7d277a6e3420248',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'compounding-calculations',
  4,
  'compounding-calculations',
  'naplex-area1-foundations',
  'select_all',
  'Pharmacy technician asks about preparing cefazolin 2 g in 100 mL NS for OR use in a newly certified cleanroom.',
  'Which requirements apply to this sterile preparation? (Select all that apply.)',
  '{"kind":"select_all","options":["Documented garbing, hand hygiene, and ISO-classified compounding environment per USP <797>","Beyond-use dating per stability and risk level (e.g., Category 1/2/3)","May be prepared on the open countertop in the retail waiting area","Environmental monitoring and visual inspection before release","No need for beyond-use dating if refrigerated"],"partialCredit":true}',
  'Documented garbing, hand hygiene, and ISO-classified compounding environment per USP <797>,Beyond-use dating per stability and risk level (e.g., Category 1/2/3),Environmental monitoring and visual inspection before release',
  'Sterile compounding requires USP <797> facilities, garbing, BUD assignment, and quality checks. Open retail areas and skipping BUD are unsafe and noncompliant. (USP <797> Sterile Compounding)',
  NULL,
  '["naplex","v2","NAPLEX-2025","SATA"]',
  '[{"label":"USP <797> Sterile Compounding","url":"https://www.usp.org"}]'::jsonb,
  'seed',
  'ca5a241552b0145dbbc72c69ef94ab10',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacology',
  3,
  'pharmacology',
  'naplex-area1-foundations',
  'case_based',
  'E.R., 34 y/o woman | Rx: levothyroxine 100 mcg daily (generic, A-rated) | Insurance mandates switch to different manufacturer | TSH 8.2 mIU/L (was 1.8 six weeks ago) | Reports taking med fasting',
  'What is the best pharmacist intervention?',
  '{"kind":"case_based","options":["Counsel on consistent brand/generic manufacturer; notify prescriber; recheck TSH in 6–8 weeks","Double dose to 200 mcg until TSH normalizes","Recommend switching to liothyronine monotherapy","Advise taking levothyroxine with breakfast for adherence"]}',
  'Counsel on consistent brand/generic manufacturer; notify prescriber; recheck TSH in 6–8 weeks',
  'Although A-rated generics are bioequivalent population-level, individual variability after manufacturer switch can alter control; ensure consistency and monitor TSH. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  'cfa83b6a9c5e782c691f65a2b9a72268',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmaceutics',
  3,
  'pharmaceutics',
  'naplex-area1-foundations',
  'ordered_response',
  'Outsourced 503B facility ships prefilled syringes of heparin to your hospital pharmacy.',
  'Place verification steps in the correct order before dispensing to the nursing unit:',
  '{"kind":"ordered_response","options":["Quarantine shipment upon receipt","Verify supplier licensure and certificate of analysis","Inspect labeling, beyond-use date, and storage requirements","Document receipt and release from quarantine per policy","Dispense to unit stock with chain-of-custody documentation"]}',
  'Quarantine shipment upon receipt,Verify supplier licensure and certificate of analysis,Inspect labeling, beyond-use date, and storage requirements,Document receipt and release from quarantine per policy,Dispense to unit stock with chain-of-custody documentation',
  'Quarantine first, verify vendor and product integrity, then document release—standard outsourced compounding receipt workflow. (USP <797> Sterile Compounding)',
  NULL,
  '["naplex","v2","NAPLEX-2025","ordered"]',
  '[{"label":"USP <797> Sterile Compounding","url":"https://www.usp.org"}]'::jsonb,
  'seed',
  'f1abb35d3ed64cd5c0856d9c90ab8ed1',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacokinetics',
  3,
  'pharmacokinetics',
  'naplex-area1-foundations',
  'vignette',
  NULL,
  'Rifampin is added to a regimen containing oral contraceptives. The primary pharmacokinetic mechanism increasing contraceptive failure risk is:',
  '["Strong induction of CYP3A4 increasing estrogen/progestin metabolism","Competitive inhibition of CYP2D6","Reduced renal clearance via tubular secretion blockade","Inhibition of P-glycoprotein at the blood–brain barrier only"]',
  'Strong induction of CYP3A4 increasing estrogen/progestin metabolism',
  'Rifampin is a potent CYP3A4 inducer, lowering hormone levels and efficacy of combined hormonal contraception. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  'd4100c3f9c6c3f3ead9e4273fd366728',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacokinetics',
  3,
  'pharmacokinetics',
  'naplex-area1-foundations',
  'exhibit',
  'J.T., 72 y/o woman, 60 kg | SCr 1.6 mg/dL (stable) | For vancomycin dosing estimate',
  'Using Cockcroft–Gault (female), which estimated creatinine clearance (mL/min) is closest?',
  '{"kind":"exhibit","table":{"headers":["Variable","Value"],"rows":[["Age","72 years"],["Weight","60 kg"],["Serum creatinine","1.6 mg/dL"],["Sex","Female"]]},"options":["28 mL/min","38 mL/min","48 mL/min","58 mL/min"]}',
  '38 mL/min',
  'CrCl = [(140−72)×60]/(72×1.6) × 0.85 ≈ 37.9 → 38 mL/min. Guides initial vancomycin dosing and monitoring. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025","exhibit"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '0bdd86ba4c205e20c4f2603bda51df2a',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmaceutics',
  4,
  'pharmaceutics',
  'naplex-area1-foundations',
  'case_based',
  'PN order for home infusion: amino acids + dextrose + lipids. Patient reports room temperature storage overnight during power outage.',
  'Which concern is most critical regarding the lipid emulsion?',
  '{"kind":"case_based","options":["Lipid emulsion instability/separation increasing risk of fat emboli if infused","Immediate hyperkalemia from dextrose crystallization","Loss of all protein content rendering amino acids inactive","Mandatory conversion to oral nutrition without evaluation"]}',
  'Lipid emulsion instability/separation increasing risk of fat emboli if infused',
  'Lipid emulsions require controlled storage; temperature excursions can cause cracking/separation with embolism risk—quarantine and contact manufacturer/supplier. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  'ca122cacc07836c459d7e7ce72d89d13',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacology',
  3,
  'pharmacology',
  'naplex-area1-foundations',
  'drag_drop',
  NULL,
  'Match each dosage form to its most appropriate primary route:',
  '{"kind":"drag_drop","prompts":["Nitroglycerin sublingual tablet","Metformin ER tablet","Albuterol HFA inhaler","Hydrocortisone 1% cream"],"options":["Sublingual","Oral","Inhalation","Topical","Transdermal","Intravenous bolus"]}',
  'Nitroglycerin sublingual tablet|||Sublingual,Metformin ER tablet|||Oral,Albuterol HFA inhaler|||Inhalation,Hydrocortisone 1% cream|||Topical',
  'Each formulation targets optimal absorption site: SL for rapid NTG, oral ER for metformin, inhalation for bronchodilation, topical for local dermatologic effect.',
  NULL,
  '["naplex","v2","NAPLEX-2025","matching"]',
  NULL,
  'seed',
  '0c716cd8d7b7ac1ac4f9a9d8d804efdb',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacology',
  4,
  'pharmacology',
  'naplex-area1-foundations',
  'case_based',
  'L.K., 28 y/o pregnant woman (12 wk GA) | UTI symptoms | PMH: none | Allergy: NKDA | Current meds: prenatal vitamins',
  'Which empiric antibiotic choice is generally most appropriate pending culture?',
  '{"kind":"case_based","options":["Nitrofurantoin (avoid near term/delivery)","Trimethoprim–sulfamethoxazole in 1st trimester","Doxycycline","Ciprofloxacin routine first-line"]}',
  'Nitrofurantoin (avoid near term/delivery)',
  'Nitrofurantoin is commonly used in 2nd/early 3rd trimester for uncomplicated cystitis; avoid TMP-SMX in 1st trimester and fluoroquinolones/tetracyclines in pregnancy. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '4daa65c1d28f9c5d8756c637f9e3b334',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'compounding-calculations',
  3,
  'compounding-calculations',
  'naplex-area1-foundations',
  'constructed_response',
  'Rx: amoxicillin suspension 400 mg/5 mL. Sig: 45 mg/kg/day PO divided BID. Child weighs 18 kg.',
  'How many milliliters (mL) should be dispensed for a 10-day supply? (Round to the nearest whole mL.)',
  '{"kind":"constructed","unit":"mL","acceptUnits":["mL","mL"],"options":["101"]}',
  '101',
  'Daily dose = 45 mg/kg × 18 kg = 810 mg/day. Each BID dose = 405 mg → 405/400 × 5 mL = 5.06 mL per dose. Twenty doses in 10 days ≈ 101 mL total. (FDA prescribing information)',
  '["810 mg/day total","405 mg per BID dose","5.06 mL per dose × 20 doses ≈ 101 mL"]',
  '["naplex","v2","NAPLEX-2025","calculation"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  'b7597a486facea8542a08bfeee440b8d',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacology',
  5,
  'pharmacology',
  'naplex-area2-therapeutics',
  'case_based',
  'D.M., 55 y/o man | QTc 512 ms on ECG | Meds: fluconazole 400 mg daily (day 3), ondansetron PRN, citalopram 40 mg daily | K+ 3.2 mEq/L',
  'Which intervention is highest priority?',
  '{"kind":"case_based","options":["Hold citalopram and fluconazole; correct hypokalemia; review QT-prolonging agents","Increase citalopram to 60 mg for depression control","Add azithromycin for atypical coverage","Continue all meds; repeat ECG in one month"]}',
  'Hold citalopram and fluconazole; correct hypokalemia; review QT-prolonging agents',
  'Multiple QT-prolonging agents plus hypokalemia substantially raise torsades risk; discontinue nonessential offenders and replete potassium. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  'c3db814cc46615883b36f888adb7a2b6',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'patient-counseling',
  4,
  'patient-counseling',
  'naplex-area2-therapeutics',
  'select_all',
  'R.S., 70 y/o woman asks about Shingrix after completing chemotherapy 3 months ago.',
  'Which counseling points are appropriate? (Select all that apply.)',
  '{"kind":"select_all","options":["Recombinant (non-live) vaccine preferred over live zoster vaccine in immunocompromised patients","Two-dose series IM, typically 2–6 months apart","May administer per ACIP if immune function deemed adequate by treating clinician","Contraindicated in all patients ever receiving chemotherapy","Provides 100% lifetime immunity after dose 1"],"partialCredit":true}',
  'Recombinant (non-live) vaccine preferred over live zoster vaccine in immunocompromised patients,Two-dose series IM, typically 2–6 months apart,May administer per ACIP if immune function deemed adequate by treating clinician',
  'Shingrix is non-live and often appropriate after immunosuppression resolves per clinician judgment; it is a 2-dose series, not lifelong after one dose. (ACIP/CDC immunization guidance)',
  NULL,
  '["naplex","v2","NAPLEX-2025","SATA"]',
  '[{"label":"ACIP/CDC immunization guidance","url":"https://www.cdc.gov/vaccines"}]'::jsonb,
  'seed',
  '2006d19e9cebb54e649438184ec70405',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacology',
  3,
  'pharmacology',
  'naplex-area2-therapeutics',
  'ordered_response',
  'Hospital discharge for heart failure patient with 12 home medications.',
  'Order medication reconciliation steps from first to last:',
  '{"kind":"ordered_response","options":["Obtain best possible medication history (BPMH)","Compare BPMH to discharge orders and resolve discrepancies","Provide patient/caregiver medication list and counseling","Communicate finalized list to community pharmacy and PCP","Document reconciliation in the medical record"]}',
  'Obtain best possible medication history (BPMH),Compare BPMH to discharge orders and resolve discrepancies,Provide patient/caregiver medication list and counseling,Communicate finalized list to community pharmacy and PCP,Document reconciliation in the medical record',
  'Med rec begins with accurate history, resolves discrepancies, educates the patient, communicates across transitions, and documents—Joint Commission core activity.',
  NULL,
  '["naplex","v2","NAPLEX-2025","ordered"]',
  NULL,
  'seed',
  'b8b4c43efbea3da490b176ae4ee1e435',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacology',
  4,
  'pharmacology',
  'naplex-area2-therapeutics',
  'case_based',
  'MTM visit: A.B., 62 y/o | T2DM, HTN, hyperlipidemia | A1c 9.1%, BP 148/92, LDL 142 | Meds: metformin 1 g BID, glipizide 10 mg BID, lisinopril 20 mg, atorvastatin 20 mg',
  'Which MTM recommendation is most aligned with comprehensive care?',
  '{"kind":"case_based","options":["Recommend SGLT2 inhibitor or GLP-1 RA with cardiorenal benefit; uptitrate statin; assess hypoglycemia risk from sulfonylurea","Add second sulfonylurea for A1c","Discontinue metformin due to A1c > 9%","Stop atorvastatin to reduce pill burden"]}',
  'Recommend SGLT2 inhibitor or GLP-1 RA with cardiorenal benefit; uptitrate statin; assess hypoglycemia risk from sulfonylurea',
  'Uncontrolled T2DM with CV risk warrants therapy intensification per ADA (GLP-1 RA/SGLT2i), statin optimization, and sulfonylurea hypoglycemia counseling. (ADA Standards of Care in Diabetes)',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  '[{"label":"ADA Standards of Care in Diabetes","url":"https://diabetesjournals.org/care"}]'::jsonb,
  'seed',
  '83c60558903d90891aec4bba9d79e53c',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacology',
  3,
  'pharmacology',
  'naplex-area2-therapeutics',
  'vignette',
  NULL,
  'A prescriber calls for iPLEDGE-compliant isotretinoin dispensing. The pharmacist must verify:',
  '["Active enrollment, negative pregnancy test windows, contraception counseling, and REMS authorization before each fill","Only that the patient is ≥ 18 years old","A single pregnancy test at therapy start only","Pharmacy intern may bypass documentation if urgent"]',
  'Active enrollment, negative pregnancy test windows, contraception counseling, and REMS authorization before each fill',
  'Isotretinoin REMS (iPLEDGE) requires program enrollment, pregnancy prevention, and verified authorization each dispensing cycle. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '727b411771740256875b1e64b46e9a9c',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'infectious-disease-rx',
  4,
  'infectious-disease-rx',
  'naplex-area2-therapeutics',
  'case_based',
  'ICU: vancomycin 1 g q12h × 4 days | SCr rose 1.0 → 1.8 mg/dL | trough 28 mcg/mL | organism MRSA bacteremia',
  'What is the best pharmacist recommendation?',
  '{"kind":"case_based","options":["Extend interval or reduce dose; recheck trough/SCr; target AUC/MIC where feasible","Continue 1 g q12h; trough 28 is therapeutic","Switch to oral linezolid immediately without susceptibility review","Add gentamicin synergy routinely"]}',
  'Extend interval or reduce dose; recheck trough/SCr; target AUC/MIC where feasible',
  'Trough 28 mcg/mL with rising SCr suggests toxicity risk; adjust dosing and monitor per institutional PK protocol. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '82be2b801d9eb29f12d60f08504f9bb6',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacokinetics',
  3,
  'pharmacokinetics',
  'naplex-area2-therapeutics',
  'constructed_response',
  'Gentamicin 5 mg/kg IV once daily. Patient weight 80 kg. Pharmacy supplies 80 mg/mL concentration.',
  'What volume (mL) should be drawn for the dose? (Round to one decimal place.)',
  '{"kind":"constructed","unit":"mL","acceptUnits":["mL","mL"],"options":["5.0"]}',
  '5.0',
  'Dose = 5 mg/kg × 80 kg = 400 mg. Volume = 400 mg ÷ 80 mg/mL = 5.0 mL. (FDA prescribing information)',
  '["400 mg total dose","400 ÷ 80 = 5.0 mL"]',
  '["naplex","v2","NAPLEX-2025","calculation"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '4d7353bbd5e9c868c078ab979a070187',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacology',
  3,
  'pharmacology',
  'naplex-area2-therapeutics',
  'drag_drop',
  NULL,
  'Match the drug pair to the interaction mechanism:',
  '{"kind":"drag_drop","prompts":["Carbamazepine + oral contraceptive","Potassium-sparing diuretic + ACE inhibitor","MAOI + meperidine","Warfarin + NSAID"],"options":["CYP3A4 induction","Hyperkalemia risk","Serotonin syndrome","GI bleed + INR elevation","Competitive renal tubular antagonism of penicillin","Beta-blockade unopposed alpha"]}',
  'Carbamazepine + oral contraceptive|||CYP3A4 induction,Potassium-sparing diuretic + ACE inhibitor|||Hyperkalemia risk,MAOI + meperidine|||Serotonin syndrome,Warfarin + NSAID|||GI bleed + INR elevation',
  'Each pair reflects classic high-risk interaction mechanisms tested on NAPLEX. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025","matching"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '04ca3423f6409f48cfc798ecb5dd86d2',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacology',
  3,
  'pharmacology',
  'naplex-area2-therapeutics',
  'vignette',
  'Patient picking up extended-release oxycodone. State law requires consultation.',
  'Which opioid safety counseling is most essential?',
  '["Risks of respiratory depression, avoid alcohol/benzodiazepines, naloxone access, safe storage/disposal","Take extra dose if pain score is 1/10","Crush tablets if swallowing difficulty","Share unused tablets with family member with pain"]',
  'Risks of respiratory depression, avoid alcohol/benzodiazepines, naloxone access, safe storage/disposal',
  'Opioid REMS-aligned counseling emphasizes respiratory risk, concomitant CNS depressants, naloxone, and misuse prevention. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '55af7944eaba4bc640297729203211bf',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacology',
  4,
  'pharmacology',
  'naplex-area2-therapeutics',
  'select_all',
  'Community pharmacist final verification before release to patient.',
  'Which actions reduce dispensing errors? (Select all that apply.)',
  '{"kind":"select_all","options":["Barcode or NDC verification against prescription","Prospective drug utilization review for interactions/dose","Use tall-man lettering for look-alike/sound-alike names","Skip counseling for chronic refills to save time","Independent double-check for high-alert medications when policy requires"],"partialCredit":true}',
  'Barcode or NDC verification against prescription,Prospective drug utilization review for interactions/dose,Use tall-man lettering for look-alike/sound-alike names,Independent double-check for high-alert medications when policy requires',
  'Verification, DUR, LASA precautions, and high-alert double-checks are core dispensing safety; skipping counseling increases risk. (ISMP High-Alert Medications)',
  NULL,
  '["naplex","v2","NAPLEX-2025","SATA"]',
  '[{"label":"ISMP High-Alert Medications","url":"https://www.ismp.org"}]'::jsonb,
  'seed',
  '2ba0673b7b3454c2afa18da154558d10',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'endocrine-rx',
  4,
  'endocrine-rx',
  'naplex-area2-therapeutics',
  'case_based',
  'T1DM patient requests insulin pump supplies. A1c 7.4%. Reports frequent 3 AM hypoglycemia on basal-bolus MDI.',
  'Which recommendation is most appropriate?',
  '{"kind":"case_based","options":["Discuss CGM integration and basal rate adjustment; ensure pump training and sick-day rules","Stop all basal insulin when starting pump","Recommend pump only if A1c > 10%","Switch to sulfonylurea to reduce nocturnal lows"]}',
  'Discuss CGM integration and basal rate adjustment; ensure pump training and sick-day rules',
  'Pump therapy with CGM can address nocturnal hypoglycemia via basal tailoring; requires structured education and continued basal delivery. (ADA Standards of Care in Diabetes)',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  '[{"label":"ADA Standards of Care in Diabetes","url":"https://diabetesjournals.org/care"}]'::jsonb,
  'seed',
  'e0968637467a52af4fce5016389024ba',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacology',
  3,
  'pharmacology',
  'naplex-area2-therapeutics',
  'ordered_response',
  'New high-alert medication policy for neuromuscular blockers in pharmacy.',
  'Order implementation steps:',
  '{"kind":"ordered_response","options":["Identify high-alert products per ISMP list","Define independent double-check workflow","Train staff and post auxiliary labels","Audit compliance quarterly","Update electronic alerts in dispensing software"]}',
  'Identify high-alert products per ISMP list,Define independent double-check workflow,Update electronic alerts in dispensing software,Train staff and post auxiliary labels,Audit compliance quarterly',
  'Identify → engineer workflow/alerts → train → audit is a standard medication safety implementation sequence. (ISMP High-Alert Medications)',
  NULL,
  '["naplex","v2","NAPLEX-2025","ordered"]',
  '[{"label":"ISMP High-Alert Medications","url":"https://www.ismp.org"}]'::jsonb,
  'seed',
  '72259d71ef53d12f8ce6093ffde96271',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacology',
  3,
  'pharmacology',
  'naplex-area2-therapeutics',
  'exhibit',
  'Patient on aminoglycoside therapy — pharmacist reviews levels',
  'Based on the exhibit, which dosing adjustment is most appropriate?',
  '{"kind":"exhibit","table":{"headers":["Time","Level","Reference"],"rows":[["Peak (30 min post-dose)","38 mcg/mL","Target peak 30–40 (indicative)"],["Trough (pre-dose)","2.8 mcg/mL","Target trough < 1 for extended interval"],["SCr","Stable","—"]]},"options":["Extend interval; trough elevated for once-daily strategy","Increase dose to raise trough to 5 mcg/mL","No change; both values optimal","Switch to TID dosing without levels"]}',
  'Extend interval; trough elevated for once-daily strategy',
  'Elevated trough with acceptable peak suggests accumulation; extend interval or reduce dose while monitoring renal function. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025","exhibit"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '09e9c197d1d998ee8e92ac40c71b8673',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'cardiovascular-rx',
  4,
  'cardiovascular-rx',
  'naplex-area3-treatment-planning',
  'case_based',
  'H.F., 66 y/o man | HFrEF EF 30% | BP 102/64 | HR 88 | SCr 1.4 | K+ 4.3 | Meds: lisinopril 10 mg, metoprolol succinate 50 mg, furosemide 40 mg BID | Still dyspneic climbing stairs',
  'Which add-on is most guideline-concordant if BP tolerates?',
  '{"kind":"case_based","options":["Initiate spironolactone (eplerenone if hyperkalemia concern) with K+/SCr monitoring","Add nondihydropyridine CCB","Start thiazolidinedione","Discontinue ACE inhibitor to allow vasodilator"]}',
  'Initiate spironolactone (eplerenone if hyperkalemia concern) with K+/SCr monitoring',
  'ACC/AHA HF guideline recommends MRA in symptomatic HFrEF on ACEi/ARB + beta-blocker with monitoring of potassium and renal function. (ACC/AHA Heart Failure Guideline)',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  '[{"label":"ACC/AHA Heart Failure Guideline","url":"https://www.acc.org"}]'::jsonb,
  'seed',
  '9d71e5ad098b1e76b1590b7f678e33a6',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'endocrine-rx',
  4,
  'endocrine-rx',
  'naplex-area3-treatment-planning',
  'case_based',
  'S.P., 45 y/o woman | BMI 34 | New T2DM | A1c 8.0% | ASCVD risk elevated | eGFR 72 | No heart failure',
  'Which initial pharmacotherapy best addresses glycemic and cardiometabolic goals?',
  '{"kind":"case_based","options":["Metformin plus GLP-1 RA with demonstrated CV benefit","Basal insulin as first-line","Sulfonylurea monotherapy","Pioglitazone monotherapy"]}',
  'Metformin plus GLP-1 RA with demonstrated CV benefit',
  'ADA recommends metformin first-line plus GLP-1 RA or SGLT2i when ASCVD/CKD/HF comorbidity exists. (ADA Standards of Care in Diabetes)',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  '[{"label":"ADA Standards of Care in Diabetes","url":"https://diabetesjournals.org/care"}]'::jsonb,
  'seed',
  '485d95077b3f5df42efe2a8151d1dc40',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'cardiovascular-rx',
  4,
  'cardiovascular-rx',
  'naplex-area3-treatment-planning',
  'select_all',
  'Atrial fibrillation stroke prevention consult | CHA₂DS₂-VASc 3 | HAS-BLED 2 | Age 74 | on omeprazole for GERD',
  'Which statements about anticoagulation are correct? (Select all that apply.)',
  '{"kind":"select_all","options":["Oral anticoagulation is generally indicated for stroke prevention with CHA₂DS₂-VASc ≥ 2 in men","Apixaban dose reduction may apply if ≥ 2 of: age ≥ 80, weight ≤ 60 kg, SCr ≥ 1.5","Aspirin 81 mg alone is preferred over anticoagulation","Bleeding risk warrants monitoring, not automatic omission of anticoagulation in most","Dabigatran requires renal dose adjustment at lower GFR"],"partialCredit":true}',
  'Oral anticoagulation is generally indicated for stroke prevention with CHA₂DS₂-VASc ≥ 2 in men,Apixaban dose reduction may apply if ≥ 2 of: age ≥ 80, weight ≤ 60 kg, SCr ≥ 1.5,Bleeding risk warrants monitoring, not automatic omission of anticoagulation in most,Dabigatran requires renal dose adjustment at lower GFR',
  'Stroke prevention favors anticoagulation when indicated; HAS-BLED informs monitoring. DOAC dosing depends on age, weight, and renal function. (ACC/AHA Heart Failure Guideline)',
  NULL,
  '["naplex","v2","NAPLEX-2025","SATA"]',
  '[{"label":"ACC/AHA Heart Failure Guideline","url":"https://www.acc.org"}]'::jsonb,
  'seed',
  'b9c003b54f679869a6ba244bcc835c78',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'infectious-disease-rx',
  4,
  'infectious-disease-rx',
  'naplex-area3-treatment-planning',
  'case_based',
  'Outpatient: 22 y/o woman | dysuria, frequency | No fever/flank pain | Not pregnant | No sulfa allergy | PMH: UTI × 2 this year',
  'Best empiric therapy for uncomplicated cystitis?',
  '{"kind":"case_based","options":["Nitrofurantoin macrocrystals 100 mg BID × 5 days","Ciprofloxacin 500 mg BID × 7 days first-line","IV ceftriaxone","Metronidazole 500 mg TID"]}',
  'Nitrofurantoin macrocrystals 100 mg BID × 5 days',
  'IDSA/UTI guidelines favor nitrofurantoin, TMP-SMX, or fosfomycin; fluoroquinolones reserved for resistance or intolerance. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  'eb88bf7aa871d5d12dc4b526647ca069',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'cns-rx',
  4,
  'cns-rx',
  'naplex-area3-treatment-planning',
  'case_based',
  'M.T., 29 y/o man | MDD partial response | On sertraline 150 mg × 8 wk | PHQ-9 still 14 | No mania, no substance use',
  'Most appropriate next step?',
  '{"kind":"case_based","options":["Augment with bupropion or switch per shared decision-making; assess adherence and adverse effects","Stop sertraline; start clozapine","Add MAOI without washout","Double sertraline to 300 mg immediately"]}',
  'Augment with bupropion or switch per shared decision-making; assess adherence and adverse effects',
  'Partial SSRI response warrants adherence review then augmentation/switch per APA guidelines; avoid unsafe combinations.',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  NULL,
  'seed',
  'c51027713acc5cbd4acda5dbf96ffc31',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'compounding-calculations',
  3,
  'compounding-calculations',
  'naplex-area3-treatment-planning',
  'constructed_response',
  'Pediatric liquid: dose 0.3 mEq/kg of elemental calcium. Child 10 kg. Product: calcium gluconate 10% (0.465 mEq Ca²⁺/mL).',
  'How many mL provide the single dose? (Round to one decimal.)',
  '{"kind":"constructed","unit":"mL","acceptUnits":["mL","mL"],"options":["6.5"]}',
  '6.5',
  'Elemental need = 0.3 mEq/kg × 10 kg = 3 mEq. Volume = 3 ÷ 0.465 ≈ 6.45 → 6.5 mL. (FDA prescribing information)',
  '["3 mEq needed","3 / 0.465 = 6.45 mL"]',
  '["naplex","v2","NAPLEX-2025","calculation"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '1c94848f75dc725f907779d096e1a65c',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'cardiovascular-rx',
  4,
  'cardiovascular-rx',
  'naplex-area3-treatment-planning',
  'case_based',
  'COPD GOLD D | FEV₁ 38% | 2 exacerbations last year | on LAMA monotherapy | still breathless daily',
  'Which step-up is most appropriate?',
  '{"kind":"case_based","options":["Add LABA (or LABA/LAMA if not on combo); consider ICS if eosinophils elevated/frequent exacerbations","Oral prednisone daily maintenance","Stop bronchodilator; start benzonatate only","High-dose systemic beta-blocker for HR control"]}',
  'Add LABA (or LABA/LAMA if not on combo); consider ICS if eosinophils elevated/frequent exacerbations',
  'GOLD recommends bronchodilator escalation (LAMA+LABA) before ICS; ICS added selectively for exacerbation phenotype. (GOLD COPD Report)',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  '[{"label":"GOLD COPD Report","url":"https://goldcopd.org"}]'::jsonb,
  'seed',
  '94e411c93b40fe288b8f0a1806bf2fac',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'patient-counseling',
  4,
  'patient-counseling',
  'naplex-area3-treatment-planning',
  'select_all',
  'Newly diagnosed HIV patient starting Biktarvy (BIC/TAF/FTC).',
  'Which counseling points apply? (Select all that apply.)',
  '{"kind":"select_all","options":["Take one tablet daily with or without food","Do not miss doses — resistance can develop","Review drug interactions (e.g., rifampin, certain supplements)","Safe to stop when viral load undetectable for 1 week","Renal/hepatic monitoring per guideline"],"partialCredit":true}',
  'Take one tablet daily with or without food,Do not miss doses — resistance can develop,Review drug interactions (e.g., rifampin, certain supplements),Renal/hepatic monitoring per guideline',
  'ART requires high adherence; stopping early risks resistance. Biktarvy is once daily; monitor organ function and interactions. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025","SATA"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '6b134f3077e15cca69f2c5e635ed5e23',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'infectious-disease-rx',
  4,
  'infectious-disease-rx',
  'naplex-area3-treatment-planning',
  'case_based',
  'Hospital: febrile neutropenia | ANC 200 | empiric piperacillin–tazobactam started | day 2 still febrile',
  'Best pharmacist recommendation?',
  '{"kind":"case_based","options":["Assess culture data, fungal coverage need, vancomycin indication, and local antibiogram per IDSA febrile neutropenia guidance","Discontinue all antibiotics if afebrile 4 hours","Switch to oral amoxicillin","Add metronidazole for all patients routinely"]}',
  'Assess culture data, fungal coverage need, vancomycin indication, and local antibiogram per IDSA febrile neutropenia guidance',
  'Persistent fever in neutropenia requires reassessment of spectrum, resistant organisms, and fungal coverage—not premature de-escalation.',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  NULL,
  'seed',
  '83c02ddb76af83f90d1b79820adf7614',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'patient-counseling',
  3,
  'patient-counseling',
  'naplex-area3-treatment-planning',
  'ordered_response',
  'Pharmacist-led inhaler technique teach-back for new asthma patient.',
  'Order counseling sequence:',
  '{"kind":"ordered_response","options":["Assess current technique and adherence barriers","Demonstrate priming, actuation, and spacer use if applicable","Have patient return-demonstration","Document technique and schedule follow-up","Provide written action plan and when to seek care"]}',
  'Assess current technique and adherence barriers,Demonstrate priming, actuation, and spacer use if applicable,Have patient return-demonstration,Provide written action plan and when to seek care,Document technique and schedule follow-up',
  'Assess → demonstrate → teach-back → action plan → document mirrors effective inhaler counseling.',
  NULL,
  '["naplex","v2","NAPLEX-2025","ordered"]',
  NULL,
  'seed',
  'a19fa65e8dc1337d8a316de9d9f4062d',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'endocrine-rx',
  5,
  'endocrine-rx',
  'naplex-area3-treatment-planning',
  'case_based',
  'Graves disease on methimazole 10 mg daily | TSH 0.01 | FT4 elevated | 6 wk pregnant (unplanned)',
  'Most appropriate recommendation to prescriber?',
  '{"kind":"case_based","options":["Switch to propylthiouracil in 1st trimester per guideline; plan postpartum switch; monitor liver/thyroid","Continue methimazole — safest in 1st trimester","Stop all antithyroid drugs immediately","Add levothyroxine to suppress TSH only"]}',
  'Switch to propylthiouracil in 1st trimester per guideline; plan postpartum switch; monitor liver/thyroid',
  'PTU preferred in 1st trimester due to methimazole teratogenicity signal; MMI often used after 1st trimester. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  'f84bf87b3214856d6433e1e37fd08f38',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'otc-self-care',
  3,
  'otc-self-care',
  'naplex-area3-treatment-planning',
  'vignette',
  'Parent asks for pediatric cough/cold OTC for 4-year-old with runny nose only.',
  'Best pharmacist response?',
  '["Avoid cough/cold combination products in children < 6 years; recommend humidification, hydration, saline","Recommend adult formulation at half dose","Dispense codeine-containing syrup PRN","Combine first-generation antihistamine + decongestant routinely"]',
  'Avoid cough/cold combination products in children < 6 years; recommend humidification, hydration, saline',
  'FDA/public health guidance discourages OTC cough/cold in young children due to safety concerns; non-drug measures preferred. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  'bc760f467fcba772bba580028a9c7f8e',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'cardiovascular-rx',
  4,
  'cardiovascular-rx',
  'naplex-area3-treatment-planning',
  'case_based',
  'Post-MI patient | LDL 118 on atorvastatin 40 mg | ASCVD very high risk | tolerating therapy',
  'Best lipid management plan?',
  '{"kind":"case_based","options":["Intensify to high-intensity statin (e.g., atorvastatin 80 or add ezetimibe) targeting ≥ 50% LDL reduction","Stop statin; use fish oil only","Switch to low-intensity statin for tolerability without LDL check","Defer therapy 12 months"]}',
  'Intensify to high-intensity statin (e.g., atorvastatin 80 or add ezetimibe) targeting ≥ 50% LDL reduction',
  'Very high-risk ASCVD warrants high-intensity statin and ≥50% LDL reduction per ACC/AHA cholesterol guideline. (ACC/AHA Heart Failure Guideline)',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  '[{"label":"ACC/AHA Heart Failure Guideline","url":"https://www.acc.org"}]'::jsonb,
  'seed',
  '2f8d5e2fee64251b6287d959f444b574',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'infectious-disease-rx',
  4,
  'infectious-disease-rx',
  'naplex-area3-treatment-planning',
  'select_all',
  'Community pharmacist: patient on warfarin needs antibiotic for dental prophylaxis discussion.',
  'Which antibiotics warrant extra INR monitoring when combined with warfarin? (Select all that apply.)',
  '{"kind":"select_all","options":["Metronidazole","Trimethoprim–sulfamethoxazole","Azithromycin (no interaction ever)","Fluconazole","Cephalexin (always doubles INR)"],"partialCredit":true}',
  'Metronidazole,Trimethoprim–sulfamethoxazole,Fluconazole',
  'Macrolides/azoles and TMP-SMX inhibit warfarin metabolism; monitor INR and counsel on bleeding signs. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025","SATA"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '913490fb2077e4fb2a8fa25dd704ca2a',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'cns-rx',
  4,
  'cns-rx',
  'naplex-area3-treatment-planning',
  'case_based',
  'Epilepsy: breakthrough seizures on valproate 500 mg BID | level 95 mcg/mL (high) | platelets 98k | tremor',
  'Best recommendation?',
  '{"kind":"case_based","options":["Reduce valproate dose; evaluate alternative AED; monitor CBC/LFTs","Increase valproate for better control","Add aspirin for thrombocytopenia","Discontinue without taper and stop monitoring"]}',
  'Reduce valproate dose; evaluate alternative AED; monitor CBC/LFTs',
  'Supratherapeutic valproate with thrombocytopenia and tremor signals toxicity; dose reduction and alternative AED per neurology plan.',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  NULL,
  'seed',
  '9324e2ac4288e9b27fa46441ce662ddb',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'endocrine-rx',
  3,
  'endocrine-rx',
  'naplex-area3-treatment-planning',
  'exhibit',
  'Diabetes intensification visit',
  'Using the lab table, which adjustment is most appropriate?',
  '{"kind":"exhibit","table":{"headers":["Test","Result","Goal"],"rows":[["A1c","8.9%","< 7% individual goal"],["Fasting glucose","186 mg/dL","80–130"],["eGFR","48 mL/min","—"],["Current","Glipizide 10 mg BID","—"]]},"options":["Deprescribe sulfonylurea; start SGLT2i with HF/CKD benefit if appropriate","Increase glipizide to 20 mg BID","Add sliding-scale insulin only at bedtime","No change until A1c > 10%"]}',
  'Deprescribe sulfonylurea; start SGLT2i with HF/CKD benefit if appropriate',
  'CKD + hypoglycemia risk from sulfonylurea favors deprescribing and SGLT2i per ADA CKD recommendations. (ADA Standards of Care in Diabetes)',
  NULL,
  '["naplex","v2","NAPLEX-2025","exhibit"]',
  '[{"label":"ADA Standards of Care in Diabetes","url":"https://diabetesjournals.org/care"}]'::jsonb,
  'seed',
  '2561c35250a92dfac4d7a727b81d25cd',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'patient-counseling',
  4,
  'patient-counseling',
  'naplex-area3-treatment-planning',
  'case_based',
  'Elderly patient (82 y) on 14 medications reports dizziness and one fall last week.',
  'Highest priority pharmacist assessment?',
  '{"kind":"case_based","options":["Screen for fall-risk meds (benzodiazepines, opioids, anticholinergics) and orthostasis; recommend deprescribing review","Recommend doubling antihypertensive for stricter control","Dispense calcium only","Ignore — falls are normal at this age"]}',
  'Screen for fall-risk meds (benzodiazepines, opioids, anticholinergics) and orthostasis; recommend deprescribing review',
  'Beers/STOPP criteria and fall-risk medication review are cornerstone geriatric pharmacist interventions.',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  NULL,
  'seed',
  '26ed9e8ebcdaeee7a96c04872b92809f',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'cardiovascular-rx',
  4,
  'cardiovascular-rx',
  'naplex-area3-treatment-planning',
  'select_all',
  'BP 158/96 despite lifestyle | no CKD | no diabetes | 52 y/o man',
  'Which initial antihypertensive approaches are guideline-supported? (Select all that apply.)',
  '{"kind":"select_all","options":["Thiazide-type diuretic","ACE inhibitor or ARB","Calcium channel blocker","Combine two first-line agents at low dose if BP far from goal","Clonidine patch first-line monotherapy routinely"],"partialCredit":true}',
  'Thiazide-type diuretic,ACE inhibitor or ARB,Calcium channel blocker,Combine two first-line agents at low dose if BP far from goal',
  'ACC/AHA supports thiazide, ACEi/ARB, or CCB as first-line; initial combination reasonable when BP markedly elevated. (ACC/AHA Heart Failure Guideline)',
  NULL,
  '["naplex","v2","NAPLEX-2025","SATA"]',
  '[{"label":"ACC/AHA Heart Failure Guideline","url":"https://www.acc.org"}]'::jsonb,
  'seed',
  'b7eda5ee489534c471c32ab4965adf71',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'patient-counseling',
  4,
  'patient-counseling',
  'naplex-area3-treatment-planning',
  'case_based',
  'Transgender woman starting estradiol + spironolactone. Smokes 10 cigarettes/day.',
  'Priority safety counseling?',
  '{"kind":"case_based","options":["Smoking cessation — VTE/CV risk with estrogen; monitor potassium on spironolactone","Encourage smoking to manage stress","No monitoring needed for potassium","Avoid all blood pressure checks"]}',
  'Smoking cessation — VTE/CV risk with estrogen; monitor potassium on spironolactone',
  'Estrogen therapy plus smoking elevates thrombotic risk; spironolactone requires potassium and renal monitoring.',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  NULL,
  'seed',
  '9f076cbab16cd2439abb36c21196138d',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'compounding-calculations',
  3,
  'compounding-calculations',
  'naplex-area3-treatment-planning',
  'constructed_response',
  'TPN: patient needs 25 mEq potassium chloride in 500 mL bag. Stock vial: KCl 2 mEq/mL.',
  'How many mL of KCl stock are needed? (Round to one decimal.)',
  '{"kind":"constructed","unit":"mL","acceptUnits":["mL","mL"],"options":["12.5"]}',
  '12.5',
  '25 mEq ÷ 2 mEq/mL = 12.5 mL. Verify osmolarity and line compatibility before admixture. (USP <797> Sterile Compounding)',
  '["25 mEq total","2 mEq/mL stock → 12.5 mL"]',
  '["naplex","v2","NAPLEX-2025","calculation"]',
  '[{"label":"USP <797> Sterile Compounding","url":"https://www.usp.org"}]'::jsonb,
  'seed',
  'd8550516d127ebee51bdccc8ea309f21',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacy-law',
  4,
  'pharmacy-law',
  'naplex-area4-safety',
  'case_based',
  'Technician asks you to look up a neighbor''s pickup history to see if they picked up antidepressants.',
  'Most appropriate response?',
  '{"kind":"case_based","options":["Decline — HIPAA minimum necessary; access only for professional dispensing need","Provide information since they are a neighbor","Post pickup status on social media without names","Ask technician to access remotely from home network without VPN"]}',
  'Decline — HIPAA minimum necessary; access only for professional dispensing need',
  'HIPAA limits PHI use to treatment/payment/operations; curiosity about neighbors is prohibited access.',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  NULL,
  'seed',
  '4f01d5e6b4f7d8ef71c7d5e7094fffbe',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacy-law',
  4,
  'pharmacy-law',
  'naplex-area4-safety',
  'select_all',
  'Medication error: wrong strength dispensed; patient took one dose; no harm observed.',
  'Which actions align with professional practice? (Select all that apply.)',
  '{"kind":"select_all","options":["Notify patient and prescriber; offer corrective supply","Document internal incident report per policy","Report to ISMP/MEDMAR if required by institution","Conceal error to avoid liability","Perform root cause analysis to prevent recurrence"],"partialCredit":true}',
  'Notify patient and prescriber; offer corrective supply,Document internal incident report per policy,Report to ISMP/MEDMAR if required by institution,Perform root cause analysis to prevent recurrence',
  'Transparent disclosure, documentation, reporting systems, and RCA are standard patient safety practice. (ISMP High-Alert Medications)',
  NULL,
  '["naplex","v2","NAPLEX-2025","SATA"]',
  '[{"label":"ISMP High-Alert Medications","url":"https://www.ismp.org"}]'::jsonb,
  'seed',
  '99e340ce46039d293e8f98e0615f0d2f',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacy-law',
  3,
  'pharmacy-law',
  'naplex-area4-safety',
  'vignette',
  NULL,
  'A pharmacist discovers a colleague diverting controlled substances. The FIRST professional obligation is to:',
  '["Report per workplace policy and applicable law; ensure patient safety","Confront publicly on social media","Ignore unless diversion exceeds 100 tablets","Join diversion to balance inventory"]',
  'Report per workplace policy and applicable law; ensure patient safety',
  'Suspected diversion mandates reporting through proper channels to protect patients and meet regulatory duties.',
  NULL,
  '["naplex","v2","NAPLEX-2025"]',
  NULL,
  'seed',
  '3fba6944d7327b161d38458f69255e58',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacy-law',
  3,
  'pharmacy-law',
  'naplex-area5-management',
  'vignette',
  'Inventory analysis: fast movers stock out weekly; slow movers expire on shelf.',
  'Which inventory method best addresses both issues?',
  '["Implement periodic ABC analysis with adjusted par levels and automated reorder points","Order equal quantities of all SKUs monthly","Discontinue all slow movers without prescriber notification","Eliminate cycle counts to save labor"]',
  'Implement periodic ABC analysis with adjusted par levels and automated reorder points',
  'ABC classification optimizes capital and shelf life by aligning par levels with utilization velocity.',
  NULL,
  '["naplex","v2","NAPLEX-2025"]',
  NULL,
  'seed',
  '624f3239b3a0d85fe14a31d733970165',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'patient-counseling',
  4,
  'patient-counseling',
  'naplex-area5-management',
  'case_based',
  'You precept a student who bypassed PPI counseling on a high-risk polypharmacy patient to save time.',
  'Best preceptor response?',
  '{"kind":"case_based","options":["Debrief on patient safety impact; require remedial counseling with teach-back; document competency gap","Ignore — counseling is optional","Publicly reprimand in waiting area","Revoke internship immediately without discussion"]}',
  'Debrief on patient safety impact; require remedial counseling with teach-back; document competency gap',
  'Precepting balances accountability with education: immediate feedback, remediation, and documented competency assessment.',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  NULL,
  'seed',
  '7cc47ebf255e9a7c8aae692743a28535',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'compounding-calculations',
  5,
  'compounding-calculations',
  'naplex-area1-foundations',
  'constructed_response',
  'NICU | Dopamine 7 mcg/kg/min IV | Neonate 4 kg | Bag: 200 mg/250 mL D5W (800 mcg/mL)',
  'What infusion rate (mL/hr) delivers the ordered dose? (Round to nearest whole number.)',
  '{"kind":"constructed","unit":"mL/hr","acceptUnits":["mL/hr","mL/hr"],"options":["2"]}',
  '2',
  '7 mcg/kg/min × 4 kg = 28 mcg/min = 1,680 mcg/hr. Rate = 1,680 ÷ 800 = 2.1 → 2 mL/hr. (FDA prescribing information)',
  '["28 mcg/min","1,680 mcg/hr","÷ 800 mcg/mL = 2.1 mL/hr"]',
  '["naplex","v2","NAPLEX-2025","calculation","case-calculation"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '1274e85b76a19b1d6bb4fd09406cd5c5',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacokinetics',
  4,
  'pharmacokinetics',
  'naplex-area1-foundations',
  'constructed_response',
  'J.R., 70 y/o man | SCr 2.4 mg/dL | Weight 75 kg | Cockcroft–Gault (male) for vancomycin estimate',
  'Estimated creatinine clearance (mL/min)? (Round to nearest whole number.)',
  '{"kind":"constructed","unit":"mL/min","acceptUnits":["mL/min","mL/min"],"options":["30"]}',
  '30',
  'CrCl = [(140−70)×75]/(72×2.4) = 5,250/172.8 ≈ 30 mL/min. (FDA prescribing information)',
  '["(140−age)×weight/(72×SCr)","≈ 30 mL/min"]',
  '["naplex","v2","NAPLEX-2025","calculation","case-calculation"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '09597d06e8d1d16368c68057fd4959a6',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'compounding-calculations',
  4,
  'compounding-calculations',
  'naplex-area3-treatment-planning',
  'constructed_response',
  'Pediatric | Acetaminophen 15 mg/kg/dose PO q6h | Child 24 kg | Suspension 160 mg/5 mL',
  'How many milliliters per dose? (Round to one decimal.)',
  '{"kind":"constructed","unit":"mL","acceptUnits":["mL","mL"],"options":["11.3"]}',
  '11.3',
  'Dose = 15 × 24 = 360 mg. Volume = 360/160 × 5 = 11.25 → 11.3 mL. (FDA prescribing information)',
  '["360 mg per dose","360÷160×5 = 11.25 mL"]',
  '["naplex","v2","NAPLEX-2025","calculation","case-calculation"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '914e384d2f26e2a5c063f5d10e35053c',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'endocrine-rx',
  4,
  'endocrine-rx',
  'naplex-area3-treatment-planning',
  'constructed_response',
  'T1DM | Carb ratio 1:12 | Pre-meal BG 242 mg/dL | Target 120 | ISF 1:40 | Lunch 60 g carbohydrate',
  'Total rapid-acting insulin units for correction plus meal? (Round to one decimal.)',
  '{"kind":"constructed","unit":"units","acceptUnits":["units","units"],"options":["8.0"]}',
  '8.0',
  'Meal = 60÷12 = 5 U. Correction = (242−120)÷40 = 3.05 U. Total ≈ 8.0 U. (ADA Standards of Care in Diabetes)',
  '["5 U meal","3 U correction","≈ 8 U"]',
  '["naplex","v2","NAPLEX-2025","calculation","case-calculation"]',
  '[{"label":"ADA Standards of Care in Diabetes","url":"https://diabetesjournals.org/care"}]'::jsonb,
  'seed',
  'ae6e851f9b633ebe0d917592e476392b',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacokinetics',
  4,
  'pharmacokinetics',
  'naplex-area2-therapeutics',
  'constructed_response',
  'STEMI protocol | 72 kg patient | Heparin bolus 60 units/kg IV | Concentration 1,000 units/mL',
  'Bolus volume (mL)? (Round to one decimal.)',
  '{"kind":"constructed","unit":"mL","acceptUnits":["mL","mL"],"options":["4.3"]}',
  '4.3',
  'Bolus = 60 × 72 = 4,320 units. Volume = 4,320 ÷ 1,000 = 4.32 → 4.3 mL. (FDA prescribing information)',
  '["4,320 units","÷ 1,000 units/mL"]',
  '["naplex","v2","NAPLEX-2025","calculation","case-calculation"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '679ca63734c43b3f0d1e1ca8c487ec2a',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'compounding-calculations',
  5,
  'compounding-calculations',
  'naplex-area3-treatment-planning',
  'constructed_response',
  'Oncology | Carboplatin target AUC 6 | Calvert formula | GFR 55 mL/min',
  'Calculated dose (mg)? (Round to nearest whole mg.)',
  '{"kind":"constructed","unit":"mg","acceptUnits":["mg","mg"],"options":["480"]}',
  '480',
  'Calvert: Dose = AUC × (GFR + 25) = 6 × 80 = 480 mg. (FDA prescribing information)',
  '["6 × (55 + 25)","= 480 mg"]',
  '["naplex","v2","NAPLEX-2025","calculation","case-calculation"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  'bc235ebc0cfc7e0b6202eec647dac6f8',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'compounding-calculations',
  4,
  'compounding-calculations',
  'naplex-area1-foundations',
  'constructed_response',
  'TPN | Add 60 mEq KCl to 1,000 mL base | Stock 2 mEq/mL',
  'Stock KCl volume (mL)? (Round to one decimal.)',
  '{"kind":"constructed","unit":"mL","acceptUnits":["mL","mL"],"options":["30.0"]}',
  '30.0',
  '60 mEq ÷ 2 mEq/mL = 30 mL. (USP <797> Sterile Compounding)',
  '["60 mEq","÷ 2 = 30 mL"]',
  '["naplex","v2","NAPLEX-2025","calculation","case-calculation"]',
  '[{"label":"USP <797> Sterile Compounding","url":"https://www.usp.org"}]'::jsonb,
  'seed',
  'c3f7eb1cf95643a4ba7a344b4241104c',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'endocrine-rx',
  4,
  'endocrine-rx',
  'naplex-area3-treatment-planning',
  'constructed_response',
  'GDM 32 wk GA | Weight 82 kg | Start insulin glargine 0.2 units/kg/day',
  'Initial daily glargine dose (units)? (Round to nearest whole unit.)',
  '{"kind":"constructed","unit":"units","acceptUnits":["units","units"],"options":["16"]}',
  '16',
  '0.2 × 82 = 16.4 → 16 units. (ADA Standards of Care in Diabetes)',
  '["0.2 U/kg × 82 kg"]',
  '["naplex","v2","NAPLEX-2025","calculation","case-calculation"]',
  '[{"label":"ADA Standards of Care in Diabetes","url":"https://diabetesjournals.org/care"}]'::jsonb,
  'seed',
  '512ca1ba2818da5e38af8a2539e0ef06',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacokinetics',
  4,
  'pharmacokinetics',
  'naplex-area3-treatment-planning',
  'constructed_response',
  'Chronic pain | Morphine SR 90 mg q12h (180 mg/day PO) | Rotate to hydromorphone PO',
  'Approximate equianalgesic daily hydromorphone (mg) using 4:1 morphine:hydromorphone ratio? (Round to nearest whole mg.)',
  '{"kind":"constructed","unit":"mg","acceptUnits":["mg","mg"],"options":["45"]}',
  '45',
  '180 mg morphine ÷ 4 ≈ 45 mg hydromorphone/day. (FDA prescribing information)',
  '["180 mg MSE","÷ 4 = 45 mg"]',
  '["naplex","v2","NAPLEX-2025","calculation","case-calculation"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '2e14c302d821c2be05281e655aafe501',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'compounding-calculations',
  4,
  'compounding-calculations',
  'naplex-area1-foundations',
  'constructed_response',
  'IV piggyback | 150 mL to run over 45 minutes',
  'Required pump rate (mL/hr)? (Round to nearest whole number.)',
  '{"kind":"constructed","unit":"mL/hr","acceptUnits":["mL/hr","mL/hr"],"options":["200"]}',
  '200',
  '150 mL ÷ 0.75 h = 200 mL/hr. (USP <797> Sterile Compounding)',
  '["45 min = 0.75 h","150/0.75 = 200"]',
  '["naplex","v2","NAPLEX-2025","calculation","case-calculation"]',
  '[{"label":"USP <797> Sterile Compounding","url":"https://www.usp.org"}]'::jsonb,
  'seed',
  '3210643d1ed263a9003092268fe489f8',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'infectious-disease-rx',
  4,
  'infectious-disease-rx',
  'naplex-area3-treatment-planning',
  'constructed_response',
  'OM | Amoxicillin 40 mg/kg/day PO divided BID | Child 20 kg | 400 mg/5 mL | 10-day supply',
  'Total volume to dispense (mL)? (Round to nearest whole mL.)',
  '{"kind":"constructed","unit":"mL","acceptUnits":["mL","mL"],"options":["100"]}',
  '100',
  'Daily = 40×20 = 800 mg. Each BID dose = 400 mg → 5 mL per dose. Ten days × 2 doses = 20 doses → 100 mL. (FDA prescribing information)',
  '["400 mg per dose = 5 mL","20 doses = 100 mL"]',
  '["naplex","v2","NAPLEX-2025","calculation","case-calculation"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '38846eff101dd505499a71364ac2c295',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacokinetics',
  5,
  'pharmacokinetics',
  'naplex-area3-treatment-planning',
  'constructed_response',
  'Hypoalbuminemia | Phenytoin total level 8 mcg/mL | Albumin 2.2 g/dL | Adjusted ≈ measured / (0.2×albumin + 0.1)',
  'Estimated adjusted phenytoin level (mcg/mL)? (Round to one decimal.)',
  '{"kind":"constructed","unit":"mcg/mL","acceptUnits":["mcg/mL","mcg/mL"],"options":["14.8"]}',
  '14.8',
  'Adjusted ≈ 8 / (0.2×2.2 + 0.1) = 8/0.54 ≈ 14.8 mcg/mL — suggests adequate/low-bound therapeutic when corrected. (FDA prescribing information)',
  '["8 / 0.54","≈ 14.8 mcg/mL"]',
  '["naplex","v2","NAPLEX-2025","calculation","case-calculation"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '71a076615ca50cd4424bca9d1a52c673',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'compounding-calculations',
  4,
  'compounding-calculations',
  'naplex-area1-foundations',
  'constructed_response',
  'IV magnesium | Order 2 g MgSO4 (16.2 mEq Mg²⁺) | Stock 4.06 mEq/mL',
  'Volume to draw (mL)? (Round to one decimal.)',
  '{"kind":"constructed","unit":"mL","acceptUnits":["mL","mL"],"options":["4.0"]}',
  '4.0',
  '16.2 mEq ÷ 4.06 mEq/mL ≈ 3.99 → 4.0 mL. (FDA prescribing information)',
  '["16.2 mEq","÷ 4.06 ≈ 4 mL"]',
  '["naplex","v2","NAPLEX-2025","calculation","case-calculation"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '7a6cc475a4965c6b196aba5c861864b5',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'cardiovascular-rx',
  4,
  'cardiovascular-rx',
  'naplex-area3-treatment-planning',
  'constructed_response',
  'NPO HF exacerbation | Home furosemide 80 mg PO daily | IV bioavailability ~50% of PO',
  'Equivalent daily IV furosemide dose (mg)?',
  '{"kind":"constructed","unit":"mg","acceptUnits":["mg","mg"],"options":["40"]}',
  '40',
  'IV ≈ half oral dose → 40 mg IV daily. (FDA prescribing information)',
  '["80 mg PO","÷ 2 = 40 mg IV"]',
  '["naplex","v2","NAPLEX-2025","calculation","case-calculation"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '8d6ec5bad73c5473fdaa25499e86fb0e',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'endocrine-rx',
  4,
  'endocrine-rx',
  'naplex-area3-treatment-planning',
  'constructed_response',
  'New hypothyroid | Weight 60 kg | Full replacement 1.6 mcg/kg/day levothyroxine',
  'Daily dose (mcg)? (Round to nearest whole mcg.)',
  '{"kind":"constructed","unit":"mcg","acceptUnits":["mcg","mcg"],"options":["96"]}',
  '96',
  '1.6 × 60 = 96 mcg daily. (FDA prescribing information)',
  '["1.6 × 60 = 96 mcg"]',
  '["naplex","v2","NAPLEX-2025","calculation","case-calculation"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '22b333b16b2c70de29d43d06bb4ddc32',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'compounding-calculations',
  4,
  'compounding-calculations',
  'naplex-area1-foundations',
  'constructed_response',
  'Alligation | Prepare 400 mL of 20% dextrose from 50% and 5% stock',
  'Milliliters of 50% solution required? (Round to nearest whole mL.)',
  '{"kind":"constructed","unit":"mL","acceptUnits":["mL","mL"],"options":["133"]}',
  '133',
  'Using alligation: (20−5)/(50−5) = 15/45 = 1/3 of 400 mL ≈ 133 mL of 50%; remainder 5%. (USP <797> Sterile Compounding)',
  '["15/45 ratio","≈ 133 mL of 50%"]',
  '["naplex","v2","NAPLEX-2025","calculation","case-calculation"]',
  '[{"label":"USP <797> Sterile Compounding","url":"https://www.usp.org"}]'::jsonb,
  'seed',
  'f1fe39e837427772f82540f4fa739b40',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'infectious-disease-rx',
  4,
  'infectious-disease-rx',
  'naplex-area3-treatment-planning',
  'constructed_response',
  'Latent TB | Rifampin 15 mg/kg/day | Patient 52 kg | Capsules 150 mg',
  'Capsules per day? (Whole number.)',
  '{"kind":"constructed","unit":"capsules","acceptUnits":["capsules","capsules"],"options":["5"]}',
  '5',
  '52 × 15 = 780 mg/day. 780 ÷ 150 = 5.2 → 5 capsules (750 mg) with prescriber rounding. (FDA prescribing information)',
  '["780 mg/day","÷ 150 mg = 5.2 caps"]',
  '["naplex","v2","NAPLEX-2025","calculation","case-calculation"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '01cb92358df431eb02b499bdf08a0a11',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'pharmacokinetics',
  4,
  'pharmacokinetics',
  'naplex-area3-treatment-planning',
  'constructed_response',
  'Apnea of prematurity | Caffeine citrate load 20 mg/kg | Infant 1.8 kg | 20 mg/mL',
  'Loading dose volume (mL)? (Round to one decimal.)',
  '{"kind":"constructed","unit":"mL","acceptUnits":["mL","mL"],"options":["1.8"]}',
  '1.8',
  'Load = 20 × 1.8 = 36 mg. 36 ÷ 20 = 1.8 mL. (FDA prescribing information)',
  '["36 mg","÷ 20 mg/mL"]',
  '["naplex","v2","NAPLEX-2025","calculation","case-calculation"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '185b27a217946a9272a5c608ad4d7233',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'compounding-calculations',
  4,
  'compounding-calculations',
  'naplex-area1-foundations',
  'constructed_response',
  'Pediatric zinc | Elemental zinc 1 mg/kg/day | Child 16 kg | Solution 10 mg elemental/5 mL',
  'Daily volume (mL)? (Round to one decimal.)',
  '{"kind":"constructed","unit":"mL","acceptUnits":["mL","mL"],"options":["8.0"]}',
  '8.0',
  'Elemental need = 16 mg/day. Concentration = 2 mg/mL → 16 ÷ 2 = 8 mL. (FDA prescribing information)',
  '["16 mg/day","2 mg/mL → 8 mL"]',
  '["naplex","v2","NAPLEX-2025","calculation","case-calculation"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '4641cb5aafbd984f69bf3e48444f80fc',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'cardiovascular-rx',
  4,
  'cardiovascular-rx',
  'naplex-area2-therapeutics',
  'constructed_response',
  'Post-PCI | 88 kg | Heparin 12 units/kg/hr | 25,000 units/250 mL (100 units/mL)',
  'Infusion rate (mL/hr)? (Round to one decimal.)',
  '{"kind":"constructed","unit":"mL/hr","acceptUnits":["mL/hr","mL/hr"],"options":["10.6"]}',
  '10.6',
  '12 × 88 = 1,056 units/hr. 1,056 ÷ 100 = 10.56 → 10.6 mL/hr. (FDA prescribing information)',
  '["1,056 units/hr","÷ 100 units/mL"]',
  '["naplex","v2","NAPLEX-2025","calculation","case-calculation"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '9699d969fd312f97866f3b8e0083b36b',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'endocrine-rx',
  4,
  'endocrine-rx',
  'naplex-area3-treatment-planning',
  'case_based',
  'R.K., 58 y/o man | T2DM + ASCVD (prior MI) | A1c 8.4% | eGFR 55 | on metformin 1 g BID | BMI 31',
  'Which add-on best addresses cardiometabolic goals?',
  '{"kind":"case_based","options":["GLP-1 RA with proven CV benefit","Glimepiride 4 mg daily","Pioglitazone 45 mg daily without discussion","Stop metformin; start basal insulin only"]}',
  'GLP-1 RA with proven CV benefit',
  'ASCVD + uncontrolled T2DM: ADA prioritizes GLP-1 RA or SGLT2i with CV benefit over sulfonylurea or TZD. (ADA Standards of Care in Diabetes)',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  '[{"label":"ADA Standards of Care in Diabetes","url":"https://diabetesjournals.org/care"}]'::jsonb,
  'seed',
  '4be8a57d082c99b13e8fc4c7441613e9',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'cardiovascular-rx',
  4,
  'cardiovascular-rx',
  'naplex-area3-treatment-planning',
  'case_based',
  'B.N., 71 y/o woman | New Afib, persistent | CHA₂DS₂-VASc 4 | HAS-BLED 2 | CKD stage 3 | No valvular disease',
  'Best anticoagulation recommendation?',
  '{"kind":"case_based","options":["Apixaban (or another DOAC) with renal/weight dose check","Aspirin 325 mg daily alone","Warfarin only — DOACs contraindicated in all CKD","No anticoagulation due to bleeding score"]}',
  'Apixaban (or another DOAC) with renal/weight dose check',
  'CHA₂DS₂-VASc ≥2 in women warrants anticoagulation; HAS-BLED informs monitoring. Apixaban has renal/weight-based adjustments. (ACC/AHA Guideline)',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  '[{"label":"ACC/AHA Guideline","url":"https://www.acc.org"}]'::jsonb,
  'seed',
  'c40def2c1e5ec3ee20149f127a91f1c9',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'patient-counseling',
  4,
  'patient-counseling',
  'naplex-area3-treatment-planning',
  'select_all',
  'Breastfeeding mother with mastitis | No penicillin allergy | Infant 6 weeks healthy',
  'Which antibiotic/counseling points apply? (Select all that apply.)',
  '{"kind":"select_all","options":["Dicloxacillin or cephalexin commonly used for mastitis","Continue breastfeeding unless clinician advises temporary pause","Fluoroquinolone first-line while nursing","Counsel on completing full course and fluids/rest","Automatic weaning required with all antibiotics"],"partialCredit":true}',
  'Dicloxacillin or cephalexin commonly used for mastitis,Continue breastfeeding unless clinician advises temporary pause,Counsel on completing full course and fluids/rest',
  'Beta-lactamase–resistant penicillins/cephalosporins are typical; breastfeeding usually continues with compatible agents. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025","SATA"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '2c82a339082dc214c808b3c1c4eacacf',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'infectious-disease-rx',
  4,
  'infectious-disease-rx',
  'naplex-area3-treatment-planning',
  'case_based',
  'Outpatient cellulitis | 45 y/o man | No MRSA risk | No allergy | BMI 28 | on lisinopril',
  'Best empiric oral therapy?',
  '{"kind":"case_based","options":["Cephalexin 500 mg QID × 5–7 days","Vancomycin IV outpatient","Metronidazole monotherapy","Linezolid first-line"]}',
  'Cephalexin 500 mg QID × 5–7 days',
  'Uncomplicated non-purulent cellulitis in low MRSA risk: anti-streptococcal beta-lactam (cephalexin/dicloxacillin).',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  NULL,
  'seed',
  'a8fd8446c9584f21aafb33a69c4d148c',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'endocrine-rx',
  3,
  'endocrine-rx',
  'naplex-area3-treatment-planning',
  'exhibit',
  'CKD + T2DM treatment review',
  'Based on the exhibit, which regimen adjustment is most appropriate?',
  '{"kind":"exhibit","table":{"headers":["Parameter","Value","Notes"],"rows":[["eGFR","32 mL/min","Stable"],["A1c","8.2%","On metformin 1 g BID"],["UACR","450 mg/g","Albuminuric"],["BP","138/84","On lisinopril 20 mg"]]},"options":["Continue metformin if eGFR ≥30; add SGLT2i with CKD benefit if not contraindicated","Stop metformin; sulfonylurea only","Increase metformin to 3 g daily","No UACR-directed therapy needed"]}',
  'Continue metformin if eGFR ≥30; add SGLT2i with CKD benefit if not contraindicated',
  'eGFR 32 allows metformin with monitoring; SGLT2i indicated for CKD/albuminuria per ADA/KDIGO alignment. (ADA Standards of Care in Diabetes)',
  NULL,
  '["naplex","v2","NAPLEX-2025","exhibit"]',
  '[{"label":"ADA Standards of Care in Diabetes","url":"https://diabetesjournals.org/care"}]'::jsonb,
  'seed',
  'ef24157f6cf8fd65386b0566f8aa2192',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'cns-rx',
  4,
  'cns-rx',
  'naplex-area3-treatment-planning',
  'case_based',
  'Parkinson disease | On carbidopa/levodopa 25/100 QID | Wearing-off before next dose | No psychosis',
  'Best pharmacologic strategy?',
  '{"kind":"case_based","options":["Add COMT inhibitor or adjust levodopa dosing interval per neurologist","Start high-dose antipsychotic for prevention","Stop levodopa; benztropine monotherapy","MAOI augmentation without washout"]}',
  'Add COMT inhibitor or adjust levodopa dosing interval per neurologist',
  'Motor wearing-off managed by optimizing levodopa frequency or adding COMT inhibitor; avoid unsafe psychotropic combos.',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  NULL,
  'seed',
  'b48b3bbac57f23374abcd1b5f4ca8e80',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'cardiovascular-rx',
  3,
  'cardiovascular-rx',
  'naplex-area3-treatment-planning',
  'drag_drop',
  'Heart failure medication education — match drug to primary counseling point',
  'Match each medication to its priority counseling focus:',
  '{"kind":"drag_drop","prompts":["Sacubitril/valsartan","Spironolactone","Furosemide","Metoprolol succinate"],"options":["Angioedema risk; avoid with ACEi overlap","Hyperkalemia; avoid potassium supplements","Orthostasis; take morning if once daily","Do not stop abruptly; fatigue/Bradycardia monitoring","Take with high-fat meals only","Crush extended-release tablets"]}',
  'Sacubitril/valsartan|||Angioedema risk; avoid with ACEi overlap,Spironolactone|||Hyperkalemia; avoid potassium supplements,Furosemide|||Orthostasis; take morning if once daily,Metoprolol succinate|||Do not stop abruptly; fatigue/Bradycardia monitoring',
  'Each HF drug has distinct safety counseling tied to mechanism and adverse effect profile. (ACC/AHA Guideline)',
  NULL,
  '["naplex","v2","NAPLEX-2025","matching"]',
  '[{"label":"ACC/AHA Guideline","url":"https://www.acc.org"}]'::jsonb,
  'seed',
  '5dab081970bc133e1729628ddc93ad0c',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'patient-counseling',
  4,
  'patient-counseling',
  'naplex-area3-treatment-planning',
  'case_based',
  'Solid organ transplant recipient | New mycophenolate | On tacrolimus | Asks about OTC supplements',
  'Highest priority counseling?',
  '{"kind":"case_based","options":["Avoid St. John''s wort and herbals that induce CYP3A4; infection and pregnancy prevention counseling","Encourage grapefruit juice for absorption","All OTC products are safe post-transplant","Stop tacrolimus if cold symptoms"]}',
  'Avoid St. John''s wort and herbals that induce CYP3A4; infection and pregnancy prevention counseling',
  'Transplant immunosuppressants have narrow interactions; herbals can precipitate rejection or toxicity. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '6614e197b03d883ef745aea5a0ade86c',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'infectious-disease-rx',
  4,
  'infectious-disease-rx',
  'naplex-area3-treatment-planning',
  'select_all',
  'Hospital: CAP non-ICU | No pseudomonas risk | No recent antibiotics',
  'Which empiric regimens are appropriate? (Select all that apply.)',
  '{"kind":"select_all","options":["Amoxicillin-clavulanate + macrolide","Respiratory fluoroquinolone monotherapy","Ceftriaxone + azithromycin","Metronidazole monotherapy","Piperacillin-tazobactam routine for all CAP"],"partialCredit":true}',
  'Amoxicillin-clavulanate + macrolide,Respiratory fluoroquinolone monotherapy,Ceftriaxone + azithromycin',
  'IDSA/ATS CAP outpatient/inpatient non-severe: beta-lactam + macrolide or respiratory FQ monotherapy.',
  NULL,
  '["naplex","v2","NAPLEX-2025","SATA"]',
  NULL,
  'seed',
  '1a4b8597120a30e6b8d0fe562918e515',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'endocrine-rx',
  4,
  'endocrine-rx',
  'naplex-area3-treatment-planning',
  'case_based',
  'Adrenal insufficiency | On hydrocortisone 20 mg AM / 10 mg PM | Nausea/vomiting cannot keep PO down',
  'Urgent recommendation?',
  '{"kind":"case_based","options":["Stress-dose steroids (e.g., hydrocortisone IM/IV) and emergency care; sick-day rules","Hold all steroids until eating resumes","Double evening dose only","Switch to levothyroxine"]}',
  'Stress-dose steroids (e.g., hydrocortisone IM/IV) and emergency care; sick-day rules',
  'Adrenal crisis prevention requires parenteral stress dosing when unable to tolerate oral maintenance steroids. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  'a6e13ccf066d7af09d0a9971f4e3aca8',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'otc-self-care',
  3,
  'otc-self-care',
  'naplex-area3-treatment-planning',
  'vignette',
  'Pregnant patient (14 wk) with heartburn unrelieved by lifestyle',
  'Best OTC recommendation?',
  '["Calcium carbonate antacid PRN short-term; avoid sodium bicarbonate/high-sodium products","Omeprazole OTC unlimited without prescriber","Aspirin-containing antacid","Sodium bicarbonate high-dose routine"]',
  'Calcium carbonate antacid PRN short-term; avoid sodium bicarbonate/high-sodium products',
  'Antacids may be used cautiously in pregnancy; avoid salicylates and excessive sodium; PPI if refractory per prescriber. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '07527d4d2ca8b778eeb5078ec30d95f1',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'cardiovascular-rx',
  4,
  'cardiovascular-rx',
  'naplex-area3-treatment-planning',
  'case_based',
  'Gout + CKD stage 3 | Acute flare | Colchicine considered | On diltiazem',
  'Colchicine consideration?',
  '{"kind":"case_based","options":["Reduce colchicine dose for CKD and CYP3A4/P-gp inhibitors (diltiazem); toxicity risk","Standard high-dose colchicine load regardless of interactions","Colchicine contraindicated in all CKD","Add rifampin to increase clearance"]}',
  'Reduce colchicine dose for CKD and CYP3A4/P-gp inhibitors (diltiazem); toxicity risk',
  'Colchicine has narrow therapeutic index; dose-reduce with renal impairment and interacting CYP3A4/P-gp drugs. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  '058fb1980628554e0e1ce802812a5365',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'infectious-disease-rx',
  3,
  'infectious-disease-rx',
  'naplex-area3-treatment-planning',
  'drag_drop',
  'Antibiotic stewardship — match organism/scenario to preferred agent',
  'Match each scenario to the most appropriate first-line therapy:',
  '{"kind":"drag_drop","prompts":["Community UTI (E. coli) outpatient","Pharyngitis confirmed Group A strep","C. difficile initial episode (non-severe)","Latent TB"],"options":["Nitrofurantoin","Penicillin V or amoxicillin","Vancomycin oral or fidaxomicin","Isoniazid + rifapentine weekly (short course) or INH monotherapy","IV vancomycin for uncomplicated cystitis","Azithromycin for GAS pharyngitis"]}',
  'Community UTI (E. coli) outpatient|||Nitrofurantoin,Pharyngitis confirmed Group A strep|||Penicillin V or amoxicillin,C. difficile initial episode (non-severe)|||Vancomycin oral or fidaxomicin,Latent TB|||Isoniazid + rifapentine weekly (short course) or INH monotherapy',
  'Stewardship aligns narrowest effective agent to syndrome and susceptibility patterns.',
  NULL,
  '["naplex","v2","NAPLEX-2025","matching"]',
  NULL,
  'seed',
  'e7ba7204df33da978393b6df5ba6dafe',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'cardiovascular-rx',
  3,
  'cardiovascular-rx',
  'naplex-area3-treatment-planning',
  'exhibit',
  'Hypertension clinic — medication review',
  'Using the table, which change is most appropriate?',
  '{"kind":"exhibit","table":{"headers":["Drug","Dose","Concern"],"rows":[["Lisinopril","40 mg daily","BP 148/92, SCr stable"],["HCTZ","12.5 mg daily","K+ 3.4"],["Amlodipine","5 mg daily","Edema mild"]]},"options":["Add amlodipine dose or add thiazide-like agent; recheck K+","Stop lisinopril for cough not present","Discontinue all antihypertensives","Add NSAID for edema"]}',
  'Add amlodipine dose or add thiazide-like agent; recheck K+',
  'BP above goal on dual therapy warrants intensification; monitor potassium with ACEi/HCTZ combo. (ACC/AHA Guideline)',
  NULL,
  '["naplex","v2","NAPLEX-2025","exhibit"]',
  '[{"label":"ACC/AHA Guideline","url":"https://www.acc.org"}]'::jsonb,
  'seed',
  '23f7e30125b464094c3129ef4d0f4e40',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  'patient-counseling',
  4,
  'patient-counseling',
  'naplex-area3-treatment-planning',
  'case_based',
  'SLE patient starting hydroxychloroquine | Plaquenil education visit',
  'Essential counseling before dispensing?',
  '{"kind":"case_based","options":["Baseline and periodic eye exams; take with food; report vision changes promptly","No ophthalmology follow-up needed","Take on empty stomach only at bedtime","Safe to double dose if joint pain flares"]}',
  'Baseline and periodic eye exams; take with food; report vision changes promptly',
  'Hydroxychloroquine retinopathy screening is standard; GI tolerance improved with food. (FDA prescribing information)',
  NULL,
  '["naplex","v2","NAPLEX-2025","case-vignette"]',
  '[{"label":"FDA prescribing information","url":"https://www.fda.gov/drugs"}]'::jsonb,
  'seed',
  'b3ef9a42ad9b177cf3bf4ef0423f942d',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;
