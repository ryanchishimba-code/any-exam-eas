/**
 * Fields a student's browser is allowed to see on a question.
 * Bank rows keep generation metadata for writers and QA. The study and exam
 * serializers copy only the layout the player renders.
 */
import { NCLEX_STEP_NAMES, withoutCaseTitle } from "@/lib/full-exam/nclex-exam-labels";
import { isInternalMasteryConceptKey } from "@/lib/learning/concept-labels";

/** Object keys that must not appear anywhere in a student question JSON. */
export const STUDENT_BANNED_KEYS = [
  "generationMeta",
  "rationale",
  "model",
  "pipeline",
  "pipelineVersion",
  "manualCorrection",
  "caseTitle",
  "slotId",
  "slotIndex",
  "slotName",
  "cjmmStep",
  "stepName",
  "stepLevel",
  "batchId",
  "templateId",
  "keyFix",
  "examNumber",
  "qcScore",
  "qcTier",
  "generatedAt",
  "generationVersion",
  "curationMeta",
  "diagramUrl",
  "patientAgeGroup",
  "taskCategory",
  "caseGroupId",
  "cjmmFunction",
] as const;

const BANNED = new Set<string>(STUDENT_BANNED_KEYS);

/**
 * Extra keys that belong on the server payload only.
 * Top-level blueprint fields on the question itself stay for results grouping.
 */
const PAYLOAD_ONLY_BANNED = new Set<string>([
  ...STUDENT_BANNED_KEYS,
  "blueprintTopic",
  "blueprintDomain",
  "blueprintSystem",
  "key",
  "keys",
]);

/** NGN and exhibit keys the practice, exam, and review players read. */
const STUDENT_LAYOUT_KEYS = [
  "kind",
  "setId",
  "stepIndex",
  "totalSteps",
  "caseStep",
  "condition",
  "conditionOptions",
  "actions",
  "monitors",
  "actionPickCount",
  "monitorPickCount",
  "rows",
  "columns",
  "matrixMulti",
  "rowHeader",
  "text",
  "highlights",
  "tokens",
  "segments",
  "template",
  "dropdowns",
  "exhibit",
  "clinicalItemType",
  "media",
  "table",
  "labTable",
  "unit",
  "abstract",
  "ad",
  "caseData",
  "prompts",
  "options",
  "statements",
  "itemFormat",
  "top500Drugs",
  "reviewModuleSlug",
  "reviewModuleTopic",
  "memoryCardIds",
  "keyTakeaway",
] as const;

const LAYOUT = new Set<string>(STUDENT_LAYOUT_KEYS);

const STEP_NAMES = new Set(NCLEX_STEP_NAMES.map((name) => name.toLowerCase()));

const STEP_SLUGS = new Set([
  "recognize_cues",
  "analyze_cues",
  "prioritize_hypotheses",
  "generate_solutions",
  "take_action",
  "evaluate_outcomes",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function omitKeys(value: unknown, banned: Set<string>): unknown {
  if (Array.isArray(value)) return value.map((entry) => omitKeys(entry, banned));
  if (!isRecord(value)) return value;
  const out: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    if (banned.has(key)) continue;
    out[key] = omitKeys(child, banned);
  }
  return out;
}

/** Layout object safe to send as ngnPayload or chartData. */
export function studentLayoutPayload(
  payload: Record<string, unknown> | null | undefined
): Record<string, unknown> | undefined {
  if (!isRecord(payload)) return undefined;
  const picked: Record<string, unknown> = {};
  for (const key of LAYOUT) {
    if (payload[key] !== undefined) picked[key] = payload[key];
  }
  const cleaned = omitKeys(picked, PAYLOAD_ONLY_BANNED);
  if (!isRecord(cleaned) || Object.keys(cleaned).length === 0) return undefined;
  return cleaned;
}

/** Drop clinical-judgment step names from tags the player uses for links. */
export function studentFacingTags(tags: string[] | null | undefined): string[] | undefined {
  if (!tags) return undefined;
  const next = tags.filter((tag) => {
    const trimmed = tag.trim();
    if (!trimmed) return false;
    if (/^cjmm:/i.test(trimmed)) return false;
    const bare = trimmed.toLowerCase();
    if (STEP_NAMES.has(bare) || STEP_SLUGS.has(bare)) return false;
    if (isInternalMasteryConceptKey(trimmed)) return false;
    return true;
  });
  return next;
}

/**
 * Remove a case title from the vignette. Exam mode used to do this in the
 * browser with ngnPayload.caseTitle. The title is no longer sent, so the
 * vignette has to be cleaned before it leaves the server.
 */
export function vignetteWithoutCaseTitle(
  vignette: string | undefined,
  payload: Record<string, unknown> | null | undefined
): string | undefined {
  if (!vignette) return vignette;
  const title = isRecord(payload) && typeof payload.caseTitle === "string" ? payload.caseTitle : undefined;
  const stripped = withoutCaseTitle(vignette, title).trim();
  return stripped || undefined;
}

/** Walk a student question and return banned keys found at any depth. */
export function findBannedStudentKeys(value: unknown, found: Set<string> = new Set()): string[] {
  if (Array.isArray(value)) {
    for (const entry of value) findBannedStudentKeys(entry, found);
    return [...found];
  }
  if (!isRecord(value)) return [...found];
  for (const [key, child] of Object.entries(value)) {
    if (BANNED.has(key)) found.add(key);
    findBannedStudentKeys(child, found);
  }
  return [...found];
}
