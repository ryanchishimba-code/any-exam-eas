#!/usr/bin/env python3
"""Remove in-chapter upsells and hedge wording from the paid study guides.

Front matter for NCLEX, NAPLEX, and FNP keeps its single opening offer.
The reader hides that line for a subscriber. Chapter bodies do not repeat it.
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

EXACT = [
    (
        "### Statin intensity vibe (confirm current labeling/guidelines)",
        "### Statin intensity (2026 ACC/AHA dyslipidemia guideline)",
    ),
    (
        "High-intensity themes often include atorvastatin 40–80 mg and rosuvastatin 20–40 mg — verify product/indication. Moderate intensity covers many primary-prevention starts.",
        "High-intensity therapy is atorvastatin 40–80 mg or rosuvastatin 20–40 mg. For very-high-risk ASCVD the 2026 ACC/AHA goal is LDL-C under 55 mg/dL. Add ezetimibe, then a PCSK9 inhibitor, if the goal is not met.",
    ),
    (
        "### Stepwise vibe (confirm current GINA)",
        "### Stepwise treatment (GINA 2026)",
    ),
    (
        "Reliever strategies evolving: many adults use ICS-containing reliever approaches per modern GINA themes (verify current). Classic teaching still contrasts SABA-only risks.",
        "GINA 2026 Track 1 uses as-needed low-dose ICS-formoterol for adults. A short-acting beta-agonist alone is not the preferred reliever.",
    ),
    (
        "Primary prevention uses risk estimators + risk enhancers (verify current calculator/guideline year).",
        "Primary prevention uses the PREVENT 10-year equation (2025 AHA/ACC high blood pressure guideline and 2026 ACC/AHA dyslipidemia guideline).",
    ),
    (
        "- [ ] TSH before nuclear toys in nodules  ",
        "- [ ] TSH before scintigraphy of a thyroid nodule. A low TSH is scanned. A normal or high TSH goes to ultrasound.  ",
    ),
    (
        "BMP (electrolytes/Cr), lipids, A1c or glucose themes, urinalysis ± urine albumin-creatinine, ECG when useful. Add TSH, sleep study referral, renal duplex, aldosterone/renin themes, plasma metanephrines **when secondary cues present** — not shotgun every mild HTN.",
        "BMP, lipids, A1C or fasting glucose, urinalysis with urine albumin-creatinine, and an ECG when the history suggests cardiac disease. Add TSH, a sleep study, renal duplex, an aldosterone-renin ratio, or plasma metanephrines only when a secondary cause is suggested. Do not order that panel for every mild elevation (2025 AHA/ACC).",
    ),
    (
        "- “CTPE on every palpitations patient” without pretest — shotgun.  ",
        "- CT pulmonary angiography for every patient with palpitations, without a pretest probability.  ",
    ),
    (
        "- Pattern LFTs before shotgun serologies.  ",
        "- Characterize the liver-test pattern before ordering a broad serology panel.  ",
    ),
    (
        "- Labs (CBC, ESR/CRP, cultures) when infection/cancer inflammatory cues present — not shotgun every backache.",
        "- Order a CBC, ESR or CRP, and cultures when infection or cancer is a real concern. Do not order that panel for every backache (ACP 2017 low back pain guideline).",
    ),
    (
        "| Shotgun imaging | Bedside tests + pretest probability |",
        "| Imaging without a reason | Bedside findings plus pretest probability |",
    ),
    (
        "- Technology downtime downtime procedures.",
        "- Technology downtime procedures.",
    ),
    (
        "Mammography… verify USPSTF",
        "Mammography: USPSTF 2024, every 2 years from ages 40 through 74",
    ),
]


def strip_upsell_line(line: str) -> str:
    if "27.99" not in line and "free trial" not in line.lower():
        return line
    line = re.sub(r"\s*Start a \*\*5-day free trial\*\*.*$", "", line)
    line = re.sub(r"\s*Start a \*\*5-day free trial\*\*[^.]*\.", "", line)
    line = re.sub(r"[^.]*\$27\.99/mo[^.]*\.?", "", line)
    line = re.sub(r"[^.]*free trial[^.]*\.?", "", line, flags=re.I)
    line = re.sub(r"\*\*Soft CTA:\*\*\s*", "", line)
    return line.rstrip()


def drop_clinical_hedges(text: str) -> str:
    lines = []
    for line in text.split("\n"):
        if any(token in line for token in ("Candidate Handbook", "Application Bulletin", "Candidate Application", "DEA", "state board")):
            lines.append(line)
            continue
        line = re.sub(r"\s*\((?:verify|confirm) current[^)]*\)", "", line, flags=re.I)
        line = re.sub(r"\s*[—–-]\s*(?:verify|confirm) current[^.\n]*", "", line, flags=re.I)
        line = re.sub(r"\b(?:Verify|Confirm) current\b", "Follow", line)
        line = re.sub(r"\b(?:verify|confirm) current\b", "follow", line)
        line = line.replace("teaching themes", "key points")
        line = line.replace("Teaching themes", "Key points")
        lines.append(line)
    return "\n".join(lines)


def polish(text: str) -> str:
    for old, new in EXACT:
        text = text.replace(old, new)
    text = text.replace("teaching themes to verify", "the named thresholds in this chapter")
    text = text.replace("Teaching themes only where drugs appear.", "Drug choices below name the guideline and year.")
    text = text.replace("Teaching themes only.", "Thresholds below name the guideline and year.")
    text = text.replace(
        "verify current guidelines/doses before clinical use",
        "follow the guideline and year named in this chapter",
    )
    text = text.replace("Stem vibe:", "Practice stem:")
    text = text.replace("Keyword vibe", "Keyword")
    text = text.replace("Action vibe", "Action")
    text = text.replace("First move vibe", "First move")
    text = text.replace("Exam vibe", "Exam focus")
    text = text.replace("verify current GINA/GOLD", "GINA 2026 and GOLD 2026")
    text = text.replace("verify current GINA", "GINA 2026")
    text = text.replace("verify current GOLD", "GOLD 2026")
    text = text.replace("verify current ADA", "ADA Standards of Care 2026")
    text = text.replace("confirm current ADA", "ADA Standards of Care 2026")
    text = text.replace("confirm current GINA", "GINA 2026")
    text = text.replace("nuclear toys", "scintigraphy")
    text = re.sub(r"\b[Vv]ibes\b", "patterns", text)
    text = re.sub(r"\bvibe\b", "pattern", text)
    return drop_clinical_hedges(text)


def main() -> None:
    kept_front = {
        ROOT / "content/nclex-study-guide/00-front-matter.md",
        ROOT / "content/naplex-study-guide/00-front-matter.md",
        ROOT / "content/aanp-fnp-study-guide/00-front-matter.md",
    }
    roots = [
        ROOT / "content/aanp-fnp-study-guide",
        ROOT / "content/naplex-study-guide",
        ROOT / "content/nclex-study-guide",
        ROOT / "content/pance-study-guide",
    ]
    for root in roots:
        for path in sorted(root.glob("*.md")):
            if path.name.startswith("_") or path.name.lower() in {"readme.md", "qa-report.md", "visuals-needed.md"}:
                continue
            original = path.read_text()
            text = polish(original)
            if path not in kept_front:
                lines = [strip_upsell_line(line) for line in text.split("\n")]
                text = "\n".join(lines)
                text = re.sub(r"\n{3,}", "\n\n", text)
            if text != original:
                path.write_text(text)
                print("polished", path.relative_to(ROOT))


if __name__ == "__main__":
    main()
