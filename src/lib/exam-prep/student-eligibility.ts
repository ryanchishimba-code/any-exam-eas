/**
 * Student-eligible item rule.
 *
 * One board-generic decision for every surface that shows a question to a
 * student. Suppression is a reason code, not a delete and not an `active` /
 * `qaPassed` change. An RN restore is `curationMeta.studentEligibility.status
 * = "restored"` and is the only override.
 *
 * Case-study completeness needs the rest of the group. Pass `caseGroups`
 * from `buildCaseGroupFacts` (or the warmed cache). A group counts only when
 * it has six items, one patient, and a real NGN response. `completeCaseGroups`
 * is the older count-only set, used when facts are not available. When both
 * are omitted, case-study rows are not eligible.
 */
import { parseSelectAllCorrectAnswers } from "@/lib/question-format";
import { readItemQaRecord } from "@/lib/exam-prep/item-qa/flag";
import type { BankItem } from "@/lib/question-bank";

export const STUDENT_ELIGIBILITY_PIPELINE = "student-eligibility-v1" as const;

export const STUDENT_SUPPRESS_REASONS = [
  "qa_gate_failed",
  "sata_fewer_than_two_keys",
  "select_all_stem_single_key",
  "bowtie_rationale_contradicts_key",
  "bowtie_invalid_structure",
  "matrix_rows_unkeyed",
  "ordered_key_equals_display",
  "highlight_missing_passage",
  "highlight_options_not_in_passage",
  "incomplete_case_study",
  "case_set_distinct_patients",
  "case_set_single_answer_only",
  "retired_but_active",
] as const;

export type StudentSuppressReason = (typeof STUDENT_SUPPRESS_REASONS)[number];

export type StudentEligibilityStatus = "eligible" | "suppressed" | "restored";

export type StudentEligibilityRecord = {
  pipeline: typeof STUDENT_ELIGIBILITY_PIPELINE;
  status: StudentEligibilityStatus;
  reasons: StudentSuppressReason[];
  assessedAt: string;
  restoredAt?: string;
};

export type StudentEligibilityInput = {
  id?: string;
  fieldId?: string | null;
  active?: boolean | null;
  qaPassed?: boolean | null;
  itemType?: string | null;
  question?: string | null;
  scenario?: string | null;
  correctAnswer?: string | null;
  explanation?: string | null;
  /** Raw `options` column. Used when `ngnPayload` / `options` are not set. */
  optionsRaw?: string | null;
  options?: string[] | null;
  ngnPayload?: Record<string, unknown> | null;
  curationMeta?: unknown;
};

/** Facts for one `${fieldId}\\t${itemType}\\t${caseGroupId}` group. */
export type CaseGroupFacts = {
  members: number;
  /** Every item is the same patient. Conflicting ages or sexes fail this. */
  sharedPatient: boolean;
  /** At least one item is a real NGN response, not a single-answer MCQ. */
  hasNgnItem: boolean;
};

export type StudentEligibilityContext = {
  /**
   * Group facts from `buildCaseGroupFacts`. Preferred over `completeCaseGroups`.
   * A missing key is an incomplete case.
   */
  caseGroups?: ReadonlyMap<string, CaseGroupFacts>;
  /**
   * `${fieldId}\\t${itemType}\\t${caseGroupId}` for active groups of exactly 6.
   * Used only when `caseGroups` and the warmed facts cache are both absent.
   */
  completeCaseGroups?: ReadonlySet<string>;
};

export type StudentEligibilityVerdict = {
  eligible: boolean;
  reasons: StudentSuppressReason[];
  restored: boolean;
};

const SATA_TYPES = new Set(["select_all", "sata"]);
const BOWTIE_TYPES = new Set(["ngn_bowtie", "bow_tie"]);
const MATRIX_TYPES = new Set(["ngn_matrix", "matrix"]);
const ORDERED_TYPES = new Set(["ordered_response", "drag_drop"]);
const HIGHLIGHT_TYPES = new Set(["ngn_highlight", "highlight"]);
const CASE_TYPES = new Set(["case_study", "unfolding_case", "case_based"]);
const STANDARD_TYPES = new Set(["vignette", "mcq", ""]);

