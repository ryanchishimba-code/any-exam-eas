"""Behavioral health and nervous system items."""
from itemutil import item

BELL = "https://pmc.ncbi.nlm.nih.gov/articles/PMC9332917/"
CLUSTER = "https://pmc.ncbi.nlm.nih.gov/articles/PMC9163947/"
AWS = "https://pmc.ncbi.nlm.nih.gov/articles/PMC9567585/"
MDD = "https://pmc.ncbi.nlm.nih.gov/articles/PMC4994790/"
DEL = "https://pmc.ncbi.nlm.nih.gov/articles/PMC5706782/"
IIH = "https://pmc.ncbi.nlm.nih.gov/articles/PMC5013119/"
DEP = "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"
SAH = "https://pmc.ncbi.nlm.nih.gov/articles/PMC3138338/"
POINT = "https://pmc.ncbi.nlm.nih.gov/articles/PMC6193486/"
PD = "https://pmc.ncbi.nlm.nih.gov/articles/PMC6916382/"
MG = "https://pmc.ncbi.nlm.nih.gov/articles/PMC7884987/"
MEN = "https://pmc.ncbi.nlm.nih.gov/articles/PMC7015757/"

ITEMS = []

def add(**kwargs):
    ITEMS.append(item(**kwargs))

add(
    slug="n01-bell-steroid",
    domain="behavioral-nervous",
    subject="neurology",
    topic="gap3-bell-palsy-prednisone",
    task="pharmacotherapy",
    difficulty=2,
    band="easy",
    scenario="A 36-year-old woman woke with left facial weakness 18 hours ago. She cannot raise the eyebrow or close the eye, and taste is dull. The forehead is involved. Hearing is intact and there is no rash. Blood pressure is 122/74 mm Hg and pulse is 76/min. Glucose is 94 mg/dL. The rest of the neurologic examination is normal.",
    question="Which of the following is the most appropriate treatment?",
    options=[
        "Oral prednisone started today",
        "Acyclovir without a corticosteroid",
        "Aspirin for presumed stroke",
        "Observation for two weeks",
    ],
    correct="Oral prednisone started today",
    why="this is Bell palsy within 48 hours of onset. A current review states that patients should receive corticosteroids within 48 hours regardless of severity.",
    wrongs={
        "Acyclovir without a corticosteroid": "an antiviral drug without a corticosteroid is not the evidence-based first treatment.",
        "Aspirin for presumed stroke": "forehead involvement means a peripheral facial nerve, not a central stroke.",
        "Observation for two weeks": "the benefit of corticosteroids is time-limited to the first 48 hours.",
    },
    principle="Bell palsy is treated with corticosteroids when the patient is seen within 48 hours of onset.",
    label="Bell palsy. CMAJ.",
    url=BELL,
    citation="Bell palsy review: corticosteroids within 48 hours of onset, regardless of severity",
)

add(
    slug="n02-cluster-oxygen",
    domain="behavioral-nervous",
    subject="neurology",
    topic="gap3-cluster-oxygen",
    task="pharmacotherapy",
    difficulty=2,
    band="easy",
    scenario="A 34-year-old man has nightly attacks of severe right orbital pain lasting 40 minutes, with tearing and nasal congestion on that side. He paces during attacks. Blood pressure is 138/84 mm Hg and pulse is 92/min between attacks. Neurologic examination is normal. He has had a similar bout each spring for 3 years.",
    question="Which of the following is the most appropriate acute treatment of an attack?",
    options=[
        "High-flow oxygen by non-rebreather mask",
        "Oral amoxicillin for sinusitis",
        "Oral allopurinol during the attack",
        "Intravenous heparin for suspected dissection",
    ],
    correct="High-flow oxygen by non-rebreather mask",
    why="strictly unilateral short attacks with cranial autonomic features are cluster headache. A review of oxygen therapy states that 100 percent oxygen at 6 to 12 L/min by non-rebreather mask is one of the most effective acute treatments.",
    wrongs={
        "Oral amoxicillin for sinusitis": "seasonal nocturnal attacks with restlessness are not bacterial sinusitis.",
        "Oral allopurinol during the attack": "allopurinol has no role in cluster headache.",
        "Intravenous heparin for suspected dissection": "the examination is normal and the history is a stereotyped primary headache, not arterial dissection.",
    },
    principle="Acute cluster headache is treated with high-flow oxygen through a non-rebreather mask.",
    label="Oxygen therapy in cluster headache, migraine, and other headache disorders.",
    url=CLUSTER,
    citation="Cluster headache review: 100% oxygen at 6–12 L/min by non-rebreather mask",
)

