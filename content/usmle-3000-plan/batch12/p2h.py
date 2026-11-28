"""Step 2 items 76-100."""

from lib import s2

GOLD = "Global Initiative for Chronic Obstructive Lung Disease, GOLD 2026 report."
GINA = "Global Initiative for Asthma, GINA Strategy Report 2025."
ADA = "American Diabetes Association, Standards of Care in Diabetes, 2026, sections 9 and 11."
ACS = "2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes."
KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."
ACOG = "ACOG Practice Bulletin No. 222, Gestational Hypertension and Preeclampsia, 2020, the current ACOG bulletin on this topic."
CDC = "CDC Sexually Transmitted Infections Treatment Guidelines, 2021."
ACG = "American College of Gastroenterology Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding, 2021."
USP_LU = "US Preventive Services Task Force lung cancer screening recommendation, 2021."
USP_CR = "US Preventive Services Task Force colorectal cancer screening recommendation, 2021."
USP_BR = "US Preventive Services Task Force breast cancer screening recommendation, 2024."
HTN = "2025 AHA/ACC/Multispecialty Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults."
HF = "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure, which remains the current United States heart-failure guideline."
ACR = "2020 American College of Rheumatology Guideline for the Management of Gout."

def W(a, b):
    return (a, b)

ITEMS = []

def A(n, **k):
    ITEMS.append(s2(n, **k))

A(76, system="respiratory-renal", weight=8, topic="copd-asthma-exacerbation", domain="respiratory-renal", diff=2, subject="pulmonology",
  takeaway="Theophylline is not recommended for a COPD exacerbation because side effects outweigh any small bronchodilator effect.",
  citation=GOLD,
  scenario="A 73-year-old patient with known COPD is wheezing, speaking in short sentences, and saturating 91 percent on 2 liters of oxygen. The chest radiograph has no infiltrate. Nebulized bronchodilators and a 5-day corticosteroid order are already written. A colleague adds intravenous theophylline for extra bronchodilation.",
  question="Why is theophylline the wrong addition?",
  correct=W("Side effects are not justified. Do not add it",
            "GOLD 2026 says methylxanthines are not recommended for an exacerbation. He is already on the bronchodilator and the short corticosteroid course the report does recommend."),
  wrongs=[
    W("It is the preferred third bronchodilator in every moderate exacerbation", "The report tells clinicians not to use it."),
    W("It replaces the corticosteroid", "The corticosteroid course stays. Theophylline is not a substitute."),
    W("It is required when oxygen saturation is under 94 percent", "Saturation does not create a theophylline indication."),
    W("Give it orally for 30 days after discharge", "A month of theophylline is not a discharge recommendation."),
  ])

A(77, system="respiratory-renal", weight=8, topic="copd-asthma-exacerbation", domain="respiratory-renal", diff=3, subject="pulmonology",
  takeaway="Noninvasive ventilation is indicated for acute hypercapnic respiratory failure in COPD when the patient is still protecting the airway.",
  citation=GOLD,
  scenario="A 69-year-old patient with known COPD is drowsy but opens his eyes, swallows, and pulls away from a sternal rub. The respiratory rate is 28/min. Arterial pH is 7.28, PaCO2 is 70 mm Hg, and PaO2 is 58 mm Hg on 2 liters. The radiograph shows no pneumothorax. A colleague plans immediate intubation and says a mask ventilator is only for patients who are fully conversational.",
  question="Which support matches this pH and this airway?",
  correct=W("Noninvasive ventilation, with a tube only if he deteriorates",
            "GOLD 2026 indicates noninvasive ventilation for acute hypercapnic failure because it improves gas exchange and reduces intubation. He is drowsy but still protecting the airway, so the mask is the first support."),
  wrongs=[
    W("Immediate intubation, because noninvasive ventilation requires a fully conversational patient", "Protecting the airway, not conversation, is the requirement to try the mask first."),
    W("A non-rebreather mask and no pressure support", "Unrestricted high oxygen does not ventilate him and can worsen carbon dioxide retention."),
    W("Theophylline instead of any ventilatory support", "Methylxanthines are not recommended and do not replace ventilation at a pH of 7.28."),
    W("No support, because a PaCO2 of 70 mm Hg is his healthy baseline", "A pH of 7.28 shows the carbon dioxide is acute enough to be acidemic."),
  ])

