import { prisma } from "@/lib/prisma";
import { isTourSchemaGap } from "@/lib/onboarding/tour-record";
import {
  mergeDailyHabitDay,
  mergeStoredTodaySet,
  utcDateKey,
  type StoredTodaySet,
} from "@/lib/learning/today-set";
import type { ExamSlug } from "@/types/edtech";

export async function recordDailyHabitDay(
  userId: string,
  patch: {
    examSlug: ExamSlug | string;
    date?: string;
    completedSet?: boolean;
    targetMet?: boolean;
  }
): Promise<{ ok: boolean; persisted: boolean }> {
  const date = patch.date && /^\d{4}-\d{2}-\d{2}$/.test(patch.date) ? patch.date : utcDateKey(new Date());
  try {
    const row = await prisma.userPreference.findUnique({
      where: { userId },
      select: { metadata: true },
    });
    const next = mergeDailyHabitDay(row?.metadata, {
      examSlug: patch.examSlug,
      date,
      completedSet: patch.completedSet,
      targetMet: patch.targetMet,
    });
    await prisma.userPreference.upsert({
      where: { userId },
      create: {
        userId,
        metadata: JSON.stringify(next),
        updatedAt: new Date(),
      },
      update: {
        metadata: JSON.stringify(next),
      },
    });
    return { ok: true, persisted: true };
  } catch (error) {
    if (!isTourSchemaGap(error)) {
      console.warn(
        "[daily-habit] status write failed:",
        error instanceof Error ? error.message : error
      );
    }
    return { ok: false, persisted: false };
  }
}

export async function readTodaySetMetadata(userId: string): Promise<unknown> {
  try {
    const row = await prisma.userPreference.findUnique({
      where: { userId },
      select: { metadata: true },
    });
    return row?.metadata ?? null;
  } catch (error) {
    if (!isTourSchemaGap(error)) {
      console.warn(
        "[today-set] metadata read failed:",
        error instanceof Error ? error.message : error
      );
    }
    return null;
  }
}

/** Remember today's ids so a refresh does not reshuffle and tomorrow can skip them. */
export async function persistTodaySetSnapshot(
  userId: string,
  fieldId: string,
  snapshot: StoredTodaySet
): Promise<void> {
  try {
    const metadata = await readTodaySetMetadata(userId);
    const next = mergeStoredTodaySet(metadata, fieldId, snapshot);
    await prisma.userPreference.upsert({
      where: { userId },
      create: {
        userId,
        metadata: JSON.stringify(next),
        updatedAt: new Date(),
      },
      update: {
        metadata: JSON.stringify(next),
      },
    });
  } catch (error) {
    if (!isTourSchemaGap(error)) {
      console.warn(
        "[today-set] snapshot write failed:",
        error instanceof Error ? error.message : error
      );
    }
  }
}
