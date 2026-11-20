"""Step 2 items 51-75."""

from lib import item

OUD = "ASAM National Practice Guideline for the Treatment of Opioid Use Disorder, 2020."
CAP = "ATS/IDSA 2019 guideline on community-acquired pneumonia in adults."
BRON = "CDC antibiotic prescribing guidance, 2024: uncomplicated acute bronchitis in otherwise healthy adults does not get antibiotics."
GINA = "Global Initiative for Asthma, GINA Strategy Report 2025."
AF = "2023 ACC/AHA/ACCP/HRS Guideline for the Diagnosis and Management of Atrial Fibrillation."
VALVE = "2020 ACC/AHA Guideline for the Management of Patients With Valvular Heart Disease."
NITR = "FDA prescribing information for nitroglycerin, 2023 label: nitrates are contraindicated with phosphodiesterase-5 inhibitors."
KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."
HIT = "ASH 2018 guidelines for management of heparin-induced thrombocytopenia."
ITP = "ASH 2019 guidelines for immune thrombocytopenia."
MEC = "CDC U.S. Medical Eligibility Criteria for Contraceptive Use, 2024."
ATA = "2017 American Thyroid Association guidelines for the diagnosis and management of thyroid disease during pregnancy."
DKA = "ADA consensus report on hyperglycemic crises in adults with diabetes, 2024."
ADA = "American Diabetes Association Standards of Care in Diabetes, 2026."
BEERS = "American Geriatrics Society Beers Criteria, 2023."
SCZ = "APA Practice Guideline for the Treatment of Patients With Schizophrenia, 2020."

def W(a, b):
    return (a, b)

def Q(n, **k):
    return item(n, "step2", **k)

ITEMS = []

ITEMS.append(Q(51, sex="m", system="behavioral-nervous", weight=12, topic="opioid-use", diff=3, subject="psychiatry",
  takeaway="Buprenorphine for opioid use disorder can start without a completed inpatient detox. Detox alone is not the treatment.",
  citation=OUD,
  scenario="A 34-year-old man uses heroin daily and wants medication treatment. He is not in respiratory failure. A colleague says he must finish a 7-day inpatient detox with no buprenorphine before any medication can be considered.",
  question="Does treatment have to wait for a drug-free detox week?",
  correct=W("No. Buprenorphine is the treatment. A drug-free week is not required first",
            "Buprenorphine for opioid use disorder can start without a completed inpatient detox. Detox alone is not the treatment. He can be induced when withdrawal is beginning. Withholding medication for a drug-free week raises relapse risk."),
  wrongs=[
    W("Yes. Seven drug-free days are mandatory before any medication", "Medication is the treatment. A forced drug-free week is not the gate."),
    W("Naltrexone tonight while he is still using heroin", "Naltrexone would precipitate withdrawal if an opioid is still present. It is not the immediate start."),
    W("Methadone is illegal to discuss in any setting", "Methadone is a treatment in licensed programs. The error is the mandatory detox delay."),
    W("Ibuprofen as the medication for opioid use disorder", "An NSAID does not treat the use disorder."),
  ]))

ITEMS.append(Q(52, sex="f", system="respiratory-renal", weight=13, topic="pneumonia", diff=3, subject="pulmonology",
  takeaway="A healthy adult with outpatient pneumonia is treated with amoxicillin or doxycycline, not a fluoroquinolone as the first drug.",
  citation=CAP,
  scenario="A 33-year-old woman has had cough and fever for two days. Her temperature is 38.3 C, her pulse is 96/min, and her blood pressure is 122/74 mm Hg. She has no lung disease, no recent antibiotics, and no immunosuppression. A chest film shows one lobar infiltrate. A colleague prescribes levofloxacin and says every pneumonia starts with that class.",
  question="Which outpatient drug fits a healthy adult?",
  correct=W("Amoxicillin or doxycycline, not levofloxacin first",
            "A healthy adult with outpatient pneumonia is treated with amoxicillin or doxycycline, not a fluoroquinolone as the first drug. She has no comorbidity and is stable enough for home. Levofloxacin is reserved for sicker or comorbid patients."),
  wrongs=[
    W("Levofloxacin as the preferred first drug for every outpatient", "Healthy outpatients are not started on a fluoroquinolone."),
    W("No antibiotic, because the blood pressure is normal", "A lobar infiltrate with fever is treated."),
    W("Oseltamivir alone, with no antibacterial drug", "Nothing here selects influenza as the only treatment."),
    W("A 21-day course of amoxicillin", "The usual course is about 5 days when she improves, not 21 days."),
  ]))

