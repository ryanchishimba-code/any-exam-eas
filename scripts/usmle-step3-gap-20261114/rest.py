"""Respiratory-renal, cardiovascular, and reproductive-endocrine items."""
from itemutil import item

CAP = "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/"
LUNG = "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening"
NIV = "https://pmc.ncbi.nlm.nih.gov/articles/PMC6483555/"
GBM = "https://pmc.ncbi.nlm.nih.gov/articles/PMC5498345/"
AAA = "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/abdominal-aortic-aneurysm-screening"
STATIN = "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/statin-use-in-adults-preventive-medication"
AF = "https://pmc.ncbi.nlm.nih.gov/articles/PMC11095842/"
AORTA = "https://pmc.ncbi.nlm.nih.gov/articles/PMC9876736/"
ASA = "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/aspirin-to-prevent-cardiovascular-disease-preventive-medication"
GDM = "https://pmc.ncbi.nlm.nih.gov/articles/PMC10725801/"
HYPO = "https://pmc.ncbi.nlm.nih.gov/articles/PMC4267409/"
PHEO = "https://pmc.ncbi.nlm.nih.gov/articles/PMC9162254/"
MYX = "https://pmc.ncbi.nlm.nih.gov/articles/PMC3175396/"
DKA = "https://pmc.ncbi.nlm.nih.gov/articles/PMC2699725/"

ITEMS = []

def add(**kwargs):
    ITEMS.append(item(**kwargs))

# Respiratory-renal
add(
    slug="r01-cap-amox",
    domain="respiratory-renal",
    subject="pulmonology",
    topic="gap3-cap-outpatient-amoxicillin",
    task="pharmacotherapy",
    difficulty=2,
    band="easy",
    scenario="A 32-year-old woman has had cough, fever, and a right-sided infiltrate for 2 days. She has no chronic disease, no recent antibiotics, and no MRSA risk. Blood pressure is 118/72 mm Hg, pulse is 96/min, and oxygen saturation is 96 percent on room air. Creatinine is 0.7 mg/dL. She can eat and drink.",
    question="Which of the following is the most appropriate outpatient antibiotic?",
    options=[
        "Amoxicillin 1 g three times daily",
        "Vancomycin plus cefepime",
        "Oseltamivir as the sole drug",
        "Metronidazole as the sole drug",
    ],
    correct="Amoxicillin 1 g three times daily",
    why="the 2019 ATS/IDSA guideline strongly recommends amoxicillin 1 g three times daily for outpatient adults with community-acquired pneumonia who have no comorbidities and no risk factors for resistant pathogens.",
    wrongs={
        "Vancomycin plus cefepime": "that pair is for MRSA or Pseudomonas risk, which she does not have.",
        "Oseltamivir as the sole drug": "influenza therapy does not treat typical bacterial pneumonia.",
        "Metronidazole as the sole drug": "anaerobic monotherapy is not the recommended outpatient regimen.",
    },
    principle="Healthy adults with outpatient community-acquired pneumonia are treated with amoxicillin, doxycycline, or a macrolide when resistance is low.",
    label="Metlay JP, et al. Diagnosis and treatment of adults with community-acquired pneumonia. Am J Respir Crit Care Med. 2019.",
    url=CAP,
    citation="ATS/IDSA 2019: amoxicillin 1 g three times daily for outpatients without comorbidities",
)

add(
    slug="r02-ldct-smoker",
    domain="respiratory-renal",
    subject="pulmonology",
    topic="gap3-lung-cancer-ldct",
    task="health-maintenance",
    difficulty=2,
    band="easy",
    scenario="A 60-year-old man has smoked one pack daily for 35 years and still smokes. He has no symptoms. Blood pressure is 134/80 mm Hg and pulse is 78/min. Oxygen saturation is 97 percent. Hemoglobin is 15.1 g/dL. He asks about lung-cancer screening.",
    question="Which of the following is the most appropriate screening plan?",
    options=[
        "Annual low-dose chest CT",
        "A chest radiograph each year",
        "Sputum cytology each year",
        "No lung screening while he still smokes",
    ],
    correct="Annual low-dose chest CT",
    why="the USPSTF recommends annual low-dose CT for adults aged 50 to 80 years with at least a 20 pack-year history who currently smoke or quit within the past 15 years. He meets every element.",
    wrongs={
        "A chest radiograph each year": "chest radiography is not the recommended screening test.",
        "Sputum cytology each year": "sputum cytology is not the USPSTF screening strategy.",
        "No lung screening while he still smokes": "current smoking is a reason to screen, not a reason to withhold it.",
    },
    principle="Adults 50 to 80 years old with a 20 pack-year history who still smoke are screened yearly with low-dose CT.",
    label="USPSTF. Lung cancer: screening.",
    url=LUNG,
    citation="USPSTF: annual LDCT for ages 50–80 with ≥20 pack-years who smoke or quit within 15 years",
)

