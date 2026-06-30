/**
 * Blueprint-weighted, diversity-maximizing selection over a server-ready pool.
 *
 * Pure (no DB): given a candidate pool of BankItems + a blueprint, pick a
 * balanced set that (a) hits per-domain target counts, (b) spreads concepts so
 * the downstream sequencer has room to anti-cluster, (c) honors a target
 * difficulty mix, and (d) varies item formats. Returns a Selection Summary
 * with target-vs-actual counts and shortfall flags.
 */

import type { BankItem } from "@/lib/question-bank";
import {
  allocateQuestionsByBlueprint,
  type ExamBlueprint,
} from "@/lib/engine/blueprints";

export type DifficultyPreference = "balanced" | "easier" | "harder";

export type SelectionConfig = {
  numQuestions: number;
  /** Blueprint category ids/labels to lightly overweight. */
  focusAreas?: string[];
  difficultyPreference?: DifficultyPreference;
  /** Seed for reproducible selection. */
  seed?: number;
};

export type DomainSelectionRow = {
  domainId: string;
  domainLabel: string;
  targetCount: number;
  selectedCount: number;
  shortfall: number;
};

export type SelectionSummary = {
  requested: number;
  selected: number;
  rows: DomainSelectionRow[];
  difficultyMix: Record<"Easy" | "Medium" | "Hard", number>;
  formatMix: Record<string, number>;
  notes: string[];
};

export type BlueprintSelectionResult = {
  items: BankItem[];
  summary: SelectionSummary;
};

const DIFFICULTY_TARGETS: Record<DifficultyPreference, { Easy: number; Medium: number; Hard: number }> = {
  balanced: { Easy: 0.25, Medium: 0.5, Hard: 0.25 },
  easier: { Easy: 0.4, Medium: 0.45, Hard: 0.15 },
  harder: { Easy: 0.15, Medium: 0.45, Hard: 0.4 },
};

/**
 * 2026 NAPLEX competency-area slugs map back to the 2025 five-area blueprint
 * used for selection so AI-generated full-exam items slot in cleanly.
 */
