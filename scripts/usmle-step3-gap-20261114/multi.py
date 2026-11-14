"""Multisystem items: poisoning, hypothermia, anaphylaxis-adjacent systemic crises, screening that spans systems."""
from itemutil import item

CO = "https://pmc.ncbi.nlm.nih.gov/articles/PMC5363978/"
HCV = "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hepatitis-c-screening"
HYPO = "https://pmc.ncbi.nlm.nih.gov/articles/PMC5025630/"
APAP = "https://pmc.ncbi.nlm.nih.gov/articles/PMC9035297/"
LI = "https://pmc.ncbi.nlm.nih.gov/articles/PMC4422246/"
NAL = "https://pmc.ncbi.nlm.nih.gov/articles/PMC9639433/"
REFEED = "https://pmc.ncbi.nlm.nih.gov/articles/PMC2440847/"
MH = "https://pmc.ncbi.nlm.nih.gov/articles/PMC4524368/"

ITEMS = []

def add(**kwargs):
    ITEMS.append(item(**kwargs))

add(
    slug="u01-pdmp",
    domain="multisystem",
    subject="toxicology",
    topic="gap3-pdmp-before-opioid",
    task="health-maintenance",
    difficulty=2,
    band="easy",
    scenario="A 54-year-old man asks for a first prescription of oxycodone after a knee sprain. He is opioid-naive. Blood pressure is 132/80 mm Hg and pulse is 76/min. Creatinine is 0.9 mg/dL. He takes no benzodiazepine. The state database can be opened from the clinic computer.",
    question="Which of the following is the most appropriate step before prescribing?",
    options=[
        "Check the prescription-drug monitoring program",
        "Prescribe a 30-day supply without a database check",
        "Add a benzodiazepine for muscle spasm",
        "Start methadone as the first opioid",
    ],
    correct="Check the prescription-drug monitoring program",
    why="the 2022 CDC opioid guideline tells clinicians to check the prescription-drug monitoring program database when a new opioid prescription is being considered, to see other controlled substances.",
    wrongs={
        "Prescribe a 30-day supply without a database check": "a new opioid is not written before the database review the guideline describes.",
        "Add a benzodiazepine for muscle spasm": "combining a benzodiazepine with an opioid increases overdose risk and is not the first step.",
        "Start methadone as the first opioid": "methadone is not the initial analgesic for an opioid-naive patient with a sprain.",
    },
    principle="Before a new opioid prescription, the clinician checks the prescription-drug monitoring program.",
    label="CDC clinical practice guideline for prescribing opioids for pain—United States, 2022. MMWR.",
    url=NAL,
    citation="CDC 2022 opioid guideline: check the PDMP when considering a new opioid prescription",
)

add(
    slug="u02-hcv-screen",
    domain="multisystem",
    subject="infectious-disease",
    topic="gap3-hcv-screening",
    task="health-maintenance",
    difficulty=2,
    band="easy",
    scenario="A 45-year-old man is new to the clinic. He has no known liver disease and no symptoms. He does not recall prior hepatitis testing. Blood pressure is 126/78 mm Hg and pulse is 72/min. ALT is 22 U/L and creatinine is 0.9 mg/dL. He asks which one-time infection screen applies to him.",
    question="Which of the following is the most appropriate screening test?",
    options=[
        "A one-time hepatitis C antibody test",
        "No viral-hepatitis testing at his age",
        "Hepatitis B treatment without a test",
        "A liver biopsy as the screening test",
    ],
    correct="A one-time hepatitis C antibody test",
    why="the USPSTF recommends hepatitis C screening in adults aged 18 to 79 years, including asymptomatic people without known liver disease.",
    wrongs={
        "No viral-hepatitis testing at his age": "age 45 years is inside the 18-to-79-year screening window.",
        "Hepatitis B treatment without a test": "treatment is not started without a diagnosis, and the indicated screen is hepatitis C.",
        "A liver biopsy as the screening test": "biopsy is not a screening test for hepatitis C.",
    },
    principle="Adults aged 18 to 79 years are screened once for hepatitis C.",
    label="USPSTF. Hepatitis C virus infection in adolescents and adults: screening.",
    url=HCV,
    citation="USPSTF grade B: screen adults aged 18 to 79 years for hepatitis C",
)

