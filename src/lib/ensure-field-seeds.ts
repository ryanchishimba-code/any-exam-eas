import { prisma } from "@/lib/prisma";
import { collectSeedQuestionRows } from "@/lib/question-bank-seed";
import { questionContentHash } from "@/lib/sync-question-bank";
import type { BankItem } from "@/lib/question-bank";
import { generateBulkQuestionsForSubject } from "@/lib/bulk-question-generator";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";

const inFlight = new Map<string, Promise<void>>();

function serializeOptions(item: BankItem): string {
  if (item.ngnPayload) {
    return JSON.stringify({ ...item.ngnPayload, options: item.options });
  }
  return JSON.stringify(item.options);
}

function rowToCreateData(
  fieldId: string,
  subjectId: string,
  item: BankItem,
  source: "seed" | "generated"
) {
  const contentHash = questionContentHash(fieldId, subjectId, item.question);
  return {
    fieldId,
    subjectId,
    stateCode: item.stateCode ?? null,
    difficulty: item.difficulty ?? null,
    topicCategory: item.topicCategory ?? subjectId,
    blueprintDomain: item.blueprintDomain ?? null,
    itemType: item.itemType ?? "mcq",
    stepLevel:
      (item.ngnPayload?.stepLevel as string | undefined) ??
      (item.tags?.includes("step3")
        ? "step3"
        : item.tags?.includes("step2")
          ? "step2"
          : item.tags?.includes("step1")
            ? "step1"
            : null),
    scenario: item.scenario ?? item.vignette ?? null,
    question: item.question,
    options: serializeOptions(item),
    correctAnswer: item.correctAnswer,
    explanation: item.explanation,
    solutionSteps: item.solutionSteps ? JSON.stringify(item.solutionSteps) : null,
    tags: item.tags ? JSON.stringify(item.tags) : null,
    references: item.references ?? undefined,
    source,
    contentHash,
    active: true,
  };
}

/** Upsert static repo seeds for one field (safe on serverless — small row count). */
export async function ensureStaticSeedsForField(fieldId: string): Promise<void> {
  const existing = inFlight.get(fieldId);
  if (existing) return existing;

  const work = (async () => {
    const rows = collectSeedQuestionRows().filter((r) => r.fieldId === fieldId);
    if (rows.length === 0) return;

    // Always upsert high-yield exam prep seeds on deploy.
    const alwaysUpsert =
      fieldId === "mpje" ||
      fieldId === "nursing" ||
      fieldId === "pharmacy" ||
      fieldId === "usmle-step-1" ||
      fieldId === "usmle-step-2" ||
      fieldId === "usmle-step-3";
    if (!alwaysUpsert) {
      const count = await prisma.questionBankItem.count({
        where: { fieldId, active: true },
      });
      if (count > 0) return;
    }

    for (const row of rows) {
      const data = rowToCreateData(row.fieldId, row.subjectId, row.item, "seed");
      await prisma.questionBankItem.upsert({
        where: { contentHash: data.contentHash },
        create: data,
        update: data,
      });
    }
  })().finally(() => {
    inFlight.delete(fieldId);
  });

  inFlight.set(fieldId, work);
  return work;
}

/**
 * When a subject bank is empty, seed static items then generate a starter batch
 * so practice sessions work before the full cron sync (~2k/subject).
 */
export async function ensureSubjectHasQuestions(
  fieldId: string,
  subjectId: string,
  minimum = 25
): Promise<void> {
  const key = `${fieldId}:${subjectId}`;
  const existing = inFlight.get(key);
  if (existing) return existing;

  const work = (async () => {
    await ensureStaticSeedsForField(fieldId);

    const count = await prisma.questionBankItem.count({
      where: { fieldId, subjectId, active: true },
    });
    if (count >= minimum) return;

    const subject = getSubjectsForFieldId(fieldId).find((s) => s.id === subjectId);
    if (!subject) return;

    const need = Math.max(minimum - count, 10);
    const generated = generateBulkQuestionsForSubject(fieldId, subject, count, need);
    const batch = generated.map((item) => rowToCreateData(fieldId, subjectId, item, "generated"));

    const hashes = batch.map((b) => b.contentHash);
    const seen = new Set(
      (
        await prisma.questionBankItem.findMany({
          where: { contentHash: { in: hashes } },
          select: { contentHash: true },
        })
      ).map((r) => r.contentHash)
    );

    const fresh = batch.filter((b) => !seen.has(b.contentHash));
    if (fresh.length > 0) {
      await prisma.questionBankItem.createMany({ data: fresh, skipDuplicates: true });
    }
  })().finally(() => {
    inFlight.delete(key);
  });

  inFlight.set(key, work);
  return work;
}
