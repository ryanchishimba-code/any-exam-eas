"""Replacements for Step 1 items that repeated a Step 2 decision."""

from lib import s1

ACS = "2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes."
ACOG = "ACOG Practice Bulletin No. 222, Gestational Hypertension and Preeclampsia, 2020, the current ACOG bulletin on this topic."
KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."
HF = "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure, which remains the current United States heart-failure guideline."
ACG = "American College of Gastroenterology Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding, 2021."
GOLD = "Global Initiative for Chronic Obstructive Lung Disease, GOLD 2026 report."
GINA = "Global Initiative for Asthma, GINA Strategy Report 2025."
USP_LU = "US Preventive Services Task Force lung cancer screening recommendation, 2021."
USP_CR = "US Preventive Services Task Force colorectal cancer screening recommendation, 2021."
USP_BR = "US Preventive Services Task Force breast cancer screening recommendation, 2024."
USP_ASB = "US Preventive Services Task Force asymptomatic bacteriuria screening recommendation, 2019."
ADA = "American Diabetes Association, Standards of Care in Diabetes, 2026, sections 9 and 11."
ACR = "2020 American College of Rheumatology Guideline for the Management of Gout."

def W(a, b):
    return (a, b)

FIXES = []

def A(n, **k):
    FIXES.append(s1(n, **k))

A(72, system="cardiovascular", weight=9, topic="acs-pathophysiology", domain="cardiovascular", diff=3, subject="pharmacology",
  takeaway="A malignant intracranial neoplasm is an absolute contraindication to fibrinolysis.",
  citation=ACS,
  scenario="A 66-year-old patient has had chest pain for 45 minutes with 2 mm of ST-segment elevation in V2 through V4. The catheterization laboratory is 3 hours away. He has a known malignant brain tumor and no history of bleeding or stroke. Blood pressure is 138/80 mm Hg. A classmate gives a fibrinolytic because the delay is long and he has never had a hemorrhage.",
  question="Why is the fibrinolytic contraindicated?",
  correct=W("A malignant intracranial neoplasm is an absolute contraindication",
            "The 2025 ACS guideline lists a malignant intracranial neoplasm with prior intracranial hemorrhage and recent ischemic stroke as absolute contraindications. No prior bleed is required. Transfer for PCI is the reperfusion path."),
  wrongs=[
    W("Only a prior hemorrhage counts, so a tumor is irrelevant", "The neoplasm is its own absolute contraindication."),
    W("Give a half dose because the tumor has not bled", "There is no half-dose exception."),
    W("The long delay overrides every intracranial contraindication", "Time does not override an absolute contraindication."),
    W("A brain tumor also prohibits transfer for PCI", "The contraindication is the fibrinolytic. Transfer remains appropriate."),
  ])

A(73, system="cardiovascular", weight=9, topic="acs-pathophysiology", domain="cardiovascular", diff=4, subject="physiology",
  takeaway="ST elevation in posterior leads means this is not 'ST depression alone.' Fibrinolysis is not withheld for that reason when PCI will be late.",
  citation=ACS,
  scenario="A 58-year-old patient has had chest pain for 70 minutes. Leads V1 through V3 show ST-segment depression and a tall R wave in V1. Posterior leads V7 through V9 show 1 mm of ST-segment elevation. Blood pressure is 130/78 mm Hg. PCI would take about 160 minutes. There is no stroke, no bleeding, and no brain tumor. A classmate withholds a fibrinolytic because the anterior leads show depression rather than elevation.",
  question="Why is 'depression alone' the wrong description?",
  correct=W("Posterior ST elevation means a posterior occlusion pattern, so a fibrinolytic is indicated when PCI will take 160 minutes",
            "The 2025 guideline says not to give a fibrinolytic for ST depression alone unless a true posterior infarction is suspected. Here the posterior leads show the elevation. Onset is under 12 hours, the delay exceeds 120 minutes, and no absolute contraindication is present."),
  wrongs=[
    W("Anterior depression always prohibits a fibrinolytic, whatever the posterior leads show", "The exception is a true posterior infarction, which these posterior leads show."),
    W("Posterior elevation is ignored unless it reaches 5 mm", "One millimeter of posterior elevation is already the finding that changes the category."),
    W("Wait 12 hours because posterior patterns reperfuse themselves", "Waiting closes the window. The delay already exceeds 120 minutes."),
    W("Give nitroglycerin only, because posterior occlusion is a spasm pattern", "This is a reperfusion indication, not a spasm diagnosis."),
  ])

