"""Step 1 items 1-25. Different decisions from the Step 2 set."""

from lib import s1

ACS = "2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes."
HF = "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure, which remains the current United States heart-failure guideline."
HTN = "2025 AHA/ACC/Multispecialty Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults."
KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."
ADA = "American Diabetes Association, Standards of Care in Diabetes, 2026, sections 9 and 11."

def W(a, b):
    return (a, b)

ITEMS = []

def A(n, **k):
    ITEMS.append(s1(n, **k))

A(1, system="cardiovascular", weight=9, topic="heart-failure-pathophysiology", domain="cardiovascular", diff=2, subject="physiology",
  takeaway="An ejection fraction of 41 to 49 percent is mildly reduced, not reduced and not preserved.",
  citation=HF,
  scenario="A 61-year-old patient is short of breath walking uphill. The ejection fraction is 45 percent, the natriuretic peptide is elevated, and the lungs have a few crackles at the bases. A classmate calls 45 percent reduced because it is under 50, and another calls it preserved because it is above 40.",
  question="Which category matches an ejection fraction of 45 percent?",
  correct=W("Mildly reduced, because the band is 41 to 49 percent",
            "The 2022 heart-failure guideline sets reduced at 40 percent or lower, mildly reduced at 41 to 49, and preserved at 50 or higher. Forty-five is the middle band."),
  wrongs=[
    W("Reduced, because every value under 50 percent is reduced", "Reduced ejection fraction stops at 40 percent."),
    W("Preserved, because every value above 40 percent is preserved", "Preserved ejection fraction starts at 50 percent."),
    W("Improved, because 45 is higher than a typical failing heart", "Improved requires a prior value of 40 percent or lower and a later value above 40. No prior study is described."),
    W("Normal, because symptoms do not count once the number exceeds 40", "The peptide and the crackles are supporting findings. They do not move 45 percent into the preserved band."),
  ])

A(2, system="cardiovascular", weight=9, topic="heart-failure-pathophysiology", domain="cardiovascular", diff=3, subject="physiology",
  takeaway="When the ejection fraction is above 40 percent, dyspnea alone does not establish heart failure. Raised filling pressure has to be shown.",
  citation=HF,
  scenario="A 70-year-old patient reports dyspnea climbing one flight. The ejection fraction is 62 percent. The natriuretic peptide is normal, diastolic-function measures are normal, and there is no edema. A classmate diagnoses heart failure because the ejection fraction is not low and the patient is breathless.",
  question="What is missing before that diagnosis is made?",
  correct=W("Evidence of raised filling pressure, which this normal peptide and normal diastolic measures do not provide",
            "The 2022 guideline says that when the ejection fraction is above 40 percent, heart failure requires supporting evidence of increased filling pressure. Dyspnea alone is not that evidence."),
  wrongs=[
    W("Nothing. Breathlessness with any ejection fraction is heart failure", "Symptoms are nonspecific. The guideline requires a filling-pressure correlate when the ejection fraction is preserved."),
    W("An ejection fraction below 20 percent, because higher values cannot be heart failure", "Preserved-ejection-fraction heart failure exists. It still needs objective filling-pressure evidence."),
    W("A low serum sodium, which is required before any heart-failure label", "Sodium is not the required supporting finding. Filling pressure is."),
    W("A fever, because breathless patients with a normal peptide have infection", "Infection is not established, and it is not the missing criterion the guideline names."),
  ])

