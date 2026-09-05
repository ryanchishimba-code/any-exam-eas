import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { ensureBoardExam } from "@/lib/edtech/board-exam-sync";
import { EXAM_CATALOG, isExamSlug } from "@/lib/edtech/exams";
import {
  CACHE_TTL,
  CACHE_STALE,
  cacheGetOrSetDeduped,
  cacheKey,
  cacheWriteThrough,
  invalidateExamPreferenceCacheAsync,
  invalidateLearningDashboardCache,
} from "@/lib/cache";
import type { ExamSlug, UserExamPreference } from "@/types/edtech";

function examPreferenceCacheKey(userId: string): string {
  return cacheKey(["exam-preference", userId]);
}

async function readUserExamPreferenceFromDb(userId: string): Promise<UserExamPreference | null> {
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
}

async function readUserExamPreference(userId: string): Promise<UserExamPreference | null> {
  return cacheGetOrSetDeduped(
    examPreferenceCacheKey(userId),
    CACHE_TTL.examPreference,
    () => readUserExamPreferenceFromDb(userId),
    { staleTtlMs: CACHE_STALE.examPreference }
  );
}

/** Per-request dedupe on top of short TTL cache. */
export const getUserExamPreference = cache(async (userId: string): Promise<UserExamPreference | null> => {
  return readUserExamPreference(userId);
});

/**
 * Authoritative preference for access/enforcement paths.
 * Bypasses L1/Redis so multi-instance switches cannot 403 on a stale isolate.
 */
export async function getUserExamPreferenceFresh(
  userId: string
): Promise<UserExamPreference | null> {
  return readUserExamPreferenceFromDb(userId);
}

export async function setUserExamPreference(userId: string, examSlug: ExamSlug): Promise<void> {
  await ensureBoardExam(examSlug);

  const now = new Date();
  await prisma.userExamPreference.upsert({
    where: { userId },
    create: { userId, examSlug, lastStudiedAt: now, updatedAt: now },
    update: { examSlug, lastStudiedAt: now, updatedAt: now },
  });

  const next: UserExamPreference = {
    userId,
    examSlug,
    lastStudiedAt: now,
  };

  // Overwrite L1 + Redis with the new exam immediately. Other serverless instances
  // still hold a short L1 TTL (CACHE_TTL.examPreference); once it expires they read
  // this Redis value instead of the previous exam.
  await cacheWriteThrough(examPreferenceCacheKey(userId), next, CACHE_TTL.examPreference, {
    staleTtlMs: CACHE_STALE.examPreference,
  });
  invalidateLearningDashboardCache(userId);
}

export async function touchExamStudied(userId: string): Promise<void> {
  const now = new Date();
  await prisma.userExamPreference.updateMany({
    where: { userId },
    data: { lastStudiedAt: now, updatedAt: now },
  });
  await invalidateExamPreferenceCacheAsync(userId);
}

export function resolveExamFieldId(examSlug: ExamSlug): string {
  return EXAM_CATALOG[examSlug].fieldId;
}