add(
    slug="r03-ldct-recent-quit",
    domain="respiratory-renal",
    subject="pulmonology",
    topic="gap3-lung-cancer-ldct-recent-quit",
    task="health-maintenance",
    difficulty=3,
    band="medium",
    scenario="A 64-year-old woman smoked one pack daily from age 30 to age 56 and quit 8 years ago, a 26 pack-year history. She has no symptoms. Blood pressure is 128/76 mm Hg and pulse is 72/min. Oxygen saturation is 98 percent. Hemoglobin is 13.8 g/dL. She wonders if screening still applies.",
    question="Which of the following is the most appropriate screening plan?",
    options=[
        "Annual low-dose chest CT",
        "No screening, because she has quit",
        "A chest radiograph this year and not again",
        "Sputum cytology instead of imaging",
    ],
    correct="Annual low-dose chest CT",
    why="she is 50 to 80 years old, has more than 20 pack-years, and quit within the past 15 years. Those are the USPSTF criteria for annual low-dose CT.",
    wrongs={
        "No screening, because she has quit": "quitting ends eligibility only after 15 years, and she quit 8 years ago.",
        "A chest radiograph this year and not again": "radiography is not the recommended screen.",
        "Sputum cytology instead of imaging": "cytology is not a substitute for low-dose CT.",
    },
    principle="Former smokers remain eligible for annual low-dose CT until 15 years after quitting, if age and pack-years still qualify.",
    label="USPSTF. Lung cancer: screening.",
    url=LUNG,
    citation="USPSTF: continue LDCT if the person quit within the past 15 years",
)

add(
    slug="r04-cap-inpatient",
    domain="respiratory-renal",
    subject="pulmonology",
    topic="gap3-cap-inpatient-regimen",
    task="pharmacotherapy",
    difficulty=3,
    band="medium",
    scenario="A 70-year-old man is admitted with fever, cough, and a lobar infiltrate. He has no COPD, no recent hospitalization, and no MRSA or Pseudomonas risk. Blood pressure is 108/64 mm Hg, pulse is 108/min, and oxygen saturation is 93 percent on 2 L/min. Creatinine is 1.0 mg/dL. He is not in shock and is not confused.",
    question="Which of the following is the most appropriate empiric regimen?",
    options=[
        "Ceftriaxone plus azithromycin",
        "Vancomycin plus cefepime",
        "Ceftriaxone as a single drug",
        "Oseltamivir as a single drug",
    ],
    correct="Ceftriaxone plus azithromycin",
    why="ATS/IDSA 2019 recommends, for inpatient adults with nonsevere pneumonia and no MRSA or Pseudomonas risk, a beta-lactam plus a macrolide, or a beta-lactam plus a respiratory fluoroquinolone. Ceftriaxone plus azithromycin is the first of those regimens.",
    wrongs={
        "Vancomycin plus cefepime": "extended MRSA and Pseudomonas coverage is for patients with specific risk factors, which he lacks.",
        "Ceftriaxone as a single drug": "beta-lactam monotherapy is not the recommended inpatient regimen.",
        "Oseltamivir as a single drug": "antiviral monotherapy does not cover typical bacterial pneumonia.",
    },
    principle="Nonsevere inpatient community-acquired pneumonia without resistant-pathogen risk is treated with a beta-lactam plus a macrolide.",
    label="Metlay JP, et al. Diagnosis and treatment of adults with community-acquired pneumonia. Am J Respir Crit Care Med. 2019.",
    url=CAP,
    citation="ATS/IDSA 2019 recommendation 9.1: beta-lactam plus macrolide for nonsevere inpatient CAP without MRSA or Pseudomonas risk",
)

add(
    slug="r05-cap-iv-to-oral",
    domain="respiratory-renal",
    subject="pulmonology",
    topic="gap3-cap-iv-to-oral",
    task="pharmacotherapy",
    difficulty=3,
    band="medium",
    scenario="A 64-year-old woman has received intravenous ceftriaxone plus azithromycin for nonsevere community-acquired pneumonia. On hospital day 3 she has been afebrile for 24 hours, is eating, and oxygen saturation is 97 percent on room air. Blood pressure is 122/74 mm Hg and pulse is 80/min. Leukocyte count is 9,100/μL. There is no empyema. She can swallow pills.",
    question="Which of the following is the most appropriate antibiotic change?",
    options=[
        "Switch to an oral beta-lactam of the same class",
        "Continue intravenous ceftriaxone through day 14",
        "Switch to oral vancomycin",
        "Stop antibiotics this morning",
    ],
    correct="Switch to an oral beta-lactam of the same class",
    why="ATS/IDSA 2019 says that when changing from parenteral to oral therapy, the same agent or the same drug class should be used. She is stable and eating on day 3, so an oral beta-lactam continues the course. A minimum of 5 days is still required, so antibiotics are not stopped today.",
    wrongs={
        "Continue intravenous ceftriaxone through day 14": "she no longer needs intravenous therapy, and 14 days is longer than a usual uncomplicated course.",
        "Switch to oral vancomycin": "vancomycin is a different class and is not indicated without MRSA.",
        "Stop antibiotics this morning": "the guideline recommends a minimum of 5 days even if stability occurs earlier.",
    },
    principle="Stable patients with community-acquired pneumonia are switched from intravenous to an oral antibiotic of the same class, and the course still reaches 5 days.",
    label="Metlay JP, et al. Diagnosis and treatment of adults with community-acquired pneumonia. Am J Respir Crit Care Med. 2019.",
    url=CAP,
    citation="ATS/IDSA 2019: switch from parenteral to oral therapy with the same agent or the same drug class; minimum duration 5 days",
)

