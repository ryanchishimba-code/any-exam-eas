import { defineExamTopics } from "./topic-factory";
import { sigCodeAbbreviationTopic } from "./sig-code-abbreviations";

export const NCLEX_HIGH_YIELD_TOPICS = defineExamTopics("nclex", [
  {
    slug: "infection-control",
    category: "Safety & Infection Control",
    title: "Infection Control & PPE",
    overview:
      "Standard and transmission-based precautions — the foundation of safe nursing practice on every unit.",
    summary:
      "Infection control is tested constantly on NCLEX because nursing judgment around precautions directly affects patient and staff safety. Standard precautions apply to all patients: hand hygiene before and after every contact, safe injection practices, and appropriate PPE when exposure to blood or body fluids is possible.\n\nTransmission-based precautions layer on top by route. Contact precautions (C. diff, MRSA, VRE) require gown and gloves for every room entry; alcohol-based hand rub is not sufficient for C. diff spores — use soap and water. Droplet precautions (influenza, pertussis, meningococcal disease) need a surgical mask within 3–6 feet. Airborne precautions (TB, measles, varicella) require an N95 respirator and negative-pressure isolation when available.",
    keyConcepts: [
      "Hand hygiene is the single most effective infection prevention measure",
      "Contact: gown + gloves; private room or cohort; dedicated equipment when possible",
      "C. diff: contact precautions + soap-and-water hand washing (spores resist alcohol)",
      "Droplet: surgical mask for staff entering room; patient mask during transport",
      "Airborne: N95 fit-tested respirator; negative-pressure room; limit transport",
      "Sharps: never recap; use needleless systems; dispose immediately in puncture-resistant container",
      "Sterile technique breaks with non-sterile contact — re-open new kit if contaminated",
    ],
    mustKnowFacts: [
      "C. diff diarrhea: contact precautions; bleach for environmental cleaning",
      "TB suspect: airborne isolation until ruled out; place mask on patient during transport",
    ],
    pearls: [
      "When two precaution types apply, use the more restrictive combination (e.g., contact + droplet for RSV in some settings).",
      "Surgical asepsis is required for invasive procedures — maintain sterile field discipline.",
    ],
    pitfalls: [
      "Using alcohol gel alone after caring for a patient with C. diff",
      "Transporting an airborne-isolation patient without notifying receiving unit",
    ],
    practiceTopicSlug: "safety-infection",
  },
  {
    slug: "prioritization",
    category: "Management of Care",
    title: "Prioritization & ABCs",
    overview:
      "Rank nursing actions using airway-breathing-circulation, Maslow, and acute vs. chronic framing.",
    summary:
      "NCLEX prioritization items present multiple 'correct' nursing actions — your job is to identify which need to happen first. The ABC framework remains the anchor: airway obstruction, respiratory failure, and hemodynamic instability outrank comfort, teaching, and documentation when they compete.\n\nMaslow's hierarchy supports physiologic needs before psychosocial interventions in acute settings. The nursing process still matters: assess before intervening when assessment can be done quickly and safely. When two answers both seem therapeutic, choose the one that stabilizes, prevents harm, or gathers critical data first.",
    keyConcepts: [
      "Airway → breathing → circulation before less urgent needs",
      "Unstable vitals and new acute changes before routine care",
      "Actual problems before 'risk for' diagnoses when acuity differs",
      "Assess before intervene when safe — except in immediate life threats",
      "See the sickest patient first; cluster care without delaying emergencies",
      "Trend data (urine output, neuro status, pain) over isolated values",
    ],
    mustKnowFacts: [
      "See first: chest pain with diaphoresis, SpO₂ <90%, GCS decline, active hemorrhage",
      "Do not delay emergency treatment to complete non-urgent documentation",
    ],
    pearls: [
      "If every option is an assessment, pick the one addressing the highest acuity system.",
      "New onset confusion in older adults is delirium until proven otherwise — assess promptly.",
    ],
    pitfalls: [
      "Choosing psychosocial support before physiologic instability",
      "Selecting a correct intervention that is not the FIRST action",
    ],
    practiceTopicSlug: "management-of-care",
  },
  {
    slug: "delegation",
    category: "Management of Care",
    title: "Delegation & Scope of Practice",
    overview:
      "Assign tasks safely to LPN/LVN and UAP while retaining RN accountability for outcomes.",
    summary:
      "Delegation questions test whether you understand what can be assigned, to whom, and under what circumstances. The RN cannot delegate nursing judgment, assessment, evaluation, unstable patients, or tasks outside the delegatee's scope. UAP may perform ADLs, vital signs on stable patients, and I&O on stable adults per agency policy — not unstable patients, not initial assessments, and never insulin.\n\nApply the five rights: right task, right circumstance, right person, right direction/communication, and right supervision/evaluation. Provide concrete instructions, confirm understanding, and follow up. If the patient is unstable or the outcome unpredictable, the RN retains the task.",
    keyConcepts: [
      "RN accountable for all delegated care — supervision cannot be delegated",
      "UAP: ADLs, ambulation of stable patients, vitals on stable adults per policy",
      "LPN/LVN: care for stable patients with predictable outcomes; wound care per protocol",
      "Never delegate: assessment, evaluation, teaching, unstable patients, triage decisions",
      "Right circumstance: adequate staffing, appropriate setting, stable patient",
      "Follow up and evaluate — reassign if patient status changes",
    ],
    mustKnowFacts: [
      "Insulin administration is not delegated to UAP",
      "Initial admission assessment is an RN responsibility",
    ],
    pearls: [
      "If the delegatee says they cannot perform the task, find another solution — do not pressure unsafe delegation.",
      "Stable vs. unstable is the key fork on NCLEX delegation items.",
    ],
    pitfalls: [
      "Delegating vital signs on a post-op patient with active bleeding",
      "Assuming LPN can perform all RN tasks on a med-surg floor",
    ],
    practiceTopicSlug: "management-of-care",
  },
  {
    slug: "electrolytes",
    category: "Physiological Adaptation",
    title: "Electrolyte Imbalances",
    overview:
      "Recognize causes, ECG changes, and nursing priorities for sodium, potassium, calcium, and magnesium.",
    summary:
      "Electrolyte questions tie clinical signs to nursing action and communication. Potassium is high-yield: hypokalemia causes muscle weakness, ileus, and U waves on ECG; hyperkalemia causes peaked T waves, widened QRS, and cardiac arrest risk. Calcium affects neuromuscular excitability — Chvostek and Trousseau signs with hypocalcemia. Sodium disorders affect mental status; correct chronic hyponatremia slowly to avoid osmotic demyelination.\n\nNursing priorities include cardiac monitoring for IV replacements, oral replacement when tolerated, holding nephrotoxic or contributing medications per order, and notifying the provider for critical values or ECG changes before giving additional doses.",
    keyConcepts: [
      "Hypokalemia: weakness, cramps, flattened T waves, U waves, increased digoxin toxicity",
      "Hyperkalemia: peaked T waves → widened QRS → sine wave; treat as emergency with ECG changes",
      "Hypocalcemia: numbness, tetany, prolonged QT; check albumin for true ionized calcium",
      "Hyponatremia: confusion, seizures; chronic correction max ~8–10 mEq/L per 24 h per protocol",
      "Hypermagnesemia: loss of DTRs, respiratory depression, hypotension",
      "Check magnesium when potassium is refractory to replacement",
    ],
    mustKnowFacts: [
      "Hyperkalemia with ECG changes: notify provider immediately; prepare per protocol (calcium, insulin/dextrose, etc.)",
      "Never give IV push potassium — fatal arrhythmia risk",
    ],
    pearls: [
      "Diuretics, vomiting, and NG suction deplete K⁺ and H⁺ — watch both.",
      "Metabolic alkalosis often accompanies hypokalemia — treat the cause.",
    ],
    pitfalls: [
      "Rapid sodium correction in chronic hyponatremia",
      "Giving potassium without verifying renal function and monitoring ECG",
    ],
    practiceTopicSlug: "physiological-adaptation",
  },
  {
    slug: "medication-safety",
    category: "Pharmacological Therapies",
    title: "Medication Administration Safety",
    overview:
      "Rights of medication administration, high-alert drugs, and error-prevention strategies.",
    summary:
      "Medication safety items emphasize rights of administration, high-alert medications, and nursing actions when something does not look right. Verify six rights: patient, drug, dose, route, time, and documentation. Independent double-checks are standard for insulin, heparin, opioids, and chemotherapy per agency policy.\n\nKnow therapeutic ranges and toxicity signs for commonly tested drugs: lithium (tremor, confusion, narrow index), digoxin (bradycardia, vision changes), phenytoin (ataxia, nystagmus), and warfarin (bleeding, INR monitoring). Never crush extended-release, enteric-coated, or sublingual formulations without a specific order. Report adverse effects and therapeutic failures promptly.",
    keyConcepts: [
      "Six rights + documentation; use two identifiers",
      "High-alert: insulin, anticoagulants, opioids, chemo, neuromuscular blockers",
      "Independent double-check when policy requires",
      "Do not crush ER/EC tablets — dose dumping or loss of protection",
      "Black box warnings: know monitoring parameters (e.g., clozapine ANC)",
      "Peak/trough levels: vancomycin, aminoglycosides — timing matters",
      "Rights of medication administration apply to patient self-administration teaching too",
    ],
    mustKnowFacts: [
      "Always check blood glucose before insulin administration",
      "Heparin and enoxaparin: monitor for bleeding; protamine for heparin reversal per order",
    ],
    pearls: [
      "If the dose seems wrong, stop and clarify — never assume.",
      "OTC herbals and supplements affect warfarin, BP meds, and transplant drugs — always ask.",
    ],
    pitfalls: [
      "Administering IV potassium by push",
      "Using wrong concentration insulin (U-100 vs U-500) without verification",
    ],
    practiceTopicSlug: "pharmacology-nursing",
  },
  {
    slug: "postpartum",
    category: "Health Promotion",
    title: "Postpartum Complications",
    overview:
      "Hemorrhage, infection, preeclampsia progression, and thromboembolism in the fourth trimester.",
    summary:
      "Postpartum complications remain leading causes of maternal morbidity — NCLEX expects you to recognize hemorrhage, infection, hypertensive emergency, and thromboembolism early. Postpartum hemorrhage (PPH) signs include tachycardia, hypotension, heavy bleeding, and a boggy uterus; first-line nursing actions are fundal massage, ensure empty bladder, IV access, and rapid provider notification.\n\nEndometritis presents with fever, foul lochia, and uterine tenderness — usually after cesarean or prolonged labor. Postpartum preeclampsia can occur up to 6 weeks after delivery: headache, visual changes, epigastric pain, and BP elevation require urgent evaluation. Encourage early ambulation and SCDs per protocol for VTE prevention while balancing bleeding risk.",
    keyConcepts: [
      "PPH: massage fundus, promote uterine contraction, IV fluids, type & cross, notify provider",
      "Boggy uterus + increased bleeding = uterine atony until proven otherwise",
      "Endometritis: broad-spectrum antibiotics per order; supportive care",
      "Postpartum pre-eclampsia: magnesium sulfate may be indicated — seizure precautions",
      "DVT/PE: unilateral leg swelling, chest pain, dyspnea — do not dismiss as 'normal fatigue'",
      "Educate on lochia progression: rubra → serosa → alba; foul odor is abnormal",
    ],
    mustKnowFacts: [
      "Maternal tachycardia may be the first sign of concealed hemorrhage",
      "Never leave a postpartum patient with active heavy bleeding unattended",
    ],
    pearls: [
      "Oxytocin, full bladder, and retained placental fragments all contribute to atony.",
      "Breastfeeding stimulates oxytocin — useful for involution when hemodynamically stable.",
    ],
    pitfalls: [
      "Attributing tachycardia to anxiety without assessing bleeding and fundal tone",
      "Delaying BP recheck when patient reports headache post-delivery",
    ],
    practiceTopicSlug: "maternal-child",
  },
  {
    slug: "pediatrics",
    category: "Health Promotion",
    title: "Pediatric Assessment & Safety",
    overview:
      "Age-specific vitals, dehydration clues, fever workups, and family-centered care.",
    summary:
      "Pediatric NCLEX items reward developmental and physiologic differences. Infants have higher respiratory rates and limited glycogen reserves — hypoglycemia and dehydration develop quickly. Fever in an infant under 3 months requires a full sepsis workup. Dehydration assessment uses fontanel tension, mucous membranes, capillary refill, urine output, and mental status.\n\nSafety priorities include correct weight-based dosing (always kg), never using aspirin in viral illness (Reye syndrome), securing crib rails, and matching communication to developmental stage. Family-centered care means involving caregivers in teaching and ensuring they can perform care safely at discharge.",
    keyConcepts: [
      "Fever in infant <3 months: full sepsis evaluation — do not treat as 'viral' alone",
      "Dehydration: delayed cap refill, dry mucosa, sunken fontanel, decreased urine",
      "Weight-based dosing — verify weight in kg, not lb",
      "Croup vs epiglottitis: do not examine throat if epiglottitis suspected (airway risk)",
      "Kawasaki disease: fever ≥5 days + mucocutaneous findings — urgent referral",
      "Child abuse: inconsistent history, patterned bruises, delayed care — mandatory reporting",
    ],
    mustKnowFacts: [
      "Bulging fontanelle + fever = consider meningitis",
      "Live virus vaccines contraindicated in severe immunocompromise",
    ],
    pearls: [
      "Tachypnea is often the earliest sign of pediatric respiratory distress.",
      "Parents are the best historians — assess their ability to manage care at home.",
    ],
    pitfalls: [
      "Using adult vital sign norms for toddlers",
      "Giving aspirin for fever in children with viral illness",
    ],
    practiceTopicSlug: "pediatrics-nursing",
  },
  {
    slug: "psychiatric",
    category: "Psychosocial Integrity",
    title: "Psychiatric Nursing & Suicide Risk",
    overview:
      "Therapeutic communication, crisis safety, and monitoring for psychotropic adverse effects.",
    summary:
      "Psychiatric nursing on NCLEX balances therapeutic communication with safety. Use open-ended questions, reflection, and silence; avoid false reassurance, probing, and advising. Suicide risk requires direct assessment — asking about ideation does not increase risk and is the standard of care. Implement 1:1 observation, remove ligature points, document q15-minute checks, and maintain a safe milieu.\n\nKnow extrapyramidal symptoms with antipsychotics, serotonin syndrome with serotonergic combinations, and lithium toxicity (tremor, ataxia, confusion). Establish rapport before limit-setting with agitated patients. Involuntary hold criteria vary by state but always prioritize imminent harm.",
    keyConcepts: [
      "Therapeutic: open-ended, reflection, clarifying, silence",
      "Non-therapeutic: advising, probing, false reassurance, passing judgment",
      "Suicide precautions: 1:1, remove sharps/cords, structured observation, safe environment",
      "Lithium toxicity: coarse tremor, confusion, GI upset — hold dose and check level",
      "EPS: dystonia, akathisia, parkinsonism — report and medicate per protocol",
      "Restraints/seclusion: last resort; provider order; continuous monitoring; debrief",
    ],
    mustKnowFacts: [
      "Ask directly: 'Are you having thoughts of hurting yourself?'",
      "Do not leave a suicidal patient alone to 'calm down'",
    ],
    pearls: [
      "Contracting for safety is a tool, not a substitute for observation when risk is high.",
      "Agitation may reflect pain, hypoxia, or withdrawal — assess medical causes.",
    ],
    pitfalls: [
      "Removing suicide precautions because the patient 'promises' they feel better",
      "Using restraints without trying less restrictive interventions and orders",
    ],
    practiceTopicSlug: "psychosocial",
  },
  {
    slug: "cardiovascular",
    category: "Physiological Adaptation",
    title: "Cardiovascular Emergencies",
    overview:
      "ACS protocols, heart failure management, and antihypertensive nursing surveillance.",
    summary:
      "Cardiovascular items often present subtle symptoms that demand rapid nursing response. Acute coronary syndrome (ACS) may present with chest pressure, radiation to jaw/arm, diaphoresis, nausea, and syncope — obtain 12-lead ECG and troponin per protocol immediately. Oxygen only if hypoxic; aspirin unless contraindicated; nitroglycerin after BP and sildenafil use check; morphine per protocol if pain persists.\n\nHeart failure exacerbation: daily weights, strict I&O, lung sounds, JVD, peripheral edema, and orthopnea. Teach sodium and fluid restriction. Beta-blockers should not be stopped abruptly. Anticoagulant teaching includes bleeding precautions and when to report hematuria, melena, or large bruises.",
    keyConcepts: [
      "ACS: ECG within 10 minutes; continuous monitoring; IV access",
      "HF exacerbation: furosemide, daily weights, sit upright, monitor potassium with diuretics",
      "Hypertensive urgency vs emergency: end-organ damage defines emergency",
      "Beta-blocker withdrawal can precipitate rebound angina — taper per order",
      "Anticoagulants: fall precautions; report bleeding; no NSAID duplication without MD",
      "Peripheral pulses and cap refill after vascular procedures",
    ],
    mustKnowFacts: [
      "Crushing substernal chest pain with diaphoresis = ACS workup immediately",
      "Nitroglycerin contraindicated with hypotension and recent PDE5 inhibitor use",
    ],
    pearls: [
      "Women and diabetics may have atypical ACS presentations — maintain high suspicion.",
      "Right-sided HF: fluid restriction; careful with aggressive diuresis.",
    ],
    pitfalls: [
      "Delaying ECG for a patient with active chest pain",
      "Giving nitroglycerin without checking blood pressure",
    ],
    practiceTopicSlug: "med-surg",
  },
  {
    slug: "respiratory",
    category: "Physiological Adaptation",
    title: "Respiratory & Oxygen Therapy",
    overview:
      "Oxygen delivery, COPD/asthma management, and recognizing impending respiratory failure.",
    summary:
      "Respiratory questions test whether you can match oxygen delivery to patient need without causing harm. COPD patients with chronic hypercapnia may target SpO₂ 88–92% to avoid blunting hypoxic drive — monitor mental status and CO₂ trends, not just saturation. Asthma exacerbations need bronchodilators, steroids, and close monitoring; a 'silent chest' with fatigue signals impending failure.\n\nPost-op patients need incentive spirometry and early ambulation to prevent atelectasis. Pulmonary embolism suspicion: sudden dyspnea, pleuritic chest pain, tachycardia, hypoxia — notify provider and prepare for diagnostics. Positioning matters: high Fowler's for distress; tripod is a sign of increased work of breathing.",
    keyConcepts: [
      "COPD: controlled O₂ (88–92% per order); monitor mental status for CO₂ retention",
      "Asthma: albuterol, systemic steroids for moderate-severe; peak flow when able",
      "PE suspicion: sudden dyspnea, tachycardia, hypoxia — do not wait for 'classic' findings",
      "Incentive spirometry q1h awake post-op per protocol",
      "High Fowler's and pursed-lip breathing for COPD dyspnea",
      "Endotracheal tube care: cuff pressure, oral care, securement, suctioning indications",
    ],
    mustKnowFacts: [
      "Worsening asthma with silent chest and fatigue = impending respiratory arrest",
      "High-flow O₂ in chronic CO₂ retainers requires close monitoring",
    ],
    pearls: [
      "Accessory muscle use and inability to speak full sentences signal severe distress.",
      "Pulse oximetry can be falsely reassuring with carbon monoxide exposure.",
    ],
    pitfalls: [
      "Sedating an anxious COPD patient without monitoring ventilation",
      "Targeting 100% SpO₂ in all patients regardless of comorbidity",
    ],
    practiceTopicSlug: "med-surg",
  },
  {
    slug: "diabetes",
    category: "Physiological Adaptation",
    title: "Diabetes Management",
    overview:
      "Hypoglycemia treatment, DKA/HHS recognition, and insulin safety across care settings.",
    summary:
      "Diabetes content spans acute crises and chronic management. Hypoglycemia (<70 mg/dL): give 15 g fast-acting carbohydrate, recheck in 15 minutes, repeat if needed, then complex carb snack if next meal is not soon. Never leave a hypoglycemic patient unattended.\n\nDKA presents with polyuria, polydipsia, Kussmaul respirations, fruity breath, and ketones — fluids first, then insulin per protocol after potassium verified. HHS features extreme hyperglycemia and profound dehydration in type 2 diabetes. Sick-day rules: never stop insulin entirely; monitor glucose and ketones; stay hydrated; call provider for persistent vomiting or high glucose.",
    keyConcepts: [
      "Hypoglycemia: 15–15 rule; glucagon IM if unable to swallow",
      "DKA: IV fluids, insulin drip after K⁺ >3.3; monitor glucose and potassium hourly early on",
      "HHS: aggressive fluids; slower insulin adjustments; extreme dehydration risk",
      "Basal-bolus regimens: do not hold basal without provider guidance when NPO",
      "Foot exams, monofilament testing, and ulcer prevention teaching",
      "Sliding scale alone is insufficient for most inpatients — understand basal needs",
    ],
    mustKnowFacts: [
      "Check blood glucose before every insulin dose",
      "DKA insulin before K⁺ confirmed risks fatal arrhythmia if K⁺ <3.3",
    ],
    pearls: [
      "Morning hyperglycemia: distinguish dawn phenomenon vs Somogyi effect.",
      "Beta-blockers mask hypoglycemia tremor — teach patients to monitor glucose closely.",
    ],
    pitfalls: [
      "Giving insulin to a patient who has not eaten and has normal-low glucose",
      "Discontinuing all insulin when patient is NPO without an order",
    ],
    practiceTopicSlug: "med-surg",
  },
  {
    slug: "renal",
    category: "Physiological Adaptation",
    title: "Renal & Fluid Balance",
    overview:
      "AKI recognition, dialysis nursing care, and accurate fluid volume assessment.",
    summary:
      "Renal and fluid questions require integrating intake/output, weights, labs, and physical exam. Daily weights are the most sensitive indicator of fluid trend — same scale, same time, same clothing. AKI may be prerenal (hypovolemia), intrinsic (ATN), or postrenal (obstruction) — nursing focuses on hemodynamic support, nephrotoxin avoidance, and electrolyte monitoring.\n\nDialysis patients need hypotension monitoring during runs, access site surveillance (thrill/bruit for AV fistula), and fluid restriction education. Contrast-induced nephropathy prevention includes IV hydration per protocol. Hyperkalemia is common in renal failure — know emergency nursing response per order set.",
    keyConcepts: [
      "Daily weights: 1 kg gain ≈ 1 L fluid retention",
      "AKI: oliguria, rising creatinine, BUN; hold nephrotoxins (NSAIDs, contrast) when possible",
      "Hemodialysis: monitor cramping, hypotension, access bleeding; post-weight goal",
      "Peritoneal dialysis: sterile technique; infection signs in effluent",
      "Fluid restriction and low-potassium diet in advanced CKD",
      "Contrast precautions: hydration, minimize volume, monitor creatinine after",
    ],
    mustKnowFacts: [
      "Anuria <50 mL/day requires urgent provider notification",
      "Do not use AV fistula arm for BP or venipuncture",
    ],
    pearls: [
      "JVD + crackles + edema = hypervolemia — diurese cautiously if cardiorenal syndrome.",
      "Urine output <0.5 mL/kg/hr for 6 hours suggests AKI — trend matters.",
    ],
    pitfalls: [
      "Relying on edema alone without weights and I&O",
      "Aggressive fluid bolus in oliguric patient without hemodynamic indication",
    ],
    practiceTopicSlug: "med-surg",
  },
  {
    slug: "neurologic",
    category: "Physiological Adaptation",
    title: "Neurologic Assessment & Stroke",
    overview:
      "GCS trending, stroke timelines, seizure safety, and increased ICP warning signs.",
    summary:
      "Neurologic nursing prioritizes time-sensitive interventions and meticulous trending. Ischemic stroke: know last known well time; FAST screen; prepare for tPA/thrombectomy per protocol after CT excludes hemorrhage. Do not give aspirin until hemorrhagic stroke is ruled out.\n\nSeizure precautions: protect head, time the event, suction available, do not restrain or put objects in mouth. Increased ICP signs: worsening headache, vomiting, decreasing LOC, pupil changes — elevate HOB, avoid Valsalva, notify provider. Spinal cord injury: maintain spinal precautions until cleared.",
    keyConcepts: [
      "Stroke: last known well; glucose check; CT before thrombolytics",
      "Seizure: safety, timing, post-ictal monitoring; antiepileptic levels when indicated",
      "ICP: HOB 30°, avoid neck flexion, sedation/analgesia per order, trend pupils",
      "GCS components trended — a 2-point drop warrants urgent reassessment",
      "NIHSS documentation for stroke patients per protocol",
      "Spinal precautions until imaging/rules out injury",
    ],
    mustKnowFacts: [
      "tPA typically within 4.5 hours of last known well for eligible ischemic stroke",
      "Sudden worst headache of life = subarachnoid hemorrhage workup",
    ],
    pearls: [
      "Neuro checks q15min early after decline, then space per protocol.",
      "New aphasia or neglect may be only stroke sign — act fast.",
    ],
    pitfalls: [
      "Giving aspirin before CT in acute stroke",
      "Leaving seizure patient unattended on side rails down without observation",
    ],
    practiceTopicSlug: "med-surg",
  },
  {
    slug: "pain-opioids",
    category: "Basic Care & Comfort",
    title: "Pain Management & Opioid Safety",
    overview:
      "Multimodal analgesia, opioid monitoring, and naloxone readiness on med-surg units.",
    summary:
      "Pain management is a balance of comfort, function, and safety. Use a multimodal approach: scheduled acetaminophen, NSAIDs when not contraindicated, regional techniques, and opioids for moderate-severe pain when benefits outweigh risks. Assess pain with appropriate scales (0–10, FLACC, PAINAD for dementia).\n\nOpioid safety requires respiratory rate, sedation level, and oxygenation monitoring — especially with first doses, dose increases, and concomitant sedatives. Naloxone should be accessible for rapid reversal per protocol. Teach patients about constipation prophylaxis, fall risk, and safe storage. Document pain reassessment after interventions.",
    keyConcepts: [
      "Multimodal analgesia reduces total opioid exposure",
      "Monitor RR, sedation score, SpO₂ after opioid doses — especially PCA",
      "PCA: only patient presses button; no family proxy dosing",
      "Bowel regimen with opioid orders — stool softener + stimulant",
      "Naloxone for respiratory depression — small titrated doses to avoid acute withdrawal",
      "Non-pharmacologic: positioning, ice/heat, distraction, relaxation",
    ],
    mustKnowFacts: [
      "Respiratory rate <8 with sedation = hold opioid and notify provider",
      "Never crush ER opioids — dose dumping risk",
    ],
    pearls: [
      "Pain is what the patient says it is — use consistent reassessment.",
      "Tolerance and dependence are not the same as addiction — avoid undertreating.",
    ],
    pitfalls: [
      "Relying solely on vital signs while patient is obtunded on opioids",
      "PCA bolus by nurse or family 'because patient is sleeping'",
    ],
    practiceTopicSlug: "basic-care-comfort",
  },
  {
    slug: "legal-ethical",
    category: "Management of Care",
    title: "Legal & Ethical Nursing Practice",
    overview:
      "Informed consent, capacity, mandatory reporting, and professional boundaries.",
    summary:
      "Legal and ethical items test advocacy and professional boundaries. Informed consent requires capacity, understanding, voluntariness, and adequate information — the performing provider obtains consent, but nurses verify it is in place and witness signatures. Emergencies may allow implied consent when life-threatening injury exists and the patient cannot consent.\n\nMandatory reporting laws cover child/elder abuse, certain communicable diseases, and gunshot wounds per state law. HIPAA permits minimum necessary disclosure. Professional boundaries: no personal relationships, gifts that influence care, or social media posts with patient identifiers. Document objectively, factually, and promptly.",
    keyConcepts: [
      "Informed consent: capacity, understanding, voluntary, disclosure — witness role for nurse",
      "Implied consent in life-threatening emergencies when patient cannot consent",
      "Mandatory reporting: suspected abuse, vulnerable adult neglect — know state triggers",
      "HIPAA: minimum necessary; verify identity before releasing information",
      "Advance directives: honor valid DNR/POLST per policy; escalate ethical consult if conflict",
      "Objective documentation — avoid blame language",
    ],
    mustKnowFacts: [
      "Suspected child abuse must be reported — immunity for good-faith reports in most states",
      "Intoxicated or cognitively impaired patients may lack capacity for consent",
    ],
    pearls: [
      "When family disagrees with competent patient's decision, advocate for the patient.",
      "Social media 'de-identified' stories often are not truly anonymous — never post clinical details.",
    ],
    pitfalls: [
      "Obtaining consent from family for a competent adult without patient's agreement",
      "Delaying abuse report to 'confirm' suspicions beyond reasonable threshold",
    ],
    practiceTopicSlug: "management-of-care",
  },
  sigCodeAbbreviationTopic("nclex"),
]);