add(
    slug="u03-hypothermia-mild",
    domain="multisystem",
    subject="emergency-medicine",
    topic="gap3-hypothermia-external-rewarming",
    task="clinical-intervention",
    difficulty=2,
    band="easy",
    scenario="A 40-year-old man was pulled from cold water. He is shivering and alert. Core temperature is 35.0°C. Blood pressure is 128/78 mm Hg and pulse is 90/min. Glucose is 110 mg/dL. The cardiac monitor shows sinus rhythm. He did not lose a pulse.",
    question="Which of the following is the most appropriate rewarming plan?",
    options=[
        "Active external rewarming with forced air",
        "Immediate extracorporeal life support",
        "Ice packs to prevent rebound fever",
        "No rewarming until a CT scan is done",
    ],
    correct="Active external rewarming with forced air",
    why="he is non-arrested, otherwise healthy, and hemodynamically stable with mild hypothermia. An ICAR-endorsed review states that minimally invasive rewarming is appropriate for such patients and that extracorporeal support is the advance used for hypothermic cardiac arrest.",
    wrongs={
        "Immediate extracorporeal life support": "extracorporeal support is for hypothermic arrest, not for a shivering patient at 35°C.",
        "Ice packs to prevent rebound fever": "cooling would worsen hypothermia.",
        "No rewarming until a CT scan is done": "rewarming is not deferred for imaging in stable mild hypothermia.",
    },
    principle="Stable mild hypothermia is treated with active external rewarming, not extracorporeal support.",
    label="Paal P, et al. Accidental hypothermia—an update. Scand J Trauma Resusc Emerg Med.",
    url=HYPO,
    citation="ICAR-endorsed hypothermia review: minimally invasive rewarming for non-arrested stable patients; ECLS for hypothermic arrest",
)

add(
    slug="u04-apap-nac",
    domain="multisystem",
    subject="toxicology",
    topic="gap3-acetaminophen-nac",
    task="pharmacotherapy",
    difficulty=3,
    band="medium",
    scenario="A 22-year-old woman took a bottle of acetaminophen 5 hours ago. She is awake and not vomiting now. Blood pressure is 118/72 mm Hg and pulse is 96/min. The 4-hour acetaminophen concentration plots above the treatment line. AST is 40 U/L and INR is 1.0. Glucose is 102 mg/dL.",
    question="Which of the following is the most appropriate antidote?",
    options=[
        "Acetylcysteine started now",
        "Fomepizole for a toxic alcohol",
        "Naloxone for an opioid co-ingestant",
        "Observation without an antidote",
    ],
    correct="Acetylcysteine started now",
    why="a level above the treatment line is an indication for the antidote. A clinical review of acetaminophen overdose identifies acetylcysteine as the antidote used for patients who need treatment.",
    wrongs={
        "Fomepizole for a toxic alcohol": "the ingestion and the nomogram identify acetaminophen, not ethylene glycol or methanol.",
        "Naloxone for an opioid co-ingestant": "she has no opioid toxidrome.",
        "Observation without an antidote": "a concentration above the treatment line is not observed without acetylcysteine.",
    },
    principle="Acetaminophen concentrations above the treatment line are treated with acetylcysteine.",
    label="Treating acetaminophen overdose. CMAJ.",
    url=APAP,
    citation="Acetaminophen overdose review: acetylcysteine is the antidote",
)

add(
    slug="u05-hypothermia-stable-cold",
    domain="multisystem",
    subject="emergency-medicine",
    topic="gap3-hypothermia-not-ecls-if-stable",
    task="clinical-intervention",
    difficulty=3,
    band="medium",
    scenario="A 50-year-old woman found outdoors has a core temperature of 30.5°C. She is awake, shivering weakly, and talking. Blood pressure is 108/70 mm Hg and pulse is 58/min in sinus rhythm. Glucose is 126 mg/dL. She has not had a cardiac arrest. A colleague wants to cannulate her for extracorporeal support immediately.",
    question="Which of the following is the most appropriate rewarming plan?",
    options=[
        "Minimally invasive rewarming while she has a pulse",
        "Extracorporeal life support as the first step",
        "No rewarming, because shivering will suffice",
        "Ice-water immersion to stabilize the core",
    ],
    correct="Minimally invasive rewarming while she has a pulse",
    why="the hypothermia review endorsed by the International Commission for Mountain Emergency Medicine reserves the major survival gain of extracorporeal life support for hypothermic cardiac arrest and supports minimally invasive rewarming for non-arrested patients with stable vital signs.",
    wrongs={
        "Extracorporeal life support as the first step": "she has a pulse and stable pressure, so cannulation is not the first rewarming method.",
        "No rewarming, because shivering will suffice": "a core temperature of 30.5°C needs active rewarming, not passive waiting.",
        "Ice-water immersion to stabilize the core": "immersion cooling would deepen hypothermia.",
    },
    principle="Non-arrested hypothermia with stable vital signs is rewarmed by minimally invasive methods, not by immediate extracorporeal support.",
    label="Paal P, et al. Accidental hypothermia—an update. Scand J Trauma Resusc Emerg Med.",
    url=HYPO,
    citation="Hypothermia review: minimally invasive rewarming for stable non-arrested patients",
)

