/**
 * Narrow clinical topics inside a sitting.
 * Blueprint labels such as med-surg stay broad. Depression and a COPD
 * exacerbation are the topics that should not stack.
 */
import type { BankItem } from "@/lib/question-bank";

const NARROW: { id: string; re: RegExp }[] = [
  { id: "depression-suicide", re: /\b(depressi(?:on|ve)|suicid|self[-\s]?harm|hopeless)\b/i },
  { id: "copd", re: /\bcopd\b|\bchronic obstructive\b/i },
  { id: "breastfeeding", re: /\bbreastfeed|\blactation\b|\bmilk supply\b/i },
  { id: "gtt-teaching", re: /\bglucose tolerance\b|\bgtt\b|\bgestational diabetes\b/i },
  { id: "warfarin-inr", re: /\bwarfarin\b|\binr\b/i },
  { id: "statin-myalgia", re: /\bstatins?\b|\bmyalgias?\b|\bmuscle (?:pain|ache)/i },
  { id: "insulin-potassium", re: /\binsulin\b[\s\S]{0,80}\bpotassium\b|\bpotassium\b[\s\S]{0,80}\binsulin\b/i },
];

export type NarrowTopicSource = {
  text?: string | null;
  topicCategory?: string | null;
  blueprintTopic?: string | null;
  subjectId?: string | null;
  tags?: string[] | null;
};

/** Stable id for spread and share caps. Null when the item has no narrow topic. */
export function narrowTopicKey(source: NarrowTopicSource): string | null {
  const text = [
    source.text,
    source.topicCategory,
    source.blueprintTopic,
    ...(source.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ");
  for (const row of NARROW) {
    if (row.re.test(text)) return row.id;
  }
  return null;
}

export function narrowTopicKeyFromBankItem(item: BankItem): string | null {
  return narrowTopicKey({
    text: [item.vignette, item.scenario, item.question].filter(Boolean).join(" "),
    topicCategory: item.topicCategory,
    blueprintTopic: item.blueprintTopic,
    subjectId: item.subjectId,
    tags: item.tags,
  });
}

/** No single narrow topic above this share of the sitting, and never below 2. */
export function narrowTopicShareCap(sittingLength: number): number {
  const length = Math.max(0, Math.floor(sittingLength) || 0);
  if (length <= 0) return 2;
  return Math.max(2, Math.ceil(length * 0.08));
}

/**
 * Reorder so the same narrow topic is not three in a row.
 * Items with a null key can sit anywhere. Sequential cases should pass null.
 */
export function orderWithTopicGap<T>(
  items: readonly T[],
  keyFn: (item: T) => string | null
): T[] {
  const remaining = [...items];
  const out: T[] = [];
  while (remaining.length > 0) {
    const prev = out.length >= 1 ? keyFn(out[out.length - 1]!) : null;
    const before = out.length >= 2 ? keyFn(out[out.length - 2]!) : null;
    const blocked = prev && before && prev === before ? prev : null;
    let index = remaining.findIndex((item) => {
      const key = keyFn(item);
      return !key || key !== blocked;
    });
    if (index < 0) index = 0;
    out.push(remaining.splice(index, 1)[0]!);
  }
  return out;
}

export function countConsecutiveTopicRun<T>(
  items: readonly T[],
  keyFn: (item: T) => string | null
): number {
  let best = 1;
  let run = 1;
  for (let i = 1; i < items.length; i++) {
    const key = keyFn(items[i]!);
    const prev = keyFn(items[i - 1]!);
    if (key && key === prev) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 1;
    }
  }
  return items.length === 0 ? 0 : best;
}
