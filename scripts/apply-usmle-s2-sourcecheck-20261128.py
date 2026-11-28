#!/usr/bin/env python3
"""Apply the 2026-11-28 source-check fixes to the hidden Step 2 rows.

Reads /tmp/s2-items.json (export of source s2-new-20261121-hidden).
Writes /tmp/s2-fixed.json. Does not touch the database.
"""

from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

ROOT = Path("/agent/repos/any-exam-eas")
REPORTS = [
    Path("/home/ubuntu/.cursor/projects/agent-repos-any-exam-eas/uploads/source-check-batch01_4191.md"),
    Path("/home/ubuntu/.cursor/projects/agent-repos-any-exam-eas/uploads/source-check-batch02_6e7a.md"),
    Path("/home/ubuntu/.cursor/projects/agent-repos-any-exam-eas/uploads/source-check-batch03_d4dc.md"),
    Path("/home/ubuntu/.cursor/projects/agent-repos-any-exam-eas/uploads/source-check-batch04_ed54.md"),
]

PADS = [
    " at this encounter",
    " during today's visit",
    " before the patient leaves",
    " in the office today",
    " at the present visit",
    " for this patient",
    " during this visit",
    " at this visit",
]

GINA = (
    "Global Initiative for Asthma. Global Strategy for Asthma Management and Prevention, 2024.",
    "https://ginasthma.org/wp-content/uploads/2024/05/GINA-2024-Strategy-Report-24_05_22_WMS.pdf",
)
AAA = (
    "US Preventive Services Task Force. Screening for Abdominal Aortic Aneurysm.",
    "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/abdominal-aortic-aneurysm-screening",
)
STATIN = (
    "US Preventive Services Task Force. Statin Use for the Primary Prevention of Cardiovascular Disease in Adults.",
    "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/statin-use-in-adults-preventive-medication",
)
ASA = (
    "US Preventive Services Task Force. Aspirin Use to Prevent Cardiovascular Disease.",
    "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/aspirin-to-prevent-cardiovascular-disease-preventive-medication",
)
SEPSIS = (
    "Society of Critical Care Medicine. Surviving Sepsis Campaign 2021 guidelines.",
    "https://www.sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-guidelines-2021",
)
ADEP = (
    "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Children and Adolescents.",
    "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-children-adolescents",
)
ADA_LABEL = "American Diabetes Association. Standards of Care in Diabetes—2026."


def n_of(item_id: str) -> int:
    return int(item_id[-4:])


def options_of(raw: str) -> tuple[list[str], dict]:
    parsed = json.loads(raw)
    if isinstance(parsed, list):
        return parsed, {"options": parsed, "kind": "vignette", "stepLevel": "step2"}
    return list(parsed["options"]), parsed


def strip_pads(text: str) -> str:
    changed = True
    while changed:
        changed = False
        for pad in PADS:
            if text.lower().endswith(pad):
                text = text[: -len(pad)].rstrip(" ,;")
                changed = True
    return re.sub(r"\s{2,}", " ", text).strip()


def explanation(options: list[str], key: int, whys: list[str]) -> str:
    parts = [whys[key].rstrip(".") + "."]
    for i, option in enumerate(options):
        if i == key:
            continue
        parts.append(f'"{option}" is not the best choice because {whys[i].rstrip(".")}.')
    return " ".join(parts)


def place(options: list[str], whys: list[str], key: int, target: int):
    pairs = list(zip(options, whys))
    held = pairs.pop(key)
    pairs.insert(target, held)
    return [p[0] for p in pairs], [p[1] for p in pairs]


def content_hash(subject: str, scenario: str, question: str) -> str:
    payload = f"usmle-step-2|{subject}|{scenario.strip().lower()}|{question.strip().lower()}"
    return hashlib.sha256(payload.encode()).hexdigest()


def load_citations() -> dict[int, str]:
    found: dict[int, str] = {}
    for path in REPORTS:
        for line in path.read_text().splitlines():
            match = re.search(r"s2n20261121(\d{4}).*cite (https://diabetesjournals\.org/\S+)", line)
            if match:
                found[int(match.group(1))] = match.group(2).rstrip(").,")
    return found


def vignette(age, sex, job, setting, story, t, p, rr, sbp, dbp, data) -> str:
    article = "an" if job[:1].lower() in "aeiou" else "a"
    return (
        f"A {age}-year-old {sex} who works as {article} {job} is in the {setting}. {story} "
        f"Temperature is {t:.1f}°C, pulse is {p}/min, respirations are {rr}/min, "
        f"and blood pressure is {sbp}/{dbp} mm Hg. {data}"
    )


def card(domain, subject, topic, task, diff, src, scenario, stem, options, key, whys):
    if len(options) != 5 or len(whys) != 5 or not 0 <= key <= 4:
        raise SystemExit(f"bad card {topic}")
    label, url = src
    return {
        "domain": domain,
        "subject": subject,
        "topic": topic,
        "task": task,
        "difficulty": diff,
        "scenario": " ".join(scenario.split()),
        "question": " ".join(stem.split()),
        "options": [" ".join(o.split()) for o in options],
        "key": key,
        "whys": [" ".join(w.split()) for w in whys],
        "label": label,
        "url": url,
    }


