#!/usr/bin/env node
/**
 * Subject / content-match audit (READ-ONLY — never writes to the bank).
 *
 * Cross-checks each active question against its assigned classification using the
 * shared canonical taxonomy (src/lib/subjects/canonical-taxonomy.ts):
 *
 *   - orphan_subject          subjectId is not in the field's subject registry
 *   - subject_content_mismatch  content strongly matches a DIFFERENT content-bearing
 *                               canonical topic than the one it is filed under
 *   - usmle_step_mismatch      (USMLE only) content implies a different Step than
 *                               the row's field/stepLevel (rule-based classifier)
 *
 * Output: a console summary + artifacts/subject-content-match-audit.json with samples.
 * Optional --llm verifies a bounded number of content mismatches with OpenAI.
 *
 * Usage:
 *   npm run db:audit-subject-match
 *   npm run db:audit-subject-match -- --field usmle-step-1 --limit 2000
 *   npm run db:audit-subject-match -- --llm           # verify flags with OpenAI (bounded)
 *   npm run db:audit-subject-match -- --json          # print full JSON to stdout
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import { loadEnvFiles, requireOpenAiKey } from "./load-env";
import { getSubjectsForFieldId } from "../src/lib/subjects/registry";
import {
  CANONICAL_TOPICS,
  canonicalTopicById,
  getCanonicalTopic,
  getCanonicalTopicId,
} from "../src/lib/subjects/canonical-taxonomy";
import { classifyUsmleStep } from "../src/lib/exam-prep/usmle/classify-step";
import { getOpenAiClient } from "../src/lib/openai-client";

loadEnvFiles();
const prisma = new PrismaClient();

const BOARD_FIELDS = [
  "nursing",
  "pharmacy",
  "usmle-step-1",
  "usmle-step-2",
  "usmle-step-3",
  "pance",
  "aanp-fnp",
  "npte-pt",
] as const;

const CONTENT_TOPICS = CANONICAL_TOPICS.filter((t) => t.contentBearing);
const MISMATCH_MIN_HITS = 2; // distinct keyword hits in another topic to flag
const LLM_VERIFY_CAP = 60; // hard cap on OpenAI calls per run

type FlagType = "orphan_subject" | "subject_content_mismatch" | "usmle_step_mismatch";

type Flag = {
  id: string;
  type: FlagType;
  fieldId: string;
  subjectId: string;
  assignedCanonical?: string;
  suggestedCanonical?: string;
  stepLevel?: string | null;
  suggestedStep?: string | null;
  confidence: "high" | "medium" | "low";
  detail: string;
  questionPreview: string;
  llmVerdict?: "confirmed" | "rejected" | "uncertain";
};

function parseArg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map((t) => String(t));
  } catch {
    /* fall through to CSV */
  }
  return raw.split(",").map((t) => t.trim()).filter(Boolean);
}

function countKeywordHits(haystack: string, keywords: string[]): number {
  let hits = 0;
  for (const kw of keywords) {
    if (haystack.includes(kw)) hits++;
  }
  return hits;
}

/** Returns the best-matching content-bearing canonical (other than `assignedId`). */
function bestOtherContentTopic(
  haystack: string,
  assignedId: string | undefined
): { id: string; hits: number } | null {
  let best: { id: string; hits: number } | null = null;
  for (const topic of CONTENT_TOPICS) {
    if (topic.id === assignedId) continue;
    const hits = countKeywordHits(haystack, topic.keywords);
    if (hits > 0 && (!best || hits > best.hits)) best = { id: topic.id, hits };
  }
  return best;
}

type Row = {
  id: string;
  fieldId: string;
  subjectId: string;
  stepLevel: string | null;
  itemType: string;
  blueprintDomain: string | null;
  blueprintTopic: string | null;
  topicCategory: string | null;
  tags: string | null;
  question: string;
  explanation: string;
  scenario: string | null;
};

