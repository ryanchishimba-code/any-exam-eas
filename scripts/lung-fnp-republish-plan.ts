import { readFileSync } from "node:fs";
import path from "node:path";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

export const DATA_DIR = path.join(process.cwd(), "scripts/data/lung-fnp-republish-20261025");
export const REWRITES_PATH = path.join(DATA_DIR, "rewrites.json");
export const RETIRE_PATH = path.join(DATA_DIR, "retire.json");
export const TAG_CHANGES_PATH = path.join(DATA_DIR, "tag_changes.json");
export const BACKUP_PATH = path.join(DATA_DIR, "backup-original.json");
export const UNDO_PATH = path.join(DATA_DIR, "undo.json");

export const EXPECTED = 55;
export const EXPECTED_PANCE = 13;
export const EXPECTED_FNP = 42;

export const LETTERS = "ABCDE";

/** Student-eligible PANCE count immediately before republish (2026-10-25). */
export const EXPECTED_PANCE_BEFORE = 3782;
export const PANCE_DELTA = 13;
export const FNP_DELTA = 42;

export type RewriteRow = {
  id: string;
  fieldId: string;
  subjectId: string;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  solutionSteps: string | null;
  tags: string | null;
  source: string;
  stateCode: string | null;
  difficulty: number | null;
  topicCategory: string | null;
  blueprintDomain: string | null;
  itemType: string;
  references: unknown;
  scenario: string | null;
  stepLevel: string | null;
  qaAuditedAt: string | null;
  taskCategory: string | null;
  blueprintTopic: string | null;
  generationVersion: string | null;
  reviewStatus: string | null;
  lastReviewedAt: string | null;
  generationMeta: unknown;
  patientAgeGroup: string | null;
  clientNeeds: string | null;
  cjmmFunction: string | null;
  _rewrite?: unknown;
};

export type RepublishPlan = {
  id: string;
  fieldId: string;
  subjectId: string;
  oldScenario: string | null;
  oldQuestion: string;
  oldCorrectAnswer: string;
  oldContentHash: string;
  scenario: string | null;
  question: string;
  correctAnswer: string;
  explanation: string;
  solutionSteps: string | null;
  tags: string | null;
  source: string;
  stateCode: string | null;
  difficulty: number | null;
  topicCategory: string | null;
  blueprintDomain: string | null;
  itemType: string;
  referencesJson: string;
  stepLevel: string | null;
  qaAuditedAt: string | null;
  taskCategory: string | null;
  blueprintTopic: string | null;
  generationVersion: string | null;
  reviewStatus: string | null;
  lastReviewedAt: string | null;
  generationMetaJson: string;
  patientAgeGroup: string | null;
  clientNeeds: string | null;
  cjmmFunction: string | null;
  optionsJson: string;
  optionTexts: string[];
  keyLetter: string;
  contentHash: string;
};

function parseOptions(raw: string): string[] {
  const parsed = JSON.parse(raw) as { options?: unknown };
  if (!Array.isArray(parsed.options) || parsed.options.some((option) => typeof option !== "string")) {
    throw new Error("options JSON is missing a string options array");
  }
  return parsed.options as string[];
}

export function keyLetterForAnswer(optionTexts: readonly string[], correctAnswer: string): string {
  if (correctAnswer.includes("|||")) {
    const parts = correctAnswer.split("|||").map((part) => part.trim());
    return parts.map((part) => LETTERS[optionTexts.indexOf(part)] ?? "?").join("+");
  }
  const index = optionTexts.indexOf(correctAnswer);
  return index >= 0 ? LETTERS[index]! : "?";
}

export function loadRetireIds(): string[] {
  const parsed = JSON.parse(readFileSync(RETIRE_PATH, "utf8")) as Array<{ id: string; status: string }>;
  if (!Array.isArray(parsed) || parsed.length !== 7) throw new Error(`expected 7 retire rows, found ${parsed?.length ?? 0}`);
  const ids = parsed.map((row) => row.id);
  if (new Set(ids).size !== ids.length) throw new Error("retire list has duplicates");
  for (const row of parsed) {
    if (row.status !== "retire") throw new Error(`${row.id} is not marked retire`);
    if (!/^[a-z0-9]+$/.test(row.id)) throw new Error(`unexpected retire id: ${row.id}`);
  }
  return ids;
}

