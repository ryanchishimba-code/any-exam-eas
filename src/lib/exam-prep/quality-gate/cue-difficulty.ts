/**
 * Cheap, deterministic cue and difficulty gate for QuestionBankItem rows.
 *
 * No model calls. No database writes. Callers SELECT rows and pass them here.
 * NCLEX (fieldId `nursing`) is report-only: band mismatches are counted, and
 * the report does not include a relabel suggestion.
 */
import { findNearDuplicatePairs } from "@/lib/exam-prep/item-qa/duplicates";
import { normalizeItemText } from "@/lib/exam-prep/item-qa/normalize";
import { readCitations } from "@/lib/exam-prep/item-qa/rationale-schema";
import { isStudentEligible } from "@/lib/exam-prep/student-eligibility";
import { studentEligibleAndSql } from "@/lib/exam-prep/student-eligibility-sql";
import { parseBankOptions } from "@/lib/mpje/parse-bank-options";
import { cleanOptionText, parseSelectAllCorrectAnswers } from "@/lib/question-format";

/** Boards this Week-1 gate knows how to name. Values are QuestionBankItem.fieldId. */
export const QUALITY_GATE_BOARDS: Record<string, string> = {
  pance: "pance",
  naplex: "pharmacy",
  pharmacy: "pharmacy",
  "aanp-fnp": "aanp-fnp",
  fnp: "aanp-fnp",
  nclex: "nursing",
  nursing: "nursing",
  "nclex-rn": "nursing",
  "nclex-rn-2026": "nursing",
  "nclex-ngn": "nursing",
};

export function resolveQualityGateBoard(input: string): { board: string; fieldId: string } | null {
  const board = input.trim().toLowerCase();
  const fieldId = QUALITY_GATE_BOARDS[board];
  if (!fieldId) return null;
  return { board, fieldId };
}

/**
 * Served pool: active, qaPassed, and the shared student-eligibility predicate.
 * The SQL fragment is `studentEligibleAndSql()` — do not fork that rule here.
 */
export function qualityGateServedSql(): string {
  return `active = true AND "qaPassed" = true\n${studentEligibleAndSql()}`;
}

export const CUE_FLAG_CODES = [
  "key_longest",
  "stem_echo",
  "distractor_absolute",
  "option_length_outlier",
  "sata_keyed_longest",
] as const;

export type CueFlagCode = (typeof CUE_FLAG_CODES)[number];

export type GateFlagCode =
  | CueFlagCode
  | "near_duplicate"
  | "repeated_template"
  | "difficulty_band_mismatch"
  | "missing_citation"
  | "missing_source_check";

export type DifficultyLabel = "Easy" | "Medium" | "Hard";

export type QualityGateRow = {
  id: string;
  fieldId: string;
  subjectId?: string | null;
  difficulty?: number | null;
  topicCategory?: string | null;
  blueprintTopic?: string | null;
  itemType?: string | null;
  scenario?: string | null;
  question: string;
  options: string;
  correctAnswer: string;
  references?: unknown;
  generationMeta?: unknown;
  curationMeta?: unknown;
  active?: boolean | null;
  qaPassed?: boolean | null;
  explanation?: string | null;
};

export type ItemFlag = {
  code: GateFlagCode;
  detail: string;
};

export type ItemDifficulty = {
  stored: number | null;
  storedLabel: DifficultyLabel | null;
  proxyLabel: DifficultyLabel;
  proxyScore: number;
  genuinelyHard: boolean;
  /** Present only for non-NCLEX full-band disagreements. Never written to the bank. */
  relabelSuggestion?: DifficultyLabel;
};

export type ItemReport = {
  id: string;
  fieldId: string;
  subjectId: string;
  topic: string;
  itemType: string;
  flags: ItemFlag[];
  difficulty: ItemDifficulty;
};

export type TopicRollup = {
  topic: string;
  scanned: number;
  cueFlags: number;
  keyLengthEvaluated: number;
  keyLongest: number;
  keyLongestRate: number | null;
  keyLongestBatchFlag: boolean;
  nearPairs: number;
  templateGroups: number;
  positionEvaluated: number;
  positionMaxShare: number | null;
  positionSkew: boolean;
};

export type QualityGateReport = {
  generatedAt: string;
  mode: "read-only";
  writes: false;
  board: string;
  fieldId: string;
  servedOnly: boolean;
  limit: number | null;
  scanned: number;
  flaggedItems: number;
  checks: {
    keyLength: {
      evaluated: number;
      flagged: number;
      rate: number | null;
      batchFlag: boolean;
      threshold: 0.3;
    };
    stemEcho: { flagged: number };
    distractorShape: { absoluteFlags: number; lengthFlags: number };
    sata: { evaluated: number; flagged: number };
    duplicates: {
      nearPairs: Array<{
        topic: string;
        keepId: string;
        flagId: string;
        kind: string;
        stemSimilarity: number;
      }>;
      templateGroups: Array<{ topic: string; skeleton: string; ids: string[] }>;
    };
    answerPosition: {
      optionCount: number | null;
      evaluated: number;
      counts: Record<string, number>;
      maxShare: number | null;
      batchFlag: boolean;
      threshold: 0.4;
    };
    difficulty: {
      compared: number;
      bandMismatches: number;
      proxyCounts: Record<DifficultyLabel, number>;
      genuinelyHard: number;
      /** Capped list. `genuinelyHard` is the full count. */
      genuinelyHardIds: string[];
      nclexReportOnly: boolean;
      relabelProposals: number;
      note: string;
    };
    support: {
      citationPresent: number;
      citationMissing: number;
      sourceCheckFieldPresent: boolean;
      sourceCheckRecorded: number;
      sourceCheckMissing: number;
      /** Ids only. Citation gaps are counted above and are not a separate worklist. */
      citationMissingSample: string[];
    };
  };
  topics: TopicRollup[];
  items: ItemReport[];
  validation?: CueRecall;
};

