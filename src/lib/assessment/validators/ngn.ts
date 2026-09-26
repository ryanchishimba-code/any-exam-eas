import { getBoardProfile } from "@/lib/assessment/profiles/nclex-rn-2026";
import type { BoardProfile } from "@/lib/assessment/profiles/types";
import { perfect, score } from "@/lib/assessment/scoring/registry";
import type {
  ChartTab,
  NgnCase,
  NgnItem,
  PilotDocument,
  SourceRef,
  ValidationIssue,
} from "@/lib/assessment/types";
import { ITEM_TYPES, RESPONSE_FORMATS, SCORING_RULES } from "@/lib/assessment/types";

const ABSOLUTE_WORD = /\b(always|never|all|none|only|every|must)\b/i;
const UNIT_IN_CELL =
  /(°C|°F|\/min|mm Hg|%|mg\/dL|mmol\/L|mEq\/L|g\/dL|\/10|\bmL\b)/;

function issue(level: ValidationIssue["level"], path: string, message: string): ValidationIssue {
  return { level, path, message };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function optionsOf(value: unknown): { id: string; text: string }[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const options: { id: string; text: string }[] = [];
  for (const entry of value) {
    const record = asRecord(entry);
    if (!record || typeof record.id !== "string" || typeof record.text !== "string") return null;
    options.push({ id: record.id, text: record.text });
  }
  return options;
}

function uniqueIds(options: { id: string }[]): boolean {
  return new Set(options.map((option) => option.id)).size === options.length;
}

function walkStrings(value: unknown, visit: (text: string, path: string) => void, path: string) {
  if (typeof value === "string") {
    visit(value, path);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => walkStrings(entry, visit, `${path}[${index}]`));
    return;
  }
  const record = asRecord(value);
  if (!record) return;
  for (const [key, entry] of Object.entries(record)) {
    walkStrings(entry, visit, `${path}.${key}`);
  }
}

function checkPhysiologicText(text: string, path: string, issues: ValidationIssue[]) {
  for (const match of text.matchAll(/(-?\d+(?:\.\d+)?)\s*°C/g)) {
    const value = Number(match[1]);
    // Small values are rises ("a rise of 1.5 °C"), not absolute body temperatures.
    if (value > 45) {
      issues.push(issue("error", path, `temperature ${value} °C is outside 25–45`));
    }
  }
  for (const match of text.matchAll(/(\d{2,3})\s*\/\s*(\d{2,3})\s*mm Hg/g)) {
    const systolic = Number(match[1]);
    const diastolic = Number(match[2]);
    if (systolic < 40 || systolic > 280 || diastolic < 20 || diastolic > 180 || systolic <= diastolic) {
      issues.push(
        issue("error", path, `blood pressure ${systolic}/${diastolic} mm Hg is outside physiologic bounds`)
      );
    }
  }
  for (const match of text.matchAll(/(?:SpO2[^%]{0,24})?(\d{2,3})\s*%\s*(?:RA|on\b|\d+\s*L\b)/gi)) {
    const value = Number(match[1]);
    if (value < 50 || value > 100) {
      issues.push(issue("error", path, `oxygen saturation ${value}% is outside 50–100`));
    }
  }
  for (const match of text.matchAll(/(\d{1,3}(?:\.\d+)?)\s*\/\s*min/g)) {
    const value = Number(match[1]);
    if (value < 0 || value > 300) {
      issues.push(issue("error", path, `rate ${value}/min is outside 0–300`));
    }
  }
  for (const match of text.matchAll(/(\d{1,2}(?:\.\d+)?)\s*\/\s*10\b/g)) {
    const value = Number(match[1]);
    if (value < 0 || value > 10) {
      issues.push(issue("error", path, `pain ${value}/10 is outside 0–10`));
    }
  }
  for (const match of text.matchAll(/(\d+(?:\.\d+)?)\s*mEq\/L/g)) {
    const value = Number(match[1]);
    if (value < 0 || value > 200) {
      issues.push(issue("error", path, `${value} mEq/L is outside 0–200`));
    }
  }
  for (const match of text.matchAll(/(\d+(?:\.\d+)?)\s*mmol\/L/g)) {
    const value = Number(match[1]);
    if (value < 0 || value > 40) {
      issues.push(issue("error", path, `${value} mmol/L is outside 0–40`));
    }
  }
  for (const match of text.matchAll(/(\d+(?:\.\d+)?)\s*mg\/dL/g)) {
    const value = Number(match[1]);
    if (value < 0 || value > 2000) {
      issues.push(issue("error", path, `${value} mg/dL is outside 0–2000`));
    }
  }
  for (const match of text.matchAll(/(\d+(?:\.\d+)?)\s*g\/dL/g)) {
    const value = Number(match[1]);
    if (value < 0 || value > 30) {
      issues.push(issue("error", path, `${value} g/dL is outside 0–30`));
    }
  }
}

