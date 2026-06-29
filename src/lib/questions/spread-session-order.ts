import type { BankItem } from "@/lib/question-bank";
import { bankItemDedupeKey, shuffleBankItems } from "@/lib/question-bank-db";
import {
  clinicalCaseKey,
  normalizeClinicalCaseText,
  resolveClinicalVignetteText,
} from "@/lib/exam-prep/clinical-case-dedupe";
import {
  hasWindowSimilarOptions,
  optionsFromBankItem,
  optionsFromRawInput,
  optionsFromStudyQuestion,
} from "./session-quality";
import type { RawQuestionInput, StudyQuestion } from "./types";
import { buildQuestionBlocks } from "./sequential-sets";

/** @deprecated Variability window removed — kept for legacy tests and generation utilities. */
export const SESSION_SPREAD_WINDOW = 7;

/** Above this count, dedupe by bank row id — not clinical vignette — so templated banks can fill. */
export const LONG_SESSION_CLINICAL_DEDUPE_MAX = 100;

export type SessionDedupeMode = "clinical" | "id";

function rawInputToBankItem(item: RawQuestionInput): BankItem {
  return {
    id: item.bankItemId,
    subjectId: item.subjectId ?? "general",
    question: item.question,
    vignette: item.vignette,
    scenario: item.vignette,
    options: item.options ?? [],
    correctAnswer: item.correctAnswer,
    explanation: item.explanation ?? "",
    tags: item.tags,
    topicCategory: item.topicCategory,
    blueprintDomain: item.field,
    ngnPayload: item.ngnPayload,
  };
}

function rawInputDedupeKey(item: RawQuestionInput): string {
  const caseKey = clinicalCaseKey(rawInputToBankItem(item));
  if (!caseKey.includes(":id:")) return caseKey;
  if (item.bankItemId) return item.bankItemId;
  const v = item.vignette?.trim() ?? "";
  const s = item.question.trim();
  const text = v ? `${v}|${s}` : s;
  return `${item.subjectId ?? ""}:${normalizeClinicalCaseText(text).slice(0, 120)}`;
}

