import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

/** COPD exacerbation — clinical management for PANCE pulmonary tasks. */
export const COPD_EXACERBATION_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "COPD exacerbations are a top PANCE pulmonary topic: recognize triggers, escalate bronchodilators, decide on systemic steroids and antibiotics, and know when to start noninvasive ventilation. Items often test oxygen targets in chronic retainers and discharge planning.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "Exacerbation = acute worsening of dyspnea, cough, or sputum beyond day-to-day variation",
        "Triggers: viral URI, bacterial infection, pollution, medication nonadherence",
        "Severity: assess dyspnea, RR, SpO₂, mental status, ability to speak full sentences",
        "Chronic retainer: target SpO₂ 88–92% — avoid hyperoxia worsening hypercapnia",
        "Home management vs ED/admission based on severity and comorbidities",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "First-line: short-acting bronchodilator (SABA ± SAMA) via nebulizer or MDI with spacer",
        "Systemic corticosteroid (prednisone 40 mg × 5 days) if moderate-severe exacerbation",
        "Antibiotics if increased sputum purulence or volume — amoxicillin-clavulanate, doxycycline, or macrolide per local resistance",
        "NIPPV for acute hypercapnic respiratory failure with acidosis despite initial therapy",
        "Assess inhaler technique and adherence before discharge; provide written action plan",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "Steroids and antibiotics — when to add",
          headers: ["Finding", "Steroids", "Antibiotics"],
          rows: [
            ["Mild increase in symptoms only", "Often not needed outpatient", "Usually not needed"],
            ["Moderate-severe dyspnea", "Yes — short course", "If purulent sputum"],
            ["Requires hospitalization", "Yes", "Yes if bacterial suspicion"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "Exacerbation triage: stable home vs urgent visit vs ED based on SpO₂, work of breathing, mental status",
        "Oxygen titration ladder in chronic CO₂ retainers",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "All COPD flares need antibiotics — reserve for purulent sputum or infiltrate",
        "High-flow oxygen is always safe — hyperoxia can suppress hypoxic drive",
        "Oral steroids require long taper — 5-day burst is standard for exacerbation",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "GOLD: SABA first; steroids if moderate-severe; antibiotics with purulence",
        "Check CO₂ in severe exacerbation — NIPPV if acidotic",
        "Vaccinate: influenza, pneumococcal, COVID per guidelines",
        "Smoking cessation counseling at every visit",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "SABA ± SAMA immediately",
        "Prednisone 40 mg × 5 days if moderate-severe",
        "Antibiotics if purulent sputum",
        "SpO₂ 88–92% in chronic retainers",
        "NIPPV for hypercapnic failure",
        "Discharge with action plan and technique check",
      ],
    },
  ],
};
