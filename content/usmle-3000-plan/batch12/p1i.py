"""Step 1 items 91-100."""

from lib import s1

ACS = "2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes."
HF = "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure, which remains the current United States heart-failure guideline."
KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."
ADA = "American Diabetes Association, Standards of Care in Diabetes, 2026, sections 9 and 11."
GOLD = "Global Initiative for Chronic Obstructive Lung Disease, GOLD 2026 report."
GINA = "Global Initiative for Asthma, GINA Strategy Report 2025."
ACR = "2020 American College of Rheumatology Guideline for the Management of Gout."
ACOG = "ACOG Practice Bulletin No. 222, Gestational Hypertension and Preeclampsia, 2020, the current ACOG bulletin on this topic."

def W(a, b):
    return (a, b)

ITEMS = []

def A(n, **k):
    ITEMS.append(s1(n, **k))

A(91, system="cardiovascular", weight=9, topic="acs-pathophysiology", domain="cardiovascular", diff=3, subject="pharmacology",
  takeaway="High-intensity statin therapy is indicated for every acute coronary syndrome. The indication is the event, not an LDL cholesterol above 190 mg/dL.",
  citation=ACS,
  scenario="A 54-year-old patient is pain-free after stenting for ST-segment elevation. No lipid panel has returned. A classmate withholds a statin until LDL cholesterol is shown to exceed 190 mg/dL.",
  question="What has to be known before the statin starts?",
  correct=W("Nothing about the baseline LDL cholesterol. The event itself is the indication",
            "The 2025 ACS guideline recommends high-intensity statin therapy for all patients with an acute coronary syndrome. The 190 mg/dL threshold is a primary-prevention rule and is not required here."),
  wrongs=[
    W("The LDL cholesterol must exceed 190 mg/dL", "That threshold does not gate therapy after an acute coronary syndrome."),
    W("A triglyceride level above 500 mg/dL", "Triglycerides do not decide whether the statin is indicated."),
    W("A normal troponin, which would cancel the statin", "The statin follows the coronary event. A falling or normal later troponin does not cancel it."),
    W("Failure of a fibrate first", "A fibrate is not a required first lipid drug."),
  ])

A(92, system="cardiovascular", weight=9, topic="heart-failure-pathophysiology", domain="cardiovascular", diff=3, subject="pharmacology",
  takeaway="Symptomatic HFrEF is an indication for an SGLT2 inhibitor even when the A1c is normal. Diabetes is not required.",
  citation=HF,
  scenario="A 61-year-old patient has an ejection fraction of 34 percent, dyspnea on one flight of stairs, and an A1c of 5.3 percent. He is already on an ARNI, carvedilol, and spironolactone. A classmate skips the SGLT2 inhibitor because there is no diabetes.",
  question="Does a normal A1c remove the SGLT2 inhibitor?",
  correct=W("No. The indication is symptomatic HFrEF, not the A1c",
            "The 2022 guideline recommends an SGLT2 inhibitor in symptomatic chronic HFrEF regardless of type 2 diabetes. An A1c of 5.3 percent is not a contraindication."),
  wrongs=[
    W("Yes. The trials apply only above an A1c of 6.5 percent", "Diabetes is not required."),
    W("No, but only when the A1c is below 5 percent", "There is no lower A1c requirement."),
    W("Yes, unless the ejection fraction is above 50", "His ejection fraction is 34 percent, which is the reduced range where the recommendation is class 1."),
    W("The SGLT2 inhibitor replaces the beta blocker", "The classes are combined. One does not replace the other."),
  ])

A(93, system="respiratory-renal", weight=13, topic="aki-mechanisms", domain="respiratory-renal", diff=3, subject="pharmacology",
  takeaway="An SGLT2 inhibitor is held for major surgery and prolonged fasting because ketosis is more likely, even if the fingerstick glucose looks acceptable.",
  citation=KDIGO,
  scenario="A 63-year-old patient takes an SGLT2 inhibitor and is fasting for a bowel resection tomorrow. The fingerstick glucose is 136 mg/dL. The order set gives the usual morning dose.",
  question="Why is the morning dose the wrong plan?",
  correct=W("Fasting and surgery raise the chance of ketosis. Hold the drug even though the glucose is 136",
            "KDIGO 2024 says it is reasonable to withhold an SGLT2 inhibitor during prolonged fasting, surgery, or critical illness. A near-normal glucose does not exclude ketosis."),
  wrongs=[
    W("Give the dose. A glucose of 136 proves ketones are absent", "Glucose and ketones do not move in lockstep on this drug."),
    W("Double the dose to cover surgical stress", "A higher dose during a fast increases the risk being avoided."),
    W("Stop the drug permanently because surgery ends the indication", "The hold is temporary and ends after he is eating again. Surgery does not cancel the indication."),
    W("Replace it with a sulfonylurea while he is fasting", "A sulfonylurea during a fast adds hypoglycemia."),
  ])

