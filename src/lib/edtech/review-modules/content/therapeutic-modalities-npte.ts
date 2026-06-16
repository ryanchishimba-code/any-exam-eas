import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

/** Therapeutic modalities — parameters and contraindications for NPTE-PT. */
export const THERAPEUTIC_MODALITIES_NPTE_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Therapeutic modalities items test appropriate modality selection, parameter settings, tissue depth, treatment duration, and contraindications — often integrated into MSK or neuro vignettes.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "Thermal: superficial heat vs deep heat (ultrasound, diathermy) — depth and timing",
        "Cryotherapy: acute inflammation; limit duration to prevent tissue injury",
        "Ultrasound: frequency affects depth; continuous vs pulsed duty cycle",
        "TENS: conventional, acupuncture-like, burst — pain gate vs endorphin theories",
        "NMES: muscle re-education, edema control — requires adequate innervation",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "Acute sprain: cryotherapy, protection, elevation — avoid heat initially",
        "Chronic tendinopathy: progressive loading primary; US adjunct only",
        "Post-stroke shoulder pain: avoid aggressive US over insensitive tissue",
        "Edema: NMES + elevation + compression per presentation",
        "Document parameters, site, patient response, and skin inspection",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "Modality selection by tissue stage",
          headers: ["Stage", "Goal", "Typical modality"],
          rows: [
            ["Acute (0–72 h)", "Limit inflammation/pain", "Cryotherapy, pulsed ultrasound, protection"],
            ["Subacute", "Promote healing, restore motion", "Pulsed/continuous US, gentle heat, e-stim"],
            ["Chronic", "Loading tolerance, pain modulation", "Thermal heat, TENS as adjunct to exercise"],
          ],
        },
        {
          caption: "Ultrasound frequency and duty cycle",
          headers: ["Parameter", "Setting", "Effect"],
          rows: [
            ["3 MHz", "Superficial (1–2 cm)", "Heats shallow tissue"],
            ["1 MHz", "Deep (up to ~5 cm)", "Heats deeper tissue"],
            ["Continuous", "100% duty cycle", "Thermal effects"],
            ["Pulsed", "20% duty cycle", "Non-thermal; acute/subacute"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "Contraindication screen checklist: malignancy, pregnancy, acute infection, vascular insufficiency, impaired sensation",
        "Ultrasound depth diagram: 3 MHz superficial vs 1 MHz deep tissue penetration",
        "TENS theory map: conventional (pain gate) vs acupuncture-like (endorphin) parameters",
        "Heat vs cold decision tree keyed to acute inflammation vs chronic stiffness",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "Modalities replace exercise — they are adjuncts to active interventions",
        "Higher US intensity is always better — thermal risk and patient tolerance matter",
        "TENS is safe anywhere — avoid anterior neck, chest with pacemaker, broken skin",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Pulsed ultrasound (20% duty cycle) targets non-thermal effects in acute/subacute tissue",
        "Choose 3 MHz for superficial structures and 1 MHz for deeper tissue",
        "Avoid ultrasound over malignancy, the pregnant abdomen/low back, and open epiphyses",
        "Document parameters, site, duration, and skin inspection every session",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "Screen contraindications before every modality application",
        "Match modality goal to tissue stage (acute vs chronic)",
        "Active interventions remain the foundation of PT practice",
      ],
    },
  ],
};