function evaluateRow(row: Row, validSubjects: Set<string>): Flag[] {
  const flags: Flag[] = [];
  const preview = row.question.slice(0, 140);

  // 1. Orphan subject id — not in the field registry (won't appear in the picker).
  if (!validSubjects.has(row.subjectId)) {
    flags.push({
      id: row.id,
      type: "orphan_subject",
      fieldId: row.fieldId,
      subjectId: row.subjectId,
      confidence: "high",
      detail: `subjectId "${row.subjectId}" is not a registered subject for ${row.fieldId}`,
      questionPreview: preview,
    });
    return flags; // no point checking content-match for an unmapped subject
  }

  const assigned = getCanonicalTopic(row.fieldId, row.subjectId);
  const haystack = [
    row.question,
    row.explanation,
    row.scenario ?? "",
    parseTags(row.tags).join(" "),
    row.blueprintTopic ?? "",
  ]
    .join(" \n ")
    .toLowerCase();

  // 2. Content-vs-label mismatch — only meaningful for content-bearing topics.
  if (assigned?.contentBearing) {
    const assignedHits = countKeywordHits(haystack, assigned.keywords);
    const other = bestOtherContentTopic(haystack, assigned.id);
    if (other && assignedHits === 0 && other.hits >= MISMATCH_MIN_HITS) {
      flags.push({
        id: row.id,
        type: "subject_content_mismatch",
        fieldId: row.fieldId,
        subjectId: row.subjectId,
        assignedCanonical: assigned.id,
        suggestedCanonical: other.id,
        confidence: other.hits >= 3 ? "high" : "medium",
        detail: `No "${assigned.label}" signal; ${other.hits} "${
          canonicalTopicById(other.id)?.label ?? other.id
        }" signals`,
        questionPreview: preview,
      });
    }
  }

  // 3. USMLE step appropriateness.
  if (row.fieldId.startsWith("usmle")) {
    const guess = classifyUsmleStep({
      fieldId: row.fieldId,
      stepLevel: row.stepLevel,
      subjectId: row.subjectId,
      itemType: row.itemType,
      blueprintDomain: row.blueprintDomain,
      blueprintTopic: row.blueprintTopic,
      topicCategory: row.topicCategory,
      tags: row.tags,
      question: row.question,
      scenario: row.scenario,
    });
    const currentStep =
      row.stepLevel ??
      (row.fieldId === "usmle-step-1" ? "step1" : row.fieldId === "usmle-step-3" ? "step3" : "step2");
    if (guess.step && guess.confidence === "high" && guess.step !== currentStep) {
      flags.push({
        id: row.id,
        type: "usmle_step_mismatch",
        fieldId: row.fieldId,
        subjectId: row.subjectId,
        stepLevel: currentStep,
        suggestedStep: guess.step,
        confidence: "high",
        detail: `content implies ${guess.step} (${guess.reason}) but filed as ${currentStep}`,
        questionPreview: preview,
      });
    }
  }

  return flags;
}

