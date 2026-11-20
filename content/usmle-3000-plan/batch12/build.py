#!/usr/bin/env python3
"""Assemble batch 12 and reject items that miss the exam bar."""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
YEAR = re.compile(r"\b(?:19|20)\d{2}\b")
BANNED_Q = re.compile(
    r"\b(next step|most appropriate|administer|start|give|treat|management|priority)\b",
    re.I,
)


class ItemError(Exception):
    pass


def assemble(item):
    opts = item["options"]
    if len(opts) != 5:
        raise ItemError(f"{item['id']}: need 5 options")
    texts = [o["text"].strip() for o in opts]
    if len(set(texts)) != 5 or any(len(t) < 12 for t in texts):
        raise ItemError(f"{item['id']}: options must be distinct and specific")
    keys = [i for i, o in enumerate(opts) if o.get("correct")]
    if len(keys) != 1:
        raise ItemError(f"{item['id']}: need one key")
    key = texts[keys[0]]
    lengths = sorted(len(t) for t in texts)
    median = lengths[2]
    if len(key) > median * 1.8 and len(key) > median + 80:
        raise ItemError(f"{item['id']}: correct option is much longer than the others")
    takeaway = item["takeaway"].strip()
    citation = item["citation"].strip()
    if len(takeaway) < 40 or not YEAR.search(citation):
        raise ItemError(f"{item['id']}: takeaway or citation year")
    scenario = re.sub(r"\s+", " ", item["scenario"]).strip()
    question = re.sub(r"\s+", " ", item["question"]).strip()
    if "year-old patient" not in scenario and "month-old patient" not in scenario:
        raise ItemError(f"{item['id']}: vignette age phrasing")
    if len(scenario) < 120:
        raise ItemError(f"{item['id']}: vignette too thin")
    if item["difficulty"] not in (2, 3, 4):
        raise ItemError(f"{item['id']}: difficulty must be 2, 3, or 4")
    if key.lower() in scenario.lower():
        raise ItemError(f"{item['id']}: key text is in the stem")
    if not re.search(r"\d", scenario):
        raise ItemError(f"{item['id']}: stem needs raw numbers")
    parts = [takeaway, citation, key + ". " + opts[keys[0]]["why"].strip()]
    for text, opt in zip(texts, opts):
        if text == key:
            continue
        why = opt["why"].strip()
        if len(why) < 25:
            raise ItemError(f"{item['id']}: thin distractor rationale")
        parts.append(text + ". " + why)
    explanation = " ".join(parts)
    if takeaway not in explanation or any(t not in explanation for t in texts):
        raise ItemError(f"{item['id']}: explanation missing takeaway or option")
    if BANNED_Q.search(question) and not YEAR.search(explanation):
        raise ItemError(f"{item['id']}: management wording without a year")
    return {
        "id": item["id"],
        "fieldId": item["fieldId"],
        "stepLevel": item["stepLevel"],
        "outlineSystem": item["outlineSystem"],
        "outlineWeight": item["outlineWeight"],
        "blueprintTopic": item["blueprintTopic"],
        "blueprintDomain": item["blueprintDomain"],
        "difficulty": item["difficulty"],
        "subjectId": item["subjectId"],
        "examTakeaway": takeaway,
        "scenario": scenario,
        "question": question,
        "options": texts,
        "correctAnswer": key,
        "explanation": explanation,
        "citation": citation,
    }


def fingerprint(row):
    text = f"{row['scenario']} {row['question']}".lower()
    text = re.sub(r"\b\d+\s*-?\s*(?:year|month)-?\s*old\b", "patient", text)
    text = re.sub(r"\b\d+(?:\.\d+)?\b", "", text)
    text = re.sub(r"[^a-z\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text[:180]


def load():
    sys.path.insert(0, str(ROOT))
    rows = []
    errors = []
    for name in ("s2_items", "s1_items"):
        path = ROOT / f"{name}.py"
        if not path.exists():
            continue
        mod = __import__(name)
        for item in mod.ITEMS:
            try:
                rows.append(assemble(item))
            except ItemError as exc:
                errors.append(str(exc))
    if errors:
        raise SystemExit("\n".join(errors))
    seen = {}
    for row in rows:
        fp = fingerprint(row)
        if len(fp) < 40:
            raise SystemExit(f"{row['id']}: short fingerprint")
        if fp in seen:
            raise SystemExit(f"{row['id']}: same family as {seen[fp]}")
        seen[fp] = row["id"]
    return rows


def main():
    rows = load()
    for label, field in (("step1", "usmle-step-1"), ("step2", "usmle-step-2")):
        group = [r for r in rows if r["fieldId"] == field]
        for index in range(0, len(group), 25):
            chunk = group[index : index + 25]
            name = f"{label}-{chr(ord('a') + index // 25)}.json"
            (ROOT / name).write_text(json.dumps(chunk, indent=2) + "\n")
        print(label, len(group), "difficulties", sorted({r["difficulty"] for r in group}))
    letters = []
    for row in rows:
        letter = "ABCDE"[row["options"].index(row["correctAnswer"])]
        letters.append(letter)
    print("key letters", {k: letters.count(k) for k in "ABCDE"})


if __name__ == "__main__":
    main()
