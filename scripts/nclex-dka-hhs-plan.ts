/**
 * Shared plan for the six NCLEX DKA/HHS rewrites.
 * Turns the approved explanation into the option-envelope and expert-rationale
 * shapes the bank already stores. It does not talk to the database.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

export const EXPECTED = 6;
export const DATA_DIR = path.join(process.cwd(), "scripts/data/nclex-dka-hhs-20261001");
export const CORRECTIONS_PATH = path.join(DATA_DIR, "corrections.json");
export const BACKUP_PATH = path.join(DATA_DIR, "backup.json");

const STEP_LABELS = [
  "Recognize Cues:",
  "Analyze Cues:",
  "Prioritize Hypotheses:",
  "Generate Solutions:",
  "Take Action:",
  "Evaluate Outcomes:",
] as const;

const STALE_TEACHING = [
  /insulin first/i,
  /fluids second/i,
  /immediate insulin administration is critical/i,
  /priority intervention is to administer iv insulin/i,
  /should follow insulin/i,
  /insulin administration is the first step/i,
  /prioritize insulin over/i,
  /insulin is the immediate priority/i,
  /administering iv insulin is the most effective/i,
  /initiate iv insulin administration to manage hyperglycemia/i,
];

export type Correction = {
  id: string;
  sc: string;
  q: string;
  opts: string[];
  key: number;
  explanation: string;
};

export type ParsedExplanation = {
  headline: string;
  conceptBullets: string[];
  clinical: string;
  steps: string[];
  evaluate: string;
  insulinSentence: string;
  distractors: Array<{ option: string; reason: string }>;
  correctOption: string;
};

type OptionEnvelope = Record<string, unknown>;
type ExpertRationale = Record<string, unknown>;

export function loadCorrections(): Correction[] {
  const parsed = JSON.parse(readFileSync(CORRECTIONS_PATH, "utf8")) as { items: Correction[] };
  const items = parsed.items;
  if (items.length !== EXPECTED) throw new Error(`expected ${EXPECTED} corrections, found ${items.length}`);
  const ids = new Set<string>();
  for (const item of items) {
    if (!/^[a-z0-9]+$/.test(item.id)) throw new Error(`unexpected id: ${item.id}`);
    if (ids.has(item.id)) throw new Error(`duplicate id: ${item.id}`);
    ids.add(item.id);
    if (!Array.isArray(item.opts) || item.opts.length !== 4) {
      throw new Error(`${item.id} does not have 4 options`);
    }
    if (!Number.isInteger(item.key) || item.key < 0 || item.key > 3) {
      throw new Error(`${item.id} key index is out of range`);
    }
    if (new Set(item.opts).size !== 4) throw new Error(`${item.id} has duplicate options`);
    parseExplanation(item);
  }
  return items;
}

function sentences(paragraph: string): string[] {
  return paragraph
    .split(/(?<=[.])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

export function parseExplanation(item: Pick<Correction, "id" | "opts" | "key" | "explanation">): ParsedExplanation {
  const explanation = item.explanation.replace(/\r\n/g, "\n").trim();
  const clinicalSplit = explanation.split("\n\nClinical reasoning: ");
  if (clinicalSplit.length !== 2) throw new Error(`${item.id} is missing the clinical reasoning section`);
  const why = clinicalSplit[0]!.trim();
  const rest = clinicalSplit[1]!;
  const wrongSplit = rest.split("\n\nWhy other options are incorrect:\n");
  if (wrongSplit.length !== 2) throw new Error(`${item.id} is missing the other-options section`);
  const clinical = wrongSplit[0]!.trim();
  const wrongBlock = wrongSplit[1]!.trim();

  const whySentences = sentences(why);
  if (whySentences.length < 1) throw new Error(`${item.id} why-correct text is empty`);
  const headline = whySentences[0]!;
  const conceptBullets = whySentences.length > 1 ? whySentences.slice(1) : [headline];

  let cursor = clinical;
  const steps: string[] = [];
  for (let i = 0; i < STEP_LABELS.length; i++) {
    const label = STEP_LABELS[i]!;
    if (!cursor.startsWith(label)) throw new Error(`${item.id} clinical reasoning is missing ${label}`);
    const next = STEP_LABELS[i + 1];
    const body = next ? cursor.slice(label.length, cursor.indexOf(next)) : cursor.slice(label.length);
    const text = `${label} ${body.trim()}`.replace(/\s+/g, " ").trim();
    steps.push(text);
    cursor = next ? cursor.slice(cursor.indexOf(next)) : "";
  }
  const evaluate = steps[5]!.replace(/^Evaluate Outcomes:\s*/, "");
  const insulinSentence = whySentences.filter((sentence) => /insulin/i.test(sentence)).join(" ") || headline;

  const distractors: Array<{ option: string; reason: string }> = [];
  for (const line of wrongBlock.split("\n")) {
    const match = line.match(/^•\s+(.+?):\s*Incorrect —\s*(.+)$/);
    if (!match) throw new Error(`${item.id} has an unreadable distractor line`);
    distractors.push({ option: match[1]!.trim(), reason: match[2]!.trim() });
  }
  const correctOption = item.opts[item.key]!;
  const wrongOptions = item.opts.filter((option) => option !== correctOption);
  const distractorOptions = distractors.map((entry) => entry.option);
  if (distractors.length !== 3) throw new Error(`${item.id} does not explain exactly 3 wrong options`);
  if (distractorOptions.includes(correctOption)) {
    throw new Error(`${item.id} lists the correct option as a distractor`);
  }
  for (const option of wrongOptions) {
    if (!distractorOptions.includes(option)) {
      throw new Error(`${item.id} is missing a distractor for an option`);
    }
  }
  for (const option of distractorOptions) {
    if (!item.opts.includes(option)) throw new Error(`${item.id} distractor does not match an option`);
  }

  return {
    headline,
    conceptBullets,
    clinical,
    steps,
    evaluate,
    insulinSentence,
    distractors,
    correctOption,
  };
}