ITEMS.append(Q(53, sex="m", system="respiratory-renal", weight=13, topic="pneumonia", diff=3, subject="pulmonology",
  takeaway="Outpatient pneumonia plus chronic heart or lung disease uses combination therapy or a respiratory fluoroquinolone, not amoxicillin alone.",
  citation=CAP,
  scenario="A 70-year-old man with COPD has fever and a lobar infiltrate. His blood pressure is 130/78 mm Hg, his pulse is 100/min, and he can take pills. A colleague prescribes amoxicillin alone, using the regimen for a healthy young adult.",
  question="Why is amoxicillin alone the wrong regimen?",
  correct=W("COPD is a comorbidity, so he needs broader coverage than amoxicillin alone",
            "Outpatient pneumonia plus chronic heart or lung disease uses combination therapy or a respiratory fluoroquinolone, not amoxicillin alone. His COPD changes the regimen. He can still be treated by mouth because he is stable."),
  wrongs=[
    W("Amoxicillin alone is correct at every age and every comorbidity", "Comorbidity is what changes the regimen."),
    W("Immediate intubation because he is 70", "Age 70 with a normal pressure and the ability to swallow is not an intubation indication."),
    W("A steroid only, and no antibiotic", "The infiltrate is treated with an antibiotic. A steroid does not replace it."),
    W("Nitrofurantoin, because it treats lung infection", "Nitrofurantoin does not treat pneumonia."),
  ]))

ITEMS.append(Q(54, sex="f", system="respiratory-renal", weight=13, topic="bronchitis", diff=2, subject="pulmonology",
  takeaway="Uncomplicated acute bronchitis in a healthy adult does not get an antibiotic.",
  citation=BRON,
  scenario="A 28-year-old woman has had a cough for 8 days. Her temperature is 37.2 C, her lungs are clear, and a chest film is not indicated. She has no COPD and no immunosuppression. A colleague prescribes azithromycin because a cough that lasts a week is bacterial.",
  question="Does this cough need an antibiotic?",
  correct=W("No. Uncomplicated bronchitis is not treated with azithromycin",
            "Uncomplicated acute bronchitis in a healthy adult does not get an antibiotic. Eight days of cough with a clear examination is the usual viral course. An antibiotic does not shorten it in a useful way and adds harm."),
  wrongs=[
    W("Yes. Every cough longer than 5 days is bacterial", "Duration alone does not make bronchitis bacterial."),
    W("Yes, but only with a fluoroquinolone", "A fluoroquinolone is also an antibiotic she does not need."),
    W("No antibiotic is ever used for any cough, including pneumonia", "Pneumonia is treated. She does not have it."),
    W("A 14-day steroid burst as required therapy", "A long steroid course is not the treatment of uncomplicated bronchitis."),
  ]))

