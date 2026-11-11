/**
 * Read-only candidate rules for served PANCE items.
 * These flags do not change a stem, an option, a key, or a rationale.
 */
import { scenarioTokens, tokenJaccard } from "@/lib/exam-prep/aanp-fnp/scenario-similarity";

export type PanceAuditItem = {
  id: string;
  question: string;
  scenario?: string | null;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

const JOKE_DISTRACTOR =
  /another dose of ibuprofen|\bjust (?:give|take) (?:more )?ibuprofen\b|\b(?:lol|lmao|just kidding)\b|\b(?:chocolate|candy) bar\b|\bgo home and ignore\b|\btell (?:the patient|them) to google\b/i;

export function auditScenarioText(item: Pick<PanceAuditItem, "question" | "scenario">): string {
  const scenario = item.scenario?.trim();
  if (scenario && scenario.length >= 40) return scenario;
  const question = item.question.trim();
  const split = question.split(/\n\n/)[0]?.trim() ?? question;
  return split.length >= 40 ? split : question;
}

export function stemsAreNearDuplicate(a: PanceAuditItem, b: PanceAuditItem): boolean {
  if (a.id === b.id) return false;
  const left = scenarioTokens(auditScenarioText(a));
  const right = scenarioTokens(auditScenarioText(b));
  if (left.size < 8 || right.size < 8) return false;
  return tokenJaccard(left, right) >= 0.82;
}

/** Groups of served rows whose vignettes are the same scenario. */
export function nearDuplicateStemGroups(items: readonly PanceAuditItem[]): PanceAuditItem[][] {
  const parent = items.map((_, index) => index);
  const find = (index: number): number => {
    let cursor = index;
    while (parent[cursor] !== cursor) cursor = parent[cursor]!;
    return cursor;
  };
  const unite = (a: number, b: number) => {
    const left = find(a);
    const right = find(b);
    if (left !== right) parent[right] = left;
  };
  const buckets = new Map<string, number[]>();
  items.forEach((item, index) => {
    const block = [...scenarioTokens(auditScenarioText(item))].sort().slice(0, 6).join("|");
    const list = buckets.get(block) ?? [];
    list.push(index);
    buckets.set(block, list);
  });
  for (const indexes of buckets.values()) {
    for (let a = 0; a < indexes.length; a += 1) {
      for (let b = a + 1; b < indexes.length; b += 1) {
        const i = indexes[a]!;
        const j = indexes[b]!;
        if (stemsAreNearDuplicate(items[i]!, items[j]!)) unite(i, j);
      }
    }
  }
  const groups = new Map<number, PanceAuditItem[]>();
  for (let i = 0; i < items.length; i += 1) {
    const root = find(i);
    const list = groups.get(root) ?? [];
    list.push(items[i]!);
    groups.set(root, list);
  }
  return [...groups.values()].filter((group) => group.length > 1);
}

export function jokeDistractors(item: PanceAuditItem): string[] {
  return item.options.filter((option) => JOKE_DISTRACTOR.test(option.trim()));
}

function sentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

/**
 * A one-sentence rationale that only restates the keyed answer.
 * Longer explanations, including those that name a distractor, are not flagged.
 */
export function tautologicalOneLineRationale(item: PanceAuditItem): boolean {
  const text = item.explanation.replace(/\s+/g, " ").trim();
  if (!text || text.length > 220) return false;
  const parts = sentences(text);
  if (parts.length !== 1) return false;
  const sentence = parts[0]!.toLowerCase();
  const key = item.correctAnswer.replace(/\s+/g, " ").trim().toLowerCase();
  if (!key) return false;
  const restatesKey = sentence.includes(key) || sentence.startsWith(key.slice(0, Math.min(40, key.length)));
  return restatesKey && /\bis correct\b/.test(sentence);
}
