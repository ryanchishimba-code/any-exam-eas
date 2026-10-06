/**
 * Narrow clinical topics inside a sitting.
 * Blueprint labels such as med-surg stay broad. Depression and a COPD
 * exacerbation are the topics that should not stack.
 */
import type { BankItem } from "@/lib/question-bank";

const NARROW: { id: string; re: RegExp }[] = [
  { id: "depression-suicide", re: /\b(depressi(?:on|ve)|suicid|self[-\s]?harm|hopeless|giving away (?:his|her|their)?\s*belongings)\b/i },
  { id: "copd", re: /\bcopd\b|\bchronic obstructive\b|\bemphysema\b|\bchronic bronchitis\b/i },
  { id: "breastfeeding", re: /\bbreastfeed|\blactation\b|\bmilk supply\b/i },
  { id: "gtt-teaching", re: /\bglucose tolerance\b|\bgtt\b|\bgestational diabetes\b/i },
  { id: "warfarin-inr", re: /\bwarfarin\b|\binr\b/i },
  { id: "statin-myalgia", re: /\bstatins?\b|\bmyalgias?\b|\bmuscle (?:pain|ache)/i },
  { id: "insulin-potassium", re: /\binsulin\b[\s\S]{0,80}\bpotassium\b|\bpotassium\b[\s\S]{0,80}\binsulin\b/i },
  { id: "opioid-sedation", re: /\b(opioid|morphine|fentanyl|hydromorphone|oxycodone|hydrocodone)\b/i },
  { id: "c-diff-hygiene", re: /\bc\.?\s*diff|\bclostridioides\b|\bclostridium difficile\b/i },
  { id: "pancreatitis", re: /\bpancreatitis\b/i },
  { id: "fatigue-weight-loss", re: /\bfatigue\b[\s\S]{0,80}\b\d+\s*(?:lb|pound)|\b\d+\s*(?:lb|pound)s?\b[\s\S]{0,80}\bfatigue\b/i },
  { id: "burns", re: /\bburns?\b|\bscald\b|\btbsa\b/i },
  { id: "postpartum-hemorrhage", re: /\bpostpartum hemorrhage\b|\bboggy fundus\b/i },
  { id: "asthma-albuterol", re: /\basthma\b|\balbuterol\b/i },
  { id: "ssri-sjw", re: /\b(ssri|sertraline|fluoxetine|paroxetine)\b[\s\S]{0,80}\bst\.?\s*john|\bst\.?\s*john'?s?\s*wort\b/i },
  { id: "dpi-inhaler", re: /\bdry[- ]powder inhaler\b|\bdiskus\b|\bdpi\b/i },
  { id: "diabetes-glucose", re: /\b(dka|diabetic ketoacidosis|blood glucose|blood sugar)\b|\bglucose (?:of |is )?2\d\d\b/i },
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

/**
 * No single narrow condition above this share of the sitting, and never below 2.
 * 4% keeps COPD from filling 6 of 50 and opioid sedation from filling 8 of 91.
 */
export function narrowTopicShareCap(sittingLength: number): number {
  const length = Math.max(0, Math.floor(sittingLength) || 0);
  if (length <= 0) return 2;
  return Math.max(2, Math.ceil(length * 0.04));
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
