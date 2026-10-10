import {
  emptyFormatCounts,
  type FormatCounts,
} from "@/lib/inventory/question-format";
import { sortNgnItemsByCaseStep } from "@/lib/assessment/case-order";
import { orderByAttemptRecency, seededShuffle } from "@/lib/assessment/case-rotation";
import { ngnQuestionKey, parseNgnQuestionKey } from "@/lib/assessment/question-key";
import { openStudentRef, sealStudentRef } from "@/lib/assessment/student-item-ref";
import type { NgnCase, NgnItem, NgnReference } from "@/lib/assessment/types";

export { ngnQuestionKey, parseNgnQuestionKey } from "@/lib/assessment/question-key";

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const texts = value.filter((entry): entry is string => typeof entry === "string");
  return texts.length > 0 ? texts : undefined;
}

/** Choice the player renders. Answer ids stay off until the reveal. */
function studentOption(value: unknown): { id: string; text: string; selectable?: boolean } | null {
  if (!isRecord(value) || typeof value.text !== "string" || !value.text.trim()) return null;
  const option: { id: string; text: string; selectable?: boolean } = {
    id: typeof value.id === "string" && value.id.trim() ? value.id : value.text,
    text: value.text,
  };
  if (typeof value.selectable === "boolean") option.selectable = value.selectable;
  return option;
}

function studentOptions(value: unknown): { id: string; text: string; selectable?: boolean }[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const options = value.map(studentOption).filter((option) => option != null);
  return options.length > 0 ? options : undefined;
}

