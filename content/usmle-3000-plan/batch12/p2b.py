"""Step 2 items 11-30."""

from lib import s2

ACS = "2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes."
HTN = "2025 AHA/ACC/Multispecialty Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults."
HF = "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure, which remains the current United States heart-failure guideline."
GOLD = "Global Initiative for Chronic Obstructive Lung Disease, GOLD 2026 report."
GINA = "Global Initiative for Asthma, GINA Strategy Report 2025."
ADA = "American Diabetes Association, Standards of Care in Diabetes, 2026, sections 9 and 11."

ITEMS = []

ITEMS.append(s2(
    11, system="cardiovascular", weight=9, topic="acs-management", domain="cardiovascular", diff=4, subject="cardiology",
    takeaway="Do not open a totally occluded infarct artery in a stable patient more than 24 hours after onset when there is no ongoing ischemia, severe heart failure, or life-threatening arrhythmia.",
    citation=ACS,
    scenario="A 72-year-old patient is comfortable on the third hospital day. Chest pain lasted six hours on the day of admission and has not returned. Blood pressure is 126/74 mm Hg, the lungs are clear, and there have been no ventricular arrhythmias. Admission tracing showed inferior ST-segment elevation. Today's tracing shows Q waves and no ST elevation. Angiography finds a totally occluded right coronary artery and no other severe narrowings. A colleague wants that artery opened because it was the infarct vessel.",
    question="Which decision fits a stable patient this long after the pain stopped?",
    correct=("Leave the totally occluded infarct artery alone",
             "He is stable, pain-free, more than 24 hours from onset, and has no heart failure or life-threatening arrhythmia. The 2025 guideline says not to open that artery in this situation."),
    wrongs=[
        ("Open the occluded artery now because every infarct vessel should be stented once it is seen",
         "Seeing the vessel does not create an indication the guideline removed for a stable, completed infarct."),
        ("Open the artery only if the troponin is still rising, regardless of symptoms",
         "A late troponin value does not replace the criteria of stability, time, and the absence of ischemia, failure, or arrhythmia."),
        ("Start a fibrinolytic now that the artery is known to be closed",
         "Fibrinolysis is for early ST-elevation infarction when timely PCI is unavailable, not for a stable completed infarct on day three."),
        ("Schedule bypass surgery because a single occluded infarct artery requires surgical revascularization",
         "A single completed infarct artery, with no other severe disease and a stable patient, is not an indication for bypass."),
    ],
))

ITEMS.append(s2(
    12, system="cardiovascular", weight=9, topic="acs-management", domain="cardiovascular", diff=3, subject="cardiology",
    takeaway="In an acute coronary syndrome with anemia and no active bleeding, red-cell transfusion to keep hemoglobin near 10 g/dL may be reasonable. That is not the 7 g/dL threshold used for a gastrointestinal bleed.",
    citation=ACS,
    scenario="A 74-year-old patient was stented yesterday for chest pain with anterior ST-segment elevation. He is pain-free, blood pressure is 118/70 mm Hg, and the heart rate is 76/min. Stools are brown. Hemoglobin has been stable at 8.2 g/dL, and there is no bleeding. A colleague withholds transfusion because 8.2 g/dL is above the 7 g/dL threshold used for gastrointestinal bleeding.",
    question="Which transfusion threshold applies to this anemia?",
    correct=("Transfuse to keep hemoglobin near 10 g/dL, which may be reasonable when an acute coronary syndrome is not actively bleeding",
             "The 2025 ACS guideline gives a class 2b recommendation to transfuse toward a hemoglobin of 10 g/dL in ACS with anemia and no active bleeding. The 7 g/dL rule belongs to a different syndrome."),
    wrongs=[
        ("Withhold red cells until hemoglobin falls below 7 g/dL, using the gastrointestinal-bleeding threshold",
         "That 7 g/dL threshold is the 2021 ACG suggestion for upper gastrointestinal bleeding, not for an acute coronary syndrome."),
        ("Transfuse only if hemoglobin falls below 5 g/dL, because a recent stent prohibits red cells",
         "A recent stent is not a reason to withhold red cells down to 5 g/dL. The ACS document moves the threshold up, not down."),
        ("Transfuse platelets instead of red cells, because the hemoglobin number is a platelet problem",
         "The abnormality is the hemoglobin. Platelets do not treat anemia."),
        ("Exchange transfusion, because a hemoglobin of 8.2 g/dL after stenting is a hemolytic emergency",
         "There is no evidence of hemolysis. The question is an ordinary red-cell threshold."),
    ],
))

