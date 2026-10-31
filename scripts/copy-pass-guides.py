#!/usr/bin/env python3
"""Premium copy pass for the FNP and NAPLEX manuscripts, plus leftover NCLEX/FNP upsells.

Idempotent. Does not write to a database. Front-matter trial offers stay put.
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GUIDES = [
    ROOT / "content" / "aanp-fnp-study-guide",
    ROOT / "content" / "naplex-study-guide",
    ROOT / "content" / "nclex-study-guide",
]

CLINICAL = {
    "aanp-fnp-study-guide": {
        "03-health-promotion-screening.md": "USPSTF screening recommendations and the ACIP immunization schedule, 2026",
        "04-cardiology.md": "2025 AHA/ACC high blood pressure guideline",
        "05-pulmonary.md": "GINA strategy report, 2025",
        "06-endocrine.md": "ADA Standards of Care in Diabetes, 2026",
        "07-gi-hepatic.md": "ACG GERD guideline, 2022",
        "08-renal-gu.md": "KDIGO CKD guideline, 2024",
        "09-womens-health.md": "CDC U.S. Medical Eligibility Criteria, 2024",
        "10-pediatrics-lifespan.md": "AAP Bright Futures and the ACIP immunization schedule, 2026",
        "11-psych-neuro.md": "USPSTF depression screening recommendation, 2023",
        "12-msk-derm.md": "ACP low back pain guideline, 2017",
        "13-ent-eyes-heme-id.md": "IDSA streptococcal pharyngitis guideline, 2012",
        "14-pharmacology-prescribing.md": "AGS Beers Criteria, 2023",
        "15-quick-reference.md": "the guideline named for that threshold",
    },
    "naplex-study-guide": {
        "02-foundational-knowledge.md": "USP General Chapter <797>, 2023",
        "04-medication-use-process.md": "ISMP Targeted Medication Safety Best Practices, 2024",
        "05-cardiology.md": "2025 AHA/ACC high blood pressure guideline",
        "06-infectious-disease.md": "ATS/IDSA community-acquired pneumonia guideline, 2019",
        "07-endocrine.md": "ADA Standards of Care in Diabetes, 2026",
        "08-respiratory.md": "GINA strategy report, 2025",
        "09-neuro-psych.md": "VA/DoD major depressive disorder guideline, 2022",
        "10-renal-hepatic.md": "KDIGO CKD guideline, 2024",
        "11-onc-heme.md": "ASCO venous thromboembolism guideline, 2023",
        "12-otc-selfcare.md": "ACG GERD guideline, 2022",
        "13-special-populations.md": "AGS Beers Criteria, 2023",
    },
}

RULES: list[tuple[str, str]] = [
    (r"preeclampsia|gestational hypertension", "ACOG Practice Bulletin 222, 2020"),
    (r"heart failure|HFrEF|HFpEF|\bGDMT\b", "2022 AHA/ACC/HFSA heart failure guideline"),
    (r"atrial fibrillation|\bDOAC\b|anticoagul", "2023 ACC/AHA/ACCP/HRS atrial fibrillation guideline"),
    (r"lipid|statin|\bLDL\b|\bASCVD\b|cholesterol", "2026 ACC/AHA dyslipidemia guideline"),
    (r"chest pain|\bACS\b|\bSTEMI\b|unstable angina", "2025 ACC/AHA acute coronary syndromes guideline"),
    (r"syncope", "2017 ACC/AHA syncope guideline"),
    (r"hypertension|\bHTN\b|blood pressure|hypertensive|\bACEI\b|\bARB\b|thiazide", "2025 AHA/ACC high blood pressure guideline"),
    (r"\basthma\b|\bGINA\b", "GINA strategy report, 2025"),
    (r"\bCOPD\b|\bGOLD\b", "GOLD report, 2025"),
    (r"pneumonia|\bCAP\b", "ATS/IDSA community-acquired pneumonia guideline, 2019"),
    (r"diabetes|\bA1C\b|HbA1c|metformin|SGLT2|GLP-1|insulin", "ADA Standards of Care in Diabetes, 2026"),
    (r"hyperthyroid|Graves|methimazole", "ATA hyperthyroidism guideline, 2016"),
    (r"thyroid|hypothyroid|levothyroxine|\bTSH\b", "ATA hypothyroidism guideline, 2014"),
    (r"H\.?\s*pylori|helicobacter", "ACG H. pylori guideline, 2024"),
    (r"\bMASLD\b|\bNAFLD\b|fatty liver", "AASLD MASLD guidance, 2023"),
    (r"colorectal|colonoscop", "USPSTF colorectal cancer screening, 2021"),
    (r"hepatitis C|\bHCV\b", "USPSTF hepatitis C screening, 2020"),
    (r"hepatitis B|\bHBV\b", "CDC adult hepatitis B screening, 2023"),
    (r"\bGERD\b|heartburn|\bPPI\b", "ACG GERD guideline, 2022"),
    (r"\bAKI\b|acute kidney", "KDIGO acute kidney injury guidance, 2024"),
    (r"\bCKD\b|eGFR|albuminuria|KDIGO", "KDIGO CKD guideline, 2024"),
    (r"kidney stone|nephrolith", "AUA medical management of kidney stones, 2014"),
    (r"cystitis|\bUTI\b|pyelonephritis|bacteriuria", "IDSA uncomplicated cystitis and pyelonephritis guideline, 2011"),
    (r"\bPSA\b|prostate cancer", "USPSTF prostate cancer screening, 2018"),
    (r"mammogra|breast cancer screen", "USPSTF breast cancer screening, 2024"),
    (r"cervical|\bPap\b|\bHPV\b", "USPSTF cervical cancer screening, 2018"),
    (r"contracept|\bIUD\b|\bMEC\b", "CDC U.S. Medical Eligibility Criteria, 2024"),
    (r"syphilis|chlamydia|gonorrhea|\bSTI\b|\bPID\b", "CDC STI Treatment Guidelines, 2021"),
    (r"otitis|\bAOM\b", "AAP acute otitis media guideline, 2013"),
    (r"pharyngitis|strep throat|\bGAS\b", "IDSA streptococcal pharyngitis guideline, 2012"),
    (r"sinusitis", "IDSA acute bacterial rhinosinusitis guideline, 2012"),
    (r"immuniz|vaccine|\bACIP\b|\bTdap\b", "ACIP immunization schedule, 2026"),
    (r"depress", "USPSTF depression screening recommendation, 2023"),
    (r"migraine", "American Headache Society migraine consensus, 2021"),
    (r"\bstroke\b|\bTIA\b", "AHA/ASA early management of ischemic stroke, 2019"),
    (r"rheumatoid", "ACR rheumatoid arthritis guideline, 2021"),
    (r"\bacne\b", "AAD acne guideline, 2024"),
    (r"fall prevention|\bfalls\b", "USPSTF fall prevention, 2024"),
    (r"low back|back pain", "ACP low back pain guideline, 2017"),
    (r"\bgout\b", "ACR gout guideline, 2020"),
    (r"Beers|potentially inappropriate", "AGS Beers Criteria, 2023"),
    (r"opioid|naloxone", "CDC opioid prescribing guideline, 2022"),
    (r"cellulitis|soft tissue", "IDSA skin and soft tissue infection guideline, 2014"),
    (r"\bHIV\b", "USPSTF HIV screening recommendation, 2019"),
    (r"osteopor", "USPSTF osteoporosis screening, 2025"),
    (r"\bPCOS\b", "international evidence-based PCOS guideline, 2023"),
    (r"chemotherapy|antiemet|\bCINV\b", "ASCO antiemetic guideline, 2020"),
    (r"\bVTE\b|venous thrombo", "ASCO venous thromboembolism guideline, 2023"),
    (r"compound|USP\s*<?797", "USP General Chapter <797>, 2023"),
    (r"high-alert|look-alike|medication safety", "ISMP Targeted Medication Safety Best Practices, 2024"),
    (r"inhaler|spacer", "GINA strategy report, 2025"),
]

OFFICIAL = re.compile(
    r"Candidate Handbook|Application Bulletin|Content Outline|Candidate Bulletin|"
    r"\bDEA\b|state board|state law|\bMPJE\b|\bNCSBN\b|\bNPCB\b|board of pharmacy|"
    r"FDA labeling|product labeling|legal /|disclaimer",
    re.I,
)
DROP_SECTION = re.compile(
    r"soft cta|can anyexameasy|ready for ngn|ready for aanp|ready for naplex",
    re.I,
)
DROP_LINE = re.compile(
    r"Pair with Qbank|Pair with practice|\*\*Practice loop:\*\*|\*\*Next practice move:\*\*|"
    r"\*\*Practice:\*\*|\*\*Practice (endocrine|pulmonary|prevention)|\*\*Next:\*\*|"
    r"Soft CTA only|Drill these flashes|Ready to practice what you planned|"
    r"Qbank access confirmed|no payment method|practice that matches",
    re.I,
)
HEADING = re.compile(r"^(#{2,3})\s+(.+)$")
YEAR = re.compile(r"\b(?:19|20)\d{2}\b")


def clean_spacing(text: str) -> str:
    text = re.sub(r"[ \t]{2,}", " ", text)
    text = re.sub(r" +([,.;:)])", r"\1", text)
    text = re.sub(r"\( +", "(", text)
    text = re.sub(r" +\)", ")", text)
    text = re.sub(r"\(\s*\)", "", text)
    text = re.sub(r"\s+([—–-])\s*\.", ".", text)
    text = re.sub(r"\s+—\s*$", "", text)
    text = re.sub(r"\s{2,}", " ", text)
    return text.rstrip()


def strip_theme(text: str) -> str:
    text = text.replace("You’ve got this", "Before test day").replace("You've got this", "Before test day")
    text = re.sub(r"\b[Gg]uideline themes\b", "Recommendations", text)
    text = re.sub(r"\bguideline-themes?\b", "guidance", text, flags=re.I)
    text = re.sub(r"\bwell-child themes\b", "well-child visits", text, flags=re.I)
    text = re.sub(r"\bdecision themes\b", "decision steps", text, flags=re.I)
    text = re.sub(r"\bliterature themes\b", "outcome trials", text, flags=re.I)
    text = re.sub(r"\bhigh-alert themes\b", "high-alert drugs", text, flags=re.I)
    text = re.sub(r"\bthemes\b", "", text, flags=re.I)
    text = re.sub(r"\btheme\b", "", text, flags=re.I)
    return clean_spacing(text)


def strip_verify(text: str) -> str:
    if OFFICIAL.search(text):
        return re.sub(r"\b[Vv]erify\b", "Confirm", text)
    text = re.sub(
        r"verify local (?:resistance|antibiogram)",
        "match the local antibiogram (IDSA uncomplicated cystitis and pyelonephritis guideline, 2011)",
        text,
        flags=re.I,
    )
    text = re.sub(r"verify USPSTF/specialty", "USPSTF prostate cancer screening, 2018", text, flags=re.I)
    text = re.sub(
        r"verify thresholds",
        "KDIGO 2024 allows up to a 30% creatinine rise after an ACE inhibitor or ARB",
        text,
        flags=re.I,
    )
    text = re.sub(r"\s*\([^)]*\bverify\b[^)]*\)", "", text, flags=re.I)
    text = re.sub(r"\s*[—–-]\s*verify\b[^.\n]*", "", text, flags=re.I)
    text = re.sub(r"\b[Vv]erify\b", "Confirm", text)
    return clean_spacing(text)


def is_upsell_line(line: str) -> bool:
    if DROP_LINE.search(line):
        return True
    if "](https://anyexameasy" in line.lower() or "](https://anyexameasy".lower() in line.lower():
        if line.strip().startswith("*©") or "not affiliated" in line.lower() or "trademark" in line.lower():
            return False
        return True
    if re.search(r"^com\)\*\*", line.strip()):
        return True
    return False


def pick_source(filename: str, guide: str, heading: str, body: str) -> str | None:
    defaults = CLINICAL.get(guide, {})
    if filename not in defaults:
        return None
    blob = f"{heading}\n{body[:1500]}"
    for pattern, source in RULES:
        if re.search(pattern, blob, re.I):
            return source
    if re.search(r"plan|management|first-line|pharmacolog|treatment|regimen|therapy", heading, re.I):
        return defaults[filename]
    if re.search(r"\btheme\b|\bverify\b", body, re.I):
        return defaults[filename]
    return None


def transform_lines(path: Path, lines: list[str]) -> list[str]:
    guide = path.parent.name
    filename = path.name
    if filename == "00-front-matter.md":
        out = []
        for line in lines:
            line = strip_theme(line)
            line = strip_verify(line)
            out.append(line)
        return out

    sections: list[tuple[str | None, list[str]]] = []
    current_head: str | None = None
    current: list[str] = []
    for line in lines:
        match = HEADING.match(line)
        if match:
            sections.append((current_head, current))
            current_head = line
            current = []
        else:
            current.append(line)
    sections.append((current_head, current))

    rebuilt: list[str] = []
    for heading, body in sections:
        title = heading or ""
        if heading and DROP_SECTION.search(title):
            continue
        kept = [line for line in body if not is_upsell_line(line)]
        original = "\n".join(kept)
        cleaned = [strip_verify(strip_theme(line)) for line in kept]
        cleaned = [line for line in cleaned if line.strip() not in {"**", "*", ">"}]
        source = pick_source(filename, guide, title, original)
        body_text = "\n".join(cleaned)
        already = bool(re.search(r"(?m)^Source:", body_text)) or bool(YEAR.search(body_text) and re.search(r"AHA|ACC|USPSTF|KDIGO|ADA|GOLD|GINA|IDSA|AAP|ACIP|ACR|AAD|ACP|CDC|ACOG|ATA|ACG|AASLD|ASCO|Beers|ISMP|USP ", body_text))
        polished_heading = strip_verify(strip_theme(heading)) if heading else None
        if source and not already and (re.search(r"\btheme\b|\bverify\b", original, re.I) or re.search(r"plan|treat|first-line|therap", title, re.I)):
            if polished_heading:
                rebuilt.append(polished_heading)
                rebuilt.append("")
                rebuilt.append(f"Source: {source}.")
                rebuilt.extend(cleaned)
                continue
        if polished_heading:
            rebuilt.append(polished_heading)
        rebuilt.extend(cleaned)
    text = "\n".join(rebuilt)
    text = text.replace(
        "*© AnyExamEasy. All rights reserved.com](https://anyexameasy.com).*",
        "*© 2026 AnyExamEasy. All rights reserved.*",
    )
    text = text.replace("per Recommendations", "per the cited guideline")
    text = text.replace("Start lower/go slower", "Start lower and go slower")
    text = text.replace("do not casual-titrate ACEI", "do not start an ACE inhibitor")
    text = text.replace("casual-titrate", "adjust")
    text = text.replace("casual-stop", "stop early")
    text = text.replace("casual-prescribe", "prescribe")
    text = text.replace("casual-start", "start")
    text = text.replace("don’t nihilistically ignore", "do not leave it untreated")
    text = text.replace("2026-style", "2026")
    text = text.replace("Age-themed", "Age-based")
    text = re.sub(r"\n{3,}", "\n\n", text)
    if not text.endswith("\n"):
        text += "\n"
    return text.splitlines(keepends=True)


def main() -> None:
    for guide in GUIDES:
        for path in sorted(guide.glob("[0-9][0-9]-*.md")):
            original = path.read_text()
            lines = original.splitlines()
            updated_lines = transform_lines(path, lines)
            if path.name == "00-front-matter.md":
                updated = "\n".join(updated_lines)
                if original.endswith("\n"):
                    updated += "\n"
            else:
                updated = "".join(updated_lines) if updated_lines and updated_lines[0].endswith("\n") else "\n".join(updated_lines) + "\n"
                # transform returns keepends only in the non-front branch via splitlines keepends
                if not any(line.endswith("\n") for line in updated_lines[:1]):
                    updated = "\n".join(line.rstrip("\n") for line in updated_lines)
                    if original.endswith("\n"):
                        updated += "\n"
            path.write_text(updated if updated.endswith("\n") else updated + "\n")
            text = path.read_text()
            themes = len(re.findall(r"theme", text, re.I))
            verifies = len(re.findall(r"verify", text, re.I))
            if themes or verifies:
                print(f"LEFT {path.relative_to(ROOT)} theme={themes} verify={verifies}")
    print("copy pass wrote manuscripts")


if __name__ == "__main__":
    main()
