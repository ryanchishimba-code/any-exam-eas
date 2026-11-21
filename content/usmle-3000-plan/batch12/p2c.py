"""Step 2 items 21-40."""

from lib import s2

HF = "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure, which remains the current United States heart-failure guideline."
GOLD = "Global Initiative for Chronic Obstructive Lung Disease, GOLD 2026 report."
GINA = "Global Initiative for Asthma, GINA Strategy Report 2025."
ADA = "American Diabetes Association, Standards of Care in Diabetes, 2026, sections 9 and 11."
KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."
ACOG = "ACOG Practice Bulletin No. 222, Gestational Hypertension and Preeclampsia, 2020, the current ACOG bulletin on this topic."

ITEMS = []

ITEMS.append(s2(
    21, system="cardiovascular", weight=9, topic="chf-management", domain="cardiovascular", diff=3, subject="cardiology",
    takeaway="When the ejection fraction was 40 percent or lower and a later measurement is above 40 percent, guideline-directed therapy continues even if symptoms have gone.",
    citation=HF,
    scenario="A 48-year-old patient had an ejection fraction of 25 percent during a heart-failure admission 18 months ago. He now walks without dyspnea. A new echocardiogram shows an ejection fraction of 55 percent. He takes an angiotensin receptor-neprilysin inhibitor, carvedilol, spironolactone, and an SGLT2 inhibitor. A colleague says the recovered number means all four drugs should stop.",
    question="What should happen to the four drugs after the ejection fraction rises to 55 percent?",
    correct=("Continue all four",
             "Previous ejection fraction of 40 percent or lower plus a follow-up value above 40 percent is the improved group. The 2022 guideline says to continue treatment to prevent relapse, including in patients who become asymptomatic."),
    wrongs=[
        ("Stop all four, because an ejection fraction above 50 percent retires the diagnosis",
         "Improvement above 40 percent does not mean therapy can stop. Withdrawal trials showed frequent relapse."),
        ("Stop only the SGLT2 inhibitor, because that class was never meant to continue past symptom relief",
         "Symptom relief is not a stopping rule for one class. The SGLT2 inhibitor is part of the therapy being continued."),
        ("Continue the drugs for 30 days and then stop if the ejection fraction is still above 50 percent",
         "The recommendation is ongoing therapy, not a 30-day taper keyed to a second normal-range number."),
        ("Replace the four drugs with digoxin monotherapy now that the ejection fraction is normal",
         "Digoxin does not replace disease-modifying therapy after the ejection fraction improves."),
    ],
))

ITEMS.append(s2(
    22, system="cardiovascular", weight=9, topic="chf-management", domain="cardiovascular", diff=3, subject="cardiology",
    takeaway="Nondihydropyridine calcium-channel blockers are not recommended in HFrEF because their negative inotropy is harmful.",
    citation=HF,
    scenario="A 67-year-old patient has an ejection fraction of 30 percent and atrial fibrillation with a ventricular rate of 118/min. Blood pressure is 110/70 mm Hg. He already takes an evidence-based beta blocker. A colleague suggests adding diltiazem to slow the rate, arguing that a calcium-channel blocker is safer than raising the beta-blocker dose because the pressure is modest.",
    question="Why is diltiazem the wrong rate-control drug here?",
    correct=("Nondihydropyridine calcium-channel blockers are harmful in HFrEF and should not be used to slow this rate",
             "The 2022 guideline gives diltiazem and verapamil a class 3 recommendation in HFrEF. They depress the myocardium. Rate control has to use a drug this ventricle can tolerate."),
    wrongs=[
        ("Diltiazem is preferred in HFrEF because it raises cardiac output while it slows the rate",
         "Diltiazem is a negative inotrope. It does not raise output in a ventricle with an ejection fraction of 30 percent."),
        ("Any calcium-channel blocker is prohibited, including amlodipine, so blood pressure can never be treated",
         "The harm statement is about nondihydropyridine agents. It is not a ban on a dihydropyridine when blood pressure treatment is needed."),
        ("Diltiazem is safe here because the systolic pressure is above 100 mm Hg",
         "The contraindication is the reduced ejection fraction, not a systolic cutoff of 100 mm Hg."),
        ("Intravenous diltiazem is safe because the oral harm does not apply to the intravenous drug",
         "Negative inotropy is a property of the drug, not of the tablet. The class 3 recommendation covers both routes."),
    ],
))