add(
    slug="r06-ldct-remote-quit",
    domain="respiratory-renal",
    subject="pulmonology",
    topic="gap3-lung-cancer-stop-after-15-years",
    task="health-maintenance",
    difficulty=4,
    band="hard",
    scenario="A 70-year-old man smoked one pack daily for 30 years and quit 18 years ago. He has no symptoms and has never had lung-cancer screening. Blood pressure is 136/78 mm Hg and pulse is 70/min. Oxygen saturation is 97 percent. Hemoglobin is 14.2 g/dL. He requests the scan his neighbor receives.",
    question="Which of the following is the most appropriate screening plan?",
    options=[
        "No low-dose CT, because he quit 18 years ago",
        "Annual low-dose CT starting this year",
        "One chest radiograph, then annual CT",
        "Sputum cytology each 6 months",
    ],
    correct="No low-dose CT, because he quit 18 years ago",
    why="USPSTF screening stops once a person has not smoked for 15 years. Eighteen years exceeds that limit even though his age and pack-years would otherwise qualify.",
    wrongs={
        "Annual low-dose CT starting this year": "annual CT applies to people who still smoke or who quit within 15 years.",
        "One chest radiograph, then annual CT": "radiography is not the screen, and he is past the quit-time window.",
        "Sputum cytology each 6 months": "cytology is not the recommended strategy.",
    },
    principle="Lung-cancer screening with low-dose CT is not started, and is discontinued, after 15 years without smoking.",
    label="USPSTF. Lung cancer: screening.",
    url=LUNG,
    citation="USPSTF: discontinue LDCT once the person has not smoked for 15 years",
)

add(
    slug="r07-anti-gbm",
    domain="respiratory-renal",
    subject="nephrology",
    topic="gap3-anti-gbm-plex",
    task="pharmacotherapy",
    difficulty=5,
    band="hard",
    scenario="A 24-year-old man has hemoptysis and tea-colored urine for 4 days. Creatinine has risen from 0.9 to 3.8 mg/dL. Blood pressure is 150/92 mm Hg and pulse is 104/min. Hemoglobin is 9.6 g/dL. Urinalysis shows red-cell casts. Anti-GBM antibody is positive and ANCA is negative. Chest imaging shows alveolar hemorrhage.",
    question="Which of the following is the most appropriate initial regimen?",
    options=[
        "Plasma exchange, cyclophosphamide, and corticosteroids",
        "Corticosteroids alone",
        "Antibiotics for presumed pneumonia",
        "Observation until the creatinine exceeds 6 mg/dL",
    ],
    correct="Plasma exchange, cyclophosphamide, and corticosteroids",
    why="pulmonary hemorrhage plus rapidly progressive glomerulonephritis with anti-GBM antibody is anti-GBM disease. Standard initial therapy, as reviewed for this disease, is plasmapheresis to remove antibody plus cyclophosphamide and corticosteroids to stop further production and inflammation.",
    wrongs={
        "Corticosteroids alone": "steroids without plasma exchange and cyclophosphamide do not remove circulating antibody or adequately halt production.",
        "Antibiotics for presumed pneumonia": "hemoptysis with red-cell casts and a positive anti-GBM antibody is not community pneumonia.",
        "Observation until the creatinine exceeds 6 mg/dL": "delay allows irreversible glomerular loss.",
    },
    principle="Anti-GBM disease with lung hemorrhage is treated at once with plasma exchange, cyclophosphamide, and corticosteroids.",
    label="McAdoo SP, Pusey CD. Anti–glomerular basement membrane disease. Clin J Am Soc Nephrol.",
    url=GBM,
    citation="Anti-GBM review: plasmapheresis plus cyclophosphamide and corticosteroids",
)