A(94, system="reproductive-endocrine", weight=14, topic="diabetes-pathophysiology", domain="reproductive-endocrine", diff=3, subject="pharmacology",
  takeaway="Below an eGFR of 30, a GLP-1 receptor agonist is the preferred glucose-lowering drug. Metformin is contraindicated.",
  citation=ADA,
  scenario="A 73-year-old patient has type 2 diabetes, an A1c of 8.3 percent, and an eGFR of 22 mL/min/1.73 m2. He is not on dialysis. A classmate starts metformin because some oral drug is needed.",
  question="Which class is preferred for glucose lowering at this filtration rate?",
  correct=W("A GLP-1 receptor agonist. Do not start metformin",
            "ADA 2026 prefers a GLP-1 receptor agonist for glycemic management below an eGFR of 30 and states that metformin is contraindicated below 30. An SGLT2 inhibitor may still be used for kidney protection down to 20, but it is not the preferred glucose drug here."),
  wrongs=[
    W("Metformin, because any eGFR above 15 allows it", "The contraindication is 30, not 15."),
    W("A sulfonylurea, because low filtration protects against hypoglycemia", "Low filtration increases hypoglycemia risk from a sulfonylurea."),
    W("No glucose-lowering drug is permitted below 30", "A GLP-1 receptor agonist that is not renally cleared can be used."),
    W("Insulin is the only legal choice below 30", "Insulin can be used, but it is not the only choice the standards allow."),
  ])

A(95, system="respiratory-renal", weight=13, topic="asthma-copd-pathology", domain="respiratory-renal", diff=2, subject="pharmacology",
  takeaway="Methylxanthines such as theophylline are not recommended for a COPD exacerbation. The harm is the side-effect profile.",
  citation=GOLD,
  scenario="A 74-year-old patient with a moderate COPD exacerbation is already receiving bronchodilators. A classmate adds intravenous theophylline for additional bronchodilation. The respiratory rate is 22/min and the radiograph is clear.",
  question="Why is theophylline not added?",
  correct=W("Side effects outweigh the small bronchodilator effect. The report recommends against it",
            "GOLD 2026 says methylxanthines are not recommended for exacerbations because of adverse effects. Bronchodilators already cover the airway-opening need."),
  wrongs=[
    W("It is first-line once the respiratory rate exceeds 20", "Respiratory rate does not create a theophylline indication."),
    W("It replaces corticosteroids", "The corticosteroid course is separate and is not replaced by a methylxanthine."),
    W("It is safe because the therapeutic window is wide", "The narrow window and the side effects are why it is not recommended."),
    W("It is indicated when the radiograph is clear", "A clear radiograph does not select theophylline."),
  ])

A(96, system="respiratory-renal", weight=13, topic="asthma-copd-pathology", domain="respiratory-renal", diff=3, subject="pharmacology",
  takeaway="When ICS-formoterol is available, GINA prefers it over a short-acting beta agonist alone, including for infrequent symptoms.",
  citation=GINA,
  scenario="A 26-year-old patient wheezes on two days a week, with no night waking, and a bronchodilator response on spirometry. ICS-formoterol is on the formulary. A classmate refills albuterol only, because symptoms are infrequent.",
  question="Which reliever is preferred?",
  correct=W("As-needed low-dose ICS-formoterol",
            "GINA 2025 Track 1 is preferred when the combination is available, including at the mild end of the ladder. Infrequent symptoms do not justify a short-acting beta agonist alone."),
  wrongs=[
    W("Albuterol alone, because two days a week is too mild for a corticosteroid", "The preferred reliever still contains an inhaled corticosteroid."),
    W("Daily high-dose ICS-formoterol with no as-needed use", "That is a higher step than this symptom pattern."),
    W("A leukotriene blocker and no inhaler", "A leukotriene blocker is not the preferred reliever."),
    W("Oral prednisone for five days each month", "Scheduled oral corticosteroid is not the mild-symptom plan."),
  ])

A(97, system="msk-skin", weight=10, topic="gout-crystals", domain="msk-skin", diff=3, subject="pharmacology",
  takeaway="A first flare with urate under 9, no CKD stage 3, and no stones is not an indication to start urate-lowering therapy.",
  citation=ACR,
  scenario="A 46-year-old patient is recovering from a first hot first-toe attack. Urate is 7.0 mg/dL, the estimated filtration rate is 98 mL/min/1.73 m2, and there are no stones. A classmate starts allopurinol 300 mg the same week.",
  question="Is urate-lowering therapy indicated?",
  correct=W("No. This first flare lacks the features that would make therapy reasonable",
            "The 2020 guideline conditionally recommends against starting after a first flare when CKD stage 3 or worse, urate above 9, and stones are all absent. All three are absent here. A 300 mg start would also skip the low-dose beginning."),
  wrongs=[
    W("Yes. Every first flare starts allopurinol at 300 mg", "A first uncomplicated flare is the group in which therapy is not started."),
    W("Yes, because a urate of 7 is above 6", "Being above the treatment target is not, by itself, an indication after one flare."),
    W("Yes, with pegloticase", "Pegloticase is not first-line and is not indicated here."),
    W("No drug is ever started until five flares have occurred", "The exceptions, such as urate above 9 or CKD, can make therapy reasonable earlier. He simply does not have them."),
  ])