add(
    slug="n03-aws-lorazepam",
    domain="behavioral-nervous",
    subject="psychiatry",
    topic="gap3-alcohol-withdrawal-seizure",
    task="pharmacotherapy",
    difficulty=2,
    band="easy",
    scenario="A 48-year-old man with daily heavy alcohol use had a generalized seizure 2 days after his last drink. He is now awake, tremulous, and tachycardic. Blood pressure is 162/96 mm Hg and pulse is 120/min. Glucose is 108 mg/dL and sodium is 138 mEq/L. There is no focal weakness. He has not received a benzodiazepine.",
    question="Which of the following is the most appropriate immediate medicine?",
    options=[
        "Intravenous lorazepam",
        "Intravenous haloperidol",
        "Oral phenytoin loading",
        "Oral propranolol as sole therapy",
    ],
    correct="Intravenous lorazepam",
    why="a review of seizures in alcohol withdrawal states that intravenous fast-acting benzodiazepines, including lorazepam and diazepam, are first-line treatment.",
    wrongs={
        "Intravenous haloperidol": "an antipsychotic does not treat alcohol-withdrawal seizures and can lower the seizure threshold.",
        "Oral phenytoin loading": "phenytoin is not the treatment of alcohol-withdrawal seizures.",
        "Oral propranolol as sole therapy": "a beta blocker may slow the heart rate but does not stop withdrawal seizures.",
    },
    principle="Alcohol-withdrawal seizures are treated with a parenteral benzodiazepine.",
    label="Seizures and alcohol withdrawal: a literature review.",
    url=AWS,
    citation="Alcohol-withdrawal seizure review: intravenous lorazepam or diazepam is first-line",
)

add(
    slug="n04-mdd-ssri",
    domain="behavioral-nervous",
    subject="psychiatry",
    topic="gap3-mdd-ssri",
    task="pharmacotherapy",
    difficulty=3,
    band="medium",
    scenario="A 42-year-old woman has had low mood, poor sleep, poor appetite, and loss of interest for 6 weeks. She still goes to work. She has no mania, psychosis, or suicidal plan. Blood pressure is 118/74 mm Hg and pulse is 76/min. TSH is 2.1 mIU/L and hemoglobin is 13.4 g/dL. She wants medication.",
    question="Which of the following is the most appropriate initial medicine?",
    options=[
        "Sertraline, a second-generation antidepressant",
        "Haloperidol at a low nightly dose",
        "Lithium as the first mood drug",
        "Phenelzine as the first antidepressant",
    ],
    correct="Sertraline, a second-generation antidepressant",
    why="this is a first episode of moderate major depression without psychosis. CANMAT 2016 focuses initial pharmacologic recommendations on second-generation antidepressants.",
    wrongs={
        "Haloperidol at a low nightly dose": "an antipsychotic is not first-line treatment of nonpsychotic depression.",
        "Lithium as the first mood drug": "lithium is not the initial antidepressant for a first episode of unipolar depression.",
        "Phenelzine as the first antidepressant": "a monoamine oxidase inhibitor is not a first-line second-generation antidepressant.",
    },
    principle="Initial medication for moderate major depression is a second-generation antidepressant.",
    label="CANMAT 2016 clinical guidelines for the management of adults with major depressive disorder.",
    url=MDD,
    citation="CANMAT 2016: initial pharmacotherapy of major depression centers on second-generation antidepressants",
)

