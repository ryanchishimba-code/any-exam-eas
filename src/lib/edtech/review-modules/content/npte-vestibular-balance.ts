import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

/** Vestibular and balance disorders — high-yield NPTE-PT neuromuscular extension. */
export const NPTE_VESTIBULAR_BALANCE_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Balance and vestibular disorders appear frequently in neuromuscular vignettes. Items distinguish peripheral vs central causes, BPPV from hypofunction, and appropriate repositioning vs adaptation exercises.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "BPPV: brief positional vertigo, positive Dix-Hallpike, torsional nystagmus toward upper ear",
        "Peripheral hypofunction: chronic imbalance, negative Dix-Hallpike, needs gaze stabilization",
        "Central signs: direction-changing nystagmus, neurologic deficits, inability to suppress with fixation",
        "Habituation: repeated exposure to provoking movements in controlled doses",
        "Gaze stabilization (VOR x1, x2): head movement while maintaining visual focus",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "Posterior canal BPPV: Epley or Semont repositioning; post-maneuver precautions",
        "Unilateral vestibular loss: adaptation exercises, balance progression, fall precautions",
        "Vestibular migraine: differentiate from pure peripheral BPPV — neurologic history matters",
        "Dual-task balance training for community ambulation after vestibular disorder",
        "Refer urgently if central signs, sudden hearing loss, or neurologic deficit",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "BPPV vs vestibular hypofunction",
          headers: ["Feature", "BPPV", "Unilateral hypofunction"],
          rows: [
            ["Onset", "Brief episodic with position change", "Often chronic imbalance after neuritis"],
            ["Dix-Hallpike", "Positive with characteristic nystagmus", "Typically negative"],
            ["First-line PT", "Canalith repositioning", "Gaze stabilization + balance habituation"],
            ["Prognosis", "Often resolves with repositioning", "Compensation over weeks–months"],
          ],
        },
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "All vertigo is BPPV — central and hypofunction causes require different interventions",
        "Avoid all head movement — controlled head movement is essential for adaptation",
        "Epley maneuver is contraindicated in all neck pain — screen for appropriate candidates",
      ],
    },
  ],
};