A(78, system="respiratory-renal", weight=8, topic="copd-asthma-exacerbation", domain="respiratory-renal", diff=3, subject="pulmonology",
  takeaway="Heavy short-acting beta-agonist use is a risk marker even when reported symptoms sound rare. GINA prefers an ICS-formoterol reliever over another albuterol refill.",
  citation=GINA,
  scenario="A 36-year-old patient says he wheezes only once in a while. The pharmacy record shows two albuterol canisters in four months. He has never been prescribed an inhaled corticosteroid. Last year's spirometry showed a bronchodilator response. He asks for another albuterol canister and nothing else.",
  question="Which reliever replaces the refill?",
  correct=W("As-needed low-dose ICS-formoterol, and no albuterol-only refill",
            "GINA 2025 treats short-acting beta-agonist overuse as a risk for severe exacerbations. Two canisters in four months is heavy use. Track 1 uses ICS-formoterol, which treats inflammation as well as spasm."),
  wrongs=[
    W("Another albuterol canister, because the symptom diary outweighs the refill count", "The canisters are the risk marker when the history and the pharmacy record disagree."),
    W("Daily oral prednisone, and continue albuterol as the only inhaler", "Scheduled oral corticosteroid is not the step, and it leaves the reliever as a short-acting beta agonist."),
    W("A long-acting muscarinic antagonist alone", "That drug is not the preferred GINA reliever."),
    W("Stop all inhalers, because he reports rare symptoms", "Rare reported symptoms plus heavy canister use is a reason to change the inhaler, not to stop treatment."),
  ])

A(79, system="respiratory-renal", weight=8, topic="copd-asthma-exacerbation", domain="respiratory-renal", diff=3, subject="pulmonology",
  takeaway="A high-dose inhaled corticosteroid should not run for years. GINA limits a high dose to about 3 to 6 months.",
  citation=GINA,
  scenario="A 44-year-old patient has used a high-dose inhaled corticosteroid with a long-acting beta agonist every day for two years. Symptoms are now present two days a week, with no night waking and no recent urgent visit. A colleague renews the high dose for another year because any step-down might cause a flare.",
  question="What should happen to the high inhaled-corticosteroid dose?",
  correct=W("Step the corticosteroid dose down rather than renew the high dose for another year",
            "GINA 2025 says a high dose, if used, should be limited to about 3 to 6 months. Two years of mild current symptoms is past that limit. Stopping every inhaler is not the step-down."),
  wrongs=[
    W("Continue it indefinitely. Two years of stability means never step down", "Two years is far past the 3- to 6-month limit."),
    W("Stop every inhaler today", "He still needs anti-inflammatory coverage at a lower step."),
    W("Replace the inhaler with daily oral prednisone", "An oral corticosteroid increases systemic exposure. It is not the step-down."),
    W("Add theophylline and keep the high dose", "Theophylline is not the solution for a dose that has been high too long."),
  ])

A(80, system="gastrointestinal", weight=8, topic="pancreatitis-hepatitis", domain="gastrointestinal", diff=3, subject="endocrinology",
  takeaway="When type 2 diabetes and a high fibrosis risk from fatty liver occur together, a GLP-1 receptor agonist is preferred for glucose lowering.",
  citation=ADA,
  scenario="A 54-year-old patient has type 2 diabetes, an A1c of 8.0 percent, and a body-mass index of 36. The fibrosis-4 score is in the high-risk range, and ultrasound shows a fatty liver. He takes metformin. A colleague adds a sulfonylurea and says the liver finding does not change the glucose drug.",
  question="Which added drug matches the liver finding and the A1c?",
  correct=W("A GLP-1 receptor agonist",
            "ADA 2026 prefers a GLP-1 receptor agonist for glycemic management when type 2 diabetes coexists with high fibrosis risk, because of benefit in steatohepatitis. A sulfonylurea adds hypoglycemia and no liver benefit."),
  wrongs=[
    W("A sulfonylurea. Liver fat does not change the choice", "The fibrosis score is exactly the finding that changes the preferred class."),
    W("Stop metformin and use insulin as the only drug", "Metformin can continue. Insulin is not required as the next drug by the liver finding."),
    W("A DPP-4 inhibitor added to a new GLP-1 receptor agonist", "The standards say not to combine those two incretin drugs."),
    W("No change until the A1c exceeds 10 percent", "An A1c of 8 percent is already a reason to intensify, and the liver risk chooses the class."),
  ])

