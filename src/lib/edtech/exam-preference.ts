import { prisma } from "@/lib/prisma";
import { EXAM_CATALOG, isExamSlug } from "@/lib/edtech/exams";
import type { ExamSlug, UserExamPreference } from "@/types/edtech";

export async function getUserExamPreference(userId: string): Promise<UserExamPreference | null> {
  try {
    const row = await prisma.userExamPreference.findUnique({ where: { userId } });
    if (!row || !isExamSlug(row.examSlug)) return null;

    return {
      userId: row.userId,
      examSlug: row.examSlug,
      lastStudiedAt: row.lastStudiedAt,
    };
  } catch {
    return null;
  }
}

export async function setUserExamPreference(userId: string, examSlug: ExamSlug): Promise<void> {
  const now = new Date();
  await prisma.userExamPreference.upsert({
    where: { userId },
    create: { userId, examSlug, lastStudiedAt: now, updatedAt: now },
    update: { examSlug, lastStudiedAt: now, updatedAt: now },
  });
}

export async function touchExamStudied(userId: string): Promise<void> {
  const now = new Date();
  await prisma.userExamPreference.updateMany({
    where: { userId },
    data: { lastStudiedAt: now, updatedAt: now },
  });
}

export function resolveExamFieldId(examSlug: ExamSlug): string {
  return EXAM_CATALOG[examSlug].fieldId;
}
