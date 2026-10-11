/**
 * Question of the Day — curated public pack (not live bank IDs).
 * The calendar day is America/Chicago so share URLs roll at midnight Central,
 * not at 7 PM when UTC midnight arrives. Do not import this module from a
 * client component — the answer key is in this file.
 */

import type { ExamSlug } from "@/types/edtech";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import { EXAM_ACCENTS } from "@/lib/landing/tokens";
import {
  dayIndexFromIso,
  type QotdItem,
} from "@/lib/demo/qotd-public";

export {
  dayIndexFromIso,
  examMarketingHref,
  formatQotdDisplayDate,
  parseQotdDate,
  qotdAbsoluteUrl,
  qotdEntityId,
  qotdPath,
  qotdShareCaption,
  todayIsoCentral,
  toPublicQotd,
} from "@/lib/demo/qotd-public";
export type { QotdItem, QotdPublicItem } from "@/lib/demo/qotd-public";

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

/** Seven curated items per exam. Selection is the Chicago day index mod 7. */
export const QOTD_BY_EXAM: Record<ExamSlug, QotdItem[]> = {
  nclex: [
    item(
      "nclex",
      "01",
      "A nurse assesses a client with fever 38.9°C (102°F), absolute neutrophil count 320/mm³, and a tunneled central line. Which action is the priority?",
      [
        "Apply a warm compress and recheck the insertion site in two hours",
        "Obtain blood cultures and start empiric broad-spectrum antibiotics",
        "Encourage oral fluids, rest, and acetaminophen at home",
        "Document the fever and repeat the vital signs in four hours",
      ],
      1,
      "Febrile neutropenia with a central line is an emergency — cultures and empiric antibiotics cannot wait."
    ),
    item(
      "nclex",
      "02",
      "A client receiving IV morphine becomes increasingly drowsy with RR 8/min and SpO₂ 88% on room air. What is the nurse’s first action?",
      [
        "Increase the morphine rate to treat residual pain",
        "Coach deep breathing, then chart and reassess in one hour",
        "Stop the opioid, support breathing, and have naloxone ready",
        "Give an antiemetic and reassess sedation in 30 minutes",
      ],
      2,
      "Opioid-induced respiratory depression requires immediate opioid cessation, airway support, and naloxone readiness."
    ),
    item(
      "nclex",
      "03",
      "Which finding after a new ACE inhibitor prescription requires the most urgent follow-up?",
      [
        "A mild dry cough for the past two days",
        "Blood pressure of 128/78 mm Hg at this visit",
        "Serum potassium of 4.2 mEq/L on today’s draw",
        "Lip and tongue swelling since the first dose",
      ],
      3,
      "ACE inhibitor–related angioedema can threaten the airway and is an emergency; cough and mild BP changes are expected considerations."
    ),
    item(
      "nclex",
      "04",
      "A postoperative client reports sudden shortness of breath and sharp chest pain. SpO₂ drops to 90%. Priority action?",
      [
        "Sit the client up, apply oxygen, and notify the provider",
        "Walk the client in the hall to check for atelectasis",
        "Give PRN acetaminophen and reassess the pain later",
        "Chart the complaint and continue vital signs every four hours",
      ],
      0,
      "Acute dyspnea with chest pain after surgery raises PE concern — oxygen and rapid escalation come first."
    ),
    item(
      "nclex",
      "05",
      "A client with type 1 diabetes is NPO for surgery. Capillary glucose is 58 mg/dL and the client is diaphoretic. Best action?",
      [
        "Give the scheduled morning insulin before the case",
        "Treat the low glucose and notify the surgical team",
        "Hold treatment until the procedure is finished",
        "Send a full breakfast tray despite the NPO order",
      ],
      1,
      "Symptomatic hypoglycemia needs prompt treatment even when NPO — use protocol glucose sources (e.g., IV dextrose) and escalate."
    ),
    item(
      "nclex",
      "06",
      "Which task is appropriate to delegate to a trained UAP for a stable medical-surgical client?",
      [
        "Titrate the heparin infusion using the aPTT",
        "Teach insulin self-injection for the first time",
        "Help with bathing and record intake and output",
        "Assess a new surgical wound for infection",
      ],
      2,
      "UAPs can assist with ADLs and I/O for stable clients; assessment, teaching, and IV titration stay with the nurse."
    ),
    item(
      "nclex",
      "07",
      "A client on warfarin has INR 5.8 and no active bleeding. Which order should the nurse question first?",
      [
        "Hold tonight’s warfarin and notify the provider",
        "Recheck the INR before the next scheduled dose",
        "Review bleeding precautions and inspect for new bruising",
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
        "Order serial troponins and observe without reperfusion",
        "Activate PCI and give aspirin plus a P2Y12 inhibitor",
        "Schedule a treadmill stress test for the next day",
        "Start IV heparin alone and discharge if the pain stops",
      ],
      1,
      "STEMI requires immediate reperfusion — dual antiplatelet therapy and cath lab activation are time-critical."
    ),
    item(
      "usmle",
      "02",
      "A 24-year-old with sore throat develops fever, muffled “hot potato” voice, and trismus. Exam shows a swollen tonsil with uvular deviation. Most likely diagnosis?",
      [
        "Viral pharyngitis without a deep-space infection",
        "Infectious mononucleosis with tonsillar hypertrophy",
        "Peritonsillar abscess on the affected side",
        "Retropharyngeal abscess behind the pharynx",
      ],
      2,
      "Trismus, uvular deviation, and muffled “hot potato” voice point to peritonsillar abscess rather than routine pharyngitis."
    ),
    item(
      "usmle",
      "03",
      "A 67-year-old with AF on warfarin starts amiodarone for rhythm control. Which lab change is most expected if dosing is not adjusted?",
      [
        "A falling INR, so the warfarin dose should be increased",
        "No INR change, because these two drugs do not interact",
        "A stable INR for months, with TSH the only lab to follow",
        "A rising INR because amiodarone slows warfarin clearance",
      ],
      3,
      "Amiodarone inhibits CYP2C9 (and other CYPs), potentiating warfarin; INR often rises and warfarin usually needs reduction."
    ),
    item(
      "usmle",
      "04",
      "A toddler has a barking cough, hoarseness, and stridor at rest. Soft-tissue neck film shows subglottic narrowing. Best initial therapy for moderate croup?",
      [
        "Dexamethasone now, plus nebulized epinephrine",
        "Humidified mist or a cool-mist tent as the main treatment",
        "A course of oral azithromycin for viral croup",
        "Immediate intubation before any medication trial",
      ],
      0,
      "Dexamethasone is indicated for croup of all severities. Add nebulized epinephrine for moderate or severe croup. Humidified air or mist is not treatment."
    ),
    item(
      "usmle",
      "05",
      "A 45-year-old with long-standing GERD has progressive dysphagia to solids. Endoscopy shows a distal esophageal stricture. Which chronic exposure is most associated?",
      [
        "One self-limited episode of viral esophagitis",
        "Longstanding acid injury from years of untreated reflux",
        "Bisphosphonate tablets swallowed with little water",
        "Earlier chest radiation without a reflux history",
      ],
      1,
      "Chronic acid injury can fibrose the distal esophagus into a peptic stricture causing progressive solid-food dysphagia."
    ),
    item(
      "usmle",
      "06",
      "A patient with CKD stage 4 has phosphate 6.8 mg/dL and rising PTH. First-line dietary and medical focus?",
      [
        "Phosphate supplements to match the elevated PTH",
        "Parathyroidectomy before a trial of phosphate control",
        "Phosphate binders with meals and a low-phosphate diet",
        "Calcitriol alone while dairy intake stays high",
      ],
      2,
      "Secondary hyperparathyroidism management starts with phosphate control — binders with meals and diet limits."
    ),
    item(
      "usmle",
      "07",
      "A 30-year-old develops ascending paralysis after a diarrheal illness. CSF shows albuminocytologic dissociation. Most likely diagnosis?",
      [
        "Myasthenic crisis without a preceding illness",
        "Foodborne botulism from preformed toxin",
        "Acute cervical spinal cord compression",
        "Post-infectious Guillain–Barré syndrome",
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
        "It can be taken with warfarin without extra INR checks",
        "The interaction concern is with antibiotics, not warfarin",
        "Do not start it; enzyme induction can lower the INR",
        "Expect the INR to rise, and reduce the warfarin dose now",
      ],
      2,
      "St. John’s wort induces CYP enzymes and P-gp and can lower warfarin exposure / anticoagulant effect (typically ↓ INR)."
    ),
    item(
      "naplex",
      "03",
      "An adult with MRSA bacteremia and stable renal function is started on IV vancomycin. Which monitoring plan matches the 2020 ASHP/IDSA consensus?",
      [
        "Target a trough of 15–20 mg/L as the efficacy goal",
        "Follow peak levels only and do not estimate the daily AUC",
        "Skip concentration monitoring on a standard every-12-hour dose",
        "Use AUC-guided dosing with an AUC/MIC target of 400–600",
      ],
      3,
      "For serious MRSA infections, the 2020 ASHP/IDSA consensus (with PIDS and SIDP) recommends AUC-guided vancomycin dosing with an AUC/MIC target of 400–600 (assuming a broth-microdilution MIC of 1 mg/L). Trough-only monitoring, including a trough target of 15–20 mg/L, is no longer recommended as the efficacy target."
    ),
    item(
      "naplex",
      "04",
      "A 10-kg child needs amoxicillin 40 mg/kg/day divided BID for 10 days. Suspension is 400 mg/5 mL. What volume per dose?",
      [
        "Give 2.5 mL (200 mg) with each dose",
        "5 mL (400 mg) per dose",
        "10 mL (800 mg) with each dose",
        "1 mL (80 mg) per dose",
      ],
      0,
      "Total daily = 400 mg → 200 mg/dose. 400 mg/5 mL → 2.5 mL delivers 200 mg."
    ),
    item(
      "naplex",
      "05",
      "Which inhaler counseling point is most important for a new fluticasone/salmeterol Diskus?",
      [
        "Reserve this inhaler for sudden asthma symptoms only",
        "Rinse the mouth after use; this is not a rescue inhaler",
        "Shake it before every dose, the same way you shake an MDI",
        "Prime it with test sprays into the air before each dose",
      ],
      1,
      "ICS/LABA maintenance devices need mouth rinsing; they are not rescue monotherapy for acute bronchospasm. Diskus devices are not shaken like MDIs."
    ),
    item(
      "naplex",
      "06",
      "A prescription is written for “metformin 500 mg BID with meals.” Which counseling statement is best?",
      [
        "Take every dose on an empty stomach so more drug is absorbed",
        "Crush the extended-release tablet if it is hard to swallow",
        "Take it with food and report lactic acidosis warning signs",
        "Stop the medicine after a single episode of mild diarrhea",
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
        "Wait for confirmatory Lyme serology before any antibiotic",
        "Start oral doxycycline now for early localized Lyme disease",
        "Give intravenous ceftriaxone for 14 days for this rash alone",
        "Treat with prednisone for presumed reactive arthritis",
      ],
      1,
      "Erythema migrans in an endemic area is clinical Lyme — treat empirically without waiting for seroconversion."
    ),
    item(
      "pance",
      "02",
      "A 55-year-old smoker has hemoptysis and a new 2.5 cm spiculated upper-lobe nodule. Next best step?",
      [
        "Reassure the patient and repeat the chest x-ray in two years",
        "Give a week of antibiotics and do no further imaging",
        "Arrange prompt specialty referral for possible lung cancer",
        "Repeat low-dose CT in 12 months if the hemoptysis stops",
      ],
      2,
      "Spiculated nodules in smokers need prompt workup for malignancy rather than delayed observation."
    ),
    item(
      "pance",
      "03",
      "A young adult has sudden severe headache, photophobia, and nuchal rigidity. Kernig sign positive. Immediate priority?",
      [
        "Sumatriptan now and a clinic visit tomorrow for presumed migraine",
        "MRI of the brain before antibiotics or lumbar puncture",
        "Acetaminophen and discharge if the CT scan is normal",
        "Stabilize, culture, and start treatment for meningitis",
      ],
      3,
      "Suspect meningitis — don’t delay airway/support and the urgent diagnostic/treatment sequence."
    ),
    item(
      "pance",
      "04",
      "A 62-year-old with CHF has weight gain, rising creatinine on high-dose loop diuretic, and orthopnea. Exam shows crackles. Best adjustment theme?",
      [
        "Relieve congestion carefully while watching renal perfusion",
        "Stop the loop diuretic indefinitely because the creatinine rose",
        "Give an overnight fluid bolus to treat the creatinine rise",
        "Keep the same diuretic dose and stop recording daily weights",
      ],
      0,
      "Decompensated HF needs thoughtful decongestion with labs/vitals — not abrupt abandonment of diuresis or blind fluid loading."
    ),
    item(
      "pance",
      "05",
      "Which screening test is most appropriate for a sexually active 22-year-old woman at a preventive visit?",
      [
        "Defer chlamydia testing until she turns 25 years old",
        "Order chlamydia and gonorrhea screening at this visit",
        "Mammography as the priority cancer screen at this visit",
        "Skip STI tests because she has no urinary symptoms",
      ],
      1,
      "Young sexually active women should be offered guideline-based chlamydia (and often gonorrhea) screening."
    ),
    item(
      "pance",
      "06",
      "A patient with acute monoarticular knee pain, fever, and inability to bear weight. Synovial WBC is very high with neutrophils. Priority?",
      [
        "Rest, ice, and a clinic recheck in two days if fever persists",
        "Oral prednisone for suspected gout before any aspiration",
        "Aspirate the joint and start intravenous antibiotics",
        "Colchicine alone, with a follow-up visit next week",
      ],
      2,
      "Hot joint + systemic signs = septic arthritis until proven otherwise — urgent drainage/antibiotics."
    ),
    item(
      "pance",
      "07",
      "First-line pharmacologic therapy for a newly diagnosed adult with infrequent asthma symptoms (a few times per month)?",
      [
        "Daily oral prednisone as the first controller medicine",
        "Salmeterol twice daily with no inhaled corticosteroid",
        "As-needed albuterol alone, with no inhaled steroid",
        "As-needed low-dose ICS–formoterol when symptoms occur",
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
        "Increase metformin to 1500 mg BID and add nothing else",
        "Add a GLP-1 receptor agonist or an SGLT2 inhibitor next",
        "Start basal insulin before optimizing other non-insulin therapy",
        "Lifestyle counseling only, and repeat the A1c in six months",
      ],
      1,
      "Above-goal A1c on maximized metformin warrants intensification; with obesity, a GLP-1 RA (or SGLT2i when indicated) is preferred over further delay."
    ),
    item(
      "aanp-fnp",
      "02",
      "A 45-year-old’s screening BP is 148/92 on two separate visits. No end-organ damage. Next best step?",
      [
        "Recheck the blood pressure next year before starting treatment",
        "Refer for coronary angiography before any blood pressure medicine",
        "Confirm both readings and start lifestyle plus medication",
        "Start three antihypertensives today and skip lifestyle counseling",
      ],
      2,
      "Stage 2-range readings (≥140/90) on repeat visits typically need medication plus lifestyle — not indefinite reassurance."
    ),
    item(
      "aanp-fnp",
      "03",
      "Which contraceptive counseling point is most accurate for a combined oral contraceptive candidate who smokes 15 cigarettes/day and is 36?",
      [
        "A combined pill is still preferred because she is younger than 40",
        "Thrombosis does not need to be discussed if her blood pressure is normal",
        "A levonorgestrel IUD is unsafe solely because she smokes",
        "Avoid combined hormones and offer a progestin-only or nonhormonal method",
      ],
      3,
      "Age ≥35 with substantial smoking is a combined hormonal contraception contraindication (US MEC 4) — offer safer alternatives."
    ),
    item(
      "aanp-fnp",
      "04",
      "A healthy 6-month-old is due for routine immunizations. Parents ask about acetaminophen before vaccines. Best guidance?",
      [
        "Skip a prophylactic dose; treat discomfort if it occurs after the visit",
        "Give ibuprofen before every vaccine so fever cannot occur",
        "Give aspirin beforehand; it is a substitute for ibuprofen here",
        "Delay the rest of the series because of one fever after a prior dose",
      ],
      0,
      "Routine prophylactic antipyretics aren’t required and may blunt antibody response; treat symptoms if needed after vaccination."
    ),
    item(
      "aanp-fnp",
      "05",
      "A 28-year-old has dysuria, frequency, and no vaginal discharge. Urine dip is nitrite+. Best empiric approach for uncomplicated cystitis?",
      [
        "One intravenous dose of vancomycin and no oral agent afterward",
        "Nitrofurantoin for five days when renal function allows it",
        "No antibiotic, because she is afebrile and can increase fluids",
        "A cranberry supplement alone for the next several weeks",
      ],
      1,
      "Uncomplicated cystitis is treated with short-course agents chosen for efficacy, resistance, and patient factors."
    ),
    item(
      "aanp-fnp",
      "06",
      "An older adult’s PHQ-9 is 18 with anhedonia and passive death wish but no plan/intent. Best next step?",
      [
        "Send the patient home with no scheduled follow-up visit",
        "Start clonazepam as the only treatment for this depression",
        "Assess safety, treat or refer, and arrange close follow-up",
        "Offer no treatment; a score in this range is ordinary grief",
      ],
      2,
      "Moderate–severe PHQ-9 plus passive SI needs structured safety evaluation and active depression management."
    ),
    item(
      "aanp-fnp",
      "07",
      "A patient with osteoarthritis knee pain failed acetaminophen. No GI bleed history. Which is a reasonable next pharmacologic step?",
      [
        "Scheduled oxycodone before any topical analgesic",
        "A standing course of oral prednisone for the knee",
        "Explain that no further medication is useful after acetaminophen",
        "Try a topical or oral NSAID and counsel on GI and renal risk",
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
        "Force end-range flexion despite a tense knee effusion",
        "Quad sets, edema control, and range within the protocol",
        "Bed rest until the surgical incision has fully healed",
        "Hold every strengthening exercise until after the sixth week",
      ],
      1,
      "Early TKA rehab prioritizes quad activation, ROM within protocol, and swelling control — not aggressive forced motion."
    ),
    item(
      "npte-pt",
      "02",
      "A patient with Parkinson disease shows festinating gait and reduced step length. Which cueing strategy is most appropriate?",
      [
        "Encourage faster shuffling and do not add external cues",
        "Stop gait practice and use supine exercise only",
        "Use rhythmic auditory or visual cues to lengthen the stride",
        "Limit the plan of care to passive range of motion in bed",
      ],
      2,
      "External cueing helps break hypokinetic gait patterns in Parkinson disease."
    ),
    item(
      "npte-pt",
      "03",
      "During a lumbar exam, passive straight-leg raise reproduces familiar radicular pain at 35°. This finding most supports?",
      [
        "Hamstring tightness without nerve-root irritation",
        "Isolated osteoarthritis of the hip",
        "A normal straight-leg raise for this patient",
        "Lumbar nerve-root irritation from neural tension",
      ],
      3,
      "Early-angle SLR reproducing radicular symptoms suggests neural tension consistent with radiculopathy."
    ),
    item(
      "npte-pt",
      "04",
      "A patient with COPD has SpO₂ 88% on room air during ambulation and reports severe dyspnea. Best immediate action?",
      [
        "Stop activity, support breathing, and apply oxygen per order",
        "Finish the six-minute walk, then decide whether oxygen is needed",
        "Raise the treadmill speed and incline to build endurance",
        "Document the saturation and continue the same walking workload",
      ],
      0,
      "Exercise-induced desaturation needs activity pause, breathing strategy, and oxygen per protocol."
    ),
    item(
      "npte-pt",
      "05",
      "Which transfer is most appropriate for a patient with complete C6 tetraplegia who has strong tenodesis and fair trunk control in sitting?",
      [
        "Independent floor-to-chair transfers on the first training day",
        "Use a sliding-board transfer with assistance as needed",
        "A mechanical lift for every transfer, with board practice deferred",
        "A standing pivot transfer with no upper-limb support",
      ],
      1,
      "C6-level patients often use sliding-board techniques leveraging tenodesis and available UE strength."
    ),
    item(
      "npte-pt",
      "06",
      "A sports athlete 3 months post-ACL reconstruction has full ROM, good quad strength, and sport-specific clearance goals. Which principle guides return-to-sport testing?",
      [
        "Clear the athlete at eight weeks if the incision has healed",
        "Allow cutting drills even when they reproduce knee pain",
        "Use strength symmetry, hop tests, and movement quality together",
        "Use a functional brace in place of strength targets",
      ],
      2,
      "RTS decisions use criterion-based testing rather than calendar time alone."
    ),
    item(
      "npte-pt",
      "07",
      "A patient with a recent CVA has left neglect. Which treatment environment modification helps most during gait training?",
      [
        "Stand on the patient’s right and skip cues toward the left",
        "Cover the left visual field so attention stays on the right",
        "Delay all standing practice until neglect testing is normal",
        "Arrange cues so the patient must scan toward the left side",
      ],
      3,
      "Neglect rehab uses structured cues and environmental setup to promote attention toward the neglected side."
    ),
  ],
};

/**
 * Item for a Chicago calendar date, or null when that date must not be served.
 * Null is required for future and invalid dates so callers do not show item 01.
 */
export function getQotdForExam(
  exam: ExamSlug,
  dateIso: string,
  now = new Date()
): QotdItem | null {
  const pack = QOTD_BY_EXAM[exam];
  const idx = dayIndexFromIso(dateIso, now);
  if (idx == null) return null;
  return pack[idx % pack.length] ?? null;
}

export function getQotdHubFeatured(dateIso: string, now = new Date()): ExamSlug | null {
  const idx = dayIndexFromIso(dateIso, now);
  if (idx == null) return null;
  return EXAM_SLUGS[idx % EXAM_SLUGS.length] ?? null;
}
