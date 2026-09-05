import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

/** Pediatrics and geriatrics across NPTE-PT system interactions. */
export const NPTE_PEDS_GERIATRICS_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Lifespan considerations appear across NPTE-PT body systems — not only in system interactions. Pediatric conditions (CP, torticollis, scoliosis) and geriatric modifiers (falls, frailty, sarcopenia) change examination and intervention choices.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "CP: classify by topographic pattern and GMFCS; emphasize function and family education",
        "Torticollis: early stretching/positioning in infants; monitor plagiocephaly",
        "Geriatric falls: multifactorial — strength, balance, meds, environment, vision",
        "Frailty: low reserve — pace exercise, monitor vitals, prioritize function",
        "Sarcopenia: progressive resistance with adequate protein and medical coordination",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "CP gait: address crouch, equinus, and hip flexion contracture with task-specific training",
        "Infant torticollis: caregiver positioning, stretching, tummy time, refer if refractory",
        "Geriatric fall prevention: Otago-style balance + strength, home hazard checklist",
        "Osteoporosis: weight-bearing and balance within fracture risk; avoid flexion loading with vertebral fracture",
        "Acute care: age and comorbidity modify mobilization intensity — still mobilize when stable",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "Pediatric vs adult rehab priorities",
          headers: ["Domain", "Pediatric emphasis", "Adult emphasis"],
          rows: [
            ["Goals", "Development, family carryover, growth", "Return to work/role, independence"],
            ["Assessment", "Milestones, GMFCS, plagiocephaly", "Comorbidities, prior level of function"],
            ["Exercise", "Play-based, task-specific, family training", "Progressive loading, self-management"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "GMFCS levels I–V: map motor function to expected community participation",
        "Fall risk triad: strength + balance + environment — address all three in the plan",
        "Infant torticollis stretch: lateral flexion away from tight SCM, rotation toward tight side",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "Children are small adults — growth, development, and family context change every plan",
        "Geriatric patients cannot exercise — modified progressive activity reduces falls and deconditioning",
        "Wait until torticollis resolves spontaneously — early treatment improves outcomes",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Family coaching beats therapist-only sessions for pediatric carryover",
        "Start geriatric programs at low dose and titrate — underdosing is safer than overreaching",
        "Asymmetric head preference after 4 months warrants referral beyond basic stretch advice",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "Pediatrics: development + family context drive dosing and goals",
        "Geriatrics: multifactorial fall risk — strength, balance, meds, environment",
        "Early torticollis care prevents secondary plagiocephaly and delay",
      ],
    },
  ],
};