ITEMS.append(Q(55, sex="m", system="respiratory-renal", weight=13, topic="asthma-safety", diff=3, subject="pulmonology",
  takeaway="A long-acting beta agonist is never used as the only asthma drug. It has to be paired with an inhaled corticosteroid.",
  citation=GINA,
  scenario="A 31-year-old man with asthma is prescribed salmeterol alone. He uses it daily and has no inhaled corticosteroid. He wheezes most days. A colleague says the long-acting drug replaces the need for an anti-inflammatory inhaler.",
  question="Why is salmeterol alone unsafe?",
  correct=W("A long-acting beta agonist without an inhaled corticosteroid increases severe attacks",
            "A long-acting beta agonist is never used as the only asthma drug. It has to be paired with an inhaled corticosteroid. Daily wheeze needs an anti-inflammatory drug. Salmeterol alone is the regimen the reports tell clinicians not to use."),
  wrongs=[
    W("Salmeterol alone is the preferred controller", "It is not. The anti-inflammatory drug is required."),
    W("Stop every inhaler because wheeze most days is too mild to treat", "Symptoms most days are a reason to treat, not to stop."),
    W("Oral theophylline as a safe substitute for the corticosteroid", "A methylxanthine does not replace the inhaled corticosteroid."),
    W("Add a second long-acting beta agonist and still skip the corticosteroid", "A second bronchodilator still leaves inflammation untreated."),
  ]))

ITEMS.append(Q(56, sex="m", system="cardiovascular", weight=9, topic="atrial-fibrillation", diff=3, subject="cardiology",
  takeaway="Nonvalvular atrial fibrillation with a high stroke score is anticoagulated with a DOAC. Aspirin alone is not the stroke drug.",
  citation=AF,
  scenario="A 76-year-old man has atrial fibrillation and a CHA2DS2-VASc score of 4. He has no mechanical valve and no mitral stenosis. His creatinine clearance is 70 mL/min. A colleague starts aspirin 81 mg and says anticoagulation is only for a score above 6.",
  question="Which stroke prevention fits a score of 4?",
  correct=W("A direct oral anticoagulant, not aspirin alone",
            "Nonvalvular atrial fibrillation with a high stroke score is anticoagulated with a DOAC. Aspirin alone is not the stroke drug. A score of 4 in a man is well above the treatment line. He can take a DOAC. Warfarin is not required because he has no valve disease that forces it."),
  wrongs=[
    W("Aspirin 81 mg as sufficient stroke prevention", "Aspirin does not replace anticoagulation at this score."),
    W("No drug until the score reaches 6", "Treatment is indicated well below 6."),
    W("Dual antiplatelet therapy instead of anticoagulation", "Two antiplatelet drugs are not the stroke regimen for this score."),
    W("A DOAC only if a mechanical valve is also present", "A mechanical valve would push him to warfarin, not be required before a DOAC."),
  ]))

ITEMS.append(Q(57, sex="f", system="cardiovascular", weight=9, topic="valvular-disease", diff=3, subject="cardiology",
  takeaway="A mechanical mitral valve is anticoagulated with warfarin. A DOAC is not a substitute.",
  citation=VALVE,
  scenario="A 62-year-old woman has a mechanical mitral valve and atrial fibrillation. Her INR has been hard to check, so a colleague switches her from warfarin to apixaban and says all atrial fibrillation now uses a DOAC.",
  question="Why is apixaban the wrong switch?",
  correct=W("The mechanical mitral valve requires warfarin. Atrial fibrillation does not override that",
            "A mechanical mitral valve is anticoagulated with warfarin. A DOAC is not a substitute. The atrial fibrillation would have allowed a DOAC only if the valve were not mechanical. The valve is the fact that keeps warfarin."),
  wrongs=[
    W("Apixaban is preferred for every mechanical valve", "Mechanical valves stay on warfarin."),
    W("Stop anticoagulation because the valve is mechanical and therefore protected", "The mechanical valve is the reason anticoagulation continues."),
    W("Aspirin alone replaces warfarin after the first year", "Aspirin does not replace warfarin for this valve."),
    W("A DOAC is acceptable if the INR has ever been therapeutic", "A past therapeutic INR does not create a DOAC indication."),
  ]))