A(3, system="cardiovascular", weight=9, topic="acs-pathophysiology", domain="cardiovascular", diff=3, subject="pharmacology",
  takeaway="Ischemic stroke within 3 months is an absolute contraindication to fibrinolysis, separate from a remote brain bleed.",
  citation=ACS,
  scenario="A 71-year-old patient has had chest pain for 50 minutes. Blood pressure is 146/84 mm Hg. The electrocardiogram shows 2 mm of ST-segment elevation in V2 through V4. The nearest catheterization laboratory is 3 hours away. Two months ago he had an ischemic stroke with an arm weakness that mostly recovered. He has never had a brain hemorrhage. A classmate prepares a fibrinolytic because the old event was ischemic rather than hemorrhagic.",
  question="Why does the stroke two months ago block the fibrinolytic?",
  correct=W("Ischemic stroke within 3 months is an absolute contraindication, so he is transferred for PCI instead",
            "The 2025 ACS guideline lists ischemic stroke within 3 months with prior intracranial hemorrhage as an absolute contraindication. Two months is inside that window. The long transfer would otherwise have favored a fibrinolytic."),
  wrongs=[
    W("Only a hemorrhagic stroke counts, so an ischemic stroke two months ago is irrelevant", "The guideline names ischemic stroke within 3 months separately."),
    W("The stroke is too recent only if it was within 7 days", "The absolute window given is 3 months, not 7 days."),
    W("Give a half-dose fibrinolytic because the weakness mostly recovered", "Recovery does not create a half-dose exception."),
    W("Observe locally, because both fibrinolysis and transfer are forbidden", "Transfer for PCI remains appropriate when a fibrinolytic cannot be used."),
  ])

A(4, system="cardiovascular", weight=9, topic="acs-pathophysiology", domain="cardiovascular", diff=4, subject="pathology",
  takeaway="Suspected aortic dissection is an absolute contraindication to fibrinolysis even when the electrocardiogram shows ST elevation.",
  citation=ACS,
  scenario="A 58-year-old patient has sudden chest pain tearing through to the back. Blood pressure is 168/90 mm Hg in the right arm and 112/70 mm Hg in the left. The electrocardiogram shows 1 mm of ST-segment elevation in II, III, and aVF. He has no prior stroke. The catheterization laboratory is 3 hours away. A classmate gives a fibrinolytic because of the ST elevation and the delay.",
  question="Why is the fibrinolytic the wrong drug?",
  correct=W("The unequal arm pressures and back pain mean dissection is suspected, which absolutely contraindicates fibrinolysis",
            "The 2025 guideline lists suspected aortic dissection as an absolute contraindication. ST elevation and a long transfer do not override it. He needs imaging and pressure control, not a lytic."),
  wrongs=[
    W("ST elevation plus a 3-hour delay is enough to give the fibrinolytic", "Those facts would matter only after dissection has been excluded."),
    W("Unequal arm pressures are a reason to double the fibrinolytic dose", "The pressure difference is a reason to withhold the drug, not to increase it."),
    W("Back pain without a fever is musculoskeletal and can be ignored", "Sudden tearing pain to the back with unequal pressures is not ignored."),
    W("A fibrinolytic is safe because he has never had a stroke", "Absence of stroke removes one contraindication. It does not remove suspected dissection."),
  ])

A(5, system="cardiovascular", weight=9, topic="acs-pathophysiology", domain="cardiovascular", diff=3, subject="pharmacology",
  takeaway="With fibrinolysis, a patient 75 or older receives clopidogrel 75 mg daily without a loading dose.",
  citation=ACS,
  scenario="An 80-year-old patient has had chest pain for 90 minutes. The electrocardiogram shows ST-segment elevation in V2 through V5. Device activation would take about 3 hours. There is no stroke history and no active bleeding. Blood pressure is 138/76 mm Hg. A fibrin-specific fibrinolytic is being given. A classmate orders clopidogrel 300 mg now, then 75 mg daily, using the schedule for younger adults.",
  question="Which clopidogrel schedule matches age 80?",
  correct=W("75 mg daily, without a 300 mg load",
            "The 2025 guideline describes a 300 mg load only under age 75. At 75 and older, clopidogrel starts at 75 mg daily with no load, given together with the fibrinolytic."),
  wrongs=[
    W("A 300 mg load, because every fibrinolytic patient gets the younger-adult schedule", "The load is specifically not used at age 75 or older."),
    W("Prasugrel 60 mg, because age over 75 prefers the more potent drug", "Prasugrel is not the drug paired with fibrinolysis, and older age is a reason for caution with prasugrel, not a reason to choose it."),
    W("No P2Y12 inhibitor at age 80", "Clopidogrel is still given. The change is the missing load, not omission of the drug."),
    W("A 600 mg load, because older patients clear the drug faster", "The direction is a smaller start, not a larger load."),
  ])