add(
    slug="n05-delirium-nonpharm",
    domain="behavioral-nervous",
    subject="neurology",
    topic="gap3-delirium-nonpharmacologic",
    task="clinical-intervention",
    difficulty=3,
    band="medium",
    scenario="An 82-year-old man is confused on hospital day 2 after hip repair. He is sleepy by day and awake at night, but he is not violent. Oxygen saturation is 96% on room air. Blood pressure is 132/74 mm Hg and pulse is 84/min. Sodium is 136 mEq/L and glucose is 142 mg/dL. A urinalysis is being sent. He has no alcohol history.",
    question="Which of the following is the most appropriate initial management?",
    options=[
        "A nonpharmacologic sleep and reorientation plan",
        "Scheduled lorazepam for the confusion",
        "Nightly diphenhydramine for sleep",
        "Donepezil started for new dementia",
    ],
    correct="A nonpharmacologic sleep and reorientation plan",
    why="this is hypoactive delirium. A review of delirium in hospitalized older adults recommends a nonpharmacologic sleep protocol and avoiding sedatives, while the medical precipitant is sought.",
    wrongs={
        "Scheduled lorazepam for the confusion": "benzodiazepines worsen delirium except in specific withdrawal states, which he does not have.",
        "Nightly diphenhydramine for sleep": "an anticholinergic sedative aggravates confusion in older adults.",
        "Donepezil started for new dementia": "a cholinesterase inhibitor does not treat acute delirium and the time course is days, not dementia.",
    },
    principle="Delirium in older adults is managed first with nonpharmacologic measures and treatment of the cause, not with sedatives.",
    label="Marcantonio ER. Delirium in hospitalized older adults. N Engl J Med.",
    url=DEL,
    citation="Delirium review: nonpharmacologic sleep protocol and avoidance of sedatives",
)

add(
    slug="n06-iih-acetazolamide",
    domain="behavioral-nervous",
    subject="neurology",
    topic="gap3-iih-acetazolamide",
    task="pharmacotherapy",
    difficulty=3,
    band="medium",
    scenario="A 29-year-old woman with a body-mass index of 38 kg/m² has had headaches and transient visual obscurations for a month. MRI and venography are normal. Opening pressure is 34 cm of water with a normal cerebrospinal-fluid formula. Blood pressure is 128/78 mm Hg and pulse is 80/min. Visual fields show enlarged blind spots but no severe field cut.",
    question="Which of the following is the most appropriate initial medicine?",
    options=[
        "Acetazolamide, with a weight-loss plan",
        "Optic-nerve sheath fenestration tonight",
        "Daily lumbar punctures as sole therapy",
        "Warfarin for presumed venous thrombosis",
    ],
    correct="Acetazolamide, with a weight-loss plan",
    why="normal imaging, high opening pressure, and papilledema physiology without a severe field cut are idiopathic intracranial hypertension. Reviews of management use acetazolamide, and weight loss also lowers intracranial pressure.",
    wrongs={
        "Optic-nerve sheath fenestration tonight": "surgery is for threatened vision that is failing medical therapy, not for enlarged blind spots at diagnosis.",
        "Daily lumbar punctures as sole therapy": "serial taps are not disease-modifying initial treatment.",
        "Warfarin for presumed venous thrombosis": "venography is normal, so anticoagulation is not indicated.",
    },
    principle="Idiopathic intracranial hypertension without imminent visual failure is treated with acetazolamide and weight loss.",
    label="Evolving evidence in adult idiopathic intracranial hypertension: pathophysiology and management.",
    url=IIH,
    citation="IIH review: acetazolamide is used, and weight loss lowers intracranial pressure",
)

