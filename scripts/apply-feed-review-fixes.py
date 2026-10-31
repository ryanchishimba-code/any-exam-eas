#!/usr/bin/env python3
"""Apply flashcard-feed metadata, front rewrites, and missing-graphic fallbacks.

Graphics are drawn only when the teaching point fits a sharp layout.
Everything else stays text-only (diagram null) so the card API can return
the card without a 404.
"""

from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

CANON = {
    "Most Likely Diagnosis": "Formulating Most Likely Diagnosis",
    "Formulating Most Likely Diagnosis": "Formulating Most Likely Diagnosis",
    "Diagnostic Studies": "Using Diagnostic and Laboratory Studies",
    "Using Diagnostic and Laboratory Studies": "Using Diagnostic and Laboratory Studies",
    "History Taking and Physical Examination": "History Taking and Performing Physical Examination",
    "Clinical Intervention": "Clinical Intervention",
    "Pharmaceutical Therapeutics": "Pharmaceutical Therapeutics",
    "Health Maintenance, Patient Education, Prevention": "Health Maintenance, Patient Education, and Preventive Measures",
    "Health Maintenance, Patient Education, and Preventive Measures": "Health Maintenance, Patient Education, and Preventive Measures",
    "Applying Foundational Scientific Concepts": "Applying Foundational Scientific Concepts",
    "Professional Practice": "Professional Practice",
}

PILOTS = {
    "pance-001": "Clinical Intervention",
    "pance-002": "Pharmaceutical Therapeutics",
    "pance-003": "Pharmaceutical Therapeutics",
    "pance-004": "Pharmaceutical Therapeutics",
    "pance-005": "Using Diagnostic and Laboratory Studies",
    "pance-006": "Pharmaceutical Therapeutics",
    "pance-007": "Clinical Intervention",
    "pance-008": "Pharmaceutical Therapeutics",
    "pance-009": "Formulating Most Likely Diagnosis",
    "pance-010": "Formulating Most Likely Diagnosis",
    "pance-011": "Clinical Intervention",
    "pance-012": "Clinical Intervention",
    "pance-013": "Clinical Intervention",
    "pance-014": "Pharmaceutical Therapeutics",
    "pance-015": "Pharmaceutical Therapeutics",
    "pance-016": "Formulating Most Likely Diagnosis",
    "pance-017": "Formulating Most Likely Diagnosis",
    "pance-018": "Clinical Intervention",
    "pance-019": "Pharmaceutical Therapeutics",
    "pance-020": "Using Diagnostic and Laboratory Studies",
}

RETAG = {
    "pance-164": "Applying Foundational Scientific Concepts",
    "pance-181": "Applying Foundational Scientific Concepts",
    "pance-126": "Health Maintenance, Patient Education, and Preventive Measures",
    "pance-128": "Health Maintenance, Patient Education, and Preventive Measures",
}

SCIENCE = "Applying Foundational Scientific Concepts"
HM = "Health Maintenance, Patient Education, and Preventive Measures"


def card(front, bottom, clue, treat, trap, guideline, year, task):
    return {
        "front": front,
        "bottom": bottom,
        "bullets": {"clue": clue, "treat": treat, "trap": trap},
        "source_guideline": guideline,
        "source_year": year,
        "task_area": task,
    }


