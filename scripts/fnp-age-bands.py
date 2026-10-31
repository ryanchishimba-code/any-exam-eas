#!/usr/bin/env python3
"""Tag every FNP card with an AANPCB age band.

A stem that already states an age is left alone. Otherwise the stem is
reframed with a clinically plausible age, and the answer is not edited.
"""

from __future__ import annotations

import json
import re
import subprocess
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "content" / "fnp-feed" / "cards" / "cards-fnp.FINAL-20261031.json"

LOCKS = {
    "Newborn": ["fnp-035", "fnp-115", "fnp-145", "fnp-194"],
    "Infant": ["fnp-036", "fnp-039", "fnp-063", "fnp-085", "fnp-110", "fnp-116"],
    "Toddler": ["fnp-038", "fnp-057", "fnp-073", "fnp-096", "fnp-113", "fnp-114", "fnp-133", "fnp-165"],
    "Child": ["fnp-002", "fnp-004", "fnp-034", "fnp-064", "fnp-083", "fnp-108", "fnp-169", "fnp-186"],
    "Adolescent": [
        "fnp-025", "fnp-040", "fnp-041", "fnp-042", "fnp-058", "fnp-074", "fnp-079", "fnp-086",
        "fnp-091", "fnp-103", "fnp-109", "fnp-134", "fnp-146", "fnp-155", "fnp-162", "fnp-163",
        "fnp-170", "fnp-185",
    ],
    "Young adult": [
        "fnp-022", "fnp-023", "fnp-024", "fnp-027", "fnp-029", "fnp-043", "fnp-044", "fnp-045",
        "fnp-046", "fnp-047", "fnp-048", "fnp-052", "fnp-053", "fnp-054", "fnp-056", "fnp-071",
        "fnp-076", "fnp-089", "fnp-090", "fnp-092", "fnp-093", "fnp-094", "fnp-102", "fnp-104",
        "fnp-118", "fnp-123", "fnp-135", "fnp-137", "fnp-139", "fnp-140", "fnp-141", "fnp-142",
        "fnp-147", "fnp-148", "fnp-149", "fnp-150", "fnp-151", "fnp-156", "fnp-161", "fnp-168",
        "fnp-174", "fnp-189", "fnp-192", "fnp-193",
    ],
    "Older adult": [
        "fnp-005", "fnp-008", "fnp-009", "fnp-010", "fnp-016", "fnp-019", "fnp-030", "fnp-031",
        "fnp-033", "fnp-050", "fnp-051", "fnp-061", "fnp-067", "fnp-068", "fnp-069", "fnp-070",
        "fnp-072", "fnp-077", "fnp-084", "fnp-088", "fnp-097", "fnp-098", "fnp-099", "fnp-100",
        "fnp-101", "fnp-105", "fnp-106", "fnp-107", "fnp-117", "fnp-119", "fnp-120", "fnp-121",
        "fnp-125", "fnp-126", "fnp-127", "fnp-128", "fnp-129", "fnp-131", "fnp-132", "fnp-136",
        "fnp-144", "fnp-153", "fnp-158", "fnp-159", "fnp-160", "fnp-167", "fnp-171", "fnp-172",
        "fnp-176", "fnp-177", "fnp-179", "fnp-180", "fnp-183", "fnp-184", "fnp-187", "fnp-188",
        "fnp-195", "fnp-196", "fnp-197", "fnp-199",
    ],
}

PHRASES = {
    "Newborn": ["A newborn"],
    "Infant": ["A 4-month-old", "A 6-month-old", "An 8-month-old", "A 9-month-old", "An 11-month-old"],
    "Toddler": ["An 18-month-old", "A 2-year-old"],
    "Child": ["A 4-year-old", "A 6-year-old", "An 8-year-old", "A 10-year-old"],
    "Adolescent": ["A 13-year-old", "A 15-year-old", "A 16-year-old", "A 17-year-old"],
    "Young adult": ["A 22-year-old", "A 26-year-old", "A 28-year-old", "A 32-year-old", "A 36-year-old"],
    "Middle adult": ["A 42-year-old", "A 48-year-old", "A 52-year-old", "A 56-year-old", "A 61-year-old"],
    "Older adult": ["A 66-year-old", "A 68-year-old", "A 72-year-old", "A 76-year-old", "An 80-year-old"],
}