export function loadRewrites(): RewriteRow[] {
  const parsed = JSON.parse(readFileSync(REWRITES_PATH, "utf8")) as RewriteRow[];
  if (!Array.isArray(parsed) || parsed.length !== EXPECTED) {
    throw new Error(`expected ${EXPECTED} rewrites, found ${parsed?.length ?? 0}`);
  }
  const ids = new Set<string>();
  let pance = 0;
  let fnp = 0;
  for (const row of parsed) {
    if (!/^[a-z0-9]+$/.test(row.id)) throw new Error(`unexpected id: ${row.id}`);
    if (ids.has(row.id)) throw new Error(`duplicate id: ${row.id}`);
    ids.add(row.id);
    if (row.fieldId === "pance") pance += 1;
    else if (row.fieldId === "aanp-fnp") fnp += 1;
    else throw new Error(`${row.id} fieldId is ${row.fieldId}`);
    parseOptions(row.options);
    const letter = keyLetterForAnswer(parseOptions(row.options), row.correctAnswer);
    if (letter.includes("?")) throw new Error(`${row.id} correctAnswer is not in options`);
  }
  if (pance !== EXPECTED_PANCE || fnp !== EXPECTED_FNP) {
    throw new Error(`rewrites split pance=${pance} fnp=${fnp}, expected ${EXPECTED_PANCE}/${EXPECTED_FNP}`);
  }
  const retire = new Set(loadRetireIds());
  for (const row of parsed) {
    if (retire.has(row.id)) throw new Error(`${row.id} is on the retire list`);
  }
  const tagChanges = JSON.parse(readFileSync(TAG_CHANGES_PATH, "utf8")) as Array<{ id: string }>;
  for (const entry of tagChanges) {
    if (!ids.has(entry.id)) throw new Error(`tag_changes id ${entry.id} is not in rewrites`);
  }
  return parsed;
}

export function publishIds(rewrites: RewriteRow[]): string[] {
  return rewrites.map((row) => row.id);
}

export function buildPlan(rewrite: RewriteRow, live: Record<string, unknown>): RepublishPlan {
  if (live.fieldId !== rewrite.fieldId) throw new Error(`${rewrite.id} live fieldId is ${String(live.fieldId)}`);
  const optionTexts = parseOptions(rewrite.options);
  const keyLetter = keyLetterForAnswer(optionTexts, rewrite.correctAnswer);
  if (keyLetter.includes("?")) throw new Error(`${rewrite.id} rewrite key is not in options`);
  const contentHash = bankItemContentHash(rewrite.fieldId, rewrite.subjectId, {
    question: rewrite.question,
    scenario: rewrite.scenario,
  });
  const referencesJson = JSON.stringify(rewrite.references ?? null);
  const generationMetaJson = JSON.stringify(rewrite.generationMeta ?? null);
  return {
    id: rewrite.id,
    fieldId: rewrite.fieldId,
    subjectId: rewrite.subjectId,
    oldScenario: live.scenario == null ? null : String(live.scenario),
    oldQuestion: String(live.question),
    oldCorrectAnswer: String(live.correctAnswer),
    oldContentHash: String(live.contentHash),
    scenario: rewrite.scenario,
    question: rewrite.question,
    correctAnswer: rewrite.correctAnswer,
    explanation: rewrite.explanation,
    solutionSteps: rewrite.solutionSteps,
    tags: rewrite.tags,
    source: rewrite.source,
    stateCode: rewrite.stateCode,
    difficulty: rewrite.difficulty,
    topicCategory: rewrite.topicCategory,
    blueprintDomain: rewrite.blueprintDomain,
    itemType: rewrite.itemType,
    referencesJson,
    stepLevel: rewrite.stepLevel,
    qaAuditedAt: rewrite.qaAuditedAt,
    taskCategory: rewrite.taskCategory,
    blueprintTopic: rewrite.blueprintTopic,
    generationVersion: rewrite.generationVersion,
    reviewStatus: rewrite.reviewStatus,
    lastReviewedAt: rewrite.lastReviewedAt,
    generationMetaJson,
    patientAgeGroup: rewrite.patientAgeGroup,
    clientNeeds: rewrite.clientNeeds ?? null,
    cjmmFunction: rewrite.cjmmFunction ?? null,
    optionsJson: rewrite.options,
    optionTexts,
    keyLetter,
    contentHash,
  };
}

export function buildPlans(rewrites: RewriteRow[], liveById: Map<string, Record<string, unknown>>): RepublishPlan[] {
  return rewrites.map((rewrite) => {
    const live = liveById.get(rewrite.id);
    if (!live) throw new Error(`missing live row ${rewrite.id}`);
    return buildPlan(rewrite, live);
  });
}
