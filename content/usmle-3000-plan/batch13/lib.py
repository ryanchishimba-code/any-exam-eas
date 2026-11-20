"""Batch 13 constructor. Answer letter rotates. One pronoun per item."""

import re

MALE = re.compile(r"\b(she|her|hers|woman|women|girl)\b", re.I)
FEMALE = re.compile(r"\b(he|him|his|man|men|boy)\b", re.I)
THEY = re.compile(r"\b(they|them|their|theirs)\b", re.I)


def item(n, step, sex, system, weight, topic, diff, subject, takeaway, citation, scenario, question, correct, wrongs):
    if sex not in ("m", "f"):
        raise ValueError(n)
    if len(wrongs) != 4:
        raise ValueError(f"{n} needs 4 distractors")
    blob = " ".join([scenario, question, correct[0], correct[1], *[x for w in wrongs for x in w]])
    if THEY.search(blob):
        raise ValueError(f"{n} mixes they: {THEY.search(blob).group()}")
    if sex == "m" and MALE.search(blob):
        raise ValueError(f"{n} male vignette contains a female word: {MALE.search(blob).group()}")
    if sex == "f" and FEMALE.search(blob):
        raise ValueError(f"{n} female vignette contains a male word: {FEMALE.search(blob).group()}")
    if sex == "m" and not re.search(r"\b(he|him|his)\b", scenario, re.I):
        scenario = scenario.rstrip() + " He is the patient in front of the clinician."
    if sex == "f" and not re.search(r"\b(she|her)\b", scenario, re.I):
        scenario = scenario.rstrip() + " She is the patient in front of the clinician."
    slot = (n - 1) % 5
    texts = []
    wi = 0
    for i in range(5):
        if i == slot:
            texts.append({"text": correct[0], "why": correct[1], "correct": True})
        else:
            texts.append({"text": wrongs[wi][0], "why": wrongs[wi][1], "correct": False})
            wi += 1
    prefix = "b13-s1-" if step == "step1" else "b13-s2-"
    field = "usmle-step-1" if step == "step1" else "usmle-step-2"
    return {
        "id": f"{prefix}{n:02d}",
        "fieldId": field,
        "stepLevel": step,
        "outlineSystem": system,
        "outlineWeight": weight,
        "blueprintTopic": topic,
        "blueprintDomain": system,
        "difficulty": diff,
        "subjectId": subject,
        "takeaway": takeaway,
        "citation": citation,
        "scenario": scenario,
        "question": question,
        "options": texts,
        "sex": sex,
    }
