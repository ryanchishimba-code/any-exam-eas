#!/usr/bin/env python3
"""Replace soft or broken study-guide rasters with sharp, mobile SVG figures.

ViewBox width is 420 so 16–22 px type stays legible on a phone.
Book covers stay as photographs.
"""

from __future__ import annotations

import html
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def S(title: str, rows: list[str], source: str) -> tuple[str, list[str], str]:
    return (title, rows, source)

# filename -> (title, rows, source)
SPECS: dict[str, tuple[str, list[str], str]] = {
    "aub-palms-coein": (
        "Abnormal uterine bleeding: PALM-COEIN",
        [
            "PALM is structural: Polyp, Adenomyosis, Leiomyoma, Malignancy or hyperplasia.",
            "COEIN is not structural: Coagulopathy, Ovulatory dysfunction, Endometrial, Iatrogenic, Not yet classified.",
            "Pregnancy test first in reproductive years.",
            "Postmenopausal bleeding is evaluated for cancer.",
        ],
        "FIGO PALM-COEIN",
    ),
    "naplex-domain-weights": (
        "NAPLEX content domains",
        [
            "Domain 1. Foundational knowledge. 25% (about 50 scored items).",
            "Domain 2. Medication use process. 25% (about 50).",
            "Domain 3. Person-centered assessment and treatment planning. 40% (about 80).",
            "Domain 4. Professional practice. 5% (about 10).",
            "Domain 5. Pharmacy management and leadership. 5% (about 10).",
        ],
        "NABP NAPLEX Content Outline, effective May 1, 2025",
    ),
    "beta-lactam-allergy-pathway": (
        "Reported penicillin allergy",
        [
            "Mild rash or a remote childhood reaction: often eligible for a graded challenge or a cephalosporin.",
            "Hives, angioedema, bronchospasm, or anaphylaxis: avoid the same side chain. Use a non-beta-lactam or desensitize.",
            "Side-chain similarity matters more than the class label.",
            "Most labels are not IgE allergy. A structured history comes before automatic avoidance.",
        ],
        "AAAAI and IDSA penicillin-allergy pathways",
    ),
    "ethics-public-health-roles": (
        "Ethics and public health",
        [
            "Autonomy, beneficence, nonmaleficence, and justice.",
            "HIPAA: share what treatment requires. Do not discuss a named patient in public.",
            "Report the diseases the state lists. Counseling is not a report.",
            "A medication error that harms is disclosed and reported.",
        ],
        "NAPLEX Domain 4",
    ),
    "otc-triage-flow": (
        "OTC self-care triage",
        [
            "Refer now: chest pain, dyspnea, neurologic deficit, GI bleeding, pregnancy with pain, infant under 3 months with fever.",
            "Self-care is reasonable for a mild, short, recognizable illness in an otherwise well adult.",
            "Avoid oral decongestants in young children.",
            "Acetaminophen max is 3 to 4 g/day from all sources. NSAIDs are avoided in late pregnancy, CKD, and high GI risk.",
        ],
        "Self-care and FDA labeling",
    ),
    "opioid-risk-mitigation": (
        "Opioid risk mitigation",
        [
            "Check the prescription-drug monitoring program before a new opioid.",
            "Offer naloxone with every opioid prescription.",
            "Avoid benzodiazepines together with opioids when another plan exists.",
            "Morphine-milligram equivalents guide risk. They are not a reason to stop a stable patient without a plan.",
        ],
        "CDC opioid guideline and FDA labeling",
    ),
    "peds-dosing-safety": (
        "Pediatric dosing safety",
        [
            "Weight in kilograms, not pounds.",
            "Acetaminophen 10–15 mg/kg per dose. Ibuprofen 5–10 mg/kg per dose.",
            "Amoxicillin for acute otitis media: 80–90 mg/kg/day when an antibiotic is indicated (AAP).",
            "Do not use codeine or tramadol in children.",
        ],
        "AAP and FDA labeling",
    ),
    "insulin-peak-timeline": (
        "Insulin timing",
        [
            "Rapid (lispro, aspart): onset about 15 minutes, peak 1–2 hours.",
            "Regular: onset 30–60 minutes, peak 2–4 hours.",
            "NPH: onset 1–2 hours, peak 4–12 hours.",
            "Glargine and degludec: no pronounced peak. Do not mix glargine with other insulin.",
        ],
        "FDA prescribing information",
    ),
    "priority-abcs": (
        "Priority: airway, breathing, circulation",
        [
            "Airway: noisy or gurgling breathing, obstruction, a threatened airway.",
            "Breathing: hypoxia, respiratory rate, work of breathing.",
            "Circulation: bleeding, blood pressure, perfusion.",
            "Then safety, then teaching. A stable expected finding waits.",
        ],
        "NCSBN 2026 RN test plan, Management of Care",
    ),
    "priority-decision-tree": (
        "Who does the nurse see first?",
        [
            "Unstable before stable.",
            "Acute before chronic.",
            "Actual problems before potential problems.",
            "The expected finding of a known diagnosis is not first if another client has a new change.",
        ],
        "NCSBN 2026 RN test plan",
    ),
    "maslow-pyramid-nclex": (
        "Maslow, after ABCs",
        [
            "Physiologic needs.",
            "Safety and security.",
            "Love and belonging.",
            "Esteem, then self-actualization.",
            "ABCs outrank the pyramid when breathing or circulation is threatened.",
        ],
        "NCSBN 2026 RN test plan",
    ),
    "delegation-five-rights": (
        "Five rights of delegation",
        [
            "Right task. Right circumstance. Right person. Right direction. Right supervision.",
            "Assessment, teaching, and evaluation of an unstable client stay with the nurse.",
            "A policy cannot expand a license past the nurse practice act.",
        ],
        "NCSBN and the state nurse practice act",
    ),
    "isolation-ppe-matrix": (
        "Isolation and PPE",
        [
            "Contact: gown and gloves. C. difficile needs soap and water, not alcohol gel alone.",
            "Droplet: surgical mask. Influenza, meningococcus, pertussis.",
            "Airborne: N95 and a negative-pressure room. Tuberculosis, measles, varicella.",
            "Standard precautions for every client.",
        ],
        "CDC isolation precautions",
    ),
    "labs-danger-zones": (
        "Laboratory values that change the plan",
        [
            "Potassium under 3.0 or over 6.0, or any potassium with ECG changes.",
            "Sodium under 120, or any sodium with a seizure.",
            "Glucose under 70 is hypoglycemia. Under 54 is clinically significant.",
            "INR above the therapeutic range with bleeding. Platelets under 10,000, or under 50,000 with bleeding.",
        ],
        "Study aid. Confirm the laboratory's reference range.",
    ),
    "stroke-fast-timeline": (
        "Stroke: face, arm, speech, time",
        [
            "Note the last time the client was known to be well.",
            "Check glucose. Noncontrast CT before a fibrinolytic.",
            "A disabling deficit within 4.5 hours may receive tenecteplase or alteplase (AHA/ASA 2026).",
            "Blood pressure under 185/110 before the drug.",
        ],
        "2026 AHA/ASA acute ischemic stroke guideline",
    ),
    "glucose-emergencies": (
        "Glucose emergencies",
        [
            "Hypoglycemia: awake client gets 15 g carbohydrate and a recheck in 15 minutes.",
            "DKA: anion-gap acidosis and ketones. Potassium before insulin if K is under 3.3.",
            "HHS: very high glucose, high osmolality, little ketoacidosis. Fluid first.",
        ],
        "ADA Standards of Care 2026",
    ),
    "addison-vs-cushing": (
        "Addison and Cushing",
        [
            "Addison: low cortisol, hyperpigmentation, hypotension, high potassium.",
            "Cushing: high cortisol, central weight, striae, high glucose, low potassium.",
            "Stress-dose steroids for adrenal crisis. Do not wait for the stimulation test.",
        ],
        "Endocrine Society adrenal guidance",
    ),
    "heart-failure-left-right": (
        "Left-sided and right-sided heart failure",
        [
            "Left: pulmonary edema, dyspnea, orthopnea, crackles.",
            "Right: edema, jugular distention, hepatic congestion.",
            "HFrEF medicines: ARNI, evidence-based beta-blocker, MRA, SGLT2 inhibitor (2022 AHA/ACC/HFSA).",
        ],
        "2022 AHA/ACC/HFSA heart failure guideline",
    ),
    "shock-types-overview": (
        "Shock",
        [
            "Hypovolemic: low volume. Fluid or blood.",
            "Cardiogenic: pump failure. Do not flood a wet lung.",
            "Distributive: sepsis or anaphylaxis. Antibiotics and fluid for sepsis. Epinephrine for anaphylaxis.",
            "Obstructive: tamponade, tension pneumothorax, massive embolism.",
        ],
        "Surviving Sepsis and emergency teaching",
    ),
    "htn-cascade": (
        "When to start blood-pressure medicine",
        [
            "Confirm the reading. Goal under 130/80 mm Hg (2025 AHA/ACC).",
            "Start a drug at 130/80 or higher if there is CVD, diabetes, CKD, or PREVENT risk of 7.5% or higher.",
            "Otherwise, lifestyle for 3 to 6 months.",
            "First-line: thiazide-type diuretic, dihydropyridine CCB, ACE inhibitor, or ARB.",
        ],
        "2025 AHA/ACC high blood pressure guideline",
    ),
    "lipid-risk-ladder": (
        "Lipids and PREVENT risk",
        [
            "Use PREVENT, not the pooled cohort equations (2026 ACC/AHA).",
            "Intermediate risk (5 to under 10%): at least a moderate-intensity statin.",
            "High risk (10% or more): high-intensity statin.",
            "Very-high-risk ASCVD: LDL-C under 55 mg/dL. Add ezetimibe, then a PCSK9 inhibitor.",
        ],
        "2026 ACC/AHA dyslipidemia guideline",
    ),
    "uspstf-lifespan-strip": (
        "Screening ages",
        [
            "Mammogram every 2 years, ages 40–74 (USPSTF 2024).",
            "Colorectal cancer screening, ages 45–75 (USPSTF 2021).",
            "Lung cancer: annual low-dose CT, ages 50–80, 20 pack-years (USPSTF 2021).",
            "Cervical: cytology every 3 years at 21–29. At 30–65, cytology every 3 years, HPV every 5, or both every 5.",
            "Osteoporosis: women 65 and older (USPSTF 2025).",
        ],
        "USPSTF posted recommendations",
    ),
    "breast-cervical-screening": (
        "Breast and cervical screening",
        [
            "Mammogram every 2 years from 40 through 74 (USPSTF 2024).",
            "A palpable mass is diagnostic imaging, not a screening mammogram.",
            "Cytology every 3 years from 21 through 29.",
            "Ages 30–65: cytology every 3 years, primary HPV every 5 years, or cotesting every 5 years.",
        ],
        "USPSTF 2024 breast and USPSTF 2018 cervical (posted)",
    ),
    "ckd-staging-map": (
        "CKD stages",
        [
            "G1 ≥90, G2 60–89, G3a 45–59, G3b 30–44, G4 15–29, G5 under 15.",
            "Albuminuria: A1 under 30, A2 30–299, A3 300 mg/g or more.",
            "SGLT2 inhibitor for diabetes or albuminuria (KDIGO 2024).",
            "ACE inhibitor or ARB when albumin is elevated. Do not combine them.",
        ],
        "KDIGO 2024 CKD guideline",
    ),
    "diabetes-stepwise-themes": (
        "Type 2 diabetes drug choice",
        [
            "ASCVD: GLP-1 receptor agonist and/or SGLT2 inhibitor (ADA 2026).",
            "Heart failure: SGLT2 inhibitor.",
            "CKD: SGLT2 inhibitor, or a GLP-1 receptor agonist if an SGLT2 inhibitor is not suitable.",
            "Otherwise metformin is a common foundation. Individualize the A1C goal.",
        ],
        "ADA Standards of Care 2026",
    ),
    "asthma-copd-contrast": (
        "Asthma and COPD",
        [
            "Asthma, GINA 2026: ICS-formoterol. Not a short-acting beta-agonist alone.",
            "COPD diagnosis: post-bronchodilator FEV1/FVC under 0.7 (GOLD 2026).",
            "Group E (frequent exacerbations): LABA plus LAMA. Consider ICS if eosinophils are 300 or higher.",
            "Smoking cessation changes the course of COPD.",
        ],
        "GINA 2026 and GOLD 2026",
    ),
    "hf-gdmt-pillars": (
        "HFrEF: four drug classes",
        [
            "ARNI (or ACE inhibitor or ARB if an ARNI is not possible).",
            "Evidence-based beta-blocker: carvedilol, metoprolol succinate, or bisoprolol.",
            "Mineralocorticoid receptor antagonist if eGFR is over 30 and potassium is under 5.",
            "SGLT2 inhibitor, with or without diabetes. Never an ARNI within 36 hours of an ACE inhibitor.",
        ],
        "2022 AHA/ACC/HFSA heart failure guideline",
    ),
    "af-stroke-prevention": (
        "Atrial fibrillation and stroke",
        [
            "Anticoagulate at CHA2DS2-VASc of 2 or more in men, or 3 or more in women (2023 ACC/AHA).",
            "A DOAC is preferred.",
            "Warfarin for a mechanical valve or moderate to severe mitral stenosis.",
            "Unstable tachycardia: synchronized cardioversion.",
        ],
        "2023 ACC/AHA/ACCP/HRS atrial fibrillation guideline",
    ),
    "prenatal-timeline": (
        "Routine prenatal timing",
        [
            "First visit: type and screen, CBC, rubella, hepatitis B, HIV, syphilis, urine culture.",
            "24–28 weeks: gestational diabetes screen. Anti-D at about 28 weeks if Rh-negative.",
            "27–36 weeks: Tdap, every pregnancy (ACIP).",
            "36–37 weeks: group B streptococcus culture (ACOG).",
        ],
        "ACOG and ACIP",
    ),
    "beers-prescribing-card": (
        "Beers criteria, 2023",
        [
            "Avoid benzodiazepines and Z-drugs in older adults.",
            "Avoid strong anticholinergics: diphenhydramine, hydroxyzine, amitriptyline, paroxetine, oxybutynin.",
            "Avoid sliding-scale insulin alone.",
            "Antipsychotics for dementia only when the person is a danger and other steps have failed.",
        ],
        "AGS Beers Criteria 2023",
    ),
    "beers-high-risk-classes": (
        "High-risk medicines in older adults",
        [
            "Benzodiazepines, Z-drugs, and strong anticholinergics (Beers 2023).",
            "NSAIDs in CKD, heart failure, or a history of ulcer.",
            "Long-acting sulfonylureas (glyburide) and the hypoglycemia they cause.",
            "Burden adds up. Stop or switch more than one medicine when you can.",
        ],
        "AGS Beers Criteria 2023",
    ),
}


