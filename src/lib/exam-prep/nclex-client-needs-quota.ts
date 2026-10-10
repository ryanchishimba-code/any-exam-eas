/**
 * NCSBN 2026 client-needs ranges for one exam draw.
 * Strings normalize to the eight areas. An NGN step uses its subcategory.
 * A mapped options.clientNeedsCategory wins for a bank item. A blank bank item
 * counts only when its subject slug is one of those eight areas.
 * Maternal, pediatric, and other specialty subjects stay out of the quota
 * and fill only leftover slots.
 */
import type { BankItem } from "@/lib/question-bank";
import { sequentialSetId } from "@/lib/exam-prep/sitting-clusters";
import { NCLEX_2026_CLIENT_NEEDS } from "@/lib/exam-prep/nclex/blueprint-topics-2026";
import type { NclexClientNeedsId } from "@/lib/exam-prep/nclex/types";

const CATEGORY_IDS = new Set<string>(NCLEX_2026_CLIENT_NEEDS.map((category) => category.id));

/** Exact options.clientNeedsCategory spellings in the served bank. */
const OPTION_TEXTS: Record<NclexClientNeedsId, readonly string[]> = {
  "management-of-care": ["Management of Care"],
  "safety-infection": [
    "Safety & Infection Control",
    "Safety and Infection Control",
    "Safety and Infection Prevention and Control",
  ],
  "health-promotion": ["Health Promotion", "Health Promotion and Maintenance"],
  psychosocial: ["Psychosocial Integrity"],
  "basic-care-comfort": ["Basic Care & Comfort", "Basic Care and Comfort"],
  "pharmacology-nursing": ["Pharmacological Therapies", "Pharmacological and Parenteral Therapies"],
  "reduction-risk": ["Reduction of Risk Potential"],
  "physiological-adaptation": ["Physiological Adaptation"],
};

const ALIAS_TO_CATEGORY: Record<string, NclexClientNeedsId> = {
  "management of care": "management-of-care",
  "safety and infection control": "safety-infection",
  "safety and infection prevention and control": "safety-infection",
  "safety infection": "safety-infection",
  "health promotion and maintenance": "health-promotion",
  "health promotion": "health-promotion",
  "psychosocial integrity": "psychosocial",
  "basic care and comfort": "basic-care-comfort",
  "basic care": "basic-care-comfort",
  pharmacology: "pharmacology-nursing",
  "pharmacological therapies": "pharmacology-nursing",
  "pharmacological and parenteral therapies": "pharmacology-nursing",
  "risk reduction": "reduction-risk",
  "reduction of risk potential": "reduction-risk",
  "physiological adaptation": "physiological-adaptation",
};

function normalizeLabel(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function categoryFromText(value: string): NclexClientNeedsId | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (CATEGORY_IDS.has(trimmed)) return trimmed as NclexClientNeedsId;
  const label = normalizeLabel(trimmed);
  const slug = label.replace(/ /g, "-");
  if (CATEGORY_IDS.has(slug)) return slug as NclexClientNeedsId;
  if (ALIAS_TO_CATEGORY[label]) return ALIAS_TO_CATEGORY[label];
  return null;
}

function textValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

/** The category stored on the options envelope, including after it is copied onto the item. */
function optionsClientNeedsCategory(item: BankItem): string | null {
  const direct = textValue((item as BankItem & { clientNeedsCategory?: unknown }).clientNeedsCategory);
  if (direct) return direct;
  const options = item.options as unknown;
  if (options && typeof options === "object" && !Array.isArray(options)) {
    const stored = textValue((options as { clientNeedsCategory?: unknown }).clientNeedsCategory);
    if (stored) return stored;
  }
  return textValue(item.ngnPayload?.clientNeedsCategory);
}

function pushText(out: string[], value: unknown) {
  if (typeof value === "string" && value.trim()) out.push(value.trim());
}

function storedClientNeeds(item: BankItem): string[] {
  const extra = item as BankItem & { clientNeeds?: unknown };
  const out: string[] = [];
  const clientNeeds = extra.clientNeeds;
  if (clientNeeds && typeof clientNeeds === "object") {
    const record = clientNeeds as { subcategory?: unknown; category?: unknown };
    pushText(out, record.subcategory);
    pushText(out, record.category);
  } else {
    pushText(out, clientNeeds);
  }
  for (const tag of item.tags ?? []) {
    if (tag.startsWith("cn:")) pushText(out, tag.slice(3));
  }
  return out;
}

