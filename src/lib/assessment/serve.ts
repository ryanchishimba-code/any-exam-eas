import {
  emptyFormatCounts,
  type FormatCounts,
} from "@/lib/inventory/question-format";
import { sortNgnItemsByCaseStep } from "@/lib/assessment/case-order";
import { orderByAttemptRecency, seededShuffle } from "@/lib/assessment/case-rotation";
import { openStudentRef, sealStudentRef } from "@/lib/assessment/student-item-ref";
import type { NgnCase, NgnItem, NgnReference } from "@/lib/assessment/types";

export type ServeItem = NgnItem & {
  status: string;
  batchId: string;
  caseVersion: number | null;
};

export type ServeCase = Omit<NgnCase, "items"> & {
  status: string;
  batchId: string;
};

export type PublishedCaseUnit = {
  kind: "case";
  caseDoc: ServeCase & { items: ServeItem[] };
  items: ServeItem[];
  subjectId: string | null;
  /**
   * Topics that should offer and serve this case.
   * Includes the client-need subject and blueprint siblings (for example
   * Medical-Surgical Nursing shares Physiological Adaptation cases).
   */
  practiceSubjectIds?: string[];
};

export type PublishedStandaloneUnit = {
  kind: "standalone";
  item: ServeItem;
  subjectId: string | null;
};

export type PublishedUnit = PublishedCaseUnit | PublishedStandaloneUnit;

export type PublishedCatalog = {
  standalones: PublishedStandaloneUnit[];
  cases: PublishedCaseUnit[];
};

const STANDALONE_TYPES = new Set(["bowtie", "trend"]);

function latestById<T extends { id: string; version: number }>(rows: readonly T[]): T[] {
  const best = new Map<string, T>();
  for (const row of rows) {
    const current = best.get(row.id);
    if (!current || row.version > current.version) best.set(row.id, row);
  }
  return [...best.values()];
}

function highestPublished<T extends { id: string; version: number; status: string }>(
  rows: readonly T[]
): T | null {
  let best: T | null = null;
  for (const row of rows) {
    if (row.status !== "published") continue;
    if (!best || row.version > best.version) best = row;
  }
  return best;
}

function caseKey(caseId: string, caseVersion: number): string {
  return `${caseId}:${caseVersion}`;
}

/**
 * Students receive published rows only.
 * A case is included only when that case version is published and every item
 * that belongs to it is published. One draft step keeps the whole case out.
 * Standalone bow-tie and trend items are individual units.
 */
export function selectPublishedCatalog(input: {
  items: readonly ServeItem[];
  cases: readonly ServeCase[];
  subjects?: readonly { id: string; label: string }[];
  fieldId?: string;
}): PublishedCatalog {
  const subjects = input.subjects ?? [];
  const itemsById = new Map<string, ServeItem[]>();
  for (const item of input.items) {
    const list = itemsById.get(item.id) ?? [];
    list.push(item);
    itemsById.set(item.id, list);
  }
  const casesById = new Map<string, ServeCase[]>();
  for (const caseRow of input.cases) {
    const list = casesById.get(caseRow.id) ?? [];
    list.push(caseRow);
    casesById.set(caseRow.id, list);
  }

  const standalones: PublishedStandaloneUnit[] = [];
  for (const versions of itemsById.values()) {
    const published = highestPublished(versions);
    if (!published || published.caseId) continue;
    if (!STANDALONE_TYPES.has(published.itemType)) continue;
    standalones.push({
      kind: "standalone",
      item: published,
      subjectId: subjectIdForClientNeed(published.clientNeeds?.subcategory, subjects),
    });
  }
  standalones.sort((a, b) => a.item.id.localeCompare(b.item.id));

  const cases: PublishedCaseUnit[] = [];
  for (const versions of casesById.values()) {
    const publishedCase = highestPublished(versions);
    if (!publishedCase) continue;
    const key = caseKey(publishedCase.id, publishedCase.version);
    const membersById = new Map<string, ServeItem[]>();
    for (const item of input.items) {
      if (!item.caseId || item.caseVersion == null) continue;
      if (caseKey(item.caseId, item.caseVersion) !== key) continue;
      const list = membersById.get(item.id) ?? [];
      list.push(item);
      membersById.set(item.id, list);
    }
    if (membersById.size === 0) continue;
    const members: ServeItem[] = [];
    let blocked = false;
    for (const memberVersions of membersById.values()) {
      const latest = latestById(memberVersions)[0];
      if (!latest || latest.status !== "published") {
        blocked = true;
        break;
      }
      members.push(latest);
    }
    if (blocked) continue;
    const ordered = sortNgnItemsByCaseStep(members);
    const subjectId = subjectIdForClientNeed(publishedCase.primaryClientNeed, subjects);
    cases.push({
      kind: "case",
      caseDoc: { ...publishedCase, items: ordered },
      items: ordered,
      subjectId,
      practiceSubjectIds: practiceSubjectIdsFor(subjectId, input.fieldId ?? "nursing"),
    });
  }
  cases.sort((a, b) => a.caseDoc.id.localeCompare(b.caseDoc.id));
  return { standalones, cases };
}