const KEY_LONGEST_BATCH_THRESHOLD = 0.3;
const KEY_LONGEST_MIN_BATCH = 10;
const POSITION_BATCH_MIN = 40;
const POSITION_BATCH_SHARE = 0.4;
const POSITION_TOPIC_MIN = 20;
const POSITION_TOPIC_SHARE = 0.45;
const TEMPLATE_MIN_GROUP = 3;
const TEMPLATE_MIN_TOKENS = 6;
const HARD_ID_CAP = 100;

const STOPWORDS = new Set([
  "about", "after", "again", "against", "all", "also", "and", "any", "are", "aren",
  "because", "been", "before", "being", "best", "both", "but", "can", "client",
  "could", "did", "does", "doing", "during", "each", "else", "few", "for", "from",
  "further", "had", "has", "have", "having", "her", "here", "hers", "him", "his",
  "how", "into", "its", "just", "least", "more", "most", "next", "not", "now",
  "nurse", "nursing", "old", "once", "only", "other", "our", "out", "over",
  "patient", "patients", "per", "should", "some", "such", "than", "that", "the",
  "their", "them", "then", "there", "these", "they", "this", "those", "through",
  "under", "until", "very", "was", "were", "what", "when", "where", "which",
  "while", "who", "whom", "why", "will", "with", "would", "year", "years", "you",
  "your", "following", "appropriate", "history", "presents", "presenting",
]);

const ABSOLUTE =
  /\b(?:always|never|guarantees?|guaranteed)\b|\ball\b/i;

const STRONG_CUES = new Set<GateFlagCode>([
  "key_longest",
  "stem_echo",
  "sata_keyed_longest",
  "distractor_absolute",
]);

const SOURCE_CHECK_KEYS = new Set([
  "sourceCheck",
  "sourceChecked",
  "sourceCheckedAt",
  "sourceReview",
  "source_check",
]);

const CUE_CODE_ALIASES: Record<string, readonly CueFlagCode[]> = {
  key_longest: ["key_longest"],
  keyed_longest: ["key_longest"],
  key_length: ["key_longest"],
  longest_key: ["key_longest"],
  stem_echo: ["stem_echo"],
  echo: ["stem_echo"],
  distractor_absolute: ["distractor_absolute"],
  absolute: ["distractor_absolute"],
  absolutes: ["distractor_absolute"],
  option_length_outlier: ["option_length_outlier"],
  distractor_length: ["option_length_outlier"],
  distractor_shape: ["distractor_absolute", "option_length_outlier"],
  sata_keyed_longest: ["sata_keyed_longest"],
  sata: ["sata_keyed_longest"],
  sata_longest: ["sata_keyed_longest"],
};

