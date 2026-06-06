/**
 * Clinical vignette seeds — NAPLEX 2025 domains & USMLE integrated reasoning.
 * Emphasis on treatment planning, safety, and application (not rote recall).
 */
import { vignette, mcq, type EnrichedBankItem } from "./seed-helpers";

export const NAPLEX_VIGNETTE_SEEDS: EnrichedBankItem[] = [
  vignette(
    "patient-counseling",
    "A 58-year-old woman with T2DM, eGFR 38 mL/min, and HbA1c 8.9% asks about starting a new medication. She reports adherence to metformin 1000 mg BID.",
    "Which medication adjustment is most appropriate?",
    ["Continue metformin and add SGLT2 inhibitor with renal dosing review", "Start metformin 2000 mg TID", "Discontinue all diabetes meds", "Add thiazolidinedione as first add-on"],
    "Continue metformin and add SGLT2 inhibitor with renal dosing review",
    "SGLT2 inhibitors provide cardiorenal benefit in T2DM; metformin may need dose adjustment when eGFR <45 per guidelines.",
    {
      blueprintDomain: "naplex-area3-treatment-planning",
      difficulty: 4,
      references: [{ label: "ADA Standards of Care — pharmacologic therapy in CKD" }],
      tags: ["diabetes", "renal", "NAPLEX-2025"],
    }
  ),
  vignette(
    "infectious-disease-rx",
    "A 34-year-old man presents with urethritis, dysuria, and recent unprotected sexual contact. No fever. Allergic to penicillin (anaphylaxis).",
    "First-line empiric therapy is most likely:",
    ["Ceftriaxone IM plus doxycycline", "Amoxicillin 500 mg TID", "Azithromycin alone for all cases", "Fluconazole 150 mg"],
    "Ceftriaxone IM plus doxycycline",
    "CDC STI guidelines recommend ceftriaxone plus doxycycline for gonorrhea/chlamydia coverage; avoid penicillin if anaphylaxis.",
    {
      blueprintDomain: "naplex-area2-therapeutics",
      references: [{ label: "CDC STI Treatment Guidelines" }],
      tags: ["infectious disease", "STI"],
    }
  ),
  vignette(
    "cardiovascular-rx",
    "A 72-year-old with HFrEF (EF 30%) on lisinopril and carvedilol has persistent dyspnea. BP 118/70, K+ 4.2, Cr 1.1.",
    "Which add-on is guideline-directed medical therapy?",
    ["Spironolactone", "Amlodipine as first add-on", "Hydralazine-isosorbide only without ARNI", "Oral pseudoephedrine"],
    "Spironolactone",
    "MRA (spironolactone/eplerenone) is GDMT for HFrEF when K+ and renal function allow.",
    { blueprintDomain: "naplex-area3-treatment-planning", tags: ["heart failure", "GDMT"] }
  ),
  vignette(
    "compounding-calculations",
    "A prescription calls for 250 mL of 0.9% NaCl with 20 mEq KCl (final concentration). Stock KCl is 2 mEq/mL.",
    "How many mL of stock KCl are needed?",
    ["10 mL", "20 mL", "5 mL", "40 mL"],
    "10 mL",
    "20 mEq ÷ 2 mEq/mL = 10 mL; verify compatibility and final osmolarity.",
    { blueprintDomain: "naplex-area1-foundations", difficulty: 3, tags: ["calculations"] }
  ),
  vignette(
    "cns-rx",
    "A 45-year-old on phenytoin for seizures presents with nystagmus, ataxia, and slurred speech. Phenytoin level 28 mcg/mL.",
    "Best pharmacist recommendation?",
    ["Hold dose and contact prescriber for level and symptom review", "Double next dose", "Switch to OTC supplement", "Add another CYP inducer"],
    "Hold dose and contact prescriber for level and symptom review",
    "Level >20 mcg/mL suggests toxicity; hold and consult prescriber.",
    { blueprintDomain: "naplex-area4-safety", tags: ["phenytoin", "toxicity"] }
  ),
];

export const USMLE_VIGNETTE_SEEDS: EnrichedBankItem[] = [
  vignette(
    "pathology",
    "A 19-year-old college student has sore throat, fever, and posterior cervical lymphadenopathy. Rapid heterophile antibody test is positive.",
    "Complication to counsel about before sport return?",
    ["Splenic rupture risk — avoid contact sports until cleared", "Immediate anticoagulation", "Chronic dialysis", "Mandatory splenectomy"],
    "Splenic rupture risk — avoid contact sports until cleared",
    "EBV mononucleosis carries splenomegaly and rupture risk; activity restriction is standard.",
    {
      blueprintDomain: "usmle-clinical-reasoning",
      references: [{ label: "UpToDate — Infectious mononucleosis" }],
      tags: ["infectious disease", "USMLE"],
    }
  ),
  vignette(
    "pharmacology",
    "A 67-year-old on enalapril, spironolactone, and TMP-SMX for UTI presents with weakness and K+ 6.8 mEq/L.",
    "Primary contributor to hyperkalemia?",
    ["Trimethoprim-associated hyperkalemia potentiated by RAAS blockade", "Iron deficiency", "Hypothyroidism alone", "Vitamin B12 deficiency"],
    "Trimethoprim-associated hyperkalemia potentiated by RAAS blockade",
    "TMP acts like potassium-sparing diuretic; combined with ACEi/aldosterone antagonist raises hyperkalemia risk.",
    { blueprintDomain: "usmle-clinical-reasoning", tags: ["electrolytes", "drug interaction"] }
  ),
  vignette(
    "physiology",
    "A 55-year-old climber at high altitude develops headache, confusion, and ataxia. SaO2 82% on room air.",
    "Most likely diagnosis?",
    ["High-altitude cerebral edema (HACE)", "Carbon monoxide poisoning only", "Simple dehydration", "Acute angle-closure glaucoma"],
    "High-altitude cerebral edema (HACE)",
    "HACE presents with neurologic symptoms at altitude; requires descent and oxygen.",
    { blueprintDomain: "usmle-clinical-reasoning", tags: ["environmental"] }
  ),
  vignette(
    "pathology",
    "A 28-year-old woman has fatigue, pruritus, and elevated alkaline phosphatase. Anti-mitochondrial antibody positive.",
    "Most likely diagnosis?",
    ["Primary biliary cholangitis", "Acute viral hepatitis A", "Hemochromatosis", "Wilson disease"],
    "Primary biliary cholangitis",
    "AMA positivity with cholestatic labs suggests PBC.",
    { blueprintDomain: "usmle-clinical-reasoning", tags: ["hepatology"] }
  ),
  mcq(
    "pharmacology",
    "A physician asks about ethics when a competent adult refuses life-saving transfusion for religious reasons.",
    [
      "Respect autonomy; ensure informed refusal is documented",
      "Transfuse without consent because it is life-saving",
      "Obtain court order in all cases",
      "Sedate and transfuse",
    ],
    "Respect autonomy; ensure informed refusal is documented",
    "Competent adults may refuse treatment; document informed refusal and offer alternatives.",
    {
      blueprintDomain: "usmle-ethics",
      difficulty: 3,
      tags: ["ethics", "USMLE", "patient autonomy"],
      references: [{ label: "AMA Code of Medical Ethics — informed refusal" }],
    }
  ),
];