add(
    slug="r08-cap-comorbidity",
    domain="respiratory-renal",
    subject="pulmonology",
    topic="gap3-cap-outpatient-comorbidity",
    task="pharmacotherapy",
    difficulty=4,
    band="hard",
    scenario="A 68-year-old man with COPD and diabetes has cough, fever, and a focal infiltrate. He is well enough for home. Blood pressure is 132/78 mm Hg, pulse is 98/min, and oxygen saturation is 95 percent on room air. Creatinine is 1.1 mg/dL. He has no MRSA or Pseudomonas risk. He has taken no antibiotic this month.",
    question="Which of the following is the most appropriate outpatient regimen?",
    options=[
        "A beta-lactam plus a macrolide",
        "Amoxicillin as a single drug",
        "Vancomycin plus piperacillin-tazobactam",
        "Metronidazole as a single drug",
    ],
    correct="A beta-lactam plus a macrolide",
    why="ATS/IDSA 2019 recommends combination therapy for outpatients with comorbidities such as COPD or diabetes: a beta-lactam plus a macrolide, or a beta-lactam plus doxycycline. Amoxicillin monotherapy is the regimen for patients without those comorbidities.",
    wrongs={
        "Amoxicillin as a single drug": "monotherapy with amoxicillin is for healthy outpatients, not for COPD and diabetes.",
        "Vancomycin plus piperacillin-tazobactam": "that breadth is not indicated without MRSA or Pseudomonas risk, and it is not an outpatient regimen.",
        "Metronidazole as a single drug": "anaerobic monotherapy is not recommended outpatient coverage.",
    },
    principle="Outpatients with community-acquired pneumonia and cardiopulmonary or diabetic comorbidity receive combination therapy, not amoxicillin alone.",
    label="Metlay JP, et al. Diagnosis and treatment of adults with community-acquired pneumonia. Am J Respir Crit Care Med. 2019.",
    url=CAP,
    citation="ATS/IDSA 2019: comorbidity outpatient regimens are a beta-lactam plus a macrolide or doxycycline",
)

add(
    slug="r09-cap-five-days",
    domain="respiratory-renal",
    subject="pulmonology",
    topic="gap3-cap-duration-five-days",
    task="pharmacotherapy",
    difficulty=4,
    band="hard",
    scenario="A 62-year-old woman was admitted with nonsevere community-acquired pneumonia and treated with ceftriaxone plus azithromycin. On day 5 she has been afebrile for 48 hours, is eating, and oxygen saturation is 97 percent on room air. Blood pressure is 124/74 mm Hg and pulse is 78/min. Leukocyte count is 8,200/μL. There is no empyema.",
    question="Which of the following is the most appropriate antibiotic duration?",
    options=[
        "Stop antibiotics at 5 days",
        "Continue intravenous antibiotics through day 14",
        "Stop after 3 days of antibiotics",
        "Add vancomycin for days 5 through 14",
    ],
    correct="Stop antibiotics at 5 days",
    why="ATS/IDSA 2019 recommends a minimum of 5 days, and states that 5 days is appropriate for most patients who have reached clinical stability. She is stable and has completed that minimum. Extending to 14 days is not required.",
    wrongs={
        "Continue intravenous antibiotics through day 14": "a 14-day course is longer than the duration recommended for uncomplicated recovery.",
        "Stop after 3 days of antibiotics": "the guideline recommends a minimum of 5 days even if stability occurs earlier.",
        "Add vancomycin for days 5 through 14": "there is no MRSA risk or treatment failure to justify adding vancomycin.",
    },
    principle="Uncomplicated community-acquired pneumonia is treated for 5 days once the patient is clinically stable, not for a routine 14-day course.",
    label="Metlay JP, et al. Diagnosis and treatment of adults with community-acquired pneumonia. Am J Respir Crit Care Med. 2019.",
    url=CAP,
    citation="ATS/IDSA 2019: minimum 5 days, and 5 days is appropriate for most patients who reach clinical stability",
)

# Cardiovascular
add(
    slug="c01-aaa-screen",
    domain="cardiovascular",
    subject="cardiology",
    topic="gap3-aaa-screen-ever-smoker",
    task="health-maintenance",
    difficulty=2,
    band="easy",
    scenario="A 68-year-old man smoked for 20 years and quit at age 50. He has no abdominal symptoms. Blood pressure is 136/82 mm Hg and pulse is 72/min. Creatinine is 1.0 mg/dL. He has never had aortic imaging. He asks about aneurysm screening.",
    question="Which of the following is the most appropriate screening plan?",
    options=[
        "One-time abdominal ultrasound",
        "No aneurysm screening after he quit",
        "Annual CT angiography of the aorta",
        "A plain abdominal radiograph instead",
    ],
    correct="One-time abdominal ultrasound",
    why="the USPSTF recommends one-time ultrasound screening for abdominal aortic aneurysm in men aged 65 to 75 years who have ever smoked. Former smoking still counts.",
    wrongs={
        "No aneurysm screening after he quit": "ever smoking, not current smoking, is the criterion.",
        "Annual CT angiography of the aorta": "screening is a one-time ultrasound, not yearly CT.",
        "A plain abdominal radiograph instead": "radiography is not the recommended screening test.",
    },
    principle="Men aged 65 to 75 years who have ever smoked receive one-time ultrasound screening for abdominal aortic aneurysm.",
    label="USPSTF. Abdominal aortic aneurysm: screening.",
    url=AAA,
    citation="USPSTF grade B: one-time ultrasound for men 65–75 who have ever smoked",
)

