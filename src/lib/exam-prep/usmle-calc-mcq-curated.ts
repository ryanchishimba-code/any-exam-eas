/**
 * Hand-authored USMLE calculation MCQs — 12 per step (36 total) with worked solutions.
 */
import { buildUsmleCalcMcqBatch, o } from "./usmle-calc-mcq-helpers";

export const USMLE_STEP1_CALC_CURATED = buildUsmleCalcMcqBatch([
  {
    stepLevel: "step1",
    subjectId: "biochemistry",
    vignette:
      "Laboratory: Na⁺ 139 mEq/L, Cl⁻ 101 mEq/L, HCO₃⁻ 18 mEq/L, glucose 95 mg/dL, albumin 4.0 g/dL.",
    stem: "What is the anion gap (mEq/L)?",
    options: o("16", "20", "24", "28"),
    correct: "20",
    explanation: "Anion gap = Na⁺ − (Cl⁻ + HCO₃⁻) = 139 − (101 + 18) = 20 mEq/L.",
    steps: ["AG = 139 − (101 + 18)", "= 20 mEq/L"],
    tags: ["anion-gap", "acid-base"],
  },
  {
    stepLevel: "step1",
    subjectId: "physiology",
    vignette:
      "Arterial blood gas: pH 7.28, PaCO₂ 60 mmHg. Normal pKₐ for carbonic acid buffer ≈ 6.1; HCO₃⁻ measured 27 mEq/L.",
    stem: "Using Henderson–Hasselbalch, which value best matches the predicted pH? (Round to two decimals.)",
    options: o("7.10", "7.28", "7.40", "7.55"),
    correct: "7.28",
    explanation: "pH = 6.1 + log([HCO₃⁻]/0.03×PaCO₂) = 6.1 + log(27/1.8) ≈ 7.28.",
    steps: ["0.03 × 60 = 1.8", "log(27/1.8) ≈ 1.18", "pH ≈ 7.28"],
    tags: ["acid-base", "henderson-hasselbalch"],
  },
  {
    stepLevel: "step1",
    subjectId: "biochemistry",
    vignette:
      "Population genetics: allele frequency of an autosomal recessive disease = 0.02 (q). Hardy–Weinberg equilibrium assumed.",
    stem: "What is the carrier frequency (2pq)?",
    options: o("0.0004", "0.04", "0.08", "0.96"),
    correct: "0.04",
    explanation: "p ≈ 1 − q = 0.98. Carrier frequency 2pq = 2 × 0.98 × 0.02 = 0.0392 ≈ 0.04.",
    steps: ["p = 0.98", "2pq = 2 × 0.98 × 0.02", "≈ 0.04"],
    tags: ["genetics", "hardy-weinberg"],
  },
  {
    stepLevel: "step1",
    subjectId: "physiology",
    vignette: "Serum calcium 7.8 mg/dL, albumin 2.0 g/dL. Corrected calcium = measured + 0.8 × (4 − albumin).",
    stem: "What is the corrected calcium (mg/dL)? (Round to one decimal.)",
    options: o("8.6 mg/dL", "9.4 mg/dL", "10.2 mg/dL", "11.0 mg/dL"),
    correct: "9.4 mg/dL",
    explanation: "Corrected Ca = 7.8 + 0.8 × (4 − 2.0) = 7.8 + 1.6 = 9.4 mg/dL.",
    steps: ["4 − albumin = 2", "0.8 × 2 = 1.6", "7.8 + 1.6 = 9.4"],
    tags: ["electrolytes", "calcium"],
  },
]);

