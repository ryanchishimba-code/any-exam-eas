"""Step 1 items 51-100."""

from lib import s1

ADA = "American Diabetes Association, Standards of Care in Diabetes, 2026, sections 9 and 11."
KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."
HTN = "2025 AHA/ACC/Multispecialty Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults."
HF = "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure, which remains the current United States heart-failure guideline."
ACS = "2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes."
USP_LU = "US Preventive Services Task Force lung cancer screening recommendation, 2021."
USP_BR = "US Preventive Services Task Force breast cancer screening recommendation, 2024."
USP_CR = "US Preventive Services Task Force colorectal cancer screening recommendation, 2021."
ACG = "American College of Gastroenterology Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding, 2021."
ACOG = "ACOG Practice Bulletin No. 222, Gestational Hypertension and Preeclampsia, 2020, the current ACOG bulletin on this topic."
CDI = "IDSA/SHEA 2021 Focused Update Guidelines on Management of Clostridioides difficile Infection in Adults."
ACR = "2020 American College of Rheumatology Guideline for the Management of Gout."
GOLD = "Global Initiative for Chronic Obstructive Lung Disease, GOLD 2026 report."
GINA = "Global Initiative for Asthma, GINA Strategy Report 2025."

def W(a, b):
    return (a, b)

ITEMS = []

def A(n, **k):
    ITEMS.append(s1(n, **k))

A(51, system="reproductive-endocrine", weight=14, topic="diabetes-pathophysiology", domain="reproductive-endocrine", diff=3, subject="pharmacology",
  takeaway="A GLP-1 receptor agonist that does not depend on kidney clearance can be used on dialysis for cardiovascular risk. Dialysis is not an absolute ban.",
  citation=ADA,
  scenario="A 68-year-old patient is on dialysis and has type 2 diabetes with an A1c of 8.2 percent and known coronary disease. A classmate says no GLP-1 receptor agonist can ever be used once dialysis starts.",
  question="What does dialysis do to a GLP-1 receptor agonist that is not cleared by the kidney?",
  correct=W("It can still be used to reduce cardiovascular risk. Dialysis is not an absolute ban on that agent",
            "ADA 2026 says people on dialysis can be initiated or continued on GLP-1 therapy that does not depend on kidney clearance, for cardiovascular risk and mortality. A blanket ban is the error."),
  wrongs=[
    W("Dialysis prohibits every GLP-1 receptor agonist", "The prohibition is not absolute for agents that are not renally cleared."),
    W("Only a renally cleared GLP-1 receptor agonist is allowed on dialysis", "The safe direction is the opposite: avoid dependence on kidney clearance."),
    W("Metformin is the preferred drug on dialysis", "Metformin is contraindicated far above the dialysis range."),
    W("A sulfonylurea is required before any GLP-1 drug on dialysis", "A sulfonylurea is not a required bridge and adds hypoglycemia."),
  ])

A(52, system="respiratory-renal", weight=13, topic="aki-mechanisms", domain="respiratory-renal", diff=3, subject="pharmacology",
  takeaway="A potassium of 5.2 mEq/L soon after an ACE inhibitor is a reason to review diet and other drugs before abandoning the class. It is not a reason to add an ARB.",
  citation=KDIGO,
  scenario="A 64-year-old patient with diabetes and an albumin-to-creatinine ratio of 180 mg/g started lisinopril a week ago. Potassium rose from 4.4 to 5.2 mEq/L. The filtration rate is unchanged. He eats several potassium-salt servings a day and also takes a nonsteroidal drug. A classmate stops the ACE inhibitor and adds an ARB the same day.",
  question="What is the first response to this potassium?",
  correct=W("Stop the nonsteroidal drug and the potassium salt, and keep one renin-angiotensin drug while potassium is rechecked",
            "KDIGO 2024 says to continue the maximally tolerated ACE inhibitor or ARB and to reduce or stop it only if mitigation fails. Mitigation includes other drugs and dietary potassium. Adding an ARB on top is the combination the guideline rejects."),
  wrongs=[
    W("Stop the ACE inhibitor and start an ARB the same day", "Switching classes the same day, or combining them, is not the mitigation step."),
    W("Add the ARB and keep the ACE inhibitor", "Dual blockade is not recommended."),
    W("Ignore 5.2 mEq/L until it exceeds 7", "5.2 needs a response. Waiting for 7 is not mitigation."),
    W("Start a nonsteroidal drug at a higher dose to lower potassium", "He is already on one, and it is part of the problem, not the treatment."),
  ])

