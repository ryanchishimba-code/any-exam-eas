import type { BankItem } from "@/lib/question-bank";
import type { ExamQuestion } from "@/lib/ai";
import { enrichQuestion } from "@/lib/engine/stages/enrich-questions";
import { splitCombinedStem } from "@/lib/engine/prompts/vignette";
import { stripShiftNotes, hasShiftNoteArtifacts } from "@/lib/questions/shift-notes";
import { hasSignsAndSymptoms, hasEtiologyOrPathophysiology } from "@/lib/engine/prompts/clinical-reasoning";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import { auditNclexBankItem, resolveNclexStem } from "@/lib/exam-prep/nclex-bank-audit";

const NCLEX_PREFIX = /^NCLEX\s+\d+:\s*/i;

const WEAK_CORRECT_PATTERNS = [
  /^Unstable airway, breathing, or circulation related to/i,
  /^Delegate only tasks within scope/i,
  /^Standard precautions plus transmission-based/i,
  /^Therapeutic communication supporting/i,
  /^Verify rights, dose, route, time/i,
  /^Teach-back to confirm understanding/i,
  /^Evidence-based nursing intervention for/i,
];

const WEAK_OPTION_PATTERNS = [
  /^Stable client requesting discharge teaching only/i,
  /^Client with scheduled routine screening/i,
  /^Client with chronic stable pain rated 2\/10/i,
  /^Initial comprehensive assessment for unstable chest pain/i,
  /^Teaching a new insulin self-administration technique/i,
  /^Triage decisions for four newly admitted clients/i,
  /^Reuse single-dose vials on multiple clients/i,
  /^Skip hand hygiene between clients/i,
  /^You shouldn't feel that way/i,
  /^Administer without checking allergies/i,
  /^Assume understanding if the client nods/i,
  /^Delay intervention until all other clients are discharged/i,
  /^Ignore provider orders and institutional policies/i,
];

type NursingScenario = {
  age: number;
  sex: "man" | "woman";
  setting: string;
  dx: string;
  history: string;
  vitals: string;
  findings: string;
  pathophys: string;
  nursePriority: string;
};

const SCENARIOS: NursingScenario[] = [
  {
    age: 68,
    sex: "woman",
    setting: "Medical-surgical unit",
    dx: "acute decompensated heart failure",
    history: "Admitted 24 hours ago for fluid overload; receiving IV furosemide and daily weights",
    vitals: "BP 88/54 mmHg, HR 112, RR 24, SpO₂ 91% on 2 L nasal cannula",
    findings: "Crackles bilaterally, 2+ pitting edema to knees, weight up 2.5 kg since yesterday, dizziness on standing",
    pathophys:
      "Reduced cardiac output with pulmonary congestion and third-spacing — perfusion and gas exchange are compromised",
    nursePriority: "Assess perfusion and respiratory status; notify provider and prepare for possible fluid/hemodynamic support per protocol",
  },
  {
    age: 54,
    sex: "man",
    setting: "Emergency department",
    dx: "type 2 diabetes with hyperglycemia",
    history: "Long-standing type 2 diabetes; ran out of insulin 2 days ago",
    vitals: "BP 138/84 mmHg, HR 118, RR 28, temp 99.1°F (37.3°C)",
    findings: "Glucose 412 mg/dL, dry mucous membranes, fruity breath odor, skin warm and dry, reports polyuria and thirst",
    pathophys:
      "Insulin deficiency → hyperglycemia, osmotic diuresis, and risk for DKA/HHS — dehydration and acid-base imbalance may follow",
    nursePriority: "Initiate insulin and IV fluids per protocol; monitor glucose, electrolytes, and mental status closely",
  },
  {
    age: 72,
    sex: "man",
    setting: "Medical-surgical unit",
    dx: "COPD exacerbation",
    history: "50-pack-year smoking history; on home oxygen 2 L/min",
    vitals: "BP 148/86 mmHg, HR 104, RR 32, SpO₂ 86% on 2 L nasal cannula",
    findings: "Use of accessory muscles, diminished breath sounds with expiratory wheezes, anxious and speaking in short phrases",
    pathophys:
      "Bronchospasm and air trapping → ventilation-perfusion mismatch and hypoxemia — respiratory failure risk is high",
    nursePriority: "Apply ABC priority: elevate head of bed, increase oxygen per protocol, prepare for bronchodilator therapy and ABG monitoring",
  },
  {
    age: 45,
    sex: "woman",
    setting: "Post-anesthesia care unit",
    dx: "postoperative hypovolemic shock",
    history: "Returned from abdominal surgery 45 minutes ago; estimated blood loss 800 mL intraoperatively",
    vitals: "BP 82/48 mmHg, HR 128, RR 22, SpO₂ 94% on 4 L",
    findings: "Cool clammy skin, capillary refill 4 seconds, urine output 10 mL in the last hour, dressing with moderate serosanguineous drainage",
    pathophys:
      "Volume depletion from surgical blood loss → decreased preload and cardiac output — tissue perfusion is critically reduced",
    nursePriority: "Restore perfusion: notify surgeon/provider, establish large-bore IV access, infuse fluids/blood per protocol, monitor I&O and mental status",
  },
  {
    age: 29,
    sex: "woman",
    setting: "Labor and delivery unit",
    dx: "preeclampsia with severe features",
    history: "G1P0 at 36 weeks; no prenatal complications until today",
    vitals: "BP 168/104 mmHg, HR 96, RR 20, temp 98.6°F (37°C)",
    findings: "3+ protein on urine dipstick, epigastric pain, headache rated 8/10, hyperreflexia with clonus",
    pathophys:
      "Placental vasospasm and endothelial dysfunction → hypertension, CNS irritability, and risk for eclampsia or HELLP",
    nursePriority: "Seizure and blood pressure precautions: magnesium sulfate per protocol, continuous fetal monitoring, notify provider immediately",
  },
  {
    age: 81,
    sex: "woman",
    setting: "Skilled nursing facility",
    dx: "Clostridioides difficile infection",
    history: "Completed a 10-day course of clindamycin 1 week ago for dental infection",
    vitals: "BP 118/72 mmHg, HR 88, RR 18, temp 100.8°F (38.2°C)",
    findings: "Watery diarrhea 6 times in 8 hours, abdominal cramping, WBC 14,000/mm³",
    pathophys:
      "Antibiotic-associated disruption of gut flora → C. diff toxin production and colitis — transmission risk to others is significant",
    nursePriority: "Initiate contact precautions, dedicated equipment, hand hygiene with soap and water, and fluid/electrolyte monitoring",
  },
  {
    age: 19,
    sex: "man",
    setting: "Inpatient psychiatric unit",
    dx: "major depressive disorder with suicidal ideation",
    history: "Admitted after expressing plan to overdose; first psychiatric hospitalization",
    vitals: "BP 122/78 mmHg, HR 82, RR 16",
    findings: "Flat affect, states 'I don't want to be here anymore,' has written a goodbye note, poor eye contact",
    pathophys:
      "Acute psychiatric crisis with expressed intent — safety and continuous observation take priority over routine tasks",
    nursePriority: "Maintain one-to-one observation, remove harmful items, use therapeutic communication, and implement suicide precautions per protocol",
  },
  {
    age: 58,
    sex: "man",
    setting: "Medical-surgical unit",
    dx: "postoperative day 1 after total knee arthroplasty",
    history: "On enoxaparin for DVT prophylaxis; PCA morphine for pain",
    vitals: "BP 132/76 mmHg, HR 92, RR 10, SpO₂ 93% on room air",
    findings: "Somnolent but arousable, pinpoint pupils, shallow respirations, pain rated 1/10",
    pathophys:
      "Opioid-induced respiratory depression from PCA morphine — airway and ventilation are the immediate threat",
    nursePriority: "Assess airway and breathing first; hold PCA, notify provider, prepare naloxone and continuous pulse oximetry per protocol",
  },
  {
    age: 34,
    sex: "woman",
    setting: "Emergency department",
    dx: "anaphylaxis after antibiotic administration",
    history: "Received IV ceftriaxone 10 minutes ago for pyelonephritis; history of penicillin allergy documented",
    vitals: "BP 74/42 mmHg, HR 130, RR 30, SpO₂ 89% on room air",
    findings: "Diffuse urticaria, facial and tongue swelling, audible stridor, anxiety, diaphoresis",
    pathophys:
      "IgE-mediated mast cell degranulation → vasodilation, bronchospasm, and airway edema — rapid progression to airway compromise",
    nursePriority: "Stop the infusion, call for help, administer epinephrine IM per anaphylaxis protocol, maintain airway and prepare for supplemental oxygen",
  },
  {
    age: 62,
    sex: "woman",
    setting: "Telemetry unit",
    dx: "new-onset atrial fibrillation with rapid ventricular response",
    history: "Hypertension and heart failure; admitted for dyspnea and palpitations",
    vitals: "BP 102/68 mmHg, HR 148 irregular, RR 22, SpO₂ 92% on 2 L",
    findings: "Irregularly irregular pulse, reports dizziness and chest pressure, lungs with bibasilar crackles",
    pathophys:
      "Loss of atrial kick with rapid ventricular rate → decreased cardiac output and potential thrombus formation",
    nursePriority: "Continuous cardiac monitoring, assess perfusion and symptoms, prepare for rate control per provider order and stroke-risk evaluation",
  },
  {
    age: 8,
    sex: "man",
    setting: "Pediatric emergency department",
    dx: "moderate asthma exacerbation",
    history: "Known asthma; increased albuterol use over 48 hours after viral URI",
    vitals: "BP 98/62 mmHg, HR 118, RR 32, SpO₂ 90% on room air",
    findings: "Intercostal retractions, expiratory wheezes bilaterally, speaking in short phrases, peak flow 45% of personal best",
    pathophys:
      "Bronchial inflammation and smooth muscle constriction → air trapping and hypoxemia — respiratory distress can escalate quickly in children",
    nursePriority: "Position upright, administer bronchodilator therapy per protocol, continuous pulse oximetry, and prepare for escalation if no improvement",
  },
  {
    age: 50,
    sex: "woman",
    setting: "Outpatient oncology clinic",
    dx: "chemotherapy-induced neutropenia",
    history: "Cycle 3 of doxorubicin/cyclophosphamide; last treatment 10 days ago",
    vitals: "BP 118/74 mmHg, HR 96, RR 18, temp 101.6°F (38.7°C)",
    findings: "Fatigue, chills, oral mucositis, ANC 400/mm³ on today's labs",
    pathophys:
      "Bone marrow suppression from chemotherapy → critically low neutrophils and high risk for sepsis with fever",
    nursePriority: "Treat as oncologic emergency: notify provider immediately, obtain cultures, and prepare for broad-spectrum antibiotics per neutropenic fever protocol",
  },
  {
    age: 77,
    sex: "man",
    setting: "Medical-surgical unit",
    dx: "upper GI bleed",
    history: "History of peptic ulcer disease and aspirin use; melena reported overnight",
    vitals: "BP 90/56 mmHg, HR 118, RR 20, Hgb 7.2 g/dL",
    findings: "Pale, cool extremities, active melena, lightheaded when repositioning, capillary refill 3 seconds",
    pathophys:
      "Acute blood loss → decreased intravascular volume and tissue hypoperfusion — shock may progress without intervention",
    nursePriority: "Establish IV access, infuse fluids/blood per protocol, monitor vital signs and mental status, prepare for endoscopy",
  },
  {
    age: 26,
    sex: "woman",
    setting: "Labor and delivery unit",
    dx: "postpartum hemorrhage",
    history: "Vaginal delivery 30 minutes ago; estimated blood loss now increasing",
    vitals: "BP 94/60 mmHg, HR 124, RR 22",
    findings: "Saturated perineal pad in 5 minutes, uterus boggy above umbilicus, fundal massage minimally effective",
    pathophys:
      "Uterine atony → continued bleeding and hypovolemia — postpartum hemorrhage is a leading cause of maternal morbidity",
    nursePriority: "Fundal massage, notify provider, establish large-bore IV access, administer uterotonics per protocol, monitor I&O and mental status",
  },
  {
    age: 41,
    sex: "man",
    setting: "Medical-surgical unit",
    dx: "deep vein thrombosis with anticoagulation",
    history: "Started warfarin 3 days ago; INR drawn this morning",
    vitals: "BP 126/80 mmHg, HR 88, RR 16",
    findings: "Unilateral calf swelling and warmth, INR 4.8, reports nosebleed and dark tarry stools",
    pathophys:
      "Supratherapeutic anticoagulation → bleeding risk exceeds thrombosis treatment benefit until INR is corrected",
    nursePriority: "Hold warfarin, notify provider, assess bleeding, prepare for vitamin K or other reversal per protocol, repeat INR monitoring",
  },
];

