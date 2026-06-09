/**
 * Curated NAPLEX-style items — physician-educator batch 01 (NBME/UWorld editorial tone).
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import {
  naplexCalcCase,
  naplexCase,
  naplexMcq,
  naplexSata,
} from "@/lib/exam-prep/naplex-seed-factory";

const A1 = "naplex-area1-foundations" as const;
const A2 = "naplex-area2-therapeutics" as const;
const A3 = "naplex-area3-treatment-planning" as const;
const A4 = "naplex-area4-safety" as const;

const BATCH = "physician-educator-batch-01";
const PE = ["physician-educator", BATCH];

const FDA = { label: "FDA prescribing information", url: "https://www.fda.gov/drugs" };
const ACIP = { label: "ACIP/CDC immunization guidance", url: "https://www.cdc.gov/vaccines" };
const ISMP = { label: "ISMP High-Alert Medications", url: "https://www.ismp.org" };
const ADA = { label: "ADA Standards of Care in Diabetes", url: "https://diabetesjournals.org/care" };
const IDSA = { label: "IDSA CAP Guideline", url: "https://www.idsociety.org" };
const ACCAHA = { label: "ACC/AHA Heart Failure Guideline", url: "https://www.acc.org" };
const DEA = { label: "DEA Controlled Substance Regulations", url: "https://www.dea.gov" };

const opts4 = (
  a: string,
  b: string,
  c: string,
  d: string
): [string, string, string, string] => [a, b, c, d];

export const NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01: EnrichedBankItem[] = [
  naplexCase(
    "patient-counseling",
    `Chart: R.K., 74 y/o man | PMH: nonvalvular AFib, HTN, CKD stage 3a | Meds: apixaban 5 mg BID, amlodipine 5 mg daily | INR not applicable (DOAC) | CrCl 52 mL/min | BP 128/74 mm Hg`,
    "He calls the pharmacy two days before a scheduled simple dental extraction (one molar, no bone graft). He asks whether to stop apixaban. Which recommendation is most appropriate?",
    [
      "Continue apixaban without interruption",
      "Hold apixaban 48 hours before and 48 hours after the procedure",
      "Bridge with enoxaparin 1 mg/kg BID and hold apixaban",
      "Switch to warfarin with target INR 2–3 before extraction",
    ],
    "Continue apixaban without interruption",
    `For many low-bleeding-risk dental procedures in patients on apixaban, uninterrupted DOAC therapy is preferred over bridging, which increases bleeding without clear benefit. Holding 48 hours is excessive for simple extraction with adequate renal function. Warfarin conversion is unnecessary. Counsel the dentist on local hemostatic measures.`,
    {
      blueprintDomain: A3,
      difficulty: 4,
      references: [FDA],
      guideline: "Perioperative anticoagulation — dental extraction",
      tags: ["anticoagulation", "apixaban", ...PE],
    }
  ),

  naplexSata(
    "pharmacology",
    `Chart: T.L., 28 y/o man with HIV | New Rx: bictegravir/emtricitabine/tenofovir alafenamide (B/F/TAF) daily | Meds review reveals several OTC and herbal products`,
    "Which medication or supplement interactions require pharmacist intervention before starting B/F/TAF? (Select all that apply.)",
    [
      "St. John's wort 300 mg daily",
      "Rifampin 600 mg daily for latent TB treatment",
      "Magnesium/aluminum antacid taken at the same time as B/F/TAF each morning",
      "Daily multivitamin without minerals taken 2 hours apart from B/F/TAF",
      "Acetaminophen 650 mg PRN headache",
    ],
    [
      "St. John's wort 300 mg daily",
      "Rifampin 600 mg daily for latent TB treatment",
      "Magnesium/aluminum antacid taken at the same time as B/F/TAF each morning",
    ],
    `St. John's wort and rifampin are potent CYP3A/inducer interactions that can drop integrase/NNRTI levels and cause virologic failure. Polyvalent cations chelate integrase inhibitors when co-ingested; separate by ≥2 hours. Multivitamin without simultaneous cations and acetaminophen are not clinically significant interactions here.`,
    {
      blueprintDomain: A2,
      difficulty: 4,
      references: [FDA],
      guideline: "INSTI-based ART drug interactions",
      tags: ["HIV", "drug-interactions", ...PE],
    }
  ),

  naplexCalcCase(
    "compounding-calculations",
    `Order: KCl 40 mEq in 1000 mL D5W IV continuous. The prescriber orders a maximum infusion rate of 10 mEq/hr. Pharmacy prepares the full 1000 mL bag.`,
    "At what rate (mL/hr) should the nurse set the infusion pump to deliver 10 mEq/hr? (Round to the nearest whole number.)",
    "250",
    "mL/hr",
    `Concentration = 40 mEq ÷ 1000 mL = 0.04 mEq/mL. Rate (mL/hr) = desired mEq/hr ÷ concentration = 10 ÷ 0.04 = 250 mL/hr. Verify peripheral line tolerance and monitor for infusion-site pain at higher KCl concentrations.`,
    {
      blueprintDomain: A1,
      difficulty: 3,
      references: [FDA],
      guideline: "IV electrolyte infusion rate calculation",
      tags: ["IV-rate", "potassium", ...PE],
    },
    ["40 mEq / 1000 mL = 0.04 mEq/mL", "10 mEq/hr ÷ 0.04 mEq/mL = 250 mL/hr"]
  ),

  naplexCase(
    "infectious-disease-rx",
    `Chart: M.S., 42 y/o woman | PMH: asthma | Penicillin allergy: hives (not anaphylaxis) as a child | Temp 38.4°C (101.1°F) | Productive cough, pleuritic chest pain | RR 22/min, O₂ sat 94% on room air | No hypoxia requiring hospitalization | CXR: right lower lobe infiltrate`,
    "Which outpatient antibiotic regimen is most appropriate for community-acquired pneumonia?",
    [
      "Amoxicillin 875 mg BID for 5 days",
      "Azithromycin 500 mg daily for 3 days",
      "Doxycycline 100 mg BID for 5 days",
      "Levofloxacin 750 mg daily for 5 days",
    ],
    "Doxycycline 100 mg BID for 5 days",
    `Outpatient CAP in a healthy adult without comorbidities requiring fluoroquinolone can be treated with doxycycline or a macrolide. Documented penicillin allergy (even non-IgE) makes amoxicillin less preferred unless allergy is re-evaluated. Azithromycin is acceptable but rising resistance limits empiric macrolide monotherapy in some regions; doxycycline covers typical and atypical pathogens. Reserve levofloxacin for patients with comorbidities or failed therapy.`,
    {
      blueprintDomain: A3,
      difficulty: 4,
      references: [IDSA],
      guideline: "Outpatient CAP — penicillin allergy",
      tags: ["CAP", "penicillin-allergy", ...PE],
    }
  ),

  naplexMcq(
    "pharmacy-law",
    "",
    "A patient requests that their remaining oxycodone 5 mg tablets (Schedule II) be transferred from your pharmacy to a sister store 10 miles away because of convenience. The original prescription was filled completely at your location three days ago with 20 tablets remaining. What is the pharmacist's most appropriate action?",
    opts4(
      "Decline the transfer; Schedule II prescriptions cannot be transferred between pharmacies",
      "Process an inter-store transfer using the shared corporate system",
      "Transfer the remaining quantity with a verbal order from the prescriber",
      "Transfer only if the patient signs a controlled-substance log at both stores"
    ),
    "Decline the transfer; Schedule II prescriptions cannot be transferred between pharmacies",
    `Federal law prohibits transfer of Schedule II controlled substance prescriptions between pharmacies (except limited partial-fill rules within the same prescription at one pharmacy). A new prescription is required at the receiving pharmacy. Schedule III–V allow one transfer under specific conditions, but not C-II.`,
    {
      blueprintDomain: A4,
      difficulty: 3,
      references: [DEA],
      guideline: "DEA Schedule II transfer rules",
      tags: ["controlled-substances", "MPJE", ...PE],
    }
  ),

  naplexMcq(
    "pharmacology",
    `A rapid streptococcal antigen test is evaluated in 500 patients with sore throat. Disease prevalence in the tested population is 15%. Test sensitivity is 90% and specificity is 95%.`,
    "What is the positive predictive value (PPV) of the test in this population?",
    opts4("55%", "64%", "76%", "90%"),
    "76%",
    `PPV = TP / (TP + FP). With prevalence 15%, sensitivity 90%, specificity 95%: TP rate = 0.15 × 0.90 = 0.135; FP rate = 0.85 × 0.05 = 0.0425; PPV = 0.135 / (0.135 + 0.0425) ≈ 0.76 (76%). Sensitivity alone (90%) and specificity alone (95%) do not equal PPV, which depends on prevalence.`,
    {
      blueprintDomain: A1,
      difficulty: 3,
      references: [FDA],
      tags: ["biostatistics", "PPV", ...PE],
    }
  ),

  naplexSata(
    "patient-counseling",
    `Your hospital pharmacy is updating policies after a near-miss involving 100 units/mL insulin and 5000 units/mL heparin vials stored near each other.`,
    "Which medication safety strategies align with ISMP high-alert medication recommendations? (Select all that apply.)",
    [
      "Require an independent double-check by a second practitioner before dispensing IV insulin",
      "Store all look-alike/sound-alike (LASA) medications in adjacent bins for efficiency",
      "Physically separate LASA products and use tall-man lettering on labels",
      "Skip barcode scanning during emergencies to save time",
      "Use barcode medication administration scanning at the bedside before administration",
    ],
    [
      "Require an independent double-check by a second practitioner before dispensing IV insulin",
      "Physically separate LASA products and use tall-man lettering on labels",
      "Use barcode medication administration scanning at the bedside before administration",
    ],
    `Insulin is a high-alert medication; independent verification reduces wrong-drug/wrong-dose errors. LASA pairs should be separated, not clustered. Barcode scanning is a core error-reduction strategy and should not be bypassed routinely. Efficiency must not override safety for high-alert meds.`,
    {
      blueprintDomain: A4,
      difficulty: 3,
      references: [ISMP],
      guideline: "ISMP high-alert medication safety",
      tags: ["patient-safety", "LASA", ...PE],
    }
  ),

  naplexCase(
    "endocrine-rx",
    `Chart: P.D., 58 y/o man | T2DM × 12 yr | PMH: ASCVD (MI 2 yr ago), HTN, obesity | A1c 8.4% | Meds: metformin 1000 mg BID, glipizide 10 mg BID, lisinopril, atorvastatin | BMI 34 kg/m² | eGFR 78 mL/min | No hypoglycemia symptoms`,
    "Which change to his diabetes regimen is most appropriate to reduce cardiovascular risk and improve glycemic control?",
    [
      "Add empagliflozin and continue glipizide",
      "Add semaglutide 0.25 mg weekly and discontinue glipizide",
      "Increase glipizide to 15 mg BID",
      "Switch metformin to pioglitazone monotherapy",
    ],
    "Add semaglutide 0.25 mg weekly and discontinue glipizide",
    `In T2DM with established ASCVD, GLP-1 receptor agonists with proven CV benefit (e.g., semaglutide) are preferred add-on therapy. Removing sulfonylurea reduces hypoglycemia risk when intensifying therapy. SGLT2 inhibitors are also appropriate; continuing glipizide adds hypoglycemia without addressing weight/CV outcomes. Pioglitazone monotherapy would worsen control.`,
    {
      blueprintDomain: A3,
      difficulty: 4,
      references: [ADA],
      guideline: "ADA ASCVD — GLP-1 RA preferred",
      tags: ["T2DM", "GLP-1", "ASCVD", ...PE],
    }
  ),

  naplexCalcCase(
    "compounding-calculations",
    `Chart: L.N., 4 y/o, 16 kg child | Dx: acute otitis media | Rx: amoxicillin suspension 400 mg/5 mL | Dose: 90 mg/kg/day divided BID × 10 days`,
    "How many milliliters (mL) of the suspension should be dispensed for the full 10-day course? (Round to the nearest whole number.)",
    "180",
    "mL",
    `Daily dose = 90 mg/kg × 16 kg = 1440 mg/day. Total mg = 1440 × 10 days = 14,400 mg. Concentration = 400 mg/5 mL = 80 mg/mL. Volume = 14,400 mg ÷ 80 mg/mL = 180 mL. Counsel on refrigeration, shaking well, and completing the full course.`,
    {
      blueprintDomain: A1,
      difficulty: 3,
      references: [FDA],
      guideline: "Pediatric amoxicillin dosing calculation",
      tags: ["pediatric-dosing", "amoxicillin", ...PE],
    },
    [
      "Daily mg = 90 × 16 = 1440 mg",
      "Total mg = 1440 × 10 = 14,400 mg",
      "Volume = 14,400 / 400 × 5 mL = 180 mL",
    ]
  ),

  naplexCase(
    "infectious-disease-rx",
    `Chart: C.W., 62 y/o woman | Diffuse large B-cell lymphoma | Cycle 2 R-CHOP completed 10 days ago | Temp 38.9°C (102.0°F) at home | BP 102/64 mm Hg, HR 112/min | ANC 320/mm³ (was 4200 pre-chemo) | No localizing symptoms except fatigue | Lives 90 minutes from oncology clinic`,
    "Which recommendation is most appropriate when she calls the pharmacy after-hours?",
    [
      "Take oral ciprofloxacin 500 mg BID at home and recheck temperature tomorrow",
      "Use acetaminophen only and follow up in clinic in 48 hours if fever persists",
      "Go to the emergency department immediately for evaluation and empiric IV antipseudomonal therapy",
      "Start trimethoprim-sulfamethoxazole DS daily for PCP prophylaxis only",
    ],
    "Go to the emergency department immediately for evaluation and empiric IV antipseudomonal therapy",
    `Fever in a patient on chemotherapy with ANC <500/mm³ (febrile neutropenia) is a medical emergency requiring urgent evaluation and empiric broad-spectrum IV antibiotics (e.g., antipseudomonal β-lactam ± aminoglycoside per institutional protocol). Outpatient oral fluoroquinolone monotherapy is insufficient for high-risk febrile neutropenia. Delay risks sepsis and mortality.`,
    {
      blueprintDomain: A3,
      difficulty: 5,
      references: [IDSA],
      guideline: "Febrile neutropenia — urgent evaluation",
      tags: ["oncology", "febrile-neutropenia", ...PE],
    }
  ),

  naplexCase(
    "cardiovascular-rx",
    `Chart: H.M., 67 y/o man | HFrEF (LVEF 30%) | NYHA class II | On lisinopril 20 mg daily, carvedilol 25 mg BID, furosemide 40 mg daily | K⁺ 4.2 mEq/L, Cr 1.1 mg/dL | BP 118/72 mm Hg | Still dyspneic climbing one flight of stairs`,
    "Which addition to his heart failure regimen is most appropriate, and what monitoring should the pharmacist emphasize?",
    [
      "Add hydralazine-isosorbide and monitor BP only",
      "Add spironolactone 25 mg daily and monitor potassium and creatinine within 1 week",
      "Add ivabradine and monitor heart rate monthly only",
      "Add digoxin 0.25 mg daily without laboratory monitoring",
    ],
    "Add spironolactone 25 mg daily and monitor potassium and creatinine within 1 week",
    `HFrEF GDMT includes MRA (spironolactone/eplerenone) when K⁺ ≤5.0 and eGFR adequate, with close K⁺/Cr monitoring. Hydralazine-nitrate is for specific populations (e.g., African ancestry or ACE-I intolerance). Ivabradine requires elevated HR on max β-blocker. Digoxin needs level and renal monitoring; 0.25 mg may be high in renal impairment.`,
    {
      blueprintDomain: A3,
      difficulty: 4,
      references: [ACCAHA],
      guideline: "HFrEF GDMT — MRA addition",
      tags: ["HFrEF", "spironolactone", ...PE],
    }
  ),

  naplexSata(
    "infectious-disease-rx",
    `Chart: S.G., 34 y/o woman | Splenectomy after MVC trauma 2 weeks ago | Immunization records show she never received Tdap as an adult | No prior pneumococcal, meningococcal, or zoster vaccines documented`,
    "Which vaccines should the pharmacist recommend today per ACIP guidance for asplenic patients? (Select all that apply.)",
    [
      "Pneumococcal conjugate and polysaccharide series per ACIP sequence",
      "Meningococcal ACWY and MenB series",
      "Annual inactivated influenza vaccine when in season",
      "Recombinant zoster vaccine (Shingrix) 2-dose series",
      "Tdap now (Tdap preferred over Td for adults needing tetanus protection)",
    ],
    [
      "Pneumococcal conjugate and polysaccharide series per ACIP sequence",
      "Meningococcal ACWY and MenB series",
      "Recombinant zoster vaccine (Shingrix) 2-dose series",
      "Tdap now (Tdap preferred over Td for adults needing tetanus protection)",
    ],
    `Asplenic patients need enhanced pneumococcal protection (PCV followed by PPSV per ACIP), meningococcal ACWY and MenB vaccines, and Shingrix (even if under 50 due to immunocompromising condition). Tdap is indicated when no prior adult dose is documented. Influenza is recommended broadly but is not unique to asplenia; this SATA focuses on condition-specific requirements including Tdap given chart documentation.`,
    {
      blueprintDomain: A2,
      difficulty: 4,
      references: [ACIP],
      guideline: "ACIP asplenia/hyposplenia immunization",
      tags: ["immunizations", "asplenia", ...PE],
    }
  ),
];