const SLUG_NORMALIZATION: Record<string, string> = {
  "naplex-2026-pharmacotherapy": "naplex-area3-treatment-planning",
  "naplex-2026-patient-centered-care": "naplex-area3-treatment-planning",
  "naplex-2026-pharmacist-tasks": "naplex-area2-therapeutics",
  "naplex-2026-medication-dispensing": "naplex-area2-therapeutics",
  "naplex-2026-drug-information": "naplex-area1-foundations",
  "naplex-2026-health-wellness": "naplex-area4-safety",
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

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function difficultyBand(difficulty?: number): "Easy" | "Medium" | "Hard" {
  if (difficulty === undefined || difficulty === null) return "Medium";
  if (difficulty <= 2) return "Easy";
  if (difficulty === 3) return "Medium";
  return "Hard";
}

const PROVENANCE_TAG =
  /^(naplex|v\d+|naplex-20\d\d|curated|seed|bulk-bank|full-exam.*|exam-\d+|physician-educator|naplex-polished|nclex-polished|cjmm-polished|high-yield|case-vignette|.*-polished|cjmm-.*|ngn-.*|qa-passed)$/;

export function conceptKeysFor(item: BankItem): string[] {
  const keys = new Set<string>();
  for (const tag of item.tags ?? []) {
    const t = tag.trim().toLowerCase();
    // Skip provenance/bookkeeping tags — they aren't real concepts and would
    // create false collisions (e.g. every item tagged "naplex").
    if (!t || t.length < 3 || PROVENANCE_TAG.test(t)) continue;
    keys.add(t);
  }
  // blueprintTopic is a specific high-yield concept; topicCategory is excluded
  // because it is usually the broad subject slug (e.g. "pharmacology") and would
  // collide across most items.
  if (item.blueprintTopic) keys.add(`topic:${item.blueprintTopic.trim().toLowerCase()}`);
  return [...keys];
}

export const NAPLEX_AREA_IDS = new Set([
  "naplex-area1-foundations",
  "naplex-area2-therapeutics",
  "naplex-area3-treatment-planning",
  "naplex-area4-safety",
  "naplex-area5-management",
]);

/** Collapse 2025 area slugs + 2026 competency slugs to the canonical area id. */
export function normalizeNaplexDomain(domain: string | undefined): string {
  if (!domain) return "__unclassified__";
  if (NAPLEX_AREA_IDS.has(domain)) return domain;
  return SLUG_NORMALIZATION[domain] ?? "__unclassified__";
}

function normalizeDomain(domain: string | undefined, validIds: Set<string>): string {
  if (!domain) return "__unclassified__";
  if (validIds.has(domain)) return domain;
  const mapped = SLUG_NORMALIZATION[domain];
  if (mapped && validIds.has(mapped)) return mapped;
  return "__unclassified__";
}

/**
 * Exam-agnostic domain normalization for any blueprint: returns the matching
 * category id, or "__unclassified__" when the item's domain isn't a known
 * category. Used by the generic exam composer.
 */
export function normalizeBlueprintDomain(
  domain: string | undefined,
  validIds: Set<string>
): string {
  return normalizeDomain(domain, validIds);
}

/** Per-blueprint-category integer target counts for `numQuestions`. */
export function domainTargets(
  numQuestions: number,
  blueprint: ExamBlueprint,
  focusAreas?: string[]
): Map<string, number> {
  const slots = allocateQuestionsByBlueprint(numQuestions, blueprint);
  const targets = new Map<string, number>();
  for (const cat of blueprint.categories) targets.set(cat.id, 0);
  for (const slot of slots) targets.set(slot.categoryId, (targets.get(slot.categoryId) ?? 0) + 1);

  if (!focusAreas?.length) return targets;

  // Light overweight: move up to ~12% of items from the largest non-focus
  // categories into focus categories, without zeroing any category.
  const focusSet = new Set(
    focusAreas.map((f) => f.trim().toLowerCase())
  );
  const isFocus = (cat: { id: string; label: string }) =>
    focusSet.has(cat.id.toLowerCase()) || focusSet.has(cat.label.toLowerCase());

  const focusCats = blueprint.categories.filter(isFocus);
  if (!focusCats.length) return targets;

  let movable = Math.round(numQuestions * 0.12);
  const donors = blueprint.categories
    .filter((c) => !isFocus(c))
    .sort((a, b) => (targets.get(b.id) ?? 0) - (targets.get(a.id) ?? 0));

  let di = 0;
  let fi = 0;
  while (movable > 0 && donors.length > 0) {
    const donor = donors[di % donors.length];
    const focus = focusCats[fi % focusCats.length];
    const donorCount = targets.get(donor.id) ?? 0;
    if (donorCount > 1) {
      targets.set(donor.id, donorCount - 1);
      targets.set(focus.id, (targets.get(focus.id) ?? 0) + 1);
      movable -= 1;
      fi += 1;
    }
    di += 1;
    if (di > donors.length * numQuestions) break; // safety
  }

  return targets;
}

type Scratch = {
  seenConcepts: Set<string>;
  diffCounts: Record<"Easy" | "Medium" | "Hard", number>;
  formatCounts: Map<string, number>;
};

function scoreCandidate(
  item: BankItem,
  scratch: Scratch,
  diffTarget: { Easy: number; Medium: number; Hard: number },
  totalTarget: number
): number {
  let score = 0;

  const concepts = conceptKeysFor(item);
  const novel = concepts.filter((c) => !scratch.seenConcepts.has(c)).length;
  score += novel * 3;

  const band = difficultyBand(item.difficulty);
  const targetForBand = diffTarget[band] * totalTarget;
  const haveForBand = scratch.diffCounts[band];
  if (haveForBand < targetForBand) score += 2;
  else score -= (haveForBand - targetForBand) * 0.5;

  const fmt = item.itemType ?? "mcq";
  const fmtCount = scratch.formatCounts.get(fmt) ?? 0;
  score -= fmtCount * 0.3;

  return score;
}

function commit(item: BankItem, scratch: Scratch): void {
  for (const c of conceptKeysFor(item)) scratch.seenConcepts.add(c);
  scratch.diffCounts[difficultyBand(item.difficulty)] += 1;
  const fmt = item.itemType ?? "mcq";
  scratch.formatCounts.set(fmt, (scratch.formatCounts.get(fmt) ?? 0) + 1);
}

/** Greedily pick `count` items from a bucket, maximizing diversity. */
function selectFromBucket(
  bucket: BankItem[],
  count: number,
  scratch: Scratch,
  diffTarget: { Easy: number; Medium: number; Hard: number },
  totalTarget: number
): BankItem[] {
  const chosen: BankItem[] = [];
  const pool = [...bucket];
  while (chosen.length < count && pool.length > 0) {
    let bestIdx = 0;
    let bestScore = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < pool.length; i++) {
      const s = scoreCandidate(pool[i], scratch, diffTarget, totalTarget);
      if (s > bestScore) {
        bestScore = s;
        bestIdx = i;
      }
    }
    const [picked] = pool.splice(bestIdx, 1);
    chosen.push(picked);
    commit(picked, scratch);
  }
  return chosen;
}

