import type { BankItem } from "@/lib/question-bank";
import { shuffleBankItems } from "@/lib/question-bank-db";
import type { StudyQuestion } from "./types";
import { buildQuestionBlocks } from "./sequential-sets";

/** Group key for interleaving — keeps sequential sets together, separates look-alike stems. */
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
  const caseText = (item.vignette ?? item.scenario ?? item.question)
    .trim()
    .toLowerCase()
    .slice(0, 48);
  return `${topic}:${caseText}`;
}

export function spreadGroupKeyFromStudyQuestion(question: StudyQuestion): string {
  const payload = question.ngnPayload as { setId?: string; kind?: string } | undefined;
  if (payload?.kind === "sequential" && payload.setId) {
    return `seq:${payload.setId}`;
  }
  const topic = question.subjectId?.trim() || question.tags?.[0]?.trim() || "general";
  const caseText = (question.vignette ?? question.stem).trim().toLowerCase().slice(0, 48);
  return `${topic}:${caseText}`;
}

/** Round-robin interleave so adjacent items rarely share the same spread group. */
export function spreadByGroupKey<T>(
  items: T[],
  keyFn: (item: T) => string
): T[] {
  if (items.length <= 1) return items;

  const queues = new Map<string, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const list = queues.get(key) ?? [];
    list.push(item);
    queues.set(key, list);
  }

  const out: T[] = [];
  let lastKey: string | null = null;

  while (out.length < items.length) {
    const candidates = [...queues.entries()].filter(([, queue]) => queue.length > 0);
    if (candidates.length === 0) break;

    const preferred = candidates
      .filter(([key]) => key !== lastKey)
      .sort((a, b) => b[1].length - a[1].length);
    const fallback = candidates.sort((a, b) => b[1].length - a[1].length);
    const [key, queue] = preferred[0] ?? fallback[0]!;

    out.push(queue.shift()!);
    lastKey = key;
  }

  return out;
}

/** True when two consecutive items share a spread group (excluding intentional sequential sets). */
export function hasAdjacentSimilarSpread<T>(
  items: T[],
  keyFn: (item: T) => string
): boolean {
  for (let i = 1; i < items.length; i++) {
    const prev = keyFn(items[i - 1]!);
    const curr = keyFn(items[i]!);
    if (prev.startsWith("seq:") || curr.startsWith("seq:")) continue;
    if (prev === curr) return true;
  }
  return false;
}

export function spreadStudyQuestions(questions: StudyQuestion[]): StudyQuestion[] {
  const blocks = buildQuestionBlocks(questions);
  const spreadBlocks = spreadByGroupKey(blocks, (block) =>
    spreadGroupKeyFromStudyQuestion(block[0]!)
  );
  return spreadBlocks.flat();
}

export function selectSpreadBankItems(items: BankItem[], limit: number): BankItem[] {
  const pool = spreadByGroupKey(
    shuffleBankItems(dedupeBankItemsInOrder(items)),
    spreadGroupKeyFromBankItem
  );
  return pool.slice(0, Math.max(0, limit));
}

function dedupeBankItemsInOrder(items: BankItem[]): BankItem[] {
  const seen = new Set<string>();
  const out: BankItem[] = [];
  for (const item of items) {
    const key = `${item.subjectId ?? ""}:${item.question.trim().toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}