function potassiumValue(scenario: string): string | null {
  const match = scenario.match(/serum potassium is ([0-9]+(?:\.[0-9]+)?) mmol\/L/i);
  return match?.[1] ?? null;
}

function rewriteExpert(expert: ExpertRationale, parsed: ParsedExplanation, scenario: string): ExpertRationale {
  const next = structuredClone(expert);
  next.memoryHook = parsed.headline;
  const whyCorrect = (next.whyCorrect && typeof next.whyCorrect === "object"
    ? next.whyCorrect
    : {}) as Record<string, unknown>;
  next.whyCorrect = {
    ...whyCorrect,
    headline: parsed.headline,
    conceptBreakdown: parsed.conceptBullets,
    clinicalContext: parsed.clinical,
  };
  next.keyTakeaway = parsed.headline;
  next.whyIncorrect = parsed.distractors.map((entry) => ({
    option: entry.option,
    misconception: entry.reason,
    correction: entry.reason,
    conceptLink: parsed.headline,
  }));
  next.clinicalPearl = parsed.headline;
  next.stepByStepReasoning = parsed.steps;
  next.highYieldFacts = parsed.conceptBullets.slice(0, 3);
  next.commonPitfalls = parsed.distractors.map((entry) => entry.reason);
  next.nextStepInCare = parsed.evaluate;
  next.testTakingTip = parsed.headline;
  next.realWorldApplication = parsed.evaluate;
  next.pharmacologyTieIn = parsed.insulinSentence;
  const layered = (next.layeredDepth && typeof next.layeredDepth === "object"
    ? next.layeredDepth
    : {}) as Record<string, unknown>;
  next.layeredDepth = {
    ...layered,
    basic: parsed.headline,
    intermediate: parsed.conceptBullets[0] ?? parsed.headline,
    advanced: parsed.evaluate,
  };
  if (Array.isArray(next.visualCues)) {
    next.visualCues = next.visualCues.map((cue) => {
      if (!cue || typeof cue !== "object") return cue;
      return { ...(cue as Record<string, unknown>), description: parsed.headline };
    });
  }
  const potassium = potassiumValue(scenario);
  if (Array.isArray(next.visualBlocks)) {
    next.visualBlocks = next.visualBlocks.map((block) => {
      if (!block || typeof block !== "object") return block;
      const record = block as Record<string, unknown>;
      if (record.kind === "flow") return { ...record, steps: parsed.steps };
      if (record.kind === "lab_table" && potassium && Array.isArray(record.rows)) {
        return {
          ...record,
          rows: record.rows.map((row) => {
            if (!row || typeof row !== "object") return row;
            const lab = row as Record<string, unknown>;
            if (lab.label !== "Potassium") return row;
            const high = Number(potassium) > 5;
            return {
              ...lab,
              value: `${potassium} mmol/L`,
              abnormal: high,
              note: "Replacement starts once the level falls below 5.0 mmol/L.",
            };
          }),
        };
      }
      return block;
    });
  }
  if (Array.isArray(next.crossReferences)) {
    next.crossReferences = next.crossReferences.map((ref) => {
      if (!ref || typeof ref !== "object") return ref;
      return {
        ...(ref as Record<string, unknown>),
        topic: "Fluid resuscitation",
        note: parsed.headline,
      };
    });
  }
  const stale = staleTeaching(JSON.stringify(next));
  if (stale) throw new Error(`expert rationale still teaches the old priority (${stale})`);
  return next;
}

