"""Step 1 items 26-60."""

from lib import s1

ACG = "American College of Gastroenterology Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding, 2021."
USP_BR = "US Preventive Services Task Force breast cancer screening recommendation, 2024."
USP_LU = "US Preventive Services Task Force lung cancer screening recommendation, 2021."
USP_AA = "US Preventive Services Task Force abdominal aortic aneurysm screening recommendation, 2019."
USP_CR = "US Preventive Services Task Force colorectal cancer screening recommendation, 2021."
USP_CX = "US Preventive Services Task Force cervical cancer screening recommendation, 2018, which remains the current USPSTF statement."
GINA = "Global Initiative for Asthma, GINA Strategy Report 2025."
GOLD = "Global Initiative for Chronic Obstructive Lung Disease, GOLD 2026 report."
ACOG = "ACOG Practice Bulletin No. 222, Gestational Hypertension and Preeclampsia, 2020, the current ACOG bulletin on this topic."
CDC = "CDC Sexually Transmitted Infections Treatment Guidelines, 2021."
CDI = "IDSA/SHEA 2021 Focused Update Guidelines on Management of Clostridioides difficile Infection in Adults."
HF = "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure, which remains the current United States heart-failure guideline."
ACS = "2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes."
ACR = "2020 American College of Rheumatology Guideline for the Management of Gout."
ADA = "American Diabetes Association, Standards of Care in Diabetes, 2026, sections 9 and 11."
KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."

def W(a, b):
    return (a, b)

ITEMS = []

def A(n, **k):
    ITEMS.append(s1(n, **k))

A(26, system="gastrointestinal", weight=8, topic="gi-bleeding-sources", domain="gastrointestinal", diff=3, subject="pathology",
  takeaway="When endoscopic therapy fails to stop ulcer bleeding, the suggested next procedure is transcatheter embolization rather than an immediate open operation.",
  citation=ACG,
  scenario="A 70-year-old patient has an actively bleeding duodenal ulcer. Two endoscopic attempts, including a clip and epinephrine, have not stopped the bleeding. Heart rate is 118/min after transfusion, and blood pressure is 100/60 mm Hg. A classmate takes him straight to an open operation and says angiography has no role once endoscopy fails.",
  question="What does the 2021 guideline suggest when endoscopy fails?",
  correct=W("Transcatheter embolization rather than an immediate open operation",
            "ACG 2021 suggests transcatheter embolization if endoscopic therapy fails. An operation remains possible later. It is not the automatic next step the moment the endoscope fails."),
  wrongs=[
    W("Immediate open operation, because embolization is not a recognized option", "Embolization is the option the guideline suggests at this point."),
    W("A third injection of epinephrine alone", "Epinephrine monotherapy is not recommended, and two attempts have already failed."),
    W("Discharge on sucralfate", "Ongoing bleeding is not an outpatient problem."),
    W("Stop all proton-pump-inhibitor therapy before any procedure", "Acid suppression continues. It does not replace hemostasis."),
  ])

A(27, system="social-sciences", weight=8, topic="sensitivity-specificity", domain="social-sciences", diff=2, subject="biostatistics",
  takeaway="The 2024 mammography recommendation covers ages 40 through 74. Age 76 is outside that routine biennial recommendation.",
  citation=USP_BR,
  scenario="A 76-year-old patient has never had a mammogram and has no symptoms or known mutation. A classmate books yearly mammograms indefinitely, saying the 2024 recommendation has no upper age.",
  question="What does age 76 do to that routine recommendation?",
  correct=W("The routine biennial recommendation stops at 74, so yearly mammography is not what the statement requires",
            "The 2024 USPSTF recommendation is biennial mammography for women aged 40 to 74. Age 76 is outside it. Inventing a lifetime yearly schedule applies a different program."),
  wrongs=[
    W("Yearly mammography is required for life once age 40 has passed", "The statement has an upper age of 74, and the interval is two years, not one."),
    W("Start at 76 because screening is more useful after 74 than before", "The B recommendation does not begin at 76."),
    W("Ultrasound every three months is the replacement test after 74", "Ultrasound is not the replacement named in the recommendation."),
    W("A single MRI at 76 is mandatory", "MRI is not the average-risk test in this statement."),
  ])

