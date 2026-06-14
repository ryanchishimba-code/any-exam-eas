/**
 * NAPLEX 2025 Content Outline (effective May 1, 2025) — 50 high-yield v2 items.
 * Domains: Area1 12 | Area2 13 | Area3 20 | Area4 3 | Area5 2
 */
import type { EnrichedBankItem } from "./seed-helpers";
import {
  naplexCase,
  naplexConstructed,
  naplexDragDrop,
  naplexExhibit,
  naplexMcq,
  naplexOrdered,
  naplexSata,
} from "./naplex-seed-factory";

const A1 = "naplex-area1-foundations" as const;
const A2 = "naplex-area2-therapeutics" as const;
const A3 = "naplex-area3-treatment-planning" as const;
const A4 = "naplex-area4-safety" as const;
const A5 = "naplex-area5-management" as const;

const FDA = { label: "FDA prescribing information", url: "https://www.fda.gov/drugs" };
const USP795 = { label: "USP <795> Nonsterile Compounding", url: "https://www.usp.org" };
const USP797 = { label: "USP <797> Sterile Compounding", url: "https://www.usp.org" };
const ACIP = { label: "ACIP/CDC immunization guidance", url: "https://www.cdc.gov/vaccines" };
const ISMP = { label: "ISMP High-Alert Medications", url: "https://www.ismp.org" };
const ADA = { label: "ADA Standards of Care in Diabetes", url: "https://diabetesjournals.org/care" };
const GOLD = { label: "GOLD COPD Report", url: "https://goldcopd.org" };
const ACCAHA = { label: "ACC/AHA Heart Failure Guideline", url: "https://www.acc.org" };