type Prepared = {
  row: QualityGateRow;
  topic: string;
  options: string[];
  keyedIndexes: number[];
  sata: boolean;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function norm(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

/** Same bands as `boardDifficultyLabel` in src/lib/question-bank.ts. */
export function storedDifficultyLabel(difficulty: number | null | undefined): DifficultyLabel | null {
  if (difficulty == null || !Number.isInteger(difficulty) || difficulty < 1 || difficulty > 5) {
    return null;
  }
  if (difficulty <= 2) return "Easy";
  if (difficulty >= 4) return "Hard";
  return "Medium";
}

export function topicKey(row: QualityGateRow): string {
  const topic = row.blueprintTopic?.trim() || row.topicCategory?.trim() || row.subjectId?.trim();
  return topic || "unscoped";
}

function contentWords(text: string): Set<string> {
  const words = new Set<string>();
  for (const token of normalizeItemText(text).split(" ")) {
    if (token.length < 4) continue;
    if (STOPWORDS.has(token)) continue;
    words.add(token);
  }
  return words;
}

function overlap(a: Set<string>, b: Set<string>): number {
  let n = 0;
  for (const word of a) if (b.has(word)) n += 1;
  return n;
}

function letterIndexes(correctAnswer: string, optionCount: number): number[] {
  const trimmed = correctAnswer.trim();
  if (!trimmed || trimmed.length > 16) return [];
  if (!/^[A-Ea-e](?:\s*(?:,|&|\/|\+|and)\s*[A-Ea-e])*$/i.test(trimmed)) return [];
  const letters = trimmed.toUpperCase().match(/[A-E]/g) ?? [];
  const indexes = letters.map((letter) => letter.charCodeAt(0) - 65);
  if (!indexes.length || indexes.some((index) => index < 0 || index >= optionCount)) return [];
  return indexes;
}

function resolveKeyedIndexes(options: string[], correctAnswer: string): number[] {
  const parsed = parseSelectAllCorrectAnswers(options, correctAnswer);
  const indexes: number[] = [];
  for (const key of parsed) {
    const wanted = norm(key);
    const index = options.findIndex((option) => norm(option) === wanted);
    if (index >= 0 && !indexes.includes(index)) indexes.push(index);
  }
  if (indexes.length) return indexes;
  return letterIndexes(correctAnswer, options.length);
}

function isSata(row: QualityGateRow, options: string[], keyedIndexes: number[]): boolean {
  const type = (row.itemType ?? "").trim().toLowerCase();
  if (type === "select_all" || type === "sata") return true;
  const stem = `${row.scenario ?? ""}\n${row.question}`;
  if (/\bselect all\b/i.test(stem) && keyedIndexes.length >= 2) return true;
  if (keyedIndexes.length >= 2 && (type === "mcq" || type === "vignette" || type === "multiple_choice" || type === "")) {
    return true;
  }
  return false;
}

function prepare(row: QualityGateRow): Prepared {
  const raw = typeof row.options === "string" ? row.options : JSON.stringify(row.options ?? "");
  const options = parseBankOptions(raw).options.map((option) => cleanOptionText(option));
  const keyedIndexes = options.length ? resolveKeyedIndexes(options, row.correctAnswer ?? "") : [];
  return {
    row,
    topic: topicKey(row),
    options,
    keyedIndexes,
    sata: isSata(row, options, keyedIndexes),
  };
}

function lengthOutlierIndexes(lengths: number[]): number[] {
  if (lengths.length < 3) return [];
  const sorted = [...lengths].sort((a, b) => a - b);
  const mid = sorted[Math.floor(sorted.length / 2)] ?? 0;
  if (mid < 12) return [];
  const outliers: number[] = [];
  lengths.forEach((length, index) => {
    const delta = Math.abs(length - mid);
    if (delta < 18) return;
    const ratio = length / mid;
    if (ratio <= 0.45 || ratio >= 2.2) outliers.push(index);
  });
  return outliers;
}

function optionLengthEntropyRatio(lengths: number[]): number {
  const sum = lengths.reduce((total, length) => total + Math.max(0, length), 0);
  if (sum <= 0 || lengths.length < 2) return 0;
  let entropy = 0;
  for (const length of lengths) {
    const p = Math.max(0, length) / sum;
    if (p > 0) entropy -= p * Math.log2(p);
  }
  return entropy / Math.log2(lengths.length);
}

function stemWordCount(row: QualityGateRow): number {
  return normalizeItemText(`${row.scenario ?? ""} ${row.question}`).split(" ").filter(Boolean).length;
}

export function proxyDifficulty(
  row: QualityGateRow,
  options: string[],
  flags: readonly GateFlagCode[]
): { label: DifficultyLabel; score: number; genuinelyHard: boolean } {
  const strong = flags.some((flag) => STRONG_CUES.has(flag));
  const words = stemWordCount(row);
  const ratio = optionLengthEntropyRatio(options.map((option) => option.length));
  if (strong && words < 70) {
    return { label: "Easy", score: 0, genuinelyHard: false };
  }
  let score = 0;
  if (words >= 90) score += 2;
  else if (words >= 45) score += 1;
  if (ratio >= 0.93) score += 2;
  else if (ratio >= 0.8) score += 1;
  score += strong ? -1 : 1;
  const label: DifficultyLabel = score >= 4 ? "Hard" : score <= 1 ? "Easy" : "Medium";
  const genuinelyHard = label === "Hard" && !strong && words >= 45 && ratio >= 0.9;
  return { label, score, genuinelyHard };
}

function hasCitation(row: QualityGateRow): boolean {
  const refs = readCitations(row.references) ?? [];
  if (refs.some((ref) => ref.label?.trim() || ref.citation?.trim() || ref.url?.trim())) return true;
  const meta = asRecord(row.generationMeta);
  if (!meta) return false;
  if (typeof meta.sourceLabel === "string" && meta.sourceLabel.trim()) return true;
  const citation = asRecord(meta.citation);
  if (!citation) return false;
  return ["label", "citation", "url"].some(
    (key) => typeof citation[key] === "string" && citation[key].trim()
  );
}

function sourceCheckState(value: unknown, depth = 0): { seen: boolean; recorded: boolean } {
  const record = asRecord(value);
  if (!record || depth > 2) return { seen: false, recorded: false };
  let seen = false;
  let recorded = false;
  for (const [key, entry] of Object.entries(record)) {
    if (SOURCE_CHECK_KEYS.has(key)) {
      seen = true;
      if (sourceCheckRecorded(entry)) recorded = true;
      continue;
    }
    if (entry && typeof entry === "object" && depth < 2) {
      const nested = sourceCheckState(entry, depth + 1);
      seen = seen || nested.seen;
      recorded = recorded || nested.recorded;
    }
  }
  return { seen, recorded };
}

function sourceCheckRecorded(value: unknown): boolean {
  if (value === true) return true;
  if (typeof value === "number") return true;
  if (typeof value === "string") return value.trim().length > 0;
  const record = asRecord(value);
  if (!record) return false;
  return Object.values(record).some((entry) => entry != null && entry !== false && entry !== "");
}

function cueFlagsFor(item: Prepared): ItemFlag[] {
  const flags: ItemFlag[] = [];
  const { options, keyedIndexes, sata } = item;
  if (options.length < 2 || keyedIndexes.length === 0) return flags;
  const lengths = options.map((option) => option.length);
  const keyed = new Set(keyedIndexes);

  if (!sata && keyedIndexes.length === 1) {
    const index = keyedIndexes[0]!;
    const keyLength = lengths[index] ?? 0;
    const others = lengths.filter((_, optionIndex) => optionIndex !== index);
    if (others.length && others.every((length) => keyLength > length)) {
      flags.push({
        code: "key_longest",
        detail: `Keyed option is ${keyLength} characters; every distractor is shorter.`,
      });
    }
  }

  const stemWords = contentWords(`${item.row.scenario ?? ""} ${item.row.question}`);
  const optionOverlaps = options.map((option) => overlap(stemWords, contentWords(option)));
  const keyedOverlaps = keyedIndexes.map((index) => optionOverlaps[index] ?? 0);
  const distractorOverlaps = optionOverlaps.filter((_, index) => !keyed.has(index));
  const bestKey = Math.max(...keyedOverlaps);
  const bestDistractor = distractorOverlaps.length ? Math.max(...distractorOverlaps) : 0;
  if (bestKey >= 2 && distractorOverlaps.every((count) => bestKey > count)) {
    flags.push({
      code: "stem_echo",
      detail: `Key shares ${bestKey} stem content words; best distractor shares ${bestDistractor}.`,
    });
  }

  const keyedHasAbsolute = keyedIndexes.some((index) => ABSOLUTE.test(options[index] ?? ""));
  const absoluteDistractors = options.filter(
    (option, index) => !keyed.has(index) && ABSOLUTE.test(option)
  );
  if (!keyedHasAbsolute && absoluteDistractors.length) {
    flags.push({
      code: "distractor_absolute",
      detail: `Distractor uses an absolute (${absoluteDistractors[0]!.slice(0, 80)}).`,
    });
  }

  for (const index of lengthOutlierIndexes(lengths)) {
    if (keyed.has(index)) continue;
    const mid = [...lengths].sort((a, b) => a - b)[Math.floor(lengths.length / 2)] ?? 0;
    flags.push({
      code: "option_length_outlier",
      detail: `Distractor length ${lengths[index]} vs median ${mid}.`,
    });
    break;
  }

  if (sata && keyedIndexes.length >= 2) {
    const keyLengths = keyedIndexes.map((index) => lengths[index] ?? 0);
    const distractorLengths = lengths.filter((_, index) => !keyed.has(index));
    if (
      distractorLengths.length &&
      Math.min(...keyLengths) > Math.max(...distractorLengths)
    ) {
      flags.push({
        code: "sata_keyed_longest",
        detail: "Every keyed option is longer than every distractor.",
      });
    }
  }

  return flags;
}

function templateSkeleton(question: string): string {
  const tokens = normalizeItemText(question)
    .replace(/\d+/g, "#")
    .split(" ")
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
  if (tokens.length < TEMPLATE_MIN_TOKENS) return "";
  return tokens.slice(0, 8).join(" ");
}

function fullBandMismatch(stored: DifficultyLabel | null, proxy: DifficultyLabel): boolean {
  if (!stored) return false;
  return (stored === "Easy" && proxy === "Hard") || (stored === "Hard" && proxy === "Easy");
}

type MutableTopic = TopicRollup & {
  positionCounts: Map<number, Map<number, number>>;
};

function emptyTopic(topic: string): MutableTopic {
  return {
    topic,
    scanned: 0,
    cueFlags: 0,
    keyLengthEvaluated: 0,
    keyLongest: 0,
    keyLongestRate: null,
    keyLongestBatchFlag: false,
    nearPairs: 0,
    templateGroups: 0,
    positionEvaluated: 0,
    positionMaxShare: null,
    positionSkew: false,
    positionCounts: new Map(),
  };
}

export function filterServedRows(rows: readonly QualityGateRow[]): QualityGateRow[] {
  return rows.filter((row) => {
    if (row.active !== true || row.qaPassed !== true) return false;
    return isStudentEligible({
      id: row.id,
      fieldId: row.fieldId,
      active: row.active,
      qaPassed: row.qaPassed,
      itemType: row.itemType,
      question: row.question,
      scenario: row.scenario,
      correctAnswer: row.correctAnswer,
      explanation: row.explanation,
      optionsRaw: row.options,
      curationMeta: row.curationMeta,
    });
  });
}

export function buildQualityGateReport(
  rows: readonly QualityGateRow[],
  input: {
    board: string;
    fieldId: string;
    servedOnly: boolean;
    limit: number | null;
    generatedAt: string;
  }
): QualityGateReport {
  const prepared = rows.map(prepare);
  const nclexReportOnly = input.fieldId === "nursing";
  const topics = new Map<string, MutableTopic>();
  const topicOf = (topic: string) => {
    let bucket = topics.get(topic);
    if (!bucket) {
      bucket = emptyTopic(topic);
      topics.set(topic, bucket);
    }
    return bucket;
  };

  const itemFlags = new Map<string, ItemFlag[]>();
  const sourceStates: Array<{ seen: boolean; recorded: boolean }> = [];
  let keyEvaluated = 0;
  let keyLongest = 0;
  let stemEcho = 0;
  let absoluteFlags = 0;
  let lengthFlags = 0;
  let sataEvaluated = 0;
  let sataFlagged = 0;
  let citationPresent = 0;
  let citationMissing = 0;
  const citationMissingSample: string[] = [];
  let anySourceField = false;
  const supportFlags = new Map<string, ItemFlag[]>();

  const positionByCount = new Map<number, Map<number, number>>();
  const bumpPosition = (map: Map<number, Map<number, number>>, optionCount: number, index: number) => {
    let counts = map.get(optionCount);
    if (!counts) {
      counts = new Map();
      map.set(optionCount, counts);
    }
    counts.set(index, (counts.get(index) ?? 0) + 1);
  };

  prepared.forEach((item, index) => {
    const flags = cueFlagsFor(item);
    const topic = topicOf(item.topic);
    topic.scanned += 1;
    const cueCount = flags.filter((flag) => (CUE_FLAG_CODES as readonly string[]).includes(flag.code)).length;
    topic.cueFlags += cueCount;

    const singleKey = !item.sata && item.keyedIndexes.length === 1 && item.options.length >= 2;
    if (singleKey) {
      keyEvaluated += 1;
      topic.keyLengthEvaluated += 1;
      if (flags.some((flag) => flag.code === "key_longest")) {
        keyLongest += 1;
        topic.keyLongest += 1;
      }
      const optionCount = item.options.length;
      const keyIndex = item.keyedIndexes[0]!;
      bumpPosition(positionByCount, optionCount, keyIndex);
      bumpPosition(topic.positionCounts, optionCount, keyIndex);
    }
    if (flags.some((flag) => flag.code === "stem_echo")) stemEcho += 1;
    if (flags.some((flag) => flag.code === "distractor_absolute")) absoluteFlags += 1;
    if (flags.some((flag) => flag.code === "option_length_outlier")) lengthFlags += 1;
    if (item.sata && item.keyedIndexes.length >= 2 && item.options.length >= 3) {
      sataEvaluated += 1;
      if (flags.some((flag) => flag.code === "sata_keyed_longest")) sataFlagged += 1;
    }

    const support: ItemFlag[] = [];
    if (hasCitation(item.row)) citationPresent += 1;
    else {
      citationMissing += 1;
      if (citationMissingSample.length < 30) citationMissingSample.push(item.row.id);
      support.push({
        code: "missing_citation",
        detail: "No references entry, generationMeta.citation, or generationMeta.sourceLabel.",
      });
    }

    const source = sourceCheckState(item.row.generationMeta);
    const sourceMeta = sourceCheckState(item.row.curationMeta);
    const seen = source.seen || sourceMeta.seen;
    const recorded = source.recorded || sourceMeta.recorded;
    if (seen) anySourceField = true;
    sourceStates[index] = { seen, recorded };
    supportFlags.set(item.row.id, support);
    itemFlags.set(item.row.id, flags);
  });

  if (anySourceField) {
    prepared.forEach((item, index) => {
      const state = sourceStates[index];
      if (state?.recorded) return;
      supportFlags.get(item.row.id)?.push({
        code: "missing_source_check",
        detail: "A source-check field is in use on this batch, and this row has none recorded.",
      });
    });
  }

  const byTopic = new Map<string, Prepared[]>();
  for (const item of prepared) {
    const list = byTopic.get(item.topic) ?? [];
    list.push(item);
    byTopic.set(item.topic, list);
  }

  const nearPairs: QualityGateReport["checks"]["duplicates"]["nearPairs"] = [];
  const templateGroups: QualityGateReport["checks"]["duplicates"]["templateGroups"] = [];

  for (const [topic, items] of byTopic) {
    const pairs = findNearDuplicatePairs(
      items.map((item) => ({
        id: item.row.id,
        fieldId: item.row.fieldId,
        stem: `${item.row.scenario ?? ""} ${item.row.question}`.trim(),
        options: item.options,
      }))
    );
    const bucket = topicOf(topic);
    bucket.nearPairs = pairs.length;
    for (const pair of pairs) {
      nearPairs.push({ topic, ...pair });
      const flags = itemFlags.get(pair.flagId);
      if (flags && !flags.some((flag) => flag.code === "near_duplicate")) {
        flags.push({
          code: "near_duplicate",
          detail: `${pair.kind} of ${pair.keepId} in ${topic} (stem similarity ${pair.stemSimilarity}).`,
        });
      }
    }

    const skeletons = new Map<string, string[]>();
    for (const item of items) {
      const skeleton = templateSkeleton(item.row.question);
      if (!skeleton) continue;
      const ids = skeletons.get(skeleton) ?? [];
      ids.push(item.row.id);
      skeletons.set(skeleton, ids);
    }
    for (const [skeleton, ids] of skeletons) {
      if (ids.length < TEMPLATE_MIN_GROUP) continue;
      templateGroups.push({ topic, skeleton, ids });
      bucket.templateGroups += 1;
      for (const id of ids) {
        const flags = itemFlags.get(id);
        if (flags && !flags.some((flag) => flag.code === "repeated_template")) {
          flags.push({
            code: "repeated_template",
            detail: `Stem template shared by ${ids.length} items in ${topic}.`,
          });
        }
      }
    }
  }

  const proxyCounts: Record<DifficultyLabel, number> = { Easy: 0, Medium: 0, Hard: 0 };
  let compared = 0;
  let bandMismatches = 0;
  const genuinelyHardIds: string[] = [];
  let genuinelyHard = 0;
  const items: ItemReport[] = [];

  for (const item of prepared) {
    const flags = itemFlags.get(item.row.id) ?? [];
    const codes = flags.map((flag) => flag.code);
    const proxy = proxyDifficulty(item.row, item.options, codes);
    proxyCounts[proxy.label] += 1;
    const stored = item.row.difficulty ?? null;
    const storedLabel = storedDifficultyLabel(stored);
    if (storedLabel) compared += 1;
    const mismatch = fullBandMismatch(storedLabel, proxy.label);
    if (mismatch) {
      bandMismatches += 1;
      flags.push({
        code: "difficulty_band_mismatch",
        detail: `Stored ${storedLabel} vs proxy ${proxy.label}.`,
      });
    }
    if (proxy.genuinelyHard) {
      genuinelyHard += 1;
      if (genuinelyHardIds.length < HARD_ID_CAP) genuinelyHardIds.push(item.row.id);
    }
    const difficulty: ItemDifficulty = {
      stored: storedLabel ? stored : null,
      storedLabel,
      proxyLabel: proxy.label,
      proxyScore: proxy.score,
      genuinelyHard: proxy.genuinelyHard,
    };
    if (!nclexReportOnly && mismatch && storedLabel && proxy.label) {
      difficulty.relabelSuggestion = proxy.label;
    }
    const support = supportFlags.get(item.row.id) ?? [];
    if (flags.length && support.length) flags.push(...support);
    if (flags.length) {
      items.push({
        id: item.row.id,
        fieldId: item.row.fieldId,
        subjectId: item.row.subjectId?.trim() || "",
        topic: item.topic,
        itemType: item.row.itemType?.trim() || "mcq",
        flags,
        difficulty,
      });
    }
  }

  const finishPosition = (
    countsByOption: Map<number, Map<number, number>>,
    minN: number,
    share: number
  ): { optionCount: number | null; evaluated: number; counts: Record<string, number>; maxShare: number | null; flag: boolean } => {
    let bestCount = -1;
    let optionCount: number | null = null;
    let counts = new Map<number, number>();
    for (const [count, map] of countsByOption) {
      const total = [...map.values()].reduce((sum, n) => sum + n, 0);
      if (total > bestCount) {
        bestCount = total;
        optionCount = count;
        counts = map;
      }
    }
    const evaluated = bestCount > 0 ? bestCount : 0;
    const record: Record<string, number> = {};
    let max = 0;
    for (const [index, n] of counts) {
      record[String(index)] = n;
      if (n > max) max = n;
    }
    const maxShare = evaluated ? max / evaluated : null;
    return {
      optionCount,
      evaluated,
      counts: record,
      maxShare,
      flag: evaluated >= minN && maxShare != null && maxShare > share,
    };
  };

  const position = finishPosition(positionByCount, POSITION_BATCH_MIN, POSITION_BATCH_SHARE);
  for (const topic of topics.values()) {
    const topicPosition = finishPosition(topic.positionCounts, POSITION_TOPIC_MIN, POSITION_TOPIC_SHARE);
    topic.positionEvaluated = topicPosition.evaluated;
    topic.positionMaxShare = topicPosition.maxShare;
    topic.positionSkew = topicPosition.flag;
    topic.keyLongestRate = topic.keyLengthEvaluated
      ? topic.keyLongest / topic.keyLengthEvaluated
      : null;
    topic.keyLongestBatchFlag =
      topic.keyLengthEvaluated >= KEY_LONGEST_MIN_BATCH &&
      (topic.keyLongestRate ?? 0) > KEY_LONGEST_BATCH_THRESHOLD;
  }

  const keyRate = keyEvaluated ? keyLongest / keyEvaluated : null;
  const sourceRecorded = sourceStates.filter((state) => state?.recorded).length;
  const sourceMissing = anySourceField ? prepared.length - sourceRecorded : 0;

  const cueWeight = (flags: ItemFlag[]) =>
    flags.filter((flag) => (CUE_FLAG_CODES as readonly string[]).includes(flag.code)).length;
  items.sort(
    (a, b) => cueWeight(b.flags) - cueWeight(a.flags) || b.flags.length - a.flags.length || a.id.localeCompare(b.id)
  );
  const topicList = [...topics.values()]
    .map(({ positionCounts: _positionCounts, ...topic }) => topic)
    .sort((a, b) => b.cueFlags - a.cueFlags || (b.keyLongestRate ?? 0) - (a.keyLongestRate ?? 0) || a.topic.localeCompare(b.topic));

  const difficultyNote = nclexReportOnly
    ? "NCLEX is report-only. Band mismatches are listed and no relabel suggestion is included."
    : "relabelSuggestion is a report field only. This script never writes difficulty.";

  return {
    generatedAt: input.generatedAt,
    mode: "read-only",
    writes: false,
    board: input.board,
    fieldId: input.fieldId,
    servedOnly: input.servedOnly,
    limit: input.limit,
    scanned: prepared.length,
    flaggedItems: items.length,
    checks: {
      keyLength: {
        evaluated: keyEvaluated,
        flagged: keyLongest,
        rate: keyRate,
        batchFlag: keyEvaluated >= KEY_LONGEST_MIN_BATCH && (keyRate ?? 0) > KEY_LONGEST_BATCH_THRESHOLD,
        threshold: KEY_LONGEST_BATCH_THRESHOLD,
      },
      stemEcho: { flagged: stemEcho },
      distractorShape: { absoluteFlags, lengthFlags },
      sata: { evaluated: sataEvaluated, flagged: sataFlagged },
      duplicates: { nearPairs, templateGroups },
      answerPosition: {
        optionCount: position.optionCount,
        evaluated: position.evaluated,
        counts: position.counts,
        maxShare: position.maxShare,
        batchFlag: position.flag,
        threshold: POSITION_BATCH_SHARE,
      },
      difficulty: {
        compared,
        bandMismatches,
        proxyCounts,
        genuinelyHard,
        genuinelyHardIds,
        nclexReportOnly,
        relabelProposals: nclexReportOnly ? 0 : bandMismatches,
        note: difficultyNote,
      },
      support: {
        citationPresent,
        citationMissing,
        sourceCheckFieldPresent: anySourceField,
        sourceCheckRecorded: sourceRecorded,
        sourceCheckMissing: sourceMissing,
        citationMissingSample,
      },
    },
    topics: topicList,
    items,
  };
}

export type KnownCueFlag = {
  id: string;
  codes: string[];
};

export type CueRecall = {
  knownFlags: number;
  recalledFlags: number;
  recall: number | null;
  knownItems: number;
  recalledItems: number;
  itemRecall: number | null;
  missed: Array<{ id: string; code: string }>;
};

export function parseKnownCueFlags(value: unknown): KnownCueFlag[] {
  const list = Array.isArray(value)
    ? value
    : asRecord(value)?.flags ?? asRecord(value)?.items;
  if (!Array.isArray(list)) return [];
  const byId = new Map<string, Set<string>>();
  for (const entry of list) {
    const record = asRecord(entry);
    if (!record || typeof record.id !== "string" || !record.id.trim()) continue;
    const codes = new Set(byId.get(record.id) ?? []);
    const many = Array.isArray(record.codes) ? record.codes : [];
    const one = typeof record.code === "string" ? [record.code] : [];
    for (const code of [...many, ...one]) {
      if (typeof code === "string" && code.trim()) codes.add(code.trim());
    }
    byId.set(record.id, codes);
  }
  return [...byId.entries()].map(([id, codes]) => ({ id, codes: [...codes] }));
}

function recalledCode(known: string, actual: ReadonlySet<string>): boolean {
  const aliases = CUE_CODE_ALIASES[known.trim().toLowerCase()];
  if (!aliases) return actual.has(known);
  return aliases.some((code) => actual.has(code));
}

/** Recall of known CUE flags. A missing code list counts the item as one cue hit if any cue flag fired. */
export function scoreCueRecall(report: QualityGateReport, known: readonly KnownCueFlag[]): CueRecall {
  const actual = new Map(report.items.map((item) => [item.id, new Set(item.flags.map((flag) => flag.code))]));
  let knownFlags = 0;
  let recalledFlags = 0;
  let knownItems = 0;
  let recalledItems = 0;
  const missed: Array<{ id: string; code: string }> = [];

  for (const entry of known) {
    const flags = actual.get(entry.id) ?? new Set<string>();
    const codes = entry.codes.length ? entry.codes : ["cue"];
    let itemHit = false;
    let itemCounted = false;
    for (const code of codes) {
      const generic = code.trim().toLowerCase() === "cue";
      const hit = generic
        ? [...flags].some((flag) => (CUE_FLAG_CODES as readonly string[]).includes(flag))
        : recalledCode(code, flags);
      if (generic || CUE_CODE_ALIASES[code.trim().toLowerCase()] || (CUE_FLAG_CODES as readonly string[]).includes(code as CueFlagCode)) {
        knownFlags += 1;
        itemCounted = true;
        if (hit) {
          recalledFlags += 1;
          itemHit = true;
        } else {
          missed.push({ id: entry.id, code });
        }
      }
    }
    if (itemCounted) {
      knownItems += 1;
      if (itemHit) recalledItems += 1;
    }
  }

  return {
    knownFlags,
    recalledFlags,
    recall: knownFlags ? recalledFlags / knownFlags : null,
    knownItems,
    recalledItems,
    itemRecall: knownItems ? recalledItems / knownItems : null,
    missed,
  };
}

function pct(rate: number | null): string {
  if (rate == null) return "n/a";
  return `${(rate * 100).toFixed(1)}%`;
}

export function renderQualityGateMarkdown(report: QualityGateReport): string {
  const { checks } = report;
  const lines = [
    `# Cue and difficulty gate — ${report.board}`,
    "",
    `Read-only report. Nothing was written to the question bank.`,
    "",
    `- Generated: ${report.generatedAt}`,
    `- Field: \`${report.fieldId}\`${report.servedOnly ? " (served only: active, qaPassed, student-eligible)" : ""}`,
    `- Scanned: ${report.scanned}`,
    `- Flagged items: ${report.flaggedItems}`,
    ...(report.limit != null ? [`- Limit: ${report.limit}`] : []),
    "",
    "## Checks",
    "",
    `1. Key length — ${checks.keyLength.flagged} / ${checks.keyLength.evaluated} keyed-longest (${pct(checks.keyLength.rate)}). Batch flag when over ${pct(checks.keyLength.threshold)}: ${checks.keyLength.batchFlag ? "yes" : "no"}.`,
    `2. Stem echo — ${checks.stemEcho.flagged} item(s) whose key shares more stem content words than every distractor.`,
    `3. Distractor shape — ${checks.distractorShape.absoluteFlags} absolute(s), ${checks.distractorShape.lengthFlags} length outlier(s).`,
    `4. SATA — ${checks.sata.flagged} / ${checks.sata.evaluated} where the keyed options are the longest.`,
    `5. Duplicates / templates — ${checks.duplicates.nearPairs.length} near-duplicate pair(s), ${checks.duplicates.templateGroups.length} repeated template group(s).`,
    `6. Answer position — option count ${checks.answerPosition.optionCount ?? "n/a"}, max share ${pct(checks.answerPosition.maxShare)} across ${checks.answerPosition.evaluated} item(s). Skew: ${checks.answerPosition.batchFlag ? "yes" : "no"}.`,
    `7. Difficulty — compared ${checks.difficulty.compared}, full-band mismatches ${checks.difficulty.bandMismatches}, genuinely hard ${checks.difficulty.genuinelyHard}. Relabel proposals: ${checks.difficulty.relabelProposals}. ${checks.difficulty.note}`,
    `8. Support — citation present ${checks.support.citationPresent}, missing ${checks.support.citationMissing}. Source-check field ${checks.support.sourceCheckFieldPresent ? "present" : "not stored on this batch"} (recorded ${checks.support.sourceCheckRecorded}).`,
    "",
    "## Topics",
    "",
  ];

  if (!report.topics.length) lines.push("No rows.");
  else {
    lines.push("| Topic | Scanned | Cue flags | Keyed-longest | Templates | Position skew |");
    lines.push("| --- | ---: | ---: | ---: | ---: | --- |");
    for (const topic of report.topics.slice(0, 15)) {
      lines.push(
        `| ${topic.topic} | ${topic.scanned} | ${topic.cueFlags} | ${pct(topic.keyLongestRate)} | ${topic.templateGroups} | ${topic.positionSkew ? "yes" : "no"} |`
      );
    }
  }

  lines.push("", "## Sample flags", "");
  if (!report.items.length) lines.push("No flags.");
  else {
    for (const item of report.items.slice(0, 20)) {
      const codes = item.flags.map((flag) => flag.code).join(", ");
      lines.push(`- \`${item.id}\` (${item.topic}): ${codes}`);
    }
  }

  if (report.topics.length > 15 || report.items.length > 20) {
    lines.push("", "The JSON report has the full worklist.");
  }
  if (report.validation) {
    const recall = report.validation.recall == null ? "n/a" : pct(report.validation.recall);
    lines.push(
      "",
      "## Validation",
      "",
      `Known CUE flags recalled: ${report.validation.recalledFlags} / ${report.validation.knownFlags} (${recall}).`,
      `Known items with at least one recalled CUE flag: ${report.validation.recalledItems} / ${report.validation.knownItems}.`
    );
  }
  lines.push("");
  return lines.join("\n");
}

export const QUALITY_GATE_HELP = `Cue and difficulty quality gate (READ-ONLY).

Selects QuestionBankItem rows and writes a JSON worklist plus a markdown summary.
Never UPDATE, INSERT, or DELETE. No model calls. --apply and --write are refused.

Usage:
  npx tsx scripts/quality-gate-cue-difficulty.ts --help
  npx tsx scripts/quality-gate-cue-difficulty.ts --board <board> [options]
  npx tsx scripts/quality-gate-cue-difficulty.ts --fixture items.json [options]

Boards:
  pance                         field pance
  nclex | nclex-rn-2026 | nursing
                                field nursing
  naplex | pharmacy             field pharmacy
  aanp-fnp | fnp                field aanp-fnp

Options:
  --limit <n>           First n rows by id
  --ids-file <path>     Newline-separated QuestionBankItem ids
  --json-out <path>     Default tmp/quality-gate/<board>-<UTC date>.json
  --md-out <path>       Default is the JSON path with .md
  --served-only         active AND qaPassed AND studentEligibleAndSql()
  --validate-flags <p>  JSON of known CUE flags; prints recall (target >= 80% later)
  --fixture <path>      Score a local JSON file. No database connection.
  --dry-run             Accepted. The script is already read-only.

Week-1 live-bank exports are triage only until Ryan says a run is actionable.
`;