add(
    slug="c02-statin",
    domain="cardiovascular",
    subject="cardiology",
    topic="gap3-statin-primary-prevention",
    task="pharmacotherapy",
    difficulty=2,
    band="easy",
    scenario="A 58-year-old man smokes and has an LDL cholesterol of 158 mg/dL. His estimated 10-year cardiovascular risk is 14 percent. He has no known atherosclerotic disease. Blood pressure is 128/78 mm Hg and pulse is 76/min. ALT is 24 U/L and creatinine is 0.9 mg/dL. He is not on a statin.",
    question="Which of the following is the most appropriate preventive medicine?",
    options=[
        "Start a statin",
        "Start aspirin 81 mg instead of a statin",
        "No lipid drug, because he has no prior infarct",
        "Start gemfibrozil as the first lipid drug",
    ],
    correct="Start a statin",
    why="the USPSTF recommends a statin for primary prevention in adults aged 40 to 75 years who have at least one cardiovascular risk factor, here smoking and dyslipidemia, and a 10-year risk of at least 10 percent.",
    wrongs={
        "Start aspirin 81 mg instead of a statin": "aspirin is not a substitute for indicated statin therapy, and starting aspirin at older ages is a separate, often unfavorable, decision.",
        "No lipid drug, because he has no prior infarct": "the recommendation is for primary prevention, before a first event.",
        "Start gemfibrozil as the first lipid drug": "a fibrate is not the recommended first preventive drug for this risk profile.",
    },
    principle="Adults 40 to 75 years old with a cardiovascular risk factor and a 10-year risk of at least 10 percent are prescribed a statin for primary prevention.",
    label="USPSTF. Statin use for the primary prevention of cardiovascular disease in adults.",
    url=STATIN,
    citation="USPSTF grade B: statin if age 40–75, at least one CVD risk factor, and 10-year risk ≥10%",
)

add(
    slug="c03-ms-warfarin",
    domain="cardiovascular",
    subject="cardiology",
    topic="gap3-af-mitral-stenosis-warfarin",
    task="pharmacotherapy",
    difficulty=3,
    band="medium",
    scenario="A 62-year-old woman has atrial fibrillation and moderate-to-severe rheumatic mitral stenosis. She has no bleeding history. Blood pressure is 130/78 mm Hg and pulse is 92/min. Creatinine is 0.8 mg/dL and hemoglobin is 12.6 g/dL. A clinician suggests apixaban because it is easier than warfarin.",
    question="Which of the following is the most appropriate anticoagulant?",
    options=[
        "Warfarin",
        "Apixaban",
        "Aspirin 81 mg daily",
        "No antithrombotic drug",
    ],
    correct="Warfarin",
    why="the 2023 atrial fibrillation guideline states that warfarin remains first-line therapy for atrial fibrillation with moderate-to-severe rheumatic mitral stenosis or a mechanical valve.",
    wrongs={
        "Apixaban": "direct oral anticoagulants are not the first-line regimen for moderate-to-severe rheumatic mitral stenosis.",
        "Aspirin 81 mg daily": "an antiplatelet drug does not provide the anticoagulation this valve lesion requires.",
        "No antithrombotic drug": "rheumatic mitral stenosis with atrial fibrillation has a high embolic risk and is not left untreated.",
    },
    principle="Atrial fibrillation with moderate-to-severe rheumatic mitral stenosis is anticoagulated with warfarin.",
    label="2023 ACC/AHA/ACCP/HRS guideline for the diagnosis and management of atrial fibrillation.",
    url=AF,
    citation="2023 AF guideline: warfarin remains first-line for moderate-to-severe rheumatic mitral stenosis",
)

add(
    slug="c04-type-b-dissection",
    domain="cardiovascular",
    subject="cardiology",
    topic="gap3-type-b-dissection-medical",
    task="pharmacotherapy",
    difficulty=3,
    band="medium",
    scenario="A 64-year-old man has sudden tearing back pain. CT angiography shows a descending aortic dissection beginning distal to the left subclavian artery. There is no malperfusion, no rupture, and the pain is easing. Blood pressure is 168/96 mm Hg and pulse is 108/min. Creatinine is 1.0 mg/dL. He is not a surgical emergency on the images.",
    question="Which of the following is the most appropriate initial plan?",
    options=[
        "Intravenous esmolol and blood-pressure control",
        "Emergency open replacement of the ascending aorta",
        "Intravenous thrombolysis for presumed stroke",
        "Nitroprusside alone, without a beta blocker",
    ],
    correct="Intravenous esmolol and blood-pressure control",
    why="this is an uncomplicated type B dissection. The 2022 ACC/AHA aortic guideline uses intravenous beta blockers such as esmolol, with vasodilators added as needed, to lower heart rate and blood pressure and reduce aortic wall stress. Emergency open ascending repair is the operation for type A disease.",
    wrongs={
        "Emergency open replacement of the ascending aorta": "the ascending aorta is not the dissected segment, and uncomplicated type B disease is not treated with emergency open ascending repair.",
        "Intravenous thrombolysis for presumed stroke": "thrombolysis is contraindicated in aortic dissection and there is no stroke syndrome.",
        "Nitroprusside alone, without a beta blocker": "a vasodilator alone can raise heart rate and shear force; a beta blocker is part of the initial regimen.",
    },
    principle="Uncomplicated type B aortic dissection is initially managed with intravenous beta blockade and blood-pressure control, not emergency open ascending repair.",
    label="2022 ACC/AHA guideline for the diagnosis and management of aortic disease.",
    url=AORTA,
    citation="2022 ACC/AHA aortic guideline: intravenous beta blockers such as esmolol, with vasodilators, to reduce heart rate and blood pressure in acute dissection",
)