A(28, system="social-sciences", weight=8, topic="sensitivity-specificity", domain="social-sciences", diff=2, subject="biostatistics",
  takeaway="Low-dose CT screening does not start before age 50, even when the pack-year history is already heavy.",
  citation=USP_LU,
  scenario="A 48-year-old patient has smoked two packs a day since age 28, about 40 pack-years, and still smokes. He has no symptoms. A classmate orders annual low-dose CT because the pack-year total already exceeds 20.",
  question="Why is screening CT not indicated yet?",
  correct=W("He is 48, and the recommendation starts at 50",
            "The 2021 statement requires age 50 to 80 and at least 20 pack-years and current smoking or a quit within 15 years. He meets the smoking criteria and misses the age floor."),
  wrongs=[
    W("Pack-years above 20 override the age floor", "All three criteria are required. Pack-years do not replace age."),
    W("He is too old, because screening ends at 45", "The range starts at 50 and continues to 80. Forty-eight is too young, not too old."),
    W("Order a chest radiograph now and CT at 70", "A chest radiograph is not the screening test, and 70 is not the start age."),
    W("Start CT because any current smoker is screened from age 40", "Forty is not the start, and smoking alone is not sufficient."),
  ])

A(29, system="social-sciences", weight=8, topic="sensitivity-specificity", domain="social-sciences", diff=2, subject="biostatistics",
  takeaway="Aneurysm screening for men who have smoked starts at 65, not at 64.",
  citation=USP_AA,
  scenario="A 64-year-old patient smoked for 15 years and quit at 40. He has no abdominal pain. A classmate orders the one-time abdominal ultrasound a year early because the smoking history is already enough.",
  question="Is the ultrasound indicated at age 64?",
  correct=W("No. The age window is 65 to 75",
            "The 2019 recommendation is one ultrasound for men aged 65 to 75 who have ever smoked. Smoking qualifies him. Age 64 does not."),
  wrongs=[
    W("Yes. Any age over 60 is inside the window if he has smoked", "The age floor is 65, not 60, so a 64-year-old is not yet in the window."),
    W("Yes, and then repeat it every year", "The test, when done, is one-time, and he is not yet in the age window."),
    W("No ultrasound is ever indicated in a former smoker", "Former smoking counts once he is 65 to 75."),
    W("CT angiography at 64, because ultrasound is only for current smokers", "The modality is ultrasound, and current smoking is not required."),
  ])

A(30, system="social-sciences", weight=8, topic="sensitivity-specificity", domain="social-sciences", diff=2, subject="biostatistics",
  takeaway="Average-risk colorectal screening does not start at 44. The 2021 start is 45.",
  citation=USP_CR,
  scenario="A 44-year-old patient has no symptoms, no inflammatory bowel disease, and no affected relative. A classmate orders a screening colonoscopy because 'close to 45 is close enough.'",
  question="Is average-risk screening indicated at 44?",
  correct=W("No. The start is 45, so 44 is still too young",
            "The 2021 USPSTF recommendation begins average-risk screening at 45. Being close to the birthday is not the criterion."),
  wrongs=[
    W("Yes. The recommendation starts at 40", "The average-risk start is 45, not 40, so age 44 is still too young."),
    W("Yes, but only with CT colonography, not colonoscopy or a stool test", "The modality is not the reason he is too young. Any average-risk test waits until 45."),
    W("No screening is offered until 50", "Fifty is the retired start. The current start is 45, which he has not reached."),
    W("Yes, because absence of symptoms is itself an indication to screen early", "Absence of symptoms is expected. It does not lower the age."),
  ])

A(31, system="social-sciences", weight=8, topic="sensitivity-specificity", domain="social-sciences", diff=3, subject="biostatistics",
  takeaway="From ages 30 to 65, high-risk HPV testing alone every 5 years is an acceptable cervical screen. Yearly cytology is not the strategy.",
  citation=USP_CX,
  scenario="A 34-year-old patient has had normal cytology in the past. She has no symptoms. A classmate tells her the only acceptable test is a Pap smear every year, and that HPV testing is not allowed until age 65.",
  question="Which strategy is acceptable at age 34?",
  correct=W("High-risk HPV testing alone every 5 years",
            "The current USPSTF statement allows, from 30 to 65, cytology every 3 years, high-risk HPV testing alone every 5 years, or cotesting every 5 years. Yearly cytology is not required, and HPV testing does not wait until 65."),
  wrongs=[
    W("Cytology every year, and no HPV test until 65", "Yearly cytology is not the interval, and HPV testing is already an option at 34."),
    W("No screening from 30 to 65 if one prior cytology was normal", "A normal prior test does not end screening."),
    W("HPV testing every 6 months", "The HPV interval, when that option is chosen, is 5 years, not 6 months."),
    W("Pelvic ultrasound every 2 years", "Ultrasound is not a cervical screening test."),
  ])