ITEMS.append(Q(58, sex="m", system="cardiovascular", weight=9, topic="valvular-disease", diff=3, subject="cardiology",
  takeaway="Moderate or severe mitral stenosis with atrial fibrillation is anticoagulated with warfarin, not a DOAC.",
  citation=AF,
  scenario="A 58-year-old man has atrial fibrillation and moderate mitral stenosis from rheumatic disease. His CHA2DS2-VASc score is 3. A colleague starts rivaroxaban because the score, not the valve, chooses the drug.",
  question="Which anticoagulant fits the stenosis?",
  correct=W("Warfarin. The stenosis excludes a DOAC",
            "Moderate or severe mitral stenosis with atrial fibrillation is anticoagulated with warfarin, not a DOAC. The score shows he needs anticoagulation. It does not show that a DOAC is allowed. Rheumatic stenosis is the exclusion."),
  wrongs=[
    W("Rivaroxaban, because a score of 3 always selects a DOAC", "The score selects anticoagulation. The stenosis selects warfarin."),
    W("Aspirin, because stenosis lowers stroke risk", "Stenosis does not lower the need for anticoagulation."),
    W("No anticoagulant if the stenosis is only moderate", "Moderate stenosis is already the exclusion for a DOAC and still needs anticoagulation."),
    W("Dual antiplatelet therapy for one month and then nothing", "A month of antiplatelet drugs does not treat this valve lesion."),
  ]))

ITEMS.append(Q(59, sex="m", system="cardiovascular", weight=9, topic="nitrate-safety", diff=2, subject="pharmacology",
  takeaway="A nitrate and a phosphodiesterase-5 inhibitor together can cause severe hypotension. The combination is contraindicated.",
  citation=NITR,
  scenario="A 64-year-old man takes sildenafil for erectile dysfunction. He now has angina and a blood pressure of 136/80 mm Hg. A colleague gives sublingual nitroglycerin and says the sildenafil he took four hours ago is irrelevant.",
  question="Why is the nitroglycerin unsafe right now?",
  correct=W("He took sildenafil four hours ago, and a nitrate is contraindicated with that drug",
            "A nitrate and a phosphodiesterase-5 inhibitor together can cause severe hypotension. The combination is contraindicated. Four hours is well inside the interaction window. A pressure of 136 does not make the combination safe."),
  wrongs=[
    W("The nitrate is required, and sildenafil does not interact with it", "The interaction is a labeled contraindication."),
    W("Give the nitrate only if the pressure is already below 100", "A low pressure would be another reason to avoid a nitrate, not the condition that makes this pair safe."),
    W("Double the sildenafil so the angina stops", "More of the erectile drug does not treat angina and deepens the interaction."),
    W("The interaction lasts only 30 minutes, so four hours is safe", "The window is many hours, not 30 minutes."),
  ]))

ITEMS.append(Q(60, sex="f", system="cardiovascular", weight=9, topic="aortic-stenosis", diff=3, subject="cardiology",
  takeaway="Symptomatic severe aortic stenosis is referred for valve replacement. Medical therapy does not replace the valve.",
  citation=VALVE,
  scenario="A 78-year-old woman has exertional syncope. The valve area is 0.8 cm2 and the mean gradient is 48 mm Hg. Her ejection fraction is 60 percent. A colleague starts a beta blocker and says surgery can wait until she has chest pain as well as syncope.",
  question="What does syncope plus this valve area mean?",
  correct=W("Refer for valve replacement. Syncope is already a severe symptom",
            "Symptomatic severe aortic stenosis is referred for valve replacement. Medical therapy does not replace the valve. A valve area of 0.8 cm2 and a gradient of 48 mm Hg are severe, and syncope is a classic symptom. Waiting for chest pain adds a risk the guideline does not ask for."),
  wrongs=[
    W("A beta blocker is definitive therapy, so no referral is needed", "No pill replaces the valve once symptoms and severe stenosis are both present."),
    W("Referral only after a second syncope", "The first syncope is enough."),
    W("Balloon the valve and never replace it, because the ejection fraction is 60 percent", "A preserved ejection fraction does not cancel replacement. Balloon valvuloplasty is not the destination therapy."),
    W("Start a nitrate for the syncope", "A nitrate can drop preload in severe stenosis. It is not the treatment."),
  ]))