ITEMS.append(s2(
    23, system="respiratory-renal", weight=8, topic="copd-asthma-exacerbation", domain="respiratory-renal", diff=3, subject="pulmonology",
    takeaway="A moderate or severe COPD exacerbation is treated with systemic corticosteroids for up to 5 days, not a 14-day course.",
    citation=GOLD,
    scenario="A 70-year-old patient with known airflow obstruction has three days of worse dyspnea and a cough that is not producing colored sputum. He speaks in phrases. The respiratory rate is 24/min and oxygen saturation is 90 percent on room air. A chest radiograph shows no infiltrate. He is wheezing and not in respiratory failure. A colleague prescribes prednisone 40 mg daily for 14 days because longer courses were once routine.",
    question="How long should the systemic corticosteroid course last?",
    correct=("Up to 5 days",
             "This flare is more than mild: he is tachypneic and hypoxemic. GOLD 2026 recommends systemic corticosteroids for up to 5 days in a moderate or severe exacerbation. A 14-day course adds harm the current report does not require."),
    wrongs=[
        ("Fourteen days, because a moderate flare needs two full weeks of prednisone",
         "The current duration is up to 5 days. Two weeks is the older habit, not the 2026 recommendation."),
        ("No corticosteroid, because a clear radiograph means the dyspnea is not a flare",
         "A clear radiograph makes pneumonia less likely. It does not exclude an exacerbation, and a moderate flare still gets a short corticosteroid course."),
        ("A 6-week taper, because stopping at 5 days causes rebound in every patient",
         "GOLD 2026 does not require a 6-week taper."),
        ("A single dose of an inhaled corticosteroid in place of any systemic corticosteroid",
         "The exacerbation recommendation is a systemic corticosteroid. An inhaled maintenance drug is a separate decision."),
    ],
))

ITEMS.append(s2(
    24, system="respiratory-renal", weight=8, topic="copd-asthma-exacerbation", domain="respiratory-renal", diff=3, subject="pulmonology",
    takeaway="Antibiotics for a COPD exacerbation are for purulent sputum, a prior pattern of lung infection, or a need for ventilatory support. Increased dyspnea alone does not earn them.",
    citation=GOLD,
    scenario="A 69-year-old patient with known COPD has had increased dyspnea for two days. The sputum is scant, white, and unchanged from his usual morning cough. He is not in respiratory failure and has never needed ventilatory support. Temperature is 37.0 C. The chest radiograph shows no infiltrate. A colleague adds five days of antibiotics because any increase in dyspnea is treated as bacterial.",
    question="Why is an antibiotic the wrong addition?",
    correct=("The sputum is not purulent, he is not being ventilated, and the history does not supply the infection pattern antibiotics require",
             "GOLD 2026 reserves antibiotics for purulent sputum, a qualifying infection history, or ventilatory support. Bronchodilators and a short corticosteroid course treat this moderate exacerbation."),
    wrongs=[
        ("Increased dyspnea by itself is the indication for five days of antibiotics",
         "Dyspnea alone is not on the antibiotic list. Purulence, the infection history, or ventilatory support is."),
        ("Antibiotics are withheld only when the temperature is above 38.5 C",
         "Fever is not the switching rule. A normal temperature does not create an antibiotic indication."),
        ("A clear chest radiograph is an indication for antibiotics, because bronchitis is then certain",
         "A clear radiograph argues against pneumonia. It does not by itself indicate an antibiotic."),
        ("Antibiotics replace the corticosteroid when the sputum is white",
         "White sputum is a reason to skip the antibiotic, not a reason to skip the corticosteroid."),
    ],
))