function warnCueing(options: { id: string; text: string }[], keys: Set<string>, path: string, issues: ValidationIssue[]) {
  for (const option of options) {
    if (ABSOLUTE_WORD.test(option.text)) {
      issues.push(
        issue("warning", path, `option ${option.id} uses an absolute word ("${option.text.slice(0, 80)}")`)
      );
    }
  }
  if (options.length < 2) return;
  const ranked = [...options].sort((a, b) => b.text.length - a.text.length);
  const longest = ranked[0];
  const next = ranked[1];
  if (longest && next && longest.text.length > next.text.length && keys.has(longest.id)) {
    issues.push(issue("warning", path, `longest option ${longest.id} is a keyed answer`));
  }
}

function checkOptionGroup(
  options: { id: string; text: string }[] | null,
  keys: string[],
  path: string,
  issues: ValidationIssue[],
  limits?: { exactKeys?: number; minKeys?: number }
): options is { id: string; text: string }[] {
  if (!options || !uniqueIds(options)) {
    issues.push(issue("error", path, "options must be a non-empty list of unique {id, text}"));
    return false;
  }
  const ids = new Set(options.map((option) => option.id));
  if (keys.some((key) => !ids.has(key))) {
    issues.push(issue("error", path, "a key is not one of the options"));
    return false;
  }
  if (limits?.exactKeys !== undefined && keys.length !== limits.exactKeys) {
    issues.push(issue("error", path, `expected exactly ${limits.exactKeys} keys, found ${keys.length}`));
  }
  if (limits?.minKeys !== undefined && keys.length < limits.minKeys) {
    issues.push(issue("error", path, `expected at least ${limits.minKeys} keys`));
  }
  return true;
}

function stringKeys(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string")) return null;
  return value as string[];
}