def xml(text: str) -> str:
    return html.escape(text, quote=True)


def wrap(text: str, width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    cur = ""
    for word in words:
        trial = f"{cur} {word}".strip()
        if len(trial) <= width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines or [""]


def render(title: str, rows: list[str], source: str) -> str:
    width = 420
    y = 36
    chunks = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{{H}}" viewBox="0 0 {width} {{H}}" role="img" aria-label="{xml(title)}">',
        f"<title>{xml(title)}</title>",
        '<rect width="100%" height="100%" fill="#F6F3EE"/>',
        '<rect width="8" height="100%" fill="#0F766E"/>',
    ]
    for line in wrap(title, 32)[:3]:
        chunks.append(
            f'<text x="28" y="{y}" font-family="Georgia, \'Iowan Old Style\', serif" font-size="22" font-weight="700" fill="#102027">{xml(line)}</text>'
        )
        y += 28
    y += 6
    for row in rows:
        lines = wrap(row, 42)[:3]
        band_h = 16 + len(lines) * 22
        chunks.append(
            f'<rect x="24" y="{y}" width="372" height="{band_h}" rx="8" fill="#FFFFFF" stroke="#E4DDD2"/>'
        )
        text_y = y + 22
        for line in lines:
            chunks.append(
                f'<text x="36" y="{text_y}" font-family="\'Source Sans 3\', \'Segoe UI\', sans-serif" font-size="16" fill="#1C2830">{xml(line)}</text>'
            )
            text_y += 22
        y += band_h + 8
    y += 8
    for line in wrap(source, 52)[:2]:
        chunks.append(
            f'<text x="28" y="{y}" font-family="\'Source Sans 3\', \'Segoe UI\', sans-serif" font-size="13" fill="#5C6B73">{xml(line)}</text>'
        )
        y += 18
    height = y + 16
    return ("\n".join(chunks) + "\n</svg>\n").replace("{H}", str(height))


