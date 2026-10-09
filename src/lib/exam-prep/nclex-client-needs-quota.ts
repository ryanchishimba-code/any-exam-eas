/**
 * NCSBN 2026 client-needs ranges for one exam draw.
 * An item's own options.clientNeedsCategory wins. With no client-needs value,
 * the subject counts only when it is itself a client-needs category.
 * Maternal, pediatric, and other specialty subjects stay out of the quota.
 */
import type { BankItem } from "@/lib/question-bank";
import { sequentialSetId } from "@/lib/exam-prep/sitting-clusters";
import { NCLEX_2026_CLIENT_NEEDS } from "@/lib/exam-prep/nclex/blueprint-topics-2026";
import type { NclexClientNeedsId } from "@/lib/exam-prep/nclex/types";

const CATEGORY_IDS = new Set<string>(NCLEX_2026_CLIENT_NEEDS.map((category) => category.id));

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

/**
 * Client-needs category for quota math.
 * options.clientNeedsCategory wins. A subject is used only when the item has
 * no client-needs value, and only when that subject is a category itself.
 */
export function examClientNeedsCategory(item: BankItem): NclexClientNeedsId | null {
  const fromOptions = optionsClientNeedsCategory(item);
  if (fromOptions) return categoryFromText(fromOptions);
  const stored = storedClientNeeds(item);
  if (stored.length > 0) return firstCategory(stored);
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

/**
 * Replace a nursing draw with one that sits inside every 2026 range.
 * Returns null when the classified pool cannot fill the length, including
 * when pinned case blocks already exceed a maximum.
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
  if (classified.length < limit) return null;

  const preferred = params.preferred.slice(0, limit);
  const blocks = pinnedBlocks(preferred);
  const pinnedIds = new Set(blocks.flatMap((block) => block.items.map(itemId)));
  const pinnedCounts = new Map<NclexClientNeedsId, number>();
  for (const block of blocks) {
    if (block.start + block.items.length > limit) return null;
    for (const item of block.items) {
      const category = examClientNeedsCategory(item);
      if (!category) return null;
      pinnedCounts.set(category, (pinnedCounts.get(category) ?? 0) + 1);
    }
  }
  for (const row of targets) {
    const used = pinnedCounts.get(row.id) ?? 0;
    if (used > row.max) return null;
    if (used > row.count) row.count = used;
  }
  let sum = targets.reduce((total, row) => total + row.count, 0);
  let guard = 0;
  while (sum !== limit && guard < limit * 8) {
    guard += 1;
    if (sum < limit) {
      const room = targets.find((row) => row.count < row.max);
      if (!room) return null;
      room.count += 1;
      sum += 1;
    } else {
      const room = targets.find((row) => row.count > Math.max(row.min, pinnedCounts.get(row.id) ?? 0));
      if (!room) return null;
      room.count -= 1;
      sum -= 1;
    }
  }
  if (sum !== limit) return null;

  const preferredIds = new Set(preferred.map(itemId));
  const used = new Set(pinnedIds);
  const picked: BankItem[] = [];
  for (const row of targets) {
    const need = row.count - (pinnedCounts.get(row.id) ?? 0);
    if (need < 0) return null;
    const candidates = classified.filter(
      (entry) => entry.category === row.id && !used.has(itemId(entry.item))
    );
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

  const slots: Array<BankItem | null> = Array.from({ length: limit }, () => null);
  for (const block of blocks) {
    block.items.forEach((item, offset) => {
      slots[block.start + offset] = item;
    });
  }
  const placed = new Set(blocks.flatMap((block) => block.items.map(itemId)));
  const rest = [
    ...preferred.filter((item) => used.has(itemId(item)) && !placed.has(itemId(item))),
    ...picked.filter((item) => !placed.has(itemId(item)) && !preferredIds.has(itemId(item))),
  ];
  const holes = slots.flatMap((slot, index) => (slot ? [] : [index]));
  if (rest.length !== holes.length) return null;
  holes.forEach((index, offset) => {
    slots[index] = rest[offset]!;
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
    if (!category) return null;
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
