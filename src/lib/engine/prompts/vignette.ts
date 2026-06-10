import type { ExamQuestion } from "../../ai";

/** Canonical vignette rules injected into every exam generation prompt. */
export const VIGNETTE_REQUIREMENTS = `
CLINICAL VIGNETTE RULES (mandatory — every question):
- ALWAYS populate the "vignette" field first. The "question" field is ONLY the lead-in stem.
- NEVER combine vignette + question into one field. NEVER start the question field with patient demographics.
- Length: 2–4 concise sentences (~40–120 words) — rich enough for clinical judgment, not verbose.

Each vignette MUST include:
1. SETTING & DEMOGRAPHICS — age, gender/sex, care setting (ED, med-surg unit, clinic, pharmacy counter).
2. CHIEF COMPLAINT — why the patient/client is seeking care today.
3. PERTINENT HISTORY — PMH, current meds, allergies, recent procedures/events, risk factors.
4. SIGNS & SYMPTOMS — subjective complaints AND objective data (vitals, physical exam, labs, imaging).
5. ETIOLOGY / PATHOPHYSIOLOGY CLUES — timing and mechanisms woven into the presentation.

FORBIDDEN question stems (without a rich vignette in the vignette field):
- "Which pathophysiologic process is most likely responsible for these findings?"
- "Which of the following best explains these findings?"
- Any stem using "these findings", "those findings", or "the patient described above" without prior clinical data.

FORBIDDEN vignette formats:
- Timestamp / shift-note prefixes ("0845 —", "166 —", "1634 — PACU, Room 274", "At 1400, the nurse documents")
- Unrelated chart boilerplate (room numbers, item IDs, handoff refs) that does not change the answer
- "Handoff ref ####" metadata lines
- Vague stems only ("Choose the single best answer based on clinical judgment") without a specific lead-in

RELEVANCE RULE:
- Include ONLY data that discriminates the correct answer or supports distractor rationales.
- Do not pad vignettes with stable vitals, unit geography, or nursing documentation style unless tested.

PREFERRED vignette style:
- 2–4 concise sentences focused on the clinical problem being tested
- Plain patient scenario prose — not nursing shift documentation

PREFERRED lead-in stems (after vignette):
- "Which pathophysiologic process is most likely responsible for this patient's presentation?"
- "What is the underlying mechanism of this patient's condition?"
- "What is the most likely diagnosis?"
- "What is the next best step in management?"

Quality bar:
- Findings must discriminate the correct answer and rule out distractors.
- Vary openings — do not repeat identical vignette templates on consecutive items.
- Nursing: use "client"; include nurse-relevant data (IVs, drains, isolation, I&O, MAR).
- NAPLEX: include meds, allergies, renal/hepatic function, condition presentation.
- USMLE: include discriminating exam/lab values when clinically relevant.

Only pure isolated fact recall (no clinical context) is allowed — maximum 10% of a set, and still requires a minimal clinical anchor when possible.`;

const LEAD_IN_PATTERN =
  /\n\n(?=(?:Which|What|How|When|Where|Who|Select|Choose|Prioritize|The nurse|The provider|The pharmacist|A nurse|An appropriate|Most likely|Best|First|Next|After|Before|During|Upon|Given|Based on))/i;

const VIGNETTE_OPENER_PATTERN =
  /^a\s+\d{1,3}[-\s]?year[-\s]?old\s+(male|female|man|woman|patient|client)\b/i;

const HISTORY_PATTERN =
  /history|pmh|past medical|diagnosed|years ago|post-op|postoperative|admitted|known|medication|medications|allerg|smok|diabet|hypertens|pregnant|surgery|hospitalized|presents with|reports|complains|cardiomyopathy|chronic|chemotherapy|dialysis|insulin|on \w+\s+and|current (?:meds|therapies)|EF \d/i;

const ETIOLOGY_PATTERN =
  /due to|secondary to|after|following|newly started|recent|risk|etiology|cause|because|day post|weeks of|long-standing|insulin|infection|trauma|chemo|dialysis/i;

const DEICTIC_STEM_PATTERN =
  /\b(these findings|those findings|the findings described|the patient described above|the client described above)\b/i;

const ORPHAN_STEM_PATTERNS = [
  /^which pathophysiologic process is most likely responsible for these findings\??$/i,
  /^which of the following pathophysiologic processes is most likely responsible for these findings\??$/i,
  /^which explanation best describes the underlying pathophysiology of these findings\??$/i,
  /^which of the following best explains these findings\??$/i,
  /^what is the underlying mechanism of these findings\??$/i,
];

/** Professional lead-in stems that reference the vignette, not dangling deictics. */
export const PREFERRED_PATHOPHYS_STEMS = [
  "Which pathophysiologic process is most likely responsible for this patient's presentation?",
  "What is the underlying mechanism of this patient's condition?",
  "Which explanation best describes the pathophysiology of this patient's presentation?",
] as const;

/** Heuristic: vignette has enough clinical depth for judgment testing. */
export function isVignetteRich(text: string): boolean {
  const t = text.trim();
  if (t.length < 60) return false;

  const hasDemo = /\d{1,3}[-‑]?\s*(?:year|yo|y\.o\.|month|week)/i.test(t);
  const hasObjective =
    /BP|blood pressure|HR|heart rate|SpO2|temp|°|lab|mg\/dL|mmol|WBC|creatinine|INR|troponin|RR|resp|O2|sat|examination|auscult/i.test(
      t
    ) || /reports|complains|appears|diaphoretic|lethargic|confused|pain|fever|swelling/i.test(t);

  return hasDemo && (hasObjective || HISTORY_PATTERN.test(t)) && t.split(/[.!?]+/).filter(Boolean).length >= 2;
}