export function publishedFormatCounts(catalog: PublishedCatalog): { ngn: number; case: number } {
  return { ngn: catalog.standalones.length, case: catalog.cases.length };
}

const FILLER = new Set(["and", "of", "the", "a"]);

function tokens(value: string | null | undefined): string[] {
  return (value ?? "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .split(/[^a-z0-9]+/)
    .filter((token) => token && !FILLER.has(token));
}

/** Match a client-need label to a practice subject. Unknown labels stay unscoped. */
export function subjectIdForClientNeed(
  label: string | null | undefined,
  subjects: readonly { id: string; label: string }[]
): string | null {
  const wanted = tokens(label);
  if (wanted.length === 0 || subjects.length === 0) return null;
  let best: { id: string; score: number } | null = null;
  for (const subject of subjects) {
    const subjectTokens = tokens(`${subject.label} ${subject.id}`);
    if (subjectTokens.length === 0) continue;
    const overlap = subjectTokens.filter((token) => wanted.includes(token)).length;
    if (overlap === 0 || overlap < Math.min(2, subjectTokens.length)) continue;
    if (!best || overlap > best.score) best = { id: subject.id, score: overlap };
  }
  return best?.id ?? null;
}

/**
 * Nursing topic ids that share one client-need category.
 * Kept here so the case player does not import the blueprint module.
 * Medical-Surgical Nursing shares Physiological Adaptation cases.
 */
const NURSING_PRACTICE_SUBJECT_GROUPS: readonly (readonly string[])[] = [
  ["management-of-care"],
  ["safety-infection"],
  ["health-promotion"],
  ["psychosocial"],
  ["basic-care-comfort", "basic-care"],
  ["pharmacology-nursing", "pharmacology"],
  ["reduction-risk", "risk-reduction"],
  ["physiological-adaptation", "med-surg"],
];

export function practiceSubjectIdsFor(subjectId: string | null, fieldId = "nursing"): string[] {
  if (!subjectId) return [];
  if (fieldId !== "nursing") return [subjectId];
  const group = NURSING_PRACTICE_SUBJECT_GROUPS.find((ids) => ids.includes(subjectId));
  return group ? [...new Set([subjectId, ...group])] : [subjectId];
}

export function casePracticeSubjectIds(unit: PublishedCaseUnit): readonly string[] {
  if (unit.practiceSubjectIds && unit.practiceSubjectIds.length > 0) return unit.practiceSubjectIds;
  return unit.subjectId ? [unit.subjectId] : [];
}

export type ClinicalFormatAddition = {
  ngn: number;
  case: number;
  topics: Record<string, { ngn: number; case: number }>;
};

export function clinicalFormatAddition(
  catalog: PublishedCatalog
): ClinicalFormatAddition {
  const topics: Record<string, { ngn: number; case: number }> = {};
  const add = (subjectId: string | null, bucket: "ngn" | "case") => {
    if (!subjectId) return;
    const row = topics[subjectId] ?? { ngn: 0, case: 0 };
    row[bucket] += 1;
    topics[subjectId] = row;
  };
  for (const unit of catalog.standalones) add(unit.subjectId, "ngn");
  for (const unit of catalog.cases) {
    const ids = casePracticeSubjectIds(unit);
    if (ids.length === 0) continue;
    for (const id of ids) add(id, "case");
  }
  const counts = publishedFormatCounts(catalog);
  return { ...counts, topics };
}

export function mergeClinicalFormatCounts(
  formats: FormatCounts,
  topicFormats: Record<string, FormatCounts> | null | undefined,
  addition: ClinicalFormatAddition
): { formats: FormatCounts; topicFormats: Record<string, FormatCounts> } {
  const next: FormatCounts = {
    mcq: formats.mcq,
    ngn: formats.ngn + addition.ngn,
    case: formats.case + addition.case,
  };
  const topics: Record<string, FormatCounts> = {};
  for (const [id, counts] of Object.entries(topicFormats ?? {})) {
    topics[id] = { ...counts };
  }
  for (const [id, counts] of Object.entries(addition.topics)) {
    const current = topics[id] ?? emptyFormatCounts();
    topics[id] = {
      mcq: current.mcq,
      ngn: current.ngn + counts.ngn,
      case: current.case + counts.case,
    };
  }
  return { formats: next, topicFormats: topics };
}

export function unitsForFormat(
  catalog: PublishedCatalog,
  format: "ngn" | "case",
  subjectId: string | null | undefined
): PublishedUnit[] {
  const mixed = !subjectId || subjectId === "__mixed__";
  if (format === "ngn") {
    return catalog.standalones.filter((unit) => mixed || unit.subjectId === subjectId);
  }
  return catalog.cases.filter(
    (unit) => mixed || casePracticeSubjectIds(unit).includes(subjectId ?? "")
  );
}

/**
 * Whole cases or individual standalones. Never a subset of a case's steps.
 * Cases the student has not attempted come first, then the least recent.
 * Cases with the same attempt time are shuffled. Steps stay in case_step order.
 */
export function takeSessionUnits(params: {
  catalog: PublishedCatalog;
  format: "ngn" | "case";
  subjectId?: string | null;
  limit: number;
  seed: string;
  /** Case id -> last attempt time in ms. Missing or null means not attempted. */
  caseLastAttemptedAt?: ReadonlyMap<string, number | null> | null;
}): PublishedUnit[] {
  const pool = unitsForFormat(params.catalog, params.format, params.subjectId);
  const limit = Math.max(0, Math.floor(params.limit));
  if (limit === 0 || pool.length === 0) return [];
  const ordered =
    params.format === "case"
      ? orderByAttemptRecency(
          pool,
          (unit) => (unit.kind === "case" ? unit.caseDoc.id : ""),
          params.caseLastAttemptedAt,
          params.seed
        )
      : seededShuffle(pool, params.seed);
  return ordered.slice(0, Math.min(limit, ordered.length));
}

export function scoredItemCount(units: readonly PublishedUnit[]): number {
  return units.reduce((sum, unit) => sum + (unit.kind === "case" ? unit.items.length : 1), 0);
}

const SECRET_KEYS = new Set(["key", "keys"]);

export function stripAnswerKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((entry) => stripAnswerKeys(entry));
  if (!value || typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (SECRET_KEYS.has(key)) continue;
    out[key] = stripAnswerKeys(entry);
  }
  return out;
}

