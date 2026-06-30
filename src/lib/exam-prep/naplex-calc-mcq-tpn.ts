/**
 * 15 TPN-focused NAPLEX calculation MCQs (kcal, mEq, rates, concentrations).
 */
import { ASPEN_REF, buildCalcMcqBatch, NAPLEX_DISP, o } from "./naplex-calc-mcq-helpers";

export const NAPLEX_CALC_MCQ_TPN = buildCalcMcqBatch([
  {
    subjectId: "compounding-calculations",
    vignette: "TPN order review: D20W 1,000 mL bag for a 62-year-old patient on central line therapy.",
    stem: "How many grams of dextrose are in 1,000 mL of D20W?",
    options: o("20 g", "100 g", "200 g", "400 g"),
    correct: "200 g",
    explanation:
      "D20W = 20 g dextrose per 100 mL. In 1,000 mL: 20 × 10 = 200 g dextrose. Verify label before compounding TPN additives.",
    steps: [
      "Identify concentration: D20W = 20 g dextrose per 100 mL.",
      "Scale to bag volume: 1,000 mL ÷ 100 mL = 10 portions.",
      "Multiply: 20 g × 10 = 200 g dextrose in the bag.",
    ],
    references: [ASPEN_REF],
    tags: ["tpn-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "TPN lipids 20% emulsion infusing at 25 mL/hr for 24 hours (≈ 2 kcal/mL). Patient 58 kg.",
    stem: "How many kcal are provided from lipids over 24 hours?",
    options: o("600 kcal", "900 kcal", "1,200 kcal", "1,800 kcal"),
    correct: "1,200 kcal",
    explanation:
      "25 mL/hr × 24 hr = 600 mL total. 600 mL × 2 kcal/mL = 1,200 kcal from lipids over the infusion period.",
    steps: [
      "Calculate total lipid volume: 25 mL/hr × 24 hr = 600 mL.",
      "Apply lipid energy density: 20% lipid emulsion ≈ 2 kcal/mL.",
      "Multiply: 600 mL × 2 kcal/mL = 1,200 kcal.",
    ],
    references: [ASPEN_REF],
    tags: ["tpn-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "TPN additive order: potassium chloride 40 mEq from stock 2 mEq/mL concentrate.",
    stem: "How many mL of KCl concentrate are needed?",
    options: o("10 mL", "20 mL", "40 mL", "80 mL"),
    correct: "20 mL",
    explanation:
      "Desired mEq ÷ concentration = volume. 40 mEq ÷ 2 mEq/mL = 20 mL of concentrate before final TPN admixture and line compatibility checks.",
    steps: [
      "Identify ordered electrolyte: 40 mEq potassium.",
      "Stock concentration: 2 mEq/mL.",
      "Volume = mEq ÷ concentration = 40 ÷ 2 = 20 mL.",
    ],
    references: [ASPEN_REF],
    tags: ["tpn-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "Nutrition consult: estimate dextrose calories from 500 mL D10W (dextrose = 3.4 kcal/g).",
    stem: "How many kcal are provided from dextrose in this bag?",
    options: o("85 kcal", "170 kcal", "340 kcal", "680 kcal"),
    correct: "170 kcal",
    explanation:
      "D10W = 10 g/100 mL → 50 g in 500 mL. 50 g × 3.4 kcal/g = 170 kcal from dextrose. Confirm with TPN software before final labeling.",
    steps: [
      "Find dextrose grams: D10W = 10 g per 100 mL → 50 g in 500 mL.",
      "Use energy factor: 1 g dextrose = 3.4 kcal.",
      "Calculate: 50 g × 3.4 kcal/g = 170 kcal.",
    ],
    references: [ASPEN_REF],
    tags: ["tpn-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "TPN amino acid order: 10% amino acid solution 500 mL bag for a post-op patient.",
    stem: "How many grams of amino acids are in the bag?",
    options: o("10 g", "50 g", "100 g", "500 g"),
    correct: "50 g",
    explanation:
      "10% w/v = 10 g per 100 mL. In 500 mL: 10 × 5 = 50 g amino acids. Cross-check nitrogen balance goals with the nutrition team.",
    steps: [
      "Convert percent: 10% w/v = 10 g amino acids per 100 mL.",
      "Scale to volume: 500 mL ÷ 100 mL = 5.",
      "Multiply: 10 g × 5 = 50 g amino acids.",
    ],
    references: [ASPEN_REF],
    tags: ["tpn-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "Central TPN running 83 mL/hr. Patient also receives 125 mL/hr maintenance IV fluids on a separate line.",
    stem: "What is the combined infusion rate in mL/hr?",
    options: o("42 mL/hr", "83 mL/hr", "125 mL/hr", "208 mL/hr"),
    correct: "208 mL/hr",
    explanation:
      "When two infusions run concurrently, add the rates: 83 + 125 = 208 mL/hr total fluid delivery. Monitor fluid balance and electrolytes closely.",
    steps: [
      "List concurrent rates: TPN 83 mL/hr + maintenance 125 mL/hr.",
      "Add rates (same time unit): 83 + 125 = 208 mL/hr.",
      "Confirm both lines are accounted for in fluid balance documentation.",
    ],
    references: [ASPEN_REF],
    tags: ["tpn-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "TPN sodium additive: 0.9% NaCl (154 mEq/L). Order 30 mEq sodium from this stock.",
    stem: "How many mL of 0.9% NaCl are needed?",
    options: o("97 mL", "154 mL", "195 mL", "300 mL"),
    correct: "195 mL",
    explanation:
      "0.9% NaCl ≈ 154 mEq/L. Volume = mEq needed ÷ mEq/L = 30 ÷ 154 × 1,000 mL ≈ 195 mL. Verify osmolarity limits for peripheral vs central route.",
    steps: [
      "Recall: 0.9% NaCl contains 154 mEq sodium per liter.",
      "Set up proportion: 30 mEq / 154 mEq = V / 1,000 mL.",
      "Solve: V = (30 × 1,000) ÷ 154 ≈ 195 mL.",
    ],
    references: [ASPEN_REF],
    tags: ["tpn-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "TPN calcium order: calcium gluconate 10% (9.3 mg/mL elemental Ca; 10 mL = 4.65 mEq). Need 10 mEq.",
    stem: "How many mL of 10% calcium gluconate are required?",
    options: o("10 mL", "15 mL", "21.5 mL", "30 mL"),
    correct: "21.5 mL",
    explanation:
      "10% calcium gluconate: 10 mL = 4.65 mEq. For 10 mEq: (10 ÷ 4.65) × 10 mL ≈ 21.5 mL. Never co-infuse with phosphate in the same line.",
    steps: [
      "Use labeled conversion: 10 mL of 10% calcium gluconate = 4.65 mEq.",
      "Set ratio: 10 mEq / 4.65 mEq = V / 10 mL.",
      "Solve: V = (10 × 10) ÷ 4.65 ≈ 21.5 mL.",
    ],
    references: [ASPEN_REF],
    tags: ["tpn-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "TPN phosphate additive: sodium phosphate 3 mmol/mL stock. Prescriber orders 15 mmol.",
    stem: "How many mL of stock are needed?",
    options: o("3 mL", "5 mL", "15 mL", "45 mL"),
    correct: "5 mL",
    explanation:
      "Volume = mmol ordered ÷ concentration = 15 mmol ÷ 3 mmol/mL = 5 mL. Check calcium-phosphate compatibility before admixture.",
    steps: [
      "Ordered amount: 15 mmol phosphate.",
      "Stock concentration: 3 mmol/mL.",
      "Volume = 15 ÷ 3 = 5 mL.",
    ],
    references: [ASPEN_REF],
    tags: ["tpn-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "Pharmacist mixes 200 mL D70W with sterile water to prepare 1,000 mL final bag (volumes additive).",
    stem: "What is the final dextrose concentration (% w/v)?",
    options: o("5%", "10%", "14%", "20%"),
    correct: "14%",
    explanation:
      "D70W contributes 70 g/100 mL × 2 = 140 g in 200 mL. In 1,000 mL final: 140 g/1,000 mL = 14% w/v dextrose after qs with D5W.",
    steps: [
      "Grams from D70W: 70 g/100 mL × 2 = 140 g dextrose in 200 mL.",
      "D70W qs with sterile water to 1,000 mL total volume (no additional dextrose from diluent).",
      "Final % = (140 g ÷ 1,000 mL) × 100 = 14% w/v.",
    ],
    references: [ASPEN_REF],
    tags: ["tpn-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "TPN protein goal 1.5 g/kg/day for a 70 kg adult receiving central nutrition.",
    stem: "What is the daily protein goal in grams?",
    options: o("70 g", "105 g", "140 g", "210 g"),
    correct: "105 g",
    explanation:
      "Weight-based protein: 1.5 g/kg × 70 kg = 105 g/day. Match amino acid grams in the TPN prescription to this target and renal status.",
    steps: [
      "Identify weight: 70 kg.",
      "Apply goal: 1.5 g/kg/day.",
      "Multiply: 1.5 × 70 = 105 g protein per day.",
    ],
    references: [ASPEN_REF],
    tags: ["tpn-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "TPN order includes regular insulin 50 units added per liter of dextrose solution. Bag volume 2 L.",
    stem: "How many units of insulin are in the full TPN bag?",
    options: o("25 units", "50 units", "75 units", "100 units"),
    correct: "100 units",
    explanation:
      "50 units per liter × 2 L = 100 units total in the bag. Label clearly and counsel on glucose monitoring when insulin is in TPN.",
    steps: [
      "Insulin concentration in order: 50 units per liter.",
      "Bag volume: 2 L.",
      "Total units = 50 × 2 = 100 units.",
    ],
    references: [ASPEN_REF],
    tags: ["tpn-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "TPN magnesium sulfate 50% (4 mEq/mL). Prescriber orders 8 mEq magnesium in the admixture.",
    stem: "How many mL of 50% magnesium sulfate are needed?",
    options: o("1 mL", "2 mL", "4 mL", "8 mL"),
    correct: "2 mL",
    explanation:
      "Volume = mEq ÷ concentration = 8 mEq ÷ 4 mEq/mL = 2 mL of 50% magnesium sulfate. Recheck renal function and reflexes per protocol.",
    steps: [
      "Ordered: 8 mEq magnesium.",
      "Stock: 4 mEq/mL (50% magnesium sulfate).",
      "Volume = 8 ÷ 4 = 2 mL.",
    ],
    references: [ASPEN_REF],
    tags: ["tpn-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "Pharmacist calculates dextrose load: 80 g dextrose infused over 24 hr for a 50 kg patient.",
    stem: "What is the dextrose infusion rate in g/kg/day?",
    options: o("0.8 g/kg/day", "1.2 g/kg/day", "1.6 g/kg/day", "2.0 g/kg/day"),
    correct: "1.6 g/kg/day",
    explanation:
      "g/kg/day = total grams ÷ weight = 80 g ÷ 50 kg = 1.6 g/kg/day. Compare to institutional glucose oxidation limits before finalizing TPN.",
    steps: [
      "Total dextrose: 80 g over 24 hours.",
      "Patient weight: 50 kg.",
      "Rate = 80 ÷ 50 = 1.6 g/kg/day.",
    ],
    references: [ASPEN_REF],
    tags: ["tpn-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "Cyclic TPN to run 18 hr at 120 mL/hr for a home infusion patient (55 kg).",
    stem: "What total volume (mL) is delivered per cycle?",
    options: o("1,080 mL", "1,440 mL", "2,160 mL", "2,880 mL"),
    correct: "2,160 mL",
    explanation:
      "Volume = rate × time = 120 mL/hr × 18 hr = 2,160 mL per cycle. Confirm pump programming and hang time with the patient before discharge.",
    steps: [
      "Infusion rate: 120 mL/hr.",
      "Cycle duration: 18 hours.",
      "Total volume = 120 × 18 = 2,160 mL.",
    ],
    references: [ASPEN_REF],
    tags: ["tpn-calc"],
  },
]);
