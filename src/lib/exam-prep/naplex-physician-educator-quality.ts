/**
 * QA gate for hand-crafted NAPLEX physician-educator items before bank sync.
 */
import type { EnrichedBankItem } from "./seed-helpers";

export type NaplexQualityIssue = {
  itemIndex: number;
  subjectId?: string;
  code: string;
  message: string;
};

export type NaplexQualityReport = {
  ok: boolean;
  itemCount: number;
  issues: NaplexQualityIssue[];
};

const AI_TELLTALE_PATTERNS: RegExp[] = [
  /\bit is important to note\b/i,
  /\bas an ai\b/i,
  /\bin conclusion\b/i,
  /\bfurthermore\b/i,
  /\bmoreover\b/i,
  /\bcomprehensive understanding\b/i,
  /\bdelves into\b/i,
  /\bnavigate the complexities\b/i,
  /\bit'?s worth noting\b/i,
  /\bplays a crucial role\b/i,
  /\bin today'?s world\b/i,
];

const CLINICAL_DATA_PATTERN =
  /\d+\s*(?:mg\/dL|mEq\/L|mm Hg|\/min|× 10|g\/dL|mIU\/mL|°C|°F|U\/L|mm|%|mg\/kg|mL\/hr|mg|mEq|mL|kg|tablets|units)/i;

const AGE_PATTERN = /\b\d{1,3}[- ]year[- ]old\b|\b\d{1,3}\s*y\/o\b/i;

const LEAD_IN_PATTERN =
  /(?:most likely|most appropriate|best explains|best describes|which of the following|select all|calculate|what is|how many|at what rate)/i;

const NAPLEX_ITEM_TYPES = new Set([
  "case_based",
  "vignette",
  "select_all",
  "constructed_response",
]);

const NAPLEX_BLUEPRINT_PREFIX = "naplex-area";

function isBiostatItem(item: EnrichedBankItem): boolean {
  return (
    item.subjectId === "biostatistics" ||
    (item.tags ?? []).some((t) => t === "biostatistics" || t === "biostats")
  );
}

function isPureMcq(item: EnrichedBankItem): boolean {
  return item.itemType === "vignette";
}