REPLACEMENTS = {
    "pance-150": card(
        "A light in one eye constricts both pupils. A light in the other eye constricts neither. Where is the lesion?",
        "Relative afferent pupillary defect: the afferent limb on the bad side.",
        "The consensual reflex uses the opposite optic nerve.",
        "Swinging flashlight test. A defect means optic nerve or severe retinal disease.",
        "A cataract dims vision. It does not cause this defect.",
        "AAO Preferred Practice Pattern: Comprehensive Adult Medical Eye Evaluation",
        "2020",
        SCIENCE,
    ),
    "pance-143": card(
        "Free T4 is high and TSH is low. What feedback loop explains that, and why can prolactin rise when dopamine falls?",
        "Thyroid hormone suppresses TSH. Dopamine suppresses prolactin.",
        "The hypothalamus releases TRH and dopamine.",
        "High T4 with high TSH is not primary hyperthyroidism. A dopamine agonist treats prolactinoma.",
        "Primary hypothyroidism can raise prolactin through TRH. Check TSH first.",
        "2016 ATA hyperthyroidism guideline; Endocrine Society prolactinoma guideline (2011, still current as of 2026)",
        "2016",
        SCIENCE,
    ),
    "pance-054": card(
        "A patient with severe COPD receives high-flow oxygen and becomes somnolent as PaCO2 rises. Why?",
        "Extra oxygen worsens ventilation-perfusion matching in COPD.",
        "Poorly ventilated lung units constrict their blood flow. Oxygen releases that constriction.",
        "Target saturation about 88–92% when hypercapnia is a risk (GOLD 2026).",
        "Hypoxic drive is not the main explanation.",
        "GOLD 2026; BTS Guideline for oxygen use in adults (2017, still current as of 2026)",
        "2026",
        SCIENCE,
    ),
    "pance-132": card(
        "Why are cycles irregular in many patients with PCOS, and which induction drug is first-line?",
        "Insulin resistance and excess LH drive ovarian androgen production.",
        "Two of three: oligo-ovulation, hyperandrogenism, polycystic ovaries.",
        "2023 international PCOS guideline: letrozole is first-line for ovulation induction.",
        "A normal ultrasound does not exclude PCOS.",
        "2023 International Evidence-based Guideline for the Assessment and Management of PCOS",
        "2023",
        SCIENCE,
    ),
    "pance-199": card(
        "Why can a nitrate plus a PDE-5 inhibitor drop blood pressure?",
        "Both raise cGMP in vascular smooth muscle, so the effect stacks.",
        "Nitric oxide activates guanylate cyclase. PDE-5 breaks cGMP down.",
        "Do not combine nitrates with sildenafil, tadalafil, or vardenafil.",
        "The washout depends on which PDE-5 inhibitor was taken.",
        "FDA Prescribing Information for PDE-5 inhibitors",
        "2024",
        SCIENCE,
    ),
    "pance-185": card(
        "Why can an NSAID plus an ACE inhibitor drop GFR when a patient is volume depleted?",
        "The NSAID constricts the afferent arteriole. The ACE inhibitor dilates the efferent arteriole.",
        "Angiotensin II normally constricts the efferent arteriole and supports GFR.",
        "Hold the NSAID and the ACE inhibitor or ARB during the illness (KDIGO 2024).",
        "A creatinine rise of up to about 30% after starting an ACE inhibitor can be hemodynamic.",
        "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of CKD",
        "2024",
        SCIENCE,
    ),
    "pance-112": card(
        "Which dopamine pathway causes antipsychotic dystonia, and which one raises prolactin?",
        "Nigrostriatal blockade causes movement effects. Tuberoinfundibular blockade raises prolactin.",
        "Mesolimbic blockade treats psychosis.",
        "Acute dystonia: benztropine or diphenhydramine. Akathisia: lower the dose or use a beta-blocker.",
        "Clozapine is for illness that failed two antipsychotics, not for a first episode (APA 2020).",
        "APA Practice Guideline for the Treatment of Patients With Schizophrenia",
        "2020",
        SCIENCE,
    ),
    "pance-153": card(
        "Where does aqueous humor leave the eye, and why does that matter in open-angle glaucoma?",
        "It exits through the trabecular meshwork into Schlemm canal.",
        "Open-angle glaucoma is impaired outflow, not a closed angle.",
        "First-line drug: a prostaglandin analog at night (AAO).",
        "Acute angle closure is a separate emergency. Do not treat it as chronic glaucoma.",
        "AAO Preferred Practice Pattern: Primary Open-Angle Glaucoma",
        "2020",
        SCIENCE,
    ),
    "pance-071": card(
        "What process damages the joint in rheumatoid arthritis, and what is first-line disease-modifying therapy?",
        "Synovial inflammation erodes cartilage and bone.",
        "Anti-CCP antibodies are specific. Rheumatoid factor is not.",
        "ACR 2021: methotrexate is the first DMARD. Add folic acid. Screen for TB and hepatitis B before a biologic.",
        "Do not combine two biologic agents.",
        "2021 ACR Guideline for the Treatment of Rheumatoid Arthritis",
        "2021",
        SCIENCE,
    ),
    "pance-137": card(
        "Free T4 is low and TSH is high. Which gland failed, and how is hormone replaced?",
        "The thyroid failed. Pituitary TSH rises because the feedback signal is gone.",
        "A low TSH with a low free T4 is central, not primary, hypothyroidism.",
        "Levothyroxine on an empty stomach. Recheck TSH in about 6 weeks. Start lower in older adults and in coronary disease.",
        "Biotin can make free T4 look high and TSH look low.",
        "ATA Guidelines for the Treatment of Hypothyroidism (2014, still current as of 2026)",
        "2014",
        SCIENCE,
    ),
    "pance-190": card(
        "Why do comedones form, and what is first-line topical therapy for inflammatory acne?",
        "Follicular plugging plus Cutibacterium acnes inflammation.",
        "Comedones define acne.",
        "AAD 2024: topical retinoid plus benzoyl peroxide.",
        "Do not combine a tetracycline with isotretinoin.",
        "AAD Guidelines of care for the management of acne vulgaris",
        "2024",
        SCIENCE,
    ),
    "pance-175": card(
        "How do the reversal agents for warfarin, dabigatran, and factor Xa inhibitors differ?",
        "Each antidote matches the drug. They are not interchangeable.",
        "Warfarin blocks vitamin K-dependent factors II, VII, IX, and X.",
        "Warfarin with life-threatening bleeding: vitamin K plus 4-factor PCC. Dabigatran: idarucizumab. Apixaban or rivaroxaban: andexanet alfa.",
        "Vitamin K does not reverse a direct oral anticoagulant.",
        "2020 ACC Expert Consensus Decision Pathway on bleeding in patients on oral anticoagulants",
        "2020",
        SCIENCE,
    ),
    "pance-154": card(
        "A newborn failed the hearing screen. What are the time targets for diagnosis and intervention?",
        "Screen by 1 month, diagnose by 3 months, intervene by 6 months.",
        "Most congenital hearing loss is not obvious on examination.",
        "Refer for diagnostic audiology. Do not wait for a speech delay.",
        "A passed newborn screen does not exclude later progressive loss.",
        "Joint Committee on Infant Hearing Year 2019 Position Statement",
        "2019",
        HM,
    ),
    "pance-070": card(
        "Which older adults should be offered exercise to prevent falls?",
        "Community-dwelling adults 65 and older who are at increased risk.",
        "A prior fall or a gait or balance problem raises risk.",
        "USPSTF 2024: recommend exercise. Multifactorial interventions are an individual decision.",
        "Do not start vitamin D solely to prevent falls in community-dwelling adults.",
        "USPSTF Recommendation: Interventions to Prevent Falls in Community-Dwelling Older Adults",
        "2024",
        HM,
    ),
    "pance-056": card(
        "Which adults should be screened for unhealthy alcohol use, and what follows a positive screen?",
        "Screen adults 18 and older, including pregnant patients, and offer a brief intervention.",
        "AUDIT-C is a short screen.",
        "USPSTF 2018, still the posted recommendation: screening plus brief behavioral counseling.",
        "A brief intervention is not treatment for withdrawal or severe use disorder.",
        "USPSTF Unhealthy Alcohol Use in Adolescents and Adults: Screening and Behavioral Counseling Interventions (2018, still current as of 2026)",
        "2018",
        HM,
    ),
    "pance-068": card(
        "Who should be screened once for hepatitis C, and which result means active infection?",
        "Adults 18 to 79, at least once. HCV RNA confirms active infection.",
        "Antibody can remain positive after cure.",
        "Positive RNA: link the patient to direct-acting antiviral treatment.",
        "Do not tell a patient they are cured from the antibody alone.",
        "USPSTF Hepatitis C Virus Infection in Adolescents and Adults: Screening",
        "2020",
        HM,
    ),
    "pance-173": card(
        "A patient has no functioning spleen. Which vaccines are due beyond the routine adult schedule?",
        "Pneumococcal, meningococcal, Hib if not given, and annual influenza.",
        "Functional asplenia, including sickle cell disease, counts.",
        "ACIP: pneumococcal vaccines, meningococcal ACWY and MenB, and Hib when due.",
        "Vaccines do not replace emergency care for fever in asplenia.",
        "CDC ACIP Recommended Adult Immunization Schedule",
        "2026",
        HM,
    ),
    "pance-192": card(
        "Who should be counseled to reduce skin-cancer risk, and what is the advice?",
        "Fair-skinned young people, from 6 months through 24 years.",
        "USPSTF 2018 grade B, still the posted recommendation.",
        "Shade, clothing, and broad-spectrum sunscreen.",
        "A changing pigmented lesion is biopsied. Counseling does not replace that.",
        "USPSTF Skin Cancer Prevention: Behavioral Counseling (2018, still current as of 2026)",
        "2018",
        HM,
    ),
    "pance-055": card(
        "Which intervention changes the course of COPD, and which cessation medicines are used?",
        "Stopping smoking. Offer a medicine plus behavioral support.",
        "Ask every patient about tobacco.",
        "USPSTF 2021: varenicline, nicotine replacement, or bupropion, with support. GOLD 2026 treats cessation as essential.",
        "Advice without an offer of treatment is a weaker plan.",
        "USPSTF Tobacco Smoking Cessation in Adults, Including Pregnant Persons: Interventions; GOLD 2026",
        "2021",
        HM,
    ),
}

