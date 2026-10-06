/**
 * Decides whether a seed upsert may overwrite a bank row.
 *
 * contentHash is sha256(fieldId|subjectId|scenario|stem). It does not include
 * correctAnswer or explanation, so a key fix keeps the same hash and the
 * nightly sync would otherwise write the seed key back over the correction.
 */

export const KEYFIX_BACKUP_TABLES = [
  "qbi_naplex_keyfix_backup_20260927",
  "qbi_keyfix_backup_20260927",
  "qbi_keyfix_backup_20260927_b2",
  // 2026-10-05 batch 1. Holds the pre-rewrite hashes so a later seed match
  // cannot insert a second copy after the live contentHash moved.
  "qbi_fixes_task5_backup_20261005",
] as const;

export type SeedExistingRow = {
  id: string;
  question: string;
  correctAnswer: string;
  options: string;
  active: boolean;
  manualCorrection?: boolean | null;
  generationMeta?: unknown;
};

export type SeedIncomingContent = {
  question: string;
  correctAnswer: string;
  options: string;
  contentHash: string;
};

export type SeedUpsertDecision =
  | { action: "create" }
  | { action: "skip"; reason: "unchanged" }
  | { action: "skip"; reason: "manual-correction"; id: string }
  | { action: "update"; active: boolean };

export function generationMetaLocksSeed(meta: unknown): boolean {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return false;
  const record = meta as Record<string, unknown>;
  return record.manualCorrection === true || record.keyFix === true;
}

export function rowIsManuallyCorrected(
  existing: Pick<SeedExistingRow, "id" | "manualCorrection" | "generationMeta">,
  protectedIds: ReadonlySet<string>
): boolean {
  return (
    existing.manualCorrection === true ||
    generationMetaLocksSeed(existing.generationMeta) ||
    protectedIds.has(existing.id)
  );
}

/**
 * Inactive rows and code-hide-list rows stay at their current `active` value.
 * A visible row can be refreshed to active.
 */
export function nextSeedActive(existing: Pick<SeedExistingRow, "id" | "active">, hideIds: ReadonlySet<string>): boolean {
  if (!existing.active || hideIds.has(existing.id)) return existing.active;
  return true;
}

export function decideSeedUpsert(input: {
  existing: SeedExistingRow | null;
  incoming: SeedIncomingContent;
  protectedIds: ReadonlySet<string>;
  /** contentHash values snapshotted in a key-fix backup. */
  backupHashes: ReadonlySet<string>;
  hideIds: ReadonlySet<string>;
}): SeedUpsertDecision {
  const { existing, incoming, protectedIds, backupHashes, hideIds } = input;

  if (!existing) {
    if (backupHashes.has(incoming.contentHash)) {
      return { action: "skip", reason: "manual-correction", id: incoming.contentHash };
    }
    return { action: "create" };
  }

  if (rowIsManuallyCorrected(existing, protectedIds)) {
    return { action: "skip", reason: "manual-correction", id: existing.id };
  }

  const active = nextSeedActive(existing, hideIds);
  const contentSame =
    existing.question === incoming.question &&
    existing.correctAnswer === incoming.correctAnswer &&
    existing.options === incoming.options;

  if (contentSame && existing.active === active) {
    return { action: "skip", reason: "unchanged" };
  }

  return { action: "update", active };
}

type IdRecord = Record<string, unknown>;

export function collectHandFixedIds(files: {
  naplexProposed: IdRecord;
  nclexBatch1: IdRecord;
  nclexBatch2: IdRecord;
  nclexTypos: IdRecord;
  naplexTypos: IdRecord;
}): { proposedIds: string[]; typoOnlyIds: string[]; ids: string[] } {
  const proposed = new Set<string>([
    ...Object.keys(files.naplexProposed),
    ...Object.keys(files.nclexBatch1),
    ...Object.keys(files.nclexBatch2),
  ]);
  const typoOnly = [...Object.keys(files.nclexTypos), ...Object.keys(files.naplexTypos)].filter(
    (id) => !proposed.has(id)
  );
  return {
    proposedIds: [...proposed],
    typoOnlyIds: typoOnly,
    ids: [...proposed, ...typoOnly],
  };
}
