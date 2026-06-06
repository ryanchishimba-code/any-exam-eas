/**
 * NCLEX-NGN high-yield seeds (2015–2026 clinical judgment trend).
 * Bow-tie, matrix, highlight, unfolding case, select-all, ordered response.
 */
import type { EnrichedBankItem } from "./seed-helpers";
import { enrichItem } from "./seed-helpers";

function ngn(
  subjectId: string,
  itemType: EnrichedBankItem["itemType"],
  vignette: string,
  question: string,
  correctAnswer: string,
  explanation: string,
  ngnPayload: Record<string, unknown>,
  meta: Partial<EnrichedBankItem> = {}
): EnrichedBankItem {
  return enrichItem(
    {
      subjectId,
      question: `${vignette}\n\n${question}`,
      options: ["A", "B", "C", "D"] as [string, string, string, string],
      correctAnswer,
      explanation,
      vignette,
      itemType,
      ngnPayload,
      tags: ["nclex-ngn", "clinical-judgment", ...(meta.tags ?? [])],
      blueprintDomain: meta.blueprintDomain ?? "nclex-physiological",
      difficulty: meta.difficulty ?? 4,
      references: meta.references ?? [
        { label: "NCSBN NCLEX-NGN Clinical Judgment Model", citation: "Recognize cues → Analyze → Prioritize → Generate solutions → Take action → Evaluate" },
      ],
      ...meta,
    },
    { topicCategory: subjectId, itemType, difficulty: 4 }
  );
}

