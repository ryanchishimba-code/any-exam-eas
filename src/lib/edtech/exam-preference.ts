import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { ensureBoardExam } from "@/lib/edtech/board-exam-sync";
import { EXAM_CATALOG, isExamSlug } from "@/lib/edtech/exams";
import { invalidateExamPreferenceCache } from "@/lib/cache";
import type { ExamSlug, UserExamPreference } from "@/types/edtech";

async function readUserExamPreference(userId: string): Promise<UserExamPreference | null> {
  try {
    const row = await prisma.userExamPreference.findUnique({ where: { userId } });
    if (!row) return null;

    let examSlug = row.examSlug;
    if (examSlug === "mpje" || !isExamSlug(examSlug)) {
      examSlug = "pance";
      await setUserExamPreference(userId, "pance");
    }

    return {
      userId: row.userId,
      examSlug: examSlug as ExamSlug,
      lastStudiedAt: row.lastStudiedAt,
    };
  } catch {
    return null;
  }
}

/** Per-request dedupe — always read fresh from DB (exam choice must not sit in TTL cache). */
export const getUserExamPreference = cache(async (userId: string): Promise<UserExamPreference | null> => {
  return readUserExamPreference(userId);
});

export async function setUserExamPreference(userId: string, examSlug: ExamSlug): Promise<void> {
  await ensureBoardExam(examSlug);

  const now = new Date();
  await prisma.userExamPreference.upsert({
    where: { userId },
    create: { userId, examSlug, lastStudiedAt: now, updatedAt: now },
    update: { examSlug, lastStudiedAt: now, updatedAt: now },
  });
  invalidateExamPreferenceCache(userId);
}

export async function touchExamStudied(userId: string): Promise<void> {
  const now = new Date();
  await prisma.userExamPreference.updateMany({
    where: { userId },
    data: { lastStudiedAt: now, updatedAt: now },
  });
  invalidateExamPreferenceCache(userId);
}

export function resolveExamFieldId(examSlug: ExamSlug): string {
  return EXAM_CATALOG[examSlug].fieldId;
}