ITEMS.append(s2(
    25, system="respiratory-renal", weight=8, topic="copd-asthma-exacerbation", domain="respiratory-renal", diff=3, subject="pulmonology",
    takeaway="After a COPD exacerbation, an elevated eosinophil count is a reason to add an inhaled corticosteroid to dual bronchodilators. A long-acting beta agonist plus an inhaled corticosteroid, without a muscarinic antagonist, is not the preferred start when there is no asthma.",
    citation=GOLD,
    scenario="A 71-year-old patient is leaving the hospital after a moderate COPD exacerbation that required corticosteroids. He will go home on no maintenance inhaler. The blood eosinophil count was 350 cells per microliter. He has no history of asthma. A colleague prescribes a long-acting beta agonist combined only with an inhaled corticosteroid.",
    question="Which maintenance inhaler matches the eosinophil count and the recent exacerbation?",
    correct=("Dual long-acting bronchodilators plus an inhaled corticosteroid",
             "GOLD 2026 says that when an inhaled corticosteroid is indicated, triple therapy is preferred over a long-acting beta agonist plus corticosteroid alone. The exacerbation and the eosinophil count are why the corticosteroid is included. He has no asthma, so the two-drug corticosteroid pair is the regimen the report discourages."),
    wrongs=[
        ("A long-acting beta agonist plus an inhaled corticosteroid, without a muscarinic antagonist",
         "That pair is discouraged in COPD without asthma because it prevents exacerbations less well than triple therapy."),
        ("A short-acting bronchodilator only, because maintenance inhalers start only after a second hospitalization",
         "Maintenance long-acting bronchodilators should start as soon as possible after an exacerbation."),
        ("Theophylline monotherapy, because an eosinophil count above 300 is its indication",
         "Methylxanthines are not recommended. The eosinophil count points toward an inhaled corticosteroid on top of dual bronchodilation."),
        ("Oral prednisone for 30 days as the maintenance anti-inflammatory drug",
         "The systemic course for the exacerbation is up to 5 days. It is not a 30-day maintenance plan."),
    ],
))

ITEMS.append(s2(
    26, system="respiratory-renal", weight=8, topic="copd-asthma-exacerbation", domain="respiratory-renal", diff=3, subject="pulmonology",
    takeaway="GINA prefers as-needed low-dose ICS-formoterol for infrequent asthma symptoms. A short-acting beta agonist alone leaves airway inflammation untreated.",
    citation=GINA,
    scenario="A 24-year-old patient has wheeze and chest tightness on two days in a usual week, with no night waking. Spirometry improves after a bronchodilator. He uses an albuterol inhaler and asks for a refill. He has never used an inhaled corticosteroid. A colleague refills albuterol alone because symptoms twice a week do not justify an anti-inflammatory drug.",
    question="Which reliever matches symptoms on two days a week?",
    correct=("As-needed low-dose ICS-formoterol",
             "GINA 2025 keeps Track 1, low-dose ICS-formoterol as needed, as the preferred treatment when symptoms are this infrequent. Short-acting beta-agonist-only treatment raises the risk of severe exacerbations because it does not treat inflammation."),
    wrongs=[
        ("Albuterol alone, because symptoms twice a week are too mild for an inhaled corticosteroid",
         "The preferred reliever still contains an inhaled corticosteroid. Mild symptoms are not a reason for a beta agonist alone."),
        ("Daily high-dose ICS-formoterol maintenance and no as-needed doses",
         "Daily medium-dose maintenance is a higher step, for daily symptoms, frequent night waking, or a recent exacerbation."),
        ("A 5-day course of oral prednisone every month, with no inhaler",
         "Scheduled oral corticosteroid courses are not the treatment for mild symptoms."),
        ("A long-acting muscarinic antagonist alone",
         "That drug is not the preferred GINA reliever at this step."),
    ],
))