ITEMS.append(s2(
    13, system="cardiovascular", weight=9, topic="hypertension-mechanisms", domain="cardiovascular", diff=3, subject="cardiology",
    takeaway="Adults with clinical cardiovascular disease start blood-pressure medication when the average is at least 130/80 mm Hg, and the goal is below 130/80 mm Hg.",
    citation=HTN,
    scenario="A 66-year-old patient had a myocardial infarction two years ago and takes aspirin and a statin, but no blood-pressure drug. The average of three office readings is 136/84 mm Hg, and home readings match. He feels well. A colleague calls this stage 1 pressure and recommends six months of diet alone because the systolic value is under 140 mm Hg.",
    question="Which blood-pressure plan matches prior myocardial infarction and this average?",
    correct=("Start medication now, with a goal below 130/80 mm Hg",
             "The 2025 guideline recommends medication at or above 130/80 mm Hg when clinical cardiovascular disease is present. The goal for adults is below 130/80 mm Hg. A systolic value under 140 does not create a lifestyle-only delay in this patient."),
    wrongs=[
        ("Diet alone for six months, because medication begins only at a systolic pressure of 140 mm Hg",
         "The 140 mm Hg immediate-treatment line is for adults without a higher-risk condition. Prior infarction moves the threshold to 130/80."),
        ("Start medication only if a later reading reaches 160/100 mm Hg",
         "He already meets the secondary-prevention threshold. Waiting for 160/100 withholds indicated treatment."),
        ("Treat only the diastolic value, because 84 mm Hg matters and 136 mm Hg does not",
         "Either number crossing its threshold is enough. Both 136 and 84 are already over 130 and 80."),
        ("Add a second antiplatelet drug instead of a blood-pressure drug",
         "A remote infarction already on aspirin is not an indication to add a second antiplatelet drug in place of treating pressure."),
    ],
))

ITEMS.append(s2(
    14, system="cardiovascular", weight=9, topic="hypertension-mechanisms", domain="cardiovascular", diff=3, subject="cardiology",
    takeaway="When 10-year risk is under 7.5 percent and there is no cardiovascular disease, diabetes, or chronic kidney disease, a pressure in the 130s gets 3 to 6 months of lifestyle treatment before medication.",
    citation=HTN,
    scenario="A 44-year-old patient has no known cardiovascular disease, no diabetes, and a normal creatinine with an albumin-to-creatinine ratio under 30 mg/g. The PREVENT 10-year risk is 4 percent. The average blood pressure is 134/82 mm Hg. He asks whether a pill should start today. A colleague cites an older rule that every reading in this range starts medication immediately.",
    question="Which plan matches a 4 percent risk and a pressure of 134/82 mm Hg?",
    correct=("Use lifestyle treatment for 3 to 6 months, and add medication if the average is still at least 130/80 mm Hg",
             "The 2025 guideline reserves immediate medication at 130 to 139 mm Hg for clinical disease, diabetes, chronic kidney disease, or a PREVENT risk of at least 7.5 percent. His risk is 4 percent, so the lifestyle trial comes first."),
    wrongs=[
        ("Start medication today because every stage 1 reading is treated immediately, whatever the risk",
         "That was closer to an older habit. The 2025 risk cutoff for immediate treatment at this pressure is 7.5 percent, and he is under it."),
        ("Reassure him that 134/82 mm Hg is normal and needs no follow-up",
         "This is stage 1 hypertension, not a normal pressure. It needs a lifestyle trial and a planned recheck."),
        ("Start medication today because a diastolic pressure of 82 mm Hg cancels the lifestyle trial",
         "Both the systolic and diastolic recommendations use the same 3- to 6-month trial when risk is under 7.5 percent."),
        ("Start two drugs today because a reading in the 130s is stage 2 hypertension",
         "Stage 2 is a systolic pressure of at least 140 or a diastolic pressure of at least 90. His average is below both lines."),
    ],
))