def cards() -> list[dict]:
    out = []
    V = vignette
    # Abdominal aortic aneurysm screening. Distinct decisions.
    out.append(card(
        "cardiovascular", "cardiology", "aaa-man-ever-smoked-ultrasound", "health-maintenance", 2, AAA,
        V(68, "man", "retired welder", "primary care clinic",
          "He smoked a pack daily from age 20 to 50 and has not smoked since. He has never been screened for an aortic aneurysm. He has no abdominal pain.",
          36.6, 72, 14, 132, 78, "The abdomen is soft and not tender. Hemoglobin is 14.1 g/dL."),
        "Which of the following is the most appropriate screening plan?",
        ["One-time abdominal ultrasonography now",
         "Annual CT angiography starting this year",
         "No imaging, because he quit smoking 18 years ago",
         "Defer imaging until he turns 80",
         "Screen only if a sibling has had an aneurysm"],
        0,
        ["Men aged 65 to 75 who have ever smoked are offered one-time ultrasonography.",
         "Ultrasonography, not CT angiography, is the screening test.",
         "Ever smoking qualifies him. Quitting does not remove the indication inside ages 65 to 75.",
         "The age window is 65 to 75, not a delay until 80.",
         "A family history is not required when he has ever smoked."],
    ))
    out.append(card(
        "cardiovascular", "cardiology", "aaa-man-never-smoked-selective", "health-maintenance", 3, AAA,
        V(70, "man", "librarian", "primary care clinic",
          "He has never smoked. His brother had an aortic aneurysm repair at 72. He wants to know whether routine imaging is required.",
          36.5, 70, 14, 128, 76, "The abdomen is soft. Body mass index is 26 kg/m2."),
        "Which of the following is the most appropriate plan?",
        ["Selectively offer ultrasonography rather than screening every man who never smoked",
         "One-time ultrasonography is required for every man aged 65 to 75",
         "Do not discuss imaging, because he never smoked",
         "Start annual CT angiography",
         "Screen only women in his family"],
        0,
        ["For men aged 65 to 75 who never smoked, screening is selective, not routine for every man.",
         "Routine screening of every never-smoking man is not the recommendation.",
         "Selective offering is still appropriate; never-smoking does not forbid a discussion.",
         "Ultrasonography is the screening test, and it is not an annual CT program.",
         "This decision is about him, not about screening the women in the family."],
    ))
    out.append(card(
        "cardiovascular", "cardiology", "aaa-woman-never-smoked-no-family", "health-maintenance", 2, AAA,
        V(68, "woman", "florist", "primary care clinic",
          "She has never smoked and no relative has had an aortic aneurysm. She feels well and asks about aneurysm screening.",
          36.6, 74, 16, 126, 74, "The abdomen is soft. Hemoglobin is 13.2 g/dL."),
        "Which of the following is the most appropriate recommendation?",
        ["Do not screen with ultrasonography",
         "One-time ultrasonography, using the rule for men who have smoked",
         "Annual ultrasonography starting this year",
         "CT angiography because she is 68",
         "Screen only if her systolic pressure is above 140 mm Hg"],
        0,
        ["Women who never smoked and have no family history of aneurysm are not screened.",
         "The grade B ultrasound recommendation is for men aged 65 to 75 who have ever smoked.",
         "There is no annual ultrasound program for this group.",
         "CT angiography is not the screening test, and screening is not indicated.",
         "Blood pressure does not create this screening indication."],
    ))
    out.append(card(
        "cardiovascular", "cardiology", "aaa-woman-ever-smoked-insufficient", "health-maintenance", 3, AAA,
        V(67, "woman", "bus driver", "primary care clinic",
          "She smoked for 15 years and quit at 50. She has no abdominal symptoms and asks whether an aneurysm ultrasound is required.",
          36.7, 78, 16, 134, 80, "The abdomen is soft. Body mass index is 29 kg/m2."),
        "Which of the following is the most appropriate statement?",
        ["Evidence is insufficient to say that screening helps or harms her",
         "One-time ultrasonography is required because she ever smoked",
         "Screening is recommended against, as it is for a never-smoking woman with no family history",
         "Annual CT angiography is the standard screen",
         "Wait until age 80 and then obtain ultrasonography"],
        0,
        ["For women aged 65 to 75 who have ever smoked, the evidence is an I statement.",
         "Ever smoking does not create the grade B indication that applies to men.",
         "The grade D recommendation is for women who never smoked and have no family history.",
         "Ultrasonography would be the test if screening were chosen, and it is not annual CT.",
         "Age 80 is outside the 65-to-75 discussion window."],
    ))
    out.append(card(
        "cardiovascular", "cardiology", "aaa-man-too-young", "health-maintenance", 2, AAA,
        V(62, "man", "carpenter", "primary care clinic",
          "He smoked for 20 years and quit at 48. He has no abdominal pain and asks to have aneurysm screening today.",
          36.6, 76, 14, 124, 78, "The abdomen is soft and not tender. Hemoglobin is 15.0 g/dL."),
        "Which of the following is the most appropriate plan?",
        ["Do not screen yet; the age window starts at 65",
         "One-time ultrasonography today because he has ever smoked",
         "Annual CT angiography until age 75",
         "Screening is never indicated after a person quits",
         "Use the never-smoker selective rule even though he smoked"],
        0,
        ["The one-time ultrasound recommendation for men who have ever smoked is ages 65 to 75.",
         "Age 62 is before that window.",
         "The screening test is not annual CT angiography.",
         "Quitting does not erase an indication once he is 65 to 75, but he is not there yet.",
         "He has smoked, so the never-smoker pathway is the wrong rule, and he is also too young."],
    ))
    out.append(card(
        "cardiovascular", "cardiology", "aaa-man-past-75", "health-maintenance", 3, AAA,
        V(78, "man", "violin maker", "primary care clinic",
          "He smoked until age 60. He has never had aneurysm imaging and has no abdominal pain.",
          36.5, 68, 16, 138, 72, "The abdomen is soft. Creatinine is 1.1 mg/dL."),
        "Which of the following is the most appropriate plan?",
        ["The one-time screening window of ages 65 to 75 has passed",
         "One-time ultrasonography is still required at 78",
         "Start annual ultrasonography",
         "CT angiography is preferred because he is older than 75",
         "Screen only if he resumes smoking"],
        0,
        ["One-time ultrasonography for men who have ever smoked is recommended at ages 65 to 75.",
         "Age 78 is after that window.",
         "There is no annual ultrasound schedule in the recommendation.",
         "CT angiography is not the screening test.",
         "Resuming smoking is not the trigger; the age window has closed."],
    ))
    out.append(card(
        "cardiovascular", "cardiology", "aaa-woman-family-history-insufficient", "health-maintenance", 4, AAA,
        V(66, "woman", "editor", "primary care clinic",
          "She has never smoked. Her father died of a ruptured aortic aneurysm at 71. She has no abdominal pain.",
          36.6, 72, 14, 122, 76, "The abdomen is soft. Hemoglobin is 13.4 g/dL."),
        "Which of the following is the most appropriate statement?",
        ["Evidence is insufficient; family history does not create a grade B ultrasound rule",
         "Do not discuss imaging, using the rule for women with no family history",
         "One-time ultrasonography is required, as it is for men who have smoked",
         "Annual CT angiography is indicated because of her father",
         "Wait until age 80 for ultrasonography"],
        0,
        ["Women aged 65 to 75 with a family history fall under the I statement, not a requirement to screen.",
         "The grade D recommendation requires never smoking and no family history. She has a family history.",
         "The grade B one-time ultrasound rule is for men aged 65 to 75 who have ever smoked.",
         "CT angiography is not the screening test.",
         "Age 80 is outside the stated age band."],
    ))
    # Statins for primary prevention.
    out.append(card(
        "cardiovascular", "cardiology", "statin-risk-12-start", "pharmacotherapy", 2, STATIN,
        V(58, "man", "accountant", "primary care clinic",
          "He has hypertension and no history of a heart attack, stroke, or other cardiovascular disease. A risk calculator estimates a 12% chance of a cardiovascular event in 10 years. He agrees to a daily medicine after the reason is explained.",
          36.6, 74, 14, 136, 82, "LDL cholesterol is 142 mg/dL. He does not smoke."),
        "Which of the following is the most appropriate plan?",
        ["Start a moderate-intensity statin for primary prevention",
         "Do not use a statin unless the 10-year risk is under 7.5%",
         "Start aspirin 325 mg daily instead of a statin",
         "The primary-prevention statin recommendation excludes hypertension",
         "Wait until age 76 to discuss a statin"],
        0,
        ["Adults 40 to 75 with a cardiovascular risk factor and a 10-year risk of 10% or greater are prescribed a statin after they agree.",
         "A risk of 12% is above the 10% threshold for a recommendation to start, not a reason to withhold treatment.",
         "This recommendation is about a statin, not high-dose aspirin.",
         "Hypertension is one of the risk factors named in the recommendation.",
         "Age 58 is inside 40 to 75."],
    ))
    out.append(card(
        "cardiovascular", "cardiology", "statin-risk-8-selective", "pharmacotherapy", 3, STATIN,
        V(62, "woman", "baker", "primary care clinic",
          "She smokes and has no history of cardiovascular disease. Her estimated 10-year cardiovascular risk is 8%. She wants to know whether a statin is automatic.",
          36.7, 76, 16, 128, 78, "LDL cholesterol is 118 mg/dL. Hemoglobin A1C is 5.4%."),
        "Which of the following is the most appropriate plan?",
        ["Selectively offer a statin; the benefit is smaller than at a risk of 10% or more",
         "Prescribe a statin as a grade B recommendation at this risk",
         "Do not mention a statin, because any risk under 10% has no benefit",
         "Start a statin only after age 75",
         "Smoking removes her from the recommendation"],
        0,
        ["A 10-year risk of 7.5% to less than 10%, plus a risk factor such as smoking, is a selective offer, not an automatic start.",
         "The grade B start recommendation is for a risk of 10% or greater.",
         "There is a small net benefit in this band, so silence is not the recommendation.",
         "She is inside ages 40 to 75.",
         "Smoking is a qualifying risk factor."],
    ))
    out.append(card(
        "cardiovascular", "cardiology", "statin-under-age-40", "pharmacotherapy", 3, STATIN,
        V(36, "man", "chef", "primary care clinic",
          "He has type 2 diabetes and no cardiovascular disease. A calculator estimates a 15% 10-year cardiovascular risk. He asks whether this primary-prevention recommendation starts a statin today.",
          36.8, 80, 16, 130, 84, "Hemoglobin A1C is 7.4%. LDL cholesterol is 136 mg/dL."),
        "Which of the following is the most appropriate statement?",
        ["This recommendation applies at ages 40 to 75, so it does not start treatment at 36",
         "Start a statin today because the risk is above 10%",
         "Start a statin today because he has diabetes, regardless of age",
         "Selectively offer a statin because 15% is between 7.5% and 10%",
         "Aspirin 81 mg replaces the statin discussion"],
        0,
        ["The USPSTF statin recommendation for primary prevention is for adults aged 40 to 75.",
         "The risk threshold is used inside that age range.",
         "Diabetes is a qualifying risk factor only inside ages 40 to 75 for this recommendation.",
         "A risk of 15% is not in the 7.5% to less than 10% band.",
         "The recommendation is about a statin, not aspirin."],
    ))
    out.append(card(
        "cardiovascular", "cardiology", "statin-no-risk-factor", "pharmacotherapy", 4, STATIN,
        V(52, "woman", "architect", "primary care clinic",
          "She has no diabetes, hypertension, dyslipidemia, or smoking, and no cardiovascular disease. A calculator still estimates a 14% 10-year risk. She asks whether a statin is indicated by this recommendation.",
          36.6, 70, 14, 118, 72, "LDL cholesterol is 98 mg/dL. Hemoglobin A1C is 5.3%."),
        "Which of the following is the most appropriate statement?",
        ["A risk factor is required; risk alone does not meet this recommendation",
         "Start a statin because the 10-year risk is above 10%",
         "Selectively offer a statin because 14% is under 10%",
         "Start aspirin instead, because she has no risk factor",
         "Repeat the discussion at age 60, when risk factors are no longer required"],
        0,
        ["The recommendation requires at least one of dyslipidemia, diabetes, hypertension, or smoking, plus the risk threshold.",
         "A risk of 14% without one of those factors does not meet the recommendation.",
         "14% is not in the selective 7.5% to less than 10% band, and a risk factor is still required.",
         "Aspirin is a different recommendation.",
         "The risk-factor requirement does not disappear at age 60."],
    ))
    out.append(card(
        "cardiovascular", "cardiology", "statin-existing-cvd-not-this-rec", "pharmacotherapy", 3, STATIN,
        V(64, "man", "electrician", "cardiology clinic",
          "He had a myocardial infarction 2 years ago and takes aspirin. He has hypertension. He asks whether the primary-prevention statin recommendation is the reason to decide today.",
          36.6, 72, 16, 128, 76, "LDL cholesterol is 110 mg/dL. The ECG shows an old inferior infarct."),
        "Which of the following is the most appropriate statement about this recommendation?",
        ["It addresses primary prevention in people without cardiovascular disease",
         "It is the grade B rule for starting a statin after a myocardial infarction",
         "It says not to use a statin once a person has had an infarction",
         "It applies only when the 10-year risk is under 7.5%",
         "It replaces aspirin after an infarction"],
        0,
        ["The recommendation is for adults with no history of cardiovascular disease.",
         "A prior infarction is cardiovascular disease, so this primary-prevention statement is not the rule being applied.",
         "The text does not say to stop a statin after an infarction.",
         "The risk bands are for people without known cardiovascular disease.",
         "Aspirin and the statin recommendation are separate decisions."],
    ))
    out.append(card(
        "cardiovascular", "cardiology", "statin-age-over-75", "pharmacotherapy", 2, STATIN,
        V(78, "woman", "gardener", "primary care clinic",
          "She has hypertension, does not smoke, and has no cardiovascular disease. Her estimated 10-year risk is 18%. She asks whether this primary-prevention recommendation starts a statin.",
          36.5, 68, 14, 140, 78, "LDL cholesterol is 130 mg/dL. Creatinine is 1.0 mg/dL."),
        "Which of the following is the most appropriate statement?",
        ["This recommendation stops at age 75",
         "Start a statin because the risk is above 10%",
         "Selectively offer a statin because she is older than 75",
         "Do not use a statin unless she also has diabetes",
         "The recommendation begins only after age 80"],
        0,
        ["The ages covered are 40 to 75.",
         "The 10% threshold is used inside that age range.",
         "There is no selective-offer band created by being older than 75.",
         "Hypertension already would have been a qualifying factor inside the age range.",
         "Age 80 is not a new start age in this recommendation."],
    ))
    # Aspirin primary prevention.
    out.append(card(
        "cardiovascular", "cardiology", "aspirin-age-52-individual", "pharmacotherapy", 3, ASA,
        V(52, "man", "plumber", "primary care clinic",
          "He has no cardiovascular disease and no history of bleeding. His estimated 10-year cardiovascular risk is 12%. He is willing to take a daily aspirin if it is reasonable.",
          36.7, 76, 14, 128, 80, "Hemoglobin is 14.8 g/dL. He does not take an anticoagulant."),
        "Which of the following is the most appropriate plan?",
        ["Make an individual decision about low-dose aspirin",
         "Start low-dose aspirin as a required grade B medicine",
         "Do not discuss aspirin, because that prohibition starts at age 40",
         "Start aspirin 325 mg daily",
         "Defer any aspirin decision until age 60"],
        0,
        ["Ages 40 to 59 with a 10-year risk of 10% or greater get an individual decision, not a requirement.",
         "The recommendation is grade C, an individual decision, for this band.",
         "The recommendation against starting aspirin is for age 60 or older.",
         "The recommendation discusses low-dose aspirin, not 325 mg.",
         "He is already inside 40 to 59."],
    ))
    out.append(card(
        "cardiovascular", "cardiology", "aspirin-age-66-do-not-start", "pharmacotherapy", 2, ASA,
        V(66, "woman", "teacher", "primary care clinic",
          "She has no cardiovascular disease. Her estimated 10-year risk is 16%. She has never taken aspirin and asks to start it to prevent a first heart attack.",
          36.6, 72, 16, 134, 78, "Hemoglobin is 13.1 g/dL. She has no bleeding history."),
        "Which of the following is the most appropriate recommendation?",
        ["Do not start low-dose aspirin for primary prevention",
         "Start low-dose aspirin because her risk is above 10%",
         "Make the age 40-to-59 individual decision",
         "Start aspirin 325 mg daily",
         "Start aspirin only if she is younger than 40"],
        0,
        ["Adults 60 or older should not be started on low-dose aspirin for primary prevention.",
         "A high estimated risk does not overturn that recommendation against starting.",
         "The individual-decision band is ages 40 to 59.",
         "The recommendation is about not starting low-dose aspirin, not about using 325 mg.",
         "Age under 40 is outside both statements."],
    ))
    out.append(card(
        "cardiovascular", "cardiology", "aspirin-risk-under-10", "pharmacotherapy", 3, ASA,
        V(48, "man", "painter", "primary care clinic",
          "He has no cardiovascular disease. His estimated 10-year risk is 6%. He has no bleeding history and asks for aspirin.",
          36.7, 74, 14, 122, 76, "Hemoglobin is 15.2 g/dL."),
        "Which of the following is the most appropriate statement?",
        ["The individual-decision band requires a 10-year risk of at least 10%",
         "Start low-dose aspirin because he is 40 to 59",
         "Do not start aspirin, using the rule for adults 60 or older",
         "Start aspirin 325 mg because the risk is under 10%",
         "Risk is not part of the age 40-to-59 decision"],
        0,
        ["For ages 40 to 59, the individual decision applies when the 10-year risk is 10% or greater.",
         "Age alone, with a risk of 6%, does not place him in that band.",
         "He is not 60 or older.",
         "A lower risk is not a reason to use a higher aspirin dose.",
         "The 40-to-59 statement includes the 10% risk threshold."],
    ))
    out.append(card(
        "cardiovascular", "cardiology", "aspirin-age-38-outside", "pharmacotherapy", 2, ASA,
        V(38, "woman", "nurse", "primary care clinic",
          "She has no cardiovascular disease. Her estimated 10-year risk is 11%. She asks whether to start low-dose aspirin under this recommendation.",
          36.6, 70, 14, 118, 74, "Hemoglobin is 13.6 g/dL."),
        "Which of the following is the most appropriate statement?",
        ["This recommendation begins at age 40",
         "Make an individual decision because the risk is above 10%",
         "Do not start aspirin, using the rule for age 60 or older",
         "Start aspirin 325 mg daily",
         "Start low-dose aspirin because she is a clinician"],
        0,
        ["The individual decision is for ages 40 to 59, and the recommendation against starting is for age 60 or older.",
         "A risk above 10% is used inside ages 40 to 59.",
         "She is not 60 or older.",
         "325 mg is not the low-dose recommendation.",
         "Occupation does not change the age threshold."],
    ))
    # Sepsis / emergency.
    out.append(card(
        "respiratory-renal", "emergency-medicine", "septic-shock-antibiotics-one-hour", "pharmacotherapy", 2, SEPSIS,
        V(64, "man", "mechanic", "emergency department",
          "He is confused and has a fever after 2 days of cough. He is in shock.",
          38.9, 122, 28, 78, 48, "Lactate is 4.8 mmol/L. Oxygen saturation is 91% on air. A chest radiograph shows a right lower-lobe infiltrate."),
        "Which of the following is the most appropriate timing of antibiotics?",
        ["Give antibiotics immediately, ideally within 1 hour",
         "Wait for a positive blood culture before any antibiotic",
         "Defer antibiotics for 6 hours while observing",
         "Use procalcitonin alone to decide whether to treat",
         "Give antibiotics only if the lactate is under 2 mmol/L"],
        0,
        ["For possible septic shock, antibiotics are given immediately, ideally within 1 hour of recognition.",
         "Treatment of shock is not delayed for culture results.",
         "A 6-hour delay is not the shock recommendation.",
         "Procalcitonin plus examination is not preferred over clinical judgment for the decision to start.",
         "An elevated lactate supports resuscitation; it is not a reason to withhold antibiotics."],
    ))
    out.append(card(
        "respiratory-renal", "emergency-medicine", "sepsis-without-shock-three-hours", "pharmacotherapy", 3, SEPSIS,
        V(57, "woman", "cashier", "emergency department",
          "She has fever and dysuria but a normal blood pressure and a normal mental status. Sepsis is possible and shock is absent. The evaluation of other causes is underway.",
          38.4, 104, 20, 118, 72, "Lactate is 2.4 mmol/L. Creatinine is 1.0 mg/dL. The urinalysis shows many leukocytes."),
        "Which of the following is the most appropriate antibiotic timing if infection remains likely?",
        ["Give antibiotics within 3 hours of recognition",
         "Give antibiotics only after 12 hours of observation",
         "Use the 1-hour shock rule even though she is not in shock",
         "Defer all antibiotics because the blood pressure is normal and stop the workup",
         "Wait for a 24-hour culture result"],
        0,
        ["For possible sepsis without shock, if concern for infection persists, antibiotics are suggested within 3 hours of recognition.",
         "Twelve hours exceeds that window.",
         "The 1-hour ideal is for shock or a high likelihood that needs immediate treatment; this item is the no-shock 3-hour pathway.",
         "A normal blood pressure does not end the evaluation or forbid timely antibiotics when infection remains likely.",
         "Cultures should not delay the 3-hour decision."],
    ))
    out.append(card(
        "respiratory-renal", "emergency-medicine", "low-infection-likelihood-defer-antibiotics", "clinical-intervention", 3, SEPSIS,
        V(44, "man", "cyclist", "emergency department",
          "He has chest-wall pain after a fall, a normal chest radiograph, and no fever. Infection is unlikely and he is not in shock.",
          36.7, 78, 16, 128, 76, "Lactate is 1.1 mmol/L. Oxygen saturation is 98% on air. The ribs are tender."),
        "Which of the following is the most appropriate antimicrobial plan?",
        ["Defer antibiotics and keep monitoring",
         "Give broad antibiotics within 1 hour",
         "Give antibiotics within 3 hours even though infection is unlikely",
         "Start two gram-negative drugs",
         "Use procalcitonin alone to justify antibiotics"],
        0,
        ["When infection is unlikely and shock is absent, antibiotics are deferred while monitoring continues.",
         "The 1-hour rule is for shock or a high likelihood of sepsis.",
         "The 3-hour suggestion is for persisting concern that the illness is infectious.",
         "Two gram-negative drugs are for high risk of resistant organisms, which is not this case.",
         "Procalcitonin is not the way to decide to start antibiotics."],
    ))
    out.append(card(
        "respiratory-renal", "emergency-medicine", "septic-shock-30-ml-crystalloid", "clinical-intervention", 2, SEPSIS,
        V(70, "woman", "retired nurse", "emergency department",
          "She is in septic shock from pyelonephritis. Her weight is 60 kg.",
          38.6, 118, 26, 82, 50, "Lactate is 5.1 mmol/L. Creatinine is 1.6 mg/dL."),
        "Which of the following is the most appropriate initial fluid plan?",
        ["At least 30 mL/kg of intravenous crystalloid in the first 3 hours",
         "No fluid until a 24-hour intake record is complete",
         "5 mL/kg of crystalloid over 24 hours",
         "Albumin as the required initial fluid",
         "Fluid only if the lactate is under 2 mmol/L"],
        0,
        ["For sepsis with hypoperfusion or shock, at least 30 mL/kg of intravenous crystalloid is suggested within 3 hours. For 60 kg that is 1800 mL.",
         "Shock resuscitation is not delayed for a full-day record.",
         "5 mL/kg is far below 30 mL/kg.",
         "The initial suggestion is a crystalloid, not albumin.",
         "A high lactate is a reason to resuscitate, not a reason to withhold fluid."],
    ))
    out.append(card(
        "respiratory-renal", "emergency-medicine", "septic-shock-map-65", "clinical-intervention", 3, SEPSIS,
        V(73, "man", "farmer", "intensive care unit",
          "He is in septic shock and a norepinephrine infusion has just started.",
          37.8, 110, 22, 84, 48, "Mean arterial pressure is 58 mm Hg. Lactate is 3.6 mmol/L."),
        "Which of the following is the most appropriate initial mean-arterial-pressure target?",
        ["65 mm Hg",
         "85 mm Hg as the required initial target",
         "50 mm Hg",
         "No target until the lactate is normal",
         "100 mm Hg for every patient in shock"],
        0,
        ["The initial target mean arterial pressure on vasopressors is 65 mm Hg rather than a higher target.",
         "A higher initial target is not the recommendation.",
         "50 mm Hg is below the recommended initial target.",
         "The pressure target is not postponed until the lactate normalizes.",
         "100 mm Hg is higher than the recommended initial target."],
    ))
    out.append(card(
        "respiratory-renal", "emergency-medicine", "sepsis-no-procalcitonin-to-start", "interpretation", 3, SEPSIS,
        V(59, "woman", "clerk", "emergency department",
          "Sepsis is likely. A procalcitonin result is not back. She is hypotensive.",
          38.8, 120, 24, 86, 52, "Lactate is 4.2 mmol/L. The leukocyte count is 16,000/mm3."),
        "Which of the following is the most appropriate use of procalcitonin?",
        ["Do not wait for procalcitonin to decide to start antibiotics",
         "Start antibiotics only if procalcitonin is elevated",
         "Procalcitonin replaces the history and examination",
         "A normal procalcitonin forbids antibiotics in shock",
         "Repeat procalcitonin for 12 hours before the first dose"],
        0,
        ["Procalcitonin plus clinical evaluation is not recommended over clinical evaluation alone for the decision to start antibiotics.",
         "The start decision is clinical, especially in shock.",
         "Procalcitonin does not replace the examination.",
         "Shock is treated immediately; a procalcitonin value is not a veto.",
         "A 12-hour delay is not appropriate for shock."],
    ))
    out.append(card(
        "respiratory-renal", "emergency-medicine", "sepsis-high-mrsa-cover", "pharmacotherapy", 3, SEPSIS,
        V(61, "man", "dialysis patient", "emergency department",
          "He has septic shock. He has a recent hospitalization and an indwelling intravenous device, and MRSA risk is judged high.",
          38.7, 116, 24, 80, 46, "Lactate is 4.0 mmol/L."),
        "Which of the following is the most appropriate MRSA plan?",
        ["Include an antibiotic active against MRSA",
         "Avoid MRSA coverage because the risk is high",
         "Use MRSA coverage only if the risk is low",
         "Wait 24 hours for a nasal swab before any antibiotic",
         "Use procalcitonin to decide on MRSA coverage"],
        0,
        ["When MRSA risk is high, empiric antibiotics should include MRSA coverage.",
         "High risk is the reason to include coverage, not to avoid it.",
         "Low MRSA risk is when coverage is not suggested.",
         "Shock treatment is not delayed a day for a swab.",
         "Procalcitonin is not the MRSA decision tool."],
    ))
    out.append(card(
        "respiratory-renal", "emergency-medicine", "sepsis-low-mrsa-avoid", "pharmacotherapy", 3, SEPSIS,
        V(40, "woman", "teacher", "emergency department",
          "She has sepsis from community pyelonephritis. MRSA risk is judged low. She is not in shock.",
          38.5, 102, 18, 110, 68, "Lactate is 2.2 mmol/L. Creatinine is 0.9 mg/dL."),
        "Which of the following is the most appropriate MRSA plan?",
        ["Do not add MRSA coverage",
         "Add MRSA coverage because the risk is low",
         "Add MRSA coverage to every community infection",
         "Use two gram-negative drugs because MRSA risk is low",
         "Hold all antibiotics until a nasal swab returns"],
        0,
        ["When MRSA risk is low, empiric MRSA coverage is not suggested.",
         "Low risk is not an indication to add that coverage.",
         "Coverage is based on risk, not on treating every community infection for MRSA.",
         "Two gram-negative drugs are a different decision, used when resistant gram-negative risk is high.",
         "A swab should not be required before antibiotics when treatment is due."],
    ))
    out.append(card(
        "respiratory-renal", "emergency-medicine", "sepsis-measure-lactate", "interpretation", 2, SEPSIS,
        V(55, "man", "driver", "emergency department",
          "Sepsis is suspected. No lactate has been drawn.",
          38.6, 108, 22, 100, 62, "The leukocyte count is 14,000/mm3. Oxygen saturation is 94% on air."),
        "Which of the following is the most appropriate next laboratory step?",
        ["Measure blood lactate",
         "Do not measure lactate in suspected sepsis",
         "Use lactate only after antibiotics have failed",
         "Replace the history with a lactate result",
         "Measure lactate only if the blood pressure is above 140 mm Hg"],
        0,
        ["For adults with suspected sepsis, measuring blood lactate is suggested.",
         "The suggestion is to measure it, not to skip it.",
         "It is part of the initial evaluation, not a test reserved for failure.",
         "Lactate is interpreted with the clinical context; it does not replace the history.",
         "Hypertension is not the indication."],
    ))
    out.append(card(
        "respiratory-renal", "emergency-medicine", "sepsis-icu-within-six-hours", "clinical-intervention", 3, SEPSIS,
        V(69, "woman", "retired teacher", "emergency department",
          "She has septic shock and needs intensive care. A bed is being requested.",
          38.4, 114, 24, 88, 50, "Lactate is 3.9 mmol/L. Norepinephrine has been started."),
        "Which of the following is the most appropriate admission timing?",
        ["Admit to intensive care within 6 hours",
         "Keep her in the emergency department for 24 hours",
         "Send her to a general floor because shock is present",
         "Delay intensive care until the lactate is normal",
         "Discharge once the first antibiotic dose is given"],
        0,
        ["Adults with sepsis or septic shock who need intensive care should be admitted there within 6 hours.",
         "A day in the emergency department misses that suggestion.",
         "Shock is a reason for intensive care, not for a general floor.",
         "Admission is not postponed until the lactate normalizes.",
         "Shock is not discharged after one dose."],
    ))
    out.append(card(
        "respiratory-renal", "emergency-medicine", "sepsis-not-qsofa-alone", "interpretation", 4, SEPSIS,
        V(63, "man", "janitor", "emergency department",
          "Infection is suspected. A quick sequential organ failure score is low. He looks ill.",
          38.2, 100, 20, 108, 64, "Lactate has not yet returned. The leukocyte count is 13,500/mm3."),
        "Which of the following is the most appropriate use of that score?",
        ["Do not use it as the only screening tool",
         "A low score alone excludes sepsis",
         "The score replaces lactate and the examination",
         "Antibiotics are forbidden when the score is low",
         "The score is preferred over early-warning scores as the sole tool"],
        0,
        ["The guidelines recommend against using the quick sequential organ failure score as the single screening tool.",
         "A single low score does not exclude sepsis.",
         "It does not replace lactate or the examination.",
         "Antibiotic timing follows the likelihood of sepsis and shock, not a prohibition from one score.",
         "That score is not preferred over other early-warning approaches as the only tool."],
    ))
    # Asthma / GINA.
    out.append(card(
        "respiratory-renal", "pulmonology", "asthma-no-saba-only", "pharmacotherapy", 2, GINA,
        V(29, "woman", "singer", "pulmonary clinic",
          "She has asthma with symptoms 3 days a week and uses albuterol alone. She has never used an inhaled corticosteroid.",
          36.7, 82, 16, 118, 74, "Oxygen saturation is 97% on air. FEV1 is 78% of predicted."),
        "Which of the following is the most appropriate treatment principle?",
        ["Do not treat with a short-acting beta agonist alone",
         "Continue albuterol alone because symptoms are under 4 days a week",
         "Add theophylline and stop any plan for an inhaled corticosteroid",
         "Start a long-acting beta agonist with no inhaled corticosteroid",
         "Reserve an inhaled corticosteroid for a life-threatening attack only"],
        0,
        ["GINA recommends against short-acting beta-agonist-only treatment because of exacerbations and asthma-related death.",
         "Symptom frequency does not make beta-agonist-only treatment acceptable.",
         "Theophylline is not the substitute for an inhaled corticosteroid.",
         "A long-acting beta agonist should not be used without an inhaled corticosteroid.",
         "Anti-inflammatory treatment is not reserved for a life-threatening attack."],
    ))
    out.append(card(
        "respiratory-renal", "pulmonology", "asthma-adult-prednisolone-max-50", "pharmacotherapy", 3, GINA,
        V(46, "man", "roofer", "emergency department",
          "He is having an asthma exacerbation and is getting worse despite increased reliever use. He weighs 92 kg.",
          37.2, 110, 28, 138, 86, "Oxygen saturation is 91% on air. Peak flow is 45% of his usual."),
        "Which of the following is the most appropriate oral prednisolone dose?",
        ["1 mg/kg daily, not above 50 mg",
         "92 mg daily, because the dose is 1 mg/kg with no maximum",
         "5 mg daily for 1 day",
         "No corticosteroid unless the oxygen saturation is above 98%",
         "Theophylline instead of a corticosteroid"],
        0,
        ["Adult prednisolone for an exacerbation is 1 mg/kg daily up to a maximum of 50 mg.",
         "92 mg ignores the 50 mg maximum.",
         "5 mg is far below the recommended adult dose.",
         "A low saturation is a reason to treat, not a reason to withhold the corticosteroid.",
         "Theophylline does not replace the corticosteroid."],
    ))
    out.append(card(
        "respiratory-renal", "pulmonology", "asthma-oxygen-93-to-95", "clinical-intervention", 3, GINA,
        V(54, "woman", "librarian", "emergency department",
          "She is having a severe asthma exacerbation. Oxygen saturation is 88% on air.",
          37.0, 112, 30, 142, 88, "She is speaking in short phrases. Peak flow is 40% of predicted."),
        "Which of the following is the most appropriate oxygen target?",
        ["Saturation 93% to 95%, not 100% oxygen as the goal",
         "Saturation 99% to 100% with a nonrebreather as the goal",
         "No oxygen unless a pulse oximeter is unavailable",
         "Saturation under 90% to avoid any supplemental oxygen",
         "Withhold oxygen until a corticosteroid has been given"],
        0,
        ["Adult oxygen saturation during an exacerbation is targeted at 93% to 95%. Controlled oxygen is preferred to 100% oxygen, and saturation should not be kept above 96%.",
         "A goal of 99% to 100% is higher than recommended.",
         "Oxygen is given to reach the target; it is not withheld until the oximeter is missing. If no oximeter is available, oxygen is not withheld.",
         "88% is below the target, so oxygen is indicated.",
         "Oxygen is not delayed for the corticosteroid."],
    ))
    out.append(card(
        "respiratory-renal", "pulmonology", "asthma-no-formoterol-with-other-laba", "pharmacotherapy", 4, GINA,
        V(37, "man", "teacher", "pulmonary clinic",
          "His maintenance inhaler is fluticasone with salmeterol. He asks to use budesonide-formoterol as an extra reliever.",
          36.6, 76, 14, 122, 76, "Oxygen saturation is 98% on air. FEV1 is 82% of predicted."),
        "Which of the following is the most appropriate reliever plan?",
        ["Do not add formoterol as the reliever while he uses a different long-acting beta agonist",
         "Add budesonide-formoterol reliever on top of salmeterol",
         "Stop the inhaled corticosteroid and use formoterol alone",
         "Use salmeterol as the only as-needed reliever",
         "Replace both inhalers with theophylline"],
        0,
        ["GINA advises against using ICS-formoterol as the reliever when maintenance treatment uses a non-formoterol long-acting beta agonist.",
         "That combination of two different long-acting beta agonists is the regimen to avoid.",
         "Formoterol alone omits the inhaled corticosteroid.",
         "Salmeterol is not an as-needed short-acting reliever.",
         "Theophylline is not the replacement."],
    ))
    out.append(card(
        "respiratory-renal", "pulmonology", "asthma-daily-symptoms-consider-mart", "pharmacotherapy", 3, GINA,
        V(33, "woman", "chef", "pulmonary clinic",
          "She has asthma symptoms every day and woke with symptoms 4 nights this week. She is not yet on maintenance-and-reliever therapy.",
          36.7, 80, 16, 118, 74, "FEV1 is 68% of predicted. Oxygen saturation is 97% on air."),
        "Which of the following is a reason to consider maintenance-and-reliever therapy rather than as-needed treatment only?",
        ["Symptoms every day",
         "Symptoms less than twice a month",
         "A normal FEV1 and no night waking",
         "A preference for albuterol alone",
         "Absence of any exacerbation risk"],
        0,
        ["GINA lists symptoms every day among the clinical reasons to consider starting maintenance-and-reliever therapy with ICS-formoterol.",
         "Infrequent symptoms are not the reason to start that maintenance regimen.",
         "Normal lung function without night symptoms would not be this indication.",
         "Short-acting beta-agonist-only treatment is not recommended.",
         "Daily symptoms are themselves a marker of poor control."],
    ))
    out.append(card(
        "respiratory-renal", "emergency-medicine", "asthma-child-oxygen-target", "clinical-intervention", 3, GINA,
        V(8, "boy", "student", "emergency department",
          "He is having an asthma exacerbation. Oxygen saturation is 90% on air.",
          37.1, 124, 32, 100, 64, "He has intercostal retractions. He weighs 26 kg."),
        "Which of the following is the most appropriate oxygen saturation target?",
        ["94% to 98%",
         "88% to 90%",
         "99% to 100% as the required goal",
         "No oxygen, because he is a child",
         "The adult target of 93% to 95% is the only range used at this age"],
        0,
        ["For children 6 to 11 years, the oxygen saturation target in an exacerbation is 94% to 98%.",
         "90% is below that target.",
         "99% to 100% is not the stated goal.",
         "Children in this age group receive oxygen to reach the target.",
         "The adult range is 93% to 95%; this child uses the 94% to 98% range."],
    ))
    out.append(card(
        "respiratory-renal", "pulmonology", "asthma-biologic-do-not-stop-ics", "pharmacotherapy", 4, GINA,
        V(49, "woman", "editor", "pulmonary clinic",
          "Severe asthma has responded well to a biologic. She uses budesonide-formoterol for maintenance and relief and asks to stop that inhaler.",
          36.6, 74, 14, 120, 76, "FEV1 is 84% of predicted. She has had no exacerbation for 4 months."),
        "Which of the following is the most appropriate plan?",
        ["Do not stop maintenance ICS-formoterol",
         "Stop the inhaler now that the biologic is working",
         "Replace the inhaler with albuterol alone",
         "Stop the biologic and the inhaler together",
         "Use oral theophylline as the only remaining medicine"],
        0,
        ["In severe asthma with a good response to a biologic, maintenance ICS-formoterol should not be stopped.",
         "Stopping the maintenance inhaler is what the trial findings argue against.",
         "Short-acting beta-agonist-only treatment is not recommended.",
         "The priority is not to stop both anti-inflammatory treatments at once.",
         "Theophylline is not the substitute."],
    ))
    # Adolescent depression, used for near-duplicate slots that are not item 131.
    out.append(card(
        "behavioral-nervous", "psychiatry", "adolescent-depression-screen-age-15", "health-maintenance", 2, ADEP,
        V(15, "girl", "student", "pediatric clinic",
          "She is here for a checkup. She has no diagnosed mental health condition and describes her mood as usual. She has never been screened for depression.",
          36.7, 76, 16, 108, 66, "She weighs 52 kg. She is in the 9th grade and attends school daily."),
        "Which of the following is the most appropriate screening plan?",
        ["Screen for major depression",
         "Do not screen, because she has no risk factors",
         "Screen for suicide risk as a grade B service instead",
         "Wait until age 19 for any depression question",
         "Start an antidepressant without asking about mood"],
        0,
        ["USPSTF recommends screening adolescents aged 12 to 18 for major depressive disorder.",
         "All adolescents in that age range are screened; risk factors are not required.",
         "Suicide-risk screening is an I statement, not a grade B substitute.",
         "Age 15 is inside 12 to 18.",
         "Screening is not the same as starting a medicine with no assessment."],
    ))
    out.append(card(
        "behavioral-nervous", "psychiatry", "adolescent-suicide-screen-insufficient", "health-maintenance", 3, ADEP,
        V(16, "boy", "student", "pediatric clinic",
          "He has no mood symptoms and no diagnosed mental health condition. A form offers a suicide-risk screen as a routine grade B test.",
          36.6, 70, 16, 112, 68, "He weighs 61 kg. He plays soccer 3 days a week."),
        "Which of the following is the most appropriate statement?",
        ["Evidence is insufficient for routine suicide-risk screening",
         "Suicide-risk screening is a grade B recommendation equal to depression screening",
         "Depression screening is not recommended at age 16",
         "A suicide-risk screen replaces any question about depression",
         "Screening is deferred until age 21"],
        0,
        ["USPSTF finds insufficient evidence to assess routine suicide-risk screening in children and adolescents.",
         "It is an I statement, not a grade B recommendation.",
         "Depression screening is recommended at ages 12 to 18.",
         "The two questions are not interchangeable.",
         "Age 16 is inside the adolescent depression-screening range."],
    ))
    out.append(card(
        "behavioral-nervous", "psychiatry", "depression-screen-starts-at-12", "health-maintenance", 3, ADEP,
        V(11, "girl", "student", "pediatric clinic",
          "She has no mood symptoms and no diagnosed mental health condition. Her parent asks whether the grade B adolescent depression screen applies today.",
          36.7, 84, 18, 104, 64, "She weighs 38 kg. She is in the 5th grade."),
        "Which of the following is the most appropriate statement?",
        ["The grade B recommendation begins at age 12",
         "Screen today under the grade B rule for ages 12 to 18",
         "Suicide-risk screening is the grade B service at age 11",
         "An antidepressant is required before any question is asked",
         "The grade B rule applies only after age 19"],
        0,
        ["The grade B depression-screening recommendation is for adolescents aged 12 to 18.",
         "Age 11 is younger than that range.",
         "Suicide-risk screening is an I statement.",
         "A medicine is not started before an assessment.",
         "Age 19 is the adult recommendation, not the start of the adolescent grade B rule."],
    ))
    out.append(card(
        "respiratory-renal", "pulmonology", "asthma-saturation-already-at-target", "clinical-intervention", 2, GINA,
        V(41, "woman", "pharmacist", "emergency department",
          "An asthma exacerbation is improving. Oxygen saturation is 94% on 2 liters of nasal oxygen.",
          36.8, 96, 20, 124, 78, "She speaks in full sentences. Peak flow has risen to 70% of her usual."),
        "Which of the following is the most appropriate oxygen plan?",
        ["Keep the saturation in the 93% to 95% range",
         "Change to a nonrebreather to reach 100%",
         "Stop oxygen immediately because 94% is too high",
         "Aim for a saturation under 90%",
         "Withhold oxygen until a corticosteroid is swallowed"],
        0,
        ["Adult saturation during an exacerbation is kept at 93% to 95% and not above 96%.",
         "A goal of 100% is higher than recommended.",
         "94% is inside the target, so oxygen is not stopped for being too high.",
         "Under 90% is below the target.",
         "Oxygen is not delayed for the corticosteroid."],
    ))
    out.append(card(
        "respiratory-renal", "emergency-medicine", "asthma-oxygen-if-no-oximeter", "clinical-intervention", 3, GINA,
        V(36, "man", "courier", "emergency department",
          "He is having a severe asthma exacerbation. The pulse oximeter is broken.",
          37.1, 118, 32, 140, 88, "He is using accessory muscles. Peak flow is 35% of predicted."),
        "Which of the following is the most appropriate oxygen plan?",
        ["Give oxygen; do not withhold it because oximetry is unavailable",
         "Withhold oxygen until a new oximeter arrives",
         "Give oxygen only after the saturation is known to be above 98%",
         "Use 100% oxygen as a required 2-hour goal",
         "Theophylline replaces oxygen"],
        0,
        ["GINA says oxygen should not be withheld if pulse oximetry is not available.",
         "Waiting for a device is the opposite of that instruction.",
         "A known saturation above 98% is not required before oxygen.",
         "100% oxygen is not the preferred goal once saturation can be measured, and it is not a reason to delay care now.",
         "Theophylline does not replace oxygen."],
    ))
    out.append(card(
        "respiratory-renal", "pulmonology", "asthma-child-no-saba-only", "pharmacotherapy", 2, GINA,
        V(9, "boy", "student", "pediatric clinic",
          "He has asthma and uses albuterol alone. He has never been prescribed an inhaled corticosteroid. Symptoms occur 2 days a week.",
          36.7, 88, 18, 102, 64, "Oxygen saturation is 98% on air. He weighs 30 kg."),
        "Which of the following is the most appropriate treatment principle?",
        ["Do not treat with a short-acting beta agonist alone",
         "Continue albuterol alone because he is under 12",
         "Switch to oral albuterol as safer long-term treatment",
         "Use theophylline as the only controller",
         "Add a long-acting beta agonist with no inhaled corticosteroid"],
        0,
        ["GINA recommends against short-acting beta-agonist-only treatment in children 6 to 11 years, as in adults.",
         "Age under 12 does not make that regimen acceptable.",
         "Oral short-acting beta agonists are not recommended.",
         "Theophylline is not the preferred controller.",
         "A long-acting beta agonist should not be used without an inhaled corticosteroid."],
    ))
    out.append(card(
        "respiratory-renal", "emergency-medicine", "sepsis-high-mdr-two-agents", "pharmacotherapy", 4, SEPSIS,
        V(72, "man", "retired farmer", "intensive care unit",
          "He is in septic shock. He has had repeated hospitalizations and recent broad-spectrum antibiotics, and the risk of resistant gram-negative infection is high.",
          38.5, 112, 24, 86, 48, "Lactate is 4.4 mmol/L. Creatinine is 2.1 mg/dL."),
        "Which of the following is the most appropriate gram-negative plan?",
        ["Use two antibiotics active against gram-negative bacteria",
         "Use one gram-negative antibiotic because the risk is high",
         "Avoid gram-negative coverage until cultures return",
         "Use MRSA coverage instead of any gram-negative drug",
         "Wait for procalcitonin before choosing the number of drugs"],
        0,
        ["When the risk of multidrug-resistant organisms is high, two gram-negative agents are suggested for empiric treatment.",
         "One agent is the suggestion when that risk is low, not high.",
         "Shock is not left without gram-negative coverage.",
         "MRSA coverage does not replace gram-negative treatment.",
         "Procalcitonin is not the tool for this choice."],
    ))
    out.append(card(
        "respiratory-renal", "emergency-medicine", "sepsis-low-mdr-one-agent", "pharmacotherapy", 3, SEPSIS,
        V(34, "woman", "student", "emergency department",
          "She has community pyelonephritis and sepsis without shock. She has no recent hospitalization, and the risk of resistant gram-negative infection is low.",
          38.3, 100, 18, 112, 70, "Lactate is 2.1 mmol/L. Creatinine is 0.8 mg/dL."),
        "Which of the following is the most appropriate gram-negative plan?",
        ["Use one gram-negative antibiotic rather than two",
         "Use two gram-negative antibiotics because the risk is low",
         "Add MRSA coverage because the gram-negative risk is low",
         "Give no antibiotic for 12 hours",
         "Choose the regimen only after procalcitonin returns"],
        0,
        ["When multidrug-resistant risk is low, two gram-negative agents are not suggested; one agent is used.",
         "Low risk is not a reason to double gram-negative coverage.",
         "Low gram-negative resistance risk does not create an MRSA indication.",
         "A 12-hour delay is not the no-shock pathway when infection is likely.",
         "Procalcitonin should not decide the start of antibiotics."],
    ))
    out.append(card(
        "respiratory-renal", "emergency-medicine", "sepsis-stop-antibiotics-if-alternative", "clinical-intervention", 3, SEPSIS,
        V(50, "man", "chef", "emergency department",
          "Antibiotics were started for possible sepsis. Imaging now shows a pulmonary embolism and no infection. He is not in shock.",
          36.8, 104, 22, 110, 70, "Lactate is 2.0 mmol/L. Oxygen saturation is 93% on air."),
        "Which of the following is the most appropriate antimicrobial plan?",
        ["Stop the antibiotics and treat the embolism",
         "Continue a fixed 14-day antibiotic course",
         "Add a second gram-negative drug",
         "Add MRSA coverage because infection was not confirmed",
         "Use procalcitonin alone to extend the antibiotics"],
        0,
        ["If an alternative cause is demonstrated, empiric antibiotics are stopped and the search for infection continues only as needed.",
         "A fixed course is not required once another diagnosis explains the illness.",
         "A second gram-negative drug is not indicated when infection is no longer the diagnosis.",
         "Unconfirmed infection that has been replaced by another diagnosis is a reason to stop, not to add MRSA coverage.",
         "Procalcitonin is not the reason to extend antibiotics here."],
    ))
    out.append(card(
        "cardiovascular", "cardiology", "statin-risk-exactly-10", "pharmacotherapy", 3, STATIN,
        V(55, "man", "driver", "primary care clinic",
          "He has dyslipidemia and no cardiovascular disease. His estimated 10-year risk is 10%. He agrees to treatment after the reason is explained.",
          36.6, 74, 14, 126, 78, "LDL cholesterol is 154 mg/dL. Hemoglobin A1C is 5.5%."),
        "Which of the following is the most appropriate plan?",
        ["Prescribe a statin; 10% meets the start threshold",
         "Selectively offer a statin, because 10% is under 10%",
         "Do not use a statin unless the risk exceeds 20%",
         "Start aspirin 325 mg instead",
         "The recommendation excludes dyslipidemia"],
        0,
        ["A 10-year risk of 10% or greater, with a risk factor, is the group in which a statin is prescribed after agreement.",
         "The selective band is 7.5% to less than 10%. Ten percent is not under 10%.",
         "The threshold is 10%, not 20%.",
         "This decision is about a statin.",
         "Dyslipidemia is a qualifying risk factor."],
    ))
    out.append(card(
        "cardiovascular", "cardiology", "statin-risk-exactly-7-5", "pharmacotherapy", 4, STATIN,
        V(60, "woman", "editor", "primary care clinic",
          "She has hypertension and no cardiovascular disease. Her estimated 10-year risk is 7.5%. She asks whether a statin is required.",
          36.6, 72, 14, 138, 84, "LDL cholesterol is 126 mg/dL. She does not smoke."),
        "Which of the following is the most appropriate plan?",
        ["Selectively offer a statin rather than prescribe it automatically",
         "Prescribe a statin as a required grade B start",
         "Do not mention a statin, because 7.5% has no possible benefit",
         "Start aspirin 325 mg instead",
         "Wait until the risk is under 5%"],
        0,
        ["A risk of 7.5% to less than 10% is the selective-offer band, not the automatic start.",
         "The required start is for a risk of 10% or greater.",
         "The selective band still has a small net benefit.",
         "Aspirin is a different recommendation.",
         "A lower risk is not the goal of the recommendation."],
    ))
    out.append(card(
        "cardiovascular", "cardiology", "aspirin-bleeding-less-likely-benefit", "pharmacotherapy", 4, ASA,
        V(54, "man", "bartender", "primary care clinic",
          "He has no cardiovascular disease. His 10-year risk is 13%. He had a gastrointestinal bleed 2 months ago and is still on a bleeding-risk medicine.",
          36.7, 78, 16, 130, 80, "Hemoglobin is 11.2 g/dL. He is 40 to 59 years old."),
        "Which of the following is the most appropriate statement?",
        ["Bleeding risk makes him less likely to benefit from starting aspirin",
         "Start low-dose aspirin today as a required medicine",
         "Do not consider bleeding, because the risk is above 10%",
         "Use the age-60 prohibition even though he is 54",
         "Start aspirin 325 mg because of the recent bleed"],
        0,
        ["In the 40-to-59 individual decision, people who are not at increased bleeding risk are more likely to benefit. A recent bleed counts against starting.",
         "The recommendation is not a required start.",
         "Bleeding risk is part of the individual decision.",
         "The recommendation against starting applies at age 60 or older.",
         "A higher dose is not the response to bleeding."],
    ))
    out.append(card(
        "respiratory-renal", "pulmonology", "asthma-infrequent-ics-with-saba", "pharmacotherapy", 4, GINA,
        V(26, "woman", "dancer", "pulmonary clinic",
          "Symptoms occur less than twice a month and she has no recent exacerbation. She is unlikely to take a daily inhaler.",
          36.6, 72, 14, 112, 70, "FEV1 is 90% of predicted. Oxygen saturation is 99% on air."),
        "Which of the following is the most appropriate controller plan?",
        ["Take an inhaled corticosteroid whenever a short-acting beta agonist is taken",
         "Use a short-acting beta agonist alone",
         "Start daily inhaled corticosteroid as the only realistic plan",
         "Start a long-acting beta agonist with no inhaled corticosteroid",
         "Use oral theophylline each day"],
        0,
        ["For infrequent symptoms, GINA prefers taking an inhaled corticosteroid whenever a short-acting beta agonist is used, so some corticosteroid is received.",
         "Short-acting beta-agonist-only treatment is not recommended.",
         "Daily corticosteroid would reduce exacerbations but is unlikely to be taken; the preferred practical step is corticosteroid with each reliever dose.",
         "A long-acting beta agonist is not used without an inhaled corticosteroid.",
         "Theophylline is not the preferred plan."],
    ))
    out.append(card(
        "respiratory-renal", "emergency-medicine", "sepsis-dynamic-fluid-measures", "clinical-intervention", 4, SEPSIS,
        V(66, "man", "welder", "intensive care unit",
          "He is being resuscitated for septic shock. A passive leg raise can be performed.",
          37.6, 108, 22, 90, 54, "Lactate is 3.8 mmol/L. He has already received the initial crystalloid bolus."),
        "Which of the following is the most appropriate way to guide more fluid?",
        ["Use a dynamic measure such as the response to a passive leg raise",
         "Use the physical examination alone",
         "Give a fixed extra 30 mL/kg every hour regardless of response",
         "Stop all fluids because the first bolus was given",
         "Guide fluid only with procalcitonin"],
        0,
        ["Dynamic measures are suggested over physical examination or static parameters alone.",
         "Examination alone is not the preferred guide.",
         "Repeated fixed 30 mL/kg doses every hour are not the recommendation.",
         "The initial bolus does not forbid further fluid guided by response.",
         "Procalcitonin is not the fluid guide."],
    ))
    return out