A(53, system="social-sciences", weight=8, topic="sensitivity-specificity", domain="social-sciences", diff=3, subject="biostatistics",
  takeaway="Lung-cancer screening is not started when the person cannot undergo curative lung surgery or has a short life expectancy.",
  citation=USP_LU,
  scenario="A 70-year-old patient has a 40 pack-year history and still smokes. He also has metastatic pancreatic cancer, is losing weight, and is not a candidate for lung surgery. A classmate orders annual low-dose CT because age and pack-years qualify.",
  question="Why is screening CT not indicated?",
  correct=W("He cannot undergo curative lung surgery, so screening is stopped or not started",
            "The 2021 USPSTF statement says screening stops once a health problem substantially limits life expectancy or the ability to have curative lung surgery. Age and pack-years are necessary and not sufficient."),
  wrongs=[
    W("Age and pack-years are sufficient no matter what else is wrong", "The statement adds the surgery and life-expectancy stop rules."),
    W("Screening is more useful once metastatic cancer is present", "Metastatic cancer is a reason not to screen, not a reason to start."),
    W("Order a chest radiograph instead", "A chest radiograph is not the alternative screening test."),
    W("Start CT and biopsy every nodule, because he cannot have surgery", "The inability to have curative surgery is why screening is not started."),
  ])

A(54, system="cardiovascular", weight=9, topic="acs-pathophysiology", domain="cardiovascular", diff=2, subject="pharmacology",
  takeaway="Tenecteplase is a fibrin-specific fibrinolytic given as one weight-based intravenous bolus, not a 90-minute infusion.",
  citation=ACS,
  scenario="A 59-year-old patient needs a fibrinolytic because PCI would be delayed more than 120 minutes. He has no contraindication. A classmate draws up a 90-minute infusion and calls it tenecteplase.",
  question="How is tenecteplase given?",
  correct=W("One weight-based intravenous bolus",
            "The 2025 ACS guideline lists tenecteplase as a single weight-based bolus, reteplase as two boluses, and alteplase as a 90-minute infusion. A 90-minute infusion is alteplase, not tenecteplase."),
  wrongs=[
    W("A 90-minute infusion", "That schedule is alteplase."),
    W("Two boluses 30 minutes apart", "That schedule is reteplase."),
    W("An oral tablet", "Fibrinolytics for this indication are intravenous."),
    W("A continuous infusion for 24 hours", "None of the fibrin-specific agents is given as a 24-hour infusion."),
  ])

