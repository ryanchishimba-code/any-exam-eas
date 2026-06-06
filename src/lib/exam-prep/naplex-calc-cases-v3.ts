/**
 * NAPLEX v3 — 20 calculation-heavy case vignettes (constructed response).
 */
import type { EnrichedBankItem } from "./seed-helpers";
import { naplexCalcCase } from "./naplex-seed-factory";

const A1 = "naplex-area1-foundations" as const;
const A2 = "naplex-area2-therapeutics" as const;
const A3 = "naplex-area3-treatment-planning" as const;

const FDA = { label: "FDA prescribing information", url: "https://www.fda.gov/drugs" };
const USP797 = { label: "USP <797> Sterile Compounding", url: "https://www.usp.org" };
const ADA = { label: "ADA Standards of Care in Diabetes", url: "https://diabetesjournals.org/care" };

export const NAPLEX_CALC_CASES_V3: EnrichedBankItem[] = [
  naplexCalcCase(
    "compounding-calculations",
    `NICU | Dopamine 7 mcg/kg/min IV | Neonate 4 kg | Bag: 200 mg/250 mL D5W (800 mcg/mL)`,
    "What infusion rate (mL/hr) delivers the ordered dose? (Round to nearest whole number.)",
    "2",
    "mL/hr",
    "7 mcg/kg/min × 4 kg = 28 mcg/min = 1,680 mcg/hr. Rate = 1,680 ÷ 800 = 2.1 → 2 mL/hr.",
    { blueprintDomain: A1, references: [FDA], difficulty: 5 },
    ["28 mcg/min", "1,680 mcg/hr", "÷ 800 mcg/mL = 2.1 mL/hr"]
  ),

  naplexCalcCase(
    "pharmacokinetics",
    `J.R., 70 y/o man | SCr 2.4 mg/dL | Weight 75 kg | Cockcroft–Gault (male) for vancomycin estimate`,
    "Estimated creatinine clearance (mL/min)? (Round to nearest whole number.)",
    "30",
    "mL/min",
    "CrCl = [(140−70)×75]/(72×2.4) = 5,250/172.8 ≈ 30 mL/min.",
    { blueprintDomain: A1, references: [FDA] },
    ["(140−age)×weight/(72×SCr)", "≈ 30 mL/min"]
  ),

  naplexCalcCase(
    "compounding-calculations",
    `Pediatric | Acetaminophen 15 mg/kg/dose PO q6h | Child 24 kg | Suspension 160 mg/5 mL`,
    "How many milliliters per dose? (Round to one decimal.)",
    "11.3",
    "mL",
    "Dose = 15 × 24 = 360 mg. Volume = 360/160 × 5 = 11.25 → 11.3 mL.",
    { blueprintDomain: A3, references: [FDA] },
    ["360 mg per dose", "360÷160×5 = 11.25 mL"]
  ),

  naplexCalcCase(
    "endocrine-rx",
    `T1DM | Carb ratio 1:12 | Pre-meal BG 242 mg/dL | Target 120 | ISF 1:40 | Lunch 60 g carbohydrate`,
    "Total rapid-acting insulin units for correction plus meal? (Round to one decimal.)",
    "8.0",
    "units",
    "Meal = 60÷12 = 5 U. Correction = (242−120)÷40 = 3.05 U. Total ≈ 8.0 U.",
    { blueprintDomain: A3, references: [ADA] },
    ["5 U meal", "3 U correction", "≈ 8 U"]
  ),

  naplexCalcCase(
    "pharmacokinetics",
    `STEMI protocol | 72 kg patient | Heparin bolus 60 units/kg IV | Concentration 1,000 units/mL`,
    "Bolus volume (mL)? (Round to one decimal.)",
    "4.3",
    "mL",
    "Bolus = 60 × 72 = 4,320 units. Volume = 4,320 ÷ 1,000 = 4.32 → 4.3 mL.",
    { blueprintDomain: A2, references: [FDA] },
    ["4,320 units", "÷ 1,000 units/mL"]
  ),

  naplexCalcCase(
    "compounding-calculations",
    `Oncology | Carboplatin target AUC 6 | Calvert formula | GFR 55 mL/min`,
    "Calculated dose (mg)? (Round to nearest whole mg.)",
    "480",
    "mg",
    "Calvert: Dose = AUC × (GFR + 25) = 6 × 80 = 480 mg.",
    { blueprintDomain: A3, references: [FDA], difficulty: 5 },
    ["6 × (55 + 25)", "= 480 mg"]
  ),

  naplexCalcCase(
    "compounding-calculations",
    `TPN | Add 60 mEq KCl to 1,000 mL base | Stock 2 mEq/mL`,
    "Stock KCl volume (mL)? (Round to one decimal.)",
    "30.0",
    "mL",
    "60 mEq ÷ 2 mEq/mL = 30 mL.",
    { blueprintDomain: A1, references: [USP797] },
    ["60 mEq", "÷ 2 = 30 mL"]
  ),

  naplexCalcCase(
    "endocrine-rx",
    `GDM 32 wk GA | Weight 82 kg | Start insulin glargine 0.2 units/kg/day`,
    "Initial daily glargine dose (units)? (Round to nearest whole unit.)",
    "16",
    "units",
    "0.2 × 82 = 16.4 → 16 units.",
    { blueprintDomain: A3, references: [ADA] },
    ["0.2 U/kg × 82 kg"]
  ),

  naplexCalcCase(
    "pharmacokinetics",
    `Chronic pain | Morphine SR 90 mg q12h (180 mg/day PO) | Rotate to hydromorphone PO`,
    "Approximate equianalgesic daily hydromorphone (mg) using 4:1 morphine:hydromorphone ratio? (Round to nearest whole mg.)",
    "45",
    "mg",
    "180 mg morphine ÷ 4 ≈ 45 mg hydromorphone/day.",
    { blueprintDomain: A3, references: [FDA] },
    ["180 mg MSE", "÷ 4 = 45 mg"]
  ),

  naplexCalcCase(
    "compounding-calculations",
    `IV piggyback | 150 mL to run over 45 minutes`,
    "Required pump rate (mL/hr)? (Round to nearest whole number.)",
    "200",
    "mL/hr",
    "150 mL ÷ 0.75 h = 200 mL/hr.",
    { blueprintDomain: A1, references: [USP797] },
    ["45 min = 0.75 h", "150/0.75 = 200"]
  ),

  naplexCalcCase(
    "infectious-disease-rx",
    `OM | Amoxicillin 40 mg/kg/day PO divided BID | Child 20 kg | 400 mg/5 mL | 10-day supply`,
    "Total volume to dispense (mL)? (Round to nearest whole mL.)",
    "100",
    "mL",
    "Daily = 40×20 = 800 mg. Each BID dose = 400 mg → 5 mL per dose. Ten days × 2 doses = 20 doses → 100 mL.",
    { blueprintDomain: A3, references: [FDA] },
    ["400 mg per dose = 5 mL", "20 doses = 100 mL"]
  ),

  naplexCalcCase(
    "pharmacokinetics",
    `Hypoalbuminemia | Phenytoin total level 8 mcg/mL | Albumin 2.2 g/dL | Adjusted ≈ measured / (0.2×albumin + 0.1)`,
    "Estimated adjusted phenytoin level (mcg/mL)? (Round to one decimal.)",
    "14.8",
    "mcg/mL",
    "Adjusted ≈ 8 / (0.2×2.2 + 0.1) = 8/0.54 ≈ 14.8 mcg/mL — suggests adequate/low-bound therapeutic when corrected.",
    { blueprintDomain: A3, references: [FDA], difficulty: 5 },
    ["8 / 0.54", "≈ 14.8 mcg/mL"]
  ),

  naplexCalcCase(
    "compounding-calculations",
    `IV magnesium | Order 2 g MgSO4 (16.2 mEq Mg²⁺) | Stock 4.06 mEq/mL`,
    "Volume to draw (mL)? (Round to one decimal.)",
    "4.0",
    "mL",
    "16.2 mEq ÷ 4.06 mEq/mL ≈ 3.99 → 4.0 mL.",
    { blueprintDomain: A1, references: [FDA] },
    ["16.2 mEq", "÷ 4.06 ≈ 4 mL"]
  ),

  naplexCalcCase(
    "cardiovascular-rx",
    `NPO HF exacerbation | Home furosemide 80 mg PO daily | IV bioavailability ~50% of PO`,
    "Equivalent daily IV furosemide dose (mg)?",
    "40",
    "mg",
    "IV ≈ half oral dose → 40 mg IV daily.",
    { blueprintDomain: A3, references: [FDA] },
    ["80 mg PO", "÷ 2 = 40 mg IV"]
  ),

  naplexCalcCase(
    "endocrine-rx",
    `New hypothyroid | Weight 60 kg | Full replacement 1.6 mcg/kg/day levothyroxine`,
    "Daily dose (mcg)? (Round to nearest whole mcg.)",
    "96",
    "mcg",
    "1.6 × 60 = 96 mcg daily.",
    { blueprintDomain: A3, references: [FDA] },
    ["1.6 × 60 = 96 mcg"]
  ),

  naplexCalcCase(
    "compounding-calculations",
    `Alligation | Prepare 400 mL of 20% dextrose from 50% and 5% stock`,
    "Milliliters of 50% solution required? (Round to nearest whole mL.)",
    "133",
    "mL",
    "Using alligation: (20−5)/(50−5) = 15/45 = 1/3 of 400 mL ≈ 133 mL of 50%; remainder 5%.",
    { blueprintDomain: A1, references: [USP797] },
    ["15/45 ratio", "≈ 133 mL of 50%"]
  ),

  naplexCalcCase(
    "infectious-disease-rx",
    `Latent TB | Rifampin 15 mg/kg/day | Patient 52 kg | Capsules 150 mg`,
    "Capsules per day? (Whole number.)",
    "5",
    "capsules",
    "52 × 15 = 780 mg/day. 780 ÷ 150 = 5.2 → 5 capsules (750 mg) with prescriber rounding.",
    { blueprintDomain: A3, references: [FDA] },
    ["780 mg/day", "÷ 150 mg = 5.2 caps"]
  ),

  naplexCalcCase(
    "pharmacokinetics",
    `Apnea of prematurity | Caffeine citrate load 20 mg/kg | Infant 1.8 kg | 20 mg/mL`,
    "Loading dose volume (mL)? (Round to one decimal.)",
    "1.8",
    "mL",
    "Load = 20 × 1.8 = 36 mg. 36 ÷ 20 = 1.8 mL.",
    { blueprintDomain: A3, references: [FDA] },
    ["36 mg", "÷ 20 mg/mL"]
  ),

  naplexCalcCase(
    "compounding-calculations",
    `Pediatric zinc | Elemental zinc 1 mg/kg/day | Child 16 kg | Solution 10 mg elemental/5 mL`,
    "Daily volume (mL)? (Round to one decimal.)",
    "8.0",
    "mL",
    "Elemental need = 16 mg/day. Concentration = 2 mg/mL → 16 ÷ 2 = 8 mL.",
    { blueprintDomain: A1, references: [FDA] },
    ["16 mg/day", "2 mg/mL → 8 mL"]
  ),

  naplexCalcCase(
    "cardiovascular-rx",
    `Post-PCI | 88 kg | Heparin 12 units/kg/hr | 25,000 units/250 mL (100 units/mL)`,
    "Infusion rate (mL/hr)? (Round to one decimal.)",
    "10.6",
    "mL/hr",
    "12 × 88 = 1,056 units/hr. 1,056 ÷ 100 = 10.56 → 10.6 mL/hr.",
    { blueprintDomain: A2, references: [FDA] },
    ["1,056 units/hr", "÷ 100 units/mL"]
  ),
];