A(32, system="respiratory-renal", weight=13, topic="asthma-copd-pathology", domain="respiratory-renal", diff=3, subject="physiology",
  takeaway="Asthma is confirmed by variable symptoms plus variable expiratory airflow. One normal spirometry does not exclude it.",
  citation=GINA,
  scenario="A 19-year-old patient wheezes two nights a week and is fine on other days. Today's spirometry, done when he feels well, is normal. A classmate says a normal tracing excludes asthma and cancels any inhaled corticosteroid.",
  question="Why does today's normal spirometry not settle the question?",
  correct=W("Airflow limitation in asthma comes and goes, so a normal tracing between symptoms does not exclude the diagnosis",
            "GINA 2025 replaced the confusing phrase and states that lung function in untreated asthma is variable. Limitation may be absent at the moment of testing. Variable symptoms still need a test aimed at that variability, not a single normal curve used as proof of absence."),
  wrongs=[
    W("A normal tracing permanently excludes asthma", "That is the misreading the 2025 wording was written to stop."),
    W("Asthma can be diagnosed from night waking alone, with no airflow information ever", "Both variable symptoms and variable airflow are required. Symptoms alone are not enough, and one normal curve is not the airflow assessment."),
    W("Only a low FEV1 that never changes can be asthma", "Fixed obstruction is not the pattern. Variability is."),
    W("Start oral prednisone for a month because spirometry was normal", "A normal tracing is not an indication for a month of oral corticosteroid."),
  ])

A(33, system="respiratory-renal", weight=13, topic="asthma-copd-pathology", domain="respiratory-renal", diff=3, subject="physiology",
  takeaway="An elevated exhaled nitric oxide is interpreted after inhaled corticosteroid adherence is checked. It is not the first diagnostic test ahead of spirometry.",
  citation=GINA,
  scenario="A 28-year-old patient has variable wheeze. Nobody has checked inhaler technique, and he has not been prescribed an inhaled corticosteroid. A classmate orders exhaled nitric oxide as the first and only diagnostic test and says spirometry is optional.",
  question="Where does nitric oxide sit in the work-up?",
  correct=W("After spirometry and after adherence and technique are addressed, not as the first test",
            "GINA 2025 keeps lung function as the first confirmation and places biomarkers in the review step, because an elevated value often reflects poor adherence with inhaled corticosteroid therapy."),
  wrongs=[
    W("It replaces spirometry as the first test", "Lung function remains the first confirmation."),
    W("A high value proves asthma even if he has never had variable symptoms", "The diagnosis still needs the clinical variability, not a biomarker alone."),
    W("It is useful only after oral prednisone has already been started", "The sequence is inhaled therapy and adherence, not a course of oral corticosteroid first."),
    W("A low value means antibiotics are the treatment", "Nitric oxide is not an antibiotic indication."),
  ])

A(34, system="respiratory-renal", weight=13, topic="asthma-copd-pathology", domain="respiratory-renal", diff=3, subject="pharmacology",
  takeaway="After a COPD exacerbation, a low eosinophil count does not support adding an inhaled corticosteroid. Dual long-acting bronchodilators are the maintenance start.",
  citation=GOLD,
  scenario="A 74-year-old patient is leaving after a COPD exacerbation. He has never had asthma. The blood eosinophil count is 80 cells per microliter. He uses no maintenance inhaler. A classmate adds an inhaled corticosteroid because any exacerbation automatically gets one.",
  question="Which maintenance inhaler matches an eosinophil count of 80?",
  correct=W("Dual long-acting bronchodilators, without an inhaled corticosteroid",
            "GOLD 2026 ties the addition of an inhaled corticosteroid to elevated eosinophils plus an exacerbation, and it discourages a corticosteroid combination when asthma is absent. A count of 80 is not that elevated signal. Maintenance bronchodilators still start now."),
  wrongs=[
    W("An inhaled corticosteroid with a long-acting beta agonist and no muscarinic antagonist", "That pair is discouraged without asthma, and the eosinophil count does not supply the corticosteroid indication."),
    W("No maintenance inhaler, because eosinophils are low", "Low eosinophils remove the corticosteroid argument. They do not remove long-acting bronchodilators after an exacerbation."),
    W("Oral prednisone for 30 days", "The exacerbation course is up to 5 days, not a month of maintenance prednisone."),
    W("Theophylline every day as maintenance", "Methylxanthines are not the maintenance drug GOLD recommends after an exacerbation."),
  ])