function checkShape(item: NgnItem, profile: BoardProfile, path: string, issues: ValidationIssue[]) {
  const payload = item.payload;
  const format = item.responseFormat;

  if (format === "mc_single") {
    const options = optionsOf(payload.options);
    const key = typeof payload.key === "string" ? payload.key : "";
    if (checkOptionGroup(options, key ? [key] : [], path, issues, { exactKeys: 1 })) {
      warnCueing(options, new Set([key]), path, issues);
    }
    return;
  }

  if (format === "mr_sata" || format === "mr_select_n" || format === "highlight_text") {
    if (format === "highlight_text") {
      const tokens = Array.isArray(payload.tokens) ? payload.tokens : null;
      const keys = stringKeys(payload.keys);
      if (!tokens || !keys) {
        issues.push(issue("error", path, "highlight_text requires tokens and string keys"));
        return;
      }
      const selectable = tokens
        .map((token) => asRecord(token))
        .filter((token): token is Record<string, unknown> => Boolean(token && token.selectable === true));
      if (selectable.some((token) => typeof token.id !== "string" || typeof token.text !== "string")) {
        issues.push(issue("error", path, "selectable highlight tokens need id and text"));
        return;
      }
      const ids = new Set(selectable.map((token) => String(token.id)));
      if (new Set(selectable.map((token) => token.id)).size !== selectable.length) {
        issues.push(issue("error", path, "highlight token ids must be unique"));
      }
      if (keys.length < 1 || keys.some((key) => !ids.has(key))) {
        issues.push(issue("error", path, "highlight keys must be selectable token ids"));
      }
      return;
    }
    const options = optionsOf(payload.options);
    const keys = stringKeys(payload.keys);
    if (!keys) {
      issues.push(issue("error", path, `${format} keys must be strings`));
      return;
    }
    if (format === "mr_select_n") {
      const n = payload.n;
      if (typeof n !== "number" || !Number.isInteger(n) || n < 1) {
        issues.push(issue("error", path, "mr_select_n requires a positive integer n"));
        return;
      }
      if (
        checkOptionGroup(options, keys, path, issues, { exactKeys: n }) &&
        options.length <= n
      ) {
        issues.push(issue("error", path, "mr_select_n needs more options than n"));
      } else if (options && uniqueIds(options)) {
        warnCueing(options, new Set(keys), path, issues);
      }
      return;
    }
    if (checkOptionGroup(options, keys, path, issues, { minKeys: 1 })) {
      if (keys.length >= options.length) {
        issues.push(issue("error", path, "mr_sata needs at least one non-key option"));
      }
      warnCueing(options, new Set(keys), path, issues);
    }
    return;
  }

  if (format === "matrix_mc" || format === "matrix_mr") {
    const columnOptions = Array.isArray(payload.columns)
      ? payload.columns.map((column) => asRecord(column))
      : null;
    if (
      !columnOptions ||
      columnOptions.some((column) => !column || typeof column.id !== "string" || typeof column.label !== "string")
    ) {
      issues.push(issue("error", path, "matrix columns need id and label"));
      return;
    }
    const columnIds = columnOptions.map((column) => String(column?.id));
    if (new Set(columnIds).size !== columnIds.length || columnIds.length < 2) {
      issues.push(issue("error", path, "matrix needs at least two unique columns"));
    }
    const rows = Array.isArray(payload.rows) ? payload.rows.map((row) => asRecord(row)) : null;
    if (!rows || rows.length < 1 || rows.some((row) => !row || typeof row.id !== "string")) {
      issues.push(issue("error", path, "matrix rows need ids"));
      return;
    }
    if (new Set(rows.map((row) => row?.id)).size !== rows.length) {
      issues.push(issue("error", path, "matrix row ids must be unique"));
    }
    const columnSet = new Set(columnIds);
    for (const row of rows) {
      if (!row) continue;
      if (format === "matrix_mc") {
        if (typeof row.key !== "string" || !columnSet.has(row.key)) {
          issues.push(issue("error", path, `matrix row ${String(row.id)} key is not a column`));
        }
      } else {
        const keys = stringKeys(row.keys);
        if (!keys || keys.some((key) => !columnSet.has(key))) {
          issues.push(issue("error", path, `matrix row ${String(row.id)} keys must be column ids`));
        }
      }
    }
    return;
  }

  if (format === "dropdown_cloze" || format === "dropdown_rationale") {
    const template = typeof payload.template === "string" ? payload.template : "";
    const dropdowns = Array.isArray(payload.dropdowns) ? payload.dropdowns.map((entry) => asRecord(entry)) : null;
    if (!template || !dropdowns || dropdowns.some((dropdown) => !dropdown)) {
      issues.push(issue("error", path, "dropdown items need a template and dropdowns"));
      return;
    }
    const ids = dropdowns.map((dropdown) => dropdown?.id);
    if (ids.some((id) => typeof id !== "string") || new Set(ids).size !== ids.length) {
      issues.push(issue("error", path, "dropdown ids must be unique strings"));
      return;
    }
    for (const dropdown of dropdowns) {
      if (!dropdown) continue;
      const id = String(dropdown.id);
      if (!template.includes(`{{${id}}}`)) {
        issues.push(issue("error", path, `template is missing {{${id}}}`));
      }
      const options = optionsOf(dropdown.options);
      const key = typeof dropdown.key === "string" ? dropdown.key : "";
      if (checkOptionGroup(options, key ? [key] : [], `${path}.${id}`, issues, { exactKeys: 1 })) {
        warnCueing(options, new Set([key]), `${path}.${id}`, issues);
      }
    }
    const placeholders = [...template.matchAll(/\{\{([a-zA-Z0-9_]+)\}\}/g)].map((match) => match[1]);
    const idSet = new Set(ids.map(String));
    if (placeholders.some((placeholder) => !idSet.has(placeholder ?? ""))) {
      issues.push(issue("error", path, "template placeholder has no dropdown"));
    }
    if (format === "dropdown_rationale") {
      const kind = payload.kind;
      const roles = dropdowns.map((dropdown) => dropdown?.role);
      const causeCount = roles.filter((role) => role === "cause").length;
      const effectCount = roles.filter((role) => role === "effect").length;
      if (kind === "dyad" && !(causeCount === 1 && effectCount === 1)) {
        issues.push(issue("error", path, "dyad rationale needs one cause and one effect"));
      } else if (kind === "triad" && !(causeCount === 1 && effectCount === 2)) {
        issues.push(issue("error", path, "triad rationale needs one cause and two effects"));
      } else if (kind !== "dyad" && kind !== "triad") {
        issues.push(issue("error", path, "dropdown_rationale kind must be dyad or triad"));
      }
    }
    return;
  }

  if (format === "bowtie") {
    const limits = profile.shapeLimits.bowtie;
    const parts: { name: "condition" | "actions" | "monitor"; exact: number }[] = [
      { name: "condition", exact: limits.conditionKeys },
      { name: "actions", exact: limits.actionKeys },
      { name: "monitor", exact: limits.monitorKeys },
    ];
    for (const part of parts) {
      const block = asRecord(payload[part.name]);
      const options = optionsOf(block?.options);
      const keys = stringKeys(block?.keys);
      if (!keys) {
        issues.push(issue("error", path, `bow-tie ${part.name} keys must be strings`));
        continue;
      }
      if (checkOptionGroup(options, keys, `${path}.${part.name}`, issues, { exactKeys: part.exact })) {
        warnCueing(options, new Set(keys), `${path}.${part.name}`, issues);
      }
    }
  }
}