/** Response kinds that make a case step a real NGN item. Keep the SQL mirror in step. */
const NGN_RESPONSE_KINDS = new Set([
  "bow_tie",
  "bowtie",
  "ngn_bowtie",
  "matrix",
  "ngn_matrix",
  "highlight",
  "ngn_highlight",
  "select_all",
  "sata",
  "ordered_response",
  "drag_drop",
  "cloze",
  "dropdown",
  "drop_down",
  "trend",
  "hotspot",
  "hot_spot",
  "constructed_response",
  "multiple_response",
]);

const SELECT_ALL_STEM = /\bselect all\b/i;
const RATIONALE_WRONG_MARK = "why other options are incorrect";

function norm(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export function readStudentEligibilityRecord(meta: unknown): StudentEligibilityRecord | null {
  const base = asRecord(meta);
  const raw = asRecord(base?.studentEligibility);
  if (!raw || raw.pipeline !== STUDENT_ELIGIBILITY_PIPELINE) return null;
  const status = raw.status;
  if (status !== "eligible" && status !== "suppressed" && status !== "restored") return null;
  const reasons = Array.isArray(raw.reasons)
    ? raw.reasons.filter((code): code is StudentSuppressReason =>
        (STUDENT_SUPPRESS_REASONS as readonly string[]).includes(String(code))
      )
    : [];
  const restoredAt = typeof raw.restoredAt === "string" ? raw.restoredAt : undefined;
  return {
    pipeline: STUDENT_ELIGIBILITY_PIPELINE,
    status,
    reasons,
    assessedAt: typeof raw.assessedAt === "string" ? raw.assessedAt : "",
    ...(restoredAt ? { restoredAt } : {}),
  };
}

export function isStudentEligibilityRestored(meta: unknown): boolean {
  return readStudentEligibilityRecord(meta)?.status === "restored";
}

export function payloadFromInput(input: StudentEligibilityInput): Record<string, unknown> | null {
  if (input.ngnPayload && Object.keys(input.ngnPayload).length > 0) return input.ngnPayload;
  if (!input.optionsRaw) return null;
  try {
    const parsed = JSON.parse(input.optionsRaw) as unknown;
    if (Array.isArray(parsed)) return { options: parsed };
    return asRecord(parsed);
  } catch {
    return null;
  }
}

function optionList(input: StudentEligibilityInput, payload: Record<string, unknown> | null): string[] {
  if (input.options && input.options.length > 0) return input.options.map(String);
  const raw = payload?.options;
  if (Array.isArray(raw)) return raw.map(String);
  return [];
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(String).map((part) => part.trim()).filter(Boolean);
}

export function caseGroupStorageKey(input: StudentEligibilityInput): string | null {
  const type = (input.itemType ?? "").trim();
  if (!CASE_TYPES.has(type)) return null;
  const payload = payloadFromInput(input);
  const groupId = typeof payload?.caseGroupId === "string" ? payload.caseGroupId.trim() : "";
  if (!groupId) return null;
  const fieldId = (input.fieldId ?? "").trim();
  return `${fieldId}\t${type}\t${groupId}`;
}

function caseNarrative(input: StudentEligibilityInput): string {
  const scenario = input.scenario?.trim() ?? "";
  if (scenario) return scenario;
  return input.question?.trim() ?? "";
}

/**
 * Same patient when stated ages do not conflict and stated sexes do not conflict.
 * A later step may say "the client" without repeating the age. With no age at all,
 * the opening of every item has to match.
 */
export function caseGroupSharesPatient(texts: string[]): boolean {
  const ages = new Set<string>();
  const sexes = new Set<string>();
  for (const text of texts) {
    const lower = text.toLowerCase();
    const age = lower.match(/\b(\d{1,3})-year-old\b/);
    if (age) ages.add(age[1]!);
    const sex = lower.match(
      /\b\d{1,3}-year-old\s+(male|man|boy|female|woman|girl|primigravida|multigravida|infant)\b/
    );
    if (!sex) continue;
    const word = sex[1]!;
    if (word === "male" || word === "man" || word === "boy") sexes.add("m");
    else if (word === "infant") sexes.add("i");
    else sexes.add("f");
  }
  if (ages.size > 1 || sexes.size > 1) return false;
  if (ages.size > 0) return true;
  const signatures = texts.map((text) => norm(text).slice(0, 48)).filter((value) => value.length > 0);
  if (signatures.length === 0) return false;
  return new Set(signatures).size === 1;
}

function memberIsRealNgn(input: StudentEligibilityInput): boolean {
  const type = (input.itemType ?? "").trim();
  if (
    BOWTIE_TYPES.has(type) ||
    MATRIX_TYPES.has(type) ||
    ORDERED_TYPES.has(type) ||
    HIGHLIGHT_TYPES.has(type) ||
    SATA_TYPES.has(type)
  ) {
    return true;
  }
  const payload = payloadFromInput(input);
  const kind = String(payload?.kind ?? "").trim().toLowerCase();
  if (NGN_RESPONSE_KINDS.has(kind)) return true;
  if (stringList(payload?.highlights).length > 0 && kind !== "mcq" && kind !== "vignette") return true;
  if (stringList(payload?.actions).length > 0 && kind.includes("bow")) return true;
  if (Array.isArray(payload?.rows) && payload.rows.length > 0 && kind !== "mcq" && kind !== "vignette") return true;
  return (input.correctAnswer ?? "").includes("|||");
}

/** One entry per case group that has an id. Callers decide which shapes are servable. */
export function buildCaseGroupFacts(rows: StudentEligibilityInput[]): Map<string, CaseGroupFacts> {
  const grouped = new Map<string, StudentEligibilityInput[]>();
  for (const row of rows) {
    if (row.active === false) continue;
    const key = caseGroupStorageKey(row);
    if (!key) continue;
    const list = grouped.get(key) ?? [];
    list.push(row);
    grouped.set(key, list);
  }
  const facts = new Map<string, CaseGroupFacts>();
  for (const [key, members] of grouped) {
    facts.set(key, {
      members: members.length,
      sharedPatient: caseGroupSharesPatient(members.map(caseNarrative)),
      hasNgnItem: members.some(memberIsRealNgn),
    });
  }
  return facts;
}

/** Active groups with exactly six members. Incomplete groups are not in the set. */
export function completeCaseGroupKeys(rows: StudentEligibilityInput[]): Set<string> {
  const counts = new Map<string, number>();
  for (const row of rows) {
    if (row.active === false) continue;
    const key = caseGroupStorageKey(row);
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const complete = new Set<string>();
  for (const [key, count] of counts) {
    if (count === 6) complete.add(key);
  }
  return complete;
}

function retiredButActive(meta: unknown): boolean {
  const record = readItemQaRecord(meta);
  if (record?.retiredAt || record?.retiredReason) return true;
  const raw = asRecord(asRecord(meta)?.itemQa);
  if (!raw) return false;
  return typeof raw.retiredAt === "string" || typeof raw.retiredReason === "string";
}

function rationaleCallsKeyedIncorrect(explanation: string, keyed: string[]): boolean {
  const lower = explanation.toLowerCase();
  const at = lower.indexOf(RATIONALE_WRONG_MARK);
  if (at < 0) return false;
  const wrong = lower.slice(at + RATIONALE_WRONG_MARK.length);
  return keyed.some((choice) => choice.trim().length >= 8 && wrong.includes(choice.trim().toLowerCase()));
}

function bowtieKeyedChoices(payload: Record<string, unknown> | null, answer: string): string[] {
  const choices = [
    ...stringList(payload?.actions),
    ...stringList(payload?.monitors),
    ...(typeof payload?.condition === "string" && payload.condition.trim()
      ? [payload.condition.trim()]
      : []),
  ];
  const hay = answer.toLowerCase();
  return choices.filter((choice) => choice.length >= 8 && hay.includes(choice.toLowerCase()));
}

function orderedKeyEqualsDisplay(options: string[], answer: string): boolean {
  const trimmed = answer.trim();
  if (!trimmed || options.length < 2) return false;
  if (options.join(",") === trimmed) return true;
  const keyed = trimmed.split(",").map((part) => part.trim()).filter(Boolean);
  if (keyed.length < 2) return false;
  const positions = keyed.map((part) =>
    options.findIndex((option) => option.trim() === part)
  );
  if (positions.some((index) => index < 0)) return false;
  for (let i = 1; i < positions.length; i++) {
    if (positions[i]! <= positions[i - 1]!) return false;
  }
  return true;
}

function push(reasons: StudentSuppressReason[], code: StudentSuppressReason) {
  if (!reasons.includes(code)) reasons.push(code);
}

/** A choice that was sliced out of a longer comma-separated sibling. */
function isCommaSplitFragment(option: string, siblings: string[]): boolean {
  const trimmed = option.trim();
  if (!trimmed) return false;
  if (/^(and|or)\b/i.test(trimmed)) return true;
  const lower = trimmed.toLowerCase();
  return siblings.some((other) => {
    if (other === option) return false;
    const sibling = other.trim().toLowerCase();
    if (!sibling.includes(",")) return false;
    if (sibling.startsWith(`${lower},`)) return true;
    return sibling.split(",").some((part) => part.trim() === lower);
  });
}

function bowtieHasFragmentOptions(payload: Record<string, unknown> | null): boolean {
  const choices = [...stringList(payload?.actions), ...stringList(payload?.monitors)];
  return choices.some((choice) => isCommaSplitFragment(choice, choices));
}

function highlightSpansMissPassage(passage: string, spans: string[]): boolean {
  if (spans.length === 0) return true;
  const hay = norm(passage);
  return spans.some((span) => {
    const needle = norm(span);
    return needle.length === 0 || !hay.includes(needle);
  });
}

export function assessStudentEligibility(
  input: StudentEligibilityInput,
  context: StudentEligibilityContext = {}
): StudentEligibilityVerdict {
  if (input.active === false) {
    return { eligible: false, reasons: [], restored: false };
  }

  const reasons: StudentSuppressReason[] = [];
  const type = (input.itemType ?? "mcq").trim();
  const answer = input.correctAnswer?.trim() ?? "";
  const question = input.question ?? "";
  const scenario = input.scenario ?? "";
  const explanation = input.explanation ?? "";
  const payload = payloadFromInput(input);
  const options = optionList(input, payload);

  if (input.qaPassed === false) push(reasons, "qa_gate_failed");
  if (retiredButActive(input.curationMeta)) push(reasons, "retired_but_active");

  if (SATA_TYPES.has(type)) {
    const keyed = parseSelectAllCorrectAnswers(options, answer);
    if (keyed.length < 2) push(reasons, "sata_fewer_than_two_keys");
  } else if (STANDARD_TYPES.has(type) || type === "vignette" || type === "mcq") {
    const stem = `${question}\n${scenario}`;
    if (SELECT_ALL_STEM.test(stem)) {
      const keyed = parseSelectAllCorrectAnswers(options, answer);
      if (keyed.length < 2) push(reasons, "select_all_stem_single_key");
    }
  }

  if (BOWTIE_TYPES.has(type)) {
    const actions = stringList(payload?.actions);
    const monitors = stringList(payload?.monitors);
    const condition = typeof payload?.condition === "string" ? payload.condition : "";
    const conditionIsStem =
      condition.trim().length > 0 &&
      (norm(condition) === norm(question) || (scenario.trim() && norm(condition) === norm(scenario)));
    if (actions.length < 1 || monitors.length < 1 || conditionIsStem || bowtieHasFragmentOptions(payload)) {
      push(reasons, "bowtie_invalid_structure");
    }
    const keyed = bowtieKeyedChoices(payload, answer);
    if (rationaleCallsKeyedIncorrect(explanation, keyed)) {
      push(reasons, "bowtie_rationale_contradicts_key");
    }
  }

  if (MATRIX_TYPES.has(type)) {
    const rows = Array.isArray(payload?.rows) ? payload.rows.length : 0;
    const pairs = answer.split("|||").length - 1;
    if (rows === 0 || pairs < rows) push(reasons, "matrix_rows_unkeyed");
  }

  if (ORDERED_TYPES.has(type) && orderedKeyEqualsDisplay(options, answer)) {
    push(reasons, "ordered_key_equals_display");
  }

  if (HIGHLIGHT_TYPES.has(type)) {
    const text = typeof payload?.text === "string" ? payload.text.trim() : "";
    if (!text) {
      push(reasons, "highlight_missing_passage");
    } else {
      const listed = stringList(payload?.highlights);
      const spans = listed.length > 0 ? listed : options;
      if (highlightSpansMissPassage(text, spans)) push(reasons, "highlight_options_not_in_passage");
    }
  }

  if (CASE_TYPES.has(type)) {
    const key = caseGroupStorageKey(input);
    const groups = context.caseGroups ?? peekCaseGroupFacts();
    if (groups) {
      const facts = key ? groups.get(key) : undefined;
      if (!key || !facts || facts.members !== 6) {
        push(reasons, "incomplete_case_study");
      } else {
        if (!facts.sharedPatient) push(reasons, "case_set_distinct_patients");
        if (!facts.hasNgnItem) push(reasons, "case_set_single_answer_only");
      }
    } else {
      const complete = context.completeCaseGroups;
      if (!key || !complete || !complete.has(key)) push(reasons, "incomplete_case_study");
    }
  }

  const restored = isStudentEligibilityRestored(input.curationMeta);
  return {
    eligible: restored || reasons.length === 0,
    reasons,
    restored,
  };
}

export function isStudentEligible(
  input: StudentEligibilityInput,
  context: StudentEligibilityContext = {}
): boolean {
  return assessStudentEligibility(input, context).eligible;
}

let caseGroupCache: { at: number; groups: Map<string, CaseGroupFacts>; servable: Set<string> } | null = null;
const CASE_GROUP_CACHE_MS = 5 * 60 * 1000;

function cacheFresh(): boolean {
  return Boolean(caseGroupCache && Date.now() - caseGroupCache.at <= CASE_GROUP_CACHE_MS);
}

export function peekCaseGroupFacts(): Map<string, CaseGroupFacts> | null {
  if (!cacheFresh() || !caseGroupCache) return null;
  return caseGroupCache.groups;
}

/** Groups a student can be served: six items, one patient, and a real NGN step. */
export function peekCompleteCaseGroups(): Set<string> | null {
  if (!cacheFresh() || !caseGroupCache) return null;
  return caseGroupCache.servable;
}

export function rememberCaseGroupFacts(groups: Map<string, CaseGroupFacts>): void {
  const servable = new Set<string>();
  for (const [key, facts] of groups) {
    if (facts.members === 6 && facts.sharedPatient && facts.hasNgnItem) servable.add(key);
  }
  caseGroupCache = { at: Date.now(), groups, servable };
}

export function rememberCompleteCaseGroups(keys: Set<string>): void {
  const groups = new Map<string, CaseGroupFacts>();
  for (const key of keys) {
    groups.set(key, { members: 6, sharedPatient: true, hasNgnItem: true });
  }
  rememberCaseGroupFacts(groups);
}

/** Test hook. */
export function resetCompleteCaseGroupCache(): void {
  caseGroupCache = null;
}

type CaseGroupRow = {
  fieldId: string;
  itemType: string;
  gid: string | null;
  scenario: string | null;
  question: string;
  options: string;
  correctAnswer: string;
};

/** Load case-group facts. Safe to call before any student read. */
export async function warmCompleteCaseGroups(): Promise<Set<string>> {
  const cached = peekCompleteCaseGroups();
  if (cached && peekCaseGroupFacts()) return cached;
  const { sqlQuery } = await import("@/lib/db");
  const rows = (await sqlQuery(
    `
    SELECT "fieldId", "itemType", options::jsonb->>'caseGroupId' AS gid,
           scenario, question, options, "correctAnswer"
    FROM "QuestionBankItem"
    WHERE active = true
      AND "itemType" IN ('case_study', 'unfolding_case', 'case_based')
      AND left(btrim(options), 1) = '{'
      AND COALESCE(options::jsonb->>'caseGroupId', '') <> ''
    `,
    []
  )) as CaseGroupRow[];
  const facts = buildCaseGroupFacts(
    rows.map((row) => ({
      fieldId: row.fieldId,
      itemType: row.itemType,
      active: true,
      scenario: row.scenario,
      question: row.question,
      correctAnswer: row.correctAnswer,
      optionsRaw: row.options,
    }))
  );
  rememberCaseGroupFacts(facts);
  return peekCompleteCaseGroups() ?? new Set();
}

export function eligibilityInputFromBankItem(
  item: BankItem,
  extras?: { fieldId?: string | null; active?: boolean | null; qaPassed?: boolean | null; curationMeta?: unknown; optionsRaw?: string | null }
): StudentEligibilityInput {
  return {
    id: item.id,
    fieldId: extras?.fieldId ?? item.fieldId,
    active: extras?.active,
    qaPassed: extras?.qaPassed ?? item.qaPassed,
    itemType: item.itemType,
    question: item.question,
    scenario: item.scenario ?? item.vignette,
    correctAnswer: item.correctAnswer,
    explanation: item.explanation,
    options: item.options,
    optionsRaw: extras?.optionsRaw,
    ngnPayload: item.ngnPayload,
    curationMeta: extras?.curationMeta ?? item.curationMeta,
  };
}

const ineligibleIdCache = new Map<string, { at: number; ids: string[] }>();

/** Active qaPassed ids the structural rule suppresses. Restored rows are omitted. */
export async function ineligibleServedIds(fieldId: string): Promise<string[]> {
  const hit = ineligibleIdCache.get(fieldId);
  if (hit && Date.now() - hit.at < CASE_GROUP_CACHE_MS) return hit.ids;
  const { sqlQuery } = await import("@/lib/db");
  const { STUDENT_ELIGIBLE_SQL } = await import("@/lib/exam-prep/student-eligibility-sql");
  const stepGuard =
    fieldId === "usmle-step-2"
      ? `AND ("stepLevel" IS NULL OR "stepLevel" <> 'step3')`
      : "";
  const rows = (await sqlQuery(
    `
    SELECT id
    FROM "QuestionBankItem"
    WHERE "fieldId" = $1
      AND active = true
      AND "qaPassed" = true
      ${stepGuard}
      AND NOT ${STUDENT_ELIGIBLE_SQL}
    `,
    [fieldId]
  )) as Array<{ id: string }>;
  const ids = rows.map((row) => row.id);
  ineligibleIdCache.set(fieldId, { at: Date.now(), ids });
  return ids;
}

export function retainStudentEligibleBankItems(
  items: BankItem[],
  context?: StudentEligibilityContext
): BankItem[] {
  const ctx = context ?? {
    caseGroups: peekCaseGroupFacts() ?? undefined,
    completeCaseGroups: peekCompleteCaseGroups() ?? undefined,
  };
  return items.filter((item) => isStudentEligible(eligibilityInputFromBankItem(item), ctx));
}
