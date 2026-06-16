import type { BankItem } from "@/lib/question-bank";
import { bankItemDedupeKey, shuffleBankItems } from "@/lib/question-bank-db";
import {
  balanceDifficultyMix,
  hasAdjacentSimilarOptions,
  hasWindowSimilarOptions,
  optionsAreTooSimilar,
  optionsFromBankItem,
  optionsFromStudyQuestion,
  resolveDifficultyBand,
} from "./session-quality";
import type { StudyQuestion } from "./types";
import { buildQuestionBlocks } from "./sequential-sets";

/** No look-alike vignettes or overlapping option sets within this many consecutive items. */
export const SESSION_SPREAD_WINDOW = 25;

/** True when candidate would repeat a spread group or option set inside the recent window. */
export function conflictsWithSpreadWindow<T>(
  candidate: T,
  recent: T[],
  keyFn: (item: T) => string,
  opts?: {
    areTooSimilar?: (prev: T, next: T) => boolean;
    windowSize?: number;
  }
): boolean {
  const windowSize = opts?.windowSize ?? SESSION_SPREAD_WINDOW;
  if (recent.length === 0) return false;

  const candKey = keyFn(candidate);
  const window = recent.slice(-(windowSize - 1));

  for (const prev of window) {
    const prevKey = keyFn(prev);
    if (
      !prevKey.startsWith("seq:") &&
      !candKey.startsWith("seq:") &&
      prevKey === candKey
    ) {
      return true;
    }
    if (opts?.areTooSimilar?.(prev, candidate)) return true;
  }
  return false;
}

/** True when any window of `windowSize` items contains duplicate spread groups. */
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

/** Round-robin interleave — separates look-alike cases within SESSION_SPREAD_WINDOW. */
export function spreadByGroupKey<T>(
  items: T[],
  keyFn: (item: T) => string,
  opts?: {
    areTooSimilar?: (prev: T, next: T) => boolean;
    windowSize?: number;
  }
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

  while (out.length < items.length) {
    const candidates = [...queues.entries()].filter(([, queue]) => queue.length > 0);
    if (candidates.length === 0) break;

    const windowSafe = candidates
      .filter(([, queue]) =>
        !conflictsWithSpreadWindow(queue[0]!, out, keyFn, opts)
      )
      .sort((a, b) => b[1].length - a[1].length);

    const pickFrom =
      windowSafe.length > 0
        ? windowSafe
        : candidates.sort((a, b) => b[1].length - a[1].length);

    const [, queue] = pickFrom[0]!;
    const picked = queue.shift()!;
    out.push(picked);
  }

  return out;
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

/** Back-compat alias — adjacent pairs are covered by the 25-question window rule. */
export function hasAdjacentSimilarSpread<T>(
  items: T[],
  keyFn: (item: T) => string
): boolean {
  return hasWindowSimilarSpread(items, keyFn, 2);
}

export function spreadStudyQuestions(questions: StudyQuestion[]): StudyQuestion[] {
  const blocks = buildQuestionBlocks(questions);
  const spreadBlocks = spreadByGroupKey(
    blocks,
    (block) => spreadGroupKeyFromStudyQuestion(block[0]!),
    {
      areTooSimilar: (prevBlock, nextBlock) =>
        optionsAreTooSimilar(
          optionsFromStudyQuestion(prevBlock[0]!),
          optionsFromStudyQuestion(nextBlock[0]!)
        ),
    }
  );
  return spreadBlocks.flat();
}

export function selectSpreadBankItems(items: BankItem[], limit: number): BankItem[] {
  const deduped = dedupeBankItemsInOrder(items);

  for (let attempt = 0; attempt < 4; attempt++) {
    const balanced = balanceDifficultyMix(
      shuffleBankItems(deduped),
      Math.max(limit, deduped.length),
      resolveDifficultyBand
    );
    const pool = spreadByGroupKey(balanced, spreadGroupKeyFromBankItem, {
      areTooSimilar: (a, b) =>
        optionsAreTooSimilar(optionsFromBankItem(a), optionsFromBankItem(b)),
    });
    const slice = pool.slice(0, Math.max(0, limit));
    if (slice.length <= 1 || sessionSpreadPasses(slice, spreadGroupKeyFromBankItem, optionsFromBankItem)) {
      return slice;
    }
  }

  const fallback = spreadByGroupKey(
    balanceDifficultyMix(shuffleBankItems(deduped), Math.max(limit, deduped.length), resolveDifficultyBand),
    spreadGroupKeyFromBankItem,
    {
      areTooSimilar: (a, b) =>
        optionsAreTooSimilar(optionsFromBankItem(a), optionsFromBankItem(b)),
    }
  );
  return fallback.slice(0, Math.max(0, limit));
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