A(81, system="cardiovascular", weight=9, topic="acs-management", domain="cardiovascular", diff=4, subject="cardiology",
  takeaway="Cardiogenic shock is revascularized immediately even when pain began more than 24 hours earlier.",
  citation=ACS,
  scenario="A 67-year-old patient has had chest pain for 30 hours. Blood pressure is 78/50 mm Hg, the skin is cool, and the neck veins are distended. Lactate is 4.2 mmol/L. The electrocardiogram shows ST-segment elevation in V2 through V5. A colleague says 30 hours is too late for reperfusion and starts a nitrate.",
  question="Which reperfusion decision matches shock at 30 hours?",
  correct=W("Emergency revascularization now",
            "The 2025 guideline says shock is revascularized immediately regardless of symptom duration. The 24-hour limit applies to a stable patient. A nitrate is also wrong at a systolic pressure of 78 mm Hg."),
  wrongs=[
    W("No reperfusion, because 24 hours has passed", "The 24-hour limit is for a stable patient. It does not apply once shock is present."),
    W("A fibrinolytic only, with no plan to reach a catheterization laboratory", "Fibrinolysis is not the preferred strategy for shock when revascularization can be done."),
    W("Nitroglycerin until the lactate falls, then a delayed angiogram", "Systolic pressure of 78 mm Hg is a reason to avoid nitroglycerin, and delay is the opposite of emergency revascularization."),
    W("Intravenous fluid only, because ST elevation in shock is demand ischemia", "Anterior ST elevation with shock is an occlusion pattern until proved otherwise."),
  ])

A(82, system="cardiovascular", weight=9, topic="acs-management", domain="cardiovascular", diff=3, subject="cardiology",
  takeaway="One month after PCI, switching from ticagrelor to clopidogrel may be considered when bleeding risk is high. Both antiplatelet drugs are not stopped.",
  citation=ACS,
  scenario="A 71-year-old patient received a stent five weeks ago and takes aspirin plus ticagrelor. Last week he had black stool that stopped. Hemoglobin is stable at 10.4 g/dL and he is not tachycardic. A colleague stops both aspirin and ticagrelor.",
  question="Which platelet change may be considered?",
  correct=W("Switching ticagrelor to clopidogrel may be considered, with aspirin continued",
            "The 2025 guideline says de-escalation from ticagrelor or prasugrel to clopidogrel may be considered after one month in PCI patients at higher bleeding risk. It is not a mandate to stop all antiplatelet therapy."),
  wrongs=[
    W("Stop aspirin and ticagrelor together", "Stopping both drugs soon after a stent leaves stent thrombosis unprotected."),
    W("Load prasugrel, because a bleed means a stronger platelet drug is required", "De-escalation moves toward clopidogrel, not toward a more potent drug."),
    W("Continue ticagrelor and add an anticoagulant", "Adding an anticoagulant increases bleeding."),
    W("No change is ever allowed in the first year, so the black stool is ignored", "A considered de-escalation after one month is allowed. Ignoring the bleed is too rigid."),
  ])

