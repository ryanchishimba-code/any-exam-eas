import { prisma } from "@/lib/prisma";
import { setUserEdtechMetadata } from "@/lib/edtech/user-metadata";
import {
  mergeTrialStartHereRecord,
  readTrialStartHereRecord,
  TRIAL_START_HERE_ID,
  type TrialStartHereRecord,
  type TrialStartHereStatus,
} from "@/lib/trial/trial-start-here";
import type { ExamSlug } from "@/types/edtech";

export async function markTrialStartHereStatus(
  userId: string,
  examSlug: ExamSlug,
  status: TrialStartHereStatus,
  step = 0
): Promise<{ ok: boolean }> {
  try {
    const row = await prisma.userPreference.findUnique({
      where: { userId },
      select: { metadata: true },
    });
    const existing = readTrialStartHereRecord(
      row?.metadata ? JSON.parse(row.metadata) : {},
      examSlug
    );
    const patch: TrialStartHereRecord = {
      status,
      step,
      at: existing?.at ?? new Date().toISOString(),
      examSlug,
    };
    const merged = mergeTrialStartHereRecord(
      row?.metadata ? JSON.parse(row.metadata) : {},
      patch
    );
    await setUserEdtechMetadata(userId, merged);
    return { ok: true };
  } catch (error) {
    console.warn(
      "[trialStartHere] persist failed:",
      error instanceof Error ? error.message : error
    );
    return { ok: false };
  }
}

export async function readTrialStartHereForUser(
  userId: string,
  examSlug: ExamSlug
): Promise<TrialStartHereRecord | null> {
  try {
    const row = await prisma.userPreference.findUnique({
      where: { userId },
      select: { metadata: true },
    });
    if (!row?.metadata) return null;
    return readTrialStartHereRecord(JSON.parse(row.metadata), examSlug);
  } catch {
    return null;
  }
}

export { TRIAL_START_HERE_ID };