# Near-duplicate slots replaced by the cards above, in this order.
REWRITE = (
    list(range(335, 364))
    + list(range(314, 319))
    + [2, 3, 4, 5, 10, 11, 12, 13, 16, 31, 32, 33, 34, 35, 36]
)


def fix_lengths(options: list[str], key: int) -> list[str]:
    options = list(options)
    filler = [" given these results", " with the data above", " from the findings here"]
    guard = 0
    while guard < 8:
        lengths = [len(o) for o in options]
        key_len = lengths[key]
        others = [i for i in range(5) if i != key]
        other_max = max(lengths[i] for i in others)
        if key_len <= other_max:
            return options
        if (key_len - other_max) < 20 and key_len < other_max * 1.25:
            return options
        idx = max(others, key=lambda i: lengths[i])
        addition = filler[guard % len(filler)]
        if addition.strip() in options[idx]:
            guard += 1
            continue
        trial = options[idx] + addition
        if trial not in options:
            options[idx] = trial
        guard += 1
    return options


def apply_wording(row: dict) -> None:
    scenario = row["scenario"]
    question = row["question"]
    explanation = row["explanation"]
    correct = row["correct"]
    male = " man " in f" {scenario} " or scenario.startswith("A ") and " man " in scenario
    # Male pregnancy sentences are authoring artifacts.
    if re.search(r"\bman\b", scenario):
        scenario = re.sub(r"\s*He is not pregnant and is not preparing for a pregnancy\.?", "", scenario)
        scenario = re.sub(r"\s*He is not pregnant\.?", "", scenario)
        scenario = re.sub(r"\s*He has no planned pregnancy\.?", "", scenario)
        scenario = re.sub(r"\s*There is no planned pregnancy\.?", "", scenario)
    replacements = {
        "has lost no discussion of her meals": "has never had her meals discussed",
        "Sticks have been clicking more slowly because of fatigue. ": "",
        "No different interval is stated here to invent. ": "",
        "The source does not name a drug or a dose. ": "",
        "The source does not name a drug or a dose": "",
        "no drug or dose is named": "treatment is chosen clinically",
        "No such limit is being read from a result; she is simply 88. ": "",
        "The facts do not create an age-80 stopping point. ": "",
        "no kilogram cutoff is required beyond that clinical finding": "the clinical finding is what matters",
        "No drug names are being changed today. ": "",
        "Pulse and other findings are for his own clearance visit. ": "",
        "Temperature is as listed. ": "",
        "Temperature is as listed": "",
        "That combination is not reliable enough to call a pharyngeal alternative, which is not this site.":
            "Gentamicin plus azithromycin is an alternative for urogenital or rectal infection; it is not reliable for pharyngeal infection.",
    }
    for old, new in replacements.items():
        scenario = scenario.replace(old, new)
        question = question.replace(old, new)
        explanation = explanation.replace(old, new)
        correct = correct.replace(old, new)
    if n_of(row["id"]) == 40:
        scenario = scenario.replace(
            "glucose test",
            "diagnosis of gestational diabetes",
            1,
        ) if "gestational diabetes" not in scenario.lower() else scenario
    if n_of(row["id"]) == 42 and "gestational diabetes" not in scenario.lower():
        scenario = "Gestational diabetes was diagnosed in the prior pregnancy. " + scenario
    row["scenario"] = re.sub(r"\s{2,}", " ", scenario).strip()
    row["question"] = re.sub(r"\s{2,}", " ", question).strip()
    row["explanation"] = re.sub(r"\s{2,}", " ", explanation).strip()
    row["correct"] = correct


