import type { BankItem } from "@/lib/question-bank";

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function stemKey(item: BankItem): string {
  const scenario = item.scenario?.trim().toLowerCase() ?? "";
  const stem = item.question.trim().toLowerCase();
  return `${scenario}::${stem}`.slice(0, 200);
}

/**
 * Pick diverse items: spread topic categories, item types, and difficulties;
 * avoid near-duplicate stems in one session.
 */
export function selectDiverseMpjeItems(pool: BankItem[], want: number): BankItem[] {
  const unique = new Map<string, BankItem>();
  for (const item of pool) {
    const key = stemKey(item);
    if (!unique.has(key)) unique.set(key, item);
  }

  const buckets = new Map<string, BankItem[]>();
  for (const item of unique.values()) {
    const topic = item.topicCategory ?? item.subjectId ?? "general";
    const type = item.itemType ?? "mcq";
    const diff = String(item.difficulty ?? 3);
    const key = `${topic}|${type}|${diff}`;
    (buckets.get(key) ?? buckets.set(key, []).get(key)!)!.push(item);
  }

  for (const [, items] of buckets) shuffle(items);

  const keys = shuffle([...buckets.keys()]);
  const picked: BankItem[] = [];
  const usedTopics = new Map<string, number>();
  const maxPerTopic = Math.max(2, Math.ceil(want / 8));

  let guard = 0;
  while (picked.length < want && guard < want * 40) {
    guard++;
    const key = keys[guard % keys.length]!;
    const bucket = buckets.get(key);
    if (!bucket?.length) continue;
    const item = bucket.shift()!;
    const topic = item.topicCategory ?? item.subjectId ?? "general";
    const topicCount = usedTopics.get(topic) ?? 0;
    if (topicCount >= maxPerTopic && picked.length < want - 5) continue;
    picked.push(item);
    usedTopics.set(topic, topicCount + 1);
  }

  if (picked.length < want) {
    const rest = shuffle([...unique.values()].filter((i) => !picked.includes(i)));
    picked.push(...rest.slice(0, want - picked.length));
  }

  return shuffle(picked).slice(0, want);
}
