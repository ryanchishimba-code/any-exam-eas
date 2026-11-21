"""Step 2 items 41-70. Renal finish, neuro, psych, respiratory, a little CV."""

from lib import item

UTI = "IDSA 2011 guidelines for uncomplicated cystitis and pyelonephritis in women, which remain the IDSA guidance."
STROKE = "2019 AHA/ASA Guidelines for the Early Management of Acute Ischemic Stroke, which remain the AHA/ASA source for the blood-pressure limit before thrombolysis and for antiplatelet timing."
AES = "American Epilepsy Society guideline for convulsive status epilepticus, 2016."
PTSD = "VA/DoD Clinical Practice Guideline for Posttraumatic Stress Disorder, 2023."
MDD = "VA/DoD Clinical Practice Guideline for Major Depressive Disorder, 2022."
SCZ = "APA Practice Guideline for the Treatment of Patients With Schizophrenia, 2020."
AUD = "APA Practice Guideline for the Pharmacological Treatment of Patients With Alcohol Use Disorder, 2018."
AWS = "ASAM Clinical Practice Guideline on Alcohol Withdrawal Management, 2020."
OUD = "ASAM National Practice Guideline for the Treatment of Opioid Use Disorder, 2020."
CAP = "ATS/IDSA 2019 guideline on community-acquired pneumonia in adults."
BRON = "CDC antibiotic use guidance: antibiotics are not indicated for uncomplicated acute bronchitis in otherwise healthy adults."
GINA = "Global Initiative for Asthma, GINA Strategy Report 2025."
AF = "2023 ACC/AHA/ACCP/HRS Guideline for the Diagnosis and Management of Atrial Fibrillation."
VALVE = "2020 ACC/AHA Guideline for the Management of Patients With Valvular Heart Disease."
NITR = "FDA prescribing information for nitroglycerin: phosphodiesterase-5 inhibitors are contraindicated with nitrates."
BIP = "CANMAT and ISBD 2018 guidelines for the management of patients with bipolar disorder."

def W(a, b):
    return (a, b)

def Q(n, **k):
    return item(n, "step2", **k)

ITEMS = []

ITEMS.append(Q(41, sex="f", system="respiratory-renal", weight=13, topic="pyelonephritis", diff=3, subject="infectious-disease",
  takeaway="Pyelonephritis is not treated with nitrofurantoin. That drug does not reach reliable kidney levels.",
  citation=UTI,
  scenario="A 30-year-old woman has fever of 38.9 C, flank pain, and vomiting. Her pulse is 110/min and her blood pressure is 118/70 mm Hg. Urinalysis shows leukocytes. A colleague prescribes nitrofurantoin for 5 days because that is the cystitis drug.",
  question="Why is nitrofurantoin the wrong drug for this kidney infection?",
  correct=W("A drug that reaches kidney tissue, not nitrofurantoin",
            "Pyelonephritis is not treated with nitrofurantoin. That drug does not reach reliable kidney levels. Fever, flank pain, and vomiting are not cystitis. The 5-day nitrofurantoin course is the bladder regimen."),
  wrongs=[
    W("Nitrofurantoin is preferred once the kidney is involved", "Kidney involvement is the reason to stop using it."),
    W("No antibiotic until a culture grows for 72 hours", "She is febrile and vomiting. Treatment is not delayed three days."),
    W("Amphotericin as the first drug", "This is a bacterial pyelonephritis pattern, not a fungal one."),
    W("A single dose of fosfomycin", "Single-dose fosfomycin is a cystitis option, not treatment of a febrile kidney infection."),
  ]))

