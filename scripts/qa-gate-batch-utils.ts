import type { PrismaClient } from "@prisma/client";

/** Two updateMany calls per batch — much faster than per-row transactions. */
export async function applyQaPassedBatch(
  prisma: PrismaClient,
  updates: Array<{ id: string; qaPassed: boolean }>,
  dryRun: boolean
): Promise<void> {
  if (dryRun || updates.length === 0) return;

  const now = new Date();
  const passIds = updates.filter((u) => u.qaPassed).map((u) => u.id);
  const failIds = updates.filter((u) => !u.qaPassed).map((u) => u.id);

  const ops = [];
  if (passIds.length > 0) {
    ops.push(
      prisma.questionBankItem.updateMany({
        where: { id: { in: passIds } },
        data: { qaPassed: true, qaAuditedAt: now },
      })
    );
  }
  if (failIds.length > 0) {
    ops.push(
      prisma.questionBankItem.updateMany({
        where: { id: { in: failIds } },
        data: { qaPassed: false, qaAuditedAt: now },
      })
    );
  }
  if (ops.length > 0) await prisma.$transaction(ops);
}