/** Stable clients only — delegation items must not contradict acute findings in the vignette. */
const STABLE_DELEGATION_SCENARIOS: NursingScenario[] = [
  {
    age: 58,
    sex: "man",
    setting: "Medical-surgical unit",
    dx: "postoperative day 2 after total knee arthroplasty",
    history: "Ambulating with physical therapy; tolerating regular diet",
    vitals: "BP 128/74 mmHg, HR 78, RR 16, SpO₂ 97% on room air",
    findings: "Incision intact without drainage, pain 3/10 with scheduled analgesia, alert and oriented",
    pathophys: "Expected postoperative recovery without acute cardiopulmonary compromise",
    nursePriority: "Promote mobility and monitor for routine postoperative complications per protocol",
  },
  {
    age: 44,
    sex: "woman",
    setting: "Medical-surgical unit",
    dx: "type 2 diabetes on basal-bolus insulin",
    history: "Admitted for cellulitis treatment; blood cultures negative on day 2",
    vitals: "BP 122/70 mmHg, HR 84, RR 16, glucose 142 mg/dL before lunch",
    findings: "Afebrile x 24 hours, erythema improving, eating meals, voiding without difficulty",
    pathophys: "Stable glycemic and infection status after initial treatment response",
    nursePriority: "Continue antibiotics and glucose monitoring per protocol; reinforce foot care teaching",
  },
  {
    age: 76,
    sex: "woman",
    setting: "Skilled nursing facility",
    dx: "chronic heart failure with stable volume status",
    history: "Long-term resident; diuretic dose unchanged x 2 weeks",
    vitals: "BP 118/68 mmHg, HR 76, RR 18, SpO₂ 95% on room air",
    findings: "Weight stable x 3 days, lungs clear, no new edema, alert and conversant",
    pathophys: "Compensated heart failure without acute decompensation",
    nursePriority: "Daily weights, I&O, and medication administration per care plan",
  },
  {
    age: 9,
    sex: "man",
    setting: "Pediatric medical unit",
    dx: "asthma with improving exacerbation",
    history: "Admitted yesterday; bronchodilator protocol initiated; parent at bedside",
    vitals: "BP 102/64 mmHg, HR 92, RR 20, SpO₂ 96% on room air",
    findings: "Minimal wheeze, no retractions, speaking in full sentences, peak flow 75% of personal best",
    pathophys: "Bronchospasm resolving after treatment — respiratory status stable on current therapy",
    nursePriority: "Continue scheduled nebulizers, pulse oximetry per protocol, and asthma action plan teaching",
  },
];

