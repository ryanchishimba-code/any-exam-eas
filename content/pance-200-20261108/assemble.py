#!/usr/bin/env python3
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib_items import refs
from batch_derm import DERM
from batch_gu import GU
from batch_renal import RENAL
from batch_core import CORE
from batch_rest import REST

# One-step recognition items stay at 3 even if a draft labeled them 4.
DOWNGRADE = {
    "Tinea capitis before empiric minoxidil",
    "Bullous pemphigoid versus pemphigus",
    "Stasis dermatitis versus cellulitis",
    "Burn referral depth",
    "Pressure injury staging",
    "Urticaria and anaphylaxis epinephrine",
    "Lichen planus and hepatitis C",
    "Molluscum in an adult",
    "Stress versus urge incontinence",
    "Cryptorchidism timing",
    "Open fracture antibiotics and time",
    "Slipped capital femoral epiphysis",
    "Bell palsy versus stroke",
    "Transfusion reaction during the unit",
    "Postpartum hemorrhage uterotonic",
    "Endometrial biopsy age",
    "Alcohol withdrawal benzodiazepine",
    "Tension pneumothorax",
    "Tamponade pulsus paradoxus",
    "Outpatient community-acquired pneumonia",
    "Peritonsillar abscess",
    "Rh immunoglobulin timing",
    "Interpreter, not the child",
    "Against medical advice and capacity",
    "Error disclosure",
    "Impaired colleague",
    "MAO inhibitor food interaction",
    "Asplenia vaccines",
    "Esophageal candidiasis and HIV",
    "PID outpatient criteria",
}

ACNE_TOPICS = {
    "Acne antibiotic stewardship",
    "Isotretinoin indications versus routine labs",
}
items = DERM + GU + RENAL + CORE + REST
for row in items:
    if row["subjectId"] == "dermatologic" and row["blueprintTopic"] not in ACNE_TOPICS:
        row["references"] = [
            ref for ref in row["references"]
            if "38300170" not in ref["url"]
        ] or [
            {
                "label": "NCCPA. Content Blueprint for the PANCE, effective January 2025. NCCPA 2025",
                "url": "https://www.nccpa.net/wp-content/uploads/PANCE-Blueprint.pdf",
            }
        ]
    if row["blueprintTopic"] == "Testicular torsion timing":
        row["references"] = [
            {
                "label": "NCCPA. Content Blueprint for the PANCE, effective January 2025. NCCPA 2025",
                "url": "https://www.nccpa.net/wp-content/uploads/PANCE-Blueprint.pdf",
            }
        ]
for row in items:
    if row["blueprintTopic"] in DOWNGRADE and row["difficulty"] > 3:
        row["difficulty"] = 3

# Citation must be the document that actually makes the recommendation.
CITE = {
    "Light criteria for pleural fluid": refs("bts-pleural-2023"),
    "Complicated parapneumonic effusion": refs("bts-pleural-2023"),
    "Solitary pulmonary nodule follow-up": refs("fleischner-2017"),
    "Tension pneumothorax": refs("atls-2018"),
    "Statin intensity after a coronary stent": refs("cholesterol-2018"),
    "Aortic dissection blood pressure": refs("aortic-2022"),
    "Tamponade pulsus paradoxus": refs("pericardial-2015"),
    "Warfarin reversal for bleeding": refs("acc-bleed-2020"),
    "Preeclampsia with severe features": refs("acog-preeclampsia-2020"),
    "Pulmonary embolism Wells and age-adjusted D-dimer": refs("esc-pe-2019"),
    "Infected obstructing stone": refs("aua-stone-surg-2016"),
    "Severe penicillin allergy and syphilis": refs("cdc-syphilis-2021"),
    "PID outpatient criteria": refs("cdc-pid-2021"),
    "HIV post-exposure prophylaxis clock": refs("phs-pep-2025"),
    "Influenza treatment window in a high-risk adult": refs("cdc-flu-2025"),
    "SGLT2 perioperative hold": refs("kdigo-ckd-2024"),
    "Euglycemic ketoacidosis": refs("ada-soc-2026", "kdigo-ckd-2024"),
    "Insulin in DKA before potassium is known": refs("ada-soc-2026"),
    "Hypoglycemia in a sulfonylurea overdose": refs("ada-soc-2026"),
    "Prerenal azotemia versus ATN": refs("nccpa-2025"),
    "Acute tubular necrosis sediment": refs("nccpa-2025"),
    "Acute interstitial nephritis": refs("nccpa-2025"),
    "Postrenal failure in a man": refs("nccpa-2025"),
    "Rhabdomyolysis kidney injury": refs("nccpa-2025"),
    "Nephrotic edema mechanism": refs("nccpa-2025"),
    "Nephritic sediment": refs("nccpa-2025"),
    "Horseshoe kidney infection risk": refs("nccpa-2025"),
}
for row in items:
    if row["blueprintTopic"] in CITE:
        row["references"] = CITE[row["blueprintTopic"]]
out = Path(__file__).resolve().parent / "items.json"
out.write_text(json.dumps(items, indent=2))
print(len(items))