A(83, system="respiratory-renal", weight=8, topic="aki-ckd-electrolytes", domain="respiratory-renal", diff=2, subject="nephrology",
  takeaway="Adults aged 50 or older with CKD who are not on dialysis are treated with a statin even when LDL cholesterol is under 100 mg/dL.",
  citation=KDIGO,
  scenario="A 62-year-old patient has an estimated filtration rate of 40 mL/min/1.73 m2 and is not on dialysis. LDL cholesterol is 96 mg/dL. He has no chest pain. A colleague withholds a statin because the LDL is under 100 and says statins start only after dialysis begins.",
  question="Which lipid plan matches age 62 and this filtration rate?",
  correct=W("Start a statin now",
            "KDIGO 2024 recommends a statin for adults 50 and older with CKD who are not on dialysis. The indication is age plus CKD, not an LDL above 190 and not a dialysis start."),
  wrongs=[
    W("No statin until dialysis, and not while LDL cholesterol is under 100", "Dialysis is not the start signal, and 96 mg/dL does not cancel the indication."),
    W("A fibrate instead of a statin", "A fibrate is not the lipid drug this recommendation names."),
    W("High-dose niacin", "Niacin is not the KDIGO recommendation for CKD."),
    W("Start a statin only if LDL cholesterol later exceeds 190 mg/dL", "The 190 mg/dL threshold is a different population. CKD at his age is already an indication."),
  ])

A(84, system="respiratory-renal", weight=8, topic="aki-ckd-electrolytes", domain="respiratory-renal", diff=2, subject="nephrology",
  takeaway="A urine albumin-to-creatinine ratio of 30 to 300 mg/g is already moderately increased. It is not a normal result.",
  citation=KDIGO,
  scenario="A 55-year-old patient with diabetes has a urine albumin-to-creatinine ratio of 80 mg/g and an estimated filtration rate of 78 mL/min/1.73 m2. Blood pressure is 136/84 mm Hg. A colleague calls the ratio normal because it is under 300.",
  question="What does an albumin ratio of 80 mg/g mean?",
  correct=W("Moderately increased albuminuria, so start an ACE inhibitor or an ARB",
            "KDIGO puts 30 to 300 mg/g in the moderately increased range. Under 30 is normal to mild, and above 300 is severe. Diabetes plus this ratio supports one renin-angiotensin drug, not both."),
  wrongs=[
    W("Normal albumin excretion, so no renin-angiotensin drug is indicated", "Under 300 is not the definition of normal. Normal to mild is under 30."),
    W("Severely increased albuminuria that requires dialysis this week", "Severe increase begins above 300. Eighty is not dialysis."),
    W("Laboratory error, because the filtration rate is above 60", "Albuminuria and filtration are separate axes."),
    W("An indication for combined ACE inhibitor and ARB therapy", "The ratio supports one drug from the class, not both."),
  ])

A(85, system="reproductive-endocrine", weight=10, topic="preeclampsia-eclampsia", domain="reproductive-endocrine", diff=3, subject="obstetrics",
  takeaway="Platelets below 100,000 are a severe feature. At 36 weeks that means delivery after stabilization and magnesium, not observation until 37 weeks.",
  citation=ACOG,
  scenario="A 33-year-old patient is at 36 weeks and 1 day. Blood pressure is 150/96 mm Hg. She has no headache. Platelets are 85,000 per microliter, creatinine is 0.7 mg/dL, and liver enzymes are normal. The fetus is reassuring. A colleague plans expectant care until 37 weeks because she feels well.",
  question="What do the platelets change about the timing?",
  correct=W("Stabilize her, give magnesium, and deliver rather than wait until 37 weeks",
            "Platelets below 100,000 are a severe feature. At 36 weeks, which is past 34 0/7, ACOG recommends delivery after stabilization. Feeling well does not erase the count. Magnesium is for seizure prevention."),
  wrongs=[
    W("Nothing. Feeling well allows expectant care until 37 weeks", "The 37-week rule is for disease without a severe feature. The platelet count is a severe feature."),
    W("Discharge on oral labetalol and recheck the platelets in a week", "A severe feature at 36 weeks is not an outpatient week of waiting."),
    W("Platelet transfusion only, with delivery at 39 weeks", "Transfusion does not replace delivery timing or magnesium."),
    W("Immediate cesarean before magnesium is started", "She needs stabilization and magnesium. The count does not by itself choose a cesarean."),
  ])