type PriorityClient = {
  vignetteLine: string;
  option: string;
  whyNotFirst: string;
};

type PrioritizationSet = {
  setting: string;
  firstIndex: number;
  priorityDiagnosis: string;
  pathophys: string;
  priorityReason: string;
  clients: [PriorityClient, PriorityClient, PriorityClient, PriorityClient];
};

const PRIORITIZATION_SETS: PrioritizationSet[] = [
  {
    setting: "Emergency department",
    firstIndex: 0,
    priorityDiagnosis: "anaphylaxis with airway compromise",
    pathophys:
      "IgE-mediated mast cell degranulation → vasodilation, bronchospasm, and laryngeal edema — airway and perfusion are immediately threatened",
    priorityReason:
      "Airway and circulation take precedence: epinephrine and airway support cannot wait for other workups",
    clients: [
      {
        vignetteLine:
          "Room 4: 34-year-old woman received IV ceftriaxone 15 minutes ago for pyelonephritis. BP 74/42 mmHg, HR 130, RR 30, SpO₂ 89%. Diffuse urticaria, facial/tongue swelling, audible stridor.",
        option:
          "Room 4 — IV antibiotic reaction with hypotension, stridor, and SpO₂ 89% (suspected anaphylaxis)",
        whyNotFirst:
          "Urgent ACS workup, but this client has perfusion and airway compromise requiring immediate epinephrine — chest pain without shock/stridor is second line.",
      },
      {
        vignetteLine:
          "Room 7: 58-year-old man with 40 minutes of substernal pressure, diaphoresis, nausea. BP 156/92, HR 98, SpO₂ 95%. ECG pending; troponin sent.",
        option:
          "Room 7 — new substernal chest pressure with diaphoresis awaiting troponin/ECG",
        whyNotFirst:
          "Possible ACS requires prompt evaluation, but stable SpO₂ and no airway compromise defer to anaphylaxis with stridor and shock.",
      },
      {
        vignetteLine:
          "Room 2: 57-year-old man with type 2 diabetes, out of insulin 48 hours. Glucose 398 mg/dL, HR 116, RR 26, dry mucous membranes, reports nausea.",
        option:
          "Room 2 — hyperglycemia (glucose 398 mg/dL) with tachycardia and dehydration after missed insulin",
        whyNotFirst:
          "Metabolic emergency, but without acute airway compromise; anaphylaxis with stridor is a more immediate ABC threat.",
      },
      {
        vignetteLine:
          "Room 11: 22-year-old man voluntary psych admission for anxiety, denies suicidal plan, contract for safety, vitals stable.",
        option:
          "Room 11 — anxiety on voluntary psych admission with stable vitals and no safety risk expressed",
        whyNotFirst:
          "Psychosocial support is important but lowest acuity among these assignments when another client has stridor and shock.",
      },
    ],
  },
  {
    setting: "Medical-surgical unit",
    firstIndex: 1,
    priorityDiagnosis: "postoperative hemorrhagic shock",
    pathophys:
      "Acute blood loss → decreased intravascular volume and cardiac output — tissue perfusion fails before slower metabolic decompensation",
    priorityReason:
      "Hypotension with dropping hemoglobin and active bleeding requires immediate perfusion assessment and hemorrhage protocol",
    clients: [
      {
        vignetteLine:
          "Room 312: 57-year-old man with type 2 diabetes, missed insulin 2 days. Glucose 412 mg/dL, HR 118, RR 28, fruity breath, dry mucous membranes.",
        option:
          "Room 312 — glucose 412 mg/dL with tachypnea and fruity breath after 2 days without insulin",
        whyNotFirst:
          "DKA is urgent, but the postoperative client shows active hemorrhage with hypotension — perfusion failure is more immediate.",
      },
      {
        vignetteLine:
          "Room 318: 66-year-old woman post-op day 1 after colectomy. BP 92/58 mmHg, HR 122, Hgb 7.4 g/dL (was 10.2 g/dL this morning), abdominal dressing saturated with bright red drainage.",
        option:
          "Room 318 — postoperative hypotension, tachycardia, dropping hemoglobin, and saturated surgical dressing",
        whyNotFirst: "Correct first choice — active bleeding with shock physiology.",
      },
      {
        vignetteLine:
          "Room 322: 52-year-old man reports new chest tightness for 30 minutes, diaphoretic. BP 158/96, HR 104, SpO₂ 93% on room air. Cardiac monitor shows sinus rhythm.",
        option:
          "Room 322 — new chest tightness with diaphoresis and hypertension; cardiac monitor in place",
        whyNotFirst:
          "Evaluate promptly for ACS, but hemodynamic stability and absence of shock defer to active postoperative hemorrhage.",
      },
      {
        vignetteLine:
          "Room 305: 44-year-old woman on IV antibiotics for leg cellulitis, temp 101.4°F (38.6°C), pain 6/10, BP 118/76, HR 92.",
        option:
          "Room 305 — febrile client on IV antibiotics for cellulitis with moderate pain but stable vitals",
        whyNotFirst:
          "Infection requires follow-up, but stable perfusion and chronicity make this lower priority than hemorrhagic shock.",
      },
    ],
  },
  {
    setting: "Medical-surgical unit",
    firstIndex: 0,
    priorityDiagnosis: "opioid-induced respiratory depression",
    pathophys:
      "Opioid excess → decreased respiratory drive and sedation — hypoventilation causes hypercapnia and hypoxemia before other problems progress",
    priorityReason:
      "RR 8 with somnolence after PCA morphine is an immediate airway/breathing threat requiring naloxone assessment",
    clients: [
      {
        vignetteLine:
          "Room 410: 58-year-old man post-op day 1 knee replacement on PCA morphine. RR 8, SpO₂ 91% on room air, somnolent but arousable, pinpoint pupils.",
        option:
          "Room 410 — RR 8, SpO₂ 91%, somnolence, and pinpoint pupils on PCA morphine",
        whyNotFirst: "Correct first choice — opioid respiratory depression threatens airway and ventilation now.",
      },
      {
        vignetteLine:
          "Room 415: 68-year-old woman with heart failure, BP 88/54, HR 112, crackles bilaterally, SpO₂ 91% on 2 L NC, weight up 2 kg.",
        option:
          "Room 415 — hypotension, crackles, and SpO₂ 91% with acute heart failure exacerbation",
        whyNotFirst:
          "Urgent perfusion and respiratory support needed, but the opioid-depressed client has primary hypoventilation (RR 8) — higher ABC priority.",
      },
      {
        vignetteLine:
          "Room 402: 72-year-old man COPD exacerbation, RR 32, SpO₂ 86% on 2 L, accessory muscle use, speaking in short phrases.",
        option:
          "Room 402 — COPD exacerbation with accessory muscle use and SpO₂ 86%",
        whyNotFirst:
          "Respiratory distress is urgent; however RR 8 from opioid depression indicates immediate ventilatory failure risk that precedes compensated tachypnea.",
      },
      {
        vignetteLine:
          "Room 408: 61-year-old woman new onset atrial fibrillation, HR 138 irregular, BP 104/70, dizzy but alert, on telemetry.",
        option:
          "Room 408 — new atrial fibrillation with rapid ventricular response and dizziness on telemetry",
        whyNotFirst:
          "Rate control is needed, but stable mentation and perfusion defer to clients with primary ventilatory failure or shock.",
      },
    ],
  },
  {
    setting: "Labor and delivery unit",
    firstIndex: 0,
    priorityDiagnosis: "preeclampsia with severe features",
    pathophys:
      "Placental malperfusion → endothelial dysfunction, CNS irritability, and seizure risk — eclampsia can occur within minutes",
    priorityReason:
      "Severe-range BP with clonus and epigastric pain requires magnesium and immediate provider notification before less acute OB complaints",
    clients: [
      {
        vignetteLine:
          "Room 3: 29-year-old G1P0 at 36 weeks, BP 168/104 mmHg, headache 8/10, epigastric pain, 3+ protein, hyperreflexia with clonus.",
        option:
          "Room 3 — BP 168/104 with headache, epigastric pain, proteinuria, and clonus at 36 weeks",
        whyNotFirst: "Correct first choice — severe preeclampsia with neurologic/end-organ signs.",
      },
      {
        vignetteLine:
          "Room 5: 26-year-old woman postpartum hour 1, saturated perineal pad in 5 minutes, uterus boggy at umbilicus, HR 118, BP 96/62.",
        option:
          "Room 5 — postpartum hour 1 with boggy uterus, tachycardia, and heavy vaginal bleeding",
        whyNotFirst:
          "Postpartum hemorrhage is emergent; in this set preeclampsia with clonus presents seizure risk that typically precedes stabilization of another room when both are acute — either could be argued, but clonus/severe features mandate immediate magnesium.",
      },
      {
        vignetteLine:
          "Room 8: 31-year-old woman at 38 weeks, reports decreased fetal movement x 12 hours, FHR 130 with moderate variability, no decelerations.",
        option:
          "Room 8 — decreased fetal movement at 38 weeks with currently reassuring FHR tracing",
        whyNotFirst:
          "Requires fetal evaluation, but reassuring tracing and absence of maternal severe features defer to preeclampsia with clonus.",
      },
      {
        vignetteLine:
          "Room 1: 24-year-old woman in active labor, cervical exam 7 cm, pain 8/10, FHR 145 with accelerations, maternal vitals stable.",
        option:
          "Room 1 — active labor with strong contractions and stable maternal vitals",
        whyNotFirst:
          "Expected labor pain with reassuring FHR is lowest acuity among these obstetric clients.",
      },
    ],
  },
  {
    setting: "Inpatient psychiatric unit",
    firstIndex: 0,
    priorityDiagnosis: "acute suicidal ideation with plan",
    pathophys:
      "Acute psychiatric crisis with expressed lethal intent — safety and continuous observation override routine nursing tasks",
    priorityReason:
      "Written goodbye note and stated plan require one-to-one observation and environmental safety immediately",
    clients: [
      {
        vignetteLine:
          "Room 12: 19-year-old man admitted for depression, states 'I know how I would do it,' has written goodbye note, poor eye contact.",
        option:
          "Room 12 — suicidal ideation with stated plan and written goodbye note",
        whyNotFirst: "Correct first choice — immediate safety risk requires observation and ligature-proofing.",
      },
      {
        vignetteLine:
          "Room 9: 45-year-old man alcohol withdrawal, HR 124, tremors, diaphoresis, BP 158/98, last drink 24 hours ago.",
        option:
          "Room 9 — alcohol withdrawal with tachycardia, tremor, and diaphoresis",
        whyNotFirst:
          "Withdrawal requires CIWA monitoring and possible benzodiazepines, but imminent suicide plan takes precedence in psychiatric safety hierarchy.",
      },
      {
        vignetteLine:
          "Room 15: 28-year-old woman manic episode, pacing, pressured speech, refused morning lithium, vitals stable.",
        option:
          "Room 15 — manic episode with refusal of mood stabilizer and hyperactivity",
        whyNotFirst:
          "Medication administration and de-escalation are priorities but not before active suicidal plan with means/intent documented.",
      },
      {
        vignetteLine:
          "Room 6: 52-year-old woman voluntary admission for grief, tearful but denies SI/HI, signed safety contract.",
        option:
          "Room 6 — grief reaction with denied suicidal/homicidal ideation and signed contract",
        whyNotFirst:
          "Supportive care is appropriate; lowest acuity among these psychiatric clients.",
      },
    ],
  },
  {
    setting: "Pediatric emergency department",
    firstIndex: 1,
    priorityDiagnosis: "febrile infant sepsis risk",
    pathophys:
      "Neonates/young infants mount fragile immune responses — fever may be the only sign of serious bacterial infection",
    priorityReason:
      "A 6-week-old with fever and lethargy requires sepsis workup and empiric antibiotics before less time-sensitive presentations",
    clients: [
      {
        vignetteLine:
          "Room 2: 9-year-old with known asthma, RR 34, SpO₂ 88% on room air, intercostal retractions, speaking in short phrases.",
        option:
          "Room 2 — asthma exacerbation with retractions and SpO₂ 88%",
        whyNotFirst:
          "Pediatric respiratory distress is urgent; however evidence-based triage in mixed-acuity sets prioritizes febrile neonate/young infant for sepsis before school-age asthma with intact perfusion.",
      },
      {
        vignetteLine:
          "Room 5: 6-week-old infant, temp 102.2°F (39.0°C), lethargic, poor feeding x 24 hours, capillary refill 3 seconds.",
        option:
          "Room 5 — 6-week-old febrile infant with lethargy, poor feeding, and delayed capillary refill",
        whyNotFirst: "Correct first choice — age and fever with lethargy mandate emergent sepsis evaluation.",
      },
      {
        vignetteLine:
          "Room 8: 14-year-old forearm deformity after fall, neurovascular intact, pain 7/10, distal pulses 2+.",
        option:
          "Room 8 — suspected forearm fracture with intact neurovascular status and moderate pain",
        whyNotFirst:
          "Orthopedic injury needs timely analgesia and imaging, but perfusion and neurovascular status are intact — lower than sepsis risk in an infant.",
      },
      {
        vignetteLine:
          "Room 1: 4-year-old with vomiting/diarrhea 24 hours, alert, drinking small sips, HR 110, BP 98/60, no fever.",
        option:
          "Room 1 — gastroenteritis with mild tachycardia but alert and taking fluids",
        whyNotFirst:
          "Monitor hydration, but stable appearance and age >3 months with afebrile status defer to febrile infant.",
      },
    ],
  },
];