TARGETS = {
    "Newborn": 4,
    "Infant": 6,
    "Toddler": 8,
    "Child": 8,
    "Adolescent": 18,
    "Young adult": 44,
    "Middle adult": 52,
    "Older adult": 60,
}


def stated_years(front: str) -> str | None:
    match = re.search(r"\b(\d{1,2})-year-old\b", front, re.I)
    if not match:
        match = re.search(r"\baged?\s+(\d{1,2})\b", front, re.I)
    if not match:
        return None
    age = int(match.group(1))
    if age <= 1:
        return "Infant"
    if age <= 3:
        return "Toddler"
    if age <= 11:
        return "Child"
    if age <= 17:
        return "Adolescent"
    if age <= 39:
        return "Young adult"
    if age <= 64:
        return "Middle adult"
    return "Older adult"


def stated_stage(front: str) -> str | None:
    years = stated_years(front)
    if years:
        return years
    checks = [
        ("Newborn", r"\bnewborns?\b|\bneonat"),
        ("Infant", r"\binfants?\b|\d{1,2}-month-old"),
        ("Toddler", r"\btoddlers?\b"),
        ("Adolescent", r"\badolescents?\b|\bteens?\b|\bteenagers?\b"),
        ("Young adult", r"\bpregnan|\bprenatal\b|\bpostpartum\b|\bgestational\b"),
        ("Older adult", r"\bolder adults?\b|\bgeriatric\b|\b65\s*\+|65 or older"),
    ]
    for band, pattern in checks:
        if re.search(pattern, front, re.I):
            return band
    return None


def noun_for(front: str) -> str:
    if re.search(r"\b(woman|women|she|her|mother)\b", front, re.I):
        return "woman"
    if re.search(r"\b(man|men|he|his|father)\b", front, re.I) and not re.search(r"\bwomen\b", front, re.I):
        return "man"
    return ""


def phrase_for(band: str, front: str, index: int) -> str:
    phrase = PHRASES[band][index % len(PHRASES[band])]
    if band in {"Young adult", "Middle adult", "Older adult"}:
        noun = noun_for(front)
        if noun:
            phrase = f"{phrase} {noun}"
    return phrase


PINNED = {
    "fnp-005": "A 68-year-old man",
    "fnp-016": "A 68-year-old",
    "fnp-026": "A 52-year-old",
    "fnp-057": "A 2-year-old",
    "fnp-096": "A 2-year-old",
}


def reframe(front: str, band: str, index: int, card_id: str = "") -> str:
    if stated_years(front) or re.search(
        r"\b(newborns?|neonat|infants?|toddlers?|teens?|teenagers?|pregnan|prenatal|postpartum|gestational|older adults?)\b",
        front,
        re.I,
    ):
        return front
    if re.search(r"\bat\s+\d{2}\b", front, re.I):
        return front
    phrase = PINNED.get(card_id) or phrase_for(band, front, index)
    if card_id == "fnp-057":
        return "A 2-year-old with ear pain: which otoscopy findings diagnose acute otitis media?"
    if card_id == "fnp-096":
        return "A 2-year-old with suspected UTI: how is it diagnosed?"
    return f"{phrase} is in clinic. {front}"


def main() -> None:
    cards = json.loads(PATH.read_text())
    original = json.loads(
        subprocess.check_output(
            ["git", "show", "HEAD:content/fnp-feed/cards/cards-fnp.FINAL-20261031.json"],
            cwd=ROOT,
        )
    )
    original_front = {card["id"]: card["front"] for card in original}
    for card in cards:
        card["front"] = original_front[card["id"]]
    lock_of = {card_id: band for band, ids in LOCKS.items() for card_id in ids}
    used = Counter()
    for card in cards:
        band = lock_of.get(card["id"]) or stated_stage(card["front"]) or "Middle adult"
        card["front"] = reframe(card["front"], band, used[band], card["id"])
        card["age_band"] = band
        used[band] += 1
    raw = PATH.read_text()
    indent = 1 if raw.startswith("[\n {") else 2
    PATH.write_text(json.dumps(cards, indent=indent, ensure_ascii=False) + "\n")
    print(dict(used))
    missing = [band for band, count in TARGETS.items() if used[band] != count]
    if missing:
        raise SystemExit(f"age mix missed { {band: (used[band], TARGETS[band]) for band in missing} }")
    if sum(used.values()) != 200 or any(not card.get("age_band") for card in cards):
        raise SystemExit("not every card is tagged")


if __name__ == "__main__":
    main()