function verdictMatches(actual: unknown, expected: unknown): boolean {
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) return false;
    const left = new Set(actual.map(String));
    const right = new Set(expected.map(String));
    if (left.size !== right.size) return false;
    for (const value of left) if (!right.has(value)) return false;
    return true;
  }
  return actual === expected;
}

function checkRationale(item: NgnItem, path: string, issues: ValidationIssue[]) {
  const rationale = item.rationale;
  if (!rationale || typeof rationale.short !== "string" || !rationale.short.trim()) {
    issues.push(issue("error", path, "rationale.short is required"));
    return;
  }
  const expanded = rationale.expanded;
  if (
    !expanded ||
    typeof expanded.cjmmCoaching !== "string" ||
    !expanded.cjmmCoaching.trim() ||
    typeof expanded.pointsLost !== "string" ||
    !expanded.pointsLost.trim() ||
    typeof expanded.takeaway !== "string" ||
    !expanded.takeaway.trim() ||
    !expanded.perOption ||
    typeof expanded.perOption !== "object"
  ) {
    issues.push(issue("error", path, "rationale.expanded is incomplete"));
    return;
  }
  const perOption = expanded.perOption;
  const expect = (id: string, verdict: unknown) => {
    const entry = perOption[id];
    if (!entry || typeof entry.text !== "string" || !entry.text.trim()) {
      issues.push(issue("error", `${path}.rationale`, `missing per-option rationale for ${id}`));
      return;
    }
    if (!verdictMatches(entry.verdict, verdict)) {
      issues.push(
        issue(
          "error",
          `${path}.rationale`,
          `verdict for ${id} does not match the key`
        )
      );
    }
  };

  const payload = item.payload;
  if (item.responseFormat === "highlight_text" && Array.isArray(payload.tokens)) {
    const keys = new Set(stringKeys(payload.keys) ?? []);
    for (const token of payload.tokens) {
      const record = asRecord(token);
      if (!record?.selectable || typeof record.id !== "string") continue;
      expect(record.id, keys.has(record.id) ? "key" : "distractor");
    }
  } else if (
    item.responseFormat === "mc_single" ||
    item.responseFormat === "mr_sata" ||
    item.responseFormat === "mr_select_n"
  ) {
    const keys =
      item.responseFormat === "mc_single"
        ? new Set([String(payload.key)])
        : new Set(stringKeys(payload.keys) ?? []);
    for (const option of optionsOf(payload.options) ?? []) {
      expect(option.id, keys.has(option.id) ? "key" : "distractor");
    }
  } else if (item.responseFormat === "matrix_mc" && Array.isArray(payload.rows)) {
    for (const row of payload.rows) {
      const record = asRecord(row);
      if (!record || typeof record.id !== "string") continue;
      expect(record.id, record.key);
    }
  } else if (item.responseFormat === "matrix_mr" && Array.isArray(payload.rows)) {
    for (const row of payload.rows) {
      const record = asRecord(row);
      if (!record || typeof record.id !== "string") continue;
      expect(record.id, record.keys);
    }
  } else if (
    (item.responseFormat === "dropdown_cloze" || item.responseFormat === "dropdown_rationale") &&
    Array.isArray(payload.dropdowns)
  ) {
    for (const dropdown of payload.dropdowns) {
      const record = asRecord(dropdown);
      if (!record || typeof record.id !== "string") continue;
      expect(record.id, record.key);
    }
  } else if (item.responseFormat === "bowtie") {
    for (const part of ["condition", "actions", "monitor"] as const) {
      const block = asRecord(payload[part]);
      const keys = new Set(stringKeys(block?.keys) ?? []);
      for (const option of optionsOf(block?.options) ?? []) {
        expect(option.id, keys.has(option.id) ? "key" : "distractor");
      }
    }
  }
}