ITEMS.append(Q(42, sex="m", system="behavioral-nervous", weight=12, topic="ischemic-stroke", diff=3, subject="neurology",
  takeaway="Thrombolysis is not given until blood pressure is below 185/110 mm Hg. A pressure of 200/120 has to come down first.",
  citation=STROKE,
  scenario="A 66-year-old man was last known well 90 minutes ago. He has aphasia and a right-arm drift. CT shows no hemorrhage. Blood pressure is 200/120 mm Hg. A colleague draws up alteplase and says the clock matters more than the pressure.",
  question="What has to happen to the pressure before alteplase?",
  correct=W("Lower it below 185/110 mm Hg first. Do not give the drug at 200/120",
            "Thrombolysis is not given until blood pressure is below 185/110 mm Hg. A pressure of 200/120 has to come down first. Ninety minutes is still inside the window, so the pressure is treated and the drug is not given at this number."),
  wrongs=[
    W("Give alteplase now. The window overrides any pressure", "The pressure limit is a condition of giving the drug, not a detail the clock erases."),
    W("Lower the pressure below 120/70 and then wait until the next day", "The target before treatment is below 185/110, not below 120, and the window should not be spent waiting until tomorrow."),
    W("Start heparin instead, because the pressure is high", "Heparin is not the substitute for a patient who may still receive thrombolysis."),
    W("No treatment of pressure or clot because 90 minutes is too late", "Ninety minutes is early. The barrier is the pressure, not the clock."),
  ]))

ITEMS.append(Q(43, sex="f", system="behavioral-nervous", weight=12, topic="ischemic-stroke", diff=3, subject="neurology",
  takeaway="Aspirin is given after ischemic stroke, but not within 24 hours of thrombolysis.",
  citation=STROKE,
  scenario="A 71-year-old woman received alteplase two hours ago for an ischemic stroke. She is stable. A colleague orders aspirin 325 mg now and says every stroke gets aspirin in the first hour regardless of thrombolysis.",
  question="When can aspirin be given?",
  correct=W("After 24 hours from the alteplase, not at the two-hour mark",
            "Aspirin is given after ischemic stroke, but not within 24 hours of thrombolysis. Two hours is inside that exclusion. Giving it now adds bleeding without a guideline indication."),
  wrongs=[
    W("Immediately, because thrombolysis does not change antiplatelet timing", "Thrombolysis is exactly what delays aspirin for 24 hours."),
    W("Never, because a stroke patient cannot take aspirin at any later time", "Aspirin is used after the 24-hour window. It is not banned forever."),
    W("Heparin infusion starting now, with aspirin", "Routine anticoagulation is not the acute treatment, and aspirin is still too early."),
    W("Aspirin only if a second CT shows hemorrhage", "Hemorrhage would be a reason to avoid aspirin. A stable patient still waits 24 hours, then gets aspirin if imaging allows."),
  ]))

ITEMS.append(Q(44, sex="m", system="behavioral-nervous", weight=12, topic="status-epilepticus", diff=3, subject="neurology",
  takeaway="Convulsive status epilepticus is treated first with a benzodiazepine, not with phenytoin as the opening drug.",
  citation=AES,
  scenario="A 23-year-old man has been convulsing for 6 minutes. He is still seizing. Glucose is 110 mg/dL and the airway is supported. A colleague skips a benzodiazepine and loads phenytoin because a longer-acting drug should come first.",
  question="Which drug is given first?",
  correct=W("A benzodiazepine, such as intravenous lorazepam or intramuscular midazolam",
            "Convulsive status epilepticus is treated first with a benzodiazepine, not with phenytoin as the opening drug. Six minutes of convulsions is already status. The benzodiazepine is the emergent drug. A longer-acting antiseizure drug comes if seizures continue."),
  wrongs=[
    W("Phenytoin first, with no benzodiazepine", "Phenytoin is not the emergent first drug."),
    W("Oral carbamazepine tablets while he is convulsing", "An oral tablet is not an emergent route."),
    W("Observation until the seizure reaches 30 minutes", "Treatment starts at about 5 minutes, not at 30."),
    W("Antibiotics before any antiseizure drug", "There is no finding that makes infection the first drug."),
  ]))

