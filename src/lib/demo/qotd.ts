/**
 * Question of the Day — curated public pack (not live bank IDs).
 * Deterministic selection by UTC date so dated share URLs stay stable.
 */

import type { ExamSlug } from "@/types/edtech";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import { EXAM_ACCENTS } from "@/lib/landing/tokens";
import { getSiteUrl } from "@/lib/seo";
import { examMarketingPath } from "@/lib/seo/exam-config";
import type { ExamSeoKey } from "@/lib/seo/exam-config";

export type QotdItem = {
  id: string;
  examSlug: ExamSlug;
  examLabel: string;
  examColor: string;
  stem: string;
  options: string[];
  correct: string;
  rationale: string;
};

const EPOCH_UTC = Date.UTC(2024, 0, 1);

/** YYYY-MM-DD in UTC. */
export function todayIsoUtc(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function parseQotdDate(date: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return null;
  const utc = Date.UTC(y, m - 1, d);
  const check = new Date(utc);
  if (
    check.getUTCFullYear() !== y ||
    check.getUTCMonth() !== m - 1 ||
    check.getUTCDate() !== d
  ) {
    return null;
  }
  // Don't allow far-future dates (share spam) or pre-epoch junk
  const today = Date.UTC(
    new Date().getUTCFullYear(),
    new Date().getUTCMonth(),
    new Date().getUTCDate()
  );
  if (utc > today + 86_400_000) return null;
  if (utc < EPOCH_UTC) return null;
  return check;
}

export function dayIndexFromIso(dateIso: string): number {
  const parsed = parseQotdDate(dateIso);
  if (!parsed) return 0;
  return Math.floor((parsed.getTime() - EPOCH_UTC) / 86_400_000);
}

export function isQotdExamSlug(slug: string): slug is ExamSlug {
  return (EXAM_SLUGS as string[]).includes(slug);
}

function accent(exam: ExamSlug): string {
  const map: Record<ExamSlug, string> = {
    nclex: EXAM_ACCENTS.nclex,
    usmle: EXAM_ACCENTS.usmle,
    naplex: EXAM_ACCENTS.naplex,
    pance: EXAM_ACCENTS.pance,
    "aanp-fnp": EXAM_ACCENTS.aanpFnp,
    "npte-pt": EXAM_ACCENTS.nptePt,
  };
  return map[exam];
}

function item(
  examSlug: ExamSlug,
  id: string,
  stem: string,
  options: [string, string, string, string],
  correctIndex: 0 | 1 | 2 | 3,
  rationale: string
): QotdItem {
  const correct = options[correctIndex]!;
  return {
    id: `${examSlug}-${id}`,
    examSlug,
    examLabel: EXAM_CATALOG[examSlug].shortName,
    examColor: accent(examSlug),
    stem,
    options: [...options],
    correct,
    rationale,
  };
}

/** ≥7 curated items per exam for a ~2-week rotation. */
export const QOTD_BY_EXAM: Record<ExamSlug, QotdItem[]> = {
  nclex: [
    item(
      "nclex",
      "01",
      "A nurse assesses a client with fever 38.9°C (102°F), absolute neutrophil count 320/mm³, and a tunneled central line. Which action is the priority?",
      [
        "Apply a warm compress to the insertion site",
        "Obtain blood cultures and notify the provider for broad-spectrum antibiotics",
        "Encourage oral fluids and rest",
        "Document findings and reassess in 4 hours",
      ],
      1,
      "Febrile neutropenia with a central line is an emergency — cultures and empiric antibiotics cannot wait."
    ),
    item(
      "nclex",
      "02",
      "A client receiving IV morphine becomes increasingly drowsy with RR 8/min and SpO₂ 88% on room air. What is the nurse’s first action?",
      [
        "Increase the morphine rate to control breakthrough pain",
        "Encourage deep breathing and leave the room to chart",
        "Stop the opioid and prepare naloxone while supporting airway/breathing",
        "Give an antiemetic and reassess in 30 minutes",
      ],
      2,
      "Opioid-induced respiratory depression requires immediate opioid cessation, airway support, and naloxone readiness."
    ),
    item(
      "nclex",
      "03",
      "Which finding after a new ACE inhibitor prescription requires the most urgent follow-up?",
      [
        "Mild dry cough for 2 days",
        "BP 128/78 mmHg",
        "Potassium 4.2 mEq/L",
        "Angioedema of the lips and tongue",
      ],
      3,
      "ACE inhibitor–related angioedema can threaten the airway and is an emergency; cough and mild BP changes are expected considerations."
    ),
    item(
      "nclex",
      "04",
      "A postoperative client reports sudden shortness of breath and sharp chest pain. SpO₂ drops to 90%. Priority action?",
      [
        "Raise HOB, apply oxygen per protocol, and notify the provider of possible PE",
        "Encourage ambulation in the hallway",
        "Administer PRN acetaminophen and reassess later",
        "Document and continue routine vital signs q4h",
      ],
      0,
      "Acute dyspnea with chest pain after surgery raises PE concern — oxygen and rapid escalation come first."
    ),
    item(
      "nclex",
      "05",
      "A client with type 1 diabetes is NPO for surgery. Capillary glucose is 58 mg/dL and the client is diaphoretic. Best action?",
      [
        "Give scheduled morning insulin as ordered",
        "Treat hypoglycemia per protocol and notify the surgical team",
        "Delay treatment until after the procedure",
        "Offer a full breakfast tray immediately",
      ],
      1,
      "Symptomatic hypoglycemia needs prompt treatment even when NPO — use protocol glucose sources (e.g., IV dextrose) and escalate."
    ),
    item(
      "nclex",
      "06",
      "Which task is appropriate to delegate to a trained UAP for a stable medical-surgical client?",
      [
        "Titrating a heparin infusion",
        "Teaching insulin self-administration",
        "Assisting with morning ADLs and recording intake/output",
        "Assessing a new wound for infection",
      ],
      2,
      "UAPs can assist with ADLs and I/O for stable clients; assessment, teaching, and IV titration stay with the nurse."
    ),
    item(
      "nclex",
      "07",
      "A client on warfarin has INR 5.8 and no active bleeding. Which order should the nurse question first?",
      [
        "Hold warfarin and notify the provider",
        "Recheck INR per protocol",
        "Assess for bleeding precautions",
        "Administer an additional warfarin dose tonight",
      ],
      3,
      "An elevated INR with an extra warfarin dose worsens coagulopathy risk — hold and clarify before giving more anticoagulant."
    ),
  ],
  usmle: [
    item(
      "usmle",
      "01",
      "A 58-year-old man with type 2 diabetes presents with crushing substernal chest pain for 45 minutes. ECG shows ST elevation in V2–V4. Next best step?",
      [
        "Order serial troponins and observe",
        "Activate PCI and give aspirin + P2Y12 inhibitor",
        "Schedule stress test in 24 hours",
        "Start IV heparin alone and discharge if pain resolves",
      ],
      1,
      "STEMI requires immediate reperfusion — dual antiplatelet therapy and cath lab activation are time-critical."
    ),
    item(
      "usmle",
      "02",
      "A 24-year-old with sore throat develops fever, muffled “hot potato” voice, and trismus. Exam shows a swollen tonsil with uvular deviation. Most likely diagnosis?",
      [
        "Viral pharyngitis alone",
        "Simple allergic rhinitis",
        "Peritonsillar abscess",
        "Uncomplicated GERD",
      ],
      2,
      "Trismus, uvular deviation, and muffled “hot potato” voice point to peritonsillar abscess rather than routine pharyngitis."
    ),
    item(
      "usmle",
      "03",
      "A 67-year-old with AF on warfarin starts amiodarone for rhythm control. Which lab change is most expected if dosing is not adjusted?",
      [
        "Falling INR requiring higher warfarin doses",
        "Isolated hyperkalemia without INR change",
        "No interaction — INR remains stable",
        "Rising INR from CYP2C9 inhibition reducing warfarin clearance",
      ],
      3,
      "Amiodarone inhibits CYP2C9 (and other CYPs), potentiating warfarin; INR often rises and warfarin usually needs reduction."
    ),
    item(
      "usmle",
      "04",
      "A toddler with barking cough and stridor improves with cool air. Soft-tissue neck film shows subglottic narrowing. Best initial therapy for moderate croup?",
      [
        "Dexamethasone (and nebulized epinephrine if moderate–severe)",
        "Immediate intubation for all cases",
        "Oral azithromycin alone",
        "Chest physiotherapy",
      ],
      0,
      "Croup is treated with corticosteroids; nebulized epinephrine is added for moderate–severe airway compromise."
    ),
    item(
      "usmle",
      "05",
      "A 45-year-old with long-standing GERD has progressive dysphagia to solids. Endoscopy shows a distal esophageal stricture. Which chronic exposure is most associated?",
      [
        "Acute viral esophagitis alone",
        "Acid-mediated peptic stricture from untreated reflux",
        "Lactose intolerance",
        "Vitamin B12 deficiency",
      ],
      1,
      "Chronic acid injury can fibrose the distal esophagus into a peptic stricture causing progressive solid-food dysphagia."
    ),
    item(
      "usmle",
      "06",
      "A patient with CKD stage 4 has phosphate 6.8 mg/dL and rising PTH. First-line dietary and medical focus?",
      [
        "High-phosphate supplements",
        "Immediate parathyroidectomy for all patients",
        "Phosphate binders with meals plus dietary phosphate restriction",
        "Unrestricted dairy intake",
      ],
      2,
      "Secondary hyperparathyroidism management starts with phosphate control — binders with meals and diet limits."
    ),
    item(
      "usmle",
      "07",
      "A 30-year-old develops ascending paralysis after a diarrheal illness. CSF shows albuminocytologic dissociation. Most likely diagnosis?",
      [
        "Myasthenia gravis crisis",
        "Botulism from home-canned food only",
        "Acute ischemic stroke",
        "Guillain–Barré syndrome",
      ],
      3,
      "Post-infectious ascending paralysis with cytoalbuminologic dissociation is classic Guillain–Barré."
    ),
  ],
  naplex: [
    item(
      "naplex",
      "01",
      "A prescription calls for 240 mL of a 2.5% w/v solution. The pharmacy stocks a 10% w/v concentrate. How many milliliters of concentrate and diluent are needed?",
      [
        "24 mL concentrate + 216 mL diluent",
        "60 mL concentrate + 180 mL diluent",
        "120 mL concentrate + 120 mL diluent",
        "240 mL concentrate, no diluent",
      ],
      1,
      "240 mL × 2.5% = 6 g drug → 6 g ÷ 0.10 = 60 mL of 10% concentrate; QS with diluent to 240 mL."
    ),
    item(
      "naplex",
      "02",
      "A patient on warfarin asks about starting a new St. John’s wort supplement. Best counseling point?",
      [
        "Safe with all anticoagulants at any dose",
        "Only interacts with antibiotics",
        "Avoid — it can induce metabolism and reduce warfarin effect",
        "Increases INR in every patient",
      ],
      2,
      "St. John’s wort induces CYP enzymes and P-gp and can lower warfarin exposure / anticoagulant effect (typically ↓ INR)."
    ),
    item(
      "naplex",
      "03",
      "Vancomycin trough is drawn correctly just before the 4th dose. Level is above goal with stable renal function. Best next step?",
      [
        "Double the dose immediately",
        "Ignore troughs for vancomycin",
        "Switch to oral vancomycin for bacteremia",
        "Extend the dosing interval (or adjust per protocol) and recheck",
      ],
      3,
      "Supratherapeutic troughs usually need interval extension or dose reduction with follow-up levels."
    ),
    item(
      "naplex",
      "04",
      "A 10-kg child needs amoxicillin 40 mg/kg/day divided BID for 10 days. Suspension is 400 mg/5 mL. What volume per dose?",
      [
        "2.5 mL per dose",
        "5 mL per dose",
        "10 mL per dose",
        "1 mL per dose",
      ],
      0,
      "Total daily = 400 mg → 200 mg/dose. 400 mg/5 mL → 2.5 mL delivers 200 mg."
    ),
    item(
      "naplex",
      "05",
      "Which inhaler counseling point is most important for a new fluticasone/salmeterol Diskus?",
      [
        "Use only during asthma attacks",
        "Rinse mouth after use to reduce thrush risk; do not use for acute rescue",
        "Shake vigorously like an MDI before every puff",
        "Store in the freezer",
      ],
      1,
      "ICS/LABA maintenance devices need mouth rinsing; they are not rescue monotherapy for acute bronchospasm. Diskus devices are not shaken like MDIs."
    ),
    item(
      "naplex",
      "06",
      "A prescription is written for “metformin 500 mg BID with meals.” Which counseling statement is best?",
      [
        "Take on an empty stomach for better absorption always",
        "Crush extended-release tablets if hard to swallow",
        "Take with food to reduce GI upset; report lactic acidosis warning signs",
        "Stop if mild diarrhea occurs once",
      ],
      2,
      "Food improves GI tolerance; patients should know rare lactic acidosis symptoms and not crush XR forms inappropriately."
    ),
    item(
      "naplex",
      "07",
      "How many milliequivalents of Na are in 1 L of 0.9% NaCl? (MW NaCl ≈ 58.5; Na = 23)",
      [
        "≈77 mEq",
        "≈308 mEq",
        "≈23 mEq",
        "≈154 mEq",
      ],
      3,
      "0.9% = 9 g/L → 9/58.5 ≈ 0.154 mol → 154 mEq Na⁺ (and Cl⁻) per liter."
    ),
  ],
  pance: [
    item(
      "pance",
      "01",
      "A 24-year-old presents after a tick bite with an expanding erythema migrans rash and mild arthralgias. No focal neuro deficits. Best initial management?",
      [
        "Await serology before treating",
        "Doxycycline for early localized Lyme disease",
        "Ceftriaxone IV for 14 days",
        "Prednisone for presumed reactive arthritis",
      ],
      1,
      "Erythema migrans in an endemic area is clinical Lyme — treat empirically without waiting for seroconversion."
    ),
    item(
      "pance",
      "02",
      "A 55-year-old smoker has hemoptysis and a new 2.5 cm spiculated upper-lobe nodule. Next best step?",
      [
        "Reassure and repeat CXR in 2 years",
        "Start empiric antibiotics for 6 weeks without imaging follow-up",
        "Urgent specialty referral / tissue diagnosis pathway (not watchful waiting alone)",
        "High-dose vitamin C only",
      ],
      2,
      "Spiculated nodules in smokers need prompt workup for malignancy rather than delayed observation."
    ),
    item(
      "pance",
      "03",
      "A young adult has sudden severe headache, photophobia, and nuchal rigidity. Kernig sign positive. Immediate priority?",
      [
        "Outpatient migraine diary for 2 weeks",
        "Only MRI without considering LP/antibiotics timing",
        "Discharge with acetaminophen",
        "Stabilize ABCs and pursue emergent meningitis evaluation/treatment pathway",
      ],
      3,
      "Suspect meningitis — don’t delay airway/support and the urgent diagnostic/treatment sequence."
    ),
    item(
      "pance",
      "04",
      "A 62-year-old with CHF has weight gain, rising creatinine on high-dose loop diuretic, and orthopnea. Exam shows crackles. Best adjustment theme?",
      [
        "Optimize volume status carefully — treat congestion while monitoring renal perfusion",
        "Stop all diuretics permanently",
        "Force fluids aggressively overnight",
        "Ignore weight changes",
      ],
      0,
      "Decompensated HF needs thoughtful decongestion with labs/vitals — not abrupt abandonment of diuresis or blind fluid loading."
    ),
    item(
      "pance",
      "05",
      "Which screening test is most appropriate for a sexually active 22-year-old woman at a preventive visit?",
      [
        "Annual coronary CT angiogram",
        "Chlamydia screening (and gonorrhea per guidelines)",
        "PSA testing",
        "No STI screening ever after age 18",
      ],
      1,
      "Young sexually active women should be offered guideline-based chlamydia (and often gonorrhea) screening."
    ),
    item(
      "pance",
      "06",
      "A patient with acute monoarticular knee pain, fever, and inability to bear weight. Synovial WBC is very high with neutrophils. Priority?",
      [
        "Home rest and ice only",
        "Oral steroids without arthrocentesis consideration",
        "Treat as septic arthritis — urgent ortho/ID pathway and IV antibiotics after cultures",
        "Ignore fever",
      ],
      2,
      "Hot joint + systemic signs = septic arthritis until proven otherwise — urgent drainage/antibiotics."
    ),
    item(
      "pance",
      "07",
      "First-line pharmacologic therapy for a newly diagnosed adult with infrequent asthma symptoms (a few times per month)?",
      [
        "Daily high-dose oral steroids indefinitely",
        "Long-term oxygen at home",
        "No inhaler therapy ever",
        "As-needed low-dose ICS–formoterol (preferred) — avoid SABA-only therapy",
      ],
      3,
      "GINA advises against SABA-only treatment; preferred Track 1 for infrequent symptoms is as-needed low-dose ICS–formoterol."
    ),
  ],
  "aanp-fnp": [
    item(
      "aanp-fnp",
      "01",
      "A 52-year-old woman with type 2 diabetes and BMI 34 has an A1c of 8.4% on metformin 1000 mg BID. BP 138/86, eGFR 72. Best next step?",
      [
        "Increase metformin to 1500 mg BID without additional agent",
        "Add a GLP-1 receptor agonist or SGLT2 inhibitor with cardiorenal benefit",
        "Start basal insulin before optimizing non-insulin therapy",
        "Recheck A1c in 6 months with lifestyle counseling only",
      ],
      1,
      "Above-goal A1c on maximized metformin warrants intensification; with obesity, a GLP-1 RA (or SGLT2i when indicated) is preferred over further delay."
    ),
    item(
      "aanp-fnp",
      "02",
      "A 45-year-old’s screening BP is 148/92 on two separate visits. No end-organ damage. Next best step?",
      [
        "Reassure that one reading is noise forever",
        "Order cardiac catheterization immediately",
        "Confirm and start lifestyle + pharmacologic therapy per hypertension guideline stage",
        "Start three antihypertensives the same day without lifestyle counseling",
      ],
      2,
      "Stage 2-range readings (≥140/90) on repeat visits typically need medication plus lifestyle — not indefinite reassurance."
    ),
    item(
      "aanp-fnp",
      "03",
      "Which contraceptive counseling point is most accurate for a combined oral contraceptive candidate who smokes 15 cigarettes/day and is 36?",
      [
        "Combined pills are preferred because smoking protects against clotting",
        "No VTE risk discussion is needed",
        "Depot medroxyprogesterone is the only legal option worldwide",
        "Combined hormonal contraception is generally contraindicated — discuss progestin-only or nonhormonal options",
      ],
      3,
      "Age ≥35 with substantial smoking is a combined hormonal contraception contraindication (US MEC 4) — offer safer alternatives."
    ),
    item(
      "aanp-fnp",
      "04",
      "A healthy 6-month-old is due for routine immunizations. Parents ask about acetaminophen before vaccines. Best guidance?",
      [
        "Don’t preemptively dose antipyretics solely to prevent fever; treat discomfort if it occurs",
        "Always give high-dose aspirin before shots",
        "Skip all vaccines if mild fever occurred once before",
        "Vaccines are optional after 2 months of age",
      ],
      0,
      "Routine prophylactic antipyretics aren’t required and may blunt antibody response; treat symptoms if needed after vaccination."
    ),
    item(
      "aanp-fnp",
      "05",
      "A 28-year-old has dysuria, frequency, and no vaginal discharge. Urine dip is nitrite+. Best empiric approach for uncomplicated cystitis?",
      [
        "IV vancomycin for all UTI",
        "Short-course guideline antibiotic (e.g., nitrofurantoin when appropriate) after assessing allergies/local resistance",
        "No treatment if afebrile",
        "Only cranberry juice for 8 weeks",
      ],
      1,
      "Uncomplicated cystitis is treated with short-course agents chosen for efficacy, resistance, and patient factors."
    ),
    item(
      "aanp-fnp",
      "06",
      "An older adult’s PHQ-9 is 18 with anhedonia and passive death wish but no plan/intent. Best next step?",
      [
        "Discharge without follow-up",
        "Start high-dose benzodiazepines as monotherapy forever",
        "Safety assessment, close follow-up, and initiate evidence-based depression treatment / referral",
        "Ignore because grief is always self-limited",
      ],
      2,
      "Moderate–severe PHQ-9 plus passive SI needs structured safety evaluation and active depression management."
    ),
    item(
      "aanp-fnp",
      "07",
      "A patient with osteoarthritis knee pain failed acetaminophen. No GI bleed history. Which is a reasonable next pharmacologic step?",
      [
        "Long-term high-dose opioids as first next step",
        "Systemic corticosteroids indefinitely",
        "No analgesia options exist",
        "Trial of topical or oral NSAID with GI/renal risk counseling",
      ],
      3,
      "After acetaminophen, NSAIDs (often topical first for knee OA) are common next options when risks are acceptable."
    ),
  ],
  "npte-pt": [
    item(
      "npte-pt",
      "01",
      "A physical therapist evaluates a patient 2 days post–total knee arthroplasty. Knee flexion 65°, moderate effusion, quadriceps activation lag. Priority intervention?",
      [
        "Aggressive end-range flexion stretching despite hemarthrosis",
        "Quad sets / straight-leg raise progression and edema control within precautions",
        "Complete bedrest for 2 weeks",
        "Discontinue all strengthening until week 6",
      ],
      1,
      "Early TKA rehab prioritizes quad activation, ROM within protocol, and swelling control — not aggressive forced motion."
    ),
    item(
      "npte-pt",
      "02",
      "A patient with Parkinson disease shows festinating gait and reduced step length. Which cueing strategy is most appropriate?",
      [
        "Encourage faster shuffling without cues",
        "Avoid all gait training",
        "External auditory or visual cues to normalize stride",
        "Only passive ROM in supine forever",
      ],
      2,
      "External cueing helps break hypokinetic gait patterns in Parkinson disease."
    ),
    item(
      "npte-pt",
      "03",
      "During a lumbar exam, passive straight-leg raise reproduces familiar radicular pain at 35°. This finding most supports?",
      [
        "Isolated hip OA only",
        "Ankle sprain",
        "Normal mobility with no pathology",
        "Neural tension / disc-related nerve root irritability",
      ],
      3,
      "Early-angle SLR reproducing radicular symptoms suggests neural tension consistent with radiculopathy."
    ),
    item(
      "npte-pt",
      "04",
      "A patient with COPD has SpO₂ 88% on room air during ambulation and reports severe dyspnea. Best immediate action?",
      [
        "Stop activity, position for breathing, apply supplemental O₂ per order/protocol, reassess",
        "Push through to complete the full 6-minute walk no matter what",
        "Start high-intensity plyometrics",
        "Ignore desaturation",
      ],
      0,
      "Exercise-induced desaturation needs activity pause, breathing strategy, and oxygen per protocol."
    ),
    item(
      "npte-pt",
      "05",
      "Which transfer is most appropriate for a patient with complete C6 tetraplegia who has strong tenodesis and fair trunk control in sitting?",
      [
        "Independent high-level gymnastics mounts",
        "Sliding board transfer with skilled assistance as needed",
        "Unsupervised ladder climbing",
        "Standing pivot without any upper extremity support ever",
      ],
      1,
      "C6-level patients often use sliding-board techniques leveraging tenodesis and available UE strength."
    ),
    item(
      "npte-pt",
      "06",
      "A sports athlete 3 months post-ACL reconstruction has full ROM, good quad strength, and sport-specific clearance goals. Which principle guides return-to-sport testing?",
      [
        "Return after exactly 8 weeks regardless of function",
        "Pain must be ignored during cutting drills",
        "Objective criteria (strength symmetry, hop tests, movement quality) — not time alone",
        "Bracing replaces all strengthening",
      ],
      2,
      "RTS decisions use criterion-based testing rather than calendar time alone."
    ),
    item(
      "npte-pt",
      "07",
      "A patient with a recent CVA has left neglect. Which treatment environment modification helps most during gait training?",
      [
        "Always approach only from the right and never cue left",
        "Eliminate all visual input",
        "Avoid standing activities entirely",
        "Arrange stimuli and therapist positioning to encourage left-side scanning",
      ],
      3,
      "Neglect rehab uses structured cues and environmental setup to promote attention toward the neglected side."
    ),
  ],
};


export function getQotdForExam(exam: ExamSlug, dateIso: string): QotdItem {
  const pack = QOTD_BY_EXAM[exam];
  const idx = dayIndexFromIso(dateIso) % pack.length;
  return pack[idx]!;
}

export function getQotdHubFeatured(dateIso: string): ExamSlug {
  const idx = dayIndexFromIso(dateIso) % EXAM_SLUGS.length;
  return EXAM_SLUGS[idx]!;
}

export function qotdPath(exam: ExamSlug, dateIso?: string): string {
  if (dateIso) return `/daily/${exam}/${dateIso}`;
  return `/daily/${exam}`;
}

export function qotdAbsoluteUrl(exam: ExamSlug, dateIso: string): string {
  return `${getSiteUrl()}${qotdPath(exam, dateIso)}`;
}

export function qotdShareCaption(item: QotdItem, dateIso: string): string {
  const stem =
    item.stem.length > 140 ? `${item.stem.slice(0, 137).trimEnd()}…` : item.stem;
  return `${item.examLabel} Question of the Day (${dateIso}): ${stem}`;
}

export function qotdEntityId(exam: ExamSlug, dateIso: string): string {
  return `qotd-${exam}-${dateIso}`;
}

export function examMarketingHref(exam: ExamSlug): string {
  return examMarketingPath(exam as ExamSeoKey);
}

export function formatQotdDisplayDate(dateIso: string): string {
  const parsed = parseQotdDate(dateIso);
  if (!parsed) return dateIso;
  return parsed.toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