function checkScoring(item: NgnItem, profile: BoardProfile, path: string, issues: ValidationIssue[]) {
  const mapped = profile.scoringMap[item.responseFormat];
  if (mapped !== item.scoringRule) {
    issues.push(
      issue("error", path, `scoring rule ${item.scoringRule} does not match the profile map (${mapped})`)
    );
  }
  try {
    const earned = score(item, perfect(item));
    if (earned !== item.maxPoints) {
      issues.push(
        issue("error", path, `maxPoints ${item.maxPoints} does not match a perfect response (${earned})`)
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "scoring failed";
    issues.push(issue("error", path, message));
  }
}

function checkReferences(
  refs: { src: string }[] | undefined,
  registry: Map<string, SourceRef>,
  path: string,
  issues: ValidationIssue[]
) {
  if (!refs || refs.length < 1) {
    issues.push(issue("error", path, "at least one reference is required"));
    return;
  }
  for (const ref of refs) {
    if (!ref || typeof ref.src !== "string" || !registry.has(ref.src)) {
      issues.push(issue("error", path, `reference ${ref?.src ?? "?"} is not in the source registry`));
    }
  }
}

function checkChart(caseDoc: NgnCase, path: string, issues: ValidationIssue[]) {
  const known = new Set<string>(["baseline", ...caseDoc.timepoints.map((timepoint) => timepoint.id)]);
  const tabs = caseDoc.chart?.tabs;
  if (!Array.isArray(tabs) || tabs.length < 1) {
    issues.push(issue("error", path, "chart tabs are required"));
    return;
  }
  for (const tab of tabs) {
    checkTab(tab, known, `${path}.chart.${tab?.id ?? "?"}`, issues);
  }
}

function checkTab(tab: ChartTab, known: Set<string>, path: string, issues: ValidationIssue[]) {
  if (!tab || typeof tab.id !== "string" || typeof tab.label !== "string") {
    issues.push(issue("error", path, "chart tab needs id and label"));
    return;
  }
  if (Array.isArray(tab.entries)) {
    for (const entry of tab.entries) {
      if (!entry || typeof entry.time !== "string" || typeof entry.text !== "string" || !known.has(entry.time)) {
        issues.push(issue("error", path, "chart entry is missing a known reveal time"));
      }
    }
  }
  if (Array.isArray(tab.rows) || Array.isArray(tab.columns)) {
    const columns = tab.columns ?? [];
    const rows = tab.rows ?? [];
    if (columns.length < 1 || rows.some((row) => row.length !== columns.length)) {
      issues.push(issue("error", path, "chart table rows must match the column count"));
    }
    const rowTags = tab.rowTimepoints;
    const columnTags = tab.columnTimepoints;
    if (!Array.isArray(rowTags) && !Array.isArray(columnTags)) {
      issues.push(issue("error", path, "chart table is missing reveal tags"));
    }
    if (Array.isArray(rowTags) && rowTags.length !== rows.length) {
      issues.push(issue("error", path, "rowTimepoints must cover every row"));
    }
    if (Array.isArray(columnTags) && columnTags.length !== columns.length) {
      issues.push(issue("error", path, "columnTimepoints must cover every column"));
    }
    for (const tag of [...(rowTags ?? []), ...(columnTags ?? [])]) {
      if (!known.has(tag)) issues.push(issue("error", path, `reveal tag ${tag} is not a timepoint or baseline`));
    }
    const label = `${tab.id} ${tab.label}`.toLowerCase();
    if (tab.id === "vitals" || label.includes("vital")) {
      rows.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
          if (columnIndex === 0) return;
          if (cell === "-" || cell.trim() === "") return;
          if (!UNIT_IN_CELL.test(cell)) {
            issues.push(issue("error", path, `vital cell "${cell}" is missing a unit`));
          }
          const absoluteTemp = cell.match(/^\s*(-?\d+(?:\.\d+)?)\s*°C/);
          if (absoluteTemp) {
            const value = Number(absoluteTemp[1]);
            if (value < 25 || value > 45) {
              issues.push(issue("error", path, `temperature ${value} °C is outside 25–45`));
            }
          }
        });
        void rowIndex;
      });
    }
    if (tab.id === "labs" || label.includes("laboratory")) {
      const referenceIndex = columns.findIndex((column) => /reference/i.test(column));
      if (referenceIndex < 0) {
        issues.push(issue("error", path, "laboratory table needs a reference-range column"));
      } else {
        for (const row of rows) {
          const cell = row[referenceIndex] ?? "";
          if (cell !== "-" && !UNIT_IN_CELL.test(cell) && !/[A-Za-z]/.test(cell)) {
            issues.push(issue("error", path, `reference cell "${cell}" is missing units`));
          }
        }
      }
    }
  }
}