add(
    slug="n07-depression-screen",
    domain="behavioral-nervous",
    subject="psychiatry",
    topic="gap3-depression-screening",
    task="health-maintenance",
    difficulty=3,
    band="medium",
    scenario="A 33-year-old pregnant woman at 18 weeks is seen for routine prenatal care. She has no known psychiatric diagnosis and no current sadness on a brief greeting. Blood pressure is 112/68 mm Hg and pulse is 84/min. Hemoglobin is 11.6 g/dL. The clinic asks which mental-health screen the USPSTF recommends for her.",
    question="Which of the following is the most appropriate screening plan?",
    options=[
        "Screen for depression at this visit",
        "No mental-health screening in pregnancy",
        "Screen after delivery rather than now",
        "A urine drug screen instead of any mood screen",
    ],
    correct="Screen for depression at this visit",
    why="the USPSTF recommends depression screening in adults, including pregnant and postpartum persons. Pregnancy is specifically included, not excluded.",
    wrongs={
        "No mental-health screening in pregnancy": "pregnancy is named in the population for whom depression screening is recommended.",
        "Screen after delivery rather than now": "the recommendation covers pregnant persons, not the postpartum period alone.",
        "A urine drug screen instead of any mood screen": "a toxicology test does not replace depression screening.",
    },
    principle="Adults, including pregnant persons, are screened for depression.",
    label="USPSTF. Screening for depression and suicide risk in adults.",
    url=DEP,
    citation="USPSTF grade B: screen adults, including pregnant and postpartum persons, for depression",
)

add(
    slug="n08-sah-late-lp",
    domain="behavioral-nervous",
    subject="neurology",
    topic="gap3-sah-late-lumbar-puncture",
    task="diagnosis",
    difficulty=3,
    band="medium",
    scenario="A 51-year-old woman had a thunderclap headache 20 hours ago, the worst of her life, and it persists. Noncontrast CT of the head, performed 18 hours after onset on a modern scanner, is negative. She is awake. Blood pressure is 158/92 mm Hg and pulse is 88/min. Glucose is 104 mg/dL. There is no fever or neck stiffness yet.",
    question="Which of the following is the most appropriate next diagnostic step?",
    options=[
        "Lumbar puncture for xanthochromia",
        "Discharge, because the CT is negative",
        "Heparin for presumed arterial dissection",
        "Sumatriptan for presumed migraine",
    ],
    correct="Lumbar puncture for xanthochromia",
    why="a prospective study found 100 percent sensitivity of CT for subarachnoid hemorrhage only when scanning occurred within 6 hours of onset. Her scan was at 18 hours, so a negative CT does not exclude the diagnosis and lumbar puncture remains appropriate.",
    wrongs={
        "Discharge, because the CT is negative": "that reassurance applies to a high-quality scan within 6 hours, not at 18 hours.",
        "Heparin for presumed arterial dissection": "there is no vascular diagnosis yet, and anticoagulation would be harmful if blood is present.",
        "Sumatriptan for presumed migraine": "a first thunderclap headache is not treated as migraine before hemorrhage is excluded.",
    },
    principle="A negative head CT obtained more than 6 hours after thunderclap onset does not exclude subarachnoid hemorrhage, and lumbar puncture is the next test.",
    label="Perry JJ, et al. Sensitivity of CT within six hours for subarachnoid haemorrhage. BMJ.",
    url=SAH,
    citation="Perry 2011: CT sensitivity for subarachnoid hemorrhage was 100% only within six hours; later scans do not exclude it",
)