def alt_rows(guide: Path, stem: str) -> tuple[str, list[str]] | None:
    for md in guide.glob("*.md"):
        for match in re.finditer(r"!\[([^\]]+)\]\((?:\.\/)?visuals/" + re.escape(stem) + r"\.jpg\)", md.read_text()):
            alt = re.sub(r"\s+", " ", match.group(1)).strip()
            if re.search(r"theme|verify|vibe|placeholder", alt, re.I):
                return None
            parts = [p.strip() for p in re.split(r"[.;]", alt) if len(p.strip()) > 12]
            if len(alt) < 40 or not parts:
                return None
            title = parts[0][:80]
            return title, parts[:5]
    return None


def main() -> None:
    rest = ROOT / "scripts" / "figure-specs-rest.py"
    if rest.exists():
        namespace: dict = {}
        exec(rest.read_text(), namespace)
        SPECS.update(namespace["MORE"])
    guides = [
        "nclex-study-guide",
        "naplex-study-guide",
        "aanp-fnp-study-guide",
    ]
    written = 0
    skipped = []
    for guide in guides:
        content = ROOT / "content" / guide
        public = ROOT / "public" / guide / "visuals"
        public.mkdir(parents=True, exist_ok=True)
        for jpg in sorted((content / "visuals").glob("*.jpg")):
            if "cover" in jpg.stem:
                continue
            spec = SPECS.get(jpg.stem)
            if spec:
                title, rows, source = spec
            else:
                found = alt_rows(content, jpg.stem)
                if not found:
                    skipped.append(f"{guide}/{jpg.name}")
                    continue
                title, rows = found
                source = "Study figure"
            svg = render(title, rows, source)
            dest_name = jpg.stem + ".svg"
            for folder in (content / "visuals", public):
                (folder / dest_name).write_text(svg)
                old = folder / jpg.name
                if old.exists():
                    old.unlink()
            for md in content.glob("*.md"):
                text = md.read_text()
                updated = text.replace(f"visuals/{jpg.name}", f"visuals/{dest_name}")
                if updated != text:
                    md.write_text(updated)
            written += 1
    print(f"Redrawn {written}")
    print("Still raster (no safe spec):")
    for name in skipped:
        print(" ", name)


if __name__ == "__main__":
    main()
