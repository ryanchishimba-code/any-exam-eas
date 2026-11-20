#!/usr/bin/env python3
"""Assemble batch 13. Explanation is a paragraph, then one line per wrong option."""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
YEAR = re.compile(r"\b(?:19|20)\d{2}\b")


class ItemError(Exception):
    pass


def assemble(item):
    opts = item["options"]
    if len(opts) != 5:
        raise ItemError(f"{item['id']}: need 5 options")
    texts = [o["text"].strip() for o in opts]
    if len(set(t.lower() for t in texts)) != 5 or any(len(t) < 5 for t in texts):
        raise ItemError(f"{item['id']}: options must be distinct and specific")
    keys = [i for i, o in enumerate(opts) if o.get("correct")]
    if len(keys) != 1:
        raise ItemError(f"{item['id']}: need one key")
    key = texts[keys[0]]
    lengths = sorted(len(t) for t in texts)
    if len(key) > lengths[2] * 1.8 and len(key) > lengths[2] + 80:
        raise ItemError(f"{item['id']}: correct option is much longer")
    takeaway = item["takeaway"].strip()
    citation = item["citation"].strip()
    if len(takeaway) < 40 or not YEAR.search(citation):
        raise ItemError(f"{item['id']}: takeaway or citation year")
    scenario = re.sub(r"\s+", " ", item["scenario"]).strip()
    question = re.sub(r"\s+", " ", item["question"]).strip()
    if not re.search(r"\b(?:year|month)-old\b", scenario):
        raise ItemError(f"{item['id']}: vignette age")
    if len(scenario) < 90 or not re.search(r"\d", scenario):
        raise ItemError(f"{item['id']}: vignette too thin or no numbers")
    if item["difficulty"] not in (2, 3, 4):
        raise ItemError(f"{item['id']}: difficulty")
    if key.lower() in scenario.lower():
        raise ItemError(f"{item['id']}: key text is in the stem")
    right_why = re.sub(r"\s+", " ", opts[keys[0]]["why"]).strip()
    if takeaway.lower() not in right_why.lower() and takeaway.lower() not in (right_why + " " + takeaway).lower():
        right_why = takeaway + " " + right_why
    if takeaway.lower() not in right_why.lower():
        raise ItemError(f"{item['id']}: paragraph must teach the takeaway")
    paragraph = f"{right_why} {citation}"
    # Distractor wording must not be pasted into the paragraph.
    for text in texts:
        if text == key:
            continue
        if len(text) >= 20 and text.lower() in paragraph.lower():
            raise ItemError(f"{item['id']}: distractor text leaked into the paragraph")
    lines = [paragraph, "", key]
    for text, opt in zip(texts, opts):
        if text == key:
            continue
        why = re.sub(r"\s+", " ", opt["why"]).strip()
        if len(why) < 10:
            raise ItemError(f"{item['id']}: thin line for a wrong option")
        if len(text) >= 24 and text.lower() in why.lower():
            raise ItemError(f"{item['id']}: wrong-option line repeats the option inside the sentence")
        lines.append(f"{text} — {why}")
    explanation = "\n".join(lines)
    if takeaway.lower() not in explanation.lower():
        raise ItemError(f"{item['id']}: takeaway missing")
    for text in texts:
        if text.lower() not in explanation.lower() and text.lower()[:24] not in explanation.lower():
            raise ItemError(f"{item['id']}: option not addressed")
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
    text = re.sub(r"\b(?:man|woman)\b", "patient", text)
    text = re.sub(r"\b\d+(?:\.\d+)?\b", "", text)
    text = re.sub(r"[^a-z\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text[:180]


def load():
    sys.path.insert(0, str(ROOT))
    rows, errors = [], []
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
        raise SystemExit("\n".join(errors[:40]))
    seen = {}
    for row in rows:
        fp = fingerprint(row)
        if len(fp) < 40:
            raise SystemExit(f"{row['id']}: short fingerprint")
        if fp in seen:
            raise SystemExit(f"{row['id']}: same family as {seen[fp]}")
        seen[fp] = row["id"]
    prior = ROOT / "batch12-fingerprints.txt"
    if prior.exists():
        old = set(prior.read_text().splitlines())
        for row in rows:
            fp = fingerprint(row)
            if fp in old:
                raise SystemExit(f"{row['id']}: fingerprint matches batch 12")
    return rows


def main():
    rows = load()
    for label, field in (("step1", "usmle-step-1"), ("step2", "usmle-step-2")):
        group = [r for r in rows if r["fieldId"] == field]
        for index in range(0, len(group), 25):
            chunk = group[index : index + 25]
            letter = chr(ord("a") + index // 25)
            (ROOT / f"{label}-{letter}.json").write_text(json.dumps(chunk, indent=2) + "\n")
        from collections import Counter
        print(label, len(group), Counter(r["outlineSystem"] for r in group), "diff", Counter(r["difficulty"] for r in group))


if __name__ == "__main__":
    main()
