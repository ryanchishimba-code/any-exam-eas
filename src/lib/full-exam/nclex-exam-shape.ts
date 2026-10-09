/**
 * NCLEX exam-mode order: 3 unfolding cases inside the first 85 items,
 * one case in each third, and bow-tie or trend items only after item 85.
 * Steps inside a case stay in order. Scoring is unchanged.
 */
import { orderByAttemptRecency } from "@/lib/assessment/case-rotation";
import type { BankItem } from "@/lib/question-bank";
import { sequentialSetId } from "@/lib/exam-prep/sitting-clusters";
import { completeSequentialGroups } from "@/lib/full-exam/ngn-format-mix";

export const NCLEX_MINIMUM_ITEMS = 85;
export const NCLEX_CASE_COUNT = 3;
export const NCLEX_CASE_LENGTH = 6;
/** Each item after item 85 has this chance of being a bow-tie or trend. */
export const CJ_STANDALONE_CHANCE = 0.1;

export type NclexShapeRole = "case" | "knowledge" | "bow_tie" | "trend";

export type NclexShapeItem = {
  id: string;
  role: NclexShapeRole;
  setId?: string;
  step?: number;
};

export type NclexThird = { start: number; end: number };

/** First, middle, and final thirds of the minimum-length exam. Ends are exclusive. */
export function nclexMinimumThirds(minimum = NCLEX_MINIMUM_ITEMS): NclexThird[] {
  const base = Math.floor(minimum / 3);
  const remainder = minimum - base * 3;
  const sizes = [base, base, base + remainder];
  let cursor = 0;
  return sizes.map((size) => {
    const span = { start: cursor, end: cursor + size };
    cursor += size;
    return span;
  });
}

/** Starts where a 6-item case fits inside the third and ends before item 86. */
export function caseStartsInThird(
  third: NclexThird,
  caseLength = NCLEX_CASE_LENGTH,
  hardEnd = NCLEX_MINIMUM_ITEMS
): number[] {
  const last = Math.min(third.end, hardEnd);
  const starts: number[] = [];
  for (let start = third.start; start + caseLength <= last; start += 1) starts.push(start);
  return starts;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWith<T>(items: readonly T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const swap = out[i]!;
    out[i] = out[j]!;
    out[j] = swap;
  }
  return out;
}

/**
 * Place cases, then knowledge, then clinical-judgment standalones.
 * Returns null when the pools cannot fill `length` without putting a
 * bow-tie or trend before item 86.
 */
export function arrangeNclexExamItems(input: {
  cases: NclexShapeItem[][];
  knowledge: readonly NclexShapeItem[];
  bowTies: readonly NclexShapeItem[];
  trends: readonly NclexShapeItem[];
  length: number;
  seed: number;
}): NclexShapeItem[] | null {
  const length = input.length;
  if (length < NCLEX_MINIMUM_ITEMS) return null;
  const cases = input.cases.filter((group) => group.length === NCLEX_CASE_LENGTH).slice(0, NCLEX_CASE_COUNT);
  if (cases.length !== NCLEX_CASE_COUNT) return null;

  const random = mulberry32(input.seed);
  const slots: Array<NclexShapeItem | undefined> = new Array(length);
  const thirds = nclexMinimumThirds();
  cases.forEach((group, index) => {
    const starts = caseStartsInThird(thirds[index]!);
    if (starts.length === 0) return;
    const start = starts[Math.floor(random() * starts.length)]!;
    group.forEach((item, step) => {
      slots[start + step] = item;
    });
  });
  if (slots.slice(0, NCLEX_MINIMUM_ITEMS).filter((item) => item?.role === "case").length !== NCLEX_CASE_COUNT * NCLEX_CASE_LENGTH) {
    return null;
  }

  const knowledge = shuffleWith(
    input.knowledge.filter((item) => item.role === "knowledge"),
    random
  );
  const clinical = shuffleWith(
    [...input.bowTies, ...input.trends].filter((item) => item.role === "bow_tie" || item.role === "trend"),
    random
  );
  let knowledgeIndex = 0;
  let clinicalIndex = 0;
  const takeKnowledge = () => {
    const item = knowledge[knowledgeIndex];
    if (!item) return null;
    knowledgeIndex += 1;
    return item;
  };
  const takeClinical = () => {
    const item = clinical[clinicalIndex];
    if (!item) return null;
    clinicalIndex += 1;
    return item;
  };

  for (let index = 0; index < NCLEX_MINIMUM_ITEMS; index += 1) {
    if (slots[index]) continue;
    const item = takeKnowledge();
    if (!item) return null;
    slots[index] = item;
  }
  for (let index = NCLEX_MINIMUM_ITEMS; index < length; index += 1) {
    const wantClinical = random() < CJ_STANDALONE_CHANCE && clinicalIndex < clinical.length;
    const item = wantClinical ? takeClinical() : (takeKnowledge() ?? takeClinical());
    if (!item) return null;
    slots[index] = item;
  }
  if (slots.some((item) => !item)) return null;
  return slots as NclexShapeItem[];
}

/**
 * Bow-tie and trend standalones belong at item 86 or later.
 * Case steps stay where they are. Counts are unchanged: an early standalone
 * swaps with a knowledge item from the variable section.
 */
export function deferClinicalStandalones(items: readonly BankItem[]): BankItem[] {
  const out = items.slice();
  const early: number[] = [];
  const lateKnowledge: number[] = [];
  out.forEach((item, index) => {
    const role = nclexShapeRole(item);
    if (index < NCLEX_MINIMUM_ITEMS && (role === "bow_tie" || role === "trend")) early.push(index);
    else if (index >= NCLEX_MINIMUM_ITEMS && role === "knowledge") lateKnowledge.push(index);
  });
  const swaps = Math.min(early.length, lateKnowledge.length);
  for (let index = 0; index < swaps; index += 1) {
    const from = early[index]!;
    const to = lateKnowledge[index]!;
    const swap = out[from]!;
    out[from] = out[to]!;
    out[to] = swap;
  }
  return out;
}