add(
    slug="c05-af-doac",
    domain="cardiovascular",
    subject="cardiology",
    topic="gap3-af-nonvalvular-doac",
    task="pharmacotherapy",
    difficulty=3,
    band="medium",
    scenario="A 76-year-old man has new atrial fibrillation. Echocardiography shows a normal mitral valve and no mechanical prosthesis. CHA2DS2-VASc score is 4. Blood pressure is 138/80 mm Hg and pulse is 110/min. Creatinine is 1.0 mg/dL and hemoglobin is 14.2 g/dL. He has no bleeding history.",
    question="Which of the following is the most appropriate stroke prevention?",
    options=[
        "Apixaban",
        "Aspirin alone",
        "Clopidogrel alone",
        "No antithrombotic therapy",
    ],
    correct="Apixaban",
    why="this is nonvalvular atrial fibrillation with a CHA2DS2-VASc score of 4. The 2023 guideline supports oral anticoagulation rather than antiplatelet therapy or no therapy, and direct oral anticoagulants are used when there is no moderate-to-severe rheumatic mitral stenosis and no mechanical valve.",
    wrongs={
        "Aspirin alone": "antiplatelet therapy does not provide the stroke prevention indicated at this score.",
        "Clopidogrel alone": "another antiplatelet drug is not a substitute for anticoagulation.",
        "No antithrombotic therapy": "a score of 4 is not a group in which anticoagulation is omitted.",
    },
    principle="Nonvalvular atrial fibrillation with an elevated stroke score is treated with a direct oral anticoagulant when no contraindication is present.",
    label="2023 ACC/AHA/ACCP/HRS guideline for the diagnosis and management of atrial fibrillation.",
    url=AF,
    citation="2023 AF guideline: oral anticoagulation for elevated stroke risk; DOACs when rheumatic mitral stenosis and mechanical valves are absent",
)

add(
    slug="c06-type-a-dissection",
    domain="cardiovascular",
    subject="cardiology",
    topic="gap3-type-a-dissection-surgery",
    task="clinical-intervention",
    difficulty=5,
    band="hard",
    scenario="A 58-year-old man has sudden tearing chest pain radiating to the back. CT shows a dissection flap in the ascending aorta. Blood pressure is 178/100 mm Hg and pulse is 118/min. Creatinine is 1.1 mg/dL. He has no neurologic deficit. The cardiac surgery team is in the hospital.",
    question="Which of the following is the most appropriate plan?",
    options=[
        "Emergency operative repair and intravenous esmolol",
        "Intravenous esmolol and a plan to operate next week",
        "Thrombolysis, because the pain may be infarction",
        "Nitroprusside alone and discharge if pain eases",
    ],
    correct="Emergency operative repair and intravenous esmolol",
    why="ascending aortic dissection is a surgical emergency. While the operating room is prepared, the 2022 aortic guideline uses intravenous beta blockers such as esmolol to lower heart rate and wall stress. Waiting a week or giving thrombolysis is not appropriate.",
    wrongs={
        "Intravenous esmolol and a plan to operate next week": "type A dissection is not electively delayed for a week.",
        "Thrombolysis, because the pain may be infarction": "thrombolysis is contraindicated when dissection has been imaged.",
        "Nitroprusside alone and discharge if pain eases": "a vasodilator without beta blockade can increase shear, and discharge is unsafe.",
    },
    principle="Acute type A aortic dissection is treated with emergency surgery and immediate intravenous heart-rate control.",
    label="2022 ACC/AHA guideline for the diagnosis and management of aortic disease.",
    url=AORTA,
    citation="2022 ACC/AHA aortic guideline: intravenous beta blockade to reduce wall stress; type A disease requires emergency operative repair",
)

add(
    slug="c07-no-aspirin-60",
    domain="cardiovascular",
    subject="cardiology",
    topic="gap3-aspirin-primary-prevention-age-60",
    task="health-maintenance",
    difficulty=4,
    band="hard",
    scenario="A 64-year-old woman has never had a heart attack, stroke, or stent. Her 10-year cardiovascular risk is 15 percent. She does not take aspirin and has no bleeding history. Blood pressure is 128/76 mm Hg and pulse is 70/min. Hemoglobin is 13.6 g/dL and creatinine is 0.8 mg/dL. She asks about starting low-dose aspirin to prevent a first event.",
    question="Which of the following is the most appropriate advice?",
    options=[
        "Do not start aspirin for primary prevention",
        "Start aspirin 81 mg daily",
        "Start aspirin 325 mg daily",
        "Start aspirin plus clopidogrel",
    ],
    correct="Do not start aspirin for primary prevention",
    why="the USPSTF recommends against initiating low-dose aspirin for primary prevention of cardiovascular disease in adults 60 years or older. Her age places her in that grade D group even though her risk estimate is elevated.",
    wrongs={
        "Start aspirin 81 mg daily": "initiating aspirin at age 64 for primary prevention is what the recommendation advises against.",
        "Start aspirin 325 mg daily": "a higher dose does not overcome the recommendation against starting aspirin.",
        "Start aspirin plus clopidogrel": "dual therapy adds bleeding and is not primary prevention.",
    },
    principle="Low-dose aspirin is not started for primary prevention of cardiovascular disease at age 60 years or older.",
    label="USPSTF. Aspirin use to prevent cardiovascular disease: preventive medication.",
    url=ASA,
    citation="USPSTF grade D: against initiating low-dose aspirin for primary prevention in adults 60 years or older",
)

