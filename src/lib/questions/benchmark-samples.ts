import type { BankItem } from "@/lib/question-bank";
import { rateQuestionQuality } from "./quality-rubric";

/** Gold-standard benchmark items — use for pipeline calibration and staff QA. */
export const BENCHMARK_QUESTIONS: BankItem[] = [
  {
    id: "benchmark-nclex-sepsis",
    subjectId: "med-surg",
    topicCategory: "critical-care",
    blueprintTopic: "sepsis",
    blueprintDomain: "physiological-adaptation",
    difficulty: 4,
    itemType: "vignette",
    source: "curated",
    reviewStatus: "approved",
    scenario:
      "A 68-year-old with type 2 diabetes is brought to the ED with fever, confusion, and hypotension. Temp 39.1°C, HR 118, BP 88/52, RR 24, SpO2 94% on room air. Lactate 3.8 mmol/L. Broad-spectrum antibiotics are ordered.",
    question:
      "Which intervention should the nurse prioritize in the first hour for this client?",
    options: [
      "Administer scheduled insulin per sliding scale",
      "Initiate 30 mL/kg IV crystalloid bolus",
      "Place the client in high Fowler's position only",
      "Obtain a repeat CBC in 6 hours",
    ],
    correctAnswer: "Initiate 30 mL/kg IV crystalloid bolus",
    explanation:
      "Surviving Sepsis Campaign guidelines prioritize early recognition, blood cultures before antibiotics when feasible, broad-spectrum antibiotics within 1 hour, and IV fluid resuscitation for hypotension or lactate ≥4 (or ≥2 with hypotension). A 30 mL/kg crystalloid bolus addresses hypoperfusion. Insulin and delayed labs do not treat septic shock.",
    clinicalReasoning:
      "Sepsis = infection + organ dysfunction. Hypotension + elevated lactate indicates tissue hypoperfusion requiring immediate volume resuscitation.",
    distractorRationale: {
      "Administer scheduled insulin per sliding scale":
        "Hyperglyceemia may occur but is not the priority in septic shock resuscitation.",
      "Place the client in high Fowler's position only":
        "Positioning alone does not restore perfusion.",
      "Obtain a repeat CBC in 6 hours":
        "Delayed monitoring misses the golden hour for sepsis bundles.",
    },
    references: [{ label: "Surviving Sepsis Campaign", citation: "2021 update" }],
    tags: ["sepsis", "critical-care", "nclex"],
  },
  {
    id: "benchmark-naplex-warfarin",
    subjectId: "pharmacotherapy",
    topicCategory: "anticoagulation",
    blueprintTopic: "warfarin",
    blueprintDomain: "patient-assessment",
    difficulty: 3,
    itemType: "mcq",
    source: "curated",
    reviewStatus: "approved",
    question:
      "A patient starting warfarin asks which over-the-counter product is safest for occasional headaches. Which counseling point is most appropriate?",
    options: [
      "Acetaminophen is generally preferred over NSAIDs",
      "Ibuprofen is preferred because it does not affect INR",
      "Aspirin 325 mg daily is recommended for cardioprotection",
      "All OTC analgesics are equally safe with warfarin",
    ],
    correctAnswer: "Acetaminophen is generally preferred over NSAIDs",
    explanation:
      "NSAIDs increase bleeding risk via platelet effects and GI mucosal injury, potentiating warfarin-related hemorrhage. Acetaminophen at standard doses has minimal effect on INR when used short-term, though very high doses may modestly increase INR. Routine aspirin adds antiplatelet bleeding risk without indication here.",
    distractorRationale: {
      "Ibuprofen is preferred because it does not affect INR":
        "NSAIDs significantly increase bleeding risk with warfarin regardless of INR monitoring.",
      "Aspirin 325 mg daily is recommended for cardioprotection":
        "Dual antithrombotic therapy requires explicit indication; not for OTC headache advice.",
      "All OTC analgesics are equally safe with warfarin":
        "Bleeding risk varies substantially by agent.",
    },
    tags: ["warfarin", "naplex", "otc"],
  },
  {
    id: "benchmark-usmle-aki",
    subjectId: "nephrology",
    topicCategory: "renal",
    blueprintTopic: "acute-kidney-injury",
    blueprintDomain: "step2-clinical",
    difficulty: 4,
    itemType: "vignette",
    source: "curated",
    reviewStatus: "approved",
    scenario:
      "A 72-year-old man undergoes cardiac catheterization. Creatinine rises from 1.0 to 2.4 mg/dL over 48 hours. Urine output 0.3 mL/kg/hr. Urinalysis shows muddy brown casts.",
    question: "What is the most likely diagnosis?",
    options: [
      "Prerenal azotemia",
      "Acute tubular necrosis",
      "Acute interstitial nephritis",
      "Postrenal obstruction",
    ],
    correctAnswer: "Acute tubular necrosis",
    explanation:
      "Contrast exposure with rising creatinine, oliguria, and muddy brown casts indicates ATN — the classic post-ischemic/toxic tubular injury pattern. Prerenal azotemia shows BUN:Cr >20:1 with bland sediment. AIN presents with eosinophiluria and often drug exposure. Obstruction requires postrenal workup (hydronephrosis).",
    clinicalReasoning:
      "Muddy brown granular casts = ATN until proven otherwise in the post-contrast/ischemic setting.",
    tags: ["aki", "usmle", "nephrology"],
  },
];

export function getBenchmarkRatings() {
  return BENCHMARK_QUESTIONS.map((item) => ({
    id: item.id,
    subjectId: item.subjectId,
    rating: rateQuestionQuality(item),
  }));
}