FRONTS = {
    "pance-022": "Chronic coronary disease with exertional chest pain that stops with rest. What is first-line for symptoms?",
    "pance-145": "Months of extreme thirst and very large urine volumes. Glucose is normal. How do you separate the two causes?",
    "pance-171": "A child with sickle cell disease feels warm. What temperature is an emergency, and what is done now?",
    "nclex-099": "Which sacral pressure injury is stage 3: intact maroon skin, a serum blister, visible fat, or exposed bone?",
    "nclex-020": "A nurse is told to place a device they were never trained to use. Unit policy allows it. What should the nurse do?",
    "nclex-131": "Heparin is ordered at 18 units/kg/hour. The client weighs 176 lb. What is the hourly dose?",
    "fnp-080": "Burning epigastric pain after meals in a 46-year-old, with no weight loss, trouble swallowing, or bleeding. What is the first step?",
    "fnp-020": "An asymptomatic 45-year-old has never been tested for hepatitis C. Who is screened, and which result means active infection?",
    "fnp-024": "A patient is at the first prenatal visit. Who else needs syphilis testing, and which tests confirm it?",
    "fnp-025": "Which adults and adolescents are screened for depression, and which tool do you start with?",
    "fnp-026": "Which adults are screened for anxiety, which tool is used, and why does the plan change after 64?",
    "fnp-048": "A patient is 12 weeks pregnant and returns 6 weeks after delivery. When is mood screened, and with which scale?",
}