add(
    slug="n09-sah-early-no-lp",
    domain="behavioral-nervous",
    subject="neurology",
    topic="gap3-sah-ct-within-six-hours",
    task="diagnosis",
    difficulty=5,
    band="hard",
    scenario="A 44-year-old man had a thunderclap headache that peaked in one minute. Noncontrast CT was performed 3 hours later on a third-generation scanner and was read as negative by an experienced radiologist. He is now headache-free and neurologically normal. Blood pressure is 142/86 mm Hg and pulse is 78/min. Glucose is 98 mg/dL.",
    question="Which of the following is the most appropriate next step?",
    options=[
        "No lumbar puncture for subarachnoid blood",
        "Lumbar puncture before any discharge",
        "Digital-subtraction angiography tonight",
        "A 24-hour heparin infusion",
    ],
    correct="No lumbar puncture for subarachnoid blood",
    why="in the prospective cohort, CT performed within 6 hours of headache onset had 100 percent sensitivity for subarachnoid hemorrhage. A negative study in that window, read by an experienced radiologist, excludes the diagnosis without lumbar puncture.",
    wrongs={
        "Lumbar puncture before any discharge": "lumbar puncture is the traditional step when CT is negative later than 6 hours, not after a negative early high-quality scan.",
        "Digital-subtraction angiography tonight": "catheter angiography is not the next test after a CT that has already excluded subarachnoid hemorrhage.",
        "A 24-hour heparin infusion": "there is no indication for anticoagulation.",
    },
    principle="A negative third-generation head CT within 6 hours of thunderclap onset, read by an experienced radiologist, excludes subarachnoid hemorrhage.",
    label="Perry JJ, et al. Sensitivity of CT within six hours for subarachnoid haemorrhage. BMJ.",
    url=SAH,
    citation="Perry 2011: sensitivity 100% (97–100) for CT within six hours in 953 patients",
)

add(
    slug="n10-point-dapt",
    domain="behavioral-nervous",
    subject="neurology",
    topic="gap3-tia-dual-antiplatelet",
    task="pharmacotherapy",
    difficulty=5,
    band="hard",
    scenario="A 67-year-old man had 30 minutes of right-arm weakness and speech change 8 hours ago. Symptoms have resolved. ABCD2 score is 5. CT shows no bleed and MRI shows no large infarct. Blood pressure is 148/86 mm Hg and pulse is 76/min. LDL cholesterol is 118 mg/dL. He takes no antiplatelet drug. NIHSS is 0.",
    question="Which of the following is the most appropriate antiplatelet plan?",
    options=[
        "Aspirin plus clopidogrel, started now",
        "Aspirin alone for the next 90 days",
        "Warfarin with a target INR of 2 to 3",
        "No antiplatelet drug after a resolved spell",
    ],
    correct="Aspirin plus clopidogrel, started now",
    why="he has a high-risk TIA within 12 hours. The POINT trial enrolled this population and found that clopidogrel plus aspirin reduced ischemic stroke, myocardial infarction, or ischemic vascular death at 90 days compared with aspirin alone.",
    wrongs={
        "Aspirin alone for the next 90 days": "aspirin monotherapy was the control arm and was inferior for the primary ischemic outcome.",
        "Warfarin with a target INR of 2 to 3": "anticoagulation is not the antiplatelet strategy tested for high-risk atherosclerotic TIA.",
        "No antiplatelet drug after a resolved spell": "a resolved high-risk TIA still needs immediate secondary prevention.",
    },
    principle="High-risk TIA and minor ischemic stroke are treated with short-course aspirin plus clopidogrel, as tested in POINT.",
    label="Johnston SC, et al. Clopidogrel and aspirin in acute ischemic stroke and high-risk TIA. N Engl J Med.",
    url=POINT,
    citation="POINT trial: aspirin plus clopidogrel reduced ischemic events at 90 days versus aspirin alone",
)

