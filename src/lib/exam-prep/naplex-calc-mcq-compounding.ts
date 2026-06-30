/**
 * 15 advanced compounding NAPLEX calculation MCQs (alligation, dilution, ratios, powder volumes).
 */
import { buildCalcMcqBatch, o, USP_REF } from "./naplex-calc-mcq-helpers";

export const NAPLEX_CALC_MCQ_COMPOUNDING = buildCalcMcqBatch([
  {
    subjectId: "compounding-calculations",
    vignette: "Compound 120 g of 0.5% hydrocortisone cream using 1% and 0.25% stocks (alligation).",
    stem: "Which quantities are correct?",
    options: o(
      "20 g of 1% + 100 g of 0.25%",
      "30 g of 1% + 90 g of 0.25%",
      "40 g of 1% + 80 g of 0.25%",
      "60 g of 1% + 60 g of 0.25%"
    ),
    correct: "40 g of 1% + 80 g of 0.25%",
    explanation:
      "Alligation: 1% portion (0.5−0.25)/(1−0.25) = 1/3 → 40 g; 0.25% portion (1−0.5)/(1−0.25) = 2/3 → 80 g. Total 120 g at weighted average 0.5%.",
    steps: [
      "Target 0.5% between 1% and 0.25%.",
      "Parts 1%: (0.5−0.25)/(1−0.25) = 1/3 → 40 g of 1%.",
      "Parts 0.25%: (1−0.5)/(1−0.25) = 2/3 → 80 g of 0.25%.",
    ],
    references: [USP_REF],
    tags: ["compounding-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "Prepare 250 mL of 5% dextrose from 50% dextrose concentrate and sterile water.",
    stem: "How many mL of 50% dextrose concentrate are needed?",
    options: o("12.5 mL", "25 mL", "50 mL", "125 mL"),
    correct: "25 mL",
    explanation:
      "C1V1 = C2V2 → 50 × V = 5 × 250 → V = 25 mL concentrate, qs to 250 mL with water. Label final osmolarity and beyond-use date per USP standards.",
    steps: [
      "C1 = 50%, C2 = 5%, V2 = 250 mL.",
      "50 × V1 = 5 × 250 = 1,250.",
      "V1 = 1,250 ÷ 50 = 25 mL concentrate.",
    ],
    references: [USP_REF],
    tags: ["compounding-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "Prepare 480 mL of 30% alcohol from 95% ethanol stock for topical compounding.",
    stem: "How many mL of 95% alcohol are required?",
    options: o("120 mL", "152 mL", "240 mL", "304 mL"),
    correct: "152 mL",
    explanation:
      "C1V1 = C2V2 → 95 × V = 30 × 480 → V ≈ 151.6 mL → 152 mL of 95% ethanol, qs to 480 mL. Follow USP alcohol dilution and flammability precautions.",
    steps: [
      "C1 = 95%, C2 = 30%, final volume 480 mL.",
      "95 × V = 30 × 480 = 14,400.",
      "V = 14,400 ÷ 95 ≈ 152 mL stock alcohol.",
    ],
    references: [USP_REF],
    tags: ["compounding-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "Prescription: 200 mL of a 1:500 (w/v) topical solution.",
    stem: "How many grams of active drug are needed?",
    options: o("0.2 g", "0.4 g", "2 g", "4 g"),
    correct: "0.4 g",
    explanation:
      "1:500 w/v = 1 g per 500 mL. For 200 mL: 200 × (1/500) = 0.4 g active drug. Document beyond-use date per USP compounding standards.",
    steps: [
      "Ratio 1:500 means 1 g drug in 500 mL.",
      "Proportion: g / 200 mL = 1 g / 500 mL.",
      "g = 200 ÷ 500 = 0.4 g.",
    ],
    references: [USP_REF],
    tags: ["compounding-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "Dilute 80 mL of 40% w/v solution to a final concentration of 10% w/v.",
    stem: "What total volume (mL) is needed after adding diluent?",
    options: o("200 mL", "240 mL", "320 mL", "400 mL"),
    correct: "320 mL",
    explanation:
      "C1V1 = C2V2 → 40 × 80 = 10 × Vtotal → Vtotal = 320 mL. Water added = 320 − 80 = 240 mL. Mix thoroughly and label final strength.",
    steps: [
      "C1 = 40%, V1 = 80 mL, C2 = 10%.",
      "40 × 80 = 10 × Vtotal → 3,200 = 10 × Vtotal.",
      "Vtotal = 320 mL (add 240 mL diluent).",
    ],
    references: [USP_REF],
    tags: ["compounding-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "Ointment base 5% w/w active ingredient. Prepare 60 g total weight of ointment.",
    stem: "How many grams of active ingredient are required?",
    options: o("0.3 g", "3 g", "6 g", "30 g"),
    correct: "3 g",
    explanation:
      "5% w/w = 5 g active per 100 g ointment. In 60 g: 5 × 0.6 = 3 g active ingredient. Weigh on analytical balance and geometrically incorporate.",
    steps: [
      "5% w/w = 5 g per 100 g product.",
      "Scale: 60 g is 0.6 × 100 g.",
      "Active = 5 × 0.6 = 3 g.",
    ],
    references: [USP_REF],
    tags: ["compounding-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "Oral suspension: amoxicillin 250 mg/5 mL. Rx 400 mg TID × 7 days. Available powder for reconstitution.",
    stem: "How many mg total are needed for the course?",
    options: o("2,800 mg", "4,200 mg", "8,400 mg", "12,600 mg"),
    correct: "8,400 mg",
    explanation:
      "400 mg TID = 1,200 mg/day × 7 days = 8,400 mg total amoxicillin. Calculate reconstituted volume separately for dispensing label.",
    steps: [
      "Per day: 400 mg × 3 doses = 1,200 mg/day.",
      "Course: 7 days.",
      "Total = 1,200 × 7 = 8,400 mg.",
    ],
    references: [USP_REF],
    tags: ["compounding-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "Capsule compounding: each capsule contains 100 mg drug. Prescription 350 mg daily in divided doses (175 mg BID).",
    stem: "How many capsules per day?",
    options: o("1 capsule", "2 capsules", "3.5 capsules", "4 capsules"),
    correct: "4 capsules",
    explanation:
      "175 mg BID = 350 mg/day. At 100 mg per capsule: 175 ÷ 100 = 1.75 → 2 capsules per dose × 2 doses = 4 capsules/day. Counsel on swallowing instructions.",
    steps: [
      "Each dose: 175 mg.",
      "Capsule strength: 100 mg → 175 ÷ 100 = 1.75 → round up to 2 capsules per dose.",
      "BID: 2 × 2 = 4 capsules per day.",
    ],
    references: [USP_REF],
    tags: ["compounding-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "Mix 50 mL of 20% solution with 150 mL of 5% solution (volumes additive, same solute).",
    stem: "What is the final concentration (% w/v)?",
    options: o("5%", "7.5%", "8.75%", "12.5%"),
    correct: "8.75%",
    explanation:
      "Total solute: (20/100×50) + (5/100×150) = 10 + 7.5 = 17.5 g. Total volume 200 mL → 17.5/200 × 100 = 8.75% w/v. Verify compatibility before combining.",
    steps: [
      "Grams from 20%: 0.20 × 50 mL = 10 g.",
      "Grams from 5%: 0.05 × 150 mL = 7.5 g.",
      "Total 17.5 g / 200 mL = 8.75% w/v.",
    ],
    references: [USP_REF],
    tags: ["compounding-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "Salt factor: drug salt (molecular weight 456) vs base (MW 400). Prescriber orders 200 mg base equivalent.",
    stem: "How many mg of the salt form should be weighed?",
    options: o("200 mg", "228 mg", "252 mg", "456 mg"),
    correct: "228 mg",
    explanation:
      "Salt factor = MW salt ÷ MW base = 456/400 = 1.14. Salt weight = 200 × 1.14 = 228 mg. Document salt-to-base conversion on the compounding record.",
    steps: [
      "Salt factor = 456 ÷ 400 = 1.14.",
      "Base ordered: 200 mg.",
      "Salt to weigh = 200 × 1.14 = 228 mg.",
    ],
    references: [USP_REF],
    tags: ["compounding-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "Evaporation: 100 mL of 2% solution loses 25 mL water. Solute amount unchanged.",
    stem: "What is the new concentration (% w/v)?",
    options: o("2%", "2.5%", "2.67%", "8%"),
    correct: "2.67%",
    explanation:
      "Original solute: 2 g in 100 mL. After evaporation: 2 g in 75 mL → 2/75 × 100 = 2.67% w/v. Label revised strength and beyond-use date after preparation.",
    steps: [
      "Original solute: 2% of 100 mL = 2 g.",
      "Remaining volume: 100 − 25 = 75 mL.",
      "New % = (2 g ÷ 75 mL) × 100 = 2.67% w/v.",
    ],
    references: [USP_REF],
    tags: ["compounding-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "Prepare 100 mL oral solution 1 mg/mL from 10 mg/mL concentrate.",
    stem: "How many mL of concentrate are needed?",
    options: o("1 mL", "10 mL", "50 mL", "100 mL"),
    correct: "10 mL",
    explanation:
      "C1V1 = C2V2 → 10 × V = 1 × 100 → V = 10 mL concentrate, qs to 100 mL. Use suitable oral diluent and amber container if light-sensitive.",
    steps: [
      "C1 = 10 mg/mL, C2 = 1 mg/mL, V2 = 100 mL.",
      "10 × V1 = 1 × 100 = 100.",
      "V1 = 10 mL concentrate.",
    ],
    references: [USP_REF],
    tags: ["compounding-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "Trituration: mix 500 mg drug with 1,500 mg lactose to improve flow. Encapsulate 200 mg per capsule of the mixture.",
    stem: "How many mg of pure drug are in each 200 mg capsule?",
    options: o("25 mg", "50 mg", "100 mg", "150 mg"),
    correct: "50 mg",
    explanation:
      "Mix ratio: 500 mg drug / 2,000 mg total = 25% drug. Each 200 mg capsule: 0.25 × 200 = 50 mg drug. Uniform mixing is critical for content uniformity.",
    steps: [
      "Total mix weight: 500 + 1,500 = 2,000 mg.",
      "Drug fraction: 500 ÷ 2,000 = 0.25 (25%).",
      "Per 200 mg capsule: 200 × 0.25 = 50 mg drug.",
    ],
    references: [USP_REF],
    tags: ["compounding-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "Zinc oxide paste: prepare 454 g of 20% w/w zinc oxide ointment using 40% stock and ointment base.",
    stem: "How many grams of 40% zinc oxide stock are needed?",
    options: o("113 g", "182 g", "227 g", "363 g"),
    correct: "227 g",
    explanation:
      "Need 20% of 454 g = 90.8 g ZnO. From 40% stock: 90.8 ÷ 0.40 = 227 g stock. Remainder is base (227 g). Geometric levigation reduces grittiness.",
    steps: [
      "Target ZnO: 20% × 454 g = 90.8 g.",
      "40% stock provides 0.40 g ZnO per gram stock.",
      "Stock grams = 90.8 ÷ 0.40 = 227 g.",
    ],
    references: [USP_REF],
    tags: ["compounding-calc"],
  },
  {
    subjectId: "compounding-calculations",
    vignette: "Heparin flush: 100 units/mL from 1,000 units/mL vial. Prepare 10 mL syringe.",
    stem: "How many mL of heparin 1,000 units/mL are needed?",
    options: o("0.1 mL", "1 mL", "5 mL", "10 mL"),
    correct: "1 mL",
    explanation:
      "C1V1 = C2V2 → 1,000 × V = 100 × 10 → V = 1 mL heparin concentrate, qs to 10 mL with NS. Use sterile technique and label concentration clearly.",
    steps: [
      "Target: 100 units/mL in 10 mL = 1,000 units total.",
      "Stock: 1,000 units/mL → need 1 mL for 1,000 units.",
      "Add 1 mL heparin + 9 mL NS = 10 mL at 100 units/mL.",
    ],
    references: [USP_REF],
    tags: ["compounding-calc"],
  },
]);
