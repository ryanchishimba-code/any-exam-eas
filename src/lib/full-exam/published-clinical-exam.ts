/**
 * Published NCLEX clinical items live in ngn_item, not QuestionBankItem.
 * Full exams reserve a share of those rows and grade them with the clinical
 * scorer. Full credit is correct for the practice CAT; partial credit is a miss.
 */
import type { PublishedCatalog, PublishedUnit } from "@/lib/assessment/serve";
import { ngnQuestionKey } from "@/lib/assessment/serve";
import { gradeNgnResponse } from "@/lib/assessment/attempt-grade";
import type { NgnCase, NgnItem } from "@/lib/assessment/types";
import type { BankItem } from "@/lib/question-bank";
import { sequentialSetId } from "@/lib/exam-prep/sitting-clusters";

const RESPONSE_PREFIX = "clinical-response:";

export type PublishedClinicalCase = Pick<
  NgnCase,
  | "id"
  | "version"
  | "title"
  | "boardProfile"
  | "primaryClientNeed"
  | "setting"
  | "patient"
  | "timepoints"
  | "chart"
  | "revealRule"
  | "references"
>;

export type PublishedClinicalAttachment = {
  item: NgnItem;
  caseDoc: PublishedClinicalCase | null;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export function readPublishedClinical(payload: unknown): PublishedClinicalAttachment | null {
  const record = asRecord(payload);
  const clinical = asRecord(record?.publishedClinical);
  const item = clinical?.item;
  if (!item || typeof item !== "object") return null;
  const caseDoc = clinical?.caseDoc;
  return {
    item: item as NgnItem,
    caseDoc: caseDoc && typeof caseDoc === "object" ? (caseDoc as PublishedClinicalCase) : null,
  };
}

export function isPublishedClinicalBankItem(item: BankItem): boolean {
  return readPublishedClinical(item.ngnPayload) != null;
}

export function encodeClinicalResponse(response: unknown): string {
  return RESPONSE_PREFIX + JSON.stringify(response ?? null);
}

export function decodeClinicalResponse(selected: readonly string[]): unknown {
  const raw = selected.find((entry) => entry.startsWith(RESPONSE_PREFIX));
  if (!raw) return null;
  try {
    return JSON.parse(raw.slice(RESPONSE_PREFIX.length)) as unknown;
  } catch {
    return null;
  }
}

export function clinicalResponseIsCorrect(payload: unknown, selected: readonly string[]): boolean | null {
  const clinical = readPublishedClinical(payload);
  if (!clinical) return null;
  const response = decodeClinicalResponse(selected);
  if (response == null) return false;
  return gradeNgnResponse(clinical.item, response).correct;
}

function explanationFor(item: NgnItem): string {
  const short = item.rationale?.short?.trim() ?? "";
  const takeaway = item.rationale?.expanded?.takeaway?.trim() ?? "";
  const text = [short, takeaway].filter(Boolean).join(" ");
  return text.length >= 20
    ? text
    : "The keyed clinical judgment response matches the published rationale for this item.";
}

function caseAttachment(unit: Extract<PublishedUnit, { kind: "case" }>): PublishedClinicalCase {
  const doc = unit.caseDoc;
  return {
    id: doc.id,
    version: doc.version,
    title: doc.title,
    boardProfile: doc.boardProfile,
    primaryClientNeed: doc.primaryClientNeed,
    setting: doc.setting,
    patient: doc.patient,
    timepoints: doc.timepoints,
    chart: doc.chart,
    revealRule: doc.revealRule,
    references: doc.references,
  };
}

function toBankItem(item: NgnItem, caseDoc: PublishedClinicalCase | null, subjectId: string | null): BankItem {
  const setId = caseDoc ? `clinical:${caseDoc.id}` : undefined;
  return {
    id: ngnQuestionKey(item.id, item.version),
    subjectId: subjectId ?? undefined,
    question: item.stem,
    scenario: caseDoc?.setting,
    vignette: caseDoc?.setting,
    options: [],
    correctAnswer: "",
    explanation: explanationFor(item),
    itemType: "case_study",
    topicCategory: item.clientNeeds?.category,
    fieldId: "nursing",
    qualityScore: 1,
    ngnPayload: {
      kind: setId ? "sequential" : "published_clinical",
      ...(setId ? { setId, stepIndex: item.caseStep ?? 0 } : {}),
      publishedClinical: { item, caseDoc },
    },
  };
}

/** One bank row per published clinical item. Case steps share a sequential set. */
export function publishedCatalogToExamItems(catalog: PublishedCatalog): BankItem[] {
  const items: BankItem[] = [];
  for (const unit of catalog.cases) {
    const caseDoc = caseAttachment(unit);
    for (const item of unit.items) {
      items.push(toBankItem(item, caseDoc, unit.subjectId));
    }
  }
  for (const unit of catalog.standalones) {
    items.push(toBankItem(unit.item, null, unit.subjectId));
  }
  return items;
}

function stepIndex(item: BankItem): number {
  const step = item.ngnPayload?.stepIndex;
  return typeof step === "number" ? step : 0;
}

function seen(item: BankItem, seenIds: ReadonlySet<string> | undefined): boolean {
  const id = item.id?.trim();
  return Boolean(id && seenIds?.has(id));
}

function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  let state = seed >>> 0;
  const random = () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/**
 * Whole published cases first, then standalone bow-tie and trend items,
 * until `target` rows. A case that would overflow the target is skipped.
 */
export function reservePublishedClinicalItems(params: {
  items: readonly BankItem[];
  target: number;
  seenIds?: ReadonlySet<string>;
  seed?: number;
}): BankItem[] {
  const target = Math.max(0, params.target);
  if (target === 0 || params.items.length === 0) return [];
  const seed = params.seed ?? 1;
  const cases = new Map<string, BankItem[]>();
  const standalones: BankItem[] = [];
  for (const item of params.items) {
    const setId = sequentialSetId(item);
    if (setId) {
      const list = cases.get(setId) ?? [];
      list.push(item);
      cases.set(setId, list);
    } else {
      standalones.push(item);
    }
  }
  const blocks = [...cases.values()].map((members) =>
    [...members].sort((a, b) => stepIndex(a) - stepIndex(b))
  );
  const unseenBlock = (block: BankItem[]) => block.some((item) => !seen(item, params.seenIds));
  const orderedBlocks = [
    ...shuffleWithSeed(blocks.filter(unseenBlock), seed),
    ...shuffleWithSeed(
      blocks.filter((block) => !unseenBlock(block)),
      seed ^ 0x9e37
    ),
  ];
  const selected: BankItem[] = [];
  for (const block of orderedBlocks) {
    if (selected.length + block.length > target) continue;
    selected.push(...block);
  }
  const orderedStandalones = [
    ...shuffleWithSeed(
      standalones.filter((item) => !seen(item, params.seenIds)),
      seed ^ 0x85eb
    ),
    ...shuffleWithSeed(
      standalones.filter((item) => seen(item, params.seenIds)),
      seed ^ 0x27d4
    ),
  ];
  for (const item of orderedStandalones) {
    if (selected.length >= target) break;
    selected.push(item);
  }
  return selected;
}