A(76, system="reproductive-endocrine", weight=14, topic="preeclampsia-mechanism", domain="reproductive-endocrine", diff=2, subject="pharmacology",
  takeaway="Chronic hypertension is a high-risk factor for aspirin 81 mg daily, started between 12 and 28 weeks.",
  citation=ACOG,
  scenario="A 30-year-old patient is at 13 weeks and has taken labetalol for chronic hypertension for two years. Blood pressure today is 128/78 mm Hg. She has no diabetes and no prior pregnancy. A classmate says aspirin prevention is only for someone who already had the disease in a past pregnancy.",
  question="What prevention fits chronic hypertension at 13 weeks?",
  correct=W("Aspirin 81 mg daily until delivery",
            "ACOG lists chronic hypertension as a high-risk factor, the same group as a prior affected pregnancy. Thirteen weeks is inside 12 to 28 weeks and before 16 weeks, which is optimal. The dose is 81 mg."),
  wrongs=[
    W("No aspirin, because she has never been pregnant before", "A first pregnancy is not required when a high-risk factor is already present."),
    W("Aspirin 325 mg until week 20", "The dose is 81 mg, continued until delivery."),
    W("Stop labetalol and use aspirin alone", "Aspirin does not replace her blood-pressure drug."),
    W("Start aspirin only if today's pressure exceeds 160/110", "Prevention is started while she is controlled, not after severe-range pressure appears."),
  ])

A(77, system="reproductive-endocrine", weight=14, topic="preeclampsia-mechanism", domain="reproductive-endocrine", diff=3, subject="pathology",
  takeaway="New visual change is a severe feature even when platelets, creatinine, and liver enzymes are normal.",
  citation=ACOG,
  scenario="A 28-year-old patient at 32 weeks has a blood pressure of 150/96 mm Hg and new spots in her vision. Platelets are 190,000, creatinine is 0.6 mg/dL, and liver enzymes are normal. A classmate says vision does not count unless a laboratory number is also abnormal.",
  question="Which finding is the severe feature?",
  correct=W("The new visual change",
            "ACOG lists visual disturbances as a severe feature. Normal laboratories do not cancel it. She is not classified as disease without severe features."),
  wrongs=[
    W("None. Only a laboratory number can be a severe feature", "Vision and headache are clinical severe features."),
    W("The blood pressure of 150/96, because it exceeds 140/90", "That confirms hypertension. Severe-range pressure is 160 or 110. The severe feature here is the vision."),
    W("A normal creatinine, which proves the vision is unrelated", "A normal creatinine does not explain the visual change."),
    W("Spots in the vision are expected in every pregnancy after 30 weeks", "New visual change is a severe feature, not a normal late-pregnancy symptom."),
  ])

A(80, system="respiratory-renal", weight=13, topic="aki-mechanisms", domain="respiratory-renal", diff=3, subject="physiology",
  takeaway="After a leg amputation, low muscle mass can make creatinine look falsely reassuring. If the number changes a drug dose, add cystatin C.",
  citation=KDIGO,
  scenario="A 72-year-old patient had an above-knee amputation last year. Creatinine is 0.7 mg/dL and the creatinine-only filtration estimate is 92 mL/min/1.73 m2. A renally cleared antibiotic will be dosed at full dose on that estimate. He has little remaining muscle. Cystatin C has not been ordered.",
  question="Why is the creatinine-only estimate the wrong one to trust?",
  correct=W("Low muscle mass can make creatinine look better than the true filtration rate. Use creatinine plus cystatin C",
            "KDIGO 2024 recommends the combined estimate when the creatinine-based number is less accurate and it changes a decision. Amputation lowers creatinine production, so 0.7 mg/dL and an estimate of 92 can be falsely high."),
  wrongs=[
    W("Creatinine of 0.7 mg/dL proves filtration is normal in every body size", "Muscle mass changes creatinine independent of filtration."),
    W("Amputation raises creatinine, so 0.7 is impossible and the lab should be ignored", "Amputation lowers creatinine production. The direction of the error is a falsely reassuring number."),
    W("Cystatin C is used only when creatinine is above 2 mg/dL", "The indication is inaccuracy, not a high creatinine."),
    W("Full-dose antibiotics are mandatory after an amputation", "The dose follows the more accurate filtration estimate, not the surgery itself."),
  ])

