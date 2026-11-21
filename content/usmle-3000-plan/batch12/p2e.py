"""Step 2 items 41-70."""

from lib import s2

ACOG = "ACOG Practice Bulletin No. 222, Gestational Hypertension and Preeclampsia, 2020, the current ACOG bulletin on this topic."
ACG = "American College of Gastroenterology Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding, 2021."
USP_BR = "US Preventive Services Task Force breast cancer screening recommendation, 2024."
USP_LU = "US Preventive Services Task Force lung cancer screening recommendation, 2021."
USP_CR = "US Preventive Services Task Force colorectal cancer screening recommendation, 2021."
USP_AA = "US Preventive Services Task Force abdominal aortic aneurysm screening recommendation, 2019."
USP_CX = "US Preventive Services Task Force cervical cancer screening recommendation, 2018, which remains the current USPSTF statement."
CDC = "CDC Sexually Transmitted Infections Treatment Guidelines, 2021."
CDI = "IDSA/SHEA 2021 Focused Update Guidelines on Management of Clostridioides difficile Infection in Adults."
ACR = "2020 American College of Rheumatology Guideline for the Management of Gout."

ITEMS = []

ITEMS.append(s2(
    41, system="reproductive-endocrine", weight=10, topic="preeclampsia-eclampsia", domain="reproductive-endocrine", diff=3, subject="obstetrics",
    takeaway="Before 34 weeks, severe-range pressure that has been controlled, with a stable mother and a reassuring fetus, is watched in a capable hospital. Immediate delivery is not automatic.",
    citation=ACOG,
    scenario="A 24-year-old patient is at 30 weeks and 3 days. On arrival her blood pressure was 168/108 mm Hg. After intravenous labetalol it is 142/88 mm Hg. Platelets are 160,000, creatinine is 0.7 mg/dL, and she has no headache or pulmonary edema. The fetal tracing is reassuring. A colleague books an immediate cesarean because the gestational age is under 34 weeks.",
    question="Which setting matches a stabilized mother and a reassuring fetus at 30 weeks?",
    correct=("Remain in a hospital that can care for her and the newborn, and continue close monitoring",
             "ACOG allows expectant management before 34 0/7 weeks when the mother and fetus are stable, in a capable setting. Stabilization removes the mandate for immediate delivery. Delivery follows if either of them deteriorates."),
    wrongs=[
        ("Immediate cesarean, because every severe-range reading before 34 weeks ends the pregnancy",
         "The initial severe-range reading was treated. Once she is stable, expectant inpatient care is the option the bulletin allows."),
        ("Discharge today on oral labetalol with a clinic visit in two weeks",
         "Expectant care before 34 weeks is not home observation."),
        ("Deliver at 39 weeks and do not monitor until then",
         "Unmonitored delay until 39 weeks ignores the risk of deterioration."),
        ("Start magnesium at home and reassess at 37 weeks",
         "Home magnesium is not a regimen in the bulletin."),
    ],
))

ITEMS.append(s2(
    42, system="reproductive-endocrine", weight=10, topic="preeclampsia-eclampsia", domain="reproductive-endocrine", diff=3, subject="obstetrics",
    takeaway="Persistent systolic pressure of at least 160 mm Hg or diastolic pressure of at least 110 mm Hg is lowered promptly with intravenous labetalol or hydralazine. Magnesium does not replace that pressure drug.",
    citation=ACOG,
    scenario="A 35-year-old patient is at 33 weeks. Two blood pressures 15 minutes apart are 172/114 and 168/112 mm Hg. She has a headache that did not ease with acetaminophen. An intravenous line is in place, and magnesium has just been started. A colleague says the magnesium will bring the pressure down and that oral labetalol can wait until morning.",
    question="Which drug should lower this pressure now?",
    correct=("Intravenous labetalol or intravenous hydralazine now",
             "ACOG says persistent severe hypertension is treated promptly with intravenous labetalol or hydralazine when a line is available. Magnesium is for seizures and does not substitute for the pressure drug."),
    wrongs=[
        ("No additional drug. Magnesium is the pressure treatment, and oral labetalol can wait until morning",
         "Waiting until morning is the delay the bulletin rejects. Magnesium does not lower this pressure as its job."),
        ("A nitroprusside infusion as the first pressure drug on the ward",
         "Nitroprusside is not the first drug named for this acute pregnancy hypertension."),
        ("Immediate cesarean before any pressure drug",
         "An unlowered pressure of 172/114 is not taken to surgery untreated. The pressure drug comes as she is stabilized."),
        ("Hydrochlorothiazide by mouth tonight",
         "A thiazide is not the acute treatment. The acute drugs are intravenous labetalol, intravenous hydralazine, or immediate-release nifedipine if there is no line."),
    ],
))