ITEMS.append(Q(45, sex="f", system="behavioral-nervous", weight=12, topic="ptsd", diff=2, subject="psychiatry",
  takeaway="Benzodiazepines are not used for posttraumatic stress disorder. Trauma-focused psychotherapy is the preferred treatment.",
  citation=PTSD,
  scenario="A 35-year-old woman has nightmares, avoidance, and hyperarousal three months after an assault. She is not in alcohol withdrawal. A colleague starts diazepam daily and says psychotherapy can wait until the benzodiazepine fails.",
  question="Why is daily diazepam the wrong treatment?",
  correct=W("Benzodiazepines are recommended against. Trauma-focused psychotherapy is the preferred treatment",
            "Benzodiazepines are not used for posttraumatic stress disorder. Trauma-focused psychotherapy is the preferred treatment. She is not withdrawing from alcohol, so a benzodiazepine is not filling some other indication. An SSRI can be discussed. Diazepam is not the plan."),
  wrongs=[
    W("Diazepam is first-line because nightmares are a sleep disorder only", "Nightmares in this pattern are part of the stress disorder, not a reason for a benzodiazepine."),
    W("No treatment until symptoms have lasted two years", "Three months is already long enough to treat."),
    W("An antipsychotic as the required first drug", "An antipsychotic is not the preferred first treatment."),
    W("Daily alcohol as a safer substitute for diazepam", "Alcohol is not a treatment for this disorder."),
  ]))

ITEMS.append(Q(46, sex="m", system="behavioral-nervous", weight=12, topic="depression", diff=2, subject="psychiatry",
  takeaway="Major depression is treated with psychotherapy or an antidepressant such as an SSRI. A benzodiazepine is not the antidepressant.",
  citation=MDD,
  scenario="A 42-year-old man has had low mood, poor sleep, and loss of interest for six weeks. He is not manic and not withdrawing from alcohol. A colleague prescribes alprazolam three times a day and no antidepressant.",
  question="Why does alprazolam miss the diagnosis?",
  correct=W("It is not an antidepressant. Depression is treated with psychotherapy or an antidepressant",
            "Major depression is treated with psychotherapy or an antidepressant such as an SSRI. A benzodiazepine is not the antidepressant. Six weeks of low mood and anhedonia is a depressive episode. Alprazolam does not treat that illness."),
  wrongs=[
    W("Alprazolam is the preferred antidepressant", "It is a benzodiazepine, not an antidepressant."),
    W("No treatment until symptoms last a year", "Six weeks is enough to treat."),
    W("Lithium monotherapy as the required first drug for every low mood", "Lithium is not the first drug of ordinary unipolar depression."),
    W("Two antidepressants plus a benzodiazepine on day 1", "Starting two antidepressants and a benzodiazepine together is not the initial plan."),
  ]))

ITEMS.append(Q(47, sex="f", system="behavioral-nervous", weight=12, topic="bipolar", diff=3, subject="psychiatry",
  takeaway="Bipolar depression is not treated with antidepressant monotherapy. A mood stabilizer or an approved bipolar regimen is used.",
  citation=BIP,
  scenario="A 29-year-old woman has bipolar I disorder and is now depressed. She is not manic today. A colleague starts sertraline alone and stops her mood stabilizer, saying depression is always treated with an antidepressant by itself.",
  question="Why is sertraline alone the wrong change?",
  correct=W("Antidepressant monotherapy can destabilize bipolar illness. Keep a mood stabilizer in the regimen",
            "Bipolar depression is not treated with antidepressant monotherapy. A mood stabilizer or an approved bipolar regimen is used. Stopping the mood stabilizer and leaving sertraline alone is the error."),
  wrongs=[
    W("Sertraline alone is the standard bipolar depression regimen", "Monotherapy with an antidepressant is what the guidelines advise against."),
    W("Stop every drug until the next mania", "Depression is treated. Waiting for mania is not the plan."),
    W("Add two antidepressants and no mood stabilizer", "More antidepressant monotherapy is still the wrong structure."),
    W("Daily diazepam as the mood stabilizer", "A benzodiazepine is not a mood stabilizer."),
  ]))