add(
    slug="n11-pd-pimavanserin",
    domain="behavioral-nervous",
    subject="neurology",
    topic="gap3-pd-psychosis-pimavanserin",
    task="pharmacotherapy",
    difficulty=5,
    band="hard",
    scenario="A 72-year-old man with Parkinson disease has frightening visual hallucinations. Levodopa has already been reduced as far as mobility allows. He is not delirious. Blood pressure is 124/74 mm Hg and pulse is 70/min. Creatinine is 1.0 mg/dL. A clinician suggests haloperidol because it is familiar.",
    question="Which of the following is the most appropriate antipsychotic choice?",
    options=[
        "Pimavanserin",
        "Haloperidol",
        "Chlorpromazine",
        "High-dose metoclopramide",
    ],
    correct="Pimavanserin",
    why="an evidence-based review of Parkinson nonmotor symptoms rates pimavanserin efficacious and clinically useful for psychosis, with acceptable risk. Typical antipsychotics block dopamine and worsen parkinsonism.",
    wrongs={
        "Haloperidol": "a potent dopamine blocker worsens motor Parkinson disease and is not an acceptable psychosis treatment here.",
        "Chlorpromazine": "another first-generation antipsychotic has the same motor harm.",
        "High-dose metoclopramide": "metoclopramide blocks dopamine and is not an antipsychotic for Parkinson psychosis.",
    },
    principle="Psychosis in Parkinson disease is treated with pimavanserin, not with a typical antipsychotic.",
    label="Seppi K, et al. Update on treatments for nonmotor symptoms of Parkinson's disease. Mov Disord.",
    url=PD,
    citation="MDS evidence review: pimavanserin is efficacious and clinically useful for Parkinson disease psychosis",
)

add(
    slug="n12-ici-myasthenia",
    domain="behavioral-nervous",
    subject="neurology",
    topic="gap3-ici-myasthenic-crisis",
    task="pharmacotherapy",
    difficulty=5,
    band="hard",
    scenario="A 64-year-old man on pembrolizumab for melanoma has had drooping eyelids and fatigable weakness for a week. Today his neck is weak and his vital capacity is falling. Blood pressure is 138/80 mm Hg and pulse is 96/min. He is not infected. Acetylcholine-receptor antibodies are positive. Oncology asks whether to watch the weakness.",
    question="Which of the following is the most appropriate treatment?",
    options=[
        "High-dose steroids plus plasma exchange or IVIG",
        "Continue pembrolizumab and observe",
        "Pyridostigmine as the sole new drug",
        "A benzodiazepine for the fatigue",
    ],
    correct="High-dose steroids plus plasma exchange or IVIG",
    why="the 2020 myasthenia gravis consensus states that overt myasthenia during immune-checkpoint inhibitor therapy may require early high-dose steroids plus plasma exchange or IVIG, and withdrawal of the checkpoint inhibitor is decided with oncology.",
    wrongs={
        "Continue pembrolizumab and observe": "watching progressive ventilatory weakness during checkpoint-inhibitor myasthenia is not the recommended course.",
        "Pyridostigmine as the sole new drug": "a cholinesterase inhibitor does not replace steroids plus plasma exchange or IVIG in this crisis.",
        "A benzodiazepine for the fatigue": "a sedative can worsen ventilation and does not treat myasthenia.",
    },
    principle="Immune-checkpoint-inhibitor myasthenia with respiratory weakness is treated with high-dose steroids plus plasma exchange or IVIG.",
    label="Narayanaswami P, et al. International consensus guidance for management of myasthenia gravis: 2020 update.",
    url=MG,
    citation="2020 MG consensus: high-dose steroids plus plasma exchange or IVIG for overt myasthenia on immune-checkpoint inhibitors",
)

add(
    slug="n13-suicide-screen-insufficient",
    domain="behavioral-nervous",
    subject="psychiatry",
    topic="gap3-suicide-screen-i-statement",
    task="health-maintenance",
    difficulty=5,
    band="hard",
    scenario="A clinic is rewriting its adult well-visit template. Leaders want a USPSTF-based policy for a 50-year-old man with no psychiatric history. Blood pressure is 130/80 mm Hg and pulse is 72/min. Hemoglobin is 14.8 g/dL. They ask which statement matches the USPSTF recommendation.",
    question="Which of the following statements is most accurate?",
    options=[
        "Depression screening is recommended; suicide-risk screening has insufficient evidence",
        "Suicide-risk screening is grade B and depression screening is not",
        "Neither depression nor suicide-risk screening is addressed",
        "Both screens are grade D and should be avoided",
    ],
    correct="Depression screening is recommended; suicide-risk screening has insufficient evidence",
    why="the USPSTF gives a grade B recommendation to depression screening in adults and an I statement, insufficient evidence, for screening for suicide risk.",
    wrongs={
        "Suicide-risk screening is grade B and depression screening is not": "the grades are the reverse of this statement.",
        "Neither depression nor suicide-risk screening is addressed": "both topics are addressed, with different conclusions.",
        "Both screens are grade D and should be avoided": "depression screening is recommended, not discouraged.",
    },
    principle="USPSTF recommends adult depression screening and finds insufficient evidence for routine suicide-risk screening.",
    label="USPSTF. Screening for depression and suicide risk in adults.",
    url=DEP,
    citation="USPSTF: grade B for depression screening; I statement for suicide-risk screening",
)