ITEMS.append(s2(
    43, system="reproductive-endocrine", weight=10, topic="preeclampsia-eclampsia", domain="reproductive-endocrine", diff=2, subject="obstetrics",
    takeaway="After a prior pregnancy with this hypertensive disease, aspirin 81 mg daily starts between 12 and 28 weeks, ideally before 16 weeks, and continues until delivery.",
    citation=ACOG,
    scenario="A 29-year-old patient is at 14 weeks. Her previous pregnancy ended in a preterm birth after new hypertension, proteinuria, and a headache. She is normotensive today and takes a prenatal vitamin. A colleague says prevention can wait until the third trimester.",
    question="What prevention starts at 14 weeks?",
    correct=("Aspirin 81 mg daily, continued until delivery",
             "A prior pregnancy with this disease is a high-risk factor. ACOG recommends 81 mg daily from between 12 and 28 weeks, optimally before 16 weeks, until delivery. Fourteen weeks is inside that window."),
    wrongs=[
        ("No drug until the third trimester, because prevention is ineffective before 28 weeks",
         "Waiting for the third trimester misses the preferred start before 16 weeks."),
        ("Aspirin 325 mg daily, stopped at 20 weeks",
         "The dose is 81 mg, not 325 mg, and it continues until delivery."),
        ("Low-molecular-weight heparin instead of aspirin",
         "Heparin is not the prevention named for this history."),
        ("Magnesium from 14 weeks until delivery",
         "Magnesium is for seizure prevention around severe disease later in pregnancy, not a 14-week preventive drug."),
    ],
))

ITEMS.append(s2(
    44, system="reproductive-endocrine", weight=10, topic="preeclampsia-eclampsia", domain="reproductive-endocrine", diff=3, subject="obstetrics",
    takeaway="After birth, a patient still receiving magnesium may use a nonsteroidal anti-inflammatory drug. An opioid is not preferred for ordinary postpartum pain.",
    citation=ACOG,
    scenario="A 31-year-old patient gave birth yesterday and is still receiving magnesium. Blood pressure is 142/88 mm Hg, urine output is adequate, and the uterine fundus is firm. She rates incisional pain at 6 out of 10. A colleague withholds ibuprofen because of the magnesium and offers only oxycodone.",
    question="Which pain drug fits this postpartum day?",
    correct=("Ibuprofen, with an opioid reserved if the nonsteroidal drug is not enough",
             "ACOG's Level A statement prefers nonsteroidal drugs over opioids. Postpartum patients on magnesium did not have blood-pressure harm from those drugs in the studies the bulletin cites."),
    wrongs=[
        ("Oxycodone only. A nonsteroidal drug is prohibited while magnesium is infusing",
         "The bulletin does not prohibit the nonsteroidal drug during magnesium. Opioid-first treatment is what it prefers to avoid."),
        ("Stop magnesium so that ibuprofen can be given tomorrow",
         "Magnesium for seizure prevention is not stopped in order to unlock a pain drug."),
        ("Ketorolac intramuscularly every hour until pain is zero",
         "A nonsteroidal drug is appropriate. Hourly ketorolac is not a regimen and adds kidney and bleeding risk."),
        ("No pain drug, because any analgesic raises seizure risk",
         "Untreated pain is not the recommendation. Magnesium remains the seizure drug."),
    ],
))

ITEMS.append(s2(
    45, system="gastrointestinal", weight=8, topic="gi-bleed-management", domain="gastrointestinal", diff=3, subject="gastroenterology",
    takeaway="For an upper gastrointestinal bleed without preexisting cardiovascular disease, transfuse red cells when the hemoglobin is below 7 g/dL.",
    citation=ACG,
    scenario="A 58-year-old patient had two black stools overnight and has no heart disease. After intravenous fluid the blood pressure is 118/72 mm Hg and the heart rate is 88/min. Hemoglobin is 6.4 g/dL, down from 14 g/dL last year. He is no longer dizzy. A colleague withholds red cells because the pressure has normalized and the hemoglobin is above 6.",
    question="Which hemoglobin rule applies once he is no longer hypotensive?",
    correct=("Transfuse, because 6.4 g/dL is below 7 g/dL",
             "The 2021 ACG guideline suggests transfusion below 7 g/dL when there is no preexisting cardiovascular disease. A restored pressure does not raise that threshold, and the target is not a hemoglobin of 12."),
    wrongs=[
        ("Withhold red cells until the hemoglobin is below 6 g/dL, because a normal pressure cancels transfusion",
         "The restrictive threshold is 7 g/dL, not 6. A normal pressure does not cancel a value of 6.4."),
        ("Transfuse to a hemoglobin of 12 g/dL before any endoscopy",
         "A target of 12 g/dL is a liberal strategy the guideline does not suggest."),
        ("Transfuse platelets instead of red cells",
         "The given abnormality is the hemoglobin, not the platelet count."),
        ("No transfusion is ever used if endoscopy is planned within 24 hours",
         "Endoscopy timing does not erase a hemoglobin below 7 g/dL."),
    ],
))

