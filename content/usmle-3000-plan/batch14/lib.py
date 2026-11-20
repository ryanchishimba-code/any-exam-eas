"""Batch 14 constructor and audit checks."""

import hashlib
import re

WEIGHT = {
    "step1": {
        "human-development": 2,
        "blood-lymph-immune": 11,
        "behavioral-nervous": 12,
        "msk-skin": 10,
        "cardiovascular": 9,
        "respiratory-renal": 13,
        "gastrointestinal": 8,
        "reproductive-endocrine": 14,
        "multisystem": 10,
        "biostats-epi": 5,
        "social-sciences": 7.5,
    },
    "step2": {
        "human-development": 3,
        "blood-lymph-immune": 7.5,
        "behavioral-nervous": 12.5,
        "msk-skin": 9,
        "cardiovascular": 9,
        "respiratory-renal": 15,
        "gastrointestinal": 7.5,
        "reproductive-endocrine": 10,
        "multisystem": 6,
        "biostats-epi": 4,
        "social-sciences": 12.5,
    },
}

CITE = {
    "langman": "Sadler TW. Langman's Medical Embryology. 15th ed. Wolters Kluwer; 2023.",
    "moore": "Dalley AF, Agur AMR. Moore's Clinically Oriented Anatomy. 9th ed. Wolters Kluwer; 2023.",
    "robbins": "Kumar V, Abbas AK, Aster JC. Robbins and Cotran Pathologic Basis of Disease. 10th ed. Elsevier; 2021.",
    "harrison": "Loscalzo J, Fauci AS, Kasper DL, Hauser SL, Longo DL, Jameson JL, eds. Harrison's Principles of Internal Medicine. 21st ed. McGraw Hill; 2022.",
    "katzung": "Katzung BG, Vanderah TW. Basic and Clinical Pharmacology. 15th ed. McGraw Hill; 2021.",
    "guyton": "Hall JE, Hall ME. Guyton and Hall Textbook of Medical Physiology. 14th ed. Elsevier; 2021.",
    "abbas": "Abbas AK, Lichtman AH, Pillai S. Cellular and Molecular Immunology. 10th ed. Elsevier; 2021.",
    "jawetz": "Riedel S, Hobden JA, Miller S, et al. Jawetz, Melnick, and Adelberg's Medical Microbiology. 28th ed. McGraw Hill; 2019.",
    "lehninger": "Nelson DL, Cox MM. Lehninger Principles of Biochemistry. 8th ed. W. H. Freeman; 2021.",
    "users": "Guyatt G, Rennie D, Meade MO, Cook DJ. Users' Guides to the Medical Literature. 3rd ed. McGraw Hill; 2015.",
    "ama": "American Medical Association. Code of Medical Ethics. Chicago: AMA; 2017.",
    "hf": "Heidenreich PA, et al. 2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure. Circulation. 2022.",
    "acs": "Rao SV, et al. 2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes. Circulation. 2025.",
    "htn": "Jones DW, et al. 2025 AHA/ACC Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults. Circulation. 2025.",
    "af": "Joglar JA, et al. 2023 ACC/AHA/ACCP/HRS Guideline for the Diagnosis and Management of Atrial Fibrillation. Circulation. 2024.",
    "valve": "Otto CM, et al. 2020 ACC/AHA Guideline for the Management of Patients With Valvular Heart Disease. Circulation. 2021.",
    "kdigo": "Kidney Disease: Improving Global Outcomes. KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease. Kidney International. 2024.",
    "hpylori": "Chey WD, et al. ACG Clinical Guideline: Treatment of Helicobacter pylori Infection. American Journal of Gastroenterology. 2024.",
    "gerd": "Katz PO, Dunbar KB, Schnoll-Sussman FH, Greer KB, Yadlapati R, Spechler SJ. ACG Clinical Guideline for the Diagnosis and Management of Gastroesophageal Reflux Disease. American Journal of Gastroenterology. 2022.",
    "gib": "Laine L, Barkun AN, Saltzman JR, Martel M, Leontiadis GI. ACG Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding. American Journal of Gastroenterology. 2021.",
    "ada": "American Diabetes Association Professional Practice Committee. Standards of Care in Diabetes—2026. Diabetes Care. 2026.",
    "gina": "Global Initiative for Asthma. Global Strategy for Asthma Management and Prevention. GINA; 2025.",
    "gold": "Global Initiative for Chronic Obstructive Lung Disease. Global Strategy for Prevention, Diagnosis and Management of COPD: 2026 Report.",
    "sti": "Workowski KA, et al. Sexually Transmitted Infections Treatment Guidelines, 2021. MMWR Recommendations and Reports. 2021.",
    "cdiff": "Johnson S, et al. Clinical Practice Guideline by the IDSA and SHEA: 2021 Focused Update Guidelines on Management of Clostridioides difficile Infection in Adults. Clinical Infectious Diseases. 2021.",
    "gout": "FitzGerald JD, et al. 2020 American College of Rheumatology Guideline for the Management of Gout. Arthritis Care and Research. 2020.",
    "cap": "Metlay JP, et al. Diagnosis and Treatment of Adults with Community-acquired Pneumonia. An Official ATS/IDSA Clinical Practice Guideline. American Journal of Respiratory and Critical Care Medicine. 2019.",
    "stroke": "Powers WJ, et al. Guidelines for the Early Management of Patients With Acute Ischemic Stroke: 2019 Update. Stroke. 2019.",
    "sepsis": "Evans L, et al. Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2021. Critical Care Medicine. 2021.",
    "osteo": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures. JAMA. 2025.",
    "crc": "US Preventive Services Task Force. Screening for Colorectal Cancer. JAMA. 2021.",
    "lungca": "US Preventive Services Task Force. Screening for Lung Cancer. JAMA. 2021.",
    "breast": "US Preventive Services Task Force. Screening for Breast Cancer. JAMA. 2024.",
    "cervix": "US Preventive Services Task Force. Screening for Cervical Cancer. JAMA. 2018.",
    "aaa": "US Preventive Services Task Force. Screening for Abdominal Aortic Aneurysm. JAMA. 2019.",
    "preghtn": "American College of Obstetricians and Gynecologists. Practice Bulletin 222: Gestational Hypertension and Preeclampsia. 2020.",
    "aneuploidy": "American College of Obstetricians and Gynecologists. Practice Bulletin 226: Screening for Fetal Chromosomal Abnormalities. 2020.",
    "back": "Qaseem A, et al. Noninvasive Treatments for Acute, Subacute, and Chronic Low Back Pain. American College of Physicians Clinical Guideline. Annals of Internal Medicine. 2017.",
    "imaging": "American College of Radiology. ACR Appropriateness Criteria: Low Back Pain. 2021.",
    "nafld": "Rinella ME, et al. AASLD Practice Guidance on the clinical assessment and management of nonalcoholic fatty liver disease. Hepatology. 2023.",
    "uc": "Rubin DT, Ananthakrishnan AN, Siegel CA, Sauer BG, Long MD. ACG Clinical Guideline: Ulcerative Colitis in Adults. American Journal of Gastroenterology. 2019.",
    "pancreas": "Tenner S, Vege SS, Sheth SG, Sauer B, Yang A, Conwell DL. American College of Gastroenterology Guidelines: Management of Acute Pancreatitis. American Journal of Gastroenterology. 2024.",
    "dvt": "Stevens SM, et al. Antithrombotic Therapy for VTE Disease: Second Update of the CHEST Guideline. Chest. 2021.",
    "endocarditis": "Baddour LM, et al. Infective Endocarditis in Adults. AHA Scientific Statement. Circulation. 2015.",
}