A(81, system="cardiovascular", weight=9, topic="heart-failure-pathophysiology", domain="cardiovascular", diff=3, subject="pathology",
  takeaway="A positive monoclonal light-chain test means a bone scan must not be read as isolated transthyretin amyloid.",
  citation=HF,
  scenario="A 77-year-old patient has thick walls, low-voltage QRS complexes, and a positive serum monoclonal light-chain assay. A classmate still wants to label the heart transthyretin amyloid from a bone scan alone and skip hematology.",
  question="What does the positive light-chain assay change?",
  correct=W("A plasma-cell disorder has to be evaluated. The scan cannot by itself establish isolated transthyretin amyloid",
            "The 2022 guideline puts the light-chain assay first because a monoclonal protein changes the meaning of the scan. A positive assay is a reason for hematologic evaluation, not for a transthyretin-only label."),
  wrongs=[
    W("Nothing. The scan overrules the blood test", "The blood test is done so the scan is not misread."),
    W("A positive light-chain assay is normal after age 75", "A monoclonal protein is not dismissed as normal aging in this work-up."),
    W("Start tafamidis today because any thick wall is transthyretin amyloid", "Tafamidis is for selected transthyretin disease after the light-chain screen is negative."),
    W("No further testing if the ejection fraction is above 50 percent", "Amyloid work-up does not stop because the ejection fraction is preserved."),
  ])

A(83, system="gastrointestinal", weight=8, topic="gi-bleeding-sources", domain="gastrointestinal", diff=3, subject="physiology",
  takeaway="Epinephrine injection alone fails because the vasoconstriction is temporary and does not create a durable seal.",
  citation=ACG,
  scenario="A 57-year-old patient had an oozing ulcer injected with epinephrine. Bleeding slowed during the injection and then resumed an hour later. No clip or thermal method was used. Hemoglobin fell from 9.1 to 7.4 g/dL. A classmate says injection always produces a permanent seal.",
  question="Why did injection alone not hold?",
  correct=W("The vessel squeeze is temporary. A second method is required for a durable seal",
            "ACG 2021 recommends against epinephrine monotherapy and recommends combining it with a second hemostatic method. The early slowdown is vasoconstriction, not a finished seal."),
  wrongs=[
    W("Epinephrine monotherapy is permanent if bleeding slows in the room", "Slowing in the room is the temporary effect. Rebleeding is why a second method is required."),
    W("The hemoglobin fall means the injection raised the platelet count too high", "The hemoglobin fell because bleeding resumed, not because of a platelet problem."),
    W("A second method is used only if the first injection was saline", "The missing method is the issue, not the identity of a second injectate alone."),
    W("Rebleeding after injection means the diagnosis was never an ulcer", "Recurrent bleeding is a known failure mode of injection alone. It does not erase the ulcer that was seen."),
  ])

A(84, system="cardiovascular", weight=9, topic="heart-failure-pathophysiology", domain="cardiovascular", diff=2, subject="physiology",
  takeaway="When the ejection fraction was 40 percent or lower and is now above 40 percent, the name is improved, not recovered.",
  citation=HF,
  scenario="A 50-year-old patient had an ejection fraction of 25 percent a year ago and now has an ejection fraction of 52 percent. He feels well. A classmate writes 'recovered ejection fraction' and says the word improved is only for patients who are still breathless.",
  question="Which name matches these two measurements?",
  correct=W("Improved ejection fraction. Recovered is the term the guideline avoided",
            "The 2022 guideline defines improved ejection fraction as a previous value of 40 percent or lower and a later value above 40 percent. The writing committee avoided 'recovered' because structure and risk often remain. Symptoms are not required for the name."),
  wrongs=[
    W("Recovered, because he is asymptomatic and the number is above 50", "Asymptomatic improvement is still the improved category, not recovered."),
    W("Preserved, because 52 percent is above 50 and the old study does not count", "The prior value of 25 percent is what places him in the improved category rather than never-reduced preserved function."),
    W("Mildly reduced, because 52 is close to 49", "52 percent is above 50. The category that uses both studies is improved."),
    W("Reduced, because the first number is the only one that counts", "The current number is above 40, so he is not currently in the reduced category. The history is why the improved label exists."),
  ])