function studentChoiceBlock(value: unknown, includeAnswers: boolean): Record<string, unknown> | undefined {
  if (!isRecord(value)) return undefined;
  const out: Record<string, unknown> = {};
  const options = studentOptions(value.options);
  if (options) out.options = options;
  if (includeAnswers) {
    if (value.key !== undefined) out.key = value.key;
    if (value.keys !== undefined) out.keys = value.keys;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function studentColumns(value: unknown): unknown[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const columns = value.flatMap((entry) => {
    if (typeof entry === "string" && entry.trim()) return [entry];
    if (!isRecord(entry)) return [];
    const text = typeof entry.text === "string" ? entry.text : undefined;
    const label = typeof entry.label === "string" ? entry.label : text;
    const id = typeof entry.id === "string" && entry.id.trim() ? entry.id : label;
    if (!id || !label) return [];
    const column: Record<string, unknown> = { id, label };
    if (text && text !== label) column.text = text;
    return [column];
  });
  return columns.length > 0 ? columns : undefined;
}

function studentRows(value: unknown, includeAnswers: boolean): unknown[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const rows = value.flatMap((entry) => {
    if (typeof entry === "string") return [entry];
    if (Array.isArray(entry)) {
      const cells = entry.filter((cell): cell is string => typeof cell === "string");
      return cells.length > 0 ? [cells] : [];
    }
    if (!isRecord(entry)) return [];
    const row: Record<string, unknown> = {};
    if (typeof entry.id === "string") row.id = entry.id;
    if (typeof entry.text === "string") row.text = entry.text;
    if (typeof entry.label === "string") row.label = entry.label;
    if (includeAnswers) {
      if (entry.key !== undefined) row.key = entry.key;
      if (entry.keys !== undefined) row.keys = entry.keys;
    }
    return Object.keys(row).length > 0 ? [row] : [];
  });
  return rows.length > 0 ? rows : undefined;
}

function studentDropdowns(value: unknown, includeAnswers: boolean): Record<string, unknown>[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const dropdowns = value.flatMap((entry) => {
    if (!isRecord(entry) || typeof entry.id !== "string") return [];
    const dropdown: Record<string, unknown> = { id: entry.id };
    if (typeof entry.role === "string") dropdown.role = entry.role;
    const options = studentOptions(entry.options);
    if (options) dropdown.options = options;
    if (includeAnswers && entry.key !== undefined) dropdown.key = entry.key;
    return [dropdown];
  });
  return dropdowns.length > 0 ? dropdowns : undefined;
}

function studentTokens(value: unknown): Record<string, unknown>[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const tokens = value.flatMap((entry) => {
    if (typeof entry === "string") return [{ text: entry }];
    const option = studentOption(entry);
    if (!option) return [];
    const token: Record<string, unknown> = { id: option.id, text: option.text };
    if (option.selectable !== undefined) token.selectable = option.selectable;
    return [token];
  });
  return tokens.length > 0 ? tokens : undefined;
}

/**
 * Layout the case player and scorer read.
 * Reviewer notes, authoring, and any other payload key stay on the server.
 * Answer ids are included only after the student submits.
 */
function studentPayload(payload: unknown, includeAnswers: boolean): Record<string, unknown> {
  if (!isRecord(payload)) return {};
  const out: Record<string, unknown> = {};
  if (typeof payload.kind === "string") out.kind = payload.kind;
  if (typeof payload.n === "number") out.n = payload.n;
  if (typeof payload.template === "string") out.template = payload.template;
  if (typeof payload.rowHeader === "string") out.rowHeader = payload.rowHeader;
  if (typeof payload.text === "string") out.text = payload.text;
  const options = studentOptions(payload.options);
  if (options) out.options = options;
  const columns = studentColumns(payload.columns);
  if (columns) out.columns = columns;
  const rows = studentRows(payload.rows, includeAnswers);
  if (rows) out.rows = rows;
  const tokens = studentTokens(payload.tokens);
  if (tokens) out.tokens = tokens;
  const dropdowns = studentDropdowns(payload.dropdowns, includeAnswers);
  if (dropdowns) out.dropdowns = dropdowns;
  for (const name of ["condition", "actions", "monitor", "monitors"] as const) {
    const block = studentChoiceBlock(payload[name], includeAnswers);
    if (block) out[name] = block;
  }
  if (includeAnswers) {
    if (payload.key !== undefined) out.key = payload.key;
    if (payload.keys !== undefined) out.keys = payload.keys;
  }
  return out;
}

function studentExhibit(exhibit: unknown): Record<string, unknown> | undefined {
  if (!isRecord(exhibit)) return undefined;
  const out: Record<string, unknown> = {};
  for (const key of ["title", "text", "note"] as const) {
    if (typeof exhibit[key] === "string") out[key] = exhibit[key];
  }
  const columns = stringList(exhibit.columns);
  if (columns) out.columns = columns;
  if (Array.isArray(exhibit.rows)) {
    const rows = exhibit.rows.flatMap((row) => {
      if (!Array.isArray(row)) return [];
      return [row.filter((cell): cell is string => typeof cell === "string")];
    });
    if (rows.length > 0) out.rows = rows;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function studentReferences(value: unknown): NgnReference[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!isRecord(entry) || typeof entry.src !== "string" || !entry.src.trim()) return [];
    const ref: NgnReference = { src: entry.src };
    if (typeof entry.locator === "string" && entry.locator.trim()) ref.locator = entry.locator;
    return [ref];
  });
}

function studentRationale(rationale: ServeItem["rationale"]): ServeItem["rationale"] {
  const expanded = isRecord(rationale?.expanded) ? rationale.expanded : {};
  const perOption: ServeItem["rationale"]["expanded"]["perOption"] = {};
  const rawPerOption = isRecord(expanded.perOption) ? expanded.perOption : {};
  for (const [id, entry] of Object.entries(rawPerOption)) {
    if (!isRecord(entry) || typeof entry.text !== "string") continue;
    const verdict = entry.verdict;
    const cleanVerdict =
      typeof verdict === "string"
        ? verdict
        : Array.isArray(verdict) && verdict.every((part) => typeof part === "string")
          ? verdict
          : null;
    if (!cleanVerdict) continue;
    perOption[id] = { verdict: cleanVerdict, text: entry.text };
  }
  return {
    short: typeof rationale?.short === "string" ? rationale.short : "",
    expanded: {
      perOption,
      cjmmCoaching: typeof expanded.cjmmCoaching === "string" ? expanded.cjmmCoaching : "",
      pointsLost: typeof expanded.pointsLost === "string" ? expanded.pointsLost : "",
      takeaway: typeof expanded.takeaway === "string" ? expanded.takeaway : "",
    },
  };
}

function studentChart(chart: PublishedCaseUnit["caseDoc"]["chart"]): PublishedCaseUnit["caseDoc"]["chart"] {
  const tabs = Array.isArray(chart?.tabs) ? chart.tabs : [];
  return {
    tabs: tabs.flatMap((tab) => {
      if (!isRecord(tab) || typeof tab.id !== "string" || typeof tab.label !== "string") return [];
      const next: PublishedCaseUnit["caseDoc"]["chart"]["tabs"][number] = { id: tab.id, label: tab.label };
      if (Array.isArray(tab.entries)) {
        const entries = tab.entries.flatMap((entry) => {
          if (!isRecord(entry)) return [];
          return [{
            time: typeof entry.time === "string" ? entry.time : "",
            text: typeof entry.text === "string" ? entry.text : "",
          }];
        });
        if (entries.length > 0) next.entries = entries;
      }
      const columns = stringList(tab.columns);
      if (columns) next.columns = columns;
      if (Array.isArray(tab.rows)) {
        const rows = tab.rows.flatMap((row) =>
          Array.isArray(row) ? [row.filter((cell): cell is string => typeof cell === "string")] : []
        );
        if (rows.length > 0) next.rows = rows;
      }
      const rowTimepoints = stringList(tab.rowTimepoints);
      if (rowTimepoints) next.rowTimepoints = rowTimepoints;
      const columnTimepoints = stringList(tab.columnTimepoints);
      if (columnTimepoints) next.columnTimepoints = columnTimepoints;
      return [next];
    }),
  };
}

function studentPatient(patient: PublishedCaseUnit["caseDoc"]["patient"]): PublishedCaseUnit["caseDoc"]["patient"] {
  const source = isRecord(patient) ? patient : {};
  const next: PublishedCaseUnit["caseDoc"]["patient"] = {
    displayName: typeof source.displayName === "string" ? source.displayName : "",
    age: typeof source.age === "number" ? source.age : 0,
    sex: typeof source.sex === "string" ? source.sex : "",
    weightKg: typeof source.weightKg === "number" ? source.weightKg : 0,
    allergies: typeof source.allergies === "string" ? source.allergies : "",
  };
  if (typeof source.history === "string" && source.history.trim()) next.history = source.history;
  return next;
}

/**
 * Fields the practice player reads before submit.
 * Reviewer notes (`rnFlags` and the other authoring fields) are not in this list.
 */
function studentItemRecord(item: ServeItem, opaqueId: string, includeAnswers: boolean): ServeItem {
  const next: Record<string, unknown> = {
    id: opaqueId,
    version: item.version,
    itemType: item.itemType,
    caseStep: item.caseStep,
    timepoint: item.timepoint,
    responseFormat: item.responseFormat,
    scoringRule: item.scoringRule,
    maxPoints: item.maxPoints,
    stem: item.stem,
    payload: studentPayload(item.payload, includeAnswers),
    references: studentReferences(item.references),
  };
  const exhibit = studentExhibit(item.exhibit);
  if (exhibit) next.exhibit = exhibit;
  if (includeAnswers) next.rationale = studentRationale(item.rationale);
  return next as ServeItem;
}

/**
 * Options, stem, and the numeric case step stay.
 * Slot ids, batch ids, step names, reviewer notes, and the answer key stay on the server.
 * Rationale is omitted until the item is scored.
 */
export function studentFacingItem(item: ServeItem, opaqueId = sealStudentRef({ id: item.id, version: item.version })): ServeItem {
  return studentItemRecord(item, opaqueId, false);
}

/** Scored item for review. The id stays the opaque session id the browser already has. */
export function studentRevealedItem(item: ServeItem, opaqueId: string): ServeItem {
  return studentItemRecord(item, opaqueId, true);
}

function studentFacingCaseDoc(
  caseDoc: PublishedCaseUnit["caseDoc"],
  items: ServeItem[]
): PublishedCaseUnit["caseDoc"] {
  return {
    id: sealStudentRef({ id: caseDoc.id, version: caseDoc.version }),
    version: caseDoc.version,
    setting: typeof caseDoc.setting === "string" ? caseDoc.setting : "",
    patient: studentPatient(caseDoc.patient),
    timepoints: (Array.isArray(caseDoc.timepoints) ? caseDoc.timepoints : []).flatMap((timepoint) => {
      if (!isRecord(timepoint) || typeof timepoint.id !== "string") return [];
      return [{ id: timepoint.id, label: typeof timepoint.label === "string" ? timepoint.label : timepoint.id }];
    }),
    chart: studentChart(caseDoc.chart),
    references: studentReferences(caseDoc.references),
    items,
  } as PublishedCaseUnit["caseDoc"];
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
      const refs = studentReferences(caseReferences[from] ?? unit.caseDoc.references);
      if (refs.length > 0) nextRefs[to] = refs;
    }
    return student;
  });
  return { units: faced, caseReferences: nextRefs };
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