A(35, system="reproductive-endocrine", weight=14, topic="preeclampsia-mechanism", domain="reproductive-endocrine", diff=4, subject="pathology",
  takeaway="Pulmonary edema is a severe feature. Expectant care is not continued while the mother is still in pulmonary edema.",
  citation=ACOG,
  scenario="A 29-year-old patient is at 31 weeks. Blood pressure is 168/104 mm Hg. Oxygen saturation is 90 percent on room air, and there are crackles halfway up both lungs. Platelets are 160,000. A classmate starts expectant management because 31 weeks is under 34 and the platelet count is normal.",
  question="Why is expectant management the wrong reading?",
  correct=W("Pulmonary edema is a severe feature, and she is not stable enough for expectant care",
            "ACOG lists pulmonary edema as a severe feature. Expectant management before 34 weeks requires a stable mother. Hypoxemia and crackles mean she is not stable. She is treated and delivered if she does not stabilize, rather than observed as if only the gestational age mattered."),
  wrongs=[
    W("A normal platelet count means expectant care is safe at any oxygen saturation", "Platelets are one severe feature. Pulmonary edema is another, and instability ends expectant care."),
    W("Oxygen saturation of 90 percent is normal in late pregnancy", "Ninety percent with crackles is pulmonary edema, not a normal pregnancy saturation."),
    W("Expectant care is mandatory under 34 weeks no matter how sick the mother is", "Expectant care is for selected stable patients. Maternal instability is a reason to deliver."),
    W("The edema is treated with a nonsteroidal drug and she goes home", "A nonsteroidal drug is not the acute treatment of pulmonary edema in this setting, and home is unsafe."),
  ])

A(36, system="blood-lymph-immune", weight=11, topic="antibiotic-mechanisms", domain="blood-lymph-immune", diff=3, subject="microbiology",
  takeaway="If a partner with gonorrhea will not be examined, and local law allows it, the oral alternative is cefixime 800 mg, not 400 mg.",
  citation=CDC,
  scenario="A 27-year-old patient was treated for uncomplicated gonorrhea. The partner will not come in, and state law allows a partner dose to be sent. Chlamydia was excluded in the patient. A classmate sends cefixime 400 mg and says any oral cephalosporin dose is equivalent.",
  question="Which partner dose matches the 2021 guidance?",
  correct=W("Cefixime 800 mg once, because an injection for the partner is not going to happen",
            "CDC 2021 says that when the injectable regimen cannot be used for a partner, cefixime 800 mg once is the oral option if chlamydia has been excluded. Four hundred milligrams is not that dose."),
  wrongs=[
    W("Cefixime 400 mg, because the oral dose was never updated", "The updated oral dose is 800 mg."),
    W("Ciprofloxacin 500 mg", "A fluoroquinolone is not the partner regimen."),
    W("No treatment for a partner who declines an examination", "When law allows and the partner will not be seen, the guidance still offers a regimen."),
    W("Doxycycline for 7 days and no cephalosporin", "Chlamydia was excluded, and doxycycline does not treat the gonorrhea."),
  ])

A(37, system="reproductive-endocrine", weight=14, topic="preeclampsia-mechanism", domain="reproductive-endocrine", diff=3, subject="pharmacology",
  takeaway="Pregnant patients with gonorrhea and a still-unknown chlamydia result receive ceftriaxone plus azithromycin, not doxycycline.",
  citation=CDC,
  scenario="A 25-year-old patient is at 18 weeks and weighs 72 kg. A cervical test is positive for gonorrhea. The chlamydia result is not back. She has no joint findings. A classmate prescribes ceftriaxone 500 mg plus doxycycline for 7 days, copying the nonpregnant regimen.",
  question="Which pair matches pregnancy when chlamydia is still unknown?",
  correct=W("Ceftriaxone 500 mg once plus azithromycin 1 g once",
            "Weight is under 150 kg, so gonorrhea treatment is ceftriaxone 500 mg. In pregnancy, chlamydia coverage is azithromycin 1 g, not doxycycline. Both facts have to be applied."),
  wrongs=[
    W("Ceftriaxone 500 mg plus doxycycline for 7 days", "Doxycycline is the nonpregnant chlamydia drug. Pregnancy changes that half of the pair."),
    W("Azithromycin alone", "Azithromycin does not treat the gonorrhea."),
    W("Ceftriaxone 1 g daily for a week", "She does not have disseminated infection, and the weight does not require 1 g."),
    W("No antibiotics until after delivery", "Both infections are treated during pregnancy, not deferred."),
  ])

