/**
 * NAPLEX v3 — 15 additional Person-Centered Treatment Planning items (Area 3).
 */
import type { EnrichedBankItem } from "./seed-helpers";
import {
  naplexCase,
  naplexDragDrop,
  naplexExhibit,
  naplexMcq,
  naplexSata,
} from "./naplex-seed-factory";

const A3 = "naplex-area3-treatment-planning" as const;

const FDA = { label: "FDA prescribing information", url: "https://www.fda.gov/drugs" };
const ADA = { label: "ADA Standards of Care in Diabetes", url: "https://diabetesjournals.org/care" };
const ACCAHA = { label: "ACC/AHA Guideline", url: "https://www.acc.org" };
const GOLD = { label: "GOLD COPD Report", url: "https://goldcopd.org" };

export const NAPLEX_AREA3_V3: EnrichedBankItem[] = [
  naplexCase(
    "endocrine-rx",
    `R.K., 58 y/o man | T2DM + ASCVD (prior MI) | A1c 8.4% | eGFR 55 | on metformin 1 g BID | BMI 31`,
    "Which add-on best addresses cardiometabolic goals?",
    [
      "GLP-1 RA with proven CV benefit",
      "Glimepiride 4 mg daily",
      "Pioglitazone 45 mg daily without discussion",
      "Stop metformin; start basal insulin only",
    ],
    "GLP-1 RA with proven CV benefit",
    "ASCVD + uncontrolled T2DM: ADA prioritizes GLP-1 RA or SGLT2i with CV benefit over sulfonylurea or TZD.",
    { blueprintDomain: A3, references: [ADA] }
  ),

  naplexCase(
    "cardiovascular-rx",
    `B.N., 71 y/o woman | New Afib, persistent | CHA₂DS₂-VASc 4 | HAS-BLED 2 | CKD stage 3 | No valvular disease`,
    "Best anticoagulation recommendation?",
    [
      "Apixaban (or another DOAC) with renal/weight dose check",
      "Aspirin 325 mg daily alone",
      "Warfarin only — DOACs contraindicated in all CKD",
      "No anticoagulation due to bleeding score",
    ],
    "Apixaban (or another DOAC) with renal/weight dose check",
    "CHA₂DS₂-VASc ≥2 in women warrants anticoagulation; HAS-BLED informs monitoring. Apixaban has renal/weight-based adjustments.",
    { blueprintDomain: A3, references: [ACCAHA] }
  ),

  naplexSata(
    "patient-counseling",
    `Breastfeeding mother with mastitis | No penicillin allergy | Infant 6 weeks healthy`,
    "Which antibiotic/counseling points apply? (Select all that apply.)",
    [
      "Dicloxacillin or cephalexin commonly used for mastitis",
      "Continue breastfeeding unless clinician advises temporary pause",
      "Fluoroquinolone first-line while nursing",
      "Counsel on completing full course and fluids/rest",
      "Automatic weaning required with all antibiotics",
    ],
    [
      "Dicloxacillin or cephalexin commonly used for mastitis",
      "Continue breastfeeding unless clinician advises temporary pause",
      "Counsel on completing full course and fluids/rest",
    ],
    "Beta-lactamase–resistant penicillins/cephalosporins are typical; breastfeeding usually continues with compatible agents.",
    { blueprintDomain: A3, references: [FDA] }
  ),

  naplexCase(
    "infectious-disease-rx",
    `Outpatient cellulitis | 45 y/o man | No MRSA risk | No allergy | BMI 28 | on lisinopril`,
    "Best empiric oral therapy?",
    [
      "Cephalexin 500 mg QID × 5–7 days",
      "Vancomycin IV outpatient",
      "Metronidazole monotherapy",
      "Linezolid first-line",
    ],
    "Cephalexin 500 mg QID × 5–7 days",
    "Uncomplicated non-purulent cellulitis in low MRSA risk: anti-streptococcal beta-lactam (cephalexin/dicloxacillin).",
    { blueprintDomain: A3 }
  ),

  naplexExhibit(
    "endocrine-rx",
    `CKD + T2DM treatment review`,
    "Based on the exhibit, which regimen adjustment is most appropriate?",
    {
      headers: ["Parameter", "Value", "Notes"],
      rows: [
        ["eGFR", "32 mL/min", "Stable"],
        ["A1c", "8.2%", "On metformin 1 g BID"],
        ["UACR", "450 mg/g", "Albuminuric"],
        ["BP", "138/84", "On lisinopril 20 mg"],
      ],
    },
    [
      "Continue metformin if eGFR ≥30; add SGLT2i with CKD benefit if not contraindicated",
      "Stop metformin; sulfonylurea only",
      "Increase metformin to 3 g daily",
      "No UACR-directed therapy needed",
    ],
    "Continue metformin if eGFR ≥30; add SGLT2i with CKD benefit if not contraindicated",
    "eGFR 32 allows metformin with monitoring; SGLT2i indicated for CKD/albuminuria per ADA/KDIGO alignment.",
    { blueprintDomain: A3, references: [ADA] }
  ),

  naplexCase(
    "cns-rx",
    `Parkinson disease | On carbidopa/levodopa 25/100 QID | Wearing-off before next dose | No psychosis`,
    "Best pharmacologic strategy?",
    [
      "Add COMT inhibitor or adjust levodopa dosing interval per neurologist",
      "Start high-dose antipsychotic for prevention",
      "Stop levodopa; benztropine monotherapy",
      "MAOI augmentation without washout",
    ],
    "Add COMT inhibitor or adjust levodopa dosing interval per neurologist",
    "Motor wearing-off managed by optimizing levodopa frequency or adding COMT inhibitor; avoid unsafe psychotropic combos.",
    { blueprintDomain: A3 }
  ),

  naplexDragDrop(
    "cardiovascular-rx",
    `Heart failure medication education — match drug to primary counseling point`,
    "Match each medication to its priority counseling focus:",
    [
      { prompt: "Sacubitril/valsartan", match: "Angioedema risk; avoid with ACEi overlap" },
      { prompt: "Spironolactone", match: "Hyperkalemia; avoid potassium supplements" },
      { prompt: "Furosemide", match: "Orthostasis; take morning if once daily" },
      { prompt: "Metoprolol succinate", match: "Do not stop abruptly; fatigue/Bradycardia monitoring" },
    ],
    ["Take with high-fat meals only", "Crush extended-release tablets"],
    "Each HF drug has distinct safety counseling tied to mechanism and adverse effect profile.",
    { blueprintDomain: A3, references: [ACCAHA] }
  ),

  naplexCase(
    "patient-counseling",
    `Solid organ transplant recipient | New mycophenolate | On tacrolimus | Asks about OTC supplements`,
    "Highest priority counseling?",
    [
      "Avoid St. John's wort and herbals that induce CYP3A4; infection and pregnancy prevention counseling",
      "Encourage grapefruit juice for absorption",
      "All OTC products are safe post-transplant",
      "Stop tacrolimus if cold symptoms",
    ],
    "Avoid St. John's wort and herbals that induce CYP3A4; infection and pregnancy prevention counseling",
    "Transplant immunosuppressants have narrow interactions; herbals can precipitate rejection or toxicity.",
    { blueprintDomain: A3, references: [FDA] }
  ),

  naplexSata(
    "infectious-disease-rx",
    `Hospital: CAP non-ICU | No pseudomonas risk | No recent antibiotics`,
    "Which empiric regimens are appropriate? (Select all that apply.)",
    [
      "Amoxicillin-clavulanate + macrolide",
      "Respiratory fluoroquinolone monotherapy",
      "Ceftriaxone + azithromycin",
      "Metronidazole monotherapy",
      "Piperacillin-tazobactam routine for all CAP",
    ],
    [
      "Amoxicillin-clavulanate + macrolide",
      "Respiratory fluoroquinolone monotherapy",
      "Ceftriaxone + azithromycin",
    ],
    "IDSA/ATS CAP outpatient/inpatient non-severe: beta-lactam + macrolide or respiratory FQ monotherapy.",
    { blueprintDomain: A3 }
  ),

  naplexCase(
    "endocrine-rx",
    `Adrenal insufficiency | On hydrocortisone 20 mg AM / 10 mg PM | Nausea/vomiting cannot keep PO down`,
    "Urgent recommendation?",
    [
      "Stress-dose steroids (e.g., hydrocortisone IM/IV) and emergency care; sick-day rules",
      "Hold all steroids until eating resumes",
      "Double evening dose only",
      "Switch to levothyroxine",
    ],
    "Stress-dose steroids (e.g., hydrocortisone IM/IV) and emergency care; sick-day rules",
    "Adrenal crisis prevention requires parenteral stress dosing when unable to tolerate oral maintenance steroids.",
    { blueprintDomain: A3, references: [FDA] }
  ),

  naplexMcq(
    "otc-self-care",
    `Pregnant patient (14 wk) with heartburn unrelieved by lifestyle`,
    "Best OTC recommendation?",
    [
      "Calcium carbonate antacid PRN short-term; avoid sodium bicarbonate/high-sodium products",
      "Omeprazole OTC unlimited without prescriber",
      "Aspirin-containing antacid",
      "Sodium bicarbonate high-dose routine",
    ],
    "Calcium carbonate antacid PRN short-term; avoid sodium bicarbonate/high-sodium products",
    "Antacids may be used cautiously in pregnancy; avoid salicylates and excessive sodium; PPI if refractory per prescriber.",
    { blueprintDomain: A3, references: [FDA] }
  ),

  naplexCase(
    "cardiovascular-rx",
    `Gout + CKD stage 3 | Acute flare | Colchicine considered | On diltiazem`,
    "Which colchicine dosing consideration is most important?",
    [
      "Reduce colchicine dose for CKD and CYP3A4/P-gp inhibitors (diltiazem); toxicity risk",
      "Standard high-dose colchicine load regardless of interactions",
      "Colchicine contraindicated in all CKD",
      "Add rifampin to increase clearance",
    ],
    "Reduce colchicine dose for CKD and CYP3A4/P-gp inhibitors (diltiazem); toxicity risk",
    "Colchicine has narrow therapeutic index; dose-reduce with renal impairment and interacting CYP3A4/P-gp drugs.",
    { blueprintDomain: A3, references: [FDA] }
  ),

  naplexDragDrop(
    "infectious-disease-rx",
    `Antibiotic stewardship — match organism/scenario to preferred agent`,
    "Match each scenario to the most appropriate first-line therapy:",
    [
      { prompt: "Community UTI (E. coli) outpatient", match: "Nitrofurantoin" },
      { prompt: "Pharyngitis confirmed Group A strep", match: "Penicillin V or amoxicillin" },
      { prompt: "C. difficile initial episode (non-severe)", match: "Vancomycin oral or fidaxomicin" },
      { prompt: "Latent TB", match: "Isoniazid + rifapentine weekly (short course) or INH monotherapy" },
    ],
    ["IV vancomycin for uncomplicated cystitis", "Azithromycin for GAS pharyngitis"],
    "Stewardship aligns narrowest effective agent to syndrome and susceptibility patterns; avoid IV vancomycin for uncomplicated cystitis and macrolide monotherapy for confirmed GAS pharyngitis.",
    { blueprintDomain: A3 }
  ),

  naplexExhibit(
    "cardiovascular-rx",
    `Hypertension clinic — medication review`,
    "Using the table, which change is most appropriate?",
    {
      headers: ["Drug", "Dose", "Concern"],
      rows: [
        ["Lisinopril", "40 mg daily", "BP 148/92, SCr stable"],
        ["HCTZ", "12.5 mg daily", "K+ 3.4"],
        ["Amlodipine", "5 mg daily", "Edema mild"],
      ],
    },
    [
      "Add amlodipine dose or add thiazide-like agent; recheck K+",
      "Stop lisinopril for cough not present",
      "Discontinue all antihypertensives",
      "Add NSAID for edema",
    ],
    "Add amlodipine dose or add thiazide-like agent; recheck K+",
    "BP above goal on dual therapy warrants intensification; monitor potassium with ACEi/HCTZ combo.",
    { blueprintDomain: A3, references: [ACCAHA] }
  ),

  naplexCase(
    "patient-counseling",
    `SLE patient starting hydroxychloroquine | Plaquenil education visit`,
    "Essential counseling before dispensing?",
    [
      "Baseline and periodic eye exams; take with food; report vision changes promptly",
      "No ophthalmology follow-up needed",
      "Take on empty stomach only at bedtime",
      "Safe to double dose if joint pain flares",
    ],
    "Baseline and periodic eye exams; take with food; report vision changes promptly",
    "Hydroxychloroquine retinopathy screening is standard; GI tolerance improved with food.",
    { blueprintDomain: A3, references: [FDA] }
  ),

];
