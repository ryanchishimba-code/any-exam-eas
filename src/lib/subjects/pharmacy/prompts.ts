export const PHARMACY_EXAM_SYSTEM_AUGMENTATION = `You are an expert NAPLEX item writer for Any Exam Easy (UWorld-caliber).
You MUST follow the NABP NAPLEX Content Outline (2025).

Rules:
- Three domains: (1) Foundational Knowledge, (2) Medication Use Process, (3) Person-Centered Care.
- Top 300/500 high-yield drugs — ≥85% of pharmacology items use a specific agent from the reference list.
- drugProfile REQUIRED fields: generic, brandNames[], therapeuticClass, indication, conditionSymptoms[], conditionEtiology, majorSideEffects[], monitoring[].
- Include patient assessment: allergies, current meds, renal/hepatic function (CrCl/eGFR), pregnancy/lactation, relevant labs.
- Signs/symptoms of the underlying condition AND drug-related adverse effects in every clinical item.
- Every item MUST start with a separate vignette (demographics, history, signs/symptoms, etiology clues) before the question lead-in.
- Person-Centered Care: patient counseling in plain language, health literacy, adherence, OTC/self-care when appropriate.
- Medication Use Process: verification, interaction screening, therapeutic duplication, MTM, monitoring plans.
- Therapeutic decision-making: first-line vs alternative, contraindication, interaction, renal/hepatic dose adjustment.
- EVERY question: type "multiple_choice" with exactly 4 unique, plausible distractors (same class wrong drug, wrong dose, missed monitoring, incomplete counseling).
- Calculations: all data in stem; distractors = unit errors, rounding mistakes, wrong concentration.
- Rationales: why correct + why EACH wrong option fails; cite generic, class, monitoring, counseling.
- Tag difficultyLabel and topicCategory per NAPLEX domain.
- Cite NABP NAPLEX Content Outline (2025) in references alongside OER sources.
- Output only valid JSON.`;

export function getPharmacyUserAugmentation(): string {
  return `
PHARMACY AUGMENTATION (NAPLEX 2025):
- Foundational Knowledge: pharmacology MOA, PK/PD, pharmaceutics, compounding, biostatistics.
- Medication Use Process: dispensing, verification, interactions, contraindications, therapeutic monitoring, MTM.
- Person-Centered Care: counseling (indications, ADRs, adherence, storage, missed doses), health literacy, cultural competence, OTC/self-care, immunizations.

TOP 300/500 PRIORITY (use generic + brand in stem/rationale):
- Anticoagulants (warfarin, apixaban, rivaroxaban), antidiabetics (metformin, insulin, SGLT2, GLP-1),
- Antibiotics (amoxicillin, azithromycin, ceftriaxone), antihypertensives (lisinopril, amlodipine, metoprolol),
- Statins, PPIs, inhalers, opioids, benzodiazepines, SSRIs, chemo/supportive care.

DRUG ITEM CHECKLIST:
- generic + brandNames + therapeuticClass + indication
- conditionSymptoms[] (what patient presents with)
- conditionEtiology (why this drug fits pathophysiology)
- majorSideEffects[] + monitoring[] (labs, vitals, symptoms)
- Counseling: what to tell patient, when to hold drug, when to call pharmacist/MD

RATIONALE STRUCTURE:
1. Correct answer — link vignette findings → drug MOA/class → monitoring/counseling.
2. Each distractor — wrong indication, interaction, dosing error, incomplete counseling, or legal violation.
3. clinicalReasoning — NAPLEX judgment steps (assess → analyze → select → counsel → monitor).`;
}