# Reproductive-endocrine
add(
    slug="e01-gdm-screen-timing",
    domain="reproductive-endocrine",
    subject="obgyn",
    topic="gap3-gdm-screen-timing",
    task="health-maintenance",
    difficulty=2,
    band="easy",
    scenario="A 29-year-old woman at 16 weeks of gestation has no history of diabetes. She feels well. Blood pressure is 112/68 mm Hg and pulse is 82/min. A random glucose is 96 mg/dL and hemoglobin is 12.0 g/dL. She asks whether gestational diabetes screening should be done at this visit.",
    question="Which of the following is the most appropriate screening plan?",
    options=[
        "Defer routine screening until 24 weeks or later",
        "Perform a glucose tolerance test today",
        "Start insulin without a glucose test",
        "Wait for symptoms before any glucose test",
    ],
    correct="Defer routine screening until 24 weeks or later",
    why="the USPSTF recommends screening for gestational diabetes in asymptomatic pregnant persons at 24 weeks of gestation or after, and finds the evidence insufficient to assess screening before 24 weeks.",
    wrongs={
        "Perform a glucose tolerance test today": "routine screening is recommended at 24 weeks or later, not at 16 weeks in an asymptomatic person.",
        "Start insulin without a glucose test": "treatment is not started without a diagnosis.",
        "Wait for symptoms before any glucose test": "screening is recommended later in pregnancy even if she remains asymptomatic.",
    },
    principle="Asymptomatic pregnant patients are screened for gestational diabetes at 24 weeks or later, not routinely before then.",
    label="USPSTF. Gestational diabetes: screening.",
    url="https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/gestational-diabetes-screening",
    citation="USPSTF: screen asymptomatic pregnant persons at 24 weeks or after; evidence is insufficient before 24 weeks",
)

add(
    slug="e02-thyroid-no-screen",
    domain="reproductive-endocrine",
    subject="endocrinology",
    topic="gap3-thyroid-screen-insufficient",
    task="health-maintenance",
    difficulty=2,
    band="easy",
    scenario="A 40-year-old woman feels well at a preventive visit. She has no neck symptoms, no weight change, and no family history of thyroid disease. Blood pressure is 118/74 mm Hg and pulse is 72/min. She is not pregnant. Hemoglobin is 13.2 g/dL. She asks for a routine thyroid blood test.",
    question="Which of the following is the most appropriate plan?",
    options=[
        "No routine TSH screening",
        "Annual TSH measurement",
        "Thyroid ultrasound this year",
        "Empiric levothyroxine without a test",
    ],
    correct="No routine TSH screening",
    why="the USPSTF concludes that evidence is insufficient to assess the balance of benefits and harms of screening for thyroid dysfunction in nonpregnant, asymptomatic adults. Routine TSH screening is not recommended on that basis.",
    wrongs={
        "Annual TSH measurement": "a standing annual TSH is population screening, which the USPSTF does not recommend.",
        "Thyroid ultrasound this year": "imaging is not a screening test for asymptomatic thyroid dysfunction.",
        "Empiric levothyroxine without a test": "hormone therapy is not started in a person with no symptoms and no diagnosis.",
    },
    principle="Nonpregnant asymptomatic adults are not routinely screened for thyroid dysfunction, because evidence is insufficient.",
    label="USPSTF. Thyroid dysfunction: screening.",
    url="https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/thyroid-dysfunction-screening",
    citation="USPSTF I statement: insufficient evidence to screen nonpregnant asymptomatic adults for thyroid dysfunction",
)