A(55, system="cardiovascular", weight=9, topic="heart-failure-pathophysiology", domain="cardiovascular", diff=3, subject="pharmacology",
  takeaway="In mildly reduced ejection fraction, an SGLT2 inhibitor has a class 2a recommendation. Beta blockers, ARNIs, ACE inhibitors, ARBs, and mineralocorticoid antagonists are weaker, class 2b.",
  citation=HF,
  scenario="A 66-year-old patient has dyspnea and an ejection fraction of 46 percent. He is not on therapy. A classmate says every heart-failure drug class has the same strength of recommendation once the ejection fraction is under 50.",
  question="Which class has the clearer recommendation at 46 percent?",
  correct=W("An SGLT2 inhibitor, class 2a, ahead of the class 2b drugs",
            "The 2022 guideline gives SGLT2 inhibitors a class 2a recommendation for mildly reduced ejection fraction and class 2b to evidence-based beta blockers, ARNI, ACE inhibitor or ARB, and mineralocorticoid antagonists. Forty-six percent is the 41 to 49 band. The classes are not equal."),
  wrongs=[
    W("All four classes are class 1 below an ejection fraction of 50", "Class 1 four-drug therapy is the reduced-ejection-fraction recommendation, at 40 percent or lower."),
    W("A nitrate is class 1 at 46 percent", "Routine nitrates are not the recommendation in this range."),
    W("A nondihydropyridine calcium-channel blocker is class 1", "Those drugs are harmful when ejection fraction is reduced and are not the pick here."),
    W("No drug has any recommendation between 41 and 49 percent", "The SGLT2 inhibitor recommendation is specifically for this band."),
  ])

A(56, system="social-sciences", weight=8, topic="sensitivity-specificity", domain="social-sciences", diff=2, subject="biostatistics",
  takeaway="The benefit-harm balance is why the 2024 mammography interval is every two years rather than every year.",
  citation=USP_BR,
  scenario="A 50-year-old patient at average risk asks why her screening mammogram is scheduled every two years instead of every year. She has no mutation and no symptoms. A classmate says the task force simply has not reviewed the interval.",
  question="Why is the interval two years?",
  correct=W("Biennial screening had a more favorable balance of benefit and harm than annual screening",
            "The 2024 USPSTF recommendation states that biennial mammography from 40 to 74 has a moderate net benefit, and that the tradeoff is more favorable than annual screening. The interval is a reviewed choice, not an omission."),
  wrongs=[
    W("The interval was never reviewed", "The statement compares the intervals and chooses biennial."),
    W("Annual screening prevents more deaths with no added harm", "The task force judged the harm tradeoff less favorable for annual screening."),
    W("Two years is used only after age 70", "The biennial interval applies across 40 to 74."),
    W("Ultrasound every two years is what the balance supports", "The test is mammography, on a two-year interval."),
  ])

A(57, system="social-sciences", weight=8, topic="sensitivity-specificity", domain="social-sciences", diff=3, subject="biostatistics",
  takeaway="Starting colorectal screening at 45 rather than 50 adds life-years. That is why 45 is the start, not a rounding error.",
  citation=USP_CR,
  scenario="A 45-year-old patient at average risk asks why screening starts now instead of at 50, which is what an older handout said. He has no symptoms and no affected relative. A classmate says the change was administrative and adds no benefit.",
  question="What benefit supported moving the start from 50 to 45?",
  correct=W("Modeling found more life-years gained and fewer colorectal cancer deaths when screening starts at 45",
            "The 2021 USPSTF statement concluded there is a moderate net benefit for adults 45 to 49. The models showed more life-years and fewer deaths versus starting at 50. It is not an administrative rounding of the old age."),
  wrongs=[
    W("No health benefit. The age was changed for scheduling convenience", "The statement cites a moderate net benefit, not convenience."),
    W("Starting at 45 is harmful and was rejected", "The recommendation is to start at 45."),
    W("The benefit appears only if colonoscopy is the test", "The statement allows several recommended tests. The age benefit is not limited to one brand of test."),
    W("Screening at 45 is for people with a first-degree relative only", "The 45-year start is for average-risk adults. A relative would be a different, often earlier, pathway."),
  ])

