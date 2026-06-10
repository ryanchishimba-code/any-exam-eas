/**
 * Hand-crafted NCLEX-NGN items with UWorld/Archer-level vignettes and per-option rationales.
 */
import type { EnrichedBankItem } from "./seed-helpers";
import { enrichItem } from "./seed-helpers";

const OPT_A =
  "Administer the prescribed 500 mL 0.9% sodium chloride IV bolus over 30 minutes";
const OPT_B =
  "Obtain blood cultures, then administer the first dose of the prescribed broad-spectrum antibiotic";
const OPT_C =
  "Apply supplemental oxygen via nasal cannula at 4 L/min and reassess oxygen saturation in 15 minutes";
const OPT_D =
  "Insert an indwelling urinary catheter to obtain a sterile urine specimen for culture";

const SEPSIS_UTI_VIGNETTE = `A 68-year-old client is admitted to the medical-surgical unit with a urinary tract infection. Four hours ago, temperature was 38.4°C (101.1°F), heart rate 92/min, respiratory rate 18/min, blood pressure 118/72 mm Hg, and oxygen saturation 96% on room air.

Current assessment: temperature 39.1°C (102.4°F), heart rate 118/min, respiratory rate 24/min, blood pressure 88/54 mm Hg, oxygen saturation 91% on room air, altered mental status, urine output 15 mL over the past 2 hours, lactate 3.8 mmol/L (reference: 0.5–2.2 mmol/L), and WBC 18,000/mm³.

The provider has been notified. Blood cultures have not yet been obtained. The client has a peripheral IV in the left forearm.`;

const ICP_OPT_A =
  "Administer the PRN acetaminophen 650 mg PO for agitation and reassess in 30 minutes";
const ICP_OPT_B =
  "Apply bilateral soft wrist restraints and tuck call light within reach to prevent fall injury";
const ICP_OPT_C =
  "Elevate the head of the bed to 30 degrees, ensure the neck is in neutral alignment, and notify the provider immediately of neurological changes";
const ICP_OPT_D =
  "Insert an indwelling urinary catheter to monitor strict intake and output and prevent bladder distention";

const ICP_HEAD_INJURY_VIGNETTE = `The nurse is caring for a 19-year-old client admitted to the neuro step-down unit after a closed head injury from a skateboarding fall 18 hours ago. Initial CT showed a small subdural hematoma managed conservatively. Current orders include neurological checks every hour, head of bed elevated 30 degrees, avoid Valsalva maneuvers, and notify the provider for neurological changes.

Current assessment: Glasgow Coma Scale 12 (E3 V4 M5), down from 14 two hours ago; pupils 5 mm with sluggish reaction bilaterally (previously 3 mm, brisk); blood pressure 168/96 mm Hg, heart rate 52/min, respiratory rate 10/min and irregular, SpO₂ 94% on 2 L/min nasal cannula; decorticate posturing with noxious stimulus; restless behavior with repeated attempts to climb out of bed and pull at IV lines; denies headache but appears agitated; urine output 350 mL since midnight with last void 4 hours ago.

The charge nurse is available. The provider is in surgery for another case.`;

