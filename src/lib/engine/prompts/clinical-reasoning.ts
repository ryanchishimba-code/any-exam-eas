import type { ExamQuestion } from "../../ai";
import { normalizeFieldId } from "../../subjects/field-ids";
import { scoreDrugProfileCompleteness } from "./pharm-drug-profile";

/** Shared core logic — every board item must feel like a real exam question. */
export const CORE_CLINICAL_ITEM_LOGIC = `
CORE ITEM LOGIC (mandatory for every question):
0. VIGNETTE FIRST: Every item opens with a concise clinical vignette (demographics, pertinent history, signs/symptoms, etiology clues) BEFORE the question stem.
1. SIGNS & SYMPTOMS: Include realistic, discriminating clinical findings — vitals, physical exam, labs, or client-reported symptoms. Findings must support ONE best answer and rule out distractors.
2. ETIOLOGY / PATHOPHYSIOLOGY: Where clinically relevant, link the underlying cause or mechanism to the presentation (e.g., "due to decreased cardiac output", "from alveolar-capillary leak", "secondary to insulin deficiency").
3. STRONG DISTRACTORS: Each wrong option reflects a common misconception, wrong priority, partial truth, or "correct in another context" trap — never filler options.
4. DETAILED RATIONALES:
   - explanation: why the correct answer is best, citing key signs/symptoms and mechanism/etiology.
   - distractorRationale: map EVERY incorrect option → why it fails, referencing specific stem data.
   - clinicalReasoning: stepwise judgment chain appropriate to the exam (see field-specific framework below).`;

const NCLEX_CJMM = `
NCLEX CLINICAL JUDGMENT (NCSBN CJMM — use on every nursing item):
1. Recognize Cues — identify relevant and irrelevant client data (vitals, labs, behaviors, orders).
2. Analyze Cues — cluster data; infer pathophysiology, etiology, and risk.
3. Prioritize Hypotheses — rank problems by urgency (ABCs, Maslow, safety-first).
4. Generate Solutions — identify evidence-based nursing actions.
5. Take Action — select the single best nursing intervention or response.
6. Evaluate Outcomes — anticipate expected improvement or required reassessment.

Nursing item emphasis:
- Signs/symptoms the nurse would observe or elicit
- Etiology and pathophysiology driving the nursing diagnosis/priority
- Nursing interventions (not physician-only orders unless assessing appropriateness)
- NGN formats (~30%): unfolding_case, bow_tie, select_all (SATA), matrix, ordered_response`;

const USMLE_STEP_1 = `
USMLE STEP 1 CLINICAL REASONING:
- Integrate basic science with clinical presentation — mechanism → finding → diagnosis.
- Stem types: "most likely mechanism", "pathophysiology of finding", "initial lab pattern", "anatomic localization", "pharmacology MOA/adverse effect".
- Include discriminating signs/symptoms or lab values even in science-heavy items.
- Link etiology (infectious, autoimmune, genetic, environmental) to pathophysiology and presentation.
- Distractors: same organ system wrong disease, wrong mechanism, adjacent anatomy, drug-class confusion.`;

const USMLE_STEP_2 = `
USMLE STEP 2 CK CLINICAL REASONING:
- Full clinical vignette required (75%+): age, sex, setting, history, exam, labs/imaging.
- Question types: diagnosis, "most likely cause", "next best step in management", "most appropriate initial test", "complication", "prognosis".
- Chain: presentation → pathophysiology → diagnosis → management priority.
- Include realistic signs/symptoms and tie management to etiology/pathophysiology.
- Distractors: related diagnosis, premature/wrong next step, contraindicated therapy, misread labs.`;