export function assessNaplexPhysicianEducatorItem(
  item: EnrichedBankItem,
  index: number
): NaplexQualityIssue[] {
  const issues: NaplexQualityIssue[] = [];
  const subjectId = item.subjectId;
  const push = (code: string, message: string) =>
    issues.push({ itemIndex: index, subjectId, code, message });

  const vignette = item.vignette?.trim() ?? "";
  const stem = item.question?.trim() ?? "";
  const explanation = item.explanation?.trim() ?? "";
  const options = item.options ?? [];
  const combined = `${vignette}\n${stem}\n${explanation}`;
  const itemType = item.itemType ?? "mcq";

  const minVignetteLength =
    itemType === "constructed_response" ? 40 : isPureMcq(item) ? 0 : 80;
  if (vignette.length < minVignetteLength) {
    push(
      "vignette_length",
      `Vignette should be at least ${minVignetteLength} characters for ${itemType}.`
    );
  }

  if (!stem || stem.length < 20) {
    push("stem_length", "Question stem is missing or too short.");
  }

  if (!stem.includes("?")) {
    push("stem_question", "Lead-in should include a question mark.");
  }

  if (!LEAD_IN_PATTERN.test(stem)) {
    push(
      "stem_lead_in",
      "Stem should use NAPLEX-style lead-in (e.g. most appropriate, select all, calculate)."
    );
  }

  if (itemType === "select_all") {
    if (options.length < 4 || options.length > 6) {
      push("sata_options_count", `SATA expects 4–6 options; got ${options.length}.`);
    }
    const optionSet = new Set(options.map((o) => o.trim()));
    const byPipe = (item.correctAnswer ?? "")
      .split("|||")
      .map((s) => s.trim())
      .filter(Boolean);
    const correctParts =
      byPipe.length > 0 && byPipe.every((p) => optionSet.has(p))
        ? byPipe
        : (item.correctAnswer ?? "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    if (correctParts.length < 2) {
      push("sata_correct_count", "SATA should have at least two correct selections.");
    }
    for (const part of correctParts) {
      if (!options.includes(part)) {
        push("sata_correct_not_in_options", `SATA correctAnswer "${part}" must match an option.`);
      }
    }
  } else if (itemType === "constructed_response") {
    if (!item.correctAnswer?.trim()) {
      push("calc_answer_missing", "constructed_response requires correctAnswer.");
    } else if (!/^\d+(?:\.\d+)?$/.test(item.correctAnswer.trim())) {
      push("calc_answer_numeric", "constructed_response correctAnswer should be numeric.");
    }
    const unit = item.ngnPayload?.unit;
    if (!unit || typeof unit !== "string" || !unit.trim()) {
      push("calc_unit_missing", "constructed_response requires ngnPayload.unit.");
    }
  } else if (itemType === "vignette" || itemType === "case_based") {
    if (options.length < 4 || options.length > 5) {
      push("mcq_options_count", `MCQ/case expects 4–5 options; got ${options.length}.`);
    }
    if (!item.correctAnswer?.trim()) {
      push("correct_missing", "correctAnswer is required.");
    } else if (!options.includes(item.correctAnswer)) {
      push("correct_not_in_options", "correctAnswer must exactly match one option string.");
    }
  }

  const uniqueOptions = new Set(options.map((o) => o.trim().toLowerCase()));
  if (options.length > 0 && uniqueOptions.size !== options.length) {
    push("options_duplicate", "Answer options must be unique.");
  }

  if (explanation.length < 100) {
    push(
      "explanation_length",
      "Explanation should be at least 100 characters (pharmacy board-style rationale)."
    );
  }

  if (!item.blueprintDomain?.startsWith(NAPLEX_BLUEPRINT_PREFIX)) {
    push("blueprint_domain", "blueprintDomain must be a naplex-area* domain.");
  }

  if (item.difficulty == null || item.difficulty < 1 || item.difficulty > 5) {
    push("difficulty", "difficulty must be set between 1 and 5.");
  }

  if (!NAPLEX_ITEM_TYPES.has(itemType)) {
    push(
      "item_type",
      "Physician-educator NAPLEX batch should use case_based, vignette, select_all, or constructed_response."
    );
  }

  if (!item.subjectId?.trim()) {
    push("subject_id", "subjectId is required.");
  }

  if (
    !isBiostatItem(item) &&
    !isPureMcq(item) &&
    itemType !== "constructed_response" &&
    itemType !== "select_all" &&
    !AGE_PATTERN.test(`${vignette}\n${stem}`)
  ) {
    push("vignette_age", "Clinical items should include patient age (e.g. 74-year-old or 74 y/o).");
  }

  const exemptNumericData =
    isBiostatItem(item) ||
    itemType === "constructed_response" ||
    itemType === "select_all";
  if (!exemptNumericData && !CLINICAL_DATA_PATTERN.test(`${vignette}\n${stem}`)) {
    push("vignette_data", "Vignette should include numeric vitals, labs, doses, or rates.");
  }

  for (const pattern of AI_TELLTALE_PATTERNS) {
    if (pattern.test(combined)) {
      push("ai_phrasing", `Possible AI telltale phrasing: ${pattern.source}`);
      break;
    }
  }

  const tags = item.tags ?? [];
  if (!tags.includes("physician-educator")) {
    push("batch_tag", 'Missing "physician-educator" tag for curated batch tracking.');
  }

  return issues;
}

export function assessNaplexPhysicianEducatorBatch(
  items: EnrichedBankItem[]
): NaplexQualityReport {
  const issues = items.flatMap((item, index) => assessNaplexPhysicianEducatorItem(item, index));
  return {
    ok: issues.length === 0,
    itemCount: items.length,
    issues,
  };
}

/** Vitest / CI — throws with a readable summary when QA fails. */
export function assertNaplexPhysicianEducatorQuality(items: EnrichedBankItem[]): void {
  const report = assessNaplexPhysicianEducatorBatch(items);
  if (report.ok) return;

  const lines = report.issues.map(
    (i) => `[#${i.itemIndex}${i.subjectId ? ` ${i.subjectId}` : ""}] ${i.code}: ${i.message}`
  );
  throw new Error(
    `NAPLEX physician-educator QA failed (${report.issues.length} issue(s)):\n${lines.join("\n")}`
  );
}