def specific_repairs(row: dict) -> None:
    number = n_of(row["id"])
    opts, payload = options_of(row["options"])
    if number == 30:
        row["scenario"] = row["scenario"].replace(
            "the tally is 168 g of carbohydrate",
            "a 3-day food record averages 168 g of carbohydrate per day",
        )
    if number == 112:
        row["scenario"] = (
            "A 71-year-old woman who works as a gate agent is seen in the employee clinic to ask whether cervical screening can stop. "
            "Negative cytology was obtained at ages 52, 55, and 58. The most recent test was 7 years before she turned 65, and none has been done since. "
            "She has no high-grade history, no immune suppression, and no in-utero exposure history. "
            "Temperature is 36.5°C, pulse is 68/min, respirations are 14/min, and blood pressure is 136/80 mm Hg. Hemoglobin is 12.9 g/dL."
        )
        row["question"] = "Which of the following is the most appropriate plan?"
        opts = [
            "Stop, because three negative tests at any ages are enough",
            "Do not stop; the most recent test was more than 5 years before age 65",
            "Stop, because she is past 65 and has no new partner",
            "Primary HPV testing every 3 years is required before any stop",
            "The record already meets adequate screening at the time she turned 65",
        ]
        whys = [
            "Three negatives must fall in the 10 years before stopping, with the latest within 5 years.",
            "Adequate prior screening requires the most recent of 3 negative cytology tests to be within 5 years before screening stops. A last test at 58 is 7 years before age 65, so screening was not adequate and should not stop.",
            "A new partner is not what makes this record inadequate, and its absence does not repair the timing.",
            "Primary HPV every 3 years is not the requirement being used to close this record.",
            "The tests at 52, 55, and 58 do not place the latest test within 5 years of age 65.",
        ]
        row["correct"] = opts[1]
        row["explanation"] = explanation(opts, 1, whys)
        payload["options"] = opts
        row["options"] = json.dumps(payload)
    if number == 267:
        row["scenario"] = (
            "A 67-year-old woman who works as a landscape designer is seen in the gynecology clinic with old laboratory reports. "
            "Negative cytology was obtained at ages 53, 55, and 56. The most recent test was 9 years before she turned 65, and none has been done since. "
            "She has no high-grade lesion and the cervix is present. "
            "Temperature is 36.4°C, pulse is 72/min, respirations are 15/min, and blood pressure is 130/76 mm Hg. Body mass index is 29 kg/m2."
        )
        row["question"] = "Which of the following is the most appropriate recommendation?"
        opts = [
            "Stop, because any 3 negative cytology tests end screening after 65",
            "Do not stop; the most recent test was more than 5 years before age 65",
            "Stop, because she has no new partner",
            "The under-21 rule is what ends screening after 65",
            "Count these as 2 negative cotests and stop",
        ]
        whys = [
            "Three negatives have to be timed correctly; any three tests are not enough.",
            "The latest of the three negative cytology tests must be within 5 years before stopping. Age 56 is 9 years before age 65, so prior screening was not adequate.",
            "Absence of a new partner does not replace the 5-year timing requirement.",
            "The grade D recommendation against screening under 21 is a different rule.",
            "These were cytology tests, not cotests, and the timing is not adequate.",
        ]
        row["correct"] = opts[1]
        row["explanation"] = explanation(opts, 1, whys)
        payload["options"] = opts
        row["options"] = json.dumps(payload)
    if number == 131:
        row["question"] = "Which of the following is the most appropriate plan?"
        opts = [
            "Screen for major depression under the adolescent recommendation for ages 12 to 18",
            "Do not screen, because only the adult rule exists and it starts at 19",
            "Routine suicide-risk screening is the grade B service at age 18",
            "Absence of risk factors postpones every mood question until age 19",
            "Start an antidepressant today without a mood assessment",
        ]
        whys = [
            "USPSTF recommends screening adolescents aged 12 to 18 for major depressive disorder. An 18-year-old is inside that range. The adult statement starting at 19 does not mean he is left unscreened.",
            "The adolescent recommendation covers him. Saying that no recommendation applies is incorrect.",
            "Suicide-risk screening in adolescents is an I statement, not the grade B service.",
            "Risk factors are not required before adolescent depression screening.",
            "A medicine is not started in place of screening.",
        ]
        row["correct"] = opts[0]
        row["explanation"] = explanation(opts, 0, whys)
        row["refs"] = json.dumps([{"label": ADEP[0], "url": ADEP[1]}])
        payload["options"] = opts
        row["options"] = json.dumps(payload)
    if number == 148:
        row["topic"] = "depression-offer-therapy-or-medication"
        row["scenario"] = (
            "A 46-year-old woman who works as a textile chemist is seen in the primary care office. "
            "For 9 weeks she has had low mood, loss of pleasure, and early waking, and a mood disorder has been recognized. "
            "No treatment has started. She can attend therapy and is willing to consider a medicine. She is not pregnant. "
            "Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. She weighs 67 kg."
        )
        row["question"] = "Which of the following is the most appropriate treatment plan?"
        opts = [
            "Screening forms only, with no treatment",
            "A single named drug and dose are required before any care",
            "Offer psychotherapy or pharmacotherapy",
            "Treatment is limited to adults 65 or older",
            "Routine suicide-risk screening must be positive before any treatment",
        ]
        whys = [
            "She is past the screening decision; symptoms are already present and treatment is indicated.",
            "The recommendation does not require one branded drug or one milligram dose before care starts.",
            "Treatment of major depression includes psychotherapy or pharmacotherapy. Either is an appropriate offer when symptoms are already recognized and she can use both.",
            "Treatment is not limited to age 65 or older.",
            "An I statement on routine suicide-risk screening does not block treatment of recognized depression.",
        ]
        row["correct"] = opts[2]
        row["explanation"] = explanation(opts, 2, whys)
        payload["options"] = opts
        row["options"] = json.dumps(payload)
    if number == 297:
        opts = [
            "Ceftriaxone 1 g intramuscularly once and no other antibiotic",
            "Ceftriaxone 500 mg once, plus doxycycline 100 mg twice daily and metronidazole 500 mg twice daily, each for 14 days",
            "Cefixime 800 mg orally once as the preferred regimen",
            "Gentamicin 240 mg once plus azithromycin 2 g once",
            "Azithromycin 2 g once and no cephalosporin",
        ]
        whys = [
            "A 1 g ceftriaxone dose without doxycycline and metronidazole does not treat pelvic inflammatory disease, and her weight is under 150 kg.",
            "Cervical motion tenderness with pelvic discomfort meets minimum criteria for pelvic inflammatory disease. The outpatient regimen is ceftriaxone 500 mg intramuscularly once, doxycycline 100 mg orally twice daily for 14 days, and metronidazole 500 mg orally twice daily for 14 days.",
            "Cefixime is not the preferred cephalosporin for this infection, and it omits the 14-day doxycycline and metronidazole.",
            "Gentamicin plus azithromycin is an allergy alternative for uncomplicated gonorrhea, not the pelvic inflammatory disease regimen, and she has no cephalosporin allergy.",
            "Azithromycin alone does not treat pelvic inflammatory disease or gonorrhea.",
        ]
        row["correct"] = opts[1]
        row["explanation"] = explanation(opts, 1, whys)
        row["question"] = "Which of the following is the most appropriate regimen?"
        payload["options"] = opts
        row["options"] = json.dumps(payload)
    if 216 <= number <= 245 and number not in (220, 227):
        if "gonorrhoeae" not in row["scenario"].lower() and "gonorrhoeae" not in row["question"].lower():
            row["scenario"] = row["scenario"].rstrip(".") + ". A nucleic acid amplification test from the infected site is positive for Neisseria gonorrhoeae."
    if number == 106 and "USPSTF" not in row["question"]:
        row["question"] = "According to USPSTF recommendations, which of the following is the most appropriate screening plan?"
    if number == 249 and "USPSTF" not in row["question"]:
        row["question"] = "According to USPSTF recommendations, which of the following is the most appropriate HIV plan?"
    if number == 360 and "USPSTF" not in row["question"]:
        row["question"] = "According to USPSTF recommendations, which of the following is the most appropriate response to the advertised test?"
    if number == 206:
        # I statement for men, replacing document-meta wording if present.
        if "does not state" in row["correct"].lower() or "no male" in row["correct"].lower() or "universal screening age" in row["correct"].lower():
            opts, payload = options_of(row["options"])
            idx = opts.index(row["correct"])
            opts[idx] = "Evidence is insufficient to recommend routine screening in men"
            row["correct"] = opts[idx]
            payload["options"] = opts
            row["options"] = json.dumps(payload)
    if number == 207 and ("female" in row["correct"].lower() or "women" in row["correct"].lower() or "does not" in row["correct"].lower()):
        opts, payload = options_of(row["options"])
        idx = opts.index(row["correct"])
        opts[idx] = "Evidence is insufficient to recommend routine bone-density screening in men"
        row["correct"] = opts[idx]
        payload["options"] = opts
        row["options"] = json.dumps(payload)
    if number == 208 and "page" in row["correct"].lower():
        row["correct"] = row["correct"].replace("on the page", "in the WHO definition")
    if number == 211 and "hip and spine" not in row["scenario"].lower():
        row["scenario"] = row["scenario"].rstrip(".") + ". Hip and spine measurements are technically valid."
    if number == 257 and "3 days" in row["scenario"]:
        row["scenario"] = row["scenario"].replace("3 days", "8 months")
    if number == 345:
        row["question"] = "Which of the following is the most appropriate discussion with him?"
        if "still required" in row["correct"].lower() or "colonoscopy" in row["correct"].lower():
            opts, payload = options_of(row["options"])
            idx = opts.index(row["correct"])
            opts[idx] = "Discuss diagnostic colonoscopy; a positive stool test has no benefit without it"
            row["correct"] = opts[idx]
            payload["options"] = opts
            row["options"] = json.dumps(payload)
    if number == 384:
        row["scenario"] = row["scenario"].replace("a cited meta-analysis", "the guideline evidence")
        row["explanation"] = re.sub(r"[^.]*milligram dose is not named[^.]*\.", "", row["explanation"])
        row["explanation"] = re.sub(r"[^.]*No milligram dose is specified[^.]*\.", "", row["explanation"])
    # Male "her weight" / "discharge her" in options.
    if re.search(r"\bman\b", row["scenario"]) or re.search(r"\bboy\b", row["scenario"]):
        opts, payload = options_of(row["options"])
        changed = False
        for i, opt in enumerate(opts):
            new = opt.replace("her weight", "his weight").replace("discharge her today", "discharge him today")
            if new != opt:
                opts[i] = new
                changed = True
                if row["correct"] == opt:
                    row["correct"] = new
        if changed:
            payload["options"] = opts
            row["options"] = json.dumps(payload)
            row["explanation"] = row["explanation"].replace("her weight", "his weight").replace("discharge her today", "discharge him today")