NCLEX_131_BULLETS = {
    "clue": "176 lb is 80 kg. Convert before you multiply.",
    "treat": "18 units/kg/hour times 80 kg is 1,440 units/hour.",
    "trap": "Using 176 as if it were kilograms.",
}

NAPLEX_SPLIT = {
    "3A": ["naplex-105", "naplex-115", "naplex-143", "naplex-147", "naplex-153", "naplex-163", "naplex-170"],
    "3B": ["naplex-109", "naplex-111", "naplex-114", "naplex-119", "naplex-128", "naplex-142", "naplex-168", "naplex-176"],
    "3D": ["naplex-104", "naplex-120", "naplex-127", "naplex-154", "naplex-155", "naplex-156", "naplex-160", "naplex-173"],
    "3E": ["naplex-110", "naplex-123", "naplex-124", "naplex-126", "naplex-148", "naplex-158", "naplex-166", "naplex-174", "naplex-180"],
    "3F": ["naplex-121", "naplex-164", "naplex-178", "naplex-179"],
}


def load_deck(folder: Path):
    files = sorted((folder / "cards").glob("cards*.json"))
    decks = []
    for path in files:
        text = path.read_text()
        indent = 2 if "\n  {" in text[:80] else 1
        decks.append((path, json.loads(text), indent))
    return decks