ITEMS.append(s2(
    27, system="respiratory-renal", weight=8, topic="copd-asthma-exacerbation", domain="respiratory-renal", diff=3, subject="pulmonology",
    takeaway="When asthma symptoms occur most days, GINA Track 1 uses daily low-dose ICS-formoterol as both maintenance and reliever.",
    citation=GINA,
    scenario="A 31-year-old patient wheezes most days and wakes with chest tightness once or twice a week. FEV1 is below predicted. He uses albuterol several times a day and has not had an emergency visit. ICS-formoterol is on the formulary. A colleague continues the albuterol and adds a leukotriene blocker as the only controller.",
    question="Which inhaler plan matches symptoms on most days?",
    correct=("Daily low-dose ICS-formoterol, with the same inhaler used for symptom relief",
             "GINA 2025 Track 1 uses daily low-dose ICS-formoterol as maintenance-and-reliever therapy at this step. One inhaler treats inflammation and relieves symptoms, and it reduces severe exacerbations compared with short-acting beta-agonist regimens."),
    wrongs=[
        ("Continue albuterol as the only inhaler and add a leukotriene blocker",
         "A leukotriene blocker is not the preferred controller, and albuterol-only reliever use is what GINA is trying to stop."),
        ("As-needed albuterol plus a 10-day prednisone burst every month",
         "Repeated oral corticosteroid bursts are not the preferred step."),
        ("Daily medium-dose ICS-formoterol as the first prescription, skipping the low-dose step",
         "Medium-dose therapy is the next step, for worse symptoms or a recent exacerbation that has not responded. This pattern matches the low-dose maintenance step."),
        ("Stop all inhalers and follow peak flow once a year",
         "Symptoms most days and a reduced FEV1 are not a reason to stop treatment."),
    ],
))

ITEMS.append(s2(
    28, system="reproductive-endocrine", weight=14, topic="diabetes-pathophysiology", domain="reproductive-endocrine", diff=3, subject="endocrinology",
    takeaway="Metformin is not started when eGFR is below 45, even if it is still above 30. At an eGFR of at least 20, an SGLT2 inhibitor is still recommended for type 2 diabetes with CKD.",
    citation=ADA,
    scenario="A 68-year-old patient has type 2 diabetes, an A1c of 8.0 percent, and no glucose-lowering drug. The estimated filtration rate is 38 mL/min/1.73 m2 and the urine albumin-to-creatinine ratio is 280 mg/g. Blood pressure is treated with an ACE inhibitor. A colleague starts metformin because the filtration rate is still above 30.",
    question="Why is a new metformin prescription the wrong first drug at this filtration rate?",
    correct=("Do not start metformin at an eGFR of 38. An SGLT2 inhibitor is indicated and can be started because the eGFR is still at least 20",
             "ADA 2026 says metformin should not be initiated below an eGFR of 45 and is contraindicated below 30. An SGLT2 inhibitor is recommended for type 2 diabetes with CKD when eGFR is at least 20, for kidney and cardiovascular benefit, irrespective of A1c."),
    wrongs=[
        ("Metformin may be started at any filtration rate above 30, so 38 is an acceptable start",
         "Above 30 only avoids the contraindication. The do-not-start line is 45, and 38 is below it."),
        ("Start metformin and stop the ACE inhibitor, because the two cannot be combined",
         "An ACE inhibitor is appropriate for diabetes with albuminuria. The problem is the new metformin start."),
        ("Use a sulfonylurea as the preferred kidney-protective drug",
         "A sulfonylurea does not carry the kidney-outcome indication and raises hypoglycemia risk when filtration is reduced."),
        ("Withhold every glucose-lowering drug until the filtration rate falls below 15",
         "An eGFR of 38 with albuminuria is a reason to start kidney-protective therapy, not a reason to wait for kidney failure."),
    ],
))