export function staleTeaching(text: string): string | null {
  for (const pattern of STALE_TEACHING) {
    if (pattern.test(text)) return pattern.source;
  }
  return null;
}

export function nextContent(input: {
  fieldId: string;
  subjectId: string;
  optionsJson: string;
  generationMeta: unknown;
  item: Correction;
}): {
  scenario: string;
  question: string;
  correctAnswer: string;
  explanation: string;
  options: OptionEnvelope;
  generationMeta: unknown;
  contentHash: string;
  parsed: ParsedExplanation;
} {
  const parsed = parseExplanation(input.item);
  const envelope = JSON.parse(input.optionsJson) as unknown;
  if (!envelope || typeof envelope !== "object" || Array.isArray(envelope)) {
    throw new Error(`${input.item.id} options are not an object envelope`);
  }
  const current = envelope as OptionEnvelope;
  if (!Array.isArray(current.options) || current.options.length !== 4) {
    throw new Error(`${input.item.id} live options do not have 4 entries`);
  }
  const options: OptionEnvelope = {
    ...current,
    options: input.item.opts,
    distractorRationale: Object.fromEntries(parsed.distractors.map((entry) => [entry.option, entry.reason])),
    clinicalReasoning: parsed.clinical,
  };
  if (Array.isArray(current.keyTakeaways)) options.keyTakeaways = [parsed.headline];

  let generationMeta = input.generationMeta;
  if (generationMeta && typeof generationMeta === "object" && !Array.isArray(generationMeta)) {
    const meta = generationMeta as Record<string, unknown>;
    if (meta.expertRationale && typeof meta.expertRationale === "object") {
      generationMeta = {
        ...meta,
        expertRationale: rewriteExpert(meta.expertRationale as ExpertRationale, parsed, input.item.sc),
      };
    }
  }

  const rationaleBlob = JSON.stringify({
    explanation: input.item.explanation,
    distractorRationale: options.distractorRationale,
    clinicalReasoning: options.clinicalReasoning,
    keyTakeaways: options.keyTakeaways ?? null,
    expertRationale:
      generationMeta && typeof generationMeta === "object"
        ? (generationMeta as Record<string, unknown>).expertRationale ?? null
        : null,
  });
  const stale = staleTeaching(rationaleBlob);
  if (stale) throw new Error(`${input.item.id} rewritten rationale still matches ${stale}`);

  return {
    scenario: input.item.sc,
    question: input.item.q,
    correctAnswer: parsed.correctOption,
    explanation: input.item.explanation,
    options,
    generationMeta,
    contentHash: bankItemContentHash(input.fieldId, input.subjectId, {
      question: input.item.q,
      scenario: input.item.sc,
    }),
    parsed,
  };
}