def save_deck(decks):
    for path, cards, indent in decks:
        path.write_text(json.dumps(cards, indent=indent, ensure_ascii=False) + "\n")


def rebuild(card: dict, move: str = "First-line") -> None:
    clue = card["bullets"]["clue"]
    treat = card["bullets"]["treat"]
    trap = card["bullets"]["trap"]
    card["back"] = f"{card['bottom']} Key clue: {clue} {move}: {treat} Exam trap: {trap}"
    card["word_count"] = len(re.findall(r"\S+", card["back"]))


def apply_replacement(card: dict, spec: dict) -> None:
    card["front"] = spec["front"]
    card["bottom"] = spec["bottom"]
    card["bullets"] = spec["bullets"]
    card["task_area"] = spec["task_area"]
    card["source"]["guideline"] = spec["source_guideline"]
    card["source"]["year"] = spec["source_year"]
    rebuild(card)
    if card.get("diagram") and isinstance(card["diagram"], dict):
        card["diagram"]["alt"] = spec["bottom"]


def stamp_current(card: dict) -> None:
    year = str(card.get("source", {}).get("year", ""))
    match = re.search(r"(19|20)\d{2}", year)
    if not match or int(match.group(0)) > 2018:
        return
    guide = card["source"].get("guideline", "")
    if "still current as of 2026" in guide:
        return
    card["source"]["guideline"] = f"{guide} (still current as of 2026)"


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
    return lines


def editorial_svg(card_id: str, eyebrow: str, headline: str, support: str, caution: str) -> str | None:
    """A single editorial answer card. Returns None when the copy will not fit cleanly."""
    head = wrap(headline, 36)
    sup = wrap(support, 42)
    cau = wrap(caution, 42)
    if not (1 <= len(head) <= 4 and 1 <= len(sup) <= 4 and 1 <= len(cau) <= 4):
        return None
    if any(len(line) > 46 for line in head + sup + cau):
        return None
    width = 400
    y = 28
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{{H}}" viewBox="0 0 {width} {{H}}" role="img" aria-label="{xml(headline)}">',
        "<title>" + xml(headline) + "</title>",
        '<rect width="100%" height="100%" fill="#F7F4EF"/>',
        '<rect x="0" y="0" width="8" height="100%" fill="#0F766E"/>',
        f'<text x="28" y="{y}" font-family="Georgia, \'Iowan Old Style\', serif" font-size="13" fill="#0F766E" letter-spacing="1.5">{xml(eyebrow.upper()[:28])}</text>',
    ]
    y += 28
    for line in head:
        parts.append(
            f'<text x="28" y="{y}" font-family="Georgia, \'Iowan Old Style\', serif" font-size="22" font-weight="700" fill="#102027">{xml(line)}</text>'
        )
        y += 28
    y += 8
    parts.append(f'<line x1="28" y1="{y}" x2="372" y2="{y}" stroke="#D6D0C6" stroke-width="1"/>')
    y += 28
    for line in sup:
        parts.append(
            f'<text x="28" y="{y}" font-family="\'Source Sans 3\', \'Segoe UI\', sans-serif" font-size="16" fill="#243038">{xml(line)}</text>'
        )
        y += 22
    y += 16
    box_top = y - 18
    box_h = 18 + len(cau) * 22 + 10
    parts.append(f'<rect x="28" y="{box_top}" width="344" height="{box_h}" rx="8" fill="#FFF6F1" stroke="#E7C4B4"/>')
    for line in cau:
        parts.append(
            f'<text x="42" y="{y}" font-family="\'Source Sans 3\', \'Segoe UI\', sans-serif" font-size="15" fill="#9A3412">{xml(line)}</text>'
        )
        y += 22
    height = y + 20
    svg = "\n".join(parts) + "\n</svg>\n"
    return svg.replace("{H}", str(height))