add(
    slug="n14-mdd-psychotherapy",
    domain="behavioral-nervous",
    subject="psychiatry",
    topic="gap3-mdd-inadequate-response",
    task="clinical-intervention",
    difficulty=4,
    band="hard",
    scenario="A 45-year-old man has major depression. Sertraline at a therapeutic dose for 8 weeks, with good adherence, has produced almost no change in mood or function. He is not suicidal or psychotic. Blood pressure is 126/78 mm Hg and pulse is 74/min. TSH is 1.8 mIU/L. He has not had psychotherapy.",
    question="Which of the following is the most appropriate addition?",
    options=[
        "Evidence-based psychotherapy",
        "Haloperidol for the residual sadness",
        "Stopping treatment for a month",
        "Selegiline as the first switch tonight",
    ],
    correct="Evidence-based psychotherapy",
    why="CANMAT 2016 states that psychotherapy, and in selected cases neurostimulation, should be considered when antidepressant response is inadequate, after adherence and the diagnosis are reviewed.",
    wrongs={
        "Haloperidol for the residual sadness": "an antipsychotic is not the next step for nonpsychotic inadequate response.",
        "Stopping treatment for a month": "stopping care abandons a treatable depressive episode.",
        "Selegiline as the first switch tonight": "a monoamine oxidase inhibitor is not the first change after one second-generation antidepressant.",
    },
    principle="Inadequate response to an adequate antidepressant trial prompts reassessment and addition of psychotherapy or another evidence-based strategy.",
    label="CANMAT 2016 clinical guidelines for the management of adults with major depressive disorder.",
    url=MDD,
    citation="CANMAT 2016: psychotherapy should be considered after an inadequate antidepressant response",
)

add(
    slug="n15-cluster-flow",
    domain="behavioral-nervous",
    subject="neurology",
    topic="gap3-cluster-oxygen-flow",
    task="pharmacotherapy",
    difficulty=4,
    band="hard",
    scenario="A 40-year-old man with known cluster headache is in an attack. The nurse has placed oxygen at 2 L/min by nasal cannula. He is still pacing and tearing after 10 minutes. Blood pressure is 150/90 mm Hg and pulse is 104/min. The neurologic examination is otherwise normal.",
    question="Which of the following is the most appropriate oxygen order?",
    options=[
        "100 percent oxygen at 6 to 12 L/min by non-rebreather mask",
        "Continue 2 L/min by nasal cannula",
        "Oxygen by face tent at 3 L/min",
        "Room air, because oxygen has already failed",
    ],
    correct="100 percent oxygen at 6 to 12 L/min by non-rebreather mask",
    why="the effective acute regimen is 100 percent oxygen at 6 to 12 L/min for 15 to 30 minutes through a non-rebreather mask, not low-flow nasal cannula.",
    wrongs={
        "Continue 2 L/min by nasal cannula": "that flow does not deliver the high inspired oxygen fraction used for cluster attacks.",
        "Oxygen by face tent at 3 L/min": "a face tent at low flow is not the studied cluster regimen.",
        "Room air, because oxygen has already failed": "an inadequate setup has not failed the treatment; the dose and mask were wrong.",
    },
    principle="Cluster headache oxygen is high-flow 100 percent oxygen by non-rebreather mask, not low-flow nasal cannula.",
    label="Oxygen therapy in cluster headache, migraine, and other headache disorders.",
    url=CLUSTER,
    citation="Cluster oxygen review: 100% oxygen at 6–12 L/min by non-rebreather mask for 15–30 minutes",
)