function checkPatient(caseDoc: NgnCase, path: string, issues: ValidationIssue[]) {
  const patient = caseDoc.patient;
  if (!patient || typeof patient.displayName !== "string" || !patient.displayName.trim()) {
    issues.push(issue("error", path, "patient display name is required"));
  }
  if (typeof patient?.age !== "number" || !Number.isInteger(patient.age) || patient.age < 0 || patient.age > 120) {
    issues.push(issue("error", path, "patient age must be an integer from 0 to 120"));
  }
  if (typeof patient?.weightKg !== "number" || patient.weightKg < 2 || patient.weightKg > 400) {
    issues.push(issue("error", path, "patient weightKg is outside 2–400"));
  }
  if (typeof patient?.sex !== "string" || !patient.sex.trim()) {
    issues.push(issue("error", path, "patient sex is required"));
  }
  if (typeof patient?.allergies !== "string" || !patient.allergies.trim()) {
    issues.push(issue("error", path, "patient allergies are required"));
  }
}

function checkCaseIntegrity(caseDoc: NgnCase, profile: BoardProfile, path: string, issues: ValidationIssue[]) {
  if (caseDoc.items.length !== profile.caseLength) {
    issues.push(issue("error", path, `case must contain ${profile.caseLength} items`));
  }
  const ordered = [...caseDoc.items];
  ordered.forEach((item, index) => {
    const expected = profile.stepTaxonomy[index];
    if (!expected || item.caseStep !== expected.step) {
      issues.push(issue("error", path, `step ${index + 1} is not in NCJMM order`));
    } else if (item.cjmmFunction !== expected.id) {
      issues.push(issue("error", `${path}/${item.id}`, `CJMM function must be ${expected.id}`));
    }
    if (item.caseId !== caseDoc.id || item.itemType !== "case_item") {
      issues.push(issue("error", `${path}/${item.id}`, "case item must belong to its case"));
    }
  });
  const timeIndex = new Map(caseDoc.timepoints.map((timepoint, index) => [timepoint.id, index]));
  let last = -1;
  for (const item of ordered) {
    if (!item.timepoint || !timeIndex.has(item.timepoint)) {
      issues.push(issue("error", `${path}/${item.id}`, "item timepoint is not on the case"));
      continue;
    }
    const index = timeIndex.get(item.timepoint) ?? -1;
    if (index < last) {
      issues.push(issue("error", `${path}/${item.id}`, "timepoints must move forward"));
    }
    last = Math.max(last, index);
  }
  const step6 = ordered[profile.caseLength - 1];
  if (step6?.timepoint && ordered.slice(0, profile.caseLength - 1).some((item) => item.timepoint === step6.timepoint)) {
    issues.push(issue("error", path, "step 6 must introduce a new timepoint"));
  }
  const formats = new Set(ordered.map((item) => item.responseFormat));
  if (formats.size < profile.shapeLimits.minFormatsPerCase) {
    issues.push(
      issue("error", path, `case uses ${formats.size} formats; at least ${profile.shapeLimits.minFormatsPerCase} are required`)
    );
  }
  if (caseDoc.itemIds && caseDoc.itemIds.join("|") !== ordered.map((item) => item.id).join("|")) {
    issues.push(issue("error", path, "itemIds do not match the items in order"));
  }
}