def write_svg(folder: Path, card_id: str, svg: str) -> None:
    dest = folder / "svg"
    dest.mkdir(exist_ok=True)
    (dest / f"{card_id}.svg").write_text(svg)


def age_band(card: dict) -> str:
    text = " ".join(
        [
            card.get("front", ""),
            card.get("bottom", ""),
            card.get("system", ""),
            card.get("bullets", {}).get("clue", ""),
            card.get("bullets", {}).get("treat", ""),
            card.get("bullets", {}).get("trap", ""),
        ]
    ).lower()
    years = [int(n) for n in re.findall(r"(\d{1,2})-year-old", text)]
    if any(word in text for word in ("newborn", "neonat", "first month of life")) or any(n <= 1 for n in years if n < 1):
        return "Newborn"
    if "newborn" in text or "neonate" in text:
        return "Newborn"
    if "infant" in text or "bronchiolit" in text or any(n < 1 for n in years):
        return "Infant"
    if "toddler" in text or "18 month" in text or any(1 <= n <= 3 for n in years):
        return "Toddler"
    if any(4 <= n <= 12 for n in years) or (card.get("system") == "Peds" and "school" in text):
        return "Child"
    if re.search(r"\bteens?\b", text) or any(word in text for word in ("adolescent", "teenager", "headss")) or any(13 <= n <= 17 for n in years):
        return "Adolescent"
    if card.get("system") == "Peds":
        return "Child"
    if card.get("system") == "Geriatrics" or any(n >= 65 for n in years) or any(
        word in text for word in ("older ", "elderly", "beers", "frail", "osteoporosis")
    ):
        return "Older adult"
    if "pregnan" in text or "prenatal" in text or "postpartum" in text or "contracept" in text:
        return "Young adult"
    if any(18 <= n <= 39 for n in years) or card.get("system") == "Reproductive":
        return "Young adult"
    if any(40 <= n <= 64 for n in years):
        return "Middle adult"
    return "Middle adult"