add(
    slug="n16-meningitis-dex",
    domain="behavioral-nervous",
    subject="neurology",
    topic="gap3-meningitis-dexamethasone",
    task="pharmacotherapy",
    difficulty=4,
    band="hard",
    scenario="A 55-year-old man has fever, headache, and neck stiffness for 8 hours. Blood pressure is 108/64 mm Hg and pulse is 112/min. Glucose is 118 mg/dL. CT of the head is normal and he has no focal deficit. Lumbar puncture shows a neutrophil-predominant pleocytosis, low glucose, and gram-positive diplococci. Antibiotics have not yet been given.",
    question="Which of the following is the most appropriate adjunct to the first antibiotic dose?",
    options=[
        "Dexamethasone given with the first antibiotic dose",
        "Dexamethasone delayed until hospital day 3",
        "Mannitol as the sole adjunct",
        "No adjunct, because bacteria are already identified",
    ],
    correct="Dexamethasone given with the first antibiotic dose",
    why="adjunctive dexamethasone is the intervention studied in adult bacterial meningitis, including the European dexamethasone trial and later analyses of who benefits. It is given with or just before the first antibiotic dose, not days later.",
    wrongs={
        "Dexamethasone delayed until hospital day 3": "late steroids miss the window around the first antibiotic dose.",
        "Mannitol as the sole adjunct": "osmotherapy is not the evidence-based adjunct for community bacterial meningitis.",
        "No adjunct, because bacteria are already identified": "identification of pneumococcus is a reason to give dexamethasone, not to skip it.",
    },
    principle="Adults with acute bacterial meningitis receive dexamethasone with the first dose of antibiotics.",
    label="Sex-based differences in the response to dexamethasone in bacterial meningitis. Analysis of the European dexamethasone trial.",
    url=MEN,
    citation="European dexamethasone in adulthood bacterial meningitis trial and subsequent analysis: adjunctive dexamethasone",
)

add(
    slug="n17-bell-complete",
    domain="behavioral-nervous",
    subject="neurology",
    topic="gap3-bell-complete-still-steroid",
    task="pharmacotherapy",
    difficulty=4,
    band="hard",
    scenario="A 50-year-old man has complete left facial paralysis that began 12 hours ago. He cannot close the eye or move the forehead. There is no rash, hearing loss, or other cranial-nerve deficit. Blood pressure is 136/82 mm Hg and pulse is 80/min. Glucose is 102 mg/dL. A surgeon offers immediate facial-nerve decompression as the first step.",
    question="Which of the following is the most appropriate initial treatment?",
    options=[
        "Corticosteroids, not immediate decompression",
        "Immediate facial-nerve decompression",
        "Antiviral therapy without a corticosteroid",
        "Aspirin for a suspected brainstem stroke",
    ],
    correct="Corticosteroids, not immediate decompression",
    why="a current Bell palsy review states that corticosteroids are given within 48 hours regardless of severity, including complete paralysis. Surgery is not the initial treatment.",
    wrongs={
        "Immediate facial-nerve decompression": "decompression is not first-line care for typical Bell palsy, even when paralysis is complete.",
        "Antiviral therapy without a corticosteroid": "an antiviral drug without steroids omits the treatment with the clearest benefit.",
        "Aspirin for a suspected brainstem stroke": "forehead paralysis is peripheral, and the rest of the examination is normal.",
    },
    principle="Complete Bell palsy is still treated first with corticosteroids, not with immediate surgical decompression.",
    label="Bell palsy. CMAJ.",
    url=BELL,
    citation="Bell palsy review: corticosteroids within 48 hours regardless of severity",
)