ITEMS.append(s2(
    15, system="cardiovascular", weight=9, topic="hypertension-mechanisms", domain="cardiovascular", diff=3, subject="cardiology",
    takeaway="Medication is recommended for every adult with hypertension when the average systolic pressure is at least 140 mm Hg, including adults whose 10-year risk is under 7.5 percent.",
    citation=HTN,
    scenario="A 39-year-old patient has no cardiovascular disease, no diabetes, and no kidney disease. The PREVENT 10-year risk is 3 percent. Repeated averages are 154/92 mm Hg. He has already cut salt for one week. A colleague says the low risk means a full 3- to 6-month lifestyle trial before any pill, using the rule written for pressures in the 130s.",
    question="Why does a systolic pressure of 154 mm Hg not wait out that trial?",
    correct=("A systolic pressure of at least 140 mm Hg is treated with medication in all adults with hypertension, including those at low predicted risk",
             "The 2025 guideline recommends starting medication when average systolic pressure is at least 140 mm Hg in all adults with hypertension. The 3- to 6-month trial is for lower-range pressures when risk is under 7.5 percent."),
    wrongs=[
        ("Low 10-year risk postpones medication until the systolic pressure reaches 180 mm Hg",
         "The lifestyle trial is not a license to wait until 180 mm Hg. A systolic pressure of 154 already qualifies for medication."),
        ("One week of salt restriction already counts as the entire 3- to 6-month trial",
         "A week is not a 3- to 6-month trial, and a systolic pressure of 154 does not enter that trial in the first place."),
        ("Diastolic pressure must exceed 100 mm Hg before any adult is treated",
         "Treatment is recommended at a systolic pressure of at least 140 even when the diastolic value is the only other number. His diastolic pressure is already 92."),
        ("Predicted risk under 7.5 percent reclassifies 154/92 mm Hg as elevated blood pressure rather than hypertension",
         "Elevated blood pressure is 120 to 129 mm Hg systolic and under 80 diastolic. A pressure of 154/92 is stage 2."),
    ],
))

ITEMS.append(s2(
    16, system="cardiovascular", weight=9, topic="hypertension-mechanisms", domain="cardiovascular", diff=3, subject="cardiology",
    takeaway="Resistant hypertension is screened for primary aldosteronism whether or not the potassium is low.",
    citation=HTN,
    scenario="A 58-year-old patient takes amlodipine, chlorthalidone, and losartan. The average blood pressure remains 156/94 mm Hg. Serum potassium is 4.1 mEq/L and creatinine is 0.9 mg/dL. He does not eat licorice, and a pill count supports adherence. A colleague says an aldosterone work-up is useless because the potassium is normal.",
    question="Which screening decision matches resistant hypertension with a normal potassium?",
    correct=("Screen for primary aldosteronism despite the normal potassium",
             "The 2025 guideline makes screening resistant hypertension a class 1 recommendation and says the screen does not depend on hypokalemia. He is not taking a mineralocorticoid antagonist, so that drug does not have to be stopped first."),
    wrongs=[
        ("Do not screen, because primary aldosteronism occurs only when potassium is below 3.5 mEq/L",
         "Hypokalemia raises suspicion, but the guideline explicitly says it is not required."),
        ("Stop all three drugs for a month before any hormone test can be ordered",
         "Most blood-pressure drugs are continued for the initial screen. A mineralocorticoid antagonist is the class that should not be ongoing, and he is not taking one."),
        ("Add a fourth drug and never screen, because a normal potassium proves essential hypertension",
         "A fourth drug may be needed, but it does not replace the screen. A normal potassium does not prove the mechanism."),
        ("Order renal-artery stenting before any hormone test",
         "Renovascular stenting is not the first test the guideline names for resistant hypertension with a normal creatinine."),
    ],
))

