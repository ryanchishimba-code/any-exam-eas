/**
 * Curated USMLE-style vignettes — batch 03 (NBME/UWorld editorial tone).
 * Focus: emergency medicine, clean diagnosis stems, endocrine, peds, ethics.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { usmleVignette } from "@/lib/exam-prep/usmle-seed-factory";

const opts5 = (
  a: string,
  b: string,
  c: string,
  d: string,
  e: string
): [string, string, string, string, string] => [a, b, c, d, e];

const BATCH = "physician-educator-batch-03";

export const USMLE_PHYSICIAN_EDUCATOR_BATCH_03: EnrichedBankItem[] = [
  usmleVignette(
    "emergency-medicine",
    `A 19-year-old college student is brought to the emergency department because of fever, headache, and neck stiffness that began 12 hours ago. His roommate reports he was confused this morning. Temperature 39.4°C (102.9°F), blood pressure 102/64 mm Hg, pulse 124/min, respirations 22/min. He is lethargic but arousable. Nuchal rigidity is present; Kernig sign is positive. No focal neurologic deficits. Skin is warm without rash. Laboratory studies:
WBC 19,200/mm³ · glucose 98 mg/dL · sodium 136 mEq/L
Lumbar puncture: opening pressure 28 cm H₂O; CSF WBC 1,850/mm³ (88% neutrophils); glucose 32 mg/dL (simultaneous serum glucose 98 mg/dL); protein 198 mg/dL; Gram stain shows gram-negative diplococci`,
    "Which of the following is the most likely diagnosis?",
    opts5(
      "Acute bacterial meningitis",
      "Viral meningitis",
      "Subarachnoid hemorrhage",
      "Encephalitis",
      "Brain abscess"
    ),
    "Acute bacterial meningitis",
    `Fever, meningismus, altered mental status, neutrophilic pleocytosis, low CSF glucose, elevated protein, and gram-negative diplococci indicate acute bacterial meningitis (likely Neisseria meningitidis in a young adult). Viral meningitis typically has lymphocytic predominance and normal glucose. SAH presents with thunderclap headache and xanthochromia, not this CSF profile. Encephalitis emphasizes altered cognition/seizures with less prominent meningismus. Brain abscess shows focal deficits and ring-enhancing lesions.`,
    {
      blueprintDomain: "Nervous",
      stepLevel: "step2",
      difficulty: 4,
      tags: ["meningitis", "CSF", "physician-educator", BATCH],
      related: {
        memoryCardIds: ["usmle-meningitis-emergency"],
        keyTakeaway:
          "Neutrophilic CSF, low glucose, high protein → bacterial meningitis. Empiric antibiotics are the next step — not part of the diagnosis label.",
      },
    }
  ),

  usmleVignette(
    "emergency-medicine",
    `A 24-year-old woman with a known peanut allergy is eating at a restaurant when she develops lip swelling, diffuse urticaria, and wheezing within 10 minutes. Blood pressure 86/52 mm Hg, pulse 132/min, respirations 28/min, oxygen saturation 91% on room air. She is anxious and cannot speak in full sentences. Expiratory wheezes are heard bilaterally.`,
    "Which of the following is the most appropriate immediate treatment?",
    opts5(
      "Intravenous diphenhydramine alone",
      "Intramuscular epinephrine",
      "Nebulized albuterol only",
      "Oral prednisone and observation",
      "Intravenous normal saline bolus without epinephrine"
    ),
    "Intramuscular epinephrine",
    `Anaphylaxis with airway compromise, bronchospasm, and hypotension requires immediate IM epinephrine (anterolateral thigh) — first-line per ACLS/anaphylaxis protocols. Antihistamines and steroids are adjuncts, not substitutes. Albuterol alone does not reverse distributive shock. Oral steroids are too slow. Fluids are supportive after epinephrine when hypotension persists.`,
    {
      blueprintDomain: "Multisystem",
      stepLevel: "step2",
      difficulty: 3,
      tags: ["anaphylaxis", "epinephrine", "physician-educator", BATCH],
    }
  ),

  usmleVignette(
    "neurology",
    `A 68-year-old man with hypertension and type 2 diabetes suddenly cannot speak or move his right arm and leg. Symptom onset was 55 minutes ago while he was gardening. Blood pressure 178/96 mm Hg, pulse 88/min, respirations 16/min. He follows commands with his left side; right face, arm, and leg show dense weakness. NIH Stroke Scale score is 14. Fingerstick glucose 142 mg/dL. Noncontrast CT head shows no hemorrhage.`,
    "Which of the following is the most appropriate next step in management?",
    opts5(
      "Aspirin 325 mg and admit to neurology in 24 hours",
      "Intravenous alteplase after confirming eligibility",
      "Immediate carotid endarterectomy",
      "Heparin infusion without reperfusion therapy",
      "Lumbar puncture to exclude meningitis"
    ),
    "Intravenous alteplase after confirming eligibility",
    `Acute ischemic stroke within the thrombolysis window, no hemorrhage on CT, and measurable deficit — IV alteplase is indicated when exclusion criteria are absent. Aspirin alone delays reperfusion therapy in the golden hour. CEA is secondary prevention, not acute management. Therapeutic heparin is not first-line for acute ischemic stroke. LP is contraindicated with suspected stroke and raised ICP risk.`,
    {
      blueprintDomain: "Nervous",
      stepLevel: "step2",
      difficulty: 5,
      tags: ["stroke", "tPA", "physician-educator", BATCH],
      related: {
        memoryCardIds: ["usmle-stroke-tpa", "usmle-tpa-exclusions"],
        keyTakeaway: "Last known well <4.5 h, no hemorrhage on CT, no exclusions → IV alteplase before aspirin when eligible.",
      },
    }
  ),

  usmleVignette(
    "internal-medicine",
    `A 22-year-old woman with type 1 diabetes is brought to the emergency department for nausea, vomiting, and abdominal pain for one day. She ran out of insulin three days ago during a move. She appears dehydrated. Respirations are deep and rapid. Blood pressure 98/62 mm Hg, pulse 118/min. Exam shows dry mucous membranes and diffuse abdominal tenderness without rebound. Laboratory studies:
Glucose 486 mg/dL · pH 7.18 · HCO₃⁻ 10 mEq/L · anion gap 24 · β-hydroxybutyrate elevated · potassium 5.4 mEq/L · creatinine 1.4 mg/dL`,
    "Which of the following is the most appropriate initial management?",
    opts5(
      "Subcutaneous insulin sliding scale only",
      "Intravenous 0.9% saline, intravenous insulin, and potassium replacement as needed",
      "Oral metformin and discharge with close follow-up",
      "Sodium bicarbonate bolus for all patients with pH <7.20",
      "Immediate CT abdomen before any fluids"
    ),
    "Intravenous 0.9% saline, intravenous insulin, and potassium replacement as needed",
    `Diabetic ketoacidosis — hyperglycemia, anion-gap acidosis, ketonemia, dehydration. Initial therapy is IV fluids, IV insulin, electrolyte monitoring with potassium repletion when appropriate despite serum K⁺ appearing normal/high (total body depletion). Sliding scale alone is inadequate. Metformin is contraindicated in DKA. Bicarbonate is reserved for severe acidosis with hemodynamic instability, not routine. CT is not required before resuscitation unless alternative surgical abdomen is strongly suspected.`,
    {
      blueprintDomain: "Endocrine",
      stepLevel: "step2",
      difficulty: 4,
      tags: ["DKA", "diabetes", "physician-educator", BATCH],
      related: {
        memoryCardIds: ["usmle-dka-orders", "usmle-hhs-vs-dka"],
        keyTakeaway: "DKA: IV fluids + IV insulin + K⁺ when indicated — sliding scale alone is not enough.",
      },
    }
  ),

  usmleVignette(
    "pulmonology",
    `A 64-year-old man with COPD presents with three days of increased cough and purulent sputum. He uses a home albuterol inhaler. Temperature 38.6°C (101.5°F), blood pressure 128/74 mm Hg, pulse 104/min, respirations 26/min, oxygen saturation 88% on room air. Diffuse expiratory wheezes and coarse crackles are heard at the right base. Chest radiograph shows a right lower lobe infiltrate. Arterial blood gas on room air: pH 7.36, PaCO₂ 52 mm Hg, PaO₂ 58 mm Hg.`,
    "Which of the following is the most appropriate pharmacotherapy in addition to supplemental oxygen?",
    opts5(
      "Azithromycin alone without covering typical bacterial pathogens",
      "Levofloxacin monotherapy for all COPD exacerbations regardless of infiltrate",
      "Amoxicillin-clavulanate plus azithromycin",
      "Oseltamivir only",
      "High-dose inhaled corticosteroid monotherapy"
    ),
    "Amoxicillin-clavulanate plus azithromycin",
    `COPD exacerbation with fever, purulent sputum, and new infiltrate suggests infectious trigger including typical and atypical pathogens — amoxicillin-clavulanate plus macrolide (or respiratory fluoroquinolone) is appropriate inpatient therapy when pneumonia is suspected. Azithromycin alone misses S. pneumoniae/H. influenzae coverage needs. Universal levofloxacin ignores local resistance and spectrum nuance. Oseltamivir targets influenza only. ICS alone does not treat bacterial pneumonia.`,
    {
      blueprintDomain: "Respiratory",
      stepLevel: "step2",
      difficulty: 4,
      tags: ["COPD", "pneumonia", "physician-educator", BATCH],
      related: {
        memoryCardIds: ["usmle-cap-antibiotics"],
      },
    }
  ),

  usmleVignette(
    "cardiology",
    `A 72-year-old man with palpitations is found to have an irregularly irregular pulse. He is dizzy but alert. Blood pressure 88/54 mm Hg, pulse 156/min and irregular, respirations 18/min, oxygen saturation 96% on room air. ECG shows narrow-complex tachycardia without discrete P waves. He has no chest pain. He takes no anticoagulants. Echocardiogram from one year ago showed normal left ventricular function.`,
    "Which of the following is the most appropriate immediate management?",
    opts5(
      "Oral metoprolol and discharge",
      "Synchronized cardioversion",
      "Immediate apixaban load without rate control",
      "Adenosine 6 mg rapid IV push",
      "Transcutaneous pacing"
    ),
    "Synchronized cardioversion",
    `Atrial fibrillation with rapid ventricular response and hemodynamic instability (hypotension, dizziness) requires urgent synchronized cardioversion. Stable patients may receive rate control and anticoagulation planning. Oral beta-blockade is unsafe with shock. Anticoagulation alone does not restore perfusion. Adenosine treats reentrant SVT, not AFib. Pacing is for bradyarrhythmias.`,
    {
      blueprintDomain: "Cardiovascular",
      stepLevel: "step2",
      difficulty: 4,
      tags: ["atrial-fibrillation", "cardioversion", "physician-educator", BATCH],
    }
  ),

  usmleVignette(
    "pediatrics",
    `An 18-month-old boy is brought to the emergency department with intermittent severe crying episodes and one episode of stool mixed with blood and mucus that resembled "currant jelly." He had a viral URI last week. Between episodes he appears lethargic. Temperature 37.8°C (100.0°F), pulse 140/min, blood pressure 90/58 mm Hg. Abdomen is soft with a sausage-shaped mass in the right upper quadrant. Barium enema shows a coiled-spring appearance in the proximal colon.`,
    "Which of the following is the most likely diagnosis?",
    opts5(
      "Acute appendicitis",
      "Intussusception",
      "Midgut volvulus",
      "Meckel diverticulum with painless bleeding",
      "Henoch-Schönlein purpura nephritis"
    ),
    "Intussusception",
    `Classic triad: colicky pain, currant-jelly stool, sausage-shaped mass; barium enema coiled-spring sign confirms ileocolic intussusception in a toddler post-viral illness. Appendicitis is uncommon at this age and lacks coiled-spring sign. Volvulus shows bilious vomiting and abnormal midgut rotation. Meckel causes painless lower GI bleeding. HSP features palpable purpura and joint/abdominal pain with IgA vasculitis.`,
    {
      blueprintDomain: "GI",
      stepLevel: "step2",
      difficulty: 3,
      tags: ["intussusception", "pediatrics", "physician-educator", BATCH],
    }
  ),

  usmleVignette(
    "obgyn",
    `A 28-year-old woman, G2P1, delivers a 4.2-kg (9-lb 4-oz) infant vaginally after a prolonged second stage. Within minutes of delivery she soaks two perineal pads with blood and feels lightheaded. Blood pressure 82/48 mm Hg, pulse 128/min. The uterine fundus is boggy and rises above the umbilicus. Estimated blood loss exceeds 1,200 mL. Hemoglobin 7.8 g/dL. She is receiving oxytocin in IV fluids.`,
    "Which of the following is the most appropriate next step in management?",
    opts5(
      "Observation and repeat hemoglobin in 6 hours",
      "Uterine massage, additional uterotonics, and rapid transfusion protocol",
      "Immediate hysterectomy without medical management",
      "Magnetic resonance imaging of the pelvis",
      "Oral misoprostol only and discharge when stable"
    ),
    "Uterine massage, additional uterotonics, and rapid transfusion protocol",
    `Postpartum hemorrhage from uterine atony after macrosomia/prolonged labor — first stabilize with bimanual massage, escalate uterotonics (oxytocin, methylergonovine, carboprost as appropriate), IV access, blood products, and correct coagulopathy. Observation is unsafe with ongoing shock. Hysterectomy is rescue after failed medical therapy. MRI delays life-saving care. Oral misoprostol alone is inadequate for hemodynamic instability.`,
    {
      blueprintDomain: "Reproductive",
      stepLevel: "step2",
      difficulty: 4,
      tags: ["postpartum-hemorrhage", "OB", "physician-educator", BATCH],
    }
  ),

  usmleVignette(
    "psychiatry",
    `A 54-year-old man is admitted for elective knee replacement. On postoperative day 2 he becomes tremulous, diaphoretic, and agitated. He reports seeing "bugs on the wall." Blood pressure 168/102 mm Hg, pulse 118/min, temperature 38.2°C (100.8°F). He drinks 8–10 beers daily but his last drink was the morning of surgery three days ago. AST 86 U/L, ALT 72 U/L, magnesium 1.6 mg/dL.`,
    "Which of the following is the most appropriate treatment?",
    opts5(
      "Haloperidol monotherapy for visual hallucinations",
      "Benzodiazepines with thiamine supplementation",
      "Lorazepam is contraindicated; use phenytoin instead",
      "Disulfiram to prevent further drinking",
      "Observation only; symptoms will self-resolve"
    ),
    "Benzodiazepines with thiamine supplementation",
    `Alcohol withdrawal with autonomic hyperactivity and hallucinations — benzodiazepines (symptom-triggered dosing) are first-line; thiamine prevents Wernicke encephalopathy. Haloperidol lowers seizure threshold without treating withdrawal. Phenytoin does not prevent alcohol withdrawal seizures. Disulfiram is for motivated outpatient abstinence, not acute withdrawal. Untreated severe withdrawal can progress to seizures and delirium tremens.`,
    {
      blueprintDomain: "Behavioral Health",
      stepLevel: "step2",
      difficulty: 4,
      tags: ["alcohol-withdrawal", "CIWA", "physician-educator", BATCH],
    }
  ),

  usmleVignette(
    "microbiology",
    `A 17-year-old previously healthy boy develops fever, headache, and a petechial rash over his trunk and extremities six hours after attending a college party. Temperature 39.2°C (102.6°F), blood pressure 94/58 mm Hg, pulse 132/min. He is lethargic. Neck stiffness is mild. Labs show WBC 18,000/mm³. He received meningococcal vaccine at age 11. Blood cultures are drawn.`,
    "Which of the following host factors most likely increased his susceptibility to this infection despite vaccination?",
    opts5(
      "Deficiency of terminal complement components (C5–C9)",
      "IgA deficiency preventing mucosal immunity",
      "Chronic granulomatous disease",
      "HIV infection with CD4 count 320/mm³",
      "Defective neutrophil adhesion (LAD-1)"
    ),
    "Deficiency of terminal complement components (C5–C9)",
    `Recurrent Neisseria infections (meningococcus) strongly suggest terminal complement (membrane attack complex) deficiency despite vaccination — vaccine covers serogroups but invasive disease risk remains high with opsonization/lysis defects. IgA deficiency causes sinopulmonary infections, not classic meningococcemia. CGD causes catalase-positive organisms. HIV at 320 is unlikely in acute presentation. LAD presents in infancy with omphalitis and poor wound healing.`,
    {
      blueprintDomain: "General Principles",
      stepLevel: "step1",
      difficulty: 4,
      tags: ["meningococcus", "complement", "physician-educator", BATCH],
    }
  ),

  usmleVignette(
    "biochemistry",
    `A 4-day-old boy born at term develops poor feeding and progressive lethargy. His urine has a sweet, maple-syrup odor. He was discharged after an uncomplicated delivery. Temperature 37.0°C (98.6°F), pulse 156/min, respirations 48/min. Exam shows hypotonia and intermittent opisthotonus. Fingerstick glucose 48 mg/dL. Plasma leucine 450 µmol/L (markedly elevated); allo-isoleucine is detected.`,
    "Which of the following is the most likely enzymatic defect?",
    opts5(
      "Phenylalanine hydroxylase",
      "Branched-chain α-keto acid dehydrogenase",
      "Homogentisic acid oxidase",
      "Ornithine transcarbamylase",
      "Medium-chain acyl-CoA dehydrogenase"
    ),
    "Branched-chain α-keto acid dehydrogenase",
    `Maple syrup urine disease — sweet-smelling urine, neonatal encephalopathy, elevated BCAAs — reflects branched-chain α-keto acid dehydrogenase deficiency. Phenylalanine hydroxylase causes PKU (musty odor, intellectual disability without acute neonatal crisis). Homogentisic acid oxidase causes alkaptonuria. OTC deficiency causes hyperammonemia. MCAD causes fasting hypoketotic hypoglycemia.`,
    {
      blueprintDomain: "General Principles",
      stepLevel: "step1",
      difficulty: 4,
      tags: ["MSUD", "IEM", "physician-educator", BATCH],
    }
  ),

  usmleVignette(
    "ethics",
    `A 67-year-old man with advanced dementia is hospitalized for aspiration pneumonia. He pulls out his IV lines and tries to climb out of bed. He cannot state the year or recognize his spouse. Before dementia progressed, he completed a written advance directive requesting no cardiopulmonary resuscitation and no intubation. His daughter insists, "Do everything — he would want to live."`,
    "Which of the following is the most appropriate action?",
    opts5(
      "Follow the daughter's wishes because she is next of kin",
      "Intubate because pneumonia is treatable",
      "Honor the valid advance directive and use noninvasive treatments aligned with his documented goals",
      "Obtain a court order before withholding CPR in all cases",
      "Sedate the patient without addressing restraints or surrogate conflict"
    ),
    "Honor the valid advance directive and use noninvasive treatments aligned with his documented goals",
    `When a patient lacks decision-making capacity, a previously valid advance directive guides care. Surrogate input is sought but cannot override a clear prior expressed wish unless the directive is legally invalid or inapplicable to the scenario. Intubation contradicts documented goals. Court orders are not routinely required when directive is valid. Sedation alone ignores ethical process and least-restrictive alternatives.`,
    {
      blueprintDomain: "Social Sciences",
      stepLevel: "step2",
      difficulty: 3,
      tags: ["ethics", "advance-directive", "physician-educator", BATCH],
    }
  ),
];
