/**
 * Curated NCLEX strategy question seeds — trap-tier, SATA, calc, and gap blueprint areas.
 */
import type { BankItem } from "@/lib/question-bank";

const DISTRACTOR_BLOCK = `
**Why other options are incorrect**
- **Incorrect —** Plausible nursing action but not the FIRST priority for this presentation.
- **Incorrect —** Correct eventually; unsafe to prioritize before ABC stabilization.
- **Incorrect —** Teaching or screening task unrelated to acute findings in the stem.`;

const NCSBN_REF = {
  label: "NCSBN NCLEX-RN Test Plan",
  citation: "Clinical Judgment Measurement Model",
} as const;

const IDSA_NEUTROPENIC_REF = {
  label: "IDSA Neutropenic Fever Guideline",
  citation: "Clinical practice guideline for the use of antimicrobial agents in neutropenic patients with cancer",
} as const;

function mcq(partial: BankItem): BankItem {
  return {
    itemType: "vignette",
    subjectId: "management-of-care",
    tags: ["curated", "nclex-strategy", "exam-level"],
    references: [NCSBN_REF],
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

  // --- Chemotherapy / neutropenic precautions (Study Hub: chemotherapy-toxicity) ---
  mcq({
    subjectId: "reduction-risk",
    blueprintTopic: "chemotherapy-side-effects",
    tags: ["curated", "nclex-strategy", "chemotherapy-side-effects", "exam-level"],
    references: [IDSA_NEUTROPENIC_REF, NCSBN_REF],
    vignette:
      "Outpatient oncology clinic. A 52-year-old woman completed cycle 3 of doxorubicin/cyclophosphamide 10 days ago. Today's labs show ANC 380/mm³. Oral temperature is 101.4°F (38.6°C). She reports chills and mild mucositis but is hemodynamically stable.",
    question: "What is the nurse's priority action?",
    options: [
      "Notify the provider immediately, obtain cultures per protocol, and prepare for empiric broad-spectrum antibiotics for neutropenic fever.",
      "Reassure the client that low-grade fever is expected at nadir and schedule follow-up in 48 hours.",
      "Administer a live attenuated influenza vaccine before discharge to reduce infection risk.",
      "Encourage rectal temperature monitoring at home for more accurate readings during neutropenia.",
    ],
    correctAnswer:
      "Notify the provider immediately, obtain cultures per protocol, and prepare for empiric broad-spectrum antibiotics for neutropenic fever.",
    explanation: `Correct: Neutropenic fever (temp ≥100.4°F with ANC <500) is an oncologic emergency — cultures and prompt antibiotics per IDSA Neutropenic Fever Guideline / protocol. Live vaccines and rectal temps are contraindicated in neutropenia.${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "reduction-risk",
    blueprintTopic: "chemotherapy-side-effects",
    tags: ["curated", "nclex-strategy", "chemotherapy-side-effects", "exam-level"],
    references: [NCSBN_REF],
    vignette:
      "Medical-surgical unit. A client receiving IV chemotherapy reports burning pain at the peripheral IV site. The nurse notes swelling and redness along the vein; the infusion is a known vesicant.",
    question: "Which action should the nurse take first?",
    options: [
      "Stop the infusion immediately, leave the catheter in place, aspirate residual drug if protocol allows, and notify the provider for extravasation management.",
      "Increase the IV rate to flush the vesicant through the vein quickly.",
      "Apply a warm compress and continue the infusion at a slower rate.",
      "Remove the IV catheter immediately and discard without notifying the provider.",
    ],
    correctAnswer:
      "Stop the infusion immediately, leave the catheter in place, aspirate residual drug if protocol allows, and notify the provider for extravasation management.",
    explanation: `Correct: Suspected vesicant extravasation — stop infusion, do not flush, follow extravasation protocol, notify provider. Do not continue or speed the infusion. Aligns with NCSBN NCLEX-RN Test Plan reduction-of-risk priorities.${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "reduction-risk",
    blueprintTopic: "chemotherapy-side-effects",
    tags: ["curated", "nclex-strategy", "chemotherapy-side-effects", "exam-level"],
    references: [IDSA_NEUTROPENIC_REF, NCSBN_REF],
    vignette:
      "A client with breast cancer is at expected nadir after chemotherapy. ANC is 420/mm³. The nurse is reinforcing neutropenic precautions before discharge.",
    question: "Which teaching point is most important?",
    options: [
      "Report a single oral temperature of 100.4°F (38°C) or higher immediately and avoid crowds, raw foods, and sick contacts while ANC is low.",
      "Take rectal temperatures twice daily for the most accurate fever detection.",
      "Receive the MMR booster this week to strengthen immunity during nadir.",
      "Skip hand hygiene when wearing gloves at home because gloves prevent all transmission.",
    ],
    correctAnswer:
      "Report a single oral temperature of 100.4°F (38°C) or higher immediately and avoid crowds, raw foods, and sick contacts while ANC is low.",
    explanation: `Correct: Neutropenic precautions emphasize early fever reporting and infection-risk reduction per IDSA Neutropenic Fever Guideline teaching priorities. Avoid rectal temps and live vaccines during neutropenia.${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "reduction-risk",
    blueprintTopic: "chemotherapy-side-effects",
    tags: ["curated", "nclex-strategy", "chemotherapy-side-effects", "exam-level"],
    references: [NCSBN_REF],
    vignette:
      "Oncology unit. A client receiving highly emetogenic chemotherapy has severe nausea despite scheduled antiemetics. Mucositis is grade 2. Absolute neutrophil count is 900/mm³.",
    question: "Which nursing intervention has the highest priority?",
    options: [
      "Assess hydration status, maintain oral care with soft toothbrush, and notify the provider if antiemetic regimen needs escalation per protocol.",
      "Offer fresh fruit salad and yogurt to improve nutrition during chemotherapy.",
      "Encourage visitors with mild colds to wear a mask and stay briefly.",
      "Insert a rectal thermometer to trend fever more accurately during mucositis.",
    ],
    correctAnswer:
      "Assess hydration status, maintain oral care with soft toothbrush, and notify the provider if antiemetic regimen needs escalation per protocol.",
    explanation: `Correct: Chemo side-effect management prioritizes hydration, mucositis care, and antiemetic escalation (NCSBN NCLEX-RN Test Plan). Avoid raw foods/sick contacts and rectal instrumentation when myelosuppressed.${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "safety-infection",
    blueprintTopic: "chemotherapy-side-effects",
    tags: ["curated", "nclex-strategy", "chemotherapy-side-effects", "exam-level"],
    references: [IDSA_NEUTROPENIC_REF, NCSBN_REF],
    vignette:
      "Protective isolation. A client on chemotherapy has ANC 250/mm³ and is afebrile. A visitor arrives with a productive cough and asks to enter the room briefly.",
    question: "What is the nurse's best action?",
    options: [
      "Restrict the ill visitor from entering and reinforce that sick contacts must stay away while the client is neutropenic.",
      "Allow a short visit if the visitor wears a surgical mask.",
      "Move the client to a shared room so staff can monitor both clients more easily.",
      "Discontinue protective precautions because the client has no fever.",
    ],
    correctAnswer:
      "Restrict the ill visitor from entering and reinforce that sick contacts must stay away while the client is neutropenic.",
    explanation: `Correct: Neutropenic clients need protection from infectious exposures — ill visitors are restricted regardless of brief intent or masking alone (IDSA Neutropenic Fever Guideline / infection-prevention principles).${DISTRACTOR_BLOCK}`,
  }),

  // --- Hematology / oncology emergencies (Study Hub: heme-oncology) ---
  mcq({
    subjectId: "physiological-adaptation",
    blueprintTopic: "hematology-oncology",
    tags: ["curated", "nclex-strategy", "hematology-oncology", "exam-level"],
    references: [NCSBN_REF],
    vignette:
      "Emergency department. A 24-year-old with sickle cell disease reports severe vaso-occlusive pain in both legs. SpO₂ is 94% on room air. HR 110, BP 128/78. The client rates pain 9/10 and last took opioids 6 hours ago.",
    question: "Which intervention is the priority?",
    options: [
      "Initiate IV access, administer prescribed opioid analgesia promptly, encourage hydration, and apply oxygen if hypoxic per protocol.",
      "Delay analgesia until a complete blood count returns to confirm crisis severity.",
      "Encourage ambulation in the hallway to improve circulation before giving pain medication.",
      "Apply ice packs to both legs to reduce inflammation from vaso-occlusion.",
    ],
    correctAnswer:
      "Initiate IV access, administer prescribed opioid analgesia promptly, encourage hydration, and apply oxygen if hypoxic per protocol.",
    explanation: `Correct: Sickle cell vaso-occlusive crisis priorities are prompt opioids, hydration, and oxygen if hypoxic — do not delay analgesia for labs; avoid ice (NCSBN NCLEX-RN Test Plan physiological adaptation).${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "physiological-adaptation",
    blueprintTopic: "hematology-oncology",
    tags: ["curated", "nclex-strategy", "hematology-oncology", "exam-level"],
    references: [NCSBN_REF],
    vignette:
      "Medical-surgical unit. Platelet count is 18,000/µL. The client asks for intramuscular vitamin B12 and reports gum bleeding when brushing.",
    question: "Which nursing action is most appropriate?",
    options: [
      "Hold IM injections, implement bleeding precautions (soft toothbrush, no rectal temps), and notify the provider about the critically low platelet count.",
      "Administer the IM injection in the deltoid using a small-gauge needle.",
      "Encourage aspirin for headache because platelets are already low.",
      "Schedule a rectal temperature every 4 hours to monitor for occult bleeding.",
    ],
    correctAnswer:
      "Hold IM injections, implement bleeding precautions (soft toothbrush, no rectal temps), and notify the provider about the critically low platelet count.",
    explanation: `Correct: Severe thrombocytopenia requires bleeding precautions — avoid IM/rectal routes and NSAIDs/aspirin unless ordered; notify provider (NCSBN NCLEX-RN Test Plan).${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "physiological-adaptation",
    blueprintTopic: "hematology-oncology",
    tags: ["curated", "nclex-strategy", "hematology-oncology", "exam-level"],
    references: [NCSBN_REF],
    vignette:
      "Oncology unit day 2 after induction chemotherapy for acute leukemia. Labs: K⁺ 6.1 mEq/L, uric acid elevated, phosphate high, calcium low. The client has decreased urine output.",
    question: "What complication should the nurse suspect and prioritize?",
    options: [
      "Tumor lysis syndrome — notify the provider, ensure IV hydration, cardiac monitoring, and prepare ordered interventions for hyperkalemia and hyperuricemia.",
      "Simple dehydration from poor oral intake — encourage oral fluids only.",
      "Expected chemotherapy nausea — give PRN antiemetic and recheck labs tomorrow.",
      "Hypokalemia from diarrhea — administer potassium chloride immediately without an order.",
    ],
    correctAnswer:
      "Tumor lysis syndrome — notify the provider, ensure IV hydration, cardiac monitoring, and prepare ordered interventions for hyperkalemia and hyperuricemia.",
    explanation: `Correct: Rising K⁺/uric acid/phosphate with falling calcium after chemo induction indicates tumor lysis — hydrate, monitor, treat electrolytes per order (NCSBN NCLEX-RN Test Plan oncologic emergency).${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "physiological-adaptation",
    blueprintTopic: "hematology-oncology",
    tags: ["curated", "nclex-strategy", "hematology-oncology", "exam-level"],
    references: [IDSA_NEUTROPENIC_REF, NCSBN_REF],
    vignette:
      "A client with acute leukemia has ANC 200/mm³ and develops a temperature of 100.8°F (38.2°C). Blood pressure is 108/70 and the client is alert.",
    question: "Which action is the priority?",
    options: [
      "Treat as neutropenic fever: notify the provider immediately, obtain cultures, and prepare for prompt broad-spectrum antibiotics per protocol.",
      "Document the fever and reassess in 4 hours because blood pressure is stable.",
      "Give acetaminophen and wait for morning labs before calling the provider.",
      "Start contact precautions only and defer antibiotics until culture results return.",
    ],
    correctAnswer:
      "Treat as neutropenic fever: notify the provider immediately, obtain cultures, and prepare for prompt broad-spectrum antibiotics per protocol.",
    explanation: `Correct: Neutropenia plus fever is an oncologic emergency even if the client appears stable — do not delay cultures/antibiotics for morning labs (IDSA Neutropenic Fever Guideline).${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "physiological-adaptation",
    blueprintTopic: "hematology-oncology",
    tags: ["curated", "nclex-strategy", "hematology-oncology", "exam-level"],
    references: [NCSBN_REF],
    vignette:
      "Fifteen minutes into a packed red blood cell transfusion, the client develops chills, back pain, and BP drops from 128/76 to 92/54. The nurse stops the transfusion.",
    question: "What is the next priority action?",
    options: [
      "Maintain IV access with normal saline through new tubing, notify the provider and blood bank, and monitor vital signs for acute hemolytic transfusion reaction.",
      "Restart the same unit at a slower rate after symptoms improve.",
      "Discard the blood bag immediately without sending it to the blood bank.",
      "Give oral diphenhydramine and continue the transfusion if itching is the only symptom.",
    ],
    correctAnswer:
      "Maintain IV access with normal saline through new tubing, notify the provider and blood bank, and monitor vital signs for acute hemolytic transfusion reaction.",
    explanation: `Correct: Suspected acute hemolytic reaction — stop transfusion, keep IV with NS on new tubing, notify provider/blood bank, monitor. Do not restart the same unit (NCSBN NCLEX-RN Test Plan).${DISTRACTOR_BLOCK}`,
  }),
];