A(85, system="cardiovascular", weight=9, topic="acs-pathophysiology", domain="cardiovascular", diff=3, subject="pharmacology",
  takeaway="Ischemic stroke more than 3 months ago is not an absolute contraindication to fibrinolysis. A stroke two months ago is.",
  citation=ACS,
  scenario="A 69-year-old patient had an ischemic stroke four years ago, with a mild residual limp. He now has chest pain for 40 minutes and 2 mm of ST-segment elevation in V2 through V4. PCI would take 150 minutes. There is no brain tumor, no recent head trauma, and no active bleeding. A classmate withholds a fibrinolytic because any lifetime stroke is an absolute bar.",
  question="Does a stroke four years ago absolutely prohibit fibrinolysis?",
  correct=W("No. The absolute ischemic-stroke bar is within 3 months. A remote stroke is not that bar",
            "The 2025 guideline lists ischemic stroke within 3 months as an absolute contraindication and lists older ischemic stroke among relative cautions. Four years is outside the absolute window. With a 150-minute delay and no absolute contraindication, fibrinolysis is not forbidden by that old stroke."),
  wrongs=[
    W("Yes. Any prior ischemic stroke at any date is an absolute contraindication", "The absolute window is 3 months, not a lifetime."),
    W("Yes, unless the residual limp has fully disappeared", "The date, not the limp, sets the absolute window."),
    W("No stroke history is ever relevant", "A stroke inside 3 months would be an absolute contraindication. The remote date is what changes it."),
    W("The remote stroke requires a half-dose fibrinolytic", "There is no half-dose rule for a remote stroke."),
  ])

A(87, system="respiratory-renal", weight=13, topic="asthma-copd-pathology", domain="respiratory-renal", diff=3, subject="pharmacology",
  takeaway="After a COPD exacerbation, long-acting bronchodilators are started before discharge even if the eosinophil count is not back yet. An inhaled corticosteroid is not assumed.",
  citation=GOLD,
  scenario="A 75-year-old patient is ready to leave after a COPD exacerbation. He has no asthma and uses no maintenance inhaler. The eosinophil count has not returned. A classmate either sends him out with no inhaler or starts an inhaled corticosteroid immediately because the count is missing.",
  question="What can be started before the eosinophil count returns?",
  correct=W("Dual long-acting bronchodilators now. Do not commit to an inhaled corticosteroid before the count is known",
            "GOLD 2026 says maintenance long-acting bronchodilators should start as soon as possible after an exacerbation, and it ties the corticosteroid addition to an elevated eosinophil count. A missing count is a reason to start the bronchodilators and wait on the corticosteroid, not a reason to send him out with nothing."),
  wrongs=[
    W("No inhaler until the eosinophil count returns", "The bronchodilators do not wait on that count."),
    W("An inhaled corticosteroid immediately, because a missing count is treated as elevated", "A missing count is not an elevated count."),
    W("Oral prednisone for 30 days and no inhaler", "The systemic course is up to 5 days and does not replace a maintenance inhaler."),
    W("Theophylline until the count returns", "Methylxanthines are not recommended."),
  ])