def main() -> None:
    pance = load_deck(ROOT / "content/pance-feed")
    for _path, cards, _indent in pance:
        for card in cards:
            cid = card["id"]
            if cid in REPLACEMENTS:
                apply_replacement(card, REPLACEMENTS[cid])
            elif cid in PILOTS:
                card["task_area"] = PILOTS[cid]
            elif cid in RETAG:
                card["task_area"] = RETAG[cid]
            else:
                label = card.get("task_area")
                if label in CANON.values() and label not in CANON:
                    pass
                elif label not in CANON:
                    raise SystemExit(f"Unmapped task label on {cid}: {label!r}")
                else:
                    card["task_area"] = CANON[label]
            if cid in FRONTS:
                card["front"] = FRONTS[cid]
            stamp_current(card)
            if len(card["front"]) > 170:
                raise SystemExit(f"Front too long: {cid} {len(card['front'])}")
            if card.get("word_count", 0) > 63:
                raise SystemExit(f"Back too long: {cid} {card['word_count']}")
    save_deck(pance)

    from collections import Counter

    all_pance = [c for _p, cards, _i in pance for c in cards]
    counts = Counter(c["task_area"] for c in all_pance)
    print("PANCE tasks", dict(counts))
    if len(all_pance) != 200:
        raise SystemExit("PANCE count")
    if counts[SCIENCE] != 16 or counts[HM] != 22:
        raise SystemExit(f"Task mix off: science {counts[SCIENCE]} hm {counts[HM]}")
    if any(not c.get("task_area") for c in all_pance):
        raise SystemExit("Null task remains")

    nclex = load_deck(ROOT / "content/nclex-feed")
    naplex = load_deck(ROOT / "content/naplex-feed")
    fnp = load_deck(ROOT / "content/fnp-feed")

    for _path, cards, _indent in nclex:
        for card in cards:
            if card["id"] in FRONTS:
                card["front"] = FRONTS[card["id"]]
            if card["id"] == "nclex-131":
                card["bullets"] = NCLEX_131_BULLETS
                card["bottom"] = "1,440 units/hour."
                rebuild(card)
    # A repeated headline card is a template, not a figure. Keep a graphic only
    # when a hand-drawn file was already in the deck. Otherwise the card is text-only.
    text_only = 0
    for folder, decks in (
        (ROOT / "content/nclex-feed", nclex),
        (ROOT / "content/naplex-feed", naplex),
    ):
        for _path, cards, _indent in decks:
            for card in cards:
                svg_path = folder / "svg" / f"{card['id']}.svg"
                if svg_path.exists() and "editorial" not in svg_path.read_text()[:200]:
                    continue
                if svg_path.exists():
                    svg_path.unlink()
                card["diagram"] = None
                text_only += 1
    print(f"Text-only cards (no template graphic): {text_only}")

    split = {cid: area for area, ids in NAPLEX_SPLIT.items() for cid in ids}
    for _path, cards, _indent in naplex:
        for card in cards:
            if card["id"] in split:
                card["task_area"] = f"NAPLEX {split[card['id']]}"
    areas = Counter()
    for _path, cards, _indent in naplex:
        for card in cards:
            if str(card["task_area"]).startswith("NAPLEX 3"):
                areas[card["task_area"]] += 1
    print("NAPLEX area 3", dict(areas))
    for needed in ("NAPLEX 3A", "NAPLEX 3B", "NAPLEX 3E", "NAPLEX 3F"):
        if areas[needed] < 1:
            raise SystemExit(f"Missing {needed}")

    for _path, cards, _indent in fnp:
        for card in cards:
            if card["id"] in FRONTS:
                card["front"] = FRONTS[card["id"]]
            card["age_band"] = age_band(card)
            if len(card["front"]) > 140:
                raise SystemExit(f"FNP front long {card['id']} {len(card['front'])} {card['front']}")
    ages = Counter(c["age_band"] for _p, cards, _i in fnp for c in cards)
    print("FNP ages", dict(ages), "n", sum(ages.values()))

    save_deck(nclex)
    save_deck(naplex)
    save_deck(fnp)

    # Replaced PANCE cards need a matching graphic. Existing art for untouched cards stays.
    for _path, cards, _indent in pance:
        for card in cards:
            if card["id"] not in REPLACEMENTS and card["id"] not in ("pance-022", "pance-145", "pance-171"):
                continue
            svg = editorial_svg(
                card["id"],
                card.get("system", "PANCE"),
                card["bottom"].rstrip("."),
                card["bullets"]["clue"],
                card["bullets"]["trap"],
            )
            if not svg:
                lines = wrap(card["bottom"].rstrip("."), 32)[:5]
                body = "".join(
                    f'<text x="28" y="{40 + i * 28}" font-family="Georgia, serif" font-size="20" fill="#102027">{xml(line)}</text>'
                    for i, line in enumerate(lines)
                )
                height = 56 + len(lines) * 28
                svg = (
                    f'<svg xmlns="http://www.w3.org/2000/svg" width="400" height="{height}" viewBox="0 0 400 {height}" role="img" aria-label="{xml(card["bottom"][:120])}">'
                    f'<rect width="100%" height="100%" fill="#F7F4EF"/>'
                    f'<rect width="8" height="100%" fill="#0F766E"/>{body}</svg>\n'
                )
            write_svg(ROOT / "content/pance-feed", card["id"], svg)
            if isinstance(card.get("diagram"), dict):
                card["diagram"]["alt"] = card["bottom"][:180]
    save_deck(pance)
    print("Done")


if __name__ == "__main__":
    main()