function dedupeRawInputsInOrder(items: RawQuestionInput[]): RawQuestionInput[] {
  const seen = new Set<string>();
  const out: RawQuestionInput[] = [];
  for (const item of items) {
    const key = rawInputDedupeKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function dedupeRawInputsByClinicalCase(items: RawQuestionInput[]): RawQuestionInput[] {
  return dedupeRawInputsInOrder(items);
}

function dedupeRawInputsByBankId(items: RawQuestionInput[]): RawQuestionInput[] {
  const seen = new Set<string>();
  const out: RawQuestionInput[] = [];
  for (const item of items) {
    const key =
      item.bankItemId?.trim() ||
      (item.id != null ? String(item.id) : "") ||
      item.question.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function dedupeRawInputsForSession(
  items: RawQuestionInput[],
  requestedCount: number,
  dedupeMode?: SessionDedupeMode
): RawQuestionInput[] {
  if (dedupeMode === "id") return dedupeRawInputsByBankId(items);
  if (dedupeMode === "clinical") return dedupeRawInputsByClinicalCase(items);
  if (requestedCount >= LONG_SESSION_CLINICAL_DEDUPE_MAX) {
    return dedupeRawInputsByBankId(items);
  }
  return dedupeRawInputsByClinicalCase(items);
}

function dedupeBankItemsInOrder(items: BankItem[]): BankItem[] {
  const seen = new Set<string>();
  const out: BankItem[] = [];
  for (const item of items) {
    const key = bankItemDedupeKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

/** QA-filtered pool → dedupe, shuffle, return up to `limit` items. */
export function selectSpreadRawInputs(
  items: RawQuestionInput[],
  limit: number,
  opts?: { requestedCount?: number; dedupeMode?: SessionDedupeMode }
): RawQuestionInput[] {
  const requested = opts?.requestedCount ?? limit;
  const deduped = dedupeRawInputsForSession(items, requested, opts?.dedupeMode);
  return shuffleBankItems(deduped).slice(0, Math.max(0, limit));
}

/** QA-filtered bank rows → dedupe, shuffle, return up to `limit` items (no spread/variability constraints). */
export function selectSpreadBankItems(items: BankItem[], limit: number): BankItem[] {
  const deduped = dedupeBankItemsInOrder(items);
  return shuffleBankItems(deduped).slice(0, Math.max(0, limit));
}

function spreadVignetteKey(vignette: string | undefined, fallbackStem: string): string {
  const text = vignette?.trim() || fallbackStem.trim();
  return text.toLowerCase().slice(0, 96);
}

function spreadGroupTopicKey(
  topic: string,
  vignette: string | undefined,
  stem: string,
  stableId?: string | number | null
): string {
  const id = stableId != null ? String(stableId).trim() : "";
  if (id) return `${topic}:id:${id}`;
  return `${topic}:${spreadVignetteKey(vignette, stem)}`;
}

export function spreadGroupKeyFromBankItem(item: BankItem): string {
  const payload = item.ngnPayload as { setId?: string; kind?: string } | undefined;
  if (payload?.kind === "sequential" && payload.setId) {
    return `seq:${payload.setId}`;
  }
  const topic =
    item.topicCategory?.trim() ||
    item.blueprintDomain?.trim() ||
    item.subjectId?.trim() ||
    "general";
  const vignetteText = normalizeClinicalCaseText(resolveClinicalVignetteText(item));
  if (vignetteText.length >= 40) {
    return `${topic}:v:${vignetteText.slice(0, 120)}`;
  }
  return spreadGroupTopicKey(topic, item.vignette ?? item.scenario, item.question, null);
}

export function spreadGroupKeyFromStudyQuestion(question: StudyQuestion): string {
  const payload = question.ngnPayload as { setId?: string; kind?: string } | undefined;
  if (payload?.kind === "sequential" && payload.setId) {
    return `seq:${payload.setId}`;
  }
  const topic = question.subjectId?.trim() || question.tags?.[0]?.trim() || "general";
  return spreadGroupTopicKey(topic, question.vignette, question.stem, question.bankItemId);
}

export function spreadGroupKeyFromRawInput(question: RawQuestionInput): string {
  const payload = question.ngnPayload as { setId?: string; kind?: string } | undefined;
  if (payload?.kind === "sequential" && payload.setId) {
    return `seq:${payload.setId}`;
  }
  const topic = question.subjectId?.trim() || question.tags?.[0]?.trim() || "general";
  return spreadGroupTopicKey(
    topic,
    question.vignette,
    question.question,
    question.bankItemId ?? question.id
  );
}

export function hasWindowSimilarSpread<T>(
  items: T[],
  keyFn: (item: T) => string,
  windowSize = SESSION_SPREAD_WINDOW
): boolean {
  if (items.length <= 1 || windowSize <= 1) return false;

  for (let i = 0; i < items.length; i++) {
    const keyI = keyFn(items[i]!);
    if (keyI.startsWith("seq:")) continue;

    const end = Math.min(items.length, i + windowSize);
    for (let j = i + 1; j < end; j++) {
      const keyJ = keyFn(items[j]!);
      if (keyJ.startsWith("seq:")) continue;
      if (keyI === keyJ) return true;
    }
  }
  return false;
}

export function hasAdjacentSimilarSpread<T>(
  items: T[],
  keyFn: (item: T) => string
): boolean {
  return hasWindowSimilarSpread(items, keyFn, 2);
}

export function sessionSpreadPasses<T>(
  items: T[],
  keyFn: (item: T) => string,
  getOptions: (item: T) => string[],
  windowSize = SESSION_SPREAD_WINDOW
): boolean {
  if (items.length <= 1) return true;
  return (
    !hasWindowSimilarSpread(items, keyFn, windowSize) &&
    !hasWindowSimilarOptions(items, getOptions, windowSize)
  );
}

/** Preserve sequential NGN blocks — no variability reordering. */
export function spreadStudyQuestions(questions: StudyQuestion[]): StudyQuestion[] {
  return buildQuestionBlocks(questions).flat();
}