const NAPLEX = `
NAPLEX CLINICAL REASONING (NABP 2025 domains):
- Foundational Knowledge: drug MOA, PK/PD, pharmaceutics, calculations.
- Medication Use Process: therapeutic selection, interactions, contraindications, monitoring, MTM, verification.
- Person-Centered Care: counseling, assessment, OTC selection, adherence, safety, health literacy.

Emphasis:
- Top 300/500 drugs — generic + brand, class, indication, condition signs/symptoms, etiology, major ADRs, monitoring.
- Every pharmacology item includes drugProfile with all schema fields when drug-centered.
- Patient assessment: allergies, current meds, renal/hepatic function (CrCl/eGFR), pregnancy, labs.
- Counseling: what to tell the patient, when to hold the drug, when to call pharmacist/prescriber.
- Signs/symptoms of the underlying condition AND drug-related adverse effects.
- Etiology-driven therapy (e.g., H. pylori → triple therapy; insulin resistance → metformin/SGLT2).
- Distractors: wrong drug for indication, interaction pair, dosing error, incomplete counseling, legal violation.
- "Next best step" for pharmacists: verify → assess interaction → counsel → document → monitor.`;

export function buildClinicalReasoningBlock(fieldId: string): string {
  const raw = fieldId.trim().toLowerCase();
  const id = normalizeFieldId(fieldId);

  const fieldBlock =
    id === "nursing"
      ? NCLEX_CJMM
      : raw === "usmle-step-1"
        ? USMLE_STEP_1
        : id === "usmle-step-2"
          ? USMLE_STEP_2
          : id === "pharmacy"
            ? NAPLEX
            : "";

  return [CORE_CLINICAL_ITEM_LOGIC, fieldBlock].filter(Boolean).join("\n");
}

const SIGNS_SYMPTOMS_PATTERN =
  /fever|pain|nausea|vomit|dyspnea|fatigue|weakness|confusion|edema|rash|bleed|BP|blood pressure|HR|heart rate|SpO2|saturation|temp|temperature|lab|WBC|hemoglobin|glucose|creatinine|finding|symptom|sign|presented|reports|complains|appears|auscult|murmur|tender|distended|letharg|diaphores|cyanosis|jaundice|oliguria|polyuria|anxiety|depression|seizure|cough|wheez|crackles|guard|rebound|pruritus|diarrhea|constipation|headache|dizziness|syncope|palpitation|chest|abdominal|urinary|discharge|swelling|numbness|tingling|weight loss|weight gain|insomnia|anorexia/i;

const ETIOLOGY_PATTERN =
  /pathophys|mechanism|etiology|etio|cause|due to|results from|leading to|secondary to|because of|underlying|mediated by|deficiency|excess|infection|inflammation|autoimmune|genetic|ischemi|infarct|obstruct|hypo|hyper|dysfunction|failure|syndrome|virulence|receptor|channel|enzyme|cascade|compensat/i;

/** Heuristic quality score boost for clinically rich items. */
export function scoreClinicalRichness(q: ExamQuestion, fieldId: string): number {
  let bonus = 0;
  const stem = `${q.vignette ?? ""} ${q.question}`;
  const rationale = `${q.explanation} ${q.clinicalReasoning ?? ""}`;

  if (SIGNS_SYMPTOMS_PATTERN.test(stem)) bonus += 0.08;
  if (ETIOLOGY_PATTERN.test(rationale)) bonus += 0.06;

  const id = normalizeFieldId(fieldId);
  if (id === "nursing" && q.clinicalReasoning) {
    const cjmmSteps = [
      /recognize/i,
      /analy/i,
      /prioriti/i,
      /generat|solution/i,
      /take action|act/i,
      /evaluat/i,
    ];
    const matched = cjmmSteps.filter((re) => re.test(q.clinicalReasoning!)).length;
    if (matched >= 4) bonus += 0.06;
  }

  if (id === "pharmacy" || id === "nursing") {
    bonus += scoreDrugProfileCompleteness(q);
  }

  if (
    (id === "usmle-step-1" || id === "usmle-step-2") &&
    /next best|most likely|mechanism|diagnosis|management/i.test(q.question)
  ) {
    bonus += 0.04;
  }

  return bonus;
}

export function hasSignsAndSymptoms(text: string): boolean {
  return SIGNS_SYMPTOMS_PATTERN.test(text);
}

export function hasEtiologyOrPathophysiology(text: string): boolean {
  return ETIOLOGY_PATTERN.test(text);
}