/** Prefer cases the student has not seen, then the least recent. */
export function chooseExamCases<T>(
  groups: readonly T[],
  idOf: (group: T) => string,
  lastAttemptedAt: ReadonlyMap<string, number | null> | null | undefined,
  seed: string
): T[] {
  return orderByAttemptRecency(groups, idOf, lastAttemptedAt, seed).slice(0, NCLEX_CASE_COUNT);
}

function payloadRecord(item: BankItem): Record<string, unknown> {
  return item.ngnPayload && typeof item.ngnPayload === "object"
    ? (item.ngnPayload as Record<string, unknown>)
    : {};
}

export function nclexShapeRole(item: BankItem): NclexShapeRole {
  if (sequentialSetId(item)) return "case";
  const type = (item.itemType ?? "").trim().toLowerCase();
  const payload = payloadRecord(item);
  const clinical = String(payload.clinicalItemType ?? "").trim().toLowerCase();
  const kind = String(payload.kind ?? "").trim().toLowerCase();
  if (
    type === "ngn_bowtie" ||
    type === "bow_tie" ||
    type === "bowtie" ||
    kind === "bow_tie" ||
    kind === "bowtie" ||
    clinical === "bowtie" ||
    clinical === "bow_tie"
  ) {
    return "bow_tie";
  }
  if (type === "trend" || kind === "trend" || clinical === "trend") return "trend";
  return "knowledge";
}

/** Live ngn_case rows converted for the exam. Bank-only sequential groups are not these. */
export function isLivePublishedCaseItem(item: BankItem): boolean {
  const id = item.id?.trim() ?? "";
  if (id.startsWith("ngn:")) return true;
  return (item.tags ?? []).includes("published-ngn-catalog");
}

function stepOf(item: BankItem): number | undefined {
  const step = payloadRecord(item).stepIndex;
  return typeof step === "number" && Number.isFinite(step) ? step : undefined;
}

function toShape(item: BankItem, role: NclexShapeRole): NclexShapeItem {
  const setId = sequentialSetId(item) ?? undefined;
  return {
    id: item.id ?? "",
    role: role === "case" ? "case" : role,
    ...(setId ? { setId } : {}),
    ...(role === "case" && stepOf(item) != null ? { step: stepOf(item) } : {}),
  };
}

/**
 * Rebuild a nursing sitting of at least 85 items.
 * Cases come from live published ngn_case rows when three complete
 * six-step cases are in the pool. Unseen cases come first. Knowledge and
 * clinical-judgment standalones prefer the already capped selection.
 */
export function shapeNclexBankSitting(input: {
  pool: readonly BankItem[];
  preferred?: readonly BankItem[];
  limit: number;
  seed: number;
  caseLastAttemptedAt?: ReadonlyMap<string, number | null> | null;
}): BankItem[] | null {
  if (input.limit < NCLEX_MINIMUM_ITEMS) return null;
  const byId = new Map<string, BankItem>();
  for (const item of [...input.pool, ...(input.preferred ?? [])]) {
    const id = item.id?.trim();
    if (id) byId.set(id, item);
  }
  const groups = completeSequentialGroups([...byId.values()]).filter((group) => group.length === NCLEX_CASE_LENGTH);
  const published = groups.filter((group) => group.every(isLivePublishedCaseItem));
  const casePool = published.length >= NCLEX_CASE_COUNT ? published : groups;
  const chosen = chooseExamCases(
    casePool,
    (group) => sequentialSetId(group[0]!) ?? "",
    input.caseLastAttemptedAt,
    String(input.seed)
  );
  if (chosen.length < NCLEX_CASE_COUNT) return null;
  const caseIds = new Set(chosen.flat().map((item) => item.id ?? ""));

  const preferred = input.preferred ?? [];
  const preferredIds = new Set(preferred.map((item) => item.id ?? "").filter(Boolean));
  const knowledgeOf = (items: readonly BankItem[]) =>
    items.filter((item) => {
      const id = item.id ?? "";
      return id && !caseIds.has(id) && nclexShapeRole(item) === "knowledge";
    });
  const clinicalOf = (items: readonly BankItem[], role: "bow_tie" | "trend") =>
    items.filter((item) => {
      const id = item.id ?? "";
      return id && !caseIds.has(id) && !sequentialSetId(item) && nclexShapeRole(item) === role;
    });
  const rest = [...byId.values()].filter((item) => !preferredIds.has(item.id ?? ""));
  const arranged = arrangeNclexExamItems({
    cases: chosen.map((group) => group.map((item) => toShape(item, "case"))),
    knowledge: [...knowledgeOf(preferred), ...knowledgeOf(rest)].map((item) => toShape(item, "knowledge")),
    bowTies: [...clinicalOf(preferred, "bow_tie"), ...clinicalOf(rest, "bow_tie")].map((item) => toShape(item, "bow_tie")),
    trends: [...clinicalOf(preferred, "trend"), ...clinicalOf(rest, "trend")].map((item) => toShape(item, "trend")),
    length: input.limit,
    seed: input.seed,
  });
  if (!arranged || arranged.length !== input.limit) return null;
  const rows: BankItem[] = [];
  for (const slot of arranged) {
    const item = byId.get(slot.id);
    if (!item) return null;
    rows.push(item);
  }
  return rows;
}