export function selectBlueprintBalancedSet(
  pool: BankItem[],
  blueprint: ExamBlueprint,
  config: SelectionConfig
): BlueprintSelectionResult {
  const { numQuestions } = config;
  const rng = mulberry32(config.seed ?? 0x51ed270b);
  const diffTarget = DIFFICULTY_TARGETS[config.difficultyPreference ?? "balanced"];

  const validIds = new Set(blueprint.categories.map((c) => c.id));
  const labelById = new Map(blueprint.categories.map((c) => [c.id, c.label] as const));
  const targets = domainTargets(numQuestions, blueprint, config.focusAreas);

  const buckets = new Map<string, BankItem[]>();
  for (const item of shuffle(pool, rng)) {
    const domain = normalizeDomain(item.blueprintDomain, validIds);
    if (!buckets.has(domain)) buckets.set(domain, []);
    buckets.get(domain)!.push(item);
  }

  const scratch: Scratch = {
    seenConcepts: new Set(),
    diffCounts: { Easy: 0, Medium: 0, Hard: 0 },
    formatCounts: new Map(),
  };

  const selected: BankItem[] = [];
  const usedIds = new Set<string>();
  const rows: DomainSelectionRow[] = [];

  // Process categories largest-target-first so scarce-pool pressure lands on
  // small domains last (better backfill behavior).
  const orderedCats = [...blueprint.categories].sort(
    (a, b) => (targets.get(b.id) ?? 0) - (targets.get(a.id) ?? 0)
  );

  for (const cat of orderedCats) {
    const target = targets.get(cat.id) ?? 0;
    const bucket = (buckets.get(cat.id) ?? []).filter((i) => !usedIds.has(itemKey(i)));
    const picks = selectFromBucket(bucket, target, scratch, diffTarget, numQuestions);
    for (const p of picks) {
      usedIds.add(itemKey(p));
      selected.push(p);
    }
    rows.push({
      domainId: cat.id,
      domainLabel: cat.label,
      targetCount: target,
      selectedCount: picks.length,
      shortfall: Math.max(0, target - picks.length),
    });
  }

  // Backfill to reach numQuestions from any remaining server-ready items.
  if (selected.length < numQuestions) {
    const leftover = pool.filter((i) => !usedIds.has(itemKey(i)));
    const fill = selectFromBucket(
      leftover,
      numQuestions - selected.length,
      scratch,
      diffTarget,
      numQuestions
    );
    for (const p of fill) {
      usedIds.add(itemKey(p));
      selected.push(p);
      const domain = normalizeDomain(p.blueprintDomain, validIds);
      const row = rows.find((r) => r.domainId === domain);
      if (row) {
        row.selectedCount += 1;
        row.shortfall = Math.max(0, row.targetCount - row.selectedCount);
      }
    }
  }

  const notes: string[] = [];
  const shortfalls = rows.filter((r) => r.shortfall > 0);
  if (shortfalls.length > 0) {
    notes.push(
      `Pool short in: ${shortfalls
        .map((r) => `${labelById.get(r.domainId) ?? r.domainId} (−${r.shortfall})`)
        .join(", ")}. Backfilled from adjacent domains to preserve length.`
    );
  }
  if (selected.length < numQuestions) {
    notes.push(
      `Only ${selected.length}/${numQuestions} server-ready items available — bank lacks enough qa-passed NAPLEX questions.`
    );
  }
  if (notes.length === 0) notes.push("Blueprint targets met within tolerance.");

  const difficultyMix = { Easy: 0, Medium: 0, Hard: 0 };
  const formatMix: Record<string, number> = {};
  for (const item of selected) {
    difficultyMix[difficultyBand(item.difficulty)] += 1;
    const fmt = item.itemType ?? "mcq";
    formatMix[fmt] = (formatMix[fmt] ?? 0) + 1;
  }

  return {
    items: selected,
    summary: {
      requested: numQuestions,
      selected: selected.length,
      rows,
      difficultyMix,
      formatMix,
      notes,
    },
  };
}

function itemKey(item: BankItem): string {
  return item.id ?? `${item.subjectId ?? ""}:${item.question.trim().toLowerCase()}`;
}