A(98, system="reproductive-endocrine", weight=14, topic="preeclampsia-mechanism", domain="reproductive-endocrine", diff=3, subject="pathology",
  takeaway="At or after 37 weeks, hypertension with proteinuria and no severe feature is delivered. Waiting until 39 weeks applies the wrong threshold.",
  citation=ACOG,
  scenario="A 33-year-old patient is at 37 weeks and 3 days. Blood pressures are 146/94 and 148/96 mm Hg. The protein-to-creatinine ratio is 0.5. Platelets, creatinine, and liver enzymes are normal, and she has no headache. A classmate schedules delivery at 39 weeks.",
  question="Why is 39 weeks the wrong plan?",
  correct=W("Delivery is recommended at or after 37 weeks when this picture is present without severe features",
            "ACOG Practice Bulletin 222 chooses delivery over continued expectant management once 37 0/7 weeks is reached. Absence of severe features is why she did not need delivery earlier. It is not a reason to wait until 39."),
  wrongs=[
    W("39 weeks is correct because no severe feature is present", "That rule would fit earlier gestational ages, not 37 weeks."),
    W("Delivery is indicated only after a seizure", "Seizure prevention and timing do not wait for a seizure."),
    W("The protein ratio requires a cesarean tonight", "The ratio affects timing, not a mandatory cesarean."),
    W("Magnesium at home until 40 weeks replaces delivery", "She does not have severe features, and home magnesium is not the 37-week plan."),
  ])

A(99, system="cardiovascular", weight=9, topic="heart-failure-pathophysiology", domain="cardiovascular", diff=3, subject="pharmacology",
  takeaway="Only bisoprolol, carvedilol, and metoprolol succinate reduced mortality in HFrEF. Atenolol does not share that evidence.",
  citation=HF,
  scenario="A 64-year-old patient has an ejection fraction of 27 percent and takes atenolol for old palpitations. Heart rate is 76/min and he is euvolemic. A classmate says any beta blocker lowers mortality equally, so the prescription can stay.",
  question="Which statement about atenolol is the consensus?",
  correct=W("Mortality reduction is not a class effect. Atenolol is not one of the three drugs with that evidence",
            "The 2022 guideline names bisoprolol, carvedilol, and metoprolol succinate and says the findings should not be extended to other beta blockers. Continuing atenolol applies a class effect the guideline rejects."),
  wrongs=[
    W("Atenolol has the same mortality evidence as carvedilol", "It does not. The evidence is not a class effect."),
    W("No beta blocker should be used below an ejection fraction of 30", "An evidence-based beta blocker is indicated. The molecule is what changes."),
    W("Metoprolol tartrate can be substituted milligram for milligram", "The metoprolol product with the evidence is succinate, not tartrate."),
    W("Two beta blockers are better than one", "One evidence-based agent replaces atenolol. They are not stacked."),
  ])

A(100, system="respiratory-renal", weight=13, topic="glomerular-diseases", domain="respiratory-renal", diff=3, subject="physiology",
  takeaway="A urine albumin-to-creatinine ratio of 30 to 300 mg/g is moderately increased. Diabetes plus that ratio supports an ACE inhibitor or an ARB, not both.",
  citation=KDIGO,
  scenario="A 54-year-old patient with diabetes has a urine albumin-to-creatinine ratio of 90 mg/g and an eGFR of 74 mL/min/1.73 m2. Blood pressure is 134/82 mm Hg. A classmate calls 90 normal because it is under 300 and offers no renin-angiotensin drug.",
  question="What category is a ratio of 90 mg/g, and which drug follows?",
  correct=W("Moderately increased albuminuria. Start an ACE inhibitor or an ARB, not both",
            "KDIGO places 30 to 300 mg/g in the moderate category. Under 30 would be normal to mild. Diabetes with this ratio is a reason for one renin-angiotensin drug. The filtration rate of 74 does not erase the albumin result."),
  wrongs=[
    W("Normal albumin excretion, so no drug is indicated", "Under 300 is not the normal range. Normal to mild is under 30."),
    W("Severely increased albuminuria requiring dialysis", "Severe increase begins above 300. Ninety is not a dialysis indication."),
    W("Moderately increased, so start an ACE inhibitor and an ARB together", "The category is right and the dual blockade is wrong."),
    W("Uninterpretable until the eGFR is below 30", "Albumin category is read at any filtration rate."),
  ])