A(88, system="respiratory-renal", weight=13, topic="asthma-copd-pathology", domain="respiratory-renal", diff=3, subject="physiology",
  takeaway="Routine oxygen for a COPD exacerbation is controlled. A non-rebreather mask at 15 liters is not the default.",
  citation=GOLD,
  scenario="A 72-year-old patient with COPD is having an exacerbation. Oxygen saturation is 86 percent on room air, the respiratory rate is 24/min, and he is awake and protecting his airway. Arterial blood gas is not back. A classmate puts a non-rebreather mask at 15 liters as the default oxygen plan.",
  question="Why is 15 liters by non-rebreather the wrong default?",
  correct=W("Oxygen should be controlled. Unrestricted high-flow oxygen can worsen carbon dioxide retention",
            "GOLD 2026 calls for controlled oxygen in hypoxemic exacerbations and reserves high-flow systems and noninvasive ventilation for respiratory failure. Starting at 15 liters by non-rebreather as the default skips that control. He is awake, so this is not yet a decision for a tube."),
  wrongs=[
    W("Any saturation under 94 percent should start at 15 liters", "The COPD exacerbation plan is controlled oxygen, not an automatic non-rebreather."),
    W("Room air only, because any supplemental oxygen is prohibited", "He is hypoxemic at 86 percent. Oxygen is indicated. The dose is what is controlled."),
    W("Theophylline instead of oxygen", "A methylxanthine is not recommended and does not replace oxygen."),
    W("Immediate intubation because the saturation is under 90 percent", "He is awake and protecting his airway. A saturation of 86 percent is a reason for controlled oxygen, not an automatic tube."),
  ])

A(89, system="social-sciences", weight=8, topic="sensitivity-specificity", domain="social-sciences", diff=2, subject="biostatistics",
  takeaway="Aneurysm screening, when indicated, is one ultrasound. A normal study is not repeated every year.",
  citation="US Preventive Services Task Force abdominal aortic aneurysm screening recommendation, 2019.",
  scenario="A 70-year-old patient who used to smoke had a normal abdominal ultrasound at 66. A classmate orders another one every year until age 75 because the age window is still open.",
  question="How many screening ultrasounds does the recommendation describe?",
  correct=W("One. A normal study is not repeated annually through age 75",
            "The 2019 recommendation is a one-time ultrasound for men aged 65 to 75 who have ever smoked. He already had that study. An open age window does not create a yearly schedule."),
  wrongs=[
    W("Every year until 75", "The recommendation is one-time, not annual."),
    W("Every year for life", "There is no lifetime annual schedule."),
    W("None, because former smoking does not qualify", "Former smoking does qualify. The reason not to repeat is that the one study was already done."),
    W("CT every six months after a normal ultrasound", "CT is not the screening test, and a normal ultrasound does not start a CT program."),
  ])

A(90, system="social-sciences", weight=8, topic="sensitivity-specificity", domain="social-sciences", diff=2, subject="biostatistics",
  takeaway="Cervical screening starts at 21. Age 22 is not too young, and the test at that age is cytology, not primary HPV testing.",
  citation="US Preventive Services Task Force cervical cancer screening recommendation, 2018, which remains the current USPSTF statement.",
  scenario="A 22-year-old patient has never been screened and has no symptoms. A classmate says screening starts at 25 and, if done now, should be HPV testing alone.",
  question="What is offered at age 22?",
  correct=W("Cytology every 3 years. Screening has already started",
            "The current USPSTF statement starts at 21 with cytology alone every 3 years through age 29. Primary HPV testing is an option from 30 to 65, not at 22."),
  wrongs=[
    W("Nothing until age 25", "Screening already starts at 21, so age 22 is not too young."),
    W("HPV testing alone every 5 years", "Primary HPV testing is an option from ages 30 to 65, not at 22."),
    W("Cytology every year", "The cytology interval at this age is every 3 years, not every year."),
    W("A pelvic ultrasound instead of cytology", "Ultrasound does not screen for cervical cell changes."),
  ])

A(91, system="social-sciences", weight=8, topic="sensitivity-specificity", domain="social-sciences", diff=3, subject="biostatistics",
  takeaway="Quitting 14 years ago is still inside the 15-year window, so low-dose CT remains indicated when age and pack-years also qualify.",
  citation=USP_LU,
  scenario="A 63-year-old patient smoked 30 pack-years and quit 14 years ago. He has no symptoms and could undergo lung surgery if a cancer were found. A classmate says 14 years is close enough to 15 to stop screening.",
  question="Does 14 years of abstinence end screening?",
  correct=W("No. The stop point is 15 years, so he still qualifies for annual low-dose CT",
            "The 2021 statement includes people who quit within the past 15 years and stops after 15 years. Fourteen is inside the window. Age 63 and 30 pack-years also qualify."),
  wrongs=[
    W("Yes. Anything over 10 years ends screening", "The interval is 15 years, not 10."),
    W("Yes. Thirty pack-years used the old rule and no longer count", "Thirty pack-years still exceeds the current 20 pack-year minimum."),
    W("No, but the test is now a chest radiograph", "The test remains low-dose CT."),
    W("No, and the interval becomes every 5 years after 10 years of abstinence", "There is no five-year interval. Annual CT continues while he qualifies."),
  ])

