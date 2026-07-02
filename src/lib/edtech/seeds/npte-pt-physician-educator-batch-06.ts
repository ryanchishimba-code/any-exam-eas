/**
 * Curated NPTE-PT neuromuscular items — physician-educator batch 06 (2026 high-yield expansion).
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { nptePtVignette } from "@/lib/exam-prep/npte-pt-seed-factory";

const BATCH = "physician-educator-batch-06";
const PE = ["physician-educator", BATCH, "npte-pt"];

const APTA_NEURO = { label: "APTA Neurology Section Clinical Practice Guidelines", url: "https://www.neuropt.org" };
const VESTIBULAR_CPG = { label: "Clinical Practice Guideline: Vestibular Rehabilitation", url: "https://www.neuropt.org" };

export const NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_06: EnrichedBankItem[] = [
  nptePtVignette(
    "neuromuscular-nervous",
    `A 58-year-old woman reports brief vertigo when rolling to the right in bed, lasting 30 seconds, with nystagmus beating toward the upper ear in right Dix-Hallpike. No hearing loss or neurologic signs.`,
    "Which intervention is most appropriate?",
    [
      "Epley canalith repositioning maneuver for right posterior canal BPPV",
      "High-intensity treadmill running until dizziness resolves",
      "Cervical high-velocity thrust without vestibular screening",
      "Complete bed rest for 4 weeks",
    ],
    "Epley canalith repositioning maneuver for right posterior canal BPPV",
    `Positional vertigo with positive Dix-Hallpike and characteristic nystagmus suggests BPPV — canalith repositioning (Epley) is first-line. Running and cervical HVLA are not appropriate initial care. Bed rest does not reposition otoliths.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "balance-vestibular-disorders",
      difficulty: 4,
      references: [VESTIBULAR_CPG],
      tags: ["BPPV", "vestibular", ...PE],
      related: { keyTakeaway: "BPPV with + Dix-Hallpike: Epley repositioning is first-line." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 32-year-old man 3 weeks after ascending weakness began is now able to walk 50 feet with a rolling walker. Reflexes are absent. Prior week he required ventilator support, now weaned to room air. Sensation is diminished distally.`,
    "Which rehabilitation principle is most important during recovery?",
    [
      "Maximal resistance strengthening into fatigue during acute demyelination",
      "Graded activity, respiratory monitoring, and autonomic/balance precautions during ascending recovery",
      "Complete immobilization until all reflexes return",
      "High-impact sport drills to restore reflexes",
    ],
    "Graded activity, respiratory monitoring, and autonomic/balance precautions during ascending recovery",
    `GBS recovery requires graded progression with monitoring for autonomic instability, respiratory fatigue, and balance deficits — not maximal fatiguing resistance early. Immobilization causes deconditioning. High-impact sports are inappropriate.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "guillain-barre-myasthenia",
      difficulty: 4,
      tags: ["GBS", ...PE],
      related: { keyTakeaway: "GBS recovery: graded activity + monitor respiration/autonomics." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 45-year-old woman with relapsing-remitting MS reports increased fatigue and weakness after hot shower. Ambulation distance drops from 300 m to 80 m on warm days. EDSS 3.5.`,
    "Which patient education is most appropriate?",
    [
      "Avoid all exercise permanently due to heat sensitivity",
      "Pacing, cooling strategies, and timed exercise in cooler environments with fatigue monitoring",
      "Sauna therapy daily to build heat tolerance without monitoring",
      "High-intensity exercise only during relapses",
    ],
    "Pacing, cooling strategies, and timed exercise in cooler environments with fatigue monitoring",
    `MS heat sensitivity (Uhthoff phenomenon) is managed with cooling, pacing, and environment modification — exercise remains important with adjustments. Permanent exercise avoidance and sauna without monitoring worsen function. High intensity during relapse is unsafe.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "multiple-sclerosis",
      difficulty: 4,
      tags: ["MS", "heat-sensitivity", ...PE],
      related: { keyTakeaway: "MS heat sensitivity: cool, pace, exercise with monitoring — don't stop all activity." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 71-year-old man with Parkinson disease has freezing of gait in doorways. He shuffles with reduced arm swing and festination. UPDRS motor score reflects moderate bradykinesia.`,
    "Which intervention strategy is most evidence-supported for freezing?",
    [
      "External auditory or visual cues (e.g., metronome, laser lines) with large-amplitude stepping",
      "Verbal command to walk faster without cueing",
      "Prolonged bed rest when freezing occurs",
      "Only passive stretching of lower extremities",
    ],
    "External auditory or visual cues (e.g., metronome, laser lines) with large-amplitude stepping",
    `Parkinson freezing responds to external cueing and amplitude training (LSVT BIG concepts) — not simply telling patients to hurry. Bed rest and passive-only care do not address motor planning deficits.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "parkinsons-disease",
      difficulty: 4,
      references: [APTA_NEURO],
      tags: ["Parkinson", "freezing", ...PE],
      related: { keyTakeaway: "Parkinson freezing: external cues + large-amplitude stepping." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 40-year-old man 6 weeks post radial nerve palsy (Saturday night palsy) has wrist drop, inability to extend MCP joints, and sensation loss over dorsal first web space. Elbow flexion and medial hand sensation intact.`,
    "Which intervention is most appropriate?",
    [
      "Static wrist cock-up splint for function and prevention of contracture with gradual nerve recovery monitoring",
      "Immediate surgical exploration by PT",
      "No splinting to force active extension",
      "Aggressive passive stretching into finger hyperextension pain 10/10 hourly",
    ],
    "Static wrist cock-up splint for function and prevention of contracture with gradual nerve recovery monitoring",
    `Peripheral nerve palsy requires splinting for function and contracture prevention while monitoring recovery — PT does not perform surgery. Withholding splints risks deformity. Aggressive painful stretching is harmful.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "peripheral-nerve-bells-plexus",
      difficulty: 4,
      tags: ["radial-nerve", "peripheral-nerve", ...PE],
      related: { keyTakeaway: "Radial nerve palsy: cock-up splint + monitor recovery; prevent contracture." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 26-year-old man with T4 AIS A SCI reports sudden pounding headache, BP 198/110 mm Hg, and sweating above the nipple line while supine for bowel program. HR is 58/min.`,
    "Which action is most appropriate first?",
    [
      "Sit patient upright, loosen clothing, remove noxious stimulus, and monitor BP — activate emergency protocol if persistent",
      "Lay patient flat and elevate legs",
      "Perform maximal Valsalva maneuver",
      "Ignore symptoms if bladder program must continue",
    ],
    "Sit patient upright, loosen clothing, remove noxious stimulus, and monitor BP — activate emergency protocol if persistent",
    `Autonomic dysreflexia (SCI typically ≥T6) presents with hypertension, headache, and sweating above lesion due to noxious stimulus below lesion — first-line: upright positioning, remove stimulus, monitor BP. Flat supine positioning can worsen BP. Continuing stimulus is dangerous.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "sci-complete-incomplete",
      difficulty: 5,
      tags: ["SCI", "autonomic-dysreflexia", ...PE],
      related: { keyTakeaway: "Autonomic dysreflexia: sit up, remove stimulus, monitor BP — emergency if persistent." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 38-year-old woman with incomplete C6 SCI (AIS C) has trace triceps (2/5) and improving tenodesis grasp. She transfers with moderate assistance.`,
    "Which prognosis statement is most accurate compared with complete AIS A at same level?",
    [
      "Incomplete injury may retain or recover more motor function below lesion with task-specific training",
      "Incomplete and complete injuries have identical motor prognosis",
      "No upper extremity training until full triceps returns",
      "Ambulation without devices is guaranteed within 4 weeks",
    ],
    "Incomplete injury may retain or recover more motor function below lesion with task-specific training",
    `Incomplete SCI (AIS B/C/D) generally has better motor recovery potential than complete AIS A — rehabilitation emphasizes task-specific UE and mobility training. Prognosis is not identical. Waiting for full recovery before training delays gains. Guaranteed ambulation is unrealistic.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "evaluation-diagnosis-prognosis",
      blueprintTopic: "sci-complete-incomplete",
      difficulty: 4,
      tags: ["SCI", "AIS", "prognosis", ...PE],
      related: { keyTakeaway: "Incomplete SCI: greater recovery potential — train task-specific skills early." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A PT is designing a motor learning program for a patient relearning sit-to-stand after stroke. The patient succeeds 2 of 10 trials with maximal verbal prompting.`,
    "Which adjustment best applies motor learning principles?",
    [
      "Increase task difficulty and remove all feedback immediately",
      "Reduce difficulty (height, hand support), provide knowledge of results, and increase successful repetitions",
      "Stop all practice until patient can perform perfectly without practice",
      "Only passive movement without patient participation",
    ],
    "Reduce difficulty (height, hand support), provide knowledge of results, and increase successful repetitions",
    `Motor learning requires salient, repetitive, successful practice with appropriate challenge and feedback — reduce difficulty to increase success rate, then progress. Removing feedback too early or passive-only practice limits learning.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "motor-control-learning",
      difficulty: 3,
      tags: ["motor-learning", "stroke", ...PE],
      related: { keyTakeaway: "Motor learning: successful repetitions + feedback; adjust task difficulty." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 63-year-old woman with peripheral vestibular hypofunction after labyrinthitis has chronic imbalance. Dix-Hallpike is negative. She falls when turning head while walking.`,
    "Which intervention is most appropriate?",
    [
      "Habituation and gaze stabilization exercises with progressive balance challenges",
      "Canalith repositioning only",
      "Avoid all head movement permanently",
      "Cervical spine fusion referral as first-line PT",
    ],
    "Habituation and gaze stabilization exercises with progressive balance challenges",
    `Unilateral vestibular hypofunction requires adaptation/gaze stabilization and balance training — not repositioning (negative Dix-Hallpike). Avoiding head movement prevents compensation. Surgery is not first-line PT.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "balance-vestibular-disorders",
      difficulty: 4,
      tags: ["vestibular", "gaze-stabilization", ...PE],
      related: { keyTakeaway: "Vestibular hypofunction: gaze stabilization + balance habituation." },
    }
  ),

  nptePtVignette(
    "neuromuscular-nervous",
    `A 50-year-old woman with myasthenia gravis reports increased ptosis and limb weakness after activity. She is on pyridostigmine. Vital capacity is stable today.`,
    "Which exercise prescription principle is most appropriate?",
    [
      "Short bouts with adequate rest, monitor for fatigability, and coordinate timing with medication peak effect",
      "Continuous high-resistance exercise to failure without rest",
      "No activity ever to prevent weakness",
      "Exercise only during peak weakness for training effect",
    ],
    "Short bouts with adequate rest, monitor for fatigability, and coordinate timing with medication peak effect",
    `Myasthenia gravis requires energy conservation, short bouts with rest, fatigability monitoring, and medication timing coordination — not exhaustive continuous exercise or complete inactivity.`,
    {
      blueprintSystem: "neuromuscular-nervous",
      taskCategory: "interventions",
      blueprintTopic: "guillain-barre-myasthenia",
      difficulty: 4,
      tags: ["myasthenia-gravis", ...PE],
      related: { keyTakeaway: "MG exercise: short bouts, rest, monitor fatigue, align with med peak." },
    }
  ),
];