async function verifyWithLlm(flags: Flag[]): Promise<void> {
  const candidates = flags
    .filter((f) => f.type === "subject_content_mismatch")
    .slice(0, LLM_VERIFY_CAP);
  if (candidates.length === 0) return;

  requireOpenAiKey();
  const client = getOpenAiClient("curation");
  if (!client) {
    console.warn("OpenAI curation purpose is gated off — skipping --llm verification.");
    return;
  }
  const model = process.env.OPENAI_CLASSIFY_MODEL ?? "gpt-4o-mini";
  console.log(`\nVerifying ${candidates.length} content mismatches with ${model}…`);

  const byId = new Map(flags.map((f) => [f.id, f]));
  for (const flag of candidates) {
    const row = await prisma.questionBankItem.findUnique({ where: { id: flag.id } });
    if (!row) continue;
    const assigned = canonicalTopicById(flag.assignedCanonical ?? "")?.label ?? flag.assignedCanonical;
    const suggested = canonicalTopicById(flag.suggestedCanonical ?? "")?.label ?? flag.suggestedCanonical;
    try {
      const res = await client.chat.completions.create({
        model,
        temperature: 0,
        messages: [
          {
            role: "system",
            content:
              "You classify medical board questions by clinical subject. Reply with strict JSON " +
              '{"bestSubject": string, "matchesAssigned": boolean}. No prose.',
          },
          {
            role: "user",
            content: `Question: ${row.question}\n\nAssigned subject: ${assigned}\nAlternative subject: ${suggested}\n\nWhich subject best fits the question's content?`,
          },
        ],
      });
      const text = res.choices[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      const target = byId.get(flag.id);
      if (target) {
        target.llmVerdict = parsed.matchesAssigned === true ? "rejected" : "confirmed";
      }
    } catch {
      const target = byId.get(flag.id);
      if (target) target.llmVerdict = "uncertain";
    }
  }
}

async function main() {
  const fieldFilter = parseArg("--field");
  const limit = Number(parseArg("--limit") ?? "0") || undefined;
  const fields = fieldFilter ? [fieldFilter] : [...BOARD_FIELDS];

  const allFlags: Flag[] = [];
  const perField: Array<{
    fieldId: string;
    total: number;
    flagged: number;
    counts: Record<FlagType, number>;
  }> = [];

  for (const fieldId of fields) {
    const validSubjects = new Set(getSubjectsForFieldId(fieldId).map((s) => s.id));
    const rows = (await prisma.questionBankItem.findMany({
      where: { fieldId, active: true },
      select: {
        id: true,
        fieldId: true,
        subjectId: true,
        stepLevel: true,
        itemType: true,
        blueprintDomain: true,
        blueprintTopic: true,
        topicCategory: true,
        tags: true,
        question: true,
        explanation: true,
        scenario: true,
      },
      ...(limit ? { take: limit } : {}),
    })) as Row[];

    const counts: Record<FlagType, number> = {
      orphan_subject: 0,
      subject_content_mismatch: 0,
      usmle_step_mismatch: 0,
    };
    const flaggedIds = new Set<string>();
    for (const row of rows) {
      for (const flag of evaluateRow(row, validSubjects)) {
        counts[flag.type]++;
        flaggedIds.add(flag.id);
        allFlags.push(flag);
      }
    }
    perField.push({ fieldId, total: rows.length, flagged: flaggedIds.size, counts });
  }

  if (hasFlag("--llm")) await verifyWithLlm(allFlags);

  // ── Console summary ──
  console.log("\n── Subject / content-match audit ──\n");
  console.log(
    "Field".padEnd(16) +
      "Items".padStart(8) +
      "Flagged".padStart(9) +
      "Orphan".padStart(8) +
      "Content".padStart(9) +
      "Step".padStart(7)
  );
  console.log("-".repeat(58));
  let totalItems = 0;
  let totalFlagged = 0;
  for (const f of perField) {
    totalItems += f.total;
    totalFlagged += f.flagged;
    console.log(
      f.fieldId.padEnd(16) +
        String(f.total).padStart(8) +
        String(f.flagged).padStart(9) +
        String(f.counts.orphan_subject).padStart(8) +
        String(f.counts.subject_content_mismatch).padStart(9) +
        String(f.counts.usmle_step_mismatch).padStart(7)
    );
  }
  console.log("-".repeat(58));
  console.log("TOTAL".padEnd(16) + String(totalItems).padStart(8) + String(totalFlagged).padStart(9));

  const report = {
    generatedAt: new Date().toISOString(),
    fields: perField,
    totals: { items: totalItems, flagged: totalFlagged },
    flags: allFlags,
  };

  mkdirSync("artifacts", { recursive: true });
  const outPath = "artifacts/subject-content-match-audit.json";
  writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(`\nFull report → ${outPath}`);

  if (hasFlag("--json")) console.log(JSON.stringify(report, null, 2));
  if (totalItems === 0) {
    console.log("\nNo rows found — is DATABASE_URL set and the bank seeded?");
  }
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
