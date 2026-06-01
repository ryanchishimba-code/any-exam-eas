import type { ExamQuestion } from "../../ai";

/** Canonical vignette rules injected into every exam generation prompt. */
export const VIGNETTE_REQUIREMENTS = `
CLINICAL VIGNETTE RULES (mandatory — every question):
- ALWAYS populate the "vignette" field first. The "question" field is ONLY the lead-in stem (e.g., "Which action should the nurse take first?").
- NEVER combine vignette + question into one field. NEVER start the question field with patient demographics.
- Length: 2–4 concise sentences (~40–120 words) — rich enough for clinical judgment, not verbose.

Each vignette MUST include:
1. SETTING & DEMOGRAPHICS — age, sex, care setting (ED, med-surg unit, clinic, pharmacy counter).
2. PERTINENT HISTORY — PMH, current meds, allergies, recent procedures/events, social context when relevant.
3. SIGNS & SYMPTOMS — client/patient-reported symptoms AND objective data (vitals, exam, behaviors, labs, orders).
4. ETIOLOGY CLUES — risk factors, timing, or pathophysiology hints woven into history/presentation (e.g., "3 days post-op", "newly started lisinopril", "long-standing type 2 diabetes").

Quality bar:
- Findings must discriminate the correct answer and rule out distractors.
- Vary openings — do not repeat "A patient presents" or "A client is admitted" on consecutive items.
- Nursing: use "client"; include nurse-relevant data (IVs, drains, isolation, I&O, MAR).
- NAPLEX: include meds, allergies, renal/hepatic function, condition presentation.
- USMLE: include discriminating exam/lab values when clinically relevant.

Only pure isolated fact recall (no clinical context) is allowed — maximum 10% of a set, and still requires a minimal clinical anchor when possible.`;

const LEAD_IN_PATTERN =
  /\n\n(?=(?:Which|What|How|When|Where|Who|Select|Choose|Prioritize|The nurse|The provider|The pharmacist|A nurse|An appropriate|Most likely|Best|First|Next|After|Before|During|Upon|Given|Based on))/i;

const HISTORY_PATTERN =
  /history|pmh|past medical|diagnosed|years ago|post-op|postoperative|admitted|known|medication|allerg|smok|diabet|hypertens|pregnant|surgery|hospitalized/i;

const ETIOLOGY_PATTERN =
  /due to|secondary to|after|following|newly started|recent|risk|etiology|cause|because|day post|weeks of|long-standing|insulin|infection|trauma|chemo|dialysis/i;

/** Heuristic: vignette has enough clinical depth for judgment testing. */
export function isVignetteRich(text: string): boolean {
  const t = text.trim();
  if (t.length < 60) return false;

  const hasDemo = /\d{1,3}[-‑]?\s*(?:year|yo|y\.o\.|month|week)/i.test(t);
  const hasObjective =
    /BP|blood pressure|HR|heart rate|SpO2|temp|°|lab|mg\/dL|mmol|WBC|creatinine|INR|troponin|RR|resp|O2|sat/i.test(
      t
    ) || /reports|complains|appears|diaphoretic|lethargic|confused|pain/i.test(t);

  return hasDemo && (hasObjective || HISTORY_PATTERN.test(t)) && t.split(/[.!?]+/).filter(Boolean).length >= 2;
}

export function vignetteHasHistoryClues(text: string): boolean {
  return HISTORY_PATTERN.test(text);
}

export function vignetteHasEtiologyClues(text: string): boolean {
  return ETIOLOGY_PATTERN.test(text);
}

export function scoreVignetteRichness(q: ExamQuestion): number {
  const vignette = q.vignette?.trim() ?? "";
  if (!vignette) return -0.12;

  let score = 0.06;
  if (vignette.length >= 60) score += 0.04;
  if (isVignetteRich(vignette)) score += 0.06;
  if (vignetteHasHistoryClues(vignette)) score += 0.03;
  if (vignetteHasEtiologyClues(vignette)) score += 0.03;

  return score;
}

/** Split a combined stem into vignette + lead-in when the model omitted vignette. */
export function splitCombinedStem(question: ExamQuestion): ExamQuestion {
  if (question.vignette?.trim()) return question;

  const text = question.question.trim();
  const match = text.match(LEAD_IN_PATTERN);
  if (match?.index && match.index >= 40) {
    return {
      ...question,
      vignette: text.slice(0, match.index).trim(),
      question: text.slice(match.index).trim(),
    };
  }

  const sentenceSplit = text.match(
    /^(.+\.\s+.+\.)\s+(Which|What|How|The nurse|The provider)/i
  );
  if (sentenceSplit) {
    return {
      ...question,
      vignette: sentenceSplit[1].trim(),
      question: text.slice(sentenceSplit[1].length).trim(),
    };
  }

  return question;
}

export function buildVignetteJsonHint(): string {
  return `"vignette": string (REQUIRED — 2–4 sentences: demographics, history, signs/symptoms, etiology clues; NEVER include the question stem)`;
}