ITEMS.append(s2(
    46, system="gastrointestinal", weight=8, topic="gi-bleed-management", domain="gastrointestinal", diff=3, subject="gastroenterology",
    takeaway="When upper gastrointestinal bleeding occurs in preexisting cardiovascular disease that is not an acute coronary syndrome, a hemoglobin threshold near 8 g/dL is reasonable.",
    citation=ACG,
    scenario="A 76-year-old patient with a myocardial infarction three years ago, and no chest pain now, reports black stool. Blood pressure is 124/70 mm Hg and the heart rate is 82/min. Hemoglobin is 7.5 g/dL. The electrocardiogram has no ST-segment elevation. A colleague withholds red cells because 7.5 is above 7.",
    question="Which threshold fits old coronary disease without an acute coronary syndrome?",
    correct=("Transfuse, because preexisting cardiovascular disease uses a threshold near 8 g/dL and 7.5 is under it",
             "ACG 2021 keeps 7 g/dL for patients without cardiovascular disease and says about 8 g/dL is reasonable when cardiovascular disease is already present. This is not an acute coronary syndrome, so the ACS figure near 10 is not the one being applied."),
    wrongs=[
        ("Keep withholding until the hemoglobin is below 7 g/dL",
         "The 7 g/dL line is for patients without cardiovascular disease. He has old coronary disease."),
        ("Transfuse only below 10 g/dL, using the acute coronary syndrome suggestion",
         "A hemoglobin near 10 g/dL is the ACS document's suggestion, not the ACG figure for remote infarction."),
        ("Do not transfuse any patient with a history of infarction, regardless of hemoglobin",
         "Remote infarction is a reason to use the higher ACG threshold, not a ban on red cells."),
        ("Transfuse platelets to 100,000 and ignore the hemoglobin",
         "The abnormality described is the hemoglobin."),
    ],
))

ITEMS.append(s2(
    47, system="gastrointestinal", weight=8, topic="gi-bleed-management", domain="gastrointestinal", diff=3, subject="gastroenterology",
    takeaway="A hypotensive patient with an upper gastrointestinal bleed may need red cells even when the first hemoglobin is still above 7 g/dL, because the value falls further as fluid is given.",
    citation=ACG,
    scenario="A 49-year-old patient is vomiting blood. Blood pressure is 78/50 mm Hg and the heart rate is 126/min. Hemoglobin, drawn before fluids, is 8.4 g/dL. He has no known heart disease. A colleague refuses red cells because 8.4 is above 7 and says crystalloid alone is the entire resuscitation.",
    question="Why is a hemoglobin of 8.4 g/dL not a reason to withhold red cells?",
    correct=("He is hypotensive, so red cells are reasonable now even though the first hemoglobin is 8.4 g/dL",
             "ACG 2021 separates hypotensive patients from the stable trials. Hemoglobin falls further after fluid, so transfusion above 7 g/dL is appropriate while he is in shock."),
    wrongs=[
        ("No red cells are given above 7 g/dL, even in shock",
         "The stable restrictive threshold does not govern exsanguinating hypotension."),
        ("Transfuse only after the hemoglobin is repeated and is still above 8 g/dL",
         "Waiting for a second number while the pressure is 78/50 delays resuscitation."),
        ("Give erythropoietin instead of red cells",
         "Erythropoietin does not restore volume or hemoglobin in the next hour."),
        ("The hemoglobin of 8.4 g/dL proves the bleeding has stopped",
         "Tachycardia and hypotension say the opposite. A single pre-dilution hemoglobin does not prove hemostasis."),
    ],
))