add(
    slug="u06-lithium-no-hd",
    domain="multisystem",
    subject="toxicology",
    topic="gap3-lithium-no-dialysis",
    task="pharmacotherapy",
    difficulty=3,
    band="medium",
    scenario="A 55-year-old woman on lithium has a tremor after a week of poor intake. She is awake and has had no seizure. Blood pressure is 132/78 mm Hg and pulse is 88/min. The lithium level is 1.8 mEq/L and creatinine is 0.8 mg/dL. Sodium is 140 mEq/L. The electrocardiogram shows sinus rhythm.",
    question="Which of the following is the most appropriate treatment?",
    options=[
        "Hold lithium and give intravenous saline",
        "Hemodialysis for this lithium level",
        "Flumazenil to reverse the tremor",
        "Continue the usual lithium dose tonight",
    ],
    correct="Hold lithium and give intravenous saline",
    why="EXTRIP recommends extracorporeal treatment if kidney function is impaired and the lithium level is above 4.0 mEq/L, or if there are seizures, decreased consciousness, or life-threatening dysrhythmias. None of those is present.",
    wrongs={
        "Hemodialysis for this lithium level": "a level of 1.8 mEq/L with normal kidneys and no severe neurologic feature does not meet EXTRIP criteria.",
        "Flumazenil to reverse the tremor": "flumazenil reverses benzodiazepines, not lithium.",
        "Continue the usual lithium dose tonight": "the drug is held while she is symptomatic and the level is high.",
    },
    principle="Lithium toxicity without severe neurologic features, a level above 4 mEq/L, or kidney impairment is managed by stopping the drug and giving saline, not dialysis.",
    label="Decker BS, et al. Extracorporeal treatment for lithium poisoning: EXTRIP. Clin J Am Soc Nephrol.",
    url=LI,
    citation="EXTRIP lithium: dialysis if level >4 mEq/L with impaired kidneys, or if seizures, decreased consciousness, or life-threatening dysrhythmias",
)

add(
    slug="u07-naloxone-offer",
    domain="multisystem",
    subject="toxicology",
    topic="gap3-offer-naloxone",
    task="health-maintenance",
    difficulty=3,
    band="medium",
    scenario="A 60-year-old man takes oxycodone totaling 60 morphine milligram equivalents daily for chronic knee pain and also takes lorazepam at night. He has never overdosed. Blood pressure is 136/82 mm Hg and pulse is 74/min. Creatinine is 1.0 mg/dL. He is here for a refill.",
    question="Which of the following is the most appropriate addition to the visit?",
    options=[
        "Offer take-home naloxone",
        "Double the oxycodone dose today",
        "Add a second benzodiazepine for sleep",
        "No overdose counseling at this dose",
    ],
    correct="Offer take-home naloxone",
    why="the 2022 CDC opioid guideline says clinicians should offer naloxone when prescribing opioids, particularly at dosages of at least 50 morphine milligram equivalents daily or when a benzodiazepine is co-prescribed. He meets both risk markers.",
    wrongs={
        "Double the oxycodone dose today": "increasing the dose raises overdose risk and is not the safety step.",
        "Add a second benzodiazepine for sleep": "another sedative further increases overdose risk.",
        "No overdose counseling at this dose": "60 morphine milligram equivalents plus a benzodiazepine is specifically a naloxone-offer situation.",
    },
    principle="Naloxone is offered to patients on higher-dose opioids or on opioids plus a benzodiazepine.",
    label="CDC clinical practice guideline for prescribing opioids for pain—United States, 2022. MMWR.",
    url=NAL,
    citation="CDC 2022 opioid guideline: offer naloxone, especially at ≥50 MME/day or with benzodiazepines",
)

