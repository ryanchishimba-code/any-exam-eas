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
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "Modalities replace exercise — they are adjuncts to active interventions",
        "Higher US intensity is always better — thermal risk and patient tolerance matter",
        "TENS is safe anywhere — avoid anterior neck, chest with pacemaker, broken skin",
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