function firstCategory(values: readonly string[]): NclexClientNeedsId | null {
  for (const value of values) {
    const category = categoryFromText(value);
    if (category) return category;
  }
  return null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

/** NGN catalog client_needs. Subcategory is the area; category is often the parent. */
function ngnNeeds(item: BankItem): { subcategory: string | null; category: string | null } | null {
  const extra = item as BankItem & { clientNeeds?: unknown };
  const payload = asRecord(item.ngnPayload);
  const source = asRecord(payload?.clientNeeds) ?? asRecord(extra.clientNeeds);
  if (!source) return null;
  return {
    subcategory: textValue(source.subcategory),
    category: textValue(source.category),
  };
}

function isNgnItem(item: BankItem): boolean {
  if (ngnNeeds(item)) return true;
  const payload = asRecord(item.ngnPayload);
  if (payload) {
    if (typeof payload.clinicalItemType === "string" && payload.clinicalItemType.trim()) return true;
    if (typeof payload.setId === "string" && payload.setId.trim() && typeof payload.stepIndex === "number") return true;
  }
  return (item.id ?? "").startsWith("ngn:");
}

/**
 * Client-needs category for quota math.
 * An NGN subcategory wins over a parent category. A mapped bank
 * options.clientNeedsCategory wins over the subject. An unmapped string does
 * not hide a later match. A blank bank item uses the subject slug only when
 * that slug is one of the eight areas.
 */
export function examClientNeedsCategory(item: BankItem): NclexClientNeedsId | null {
  const needs = ngnNeeds(item);
  if (needs?.subcategory) {
    const subcategory = categoryFromText(needs.subcategory);
    if (subcategory) return subcategory;
  }

  const fromOptions = optionsClientNeedsCategory(item);
  if (fromOptions) {
    const mapped = categoryFromText(fromOptions);
    if (mapped) return mapped;
  }

  if (isNgnItem(item) && item.topicCategory) {
    const topic = categoryFromText(item.topicCategory);
    if (topic) return topic;
  }

  const stored = firstCategory(storedClientNeeds(item));
  if (stored) return stored;

  const extra = item as BankItem & { subjectLabel?: string };
  return firstCategory([item.subjectId ?? "", extra.subjectLabel ?? ""].filter(Boolean));
}

export type ClientNeedsBound = {
  id: NclexClientNeedsId;
  min: number;
  max: number;
  count: number;
};

/** Integer counts for one draw. Null when the length cannot sit inside every range. */
export function clientNeedsTargets(limit: number): ClientNeedsBound[] | null {
  if (limit < 1) return null;
  const rows = NCLEX_2026_CLIENT_NEEDS.map((category) => {
    const min = Math.ceil((category.weightPct.min * limit) / 100);
    const max = Math.floor((category.weightPct.max * limit) / 100);
    const raw = category.weight * limit;
    const count = Math.min(max, Math.max(min, Math.round(raw)));
    return { id: category.id, min, max, raw, count };
  });
  if (rows.some((row) => row.min > row.max)) return null;
  let sum = rows.reduce((total, row) => total + row.count, 0);
  const byRemainder = [...rows].sort((a, b) => b.raw - Math.floor(b.raw) - (a.raw - Math.floor(a.raw)));
  let guard = 0;
  while (sum !== limit && guard < limit * 8) {
    guard += 1;
    if (sum < limit) {
      const room = byRemainder.find((row) => row.count < row.max);
      if (!room) return null;
      room.count += 1;
      sum += 1;
    } else {
      const room = byRemainder.find((row) => row.count > row.min);
      if (!room) return null;
      room.count -= 1;
      sum -= 1;
    }
  }
  if (sum !== limit) return null;
  return rows.map(({ id, min, max, count }) => ({ id, min, max, count }));
}

function itemId(item: BankItem): string {
  return item.id?.trim() ?? "";
}

function pinnedBlocks(preferred: readonly BankItem[]): { start: number; items: BankItem[] }[] {
  const blocks: { start: number; items: BankItem[] }[] = [];
  let index = 0;
  while (index < preferred.length) {
    const setId = sequentialSetId(preferred[index]!);
    if (!setId) {
      index += 1;
      continue;
    }
    const items = [preferred[index]!];
    let next = index + 1;
    while (next < preferred.length && sequentialSetId(preferred[next]!) === setId) {
      items.push(preferred[next]!);
      next += 1;
    }
    const steps = items.map((item) =>
      typeof item.ngnPayload?.stepIndex === "number" ? item.ngnPayload.stepIndex : null
    );
    if (items.length === 6 && steps.every((step, stepIndex) => step === stepIndex + 1)) {
      blocks.push({ start: index, items });
    }
    index = next;
  }
  return blocks;
}

function shuffle<T>(items: readonly T[], seed: number): T[] {
  const out = [...items];
  let state = seed >>> 0;
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** Exact options JSON spellings for this area, including the bank's display strings. */
export function clientNeedsOptionTexts(id: NclexClientNeedsId): string[] {
  return [...(OPTION_TEXTS[id] ?? [])];
}

/** Column and label strings that mean this category. Specialty subjects are not included. */
export function clientNeedsStoredValues(id: NclexClientNeedsId): string[] {
  const category = NCLEX_2026_CLIENT_NEEDS.find((row) => row.id === id);
  const values = new Set<string>([id, ...clientNeedsOptionTexts(id)]);
  if (category?.label) values.add(category.label);
  for (const [alias, mapped] of Object.entries(ALIAS_TO_CATEGORY)) {
    if (mapped === id) values.add(alias);
  }
  return [...values];
}

export type ClientNeedsDeficit = {
  id: NclexClientNeedsId;
  have: number;
  min: number;
};

/** Categories in `items` that are under the minimum for an exam of `limit` items. */
export function clientNeedsDeficits(items: readonly BankItem[], limit: number): ClientNeedsDeficit[] {
  const targets = clientNeedsTargets(limit);
  if (!targets) return [];
  const counts = new Map<NclexClientNeedsId, number>();
  for (const item of items) {
    const category = examClientNeedsCategory(item);
    if (!category) continue;
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }
  return targets.flatMap((row) => {
    const have = counts.get(row.id) ?? 0;
    return have < row.min ? [{ id: row.id, have, min: row.min }] : [];
  });
}

/**
 * Replace a nursing draw with one that sits inside every 2026 range.
 * A short category keeps its minimum when the pool can supply it. Items with
 * no category fill only the slots left after those minimums. Returns null when
 * a minimum still cannot be met, or a pinned case already exceeds a maximum.
 */
export function composeWithinClientNeeds(params: {
  preferred: readonly BankItem[];
  pool: readonly BankItem[];
  limit: number;
  seed?: number;
}): BankItem[] | null {
  const limit = Math.max(0, params.limit);
  const targets = clientNeedsTargets(limit);
  if (!targets) return null;

  const byId = new Map<string, BankItem>();
  for (const item of [...params.preferred, ...params.pool]) {
    const id = itemId(item);
    if (id && !byId.has(id)) byId.set(id, item);
  }
  const classified = [...byId.values()].flatMap((item) => {
    const category = examClientNeedsCategory(item);
    return category ? [{ item, category }] : [];
  });
  const availableCount = new Map<NclexClientNeedsId, number>();
  for (const entry of classified) {
    availableCount.set(entry.category, (availableCount.get(entry.category) ?? 0) + 1);
  }

  const preferred = params.preferred.slice(0, limit);
  const blocks = pinnedBlocks(preferred);
  const pinnedIds = new Set(blocks.flatMap((block) => block.items.map(itemId)));
  const pinnedCounts = new Map<NclexClientNeedsId, number>();
  let pinnedUncategorized = 0;
  for (const block of blocks) {
    if (block.start + block.items.length > limit) return null;
    for (const item of block.items) {
      const category = examClientNeedsCategory(item);
      if (!category) {
        pinnedUncategorized += 1;
        continue;
      }
      pinnedCounts.set(category, (pinnedCounts.get(category) ?? 0) + 1);
    }
  }
  const floorOf = (row: ClientNeedsBound) => Math.max(row.min, pinnedCounts.get(row.id) ?? 0);
  for (const row of targets) {
    const pinned = pinnedCounts.get(row.id) ?? 0;
    if (pinned > row.max) return null;
    if ((availableCount.get(row.id) ?? 0) < floorOf(row)) return null;
  }
  const floorSum = targets.reduce((total, row) => total + floorOf(row), 0);
  if (floorSum + pinnedUncategorized > limit) return null;

  const quota = new Map<NclexClientNeedsId, number>();
  for (const row of targets) {
    const cap = Math.min(row.max, availableCount.get(row.id) ?? 0);
    quota.set(row.id, Math.min(cap, Math.max(floorOf(row), row.count)));
  }
  let sum = [...quota.values()].reduce((total, count) => total + count, 0);
  let guard = 0;
  while (sum + pinnedUncategorized > limit && guard < limit * 8) {
    guard += 1;
    const row = targets.find((candidate) => (quota.get(candidate.id) ?? 0) > floorOf(candidate));
    if (!row) return null;
    quota.set(row.id, (quota.get(row.id) ?? 0) - 1);
    sum -= 1;
  }
  if (sum + pinnedUncategorized > limit) return null;
  while (sum + pinnedUncategorized < limit && guard < limit * 8) {
    guard += 1;
    const row = targets.find((candidate) => {
      const cap = Math.min(candidate.max, availableCount.get(candidate.id) ?? 0);
      return (quota.get(candidate.id) ?? 0) < cap;
    });
    if (!row) break;
    quota.set(row.id, (quota.get(row.id) ?? 0) + 1);
    sum += 1;
  }
  const uncategorizedSlots = limit - sum - pinnedUncategorized;
  if (uncategorizedSlots < 0) return null;

  const preferredIds = new Set(preferred.map(itemId));
  const used = new Set(pinnedIds);
  const picked: BankItem[] = [];
  for (const row of targets) {
    const need = (quota.get(row.id) ?? 0) - (pinnedCounts.get(row.id) ?? 0);
    if (need < 0) return null;
    const candidates = classified.filter((entry) => {
      if (entry.category !== row.id || used.has(itemId(entry.item))) return false;
      // Steps of a multi-step case are not padding. Chosen cases are already pinned.
      return sequentialSetId(entry.item) == null;
    });
    const inPreferred = candidates.filter((entry) => preferredIds.has(itemId(entry.item)));
    const extras = shuffle(
      candidates.filter((entry) => !preferredIds.has(itemId(entry.item))),
      (params.seed ?? 1) ^ row.id.length
    );
    const chosen = [...inPreferred, ...extras].slice(0, need);
    if (chosen.length < need) return null;
    for (const entry of chosen) {
      used.add(itemId(entry.item));
      picked.push(entry.item);
    }
  }

  const uncategorized = [...byId.values()].filter(
    (item) => !examClientNeedsCategory(item) && !used.has(itemId(item)) && sequentialSetId(item) == null
  );
  const uncatPreferred = uncategorized.filter((item) => preferredIds.has(itemId(item)));
  const uncatExtras = shuffle(
    uncategorized.filter((item) => !preferredIds.has(itemId(item))),
    (params.seed ?? 1) ^ 0x5a17
  );
  const uncatChosen = [...uncatPreferred, ...uncatExtras].slice(0, uncategorizedSlots);
  if (uncatChosen.length < uncategorizedSlots) return null;
  for (const item of uncatChosen) used.add(itemId(item));

  const slots: Array<BankItem | null> = Array.from({ length: limit }, () => null);
  for (const block of blocks) {
    block.items.forEach((item, offset) => {
      slots[block.start + offset] = item;
    });
  }
  const placed = new Set(blocks.flatMap((block) => block.items.map(itemId)));
  const fillers: BankItem[] = [];
  const fillerIds = new Set<string>();
  const pushFiller = (item: BankItem) => {
    const id = itemId(item);
    if (!id || placed.has(id) || fillerIds.has(id) || !used.has(id)) return;
    fillerIds.add(id);
    fillers.push(item);
  };
  for (const item of preferred) pushFiller(item);
  for (const item of picked) pushFiller(item);
  for (const item of uncatChosen) pushFiller(item);
  const holes = slots.flatMap((slot, index) => (slot ? [] : [index]));
  if (fillers.length !== holes.length) return null;
  holes.forEach((index, offset) => {
    slots[index] = fillers[offset]!;
  });
  if (slots.some((slot) => slot == null)) return null;
  return slots as BankItem[];
}

export function clientNeedsCounts(items: readonly BankItem[]): Record<NclexClientNeedsId, number> | null {
  const counts = Object.fromEntries(NCLEX_2026_CLIENT_NEEDS.map((category) => [category.id, 0])) as Record<
    NclexClientNeedsId,
    number
  >;
  for (const item of items) {
    const category = examClientNeedsCategory(item);
    if (!category) continue;
    counts[category] += 1;
  }
  return counts;
}

export function clientNeedsWithinRanges(items: readonly BankItem[]): boolean {
  const targets = clientNeedsTargets(items.length);
  const counts = clientNeedsCounts(items);
  if (!targets || !counts) return false;
  return targets.every((row) => counts[row.id] >= row.min && counts[row.id] <= row.max);
}