ITEMS.append(s2(
    17, system="cardiovascular", weight=9, topic="chf-management", domain="cardiovascular", diff=3, subject="cardiology",
    takeaway="In symptomatic HFrEF, an angiotensin receptor-neprilysin inhibitor is the preferred first renin-angiotensin drug when it can be used.",
    citation=HF,
    scenario="A 60-year-old patient has had progressive dyspnea for a month. The ejection fraction is 30 percent. Blood pressure is 118/72 mm Hg, potassium is 4.2 mEq/L, and creatinine is 1.0 mg/dL. He has never taken an ACE inhibitor or an angiotensin-receptor blocker, and he has never had angioedema. He is not pregnant. A colleague writes for lisinopril as the first drug in that family because the sequence is familiar.",
    question="Which renin-angiotensin drug should be the first one?",
    correct=("An angiotensin receptor-neprilysin inhibitor",
             "The 2022 guideline recommends an ARNI as first-line renin-angiotensin therapy in HFrEF when it is feasible. Nothing here makes it unfeasible, so an ACE inhibitor is not a required first failure."),
    wrongs=[
        ("Lisinopril, because an ACE inhibitor must fail before any other drug in the class is allowed",
         "An ACE inhibitor is recommended when an ARNI is not feasible. It is not a required first failure."),
        ("Losartan plus lisinopril together",
         "Combining an ACE inhibitor with an angiotensin-receptor blocker is not the recommended regimen."),
        ("No renin-angiotensin drug until the ejection fraction falls below 20 percent",
         "An ejection fraction of 30 percent is already symptomatic HFrEF with a class 1 indication."),
        ("A direct renin inhibitor as the preferred substitute",
         "A direct renin inhibitor is not the preferred therapy. The preferred agent is an ARNI."),
    ],
))

ITEMS.append(s2(
    18, system="cardiovascular", weight=9, topic="chf-management", domain="cardiovascular", diff=3, subject="cardiology",
    takeaway="Patients with symptomatic HFrEF who already tolerate an ACE inhibitor should be switched to an angiotensin receptor-neprilysin inhibitor, with a gap so the two drugs do not overlap.",
    citation=HF,
    scenario="A 55-year-old patient has an ejection fraction of 35 percent and breathlessness on an ordinary walk. He takes lisinopril 10 mg daily, which he tolerates, plus a diuretic. Blood pressure is 112/70 mm Hg, potassium is 4.4 mEq/L, and creatinine is 1.1 mg/dL. There is no angioedema. A colleague refills the lisinopril and says a switch is useful only after a hospitalization.",
    question="What should replace the ACE inhibitor he already tolerates?",
    correct=("Switch from lisinopril to an angiotensin receptor-neprilysin inhibitor after a washout",
             "Tolerance of an ACE inhibitor is the reason to switch, not the reason to stay. The 2022 guideline recommends replacement with an ARNI. The ACE inhibitor is stopped first so the drugs do not overlap."),
    wrongs=[
        ("Continue lisinopril indefinitely, because a tolerated ACE inhibitor should never be changed",
         "The guideline recommends replacement for a further reduction in morbidity and mortality. Hospitalization is not the trigger."),
        ("Add losartan on top of lisinopril",
         "Dual blockade adds harm and is not the recommended switch."),
        ("Stop lisinopril and leave him on a diuretic alone",
         "Stopping the only renin-angiotensin drug removes disease-modifying therapy. The correct move is a switch."),
        ("Replace lisinopril with hydralazine alone",
         "Hydralazine plus nitrate is for selected patients who cannot take first-line therapy. He can take an ARNI."),
    ],
))

