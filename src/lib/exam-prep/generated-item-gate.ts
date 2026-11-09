/**
 * Gate for a generated question before it may be marked active.
 * A failure stays inactive for review. Callers apply the result on insert.
 * This module does not write to the database.
 */

const GENERIC_RATIONALE =
  /USMLE Step\s+\d|Step\s+\d(?:\s+CK)?\s+reasoning|1\.\s*(?:Identify|Recognize cues)/i;

const MANAGEMENT_ASK =
  /\b(next step|most appropriate|administer|start|give|treat|management|priority)\b/i;

const GUIDELINE_MARK =
  /\b(?:19|20)\d{2}\b|\b(?:AHA|ASA|ACOG|CDC|IDSA|KDIGO|GINA|ADA|USPSTF|NCSBN|ACG|ASH)\b/;

const STEP_FOR_FIELD: Record<string, string> = {
  "usmle-step-1": "step1",
  "usmle-step-2": "step2",
  "usmle-step-3": "step3",
};

export type GeneratedItemForGate = {
  fieldId: string;
  stepLevel?: string | null;
  scenario?: string | null;
  question: string;
  options: readonly string[];
  correctAnswer: string;
  explanation: string;
  /** Difficulty the generator claims for this board or Step. */
  difficulty?: number | null;
  /** Share of the official outline this decision carries. Missing or 0 is not enough. */
  outlineWeight?: number | null;
  /** The decision the real exam tests, and the takeaway the student should leave with. */
  examTakeaway?: string | null;
  citation?: string | null;
};

export type GeneratedItemGateResult = {
  activate: boolean;
  failures: string[];
};

/** Stable family key. Ages and isolated numbers do not make a new item. */
export function stemFamilyFingerprint(scenario: string, question: string): string {
  const normalized = `${scenario} ${question}`
    .toLowerCase()
    .replace(/\b\d+\s*-?\s*(?:year|month)-?\s*old\b/g, "patient")
    .replace(/\b\d+(?:\.\d+)?\b/g, "")
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
  return normalized;
}

function explainsOption(explanation: string, option: string): boolean {
  const text = explanation.toLowerCase();
  const needle = option.trim().toLowerCase();
  if (needle.length === 0) return false;
  if (text.includes(needle)) return true;
  const prefix = needle.slice(0, 24);
  return prefix.length >= 12 && text.includes(prefix);
}

/**
 * Every check is required. The first is exam-readiness value: a high-yield,
 * outline-weighted decision at this board's difficulty, with the takeaway taught.
 */
export function reviewGeneratedItem(
  item: GeneratedItemForGate,
  servedFingerprints: ReadonlySet<string>
): GeneratedItemGateResult {
  const failures: string[] = [];
  const takeaway = item.examTakeaway?.trim() ?? "";
  const scenario = item.scenario?.trim() ?? "";
  const question = item.question.trim();
  const explanation = item.explanation.trim();
  const options = item.options.map((option) => option.trim()).filter(Boolean);

  if (
    takeaway.length < 40 ||
    GENERIC_RATIONALE.test(takeaway) ||
    !explanation.toLowerCase().includes(takeaway.toLowerCase()) ||
    item.outlineWeight == null ||
    item.outlineWeight <= 0 ||
    item.difficulty == null ||
    item.difficulty < 1 ||
    item.difficulty > 5
  ) {
    failures.push(
      "Does not show exam-readiness value: it must test a high-yield, outline-weighted decision at this board's difficulty, and the rationale must teach that takeaway."
    );
  }

  const fingerprint = stemFamilyFingerprint(scenario, question);
  if (fingerprint.length < 40 || servedFingerprints.has(fingerprint)) {
    failures.push("Stem family duplicates an item already in the served bank.");
  }

  if (GENERIC_RATIONALE.test(explanation) || options.some((option) => !explainsOption(explanation, option))) {
    failures.push("Rationale must explain every option and must not be a generic Step outline.");
  }

  const keyed = options.filter((option) => option === item.correctAnswer.trim());
  if (keyed.length !== 1 || item.correctAnswer.includes("|||")) {
    failures.push("Needs one defensible best answer that matches exactly one option.");
  }

  const expectedStep = STEP_FOR_FIELD[item.fieldId];
  const step = item.stepLevel?.trim() ?? "";
  if (expectedStep) {
    if (step !== expectedStep) {
      failures.push(`Step label must be ${expectedStep} for ${item.fieldId}.`);
    }
  } else if (step.startsWith("step")) {
    failures.push("Step label does not match this board.");
  }

  const boardStyle =
    scenario.length >= 80 &&
    (/\b(?:year-old|month-old|client|patient)\b/i.test(scenario) ||
      /\b(?:mg\/dL|mm Hg|bpm|fever|temperature)\b/i.test(scenario)) &&
    question.length > 0;
  if (!boardStyle) {
    failures.push("Needs a board-style vignette, not a one-line shell.");
  }

  const cited = `${explanation} ${item.citation ?? ""}`;
  if (MANAGEMENT_ASK.test(question) && !GUIDELINE_MARK.test(cited)) {
    failures.push("A management decision needs a guideline or year citation.");
  }

  return { activate: failures.length === 0, failures };
}

