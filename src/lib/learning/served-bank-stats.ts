/**
 * Served-bank facts for the practice measure.
 *
 * Denominators, per-domain minimums, and the neutral difficulty weight come
 * from the questions students can be served right now. Nothing here names a
 * board, a blueprint list, or a bank size. Callers pass the current blueprint
 * categories and the current served rows.
 */

export type ServedBankQuestion = {
  id: string;
  /** Blueprint category id. Null when the row is not on the outline. */
  domainId: string | null;
  difficulty?: number | string | null;
  format?: string | null;
  active: boolean;
  qaPassed: boolean;
  studentEligible: boolean;
  /** Code-level hide list (wrong-key and the same student-eligibility exclusions). */
  codeHidden?: boolean;
};

export type ServedBankCategory = {
  id: string;
  label: string;
  /** 0–100 share of the outline. */
  blueprintWeightPct: number;
};

export type ServedDomainStats = {
  id: string;
  label: string;
  blueprintWeightPct: number;
  /** Questions in this area that pass the serve gate. */
  servedCount: number;
  /**
   * Answers required before this area contributes its full outline weight.
   * Equal to the served count, so it moves when questions are added or hidden.
   */
  depthMinimum: number;
};

export type ServedBankStats = {
  domains: ServedDomainStats[];
  /**
   * Weight used when a saved answer has no difficulty yet.
   * Mean of served difficulties, or 1 when the bank has none.
   */
  neutralDifficultyWeight: number;
  servedCount: number;
};

/** Active, QA-passed, student-eligible, and not on a code hide list. */
export function isCurrentlyServed(question: ServedBankQuestion): boolean {
  return (
    question.active === true &&
    question.qaPassed === true &&
    question.studentEligible === true &&
    question.codeHidden !== true
  );
}

/**
 * Numeric difficulty stored on the row. Labels and blanks are missing, not a
 * fixed easy/medium/hard scale. The caller supplies the bank's neutral weight.
 */
export function parseStoredDifficulty(value: number | string | null | undefined): number | null {
  if (value == null) return null;
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value <= 0) return null;
    return value;
  }
  const text = value.trim();
  if (!text) return null;
  const parsed = Number(text);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

export function neutralDifficultyWeight(values: Array<number | null>): number {
  const known = values.filter((value): value is number => value != null && value > 0);
  if (known.length === 0) return 1;
  const mean = known.reduce((sum, value) => sum + value, 0) / known.length;
  return Math.round(mean * 1000) / 1000;
}

export type ServedBankCountRow = {
  domainId: string | null;
  difficulty: number | null;
  count: number;
};

function uniqueCategories(categories: ServedBankCategory[]): ServedBankCategory[] {
  const rows: ServedBankCategory[] = [];
  const seen = new Set<string>();
  for (const category of categories) {
    const id = category.id.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    rows.push({
      id,
      label: category.label.trim() || id,
      blueprintWeightPct: Math.max(0, category.blueprintWeightPct),
    });
  }
  return rows;
}

/** Grouped served rows. Difficulty is repeated `count` times in the neutral mean. */
export function buildServedBankStatsFromCounts(input: {
  categories: ServedBankCategory[];
  rows: ServedBankCountRow[];
}): ServedBankStats {
  const categories = uniqueCategories(input.categories);
  const counts = new Map<string, number>();
  for (const category of categories) counts.set(category.id, 0);
  let difficultySum = 0;
  let difficultyCount = 0;
  let servedCount = 0;

  for (const row of input.rows) {
    const count = Math.max(0, Math.floor(row.count) || 0);
    if (count === 0) continue;
    servedCount += count;
    const difficulty = parseStoredDifficulty(row.difficulty);
    if (difficulty != null) {
      difficultySum += difficulty * count;
      difficultyCount += count;
    }
    const domainId = row.domainId?.trim() || "";
    if (!domainId || !counts.has(domainId)) continue;
    counts.set(domainId, (counts.get(domainId) ?? 0) + count);
  }

  return {
    domains: categories.map((category) => {
      const served = counts.get(category.id) ?? 0;
      return {
        id: category.id,
        label: category.label,
        blueprintWeightPct: category.blueprintWeightPct,
        servedCount: served,
        depthMinimum: served,
      };
    }),
    neutralDifficultyWeight: neutralDifficultyWeight(
      difficultyCount > 0 ? [difficultySum / difficultyCount] : []
    ),
    servedCount,
  };
}

export function buildServedBankStats(input: {
  categories: ServedBankCategory[];
  questions: ServedBankQuestion[];
}): ServedBankStats {
  const rows: ServedBankCountRow[] = [];
  for (const question of input.questions) {
    if (!isCurrentlyServed(question)) continue;
    rows.push({
      domainId: question.domainId,
      difficulty: parseStoredDifficulty(question.difficulty),
      count: 1,
    });
  }
  return buildServedBankStatsFromCounts({
    categories: input.categories,
    rows,
  });
}