export const USMLE_STEP2_CALC_CURATED = buildUsmleCalcMcqBatch([
  {
    stepLevel: "step2",
    subjectId: "internal-medicine",
    vignette: "68-year-old man, weight 80 kg, serum creatinine 2.0 mg/dL. Cockcroft–Gault (CrCl) calculation requested.",
    stem: "What is the estimated creatinine clearance (mL/min)? (Round to nearest whole number; use 72 in denominator.)",
    options: o("28 mL/min", "35 mL/min", "40 mL/min", "56 mL/min"),
    correct: "40 mL/min",
    explanation: "CrCl = [(140 − age) × weight] / (72 × Cr) = (72 × 80) / (72 × 2) = 40 mL/min.",
    steps: ["(140−68)×80 = 5,760", "÷ (72×2) = 144", "= 40 mL/min"],
    tags: ["cockcroft-gault", "renal"],
  },
  {
    stepLevel: "step2",
    subjectId: "internal-medicine",
    vignette: "Trauma patient: weight 70 kg, 30% total body surface area (TBSA) partial-thickness burns. Parkland formula: 4 mL × kg × %TBSA in first 24 h.",
    stem: "How many liters of crystalloid are recommended in the first 24 hours? (Round to nearest whole liter.)",
    options: o("4 L", "6 L", "8 L", "10 L"),
    correct: "8 L",
    explanation: "Parkland = 4 × 70 × 30 = 8,400 mL ≈ 8 L in 24 h (half in first 8 h).",
    steps: ["4 × 70 × 30 = 8,400 mL", "≈ 8 L"],
    tags: ["burns", "parkland"],
  },
  {
    stepLevel: "step2",
    subjectId: "pharmacology",
    vignette: "Order: dopamine 5 mcg/kg/min IV. Patient 60 kg. Bag concentration 800 mcg/mL.",
    stem: "What infusion rate (mL/hr) delivers the ordered dose? (Round to nearest whole number.)",
    options: o("11 mL/hr", "23 mL/hr", "45 mL/hr", "90 mL/hr"),
    correct: "23 mL/hr",
    explanation: "5 × 60 × 60 = 18,000 mcg/hr. Rate = 18,000 ÷ 800 = 22.5 → 23 mL/hr.",
    steps: ["5×60×60=18,000 mcg/hr", "÷800=22.5", "→23 mL/hr"],
    tags: ["iv-infusion"],
  },
  {
    stepLevel: "step2",
    subjectId: "pediatrics",
    vignette: "8-year-old child, weight 25 kg. Maintenance IV fluids using 4-2-1 rule (mL/hr).",
    stem: "What is the maintenance fluid rate (mL/hr)?",
    options: o("45 mL/hr", "55 mL/hr", "65 mL/hr", "75 mL/hr"),
    correct: "65 mL/hr",
    explanation: "4×10 + 2×10 + 1×5 = 40 + 20 + 5 = 65 mL/hr.",
    steps: ["4×10=40", "2×10=20", "1×5=5", "Total 65"],
    tags: ["pediatrics", "fluids"],
  },
]);

export const USMLE_STEP3_CALC_CURATED = buildUsmleCalcMcqBatch([
  {
    stepLevel: "step3",
    subjectId: "internal-medicine",
    vignette:
      "RCT: event rate 8% (treatment) vs 12% (control) over 2 years. Absolute risk reduction (ARR) = control − treatment.",
    stem: "What is the number needed to treat (NNT)? (Round up to next whole number.)",
    options: o("13", "25", "33", "50"),
    correct: "25",
    explanation: "ARR = 12% − 8% = 4% = 0.04. NNT = 1/0.04 = 25.",
    steps: ["ARR = 0.04", "NNT = 1/0.04 = 25"],
    tags: ["nnt", "biostatistics"],
    blueprintDomain: "usmle-biostats",
  },
  {
    stepLevel: "step3",
    subjectId: "internal-medicine",
    vignette:
      "Screening test: sensitivity 90%, specificity 95%, disease prevalence 10% in this population.",
    stem: "What is the positive predictive value (PPV)? (Round to nearest whole percent.)",
    options: o("33%", "50%", "67%", "90%"),
    correct: "67%",
    explanation: "PPV = (0.9×0.1)/[(0.9×0.1)+(0.05×0.9)] = 0.09/0.135 ≈ 67%.",
    steps: ["TP=0.09", "FP=0.045", "PPV=0.09/0.135≈67%"],
    tags: ["predictive-value"],
    blueprintDomain: "usmle-biostats",
  },
  {
    stepLevel: "step3",
    subjectId: "internal-medicine",
    vignette: "Oncology: carboplatin dose AUC 5, GFR estimated 80 mL/min (Calvert formula: dose mg = AUC × [GFR + 25]).",
    stem: "What is the calculated carboplatin dose (mg)?",
    options: o("375 mg", "425 mg", "525 mg", "625 mg"),
    correct: "525 mg",
    explanation: "Dose = 5 × (80 + 25) = 5 × 105 = 525 mg.",
    steps: ["GFR+25=105", "5×105=525 mg"],
    tags: ["oncology", "calvert"],
    blueprintDomain: "usmle-biostats",
  },
  {
    stepLevel: "step3",
    subjectId: "internal-medicine",
    vignette: "Diagnostic study: sensitivity 80%, specificity 90%.",
    stem: "What is the positive likelihood ratio (LR+)? (Round to one decimal.)",
    options: o("4.0", "6.0", "8.0", "10.0"),
    correct: "8.0",
    explanation: "LR+ = sensitivity / (1 − specificity) = 0.8 / 0.1 = 8.0.",
    steps: ["LR+ = 0.8/0.1", "= 8.0"],
    tags: ["likelihood-ratio"],
    blueprintDomain: "usmle-biostats",
  },
]);

export const USMLE_CALC_MCQ_ALL = [
  ...USMLE_STEP1_CALC_CURATED,
  ...USMLE_STEP2_CALC_CURATED,
  ...USMLE_STEP3_CALC_CURATED,
];