A(58, system="gastrointestinal", weight=8, topic="gi-bleeding-sources", domain="gastrointestinal", diff=3, subject="physiology",
  takeaway="In a hypotensive patient the first hemoglobin overestimates the value that will be seen after fluid, because dilution has not happened yet.",
  citation=ACG,
  scenario="A 52-year-old patient is vomiting blood. Blood pressure is 76/48 mm Hg. Hemoglobin drawn before any fluid is 8.6 g/dL. A classmate says 8.6 will be the stable value after two liters of crystalloid, so the number cannot fall.",
  question="What happens to that hemoglobin after the fluid?",
  correct=W("It falls further as the blood is diluted, so 8.6 is not the stable value",
            "ACG 2021 notes that hypotensive patients were not the stable transfusion trials, and that hemoglobin is lower after fluid even without more bleeding. Treating 8.6 as the number that will persist misreads the physiology the threshold depends on."),
  wrongs=[
    W("It rises, because crystalloid stimulates marrow release of red cells within minutes", "Fluid dilutes the hemoglobin. It does not raise it in minutes."),
    W("It stays 8.6 until the next day no matter how much fluid is given", "Dilution happens as the intravascular volume is restored."),
    W("It becomes unmeasurable after any fluid", "The value changes. It does not become unmeasurable."),
    W("Fluid raises hemoglobin only if the patient is also given a diuretic", "A diuretic is not what changes the early hemoglobin. Volume resuscitation is."),
  ])

A(59, system="reproductive-endocrine", weight=14, topic="preeclampsia-mechanism", domain="reproductive-endocrine", diff=2, subject="pharmacology",
  takeaway="Magnesium prevents seizures. It is not the drug that lowers severe-range blood pressure.",
  citation=ACOG,
  scenario="A 34-year-old patient at 32 weeks has a blood pressure of 170/112 mm Hg that is still 166/110 after 15 minutes. Magnesium has been started. A classmate says the magnesium infusion is the blood-pressure treatment and that no other drug is needed.",
  question="What is magnesium doing, and what lowers the pressure?",
  correct=W("Magnesium is for seizures. Intravenous labetalol or hydralazine lowers the pressure",
            "ACOG assigns magnesium to prevention and treatment of seizures and names intravenous labetalol or hydralazine, or immediate-release nifedipine if there is no line, for persistent severe hypertension. One drug does not do the other job."),
  wrongs=[
    W("Magnesium lowers the pressure, so no second drug is needed", "That swaps the two jobs: magnesium is for seizures, not for lowering the pressure."),
    W("Labetalol prevents seizures, and magnesium is optional", "Labetalol is the pressure drug. Magnesium is the seizure drug."),
    W("Both drugs lower pressure equally, so either one is enough", "They are not interchangeable."),
    W("Neither drug is used before 34 weeks", "Both indications can be present before 34 weeks. Gestational age does not cancel them."),
  ])

A(60, system="gastrointestinal", weight=8, topic="gi-bleeding-sources", domain="gastrointestinal", diff=3, subject="pharmacology",
  takeaway="Fidaxomicin is suggested over a standard vancomycin course because recurrence is less frequent, not because vancomycin is ineffective for the first episode.",
  citation=CDI,
  scenario="A 73-year-old patient has a first episode of toxin-positive diarrhea, a soft abdomen, and a normal creatinine. Fidaxomicin is available. A classmate says the two drugs are identical, so the cheaper vancomycin course is suggested with no tradeoff.",
  question="What is the tradeoff the 2021 update is making?",
  correct=W("Fidaxomicin is suggested because recurrence is less frequent. Vancomycin still treats the episode and remains acceptable if resources are limited",
            "The IDSA/SHEA 2021 update suggests fidaxomicin rather than a standard vancomycin course and says the recommendation values those benefits, while vancomycin remains an acceptable alternative. Calling them identical erases the recurrence difference."),
  wrongs=[
    W("Vancomycin does not treat the first episode at all", "Vancomycin treats the episode. The difference is recurrence, which is why it remains acceptable."),
    W("Fidaxomicin is suggested because it is intravenous and vancomycin is not", "Both relevant regimens are oral. The route is not the difference."),
    W("Metronidazole is suggested for the same recurrence benefit", "Metronidazole is not the suggested drug."),
    W("There is no difference, so either drug is the suggested first choice", "The update does suggest one over a standard course of the other."),
  ])
