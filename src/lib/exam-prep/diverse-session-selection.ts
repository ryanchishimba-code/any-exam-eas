import type { BankItem } from "@/lib/question-bank";
import { dedupeBankItemsById } from "@/lib/question-bank-db";
import { clinicalCaseKey } from "@/lib/exam-prep/clinical-case-dedupe";
import { conceptKeysFor } from "@/lib/exam-prep/naplex/blueprint-selection";
import { sequenceItems } from "@/lib/exam-prep/sequencing/anti-cluster-sequencer";
import type { SequenceItem } from "@/lib/exam-prep/sequencing/types";

export { clinicalCaseKey } from "@/lib/exam-prep/clinical-case-dedupe";

export type DiverseSessionOptions = {
  seed?: number;
  /** Skip picking another item when this returns false (e.g. NCLEX delegation cap). */
  acceptCandidate?: (item: BankItem, selected: BankItem[]) => boolean;
};

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

function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const rng = mulberry32(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function isSequentialBlock(item: BankItem): boolean {
  const payload = item.ngnPayload as { kind?: string; setId?: string } | undefined;
  return payload?.kind === "sequential" && Boolean(payload.setId?.trim());
}

export function sessionDomainFor(item: BankItem): string {
  return (
    item.blueprintDomain?.trim() ||
    item.topicCategory?.trim() ||
    item.subjectId?.trim() ||
    "general"
  );
}

/** One standalone item per clinical case; preserve sequential NGN blocks. */
export function dedupeItemsByClinicalCase(items: BankItem[]): BankItem[] {
  const sequentialBySet = new Map<string, BankItem[]>();
  const standaloneSeen = new Set<string>();
  const out: BankItem[] = [];

  for (const item of items) {
    if (isSequentialBlock(item)) {
      const setId = (item.ngnPayload as { setId: string }).setId;
      const list = sequentialBySet.get(setId) ?? [];
      list.push(item);
      sequentialBySet.set(setId, list);
      continue;
    }

    const key = clinicalCaseKey(item);
    if (standaloneSeen.has(key)) continue;
    standaloneSeen.add(key);
    out.push(item);
  }

  for (const setItems of sequentialBySet.values()) {
    setItems.sort(
      (a, b) =>
        ((a.ngnPayload as { stepIndex?: number }).stepIndex ?? 0) -
        ((b.ngnPayload as { stepIndex?: number }).stepIndex ?? 0)
    );
    out.push(...setItems);
  }

  return out;
}

function answerKeyFor(item: BankItem): string {
  const ca = (item.correctAnswer ?? "").trim();
  if (/^[A-H](?:\s*,\s*[A-H])*$/i.test(ca)) return ca.toUpperCase().replace(/\s+/g, "");
  const idx = (item.options ?? []).findIndex(
    (o) => o.trim() === ca || o.trim().toLowerCase() === ca.toLowerCase()
  );
  return idx >= 0 ? String.fromCharCode(65 + idx) : ca.slice(0, 8).toUpperCase() || "?";
}

function toSequenceItem(item: BankItem): SequenceItem {
  const caseKey = clinicalCaseKey(item);
  const concepts = [...new Set([caseKey, ...conceptKeysFor(item)])];
  return {
    id: item.id ?? caseKey,
    domain: sessionDomainFor(item),
    concepts,
    difficulty: item.difficulty ?? 3,
    format: item.itemType ?? "mcq",
    answer: answerKeyFor(item),
  };
}

export function sequencingConfigForSession(n: number) {
  if (n <= 15) return { domainMinGap: 2, conceptMinGap: 3 };
  if (n <= 40) return { domainMinGap: 3, conceptMinGap: 4 };
  return { domainMinGap: 4, conceptMinGap: 5 };
}

function normalizeStem(stem: string): string {
  return stem.trim().toLowerCase();
}

function roundRobinByDomain(
  items: BankItem[],
  limit: number,
  seed: number,
  acceptCandidate?: DiverseSessionOptions["acceptCandidate"]
): BankItem[] {
  const byDomain = new Map<string, BankItem[]>();
  for (const item of shuffleWithSeed(items, seed)) {
    const domain = sessionDomainFor(item);
    const list = byDomain.get(domain) ?? [];
    list.push(item);
    byDomain.set(domain, list);
  }

  const domains = shuffleWithSeed([...byDomain.keys()], seed ^ 0xabc);
  const selected: BankItem[] = [];
  const usedStems = new Set<string>();
  const usedCases = new Set<string>();

  const canTake = (candidate: BankItem, allowStemReuse: boolean) => {
    if (acceptCandidate && !acceptCandidate(candidate, selected)) return false;
    const caseKey = clinicalCaseKey(candidate);
    if (usedCases.has(caseKey)) return false;
    const stem = normalizeStem(candidate.question);
    if (!allowStemReuse && usedStems.has(stem)) return false;
    return true;
  };

  const take = (candidate: BankItem) => {
    selected.push(candidate);
    usedCases.add(clinicalCaseKey(candidate));
    usedStems.add(normalizeStem(candidate.question));
  };

  while (selected.length < limit) {
    let picked = false;
    for (const domain of domains) {
      const bucket = byDomain.get(domain);
      if (!bucket?.length) continue;

      let idx = 0;
      while (idx < bucket.length) {
        const candidate = bucket[idx]!;
        if (!canTake(candidate, false)) {
          idx += 1;
          continue;
        }
        bucket.splice(idx, 1);
        take(candidate);
        picked = true;
        break;
      }
      if (selected.length >= limit) break;
    }
    if (picked) continue;

    // Pool exhausted for unique stems — allow stem reuse, but never repeat the same clinical case.
    for (const domain of domains) {
      const bucket = byDomain.get(domain);
      if (!bucket?.length) continue;
      let idx = 0;
      while (idx < bucket.length) {
        const candidate = bucket[idx]!;
        if (!canTake(candidate, true)) {
          idx += 1;
          continue;
        }
        bucket.splice(idx, 1);
        take(candidate);
        picked = true;
        break;
      }
      if (selected.length >= limit) break;
    }
    if (!picked) break;
  }

  return selected;
}

/**
 * Pick a diverse session slice, then anti-cluster delivery order so similar
 * vignettes, domains, and answer keys do not appear back-to-back.
 */
export function selectDiverseSessionBankItems(
  items: BankItem[],
  limit: number,
  opts: DiverseSessionOptions = {}
): BankItem[] {
  const cap = Math.max(0, limit);
  if (cap === 0 || items.length === 0) return [];

  const seed = opts.seed ?? ((Date.now() ^ 0x9e3779b9) >>> 0);
  const pool = dedupeItemsByClinicalCase(dedupeBankItemsById(items));

  if (pool.length <= cap) {
    const { ordered } = sequenceItems(
      pool,
      toSequenceItem,
      sequencingConfigForSession(pool.length),
      seed
    );
    return ordered.slice(0, cap);
  }

  const selected = roundRobinByDomain(pool, cap, seed, opts.acceptCandidate);
  const base =
    selected.length >= cap
      ? selected
      : (() => {
          const picked = new Set(selected.map((i) => i.id ?? clinicalCaseKey(i)));
          const remainder = pool.filter((i) => !picked.has(i.id ?? clinicalCaseKey(i)));
          return [...selected, ...remainder].slice(0, cap);
        })();
  const { ordered } = sequenceItems(
    base,
    toSequenceItem,
    sequencingConfigForSession(cap),
    seed
  );

  return ordered.slice(0, cap);
}