export function vignetteHasHistoryClues(text: string): boolean {
  return HISTORY_PATTERN.test(text);
}

export function vignetteHasEtiologyClues(text: string): boolean {
  return ETIOLOGY_PATTERN.test(text);
}

export function hasOrphanDeicticStem(question: ExamQuestion): boolean {
  const stem = question.question.trim();
  const vignette = question.vignette?.trim() ?? "";

  if (ORPHAN_STEM_PATTERNS.some((re) => re.test(stem))) {
    return !vignette || !isVignetteRich(vignette);
  }

  if (DEICTIC_STEM_PATTERN.test(stem)) {
    return !vignette || !isVignetteRich(vignette);
  }

  return false;
}

export function validateClinicalVignette(question: ExamQuestion): string[] {
  const issues: string[] = [];
  const repaired = splitCombinedStem({ ...question });
  const vignette = repaired.vignette?.trim() ?? "";
  const stem = repaired.question.trim();

  if (!vignette) {
    issues.push("Missing vignette — clinical scenario must precede the question stem");
  } else if (!isVignetteRich(vignette)) {
    issues.push("Vignette too thin — add demographics, chief complaint, signs/symptoms, and objective data");
  }

  if (!vignetteHasHistoryClues(vignette) && !HISTORY_PATTERN.test(stem)) {
    issues.push("Include pertinent patient history or risk factors in the vignette");
  }

  if (hasOrphanDeicticStem(repaired)) {
    issues.push("Question stem references findings without a preceding clinical vignette");
  }

  if (stem.length < 12) {
    issues.push("Question stem is too short");
  }

  if ((question.options?.length ?? 0) < 4 && question.type !== "select_all") {
    issues.push("MCQ requires 4 high-quality distractors");
  }

  return issues;
}

export function normalizeLeadInStem(stem: string): string {
  let normalized = stem.trim();

  normalized = normalized.replace(/\bthese findings\b/gi, "this patient's presentation");
  normalized = normalized.replace(/\bthose findings\b/gi, "this patient's presentation");
  normalized = normalized.replace(/\bthe findings described\b/gi, "this patient's presentation");
  normalized = normalized.replace(
    /\bthe (?:patient|client) described above\b/gi,
    "this patient's presentation"
  );

  if (ORPHAN_STEM_PATTERNS.some((re) => re.test(normalized))) {
    return PREFERRED_PATHOPHYS_STEMS[0];
  }

  return normalized;
}

export function scoreVignetteRichness(q: ExamQuestion): number {
  const vignette = q.vignette?.trim() ?? "";
  if (!vignette) return -0.12;

  let score = 0.06;
  if (vignette.length >= 60) score += 0.04;
  if (isVignetteRich(vignette)) score += 0.06;
  if (vignetteHasHistoryClues(vignette)) score += 0.03;
  if (vignetteHasEtiologyClues(vignette)) score += 0.03;
  if (hasOrphanDeicticStem(q)) score -= 0.15;

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

  if (VIGNETTE_OPENER_PATTERN.test(text)) {
    const leadMatch = text.match(
      /\s+(Which|What|How|What is the|Which of the following)/i
    );
    if (leadMatch?.index && leadMatch.index >= 80) {
      return {
        ...question,
        vignette: text.slice(0, leadMatch.index).trim(),
        question: text.slice(leadMatch.index).trim(),
      };
    }
  }

  return question;
}

/** Repair vignette structure and normalize dangling lead-in stems. */
export function ensureClinicalVignette(question: ExamQuestion): ExamQuestion {
  let result = splitCombinedStem({ ...question });
  result = {
    ...result,
    question: normalizeLeadInStem(result.question),
  };

  if (!result.vignette?.trim() && VIGNETTE_OPENER_PATTERN.test(result.question)) {
    result = splitCombinedStem({ ...result, vignette: undefined });
    result.question = normalizeLeadInStem(result.question);
  }

  return result;
}

export function buildVignetteJsonHint(): string {
  return `"vignette": string (REQUIRED — 2–4 sentences: demographics, chief complaint, history, signs/symptoms, labs/imaging; NEVER include the question stem)`;
}

/** Template for procedural / polish layers building realistic vignettes. */
export function formatClinicalVignette(params: {
  age: number;
  sex: string;
  setting: string;
  chiefComplaint: string;
  history: string;
  exam: string;
  labs: string;
}): string {
  const sexLabel =
    params.sex === "male" || params.sex === "man"
      ? "man"
      : params.sex === "female" || params.sex === "woman"
        ? "woman"
        : params.sex;
  const ageLabel =
    params.age < 18
      ? `${params.age}-year-old`
      : `${params.age}-year-old ${sexLabel}`;

  return [
    `A ${ageLabel} presents to the ${params.setting} with ${params.chiefComplaint}.`,
    params.history,
    `Physical examination: ${params.exam}.`,
    `Laboratory/imaging: ${params.labs}.`,
  ].join(" ");
}
