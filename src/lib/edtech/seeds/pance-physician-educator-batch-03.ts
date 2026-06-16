/**
 * Curated PANCE pulmonary items — physician-educator batch 03.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { panceVignette } from "@/lib/exam-prep/pance-seed-factory";

const BATCH = "physician-educator-batch-03";
const PE = ["physician-educator", BATCH, "pance", "pance-seed"];

export const PANCE_PHYSICIAN_EDUCATOR_BATCH_03: EnrichedBankItem[] = [
  panceVignette(
    "pulmonary",
    `A 68-year-old man with COPD (FEV₁ 45% predicted) presents with increased dyspnea and purulent sputum for 3 days. Temp 38.2°C, RR 28/min, BP 130/82 mm Hg, SpO₂ 88% on room air. WBC 14.2 × 10³/µL. Chest X-ray shows no infiltrate.`,
    "Which is the most appropriate initial management?",
    [
      "Short-acting bronchodilator, systemic corticosteroid, and antibiotic",
      "Supplemental oxygen to maintain SpO₂ 100%",
      "Immediate intubation",
      "Antibiotic monotherapy without bronchodilators",
    ],
    "Short-acting bronchodilator, systemic corticosteroid, and antibiotic",
    `Acute COPD exacerbation with increased sputum purulence warrants bronchodilators, steroids, and antibiotics per GOLD. Target SpO₂ 88–92% in COPD to avoid suppressing hypoxic drive. NIPPV is considered for persistent hypercapnia/acidosis, not routine intubation. Antibiotics alone miss bronchodilator and anti-inflammatory therapy.`,
    {
      blueprintSystem: "pulmonary",
      taskCategory: "intervention",
      blueprintTopic: "COPD",
      difficulty: 4,
      tags: ["COPD", "exacerbation", ...PE],
      related: {
        reviewModuleSlug: "copd-exacerbation",
        keyTakeaway: "COPD exacerbation: SABA/SAMA + systemic steroid ± antibiotic.",
      },
    }
  ),

  panceVignette(
    "pulmonary",
    `A 22-year-old college student with a history of asthma uses her albuterol inhaler daily and wakes at night with cough twice weekly. Peak flow is 70% of personal best. Exam shows scattered expiratory wheezes.`,
    "What is the most appropriate step in management?",
    [
      "Add daily inhaled corticosteroid",
      "Prescribe oral prednisone long-term",
      "Discontinue albuterol",
      "Refer for immediate intubation",
    ],
    "Add daily inhaled corticosteroid",
    `Poorly controlled asthma (nocturnal symptoms, daily SABA, reduced peak flow) requires step-up therapy — add ICS. Long-term oral steroids are not first-line. Albuterol remains rescue therapy. This is not respiratory failure.`,
    {
      blueprintSystem: "pulmonary",
      taskCategory: "pharmacotherapy",
      blueprintTopic: "asthma",
      difficulty: 3,
      tags: ["asthma", ...PE],
      related: { keyTakeaway: "Uncontrolled asthma → step up (add ICS)." },
    }
  ),

  panceVignette(
    "pulmonary",
    `A 40-year-old woman presents with sudden-onset pleuritic chest pain and dyspnea after a 12-hour flight. HR 104/min, RR 22/min, BP 118/70 mm Hg, SpO₂ 94%. Wells score is moderate. D-dimer is elevated.`,
    "What is the most appropriate next step?",
    [
      "CT pulmonary angiography",
      "Ventilation-perfusion scan only without further imaging",
      "Lower extremity ultrasound and discharge if negative",
      "Start warfarin without imaging",
    ],
    "CT pulmonary angiography",
    `Moderate-to-high pretest probability with elevated D-dimer warrants definitive imaging — CTPA is standard in non-pregnant adults. V/Q alone without proceeding based on result is incomplete. Treating without imaging risks anticoagulating without diagnosis. Negative leg US does not exclude PE.`,
    {
      blueprintSystem: "pulmonary",
      taskCategory: "labs",
      blueprintTopic: "PE",
      difficulty: 4,
      tags: ["PE", "DVT", ...PE],
      related: { keyTakeaway: "Suspected PE with elevated D-dimer → CTPA (or V/Q if indicated)." },
    }
  ),

  panceVignette(
    "pulmonary",
    `A 55-year-old man with a 40 pack-year smoking history has a 2-month history of hemoptysis and 6-kg weight loss. BP 128/82 mm Hg, HR 88/min, SpO₂ 96% on room air. Chest X-ray shows a 3-cm right hilar mass.`,
    "What is the most appropriate next step in evaluation?",
    [
      "CT chest with contrast and tissue diagnosis planning",
      "Empiric antibiotics for 2 weeks",
      "Bronchodilator trial",
      "Reassurance and repeat X-ray in 6 months",
    ],
    "CT chest with contrast and tissue diagnosis planning",
    `Hilar mass with hemoptysis and weight loss in a heavy smoker is lung cancer until proven otherwise — staging CT and biopsy pathway. Empiric antibiotics or observation delay diagnosis. Bronchodilators do not address the underlying mass.`,
    {
      blueprintSystem: "pulmonary",
      taskCategory: "diagnosis",
      blueprintTopic: "pneumonia",
      difficulty: 4,
      tags: ["lung-cancer", "hemoptysis", ...PE],
      related: { keyTakeaway: "Smoker + hemoptysis + mass → CT and tissue diagnosis." },
    }
  ),
];