MALE = re.compile(r"\b(she|her|hers|woman|women|girl|girls)\b", re.I)
FEMALE = re.compile(r"\b(he|him|his|man|men|boy|boys)\b", re.I)
THEY = re.compile(r"\b(they|them|their|theirs)\b", re.I)
STRAW = re.compile(r"\b(never|every|always|banned|illegal|impossible|forbidden|irrelevant)\b", re.I)
TEMPLATE = ("mechanism can be named", "here for the mechanism", "in front of the clinician", "only to answer the mechanism")
STOP = set(
    "patient because which their there these those after before within without through during should would could about where while being been have has had does this that with from they them than then into over under every never always other another years year old woman man".split()
)


def content_words(text):
    return {w for w in re.findall(r"[a-z]{7,}", text.lower()) if w not in STOP}


def fingerprint(scenario, question):
    text = f"{scenario} {question}".lower()
    text = re.sub(r"\b\d+\s*-?\s*(?:year|month)-?\s*old\b", "patient", text)
    text = re.sub(r"\b\d+(?:\.\d+)?\b", "", text)
    text = re.sub(r"[^a-z\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text[:180]


def content_hash(field_id, subject_id, scenario, question):
    raw = f"{field_id}|{subject_id}|{scenario.strip().lower()}|{question.strip().lower()}"
    return hashlib.sha256(raw.encode()).hexdigest()


class ItemError(Exception):
    pass


def build(n, step, sex, system, topic, diff, subject, cite_key, takeaway, scenario, question, correct, wrongs):
    if cite_key not in CITE:
        raise ItemError(f"{n}: unknown cite {cite_key}")
    if system not in WEIGHT[step]:
        raise ItemError(f"{n}: system {system}")
    if sex not in ("m", "f") or diff not in (2, 3, 4) or len(wrongs) != 4:
        raise ItemError(f"{n}: shape")
    citation = CITE[cite_key]
    scenario = re.sub(r"\s+", " ", scenario).strip()
    question = re.sub(r"\s+", " ", question).strip()
    takeaway = re.sub(r"\s+", " ", takeaway).strip()
    key, key_why = correct[0].strip(), re.sub(r"\s+", " ", correct[1]).strip()
    wrongs = [(a.strip(), re.sub(r"\s+", " ", b).strip()) for a, b in wrongs]
    blob = " ".join([scenario, question, key, key_why, takeaway, *[x for w in wrongs for x in w]])
    prefix = f"b14-s1-{n:02d}" if step == "step1" else f"b14-s2-{n:02d}"
    if THEY.search(blob):
        raise ItemError(f"{prefix}: they/them")
    if sex == "m" and MALE.search(blob):
        raise ItemError(f"{prefix}: female word {MALE.search(blob).group()}")
    if sex == "f" and FEMALE.search(blob):
        raise ItemError(f"{prefix}: male word {FEMALE.search(blob).group()}")
    if sex == "m" and not re.search(r"\b(he|him|his)\b", scenario, re.I):
        raise ItemError(f"{prefix}: male stem has no he/him/his")
    if sex == "f" and not re.search(r"\b(she|her)\b", scenario, re.I):
        raise ItemError(f"{prefix}: female stem has no she/her")
    if any(p in (scenario + " " + question).lower() for p in TEMPLATE):
        raise ItemError(f"{prefix}: template stem")
    if " and " not in question.lower():
        raise ItemError(f"{prefix}: question is not two-step")
    if len(scenario) < 90 or not re.search(r"\b(?:year|month)-old\b", scenario) or not re.search(r"\d", scenario):
        raise ItemError(f"{prefix}: thin vignette")
    if len(takeaway) < 40 or not re.search(r"\b(?:19|20)\d{2}\b", citation):
        raise ItemError(f"{prefix}: takeaway or year")
    texts = [key] + [w[0] for w in wrongs]
    if len(set(t.lower() for t in texts)) != 5 or any(len(t) < 12 for t in texts):
        raise ItemError(f"{prefix}: options")
    if any(STRAW.search(t) for t in texts):
        raise ItemError(f"{prefix}: absolute wording in an option")
    others = [t for t in texts if t != key]
    if len(key) > max(len(t) for t in others):
        raise ItemError(f"{prefix}: key is longest ({len(key)}>{max(len(t) for t in others)})")
    if key.lower() in scenario.lower():
        raise ItemError(f"{prefix}: key pasted into the stem")
    shared = content_words(key) & content_words(scenario + " " + question)
    if len(shared) >= 2:
        raise ItemError(f"{prefix}: overlap {sorted(shared)}")
    if takeaway.lower() not in key_why.lower():
        key_why = takeaway + " " + key_why
    paragraph = f"{key_why} {citation}"
    for text, _why in wrongs:
        if len(text) >= 20 and text.lower() in paragraph.lower():
            raise ItemError(f"{prefix}: distractor leaked into the paragraph")
        if len(text) >= 24 and text.lower() in _why.lower():
            raise ItemError(f"{prefix}: why repeats the option")
        if len(_why) < 20:
            raise ItemError(f"{prefix}: thin distractor line")
    lines = [paragraph, "", key]
    for text, why in wrongs:
        lines.append(f"{text} — {why}")
    explanation = "\n".join(lines)
    field = "usmle-step-1" if step == "step1" else "usmle-step-2"
    slot = (n - 1) % 5
    ordered = []
    wi = 0
    for i in range(5):
        if i == slot:
            ordered.append(key)
        else:
            ordered.append(wrongs[wi][0])
            wi += 1
    return {
        "id": prefix,
        "fieldId": field,
        "stepLevel": step,
        "outlineSystem": system,
        "outlineWeight": WEIGHT[step][system],
        "blueprintTopic": topic,
        "blueprintDomain": system,
        "difficulty": diff,
        "subjectId": subject,
        "examTakeaway": takeaway,
        "scenario": scenario,
        "question": question,
        "options": ordered,
        "correctAnswer": key,
        "explanation": explanation,
        "citation": citation,
        "sex": sex,
    }