ITEMS.append(s2(
    19, system="cardiovascular", weight=9, topic="chf-management", domain="cardiovascular", diff=2, subject="cardiology",
    takeaway="Only bisoprolol, carvedilol, and metoprolol succinate reduced mortality in HFrEF. The benefit is not a beta-blocker class effect.",
    citation=HF,
    scenario="A 63-year-old patient has an ejection fraction of 25 percent and mild ongoing dyspnea. He takes atenolol, started years ago for palpitations. Blood pressure is 124/78 mm Hg and the heart rate is 78/min. He is not volume overloaded today. A colleague says any beta blocker is interchangeable, so the atenolol should simply be continued.",
    question="Which beta-blocker correction matches the heart-failure evidence?",
    correct=("Change atenolol to bisoprolol, carvedilol, or sustained-release metoprolol succinate",
             "The 2022 guideline names those three drugs and says the mortality findings should not be treated as a class effect. Atenolol is not one of them."),
    wrongs=[
        ("Continue atenolol, because mortality reduction is a class effect of every beta blocker",
         "The guideline explicitly says other beta blockers are not included in the recommendation."),
        ("Stop every beta blocker, because an ejection fraction of 25 percent makes the class harmful",
         "An evidence-based beta blocker is recommended. The error is the molecule, not the decision to block beta receptors."),
        ("Replace atenolol with short-acting metoprolol tartrate at the same total daily dose",
         "Metoprolol tartrate is not the formulation with the mortality evidence. The recommended metoprolol product is sustained-release succinate."),
        ("Add atenolol to carvedilol so both heart rate and mortality are covered",
         "Two beta blockers together are not recommended. One evidence-based agent replaces atenolol."),
    ],
))

ITEMS.append(s2(
    20, system="cardiovascular", weight=9, topic="chf-management", domain="cardiovascular", diff=3, subject="cardiology",
    takeaway="An SGLT2 inhibitor is recommended for symptomatic chronic HFrEF whether or not the patient has diabetes.",
    citation=HF,
    scenario="A 59-year-old patient has dyspnea climbing one flight of stairs. The ejection fraction is 32 percent. He takes an angiotensin receptor-neprilysin inhibitor, carvedilol, and spironolactone. The hemoglobin A1c is 5.4 percent, potassium is 4.3 mEq/L, and the estimated filtration rate is 62 mL/min/1.73 m2. A colleague says an SGLT2 inhibitor would be appropriate only if he had diabetes.",
    question="Does the absence of diabetes remove the SGLT2 inhibitor?",
    correct=("No. Symptomatic HFrEF is an indication for an SGLT2 inhibitor even when the A1c is normal",
             "The 2022 guideline recommends an SGLT2 inhibitor in symptomatic chronic HFrEF to reduce hospitalization and cardiovascular mortality regardless of type 2 diabetes. A normal A1c is not a contraindication."),
    wrongs=[
        ("Yes. The heart-failure trials apply only when the A1c is above 6.5 percent",
         "The recommendation does not require diabetes. Waiting for an abnormal A1c withholds an indicated drug."),
        ("No, but only after the A1c rises on a repeat test next year",
         "The indication is the heart failure itself, not a future diabetes diagnosis."),
        ("Yes, unless the filtration rate is below 20, which is the only non-diabetes entry criterion",
         "A low filtration rate is a limitation, not the indication. His filtration rate is 62, and the indication is symptomatic HFrEF."),
        ("No, and the SGLT2 inhibitor should replace the beta blocker rather than be added",
         "The four drug classes are combined. An SGLT2 inhibitor does not replace an evidence-based beta blocker."),
    ],
))