/** Detect low-quality four-client prioritization items from an earlier polish pass. */
export function isWeakPrioritizationBankItem(item: BankItem): boolean {
  const q = item.question;
  const blob = `${q} ${item.options.join(" ")} ${item.correctAnswer}`;

  if (/four clients on a/i.test(q) && item.options.every((o) => o.startsWith("Room "))) {
    return false;
  }

  if (/Stable postoperative day 3|Chronic osteoarthritis — PRN|pre-lunch glucose 142 mg\/dL, asymptomatic/i.test(blob)) {
    return true;
  }
  if (/• Client 2: Stable postoperative|Client 1:.*Client 2:/i.test(q)) {
    return true;
  }
  if (/four assigned clients.*assignment \d+/i.test(q)) {
    return true;
  }
  if (/^\d{4} — Report on four assigned clients/i.test(q)) {
    return true;
  }
  if (/^\d+-year-old (man|woman) with .+: (BP|HR|Glucose)/i.test(item.correctAnswer)) {
    return true;
  }
  if (/awaiting discharge teaching only|pain rated 3\/10, no acute distress|due for routine foot inspection/i.test(blob)) {
    return true;
  }
  return false;
}

export type NclexPolishResult = {
  item: BankItem;
  changed: boolean;
  qualityBefore: number;
  qualityAfter: number;
};