A(6, system="cardiovascular", weight=9, topic="acs-pathophysiology", domain="cardiovascular", diff=3, subject="pharmacology",
  takeaway="Persistent pain and persistent ST elevation about 90 minutes after a fibrinolytic mean failed reperfusion and immediate rescue angiography.",
  citation=ACS,
  scenario="A 57-year-old patient received a fibrin-specific fibrinolytic 90 minutes ago for ST-segment elevation in V2 through V4. The pain is unchanged. The ST segments are still elevated 3 mm. Blood pressure is 110/70 mm Hg. A classmate schedules angiography for the next morning because a fibrinolytic needs 24 hours to declare success or failure.",
  question="What does pain plus persistent ST elevation at 90 minutes mean?",
  correct=W("Failed reperfusion, so arrange immediate angiography for rescue PCI",
            "The 2025 guideline says suspected failed reperfusion, including persistent pain and persistent ST elevation, is treated with immediate angiography and rescue PCI, not a next-morning study."),
  wrongs=[
    W("Expected timing. Judge the fibrinolytic only at 24 hours", "Ninety minutes of unchanged pain and ST elevation is already suspected failure."),
    W("Give a second full dose of the fibrinolytic", "A second lytic dose is not the rescue strategy. Angiography is."),
    W("Stop all antiplatelet drugs and observe", "Stopping antiplatelet therapy does not treat a closed artery."),
    W("The tracing has resolved if the pain is the only remaining complaint", "The pain has not resolved, and the ST segments are still elevated."),
  ])

A(7, system="cardiovascular", weight=9, topic="acs-pathophysiology", domain="cardiovascular", diff=3, subject="pharmacology",
  takeaway="After an apparently successful fibrinolytic, angiography is still performed within 2 to 24 hours, not deferred for several days.",
  citation=ACS,
  scenario="A 63-year-old patient received a fibrinolytic 3 hours ago. The chest pain has resolved and the ST-segment elevation has fallen from 3 mm to under 1 mm. Blood pressure is 124/74 mm Hg. He is at a hospital that can transfer him. A classmate plans elective angiography in 5 days because the artery has declared itself open.",
  question="When is angiography done after this apparent success?",
  correct=W("Within 2 to 24 hours, even though the pain and the ST segments improved",
            "The 2025 guideline recommends early angiography at 2 to 24 hours after fibrinolysis when the intent is PCI, including when reperfusion appears to have succeeded. Five days is outside that window."),
  wrongs=[
    W("In 5 days, because symptom relief means no angiography is urgent", "Apparent success changes rescue timing to the early window. It does not cancel angiography."),
    W("Only if the pain returns", "Return of pain would suggest failed reperfusion and immediate angiography. Success still gets the 2- to 24-hour study."),
    W("Never, because a fibrinolytic replaces the need to image the artery", "Fibrinolysis is followed by transfer and early angiography."),
    W("Immediately, with a second fibrinolytic on the way", "Immediate angiography is for suspected failure. A second fibrinolytic is not added because the first one appears to have worked."),
  ])

