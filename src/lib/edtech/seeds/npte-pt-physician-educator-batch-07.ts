/**
 * Curated NPTE-PT system interactions, safety, and lifespan items — batch 07 (2026 expansion).
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { nptePtVignette } from "@/lib/exam-prep/npte-pt-seed-factory";

const BATCH = "physician-educator-batch-07";
const PE = ["physician-educator", BATCH, "npte-pt"];

export const NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_07: EnrichedBankItem[] = [
  nptePtVignette(
    "system-interactions",
    `A 7-year-old boy with spastic diplegic cerebral palsy (GMFCS II) walks with crouch gait and in-toeing. Hip flexion contracture is mild. Ankle equinus is present bilaterally.`,
    "Which intervention focus is most appropriate?",
    [
      "Only passive stretching without functional gait training",
      "Strengthening antigravity muscles, AFO consideration, and task-specific gait training with family education",
      "Immediate surgical recommendation by PT without team referral",
      "Bed rest to prevent contractures",
    ],
    "Strengthening antigravity muscles, AFO consideration, and task-specific gait training with family education",
    `CP diplegia management combines strengthening, orthotic management, and functional gait training with family carryover — not passive-only or bed rest. Surgery is medical decision with team referral, not independent PT recommendation.`,
    {
      blueprintSystem: "system-interactions",
      taskCategory: "interventions",
      blueprintTopic: "pediatrics-cp-torticollis",
      difficulty: 4,
      tags: ["cerebral-palsy", "pediatrics", ...PE],
      related: { keyTakeaway: "CP diplegia: strengthen, orthotics, task-specific gait + family education." },
    }
  ),

  nptePtVignette(
    "system-interactions",
    `A 3-month-old infant prefers right head rotation with left tilt. Passive cervical rotation is limited to 30° left. No hip dysplasia on exam. Plagiocephaly is mild on the right occiput.`,
    "Which intervention is most appropriate?",
    [
      "Stretching and positioning program for congenital muscular torticollis with caregiver education",
      "Immediate CT scan before any conservative care",
      "Cervical collar immobilization for 3 months",
      "No treatment until age 5",
    ],
    "Stretching and positioning program for congenital muscular torticollis with caregiver education",
    `Congenital muscular torticollis is managed with stretching, positioning, and caregiver education early — delay worsens plagiocephaly and ROM loss. Imaging is not first-line without red flags. Prolonged immobilization is inappropriate.`,
    {
      blueprintSystem: "system-interactions",
      taskCategory: "interventions",
      blueprintTopic: "pediatrics-cp-torticollis",
      difficulty: 3,
      tags: ["torticollis", "pediatrics", ...PE],
      related: { keyTakeaway: "Infant torticollis: early stretching/positioning + caregiver education." },
    }
  ),

  nptePtVignette(
    "system-interactions",
    `An 82-year-old woman living alone reports two falls in the past month. Timed Up and Go is 18 seconds. She takes four medications including a benzodiazepine. Home has loose rugs and poor bathroom lighting.`,
    "Which intervention bundle is most appropriate?",
    [
      "Strength/balance training, home hazard modification, medication review referral, and assistive device if needed",
      "Advise her to stop walking entirely",
      "Only ankle weights without environmental changes",
      "High-intensity plyometrics without fall precautions",
    ],
    "Strength/balance training, home hazard modification, medication review referral, and assistive device if needed",
    `Geriatric fall prevention is multifactorial: exercise, environment, polypharmacy review, and devices as needed. Activity cessation increases risk. Single-modality fixes miss contributors.`,
    {
      blueprintSystem: "system-interactions",
      taskCategory: "interventions",
      blueprintTopic: "geriatrics-falls-frailty",
      difficulty: 4,
      tags: ["falls", "geriatrics", ...PE],
      related: { keyTakeaway: "Geriatric falls: exercise + home safety + med review + devices." },
    }
  ),

  nptePtVignette(
    "system-interactions",
    `A 55-year-old man day 2 in ICU after sepsis is on mechanical ventilation with fentanyl infusion. MAP 65 mm Hg on norepinephrine. PT consult for mobility. Lines include central venous catheter and arterial line.`,
    "Which action is most appropriate?",
    [
      "Coordinate with nursing/MD for sedation/lightening if stable, dangle at bedside with monitor and line precautions",
      "Ambulate independently in hallway without monitoring",
      "Decline all mobility until ICU discharge regardless of status",
      "Remove arterial line to facilitate walking",
    ],
    "Coordinate with nursing/MD for sedation/lightening if stable, dangle at bedside with monitor and line precautions",
    `ICU early mobility requires hemodynamic stability, team coordination, sedation assessment, and line/tube precautions — not independent ambulation or removing lines. Blanket deferral misses benefits when stable.`,
    {
      blueprintSystem: "system-interactions",
      taskCategory: "interventions",
      blueprintTopic: "acute-care-icu-mobilization",
      difficulty: 5,
      tags: ["ICU", "early-mobilization", ...PE],
      related: { keyTakeaway: "ICU mobility: team coordination, stability, line precautions — graded progression." },
    }
  ),

  nptePtVignette(
    "genitourinary",
    `A 38-year-old woman postpartum 8 weeks reports stress incontinence with coughing and lifting. Pelvic floor contraction is weak (Oxford 2/5). No prolapse beyond hymen.`,
    "Which intervention is most appropriate?",
    [
      "Supervised pelvic floor muscle training with progression and functional integration",
      "Recommend only pads indefinitely without exercise",
      "High-impact jumping program immediately without pelvic floor training",
      "Surgical referral as mandatory first step for all postpartum incontinence",
    ],
    "Supervised pelvic floor muscle training with progression and functional integration",
    `Stress urinary incontinence with weak pelvic floor responds to supervised PFMT as first-line — not pads-only or immediate surgery. High impact without training may worsen leakage.`,
    {
      blueprintSystem: "genitourinary",
      taskCategory: "interventions",
      blueprintTopic: "pelvic-floor-training",
      difficulty: 4,
      tags: ["pelvic-floor", "incontinence", ...PE],
      related: { keyTakeaway: "Stress incontinence: supervised PFMT first-line before surgery." },
    }
  ),

  nptePtVignette(
    "lymphatic",
    `A 52-year-old woman 6 months post breast cancer surgery has 3 cm arm circumference difference from baseline with pitting at the wrist. Skin intact, no infection.`,
    "Which intervention is most appropriate?",
    [
      "Complete decongestive therapy including manual lymph drainage, compression, skin care, and exercise",
      "Only aggressive resistance exercise without compression",
      "Heat packs over the swollen limb without assessment",
      "Ignore swelling until stage 4",
    ],
    "Complete decongestive therapy including manual lymph drainage, compression, skin care, and exercise",
    `Lymphedema management follows CDT principles: MLD, compression, skin care, and exercise — not resistance without compression or heat without assessment.`,
    {
      blueprintSystem: "lymphatic",
      taskCategory: "interventions",
      blueprintTopic: "lymphedema-cdt",
      difficulty: 4,
      tags: ["lymphedema", "oncology", ...PE],
      related: { keyTakeaway: "Lymphedema: CDT — MLD, compression, skin care, exercise." },
    }
  ),

  nptePtVignette(
    "safety-protection",
    `A 49-year-old man with new onset thunderclap headache, neck stiffness, and fever 38.9°C presents to outpatient PT for neck pain after minor strain reported by phone intake only.`,
    "Which action is most appropriate before any cervical treatment?",
    [
      "Stop scheduled treatment and refer urgently for medical evaluation — do not proceed with PT",
      "Proceed with cervical HVLA manipulation",
      "Apply deep heat and continue planned manual therapy",
      "Schedule weekly treatment without further questions",
    ],
    "Stop scheduled treatment and refer urgently for medical evaluation — do not proceed with PT",
    `Thunderclap headache, fever, and meningismus are red flags for serious pathology (e.g., subarachnoid hemorrhage, meningitis) — urgent medical referral before any PT intervention.`,
    {
      blueprintSystem: "safety-protection",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "exercise-contraindications",
      difficulty: 5,
      tags: ["red-flags", "referral", ...PE],
      related: { keyTakeaway: "Thunderclap headache + fever: stop PT, urgent medical referral." },
    }
  ),

  nptePtVignette(
    "safety-protection",
    `A PT clinic receives a patient with open wound drainage from a recent surgery. Standard precautions supplies are available. The patient will receive wound care adjacent to the gym.`,
    "Which infection control practice is most appropriate?",
    [
      "Hand hygiene, PPE per exposure risk, clean technique, and separate contaminated materials promptly",
      "Reuse gloves between patients to save supplies",
      "No hand hygiene needed if wearing gloves entire session",
      "Place open dressings on shared gym equipment surfaces",
    ],
    "Hand hygiene, PPE per exposure risk, clean technique, and separate contaminated materials promptly",
    `Infection control requires hand hygiene, appropriate PPE, clean technique, and proper waste handling — gloves do not replace hand hygiene; reuse is prohibited.`,
    {
      blueprintSystem: "safety-protection",
      taskCategory: "interventions",
      blueprintTopic: "infection-control-bbp",
      difficulty: 3,
      tags: ["infection-control", "BBP", ...PE],
      related: { keyTakeaway: "Infection control: hand hygiene + PPE + clean technique; don't reuse gloves." },
    }
  ),

  nptePtVignette(
    "research-evidence",
    `A new RCT reports an outcome measure change of 4 points on a 100-point scale. Published MCID for the scale is 8 points. P value is 0.03.`,
    "Which interpretation is most accurate?",
    [
      "Statistically significant but may not be clinically meaningful per MCID",
      "Clinically meaningful improvement guaranteed because p < 0.05",
      "Study is invalid because MCID exists",
      "MCID applies only to diagnostic tests, not outcome measures",
    ],
    "Statistically significant but may not be clinically meaningful per MCID",
    `Statistical significance (p < 0.05) does not equal clinical importance — compare change to MCID. A 4-point change below MCID of 8 may not be meaningful to patients.`,
    {
      blueprintSystem: "research-evidence",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "outcome-measures-mcid",
      difficulty: 4,
      tags: ["MCID", "EBP", ...PE],
      related: { keyTakeaway: "Significant p-value ≠ clinical importance — compare to MCID." },
    }
  ),

  nptePtVignette(
    "system-interactions",
    `A 64-year-old woman undergoing chemotherapy reports fatigue 7/10 and deconditioning. Hemoglobin is 10.2 g/dL. Vitals stable at rest. Oncologist cleared light activity.`,
    "Which exercise prescription is most appropriate?",
    [
      "Low-to-moderate intensity aerobic activity with pacing and symptom monitoring per oncology guidelines",
      "Maximal interval sprints to fight fatigue",
      "Complete bed rest until treatment ends",
      "Heavy resistance to failure daily without monitoring",
    ],
    "Low-to-moderate intensity aerobic activity with pacing and symptom monitoring per oncology guidelines",
    `Cancer-related fatigue responds to paced, low-moderate exercise when medically cleared — not maximal sprints or complete rest. Monitoring symptoms and hemoglobin is essential.`,
    {
      blueprintSystem: "system-interactions",
      taskCategory: "interventions",
      blueprintTopic: "oncology-fatigue-deconditioning",
      difficulty: 4,
      tags: ["oncology", "fatigue", ...PE],
      related: { keyTakeaway: "Cancer fatigue: paced low-moderate exercise when cleared; monitor symptoms." },
    }
  ),
];
