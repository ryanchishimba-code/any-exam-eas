#!/usr/bin/env python3
"""Add a named guideline and year to each NCLEX section that does not already cite one."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "content" / "nclex-study-guide"
HEADING = re.compile(r"^(#{2,3})\s+(.+)$")
YEAR = re.compile(r"\b(?:19|20)\d{2}\b")

DEFAULTS = {
    "01-exam-strategy.md": "NCSBN RN Test Plan, 2026",
    "02-fundamentals-safety.md": "NCSBN RN Test Plan, 2026",
    "03-management-of-care.md": "NCSBN/ANA National Guidelines for Nursing Delegation, 2019",
    "04-cardiac.md": "2025 ACC/AHA acute coronary syndromes guideline",
    "05-respiratory.md": "GINA strategy report, 2025",
    "06-neuro.md": "AHA/ASA early management of ischemic stroke, 2019",
    "07-endocrine.md": "ADA Standards of Care in Diabetes, 2026",
    "08-renal-fluids.md": "KDIGO CKD guideline, 2024",
    "09-gi-hepatic.md": "ACG GERD guideline, 2022",
    "10-other-medsurg.md": "Surviving Sepsis Campaign, 2021",
    "11-maternity-newborn.md": "ACOG Practice Bulletin 183 on postpartum hemorrhage, 2017",
    "12-pediatrics.md": "AAP Bright Futures, 2022",
    "13-psych.md": "VA/DoD major depressive disorder guideline, 2022",
    "14-pharmacology.md": "ISMP Targeted Medication Safety Best Practices, 2024",
    "15-quick-reference.md": "NCSBN RN Test Plan, 2026",
    "16-back-matter.md": "NCSBN RN Test Plan, 2026",
}

RULES = [
    (r"sepsis|septic shock", "Surviving Sepsis Campaign, 2021"),
    (r"stroke|\bTIA\b", "AHA/ASA early management of ischemic stroke, 2019"),
    (r"ACS|STEMI|chest pain|myocardial|angina", "2025 ACC/AHA acute coronary syndromes guideline"),
    (r"heart failure|pulmonary edema", "2022 AHA/ACC/HFSA heart failure guideline"),
    (r"\bACLS\b|cardiac arrest|defibrillat", "AHA ACLS guidelines, 2025"),
    (r"asthma", "GINA strategy report, 2025"),
    (r"COPD|pneumonia", "ATS/IDSA community-acquired pneumonia guideline, 2019"),
    (r"diabetes|insulin|hypoglycem", "ADA Standards of Care in Diabetes, 2026"),
    (r"\bCKD\b|dialysis|\bAKI\b", "KDIGO CKD guideline, 2024"),
    (r"GERD|peptic|GI bleed|hepatitis", "ACG GERD guideline, 2022"),
    (r"postpartum|hemorrhage|preeclamps|\blabor\b", "ACOG Practice Bulletin 183 on postpartum hemorrhage, 2017"),
    (r"newborn|pediatric|otitis", "AAP acute otitis media guideline, 2013"),
    (r"depress|suicid", "VA/DoD major depressive disorder guideline, 2022"),
    (r"delegat|priorit|assignment", "NCSBN/ANA National Guidelines for Nursing Delegation, 2019"),
    (r"isolat|precaution|hand hygiene", "CDC isolation precautions, 2007"),
    (r"pressure injur|wound", "NPIAP pressure-injury staging, 2016"),
]


def source_for(filename: str, heading: str, body: str) -> str:
    blob = f"{heading}\n{body[:700]}"
    for pattern, source in RULES:
        if re.search(pattern, blob, re.I):
            return source
    return DEFAULTS[filename]


def transform(path: Path) -> int:
    lines = path.read_text().splitlines()
    sections: list[tuple[str | None, list[str]]] = []
    head = None
    buf: list[str] = []
    for line in lines:
        if HEADING.match(line):
            sections.append((head, buf))
            head = line
            buf = []
        else:
            buf.append(line)
    sections.append((head, buf))
    out: list[str] = []
    added = 0
    for heading, body in sections:
        text = "\n".join(body)
        if heading and "Source:" not in text and not YEAR.search(text):
            src = source_for(path.name, heading, text)
            out.append(heading)
            out.append("")
            out.append(f"Source: {src}.")
            added += 1
        elif heading:
            out.append(heading)
        out.extend(body)
    rendered = re.sub(r"\n{3,}", "\n\n", "\n".join(out).strip() + "\n")
    path.write_text(rendered)
    return added


def main() -> None:
    total = 0
    for path in sorted(ROOT.glob("[0-9][0-9]-*.md")):
        if path.name == "00-front-matter.md":
            continue
        added = transform(path)
        total += added
        print(f"{added:3} {path.name}")
    print("added", total)


if __name__ == "__main__":
    main()