function checkStandalone(item: NgnItem, path: string, issues: ValidationIssue[]) {
  if (item.itemType === "case_item") {
    issues.push(issue("error", path, "standalone items cannot be case_item"));
  }
  if (item.caseId != null || item.caseStep != null || item.caseVersion != null) {
    issues.push(issue("error", path, "bow-tie and trend rows must have case_id null"));
  }
  if (item.itemType === "bowtie" && item.responseFormat !== "bowtie") {
    issues.push(issue("error", path, "bowtie items must use the bowtie response format"));
  }
  if (item.itemType === "trend") {
    const exhibit = item.exhibit;
    const columns = exhibit && Array.isArray(exhibit.columns) ? exhibit.columns : null;
    const rows = exhibit && Array.isArray(exhibit.rows) ? exhibit.rows : null;
    if (!columns || !rows || columns.some((column) => typeof column !== "string")) {
      issues.push(issue("error", path, "trend exhibit needs columns and rows"));
    } else if (rows.some((row) => !Array.isArray(row) || row.length !== columns.length)) {
      issues.push(issue("error", path, "trend exhibit rows must match the columns"));
    }
  }
  if (item.itemType === "bowtie") {
    const exhibit = item.exhibit;
    const textOk = exhibit && typeof exhibit.text === "string" && typeof exhibit.title === "string";
    const tableOk = exhibit && Array.isArray(exhibit.columns) && Array.isArray(exhibit.rows);
    if (!textOk && !tableOk) {
      issues.push(issue("error", path, "bow-tie exhibit needs a title and text or a table"));
    }
  }
}

function checkIdentity(item: NgnItem, profile: BoardProfile, path: string, issues: ValidationIssue[]) {
  if (!item.id || !Number.isInteger(item.version) || item.version < 1) {
    issues.push(issue("error", path, "item id and version are required"));
  }
  if (!ITEM_TYPES.includes(item.itemType)) {
    issues.push(issue("error", path, `unknown item type ${item.itemType}`));
  }
  if (!RESPONSE_FORMATS.includes(item.responseFormat)) {
    issues.push(issue("error", path, `unknown response format ${item.responseFormat}`));
  } else if (!profile.allowedFormats.includes(item.responseFormat)) {
    issues.push(issue("error", path, `${item.responseFormat} is not allowed for ${profile.id}`));
  }
  if (!SCORING_RULES.includes(item.scoringRule)) {
    issues.push(issue("error", path, `unknown scoring rule ${item.scoringRule}`));
  }
  if (typeof item.stem !== "string" || !item.stem.trim()) {
    issues.push(issue("error", path, "stem is required"));
  }
  if (!item.clientNeeds || typeof item.clientNeeds.category !== "string" || typeof item.clientNeeds.subcategory !== "string") {
    issues.push(issue("error", path, "client needs category and subcategory are required"));
  }
  if (!Array.isArray(item.rnFlags) || item.rnFlags.some((flag) => typeof flag !== "string")) {
    issues.push(issue("error", path, "rnFlags must be a string array"));
  }
  const functions = Array.isArray(item.cjmmFunction) ? item.cjmmFunction : [item.cjmmFunction];
  const known = new Set(profile.stepTaxonomy.map((step) => step.id));
  if (functions.length < 1 || functions.some((fn) => typeof fn !== "string" || !known.has(fn))) {
    issues.push(issue("error", path, "cjmmFunction must use the board step taxonomy"));
  }
}

function checkSources(sources: SourceRef[], profile: BoardProfile, issues: ValidationIssue[]) {
  const allowed = new Set<string>(profile.sourceDomains);
  const seen = new Set<string>();
  for (const source of sources) {
    if (!source?.id || seen.has(source.id)) {
      issues.push(issue("error", "sources", "source ids must be unique"));
      continue;
    }
    seen.add(source.id);
    if (typeof source.title !== "string" || !source.title.trim()) {
      issues.push(issue("error", `sources.${source.id}`, "source title is required"));
    }
    let host = "";
    try {
      const url = new URL(source.url);
      host = url.host;
      if (url.protocol !== "https:") {
        issues.push(issue("error", `sources.${source.id}`, "source URL must be https"));
      }
    } catch {
      issues.push(issue("error", `sources.${source.id}`, "source URL is invalid"));
    }
    if (host && !allowed.has(host)) {
      issues.push(issue("error", `sources.${source.id}`, `domain ${host} is not allow-listed`));
    }
  }
}