function omitStudentItemFields(item: ServeItem): ServeItem {
  const next = { ...item };
  delete (next as { batchId?: string }).batchId;
  delete (next as { cjmmFunction?: ServeItem["cjmmFunction"] }).cjmmFunction;
  delete (next as { caseId?: string | null }).caseId;
  delete (next as { rationale?: ServeItem["rationale"] }).rationale;
  return next;
}

/**
 * Options, stem, and the numeric case step stay.
 * Slot ids, batch ids, step names, and the answer key stay on the server.
 * Rationale is omitted until the item is scored.
 */
export function studentFacingItem(item: ServeItem, opaqueId = sealStudentRef({ id: item.id, version: item.version })): ServeItem {
  return omitStudentItemFields({
    ...item,
    id: opaqueId,
    payload: (stripAnswerKeys(item.payload) ?? {}) as Record<string, unknown>,
  });
}

/** Scored item for review. The id stays the opaque session id the browser already has. */
export function studentRevealedItem(item: ServeItem, opaqueId: string): ServeItem {
  const next = omitStudentItemFields({
    ...item,
    id: opaqueId,
  });
  next.rationale = item.rationale;
  return next;
}

function studentFacingCaseDoc(
  caseDoc: PublishedCaseUnit["caseDoc"],
  items: ServeItem[]
): PublishedCaseUnit["caseDoc"] {
  const next = {
    ...caseDoc,
    id: sealStudentRef({ id: caseDoc.id, version: caseDoc.version }),
    items,
  };
  delete (next as { title?: string }).title;
  delete (next as { batchId?: string }).batchId;
  delete (next as { itemIds?: string[] }).itemIds;
  return next;
}