add(
    slug="u08-co-hbo",
    domain="multisystem",
    subject="emergency-medicine",
    topic="gap3-co-hyperbaric",
    task="clinical-intervention",
    difficulty=5,
    band="hard",
    scenario="A 42-year-old man was found unconscious in a garage with a running engine. He is now awake but confused. Carboxyhemoglobin is 28 percent. Blood pressure is 110/70 mm Hg and pulse is 112/min. Glucose is 140 mg/dL. He had a witnessed loss of consciousness. One hundred percent oxygen is already flowing.",
    question="Which of the following is the most appropriate additional therapy?",
    options=[
        "Hyperbaric oxygen",
        "Stop oxygen and observe on room air",
        "Hydroxocobalamin instead of oxygen",
        "Methylene blue instead of oxygen",
    ],
    correct="Hyperbaric oxygen",
    why="the cited review states that hyperbaric oxygen significantly reduces the permanent neurologic and affective effects of carbon monoxide poisoning, and loss of consciousness marks severe poisoning. Normobaric oxygen continues while hyperbaric treatment is arranged.",
    wrongs={
        "Stop oxygen and observe on room air": "stopping oxygen removes the treatment that clears carbon monoxide.",
        "Hydroxocobalamin instead of oxygen": "hydroxocobalamin is the antidote for cyanide, not a replacement for oxygen in carbon monoxide poisoning.",
        "Methylene blue instead of oxygen": "methylene blue treats methemoglobinemia, which this exposure is not.",
    },
    principle="Severe carbon monoxide poisoning, including loss of consciousness, is treated with hyperbaric oxygen in addition to 100 percent oxygen.",
    label="Rose JJ, et al. Carbon monoxide poisoning: pathogenesis, management, and future directions. Am J Respir Crit Care Med.",
    url=CO,
    citation="CO review: hyperbaric oxygen reduces permanent neurologic and affective injury",
)

add(
    slug="u09-refeeding",
    domain="multisystem",
    subject="critical-care",
    topic="gap3-refeeding-thiamine-phosphate",
    task="pharmacotherapy",
    difficulty=5,
    band="hard",
    scenario="A 28-year-old man with anorexia nervosa has a body-mass index of 13 kg/m² and has eaten almost nothing for 3 weeks. Feeding is about to start. Blood pressure is 96/60 mm Hg and pulse is 48/min. Phosphate is 2.4 mg/dL, potassium is 3.2 mEq/L, and glucose is 62 mg/dL. He has not received vitamins.",
    question="Which of the following is the most appropriate plan as feeding starts?",
    options=[
        "Thiamine, electrolyte repletion, and slow calories",
        "A full caloric goal on the first day",
        "Glucose infusion without thiamine",
        "Phosphate restriction to avoid diarrhea",
    ],
    correct="Thiamine, electrolyte repletion, and slow calories",
    why="a clinical review of refeeding syndrome describes thiamine deficiency, hypophosphatemia, and hypokalemia when nutrition is restored too quickly in starved patients. Thiamine and electrolyte repletion accompany a cautious caloric start.",
    wrongs={
        "A full caloric goal on the first day": "aggressive calories precipitate the phosphate drop and fluid shifts of refeeding syndrome.",
        "Glucose infusion without thiamine": "glucose drives thiamine use and can precipitate Wernicke-type injury if thiamine is not given.",
        "Phosphate restriction to avoid diarrhea": "phosphate falls in refeeding and is replaced, not restricted.",
    },
    principle="Refeeding a starved patient starts with thiamine, electrolyte repletion, and a slow caloric advance.",
    label="Mehanna HM, Moledina J, Travis J. Refeeding syndrome: what it is, and how to prevent and treat it. BMJ.",
    url=REFEED,
    citation="BMJ refeeding review: thiamine deficiency, hypophosphatemia, and hypokalemia when nutrition is restored too fast",
)