A(92, system="social-sciences", weight=8, topic="sensitivity-specificity", domain="social-sciences", diff=3, subject="biostatistics",
  takeaway="Ages 76 to 85 are a selective colorectal-screening decision. A healthy 78-year-old who has never been screened is not an automatic no.",
  citation=USP_CR,
  scenario="A 78-year-old patient has never been screened, walks a mile daily, and has no life-limiting illness. A classmate refuses any discussion because every patient over 75 is finished with screening.",
  question="How should a never-screened healthy 78-year-old be handled?",
  correct=W("Selectively offer screening. Age over 75 is not an automatic stop in someone this well",
            "The 2021 USPSTF statement says clinicians selectively offer screening from 76 to 85 based on overall health and screening history. Never screened and healthy is a reason the offer can still be reasonable. It is not the automatic repeat booked for a frail patient."),
  wrongs=[
    W("No discussion is allowed after 75", "The selective band runs through 85."),
    W("Annual colonoscopy is mandatory until 85", "Nothing in this age band is mandatory."),
    W("Screening is offered only if he already had a negative colonoscopy", "Lack of any prior screening is a reason the selective offer matters, not a reason it is forbidden."),
    W("Start at 78 only if a first-degree relative had cancer", "He is being considered as an average-risk adult in the selective age band. A relative would be a different pathway."),
  ])

A(93, system="social-sciences", weight=8, topic="sensitivity-specificity", domain="social-sciences", diff=2, subject="biostatistics",
  takeaway="Age 74 is still inside the biennial mammography recommendation. The routine recommendation stops after 74, not at 70.",
  citation=USP_BR,
  scenario="A 74-year-old patient at average risk had a normal mammogram two years ago. A classmate says screening ended at 70, so she should not be offered another one.",
  question="Is age 74 still inside the routine recommendation?",
  correct=W("Yes. Biennial mammography runs through age 74",
            "The 2024 USPSTF recommendation is biennial mammography for women aged 40 to 74. She is at the last included age, and two years have passed since the last study. Stopping at 70 uses the wrong upper bound."),
  wrongs=[
    W("No. Routine screening ends at 70", "The upper age of the routine recommendation is 74, not 70."),
    W("Yes, but the interval becomes every year after 70", "The interval stays every two years through age 74."),
    W("No imaging after any normal mammogram", "A normal study sets the next interval. It does not end the program while she is inside the age range."),
    W("Switch to MRI at 74", "MRI is not the average-risk screening test in this recommendation."),
  ])

A(94, system="respiratory-renal", weight=13, topic="aki-mechanisms", domain="respiratory-renal", diff=3, subject="pharmacology",
  takeaway="Starting an SGLT2 inhibitor does not by itself require more frequent CKD laboratory monitoring.",
  citation=KDIGO,
  scenario="A 66-year-old patient starts an SGLT2 inhibitor for albuminuric CKD. His usual laboratory interval is every four months. A classmate orders weekly chemistry panels for the next six months solely because the drug was started. The first creatinine rose slightly and then stabilized, and he feels well.",
  question="Does the new drug require weekly laboratories?",
  correct=W("No. The early dip does not mean the monitoring schedule has to become weekly",
            "KDIGO 2024 says SGLT2 inhibitor initiation does not necessitate a change in how often CKD is monitored, and the reversible early fall in filtration is not a reason to stop. Weekly panels for six months are not required by the start of the drug."),
  wrongs=[
    W("Yes. Weekly panels are mandatory for six months", "The practice point says the monitoring frequency does not have to change."),
    W("Yes, and any dip means the drug stops", "The early dip is not a stop signal."),
    W("No laboratories are needed for a year after the start", "Usual CKD monitoring continues. The error is making it weekly, not abandoning follow-up."),
    W("Weekly panels are required only if he does not have diabetes", "Diabetes status does not create a weekly schedule."),
  ])

