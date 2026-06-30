/**
 * 15 oncology-focused NAPLEX calculation MCQs (BSA, mg/m², weight-based, dose adjustments).
 */
import { buildCalcMcqBatch, NAPLEX_PHARM, o } from "./naplex-calc-mcq-helpers";

export const NAPLEX_CALC_MCQ_ONCOLOGY = buildCalcMcqBatch([
  {
    subjectId: "pharmacotherapy-oncology",
    vignette: "Oncology infusion suite: adult patient BSA 1.8 m². Protocol dose 75 mg/m² IV paclitaxel.",
    stem: "What is the calculated dose in mg?",
    options: o("75 mg", "135 mg", "150 mg", "180 mg"),
    correct: "135 mg",
    explanation:
      "BSA-based dose: 75 mg/m² × 1.8 m² = 135 mg paclitaxel. Verify BSA calculation method and renal/hepatic labs before chemotherapy release.",
    steps: [
      "Identify BSA: 1.8 m².",
      "Protocol: 75 mg/m².",
      "Dose = 75 × 1.8 = 135 mg.",
    ],
    blueprintDomain: NAPLEX_PHARM,
    tags: ["oncology-calc"],
  },
  {
    subjectId: "pharmacotherapy-oncology",
    vignette: "Child with BSA 0.85 m² receiving etoposide 100 mg/m² IV on day 1 of cycle.",
    stem: "How many mg should be prepared?",
    options: o("42.5 mg", "85 mg", "100 mg", "170 mg"),
    correct: "85 mg",
    explanation:
      "100 mg/m² × 0.85 m² = 85 mg etoposide. Double-check cycle day, premedications, and extravasation precautions on the MAR.",
    steps: [
      "BSA: 0.85 m².",
      "Dose intensity: 100 mg/m².",
      "Calculated dose = 100 × 0.85 = 85 mg.",
    ],
    blueprintDomain: NAPLEX_PHARM,
    tags: ["oncology-calc"],
  },
  {
    subjectId: "pharmacotherapy-oncology",
    vignette: "Carboplatin Calvert formula: target AUC 5, GFR 60 mL/min for a 55-year-old oncology patient (Calvert: dose = AUC × [GFR + 25]).",
    stem: "What is the calculated carboplatin dose in mg?",
    options: o("300 mg", "425 mg", "500 mg", "625 mg"),
    correct: "425 mg",
    explanation:
      "Calvert dose = AUC × (GFR + 25) = 5 × (60 + 25) = 5 × 85 = 425 mg. Confirm GFR source and maximum dose caps per institutional protocol.",
    steps: [
      "Apply Calvert: dose = AUC × (GFR + 25).",
      "Substitute: 5 × (60 + 25) = 5 × 85.",
      "Calculate: 425 mg carboplatin.",
    ],
    blueprintDomain: NAPLEX_PHARM,
    tags: ["oncology-calc"],
  },
  {
    subjectId: "pharmacotherapy-oncology",
    vignette: "Filgrastim 5 mcg/kg subcutaneous daily after chemotherapy. Patient weighs 68 kg.",
    stem: "How many mcg per dose?",
    options: o("34 mcg", "68 mcg", "340 mcg", "680 mcg"),
    correct: "340 mcg",
    explanation:
      "5 mcg/kg × 68 kg = 340 mcg filgrastim per dose. Counsel on bone pain and when to seek care for fever on neutropenia precautions.",
    steps: [
      "Weight: 68 kg.",
      "Dose: 5 mcg/kg.",
      "340 mcg = 5 × 68.",
    ],
    blueprintDomain: NAPLEX_PHARM,
    tags: ["oncology-calc"],
  },
  {
    subjectId: "pharmacotherapy-oncology",
    vignette: "Protocol reduces next cycle dose by 25% after grade 3 toxicity. Original dose 400 mg.",
    stem: "What is the reduced dose in mg?",
    options: o("100 mg", "200 mg", "300 mg", "350 mg"),
    correct: "300 mg",
    explanation:
      "25% reduction: 400 mg × 0.75 = 300 mg. Document toxicity grade and prescriber approval on the chemotherapy verification record.",
    steps: [
      "Original dose: 400 mg.",
      "Reduction: 25% → retain 75%.",
      "400 × 0.75 = 300 mg.",
    ],
    blueprintDomain: NAPLEX_PHARM,
    tags: ["oncology-calc"],
  },
  {
    subjectId: "pharmacotherapy-oncology",
    vignette: "Cyclophosphamide 600 mg/m² IV. Patient BSA 1.5 m² (hydration protocol ordered separately).",
    stem: "What is the cyclophosphamide dose in mg?",
    options: o("600 mg", "750 mg", "900 mg", "1,200 mg"),
    correct: "900 mg",
    explanation:
      "600 mg/m² × 1.5 m² = 900 mg cyclophosphamide. Verify mesna coverage and hydration orders per emesis-risk protocol.",
    steps: [
      "Dose intensity: 600 mg/m².",
      "BSA: 1.5 m².",
      "900 mg = 600 × 1.5.",
    ],
    blueprintDomain: NAPLEX_PHARM,
    tags: ["oncology-calc"],
  },
  {
    subjectId: "pharmacotherapy-oncology",
    vignette: "High-dose methotrexate 1,500 mg/m² for osteosarcoma. Adolescent BSA 1.2 m².",
    stem: "How many mg of methotrexate are ordered?",
    options: o("1,200 mg", "1,500 mg", "1,800 mg", "2,400 mg"),
    correct: "1,800 mg",
    explanation:
      "1,500 mg/m² × 1.2 m² = 1,800 mg methotrexate. Confirm leucovorin rescue timing and hydration/alkalinization orders before dispensing.",
    steps: [
      "Protocol: 1,500 mg/m².",
      "BSA: 1.2 m².",
      "Dose = 1,500 × 1.2 = 1,800 mg.",
    ],
    blueprintDomain: NAPLEX_PHARM,
    tags: ["oncology-calc"],
  },
  {
    subjectId: "pharmacotherapy-oncology",
    vignette: "Doxorubicin 60 mg/m². Patient BSA 1.7 m². Lifetime cumulative max 450 mg/m² (prior 300 mg/m²).",
    stem: "What is this cycle dose in mg, and is cumulative limit exceeded after this dose?",
    options: o(
      "102 mg; limit not exceeded",
      "102 mg; limit exceeded",
      "170 mg; limit not exceeded",
      "170 mg; limit exceeded"
    ),
    correct: "102 mg; limit not exceeded",
    explanation:
      "Cycle dose: 60 mg/m² × 1.7 m² = 102 mg. Cumulative intensity added = 60 mg/m²; prior 300 + 60 = 360 mg/m², below the 450 mg/m² cap.",
    steps: [
      "Calculate cycle dose: 60 × 1.7 = 102 mg doxorubicin.",
      "This cycle adds 60 mg/m² to lifetime total.",
      "300 + 60 = 360 mg/m² < 450 mg/m² → limit not exceeded.",
    ],
    blueprintDomain: NAPLEX_PHARM,
    tags: ["oncology-calc"],
  },
  {
    subjectId: "pharmacotherapy-oncology",
    vignette: "Dexamethasone 12 mg/m² IV premedication before rituximab. Patient BSA 1.6 m².",
    stem: "How many mg of dexamethasone should be drawn?",
    options: o("12 mg", "19.2 mg", "24 mg", "38.4 mg"),
    correct: "19.2 mg",
    explanation:
      "12 mg/m² × 1.6 m² = 19.2 mg dexamethasone premedication. Confirm timing relative to antihistamine and acetaminophen per infusion protocol.",
    steps: [
      "Premedication intensity: 12 mg/m².",
      "BSA: 1.6 m².",
      "12 × 1.6 = 19.2 mg.",
    ],
    blueprintDomain: NAPLEX_PHARM,
    tags: ["oncology-calc"],
  },
  {
    subjectId: "pharmacotherapy-oncology",
    vignette: "Rituximab 375 mg/m² IV day 1. Patient BSA 1.4 m² (first cycle lymphoma protocol).",
    stem: "What is the rituximab dose in mg?",
    options: o("375 mg", "525 mg", "750 mg", "1,050 mg"),
    correct: "525 mg",
    explanation:
      "375 mg/m² × 1.4 m² = 525 mg rituximab. Verify tumor lysis prophylaxis and infusion rate escalation steps before administration.",
    steps: [
      "Protocol dose: 375 mg/m².",
      "BSA: 1.4 m².",
      "375 × 1.4 = 525 mg.",
    ],
    blueprintDomain: NAPLEX_PHARM,
    tags: ["oncology-calc"],
  },
  {
    subjectId: "pharmacotherapy-oncology",
    vignette: "Leucovorin rescue 15 mg/m² every 6 hours after high-dose methotrexate. BSA 1.3 m².",
    stem: "How many mg per leucovorin dose?",
    options: o("15 mg", "19.5 mg", "26 mg", "39 mg"),
    correct: "19.5 mg",
    explanation:
      "15 mg/m² × 1.3 m² = 19.5 mg leucovorin per rescue dose. Align timing with methotrexate level monitoring per protocol.",
    steps: [
      "Rescue dose: 15 mg/m².",
      "BSA: 1.3 m².",
      "15 × 1.3 = 19.5 mg per dose.",
    ],
    blueprintDomain: NAPLEX_PHARM,
    tags: ["oncology-calc"],
  },
  {
    subjectId: "pharmacotherapy-oncology",
    vignette: "Temozolomide 150 mg/m² PO days 1–5. Patient BSA 1.9 m² (GBM adjuvant cycle 1).",
    stem: "What is the daily temozolomide dose in mg?",
    options: o("150 mg", "285 mg", "300 mg", "570 mg"),
    correct: "285 mg",
    explanation:
      "150 mg/m² × 1.9 m² = 285 mg temozolomide daily on days 1–5. Confirm antiemetic plan and CBC monitoring schedule with the oncology team.",
    steps: [
      "Daily intensity: 150 mg/m².",
      "BSA: 1.9 m².",
      "150 × 1.9 = 285 mg per day.",
    ],
    blueprintDomain: NAPLEX_PHARM,
    tags: ["oncology-calc"],
  },
  {
    subjectId: "pharmacotherapy-oncology",
    vignette: "Cisplatin 75 mg/m² IV. BSA 1.55 m². Pharmacy prepares full dose in 500 mL NS.",
    stem: "How many mg of cisplatin are in the bag?",
    options: o("75 mg", "116 mg", "155 mg", "232 mg"),
    correct: "116 mg",
    explanation:
      "75 mg/m² × 1.55 m² = 116.25 mg → 116 mg cisplatin (per institutional rounding). Confirm pre/post hydration and antiemetic orders.",
    steps: [
      "Dose: 75 mg/m².",
      "BSA: 1.55 m².",
      "75 × 1.55 = 116.25 mg → 116 mg (rounded).",
    ],
    blueprintDomain: NAPLEX_PHARM,
    tags: ["oncology-calc"],
  },
  {
    subjectId: "pharmacotherapy-oncology",
    vignette: "BSA 1.25 m². Vincristine 1.5 mg/m² IV (max single dose 2 mg per protocol).",
    stem: "What is the ordered vincristine dose in mg?",
    options: o("1.25 mg", "1.5 mg", "1.875 mg", "2 mg"),
    correct: "1.875 mg",
    explanation:
      "1.5 mg/m² × 1.25 m² = 1.875 mg vincristine, below the 2 mg cap. Use dedicated chemotherapy workflow and double independent verification.",
    steps: [
      "Protocol: 1.5 mg/m².",
      "BSA: 1.25 m².",
      "1.5 × 1.25 = 1.875 mg (< 2 mg max).",
    ],
    blueprintDomain: NAPLEX_PHARM,
    tags: ["oncology-calc"],
  },
  {
    subjectId: "pharmacotherapy-oncology",
    vignette: "Pegfilgrastim 6 mg fixed dose vs weight-based filgrastim 5 mcg/kg. Patient 120 kg needs filgrastim.",
    stem: "How many mcg filgrastim per weight-based dose?",
    options: o("120 mcg", "600 mcg", "720 mcg", "1,200 mcg"),
    correct: "600 mcg",
    explanation:
      "5 mcg/kg × 120 kg = 600 mcg filgrastim. Compare to pegfilgrastim 6 mg (6,000 mcg) once per cycle when counseling on administration options.",
    steps: [
      "Weight: 120 kg.",
      "Dose: 5 mcg/kg.",
      "5 × 120 = 600 mcg filgrastim per dose.",
    ],
    blueprintDomain: NAPLEX_PHARM,
    tags: ["oncology-calc"],
  },
]);