add(
    slug="e03-pheo-alpha",
    domain="reproductive-endocrine",
    subject="endocrinology",
    topic="gap3-pheo-alpha-blockade",
    task="pharmacotherapy",
    difficulty=3,
    band="medium",
    scenario="A 48-year-old man has paroxysmal headache, palpitations, and hypertension. Plasma metanephrines are several times the upper limit. CT shows a 4-cm adrenal mass. Blood pressure today is 168/98 mm Hg and pulse is 92/min. Creatinine is 0.9 mg/dL. Surgery is planned in 2 weeks. He is on no antihypertensive drug.",
    question="Which of the following is the most appropriate preoperative medicine to start first?",
    options=[
        "Phenoxybenzamine",
        "Propranolol before any alpha blocker",
        "Hydrochlorothiazide as the sole drug",
        "No blockade, because surgery is soon",
    ],
    correct="Phenoxybenzamine",
    why="a clinician review of preoperative blockade describes phenoxybenzamine, a nonselective alpha blocker, as the drug used to limit intraoperative pressure surges and to allow volume restoration before beta blockade or surgery.",
    wrongs={
        "Propranolol before any alpha blocker": "beta blockade first can leave alpha constriction unopposed and worsen hypertension.",
        "Hydrochlorothiazide as the sole drug": "a diuretic does not provide alpha blockade and can worsen volume contraction.",
        "No blockade, because surgery is soon": "operating on an unblocked pheochromocytoma risks hypertensive crisis.",
    },
    principle="Pheochromocytoma is prepared for surgery with alpha blockade, such as phenoxybenzamine, before a beta blocker.",
    label="Role of preoperative blockade in pheochromocytoma–paraganglioma: a clinician's perspective.",
    url=PHEO,
    citation="Preoperative blockade review: phenoxybenzamine is used before surgery to control pressure surges",
)

add(
    slug="e04-myxedema",
    domain="reproductive-endocrine",
    subject="endocrinology",
    topic="gap3-myxedema-hydrocortisone",
    task="pharmacotherapy",
    difficulty=3,
    band="medium",
    scenario="A 72-year-old woman is brought in unresponsive. Temperature is 34.2°C. Blood pressure is 78/50 mm Hg and pulse is 48/min. TSH is 86 mIU/L and free T4 is undetectable. Glucose is 58 mg/dL and sodium is 128 mEq/L. There is periorbital edema. A cortisol level is pending.",
    question="Which of the following is the most appropriate initial endocrine treatment?",
    options=[
        "Intravenous hydrocortisone plus intravenous levothyroxine",
        "Intravenous levothyroxine and no glucocorticoid",
        "Oral liothyronine after she wakes",
        "Methimazole for presumed thyroid storm",
    ],
    correct="Intravenous hydrocortisone plus intravenous levothyroxine",
    why="hypothermia, bradycardia, hypotension, and a very high TSH with undetectable free T4 are myxedema coma. A review of the crisis states that hydrocortisone is required when adrenal insufficiency may coexist and the patient is hypotensive, along with thyroid hormone replacement.",
    wrongs={
        "Intravenous levothyroxine and no glucocorticoid": "thyroid hormone without glucocorticoid coverage can precipitate adrenal crisis if cortisol reserve is low.",
        "Oral liothyronine after she wakes": "oral therapy after awakening delays treatment of coma.",
        "Methimazole for presumed thyroid storm": "the laboratories show profound hypothyroidism, not thyrotoxicosis.",
    },
    principle="Myxedema coma with hypotension is treated with intravenous thyroid hormone and intravenous glucocorticoid coverage.",
    label="Mathew V, et al. Myxedema coma: a new look into an old crisis. J Thyroid Res.",
    url=MYX,
    citation="Myxedema coma review: hydrocortisone for possible adrenal insufficiency and hypotension, plus thyroid hormone",
)

add(
    slug="e05-dka-k-high-start-insulin",
    domain="reproductive-endocrine",
    subject="endocrinology",
    topic="gap3-dka-insulin-when-potassium-high",
    task="pharmacotherapy",
    difficulty=5,
    band="hard",
    scenario="A 22-year-old woman with type 1 diabetes has vomiting and Kussmaul breathing. Glucose is 510 mg/dL, bicarbonate is 8 mEq/L, and the anion gap is 26. Potassium is 5.4 mEq/L. Blood pressure is 110/68 mm Hg and pulse is 118/min. She has received a liter of saline. A colleague wants to withhold insulin until more potassium is infused.",
    question="Which of the following is the most appropriate next step?",
    options=[
        "Start intravenous insulin now",
        "Hold insulin until extra potassium is given",
        "Give sodium bicarbonate before insulin",
        "Discharge on subcutaneous insulin alone",
    ],
    correct="Start intravenous insulin now",
    why="the ADA hyperglycemic-crisis statement delays insulin only until potassium is above 3.3 mEq/L. Her potassium is 5.4 mEq/L, so insulin should start. Potassium is added to fluids later as the level falls, not before the first insulin.",
    wrongs={
        "Hold insulin until extra potassium is given": "that delay is for potassium at or below 3.3 mEq/L, not for a level of 5.4 mEq/L.",
        "Give sodium bicarbonate before insulin": "bicarbonate is not the next step, and its use in diabetic ketoacidosis is controversial.",
        "Discharge on subcutaneous insulin alone": "severe ketoacidosis is not discharged on subcutaneous insulin alone.",
    },
    principle="In diabetic ketoacidosis, insulin is delayed only when potassium is 3.3 mEq/L or lower; a high-normal or high potassium does not postpone insulin.",
    label="Kitabchi AE, et al. Hyperglycemic crises in adult patients with diabetes. Diabetes Care.",
    url=DKA,
    citation="ADA hyperglycemic crises: delay insulin until potassium is restored to >3.3 mEq/L",
)