def apply_citation(row: dict, citations: dict[int, str]) -> None:
    number = n_of(row["id"])
    if number in citations and number not in REWRITE and number not in (131,):
        url = citations[number]
        row["refs"] = json.dumps([{"label": ADA_LABEL, "url": url}])


def apply_rewrite(row: dict, new: dict) -> None:
    opts, payload = options_of(row["options"])
    try:
        old_index = opts.index(row["correct"])
    except ValueError:
        old_index = 0
    new_opts, new_whys = place(new["options"], new["whys"], new["key"], old_index)
    new_opts = fix_lengths(new_opts, old_index)
    payload["options"] = new_opts
    payload["blueprintSystem"] = new["domain"]
    payload["blueprintTopic"] = new["topic"]
    payload["taskCategory"] = new["task"]
    payload["stepLevel"] = "step2"
    row["scenario"] = new["scenario"]
    row["question"] = new["question"]
    row["options"] = json.dumps(payload)
    row["correct"] = new_opts[old_index]
    row["explanation"] = explanation(new_opts, old_index, new_whys)
    row["refs"] = json.dumps([{"label": new["label"], "url": new["url"]}])
    row["domain"] = new["domain"]
    row["subject"] = new["subject"]
    row["topic"] = new["topic"]
    row["task"] = new["task"]
    row["difficulty"] = new["difficulty"]


