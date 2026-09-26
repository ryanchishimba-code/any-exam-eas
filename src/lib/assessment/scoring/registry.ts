import type { ScorableItem, ScoringRule } from "@/lib/assessment/types";

/**
 * NCSBN NGN scoring, ported 1:1 from the Python reference in the pilot brief.
 * SATA/highlight +1/-1 floor 0; select-N 0/1 truncated to N; matrix MC 0/1 per row;
 * matrix MR +/- summed per column, each column floored at 0; cloze 0/1 per dropdown;
 * rationale dyad = 1 only if both, triad = 0 unless the cause is correct, then +1
 * per correct effect; bow-tie 0/1 per slot, max 5, action/monitor tokens accepted
 * in either of their two slots.
 */

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as JsonRecord;
  }
  return {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function uniquePreserve(values: unknown[]): unknown[] {
  const seen = new Set<unknown>();
  const out: unknown[] = [];
  for (const value of values) {
    if (seen.has(value)) continue;
    seen.add(value);
    out.push(value);
  }
  return out;
}

function includesUnknown(list: unknown[], value: unknown): boolean {
  return list.some((entry) => entry === value);
}

export function score(item: ScorableItem, resp: unknown): number {
  const f = item.responseFormat;
  const p = asRecord(item.payload);

  if (f === "mc_single") {
    return resp === p.key ? 1 : 0;
  }

  if (f === "mr_select_n") {
    const n = typeof p.n === "number" ? p.n : 0;
    const keys = asArray(p.keys);
    const sel = uniquePreserve(asArray(resp)).slice(0, n);
    return sel.reduce<number>((sum, selected) => sum + (includesUnknown(keys, selected) ? 1 : 0), 0);
  }

  if (f === "mr_sata" || f === "highlight_text") {
    const sel = new Set(asArray(resp));
    const keys = new Set(asArray(p.keys));
    let overlap = 0;
    let extra = 0;
    for (const selected of sel) {
      if (keys.has(selected)) overlap += 1;
      else extra += 1;
    }
    return Math.max(0, overlap - extra);
  }

  if (f === "matrix_mc") {
    const response = asRecord(resp);
    return asArray(p.rows).reduce<number>((sum, row) => {
      const record = asRecord(row);
      const id = record.id;
      return sum + (response[String(id)] === record.key ? 1 : 0);
    }, 0);
  }

  if (f === "matrix_mr") {
    const response = asRecord(resp);
    let total = 0;
    for (const column of asArray(p.columns)) {
      const cid = asRecord(column).id;
      let plus = 0;
      let minus = 0;
      for (const row of asArray(p.rows)) {
        const record = asRecord(row);
        const chosenList = asArray(response[String(record.id)]);
        const chosen = includesUnknown(chosenList, cid);
        const rowKeys = asArray(record.keys);
        if (chosen && includesUnknown(rowKeys, cid)) plus += 1;
        else if (chosen) minus += 1;
      }
      total += Math.max(0, plus - minus);
    }
    return total;
  }

  if (f === "dropdown_cloze") {
    const response = asRecord(resp);
    return asArray(p.dropdowns).reduce<number>((sum, dropdown) => {
      const record = asRecord(dropdown);
      return sum + (response[String(record.id)] === record.key ? 1 : 0);
    }, 0);
  }

  if (f === "dropdown_rationale") {
    const response = asRecord(resp);
    const dropdowns = asArray(p.dropdowns).map(asRecord);
    const cause = dropdowns.find((dropdown) => dropdown.role === "cause");
    const effects = dropdowns.filter((dropdown) => dropdown.role === "effect");
    if (!cause || effects.length === 0) {
      throw new Error(f);
    }
    if (p.kind === "dyad") {
      const effect = effects[0];
      return response[String(cause.id)] === cause.key && response[String(effect?.id)] === effect?.key
        ? 1
        : 0;
    }
    if (response[String(cause.id)] !== cause.key) return 0;
    return effects.reduce<number>(
      (sum, effect) => sum + (response[String(effect.id)] === effect.key ? 1 : 0),
      0
    );
  }

  if (f === "bowtie") {
    const response = asRecord(resp);
    let pts = 0;
    const conditionKeys = asArray(asRecord(p.condition).keys);
    if (response.condition === conditionKeys[0]) pts += 1;
    for (const part of ["actions", "monitor"] as const) {
      const keys = asArray(asRecord(p[part]).keys);
      const sel = uniquePreserve(asArray(response[part])).slice(0, 2);
      pts += sel.reduce<number>((sum, selected) => sum + (includesUnknown(keys, selected) ? 1 : 0), 0);
    }
    return pts;
  }

  throw new Error(f);
}

export function perfect(item: ScorableItem): unknown {
  const f = item.responseFormat;
  const p = asRecord(item.payload);

  if (f === "mc_single") return p.key;
  if (f === "mr_sata" || f === "mr_select_n" || f === "highlight_text") {
    return [...asArray(p.keys)];
  }
  if (f === "matrix_mc") {
    const out: Record<string, unknown> = {};
    for (const row of asArray(p.rows)) {
      const record = asRecord(row);
      out[String(record.id)] = record.key;
    }
    return out;
  }
  if (f === "matrix_mr") {
    const out: Record<string, unknown> = {};
    for (const row of asArray(p.rows)) {
      const record = asRecord(row);
      out[String(record.id)] = [...asArray(record.keys)];
    }
    return out;
  }
  if (f === "dropdown_cloze" || f === "dropdown_rationale") {
    const out: Record<string, unknown> = {};
    for (const dropdown of asArray(p.dropdowns)) {
      const record = asRecord(dropdown);
      out[String(record.id)] = record.key;
    }
    return out;
  }
  if (f === "bowtie") {
    return {
      condition: asArray(asRecord(p.condition).keys)[0],
      actions: [...asArray(asRecord(p.actions).keys)],
      monitor: [...asArray(asRecord(p.monitor).keys)],
    };
  }
  throw new Error(f);
}

/** Student-facing partial-credit lines. Only +/- selection formats emit lines. */
export function explainPointsLost(item: ScorableItem, resp: unknown): string[] {
  const f = item.responseFormat;
  const p = asRecord(item.payload);
  const lines: string[] = [];
  if (f === "mr_sata" || f === "highlight_text") {
    const keys = new Set(asArray(p.keys).map((key) => String(key)));
    const sel = new Set(asArray(resp).map((key) => String(key)));
    for (const selected of [...sel].filter((key) => keys.has(key)).sort()) {
      lines.push(`+1 ${selected}: correct selection`);
    }
    for (const selected of [...sel].filter((key) => !keys.has(key)).sort()) {
      lines.push(`-1 ${selected}: incorrect selection (+/- scoring subtracts)`);
    }
    for (const missed of [...keys].filter((key) => !sel.has(key)).sort()) {
      lines.push(` 0 ${missed}: missed correct answer`);
    }
  }
  return lines;
}

const FORMATS_BY_RULE: Record<ScoringRule, ReadonlySet<string>> = {
  zero_one: new Set(["mc_single", "mr_select_n", "matrix_mc", "dropdown_cloze", "bowtie"]),
  plus_minus: new Set(["mr_sata", "highlight_text", "matrix_mr"]),
  rationale: new Set(["dropdown_rationale"]),
};

function scoreRule(rule: ScoringRule, item: ScorableItem, resp: unknown): number {
  const allowed = FORMATS_BY_RULE[rule];
  if (!allowed.has(item.responseFormat)) {
    throw new Error(`scoring rule ${rule} does not apply to ${item.responseFormat}`);
  }
  return score(item, resp);
}

export const scoringRegistry = {
  zero_one: (item: ScorableItem, resp: unknown) => scoreRule("zero_one", item, resp),
  plus_minus: (item: ScorableItem, resp: unknown) => scoreRule("plus_minus", item, resp),
  rationale: (item: ScorableItem, resp: unknown) => scoreRule("rationale", item, resp),
};
