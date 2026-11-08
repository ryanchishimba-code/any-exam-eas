#!/usr/bin/env python3
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
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
out = Path(__file__).resolve().parent / "items.json"
out.write_text(json.dumps(items, indent=2))
print(len(items))