function describeClient(age: number, sex: "man" | "woman"): string {
  if (age < 18) {
    return `${age}-year-old ${sex === "man" ? "boy" : "girl"}`;
  }
  return `${age}-year-old ${sex}`;
}

function pickScenario(seed: number, template?: string): NursingScenario {
  if (template === "delegation") {
    return STABLE_DELEGATION_SCENARIOS[
      Math.abs(seed) % STABLE_DELEGATION_SCENARIOS.length
    ]!;
  }

  if (template === "infection") {
    const infectionPool = SCENARIOS.filter(
      (s) =>
        /Clostridioides difficile|infection|cellulitis|MRSA|tuberculosis|meningitis|hepatitis|COVID/i.test(
          s.dx
        ) || /precaution|transmission/i.test(s.nursePriority)
    );
    const pool = infectionPool.length > 0 ? infectionPool : SCENARIOS;
    const base = pool[Math.abs(seed) % pool.length]!;
    const ageDelta = (Math.abs(seed) % 7) - 3;
    const age =
      base.age < 18
        ? Math.max(1, base.age + ageDelta)
        : Math.max(18, base.age + ageDelta);
    return { ...base, age };
  }

  const base = SCENARIOS[Math.abs(seed) % SCENARIOS.length]!;
  const ageDelta = (Math.abs(seed) % 7) - 3;
  const age =
    base.age < 18
      ? Math.max(1, base.age + ageDelta)
      : Math.max(18, base.age + ageDelta);
  return { ...base, age };
}

function stripPrefix(question: string): string {
  return question.replace(NCLEX_PREFIX, "").trim();
}

function itemTextBlob(item: BankItem): string {
  const vignette = item.vignette?.trim() || item.scenario?.trim() || "";
  const q = item.question?.trim() ?? "";
  return vignette ? `${vignette}\n\n${q}` : q;
}

function hasRichVignette(text: string): boolean {
  // The stem is the final "\n\n" block; everything before it is the vignette
  // (multi-client prioritization vignettes span several blocks).
  const parts = text.split("\n\n");
  const vignette = parts.length > 1 ? parts.slice(0, -1).join("\n\n") : text;
  const hasVitals = /BP|HR|RR|SpO₂|SpO2|temp|glucose|mg\/dL|mmHg/i.test(vignette);
  const hasDemo = /\d{1,3}[-‑]?\s*(?:year|yo|y\.o\.)/i.test(vignette);
  return vignette.length >= 80 && hasDemo && hasVitals;
}

export function scoreNclexBankItem(item: BankItem): number {
  let score = 0.32;
  const text = itemTextBlob(item);
  const vignette =
    item.vignette?.trim() ||
    item.scenario?.trim() ||
    (text.includes("\n\n") ? text.split("\n\n")[0]! : text);

  if (hasRichVignette(text)) score += 0.18;
  else if (text.length > 120) score += 0.08;

  if (hasSignsAndSymptoms(vignette)) score += 0.08;
  if (hasEtiologyOrPathophysiology(item.explanation)) score += 0.08;

  if (item.explanation.length > 280) score += 0.14;
  else if (item.explanation.length > 140) score += 0.08;

  if (/recognize cues|analyze cues|prioriti|take action|evaluate outcome|cjmm|abc|maslow|pathophys|incorrect because|why other options/i.test(item.explanation)) {
    score += 0.12;
  }

  if (!NCLEX_PREFIX.test(item.question)) score += 0.04;
  if (item.options.length === 4 && item.options.includes(item.correctAnswer)) score += 0.06;

  if (WEAK_CORRECT_PATTERNS.some((re) => re.test(item.correctAnswer))) score -= 0.22;
  if (item.options.some((o) => WEAK_OPTION_PATTERNS.some((re) => re.test(o)))) score -= 0.18;
  if (isWeakPrioritizationBankItem(item)) score -= 0.35;

  return Math.max(0, Math.min(1, score));
}

function detectTemplate(stem: string, subjectId: string, seed: number, blob?: string): string {
  const full = blob ?? stem;
  const vignettePart = blob?.includes("\n\n") ? blob.split("\n\n")[0] ?? "" : "";
  const vignetteText = vignettePart || full;

  const vignetteDelegation =
    /assign tasks to (?:unlicensed assistive personnel|UAP)|maintaining accountability/i.test(
      vignetteText
    );
  const vignetteInfection =
    /prevent transmission|C\. diff|Clostridioides difficile|contact precaution|droplet precaution|isolation room/i.test(
      vignetteText
    );
  const stemInfection = /infection|precaution|isolation|PPE|hand hygiene|contact precaution/i.test(
    stem
  );

  if (vignetteDelegation && stemInfection && !vignetteInfection) return "delegation";
  if (vignetteInfection && stemInfection) return "infection";
  if (vignetteDelegation || /delegate|UAP|unlicensed|LPN scope|assign/i.test(stem)) {
    return "delegation";
  }
  if (/infection|precaution|isolation|PPE|hand hygiene|contact precaution/i.test(stem)) {
    return "infection";
  }
  if (/therapeutic|communication|anxiety|grief|response/i.test(stem)) return "communication";
  if (/medication|insulin|dose|administer|pharm|drug/i.test(stem)) return "pharmacology";
  if (/teach|discharge|learning|education|screening|vaccine/i.test(stem)) return "teaching";
  if (/post-op|complication|diagnostic|lab|finding requires/i.test(stem)) return "risk";
  if (/first|priority|assessed first|see first|immediate follow-up/i.test(stem)) {
    return "prioritization";
  }
  if (/intervention|action should the nurse|priority action/i.test(stem)) return "intervention";

  const subjectPools: Record<string, string[]> = {
    "management-of-care": ["prioritization", "delegation", "risk"],
    "safety-infection": ["infection", "risk", "intervention"],
    "health-promotion": ["teaching", "intervention", "risk"],
    psychosocial: ["communication", "intervention", "risk"],
    "pharmacology-nursing": ["pharmacology", "intervention", "risk"],
    "basic-care-comfort": ["intervention", "teaching", "risk"],
    "reduction-risk": ["risk", "intervention", "prioritization"],
    "physiological-adaptation": ["intervention", "prioritization", "risk"],
    fundamentals: ["intervention", "delegation", "teaching"],
    "med-surg": ["intervention", "prioritization", "risk"],
    "maternal-child": ["intervention", "risk", "prioritization"],
    "pediatrics-nursing": ["intervention", "risk", "prioritization"],
  };

  const pool = subjectPools[subjectId];
  if (pool) return pool[Math.abs(seed) % pool.length]!;

  return ["intervention", "prioritization", "risk", "teaching"][Math.abs(seed) % 4]!;
}

function roomLabel(seed: number): string {
  return `Room ${200 + (Math.abs(seed) % 400)}`;
}

function ngnLeadIn(template: string, seed: number): string {
  const variants: Record<string, string[]> = {
    prioritization: [
      "The nurse receives report on four assigned clients. Which client should the nurse assess first?",
      "Four clients require attention. Which client is the highest priority for the nurse to see first?",
      "Which client should the nurse prioritize for immediate assessment?",
    ],
    delegation: [
      "Which task is appropriate for the nurse to delegate to unlicensed assistive personnel (UAP)?",
      "The nurse is planning assignments. Which activity may be safely delegated to UAP?",
    ],
    infection: [
      "Which infection control measure should the nurse implement first?",
      "Which action demonstrates appropriate transmission-based precautions for this client?",
    ],
    communication: [
      "Which nurse response uses therapeutic communication?",
      "Which response best supports the client's psychosocial needs?",
    ],
    pharmacology: [
      "Which nursing action is the priority before administering the prescribed medication?",
      "Which action should the nurse take first related to medication safety?",
    ],
    teaching: [
      "Which method best evaluates whether the client understands the teaching?",
      "Which nursing action best confirms effective patient education?",
    ],
    risk: [
      "Which finding requires immediate nursing follow-up?",
      "Which assessment finding should the nurse address first?",
    ],
    intervention: [
      "Which nursing action should the nurse take first?",
      "What is the nurse's priority action?",
    ],
  };
  const list = variants[template] ?? variants.intervention!;
  return list[Math.abs(seed) % list.length]!;
}

