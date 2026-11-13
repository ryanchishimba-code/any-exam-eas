import { seededShuffle } from "@/lib/assessment/shuffle";

export const NCLEX_ALL_NGN_CASE_STEPS = 6;

export type NgnMixStatus = "all" | "unseen" | "incorrect";

export type NgnMixScope = {
  subjectId?: string | null;
  blueprintAreaId?: string | null;
  /** Restrict which attempted units may fill the recipe. Default keeps every match. */
  status?: NgnMixStatus;
};

export type NgnMixCandidate = {
  id: string;
  kind: "case" | "standalone";
  /** Scored steps. Cases must be exactly 6 or they are ignored. */
  steps: number;
  subjectIds: string[];
  clientNeedId: string | null;
  unseen: boolean;
  incorrect: boolean;
};

export type NgnMixRecipe = {
  cases: number;
  standalones: number;
};

export type NgnMixPlan<Q> = {
  slots: Array<{ kind: "qbi"; item: Q } | { kind: "case"; id: string } | { kind: "standalone"; id: string }>;
  cases: number;
  standalones: number;
  qbi: number;
  scored: number;
};

const MIXED = new Set(["", "__mixed__", "mixed"]);

/**
 * Target mix for an exact All-questions length.
 * 5 and 10 stay a single standalone. 25 / 50 / 75 add one case and two standalones per 25.
 */
export function nclexAllNgnMixRecipe(limit: number): NgnMixRecipe {
  const size = Math.max(0, Math.floor(limit));
  if (size < 2) return { cases: 0, standalones: 0 };
  if (size < 25) return { cases: 0, standalones: 1 };
  const blocks = Math.floor(size / 25);
  return { cases: blocks, standalones: blocks * 2 };
}

export function nclexAllMixScoredCount(parts: {
  cases: number;
  standalones: number;
  qbi: number;
}): number {
  return parts.cases * NCLEX_ALL_NGN_CASE_STEPS + parts.standalones + parts.qbi;
}

export function ngnUnitMatchesScope(unit: Pick<NgnMixCandidate, "subjectIds" | "clientNeedId">, scope: NgnMixScope): boolean {
  const subject = scope.subjectId?.trim() ?? "";
  if (!MIXED.has(subject)) {
    const subjects = new Set(unit.subjectIds);
    if (!subjects.has(subject) && unit.clientNeedId !== subject) return false;
  }
  const area = scope.blueprintAreaId?.trim() ?? "";
  if (area && unit.clientNeedId !== area && !unit.subjectIds.includes(area)) return false;
  return true;
}

function matchesStatus(unit: NgnMixCandidate, status: NgnMixStatus): boolean {
  if (status === "unseen") return unit.unseen;
  if (status === "incorrect") return !unit.unseen && unit.incorrect;
  return true;
}

function preferUnseen<T extends Pick<NgnMixCandidate, "id" | "unseen" | "incorrect">>(
  units: readonly T[],
  seed: string
): T[] {
  const unseen = seededShuffle(units.filter((unit) => unit.unseen), `${seed}:unseen`);
  const incorrect = seededShuffle(
    units.filter((unit) => !unit.unseen && unit.incorrect),
    `${seed}:incorrect`
  );
  const rest = seededShuffle(
    units.filter((unit) => !unit.unseen && !unit.incorrect),
    `${seed}:seen`
  );
  return [...unseen, ...incorrect, ...rest];
}

type Block<Q> =
  | { kind: "case"; id: string }
  | { kind: "standalone"; id: string }
  | { kind: "qbi"; item: Q };

/**
 * Exact-size mix. Incomplete cases never enter. Missing NGN units are replaced by QBI
 * so the scored length stays `limit` whenever the QBI pool can fill the gap.
 * Returns null when even an all-QBI session cannot reach `limit`.
 */
