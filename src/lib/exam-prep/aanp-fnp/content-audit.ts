/**
 * Read-only candidate rules for AANP FNP content review.
 * These flags do not change a key, a stem, or an option.
 */
import { tokenJaccard, scenarioTokens } from "./scenario-similarity";

export type FnpAuditItem = {
  id: string;
  question: string;
  scenario?: string | null;
  options: string[];
  correctAnswer: string;
};

export type FnpAuditFlag = "different_key" | "option_type_mismatch" | "garbled_option";

const DIAGNOSTIC_ASK =
  /most appropriate initial diagnostic|diagnostic study|most likely diagnosis|best explanation for the findings/i;

const TREATMENT_OPTION =
  /^(?:administer|start|initiate|prescribe|give|apply)\b|\bvaccine\b|\binhibitor therapy\b|the patient requires/i;

const GARBLED_OPTION =
  /\b[A-Za-z]{1,8}\s+ing\b|\?\?|�|[\u0000-\u0008]/;

export function normalizeAuditAnswer(answer: string): string {
  return answer.trim().toLowerCase().replace(/\s+/g, " ");
}

export function auditScenarioText(item: Pick<FnpAuditItem, "question" | "scenario">): string {
  const scenario = item.scenario?.trim();
  if (scenario && scenario.length >= 40) return scenario;
  return item.question;
}

export function stemsShareScenario(a: FnpAuditItem, b: FnpAuditItem): boolean {
  const left = scenarioTokens(auditScenarioText(a));
  const right = scenarioTokens(auditScenarioText(b));
  if (left.size < 8 || right.size < 8) return false;
  return tokenJaccard(left, right) >= 0.82;
}

export function optionTypeMismatch(item: FnpAuditItem): boolean {
  if (!DIAGNOSTIC_ASK.test(item.question)) return false;
  if (item.options.length < 2) return false;
  return item.options.some((option) => TREATMENT_OPTION.test(option.trim()));
}

export function garbledOptions(item: FnpAuditItem): string[] {
  return item.options.filter((option) => GARBLED_OPTION.test(option.trim()));
}

export function differentKeyGroups(items: readonly FnpAuditItem[]): FnpAuditItem[][] {
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
    const tokens = [...scenarioTokens(auditScenarioText(item))].sort();
    const block = tokens.slice(0, 6).join("|");
    const list = buckets.get(block) ?? [];
    list.push(index);
    buckets.set(block, list);
  });
  for (const indexes of buckets.values()) {
    for (let a = 0; a < indexes.length; a += 1) {
      for (let b = a + 1; b < indexes.length; b += 1) {
        const i = indexes[a]!;
        const j = indexes[b]!;
        if (!stemsShareScenario(items[i]!, items[j]!)) continue;
        if (normalizeAuditAnswer(items[i]!.correctAnswer) === normalizeAuditAnswer(items[j]!.correctAnswer)) {
          continue;
        }
        unite(i, j);
      }
    }
  }
  const groups = new Map<number, FnpAuditItem[]>();
  for (let i = 0; i < items.length; i += 1) {
    const root = find(i);
    const list = groups.get(root) ?? [];
    list.push(items[i]!);
    groups.set(root, list);
  }
  return [...groups.values()].filter((group) => {
    const keys = new Set(group.map((item) => normalizeAuditAnswer(item.correctAnswer)));
    return group.length > 1 && keys.size > 1;
  });
}