export function studentFacingUnit(unit: PublishedUnit): PublishedUnit {
  if (unit.kind === "standalone") {
    return { ...unit, item: studentFacingItem(unit.item) };
  }
  const items = sortNgnItemsByCaseStep(unit.items).map((item) => studentFacingItem(item));
  return {
    ...unit,
    items,
    caseDoc: studentFacingCaseDoc(unit.caseDoc, items),
  };
}

/** Student units plus case-reference keys that match the opaque case ids. */
export function presentClinicalUnits(
  units: readonly PublishedUnit[],
  caseReferences: Record<string, NgnReference[]> = {}
): { units: PublishedUnit[]; caseReferences: Record<string, NgnReference[]> } {
  const nextRefs: Record<string, NgnReference[]> = {};
  const faced = units.map((unit) => {
    const student = studentFacingUnit(unit);
    if (unit.kind === "case" && student.kind === "case") {
      const from = `${unit.caseDoc.id}:${unit.caseDoc.version}`;
      const to = `${student.caseDoc.id}:${student.caseDoc.version}`;
      const refs = caseReferences[from] ?? unit.caseDoc.references;
      if (refs.length > 0) nextRefs[to] = refs;
    }
    return student;
  });
  return { units: faced, caseReferences: nextRefs };
}

export function ngnQuestionKey(id: string, version: number): string {
  return `ngn:${id}:v${version}`;
}

export function parseNgnQuestionKey(key: string): { id: string; version: number } | null {
  const match = /^ngn:([^:]+):v(\d+)$/.exec(key.trim());
  if (!match) return null;
  const version = Number(match[2]);
  if (!Number.isInteger(version) || version < 1) return null;
  return { id: match[1]!, version };
}

/** Session drafts carry opaque ids. Stored attempts use the catalog slot id. */
export function canonicalStoredQuestionKey(key: string): string {
  const parsed = parseNgnQuestionKey(key);
  if (!parsed) return key;
  const real = openStudentRef(parsed.id);
  if (!real) return key;
  return ngnQuestionKey(real.id, real.version);
}

export function servedItemKeys(catalog: PublishedCatalog): string[] {
  const keys: string[] = [];
  for (const unit of catalog.standalones) {
    keys.push(ngnQuestionKey(unit.item.id, unit.item.version));
  }
  for (const unit of catalog.cases) {
    for (const item of unit.items) keys.push(ngnQuestionKey(item.id, item.version));
  }
  return keys;
}
