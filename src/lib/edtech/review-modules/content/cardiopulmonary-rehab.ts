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