A(38, system="gastrointestinal", weight=8, topic="gi-bleeding-sources", domain="gastrointestinal", diff=3, subject="pharmacology",
  takeaway="If fidaxomicin cannot be obtained, oral vancomycin is the acceptable alternative for an initial C. difficile episode. Metronidazole is not that alternative.",
  citation=CDI,
  scenario="A 77-year-old patient has a first episode of toxin-positive watery diarrhea. The white-cell count is 13,000, creatinine is 1.0 mg/dL, and the abdomen is soft. The hospital does not stock fidaxomicin. A classmate starts metronidazole because the preferred drug is unavailable.",
  question="Which drug is the acceptable substitute?",
  correct=W("Oral vancomycin",
            "The 2021 update suggests fidaxomicin when it can be obtained and says vancomycin remains an acceptable alternative. Unavailability of fidaxomicin is the resource limit the comment describes. Metronidazole is not the substitute."),
  wrongs=[
    W("Metronidazole, because any unavailable drug is replaced by metronidazole", "The named acceptable alternative is vancomycin."),
    W("Intravenous vancomycin", "Intravenous vancomycin does not treat luminal infection."),
    W("No antibiotic until fidaxomicin can be ordered next week", "Treatment is not delayed a week. Oral vancomycin can start now."),
    W("Oral vancomycin plus intravenous metronidazole", "That pair is for fulminant disease, which this soft abdomen is not."),
  ])

A(39, system="msk-skin", weight=10, topic="gout-crystals", domain="msk-skin", diff=2, subject="pharmacology",
  takeaway="Ice is an adjunct for a flare. It does not replace colchicine, an NSAID, or a glucocorticoid.",
  citation=ACR,
  scenario="A 49-year-old patient has an acutely hot first toe, a normal filtration rate, and no ulcer disease. A classmate recommends ice only and says anti-inflammatory drugs are optional if the ice is started early.",
  question="Where does ice fit?",
  correct=W("As an adjunct to a first-line anti-inflammatory drug, not as the whole treatment",
            "The 2020 guideline conditionally recommends ice as an adjunct and strongly recommends colchicine, an NSAID, or a glucocorticoid as the flare treatment. Ice does not replace those drugs."),
  wrongs=[
    W("Ice alone is first-line therapy", "Ice is an adjunct, not the treatment the strong recommendation names."),
    W("Ice is harmful and should never be used", "The guideline recommends it as an adjunct, not as a harm."),
    W("Ice plus an IL-1 inhibitor is the required first pair", "An IL-1 inhibitor is not first-line when a standard anti-inflammatory drug can be used."),
    W("Ice replaces the need to check the serum urate later", "Urate decisions are separate. Ice does not retire them."),
  ])

A(40, system="cardiovascular", weight=9, topic="heart-failure-pathophysiology", domain="cardiovascular", diff=3, subject="pharmacology",
  takeaway="Diltiazem and verapamil harm a weak ventricle because they are negative inotropes. That is why they are class 3 in HFrEF.",
  citation=HF,
  scenario="A 64-year-old patient has an ejection fraction of 28 percent. A classmate asks why diltiazem, which slows the heart rate, is classified as harmful rather than helpful. Blood pressure is 108/68 mm Hg. He is not in atrial fibrillation today.",
  question="Which myocardial effect makes diltiazem harmful here?",
  correct=W("Negative inotropy, which the failing ventricle cannot afford",
            "The 2022 guideline states that nondihydropyridine calcium-channel blockers are myocardial depressants and gives them a class 3 recommendation in HFrEF. The harm is the negative inotropy, not a failure to slow the rate."),
  wrongs=[
    W("Positive inotropy, which overworks the ventricle", "The direction is negative inotropy, not positive."),
    W("A rise in contractility that is useful below an ejection fraction of 30", "Contractility falls. That is the harm, and it is not useful."),
    W("No myocardial effect. The drug is harmful only because it raises blood pressure", "Blood pressure is 108/68. The stated harm is myocardial depression."),
    W("Blockade of aldosterone receptors", "Diltiazem is not an aldosterone antagonist."),
  ])