A(95, system="respiratory-renal", weight=13, topic="asthma-copd-pathology", domain="respiratory-renal", diff=3, subject="pharmacology",
  takeaway="A patient who needs step-4 asthma treatment starts at medium-dose ICS-LABA on track 2, not at a high dose, when ICS-formoterol is not being used.",
  citation=GINA,
  scenario="A 39-year-old patient has daily wheeze, night waking twice a week, and an FEV1 that is clearly reduced. ICS-formoterol is not available. He has never used an inhaled corticosteroid. A classmate starts high-dose ICS-LABA as the first controller because the symptoms are daily.",
  question="Which corticosteroid dose matches this first controller?",
  correct=W("Medium-dose ICS-LABA, not a high dose",
            "GINA 2025 changed track 2 step 4 to medium-dose ICS-LABA and says a high dose, if used at all, should be limited to about 3 to 6 months. Daily symptoms do not justify starting at a high dose."),
  wrongs=[
    W("High-dose ICS-LABA as the first inhaler", "The updated step is medium dose."),
    W("Albuterol alone", "Daily symptoms and night waking are not a short-acting-beta-agonist-only pattern."),
    W("Oral prednisone every day for a year", "A year of oral corticosteroid is not the step-4 plan."),
    W("No inhaled corticosteroid until he has been hospitalized", "Hospitalization is not required before controller therapy."),
  ])

A(96, system="reproductive-endocrine", weight=14, topic="preeclampsia-mechanism", domain="reproductive-endocrine", diff=3, subject="pathology",
  takeaway="At or after 37 weeks, gestational hypertension without proteinuria and without a severe feature is still delivered rather than observed until 39 weeks.",
  citation=ACOG,
  scenario="A 34-year-old patient is at 37 weeks and 1 day. Blood pressures 4 hours apart are 148/94 and 146/92 mm Hg. Urine protein is negative. Platelets, creatinine, and liver enzymes are normal. She has no headache and no visual change. A classmate waits until 39 weeks because there is no protein.",
  question="Does the absent protein allow waiting until 39 weeks?",
  correct=W("No. At or after 37 weeks this blood pressure is delivered even without protein",
            "ACOG recommends delivery rather than expectant management at or beyond 37 0/7 weeks for gestational hypertension or the proteinuric picture when severe features are absent. Lack of protein is gestational hypertension, which is included. It is not a reason to wait until 39."),
  wrongs=[
    W("Yes. Protein is required before any 37-week delivery", "The bulletin includes gestational hypertension without protein."),
    W("No, and she needs a cesarean because protein is absent", "The route is not dictated by the absent protein."),
    W("Yes, unless the platelets are below 100,000, which they are not", "A low platelet count would be a severe feature and would change timing earlier. Its absence does not push delivery from 37 to 39 weeks."),
    W("Start magnesium at home until 40 weeks", "She has no severe features, and home magnesium is not the plan."),
  ])

A(97, system="social-sciences", weight=8, topic="sensitivity-specificity", domain="social-sciences", diff=2, subject="biostatistics",
  takeaway="Pregnant patients are screened for asymptomatic bacteriuria with a urine culture. Symptoms are not required.",
  citation=USP_ASB,
  scenario="A 26-year-old patient is at 12 weeks and feels well. She has no burning, no frequency, and no fever. A classmate says a urine culture is useful only if those symptoms appear.",
  question="What urine test is recommended now?",
  correct=W("A urine culture, even though she has no urinary symptoms",
            "The 2019 USPSTF recommendation is to screen pregnant persons for asymptomatic bacteriuria with a urine culture. Waiting for dysuria misses the group the recommendation is about."),
  wrongs=[
    W("No culture unless she has dysuria", "Symptoms would make it a diagnostic test, not the screening recommendation."),
    W("A urine dipstick only, because culture is not required", "The recommendation specifies a urine culture."),
    W("A culture only after 36 weeks", "Screening is not delayed until the last month. She is already at 12 weeks."),
    W("Treat with antibiotics without a culture", "The screening test is the culture. Empiric treatment without it is not the recommendation."),
  ])

