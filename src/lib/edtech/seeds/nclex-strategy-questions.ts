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

  // --- Disaster triage / mass casualty (Study Hub: disaster-triage) ---
  mcq({
    subjectId: "management-of-care",
    blueprintTopic: "disaster-triage",
    tags: ["curated", "nclex-strategy", "disaster-triage", "exam-level"],
    vignette:
      "Mass casualty incident after a highway pileup. The nurse is triage officer using START. Four casualties arrive: A walks to the treatment area with a forearm laceration; B is apneic after one airway reposition and has no respirations; C has RR 36 with capillary refill greater than 2 seconds; D follows commands with a closed femur fracture and RR 18.",
    question: "Which casualty should receive a red (immediate) tag?",
    options: [
      "Casualty C — abnormal respirations and delayed perfusion are immediate, salvageable threats under START.",
      "Casualty A — walking wounded should be treated first to clear the triage area.",
      "Casualty B — apnea after airway maneuver warrants prolonged CPR at the scene before tagging others.",
      "Casualty D — closed femur fracture always receives an immediate red tag.",
    ],
    correctAnswer:
      "Casualty C — abnormal respirations and delayed perfusion are immediate, salvageable threats under START.",
    explanation: `Correct: START red tags go to salvageable casualties with immediate RPM threats. Walking wounded are green; apnea after a simple airway maneuver is expectant/black in resource-scarce MCI; stable delayed injuries are yellow (NCSBN NCLEX-RN Test Plan — disaster triage).${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "management-of-care",
    blueprintTopic: "disaster-triage",
    tags: ["curated", "nclex-strategy", "disaster-triage", "exam-level"],
    vignette:
      "Emergency department surge during a mass casualty incident. Resources cannot meet demand. A casualty is not breathing. After opening the airway with a simple maneuver, respirations remain absent.",
    question: "Which START triage tag is most appropriate?",
    options: [
      "Black (expectant/deceased) — do not consume scarce resources on prolonged resuscitation at the scene.",
      "Red (immediate) — begin full ACLS and remain with the client until ROSC.",
      "Yellow (delayed) — reassess after all green tags are treated.",
      "Green (minimal) — instruct the casualty to walk to the minor treatment area.",
    ],
    correctAnswer:
      "Black (expectant/deceased) — do not consume scarce resources on prolonged resuscitation at the scene.",
    explanation: `Correct: In START during MCI, apnea after a simple airway maneuver is tagged expectant/black so resources go to salvageable immediate casualties (NCSBN NCLEX-RN Test Plan).${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "management-of-care",
    blueprintTopic: "disaster-triage",
    tags: ["curated", "nclex-strategy", "disaster-triage", "exam-level"],
    vignette:
      "Community disaster drill. Multiple injured clients arrive. One adult is ambulatory with minor abrasions and asks when they will be seen. Triage is using START color tags.",
    question: "Which action by the nurse is most appropriate for this client?",
    options: [
      "Assign a green (minimal) tag and direct the client to the walking-wounded treatment area for delayed care.",
      "Assign a red tag so the client is seen before critically injured casualties.",
      "Begin a full primary survey and stay with the client until diagnostics are complete.",
      "Refuse to tag the client because ambulatory status means they are not part of the MCI.",
    ],
    correctAnswer:
      "Assign a green (minimal) tag and direct the client to the walking-wounded treatment area for delayed care.",
    explanation: `Correct: Walking wounded receive green/minimal tags and are directed away from immediate care lanes (NCSBN NCLEX-RN Test Plan — disaster & triage).${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "management-of-care",
    blueprintTopic: "disaster-triage",
    tags: ["curated", "nclex-strategy", "disaster-triage", "exam-level"],
    vignette:
      "Chemical plant explosion with possible hazardous exposure. Contaminated casualties are arriving at the ED entrance. The charge nurse is organizing the disaster response.",
    question: "What is the nurse's priority action before providing definitive treatment?",
    options: [
      "Ensure decontamination occurs before casualties enter the main treatment areas when feasible.",
      "Bring all casualties directly into trauma bays to start IV fluids immediately.",
      "Send family members into the hot zone to identify victims faster.",
      "Delay triage tagging until laboratory results confirm toxin levels.",
    ],
    correctAnswer:
      "Ensure decontamination occurs before casualties enter the main treatment areas when feasible.",
    explanation: `Correct: For chemical/radiation events, decontaminate before definitive care when feasible to protect staff and other clients (NCSBN NCLEX-RN Test Plan — disaster management).${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "management-of-care",
    blueprintTopic: "disaster-triage",
    tags: ["curated", "nclex-strategy", "disaster-triage", "exam-level"],
    vignette:
      "START triage. An adult casualty has a respiratory rate of 12/min, capillary refill under 2 seconds, and cannot follow simple commands after a building collapse.",
    question: "Which triage tag should the nurse apply?",
    options: [
      "Red (immediate) — inability to follow commands indicates altered mental status requiring immediate care under START RPM.",
      "Green (minimal) — normal respiratory rate means the casualty can wait indefinitely.",
      "Black (expectant) — any altered mentation is non-survivable in an MCI.",
      "Yellow (delayed) — only open fractures receive immediate tags.",
    ],
    correctAnswer:
      "Red (immediate) — inability to follow commands indicates altered mental status requiring immediate care under START RPM.",
    explanation: `Correct: START uses Respirations, Perfusion, and Mental status (commands). Failure to follow commands with otherwise adequate RPM → immediate/red (NCSBN NCLEX-RN Test Plan).${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "management-of-care",
    blueprintTopic: "disaster-triage",
    tags: ["curated", "nclex-strategy", "disaster-triage", "exam-level"],
    vignette:
      "Hospital incident command during a city-wide mass casualty. ICU beds and ventilators are limited. The nurse is asked how to allocate scarce critical-care resources.",
    question: "Which principle should guide nursing advocacy in this situation?",
    options: [
      "Greatest good for the greatest number — prioritize salvageable clients most likely to benefit from scarce resources.",
      "First-come, first-served regardless of injury severity or resource need.",
      "Provide prolonged one-to-one ICU care at the scene before tagging any casualties.",
      "Treat only pediatric clients until adult resources are exhausted.",
    ],
    correctAnswer:
      "Greatest good for the greatest number — prioritize salvageable clients most likely to benefit from scarce resources.",
    explanation: `Correct: MCI ethics emphasize utilitarianism — allocate scarce resources to maximize lives saved (NCSBN NCLEX-RN Test Plan — disaster triage).${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "management-of-care",
    blueprintTopic: "disaster-triage",
    tags: ["curated", "nclex-strategy", "disaster-triage", "exam-level"],
    vignette:
      "Field triage after a train derailment. A casualty has a respiratory rate of 40/min. Capillary refill is delayed. The nurse opens the airway; the client continues to breathe rapidly.",
    question: "What is the correct triage decision?",
    options: [
      "Tag red (immediate) and move the casualty toward urgent life-saving interventions.",
      "Tag green because the casualty is still breathing without assistance.",
      "Tag black because tachypnea alone is non-survivable.",
      "Withhold a tag until a full set of laboratory values is available.",
    ],
    correctAnswer:
      "Tag red (immediate) and move the casualty toward urgent life-saving interventions.",
    explanation: `Correct: RR >30 (or marked distress) and delayed perfusion meet START immediate criteria — tag and move, do not stay for prolonged workup (NCSBN NCLEX-RN Test Plan).${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "management-of-care",
    blueprintTopic: "disaster-triage",
    tags: ["curated", "nclex-strategy", "disaster-triage", "exam-level"],
    vignette:
      "ED charge nurse during MCI. A well-appearing visitor insists the nurse leave triage to provide bedside comfort to one mildly injured relative while critically tagged clients wait.",
    question: "What is the nurse's best response?",
    options: [
      "Explain that during mass casualty, triage and care follow tag priority to save the most lives, and offer appropriate support resources for the family.",
      "Abandon triage immediately to provide one-to-one comfort care as requested.",
      "Re-tag all yellow clients as red to satisfy family requests.",
      "Stop documenting triage tags because families find the colors upsetting.",
    ],
    correctAnswer:
      "Explain that during mass casualty, triage and care follow tag priority to save the most lives, and offer appropriate support resources for the family.",
    explanation: `Correct: RN role in MCI is triage/coordination by priority, with compassionate communication — not abandoning the system for one request (NCSBN NCLEX-RN Test Plan).${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "management-of-care",
    blueprintTopic: "disaster-triage",
    tags: ["curated", "nclex-strategy", "disaster-triage", "exam-level"],
    vignette:
      "Reverse triage discussion during hospital evacuation after infrastructure failure. Stable inpatients may be moved first so critically ill clients can be transferred with support.",
    question: "Which statement shows correct understanding of reverse triage?",
    options: [
      "Move the most stable clients first so limited staff and equipment can support the critically ill during evacuation.",
      "Evacuate only expectant/black-tagged clients and leave stable clients in place indefinitely.",
      "Ignore triage categories and evacuate rooms in numerical order only.",
      "Keep all ventilated clients last without a transfer plan because they cannot be moved.",
    ],
    correctAnswer:
      "Move the most stable clients first so limited staff and equipment can support the critically ill during evacuation.",
    explanation: `Correct: Reverse triage in evacuation moves stable clients first so resources can escort the critically ill (NCSBN NCLEX-RN Test Plan — disaster management).${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "management-of-care",
    blueprintTopic: "disaster-triage",
    tags: ["curated", "nclex-strategy", "disaster-triage", "exam-level"],
    vignette:
      "START triage documentation. The nurse assigns a yellow tag to a casualty with a closed tibial fracture who follows commands, has RR 18, and capillary refill under 2 seconds.",
    question: "Which documentation element is most important at the time of tagging?",
    options: [
      "Record the triage tag color and time on the casualty so reassessment and handoff remain accurate.",
      "Omit the tag time to avoid legal liability if priorities change.",
      "Document only the mechanism of injury and skip vital observations.",
      "Wait to document until the client reaches the OR.",
    ],
    correctAnswer:
      "Record the triage tag color and time on the casualty so reassessment and handoff remain accurate.",
    explanation: `Correct: Tag color and time support ongoing triage accuracy and handoff during MCI (NCSBN NCLEX-RN Test Plan).${DISTRACTOR_BLOCK}`,
  }),

  // --- Burns & trauma resuscitation (Study Hub: burns-trauma) ---
  mcq({
    subjectId: "physiological-adaptation",
    blueprintTopic: "burns-trauma",
    tags: ["curated", "nclex-strategy", "burns-trauma", "exam-level"],
    vignette:
      "ED. A 70 kg adult has partial- and full-thickness burns estimated at 40% TBSA from a house fire. Parkland formula fluids are ordered. The burn occurred 30 minutes ago; two large-bore IVs are placed.",
    question: "Which urine output goal best indicates adequate fluid resuscitation in the first 24 hours?",
    options: [
      "Approximately 0.5–1 mL/kg/hr of urine output while titrating crystalloid per protocol.",
      "Anuria for the first 8 hours to avoid fluid overload.",
      "Urine output of 5 mL/kg/hr continuously regardless of hemodynamics.",
      "No need to monitor urine output if blood pressure is normal on arrival.",
    ],
    correctAnswer:
      "Approximately 0.5–1 mL/kg/hr of urine output while titrating crystalloid per protocol.",
    explanation: `Correct: Parkland-guided resuscitation is titrated to urine output (~0.5–1 mL/kg/hr in adults) as the key end-organ perfusion marker (NCSBN NCLEX-RN Test Plan — burns).${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "physiological-adaptation",
    blueprintTopic: "burns-trauma",
    tags: ["curated", "nclex-strategy", "burns-trauma", "exam-level"],
    vignette:
      "Burn unit admission. Facial burns, singed nasal hairs, and carbonaceous sputum are noted after a closed-space fire. The client is currently talking in short sentences.",
    question: "What is the nurse's priority concern?",
    options: [
      "Airway compromise from inhalation injury — prepare for early advanced airway management and continuous monitoring.",
      "Delayed wound dressing changes before any airway assessment.",
      "Immediate full-thickness grafting in the ED before airway evaluation.",
      "Restricting oxygen because talking means the airway is definitively secure.",
    ],
    correctAnswer:
      "Airway compromise from inhalation injury — prepare for early advanced airway management and continuous monitoring.",
    explanation: `Correct: Facial burns, soot, and closed-space fire strongly suggest inhalation injury — airway is the priority even if the client is still speaking (NCSBN NCLEX-RN Test Plan).${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "physiological-adaptation",
    blueprintTopic: "burns-trauma",
    tags: ["curated", "nclex-strategy", "burns-trauma", "exam-level"],
    vignette:
      "Adult with circumferential full-thickness burns of the right forearm. Distal pulses are diminishing, pain is out of proportion, and the hand is cool with delayed capillary refill after fluid resuscitation.",
    question: "Which complication should the nurse anticipate and escalate?",
    options: [
      "Compartment syndrome / constricting eschar — notify the provider; escharotomy may be required to restore perfusion.",
      "Expected pain from superficial burns that needs only oral acetaminophen.",
      "Hypervolemia from over-resuscitation as the only explanation for cool extremities.",
      "Delay notification until pulses are completely absent for 2 hours.",
    ],
    correctAnswer:
      "Compartment syndrome / constricting eschar — notify the provider; escharotomy may be required to restore perfusion.",
    explanation: `Correct: Circumferential full-thickness burns can act like a tourniquet — rising pain, coolness, and fading pulses need urgent escalation for possible escharotomy (NCSBN NCLEX-RN Test Plan).${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "physiological-adaptation",
    blueprintTopic: "burns-trauma",
    tags: ["curated", "nclex-strategy", "burns-trauma", "exam-level"],
    vignette:
      "Nurse is estimating TBSA using the rule of nines for an adult. The entire left arm and the entire anterior trunk are burned.",
    question: "Which TBSA estimate is most accurate?",
    options: [
      "27% TBSA — arm 9% plus anterior trunk 18%.",
      "9% TBSA — only the arm counts in rule of nines.",
      "45% TBSA — anterior trunk is counted as 36%.",
      "18% TBSA — the arm is not included when the trunk is burned.",
    ],
    correctAnswer: "27% TBSA — arm 9% plus anterior trunk 18%.",
    explanation: `Correct: Adult rule of nines: each arm 9%, anterior trunk 18% → 27% (NCSBN NCLEX-RN Test Plan — burn assessment).${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "physiological-adaptation",
    blueprintTopic: "burns-trauma",
    tags: ["curated", "nclex-strategy", "burns-trauma", "exam-level"],
    vignette:
      "Parkland formula ordered: 4 mL × kg × %TBSA of lactated Ringer's for the first 24 hours, with half given in the first 8 hours from time of burn. Client is 80 kg with 25% TBSA; burn time was 2 hours ago.",
    question: "Which nursing action is essential when starting resuscitation?",
    options: [
      "Calculate total 24-hour volume, give half over the first 8 hours from burn time (accounting for fluids already given), and monitor urine output closely.",
      "Give the entire 24-hour volume as a single bolus on arrival.",
      "Use D5W as the primary resuscitation fluid for large TBSA burns.",
      "Ignore burn time and restart the 8-hour clock when the client reaches the ICU.",
    ],
    correctAnswer:
      "Calculate total 24-hour volume, give half over the first 8 hours from burn time (accounting for fluids already given), and monitor urine output closely.",
    explanation: `Correct: Parkland timing starts at burn time; half the volume in the first 8 hours with UOP monitoring (NCSBN NCLEX-RN Test Plan).${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "physiological-adaptation",
    blueprintTopic: "burns-trauma",
    tags: ["curated", "nclex-strategy", "burns-trauma", "exam-level"],
    vignette:
      "Burn dressing change. Partial-thickness burns are being cleansed. The client reports severe pain before the procedure begins.",
    question: "Which nursing action is most appropriate?",
    options: [
      "Administer prescribed analgesia so peak effect coincides with the dressing change, then proceed with sterile technique.",
      "Withhold analgesia so the client can report burn depth more accurately during cleaning.",
      "Perform the dressing change as quickly as possible without pain medication to finish faster.",
      "Use only ice directly on open burn wounds for comfort.",
    ],
    correctAnswer:
      "Administer prescribed analgesia so peak effect coincides with the dressing change, then proceed with sterile technique.",
    explanation: `Correct: Premedicate for burn care; sterile technique protects healing tissue — do not withhold analgesia or apply ice to open burns (NCSBN NCLEX-RN Test Plan).${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "physiological-adaptation",
    blueprintTopic: "burns-trauma",
    tags: ["curated", "nclex-strategy", "burns-trauma", "exam-level"],
    vignette:
      "Electrical burn from high-voltage contact. Entry and exit wounds appear small. Cardiac monitoring is in place. The client reports dark urine.",
    question: "Which complication should the nurse prioritize monitoring for?",
    options: [
      "Myoglobinuria and deep tissue injury with risk of acute kidney injury — maintain ordered fluids and monitor urine output and cardiac rhythm.",
      "Only superficial skin injury because external wounds look small.",
      "Hypernatremia as the sole expected finding after electrical injury.",
      "Immediate discharge if the ECG strip is normal on arrival.",
    ],
    correctAnswer:
      "Myoglobinuria and deep tissue injury with risk of acute kidney injury — maintain ordered fluids and monitor urine output and cardiac rhythm.",
    explanation: `Correct: Electrical burns cause deep tissue and muscle injury; dark urine suggests myoglobin — fluids, renal and cardiac monitoring are priorities (NCSBN NCLEX-RN Test Plan).${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "physiological-adaptation",
    blueprintTopic: "burns-trauma",
    tags: ["curated", "nclex-strategy", "burns-trauma", "exam-level"],
    vignette:
      "Trauma bay. A client with 55% TBSA burns develops progressive hoarseness, stridor, and SpO₂ 90% on face mask oxygen after smoke exposure.",
    question: "What is the priority nursing action?",
    options: [
      "Prepare for emergent advanced airway placement and notify the provider/rapid response immediately.",
      "Increase oral fluids and postpone airway intervention until chest radiograph returns.",
      "Remove oxygen because high FiO₂ worsens carbon monoxide readings only.",
      "Focus first on estimating TBSA before addressing the airway.",
    ],
    correctAnswer:
      "Prepare for emergent advanced airway placement and notify the provider/rapid response immediately.",
    explanation: `Correct: Stridor and hoarseness after inhalation injury signal impending airway loss — airway first (NCSBN NCLEX-RN Test Plan — ABC/burns).${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "physiological-adaptation",
    blueprintTopic: "burns-trauma",
    tags: ["curated", "nclex-strategy", "burns-trauma", "exam-level"],
    vignette:
      "Nurse is teaching a family about infection prevention after major burn injury. The client has open wounds and intermittent fever workups.",
    question: "Which teaching point is most important?",
    options: [
      "Strict hand hygiene and aseptic wound care reduce infection risk in burn clients with lost skin barrier.",
      "Fresh flowers and plants at the bedside help recovery and pose no infection risk.",
      "Visitors with active respiratory infections may sit close without masks if visits are short.",
      "Skip wound cleansing on days the client feels well.",
    ],
    correctAnswer:
      "Strict hand hygiene and aseptic wound care reduce infection risk in burn clients with lost skin barrier.",
    explanation: `Correct: Loss of skin barrier makes infection a leading burn mortality risk — hygiene and aseptic care are essential teaching (NCSBN NCLEX-RN Test Plan).${DISTRACTOR_BLOCK}`,
  }),
  mcq({
    subjectId: "physiological-adaptation",
    blueprintTopic: "burns-trauma",
    tags: ["curated", "nclex-strategy", "burns-trauma", "exam-level"],
    vignette:
      "First 24 hours after a large TBSA burn. The nurse reviews fluid orders and notes blood pressure is trending down while urine output falls below the goal despite ordered crystalloid.",
    question: "What should the nurse do next?",
    options: [
      "Notify the provider of inadequate perfusion markers so resuscitation can be reassessed and adjusted per protocol.",
      "Stop all IV fluids immediately to prevent pulmonary edema without notifying the team.",
      "Switch to free water boluses only and discontinue lactated Ringer's independently.",
      "Document the findings and wait until the next shift change to report.",
    ],
    correctAnswer:
      "Notify the provider of inadequate perfusion markers so resuscitation can be reassessed and adjusted per protocol.",
    explanation: `Correct: Falling UOP and BP during burn resuscitation require prompt escalation — do not unilaterally stop fluids or delay reporting (NCSBN NCLEX-RN Test Plan).${DISTRACTOR_BLOCK}`,
  }),
];