ITEMS.append(s2(
    29, system="reproductive-endocrine", weight=14, topic="diabetes-pathophysiology", domain="reproductive-endocrine", diff=3, subject="endocrinology",
    takeaway="When eGFR is below 30, a GLP-1 receptor agonist is preferred for glucose lowering. Metformin is contraindicated at that level.",
    citation=ADA,
    scenario="A 72-year-old patient has type 2 diabetes and an A1c of 8.4 percent. The estimated filtration rate is 24 mL/min/1.73 m2 and the urine albumin-to-creatinine ratio is 420 mg/g. He is not on dialysis and takes no glucose-lowering drug. A colleague wants metformin plus a DPP-4 inhibitor as the kidney-safe pair.",
    question="Which glucose-lowering choice fits an eGFR of 24?",
    correct=("A GLP-1 receptor agonist, which is preferred for glucose lowering below an eGFR of 30",
             "ADA 2026 prefers a GLP-1 receptor agonist when eGFR is below 30 because hypoglycemia risk is lower and cardiovascular events fall. Metformin is contraindicated below 30. An SGLT2 inhibitor may still be used for kidney protection down to an eGFR of 20, but it is not the preferred glucose drug here."),
    wrongs=[
        ("Metformin plus a DPP-4 inhibitor",
         "Metformin is contraindicated below an eGFR of 30, and a DPP-4 inhibitor does not provide the kidney and cardiovascular risk reduction assigned to a GLP-1 receptor agonist."),
        ("A sulfonylurea, because low filtration makes hypoglycemia less likely",
         "Low filtration increases sulfonylurea exposure and hypoglycemia. It is the opposite of a safer choice."),
        ("No glucose-lowering drug is allowed below an eGFR of 30",
         "GLP-1 receptor agonists that do not depend on kidney clearance can be used. The prohibition is not absolute."),
        ("Pioglitazone is required before any other class can be considered",
         "Pioglitazone is discussed for steatohepatitis, not as a required first drug at an eGFR of 24. Fluid retention also makes it a poor default."),
    ],
))

ITEMS.append(s2(
    30, system="reproductive-endocrine", weight=14, topic="diabetes-pathophysiology", domain="reproductive-endocrine", diff=2, subject="endocrinology",
    takeaway="A DPP-4 inhibitor is stopped when a GLP-1 receptor agonist is started. The combination does not lower glucose further.",
    citation=ADA,
    scenario="A 57-year-old patient with type 2 diabetes has an A1c of 8.1 percent on metformin and a DPP-4 inhibitor. He has atherosclerotic disease and a body-mass index of 34. A GLP-1 receptor agonist with a cardiovascular outcome benefit is available. A colleague says to add it and keep the DPP-4 inhibitor, because two incretin drugs should lower glucose more than one.",
    question="What should happen to the DPP-4 inhibitor if the GLP-1 receptor agonist is started?",
    correct=("Stop the DPP-4 inhibitor when the GLP-1 receptor agonist is started",
             "ADA 2026 recommends against using a DPP-4 inhibitor with a GLP-1 receptor agonist because glucose does not fall further than with GLP-1 therapy alone. The cardiovascular reason to use the GLP-1 drug is intact."),
    wrongs=[
        ("Keep the DPP-4 inhibitor, because the two classes lower glucose by different final pathways",
         "Both act through the incretin pathway. The standards say the combination adds no further glucose lowering."),
        ("Double the DPP-4 dose instead of starting the GLP-1 receptor agonist",
         "A higher DPP-4 dose does not supply the cardiovascular outcome benefit that led to the GLP-1 drug."),
        ("Stop metformin and keep both incretin drugs",
         "Metformin can continue. The pair to separate is the DPP-4 inhibitor and the GLP-1 receptor agonist."),
        ("Add the GLP-1 receptor agonist only after the DPP-4 inhibitor is switched to a sulfonylurea",
         "A sulfonylurea is not a required bridge. The change is to remove the DPP-4 inhibitor."),
    ],
))