function mixSeed(seed: number): number {
  let x = seed | 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return Math.abs(x);
}

function buildPrioritization(_scenario: NursingScenario, subjectLabel: string, seed: number) {
  const mixed = mixSeed(seed);
  const set = PRIORITIZATION_SETS[mixed % PRIORITIZATION_SETS.length]!;
  const roomOffset = (mixed % 47) * 3;

  const clients = set.clients.map((c) => {
    const bump = (n: string) => String(Number.parseInt(n, 10) + roomOffset);
    return {
      ...c,
      vignetteLine: c.vignetteLine.replace(/Room (\d+)/g, (_, n) => `Room ${bump(n)}`),
      option: c.option.replace(/Room (\d+)/g, (_, n) => `Room ${bump(n)}`),
    };
  }) as PrioritizationSet["clients"];

  const correctClient = clients[set.firstIndex]!;
  const correct = correctClient.option;
  const wrongClients = clients.filter((_, i) => i !== set.firstIndex);
  const wrongs = wrongClients.map((c) => c.option) as [string, string, string];
  const slot = mixed % 4;
  const options = fourOptions(correct, wrongs, slot);

  const vignette = [
    `The nurse is assigned four clients on a ${set.setting.toLowerCase()}.`,
    ...clients.map((c) => c.vignetteLine),
  ].join("\n\n");

  const pseudoScenario: NursingScenario = {
    age: 50,
    sex: "woman",
    setting: set.setting,
    dx: set.priorityDiagnosis,
    history: set.priorityReason,
    vitals: correctClient.vignetteLine.split(".")[1]?.trim() ?? "",
    findings: correctClient.vignetteLine,
    pathophys: set.pathophys,
    nursePriority: set.priorityReason,
  };

  const priorityWhyNot = Object.fromEntries(
    wrongClients.map((c) => [c.option, c.whyNotFirst])
  );

  return {
    vignette,
    question: ngnLeadIn("prioritization", seed),
    options,
    correctAnswer: correct,
    template: "prioritization" as const,
    scenario: pseudoScenario,
    subjectLabel,
    priorityWhyNot,
  };
}

function buildDelegation(scenario: NursingScenario, subjectLabel: string, seed: number) {
  const clientLabel = describeClient(scenario.age, scenario.sex);
  const correct = `Measure and record intake and output for the stable ${clientLabel.toLowerCase()} with ${scenario.dx}`;
  const wrongs: [string, string, string] = [
    `Perform the initial comprehensive nursing assessment on the client with ${scenario.dx}`,
    "Administer the first dose of a newly prescribed medication and evaluate the client's response",
    "Interpret changing laboratory results and notify the provider about this client's condition",
  ];
  const slot = Math.abs(seed + 1) % 4;
  const vignette = [
    `${scenario.setting}. ${roomLabel(seed)}. ${describeClient(scenario.age, scenario.sex)} with ${scenario.dx} is stable after initial assessment.`,
    `${scenario.history}. Current data: ${scenario.vitals}. ${scenario.findings}.`,
    "The RN must assign tasks to unlicensed assistive personnel (UAP) while maintaining accountability.",
  ].join(" ");

  return {
    vignette,
    question: ngnLeadIn("delegation", seed),
    options: fourOptions(correct, wrongs, slot),
    correctAnswer: correct,
    template: "delegation" as const,
    scenario,
    subjectLabel,
  };
}

function buildInfection(scenario: NursingScenario, subjectLabel: string, seed: number) {
  const correct =
    "Place the client on contact precautions; use dedicated equipment and perform hand hygiene with soap and water before and after care";
  const wrongs: [string, string, string] = [
    "Use alcohol-based hand rub alone without soap and water after caring for this client",
    "Place the client on droplet precautions only and reuse non-critical equipment without cleaning between clients",
    "Keep the client in a negative-pressure room with airborne precautions for all visitors without PPE",
  ];
  const slot = Math.abs(seed + 2) % 4;
  const vignette = [
    `${scenario.setting}, ${roomLabel(seed)}. ${describeClient(scenario.age, scenario.sex)} is admitted with ${scenario.dx}.`,
    `${scenario.history}. Assessment: ${scenario.vitals}. ${scenario.findings}.`,
    "The nurse must prevent transmission to other clients and staff.",
  ].join(" ");

  return {
    vignette,
    question: ngnLeadIn("infection", seed),
    options: fourOptions(correct, wrongs, slot),
    correctAnswer: correct,
    template: "infection" as const,
    scenario,
    subjectLabel,
  };
}

function buildCommunication(scenario: NursingScenario, subjectLabel: string, seed: number) {
  const correct =
    `"It sounds like you're feeling overwhelmed. Tell me more about what's worrying you right now."`;
  const wrongs: [string, string, string] = [
    `"You shouldn't feel that way — other clients have worse problems."`,
    `"Let's not talk about that right now; you'll feel better tomorrow."`,
    `"I'll tell the physician you're overreacting so they can adjust your medication."`,
  ];
  const slot = Math.abs(seed + 3) % 4;
  const vignette = [
    `${scenario.setting}, ${roomLabel(seed)}. ${describeClient(scenario.age, scenario.sex)} with ${scenario.dx} expresses fear and anxiety.`,
    `${scenario.history}. Current vital signs: ${scenario.vitals}. ${scenario.findings}.`,
    "The client states, \"I'm scared about what happens next.\"",
  ].join(" ");

  return {
    vignette,
    question: ngnLeadIn("communication", seed),
    options: fourOptions(correct, wrongs, slot),
    correctAnswer: correct,
    template: "communication" as const,
    scenario,
    subjectLabel,
  };
}

function buildPharmacology(scenario: NursingScenario, subjectLabel: string, seed: number) {
  const meds = ["insulin lispro", "enoxaparin", "morphine PCA", "metoprolol", "warfarin"];
  const med = meds[Math.abs(seed) % meds.length]!;
  const correct = `Verify the six rights, check allergies and relevant labs, and assess ${scenario.vitals.split(",")[0]?.trim().toLowerCase()} before administering ${med}`;
  const wrongs: [string, string, string] = [
    `Administer ${med} without verifying the client's identity or allergy history`,
    "Use another client's medication if the MAR is unavailable",
    "Document administration before giving the medication to save time",
  ];
  const slot = Math.abs(seed + 4) % 4;
  const vignette = [
    `${scenario.setting}, ${roomLabel(seed)}. ${describeClient(scenario.age, scenario.sex)} with ${scenario.dx} has a new order for ${med}.`,
    `${scenario.history}. ${scenario.vitals}. ${scenario.findings}.`,
    "The nurse prepares to administer the medication.",
  ].join(" ");

  return {
    vignette,
    question: ngnLeadIn("pharmacology", seed),
    options: fourOptions(correct, wrongs, slot),
    correctAnswer: correct,
    template: "pharmacology" as const,
    scenario,
    subjectLabel,
  };
}

