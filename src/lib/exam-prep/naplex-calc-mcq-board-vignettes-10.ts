/**
 * 10 board-level NAPLEX calculation MCQs with full clinical vignettes.
 * Answers verified against standard pharmacy math (Q1 options adjusted to include computed 251 mg).
 */
import { ASPEN_REF, buildCalcMcqBatch, NAPLEX_PHARM, o, USP_REF } from "./naplex-calc-mcq-helpers";

export const NAPLEX_CALC_MCQ_BOARD_VIGNETTES_10 = buildCalcMcqBatch([
  {
    subjectId: "infectious-disease-rx",
    vignette:
      "A 78-year-old female (height 5'2\", weight 112 lb, SCr 1.4 mg/dL) is admitted for community-acquired pneumonia. Order: gentamicin 5 mg/kg ideal body weight IV once daily.",
    stem: "What is the dose in mg? (Female IBW: 45.5 + 2.3 × inches over 5 ft)",
    options: o("238 mg", "251 mg", "280 mg", "315 mg"),
    correct: "251 mg",
    explanation:
      "Height 5'2\" = 62 in → 2 in over 60. IBW = 45.5 + 2.3(2) = 50.1 kg. Gentamicin = 5 mg/kg × 50.1 = 250.5 mg → 251 mg. Dose on IBW, not actual weight (112 lb ≈ 51 kg).",
    steps: [
      "Convert height: 5'2\" = 62 inches → 62 − 60 = 2 inches over 5 ft.",
      "Female IBW = 45.5 + 2.3(2) = 50.1 kg.",
      "Dose = 5 mg/kg × 50.1 kg = 250.5 mg → 251 mg.",
    ],
    blueprintDomain: NAPLEX_PHARM,
    difficulty: 4,
    tags: ["board-vignette", "ibw"],
  },
  {
    subjectId: "cardiovascular-rx",
    vignette:
      "A 62-year-old male patient (weight 85 kg) with DVT is started on a heparin drip. Order: 80 units/kg bolus then 18 units/kg/hr. Pharmacy bag: 25,000 units/500 mL.",
    stem: "What is the initial continuous infusion rate in mL/hr?",
    options: o("24.5 mL/hr", "30.6 mL/hr", "36.7 mL/hr", "61.2 mL/hr"),
    correct: "30.6 mL/hr",
    explanation:
      "Infusion units/hr = 18 × 85 = 1,530 units/hr. Bag concentration = 25,000/500 = 50 units/mL. Rate = 1,530 ÷ 50 = 30.6 mL/hr (bolus is separate).",
    steps: [
      "Weight-based rate: 18 units/kg/hr × 85 kg = 1,530 units/hr.",
      "Concentration: 25,000 units ÷ 500 mL = 50 units/mL.",
      "Pump rate = 1,530 ÷ 50 = 30.6 mL/hr.",
    ],
    blueprintDomain: NAPLEX_PHARM,
    difficulty: 4,
    tags: ["board-vignette", "iv-rate"],
  },
  {
    subjectId: "pharmacotherapy-oncology",
    vignette:
      "Pediatric oncology: patient 22 kg, BSA 0.85 m². Cyclophosphamide 750 mg/m² IV; vial reconstituted to 20 mg/mL.",
    stem: "How many mL should be prepared for this dose?",
    options: o("21.25 mL", "31.9 mL", "42.2 mL", "63.75 mL"),
    correct: "31.9 mL",
    explanation:
      "750 mg/m² × 0.85 m² = 637.5 mg. Volume = 637.5 mg ÷ 20 mg/mL = 31.875 mL → 31.9 mL. Verify cycle day and hydration/mesna orders before release.",
    steps: [
      "BSA dose: 750 mg/m² × 0.85 m² = 637.5 mg.",
      "Stock concentration: 20 mg/mL.",
      "Volume = 637.5 ÷ 20 = 31.875 mL ≈ 31.9 mL.",
    ],
    blueprintDomain: NAPLEX_PHARM,
    difficulty: 4,
    tags: ["board-vignette", "oncology-calc"],
  },
  {
    subjectId: "cardiovascular-rx",
    vignette:
      "ICU: critically ill patient 70 kg on norepinephrine 0.1 mcg/kg/min IV. Bag contains 4 mg in 250 mL D5W.",
    stem: "What is the infusion rate in mL/hr?",
    options: o("7.9 mL/hr", "10.5 mL/hr", "15.8 mL/hr", "26.3 mL/hr"),
    correct: "26.3 mL/hr",
    explanation:
      "0.1 mcg/kg/min × 70 kg = 7 mcg/min = 420 mcg/hr. Bag: 4 mg/250 mL = 16 mcg/mL. Rate = 420 ÷ 16 = 26.25 mL/hr ≈ 26.3 mL/hr.",
    steps: [
      "mcg/min: 0.1 × 70 = 7 mcg/min → 7 × 60 = 420 mcg/hr.",
      "Concentration: 4 mg/250 mL = 4,000 mcg/250 mL = 16 mcg/mL.",
      "Rate = 420 ÷ 16 = 26.25 mL/hr ≈ 26.3 mL/hr.",
    ],
    blueprintDomain: NAPLEX_PHARM,
    difficulty: 4,
    tags: ["board-vignette", "iv-rate"],
  },
  {
    subjectId: "cardiovascular-rx",
    vignette:
      "A 55-year-old male (weight 80 kg, CrCl 42 mL/min) is prescribed enoxaparin for VTE treatment. Standard dose 1 mg/kg SQ every 12 hours.",
    stem: "What is the most appropriate renal-adjusted regimen per common CrCl 30–50 mL/min protocol?",
    options: o("40 mg every 12 hours", "60 mg every 12 hours", "80 mg every 24 hours", "100 mg every 12 hours"),
    correct: "80 mg every 24 hours",
    explanation:
      "Standard would be 80 mg q12h (1 mg/kg × 80 kg). With CrCl 42 mL/min (30–50 range), extend interval to once daily: 80 mg every 24 hours while maintaining mg/kg dose.",
    steps: [
      "Standard treatment: 1 mg/kg × 80 kg = 80 mg every 12 hours.",
      "CrCl 42 mL/min falls in 30–50 mL/min adjustment range.",
      "Adjust interval to every 24 hours → 80 mg every 24 hours.",
    ],
    blueprintDomain: NAPLEX_PHARM,
    difficulty: 4,
    tags: ["board-vignette", "renal-adjust"],
  },
  {
    subjectId: "compounding-calculations",
    vignette:
      "Compounding: prepare 300 g of 0.5% hydrocortisone cream using 2.5% stock cream and Eucerin base (0% active).",
    stem: "How many grams of the 2.5% hydrocortisone cream are needed?",
    options: o("30 g", "60 g", "90 g", "120 g"),
    correct: "60 g",
    explanation:
      "Alligation (0.5% from 2.5% + 0% base): fraction of 2.5% = 0.5/2.5 = 1/5. For 300 g total: 300 × 0.2 = 60 g of 2.5% cream + 240 g base.",
    steps: [
      "Target 0.5% between 2.5% stock and 0% base.",
      "Fraction 2.5%: 0.5 ÷ 2.5 = 1/5 (20%) of final weight.",
      "300 g × 0.2 = 60 g of 2.5% cream.",
    ],
    references: [USP_REF],
    difficulty: 4,
    tags: ["board-vignette", "compounding-calc"],
  },
  {
    subjectId: "infectious-disease-rx",
    vignette:
      "Vancomycin 15 mg/kg IV every 8 hours for a 95 kg patient (CrCl 55 mL/min). Protocol: round each dose to nearest 250 mg.",
    stem: "What is the rounded dose per administration in mg?",
    options: o("1,000 mg", "1,250 mg", "1,500 mg", "1,750 mg"),
    correct: "1,500 mg",
    explanation:
      "15 mg/kg × 95 kg = 1,425 mg per dose. Nearest 250 mg increment: 1,425 is closer to 1,500 than 1,250 → 1,500 mg. Confirm trough timing and renal monitoring.",
    steps: [
      "Calculate: 15 × 95 = 1,425 mg per dose.",
      "250 mg increments near 1,425: 1,250 or 1,500.",
      "1,425 − 1,250 = 175; 1,500 − 1,425 = 75 → round to 1,500 mg.",
    ],
    blueprintDomain: NAPLEX_PHARM,
    difficulty: 4,
    tags: ["board-vignette"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "TPN order: 20% lipid emulsion at 0.8 g/kg/day for a 75 kg adult (20% = 0.2 g lipid/mL).",
    stem: "How many mL of lipid emulsion are needed daily?",
    options: o("150 mL", "225 mL", "300 mL", "375 mL"),
    correct: "300 mL",
    explanation:
      "Lipid grams/day = 0.8 g/kg × 75 kg = 60 g. 20% emulsion = 0.2 g/mL → 60 g ÷ 0.2 g/mL = 300 mL daily.",
    steps: [
      "Daily lipid grams: 0.8 × 75 = 60 g.",
      "20% lipid = 20 g per 100 mL = 0.2 g/mL.",
      "Volume = 60 ÷ 0.2 = 300 mL/day.",
    ],
    references: [ASPEN_REF],
    difficulty: 4,
    tags: ["board-vignette", "tpn-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette:
      "A 4-year-old child (weight 18 kg) is prescribed methylprednisolone 2 mg/kg/day PO divided every 6 hours. Suspension 5 mg/mL.",
    stem: "How many mL per dose?",
    options: o("1.8 mL", "3.6 mL", "7.2 mL", "14.4 mL"),
    correct: "1.8 mL",
    explanation:
      "Daily dose: 2 mg/kg × 18 kg = 36 mg/day. Q6h = 4 doses → 36 ÷ 4 = 9 mg/dose. 9 mg ÷ 5 mg/mL = 1.8 mL per dose.",
    steps: [
      "Daily dose: 2 × 18 = 36 mg/day.",
      "Q6h dosing: 36 ÷ 4 = 9 mg per dose.",
      "Volume: 9 mg ÷ 5 mg/mL = 1.8 mL per dose.",
    ],
    difficulty: 4,
    tags: ["board-vignette", "pediatric"],
  },
  {
    subjectId: "cardiovascular-rx",
    vignette:
      "Heparin protocol: aPTT 45 sec (target 60–80). Protocol: decrease infusion by 2 units/kg/hr and give 40 units/kg bolus. Current rate 16 units/kg/hr.",
    stem: "What is the new infusion rate in units/kg/hr?",
    options: o("12 units/kg/hr", "14 units/kg/hr", "18 units/kg/hr", "20 units/kg/hr"),
    correct: "14 units/kg/hr",
    explanation:
      "Apply protocol literally: 16 units/kg/hr − 2 units/kg/hr = 14 units/kg/hr new continuous rate (plus separate 40 units/kg bolus per order).",
    steps: [
      "Current rate: 16 units/kg/hr.",
      "Protocol adjustment: decrease by 2 units/kg/hr.",
      "New rate = 16 − 2 = 14 units/kg/hr.",
    ],
    blueprintDomain: NAPLEX_PHARM,
    difficulty: 4,
    tags: ["board-vignette", "protocol"],
  },
]);