type BankItemGateSource = {
  question: string;
  options: readonly string[];
  correctAnswer: string;
  explanation: string;
  scenario?: string | null;
  vignette?: string | null;
  difficulty?: number | null;
  ngnPayload?: Record<string, unknown> | null;
  generationMeta?: Record<string, unknown> | null;
  keyTakeaways?: readonly string[] | null;
  references?: ReadonlyArray<{ citation?: string; label?: string }> | null;
};

/** Map a bank row onto the gate. Missing exam-readiness fields fail closed. */
export function generatedItemFromBankItem(
  fieldId: string,
  item: BankItemGateSource
): GeneratedItemForGate {
  const meta = item.generationMeta ?? {};
  const examTakeaway =
    (typeof meta.examTakeaway === "string" && meta.examTakeaway) || item.keyTakeaways?.[0] || null;
  const outlineWeight = typeof meta.outlineWeight === "number" ? meta.outlineWeight : null;
  const citation =
    (typeof meta.citation === "string" && meta.citation) ||
    item.references
      ?.map((reference) => reference.citation || reference.label)
      .filter((value): value is string => Boolean(value))
      .join(" ") ||
    null;
  const stepLevel =
    typeof item.ngnPayload?.stepLevel === "string" ? item.ngnPayload.stepLevel : null;

  return {
    fieldId,
    stepLevel,
    scenario: item.scenario ?? item.vignette ?? null,
    question: item.question,
    options: item.options,
    correctAnswer: item.correctAnswer,
    explanation: item.explanation,
    difficulty: item.difficulty ?? null,
    outlineWeight,
    examTakeaway,
    citation,
  };
}

type GeneratedInsertRow = {
  active: boolean;
  qaPassed: boolean;
  generationMeta?: unknown;
};

/**
 * Passing rows stay active only when they also passed the structural ingest gate.
 * Anything else is stored inactive, with the reasons on generationMeta.
 * A passing row claims its stem family so a later twin in the same batch cannot activate.
 */
export function withGeneratedItemGate<T extends GeneratedInsertRow>(
  row: T,
  item: GeneratedItemForGate,
  fingerprints: Set<string>
): T {
  const review = reviewGeneratedItem(item, fingerprints);
  const prior =
    row.generationMeta && typeof row.generationMeta === "object" && !Array.isArray(row.generationMeta)
      ? (row.generationMeta as Record<string, unknown>)
      : {};
  const generationMeta = {
    ...prior,
    generatedItemGate: {
      activate: review.activate && row.qaPassed === true,
      failures: review.failures,
    },
  };

  if (!review.activate || row.qaPassed !== true) {
    return { ...row, active: false, qaPassed: false, generationMeta };
  }

  fingerprints.add(stemFamilyFingerprint(item.scenario ?? "", item.question));
  return { ...row, active: true, generationMeta };
}