def strip_option_pads(row: dict) -> None:
    opts, payload = options_of(row["options"])
    cleaned = [strip_pads(opt) for opt in opts]
    if len(set(cleaned)) != 5:
        return
    try:
        key = cleaned.index(strip_pads(row["correct"])) if strip_pads(row["correct"]) in cleaned else opts.index(row["correct"])
    except ValueError:
        return
    cleaned = fix_lengths(cleaned, key)
    row["correct"] = cleaned[key]
    payload["options"] = cleaned
    row["options"] = json.dumps(payload)
    # Keep explanation aligned with the cleaned option strings.
    row["explanation"] = row["explanation"]
    for old, new in zip(opts, cleaned):
        if old != new:
            row["explanation"] = row["explanation"].replace(old, new)


def main() -> None:
    catalog = cards()
    if len(catalog) != len(REWRITE):
        raise SystemExit(f"cards {len(catalog)} != rewrite slots {len(REWRITE)}")
    citations = load_citations()
    rows = json.loads(Path("/tmp/s2-items.json").read_text())
    by_n = {n_of(row["id"]): row for row in rows}
    changed = []
    for number, new in zip(REWRITE, catalog):
        row = by_n[number]
        before = json.dumps(row, sort_keys=True)
        apply_rewrite(row, new)
        row["hash"] = content_hash(row["subject"], row["scenario"], row["question"])
        if json.dumps(row, sort_keys=True) != before:
            changed.append(row["id"])
    for row in rows:
        number = n_of(row["id"])
        if (row["topic"].startswith("colon-") or row["topic"].startswith("crc-")) and row["domain"] != "gastrointestinal":
            row["domain"] = "gastrointestinal"
            row["subject"] = "gastroenterology"
            opts, payload = options_of(row["options"])
            payload["blueprintSystem"] = "gastrointestinal"
            payload["options"] = opts
            row["options"] = json.dumps(payload)
            changed.append(row["id"])
        if number in REWRITE:
            continue
        before = (row["scenario"], row["question"], row["options"], row["correct"], row["explanation"], row["refs"])
        apply_wording(row)
        specific_repairs(row)
        apply_citation(row, citations)
        strip_option_pads(row)
        row["hash"] = content_hash(row["subject"], row["scenario"], row["question"])
        after = (row["scenario"], row["question"], row["options"], row["correct"], row["explanation"], row["refs"])
        if after != before:
            changed.append(row["id"])
    # Length and hidden-safety checks.
    letters = []
    for row in rows:
        opts, _ = options_of(row["options"])
        if row["correct"] not in opts:
            raise SystemExit(f"key missing {row['id']}")
        if len(set(opts)) != 5:
            raise SystemExit(f"options not unique {row['id']}")
        key = opts.index(row["correct"])
        lengths = [len(o) for o in opts]
        other = max(length for i, length in enumerate(lengths) if i != key)
        if lengths[key] > other and ((lengths[key] - other) >= 20 or lengths[key] >= other * 1.25):
            raise SystemExit(f"length cue {row['id']} {lengths[key]} vs {other}")
        letters.append("ABCDE"[key])
        if "gonorrhoeae" not in (row["scenario"] + row["question"]).lower():
            if 216 <= n_of(row["id"]) <= 245 and n_of(row["id"]) not in (220, 227) and n_of(row["id"]) not in REWRITE:
                raise SystemExit(f"missing NAAT {row['id']}")
    from collections import Counter
    counts = Counter(letters)
    print("letters", dict(counts))
    if dict(counts) != {letter: 80 for letter in "ABCDE"}:
        raise SystemExit(f"key slots drifted: {dict(counts)}")
    print("changed", len(set(changed)))
    print("rewritten", len(REWRITE))
    Path("/tmp/s2-fixed.json").write_text(json.dumps(rows))
    Path("/tmp/s2-changed-ids.txt").write_text("\n".join(sorted(set(changed))) + "\n")


if __name__ == "__main__":
    main()