export const NCLEX_CURATED_QUALITY: EnrichedBankItem[] = [
  enrichItem(
    {
      subjectId: "physiological-adaptation",
      topicCategory: "critical-care",
      vignette: SEPSIS_UTI_VIGNETTE,
      question: "Which action should the nurse take first?",
      options: [OPT_A, OPT_B, OPT_C, OPT_D],
      correctAnswer: OPT_B,
      explanation:
        "This client has sepsis with organ dysfunction (hypotension, altered mental status, oliguria, elevated lactate, hypoxemia). The highest-priority nursing action is obtaining blood cultures immediately, then administering broad-spectrum antibiotics without delay — each hour of antibiotic delay increases mortality in sepsis.",
      clinicalReasoning:
        "Recognize cues: infection source (UTI admission) + fever + leukocytosis + hypotension + altered mentation + oliguria + elevated lactate → sepsis with shock physiology. Prioritize hypotheses: uncontrolled infection driving hypoperfusion is the life threat. Take action: culture → antibiotic sequence when cultures are pending and antibiotics are imminently available; fluids, oxygen, and vasopressors follow per protocol and can often proceed in parallel once antibiotics are ordered.",
      distractorRationale: {
        [OPT_A]:
          "IV fluid resuscitation is essential in septic shock, but this distractor tests sequencing. Blood cultures must be obtained before antibiotics when it will not delay antibiotic administration. Fluids support perfusion but do not treat the underlying infection driving mortality.",
        [OPT_C]:
          "Supplemental oxygen addresses hypoxemia (SpO₂ 91%) and is appropriate supportive care, but airway is intact and the primary life threat is untreated sepsis. ABC prioritization does not override the evidence-based sepsis bundle emphasis on timely antibiotics after cultures.",
        [OPT_D]:
          "A urine culture may be useful, but the client was admitted with a UTI and already has systemic sepsis. Blood cultures are the priority culture before antibiotics. Delaying antibiotics for additional invasive specimen collection increases mortality risk.",
      },
      keyTakeaways: [
        "In sepsis/septic shock: recognize early → obtain blood cultures (without delaying antibiotics) → give broad-spectrum antibiotics within 1 hour → fluids, lactate monitoring, and vasopressors as needed.",
      ],
      itemType: "vignette",
      difficulty: 4,
      blueprintDomain: "nclex-physiological",
      tags: [
        "nclex-ngn",
        "curated",
        "sepsis",
        "prioritization",
        "critical-care",
        "high-yield",
        "reduction-risk",
      ],
      ngnPayload: {
        kind: "mcq",
        cjmmStep: "Take action",
        reviewModuleSlug: "sepsis-shock",
        memoryCardIds: ["nclex-sepsis-bundle", "nclex-shock-types"],
        top500Drugs: ["Piperacillin-tazobactam (Zosyn)", "Norepinephrine (Levophed)", "Ceftriaxone"],
        keyTakeaway:
          "Culture → antibiotic timing often outranks fluids, oxygen, and additional specimen collection when sepsis with organ dysfunction is recognized.",
        difficultyLabel: "Medium–Hard",
        questionFormat: "Single best response (prioritization)",
      },
      references: [
        {
          label: "Surviving Sepsis Campaign",
          citation: "Hour-1 bundle: lactate, cultures, antibiotics, fluids, reassess",
        },
        { label: "NCSBN NCLEX-RN Test Plan", citation: "Physiological Integrity — Reduction of Risk Potential" },
      ],
    },
    { topicCategory: "critical-care", itemType: "vignette", difficulty: 4 }
  ),

  enrichItem(
    {
      subjectId: "physiological-adaptation",
      topicCategory: "neurological",
      vignette: ICP_HEAD_INJURY_VIGNETTE,
      question: "Which action should the nurse take first?",
      options: [ICP_OPT_A, ICP_OPT_B, ICP_OPT_C, ICP_OPT_D],
      correctAnswer: ICP_OPT_C,
      explanation:
        "This client shows objective neurological deterioration after closed head injury: GCS decline, dilated sluggish pupils, Cushing response (hypertension, bradycardia, irregular respirations), and decorticate posturing. The nurse must immediately elevate HOB to 30°, maintain neutral neck alignment to promote venous drainage, and notify the provider — this client may need stat imaging, osmotic therapy, or neurosurgical intervention.",
      clinicalReasoning:
        "Recognize cues: GCS 14 → 12, pupils 3 mm brisk → 5 mm sluggish, BP 168/96 with HR 52 and irregular RR 10, decorticate posturing, agitation with line pulling → rising ICP pattern, not isolated behavioral issue. Analyze cues: Cushing triad + pupil changes + posturing outweigh stable-ish SpO₂ and non-acute bladder status. Prioritize hypotheses: increased ICP / impending herniation is the life threat. Take action: HOB 30°, neutral neck, avoid Valsalva, notify provider immediately with specific findings; do not delay for PRN comfort meds, restraints, or routine catheterization.",
      distractorRationale: {
        [ICP_OPT_A]:
          "Agitation after head injury may reflect pain, hypoxia, bladder distention, or rising ICP — but this client has GCS decline, pupil changes, Cushing vitals, and abnormal posturing indicating acute neurological decompensation. Acetaminophen does not treat increased ICP. With declining GCS, swallow safety must be assessed before PO medications due to aspiration risk. Comfort measures must not delay brain-protective interventions.",
        [ICP_OPT_B]:
          "Restraints address fall risk but not rising ICP. Fighting restraints increases metabolic demand and agitation, potentially worsening intracranial pressure. With declining GCS and posturing, priority is neuro protection and provider escalation — not behavioral containment. Restraints require orders and continuous monitoring and are inappropriate as the first action when herniation signs are present.",
        [ICP_OPT_D]:
          "Bladder distention can contribute to ICP through straining, but this client voided 4 hours ago with adequate total output — not acute retention. Catheter insertion is invasive, time-consuming, and delays HOB positioning and provider notification. In suspected ICP crisis, first actions are elevation, oxygenation assessment, neuro reassessment, and immediate reporting — not routine I&O device placement.",
      },
      keyTakeaways: [
        "In head injury, treat restlessness and vital sign changes as possible increased ICP until proven otherwise: elevate HOB ~30°, neutral neck alignment, maintain oxygenation, avoid Valsalva, and notify the provider immediately when GCS falls, pupils change, or Cushing reflex appears.",
      ],
      itemType: "vignette",
      difficulty: 5,
      blueprintDomain: "nclex-physiological",
      tags: [
        "nclex-ngn",
        "curated",
        "neurological",
        "icp",
        "prioritization",
        "head-injury",
        "high-yield",
        "clinical-judgment",
      ],
      ngnPayload: {
        kind: "mcq",
        cjmmStep: "Take action",
        memoryCardIds: [],
        top500Drugs: ["Mannitol", "Hypertonic saline (3%)", "Levetiracetam (Keppra)"],
        keyTakeaway:
          "Neuro changes plus Cushing response outrank comfort measures, restraints, and routine I&O — elevate HOB, neutral neck, notify provider immediately.",
        difficultyLabel: "Hard",
        questionFormat: "Single best response (prioritization)",
        reviewModuleTopic: "Neurological — Increased ICP & Head Injury",
      },
      references: [
        {
          label: "Brain Trauma Foundation Guidelines",
          citation: "Head-of-bed elevation and ICP monitoring in traumatic brain injury",
        },
        {
          label: "NCSBN NCLEX-RN Test Plan",
          citation: "Physiological Integrity — Physiological Adaptation",
        },
      ],
    },
    { topicCategory: "neurological", itemType: "vignette", difficulty: 5 }
  ),
];