A(98, system="cardiovascular", weight=9, topic="heart-failure-pathophysiology", domain="cardiovascular", diff=2, subject="physiology",
  takeaway="The name for an ejection fraction that rose from 40 percent or lower to above 40 percent is improved, and the old study is part of the definition.",
  citation=HF,
  scenario="A 47-year-old patient had an ejection fraction of 30 percent and now has an ejection fraction of 48 percent. A classmate codes it as mildly reduced and discards the old study because only the current number is allowed in the name.",
  question="Which name uses both numbers?",
  correct=W("Improved ejection fraction, because the old value was 40 percent or lower and the new value is above 40",
            "The 2022 definition requires both measurements. A current value of 48 percent would be mildly reduced only if there had never been a lower value. The prior 30 percent is why the improved label is the one that fits."),
  wrongs=[
    W("Mildly reduced, and the old study is discarded", "Discarding the old study is how the improved category is missed."),
    W("Preserved, because 48 is close to 50", "Forty-eight is not 50 or higher, and the history still matters."),
    W("Recovered, because the number rose", "The guideline avoided the word recovered."),
    W("Reduced, because the first number permanently fixes the category", "The current number is above 40, so he is not in the current reduced category. The history creates the improved label."),
  ])

A(99, system="respiratory-renal", weight=13, topic="aki-mechanisms", domain="respiratory-renal", diff=3, subject="pharmacology",
  takeaway="After an ACE inhibitor dose is increased, potassium and creatinine are rechecked. They are not left until the next annual panel.",
  citation=KDIGO,
  scenario="A 63-year-old patient with diabetes and an albumin-to-creatinine ratio of 160 mg/g just had lisinopril increased. Potassium was 4.5 mEq/L and creatinine was 1.1 mg/dL that morning. A classmate says the next laboratory panel can wait until the annual visit in 11 months.",
  question="When are potassium and creatinine checked again?",
  correct=W("Soon after the increase, not at the annual visit",
            "KDIGO 2024 expects potassium and creatinine to be followed when the ACE inhibitor dose changes, and the drug is reduced or stopped only if mitigation fails. An 11-month gap does not catch a rise in potassium or creatinine from this increase."),
  wrongs=[
    W("At the annual visit, because dose changes do not affect potassium", "Dose changes are a reason potassium and creatinine move."),
    W("Only if he develops muscle pain", "Muscle pain is not the monitoring signal for this drug."),
    W("Never, if the morning potassium was under 5", "A normal morning value does not cancel follow-up after the increase."),
    W("Add an ARB now and check laboratories in a year", "Adding an ARB is not the monitoring plan, and the combination is not recommended."),
  ])

A(100, system="gastrointestinal", weight=8, topic="gi-bleeding-sources", domain="gastrointestinal", diff=3, subject="physiology",
  takeaway="A very-low Glasgow-Blatchford score is what allows discharge. A single coffee-ground streak does not, if the urea, pulse, or hemoglobin pushes the score up.",
  citation=ACG,
  scenario="A 50-year-old patient had a small coffee-ground streak. Blood urea nitrogen is 34 mg/dL, hemoglobin is 11.2 g/dL, and the pulse is 102/min. Systolic pressure is 118 mm Hg. He has no syncope and no liver disease. A classmate discharges him because the streak was small and the pressure is normal.",
  question="Why is discharge not supported?",
  correct=W("The urea, hemoglobin, and pulse move this out of the very-low-risk score even though the streak was small",
            "ACG 2021 suggests discharge for a Glasgow-Blatchford score of 0 or 1. A urea of 34, a hemoglobin of 11.2, and a pulse of 102 are not that score. A normal systolic pressure does not zero the other points."),
  wrongs=[
    W("Discharge is correct whenever the streak is small and the pressure is normal", "Pressure is only one input. The other three already add risk."),
    W("Every coffee-ground streak requires intensive care", "The score, not the streak alone, sets the level of care. This score needs admission, not an automatic intensive-care label."),
    W("Transfuse to a hemoglobin of 13 before any decision", "11.2 is above the restrictive transfusion threshold in a stable patient without heart disease. Transfusion is not the missing step."),
    W("A normal pressure proves the urea is a laboratory error", "The urea is a standard part of the score and is not dismissed because the pressure is 118."),
  ])