function buildTeaching(scenario: NursingScenario, subjectLabel: string, seed: number) {
  const correct =
    "Ask the client to teach back the discharge instructions in their own words before leaving the unit";
  const wrongs: [string, string, string] = [
    "Assume understanding because the client nodded during the explanation",
    "Provide only written materials in English when the client prefers another language",
    "Discourage questions to keep the discharge process efficient",
  ];
  const slot = Math.abs(seed + 5) % 4;
  const vignette = [
    `${scenario.setting}, ${roomLabel(seed)}. ${describeClient(scenario.age, scenario.sex)} with ${scenario.dx} is preparing for discharge.`,
    `${scenario.history}. Discharge vital signs: ${scenario.vitals}.`,
    `The nurse must evaluate understanding of self-care related to ${scenario.nursePriority.split(";")[0]?.toLowerCase() ?? "ongoing management"}.`,
  ].join(" ");

  return {
    vignette,
    question: ngnLeadIn("teaching", seed),
    options: fourOptions(correct, wrongs, slot),
    correctAnswer: correct,
    template: "teaching" as const,
    scenario,
    subjectLabel,
  };
}

function buildRisk(scenario: NursingScenario, subjectLabel: string, seed: number) {
  // Stem asks for a finding, so every option must be a finding — never a
  // nursing action (the QA gate fails stem/option category mismatches).
  const finding = scenario.findings.split(",")[0]?.trim() ?? scenario.findings;
  const vitalParts = scenario.vitals.split(",").map((v) => v.trim());
  const keyVital =
    vitalParts.find((v) => /SpO₂|SpO2|RR/i.test(v)) ?? vitalParts[0] ?? scenario.vitals;
  const correct = `${finding} (${keyVital})`;
  const wrongs: [string, string, string] = [
    "Pain rated 2/10 after scheduled analgesia, consistent with routine recovery",
    "Urine output 60 mL/hr of clear yellow urine over the past two hours",
    "Temperature 98.4°F (36.9°C) with skin warm, dry, and intact",
  ];
  const slot = Math.abs(seed + 7) % 4;
  const vignette = [
    `${scenario.setting}, ${roomLabel(seed)}. ${describeClient(scenario.age, scenario.sex)} with ${scenario.dx}.`,
    `${scenario.history}. ${scenario.vitals}. ${scenario.findings}.`,
  ].join(" ");

  return {
    vignette,
    question: ngnLeadIn("risk", seed),
    options: fourOptions(correct, wrongs, slot),
    correctAnswer: correct,
    template: "risk" as const,
    scenario,
    subjectLabel,
  };
}

function buildIntervention(scenario: NursingScenario, subjectLabel: string, seed: number) {
  const correct = scenario.nursePriority;
  const wrongs: [string, string, string] = [
    "Complete routine comfort measures for all other assigned clients before addressing abnormal findings",
    "Wait until the next scheduled assessment round to recheck vital signs despite acute changes",
    "Restrict all oral intake for 24 hours without provider order or further assessment",
  ];
  const slot = Math.abs(seed + 6) % 4;
  const vignette = [
    `${scenario.setting}, ${roomLabel(seed)}. ${describeClient(scenario.age, scenario.sex)} with ${scenario.dx}.`,
    `${scenario.history}. Assessment: ${scenario.vitals}. ${scenario.findings}.`,
  ].join(" ");

  return {
    vignette,
    question: ngnLeadIn("intervention", seed),
    options: fourOptions(correct, wrongs, slot),
    correctAnswer: correct,
    template: "intervention" as const,
    scenario,
    subjectLabel,
  };
}

function fourOptions(
  correct: string,
  wrongs: [string, string, string],
  correctSlot: number
): [string, string, string, string] {
  const options: string[] = ["", "", "", ""];
  options[correctSlot % 4] = correct;
  let w = 0;
  for (let i = 0; i < 4; i++) {
    if (i !== correctSlot % 4) options[i] = wrongs[w++]!;
  }
  return options as [string, string, string, string];
}

function rebuildFromTemplate(
  template: string,
  scenario: NursingScenario,
  subjectLabel: string,
  seed: number
) {
  switch (template) {
    case "prioritization":
      return buildPrioritization(scenario, subjectLabel, seed);
    case "delegation":
      return buildDelegation(scenario, subjectLabel, seed);
    case "infection":
      return buildInfection(scenario, subjectLabel, seed);
    case "communication":
      return buildCommunication(scenario, subjectLabel, seed);
    case "pharmacology":
      return buildPharmacology(scenario, subjectLabel, seed);
    case "teaching":
      return buildTeaching(scenario, subjectLabel, seed);
    case "risk":
      return buildRisk(scenario, subjectLabel, seed);
    default:
      return buildIntervention(scenario, subjectLabel, seed);
  }
}

function buildNclexExplanation(
  rebuilt: ReturnType<typeof rebuildFromTemplate>
): string {
  const { scenario, correctAnswer, options, template } = rebuilt;
  const incorrect = options.filter((o) => o !== correctAnswer);

  const templatePriority: Record<string, string> = {
    prioritization:
      "NCLEX prioritization applies ABCs, Maslow's hierarchy, and acute vs chronic/stable client needs — unstable cues outrank routine or scheduled tasks.",
    delegation:
      "The RN retains accountability for assessment, teaching, evaluation, and unstable clients. UAP may perform tasks with predictable outcomes on stable clients.",
    infection:
      "Transmission-based precautions match the pathogen. Contact precautions require dedicated equipment and soap-and-water hand hygiene when indicated (e.g., C. diff).",
    communication:
      "Therapeutic communication validates feelings, encourages expression, and avoids judgment, false reassurance, or breaching trust.",
    pharmacology:
      "Medication safety requires the six rights, allergy verification, and assessment of relevant vitals/labs before administration.",
    teaching:
      "Teach-back confirms comprehension and identifies gaps — nodding alone does not verify learning.",
    intervention:
      "When pathophysiology threatens ABCs or perfusion, the nurse intervenes immediately and notifies the provider per protocol.",
    risk: "Unexpected or worsening findings require prompt nursing assessment and intervention before complications progress.",
  };

  const distractorLines = incorrect
    .slice(0, 3)
    .map((opt) => {
      const priorityWhy = "priorityWhyNot" in rebuilt ? rebuilt.priorityWhyNot?.[opt] : undefined;
      if (priorityWhy) {
        return `• ${opt}: Incorrect — ${priorityWhy}`;
      }
      if (/^(?:Pain rated|Urine output|Temperature 9)/i.test(opt)) {
        return `• ${opt}: Incorrect — expected or stable finding within normal limits; it does not require immediate nursing follow-up.`;
      }
      if (/stable|chronic|discharge teaching|routine|3\/10|142 mg/i.test(opt)) {
        return `• ${opt}: Incorrect — stable, chronic, or scheduled needs are lower priority than the client with acute, unstable cues in the vignette.`;
      }
      if (/delegate|UAP|triage|insulin|comprehensive assessment/i.test(opt) && template !== "delegation") {
        return `• ${opt}: Incorrect — exceeds UAP scope or addresses the wrong priority; assessment, teaching, and triage remain RN responsibilities.`;
      }
      if (/without verifying|another client|before giving|ignore|wait|restrict all oral/i.test(opt)) {
        return `• ${opt}: Incorrect — violates safety standards, scope of practice, or delays necessary intervention for unstable findings.`;
      }
      if (/shouldn't feel|not talk|overreacting/i.test(opt)) {
        return `• ${opt}: Incorrect — non-therapeutic; dismisses the client's feelings and may increase anxiety or rupture trust.`;
      }
      if (/hand rub alone|negative-pressure|reuse|droplet only/i.test(opt)) {
        return `• ${opt}: Incorrect — wrong precaution level or breaks infection control standards for this presentation.`;
      }
      return `• ${opt}: Incorrect — does not address the highest-priority nursing problem supported by the vignette data.`;
    })
    .join("\n");

  return [
    `Clinical Judgment (CJMM):`,
    `1. Recognize cues: ${scenario.vitals}; ${scenario.findings}.`,
    `2. Analyze cues: ${scenario.pathophys}.`,
    `3. Prioritize hypotheses: ${templatePriority[template] ?? templatePriority.intervention}`,
    `4. Generate solutions / Take action: ${correctAnswer}.`,
    `5. Evaluate outcomes: Reassess vital signs, mental status, and targeted endpoints after intervention; document and escalate if no improvement.`,
    "",
    `Correct answer: ${correctAnswer}. This aligns with ${scenario.nursePriority.split(";")[0]?.trim() ?? "evidence-based nursing priority"} for ${scenario.dx} (${rebuilt.subjectLabel}).`,
    "",
    distractorLines ? `Why other options are incorrect:\n${distractorLines}` : "",
    "",
    "References: NCSBN NCLEX-RN Test Plan; NCSBN Clinical Judgment Measurement Model (CJMM); Open RN Nursing textbooks.",
  ]
    .filter(Boolean)
    .join("\n");
}