ITEMS.append(s2(
    48, system="gastrointestinal", weight=8, topic="gi-bleed-management", domain="gastrointestinal", diff=3, subject="gastroenterology",
    takeaway="Endoscopy for an upper gastrointestinal bleed is done within 24 hours after resuscitation. An unstable patient is not scoped before the pressure is restored.",
    citation=ACG,
    scenario="A 62-year-old patient has melena and a blood pressure of 80/46 mm Hg. Two large-bore intravenous lines have just been placed and no fluid has been given. Hemoglobin is 7.8 g/dL. A colleague wants endoscopy before fluids or blood because the guideline mentions a 24-hour clock.",
    question="What has to happen before the endoscope?",
    correct=("Restore the circulation, then perform endoscopy within 24 hours",
             "ACG 2021 suggests endoscopy within 24 hours so that resuscitation can occur. The clock is not an instruction to scope a patient whose pressure is 80 mm Hg."),
    wrongs=[
        ("Endoscopy first. The 24-hour window is a reason to skip resuscitation",
         "The 24-hour suggestion is the outer bound after resuscitation, not a reason to skip it."),
        ("Delay endoscopy for 72 hours so the ulcer can heal",
         "Seventy-two hours is longer than the suggested window. The correction is to resuscitate, not to wait three days."),
        ("Barium swallow instead of endoscopy",
         "Contrast swallow is not the test for an acute bleed."),
        ("Oral sucralfate only, with no procedure and no intravenous fluid",
         "Sucralfate does not resuscitate shock and is not the hemostatic plan."),
    ],
))

ITEMS.append(s2(
    49, system="gastrointestinal", weight=8, topic="gi-bleed-management", domain="gastrointestinal", diff=2, subject="gastroenterology",
    takeaway="Epinephrine injection alone is not adequate hemostasis for a bleeding ulcer. A second method has to be added.",
    citation=ACG,
    scenario="A 55-year-old patient has been resuscitated after melena. At endoscopy an ulcer is actively oozing. The endoscopist injects epinephrine and stops, calling the bleeding controlled. No clip, cautery, or second agent is applied. The arrival hemoglobin was 6.9 g/dL.",
    question="Why is epinephrine injection alone incomplete?",
    correct=("A second method, such as a clip or thermal contact, has to be added",
             "ACG 2021 says epinephrine alone is not recommended. Active oozing is treated by combining epinephrine with another modality because injection alone has a higher rebleeding risk."),
    wrongs=[
        ("It is complete. Epinephrine is the only method the guideline endorses",
         "The guideline recommends against epinephrine monotherapy."),
        ("No endoscopic therapy is indicated once oozing slows during the injection",
         "Active oozing is a high-risk stigma. Therapy is recommended, and it has to be more than epinephrine."),
        ("Surgery is required for every oozing ulcer, so the injection should not have been done",
         "Endoscopic therapy is first. Surgery is not the opening move for an ulcer that can be treated through the endoscope."),
        ("Repeat epinephrine every 15 minutes for 24 hours without a second device",
         "More epinephrine is still monotherapy. The missing piece is a second method."),
    ],
))

ITEMS.append(s2(
    50, system="gastrointestinal", weight=8, topic="gi-bleed-management", domain="gastrointestinal", diff=3, subject="gastroenterology",
    takeaway="A Glasgow-Blatchford score of 0 or 1 identifies a very-low-risk upper bleed that may be discharged with outpatient follow-up.",
    citation=ACG,
    scenario="A 41-year-old patient had one small streak of coffee-ground material that has not recurred. There is no black stool, no syncope, no liver disease, and no heart failure. Blood urea nitrogen is 12 mg/dL, hemoglobin is 14.2 g/dL, systolic pressure is 128 mm Hg, and the pulse is 76/min. A colleague admits him overnight because any coffee-ground material requires inpatient endoscopy.",
    question="Which disposition matches these numbers?",
    correct=("Discharge with outpatient follow-up",
             "Urea, hemoglobin, pressure, pulse, and the absence of melena, syncope, liver disease, and heart failure put the Glasgow-Blatchford score at 0 or 1. ACG 2021 suggests discharge for that very-low-risk group."),
    wrongs=[
        ("Admit for urgent overnight endoscopy. Any coffee-ground streak is high risk",
         "The score, not the mere presence of a streak, is the triage tool. This score is very low risk."),
        ("Transfuse two units before a discharge discussion",
         "Hemoglobin is 14.2 g/dL. Transfusion is not indicated."),
        ("Start a beta blocker for varices and admit to intensive care",
         "There is no liver disease and no hemodynamic abnormality."),
        ("Nasogastric lavage every hour for 12 hours in a monitored bed",
         "Serial lavage is not the triage tool. The score already supports discharge."),
    ],
))
