import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

/** Stroke and neuromuscular rehabilitation for NPTE-PT. */
export const STROKE_REHABILITATION_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Neuromuscular & nervous system content (~24%) spans stroke, SCI, TBI, vestibular disorders, and progressive neurologic conditions. Items emphasize lesion-appropriate interventions, motor learning principles, and safe mobility progression.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "Stroke: UE recovery often lags LE; task-specific practice with high repetition",
        "SCI: level determines expected motor/sensory function (ASIA)",
        "TBI: monitor cognition and behavior — progression may require environmental modification",
        "Parkinson: external cues (auditory, visual) combat bradykinesia and freezing",
        "Balance: static → dynamic → reactive training hierarchy",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "Stroke gait: weight shift, terminal knee extension, adequate hip extension in stance",
        "SCI wheelchair skills: pressure reliefs, transfers, and equipment selection by level",
        "Constraint-induced movement therapy for selected stroke patients with some wrist extension",
        "SCI autonomic dysreflexia: recognize headache, hypertension above lesion — remove noxious stimulus",
        "Fall prevention: Berg Balance Scale, TUG, and environment modification",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "Upper motor vs lower motor neuron lesion signs",
          headers: ["Feature", "Upper motor neuron", "Lower motor neuron"],
          rows: [
            ["Tone", "Hypertonia / spasticity", "Hypotonia / flaccidity"],
            ["Reflexes", "Hyperreflexia, + Babinski", "Hyporeflexia, no Babinski"],
            ["Atrophy", "Mild (disuse)", "Marked, early"],
            ["Examples", "Stroke, SCI above cord segment, MS", "Peripheral nerve injury, ALS (mixed), polio"],
          ],
        },
        {
          caption: "Time-critical neuro red flags in rehab",
          headers: ["Scenario", "Recognize", "Action"],
          rows: [
            ["Autonomic dysreflexia (SCI ≥T6)", "Pounding headache, hypertension, sweating above lesion", "Sit upright, remove noxious stimulus, monitor BP, activate emergency care"],
            ["Orthostatic hypotension", "Lightheadedness with position change", "Gradual positioning, compression, abdominal binder"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "Balance progression ladder: static → dynamic → reactive/anticipatory → dual-task",
        "Stroke gait deviation map linking hip extension, knee control, and foot clearance to interventions",
        "ASIA impairment scale schematic relating injury level to expected motor/sensory function",
        "Motor-learning loop: salient + repetitive + progressively challenging task practice drives neuroplasticity",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "Passive stretching protects the hemiplegic shoulder — aggressive stretching risks subluxation; support and reposition instead",
        "Household ambulation equals community ambulation — community requires curbs, crowds, distance, and dual-task capacity",
        "More assistance is safer — excessive support reduces active practice and slows motor recovery",
        "Autonomic dysreflexia can wait — it is a hypertensive emergency requiring immediate stimulus removal",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Neuroplasticity favors salient, repetitive, challenging practice",
        "Hemiplegic shoulder: avoid aggressive passive stretching — risk of subluxation",
        "Community ambulation requires more than household ambulation — curbs, crowds, distance",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "Match intervention to diagnosis, stage, and patient goals",
        "Safety first: falls, skin, autonomic issues in SCI",
        "Measure function — FIM, Berg, 6MWT as appropriate",
      ],
    },
  ],
};