export function packNclexAllNgnSession<Q>(params: {
  limit: number;
  qbi: readonly Q[];
  cases: readonly NgnMixCandidate[];
  standalones: readonly NgnMixCandidate[];
  seed: string;
  scope?: NgnMixScope;
}): NgnMixPlan<Q> | null {
  const limit = Math.max(0, Math.floor(params.limit));
  if (limit <= 0 || params.qbi.length <= 0) return null;
  const scope = params.scope ?? {};
  const status = scope.status ?? "all";
  const recipe = nclexAllNgnMixRecipe(limit);

  const eligibleCases = preferUnseen(
    params.cases.filter(
      (unit) =>
        unit.kind === "case" &&
        unit.steps === NCLEX_ALL_NGN_CASE_STEPS &&
        ngnUnitMatchesScope(unit, scope) &&
        matchesStatus(unit, status)
    ),
    `${params.seed}:cases`
  );
  const eligibleStandalones = preferUnseen(
    params.standalones.filter(
      (unit) =>
        unit.kind === "standalone" &&
        unit.steps === 1 &&
        ngnUnitMatchesScope(unit, scope) &&
        matchesStatus(unit, status)
    ),
    `${params.seed}:standalones`
  );

  let caseCount = Math.min(recipe.cases, eligibleCases.length);
  let standaloneCount = Math.min(recipe.standalones, eligibleStandalones.length);
  while (caseCount * NCLEX_ALL_NGN_CASE_STEPS + standaloneCount > limit) {
    if (standaloneCount > 0) standaloneCount -= 1;
    else caseCount -= 1;
  }
  while (limit - (caseCount * NCLEX_ALL_NGN_CASE_STEPS + standaloneCount) > params.qbi.length) {
    if (standaloneCount > 0) standaloneCount -= 1;
    else if (caseCount > 0) caseCount -= 1;
    else break;
  }

  const qbiNeed = limit - (caseCount * NCLEX_ALL_NGN_CASE_STEPS + standaloneCount);
  if (qbiNeed < 0 || params.qbi.length < qbiNeed) return null;
  if (caseCount === 0 && standaloneCount === 0) return null;

  const blocks: Block<Q>[] = [
    ...eligibleCases.slice(0, caseCount).map((unit) => ({ kind: "case" as const, id: unit.id })),
    ...eligibleStandalones
      .slice(0, standaloneCount)
      .map((unit) => ({ kind: "standalone" as const, id: unit.id })),
    ...params.qbi.slice(0, qbiNeed).map((item) => ({ kind: "qbi" as const, item })),
  ];
  const ordered = seededShuffle(blocks, `${params.seed}:order`);
  const slots: NgnMixPlan<Q>["slots"] = [];
  for (const block of ordered) {
    if (block.kind === "qbi") slots.push({ kind: "qbi", item: block.item });
    else slots.push(block);
  }

  const plan = {
    slots,
    cases: caseCount,
    standalones: standaloneCount,
    qbi: qbiNeed,
    scored: nclexAllMixScoredCount({
      cases: caseCount,
      standalones: standaloneCount,
      qbi: qbiNeed,
    }),
  };
  return plan.scored === limit ? plan : null;
}

/** Case ids occupy six consecutive slots and are never split. */
export function expandNgnMixSlots<Q>(slots: NgnMixPlan<Q>["slots"]): Array<
  | { kind: "qbi"; item: Q }
  | { kind: "case"; id: string; step: number }
  | { kind: "standalone"; id: string }
> {
  const expanded: Array<
    | { kind: "qbi"; item: Q }
    | { kind: "case"; id: string; step: number }
    | { kind: "standalone"; id: string }
  > = [];
  for (const slot of slots) {
    if (slot.kind === "case") {
      for (let step = 1; step <= NCLEX_ALL_NGN_CASE_STEPS; step += 1) {
        expanded.push({ kind: "case", id: slot.id, step });
      }
    } else if (slot.kind === "standalone") {
      expanded.push(slot);
    } else {
      expanded.push(slot);
    }
  }
  return expanded;
}