ITEMS.append(Q(48, sex="m", system="behavioral-nervous", weight=12, topic="schizophrenia", diff=2, subject="psychiatry",
  takeaway="Schizophrenia is started on one antipsychotic. Two antipsychotics are not begun together.",
  citation=SCZ,
  scenario="A 24-year-old man has a first episode of psychosis. He has hallucinations and disorganization for six weeks. Medical causes have been excluded. A colleague starts haloperidol and olanzapine together on day 1.",
  question="How many antipsychotics are started?",
  correct=W("One. A second antipsychotic is not added at the start",
            "Schizophrenia is started on one antipsychotic. Two antipsychotics are not begun together. He needs treatment, and the treatment is monotherapy. A second drug is not the way to make the first day stronger."),
  wrongs=[
    W("Two, because a first episode needs dual therapy", "The guideline recommends against starting two."),
    W("None, until he has been psychotic for a year", "Six weeks of psychosis is treated."),
    W("A benzodiazepine only, with no antipsychotic", "A benzodiazepine does not treat the psychotic illness."),
    W("Clozapine as the required first drug before any other antipsychotic", "Clozapine is reserved for treatment resistance, not the first prescription."),
  ]))

ITEMS.append(Q(49, sex="m", system="behavioral-nervous", weight=12, topic="alcohol-use", diff=3, subject="psychiatry",
  takeaway="Naltrexone helps alcohol use disorder only when the patient is not taking an opioid. An opioid use history that is current makes naltrexone the wrong drug.",
  citation=AUD,
  scenario="A 48-year-old man wants help stopping alcohol. He takes methadone for opioid use disorder and is not in alcohol withdrawal today. His liver enzymes are twice normal. A colleague prescribes naltrexone and says methadone does not interact with it.",
  question="Why is naltrexone unsafe with his methadone?",
  correct=W("Naltrexone blocks opioid receptors and can precipitate withdrawal from methadone",
            "Naltrexone helps alcohol use disorder only when the patient is not taking an opioid. An opioid use history that is current makes naltrexone the wrong drug. He is on methadone. Acamprosate can be discussed. Naltrexone cannot."),
  wrongs=[
    W("Naltrexone is required precisely because he takes methadone", "Methadone is the contraindication, not the indication."),
    W("Naltrexone treats alcohol withdrawal tremors", "He is not in withdrawal, and naltrexone is not the withdrawal drug."),
    W("Disulfiram is mandatory before any other drug can be considered", "Disulfiram is not a required first step."),
    W("No medication exists for alcohol use disorder", "Effective medications exist. This one is simply the wrong choice on methadone."),
  ]))

ITEMS.append(Q(50, sex="f", system="behavioral-nervous", weight=12, topic="alcohol-withdrawal", diff=3, subject="psychiatry",
  takeaway="Alcohol withdrawal is treated with a benzodiazepine. An antipsychotic is not the withdrawal drug.",
  citation=AWS,
  scenario="A 52-year-old woman stopped drinking 18 hours ago. She is tremulous, her pulse is 120/min, and her blood pressure is 160/96 mm Hg. She is oriented and not seizing. A colleague orders haloperidol and no benzodiazepine.",
  question="Which drug treats this withdrawal?",
  correct=W("A benzodiazepine, titrated to the signs, not haloperidol as the withdrawal treatment",
            "Alcohol withdrawal is treated with a benzodiazepine. An antipsychotic is not the withdrawal drug. Her pulse and tremor are withdrawal. Haloperidol can lower the seizure threshold and does not replace the benzodiazepine."),
  wrongs=[
    W("Haloperidol alone", "An antipsychotic does not treat the withdrawal syndrome."),
    W("Naltrexone as the acute withdrawal drug", "Naltrexone is for relapse prevention, not for acute autonomic withdrawal."),
    W("No drug until a seizure occurs", "Tremor and a pulse of 120 are already enough to treat."),
    W("A beta blocker as the only drug", "A beta blocker can mask signs. It is not the primary withdrawal treatment."),
  ]))