export function validateItem(
  item: NgnItem,
  context: {
    profile: BoardProfile;
    registry: Map<string, SourceRef>;
    caseDoc?: NgnCase | null;
  }
): ValidationIssue[] {
  const path = `items/${item.id}`;
  const issues: ValidationIssue[] = [];
  checkIdentity(item, context.profile, path, issues);
  checkShape(item, context.profile, path, issues);
  checkScoring(item, context.profile, path, issues);
  checkRationale(item, path, issues);
  checkReferences(item.references, context.registry, path, issues);
  walkStrings(item.stem, (text, textPath) => checkPhysiologicText(text, textPath, issues), path);
  walkStrings(item.payload, (text, textPath) => checkPhysiologicText(text, textPath, issues), path);
  walkStrings(item.exhibit, (text, textPath) => checkPhysiologicText(text, textPath, issues), path);
  walkStrings(item.rationale, (text, textPath) => checkPhysiologicText(text, textPath, issues), path);
  if (item.itemType === "bowtie" || item.itemType === "trend") {
    checkStandalone(item, path, issues);
  }
  if (context.caseDoc && item.itemType === "case_item") {
    /* Case-level checks are reported on the case path by validatePilotDocument. */
  }
  return issues;
}

export function validateItemForPublish(
  item: NgnItem,
  context: { sources: readonly SourceRef[]; caseDoc?: NgnCase | null }
): ValidationIssue[] {
  const profile = getBoardProfile(item.caseId ? context.caseDoc?.boardProfile ?? "nclex-rn-2026" : "nclex-rn-2026");
  const board = profile ?? getBoardProfile("nclex-rn-2026");
  if (!board) return [issue("error", item.id, "no board profile")];
  const registry = new Map(context.sources.map((source) => [source.id, source]));
  const issues = validateItem(item, { profile: board, registry, caseDoc: context.caseDoc });
  if (context.caseDoc && item.itemType === "case_item") {
    checkCaseIntegrity(context.caseDoc, board, `cases/${context.caseDoc.id}`, issues);
    checkReferences(context.caseDoc.references, registry, `cases/${context.caseDoc.id}`, issues);
  }
  return issues;
}

export function validatePilotDocument(doc: PilotDocument): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!doc || typeof doc !== "object") {
    return [issue("error", "document", "pilot file must be an object")];
  }
  if (!doc.schemaVersion || !doc.batchId) {
    issues.push(issue("error", "document", "schemaVersion and batchId are required"));
  }
  const profile = getBoardProfile(doc.boardProfile);
  if (!profile) {
    issues.push(issue("error", "document", `board profile ${doc.boardProfile} is not implemented`));
    return issues;
  }
  if (!Array.isArray(doc.sources) || !Array.isArray(doc.cases) || !Array.isArray(doc.standalone)) {
    issues.push(issue("error", "document", "sources, cases, and standalone must be arrays"));
    return issues;
  }
  checkSources(doc.sources, profile, issues);
  const registry = new Map(doc.sources.map((source) => [source.id, source]));
  const seen = new Set<string>();
  for (const caseDoc of doc.cases) {
    const path = `cases/${caseDoc.id}`;
    if (caseDoc.boardProfile !== profile.id) {
      issues.push(issue("error", path, "case board profile does not match the file"));
    }
    if (!caseDoc.timepoints?.length || new Set(caseDoc.timepoints.map((tp) => tp.id)).size !== caseDoc.timepoints.length) {
      issues.push(issue("error", path, "timepoints must be unique"));
    }
    if (caseDoc.timepoints?.some((tp) => tp.id === "baseline")) {
      issues.push(issue("error", path, "baseline is reserved and cannot be a timepoint id"));
    }
    if (typeof caseDoc.revealRule !== "string" || !caseDoc.revealRule.trim()) {
      issues.push(issue("error", path, "reveal rule is required"));
    }
    checkPatient(caseDoc, path, issues);
    checkChart(caseDoc, path, issues);
    checkCaseIntegrity(caseDoc, profile, path, issues);
    checkReferences(caseDoc.references, registry, path, issues);
    walkStrings(caseDoc.chart, (text, textPath) => checkPhysiologicText(text, textPath, issues), path);
    walkStrings(caseDoc.patient, (text, textPath) => checkPhysiologicText(text, textPath, issues), path);
    for (const item of caseDoc.items) {
      if (seen.has(item.id)) issues.push(issue("error", `items/${item.id}`, "duplicate item id"));
      seen.add(item.id);
      issues.push(...validateItem(item, { profile, registry, caseDoc }));
    }
  }
  for (const item of doc.standalone) {
    if (seen.has(item.id)) issues.push(issue("error", `items/${item.id}`, "duplicate item id"));
    seen.add(item.id);
    issues.push(...validateItem(item, { profile, registry }));
  }
  return issues;
}

export function errorCount(issues: readonly ValidationIssue[]): number {
  return issues.filter((entry) => entry.level === "error").length;
}