add(
    slug="u10-ecls-arrest",
    domain="multisystem",
    subject="emergency-medicine",
    topic="gap3-hypothermic-arrest-ecls",
    task="clinical-intervention",
    difficulty=5,
    band="hard",
    scenario="A 35-year-old skier is in cardiac arrest after burial in snow. Core temperature is 24°C. The monitor shows ventricular fibrillation. Blood pressure is absent and the pulse check is negative. Glucose is 160 mg/dL. Standard resuscitation is underway. The nearest center can provide extracorporeal support.",
    question="Which of the following is the most appropriate rewarming method?",
    options=[
        "Extracorporeal life support while resuscitation continues",
        "Blankets, and stop resuscitation at 20 minutes",
        "Ice packs to the groin and axillae",
        "Room-temperature intravenous saline at a keep-open rate",
    ],
    correct="Extracorporeal life support while resuscitation continues",
    why="the hypothermia review reports that extracorporeal life support has transformed survival from hypothermic cardiac arrest, with very high survival in selected series. Blankets do not rewarm a arrested, profoundly cold patient fast enough.",
    wrongs={
        "Blankets, and stop resuscitation at 20 minutes": "hypothermic arrest is not declared on a warm-patient time limit, and external blankets are insufficient.",
        "Ice packs to the groin and axillae": "further cooling is the opposite of treatment.",
        "Room-temperature intravenous saline at a keep-open rate": "a slow cool infusion does not provide extracorporeal rewarming.",
    },
    principle="Hypothermic cardiac arrest is rewarmed with extracorporeal life support, and resuscitation continues during rewarming.",
    label="Paal P, et al. Accidental hypothermia—an update. Scand J Trauma Resusc Emerg Med.",
    url=HYPO,
    citation="Hypothermia review: extracorporeal life support for hypothermic cardiac arrest",
)

add(
    slug="u11-lithium-hd-level",
    domain="multisystem",
    subject="toxicology",
    topic="gap3-lithium-dialysis-level",
    task="clinical-intervention",
    difficulty=5,
    band="hard",
    scenario="A 63-year-old man on lithium has been confused for a day after starting ibuprofen. He is drowsy but has not seized. Blood pressure is 148/88 mm Hg and pulse is 92/min. The lithium level is 4.6 mEq/L and creatinine is 3.1 mg/dL, up from 1.0 mg/dL. Sodium is 136 mEq/L. The electrocardiogram shows sinus rhythm.",
    question="Which of the following is the most appropriate extracorporeal plan?",
    options=[
        "Hemodialysis",
        "No extracorporeal treatment",
        "Urinary alkalinization with bicarbonate",
        "A single dose of activated charcoal",
    ],
    correct="Hemodialysis",
    why="EXTRIP recommends extracorporeal treatment when kidney function is impaired and the lithium level is above 4.0 mEq/L. Hemodialysis is the preferred modality.",
    wrongs={
        "No extracorporeal treatment": "both the level and the acute kidney injury meet the EXTRIP threshold.",
        "Urinary alkalinization with bicarbonate": "alkalinization is a salicylate strategy, not lithium removal.",
        "A single dose of activated charcoal": "lithium is not adsorbed by charcoal, and the level is already high.",
    },
    principle="Lithium above 4 mEq/L with impaired kidney function is treated with hemodialysis.",
    label="Decker BS, et al. Extracorporeal treatment for lithium poisoning: EXTRIP. Clin J Am Soc Nephrol.",
    url=LI,
    citation="EXTRIP: hemodialysis if lithium is >4.0 mEq/L and kidney function is impaired",
)

add(
    slug="u12-lithium-seizure",
    domain="multisystem",
    subject="toxicology",
    topic="gap3-lithium-dialysis-seizure",
    task="clinical-intervention",
    difficulty=5,
    band="hard",
    scenario="A 58-year-old woman on lithium has a witnessed seizure in the emergency department. She is now postictal. Blood pressure is 160/94 mm Hg and pulse is 110/min. The lithium level is 2.4 mEq/L and creatinine is 0.9 mg/dL. Sodium is 139 mEq/L. Glucose is 118 mg/dL.",
    question="Which of the following is the most appropriate extracorporeal plan?",
    options=[
        "Hemodialysis despite the level of 2.4 mEq/L",
        "No dialysis, because the level is under 4",
        "Charcoal hemoperfusion as the first choice",
        "Forced alkaline diuresis",
    ],
    correct="Hemodialysis despite the level of 2.4 mEq/L",
    why="EXTRIP recommends extracorporeal treatment for seizures from lithium irrespective of the serum level. Hemodialysis is the preferred method.",
    wrongs={
        "No dialysis, because the level is under 4": "the level threshold of 4 mEq/L applies when the indication is impaired kidneys, not when seizures are present.",
        "Charcoal hemoperfusion as the first choice": "EXTRIP prefers hemodialysis, not charcoal hemoperfusion.",
        "Forced alkaline diuresis": "alkaline diuresis does not meaningfully clear lithium.",
    },
    principle="A lithium-related seizure is an indication for hemodialysis regardless of the serum level.",
    label="Decker BS, et al. Extracorporeal treatment for lithium poisoning: EXTRIP. Clin J Am Soc Nephrol.",
    url=LI,
    citation="EXTRIP: dialysis for lithium-associated seizures irrespective of the serum level",
)