A(8, system="cardiovascular", weight=9, topic="hypertension-mechanisms", domain="cardiovascular", diff=2, subject="physiology",
  takeaway="Blood pressure of 120 to 129 mm Hg systolic with diastolic pressure under 80 mm Hg is elevated, not stage 1 hypertension.",
  citation=HTN,
  scenario="A 47-year-old patient has an average blood pressure of 124/76 mm Hg on three visits. He has no diabetes, no kidney disease, and no cardiovascular disease. A classmate labels this stage 1 hypertension because the systolic value is above 120 and starts a discussion of medication thresholds.",
  question="Which category is 124/76 mm Hg?",
  correct=W("Elevated blood pressure, not stage 1 hypertension",
            "The 2025 guideline defines elevated pressure as systolic 120 to 129 and diastolic under 80. Stage 1 begins at 130 systolic or 80 diastolic. Medication thresholds for stage 1 do not apply yet."),
  wrongs=[
    W("Stage 1 hypertension, because any systolic value above 120 is stage 1", "Stage 1 starts at 130, not 120."),
    W("Stage 2 hypertension, because 124 is closer to 140 than to 120", "Stage 2 starts at 140 systolic or 90 diastolic."),
    W("Normal blood pressure, because only values under 100 are abnormal", "Normal is under 120 and under 80. 124/76 is elevated, not normal."),
    W("Isolated diastolic hypertension, because 76 is the number that matters", "A diastolic value of 76 is under 80. The systolic value is the one in the elevated range."),
  ])

A(9, system="cardiovascular", weight=9, topic="hypertension-mechanisms", domain="cardiovascular", diff=3, subject="physiology",
  takeaway="Stage 1 hypertension is present when systolic pressure is 130 to 139 even if diastolic pressure is under 80.",
  citation=HTN,
  scenario="A 50-year-old patient has an average blood pressure of 136/74 mm Hg. A classmate calls it normal because the diastolic value is under 80, and ignores the systolic value.",
  question="Which category fits 136/74 mm Hg?",
  correct=W("Stage 1 hypertension, because the systolic value is 130 to 139",
            "Either number can place the reading. Systolic 130 to 139 is stage 1 even when diastolic pressure is under 80. The 2025 definitions do not require both numbers to be high."),
  wrongs=[
    W("Normal, because the diastolic value is under 80", "A normal diastolic value does not cancel a systolic value of 136."),
    W("Elevated only, because stage 1 requires a diastolic value of at least 80", "Elevated pressure stops at systolic 129. Stage 1 includes systolic 130 to 139."),
    W("Stage 2, because 136 is above 130", "Stage 2 starts at systolic 140 or diastolic 90."),
    W("Measurement error, because the two numbers must rise together", "Isolated systolic elevation is a real category, not an error."),
  ])

A(10, system="cardiovascular", weight=9, topic="hypertension-mechanisms", domain="cardiovascular", diff=3, subject="pharmacology",
  takeaway="A mineralocorticoid-receptor antagonist is stopped before the first aldosterone-renin ratio. Most other blood-pressure drugs can stay.",
  citation=HTN,
  scenario="A 62-year-old patient has resistant hypertension, with a pressure of 158/96 mm Hg on amlodipine, chlorthalidone, losartan, and spironolactone. Potassium is 4.0 mEq/L. A classmate orders an aldosterone-renin ratio for the next morning and tells him to take all four drugs, including spironolactone, that night.",
  question="Which drug has to be stopped before that ratio?",
  correct=W("Spironolactone. The other three can generally be continued",
            "The 2025 guideline says most antihypertensives are continued for the initial screen so the test is not delayed, but a mineralocorticoid-receptor antagonist is the exception that should not be ongoing."),
  wrongs=[
    W("All four drugs for a month, because any pill invalidates the ratio", "Stopping everything is the delay the guideline is trying to avoid."),
    W("Losartan only. Spironolactone does not affect the ratio", "The antagonist is the drug class called out as the problem, not the angiotensin-receptor blocker."),
    W("None. A normal potassium means the ratio can be drawn on the full regimen", "A normal potassium does not make spironolactone acceptable on the morning of the test."),
    W("Amlodipine only, because calcium-channel blockers raise renin the most", "The guideline's exception for the initial screen is the mineralocorticoid antagonist."),
  ])