export const NGN_NURSING_SEEDS: EnrichedBankItem[] = [
  ngn(
    "physiological-adaptation",
    "ngn_bowtie",
    "A 68-year-old with HFrEF returns after diuretic adjustment. BP 92/58, HR 112, bilateral crackles, 2+ edema, weight +2 kg, dizziness on standing.",
    "Complete the bow-tie: select ONE action and TWO conditions to monitor.",
    "Administer IV bolus per protocol,Orthostatic hypotension,Daily weights and I/O",
    "Hypotension with overload signs may need cautious fluid per protocol while monitoring orthostasis and fluid balance.",
    {
      kind: "bow_tie",
      condition: "Acute decompensated heart failure with hypotension",
      actions: ["Administer IV bolus per protocol", "Increase fluid restriction only", "Stop all diuretics", "High-Fowler's without assessment"],
      monitors: ["Orthostatic hypotension", "Daily weights and I/O", "Blood glucose q6h", "Deep tendon reflexes"],
      monitorPickCount: 2,
    },
    { tags: ["heart failure", "prioritization"], blueprintDomain: "nclex-physiological" }
  ),
  ngn(
    "reduction-risk",
    "ngn_matrix",
    "Post-operative day 2 after abdominal surgery.",
    "For each finding, indicate whether the nurse should intervene immediately.",
    "Hypoxia SpO₂ 88% on room air|||Intervene immediately,Serosanguineous drainage on dressing|||Expected finding,New onset chest pain|||Intervene immediately,Absent bowel sounds|||Requires further data",
    "Hypoxia and new chest pain need immediate action; serosanguineous drainage may be expected; absent bowel sounds need further assessment.",
    {
      kind: "matrix",
      rows: ["Hypoxia SpO₂ 88% on room air", "Serosanguineous drainage on dressing", "New onset chest pain", "Absent bowel sounds"],
      columns: ["Intervene immediately", "Expected finding", "Requires further data"],
    },
    { blueprintDomain: "nclex-safe-care" }
  ),
  ngn(
    "pharmacology-nursing",
    "ngn_bowtie",
    "A nurse reviews a client on warfarin with INR 4.8, gums bleeding, and recent antibiotic course for UTI.",
    "Bow-tie: select ONE priority action and TWO findings to monitor.",
    "Hold warfarin and notify provider per protocol,Signs of bleeding,INR trend",
    "Supratherapeutic INR with bleeding cues requires holding anticoagulant and close monitoring.",
    {
      kind: "bow_tie",
      condition: "Warfarin toxicity / supratherapeutic INR",
      actions: ["Hold warfarin and notify provider per protocol", "Administer next scheduled dose", "Encourage leafy greens only", "Discharge without follow-up"],
      monitors: ["Signs of bleeding", "INR trend", "Blood pressure only weekly", "Hair growth"],
      monitorPickCount: 2,
    }
  ),
  enrichItem(
    {
      subjectId: "management-of-care",
      question:
        "0900: A 54-year-old with type 2 diabetes admitted for hyperglycemia. Alert, BP 138/84, glucose 412 mg/dL, warm dry skin.\n\nWhat is the nurse's priority action?",
      options: [
        "Administer rapid-acting insulin per sliding scale",
        "Encourage oral fluids only",
        "Trendelenburg position",
        "Restrict carbs without insulin",
      ],
      correctAnswer: "Administer rapid-acting insulin per sliding scale",
      explanation: "Hyperglycemia with dehydration risk requires insulin per protocol and fluid assessment.",
      itemType: "case_study",
      vignette: "0900: A 54-year-old with type 2 diabetes admitted for hyperglycemia. Alert, BP 138/84, glucose 412 mg/dL, warm dry skin.",
      ngnPayload: { kind: "case_study", caseStep: 1 },
      tags: ["nclex-ngn", "diabetes", "prioritization"],
      blueprintDomain: "nclex-physiological",
      difficulty: 4,
    },
    { topicCategory: "management-of-care", itemType: "case_study" }
  ),
  ngn(
    "safety-infection",
    "ngn_matrix",
    "Contact precautions room — client with C. difficile.",
    "Match each action to the correct category.",
    "Hand washing with soap and water|||Required,Alcohol-based gel alone|||Insufficient,Dedicated equipment when possible|||Required,Ignore isolation signage|||Incorrect",
    "C. diff spores require soap/water; dedicated equipment reduces transmission.",
    {
      kind: "matrix",
      rows: ["Hand washing with soap and water", "Alcohol-based gel alone", "Dedicated equipment when possible", "Ignore isolation signage"],
      columns: ["Required", "Insufficient", "Incorrect"],
    },
    { blueprintDomain: "nclex-safe-care" }
  ),
  enrichItem(
    {
      subjectId: "psychosocial",
      question:
        "A client states they feel hopeless and have a plan to overdose tonight. They have access to medication at home.\n\nWhat is the nurse's immediate priority?",
      options: [
        "Maintain continuous observation and initiate suicide precautions per protocol",
        "Schedule outpatient therapy next month",
        "Ask family to hide pills later",
        "Document and continue routine care",
      ],
      correctAnswer: "Maintain continuous observation and initiate suicide precautions per protocol",
      explanation: "Active suicidal ideation with plan and means requires immediate safety interventions.",
      itemType: "vignette",
      blueprintDomain: "nclex-psychosocial",
      difficulty: 4,
      tags: ["nclex-ngn", "mental health", "safety"],
    },
    { topicCategory: "psychosocial", itemType: "vignette" }
  ),
  ngn(
    "pharmacology-nursing",
    "select_all",
    "A nurse prepares morphine IV for a post-op client with RR 10/min, pinpoint pupils, and difficult arousal.",
    "Select all actions the nurse should take. (Select all that apply.)",
    "Hold opioid and notify provider,Naloxone per protocol,Assess airway and breathing,Administer next scheduled dose",
    "Opioid toxicity: hold drug, support airway, naloxone per protocol.",
    { kind: "select_all", options: ["Hold opioid and notify provider", "Naloxone per protocol", "Assess airway and breathing", "Administer next scheduled dose", "Increase opioid for pain"] },
    { itemType: "select_all" }
  ),
  ngn(
    "physiological-adaptation",
    "ordered_response",
    "Septic shock: lactate 4.2, MAP 58, fever 39.4°C, urine output 15 mL/hr.",
    "Place interventions in priority order (first to last).",
    "Activate rapid response / notify provider,Obtain blood cultures,Start IV fluids bolus,Administer broad-spectrum antibiotics",
    "Early recognition, cultures before antibiotics when feasible, fluids and antibiotics per sepsis bundle.",
    { kind: "ordered_response", options: ["Activate rapid response / notify provider", "Obtain blood cultures", "Start IV fluids bolus", "Administer broad-spectrum antibiotics", "Oral fluids only"] },
    { itemType: "ordered_response" }
  ),
  ngn(
    "maternal-child",
    "ngn_bowtie",
    "Postpartum hour 1: fundus boggy above umbilicus, heavy lochia, HR 118, BP 88/50.",
    "Bow-tie: select ONE action and TWO assessments.",
    "Massage fundus and administer uterotonic per protocol,Vital signs and bleeding,Fundus tone",
    "Boggy fundus with tachycardia suggests hemorrhage — uterotonic and close monitoring.",
    {
      kind: "bow_tie",
      condition: "Postpartum hemorrhage risk",
      actions: ["Massage fundus and administer uterotonic per protocol", "Ambulate immediately", "Discharge early", "Withhold fluids"],
      monitors: ["Vital signs and bleeding", "Fundus tone", "Fetal heart rate", "Diet tolerance"],
      monitorPickCount: 2,
    },
    { blueprintDomain: "nclex-physiological" }
  ),
  ngn(
    "med-surg",
    "ngn_matrix",
    "Client with new chest tube after pneumothorax.",
    "Indicate expected vs requires immediate intervention.",
    "Continuous gentle bubbling in water seal chamber|||Expected finding,Sudden cessation of bubbling with crepitus|||Intervene immediately,Mild discomfort at site|||Requires further data,Tidaling with respiration|||Expected finding",
    "Tidaling and gentle bubbling can be expected; sudden changes suggest obstruction or air leak.",
    {
      kind: "matrix",
      rows: ["Continuous gentle bubbling in water seal chamber", "Sudden cessation of bubbling with crepitus", "Mild discomfort at site", "Tidaling with respiration"],
      columns: ["Expected finding", "Intervene immediately", "Requires further data"],
    }
  ),
  ngn(
    "health-promotion",
    "vignette",
    "A 52-year-old smoker requests help quitting. Ready to set a quit date in one week.",
    "Which motivational interviewing response is most appropriate?",
    "What would make a quit date next week work best for you?",
    "MI elicits change talk; open questions support autonomy.",
    { kind: "mcq" },
    {
      itemType: "vignette",
      options: ["What would make a quit date next week work best for you?", "You must quit today or you will die", "Smoking is your choice; I won't help", "Take this pamphlet and leave"] as [string, string, string, string],
      blueprintDomain: "nclex-health-promotion",
      difficulty: 3,
    }
  ),
  ngn(
    "fundamentals",
    "ngn_highlight",
    "Emergency department triage note: 22-year-old after MVC. GCS 13, open femur fracture, cool clammy skin, HR 128, BP 88/60.",
    "Highlight the findings that indicate the highest priority for intervention.",
    "Hypotension and tachycardia with cool clammy skin",
    "Shock physiology (hypotension, tachycardia, cool skin) takes priority over stable findings.",
    {
      kind: "highlight",
      text: "GCS 13, open femur fracture, cool clammy skin, HR 128, BP 88/60",
      highlights: ["cool clammy skin", "HR 128", "BP 88/60"],
    },
    { itemType: "ngn_highlight" }
  ),
  enrichItem(
    {
      subjectId: "pediatrics-nursing",
      question:
        "Pediatric unit: 6-week-old infant, temp 38.9°C, lethargic, poor feeding x 24h.\n\nPriority nursing action?",
      options: [
        "Notify provider immediately and prepare for sepsis workup",
        "Tepid sponge bath only",
        "Aspirin for fever",
        "Discharge with follow-up",
      ],
      correctAnswer: "Notify provider immediately and prepare for sepsis workup",
      explanation: "Fever in infant <60 days is a medical emergency requiring urgent evaluation.",
      itemType: "case_study",
      ngnPayload: { kind: "case_study", caseStep: 1 },
      tags: ["nclex-ngn", "pediatric", "sepsis"],
      blueprintDomain: "nclex-physiological",
      difficulty: 5,
    },
    { topicCategory: "pediatrics-nursing", itemType: "case_study" }
  ),
  ngn(
    "management-of-care",
    "ngn_matrix",
    "Charge nurse assigning four clients at shift start.",
    "Match each client to the most appropriate assignment consideration.",
    "New tracheostomy on hour 1 post-op|||Experienced nurse,Stable med-surg discharge teaching|||Assistive personnel with RN oversight,Unstable chest pain rule-out|||Experienced nurse,New admission routine paperwork only|||Appropriate for float without orientation",
    "Unstable and high-risk skills require experienced RNs; stable tasks may delegate with oversight.",
    {
      kind: "matrix",
      rows: ["New tracheostomy on hour 1 post-op", "Stable med-surg discharge teaching", "Unstable chest pain rule-out", "New admission routine paperwork only"],
      columns: ["Experienced nurse", "Assistive personnel with RN oversight", "Appropriate for float without orientation"],
    },
    { blueprintDomain: "nclex-safe-care" }
  ),
  ngn(
    "basic-care-comfort",
    "ordered_response",
    "Client with stage 3 pressure injury on coccyx, incontinence, limited mobility.",
    "Order preventive interventions from first to last priority.",
    "Frequent repositioning and skin inspection,Manage moisture and incontinence,Use pressure-redistribution surface,Nutrition consult",
    "Repositioning and moisture management are foundational; support surfaces and nutrition follow.",
    {
      kind: "ordered_response",
      options: ["Frequent repositioning and skin inspection", "Manage moisture and incontinence", "Use pressure-redistribution surface", "Nutrition consult", "Massage over erythema"],
    },
    { itemType: "ordered_response", difficulty: 3 }
  ),
];
