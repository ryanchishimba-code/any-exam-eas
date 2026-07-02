/**
 * Curated NCLEX strategy question seeds — trap-tier, SATA, calc, and gap blueprint areas.
 */
import type { BankItem } from "@/lib/question-bank";

const DISTRACTOR_BLOCK = `
**Why other options are incorrect**
- **Incorrect —** Plausible nursing action but not the FIRST priority for this presentation.
- **Incorrect —** Correct eventually; unsafe to prioritize before ABC stabilization.
- **Incorrect —** Teaching or screening task unrelated to acute findings in the stem.`;

function mcq(partial: BankItem): BankItem {
  return {
    itemType: "vignette",
    subjectId: "management-of-care",
    tags: ["curated", "nclex-strategy", "exam-level"],
    ...partial,
  };
}

export const NCLEX_STRATEGY_QUESTION_SEEDS: BankItem[] = [
  mcq({
    subjectId: "management-of-care",
    blueprintTopic: "prioritization",
    tags: ["curated", "nclex-strategy", "trap-tier", "prioritization"],
    vignette:
      "Med-surg unit. Room 214: post-op cholecystectomy, RR 28, SpO₂ 88% on 2 L NC, diminished breath sounds at the right base. Room 218: new admit with type 1 diabetes, glucose 412 mg/dL, alert, ketones negative on point-of-care test. Room 220: chronic heart failure, daily weight unchanged, lungs clear. Room 222: UAP reports fresh bloody dressing on hip ORIF, BP 92/58, HR 118.",
    question: "Which client should the nurse see first?",
    options: [
      "Room 222 — active bleeding with hypotension and tachycardia; assess and intervene for hemorrhagic shock first.",
      "Room 214 — hypoxemia and diminished breath sounds; prioritize pulmonary assessment before the surgical patient with bleeding.",
      "Room 218 — hyperglycemia requires insulin and fluid protocol before other clients.",
      "Room 220 — daily weight and lung assessment for heart failure exacerbation.",
    ],
    correctAnswer:
      "Room 222 — active bleeding with hypotension and tachycardia; assess and intervene for hemorrhagic shock first.",
    explanation: `Correct: Active hemorrhage with hypotension is a circulation emergency (ABC) and takes priority over hypoxemia without shock, hyperglycemia without DKA, and stable heart failure.${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "safety-infection",
    blueprintTopic: "infection-control",
    tags: ["curated", "nclex-strategy", "select_all", "sata-style"],
    vignette:
      "A client with watery diarrhea tests positive for Clostridioides difficile. Contact precautions are initiated.",
    question:
      "Which action has the highest priority when the nurse exits the client's room after providing care?",
    options: [
      "Perform hand hygiene with soap and water after removing gloves.",
      "Use alcohol-based hand rub as the primary hand hygiene method.",
      "Discontinue contact precautions after the first formed stool.",
      "Assign insulin administration to UAP to conserve RN time.",
    ],
    correctAnswer: "Perform hand hygiene with soap and water after removing gloves.",
    explanation: `Correct: C. diff spores survive alcohol — soap and water after glove removal is mandatory. Also appropriate (SATA review): sporicidal bleach cleaning, private/cohort room, and never delegating insulin to UAP.

**Why other options are incorrect**
- **Incorrect —** Alcohol gel does not remove C. diff spores.
- **Incorrect —** Do not discontinue contact precautions early without protocol criteria.
- **Incorrect —** Insulin is never delegated to UAP on NCLEX.`,
  }),
  mcq({
    subjectId: "pharmacology-nursing",
    blueprintTopic: "dosage-calculations",
    tags: ["curated", "nclex-strategy", "dosage-calculations", "calculation"],
    vignette:
      "Provider orders heparin infusion 18 units/kg/hr for a client weighing 176 lb. Pharmacy supplies heparin 25,000 units in 500 mL D5W.",
    question: "What is the correct infusion rate in mL/hr? (Round to the nearest tenth.)",
    options: ["14.4 mL/hr", "18.0 mL/hr", "28.8 mL/hr", "36.0 mL/hr"],
    correctAnswer: "28.8 mL/hr",
    explanation: `Correct: 176 lb ÷ 2.2 = 80 kg. Ordered units/hr = 18 × 80 = 1440 units/hr. Concentration = 25,000 units ÷ 500 mL = 50 units/mL. mL/hr = 1440 ÷ 50 = 28.8 mL/hr.${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "maternal-child",
    blueprintTopic: "postpartum-hemorrhage",
    tags: ["curated", "nclex-strategy", "trap-tier"],
    vignette:
      "Postpartum day 0. Fundus boggy above the umbilicus and deviated to the right. Pad saturated in 15 minutes. HR 118, BP 102/68.",
    question: "What is the nurse's priority action?",
    options: [
      "Massage the fundus and assess for bladder distention; initiate hemorrhage protocol and notify the provider.",
      "Begin breastfeeding education to stimulate natural oxytocin release.",
      "Document the finding and recheck fundal height in 4 hours.",
      "Administer PRN acetaminophen for perineal discomfort.",
    ],
    correctAnswer:
      "Massage the fundus and assess for bladder distention; initiate hemorrhage protocol and notify the provider.",
    explanation: `Correct: Boggy fundus with heavy bleeding and tachycardia indicates postpartum hemorrhage — fundus massage, bladder emptying, uterotonic meds, IV access.${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "psychosocial",
    blueprintTopic: "therapeutic-communication",
    tags: ["curated", "nclex-strategy", "foundation"],
    vignette: 'A hospitalized client states, "Nothing matters anymore. I have a plan to end this tonight."',
    question: "What is the nurse's best response?",
    options: [
      "Tell me more about your plan and whether you have access to what you intend to use.",
      "You should not talk like that — you have so much to live for.",
      "I promise I will not tell anyone if you share the details with me.",
      "Let us change the subject to something more positive.",
    ],
    correctAnswer: "Tell me more about your plan and whether you have access to what you intend to use.",
    explanation: `Correct: Direct suicide risk assessment (plan, means, intent) with therapeutic presence — no false reassurance or secrecy.${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "physiological-adaptation",
    blueprintTopic: "electrolytes",
    tags: ["curated", "nclex-strategy", "trap-tier"],
    vignette:
      "Client on hemodialysis missed treatment. K⁺ 6.4 mEq/L. ECG shows peaked T waves.",
    question: "Which action should the nurse take first?",
    options: [
      "Notify the provider immediately and prepare for cardiac monitoring and prescribed emergency interventions.",
      "Encourage high-potassium foods to prevent muscle weakness.",
      "Administer oral kayexelate without provider order.",
      "Document and recheck potassium in 8 hours.",
    ],
    correctAnswer:
      "Notify the provider immediately and prepare for cardiac monitoring and prescribed emergency interventions.",
    explanation: `Correct: Hyperkalemia with peaked T waves is a cardiac emergency — notify provider, monitor, prepare calcium/insulin-glucose per order.${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "pediatrics-nursing",
    blueprintTopic: "pediatric-assessment",
    tags: ["curated", "nclex-strategy", "foundation"],
    vignette: "2-month-old infant, rectal temperature 38.4°C (101.1°F), irritable, feeding poorly.",
    question: "What is the priority nursing action?",
    options: [
      "Notify the provider immediately — fever in an infant under 3 months requires urgent evaluation.",
      "Give acetaminophen and send home with return precautions.",
      "Teach parents about normal temperature variation in infants.",
      "Schedule routine well-baby visit next week.",
    ],
    correctAnswer:
      "Notify the provider immediately — fever in an infant under 3 months requires urgent evaluation.",
    explanation: `Correct: Fever in infant <3 months is a medical emergency until sepsis/meningitis ruled out.${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "management-of-care",
    blueprintTopic: "legal-ethical",
    tags: ["curated", "nclex-strategy", "exam-level"],
    vignette:
      "Competent adult Jehovah's Witness with life-threatening anemia refuses packed red blood cells after informed discussion.",
    question: "What is the nurse's best action?",
    options: [
      "Honor the informed refusal, document the discussion, and notify the provider to discuss alternatives.",
      "Transfuse without consent because the client will die without blood.",
      "Ask the family to override the client's decision.",
      "Delay surgery until the client changes their mind.",
    ],
    correctAnswer:
      "Honor the informed refusal, document the discussion, and notify the provider to discuss alternatives.",
    explanation: `Correct: Competent adults may refuse treatment — document, support, escalate care alternatives.${DISTRACTOR_BLOCK}`,
  }),
];
