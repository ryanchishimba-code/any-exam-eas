import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

/** Cardiopulmonary rehabilitation for NPTE-PT. */
export const CARDIOPULMONARY_REHAB_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Cardiovascular and pulmonary systems (~10%) test safe exercise prescription, monitoring parameters, breathing strategies, and progression after cardiac and pulmonary events.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "COPD: dynamic hyperinflation, pursed-lip breathing, paced activities",
        "CHF: activity guidelines based on stability; watch for exertional intolerance",
        "Post-MI: phased return to activity per cardiac rehab protocols",
        "Oxygen: titrate to maintain target SpO₂; avoid hyperoxia in CO₂ retainers",
        "Airway clearance: positioning, huff cough, bronchodilator timing",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "Lower-extremity endurance training is cornerstone in COPD and CHF when stable",
        "Interval training may improve tolerance in severe deconditioning",
        "RPE scales supplement HR/SpO₂ when beta-blockers blunt HR response",
        "Energy conservation: work-rest ratios, adaptive equipment, pacing ADLs",
        "Stop exercise for chest pain, severe dyspnea, dizziness, or dangerous desaturation",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "COPD vs CHF — exertional presentation",
          headers: ["Feature", "COPD", "CHF"],
          rows: [
            ["Primary symptom", "Dyspnea with air trapping", "Dyspnea with fluid overload"],
            ["Breathing strategy", "Pursed-lip, paced exhalation", "Positioning, monitor weight/edema"],
            ["Monitoring focus", "SpO₂, RPE, hyperinflation", "HR, BP, weight, exertional intolerance"],
            ["Exercise red flag", "Severe desaturation", "New/worsening edema, S3, rapid weight gain"],
          ],
        },
        {
          caption: "Activity termination signals",
          headers: ["Sign", "Response"],
          rows: [
            ["Chest pain / pressure", "Stop; assess; escalate per protocol"],
            ["Severe dyspnea or dizziness", "Stop and rest; reassess vitals"],
            ["Dangerous desaturation below ordered target", "Stop; recover; adjust O₂ per order"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "Cardiac rehab phase map: inpatient (Phase I) → early outpatient (Phase II) → maintenance (Phase III/IV)",
        "Borg RPE scale graphic linking perceived exertion to safe training intensity when HR is blunted",
        "Pursed-lip breathing cycle: nasal inhale → exhale 2–3× longer through pursed lips during exertion",
        "Progression rule diagram: increase duration before intensity in deconditioned patients",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "More oxygen is always safer — hyperoxia can worsen hypercapnia in chronic CO₂ retainers; titrate to the ordered target",
        "Heart rate is the best intensity gauge for everyone — beta-blockers blunt HR, so use RPE",
        "Patients with lung or heart disease should avoid exercise — supervised training improves capacity when stable",
        "Push intensity to progress fastest — build duration first in severe deconditioning",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Diaphragmatic breathing reduces accessory muscle overuse in COPD",
        "Incentive spirometry supports post-op pulmonary hygiene",
        "6MWT documents functional capacity and response to rehab",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "Monitor vitals and symptoms — adjust intensity accordingly",
        "Breathing strategies before heavy exertion in lung disease",
        "Progress duration before intensity in deconditioned patients",
      ],
    },
  ],
};
