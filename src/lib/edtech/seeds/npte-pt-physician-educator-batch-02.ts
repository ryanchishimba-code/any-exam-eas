/**
 * Curated NPTE-PT neuromuscular & nervous system items — physician-educator batch 02.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { nptePtVignette } from "@/lib/exam-prep/npte-pt-seed-factory";

const BATCH = "physician-educator-batch-02";
const PE = ["physician-educator", BATCH, "npte-pt"];

const APTA_NEURO = { label: "APTA Neurology Section Clinical Practice Guidelines", url: "https://www.neuropt.org" };
const AHA_STROKE = { label: "AHA/ASA Stroke Rehabilitation Guidelines", url: "https://www.stroke.org" };

export const NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_02: EnrichedBankItem[] = [
  nptePtVignette(
    "neuromuscular-nervous",
    `A 67-year-old man 10 days post ischemic left MCA stroke has right hemiparesis. FMA-UE score is 28/66. He can grasp a cylinder with modified assistance. Shoulder subluxation is 1.5 cm on the right. Ashworth score for elbow flexors is 1+. NIHSS at discharge was 8.`,
    "Which intervention is most appropriate for early upper extremity recovery?",
    [
      "Aggressive overhead pulley exercises into shoulder pain 8/10",
      "Task-oriented training with repetitive reach/grasp, shoulder support, and spasticity monitoring",
      "Complete immobilization of the right arm in a sling for 4 weeks",
      "Only passive range without any active participation",
    ],
    "Task-oriented training with repetitive reach/grasp, shoulder support, and spasticity monitoring",
    `Early post-stroke UE rehab emphasizes repetitive task practice, functional reach/grasp, shoulder subluxation prevention (support, positioning), and monitoring spasticity — not painful pulley exercises or prolonged immobilization. Passive-only care underutilizes neuroplasticity windows.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "post-stroke upper extremity",
      difficulty: 4,
      references: [AHA_STROKE],
      tags: ["stroke", "hemiparesis", ...PE],
      related: { keyTakeaway: "Early stroke UE: task practice + shoulder support; avoid painful overhead pulleys." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 72-year-old woman with chronic stroke 6 months ago ambulates with a single-point cane. Gait speed is 0.4 m/s (household ambulator). Berg Balance Scale is 38/56. She has mild right foot drop managed with an AFO.`,
    "Which outcome best indicates community ambulation potential with current interventions?",
    [
      "Gait speed increasing to ≥0.8 m/s with improved Berg score and reduced fall events",
      "Ability to stand for 10 seconds without support only",
      "Pain reduction from 3/10 to 2/10 without gait change",
      "Increased Ashworth score in plantar flexors",
    ],
    "Gait speed increasing to ≥0.8 m/s with improved Berg score and reduced fall events",
    `Community ambulation typically requires gait speed ≥0.8 m/s (often cited 0.6–1.0 m/s threshold) plus balance improvements. Standing time alone is insufficient. Pain reduction without functional gait change does not predict community mobility. Increased spasticity is a negative indicator.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "stroke gait prognosis",
      difficulty: 4,
      tags: ["stroke", "gait", "prognosis", ...PE],
      related: { keyTakeaway: "Community ambulation post-stroke: target gait speed ≥0.8 m/s + balance gains." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 34-year-old man with T6 complete SCI (ASIA A) is 4 weeks post-injury in inpatient rehab. BP is 88/52 mm Hg supine; sitting BP drops to 72/48 mm Hg with HR increase from 62 to 98/min. He reports dizziness and headache when upright.`,
    "Which condition is most likely?",
    [
      "Orthostatic hypotension due to autonomic dysreflexia below T6",
      "Orthostatic hypotension due to neurogenic orthostatic hypotension from SCI",
      "Pulmonary embolism only",
      "Benign paroxysmal positional vertigo",
    ],
    "Orthostatic hypotension due to neurogenic orthostatic hypotension from SCI",
    `SCI above T6 commonly causes neurogenic orthostatic hypotension (loss of sympathetic vasoconstriction) with supine hypotension and symptomatic drops on sitting — not autonomic dysreflexia (which presents with hypertension above lesion level). PE and BPPV do not fit the BP pattern.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "SCI autonomic dysfunction",
      difficulty: 5,
      tags: ["SCI", "orthostatic-hypotension", ...PE],
      related: { keyTakeaway: "SCI orthostatic hypotension: supine hypotension + symptomatic drop on upright." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 28-year-old man with C5 AIS B SCI 8 weeks post-injury has trace biceps (2/5) and no triceps function. Sensation is impaired below C6. He uses a power wheelchair for mobility. Respiratory vital capacity is 65% predicted.`,
    "Which functional goal is most realistic for independent mobility in the near term?",
    [
      "Independent community ambulation without devices",
      "Power wheelchair mobility with upper extremity training for transfers and ADLs",
      "Complete recovery of all motor function by 12 weeks",
      "No upper extremity use to protect healing spine",
    ],
    "Power wheelchair mobility with upper extremity training for transfers and ADLs",
    `C5 motor level with limited UE function typically requires power mobility with UE training for transfers and self-care — ambulation independence is unlikely near term. Recovery timelines vary; prohibiting UE use is inappropriate when trace function exists.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "SCI functional prognosis",
      difficulty: 4,
      tags: ["SCI", "C5", "prognosis", ...PE],
      related: { keyTakeaway: "C5 SCI: power mobility + UE training for transfers/ADLs." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 19-year-old man 3 weeks post moderate TBI (GCS 9 at scene, now alert) has balance deficits and double vision when fatigued. Rancho Los Amigos level is VI (confused-appropriate). He attempts to stand without calling for assistance, risking falls.`,
    "Which intervention is most appropriate?",
    [
      "Unsupervised gym access to build independence quickly",
      "Structured cognitive-motor dual-task training, fall precautions, and caregiver education on supervision level",
      "Complete bed rest until Rancho level X",
      "High-intensity contact sport drills",
    ],
    "Structured cognitive-motor dual-task training, fall precautions, and caregiver education on supervision level",
    `TBI at Rancho VI requires supervised structured retraining addressing cognitive-motor integration, fall prevention, and appropriate supervision — not unsupervised activity or bed rest until maximal recovery. Contact sports are contraindicated early post-TBI.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "TBI rehabilitation",
      difficulty: 4,
      tags: ["TBI", "balance", ...PE],
      related: { keyTakeaway: "Moderate TBI Rancho VI: supervised cognitive-motor training + fall precautions." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 63-year-old man with Parkinson disease (Hoehn-Yahr stage 3) reports freezing of gait in doorways. UPDRS motor score is 42. He takes levodopa/carbidopa with ON-state gait speed 0.9 m/s and OFF-state 0.5 m/s. Falls occurred twice in the past month.`,
    "Which intervention has evidence for reducing freezing of gait?",
    [
      "External cueing with horizontal lines or metronome during walking",
      "Prolonged bed rest during OFF periods",
      "High-resistance isometric neck extension only",
      "Avoid all walking practice to prevent falls",
    ],
    "External cueing with horizontal lines or metronome during walking",
    `Parkinson freezing of gait responds to external cueing (visual lines, auditory metronome), amplitude training, and dual-task strategies. Bed rest and avoiding walking worsen mobility. Isolated neck exercise does not address freezing.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "Parkinson freezing of gait",
      difficulty: 4,
      references: [APTA_NEURO],
      tags: ["Parkinson", "FOG", ...PE],
      related: { keyTakeaway: "PD freezing of gait: external cueing + amplitude-based gait training." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 41-year-old woman with relapsing-remitting MS reports increased fatigue and heat sensitivity. Timed 25-foot walk is 6.2 seconds (prior baseline 4.8 s). Expanded Disability Status Scale is 3.5. Core temperature rose 0.8°C after hot shower with transient symptom worsening.`,
    "Which patient education is most important?",
    [
      "Avoid all physical activity permanently",
      "Pacing, cooling strategies, and graded exercise within fatigue limits",
      "Maximal high-intensity exercise daily regardless of symptoms",
      "Discontinue all disease-modifying medications",
    ],
    "Pacing, cooling strategies, and graded exercise within fatigue limits",
    `MS fatigue and Uhthoff phenomenon improve with pacing, cooling, and graded exercise — not permanent inactivity or ignoring limits. DMDs are managed by neurology, not discontinued by PT.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "multiple sclerosis fatigue",
      difficulty: 3,
      tags: ["MS", "fatigue", ...PE],
      related: { keyTakeaway: "MS fatigue/heat sensitivity: pacing, cooling, graded exercise." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 55-year-old man with diabetic peripheral neuropathy reports bilateral foot numbness and burning. Monofilament testing identifies 4/10 sites absent bilaterally. Vibration sense is reduced at the great toes. Ankle reflexes are absent. ABI is 1.0 bilaterally.`,
    "Which intervention is highest priority for fall and ulcer prevention?",
    [
      "Barefoot walking on varied terrain to restore sensation",
      "Daily foot inspection education, protective footwear, balance training, and skin integrity monitoring",
      "High-impact jumping exercises",
      "Ignore foot care because ABI is normal",
    ],
    "Daily foot inspection education, protective footwear, balance training, and skin integrity monitoring",
    `Diabetic peripheral neuropathy requires foot protection, daily inspection, appropriate footwear, and balance training — sensory loss increases ulcer and fall risk despite normal ABI. Barefoot walking and high-impact activity increase injury risk.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "diabetic neuropathy",
      difficulty: 3,
      tags: ["neuropathy", "diabetes", "foot-care", ...PE],
      related: { keyTakeaway: "Diabetic neuropathy: foot inspection, protective footwear, balance training." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 48-year-old woman 2 weeks post Guillain-Barré syndrome peak weakness is relearning sit-to-stand. MRC grades: hip flexors 3/5, knee extensors 3/5, ankle dorsiflexors 2/5. She is on mechanical ventilation 8 hours nightly with weaning in progress. HR at rest 88/min rises to 118/min with minimal exertion.`,
    "Which exercise approach is most appropriate?",
    [
      "High-intensity interval training to maximal HR 180/min",
      "Low-intensity, short-duration strengthening with vital sign and respiratory monitoring",
      "No activity until all muscles reach 5/5",
      "Immediate marathon training when off ventilator",
    ],
    "Low-intensity, short-duration strengthening with vital sign and respiratory monitoring",
    `GBS recovery requires graded, monitored exercise accounting for autonomic instability and respiratory weakness — not high-intensity training or complete inactivity until full strength. Overexertion can worsen fatigue and autonomic responses.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "Guillain-Barré rehabilitation",
      difficulty: 4,
      tags: ["GBS", "weakness", ...PE],
      related: { keyTakeaway: "GBS rehab: low-intensity monitored exercise; watch autonomic/respiratory status." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 7-year-old boy with spastic diplegic cerebral palsy (GMFCS level II) walks with crouch gait and ankle equinus. Popliteal angle is 45° with increased hamstring tone (Modified Ashworth 2). Ankle dorsiflexion with knee extended is −5°.`,
    "Which examination priority guides intervention selection?",
    [
      "Identify whether equinus is primarily gastrocnemius vs soleus vs hamstring contracture vs bony torsion",
      "Measure only height and weight",
      "Ignore lower extremity alignment entirely",
      "Focus solely on upper extremity function",
    ],
    "Identify whether equinus is primarily gastrocnemius vs soleus vs hamstring contracture vs bony torsion",
    `Crouch gait in CP requires systematic analysis of equinus source (gastrocnemius vs soleus), hamstring length, femoral anteversion, and selective motor control — drives orthotic, stretching, and strengthening choices. Height/weight alone or ignoring LE alignment misses key impairments.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "examination",
      blueprintTopic: "cerebral palsy gait analysis",
      difficulty: 4,
      tags: ["CP", "pediatric", "gait", ...PE],
      related: { keyTakeaway: "CP crouch gait: analyze equinus source, hamstrings, bony alignment." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 52-year-old woman with peripheral vestibular hypofunction after labyrinthitis reports vertigo with head turns. Dynamic Visual Acuity test shows 3-line loss. Timed Up and Go is 14 seconds with head turns increasing time to 19 seconds. Falls: 0 in past month.`,
    "Which intervention is most appropriate?",
    [
      "Vestibular habituation and gaze stabilization exercises (VOR x1, x2)",
      "Permanent bed rest with head immobilization",
      "Only cervical spine manipulation without vestibular exercises",
      "High-dose sedating medications before all PT sessions",
    ],
    "Vestibular habituation and gaze stabilization exercises (VOR x1, x2)",
    `Unilateral vestibular hypofunction is treated with canal-specific habituation and gaze stabilization (VOR exercises) to improve dynamic visual acuity and functional mobility — not prolonged immobilization or sedation that impairs compensation.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "vestibular hypofunction",
      difficulty: 4,
      tags: ["vestibular", "VOR", ...PE],
      related: { keyTakeaway: "Vestibular hypofunction: habituation + gaze stabilization (VOR x1/x2)." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 58-year-old man with amyotrophic lateral sclerosis has declining grip strength from 28 kg to 18 kg over 3 months. FVC is 72% predicted. He reports increased fatigue with transfers. Speech is mildly dysarthric. No cognitive impairment.`,
    "Which PT focus is most appropriate?",
    [
      "Maximize aggressive strengthening to reverse motor neuron loss",
      "Energy conservation, adaptive equipment, respiratory training, and safe mobility within declining strength",
      "High-intensity resistance training to failure daily",
      "Ignore respiratory status because FVC is above 50%",
    ],
    "Energy conservation, adaptive equipment, respiratory training, and safe mobility within declining strength",
    `ALS rehabilitation emphasizes function, energy conservation, adaptive equipment, and respiratory management — not aggressive strengthening to reverse progressive denervation. FVC 72% warrants monitoring and training; ignoring respiratory status is inappropriate.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "ALS rehabilitation",
      difficulty: 4,
      tags: ["ALS", "neurodegenerative", ...PE],
      related: { keyTakeaway: "ALS PT: energy conservation, adaptive equipment, respiratory monitoring." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 36-year-old woman with myasthenia gravis reports increased ptosis and limb weakness after activity. MMT shows fluctuating weakness: deltoid 4/5 after rest, 3/5 after repeated overhead activity. Negative inspiratory force is 60 cm H₂O (low normal).`,
    "Which exercise prescription principle is most appropriate?",
    [
      "High-repetition fatiguing resistance to build endurance",
      "Submaximal, short-duration activity with frequent rest periods and monitoring for crisis signs",
      "No physical activity ever",
      "Maximal isometric holds to failure multiple times daily",
    ],
    "Submaximal, short-duration activity with frequent rest periods and monitoring for crisis signs",
    `MG exercise uses submaximal, intermittent activity with rest to avoid fatiguing neuromuscular junction transmission; monitor respiratory status. Fatiguing high-rep or maximal isometric exercise worsens weakness. Complete inactivity causes deconditioning.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "myasthenia gravis exercise",
      difficulty: 5,
      tags: ["myasthenia-gravis", ...PE],
      related: { keyTakeaway: "MG: submaximal intermittent exercise + rest; monitor respiratory status." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 74-year-old woman post right hemisphere stroke has left neglect on line bisection (deviation 2.5 cm to the right) and collides with doorframes on the left. She denies visual problems. Visual fields are intact to confrontation.`,
    "Which intervention is most appropriate for neglect?",
    [
      "Only passive stretching of the left arm",
      "Compensatory scanning training, prism adaptation, and anchoring techniques during functional tasks",
      "Patch the right eye permanently",
      "Ignore neglect because visual fields are intact",
    ],
    "Compensatory scanning training, prism adaptation, and anchoring techniques during functional tasks",
    `Hemispatial neglect requires perceptual-motor retraining including scanning, prism adaptation, and anchoring during ADLs — distinct from hemianopia. Passive stretching does not address neglect. Patching the wrong eye worsens function.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "hemispatial neglect",
      difficulty: 4,
      tags: ["stroke", "neglect", ...PE],
      related: { keyTakeaway: "Neglect: scanning training + prism/anchoring; distinct from visual field cut." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 45-year-old man with incomplete SCI at T10 (AIS C) is learning wheelchair skills. He transfers independently but cannot clear a 10 cm curb cut. Shoulder pain is 4/10 with overhead reaching. Push rim force is asymmetric favoring the right.`,
    "Which intervention reduces long-term shoulder pathology risk?",
    [
      "Wheelchair propulsion biomechanics training, weight relief, and strengthening with proper stroke length",
      "Maximize long-distance propulsion on steep inclines daily without technique training",
      "Avoid all upper extremity exercise to rest shoulders",
      "Use only motorized wheelchair without any manual skills training",
    ],
    "Wheelchair propulsion biomechanics training, weight relief, and strengthening with proper stroke length",
    `Manual wheelchair users with SCI are at high risk for shoulder overuse — propulsion training, weight relief, and strengthening with optimal biomechanics reduce pathology. Excessive steep propulsion or avoiding UE exercise both worsen outcomes.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "wheelchair propulsion",
      difficulty: 4,
      tags: ["SCI", "wheelchair", "shoulder", ...PE],
      related: { keyTakeaway: "SCI manual WC user: propulsion biomechanics + weight relief to protect shoulders." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 69-year-old man 24 hours post stroke has dysphagia. Bedside swallow eval shows wet voice after thin liquids, coughing with sequential sips. Oxygen saturation drops from 97% to 91% during trial. He is alert and following commands.`,
    "Which recommendation is most appropriate before oral intake?",
    [
      "Resume regular diet because he is alert",
      "NPO status and referral for instrumental swallow assessment (VFSS or FEES)",
      "Only thick liquids without further assessment",
      "Encourage large bolus rapid drinking to train swallow",
    ],
    "NPO status and referral for instrumental swallow assessment (VFSS or FEES)",
    `Acute stroke dysphagia with wet voice, coughing, and desaturation requires NPO and instrumental assessment before oral diet advancement. Alertness does not exclude aspiration risk. Thick liquids alone without assessment may be insufficient. Large bolus trials increase aspiration risk.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "post-stroke dysphagia",
      difficulty: 5,
      tags: ["stroke", "dysphagia", ...PE],
      related: { keyTakeaway: "Stroke dysphagia with signs of aspiration → NPO + instrumental swallow study." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 32-year-old woman with Charcot-Marie-Tooth disease has bilateral foot drop and steppage gait. Ankle dorsiflexion strength is 2/5. She trips frequently on uneven surfaces. Sensation is reduced in a stocking distribution.`,
    "Which assistive device is most appropriate?",
    [
      "Rigid knee-ankle-foot orthosis bilaterally limiting all ankle motion for daily community ambulation",
      "Lightweight AFO providing dorsiflexion assist/clearance during swing with footwear accommodation",
      "Standard cane only without foot clearance support",
      "No device because sensation loss is mild",
    ],
    "Lightweight AFO providing dorsiflexion assist/clearance during swing with footwear accommodation",
    `CMT foot drop benefits from AFO providing swing-phase clearance without excessive restriction for community ambulation. Rigid bilateral KAFOs are often too restrictive for daily use. Cane alone does not address foot drop. Sensory loss adds fall risk requiring foot clearance support.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "Charcot-Marie-Tooth orthotics",
      difficulty: 3,
      tags: ["CMT", "AFO", "foot-drop", ...PE],
      related: { keyTakeaway: "CMT foot drop: lightweight AFO for swing clearance + footwear accommodation." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 56-year-old man with cerebellar stroke has ataxic gait with wide base and dysmetria on finger-to-nose testing. He cannot tandem walk. Berg score is 32/56. No vestibular involvement on exam.`,
    "Which intervention is most appropriate?",
    [
      "Progressive balance and coordination training with task-specific reaching and gait challenges",
      "High-velocity cervical manipulation",
      "Complete avoidance of all balance challenges",
      "Only lower extremity stretching without coordination training",
    ],
    "Progressive balance and coordination training with task-specific reaching and gait challenges",
    `Cerebellar ataxia responds to repetitive task-specific coordination and balance training — not cervical manipulation or avoiding challenges. Stretching alone does not address dysmetria and ataxia.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "cerebellar ataxia",
      difficulty: 4,
      tags: ["ataxia", "cerebellar", ...PE],
      related: { keyTakeaway: "Cerebellar ataxia: repetitive task-specific balance and coordination training." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 42-year-old woman with Bell palsy (House-Brackmann grade IV) 1 week after onset has incomplete eye closure and drooping at rest. Corneal reflex is diminished. She reports dry eye symptoms. No other neurologic deficits.`,
    "Which patient education is most important during acute phase?",
    [
      "Aggressive facial massage into high pain areas",
      "Eye protection (lubrication, taping at night), facial neuromuscular re-education when appropriate, and monitoring for recovery",
      "Immediate surgical decompression without monitoring",
      "Heat packs over the eye without lubrication",
    ],
    "Eye protection (lubrication, taping at night), facial neuromuscular re-education when appropriate, and monitoring for recovery",
    `Acute Bell palsy requires corneal protection (lubrication, taping), gradual neuromuscular re-education, and monitoring — aggressive painful massage and unprotected heat risk corneal injury. Surgery is not first-line at 1 week.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "Bell palsy",
      difficulty: 3,
      tags: ["Bell-palsy", "facial-nerve", ...PE],
      related: { keyTakeaway: "Bell palsy acute: eye protection first; gradual neuromuscular re-education." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 78-year-old woman with Parkinson disease and camptocormia (flexed thoracolumbar posture) has UPDRS posture item score of 3. She reports back pain 5/10. Trunk extensor strength appears reduced. Falls: 1 in past 3 months.`,
    "Which intervention target is most appropriate?",
    [
      "Trunk extensor strengthening, postural strategies, and axial mobility exercises within ON-medication state",
      "Only ankle plantarflexor stretching",
      "High-velocity thoracic manipulation without medication timing consideration",
      "Permanent use of rigid TLSO for all waking hours without exercise",
    ],
    "Trunk extensor strengthening, postural strategies, and axial mobility exercises within ON-medication state",
    `Parkinson camptocormia benefits from trunk extensor training and postural strategies timed with optimal medication effect — not isolated ankle work or rigid bracing without exercise. Manipulation alone misses motor training needs.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "Parkinson postural dysfunction",
      difficulty: 4,
      tags: ["Parkinson", "posture", ...PE],
      related: { keyTakeaway: "PD camptocormia: trunk extensor training during ON-medication periods." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 25-year-old man with acute inflammatory demyelinating polyneuropathy is weaning from ventilator. MIP is −40 cm H₂O (goal >−60). He fatigues after 5 minutes of sitting edge of bed. HR 102/min, SpO₂ 94% on 2 L O₂.`,
    "Which intervention supports ventilator weaning?",
    [
      "Inspiratory muscle training and progressive upright tolerance with respiratory monitoring",
      "Maximal breath holding until syncope",
      "Bed rest flat supine only for 4 weeks",
      "High-intensity lower extremity cycling to exhaustion first",
    ],
    "Inspiratory muscle training and progressive upright tolerance with respiratory monitoring",
    `GBS/AIDP ventilator weaning benefits from inspiratory muscle training and graded upright activity with monitoring — not breath holding to syncope or prolonged bed rest. Exhaustive LE cycling may compromise weaning in respiratory failure.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "respiratory rehabilitation neuropathy",
      difficulty: 4,
      tags: ["GBS", "ventilator-weaning", ...PE],
      related: { keyTakeaway: "Neuropathy ventilator weaning: inspiratory muscle training + graded upright activity." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 61-year-old man post stroke has aphasia (Broca type). He follows one-step commands consistently but cannot name objects. Gait speed is 0.4 m/s with supervision. He becomes frustrated when asked lengthy verbal instructions during gait training.`,
    "Which communication strategy is most appropriate during PT?",
    [
      "Use short, simple commands, gestures, demonstration, and written cues as appropriate",
      "Speak loudly and use complex multi-step verbal instructions only",
      "Avoid all communication during sessions",
      "Only communicate in writing without any demonstration",
    ],
    "Use short, simple commands, gestures, demonstration, and written cues as appropriate",
    `Broca aphasia requires simplified language, gestures, demonstration, and multimodal cues — not complex instructions or avoidance of communication. Loud speech does not overcome language processing deficits.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "aphasia communication strategies",
      difficulty: 3,
      tags: ["stroke", "aphasia", ...PE],
      related: { keyTakeaway: "Broca aphasia in PT: short commands + gestures + demonstration." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 50-year-old woman with T4 incomplete SCI (AIS D) reports sudden severe headache, sweating above the lesion, and BP 188/112 mm Hg while supine. Bladder catheter appears kinked. HR is 58/min.`,
    "Which action is most appropriate?",
    [
      "Continue therapy session and monitor BP weekly",
      "Sit patient upright, remove nociceptive trigger (check bladder/bowel/skin), and notify nursing/physician immediately for autonomic dysreflexia",
      "Lay flat and administer high-sodium fluids",
      "Begin maximal lower extremity exercise to lower BP",
    ],
    "Sit patient upright, remove nociceptive trigger (check bladder/bowel/skin), and notify nursing/physician immediately for autonomic dysreflexia",
    `Autonomic dysreflexia (T6 and above) presents with hypertension, headache, bradycardia, and flushing — sit upright, remove trigger (often bladder), and urgent medical notification. Continuing therapy or laying flat worsens hypertension.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "autonomic dysreflexia",
      difficulty: 5,
      tags: ["SCI", "autonomic-dysreflexia", "emergency", ...PE],
      related: { keyTakeaway: "Autonomic dysreflexia: sit up, remove trigger, urgent MD notification." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 14-year-old girl with spina bifida (L3 myelomeningocele) ambulates with loftstrand crutches and KAFOs. Energy expenditure during 6-minute walk is 160% of age-predicted norm. She reports shoulder pain 5/10 after 200 m.`,
    "Which examination focus is most important?",
    [
      "Crutch fit, gait biomechanics, upper extremity weight-bearing tolerance, and cardiopulmonary response",
      "Only cognitive testing",
      "Ignore assistive device fit because she is ambulatory",
      "Measure height only",
    ],
    "Crutch fit, gait biomechanics, upper extremity weight-bearing tolerance, and cardiopulmonary response",
    `Myelomeningocele ambulators using crutches/KAFOs require analysis of device fit, gait efficiency, UE load tolerance, and energy cost — high energy expenditure and shoulder pain indicate need for device/biomechanics optimization.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "examination",
      blueprintTopic: "spina bifida ambulation",
      difficulty: 4,
      tags: ["spina-bifida", "pediatric", "assistive-device", ...PE],
      related: { keyTakeaway: "Spina bifida ambulator: assess crutch/KAFO fit, UE tolerance, energy cost." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 66-year-old man with chronic stroke has ankle plantar flexor spasticity (Modified Ashworth 2) limiting dorsiflexion during swing. He uses a solid AFO. Without AFO, toe drag occurs every 3–4 steps. With AFO, gait speed improves from 0.5 to 0.7 m/s.`,
    "Which combination is most appropriate long term?",
    [
      "AFO use plus stretching and selective motor control training as tolerated",
      "AFO only with no stretching or active training ever",
      "Remove AFO to force active dorsiflexion despite toe drag",
      "Botulinum toxin only without any orthotic or training",
    ],
    "AFO use plus stretching and selective motor control training as tolerated",
    `Post-stroke equinus/spasticity management combines orthotic support for safe ambulation with stretching and motor control training — AFO alone without training misses rehabilitation potential; removing AFO with persistent toe drag increases fall risk.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "post-stroke spasticity management",
      difficulty: 3,
      tags: ["stroke", "spasticity", "AFO", ...PE],
      related: { keyTakeaway: "Stroke equinus: AFO for safety + stretching/motor control training." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 39-year-old man with Huntington disease has choreiform movements and impaired balance. TUG is 18 seconds. He has fallen twice at home. Cognitive decline is mild. Medication for chorea provides partial control.`,
    "Which environment modification is most appropriate?",
    [
      "Remove all furniture to create open space without fall strategies",
      "Reduce clutter, improve lighting, install grab bars, and use stable seating during balance training",
      "Restrict to bed rest permanently",
      "Encourage walking on uneven outdoor trails unsupervised",
    ],
    "Reduce clutter, improve lighting, install grab bars, and use stable seating during balance training",
    `Huntington disease fall prevention includes home safety modifications plus supervised balance training with stable supports — not empty rooms without strategy, bed rest, or unsupervised uneven terrain.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "Huntington disease falls",
      difficulty: 4,
      tags: ["Huntington", "falls", ...PE],
      related: { keyTakeaway: "Huntington falls: home safety + supervised balance with stable supports." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 53-year-old woman with trigeminal neuralgia reports severe facial pain triggered by light touch. She avoids washing her face and brushing teeth. Pain is 9/10 during triggers, 2/10 at rest. Neurologic exam between episodes is normal.`,
    "Which PT approach is most appropriate within interdisciplinary care?",
    [
      "Aggressive deep tissue massage over the trigeminal distribution",
      "Gentle desensitization within tolerance, relaxation techniques, posture/ cervical mobility if contributing, and coordination with medical pain management",
      "High-velocity cervical thrust manipulation into severe pain",
      "Ignore facial pain and only treat lumbar spine",
    ],
    "Gentle desensitization within tolerance, relaxation techniques, posture/ cervical mobility if contributing, and coordination with medical pain management",
    `Trigeminal neuralgia requires gentle, coordinated interdisciplinary care — aggressive facial massage and thrust manipulation can trigger severe pain. PT may address contributing cervical/postural factors and coping strategies alongside medical management.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "trigeminal neuralgia",
      difficulty: 4,
      tags: ["neuropathic-pain", "cranial-nerve", ...PE],
      related: { keyTakeaway: "Trigeminal neuralgia: gentle approach + interdisciplinary pain management." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 71-year-old man with subacute stroke is on warfarin (INR 2.8). He has left hemiparesis and is learning stair negotiation with railing. BP is 132/78 mm Hg. He reports mild dizziness when looking down during descent.`,
    "Which precaution is most important during stair training?",
    [
      "No precautions needed because INR is therapeutic",
      "Guard against falls, use railing/nonparetic side strategy per protocol, monitor for orthostatic symptoms, and communicate anticoagulation status to team",
      "Avoid all stair practice permanently",
      "Train stairs without railing to build balance faster",
    ],
    "Guard against falls, use railing/nonparetic side strategy per protocol, monitor for orthostatic symptoms, and communicate anticoagulation status to team",
    `Anticoagulated stroke patients require fall precautions during stair training — falls carry hemorrhage risk. Therapeutic INR does not eliminate fall risk. Permanent avoidance or railing-free training increases harm.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "stroke stair training precautions",
      difficulty: 3,
      tags: ["stroke", "falls", "anticoagulation", ...PE],
      related: { keyTakeaway: "Anticoagulated stroke patient on stairs: fall precautions + guarded progression." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 46-year-old man with incomplete C6 SCI (AIS D) 6 months post-injury has improving tenodesis grasp. He can hold a pen with tenodesis but cannot release actively. Wrist extension is 4/5; finger flexors 2/5.`,
    "Which intervention supports functional hand use?",
    [
      "Tenodesis training with wrist extension for grasp and flexion for release, adaptive utensils, and splinting as needed",
      "Ignore hand function because finger flexors are weak",
      "Only passive finger stretching without functional training",
      "Immediate surgical tendon transfer without trial of training",
    ],
    "Tenodesis training with wrist extension for grasp and flexion for release, adaptive utensils, and splinting as needed",
    `C6 SCI with tenodesis potential benefits from structured tenodesis training, adaptive equipment, and splinting — functional hand use is achievable despite weak intrinsics. Ignoring hand function or surgery before training wastes recovery potential.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "tenodesis training",
      difficulty: 4,
      tags: ["SCI", "hand", "tenodesis", ...PE],
      related: { keyTakeaway: "C6 SCI: tenodesis training + adaptive equipment for functional grasp/release." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 59-year-old woman with chronic inflammatory demyelinating polyneuropathy has progressive distal weakness. Grip 18 kg, ankle dorsiflexion 3/5. Six-minute walk distance is 280 m (prior 420 m). Reflexes are absent distally.`,
    "Which outcome measure best tracks functional decline for reassessment?",
    [
      "Repeated six-minute walk distance and grip dynamometry with standardized intervals",
      "Only patient height",
      "Single passive ROM measurement of cervical rotation",
      "Unvalidated self-designed 1–10 scale without description",
    ],
    "Repeated six-minute walk distance and grip dynamometry with standardized intervals",
    `CIDP monitoring uses validated repeated measures of endurance (6MWT) and strength (grip) at standardized intervals — height and isolated cervical ROM do not track functional neuropathy progression.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "examination",
      blueprintTopic: "CIDP outcome measurement",
      difficulty: 3,
      tags: ["CIDP", "outcome-measures", ...PE],
      related: { keyTakeaway: "CIDP: track 6MWT and grip strength at standardized intervals." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 68-year-old man post stroke has pseudobulbar affect with uncontrolled laughing during therapy. He is embarrassed and avoids group sessions. Mood screening shows no major depression (PHQ-9 score 4/27).`,
    "Which approach is most appropriate?",
    [
      "Ignore emotional episodes and continue without adjustment",
      "Normalize symptoms, allow pauses, private sessions if needed, and coordinate with physician for medication if indicated",
      "Discharge from PT because of emotional lability",
      "Tell the patient to suppress emotions without support",
    ],
    "Normalize symptoms, allow pauses, private sessions if needed, and coordinate with physician for medication if indicated",
    `Pseudobulbar affect after stroke requires empathetic normalization, session adjustments, and medical coordination — not dismissal, discharge, or unsupported suppression. PHQ-9 is low but PBA is distinct from depression.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "pseudobulbar affect",
      difficulty: 3,
      tags: ["stroke", "PBA", ...PE],
      related: { keyTakeaway: "Pseudobulbar affect: normalize, adjust sessions, coordinate with MD." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 37-year-old woman with transverse myelitis at T8 (incomplete) 4 months ago regained hip flexor 4/5 and knee extensor 4/5 bilaterally. She ambulates 50 m with rolling walker and moderate assist. Sensation is impaired below T8.`,
    "Which prognosis indicator is most favorable for continued ambulation gains?",
    [
      "Early return of antigravity lower extremity strength within 3 months",
      "Complete absence of any LE movement at 4 months",
      "Persistent flaccid paralysis without change since onset",
      "Only upper extremity recovery without any LE change",
    ],
    "Early return of antigravity lower extremity strength within 3 months",
    `Incomplete myelopathy with early antigravity LE recovery predicts better ambulation potential — absent LE recovery at 4 months or flaccid paralysis suggests poorer prognosis. UE-only recovery without LE change is less favorable for ambulation.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "transverse myelitis prognosis",
      difficulty: 4,
      tags: ["myelitis", "prognosis", ...PE],
      related: { keyTakeaway: "Incomplete myelopathy: early antigravity LE recovery predicts ambulation gains." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 64-year-old man with diabetic neuropathy and prior stroke has new foot ulcer plantar metatarsal head. Wound depth is 0.5 cm without bone exposure. Offloading boot provided. HbA1c is 8.9%.`,
    "Which PT role is most appropriate alongside wound care team?",
    [
      "Offloading education, non-weight-bearing gait training as prescribed, balance training, and referral coordination — not sharp debridement",
      "Perform sharp debridement independently without wound care certification",
      "Encourage weight-bearing walking without offloading to strengthen foot",
      "No PT involvement until ulcer fully healed in 6 months",
    ],
    "Offloading education, non-weight-bearing gait training as prescribed, balance training, and referral coordination — not sharp debridement",
    `PT supports offloading adherence, safe ambulation with prescribed devices, and balance — sharp debridement is outside PT scope without specialized training. Weight-bearing against offloading orders worsens ulcer. Delaying all PT ignores fall and mobility needs.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "neuropathic foot ulcer PT role",
      difficulty: 4,
      tags: ["neuropathy", "foot-ulcer", "interdisciplinary", ...PE],
      related: { keyTakeaway: "Neuropathic ulcer: PT supports offloading + safe mobility; debridement not PT scope." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 49-year-old woman with functional neurologic disorder presents with sudden leg weakness after stress. Exam shows give-way weakness, inconsistent effort on strength testing (MMT varies 3/5 to 5/5), and normal reflexes. MRI spine and brain are normal. She is distressed and wants to walk independently.`,
    "Which approach is most appropriate?",
    [
      "Tell her symptoms are fake and refuse treatment",
      "Validate symptoms, gradual graded motor retraining, education on mind-body connection, and interdisciplinary care",
      "High-intensity forced weight-bearing despite collapse",
      "Permanent wheelchair prescription without rehabilitation trial",
    ],
    "Validate symptoms, gradual graded motor retraining, education on mind-body connection, and interdisciplinary care",
    `Functional neurologic disorder requires validation, graded motor retraining, and interdisciplinary care — not dismissal as malingering, forced loading, or premature permanent wheelchair without rehab trial.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "functional neurologic disorder",
      difficulty: 5,
      tags: ["FND", "psychogenic", ...PE],
      related: { keyTakeaway: "FND: validate + graded motor retraining + interdisciplinary care." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 73-year-old woman with Parkinson disease (ON state) performs sit-to-stand in 14 seconds (norm <12 s). She uses arm rests and has multiple attempts. Trunk flexion moment is excessive. Levodopa timing is suboptimal per neurologist note.`,
    "Which intervention combination is most appropriate?",
    [
      "Strengthening hip/knee extensors, practice STS without arm use when safe, coordinate medication timing with PT sessions, and use external cues",
      "Only passive stretching of hamstrings",
      "Avoid all STS practice because she uses arms",
      "Train STS only during OFF periods without neurologist coordination",
    ],
    "Strengthening hip/knee extensors, practice STS without arm use when safe, coordinate medication timing with PT sessions, and use external cues",
    `Parkinson STS dysfunction improves with LE strengthening, reducing arm reliance when safe, optimizing ON-state training, and external cueing — not passive-only care or OFF-period training without coordination.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "Parkinson sit-to-stand",
      difficulty: 3,
      tags: ["Parkinson", "STS", ...PE],
      related: { keyTakeaway: "PD STS: LE strengthening + reduce arm reliance + train during ON state." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 22-year-old man with acute disc herniation at C6–7 has right C7 radiculopathy with triceps 4/5 and diminished triceps reflex. He also reports bilateral leg spasticity and urinary urgency new this week.`,
    "Which action is most appropriate before continuing cervical traction?",
    [
      "Continue traction as ordered without further assessment",
      "Stop cervical traction and urgent physician referral for possible myelopathy",
      "Increase traction force to 50% body weight",
      "Add high-velocity cervical manipulation",
    ],
    "Stop cervical traction and urgent physician referral for possible myelopathy",
    `New bilateral leg spasticity and urinary symptoms with cervical radiculopathy suggest myelopathy — stop traction and urgent referral. Continuing or intensifying cervical loading is dangerous. Manipulation is contraindicated.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "cervical myelopathy red flags",
      difficulty: 5,
      tags: ["cervical", "myelopathy", "red-flags", ...PE],
      related: { keyTakeaway: "Cervical radiculopathy + new bilateral leg signs/urinary symptoms → stop traction, urgent referral." },
    }
  ),
];