add(
    slug="u13-avoid-sux-elective-child",
    domain="multisystem",
    subject="anesthesiology",
    topic="gap3-avoid-succinylcholine-elective-child",
    task="pharmacotherapy",
    difficulty=5,
    band="hard",
    scenario="An 8-year-old boy is scheduled for elective inguinal hernia repair. He is fasted, has no reflux, and the airway is expected to be easy. Blood pressure is 100/62 mm Hg and pulse is 88/min. Hemoglobin is 12.8 g/dL. The anesthesiologist proposes succinylcholine to facilitate intubation because the case is short.",
    question="Which of the following is the most appropriate muscle-relaxant plan?",
    options=[
        "Avoid succinylcholine for this elective case",
        "Give succinylcholine because the case is short",
        "Give succinylcholine plus a volatile agent by default",
        "Cancel surgery until a muscle biopsy is done",
    ],
    correct="Avoid succinylcholine for this elective case",
    why="a review of malignant hyperthermia records the warning to avoid succinylcholine in children and young adolescents for elective cases, reserving it for a full stomach or a difficult airway. This fasted child with an easy airway does not need it.",
    wrongs={
        "Give succinylcholine because the case is short": "a short elective case is not an exception to avoiding succinylcholine in children.",
        "Give succinylcholine plus a volatile agent by default": "both are triggers, and succinylcholine is the drug the warning addresses for elective pediatric cases.",
        "Cancel surgery until a muscle biopsy is done": "routine biopsy is not required before an elective hernia repair that can proceed with a non-triggering plan.",
    },
    principle="Succinylcholine is avoided for elective anesthesia in children when the airway is not difficult and the stomach is empty.",
    label="Rosenberg H, et al. Malignant hyperthermia: a review. Orphanet J Rare Dis.",
    url=MH,
    citation="Malignant hyperthermia review: avoid succinylcholine in children for elective cases; reserve it for a full stomach or difficult airway",
)

add(
    slug="u14-lithium-crrt",
    domain="multisystem",
    subject="toxicology",
    topic="gap3-lithium-crrt",
    task="clinical-intervention",
    difficulty=4,
    band="hard",
    scenario="A 66-year-old man has a lithium level of 5.2 mEq/L and creatinine of 3.4 mg/dL. He is drowsy. Blood pressure is 150/90 mm Hg and pulse is 100/min. Sodium is 134 mEq/L. The intermittent hemodialysis machine is broken until tomorrow morning. Continuous renal replacement is available tonight.",
    question="Which of the following is the most appropriate extracorporeal plan tonight?",
    options=[
        "Start continuous renal replacement now",
        "Wait until morning for intermittent hemodialysis",
        "Give charcoal and skip extracorporeal removal",
        "Use urinary alkalinization overnight",
    ],
    correct="Start continuous renal replacement now",
    why="he meets EXTRIP criteria for extracorporeal removal. The workgroup prefers hemodialysis but states that continuous renal replacement is an acceptable alternative when intermittent hemodialysis is not available.",
    wrongs={
        "Wait until morning for intermittent hemodialysis": "waiting overnight leaves a level of 5.2 mEq/L and kidney failure untreated.",
        "Give charcoal and skip extracorporeal removal": "charcoal does not adsorb lithium and does not replace extracorporeal removal.",
        "Use urinary alkalinization overnight": "alkalinization does not clear lithium.",
    },
    principle="If hemodialysis is unavailable for severe lithium poisoning, continuous renal replacement is an acceptable alternative and should not be delayed.",
    label="Decker BS, et al. Extracorporeal treatment for lithium poisoning: EXTRIP. Clin J Am Soc Nephrol.",
    url=LI,
    citation="EXTRIP: hemodialysis is preferred, and continuous renal replacement is an acceptable alternative",
)
