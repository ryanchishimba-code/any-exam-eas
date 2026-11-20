#!/usr/bin/env python3
"""Author the hidden NCLEX-RN 300 pack. Does not touch a database."""
import json
from pathlib import Path

NCSBN = {
    "label": "NCSBN. NCLEX-RN Test Plan, effective April 2026",
    "url": "https://www.ncsbn.org/public-files/2026_RN_Test-Plan_English-F.pdf",
}
CDC = {
    "label": "CDC. Isolation Precautions and transmission-based precautions for healthcare. CDC 2024",
    "url": "https://www.cdc.gov/infection-control/hcp/isolation-precautions/index.html",
}
TJC = {
    "label": "The Joint Commission. National Patient Safety Goals. 2026",
    "url": "https://www.jointcommission.org/standards/national-patient-safety-goals/",
}
AHA = {
    "label": "American Heart Association. CPR and ECC guidelines. AHA 2025",
    "url": "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines",
}
SSC = {
    "label": "Evans L et al. Surviving Sepsis Campaign 2021 adult guidelines. Crit Care Med 2021",
    "url": "https://pubmed.ncbi.nlm.nih.gov/34599691/",
}
ADA = {
    "label": "American Diabetes Association. Standards of Care in Diabetes 2026. Diabetes Care 2026",
    "url": "https://diabetesjournals.org/care/issue/49/Supplement_1",
}
ISMP = {
    "label": "Institute for Safe Medication Practices. Targeted Medication Safety Best Practices. ISMP 2024",
    "url": "https://www.ismp.org/guidelines/best-practices-hospitals",
}
CDC_VAX = {
    "label": "CDC. Adult immunization schedule. CDC 2026",
    "url": "https://www.cdc.gov/vaccines/hcp/imz-schedules/adult-notes.html",
}
LABEL = {
    "management-of-care": "Management of Care",
    "safety-infection": "Safety and Infection Prevention and Control",
    "health-promotion": "Health Promotion and Maintenance",
    "psychosocial": "Psychosocial Integrity",
    "basic-care-comfort": "Basic Care and Comfort",
    "pharmacology-nursing": "Pharmacological and Parenteral Therapies",
    "reduction-risk": "Reduction of Risk Potential",
    "physiological-adaptation": "Physiological Adaptation",
}
ITEMS = []

def base(area, topic, diff, item_type, scenario, question, explanation, refs):
    return {
        "fieldId": "nursing",
        "subjectId": area,
        "clientNeeds": area,
        "clientNeedsCategory": LABEL[area],
        "blueprintTopic": topic,
        "difficulty": diff,
        "itemType": item_type,
        "scenario": scenario,
        "question": question,
        "explanation": explanation if explanation.lower().find("incorrect") >= 0 else explanation + " Incorrect choices miss the priority, the scope, or the precaution.",
        "references": refs,
        "active": False,
        "qaPassed": False,
        "generationVersion": "nclex-300-20261108-v1",
    }

def mcq(area, topic, diff, scenario, question, options, key, why, wrong, refs):
    item = base(area, topic, diff, "vignette", scenario, question, f"{key} is the nurse's action. {why} Incorrect: {wrong}", refs)
    item["options"] = options
    item["correctAnswer"] = key
    item["kind"] = "mcq"
    ITEMS.append(item)

def sata(area, topic, diff, scenario, question, options, keys, why, wrong, refs):
    item = base(area, topic, diff, "select_all", scenario, question, f"The indicated choices are the ones that change the plan now. {why} Incorrect: {wrong}", refs)
    item["options"] = options
    item["correctAnswer"] = "|||".join(keys)
    ITEMS.append(item)

def _nocomma(text):
    return text.replace(",", " and")

def bow(area, topic, diff, scenario, question, condition, actions, monitors, action, mon1, mon2, why, wrong, refs):
    actions = [_nocomma(a) for a in actions]
    monitors = [_nocomma(m) for m in monitors]
    action, mon1, mon2 = _nocomma(action), _nocomma(mon1), _nocomma(mon2)
    item = base(area, topic, diff, "ngn_bowtie", scenario, question, f"Take {action} and watch {mon1} and {mon2}. {why} Incorrect: {wrong}", refs)
    item["options"] = actions + monitors
    item["correctAnswer"] = f"{action},{mon1},{mon2}"
    item["condition"] = condition
    item["actions"] = actions
    item["monitors"] = monitors
    ITEMS.append(item)

def matrix(area, topic, diff, scenario, question, rows, columns, pairs, why, wrong, refs):
    rows = [_nocomma(r) for r in rows]
    columns = [_nocomma(c) for c in columns]
    pairs = [(_nocomma(r), _nocomma(c)) for r, c in pairs]
    item = base(area, topic, diff, "ngn_matrix", scenario, question, f"Each finding is classified by the action it requires. {why} Incorrect: {wrong}", refs)
    item["options"] = [f"{row}|||{col}" for row in rows for col in columns]
    item["rows"] = rows
    item["columns"] = columns
    item["correctAnswer"] = ",".join(f"{row}|||{col}" for row, col in pairs)
    ITEMS.append(item)

def ordered(area, topic, diff, scenario, question, display, sequence, why, wrong, refs):
    display = [_nocomma(x) for x in display]
    sequence = [_nocomma(x) for x in sequence]
    item = base(area, topic, diff, "ordered_response", scenario, question, f"The safe order is fixed by the risk, not by the list on the screen. {why} Incorrect: {wrong}", refs)
    item["options"] = display
    item["correctAnswer"] = ",".join(sequence)
    ITEMS.append(item)

def case(area, topic, diff, group, step, scenario, question, options, key, why, wrong, refs):
    item = base(area, topic, diff, "case_study", scenario, question, f"{key} fits this step of the case. {why} Incorrect: {wrong}", refs)
    item["options"] = options
    item["correctAnswer"] = key
    item["caseGroupId"] = group
    item["caseStep"] = step
    ITEMS.append(item)
