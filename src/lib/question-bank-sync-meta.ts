import { prisma } from "@/lib/prisma";

/** Latest bank sync row. Split from the generator so practice start does not load it. */
export async function getLastQuestionBankSync() {
  return prisma.questionBankSync.findFirst({
    orderBy: { finishedAt: "desc" },
  });
}

/**
 * Serve-ready count for a (field, subject). Mirrors the serve filter
 * (`active && qaPassed`, plus USMLE Step 2/3 separation).
 */
export async function getSubjectQuestionCount(fieldId: string, subjectId: string) {
  return prisma.questionBankItem.count({
    where: {
      fieldId,
      subjectId,
      active: true,
      qaPassed: true,
      ...(fieldId === "usmle-step-2"
        ? { OR: [{ stepLevel: null }, { stepLevel: { not: "step3" } }] }
        : {}),
    },
  });
}