export const NAPLEX_QUALITY_V2: EnrichedBankItem[] = [
  // ── Area 1: Foundational Knowledge (12) ──────────────────────────────────
  naplexCase(
    "pharmacokinetics",
    `Chart: M.W., 68 y/o man | INR 4.8 (goal 2–3) | PMH: AFib, CKD stage 3 | Meds: warfarin 5 mg daily, amiodarone 200 mg daily (started 2 wk ago) | CYP2C9 *1/*3, VKORC1 AA`,
    "Which action is most appropriate today?",
    [
      "Hold warfarin; recheck INR in 3–5 days; reduce maintenance dose ~30–50%",
      "Continue warfarin 5 mg; add vitamin K 10 mg PO now",
      "Switch to apixaban 5 mg BID without bridging",
      "Increase warfarin to 7.5 mg daily to offset amiodarone",
    ],
    "Hold warfarin; recheck INR in 3–5 days; reduce maintenance dose ~30–50%",
    "Amiodarone inhibits CYP2C9 and VKORC1 variants increase sensitivity. Expect supratherapeutic INR after amiodarone initiation; hold or reduce warfarin and monitor closely.",
    { blueprintDomain: A1, difficulty: 4, references: [FDA], guideline: "Warfarin–amiodarone interaction" }
  ),

  naplexConstructed(
    "compounding-calculations",
    `Order: D5W 1000 mL + KCl 40 mEq + regular insulin 100 units IV continuous. Pharmacy prepares 250 mL in a 250 mL bag; nurse infuses entire bag over 4 hours.`,
    "At what rate (mL/hr) should the nurse set the infusion pump? (Round to the nearest whole number.)",
    "63",
    "mL/hr",
    "250 mL ÷ 4 h = 62.5 mL/hr → 63 mL/hr when rounded to a whole number per pump programming.",
    { blueprintDomain: A1, references: [FDA], guideline: "IV infusion rate calculation" },
    ["Volume = 250 mL", "Time = 4 hours", "Rate = 250/4 = 62.5 → 63 mL/hr"]
  ),

  naplexMcq(
    "pharmaceutics",
    "",
    "A community pharmacy prepares a nonsterile hydrocortisone 2% topical cream in a standard USP <795> facility. The beyond-use date (BUD) is primarily determined by:",
    [
      "The earliest component expiration date, stability data, and storage conditions per USP <795>",
      "Always 14 days regardless of preparation type",
      "The pharmacist's arbitrary preference if the patient is known",
      "FDA New Drug Application approval date of hydrocortisone",
    ],
    "The earliest component expiration date, stability data, and storage conditions per USP <795>",
    "USP <795> assigns BUDs based on formulation risk, container, storage, and documented stability—not a single fixed interval.",
    { blueprintDomain: A1, references: [USP795] }
  ),

  naplexSata(
    "compounding-calculations",
    `Pharmacy technician asks about preparing cefazolin 2 g in 100 mL NS for OR use in a newly certified cleanroom.`,
    "Which requirements apply to this sterile preparation? (Select all that apply.)",
    [
      "Documented garbing, hand hygiene, and ISO-classified compounding environment per USP <797>",
      "Beyond-use dating per stability and risk level (e.g., Category 1/2/3)",
      "May be prepared on the open countertop in the retail waiting area",
      "Environmental monitoring and visual inspection before release",
      "No need for beyond-use dating if refrigerated",
    ],
    [
      "Documented garbing, hand hygiene, and ISO-classified compounding environment per USP <797>",
      "Beyond-use dating per stability and risk level (e.g., Category 1/2/3)",
      "Environmental monitoring and visual inspection before release",
    ],
    "Sterile compounding requires USP <797> facilities, garbing, BUD assignment, and quality checks. Open retail areas and skipping BUD are unsafe and noncompliant.",
    { blueprintDomain: A1, references: [USP797] }
  ),

  naplexCase(
    "pharmacology",
    `E.R., 34 y/o woman | Rx: levothyroxine 100 mcg daily (generic, A-rated) | Insurance mandates switch to different manufacturer | TSH 8.2 mIU/L (was 1.8 six weeks ago) | Reports taking med fasting`,
    "What is the best pharmacist intervention?",
    [
      "Counsel on consistent brand/generic manufacturer; notify prescriber; recheck TSH in 6–8 weeks",
      "Double dose to 200 mcg until TSH normalizes",
      "Recommend switching to liothyronine monotherapy",
      "Advise taking levothyroxine with breakfast for adherence",
    ],
    "Counsel on consistent brand/generic manufacturer; notify prescriber; recheck TSH in 6–8 weeks",
    "Although A-rated generics are bioequivalent population-level, individual variability after manufacturer switch can alter control; ensure consistency and monitor TSH.",
    { blueprintDomain: A1, difficulty: 3, references: [FDA] }
  ),

  naplexOrdered(
    "pharmaceutics",
    `Outsourced 503B facility ships prefilled syringes of heparin to your hospital pharmacy.`,
    "Place verification steps in the correct order before dispensing to the nursing unit:",
    [
      "Quarantine shipment upon receipt",
      "Verify supplier licensure and certificate of analysis",
      "Inspect labeling, beyond-use date, and storage requirements",
      "Document receipt and release from quarantine per policy",
      "Dispense to unit stock with chain-of-custody documentation",
    ],
    [
      "Quarantine shipment upon receipt",
      "Verify supplier licensure and certificate of analysis",
      "Inspect labeling, beyond-use date, and storage requirements",
      "Document receipt and release from quarantine per policy",
      "Dispense to unit stock with chain-of-custody documentation",
    ],
    "Quarantine first, verify vendor and product integrity, then document release—standard outsourced compounding receipt workflow.",
    { blueprintDomain: A1, references: [USP797] }
  ),

  naplexMcq(
    "pharmacokinetics",
    "",
    "Rifampin is added to a regimen containing oral contraceptives. The primary pharmacokinetic mechanism increasing contraceptive failure risk is:",
    [
      "Strong induction of CYP3A4 increasing estrogen/progestin metabolism",
      "Competitive inhibition of CYP2D6",
      "Reduced renal clearance via tubular secretion blockade",
      "Inhibition of P-glycoprotein at the blood–brain barrier only",
    ],
    "Strong induction of CYP3A4 increasing estrogen/progestin metabolism",
    "Rifampin is a potent CYP3A4 inducer, lowering hormone levels and efficacy of combined hormonal contraception.",
    { blueprintDomain: A1, references: [FDA] }
  ),

  naplexExhibit(
    "pharmacokinetics",
    `J.T., 72 y/o woman, 60 kg | SCr 1.6 mg/dL (stable) | For vancomycin dosing estimate`,
    "Using Cockcroft–Gault (female), which estimated creatinine clearance (mL/min) is closest?",
    {
      headers: ["Variable", "Value"],
      rows: [
        ["Age", "72 years"],
        ["Weight", "60 kg"],
        ["Serum creatinine", "1.6 mg/dL"],
        ["Sex", "Female"],
      ],
    },
    [
      "28 mL/min",
      "38 mL/min",
      "48 mL/min",
      "58 mL/min",
    ],
    "38 mL/min",
    "CrCl = [(140−72)×60]/(72×1.6) × 0.85 ≈ 37.9 → 38 mL/min. Guides initial vancomycin dosing and monitoring.",
    { blueprintDomain: A1, references: [FDA] }
  ),

  naplexCase(
    "pharmaceutics",
    `PN order for home infusion: amino acids + dextrose + lipids. Patient reports room temperature storage overnight during power outage.`,
    "Which concern is most critical regarding the lipid emulsion?",
    [
      "Lipid emulsion instability/separation increasing risk of fat emboli if infused",
      "Immediate hyperkalemia from dextrose crystallization",
      "Loss of all protein content rendering amino acids inactive",
      "Mandatory conversion to oral nutrition without evaluation",
    ],
    "Lipid emulsion instability/separation increasing risk of fat emboli if infused",
    "Lipid emulsions require controlled storage; temperature excursions can cause cracking/separation with embolism risk—quarantine and contact manufacturer/supplier.",
    { blueprintDomain: A1, difficulty: 4, references: [FDA] }
  ),

  naplexDragDrop(
    "pharmacology",
    "",
    "Match each dosage form to its most appropriate primary route:",
    [
      { prompt: "Nitroglycerin sublingual tablet", match: "Sublingual" },
      { prompt: "Metformin ER tablet", match: "Oral" },
      { prompt: "Albuterol HFA inhaler", match: "Inhalation" },
      { prompt: "Hydrocortisone 1% cream", match: "Topical" },
    ],
    ["Transdermal", "Intravenous bolus"],
    "Each formulation targets optimal absorption site: SL for rapid NTG, oral ER for metformin, inhalation for bronchodilation, topical for local dermatologic effect.",
    { blueprintDomain: A1 }
  ),

  naplexCase(
    "pharmacology",
    `L.K., 28 y/o pregnant woman (12 wk GA) | UTI symptoms | PMH: none | Allergy: NKDA | Current meds: prenatal vitamins`,
    "Which empiric antibiotic choice is generally most appropriate pending culture?",
    [
      "Nitrofurantoin (avoid near term/delivery)",
      "Trimethoprim–sulfamethoxazole in 1st trimester",
      "Doxycycline",
      "Ciprofloxacin routine first-line",
    ],
    "Nitrofurantoin (avoid near term/delivery)",
    "Nitrofurantoin is commonly used in 2nd/early 3rd trimester for uncomplicated cystitis; avoid TMP-SMX in 1st trimester and fluoroquinolones/tetracyclines in pregnancy.",
    { blueprintDomain: A1, difficulty: 4, references: [FDA] }
  ),

  naplexConstructed(
    "compounding-calculations",
    `Rx: amoxicillin suspension 400 mg/5 mL. Sig: 45 mg/kg/day PO divided BID. Child weighs 18 kg.`,
    "How many milliliters (mL) should be dispensed for a 10-day supply? (Round to the nearest whole mL.)",
    "101",
    "mL",
    "Daily dose = 45 mg/kg × 18 kg = 810 mg/day. Each BID dose = 405 mg → 405/400 × 5 mL = 5.06 mL per dose. Twenty doses in 10 days ≈ 101 mL total.",
    { blueprintDomain: A1, references: [FDA] },
    [
      "810 mg/day total",
      "405 mg per BID dose",
      "5.06 mL per dose × 20 doses ≈ 101 mL",
    ]
  ),

  // ── Area 2: Medication Use Process (13) ──────────────────────────────────
  naplexCase(
    "pharmacology",
    `D.M., 55 y/o man | QTc 512 ms on ECG | Meds: fluconazole 400 mg daily (day 3), ondansetron PRN, citalopram 40 mg daily | K+ 3.2 mEq/L`,
    "Which intervention is highest priority?",
    [
      "Hold citalopram and fluconazole; correct hypokalemia; review QT-prolonging agents",
      "Increase citalopram to 60 mg for depression control",
      "Add azithromycin for atypical coverage",
      "Continue all meds; repeat ECG in one month",
    ],
    "Hold citalopram and fluconazole; correct hypokalemia; review QT-prolonging agents",
    "Multiple QT-prolonging agents plus hypokalemia substantially raise torsades risk; discontinue nonessential offenders and replete potassium.",
    { blueprintDomain: A2, difficulty: 5, references: [FDA] }
  ),

  naplexSata(
    "patient-counseling",
    `R.S., 70 y/o woman asks about Shingrix after completing chemotherapy 3 months ago.`,
    "Which counseling points are appropriate? (Select all that apply.)",
    [
      "Recombinant (non-live) vaccine preferred over live zoster vaccine in immunocompromised patients",
      "Two-dose series IM, typically 2–6 months apart",
      "May administer per ACIP if immune function deemed adequate by treating clinician",
      "Contraindicated in all patients ever receiving chemotherapy",
      "Provides 100% lifetime immunity after dose 1",
    ],
    [
      "Recombinant (non-live) vaccine preferred over live zoster vaccine in immunocompromised patients",
      "Two-dose series IM, typically 2–6 months apart",
      "May administer per ACIP if immune function deemed adequate by treating clinician",
    ],
    "Shingrix is non-live and often appropriate after immunosuppression resolves per clinician judgment; it is a 2-dose series, not lifelong after one dose.",
    { blueprintDomain: A2, references: [ACIP] }
  ),

  naplexOrdered(
    "pharmacology",
    `Hospital discharge for heart failure patient with 12 home medications.`,
    "Order medication reconciliation steps from first to last:",
    [
      "Obtain best possible medication history (BPMH)",
      "Compare BPMH to discharge orders and resolve discrepancies",
      "Provide patient/caregiver medication list and counseling",
      "Communicate finalized list to community pharmacy and PCP",
      "Document reconciliation in the medical record",
    ],
    [
      "Obtain best possible medication history (BPMH)",
      "Compare BPMH to discharge orders and resolve discrepancies",
      "Provide patient/caregiver medication list and counseling",
      "Communicate finalized list to community pharmacy and PCP",
      "Document reconciliation in the medical record",
    ],
    "Med rec begins with accurate history, resolves discrepancies, educates the patient, communicates across transitions, and documents—Joint Commission core activity.",
    { blueprintDomain: A2 }
  ),

  naplexCase(
    "pharmacology",
    `MTM visit: A.B., 62 y/o | T2DM, HTN, hyperlipidemia | A1c 9.1%, BP 148/92, LDL 142 | Meds: metformin 1 g BID, glipizide 10 mg BID, lisinopril 20 mg, atorvastatin 20 mg`,
    "Which MTM recommendation is most aligned with comprehensive care?",
    [
      "Recommend SGLT2 inhibitor or GLP-1 RA with cardiorenal benefit; uptitrate statin; assess hypoglycemia risk from sulfonylurea",
      "Add second sulfonylurea for A1c",
      "Discontinue metformin due to A1c > 9%",
      "Stop atorvastatin to reduce pill burden",
    ],
    "Recommend SGLT2 inhibitor or GLP-1 RA with cardiorenal benefit; uptitrate statin; assess hypoglycemia risk from sulfonylurea",
    "Uncontrolled T2DM with CV risk warrants therapy intensification per ADA (GLP-1 RA/SGLT2i), statin optimization, and sulfonylurea hypoglycemia counseling.",
    { blueprintDomain: A2, references: [ADA] }
  ),

  naplexMcq(
    "pharmacology",
    "",
    "A prescriber calls for iPLEDGE-compliant isotretinoin dispensing. The pharmacist must verify:",
    [
      "Active enrollment, negative pregnancy test windows, contraception counseling, and REMS authorization before each fill",
      "Only that the patient is ≥ 18 years old",
      "A single pregnancy test at therapy start only",
      "Pharmacy intern may bypass documentation if urgent",
    ],
    "Active enrollment, negative pregnancy test windows, contraception counseling, and REMS authorization before each fill",
    "Isotretinoin REMS (iPLEDGE) requires program enrollment, pregnancy prevention, and verified authorization each dispensing cycle.",
    { blueprintDomain: A2, references: [FDA] }
  ),

  naplexCase(
    "infectious-disease-rx",
    `ICU: vancomycin 1 g q12h × 4 days | SCr rose 1.0 → 1.8 mg/dL | trough 28 mcg/mL | organism MRSA bacteremia`,
    "What is the best pharmacist recommendation?",
    [
      "Extend interval or reduce dose; recheck trough/SCr; target AUC/MIC where feasible",
      "Continue 1 g q12h; trough 28 is therapeutic",
      "Switch to oral linezolid immediately without susceptibility review",
      "Add gentamicin synergy routinely",
    ],
    "Extend interval or reduce dose; recheck trough/SCr; target AUC/MIC where feasible",
    "Trough 28 mcg/mL with rising SCr suggests toxicity risk; adjust dosing and monitor per institutional PK protocol.",
    { blueprintDomain: A2, difficulty: 4, references: [FDA] }
  ),

  naplexConstructed(
    "pharmacokinetics",
    `Gentamicin 5 mg/kg IV once daily. Patient weight 80 kg. Pharmacy supplies 80 mg/mL concentration.`,
    "What volume (mL) should be drawn for the dose? (Round to one decimal place.)",
    "5.0",
    "mL",
    "Dose = 5 mg/kg × 80 kg = 400 mg. Volume = 400 mg ÷ 80 mg/mL = 5.0 mL.",
    { blueprintDomain: A2, references: [FDA] },
    ["400 mg total dose", "400 ÷ 80 = 5.0 mL"]
  ),

  naplexDragDrop(
    "pharmacology",
    "",
    "Match each drug pair to the interaction mechanism:",
    [
      { prompt: "Carbamazepine + oral contraceptive", match: "CYP3A4 induction" },
      { prompt: "Potassium-sparing diuretic + ACE inhibitor", match: "Hyperkalemia risk" },
      { prompt: "MAOI + meperidine", match: "Serotonin syndrome" },
      { prompt: "Warfarin + NSAID", match: "GI bleed + INR elevation" },
    ],
    ["Competitive renal tubular antagonism of penicillin", "Beta-blockade unopposed alpha"],
    "Each pair reflects classic high-risk interaction mechanisms tested on NAPLEX.",
    { blueprintDomain: A2, references: [FDA] }
  ),

  naplexMcq(
    "pharmacology",
    `Patient picking up extended-release oxycodone. State law requires consultation.`,
    "Which opioid safety counseling is most essential?",
    [
      "Risks of respiratory depression, avoid alcohol/benzodiazepines, naloxone access, safe storage/disposal",
      "Take extra dose if pain score is 1/10",
      "Crush tablets if swallowing difficulty",
      "Share unused tablets with family member with pain",
    ],
    "Risks of respiratory depression, avoid alcohol/benzodiazepines, naloxone access, safe storage/disposal",
    "Opioid REMS-aligned counseling emphasizes respiratory risk, concomitant CNS depressants, naloxone, and misuse prevention.",
    { blueprintDomain: A2, references: [FDA] }
  ),

  naplexSata(
    "pharmacology",
    `Community pharmacist final verification before release to patient.`,
    "Which actions reduce dispensing errors? (Select all that apply.)",
    [
      "Barcode or NDC verification against prescription",
      "Prospective drug utilization review for interactions/dose",
      "Use tall-man lettering for look-alike/sound-alike names",
      "Skip counseling for chronic refills to save time",
      "Independent double-check for high-alert medications when policy requires",
    ],
    [
      "Barcode or NDC verification against prescription",
      "Prospective drug utilization review for interactions/dose",
      "Use tall-man lettering for look-alike/sound-alike names",
      "Independent double-check for high-alert medications when policy requires",
    ],
    "Verification, DUR, LASA precautions, and high-alert double-checks are core dispensing safety; skipping counseling increases risk.",
    { blueprintDomain: A2, references: [ISMP] }
  ),

  naplexCase(
    "endocrine-rx",
    `T1DM patient requests insulin pump supplies. A1c 7.4%. Reports frequent 3 AM hypoglycemia on basal-bolus MDI.`,
    "Which recommendation is most appropriate?",
    [
      "Discuss CGM integration and basal rate adjustment; ensure pump training and sick-day rules",
      "Stop all basal insulin when starting pump",
      "Recommend pump only if A1c > 10%",
      "Switch to sulfonylurea to reduce nocturnal lows",
    ],
    "Discuss CGM integration and basal rate adjustment; ensure pump training and sick-day rules",
    "Pump therapy with CGM can address nocturnal hypoglycemia via basal tailoring; requires structured education and continued basal delivery.",
    { blueprintDomain: A2, references: [ADA] }
  ),

  naplexOrdered(
    "pharmacology",
    `New high-alert medication policy for neuromuscular blockers in pharmacy.`,
    "Order implementation steps:",
    [
      "Identify high-alert products per ISMP list",
      "Define independent double-check workflow",
      "Train staff and post auxiliary labels",
      "Audit compliance quarterly",
      "Update electronic alerts in dispensing software",
    ],
    [
      "Identify high-alert products per ISMP list",
      "Define independent double-check workflow",
      "Update electronic alerts in dispensing software",
      "Train staff and post auxiliary labels",
      "Audit compliance quarterly",
    ],
    "Identify → engineer workflow/alerts → train → audit is a standard medication safety implementation sequence.",
    { blueprintDomain: A2, references: [ISMP] }
  ),

  naplexExhibit(
    "pharmacology",
    `Patient on aminoglycoside therapy — pharmacist reviews levels`,
    "Based on the exhibit, which dosing adjustment is most appropriate?",
    {
      headers: ["Time", "Level", "Reference"],
      rows: [
        ["Peak (30 min post-dose)", "38 mcg/mL", "Target peak 30–40 (indicative)"],
        ["Trough (pre-dose)", "2.8 mcg/mL", "Target trough < 1 for extended interval"],
        ["SCr", "Stable", "—"],
      ],
    },
    [
      "Extend interval; trough elevated for once-daily strategy",
      "Increase dose to raise trough to 5 mcg/mL",
      "No change; both values optimal",
      "Switch to TID dosing without levels",
    ],
    "Extend interval; trough elevated for once-daily strategy",
    "Elevated trough with acceptable peak suggests accumulation; extend interval or reduce dose while monitoring renal function.",
    { blueprintDomain: A2, references: [FDA] }
  ),

  // ── Area 3: Person-Centered Treatment Planning (20) ──────────────────────
  naplexCase(
    "cardiovascular-rx",
    `H.F., 66 y/o man | HFrEF EF 30% | BP 102/64 | HR 88 | SCr 1.4 | K+ 4.3 | Meds: lisinopril 10 mg, metoprolol succinate 50 mg, furosemide 40 mg BID | Still dyspneic climbing stairs`,
    "Which add-on is most guideline-concordant if BP tolerates?",
    [
      "Initiate spironolactone (eplerenone if hyperkalemia concern) with K+/SCr monitoring",
      "Add nondihydropyridine CCB",
      "Start thiazolidinedione",
      "Discontinue ACE inhibitor to allow vasodilator",
    ],
    "Initiate spironolactone (eplerenone if hyperkalemia concern) with K+/SCr monitoring",
    "ACC/AHA HF guideline recommends MRA in symptomatic HFrEF on ACEi/ARB + beta-blocker with monitoring of potassium and renal function.",
    { blueprintDomain: A3, difficulty: 4, references: [ACCAHA] }
  ),

  naplexCase(
    "endocrine-rx",
    `S.P., 45 y/o woman | BMI 34 | New T2DM | A1c 8.0% | ASCVD risk elevated | eGFR 72 | No heart failure`,
    "Which initial pharmacotherapy best addresses glycemic and cardiometabolic goals?",
    [
      "Metformin plus GLP-1 RA with demonstrated CV benefit",
      "Basal insulin as first-line",
      "Sulfonylurea monotherapy",
      "Pioglitazone monotherapy",
    ],
    "Metformin plus GLP-1 RA with demonstrated CV benefit",
    "ADA recommends metformin first-line plus GLP-1 RA or SGLT2i when ASCVD/CKD/HF comorbidity exists.",
    { blueprintDomain: A3, references: [ADA] }
  ),

  naplexSata(
    "cardiovascular-rx",
    `Atrial fibrillation stroke prevention consult | CHA₂DS₂-VASc 3 | HAS-BLED 2 | Age 74 | on omeprazole for GERD`,
    "Which statements about anticoagulation are correct? (Select all that apply.)",
    [
      "Oral anticoagulation is generally indicated for stroke prevention with CHA₂DS₂-VASc ≥ 2 in men",
      "Apixaban dose reduction may apply if ≥ 2 of: age ≥ 80, weight ≤ 60 kg, SCr ≥ 1.5",
      "Aspirin 81 mg alone is preferred over anticoagulation",
      "Bleeding risk warrants monitoring, not automatic omission of anticoagulation in most",
      "Dabigatran requires renal dose adjustment at lower GFR",
    ],
    [
      "Oral anticoagulation is generally indicated for stroke prevention with CHA₂DS₂-VASc ≥ 2 in men",
      "Apixaban dose reduction may apply if ≥ 2 of: age ≥ 80, weight ≤ 60 kg, SCr ≥ 1.5",
      "Bleeding risk warrants monitoring, not automatic omission of anticoagulation in most",
      "Dabigatran requires renal dose adjustment at lower GFR",
    ],
    "Stroke prevention favors anticoagulation when indicated; HAS-BLED informs monitoring. DOAC dosing depends on age, weight, and renal function.",
    { blueprintDomain: A3, references: [ACCAHA] }
  ),

  naplexCase(
    "infectious-disease-rx",
    `Outpatient: 22 y/o woman | dysuria, frequency | No fever/flank pain | Not pregnant | No sulfa allergy | PMH: UTI × 2 this year`,
    "Best empiric therapy for uncomplicated cystitis?",
    [
      "Nitrofurantoin macrocrystals 100 mg BID × 5 days",
      "Ciprofloxacin 500 mg BID × 7 days first-line",
      "IV ceftriaxone",
      "Metronidazole 500 mg TID",
    ],
    "Nitrofurantoin macrocrystals 100 mg BID × 5 days",
    "IDSA/UTI guidelines favor nitrofurantoin, TMP-SMX, or fosfomycin; fluoroquinolones reserved for resistance or intolerance.",
    { blueprintDomain: A3, references: [FDA] }
  ),

  naplexCase(
    "cns-rx",
    `M.T., 29 y/o man | MDD partial response | On sertraline 150 mg × 8 wk | PHQ-9 still 14 | No mania, no substance use`,
    "Most appropriate next step?",
    [
      "Augment with bupropion or switch per shared decision-making; assess adherence and adverse effects",
      "Stop sertraline; start clozapine",
      "Add MAOI without washout",
      "Double sertraline to 300 mg immediately",
    ],
    "Augment with bupropion or switch per shared decision-making; assess adherence and adverse effects",
    "Partial SSRI response warrants adherence review then augmentation/switch per APA guidelines; avoid unsafe combinations.",
    { blueprintDomain: A3 }
  ),

  naplexConstructed(
    "compounding-calculations",
    `Pediatric liquid: dose 0.3 mEq/kg of elemental calcium. Child 10 kg. Product: calcium gluconate 10% (0.465 mEq Ca²⁺/mL).`,
    "How many mL provide the single dose? (Round to one decimal.)",
    "6.5",
    "mL",
    "Elemental need = 0.3 mEq/kg × 10 kg = 3 mEq. Volume = 3 ÷ 0.465 ≈ 6.45 → 6.5 mL.",
    { blueprintDomain: A3, references: [FDA] },
    ["3 mEq needed", "3 / 0.465 = 6.45 mL"]
  ),

  naplexCase(
    "cardiovascular-rx",
    `COPD GOLD D | FEV₁ 38% | 2 exacerbations last year | on LAMA monotherapy | still breathless daily`,
    "Which step-up is most appropriate?",
    [
      "Add LABA (or LABA/LAMA if not on combo); consider ICS if eosinophils elevated/frequent exacerbations",
      "Oral prednisone daily maintenance",
      "Stop bronchodilator; start benzonatate only",
      "High-dose systemic beta-blocker for HR control",
    ],
    "Add LABA (or LABA/LAMA if not on combo); consider ICS if eosinophils elevated/frequent exacerbations",
    "GOLD recommends bronchodilator escalation (LAMA+LABA) before ICS; ICS added selectively for exacerbation phenotype.",
    { blueprintDomain: A3, references: [GOLD] }
  ),

  naplexSata(
    "patient-counseling",
    `Newly diagnosed HIV patient starting Biktarvy (BIC/TAF/FTC).`,
    "Which counseling points apply? (Select all that apply.)",
    [
      "Take one tablet daily with or without food",
      "Do not miss doses — resistance can develop",
      "Review drug interactions (e.g., rifampin, certain supplements)",
      "Safe to stop when viral load undetectable for 1 week",
      "Renal/hepatic monitoring per guideline",
    ],
    [
      "Take one tablet daily with or without food",
      "Do not miss doses — resistance can develop",
      "Review drug interactions (e.g., rifampin, certain supplements)",
      "Renal/hepatic monitoring per guideline",
    ],
    "ART requires high adherence; stopping early risks resistance. Biktarvy is once daily; monitor organ function and interactions.",
    { blueprintDomain: A3, references: [FDA] }
  ),

  naplexCase(
    "infectious-disease-rx",
    `Hospital: febrile neutropenia | ANC 200 | empiric piperacillin–tazobactam started | day 2 still febrile`,
    "Best pharmacist recommendation?",
    [
      "Assess culture data, fungal coverage need, vancomycin indication, and local antibiogram per IDSA febrile neutropenia guidance",
      "Discontinue all antibiotics if afebrile 4 hours",
      "Switch to oral amoxicillin",
      "Add metronidazole for all patients routinely",
    ],
    "Assess culture data, fungal coverage need, vancomycin indication, and local antibiogram per IDSA febrile neutropenia guidance",
    "Persistent fever in neutropenia requires reassessment of spectrum, resistant organisms, and fungal coverage—not premature de-escalation.",
    { blueprintDomain: A3, difficulty: 4 }
  ),

  naplexOrdered(
    "patient-counseling",
    `Pharmacist-led inhaler technique teach-back for new asthma patient.`,
    "Order the counseling sequence from first to last:",
    [
      "Assess current technique and adherence barriers",
      "Demonstrate priming, actuation, and spacer use if applicable",
      "Have patient return-demonstration",
      "Provide written action plan and when to seek care",
      "Document technique and schedule follow-up",
    ],
    [
      "Assess current technique and adherence barriers",
      "Demonstrate priming, actuation, and spacer use if applicable",
      "Have patient return-demonstration",
      "Provide written action plan and when to seek care",
      "Document technique and schedule follow-up",
    ],
    "Assess → demonstrate → teach-back → action plan → document mirrors effective inhaler counseling; return-demonstration confirms technique before documenting and follow-up.",
    { blueprintDomain: A3 }
  ),

  naplexCase(
    "endocrine-rx",
    `Graves disease on methimazole 10 mg daily | TSH 0.01 | FT4 elevated | 6 wk pregnant (unplanned)`,
    "Most appropriate recommendation to prescriber?",
    [
      "Switch to propylthiouracil in 1st trimester per guideline; plan postpartum switch; monitor liver/thyroid",
      "Continue methimazole — safest in 1st trimester",
      "Stop all antithyroid drugs immediately",
      "Add levothyroxine to suppress TSH only",
    ],
    "Switch to propylthiouracil in 1st trimester per guideline; plan postpartum switch; monitor liver/thyroid",
    "PTU preferred in 1st trimester due to methimazole teratogenicity signal; MMI often used after 1st trimester.",
    { blueprintDomain: A3, difficulty: 5, references: [FDA] }
  ),

  naplexMcq(
    "otc-self-care",
    `Parent asks for pediatric cough/cold OTC for 4-year-old with runny nose only.`,
    "Best pharmacist response?",
    [
      "Avoid cough/cold combination products in children < 6 years; recommend humidification, hydration, saline",
      "Recommend adult formulation at half dose",
      "Dispense codeine-containing syrup PRN",
      "Combine first-generation antihistamine + decongestant routinely",
    ],
    "Avoid cough/cold combination products in children < 6 years; recommend humidification, hydration, saline",
    "FDA/public health guidance discourages OTC cough/cold in young children due to safety concerns; non-drug measures preferred.",
    { blueprintDomain: A3, references: [FDA] }
  ),

  naplexCase(
    "cardiovascular-rx",
    `Post-MI patient | LDL 118 on atorvastatin 40 mg | ASCVD very high risk | tolerating therapy`,
    "Best lipid management plan?",
    [
      "Intensify to high-intensity statin (e.g., atorvastatin 80 or add ezetimibe) targeting ≥ 50% LDL reduction",
      "Stop statin; use fish oil only",
      "Switch to low-intensity statin for tolerability without LDL check",
      "Defer therapy 12 months",
    ],
    "Intensify to high-intensity statin (e.g., atorvastatin 80 or add ezetimibe) targeting ≥ 50% LDL reduction",
    "Very high-risk ASCVD warrants high-intensity statin and ≥50% LDL reduction per ACC/AHA cholesterol guideline.",
    { blueprintDomain: A3, references: [ACCAHA] }
  ),

  naplexSata(
    "infectious-disease-rx",
    `Community pharmacist: patient on warfarin needs antibiotic for dental prophylaxis discussion.`,
    "Which antibiotics warrant extra INR monitoring when combined with warfarin? (Select all that apply.)",
    [
      "Metronidazole",
      "Trimethoprim–sulfamethoxazole",
      "Azithromycin (no interaction ever)",
      "Fluconazole",
      "Cephalexin (always doubles INR)",
    ],
    ["Metronidazole", "Trimethoprim–sulfamethoxazole", "Fluconazole"],
    "Macrolides/azoles and TMP-SMX inhibit warfarin metabolism; monitor INR and counsel on bleeding signs.",
    { blueprintDomain: A3, references: [FDA] }
  ),

  naplexCase(
    "cns-rx",
    `Epilepsy: breakthrough seizures on valproate 500 mg BID | level 95 mcg/mL (high) | platelets 98k | tremor`,
    "Best recommendation?",
    [
      "Reduce valproate dose; evaluate alternative AED; monitor CBC/LFTs",
      "Increase valproate for better control",
      "Add aspirin for thrombocytopenia",
      "Discontinue without taper and stop monitoring",
    ],
    "Reduce valproate dose; evaluate alternative AED; monitor CBC/LFTs",
    "Supratherapeutic valproate with thrombocytopenia and tremor signals toxicity; dose reduction and alternative AED per neurology plan.",
    { blueprintDomain: A3 }
  ),

  naplexExhibit(
    "endocrine-rx",
    `Diabetes intensification visit`,
    "Using the lab table, which adjustment is most appropriate?",
    {
      headers: ["Test", "Result", "Goal"],
      rows: [
        ["A1c", "8.9%", "< 7% individual goal"],
        ["Fasting glucose", "186 mg/dL", "80–130"],
        ["eGFR", "48 mL/min", "—"],
        ["Current", "Glipizide 10 mg BID", "—"],
      ],
    },
    [
      "Deprescribe sulfonylurea; start SGLT2i with HF/CKD benefit if appropriate",
      "Increase glipizide to 20 mg BID",
      "Add sliding-scale insulin only at bedtime",
      "No change until A1c > 10%",
    ],
    "Deprescribe sulfonylurea; start SGLT2i with HF/CKD benefit if appropriate",
    "CKD + hypoglycemia risk from sulfonylurea favors deprescribing and SGLT2i per ADA CKD recommendations.",
    { blueprintDomain: A3, references: [ADA] }
  ),

  naplexCase(
    "patient-counseling",
    `Elderly patient (82 y) on 14 medications reports dizziness and one fall last week.`,
    "Highest priority pharmacist assessment?",
    [
      "Screen for fall-risk meds (benzodiazepines, opioids, anticholinergics) and orthostasis; recommend deprescribing review",
      "Recommend doubling antihypertensive for stricter control",
      "Dispense calcium only",
      "Ignore — falls are normal at this age",
    ],
    "Screen for fall-risk meds (benzodiazepines, opioids, anticholinergics) and orthostasis; recommend deprescribing review",
    "Beers/STOPP criteria and fall-risk medication review are cornerstone geriatric pharmacist interventions.",
    { blueprintDomain: A3 }
  ),

  naplexSata(
    "cardiovascular-rx",
    `BP 158/96 despite lifestyle | no CKD | no diabetes | 52 y/o man`,
    "Which initial antihypertensive approaches are guideline-supported? (Select all that apply.)",
    [
      "Thiazide-type diuretic",
      "ACE inhibitor or ARB",
      "Calcium channel blocker",
      "Combine two first-line agents at low dose if BP far from goal",
      "Clonidine patch first-line monotherapy routinely",
    ],
    [
      "Thiazide-type diuretic",
      "ACE inhibitor or ARB",
      "Calcium channel blocker",
      "Combine two first-line agents at low dose if BP far from goal",
    ],
    "ACC/AHA supports thiazide, ACEi/ARB, or CCB as first-line; initial combination reasonable when BP markedly elevated.",
    { blueprintDomain: A3, references: [ACCAHA] }
  ),

  naplexCase(
    "patient-counseling",
    `Transgender woman starting estradiol + spironolactone. Smokes 10 cigarettes/day.`,
    "Priority safety counseling?",
    [
      "Smoking cessation — VTE/CV risk with estrogen; monitor potassium on spironolactone",
      "Encourage smoking to manage stress",
      "No monitoring needed for potassium",
      "Avoid all blood pressure checks",
    ],
    "Smoking cessation — VTE/CV risk with estrogen; monitor potassium on spironolactone",
    "Estrogen therapy plus smoking elevates thrombotic risk; spironolactone requires potassium and renal monitoring.",
    { blueprintDomain: A3 }
  ),

  naplexConstructed(
    "compounding-calculations",
    `TPN: patient needs 25 mEq potassium chloride in 500 mL bag. Stock vial: KCl 2 mEq/mL.`,
    "How many mL of KCl stock are needed? (Round to one decimal.)",
    "12.5",
    "mL",
    "25 mEq ÷ 2 mEq/mL = 12.5 mL. Verify osmolarity and line compatibility before admixture.",
    { blueprintDomain: A3, references: [USP797] },
    ["25 mEq total", "2 mEq/mL stock → 12.5 mL"]
  ),

  // ── Area 4: Professional Practice (3) ────────────────────────────────────
  naplexCase(
    "pharmacy-law",
    `Technician asks you to look up a neighbor's pickup history to see if they picked up antidepressants.`,
    "Most appropriate response?",
    [
      "Decline — HIPAA minimum necessary; access only for professional dispensing need",
      "Provide information since they are a neighbor",
      "Post pickup status on social media without names",
      "Ask technician to access remotely from home network without VPN",
    ],
    "Decline — HIPAA minimum necessary; access only for professional dispensing need",
    "HIPAA limits PHI use to treatment/payment/operations; curiosity about neighbors is prohibited access.",
    { blueprintDomain: A4 }
  ),

  naplexSata(
    "pharmacy-law",
    `Medication error: wrong strength dispensed; patient took one dose; no harm observed.`,
    "Which actions align with professional practice? (Select all that apply.)",
    [
      "Notify patient and prescriber; offer corrective supply",
      "Document internal incident report per policy",
      "Report to ISMP/MEDMAR if required by institution",
      "Conceal error to avoid liability",
      "Perform root cause analysis to prevent recurrence",
    ],
    [
      "Notify patient and prescriber; offer corrective supply",
      "Document internal incident report per policy",
      "Report to ISMP/MEDMAR if required by institution",
      "Perform root cause analysis to prevent recurrence",
    ],
    "Transparent disclosure, documentation, reporting systems, and RCA are standard patient safety practice.",
    { blueprintDomain: A4, references: [ISMP] }
  ),

  naplexMcq(
    "pharmacy-law",
    "",
    "A pharmacist discovers a colleague diverting controlled substances. The FIRST professional obligation is to:",
    [
      "Report per workplace policy and applicable law; ensure patient safety",
      "Confront publicly on social media",
      "Ignore unless diversion exceeds 100 tablets",
      "Join diversion to balance inventory",
    ],
    "Report per workplace policy and applicable law; ensure patient safety",
    "Suspected diversion mandates reporting through proper channels to protect patients and meet regulatory duties.",
    { blueprintDomain: A4 }
  ),

  // ── Area 5: Management & Leadership (2) ──────────────────────────────────
  naplexMcq(
    "pharmacy-law",
    `Inventory analysis: fast movers stock out weekly; slow movers expire on shelf.`,
    "Which inventory method best addresses both issues?",
    [
      "Implement periodic ABC analysis with adjusted par levels and automated reorder points",
      "Order equal quantities of all SKUs monthly",
      "Discontinue all slow movers without prescriber notification",
      "Eliminate cycle counts to save labor",
    ],
    "Implement periodic ABC analysis with adjusted par levels and automated reorder points",
    "ABC classification optimizes capital and shelf life by aligning par levels with utilization velocity.",
    { blueprintDomain: A5 }
  ),

  naplexCase(
    "patient-counseling",
    `You precept a student who bypassed PPI counseling on a high-risk polypharmacy patient to save time.`,
    "Best preceptor response?",
    [
      "Debrief on patient safety impact; require remedial counseling with teach-back; document competency gap",
      "Ignore — counseling is optional",
      "Publicly reprimand in waiting area",
      "Revoke internship immediately without discussion",
    ],
    "Debrief on patient safety impact; require remedial counseling with teach-back; document competency gap",
    "Precepting balances accountability with education: immediate feedback, remediation, and documented competency assessment.",
    { blueprintDomain: A5 }
  ),
];