/**
 * 40 concise NCLEX-NGN v2 seeds — realistic bedside stems, varied CJMM logic.
 */
import type { EnrichedBankItem } from "./seed-helpers";
import { ngnConcise, ngnMcq } from "./ngn-seed-factory";

export const NGN_NURSING_QUALITY_V2: EnrichedBankItem[] = [
  // ── Standalone Bow-tie (5) ─────────────────────────────────────────────
  ngnConcise(
    "physiological-adaptation",
    "ngn_bowtie",
    "ED: 71M HFrEF. BP 90/58, HR 110, lungs crackles bilat, 2+ edema, dizzy standing.",
    "Bow-tie: Select ONE action and TWO findings to monitor.",
    "Give cautious IV fluid bolus per protocol,Orthostatic vital signs,Urine output hourly",
    "Hypotension with volume overload may need cautious bolus while tracking perfusion and output.",
    {
      kind: "bow_tie",
      condition: "Decompensated heart failure with hypotension",
      actions: ["Give cautious IV fluid bolus per protocol", "Stop all diuretics now", "Discharge home", "High sodium diet"],
      monitors: ["Orthostatic vital signs", "Urine output hourly", "Fingerstick only", "Hair loss"],
      monitorPickCount: 2,
    },
    { cjmmStep: "Take action", tags: ["heart-failure"], blueprintDomain: "nclex-physiological" }
  ),
  ngnConcise(
    "pharmacology-nursing",
    "ngn_bowtie",
    "Med-surg: Client on warfarin, INR 5.1, gums bleeding, started TMP-SMX yesterday.",
    "Bow-tie: ONE priority action and TWO monitoring priorities.",
    "Hold warfarin and notify provider,Signs of bleeding,INR recheck",
    "Antibiotic interaction raised INR — hold anticoagulant and monitor bleeding.",
    {
      kind: "bow_tie",
      condition: "Supratherapeutic INR / bleeding risk",
      actions: ["Hold warfarin and notify provider", "Give next warfarin dose", "Leafy greens only", "No follow-up"],
      monitors: ["Signs of bleeding", "INR recheck", "Weekly weights only", "Vision changes only"],
      monitorPickCount: 2,
    },
    { cjmmStep: "Prioritize hypotheses", tags: ["anticoagulation"] }
  ),
  ngnConcise(
    "maternal-child",
    "ngn_bowtie",
    "L&D: 1 hr postpartum, fundus boggy above umbilicus, pad soaked q15min, HR 120, BP 90/55.",
    "Bow-tie: ONE action and TWO assessments.",
    "Fundal massage and uterotonic per protocol,Lochia amount,Vital signs",
    "Boggy fundus + tachycardia = hemorrhage risk — uterotonic and close monitoring.",
    {
      kind: "bow_tie",
      condition: "Postpartum hemorrhage risk",
      actions: ["Fundal massage and uterotonic per protocol", "Early ambulation now", "Ice chips only", "Remove IV"],
      monitors: ["Lochia amount", "Vital signs", "Fetal heart tones", "Diet orders"],
      monitorPickCount: 2,
    },
    { cjmmStep: "Take action", blueprintDomain: "nclex-physiological", tags: ["OB"] }
  ),
  ngnConcise(
    "pediatrics-nursing",
    "ngn_bowtie",
    "PICU: 4yo asthma exacerbation. RR 40, retractions, SpO₂ 89% on 2L NC, speaking short phrases.",
    "Bow-tie: ONE action and TWO monitors.",
    "Nebulized bronchodilator per protocol,Respiratory effort,SpO₂ trend",
    "Moderate-severe exacerbation needs bronchodilator and continuous respiratory monitoring.",
    {
      kind: "bow_tie",
      condition: "Acute asthma exacerbation",
      actions: ["Nebulized bronchodilator per protocol", "Discharge home", "Oral fluids only", "Sedate without assessment"],
      monitors: ["Respiratory effort", "SpO₂ trend", "Daily weight", "Bowel sounds"],
      monitorPickCount: 2,
    },
    { cjmmStep: "Generate solutions", tags: ["peds", "respiratory"] }
  ),
  ngnConcise(
    "psychosocial",
    "ngn_bowtie",
    "Psych unit: Client states intent to overdose tonight; has pills in room.",
    "Bow-tie: ONE immediate action and TWO safety monitors.",
    "1:1 observation and remove harmful items,Suicidal ideation,Risk of self-harm",
    "Active plan with means requires immediate safety precautions.",
    {
      kind: "bow_tie",
      condition: "Acute suicidal risk",
      actions: ["1:1 observation and remove harmful items", "Routine room checks q4h only", "Unsupervised passes", "Discharge planning first"],
      monitors: ["Suicidal ideation", "Risk of self-harm", "Appetite only", "Sleep pattern only"],
      monitorPickCount: 2,
    },
    { cjmmStep: "Take action", blueprintDomain: "nclex-psychosocial", tags: ["safety"] }
  ),

  // ── Standalone MCQ / Trend (5) ─────────────────────────────────────────
  ngnMcq(
    "management-of-care",
    "Charge nurse — 4 clients. Who do you see first?",
    "A) New STEMI with chest pain\nB) Stable appendectomy POD1 teaching\nC) Chronic pain requesting PRN acetaminophen\nD) Discharge teaching on warfarin",
    ["Client A — new STEMI with chest pain", "Client B — stable appendectomy", "Client C — chronic pain PRN", "Client D — warfarin teaching"],
    "Client A — new STEMI with chest pain",
    "Unstable cardiac client outranks stable teaching and routine requests (ABC / acute vs chronic).",
    { cjmmStep: "Prioritize hypotheses", tags: ["prioritization", "delegation"], blueprintDomain: "nclex-safe-care" }
  ),
  ngnMcq(
    "fundamentals",
    "RN has UAP, LPN, and float nurse. Which task is appropriate for UAP?",
    "Which assignment follows scope of practice?",
    ["Ambulate stable post-op client with gait belt", "New tracheostomy suctioning", "IV push opioid", "Discharge insulin teaching"],
    "Ambulate stable post-op client with gait belt",
    "UAP may assist with stable ambulation; airway, IV meds, and teaching stay with licensed staff.",
    { cjmmStep: "Generate solutions", tags: ["delegation"], blueprintDomain: "nclex-safe-care", difficulty: 3 }
  ),
  ngnMcq(
    "pharmacology-nursing",
    "Post-op PCA morphine: RR 8/min, pinpoint pupils, hard to arouse.",
    "Priority nursing action?",
    ["Stop PCA and assess airway; prepare naloxone per protocol", "Increase PCA dose for pain", "Ambulate now", "Document only"],
    "Stop PCA and assess airway; prepare naloxone per protocol",
    "Opioid toxicity threatens airway — stop drug and reverse per protocol.",
    { cjmmStep: "Take action", tags: ["pharm", "safety"] }
  ),
  ngnMcq(
    "med-surg",
    "Post-thyroidectomy 6 hr: tingling fingers, positive Chvostek, anxious.",
    "First action?",
    ["Notify provider; anticipate calcium replacement per protocol", "Encourage deep breathing only", "NPO indefinitely", "Discharge"],
    "Notify provider; anticipate calcium replacement per protocol",
    "Tetany signs after thyroid surgery suggest hypocalcemia — notify and treat.",
    { cjmmStep: "Analyze cues", tags: ["endocrine"] }
  ),
  ngnMcq(
    "health-promotion",
    "52F smoker ready to quit in 1 week. Which response uses motivational interviewing?",
    "Best therapeutic communication?",
    ["What would help you succeed with a quit date next week?", "You must quit today", "Smoking is your choice — not my problem", "Here's a pamphlet; goodbye"],
    "What would help you succeed with a quit date next week?",
    "Open-ended questions elicit change talk (MI principle).",
    { cjmmStep: "Generate solutions", blueprintDomain: "nclex-health-promotion", difficulty: 3, tags: ["psych"] }
  ),

  // ── Highlight (3) ──────────────────────────────────────────────────────
  ngnConcise(
    "physiological-adaptation",
    "ngn_highlight",
    "Emergency department triage after a motor vehicle collision: GCS 14, open femur fracture, cool clammy skin, heart rate 126/min, blood pressure 86/58 mm Hg.",
    "Highlight findings that indicate highest priority.",
    "cool clammy skin,HR 126,BP 86/58",
    "Shock cues (hypotension, tachycardia, cool skin) outrank stable neuro finding.",
    {
      kind: "highlight",
      text: "GCS 14, open femur fracture, cool clammy skin, HR 126, BP 86/58",
      highlights: ["cool clammy skin", "HR 126", "BP 86/58"],
    },
    { cjmmStep: "Recognize cues", tags: ["triage", "shock"] }
  ),
  ngnConcise(
    "safety-infection",
    "ngn_highlight",
    "Isolation room: C. diff, watery stools ×3, abdominal cramping.",
    "Highlight cues requiring immediate infection-control action.",
    "watery stools ×3,C. diff diagnosis",
    "C. diff with active diarrhea requires contact precautions and soap-and-water hand hygiene.",
    {
      kind: "highlight",
      text: "C. diff diagnosis, watery stools ×3, abdominal cramping, afebrile",
      highlights: ["C. diff diagnosis", "watery stools ×3"],
    },
    { cjmmStep: "Recognize cues", blueprintDomain: "nclex-safe-care", tags: ["infection"] }
  ),
  ngnConcise(
    "pediatrics-nursing",
    "ngn_highlight",
    "6-week infant: temp 38.9°C, lethargic, poor feeding 24 hr.",
    "Highlight findings requiring urgent escalation.",
    "temp 38.9°C,lethargic,poor feeding 24 hr",
    "Fever in infant <60 days is an emergency — escalate immediately.",
    {
      kind: "highlight",
      text: "6-week infant, temp 38.9°C, lethargic, poor feeding 24 hr, wet diapers decreased",
      highlights: ["temp 38.9°C", "lethargic", "poor feeding 24 hr"],
    },
    { cjmmStep: "Prioritize hypotheses", tags: ["peds", "sepsis"], difficulty: 5 }
  ),

  // ── Ordered response standalone (2) ────────────────────────────────────
  ngnConcise(
    "physiological-adaptation",
    "ordered_response",
    "Sepsis: lactate 4.0, MAP 60, fever 39.2°C, UOP 20 mL/hr.",
    "Order interventions from first to last priority.",
    "Notify provider / rapid response,Obtain blood cultures,IV fluid bolus,Antibiotics per protocol",
    "Sepsis bundle: recognize, cultures, fluids, antibiotics.",
    {
      kind: "ordered_response",
      options: ["Notify provider / rapid response", "Obtain blood cultures", "IV fluid bolus", "Antibiotics per protocol", "Oral fluids only"],
    },
    { itemType: "ordered_response", cjmmStep: "Prioritize hypotheses", tags: ["sepsis"] }
  ),
  ngnConcise(
    "basic-care-comfort",
    "ordered_response",
    "Immobilized client, stage 2 sacral pressure injury, incontinent.",
    "Order prevention steps (first → last).",
    "Reposition and skin checks,Manage moisture,Pressure-redistribution surface,Nutrition consult",
    "Reposition and moisture control come before surfaces and nutrition.",
    {
      kind: "ordered_response",
      options: ["Reposition and skin checks", "Manage moisture", "Pressure-redistribution surface", "Nutrition consult", "Massage erythema"],
    },
    { itemType: "ordered_response", cjmmStep: "Generate solutions", difficulty: 3, tags: ["skin"] }
  ),

  // ── Matrix / Grid (10) ─────────────────────────────────────────────────
  ngnConcise(
    "med-surg",
    "ngn_matrix",
    "POD2 abdominal surgery.",
    "For each finding, select the best column.",
    "SpO₂ 87% on RA|||Intervene now,Serosanguineous dressing drainage|||Expected,New chest pain|||Intervene now,Absent bowel sounds|||Needs more data",
    "Hypoxia and chest pain need immediate action; drainage may be expected.",
    {
      kind: "matrix",
      rows: ["SpO₂ 87% on RA", "Serosanguineous dressing drainage", "New chest pain", "Absent bowel sounds"],
      columns: ["Intervene now", "Expected", "Needs more data"],
    },
    { cjmmStep: "Analyze cues", blueprintDomain: "nclex-safe-care" }
  ),
  ngnConcise(
    "safety-infection",
    "ngn_matrix",
    "C. diff isolation room.",
    "Match each action to the correct category.",
    "Soap and water hand wash|||Required,Alcohol gel only|||Not sufficient,Dedicated commode|||Required,Ignore signage|||Incorrect",
    "C. diff spores need soap/water; dedicated equipment reduces spread.",
    {
      kind: "matrix",
      rows: ["Soap and water hand wash", "Alcohol gel only", "Dedicated commode", "Ignore signage"],
      columns: ["Required", "Not sufficient", "Incorrect"],
    },
    { blueprintDomain: "nclex-safe-care", tags: ["C-diff"] }
  ),
  ngnConcise(
    "med-surg",
    "ngn_matrix",
    "New chest tube after pneumothorax.",
    "Expected vs needs intervention?",
    "Gentle bubbling in water seal|||Expected,Sudden stop of bubbling + crepitus|||Intervene now,Mild incision pain|||More data,Tidaling with breathing|||Expected",
    "Tidaling and gentle bubbling expected; sudden change suggests air leak/obstruction.",
    {
      kind: "matrix",
      rows: ["Gentle bubbling in water seal", "Sudden stop of bubbling + crepitus", "Mild incision pain", "Tidaling with breathing"],
      columns: ["Expected", "Intervene now", "More data"],
    },
    { tags: ["chest-tube"] }
  ),
  ngnConcise(
    "management-of-care",
    "ngn_matrix",
    "Charge nurse — shift assignments.",
    "Best assignment match for each client?",
    "New trach hour 1|||Experienced RN,Stable d/c teaching|||UAP with RN check,Unstable chest pain|||Experienced RN,Paperwork only new admit|||Oriented float OK",
    "High-acuity and invasive skills need experienced RNs.",
    {
      kind: "matrix",
      rows: ["New trach hour 1", "Stable d/c teaching", "Unstable chest pain", "Paperwork only new admit"],
      columns: ["Experienced RN", "UAP with RN check", "Oriented float OK"],
    },
    { blueprintDomain: "nclex-safe-care", tags: ["delegation"] }
  ),
  ngnConcise(
    "pharmacology-nursing",
    "ngn_matrix",
    "Client starting gentamicin IV.",
    "Match monitoring to category.",
    "Peak/trough levels|||Required,Notify ototoxicity symptoms|||Required,Skip levels if feeling well|||Incorrect,Assess renal function|||Required",
    "Aminoglycosides need levels, renal monitoring, and toxicity education.",
    {
      kind: "matrix",
      rows: ["Peak/trough levels", "Notify ototoxicity symptoms", "Skip levels if feeling well", "Assess renal function"],
      columns: ["Required", "Incorrect"],
    },
    { tags: ["pharm"] }
  ),
  ngnConcise(
    "psychosocial",
    "ngn_matrix",
    "Voluntary psych admission — rights education.",
    "Match right to category.",
    "Refuse medications (if competent)|||Client right,Leave AMA with process|||Client right,Seclusion without order|||Violation,Privacy during visits|||Client right",
    "Competent clients retain rights; seclusion requires order and monitoring.",
    {
      kind: "matrix",
      rows: ["Refuse medications (if competent)", "Leave AMA with process", "Seclusion without order", "Privacy during visits"],
      columns: ["Client right", "Violation"],
    },
    { blueprintDomain: "nclex-psychosocial" }
  ),
  ngnConcise(
    "maternal-child",
    "ngn_matrix",
    "Labor: FHR tracing review.",
    "Classify each finding.",
    "Late decels with contractions|||Intervene now,Moderate variability|||Reassuring,Variable decels with cord compression pattern|||Intervene now,Accelerations present|||Reassuring",
    "Late decels and concerning variables need intervention; accelerations reassuring.",
    {
      kind: "matrix",
      rows: ["Late decels with contractions", "Moderate variability", "Variable decels with cord compression pattern", "Accelerations present"],
      columns: ["Reassuring", "Intervene now"],
    },
    { tags: ["OB", "FHR"] }
  ),
  ngnConcise(
    "pediatrics-nursing",
    "ngn_matrix",
    "School-age child with T1DM — parent asks about sick-day rules.",
    "Match teaching point to category.",
    "Check glucose q3-4h|||Required,Hold all insulin if not eating|||Incorrect,Small sips if alert|||Required,Ignore ketones|||Incorrect",
    "Sick-day rules: continue insulin adjustments per plan, monitor glucose/ketones, hydration.",
    {
      kind: "matrix",
      rows: ["Check glucose q3-4h", "Hold all insulin if not eating", "Small sips if alert", "Ignore ketones"],
      columns: ["Required", "Incorrect"],
    },
    { tags: ["peds", "diabetes"] }
  ),
  ngnConcise(
    "reduction-risk",
    "ngn_matrix",
    "Older adult fall risk assessment.",
    "Match intervention to category.",
    "Bed alarm|||Fall precaution,Slippery socks only|||Increases risk,Routine toileting schedule|||Fall precaution,Restraints for convenience|||Violation",
    "Fall bundle: alarms, toileting, safe footwear — not convenience restraints.",
    {
      kind: "matrix",
      rows: ["Bed alarm", "Slippery socks only", "Routine toileting schedule", "Restraints for convenience"],
      columns: ["Fall precaution", "Increases risk", "Violation"],
    },
    { blueprintDomain: "nclex-safe-care", difficulty: 3 }
  ),
  ngnConcise(
    "physiological-adaptation",
    "ngn_matrix",
    "DKA resolving: glucose 240, K+ 3.2, pH improving.",
    "Match finding to priority.",
    "Potassium 3.2|||Replace per protocol,Continue IV fluids|||Continue,Stop all insulin|||Incorrect,Discharge now|||Incorrect",
    "During DKA treatment, hypokalemia as insulin drives K+ intracellularly is a key risk.",
    {
      kind: "matrix",
      rows: ["Potassium 3.2", "Continue IV fluids", "Stop all insulin", "Discharge now"],
      columns: ["Replace per protocol", "Continue", "Incorrect"],
    },
    { tags: ["DKA"] }
  ),

  // ── Case-based shorter (10) ────────────────────────────────────────────
  ngnMcq(
    "management-of-care",
    "A 54-year-old woman with type 2 diabetes was admitted with blood glucose 418 mg/dL. She is alert with dry mucous membranes.",
    "Priority action?",
    ["Administer insulin per protocol and assess fluids", "Oral fluids only", "Trendelenburg", "Hold insulin"],
    "Administer insulin per protocol and assess fluids",
    "Symptomatic hyperglycemia needs insulin and fluid assessment.",
    { cjmmStep: "Take action", tags: ["case", "diabetes"], itemType: "case_study", caseStep: 1 }
  ),
  ngnMcq(
    "med-surg",
    "The same client received insulin. Blood glucose is now 210 mg/dL, mucous membranes remain dry, and blood pressure is 100/62 mm Hg.",
    "Next priority?",
    ["Continue IV fluids and monitor electrolytes", "Discharge", "NPO forever", "Stop all meds"],
    "Continue IV fluids and monitor electrolytes",
    "Resolving glucose but dehydration persists — fluids and electrolytes.",
    { cjmmStep: "Evaluate outcomes", tags: ["case", "unfolding"], itemType: "case_study", caseStep: 2 }
  ),
  ngnMcq(
    "pediatrics-nursing",
    "Peds unit: 18mo dehydration, cap refill 4 sec, tears absent, lethargic.",
    "Priority?",
    ["Establish IV access and notify provider", "Oral rehydration only now", "Discharge", "Wait 24 hr"],
    "Establish IV access and notify provider",
    "Moderate-dehydration signs in toddler need urgent IV/ provider.",
    { cjmmStep: "Take action", tags: ["case", "peds"] }
  ),
  ngnMcq(
    "maternal-child",
    "Labor room: G1P0, cervix 8 cm, FHR 90s between contractions.",
    "Immediate action?",
    ["Reposition mother, stop oxytocin if infusing, notify provider", "Prep for discharge", "Ambulate", "Ignore tracing"],
    "Reposition mother, stop oxytocin if infusing, notify provider",
    "FHR 90s = bradycardia category — intrauterine resuscitation measures.",
    { cjmmStep: "Take action", tags: ["case", "OB"] }
  ),
  ngnMcq(
    "psychosocial",
    "Outpatient: client reports increased auditory hallucinations, no plan yet.",
    "Best action?",
    ["Safety assessment and provider contact within session", "Ignore unless suicidal", "Call police immediately", "Schedule next month"],
    "Safety assessment and provider contact within session",
    "Escalating psychosis needs reassessment and safety screening.",
    { cjmmStep: "Analyze cues", blueprintDomain: "nclex-psychosocial", tags: ["case"] }
  ),
  ngnMcq(
    "pharmacology-nursing",
    "Home health: client on digoxin, nausea, vision yellow-green, HR 52.",
    "Action?",
    ["Hold digoxin and notify provider", "Take digoxin early", "Double dose", "No action"],
    "Hold digoxin and notify provider",
    "Digoxin toxicity signs with bradycardia — hold and notify.",
    { cjmmStep: "Recognize cues", tags: ["case", "pharm"] }
  ),
  ngnMcq(
    "fundamentals",
    "Long-term care: resident found on floor, alert, new hip pain, leg shortened.",
    "First action?",
    ["Assess neurovascular status and notify provider", "Ambulate to chair", "Heat pack", "Ignore"],
    "Assess neurovascular status and notify provider",
    "Fall with hip injury signs — assess NV and escalate.",
    { cjmmStep: "Recognize cues", difficulty: 3, tags: ["case"] }
  ),
  ngnMcq(
    "med-surg",
    "ICU: ventilated client, peak pressures rising, SpO₂ dropping, absent breath sounds left.",
    "Priority?",
    ["Assess for tension pneumothorax; prepare for decompression per protocol", "Increase sedation only", "Extubate", "Call family"],
    "Assess for tension pneumothorax; prepare for decompression per protocol",
    "Unilateral absent sounds + pressure spike suggests tension PTX.",
    { cjmmStep: "Take action", tags: ["case", "respiratory"] }
  ),
  ngnMcq(
    "management-of-care",
    "Clinic triage call: caller reports chest pain radiating to jaw, diaphoretic.",
    "Instruction?",
    ["Call 911 now; do not drive self", "Take antacid and wait", "Schedule appointment next week", "Ignore"],
    "Call 911 now; do not drive self",
    "Classic ACS symptoms need emergency services.",
    { cjmmStep: "Take action", blueprintDomain: "nclex-safe-care", tags: ["case"] }
  ),
  ngnMcq(
    "health-promotion",
    "Primary care: 45M BMI 32, BP 142/88, fasting glucose 118.",
    "Priority teaching focus?",
    ["Lifestyle modification for cardiovascular and diabetes prevention", "Ignore until symptomatic", "Only pills", "No follow-up"],
    "Lifestyle modification for cardiovascular and diabetes prevention",
    "Prediabetes + elevated BP — prevention teaching is priority.",
    { cjmmStep: "Generate solutions", blueprintDomain: "nclex-health-promotion", difficulty: 3, tags: ["case"] }
  ),

  // ── Extended SATA + other (5) ──────────────────────────────────────────
  ngnConcise(
    "pharmacology-nursing",
    "select_all",
    "Client on heparin infusion, nosebleed, dark stools, Hgb drop.",
    "Select all actions the nurse should take. (Select all that apply.)",
    "Stop infusion and notify provider,Assess vital signs,Prepare protamine availability per protocol,Increase infusion rate",
    "Bleeding on anticoagulant: stop drug, monitor, reversal per protocol.",
    {
      kind: "select_all",
      options: ["Stop infusion and notify provider", "Assess vital signs", "Prepare protamine availability per protocol", "Increase infusion rate", "Discharge without labs"],
      partialCredit: true,
    },
    { itemType: "select_all", partialCredit: true, cjmmStep: "Take action", tags: ["SATA", "anticoagulation"] }
  ),
  ngnConcise(
    "safety-infection",
    "select_all",
    "Needlestick from used IV needle during busy shift.",
    "Select all immediate steps. (Select all that apply.)",
    "Wash area per protocol,Report to occupational health,Draw source patient labs per policy,Ignore if skin intact",
    "Needlestick protocol: wash, report, source testing per policy.",
    {
      kind: "select_all",
      options: ["Wash area per protocol", "Report to occupational health", "Draw source patient labs per policy", "Ignore if skin intact", "Wait until end of shift"],
      partialCredit: true,
    },
    { itemType: "select_all", partialCredit: true, blueprintDomain: "nclex-safe-care" }
  ),
  ngnConcise(
    "management-of-care",
    "select_all",
    "Discharge teaching for new heart failure client.",
    "Select all essential teaching points. (Select all that apply.)",
    "Daily weights,Low sodium diet,When to call provider,Sskip meds if feeling well",
    "HF teaching: weights, diet, symptoms — never skip meds without provider.",
    {
      kind: "select_all",
      options: ["Daily weights", "Low sodium diet", "When to call provider", "Skip meds if feeling well", "Avoid all fluids"],
      partialCredit: true,
    },
    { itemType: "select_all", partialCredit: true, tags: ["teaching"] }
  ),
  ngnConcise(
    "reduction-risk",
    "select_all",
    "Fire alarm on unit — smoke smell near med room.",
    "Select all first responses. (Select all that apply.)",
    "Pull alarm if not sounding,Close doors,Evacuate per RACE,Use elevator quickly",
    "RACE: rescue, alarm, contain, extinguish/evacuate — no elevators.",
    {
      kind: "select_all",
      options: ["Pull alarm if not sounding", "Close doors", "Evacuate per RACE", "Use elevator quickly", "Hide in med room"],
      partialCredit: true,
    },
    { itemType: "select_all", partialCredit: true, blueprintDomain: "nclex-safe-care" }
  ),
  ngnMcq(
    "fundamentals",
    "A client has potassium 2.9 mEq/L, an order for digoxin, and a history of furosemide therapy.",
    "Cloze: The nurse should ___ before giving digoxin.",
    ["Verify potassium level and hold digoxin if K+ low per protocol", "Give digoxin anyway", "Double diuretic", "No assessment"],
    "Verify potassium level and hold digoxin if K+ low per protocol",
    "Hypokalemia increases digoxin toxicity — verify and hold per protocol.",
    {
      cjmmStep: "Analyze cues",
      tags: ["cloze", "drop-down"],
      itemType: "vignette",
    }
  ),
];
