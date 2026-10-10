/**
 * Published clinical-catalog NGN (ngn_item / ngn_case) as exam bank rows.
 * These rows are not QuestionBankItem. A case is included only when every
 * step converts to a format the exam player can grade.
 */
import type { BankItem } from "@/lib/question-bank";
import { sortNgnItemsByCaseStep } from "@/lib/assessment/case-order";
import { matrixRowHeader } from "@/lib/assessment/matrix-row-header";
import { ngnQuestionKey, type PublishedCatalog } from "@/lib/assessment/serve";
import type { NgnCase, NgnItem as ClinicalItem } from "@/lib/assessment/types";

type Option = { id: string; text: string };

function record(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function optionList(value: unknown): Option[] {
  if (!Array.isArray(value)) return [];
  const options: Option[] = [];
  for (const entry of value) {
    const row = record(entry);
    if (!row || typeof row.text !== "string" || !row.text.trim()) continue;
    const id = typeof row.id === "string" && row.id.trim() ? row.id : String(options.length + 1);
    options.push({ id, text: row.text.trim() });
  }
  return options;
}

function keysOf(block: Record<string, unknown> | null, fallback?: unknown): string[] {
  const raw = block?.keys ?? block?.key ?? fallback;
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
  if (typeof raw === "string" && raw.trim()) return [raw.trim()];
  return [];
}

function textsFor(options: Option[], keys: string[]): string[] | null {
  if (keys.length === 0) return null;
  const byId = new Map(options.map((option) => [option.id, option.text]));
  const texts: string[] = [];
  for (const key of keys) {
    const text = byId.get(key);
    if (!text) return null;
    texts.push(text);
  }
  return texts;
}

function choiceBlock(payload: Record<string, unknown>, name: string): { options: Option[]; keys: string[] } | null {
  const block = record(payload[name]);
  const options = optionList(block?.options ?? payload.options);
  if (options.length < 2) return null;
  return { options, keys: keysOf(block, payload.keys ?? payload.key) };
}

function explanationFor(item: ClinicalItem): string {
  const short = item.rationale?.short?.trim() ?? "";
  const takeaway = item.rationale?.expanded?.takeaway?.trim() ?? "";
  const text = [short, takeaway].filter(Boolean).join("\n\n");
  return text.length >= 40 ? text : `${text} Review the chart and the keyed clinical judgment.`.trim();
}

function caseVignette(caseDoc: Pick<NgnCase, "title" | "setting" | "patient">): string {
  const patient = caseDoc.patient;
  const who = patient
    ? `${patient.displayName}, ${patient.age}-year-old ${patient.sex}. ${patient.history ?? ""}`.trim()
    : "";
  return [caseDoc.title, caseDoc.setting, who].filter(Boolean).join("\n");
}

function baseItem(
  item: ClinicalItem,
  subjectId: string | null,
  vignette: string | undefined,
  fields: Pick<BankItem, "options" | "correctAnswer" | "itemType" | "ngnPayload">,
  caseTitle?: string
): BankItem {
  const setId = item.caseId?.trim() || undefined;
  const stepIndex = typeof item.caseStep === "number" ? item.caseStep : undefined;
  const payload = {
    ...(fields.ngnPayload ?? {}),
    ...(item.exhibit ? { exhibit: item.exhibit } : {}),
    clinicalItemType: item.itemType,
    ...(caseTitle ? { caseTitle } : {}),
    ...(setId ? { setId } : {}),
    ...(stepIndex != null ? { stepIndex } : {}),
  };
  return {
    id: ngnQuestionKey(item.id, item.version),
    question: item.stem.trim(),
    vignette,
    scenario: vignette,
    options: fields.options,
    correctAnswer: fields.correctAnswer,
    explanation: explanationFor(item),
    itemType: fields.itemType,
    subjectId: subjectId ?? undefined,
    topicCategory: item.clientNeeds?.subcategory ?? item.clientNeeds?.category,
    ngnPayload: payload,
    qaPassed: true,
    active: true,
    tags: ["published-ngn-catalog"],
  };
}

function convertBowtie(payload: Record<string, unknown>): Pick<BankItem, "options" | "correctAnswer" | "itemType" | "ngnPayload"> | null {
  const actions = choiceBlock(payload, "actions");
  const monitors = choiceBlock(payload, "monitor") ?? choiceBlock(payload, "monitors");
  if (!actions || !monitors) return null;
  const actionTexts = textsFor(actions.options, actions.keys);
  const monitorTexts = textsFor(monitors.options, monitors.keys);
  if (!actionTexts || actionTexts.length < 1 || !monitorTexts || monitorTexts.length < 1) return null;
  const conditionBlock = record(payload.condition);
  const conditionOptions = optionList(conditionBlock?.options);
  const conditionKeys = keysOf(conditionBlock);
  const condition =
    (conditionOptions.length > 0 ? textsFor(conditionOptions, conditionKeys)?.[0] : null) ??
    (typeof payload.condition === "string" ? payload.condition : "");
  const keyed = [...actionTexts, ...monitorTexts];
  if (
    condition &&
    conditionOptions.some((option) => option.text.trim().toLowerCase() === condition.trim().toLowerCase()) &&
    !keyed.some((part) => part.trim().toLowerCase() === condition.trim().toLowerCase())
  ) {
    keyed.push(condition);
  }
  return {
    itemType: "ngn_bowtie",
    options: [...actions.options.map((option) => option.text), ...monitors.options.map((option) => option.text)],
    correctAnswer: keyed.join("|||"),
    ngnPayload: {
      kind: "bow_tie",
      condition,
      conditionOptions: conditionOptions.map((option) => option.text),
      actions: actions.options.map((option) => option.text),
      monitors: monitors.options.map((option) => option.text),
      actionPickCount: actionTexts.length,
      monitorPickCount: monitorTexts.length,
    },
  };
}

function convertHighlight(payload: Record<string, unknown>): Pick<BankItem, "options" | "correctAnswer" | "itemType" | "ngnPayload"> | null {
  const tokens = optionList(payload.tokens).map((token, index) => {
    const raw = Array.isArray(payload.tokens) ? record(payload.tokens[index]) : null;
    return { ...token, selectable: raw?.selectable !== false };
  });
  const selectable = tokens.filter((token) => token.selectable);
  const keys = keysOf(payload);
  const correct = textsFor(tokens, keys);
  if (!correct || correct.length < 1 || selectable.length < 2) return null;
  const text = tokens.map((token) => token.text).join(" ");
  if (!correct.every((span) => text.toLowerCase().includes(span.toLowerCase()))) return null;
  return {
    itemType: "ngn_highlight",
    options: selectable.map((token) => token.text),
    correctAnswer: correct.join("|||"),
    ngnPayload: {
      kind: "highlight",
      text,
      highlights: correct,
      tokens: tokens.map((token) => ({ id: token.id, text: token.text, selectable: token.selectable })),
      segments: selectable.map((token) => ({ id: token.id, text: token.text })),
    },
  };
}

function columnDisplay(row: Record<string, unknown>): string {
  if (typeof row.text === "string" && row.text.trim()) return row.text.trim();
  if (typeof row.label === "string" && row.label.trim()) return row.label.trim();
  return "";
}

function columnLabels(payload: Record<string, unknown>): { id: string; text: string }[] {
  if (!Array.isArray(payload.columns)) return [];
  return payload.columns
    .map((column, index) => {
      if (typeof column === "string" && column.trim()) return { id: column.trim(), text: column.trim() };
      const row = record(column);
      const text = row ? columnDisplay(row) : "";
      if (!row || !text) return null;
      const id = typeof row.id === "string" && row.id.trim() ? row.id.trim() : text;
      return { id, text: text || `Column ${index + 1}` };
    })
    .filter((column): column is { id: string; text: string } => column != null);
}

function convertMatrix(
  payload: Record<string, unknown>,
  multi: boolean
): Pick<BankItem, "options" | "correctAnswer" | "itemType" | "ngnPayload"> | null {
  const columns = columnLabels(payload);
  if (!Array.isArray(payload.rows) || columns.length < 2) return null;
  const rows: string[] = [];
  const cells: string[] = [];
  for (const entry of payload.rows) {
    const row = record(entry);
    if (!row || typeof row.text !== "string" || !row.text.trim()) return null;
    const label = row.text.trim();
    rows.push(label);
    const keys = keysOf(row);
    // matrix_mc needs exactly one column. matrix_mr may leave a row blank.
    if (!multi && keys.length !== 1) return null;
    if (keys.length < 1) continue;
    for (const key of keys) {
      const column = columns.find((candidate) => candidate.id === key || candidate.text === key);
      if (!column) return null;
      cells.push(`${label}|||${column.text}`);
    }
  }
  if (rows.length < 1 || cells.length < 1) return null;
  return {
    itemType: "ngn_matrix",
    options: rows.flatMap((row) => columns.map((column) => `${row}|||${column.text}`)),
    correctAnswer: cells.join(";;"),
    ngnPayload: {
      kind: "matrix",
      rows,
      columns: columns.map((column) => column.text),
      matrixMulti: multi,
      rowHeader: matrixRowHeader(payload.rowHeader),
    },
  };
}

function convertDropdown(payload: Record<string, unknown>): Pick<BankItem, "options" | "correctAnswer" | "itemType" | "ngnPayload"> | null {
  const template = typeof payload.template === "string" ? payload.template.trim() : "";
  if (!template || !Array.isArray(payload.dropdowns) || payload.dropdowns.length < 1) return null;
  const dropdowns: { id: string; options: Option[] }[] = [];
  const parts: string[] = [];
  for (const entry of payload.dropdowns) {
    const row = record(entry);
    if (!row || typeof row.id !== "string") return null;
    const options = optionList(row.options);
    const key = typeof row.key === "string" ? row.key : "";
    const text = options.find((option) => option.id === key)?.text;
    if (!text || options.length < 2) return null;
    dropdowns.push({ id: row.id, options });
    parts.push(`${row.id}=${text}`);
  }
  return {
    itemType: "ngn_dropdown",
    options: [],
    correctAnswer: parts.join("|"),
    ngnPayload: { kind: "dropdown", template, dropdowns },
  };
}

function convertChoices(
  item: ClinicalItem,
  payload: Record<string, unknown>,
  format: "mc_single" | "mr_sata" | "mr_select_n"
): Pick<BankItem, "options" | "correctAnswer" | "itemType" | "ngnPayload"> | null {
  const options = optionList(payload.options);
  const keys = keysOf(payload);
  const texts = textsFor(options, keys);
  if (!texts || options.length < 2) return null;
  if (format === "mc_single") {
    if (texts.length !== 1) return null;
    return {
      itemType: item.caseId ? "case_study" : "mcq",
      options: options.map((option) => option.text),
      correctAnswer: texts[0]!,
      ngnPayload: item.caseId ? { kind: "sequential", options: options.map((option) => option.text) } : { kind: "mcq" },
    };
  }
  if (texts.length < 2) return null;
  return {
    itemType: "select_all",
    options: options.map((option) => option.text),
    correctAnswer: texts.join("|||"),
    ngnPayload: {
      kind: "select_all",
      options: options.map((option) => option.text),
    },
  };
}

function convertClinicalItem(item: ClinicalItem): Pick<BankItem, "options" | "correctAnswer" | "itemType" | "ngnPayload"> | null {
  if (!item.stem?.trim()) return null;
  const payload = record(item.payload);
  if (!payload) return null;
  switch (item.responseFormat) {
    case "bowtie":
      return convertBowtie(payload);
    case "highlight_text":
      return convertHighlight(payload);
    case "matrix_mc":
      return convertMatrix(payload, false);
    case "matrix_mr":
      return convertMatrix(payload, true);
    case "dropdown_cloze":
    case "dropdown_rationale":
      return convertDropdown(payload);
    case "mc_single":
      return convertChoices(item, payload, "mc_single");
    case "mr_sata":
    case "mr_select_n":
      return convertChoices(item, payload, item.responseFormat);
    default:
      return null;
  }
}

function stepsArePlayable(items: ClinicalItem[]): boolean {
  const steps = items.map((item) => item.caseStep);
  if (steps.some((step) => typeof step !== "number")) return false;
  const unique = [...new Set(steps as number[])].sort((a, b) => a - b);
  return unique.length === items.length && unique.length >= 2 && unique.every((step, index) => step === index + 1);
}

/** One published clinical row in the exam player's bank shape. */
export function bankItemFromClinicalServeItem(
  item: ClinicalItem,
  subjectId?: string | null
): BankItem | null {
  const converted = convertClinicalItem(item);
  if (!converted) return null;
  return baseItem(item, subjectId ?? null, undefined, converted);
}

/** Standalone bow-ties and trends, plus every step of a fully playable case. */
export function publishedCatalogToBankItems(catalog: PublishedCatalog): BankItem[] {
  const items: BankItem[] = [];

  for (const unit of catalog.standalones) {
    const converted = convertClinicalItem(unit.item);
    if (!converted) continue;
    items.push(baseItem(unit.item, unit.subjectId, undefined, converted));
  }

  for (const unit of catalog.cases) {
    const members = sortNgnItemsByCaseStep(unit.items);
    if (!stepsArePlayable(members)) continue;
    const converted = members.map((item) => ({ item, fields: convertClinicalItem(item) }));
    if (converted.some((row) => row.fields == null)) continue;
    const vignette = caseVignette(unit.caseDoc);
    for (const row of converted) {
      items.push(baseItem(row.item, unit.subjectId, vignette || undefined, row.fields!, unit.caseDoc.title));
    }
  }

  return items;
}

/** Resume order: bank rows first, then catalog ids the bank table does not store. */
export function mergePrefetchedBankItems(
  ids: readonly string[],
  bankById: ReadonlyMap<string, BankItem>,
  catalogItems: readonly BankItem[]
): BankItem[] {
  const catalogById = new Map(
    catalogItems
      .map((item) => [item.id?.trim() ?? "", item] as const)
      .filter((entry): entry is [string, BankItem] => Boolean(entry[0]))
  );
  const out: BankItem[] = [];
  for (const id of ids) {
    const item = bankById.get(id) ?? catalogById.get(id);
    if (item) out.push(item);
  }
  return out;
}