function bankItemToExam(item: BankItem, subjectId?: string): ExamQuestion {
  const combined = item.vignette?.trim()
    ? `${item.vignette.trim()}\n\n${item.question.trim()}`
    : item.question;
  const split = splitCombinedStem({
    id: 1,
    type: "multiple_choice",
    question: combined,
    options: [...item.options],
    correctAnswer: item.correctAnswer,
    explanation: item.explanation,
  });

  return {
    id: 1,
    type: "multiple_choice",
    question: split.question,
    vignette: split.vignette ?? item.vignette,
    options: [...item.options],
    correctAnswer: item.correctAnswer,
    explanation: item.explanation,
    tags: item.tags ?? [subjectId ?? "nursing"],
    highYield: true,
  };
}

function examToBankItem(base: BankItem, exam: ExamQuestion): BankItem {
  const vignette = exam.vignette?.trim() || base.vignette?.trim() || base.scenario?.trim();
  const question = exam.question.trim();

  return {
    ...base,
    vignette,
    scenario: vignette,
    question: vignette ? question : question,
    options: (exam.options?.slice(0, 4) ?? base.options) as [string, string, string, string],
    correctAnswer: exam.correctAnswer,
    explanation: exam.explanation,
    tags: exam.tags ?? base.tags,
  };
}

export function needsNclexPolish(item: BankItem): boolean {
  const text = itemTextBlob(item);
  return (
    isWeakPrioritizationBankItem(item) ||
    hasShiftNoteArtifacts(item.vignette ?? item.question) ||
    scoreNclexBankItem(item) < 0.62 ||
    NCLEX_PREFIX.test(item.question) ||
    !hasRichVignette(text) ||
    WEAK_CORRECT_PATTERNS.some((re) => re.test(item.correctAnswer)) ||
    item.options.some((o) => WEAK_OPTION_PATTERNS.some((re) => re.test(o))) ||
    // Anything the QA gate would fail must be polished, so polish triggers and
    // the serve-time gate can never disagree about an item's health.
    !auditBankItem(item, "nursing").ok
  );
}

function finalizePolishedBankItem(working: BankItem, subjectId: string): BankItem {
  let exam = bankItemToExam(working, subjectId);
  exam = enrichQuestion(exam, "nursing");

  const polished = examToBankItem(working, exam);
  const vignette = polished.vignette ? stripShiftNotes(polished.vignette) : polished.vignette;
  const stemOnly = resolveNclexStem(polished);
  return {
    ...polished,
    vignette,
    scenario: polished.scenario ? stripShiftNotes(polished.scenario) : vignette,
    question: hasShiftNoteArtifacts(stemOnly) ? stripShiftNotes(stemOnly) : stemOnly,
  };
}

function buildPolishedItem(
  item: BankItem,
  subjectId: string,
  subjectLabel: string,
  seed: number,
  template: string
): BankItem {
  const stem = stripPrefix(item.question);
  const scenario = pickScenario(
    seed + (subjectId?.length ?? 0) + stem.length + (item.correctAnswer?.length ?? 0),
    template
  );
  const rebuilt = rebuildFromTemplate(template, scenario, subjectLabel, seed);

  const working: BankItem = {
    ...item,
    vignette: rebuilt.vignette,
    scenario: rebuilt.vignette,
    question: rebuilt.question,
    options: rebuilt.options,
    correctAnswer: rebuilt.correctAnswer,
    explanation: buildNclexExplanation(rebuilt),
    tags: [...(item.tags ?? []).filter((t) => t !== "generated"), "cjmm-polished", template, subjectId],
  };

  return finalizePolishedBankItem(working, subjectId);
}

/** Polish a single NCLEX bank item — CJMM vignettes, NGN-style stems, priority rationales. */
export function polishNclexBankItem(
  item: BankItem,
  subjectId: string,
  subjectLabel = "NCLEX nursing",
  seed = 0
): NclexPolishResult {
  const qualityBefore = scoreNclexBankItem(item);
  const hasWeakPatterns =
    WEAK_CORRECT_PATTERNS.some((re) => re.test(item.correctAnswer)) ||
    item.options.some((o) => WEAK_OPTION_PATTERNS.some((re) => re.test(o)));

  if (!needsNclexPolish(item) && !hasWeakPatterns && hasRichVignette(itemTextBlob(item)) && !isWeakPrioritizationBankItem(item)) {
    return { item, changed: false, qualityBefore, qualityAfter: qualityBefore };
  }

  const blob = itemTextBlob(item);
  const stem = stripPrefix(item.question);
  let template = isWeakPrioritizationBankItem(item)
    ? "prioritization"
    : detectTemplate(stem, subjectId, seed, blob);

  let cleaned = buildPolishedItem(item, subjectId, subjectLabel, seed, template);
  let audit = auditNclexBankItem(cleaned);

  const retryTemplateForCode: Record<string, string> = {
    multi_client_vignette: "prioritization",
    priority_delegation_mismatch: "prioritization",
    stem_vignette_template_mismatch: "delegation",
    delegation_context_missing: "delegation",
    phantom_client_in_options: "delegation",
    infection_stem_without_context: "infection",
    stable_unstable_mismatch: "prioritization",
    delegation_prioritization_mismatch: "prioritization",
    delegation_handoff_mismatch: "delegation",
    stem_option_category_mismatch: "risk",
  };

  for (let attempt = 0; !audit.ok && attempt < 5; attempt++) {
    const errorCode = audit.issues.find((i) => i.severity === "error")?.code;
    const nextTemplate =
      (errorCode && retryTemplateForCode[errorCode]) ||
      (/assign tasks to UAP/i.test(cleaned.vignette ?? "") ? "delegation" : undefined);

    if (!nextTemplate || nextTemplate === template) break;

    template = nextTemplate;
    cleaned = buildPolishedItem(item, subjectId, subjectLabel, seed + 11 * (attempt + 1), template);
    audit = auditNclexBankItem(cleaned);
  }

  const qualityAfter = scoreNclexBankItem(cleaned);

  const changed =
    cleaned.question !== item.question ||
    cleaned.correctAnswer !== item.correctAnswer ||
    cleaned.explanation !== item.explanation ||
    JSON.stringify(cleaned.options) !== JSON.stringify(item.options) ||
    cleaned.vignette !== item.vignette;

  return { item: cleaned, changed, qualityBefore, qualityAfter };
}
